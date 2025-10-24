/**
 * Test Script für Risk API Route
 * Testet ob die API Route korrekt funktioniert
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

async function testRiskAPIRoute() {
  console.log('🔍 Testing Risk API Route...\n');

  try {
    // 1. Get a component to test with
    console.log('📊 Getting test component...');
    const { data: components, error: componentsError } = await supabase
      .from('components')
      .select('id, custom_name, next_maintenance, risk_level, days_overdue')
      .limit(1);

    if (componentsError) {
      console.error('❌ Error fetching components:', componentsError);
      return;
    }

    if (!components || components.length === 0) {
      console.log('⚠️ No components found for testing');
      return;
    }

    const testComponent = components[0];
    console.log(`✅ Found test component: ${testComponent.custom_name || 'Unnamed'} (ID: ${testComponent.id})`);

    // 2. Test API Route directly
    console.log('\n🚀 Testing API Route...');
    
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    const apiUrl = `${baseUrl}/api/components/${testComponent.id}/risk`;
    
    console.log(`API URL: ${apiUrl}`);
    
    try {
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log(`Response Status: ${response.status}`);
      console.log(`Response Headers:`, Object.fromEntries(response.headers.entries()));

      if (response.ok) {
        const data = await response.json();
        console.log('✅ API Response:');
        console.log(`  Success: ${data.success}`);
        console.log(`  Component: ${data.data?.component?.name || 'Unknown'}`);
        console.log(`  Risk Level: ${data.data?.risk?.level || 'Unknown'}`);
        console.log(`  Risk Emoji: ${data.data?.risk?.emoji || 'Unknown'}`);
        console.log(`  Risk Color: ${data.data?.risk?.color || 'Unknown'}`);
        console.log(`  Message: ${data.data?.risk?.message?.substring(0, 60) || 'Unknown'}...`);
      } else {
        const errorText = await response.text();
        console.log(`❌ API Error (${response.status}):`);
        console.log(`  ${errorText}`);
      }
    } catch (fetchError) {
      console.error('❌ Fetch Error:', fetchError);
      
      // Check if it's a connection error
      if (fetchError instanceof TypeError && fetchError.message.includes('fetch')) {
        console.log('\n🔧 Possible Solutions:');
        console.log('  1. Make sure the dev server is running: npm run dev');
        console.log('  2. Check if the API route file exists: app/api/components/[id]/risk/route.ts');
        console.log('  3. Verify the route structure is correct');
        console.log('  4. Check for TypeScript compilation errors');
      }
    }

    // 3. Test route structure
    console.log('\n📁 Testing Route Structure...');
    
    const fs = require('fs');
    const path = require('path');
    
    const routePath = path.join(process.cwd(), 'app', 'api', 'components', '[id]', 'risk', 'route.ts');
    console.log(`Route Path: ${routePath}`);
    
    if (fs.existsSync(routePath)) {
      console.log('✅ Route file exists');
      
      // Check file content
      const fileContent = fs.readFileSync(routePath, 'utf8');
      if (fileContent.includes('export async function GET')) {
        console.log('✅ GET function found in route file');
      } else {
        console.log('❌ GET function not found in route file');
      }
      
      if (fileContent.includes('NextResponse')) {
        console.log('✅ NextResponse import found');
      } else {
        console.log('❌ NextResponse import not found');
      }
      
      if (fileContent.includes('supabase')) {
        console.log('✅ Supabase import found');
      } else {
        console.log('❌ Supabase import not found');
      }
    } else {
      console.log('❌ Route file does not exist');
    }

    // 4. Test alternative routes
    console.log('\n🔍 Testing Alternative Routes...');
    
    const alternativeRoutes = [
      '/api/components/risk',
      '/api/component/[id]/risk',
      '/api/components/[id]/risk',
      '/api/risk/[id]'
    ];

    for (const route of alternativeRoutes) {
      const testUrl = `${baseUrl}${route}`;
      console.log(`Testing: ${testUrl}`);
      
      try {
        const response = await fetch(testUrl, { method: 'GET' });
        console.log(`  Status: ${response.status}`);
      } catch (error) {
        console.log(`  Error: ${error.message}`);
      }
    }

    // 5. Check Next.js routing
    console.log('\n🔧 Next.js Routing Check...');
    
    const nextConfigPath = path.join(process.cwd(), 'next.config.js');
    if (fs.existsSync(nextConfigPath)) {
      console.log('✅ next.config.js exists');
    } else {
      console.log('⚠️ next.config.js not found');
    }
    
    const packageJsonPath = path.join(process.cwd(), 'package.json');
    if (fs.existsSync(packageJsonPath)) {
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
      console.log(`✅ Next.js version: ${packageJson.dependencies?.next || 'Not found'}`);
    }

    console.log('\n✅ Risk API Route test completed!');

  } catch (error) {
    console.error('❌ Test failed with error:', error);
  }
}

// Führe den Test aus
testRiskAPIRoute()
  .then(() => {
    console.log('\n🏁 Risk API Route test finished');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Risk API Route test failed:', error);
    process.exit(1);
  });





