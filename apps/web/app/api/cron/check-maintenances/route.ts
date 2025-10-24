import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Dieser Endpoint wird täglich von Vercel Cron aufgerufen
export async function GET(request: Request) {
  // Verify cron secret
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Find critical components
    const { data: criticalComponents } = await supabase
      .from('components')
      .select(`
        id,
        custom_name,
        risk_level,
        days_overdue,
        property:properties (
          id,
          name,
          user_id,
          user:profiles (
            id,
            email,
            full_name,
            email_notifications
          )
        )
      `)
      .in('risk_level', ['critical', 'legal']);

    // Send notifications
    for (const comp of criticalComponents || []) {
      const property = comp.property[0]; // Get first property from array
      if (!property) continue;
      
      await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/notifications/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: property.user_id,
          type: 'critical',
          data: {
            userName: property.user[0]?.full_name || 'Unknown User',
            componentName: comp.custom_name,
            propertyName: property.name,
            daysOverdue: comp.days_overdue,
            riskLevel: comp.risk_level,
            detailsUrl: `${process.env.NEXT_PUBLIC_APP_URL}/properties/${property.id}`,
            title: '🚨 Kritische Wartung überfällig!',
            body: `${comp.custom_name} ist ${comp.days_overdue} Tage überfällig!`,
            url: `/properties/${property.id}`,
            componentId: comp.id
          }
        })
      });
    }

    return NextResponse.json({ 
      success: true, 
      notificationsSent: criticalComponents?.length || 0 
    });
  } catch (error) {
    console.error('Cron job error:', error);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}





