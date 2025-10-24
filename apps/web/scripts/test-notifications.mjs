import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs/promises';
import dotenv from 'dotenv';

// Load .env.local file
dotenv.config({ path: '.env.local' });

const execAsync = promisify(exec);

async function testNotificationSystem() {
  console.log('🧪 Testing ImmoWächter Notifications System...\n');

  // Test 1: Check Dependencies
  console.log('1️⃣ Checking dependencies...');
  try {
    await import('web-push');
    console.log('   ✅ web-push installed');
  } catch {
    console.log('   ❌ web-push missing - run: npm install web-push');
    process.exit(1);
  }

  try {
    await import('resend');
    console.log('   ✅ resend installed');
  } catch {
    console.log('   ❌ resend missing - run: npm install resend');
    process.exit(1);
  }

  // Test 2: Check Environment Variables
  console.log('\n2️⃣ Checking environment variables...');
  const requiredEnvVars = [
    'NEXT_PUBLIC_VAPID_PUBLIC_KEY',
    'VAPID_PRIVATE_KEY',
    'RESEND_API_KEY',
    'NEXT_PUBLIC_SUPABASE_URL',
    'SUPABASE_SERVICE_ROLE_KEY'
  ];

  let envMissing = false;
  for (const varName of requiredEnvVars) {
    if (process.env[varName]) {
      console.log(`   ✅ ${varName}`);
    } else {
      console.log(`   ❌ ${varName} missing`);
      envMissing = true;
    }
  }

  if (envMissing) {
    console.log('\n   Run: npm run setup:vapid');
    process.exit(1);
  }

  // Test 3: Check Files Exist
  console.log('\n3️⃣ Checking required files...');
  const requiredFiles = [
    'public/sw.js',
    'hooks/usePushNotifications.ts',
    'components/settings/NotificationSettings.tsx',
    'lib/email-templates.ts',
    'app/api/notifications/subscribe/route.ts',
    'app/api/notifications/send/route.ts',
    'app/api/cron/check-maintenances/route.ts'
  ];

  for (const file of requiredFiles) {
    try {
      await fs.access(file);
      console.log(`   ✅ ${file}`);
    } catch {
      console.log(`   ❌ ${file} missing`);
    }
  }

  // Test 4: Test VAPID Keys Format
  console.log('\n4️⃣ Testing VAPID keys format...');
  const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
  const privateKey = process.env.VAPID_PRIVATE_KEY;

  if (publicKey && publicKey.length > 80) {
    console.log('   ✅ Public key format looks good');
  } else {
    console.log('   ❌ Public key format invalid');
  }

  if (privateKey && privateKey.length > 40) {
    console.log('   ✅ Private key format looks good');
  } else {
    console.log('   ❌ Private key format invalid');
  }

  // Test 5: Test Email Template Generation
  console.log('\n5️⃣ Testing email templates...');
  try {
    const { emailTemplates } = await import('./lib/email-templates.js');
    
    const criticalEmail = emailTemplates.criticalMaintenance({
      userName: 'Test User',
      componentName: 'Gasheizung',
      propertyName: 'Testhaus',
      daysOverdue: 90,
      riskLevel: 'critical',
      detailsUrl: 'http://localhost:3000'
    });

    if (criticalEmail.subject && criticalEmail.html) {
      console.log('   ✅ Critical email template works');
    } else {
      console.log('   ❌ Critical email template broken');
    }

    const summaryEmail = emailTemplates.weeklySummary({
      userName: 'Test User',
      criticalCount: 2,
      dangerCount: 3,
      warningCount: 1,
      dashboardUrl: 'http://localhost:3000'
    });

    if (summaryEmail.subject && summaryEmail.html) {
      console.log('   ✅ Weekly summary template works');
    } else {
      console.log('   ❌ Weekly summary template broken');
    }
  } catch (error) {
    console.log('   ❌ Email templates error:', error.message);
  }

  // Test 6: Database Connection Test
  console.log('\n6️⃣ Testing database connection...');
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
      console.log('   ⚠️  push_subscriptions table might not exist yet');
      console.log('   Run migration: supabase db push');
    } else {
      console.log('   ✅ Database connection works');
      console.log('   ✅ push_subscriptions table exists');
    }
  } catch (error) {
    console.log('   ❌ Database error:', error.message);
  }

  // Summary
  console.log('\n' + '='.repeat(50));
  console.log('✅ TESTING COMPLETE!\n');
  console.log('Next Steps:');
  console.log('1. Run: npm run dev');
  console.log('2. Open: http://localhost:3000');
  console.log('3. Go to Settings → Notifications');
  console.log('4. Click "Push-Benachrichtigungen aktivieren"');
  console.log('5. Check browser console for logs');
}

testNotificationSystem().catch(console.error);

