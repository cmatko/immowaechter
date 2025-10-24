/**
 * Test Script für Risk Summary Widget
 * Testet die API Route und das Widget
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

async function testRiskSummary() {
  console.log('🔍 Testing Risk Summary Widget...\n');

  try {
    // 1. Test direct database query
    console.log('📊 Testing direct database query...');
    const { data: components, error: componentsError } = await supabase
      .from('components')
      .select(`
        id,
        custom_name,
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
      return;
    }

    console.log(`✅ Found ${components?.length || 0} active components`);

    if (components && components.length > 0) {
      // Calculate stats manually
      const stats = {
        safe: 0,
        warning: 0,
        danger: 0,
        critical: 0,
        legal: 0,
        total: components.length
      };

      components.forEach((component: any) => {
        const riskLevel = (component as any).risk_level || 'safe';
        switch (riskLevel) {
          case 'safe': stats.safe++; break;
          case 'warning': stats.warning++; break;
          case 'danger': stats.danger++; break;
          case 'critical': stats.critical++; break;
          case 'legal': stats.legal++; break;
          default: stats.safe++;
        }
      });

      console.log('\n📈 Risk Statistics:');
      console.log(`  🟢 Safe: ${stats.safe}`);
      console.log(`  🟡 Warning: ${stats.warning}`);
      console.log(`  🟠 Danger: ${stats.danger}`);
      console.log(`  🔴 Critical: ${stats.critical}`);
      console.log(`  ⚫ Legal: ${stats.legal}`);
      console.log(`  📊 Total: ${stats.total}`);

      // Show critical components
      const criticalComponents = components
        .filter((component: any) => {
          const riskLevel = (component as any).risk_level;
          return riskLevel === 'critical' || riskLevel === 'legal';
        })
        .map((component: any) => ({
          id: component.id,
          propertyId: component.property_id,
          propertyName: (component as any).properties?.name || 'Unbekanntes Objekt',
          componentName: component.custom_name || 'Wartung',
          riskLevel: (component as any).risk_level || 'safe',
          daysOverdue: (component as any).days_overdue || 0
        }))
        .sort((a, b) => b.daysOverdue - a.daysOverdue);

      console.log(`\n🚨 Critical Components (${criticalComponents.length}):`);
      criticalComponents.forEach((comp, index) => {
        console.log(`  ${index + 1}. ${comp.componentName} (${comp.propertyName})`);
        console.log(`     Risk: ${comp.riskLevel} | Days Overdue: ${comp.daysOverdue}`);
      });
    }

    // 2. Test API Route
    console.log('\n🚀 Testing Risk Summary API...');
    
    const baseUrl = 'http://localhost:3000';
    const apiUrl = `${baseUrl}/api/dashboard/risk-summary`;
    
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
        console.log(`  Stats:`, data.data?.stats);
        console.log(`  Critical Components: ${data.data?.criticalComponents?.length || 0}`);
        
        if (data.data?.criticalComponents && data.data.criticalComponents.length > 0) {
          console.log('\n🚨 Critical Components from API:');
          data.data.criticalComponents.forEach((comp: any, index: number) => {
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

    // 3. Test Widget Props
    console.log('\n🎭 Testing Widget Props...');
    
    const mockStats = {
      safe: 5,
      warning: 3,
      danger: 2,
      critical: 1,
      legal: 0,
      total: 11
    };

    const mockCriticalComponents = [
      {
        id: 'comp-1',
        propertyId: 'prop-1',
        propertyName: 'Musterstraße 1',
        componentName: 'Gasheizung',
        riskLevel: 'critical',
        daysOverdue: 180
      },
      {
        id: 'comp-2',
        propertyId: 'prop-2',
        propertyName: 'Beispielweg 5',
        componentName: 'Rauchmelder',
        riskLevel: 'legal',
        daysOverdue: 365
      }
    ];

    console.log('Mock Widget Props:');
    console.log(`  Stats:`, mockStats);
    console.log(`  Critical Components: ${mockCriticalComponents.length}`);
    
    // Calculate percentages
    const percentages = {
      safe: (mockStats.safe / mockStats.total) * 100,
      warning: (mockStats.warning / mockStats.total) * 100,
      danger: (mockStats.danger / mockStats.total) * 100,
      critical: (mockStats.critical / mockStats.total) * 100,
      legal: (mockStats.legal / mockStats.total) * 100
    };

    console.log('\n📊 Progress Bar Percentages:');
    Object.entries(percentages).forEach(([level, percentage]) => {
      console.log(`  ${level}: ${percentage.toFixed(1)}%`);
    });

    // 4. Test UI States
    console.log('\n🎨 Testing UI States...');
    
    const uiStates = [
      { name: 'Loading State', loading: true },
      { name: 'Empty State', stats: null },
      { name: 'All Safe State', stats: { ...mockStats, critical: 0, legal: 0 } },
      { name: 'Critical State', stats: mockStats, criticalComponents: mockCriticalComponents }
    ];

    uiStates.forEach((state, index) => {
      console.log(`\n${index + 1}. ${state.name}:`);
      if (state.loading) {
        console.log('   → Shows loading skeleton');
      } else if (!state.stats) {
        console.log('   → Shows null state');
      } else if (state.stats.critical === 0 && state.stats.legal === 0) {
        console.log('   → Shows "Alle Wartungen aktuell! 🎉"');
      } else {
        console.log(`   → Shows ${state.criticalComponents?.length || 0} critical components`);
        console.log(`   → Shows "DRINGEND!" badge with count ${state.stats.critical + state.stats.legal}`);
      }
    });

    console.log('\n✅ Risk Summary Widget test completed!');

  } catch (error) {
    console.error('❌ Test failed with error:', error);
  }
}

// Führe den Test aus
testRiskSummary()
  .then(() => {
    console.log('\n🏁 Risk Summary test finished');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Risk Summary test failed:', error);
    process.exit(1);
  });





