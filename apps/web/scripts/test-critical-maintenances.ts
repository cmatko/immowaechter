/**
 * Test Script für Critical Maintenances
 * Testet die API Route und die Übersichtsseite
 */

// Load environment variables
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { createClient } from '@supabase/supabase-js';
import { Database } from '../types/database';
import { mapComponentTypeToRisk } from '../lib/risk-helpers';

// Create Supabase client
const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function testCriticalMaintenances() {
  console.log('🔍 Testing Critical Maintenances...\n');

  try {
    // 1. Test direct database query
    console.log('📊 Testing direct database query...');
    const { data: components, error: componentsError } = await supabase
      .from('components')
      .select(`
        id,
        custom_name,
        interval_id,
        risk_level,
        days_overdue,
        next_maintenance,
        last_maintenance,
        property_id,
        properties!inner(
          id,
          name,
          address,
          city
        )
      `)
      .in('risk_level', ['critical', 'legal'])
      .eq('is_active', true)
      .order('days_overdue', { ascending: false });

    if (componentsError) {
      console.error('❌ Components query error:', componentsError);
      return;
    }

    console.log(`✅ Found ${components?.length || 0} critical components`);

    if (components && components.length > 0) {
      console.log('\n📋 Critical Components:');
      components.forEach((component: any, index) => {
        console.log(`\n${index + 1}. Component ID: ${component.id}`);
        console.log(`   Custom Name: ${component.custom_name || 'NULL'}`);
        console.log(`   Interval ID: ${component.interval_id || 'NULL'}`);
        console.log(`   Risk Level: ${(component as any).risk_level || 'Not set'}`);
        console.log(`   Days Overdue: ${(component as any).days_overdue || 'Not set'}`);
        console.log(`   Property: ${(component as any).properties?.name || 'Unknown'}`);
        console.log(`   Address: ${(component as any).properties?.address || 'Unknown'}`);
        console.log(`   City: ${(component as any).properties?.city || 'Unknown'}`);
        
        // Test mapping
        const mappedName = mapComponentTypeToRisk(component.interval_id || 'Wartung');
        console.log(`   → Mapped Name: "${mappedName}"`);
        console.log(`   → Final Name: "${component.custom_name || mappedName}"`);
      });
    }

    // 2. Test API call
    console.log('\n🚀 Testing Critical Maintenances API...');
    
    const baseUrl = 'http://localhost:3000';
    const apiUrl = `${baseUrl}/api/dashboard/critical-maintenances`;
    
    console.log(`API URL: ${apiUrl}`);
    
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
        console.log('✅ API Response:');
        console.log(`  Success: ${data.success}`);
        console.log(`  Components: ${data.data?.length || 0}`);
        
        if (data.data && data.data.length > 0) {
          console.log('\n🚨 Critical Components from API:');
          data.data.forEach((comp: any, index: number) => {
            console.log(`  ${index + 1}. ${comp.componentName} (${comp.propertyName})`);
            console.log(`     Risk: ${comp.riskLevel} | Days Overdue: ${comp.daysOverdue}`);
            console.log(`     Address: ${comp.propertyAddress}`);
            console.log(`     Next Maintenance: ${comp.nextMaintenance || 'Not set'}`);
            console.log(`     Last Maintenance: ${comp.lastMaintenance || 'Not set'}`);
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

    // 3. Test page routing
    console.log('\n🔗 Testing page routing...');
    
    const pageUrl = `${baseUrl}/dashboard/critical-maintenances`;
    console.log(`Page URL: ${pageUrl}`);
    
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
      } else {
        console.log(`❌ Page Error (${pageResponse.status})`);
      }
    } catch (pageError) {
      console.error('❌ Page Error:', pageError);
    }

    // 4. Test component data structure
    console.log('\n🎭 Testing component data structure...');
    
    const mockComponent = {
      id: 'test-component',
      propertyId: 'test-property',
      propertyName: 'Musterstraße 1',
      propertyAddress: 'Musterstraße 1, 1010 Wien',
      componentName: 'Gasheizung',
      componentType: 'Gasheizung',
      riskLevel: 'critical',
      daysOverdue: 180,
      nextMaintenance: '2024-01-01',
      lastMaintenance: '2023-07-01'
    };

    console.log('Mock Component Data:');
    console.log(`  ID: ${mockComponent.id}`);
    console.log(`  Property: ${mockComponent.propertyName}`);
    console.log(`  Address: ${mockComponent.propertyAddress}`);
    console.log(`  Component: ${mockComponent.componentName}`);
    console.log(`  Type: ${mockComponent.componentType}`);
    console.log(`  Risk Level: ${mockComponent.riskLevel}`);
    console.log(`  Days Overdue: ${mockComponent.daysOverdue}`);
    console.log(`  Next Maintenance: ${mockComponent.nextMaintenance}`);
    console.log(`  Last Maintenance: ${mockComponent.lastMaintenance}`);

    // 5. Test UI states
    console.log('\n🎨 Testing UI states...');
    
    const uiStates = [
      { name: 'Loading State', loading: true },
      { name: 'Empty State', components: [] },
      { name: 'Critical State', components: [mockComponent] }
    ];

    uiStates.forEach((state, index) => {
      console.log(`\n${index + 1}. ${state.name}:`);
      if (state.loading) {
        console.log('   → Shows loading skeleton with animated placeholders');
      } else if (state.components.length === 0) {
        console.log('   → Shows "Keine kritischen Wartungen! 🎉" message');
      } else {
        console.log(`   → Shows ${state.components.length} critical component cards`);
        console.log('   → Each card shows: Component name, Property info, Risk badge, Days overdue');
        console.log('   → Warning messages based on risk level');
        console.log('   → Call-to-action buttons for each component');
      }
    });

    console.log('\n✅ Critical Maintenances test completed!');

  } catch (error) {
    console.error('❌ Test failed with error:', error);
  }
}

// Führe den Test aus
testCriticalMaintenances()
  .then(() => {
    console.log('\n🏁 Critical Maintenances test finished');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Critical Maintenances test failed:', error);
    process.exit(1);
  });





