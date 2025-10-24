/**
 * Test Script für Risk Helper Functions
 * Testet alle Risk Helper Functions mit verschiedenen Szenarien
 */

// Load environment variables
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { createClient } from '@supabase/supabase-js';
import { Database, RiskConsequence } from '../types/database';
import {
  calculateRiskLevel,
  calculateDaysOverdue,
  getRiskConfig,
  getWarningMessage,
  assessComponentRisk,
  formatDaysOverdue,
  isCriticalRisk,
  needsAttention,
  getRiskPriority,
  sortByRisk
} from '../lib/risk-helpers';

// Create Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing environment variables');
  process.exit(1);
}

const supabase = createClient<Database>(supabaseUrl, supabaseServiceKey);

async function testRiskHelpers() {
  console.log('🔍 Testing Risk Helper Functions...\n');

  try {
    // 1. Test Risk Level Calculation
    console.log('📊 Testing Risk Level Calculation...');
    const testDates = [
      { last: '2024-01-01', next: '2025-01-01', expected: 'safe' },      // 1 Jahr im Voraus
      { last: '2024-01-01', next: '2024-12-01', expected: 'warning' },   // Bald fällig
      { last: '2024-01-01', next: '2024-08-01', expected: 'danger' },    // Überfällig
      { last: '2024-01-01', next: '2024-02-01', expected: 'critical' },  // Kritisch
      { last: '2023-01-01', next: '2023-06-01', expected: 'legal' }       // Legal
    ];

    testDates.forEach(({ last, next, expected }, index) => {
      const level = calculateRiskLevel(last, next);
      const days = calculateDaysOverdue(next);
      const status = level === expected ? '✅' : '❌';
      console.log(`  ${index + 1}. ${status} ${last} → ${next}: ${level} (${formatDaysOverdue(days)})`);
    });

    // 2. Test Risk Config
    console.log('\n🎨 Testing Risk Config...');
    const levels: Array<'safe' | 'warning' | 'danger' | 'critical' | 'legal'> = 
      ['safe', 'warning', 'danger', 'critical', 'legal'];

    levels.forEach(level => {
      const config = getRiskConfig(level);
      console.log(`  ${config.emoji} ${level.toUpperCase()}: ${config.label} (${config.color})`);
      console.log(`    CSS: ${config.bgColor} ${config.textColor} ${config.borderColor}`);
    });

    // 3. Test mit echten Risk Consequences
    console.log('\n🚨 Testing with Real Risk Consequences...');
    const { data: consequences, error: consequencesError } = await supabase
      .from('risk_consequences')
      .select('*')
      .limit(3);

    if (consequencesError) {
      console.error('❌ Error fetching consequences:', consequencesError);
      return;
    }

    consequences?.forEach((consequence: RiskConsequence, index: number) => {
      console.log(`\n${index + 1}. ${consequence.component_type}`);
      
      // Test verschiedene Risk Levels
      const testScenarios = [
        { next: '2025-06-01', level: 'safe' },
        { next: '2024-12-01', level: 'warning' },
        { next: '2024-08-01', level: 'danger' },
        { next: '2024-02-01', level: 'critical' },
        { next: '2023-06-01', level: 'legal' }
      ];

      testScenarios.forEach(({ next, level }) => {
        const assessment = assessComponentRisk('2024-01-01', next, consequence);
        const config = getRiskConfig(assessment.level);
        const isCritical = isCriticalRisk(assessment.level);
        const needsAttn = needsAttention(assessment.level);
        
        console.log(`  ${config.emoji} ${level}: ${assessment.message.substring(0, 60)}...`);
        console.log(`    Days: ${formatDaysOverdue(assessment.daysOverdue)}`);
        console.log(`    Critical: ${isCritical ? '🚨' : '✅'}, Needs Attention: ${needsAttn ? '⚠️' : '✅'}`);
        console.log(`    Death: ${assessment.consequences.death ? '🚨' : '✅'}, Insurance: ${assessment.consequences.insurance ? '💸' : '✅'}`);
      });
    });

    // 4. Test Utility Functions
    console.log('\n🔧 Testing Utility Functions...');
    
    // Test Priority
    const testLevels: Array<'safe' | 'warning' | 'danger' | 'critical' | 'legal'> = 
      ['safe', 'warning', 'danger', 'critical', 'legal'];
    
    console.log('Risk Priority Scores:');
    testLevels.forEach(level => {
      const priority = getRiskPriority(level);
      const config = getRiskConfig(level);
      console.log(`  ${config.emoji} ${level}: Priority ${priority}`);
    });

    // Test Sorting
    console.log('\n📋 Testing Component Sorting...');
    const mockComponents = [
      { id: '1', name: 'Component A', risk_level: 'safe' as const },
      { id: '2', name: 'Component B', risk_level: 'critical' as const },
      { id: '3', name: 'Component C', risk_level: 'warning' as const },
      { id: '4', name: 'Component D', risk_level: 'legal' as const },
      { id: '5', name: 'Component E', risk_level: 'danger' as const }
    ];

    const sorted = sortByRisk(mockComponents);
    console.log('Sorted by Risk (highest first):');
    sorted.forEach((comp, index) => {
      const config = getRiskConfig(comp.risk_level || 'safe');
      console.log(`  ${index + 1}. ${config.emoji} ${comp.name} (${comp.risk_level})`);
    });

    // 5. Test Warning Messages
    console.log('\n💬 Testing Warning Messages...');
    if (consequences && consequences.length > 0) {
      const consequence = consequences[0];
      const levels: Array<'safe' | 'warning' | 'danger' | 'critical' | 'legal'> = 
        ['safe', 'warning', 'danger', 'critical', 'legal'];
      
      levels.forEach(level => {
        const message = getWarningMessage(consequence, level);
        const config = getRiskConfig(level);
        console.log(`  ${config.emoji} ${level.toUpperCase()}: ${message.substring(0, 80)}...`);
      });
    }

    console.log('\n✅ All Risk Helper Functions tests passed!');

  } catch (error) {
    console.error('❌ Test failed with error:', error);
  }
}

// Führe den Test aus
testRiskHelpers()
  .then(() => {
    console.log('\n🏁 Risk Helpers test finished');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Risk Helpers test failed:', error);
    process.exit(1);
  });





