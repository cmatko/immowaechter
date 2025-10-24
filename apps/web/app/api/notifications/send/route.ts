import { NextResponse } from 'next/server';
import webpush from 'web-push';
import { Resend } from 'resend';
import { emailTemplates } from '@/lib/email-templates';
import { createClient } from '@supabase/supabase-js';

// Setup web-push
webpush.setVapidDetails(
  'mailto:noreply@immowaechter.at',
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!
);

const resend = new Resend(process.env.RESEND_API_KEY);

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: Request) {
  try {
    const { userId, type, data } = await request.json();

    // Get user subscriptions
    const { data: subscriptions } = await supabase
      .from('push_subscriptions')
      .select('*')
      .eq('user_id', userId);

    const { data: user } = await supabase
      .from('profiles')
      .select('email, full_name, email_notifications')
      .eq('id', userId)
      .single();

    // Send Push Notifications
    if (subscriptions && subscriptions.length > 0) {
      const pushPayload = {
        title: data.title,
        body: data.body,
        url: data.url,
        riskLevel: data.riskLevel,
        componentId: data.componentId
      };

      await Promise.all(
        subscriptions.map(sub =>
          webpush.sendNotification(
            {
              endpoint: sub.endpoint,
              keys: sub.keys
            },
            JSON.stringify(pushPayload)
          ).catch(err => console.error('Push failed:', err))
        )
      );
    }

    // Send Email if enabled
    if (user?.email_notifications && user?.email) {
      const template = type === 'critical' 
        ? emailTemplates.criticalMaintenance(data)
        : emailTemplates.weeklySummary(data);

      await resend.emails.send({
        from: 'ImmoWächter <noreply@send.immowaechter.at>',
        to: user.email,
        subject: template.subject,
        html: template.html
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Send notification error:', error);
    return NextResponse.json({ error: 'Failed to send' }, { status: 500 });
  }
}





