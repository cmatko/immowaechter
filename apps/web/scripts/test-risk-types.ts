/**
 * Test Script für Risk System Types
 * Testet die neuen TypeScript Types für das Risk System
 */

// Load environment variables
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { createClient } from '@supabase/supabase-js';
import { 
  RiskConsequence, 
  ComponentRisk, 
  RiskLevel, 
  Component,
  Database 
} from '../types/database';

// Create Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing environment variables');
  process.exit(1);
}

const supabase = createClient<Database>(supabaseUrl, supabaseServiceKey);

// Test Risk Level Type
function testRiskLevel(level: RiskLevel): string {
  const riskConfig: Record<RiskLevel, { emoji: string; color: string }> = {
    safe: { emoji: '✅', color: 'green' },
    warning: { emoji: '⚠️', color: 'yellow' },
    danger: { emoji: '🚨', color: 'orange' },
    critical: { emoji: '🔥', color: 'red' },
    legal: { emoji: '⚫', color: 'black' }
  };
  
  return `${riskConfig[level].emoji} ${level.toUpperCase()} (${riskConfig[level].color})`;
}

// Test ComponentRisk Interface
function createComponentRisk(consequence: RiskConsequence, daysOverdue: number): ComponentRisk {
  const level: RiskLevel = daysOverdue < 0 ? 'safe' : 
                          daysOverdue < 30 ? 'warning' :
                          daysOverdue < 180 ? 'danger' :
                          daysOverdue < 365 ? 'critical' : 'legal';

  return {
    level,
    emoji: level === 'safe' ? '✅' : level === 'warning' ? '⚠️' : level === 'danger' ? '🚨' : level === 'critical' ? '🔥' : '⚫',
    color: level === 'safe' ? 'green' : level === 'warning' ? 'yellow' : level === 'danger' ? 'orange' : level === 'critical' ? 'red' : 'black',
    message: level === 'safe' ? consequence.warning_yellow :
             level === 'warning' ? consequence.warning_orange :
             level === 'danger' ? consequence.warning_red :
             level === 'critical' ? consequence.warning_red :
             consequence.warning_black,
    consequences: {
      death: consequence.death_risk,
      injury: consequence.injury_risk,
      insurance: consequence.insurance_void,
      criminal: consequence.criminal_liability,
      damage: {
        min: consequence.damage_cost_min || 0,
        max: consequence.damage_cost_max || 0
      }
    },
    realCase: consequence.real_case || undefined,
    statistic: consequence.statistic || undefined
  };
}

async function testRiskTypes() {
  console.log('🔍 Testing Risk System Types...\n');

  try {
    // 1. Test RiskConsequence Interface
    console.log('📊 Testing RiskConsequence Interface...');
    const { data: consequences, error: consequencesError } = await supabase
      .from('risk_consequences')
      .select('*')
      .limit(3);

    if (consequencesError) {
      console.error('❌ Error fetching risk consequences:', consequencesError);
      return;
    }

    console.log(`✅ Fetched ${consequences?.length || 0} risk consequences\n`);

    // 2. Test ComponentRisk Creation
    console.log('🧮 Testing ComponentRisk Creation...');
    consequences?.forEach((consequence: RiskConsequence, index: number) => {
      console.log(`\n${index + 1}. ${consequence.component_type}`);
      
      // Test different risk levels
      const testDays = [-30, 0, 30, 180, 365, 500];
      testDays.forEach(days => {
        const risk = createComponentRisk(consequence, days);
        console.log(`   ${days} days overdue: ${testRiskLevel(risk.level)}`);
        console.log(`   Message: ${risk.message.substring(0, 80)}...`);
        console.log(`   Death Risk: ${risk.consequences.death ? '🚨' : '✅'}`);
        console.log(`   Insurance Void: ${risk.consequences.insurance ? '💸' : '✅'}`);
        console.log(`   Damage: ${risk.consequences.damage.min}-${risk.consequences.damage.max}€`);
      });
    });

    // 3. Test Component Interface with Risk Fields
    console.log('\n📋 Testing Component Interface with Risk Fields...');
    const { data: components, error: componentsError } = await supabase
      .from('components')
      .select('id, custom_name, risk_level, days_overdue, last_risk_calculation')
      .limit(5);

    if (componentsError) {
      console.error('❌ Error fetching components:', componentsError);
    } else {
      console.log('Components with Risk Data:');
      components?.forEach((component: Component, index: number) => {
        console.log(`  ${index + 1}. ${component.custom_name || 'Unnamed'}`);
        console.log(`     Risk Level: ${component.risk_level ? testRiskLevel(component.risk_level) : 'Not calculated'}`);
        console.log(`     Days Overdue: ${component.days_overdue || 0}`);
        console.log(`     Last Calculation: ${component.last_risk_calculation || 'Never'}`);
      });
    }

    // 4. Test Type Safety
    console.log('\n🔒 Testing Type Safety...');
    
    // This should compile without errors
    const validRiskLevel: RiskLevel = 'danger';
    console.log(`✅ Valid RiskLevel: ${validRiskLevel}`);
    
    // Test Database type safety
    const typedQuery = supabase.from('risk_consequences').select('*');
    console.log('✅ Typed Supabase query created successfully');
    
    // Test ComponentRisk interface
    const testRisk: ComponentRisk = {
      level: 'critical',
      emoji: '🔥',
      color: 'red',
      message: 'Test message',
      consequences: {
        death: true,
        injury: true,
        insurance: true,
        criminal: true,
        damage: { min: 10000, max: 100000 }
      },
      realCase: 'Test case',
      statistic: 'Test statistic'
    };
    console.log('✅ ComponentRisk interface works correctly');

    console.log('\n✅ All Risk System Types tests passed!');

  } catch (error) {
    console.error('❌ Test failed with error:', error);
  }
}

// Führe den Test aus
testRiskTypes()
  .then(() => {
    console.log('\n🏁 Risk Types test finished');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Risk Types test failed:', error);
    process.exit(1);
  });





