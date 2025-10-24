/**
 * Check Components Script
 * Prüft alle Components in der Datenbank
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

async function checkComponents() {
  console.log('🔍 Checking Components in Database...\n');

  try {
    // 1. Get all components
    console.log('📊 Getting all components...');
    const { data: allComponents, error: allError } = await supabase
      .from('components')
      .select('*');
    
    if (allError) {
      console.error('❌ Error fetching all components:', allError);
      return;
    }
    
    console.log(`✅ Found ${allComponents?.length || 0} components total`);
    
    if (allComponents && allComponents.length > 0) {
      console.log('\n📋 All Components:');
      allComponents.forEach((component, index) => {
        console.log(`${index + 1}. ID: ${component.id}`);
        console.log(`   Name: ${component.custom_name || 'Unnamed'}`);
        console.log(`   Property ID: ${component.property_id}`);
        console.log(`   Active: ${component.is_active}`);
        console.log(`   Risk Level: ${(component as any).risk_level || 'Not set'}`);
        console.log(`   Days Overdue: ${(component as any).days_overdue || 'Not set'}`);
        console.log('');
      });
    }

    // 2. Test specific component ID
    const testId = 'f20db2ab-67be-41a7-a867-989c1af4c702';
    console.log(`\n🔍 Testing specific component ID: ${testId}`);
    
    const { data: specificComponent, error: specificError } = await supabase
      .from('components')
      .select('*')
      .eq('id', testId);
    
    if (specificError) {
      console.error('❌ Error fetching specific component:', specificError);
    } else {
      console.log(`✅ Specific component query result: ${specificComponent?.length || 0} components`);
      if (specificComponent && specificComponent.length > 0) {
        console.log('Component found:', specificComponent[0]);
      } else {
        console.log('❌ Component not found with that ID');
      }
    }

    // 3. Test with first available component
    if (allComponents && allComponents.length > 0) {
      const firstComponent = allComponents[0];
      console.log(`\n🧪 Testing with first component: ${firstComponent.id}`);
      
      const { data: firstTest, error: firstError } = await supabase
        .from('components')
        .select('*')
        .eq('id', firstComponent.id);
      
      if (firstError) {
        console.error('❌ Error fetching first component:', firstError);
      } else {
        console.log(`✅ First component query result: ${firstTest?.length || 0} components`);
        if (firstTest && firstTest.length > 0) {
          console.log('First component found:', firstTest[0]);
        }
      }
    }

    // 4. Check RLS policies
    console.log('\n🔒 Checking RLS policies...');
    
    // Try with different auth contexts
    const { data: { session } } = await supabase.auth.getSession();
    console.log(`Current session: ${session ? 'Authenticated' : 'Not authenticated'}`);
    
    if (session) {
      console.log(`User ID: ${session.user.id}`);
    }

    console.log('\n✅ Component check completed!');

  } catch (error) {
    console.error('❌ Check failed with error:', error);
  }
}

// Führe den Check aus
checkComponents()
  .then(() => {
    console.log('\n🏁 Component check finished');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Component check failed:', error);
    process.exit(1);
  });





