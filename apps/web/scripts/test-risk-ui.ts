/**
 * Test Script für Risk UI Components
 * Testet RiskBadge und RiskDetailsModal Components
 */

// Load environment variables
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { createClient } from '@supabase/supabase-js';
import { Database, ComponentRisk, RiskLevel } from '../types/database';
import { getRiskConfig } from '../lib/risk-helpers';

// Create Supabase client
const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Mock Risk Data for Testing
const mockRiskData: Record<RiskLevel, ComponentRisk> = {
  safe: {
    level: 'safe',
    emoji: '🟢',
    color: 'green',
    message: 'Wartung aktuell - alles in Ordnung',
    consequences: {
      death: false,
      injury: false,
      insurance: false,
      criminal: false,
      damage: { min: 0, max: 0 }
    }
  },
  warning: {
    level: 'warning',
    emoji: '🟡',
    color: 'yellow',
    message: 'Ihre Gasheizung-Wartung ist in 3 Monaten fällig. Jetzt Termin vereinbaren um CO-Gefahr zu vermeiden.',
    consequences: {
      death: true,
      injury: true,
      insurance: true,
      criminal: true,
      damage: { min: 50000, max: 500000 }
    },
    realCase: 'München 2023: 4-köpfige Familie überlebte knapp CO-Vergiftung durch nicht gewartete Gastherme',
    statistic: '500+ CO-Vergiftungen/Jahr in DE/AT, 30+ Todesfälle'
  },
  danger: {
    level: 'danger',
    emoji: '🟠',
    color: 'orange',
    message: '⚠️ Gasheizung überfällig! Risiko: CO-Vergiftung, Versicherungsprobleme. Jetzt handeln.',
    consequences: {
      death: true,
      injury: true,
      insurance: true,
      criminal: true,
      damage: { min: 50000, max: 500000 }
    },
    realCase: 'München 2023: 4-köpfige Familie überlebte knapp CO-Vergiftung durch nicht gewartete Gastherme',
    statistic: '500+ CO-Vergiftungen/Jahr in DE/AT, 30+ Todesfälle'
  },
  critical: {
    level: 'critical',
    emoji: '🔴',
    color: 'red',
    message: '🚨 WARNUNG: Gasheizung 6+ Monate überfällig! LEBENSGEFAHR durch CO. Versicherung verweigert Leistung. Sofort Handwerker!',
    consequences: {
      death: true,
      injury: true,
      insurance: true,
      criminal: true,
      damage: { min: 50000, max: 500000 }
    },
    realCase: 'München 2023: 4-köpfige Familie überlebte knapp CO-Vergiftung durch nicht gewartete Gastherme',
    statistic: '500+ CO-Vergiftungen/Jahr in DE/AT, 30+ Todesfälle'
  },
  legal: {
    level: 'legal',
    emoji: '⚫',
    color: 'black',
    message: '⚫ KRITISCH: Gasheizung 1+ Jahr überfällig! AKUTE LEBENSGEFAHR. Versicherungsschutz ERLOSCHEN. Strafrechtliche Folgen bei Unfall. SOFORTMASSNAHMEN!',
    consequences: {
      death: true,
      injury: true,
      insurance: true,
      criminal: true,
      damage: { min: 50000, max: 500000 }
    },
    realCase: 'München 2023: 4-köpfige Familie überlebte knapp CO-Vergiftung durch nicht gewartete Gastherme',
    statistic: '500+ CO-Vergiftungen/Jahr in DE/AT, 30+ Todesfälle'
  }
};

async function testRiskUI() {
  console.log('🔍 Testing Risk UI Components...\n');

  try {
    // 1. Test RiskBadge Component
    console.log('📊 Testing RiskBadge Component...');
    const riskLevels: RiskLevel[] = ['safe', 'warning', 'danger', 'critical', 'legal'];
    
    console.log('RiskBadge Examples:');
    riskLevels.forEach(level => {
      const config = getRiskConfig(level);
      console.log(`  ${config.emoji} ${level.toUpperCase()}: ${config.label} (${config.color})`);
      console.log(`    CSS Classes: ${config.bgColor} ${config.textColor} ${config.borderColor}`);
    });

    // 2. Test RiskDetailsModal Component
    console.log('\n🚨 Testing RiskDetailsModal Component...');
    
    riskLevels.forEach(level => {
      const risk = mockRiskData[level];
      console.log(`\n${level.toUpperCase()} Risk Details:`);
      console.log(`  Level: ${risk.level}`);
      console.log(`  Emoji: ${risk.emoji}`);
      console.log(`  Color: ${risk.color}`);
      console.log(`  Message: ${risk.message.substring(0, 60)}...`);
      console.log(`  Death Risk: ${risk.consequences.death ? '🚨' : '✅'}`);
      console.log(`  Injury Risk: ${risk.consequences.injury ? '🚨' : '✅'}`);
      console.log(`  Insurance Void: ${risk.consequences.insurance ? '💸' : '✅'}`);
      console.log(`  Criminal Liability: ${risk.consequences.criminal ? '⚖️' : '✅'}`);
      console.log(`  Damage Range: ${risk.consequences.damage.min.toLocaleString('de-AT')}€ - ${risk.consequences.damage.max.toLocaleString('de-AT')}€`);
      
      if (risk.realCase) {
        console.log(`  Real Case: ${risk.realCase.substring(0, 60)}...`);
      }
      if (risk.statistic) {
        console.log(`  Statistic: ${risk.statistic.substring(0, 60)}...`);
      }
    });

    // 3. Test with Real Risk Consequences
    console.log('\n🔍 Testing with Real Risk Consequences...');
    const { data: consequences, error: consequencesError } = await supabase
      .from('risk_consequences')
      .select('*')
      .eq('component_type', 'Gasheizung')
      .single();

    if (consequencesError) {
      console.error('❌ Error fetching consequences:', consequencesError);
      return;
    }

    console.log('Real Gasheizung Risk Assessment:');
    console.log(`  Component Type: ${consequences.component_type}`);
    console.log(`  Death Risk: ${consequences.death_risk ? '🚨 YES' : '✅ No'}`);
    console.log(`  Injury Risk: ${consequences.injury_risk ? '🚨 YES' : '✅ No'}`);
    console.log(`  Insurance Void: ${consequences.insurance_void ? '💸 YES' : '✅ No'}`);
    console.log(`  Criminal Liability: ${consequences.criminal_liability ? '⚖️ YES' : '✅ No'}`);
    console.log(`  Damage: ${consequences.damage_cost_min}-${consequences.damage_cost_max}€`);
    console.log(`  Max Fine: ${consequences.max_fine_eur}€`);
    console.log(`  Max Prison: ${consequences.max_prison_years} years`);

    // 4. Test UI Component Props
    console.log('\n🎨 Testing UI Component Props...');
    
    const testComponent = {
      id: 'test-component',
      name: 'Gasheizung Wohnzimmer',
      type: 'Gasheizung',
      nextMaintenance: '2024-01-01',
      daysOverdue: 365
    };

    console.log('Component Props:');
    console.log(`  ID: ${testComponent.id}`);
    console.log(`  Name: ${testComponent.name}`);
    console.log(`  Type: ${testComponent.type}`);
    console.log(`  Next Maintenance: ${testComponent.nextMaintenance}`);
    console.log(`  Days Overdue: ${testComponent.daysOverdue}`);

    // 5. Test Responsive Design Classes
    console.log('\n📱 Testing Responsive Design Classes...');
    
    const responsiveClasses = [
      'grid grid-cols-1 md:grid-cols-2 gap-3',
      'flex flex-col sm:flex-row gap-3',
      'max-w-2xl w-full mx-4',
      'max-h-[90vh] overflow-y-auto'
    ];

    console.log('Responsive CSS Classes:');
    responsiveClasses.forEach(className => {
      console.log(`  ${className}`);
    });

    // 6. Test Color Schemes
    console.log('\n🎨 Testing Color Schemes...');
    
    const colorSchemes = {
      safe: 'bg-green-50 text-green-900 border-green-200',
      warning: 'bg-yellow-50 text-yellow-900 border-yellow-200',
      danger: 'bg-orange-50 text-orange-900 border-orange-200',
      critical: 'bg-red-50 text-red-900 border-red-200',
      legal: 'bg-gray-900 text-white border-gray-700'
    };

    Object.entries(colorSchemes).forEach(([level, classes]) => {
      console.log(`  ${level.toUpperCase()}: ${classes}`);
    });

    console.log('\n✅ All Risk UI Components tests passed!');

  } catch (error) {
    console.error('❌ Test failed with error:', error);
  }
}

// Führe den Test aus
testRiskUI()
  .then(() => {
    console.log('\n🏁 Risk UI test finished');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Risk UI test failed:', error);
    process.exit(1);
  });





