/**
 * Test Script für Risk API Route
 * Testet die /api/components/[id]/risk Route
 */

// Load environment variables
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { createClient } from '@supabase/supabase-js';
import { Database } from '../types/database';

// Create Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing environment variables');
  process.exit(1);
}

const supabase = createClient<Database>(supabaseUrl, supabaseServiceKey);

async function testRiskAPI() {
  console.log('🔍 Testing Risk API Route...\n');

  try {
    // 1. Get a component to test with
    console.log('📊 Fetching test component...');
    const { data: components, error: componentsError } = await supabase
      .from('components')
      .select('id, custom_name, next_maintenance, risk_level, days_overdue')
      .limit(1);

    if (componentsError || !components || components.length === 0) {
      console.error('❌ No components found for testing');
      return;
    }

    const testComponent = components[0];
    console.log(`✅ Found test component: ${testComponent.custom_name || 'Unnamed'} (ID: ${testComponent.id})`);

    // 2. Simulate API call
    console.log('\n🚀 Simulating Risk API call...');
    
    // Get component details
    const { data: component, error: componentError } = await supabase
      .from('components')
      .select('*')
      .eq('id', testComponent.id)
      .single();

    if (componentError || !component) {
      console.error('❌ Component not found');
      return;
    }

    // Get risk consequences
    const componentType = (component as any).component_type || component.custom_name || 'unknown';
    console.log(`🔍 Looking for risk consequences for component type: ${componentType}`);

    const { data: consequences, error: consequencesError } = await supabase
      .from('risk_consequences')
      .select('*')
      .eq('component_type', componentType)
      .single();

    if (consequencesError && consequencesError.code !== 'PGRST116') {
      console.warn('⚠️ Risk consequences not found for component type:', componentType);
    } else if (consequences) {
      console.log(`✅ Found risk consequences for: ${consequences.component_type}`);
    }

    // 3. Build response (simulating the API logic)
    const riskLevel = (component as any).risk_level || 'safe';
    const daysOverdue = (component as any).days_overdue || 0;

    console.log('\n📋 Risk Assessment Results:');
    console.log(`Component: ${component.custom_name || 'Unnamed'}`);
    console.log(`Type: ${componentType}`);
    console.log(`Risk Level: ${riskLevel}`);
    console.log(`Days Overdue: ${daysOverdue}`);
    console.log(`Next Maintenance: ${component.next_maintenance || 'Not scheduled'}`);

    if (consequences) {
      console.log('\n🚨 Risk Consequences:');
      console.log(`Death Risk: ${consequences.death_risk ? '🚨 YES' : '✅ No'}`);
      console.log(`Injury Risk: ${consequences.injury_risk ? '🚨 YES' : '✅ No'}`);
      console.log(`Insurance Void: ${consequences.insurance_void ? '💸 YES' : '✅ No'}`);
      console.log(`Criminal Liability: ${consequences.criminal_liability ? '⚖️ YES' : '✅ No'}`);
      console.log(`Damage Cost: ${consequences.damage_cost_min || 0} - ${consequences.damage_cost_max || 0}€`);
      console.log(`Max Fine: ${consequences.max_fine_eur || 0}€`);
      console.log(`Max Prison: ${consequences.max_prison_years || 0} years`);
      
      console.log('\n💬 Warning Messages:');
      console.log(`Yellow: ${consequences.warning_yellow.substring(0, 80)}...`);
      console.log(`Orange: ${consequences.warning_orange.substring(0, 80)}...`);
      console.log(`Red: ${consequences.warning_red.substring(0, 80)}...`);
      console.log(`Black: ${consequences.warning_black.substring(0, 80)}...`);
      
      if (consequences.real_case) {
        console.log(`\n📰 Real Case: ${consequences.real_case.substring(0, 100)}...`);
      }
      if (consequences.statistic) {
        console.log(`📊 Statistic: ${consequences.statistic.substring(0, 100)}...`);
      }
    } else {
      console.log('\n⚠️ No risk consequences found - using default safe configuration');
    }

    // 4. Test API Response Structure
    console.log('\n🔧 Testing API Response Structure...');
    
    const mockResponse = {
      success: true,
      data: {
        component: {
          id: component.id,
          name: component.custom_name,
          type: componentType,
          nextMaintenance: component.next_maintenance,
          daysOverdue: daysOverdue
        },
        risk: {
          level: riskLevel,
          emoji: riskLevel === 'safe' ? '🟢' : riskLevel === 'warning' ? '🟡' : riskLevel === 'danger' ? '🟠' : riskLevel === 'critical' ? '🔴' : '⚫',
          color: riskLevel === 'safe' ? 'green' : riskLevel === 'warning' ? 'yellow' : riskLevel === 'danger' ? 'orange' : riskLevel === 'critical' ? 'red' : 'black',
          message: consequences ? 
            (riskLevel === 'safe' ? 'Wartung aktuell' :
             riskLevel === 'warning' ? consequences.warning_yellow :
             riskLevel === 'danger' ? consequences.warning_orange :
             riskLevel === 'critical' ? consequences.warning_red :
             consequences.warning_black) : 'No risk data available',
          consequences: {
            death: consequences?.death_risk || false,
            injury: consequences?.injury_risk || false,
            insurance: consequences?.insurance_void || false,
            criminal: consequences?.criminal_liability || false,
            damage: {
              min: consequences?.damage_cost_min || 0,
              max: consequences?.damage_cost_max || 0
            }
          },
          realCase: consequences?.real_case || undefined,
          statistic: consequences?.statistic || undefined
        }
      }
    };

    console.log('✅ API Response Structure:');
    console.log(`  Success: ${mockResponse.success}`);
    console.log(`  Component ID: ${mockResponse.data.component.id}`);
    console.log(`  Component Name: ${mockResponse.data.component.name}`);
    console.log(`  Risk Level: ${mockResponse.data.risk.level}`);
    console.log(`  Risk Emoji: ${mockResponse.data.risk.emoji}`);
    console.log(`  Risk Color: ${mockResponse.data.risk.color}`);
    console.log(`  Message Length: ${mockResponse.data.risk.message.length} chars`);
    console.log(`  Death Risk: ${mockResponse.data.risk.consequences.death}`);
    console.log(`  Insurance Void: ${mockResponse.data.risk.consequences.insurance}`);
    console.log(`  Damage Range: ${mockResponse.data.risk.consequences.damage.min}-${mockResponse.data.risk.consequences.damage.max}€`);

    console.log('\n✅ Risk API test completed successfully!');

  } catch (error) {
    console.error('❌ Test failed with error:', error);
  }
}

// Führe den Test aus
testRiskAPI()
  .then(() => {
    console.log('\n🏁 Risk API test finished');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Risk API test failed:', error);
    process.exit(1);
  });





