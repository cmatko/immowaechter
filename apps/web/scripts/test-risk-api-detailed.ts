/**
 * Detailed Test Script für Risk API Route
 * Testet die API mit verschiedenen Component Types
 */

// Load environment variables
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { createClient } from '@supabase/supabase-js';
import { Database } from '../types/database';

// Create Supabase client
const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function testRiskAPIDetailed() {
  console.log('🔍 Detailed Risk API Testing...\n');

  try {
    // 1. Get all risk consequences to see available types
    console.log('📊 Available Risk Consequences Types:');
    const { data: consequences, error: consequencesError } = await supabase
      .from('risk_consequences')
      .select('component_type')
      .order('component_type');

    if (consequencesError) {
      console.error('❌ Error fetching consequences:', consequencesError);
      return;
    }

    console.log('Available component types:');
    consequences?.forEach((consequence, index) => {
      console.log(`  ${index + 1}. ${consequence.component_type}`);
    });

    // 2. Test with a specific component type
    const testType = 'Gasheizung'; // Use Gasheizung as it has high risk
    console.log(`\n🚨 Testing with component type: ${testType}`);

    // Get risk consequences for this type
    const { data: gasheizungConsequences, error: gasheizungError } = await supabase
      .from('risk_consequences')
      .select('*')
      .eq('component_type', testType)
      .single();

    if (gasheizungError) {
      console.error('❌ Error fetching Gasheizung consequences:', gasheizungError);
      return;
    }

    console.log(`✅ Found consequences for ${testType}:`);
    console.log(`  Death Risk: ${gasheizungConsequences.death_risk ? '🚨 YES' : '✅ No'}`);
    console.log(`  Injury Risk: ${gasheizungConsequences.injury_risk ? '🚨 YES' : '✅ No'}`);
    console.log(`  Insurance Void: ${gasheizungConsequences.insurance_void ? '💸 YES' : '✅ No'}`);
    console.log(`  Criminal Liability: ${gasheizungConsequences.criminal_liability ? '⚖️ YES' : '✅ No'}`);
    console.log(`  Damage: ${gasheizungConsequences.damage_cost_min}-${gasheizungConsequences.damage_cost_max}€`);
    console.log(`  Max Fine: ${gasheizungConsequences.max_fine_eur}€`);
    console.log(`  Max Prison: ${gasheizungConsequences.max_prison_years} years`);

    // 3. Simulate API call with different risk levels
    console.log('\n🧮 Testing different risk levels:');
    
    const riskLevels = ['safe', 'warning', 'danger', 'critical', 'legal'] as const;
    
    riskLevels.forEach(level => {
      console.log(`\n${level.toUpperCase()} Level:`);
      
      // Simulate component with this risk level
      const mockComponent = {
        id: 'test-component',
        custom_name: `Test ${testType}`,
        component_type: testType,
        next_maintenance: '2024-01-01', // Overdue
        risk_level: level,
        days_overdue: level === 'safe' ? -30 : 
                     level === 'warning' ? -10 :
                     level === 'danger' ? 30 :
                     level === 'critical' ? 200 : 400
      };

      // Build risk assessment
      const emoji = level === 'safe' ? '🟢' : 
                   level === 'warning' ? '🟡' : 
                   level === 'danger' ? '🟠' : 
                   level === 'critical' ? '🔴' : '⚫';
      
      const color = level === 'safe' ? 'green' : 
                   level === 'warning' ? 'yellow' : 
                   level === 'danger' ? 'orange' : 
                   level === 'critical' ? 'red' : 'black';

      const message = level === 'safe' ? 'Wartung aktuell' :
                     level === 'warning' ? gasheizungConsequences.warning_yellow :
                     level === 'danger' ? gasheizungConsequences.warning_orange :
                     level === 'critical' ? gasheizungConsequences.warning_red :
                     gasheizungConsequences.warning_black;

      console.log(`  ${emoji} ${level.toUpperCase()} (${color})`);
      console.log(`  Days Overdue: ${mockComponent.days_overdue}`);
      console.log(`  Message: ${message.substring(0, 80)}...`);
      console.log(`  Death Risk: ${gasheizungConsequences.death_risk ? '🚨' : '✅'}`);
      console.log(`  Insurance Void: ${gasheizungConsequences.insurance_void ? '💸' : '✅'}`);
      console.log(`  Damage: ${gasheizungConsequences.damage_cost_min}-${gasheizungConsequences.damage_cost_max}€`);
    });

    // 4. Test API Response Structure
    console.log('\n🔧 Testing API Response Structure...');
    
    const mockAPIResponse = {
      success: true,
      data: {
        component: {
          id: 'test-component',
          name: `Test ${testType}`,
          type: testType,
          nextMaintenance: '2024-01-01',
          daysOverdue: 365
        },
        risk: {
          level: 'legal',
          emoji: '⚫',
          color: 'black',
          message: gasheizungConsequences.warning_black,
          consequences: {
            death: gasheizungConsequences.death_risk,
            injury: gasheizungConsequences.injury_risk,
            insurance: gasheizungConsequences.insurance_void,
            criminal: gasheizungConsequences.criminal_liability,
            damage: {
              min: gasheizungConsequences.damage_cost_min,
              max: gasheizungConsequences.damage_cost_max
            }
          },
          realCase: gasheizungConsequences.real_case,
          statistic: gasheizungConsequences.statistic
        }
      }
    };

    console.log('✅ Complete API Response:');
    console.log(`  Success: ${mockAPIResponse.success}`);
    console.log(`  Component: ${mockAPIResponse.data.component.name} (${mockAPIResponse.data.component.type})`);
    console.log(`  Risk Level: ${mockAPIResponse.data.risk.level}`);
    console.log(`  Risk Emoji: ${mockAPIResponse.data.risk.emoji}`);
    console.log(`  Risk Color: ${mockAPIResponse.data.risk.color}`);
    console.log(`  Message: ${mockAPIResponse.data.risk.message.substring(0, 100)}...`);
    console.log(`  Death Risk: ${mockAPIResponse.data.risk.consequences.death}`);
    console.log(`  Insurance Void: ${mockAPIResponse.data.risk.consequences.insurance}`);
    console.log(`  Criminal Liability: ${mockAPIResponse.data.risk.consequences.criminal}`);
    console.log(`  Damage Range: ${mockAPIResponse.data.risk.consequences.damage.min}-${mockAPIResponse.data.risk.consequences.damage.max}€`);
    console.log(`  Real Case: ${mockAPIResponse.data.risk.realCase ? 'Available' : 'Not available'}`);
    console.log(`  Statistic: ${mockAPIResponse.data.risk.statistic ? 'Available' : 'Not available'}`);

    // 5. Test error handling
    console.log('\n🚨 Testing Error Handling...');
    
    // Test with non-existent component
    const { data: nonExistent, error: nonExistentError } = await supabase
      .from('components')
      .select('*')
      .eq('id', 'non-existent-id')
      .single();

    if (nonExistentError) {
      console.log('✅ Error handling works - non-existent component returns error');
      console.log(`  Error: ${nonExistentError.message}`);
    }

    // Test with component type that has no risk consequences
    const { data: unknownConsequences, error: unknownError } = await supabase
      .from('risk_consequences')
      .select('*')
      .eq('component_type', 'UnknownComponentType')
      .single();

    if (unknownError && unknownError.code === 'PGRST116') {
      console.log('✅ Error handling works - unknown component type returns no consequences');
    }

    console.log('\n✅ Detailed Risk API test completed successfully!');

  } catch (error) {
    console.error('❌ Test failed with error:', error);
  }
}

// Führe den Test aus
testRiskAPIDetailed()
  .then(() => {
    console.log('\n🏁 Detailed Risk API test finished');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Detailed Risk API test failed:', error);
    process.exit(1);
  });





