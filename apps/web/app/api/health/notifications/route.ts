import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  const health = {
    timestamp: new Date().toISOString(),
    checks: {
      vapidKeys: {
        publicKey: !!process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
        privateKey: !!process.env.VAPID_PRIVATE_KEY
      },
      resend: {
        apiKey: !!process.env.RESEND_API_KEY
      },
      files: {
        serviceWorker: false,
        emailTemplates: false
      },
      database: {
        connected: false
      }
    }
  };

  // Check if Service Worker exists
  try {
    const swPath = path.join(process.cwd(), 'public', 'sw.js');
    fs.accessSync(swPath);
    health.checks.files.serviceWorker = true;
  } catch {
    health.checks.files.serviceWorker = false;
  }

  // Check if Email Templates exist
  try {
    const templatesPath = path.join(process.cwd(), 'lib', 'email-templates.ts');
    fs.accessSync(templatesPath);
    health.checks.files.emailTemplates = true;
  } catch {
    health.checks.files.emailTemplates = false;
  }

  // Check Database Connection
  try {
    const { createClient } = await import('@supabase/supabase-js');
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { error } = await supabase
      .from('push_subscriptions')
      .select('count')
      .limit(1);

    health.checks.database.connected = !error;
  } catch {
    health.checks.database.connected = false;
  }

  const allHealthy = Object.values(health.checks).every(check => 
    Object.values(check).every(v => v === true)
  );

  return NextResponse.json({
    status: allHealthy ? 'healthy' : 'degraded',
    ...health
  }, {
    status: allHealthy ? 200 : 503
  });
}





