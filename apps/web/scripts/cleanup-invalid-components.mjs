#!/usr/bin/env node

/**
 * 🧹 COMPONENT CLEANUP SCRIPT
 * Entfernt ungültige Component-Einträge aus der Database
 */

import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

// Load environment variables
config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function cleanupInvalidComponents() {
  console.log('🧹 Starting cleanup of invalid components...\n');

  try {
    const { data: components, error } = await supabase
      .from('components')
      .select('*');

    if (error) {
      console.error('❌ Error:', error);
      return;
    }

    const toDelete = [];
    const toLog = [];

    components.forEach(comp => {
      // Check for components with missing type or name
      if (!comp.type || !comp.name || comp.type === 'undefined' || comp.name === 'undefined') {
        toDelete.push(comp.id);
        toLog.push({
          id: comp.id,
          type: comp.type,
          name: comp.name,
          risk_level: comp.risk_level,
          days_overdue: comp.days_overdue,
          property_id: comp.property_id
        });
      }
    });

    if (toDelete.length === 0) {
      console.log('✅ No invalid components found!');
      return;
    }

    console.log(`⚠️ Found ${toDelete.length} invalid components:\n`);
    toLog.forEach((comp, i) => {
      console.log(`${i + 1}. ID: ${comp.id}`);
      console.log(`   Type: ${comp.type}`);
      console.log(`   Name: ${comp.name}`);
      console.log(`   Risk Level: ${comp.risk_level}`);
      console.log(`   Days Overdue: ${comp.days_overdue}`);
      console.log(`   Property ID: ${comp.property_id}`);
      console.log('');
    });

    console.log('⚠️ WARNING: This will DELETE these components!');
    console.log('Press CTRL+C to cancel or wait 5 seconds...\n');

    await new Promise(resolve => setTimeout(resolve, 5000));

    console.log('🗑️ Deleting invalid components...');

    const { error: deleteError } = await supabase
      .from('components')
      .delete()
      .in('id', toDelete);

    if (deleteError) {
      console.error('❌ Delete error:', deleteError);
      return;
    }

    console.log(`✅ Successfully deleted ${toDelete.length} invalid components!`);
    
    // Verify cleanup
    const { data: remainingComponents, error: verifyError } = await supabase
      .from('components')
      .select('*');

    if (verifyError) {
      console.error('❌ Verify error:', verifyError);
      return;
    }

    console.log(`\n📊 CLEANUP SUMMARY:`);
    console.log(`Components before cleanup: ${components.length}`);
    console.log(`Components deleted: ${toDelete.length}`);
    console.log(`Components remaining: ${remainingComponents.length}`);

    // Check if any invalid components remain
    const remainingInvalid = remainingComponents.filter(comp => 
      !comp.type || !comp.name || comp.type === 'undefined' || comp.name === 'undefined'
    );

    if (remainingInvalid.length > 0) {
      console.log(`⚠️ ${remainingInvalid.length} invalid components still remain`);
    } else {
      console.log('✅ All invalid components have been removed!');
    }

  } catch (error) {
    console.error('❌ Script Error:', error.message);
  }
}

// Run the cleanup
cleanupInvalidComponents()
  .then(() => {
    console.log('\n🎉 Cleanup completed!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Cleanup failed:', error.message);
    process.exit(1);
  });




