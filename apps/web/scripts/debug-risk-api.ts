/**
 * Debug Script für Risk API
 * Debuggt warum die API 404 zurückgibt
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

async function debugRiskAPI() {
  console.log('🔍 Debugging Risk API...\n');

  try {
    // 1. Test Supabase connection
    console.log('📊 Testing Supabase connection...');
    const { data: testData, error: testError } = await supabase
      .from('components')
      .select('id, custom_name')
      .limit(1);
    
    if (testError) {
      console.error('❌ Supabase connection error:', testError);
      return;
    }
    
    console.log('✅ Supabase connection works');
    console.log(`Found ${testData?.length || 0} components`);

    // 2. Get specific component
    if (testData && testData.length > 0) {
      const component = testData[0];
      console.log(`\n🔍 Testing with component: ${component.custom_name} (ID: ${component.id})`);
      
      // Test direct Supabase query
      const { data: directComponent, error: directError } = await supabase
        .from('components')
        .select('*')
        .eq('id', component.id)
        .single();
      
      if (directError) {
        console.error('❌ Direct query error:', directError);
      } else {
        console.log('✅ Direct query works');
        console.log(`Component: ${directComponent.custom_name}`);
        console.log(`Risk Level: ${(directComponent as any).risk_level || 'Not set'}`);
        console.log(`Days Overdue: ${(directComponent as any).days_overdue || 'Not set'}`);
      }
    }

    // 3. Test API call with curl equivalent
    console.log('\n🚀 Testing API call...');
    
    const baseUrl = 'http://localhost:3000';
    const componentId = testData?.[0]?.id;
    
    if (componentId) {
      const apiUrl = `${baseUrl}/api/components/${componentId}/risk`;
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
          console.log(JSON.stringify(data, null, 2));
        } else {
          const errorText = await response.text();
          console.log(`❌ API Error (${response.status}):`);
          console.log(errorText);
        }
      } catch (fetchError) {
        console.error('❌ Fetch Error:', fetchError);
      }
    }

    // 4. Test simple API route
    console.log('\n🧪 Testing simple API route...');
    
    try {
      const testResponse = await fetch(`${baseUrl}/api/test`);
      if (testResponse.ok) {
        const testData = await testResponse.json();
        console.log('✅ Simple API works:', testData);
      } else {
        console.log('❌ Simple API failed:', testResponse.status);
      }
    } catch (error) {
      console.error('❌ Simple API error:', error);
    }

    // 5. Check if dev server is running
    console.log('\n🔧 Checking dev server...');
    
    try {
      const healthResponse = await fetch(`${baseUrl}/`);
      console.log(`Home page status: ${healthResponse.status}`);
    } catch (error) {
      console.error('❌ Dev server not running or not accessible');
      console.log('💡 Start dev server with: npm run dev');
    }

    console.log('\n✅ Debug completed!');

  } catch (error) {
    console.error('❌ Debug failed with error:', error);
  }
}

// Führe den Debug aus
debugRiskAPI()
  .then(() => {
    console.log('\n🏁 Debug finished');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Debug failed:', error);
    process.exit(1);
  });





