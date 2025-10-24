/**
 * Test Script für Risk Summary Link
 * Testet ob der "Alle anzeigen" Link korrekt erscheint
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

async function testRiskSummaryLink() {
  console.log('🔍 Testing Risk Summary Link...\n');

  try {
    // 1. Test Risk Summary API
    console.log('📊 Testing Risk Summary API...');
    
    const baseUrl = 'http://localhost:3000';
    const apiUrl = `${baseUrl}/api/dashboard/risk-summary`;
    
    try {
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log(`Response Status: ${response.status}`);
      
      if (response.ok) {
        const data = await response.json();
        console.log('✅ Risk Summary API Response:');
        console.log(`  Success: ${data.success}`);
        console.log(`  Stats:`, data.data?.stats);
        console.log(`  Critical Components: ${data.data?.criticalComponents?.length || 0}`);
        
        if (data.data?.criticalComponents && data.data.criticalComponents.length > 0) {
          console.log('\n🚨 Critical Components:');
          data.data.criticalComponents.forEach((comp: any, index: number) => {
            console.log(`  ${index + 1}. ${comp.componentName} (${comp.propertyName})`);
            console.log(`     Risk: ${comp.riskLevel} | Days Overdue: ${comp.daysOverdue}`);
          });
          
          // Test link logic
          const criticalCount = data.data.criticalComponents.length;
          console.log(`\n🔗 Link Logic Test:`);
          console.log(`  Critical Components Count: ${criticalCount}`);
          console.log(`  Should show link: ${criticalCount > 0 ? 'YES' : 'NO'}`);
          
          if (criticalCount > 0) {
            const linkText = criticalCount > 3 
              ? `Alle ${criticalCount} kritischen Wartungen anzeigen →`
              : 'Alle kritischen Wartungen anzeigen →';
            console.log(`  Link Text: "${linkText}"`);
          }
        }
      } else {
        const errorText = await response.text();
        console.log(`❌ API Error (${response.status}):`);
        console.log(`  ${errorText}`);
      }
    } catch (fetchError) {
      console.error('❌ Fetch Error:', fetchError);
    }

    // 2. Test Critical Maintenances API
    console.log('\n🚀 Testing Critical Maintenances API...');
    
    const criticalApiUrl = `${baseUrl}/api/dashboard/critical-maintenances`;
    
    try {
      const response = await fetch(criticalApiUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log(`Response Status: ${response.status}`);
      
      if (response.ok) {
        const data = await response.json();
        console.log('✅ Critical Maintenances API Response:');
        console.log(`  Success: ${data.success}`);
        console.log(`  Components: ${data.data?.length || 0}`);
        
        if (data.data && data.data.length > 0) {
          console.log('\n🚨 Critical Components from API:');
          data.data.forEach((comp: any, index: number) => {
            console.log(`  ${index + 1}. ${comp.componentName} (${comp.propertyName})`);
            console.log(`     Risk: ${comp.riskLevel} | Days Overdue: ${comp.daysOverdue}`);
          });
        }
      } else {
        const errorText = await response.text();
        console.log(`❌ API Error (${response.status}):`);
        console.log(`  ${errorText}`);
      }
    } catch (fetchError) {
      console.error('❌ Fetch Error:', fetchError);
    }

    // 3. Test different scenarios
    console.log('\n🧪 Testing different scenarios...');
    
    const scenarios = [
      { criticalCount: 0, expected: 'No link' },
      { criticalCount: 1, expected: 'Link: "Alle kritischen Wartungen anzeigen →"' },
      { criticalCount: 2, expected: 'Link: "Alle kritischen Wartungen anzeigen →"' },
      { criticalCount: 3, expected: 'Link: "Alle kritischen Wartungen anzeigen →"' },
      { criticalCount: 4, expected: 'Link: "Alle 4 kritischen Wartungen anzeigen →"' },
      { criticalCount: 10, expected: 'Link: "Alle 10 kritischen Wartungen anzeigen →"' }
    ];

    console.log('Link Logic Scenarios:');
    scenarios.forEach((scenario, index) => {
      const shouldShowLink = scenario.criticalCount > 0;
      const linkText = shouldShowLink 
        ? (scenario.criticalCount > 3 
            ? `Alle ${scenario.criticalCount} kritischen Wartungen anzeigen →`
            : 'Alle kritischen Wartungen anzeigen →')
        : 'No link';
      
      const status = shouldShowLink ? '✅' : '❌';
      console.log(`  ${status} Scenario ${index + 1}: ${scenario.criticalCount} critical components`);
      console.log(`    Expected: ${scenario.expected}`);
      console.log(`    Result: ${linkText}`);
    });

    // 4. Test page accessibility
    console.log('\n🔗 Testing page accessibility...');
    
    const pageUrl = `${baseUrl}/dashboard/critical-maintenances`;
    
    try {
      const pageResponse = await fetch(pageUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'text/html',
        },
      });

      console.log(`Page Status: ${pageResponse.status}`);
      
      if (pageResponse.ok) {
        console.log('✅ Critical maintenances page accessible');
        console.log(`  URL: ${pageUrl}`);
      } else {
        console.log(`❌ Page Error (${pageResponse.status})`);
      }
    } catch (pageError) {
      console.error('❌ Page Error:', pageError);
    }

    // 5. Test dashboard page
    console.log('\n🏠 Testing dashboard page...');
    
    const dashboardUrl = `${baseUrl}/dashboard`;
    
    try {
      const dashboardResponse = await fetch(dashboardUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'text/html',
        },
      });

      console.log(`Dashboard Status: ${dashboardResponse.status}`);
      
      if (dashboardResponse.ok) {
        console.log('✅ Dashboard page accessible');
        console.log(`  URL: ${dashboardUrl}`);
        console.log('  → RiskSummaryCard should show link if critical components exist');
      } else {
        console.log(`❌ Dashboard Error (${dashboardResponse.status})`);
      }
    } catch (dashboardError) {
      console.error('❌ Dashboard Error:', dashboardError);
    }

    console.log('\n✅ Risk Summary Link test completed!');

  } catch (error) {
    console.error('❌ Test failed with error:', error);
  }
}

// Führe den Test aus
testRiskSummaryLink()
  .then(() => {
    console.log('\n🏁 Risk Summary Link test finished');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Risk Summary Link test failed:', error);
    process.exit(1);
  });





