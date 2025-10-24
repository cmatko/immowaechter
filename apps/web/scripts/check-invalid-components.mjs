#!/usr/bin/env node

/**
 * 🔍 COMPONENT DIAGNOSE SCRIPT
 * Prüft Database auf ungültige Component-Einträge
 */

import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

// Load environment variables
config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkInvalidComponents() {
  console.log('🔍 Checking for invalid components...\n');

  try {
    const { data: components, error } = await supabase
      .from('components')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ Error:', error);
      return;
    }

    console.log(`📊 Total components: ${components.length}\n`);

    // Check for suspicious patterns
    const issues = [];

    components.forEach(comp => {
      const problems = [];

      // Check 1: Component type contains underscores or numbers (suspicious)
      if (comp.type && (comp.type.includes('_') || comp.type.startsWith('BUILD_') || comp.type.startsWith('test_'))) {
        problems.push(`Suspicious type: "${comp.type}"`);
      }

      // Check 2: Component name is null or empty
      if (!comp.name || comp.name.trim() === '') {
        problems.push('Missing or empty name');
      }

      // Check 3: Type is not in valid list
      const validTypes = [
        'Heizung', 'Gasheizung', 'Elektrik', 'Feuerlöscher', 'Aufzug', 'Dach', 'Fassade',
        'Rauchmelder', 'Blitzschutz', 'Legionellenprüfung', 'Rückstauklappe', 'Wasserleitung',
        'Abwasserleitung', 'Lüftung', 'Klimaanlage', 'Photovoltaik', 'Trinkwasserfilter'
      ];

      if (comp.type && !validTypes.includes(comp.type)) {
        problems.push(`Invalid type: "${comp.type}"`);
      }

      // Check 4: No maintenance dates
      if (!comp.last_maintenance && !comp.next_maintenance) {
        problems.push('No maintenance dates');
      }

      // Check 5: Risk level but no type
      if (comp.risk_level && !comp.type) {
        problems.push('Has risk level but no type');
      }

      if (problems.length > 0) {
        issues.push({
          id: comp.id,
          property_id: comp.property_id,
          type: comp.type,
          name: comp.name,
          risk_level: comp.risk_level,
          days_overdue: comp.days_overdue,
          problems: problems
        });
      }
    });

    if (issues.length === 0) {
      console.log('✅ No issues found!');
    } else {
      console.log(`⚠️ Found ${issues.length} components with issues:\n`);
      
      issues.forEach((issue, index) => {
        console.log(`${index + 1}. Component ID: ${issue.id}`);
        console.log(`   Type: ${issue.type}`);
        console.log(`   Name: ${issue.name}`);
        console.log(`   Risk Level: ${issue.risk_level}`);
        console.log(`   Days Overdue: ${issue.days_overdue}`);
        console.log(`   Property ID: ${issue.property_id}`);
        console.log(`   Problems:`);
        issue.problems.forEach(p => console.log(`     - ${p}`));
        console.log('');
      });

      console.log('\n🔧 RECOMMENDED ACTIONS:');
      console.log('1. Review these entries manually');
      console.log('2. Delete test/invalid entries');
      console.log('3. Fix component types to use valid names');
      console.log('4. Run cleanup script: node scripts/cleanup-invalid-components.mjs');
    }

    // Summary statistics
    const criticalComponents = components.filter(c => c.risk_level === 'critical' || c.risk_level === 'legal');
    const invalidCriticalComponents = issues.filter(i => i.risk_level === 'critical' || i.risk_level === 'legal');
    
    console.log('\n📊 SUMMARY:');
    console.log(`Total Components: ${components.length}`);
    console.log(`Critical Components: ${criticalComponents.length}`);
    console.log(`Invalid Components: ${issues.length}`);
    console.log(`Invalid Critical Components: ${invalidCriticalComponents.length}`);

    return issues;
  } catch (error) {
    console.error('❌ Script Error:', error.message);
    return [];
  }
}

// Run the check
checkInvalidComponents()
  .then((issues) => {
    if (issues.length > 0) {
      console.log(`\n⚠️ Found ${issues.length} invalid components that need attention!`);
      process.exit(1);
    } else {
      console.log('\n✅ All components are valid!');
      process.exit(0);
    }
  })
  .catch((error) => {
    console.error('\n❌ Script failed:', error.message);
    process.exit(1);
  });




