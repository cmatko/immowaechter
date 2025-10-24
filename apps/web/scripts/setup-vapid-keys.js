/**
 * Setup Script: VAPID Keys für Push Notifications
 * Generiert VAPID Keys und zeigt Setup-Anweisungen
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔑 Setting up VAPID Keys for Push Notifications...\n');

try {
  // Generate VAPID keys
  console.log('1. Generating VAPID keys...');
  const output = execSync('npx web-push generate-vapid-keys', { encoding: 'utf8' });
  
  // Parse the output
  const lines = output.trim().split('\n');
  const publicKeyLine = lines.find(line => line.startsWith('Public Key:'));
  const privateKeyLine = lines.find(line => line.startsWith('Private Key:'));
  
  const publicKey = publicKeyLine ? publicKeyLine.replace('Public Key: ', '').trim() : null;
  const privateKey = privateKeyLine ? privateKeyLine.replace('Private Key: ', '').trim() : null;
  
  if (!publicKey || !privateKey) {
    throw new Error('Failed to parse VAPID keys from output');
  }
  
  console.log('✅ VAPID Keys generated successfully!');
  console.log(`   Public Key: ${publicKey}`);
  console.log(`   Private Key: ${privateKey.substring(0, 10)}...`);
  
  // Create .env.local if it doesn't exist
  const envPath = path.join(process.cwd(), '.env.local');
  let envContent = '';
  
  if (fs.existsSync(envPath)) {
    envContent = fs.readFileSync(envPath, 'utf8');
  } else {
    // Create from example
    const examplePath = path.join(process.cwd(), 'env.example');
    if (fs.existsSync(examplePath)) {
      envContent = fs.readFileSync(examplePath, 'utf8');
    }
  }
  
  // Update or add VAPID keys
  const updatedContent = envContent
    .replace(/NEXT_PUBLIC_VAPID_PUBLIC_KEY=.*/, `NEXT_PUBLIC_VAPID_PUBLIC_KEY="${publicKey}"`)
    .replace(/VAPID_PRIVATE_KEY=.*/, `VAPID_PRIVATE_KEY="${privateKey}"`)
    .replace(/CRON_SECRET=.*/, `CRON_SECRET="${generateRandomSecret()}"`);
  
  // Add keys if they don't exist
  if (!envContent.includes('NEXT_PUBLIC_VAPID_PUBLIC_KEY')) {
    const lines = updatedContent.split('\n');
    lines.push(`NEXT_PUBLIC_VAPID_PUBLIC_KEY="${publicKey}"`);
    lines.push(`VAPID_PRIVATE_KEY="${privateKey}"`);
    lines.push(`CRON_SECRET="${generateRandomSecret()}"`);
    envContent = lines.join('\n');
  } else {
    envContent = updatedContent;
  }
  
  // Write to .env.local
  fs.writeFileSync(envPath, envContent);
  console.log('\n✅ .env.local updated with VAPID keys!');
  
  console.log('\n📋 Next Steps:');
  console.log('   1. Install dependencies: npm install web-push resend');
  console.log('   2. Run database migration: supabase db push');
  console.log('   3. Test push notifications in browser');
  console.log('   4. Configure Vercel cron jobs');
  
  console.log('\n🔧 Required Environment Variables:');
  console.log(`   NEXT_PUBLIC_VAPID_PUBLIC_KEY="${publicKey}"`);
  console.log(`   VAPID_PRIVATE_KEY="${privateKey}"`);
  console.log(`   CRON_SECRET="${generateRandomSecret()}"`);
  console.log('   RESEND_API_KEY=your_resend_key');
  console.log('   NEXT_PUBLIC_APP_URL=https://immowaechter.at');
  
} catch (error) {
  console.error('❌ Error setting up VAPID keys:', error.message);
  console.log('\n🔧 Manual Setup:');
  console.log('   1. Run: npx web-push generate-vapid-keys');
  console.log('   2. Copy the keys to .env.local');
  console.log('   3. Set CRON_SECRET to a random string');
}

function generateRandomSecret() {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}
