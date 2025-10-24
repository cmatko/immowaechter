/**
 * Test Script für Component Names
 * Testet verschiedene Component Name Szenarien
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

async function testComponentNames() {
  console.log('🔍 Testing Component Names...\n');

  try {
    // 1. Test current components
    console.log('📊 Testing current components...');
    const { data: components, error: componentsError } = await supabase
      .from('components')
      .select('id, custom_name, next_maintenance, risk_level, days_overdue')
      .limit(5);

    if (componentsError) {
      console.error('❌ Error fetching components:', componentsError);
      return;
    }

    if (components && components.length > 0) {
      console.log('Current Components:');
      components.forEach((component, index) => {
        console.log(`\n${index + 1}. Component ID: ${component.id}`);
        console.log(`   Custom Name: ${component.custom_name || 'NULL'}`);
        console.log(`   Risk Level: ${(component as any).risk_level || 'Not set'}`);
        console.log(`   Days Overdue: ${(component as any).days_overdue || 'Not set'}`);
        
        // Test name logic
        const componentType = 'Gasheizung'; // Hardcoded for now
        const componentName = component.custom_name || componentType || 'Wartung';
        console.log(`   → Final Name: "${componentName}"`);
        console.log(`   → Modal Title: "Risiko-Analyse: ${componentName}"`);
      });
    }

    // 2. Test API calls for different components
    console.log('\n🚀 Testing API calls...');
    
    const baseUrl = 'http://localhost:3000';
    
    if (components && components.length > 0) {
      for (let i = 0; i < Math.min(3, components.length); i++) {
        const component = components[i];
        const apiUrl = `${baseUrl}/api/components/${component.id}/risk`;
        
        console.log(`\nTesting Component ${i + 1}:`);
        console.log(`  API URL: ${apiUrl}`);
        console.log(`  Custom Name: ${component.custom_name || 'NULL'}`);
        
        try {
          const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          });

          if (response.ok) {
            const data = await response.json();
            console.log(`  ✅ API Response (${response.status}):`);
            console.log(`    Component Name: "${data.data?.component?.name || 'Unknown'}"`);
            console.log(`    Component Type: "${data.data?.component?.type || 'Unknown'}"`);
            console.log(`    Risk Level: ${data.data?.risk?.level || 'Unknown'}`);
            console.log(`    Risk Emoji: ${data.data?.risk?.emoji || 'Unknown'}`);
            console.log(`    Modal Title would be: "Risiko-Analyse: ${data.data?.component?.name || 'Unknown'}"`);
          } else {
            const errorText = await response.text();
            console.log(`  ❌ API Error (${response.status}): ${errorText}`);
          }
        } catch (fetchError) {
          console.error(`  ❌ Fetch Error:`, fetchError);
        }
      }
    }

    // 3. Test different name scenarios
    console.log('\n🧪 Testing different name scenarios...');
    
    const testScenarios = [
      { custom_name: null, expected: 'Gasheizung' },
      { custom_name: '', expected: 'Gasheizung' },
      { custom_name: 'Heizung', expected: 'Heizung' },
      { custom_name: 'Gastherme', expected: 'Gastherme' },
      { custom_name: 'Rauchmelder', expected: 'Rauchmelder' },
      { custom_name: 'Elektrik', expected: 'Elektrik' }
    ];

    console.log('Name Logic Tests:');
    testScenarios.forEach((scenario, index) => {
      const componentType = 'Gasheizung';
      const componentName = scenario.custom_name || componentType || 'Wartung';
      const status = componentName === scenario.expected ? '✅' : '❌';
      
      console.log(`  ${status} Scenario ${index + 1}:`);
      console.log(`    Input: custom_name = ${scenario.custom_name === null ? 'NULL' : `"${scenario.custom_name}"`}`);
      console.log(`    Expected: "${scenario.expected}"`);
      console.log(`    Result: "${componentName}"`);
      console.log(`    Modal Title: "Risiko-Analyse: ${componentName}"`);
    });

    // 4. Test RiskDetailsModal integration
    console.log('\n🎭 Testing RiskDetailsModal integration...');
    
    const mockRiskData = {
      component: {
        id: 'test-component',
        name: 'Gasheizung', // This would come from the API
        type: 'Gasheizung',
        nextMaintenance: '2026-07-20',
        daysOverdue: 0
      },
      risk: {
        level: 'danger',
        emoji: '🟠',
        color: 'orange',
        message: 'Ihre Gasheizung-Wartung ist in 3 Monaten fällig...',
        consequences: {
          death: true,
          injury: true,
          insurance: true,
          criminal: true,
          damage: { min: 50000, max: 500000 }
        },
        realCase: 'München 2023: 4-köpfige Familie überlebte knapp CO-Vergiftung...',
        statistic: '500+ CO-Vergiftungen/Jahr in DE/AT, 30+ Todesfälle'
      }
    };

    console.log('Mock RiskDetailsModal Props:');
    console.log(`  isOpen: true`);
    console.log(`  componentName: "${mockRiskData.component.name}"`);
    console.log(`  Modal Title: "Risiko-Analyse: ${mockRiskData.component.name}"`);
    console.log(`  Risk Level: ${mockRiskData.risk.level}`);
    console.log(`  Risk Emoji: ${mockRiskData.risk.emoji}`);
    console.log(`  Risk Color: ${mockRiskData.risk.color}`);

    console.log('\n✅ Component Names test completed!');

  } catch (error) {
    console.error('❌ Test failed with error:', error);
  }
}

// Führe den Test aus
testComponentNames()
  .then(() => {
    console.log('\n🏁 Component Names test finished');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Component Names test failed:', error);
    process.exit(1);
  });





