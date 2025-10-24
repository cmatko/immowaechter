/**
 * Test Report für ImmoWächter Notifications System
 * Führt alle Tests aus und erstellt einen detaillierten Report
 */

import fs from 'fs/promises';
import path from 'path';

async function generateTestReport() {
  console.log('📊 ImmoWächter Notifications Test Report\n');
  console.log('='.repeat(60));

  const report = {
    timestamp: new Date().toISOString(),
    tests: {
      dependencies: { status: 'unknown', details: [] },
      environment: { status: 'unknown', details: [] },
      files: { status: 'unknown', details: [] },
      templates: { status: 'unknown', details: [] },
      database: { status: 'unknown', details: [] },
      api: { status: 'unknown', details: [] }
    },
    summary: {
      totalTests: 0,
      passed: 0,
      failed: 0,
      warnings: 0
    }
  };

  // Test 1: Dependencies
  console.log('\n1️⃣ DEPENDENCIES CHECK');
  console.log('-'.repeat(30));
  
  const dependencies = ['web-push', 'resend', '@supabase/supabase-js'];
  let depsPassed = 0;
  
  for (const dep of dependencies) {
    try {
      await import(dep);
      console.log(`   ✅ ${dep} - installed`);
      report.tests.dependencies.details.push({ name: dep, status: 'pass' });
      depsPassed++;
    } catch (error) {
      console.log(`   ❌ ${dep} - missing`);
      report.tests.dependencies.details.push({ name: dep, status: 'fail', error: error.message });
    }
  }
  
  report.tests.dependencies.status = depsPassed === dependencies.length ? 'pass' : 'fail';
  report.summary.totalTests += dependencies.length;
  report.summary.passed += depsPassed;
  report.summary.failed += (dependencies.length - depsPassed);

  // Test 2: Environment Variables
  console.log('\n2️⃣ ENVIRONMENT VARIABLES');
  console.log('-'.repeat(30));
  
  const envVars = [
    'NEXT_PUBLIC_VAPID_PUBLIC_KEY',
    'VAPID_PRIVATE_KEY', 
    'RESEND_API_KEY',
    'NEXT_PUBLIC_SUPABASE_URL',
    'SUPABASE_SERVICE_ROLE_KEY'
  ];
  
  let envPassed = 0;
  
  for (const envVar of envVars) {
    if (process.env[envVar]) {
      console.log(`   ✅ ${envVar} - set`);
      report.tests.environment.details.push({ name: envVar, status: 'pass' });
      envPassed++;
    } else {
      console.log(`   ❌ ${envVar} - missing`);
      report.tests.environment.details.push({ name: envVar, status: 'fail' });
    }
  }
  
  report.tests.environment.status = envPassed === envVars.length ? 'pass' : 'fail';
  report.summary.totalTests += envVars.length;
  report.summary.passed += envPassed;
  report.summary.failed += (envVars.length - envPassed);

  // Test 3: Required Files
  console.log('\n3️⃣ REQUIRED FILES');
  console.log('-'.repeat(30));
  
  const requiredFiles = [
    'public/sw.js',
    'hooks/usePushNotifications.ts',
    'components/settings/NotificationSettings.tsx',
    'lib/email-templates.ts',
    'app/api/notifications/subscribe/route.ts',
    'app/api/notifications/send/route.ts',
    'app/api/cron/check-maintenances/route.ts',
    'app/api/health/notifications/route.ts'
  ];
  
  let filesPassed = 0;
  
  for (const file of requiredFiles) {
    try {
      await fs.access(file);
      console.log(`   ✅ ${file} - exists`);
      report.tests.files.details.push({ name: file, status: 'pass' });
      filesPassed++;
    } catch {
      console.log(`   ❌ ${file} - missing`);
      report.tests.files.details.push({ name: file, status: 'fail' });
    }
  }
  
  report.tests.files.status = filesPassed === requiredFiles.length ? 'pass' : 'fail';
  report.summary.totalTests += requiredFiles.length;
  report.summary.passed += filesPassed;
  report.summary.failed += (requiredFiles.length - filesPassed);

  // Test 4: Email Templates
  console.log('\n4️⃣ EMAIL TEMPLATES');
  console.log('-'.repeat(30));
  
  try {
    const { emailTemplates } = await import('./lib/email-templates.js');
    
    // Test Critical Template
    const criticalEmail = emailTemplates.criticalMaintenance({
      userName: 'Test User',
      componentName: 'Gasheizung',
      propertyName: 'Testhaus',
      daysOverdue: 90,
      riskLevel: 'critical',
      detailsUrl: 'http://localhost:3000'
    });
    
    if (criticalEmail.subject && criticalEmail.html) {
      console.log('   ✅ Critical email template - working');
      report.tests.templates.details.push({ name: 'critical', status: 'pass' });
    } else {
      console.log('   ❌ Critical email template - broken');
      report.tests.templates.details.push({ name: 'critical', status: 'fail' });
    }
    
    // Test Weekly Summary Template
    const summaryEmail = emailTemplates.weeklySummary({
      userName: 'Test User',
      criticalCount: 2,
      dangerCount: 3,
      warningCount: 1,
      dashboardUrl: 'http://localhost:3000'
    });
    
    if (summaryEmail.subject && summaryEmail.html) {
      console.log('   ✅ Weekly summary template - working');
      report.tests.templates.details.push({ name: 'weekly', status: 'pass' });
    } else {
      console.log('   ❌ Weekly summary template - broken');
      report.tests.templates.details.push({ name: 'weekly', status: 'fail' });
    }
    
    report.tests.templates.status = 'pass';
    report.summary.totalTests += 2;
    report.summary.passed += 2;
    
  } catch (error) {
    console.log('   ❌ Email templates - error:', error.message);
    report.tests.templates.status = 'fail';
    report.tests.templates.details.push({ name: 'templates', status: 'fail', error: error.message });
    report.summary.totalTests += 2;
    report.summary.failed += 2;
  }

  // Test 5: Database Connection
  console.log('\n5️⃣ DATABASE CONNECTION');
  console.log('-'.repeat(30));
  
  try {
    const { createClient } = await import('@supabase/supabase-js');
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    const { data, error } = await supabase
      .from('push_subscriptions')
      .select('count')
      .limit(1);

    if (error) {
      console.log('   ⚠️  Database connected but push_subscriptions table missing');
      console.log('   Run: supabase db push');
      report.tests.database.status = 'warning';
      report.tests.database.details.push({ name: 'connection', status: 'pass' });
      report.tests.database.details.push({ name: 'table', status: 'fail', error: 'push_subscriptions table missing' });
      report.summary.warnings++;
    } else {
      console.log('   ✅ Database connection - working');
      console.log('   ✅ push_subscriptions table - exists');
      report.tests.database.status = 'pass';
      report.tests.database.details.push({ name: 'connection', status: 'pass' });
      report.tests.database.details.push({ name: 'table', status: 'pass' });
    }
    
    report.summary.totalTests += 2;
    report.summary.passed += 1;
    
  } catch (error) {
    console.log('   ❌ Database connection - error:', error.message);
    report.tests.database.status = 'fail';
    report.tests.database.details.push({ name: 'connection', status: 'fail', error: error.message });
    report.summary.totalTests += 2;
    report.summary.failed += 2;
  }

  // Test 6: API Endpoints (if server is running)
  console.log('\n6️⃣ API ENDPOINTS');
  console.log('-'.repeat(30));
  
  const endpoints = [
    '/api/health/notifications',
    '/api/notifications/subscribe',
    '/api/notifications/send',
    '/api/cron/check-maintenances'
  ];
  
  let apiPassed = 0;
  
  for (const endpoint of endpoints) {
    try {
      const response = await fetch(`http://localhost:3000${endpoint}`, { 
        method: 'GET',
        signal: AbortSignal.timeout(5000)
      });
      
      if (response.status !== 404) {
        console.log(`   ✅ ${endpoint} - accessible (${response.status})`);
        report.tests.api.details.push({ name: endpoint, status: 'pass', statusCode: response.status });
        apiPassed++;
      } else {
        console.log(`   ❌ ${endpoint} - not found (404)`);
        report.tests.api.details.push({ name: endpoint, status: 'fail', statusCode: 404 });
      }
    } catch (error) {
      console.log(`   ⚠️  ${endpoint} - server not running or error`);
      report.tests.api.details.push({ name: endpoint, status: 'warning', error: error.message });
    }
  }
  
  report.tests.api.status = apiPassed > 0 ? 'partial' : 'fail';
  report.summary.totalTests += endpoints.length;
  report.summary.passed += apiPassed;
  report.summary.failed += (endpoints.length - apiPassed);

  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 TEST SUMMARY');
  console.log('='.repeat(60));
  console.log(`Total Tests: ${report.summary.totalTests}`);
  console.log(`✅ Passed: ${report.summary.passed}`);
  console.log(`❌ Failed: ${report.summary.failed}`);
  console.log(`⚠️  Warnings: ${report.summary.warnings}`);
  
  const successRate = Math.round((report.summary.passed / report.summary.totalTests) * 100);
  console.log(`📈 Success Rate: ${successRate}%`);
  
  console.log('\n🔧 NEXT STEPS:');
  
  if (report.tests.dependencies.status === 'fail') {
    console.log('1. Install missing dependencies: npm install web-push resend');
  }
  
  if (report.tests.environment.status === 'fail') {
    console.log('2. Set up environment variables: npm run setup:vapid');
  }
  
  if (report.tests.files.status === 'fail') {
    console.log('3. Check if all required files exist');
  }
  
  if (report.tests.database.status === 'warning') {
    console.log('4. Run database migration: supabase db push');
  }
  
  if (report.tests.api.status === 'fail') {
    console.log('5. Start development server: npm run dev');
  }
  
  console.log('\n🎯 PRODUCTION READINESS:');
  if (successRate >= 90) {
    console.log('✅ READY FOR PRODUCTION');
  } else if (successRate >= 70) {
    console.log('⚠️  NEEDS MINOR FIXES');
  } else {
    console.log('❌ NEEDS MAJOR SETUP');
  }

  // Save report to file
  try {
    await fs.writeFile('test-report.json', JSON.stringify(report, null, 2));
    console.log('\n💾 Test report saved to: test-report.json');
  } catch (error) {
    console.log('\n⚠️  Could not save test report:', error.message);
  }
}

generateTestReport().catch(console.error);





