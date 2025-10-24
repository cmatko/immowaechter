/**
 * Debug Script für Risk Summary API
 * Debuggt den 500 Error
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

async function debugRiskSummaryAPI() {
  console.log('🔍 Debugging Risk Summary API...\n');

  try {
    // 1. Test the exact query from the API
    console.log('📊 Testing exact API query...');
    const { data: components, error: componentsError } = await supabase
      .from('components')
      .select(`
        id,
        custom_name,
        interval_id,
        risk_level,
        days_overdue,
        property_id,
        properties!inner(
          id,
          name,
          user_id
        )
      `)
      .eq('is_active', true);

    if (componentsError) {
      console.error('❌ Components query error:', componentsError);
      console.error('Error details:', JSON.stringify(componentsError, null, 2));
      return;
    }

    console.log(`✅ Found ${components?.length || 0} components`);
    
    if (components && components.length > 0) {
      console.log('\n📋 Component details:');
      components.forEach((component: any, index) => {
        console.log(`\n${index + 1}. Component ID: ${component.id}`);
        console.log(`   Custom Name: ${component.custom_name || 'NULL'}`);
        console.log(`   Interval ID: ${component.interval_id || 'NULL'}`);
        console.log(`   Risk Level: ${(component as any).risk_level || 'Not set'}`);
        console.log(`   Days Overdue: ${(component as any).days_overdue || 'Not set'}`);
        console.log(`   Property: ${(component as any).properties?.name || 'Unknown'}`);
        
        // Test mapping
        const mappedName = mapComponentTypeToRisk(component.interval_id || 'Wartung');
        console.log(`   → Mapped Name: "${mappedName}"`);
        console.log(`   → Final Name: "${component.custom_name || mappedName}"`);
      });
    }

    // 2. Test the mapping function
    console.log('\n🧪 Testing mapping function...');
    
    const testMappings = [
      { input: null, expected: 'Wartung' },
      { input: undefined, expected: 'Wartung' },
      { input: '', expected: 'Wartung' },
      { input: 'HEAT_GAS_001', expected: 'Gasheizung' },
      { input: 'SMOKE_001', expected: 'Rauchmelder' },
      { input: 'ELECTRIC_001', expected: 'Elektrik' }
    ];

    testMappings.forEach(({ input, expected }) => {
      const result = mapComponentTypeToRisk(input || 'Wartung');
      const status = result === expected ? '✅' : '❌';
      console.log(`  ${status} Input: ${input === null ? 'null' : `"${input}"`} → "${result}" (expected: "${expected}")`);
    });

    // 3. Test critical components filtering
    console.log('\n🚨 Testing critical components filtering...');
    
    if (components && components.length > 0) {
      const criticalComponents = components
        .filter((component: any) => {
          const riskLevel = (component as any).risk_level;
          return riskLevel === 'critical' || riskLevel === 'legal';
        })
        .map((component: any) => ({
          id: component.id,
          propertyId: component.property_id,
          propertyName: (component as any).properties?.name || 'Unbekanntes Objekt',
          componentName: component.custom_name || mapComponentTypeToRisk(component.interval_id || 'Wartung'),
          riskLevel: (component as any).risk_level || 'safe',
          daysOverdue: (component as any).days_overdue || 0
        }))
        .sort((a, b) => b.daysOverdue - a.daysOverdue);

      console.log(`Found ${criticalComponents.length} critical components:`);
      criticalComponents.forEach((comp, index) => {
        console.log(`  ${index + 1}. ${comp.componentName} (${comp.propertyName})`);
        console.log(`     Risk: ${comp.riskLevel} | Days Overdue: ${comp.daysOverdue}`);
      });
    }

    // 4. Test API call with error details
    console.log('\n🚀 Testing API call with detailed error...');
    
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
      console.log(`Response Headers:`, Object.fromEntries(response.headers.entries()));
      
      const responseText = await response.text();
      console.log(`Response Body: ${responseText}`);
      
      if (response.ok) {
        const data = JSON.parse(responseText);
        console.log('✅ API Response:');
        console.log(JSON.stringify(data, null, 2));
      } else {
        console.log(`❌ API Error (${response.status}):`);
        console.log(responseText);
      }
    } catch (fetchError) {
      console.error('❌ Fetch Error:', fetchError);
    }

    console.log('\n✅ Debug completed!');

  } catch (error) {
    console.error('❌ Debug failed with error:', error);
  }
}

// Führe den Debug aus
debugRiskSummaryAPI()
  .then(() => {
    console.log('\n🏁 Debug finished');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Debug failed:', error);
    process.exit(1);
  });
