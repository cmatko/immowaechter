// app/api/notifications/check/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';
import { generateMaintenanceReminderEmail, getEmailSubject, MaintenanceReminderData } from '@/lib/emails/maintenance-reminder';

// Initialize Supabase with SERVICE ROLE KEY (bypasses RLS)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY);

interface MaintenanceCheck {
  componentId: string;
  userId: string;
  userEmail: string;
  userName: string;
  propertyId: string;
  propertyName: string;
  propertyAddress: string;
  componentName: string;
  nextMaintenance: string;
  daysUntil: number;
  isOverdue: boolean;
}

export async function GET(request: NextRequest) {
  try {
    // Verify cron secret (security)
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log('🔔 Starting maintenance notification check...');

    // Query: Find all components that need notification
    const today = new Date();
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(today.getDate() + 30);

    const { data: components, error: componentsError } = await supabase
      .from('components')
      .select(`
        id,
        property_id,
        interval_id,
        custom_name,
        brand,
        model,
        last_maintenance,
        next_maintenance,
        is_active,
        properties (
          id,
          name,
          address,
          city,
          postal_code,
          user_id
        ),
        maintenance_intervals (
          id,
          component,
          interval_months
        )
      `)
      .eq('is_active', true)
      .lte('next_maintenance', thirtyDaysFromNow.toISOString().split('T')[0])
      .not('next_maintenance', 'is', null);

    if (componentsError) {
      console.error('❌ Error fetching components:', componentsError);
      return NextResponse.json({ 
        error: 'Database query failed', 
        details: componentsError 
      }, { status: 500 });
    }

    console.log(`📊 Found ${components?.length || 0} components to check`);

    if (!components || components.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No maintenance notifications needed',
        checked: 0,
        sent: 0,
        notifications: []
      });
    }

    const notifications: MaintenanceCheck[] = [];
    const emailsSent: string[] = [];
    const errors: string[] = [];

    // Process each component
    for (const component of components) {
      try {
        // @ts-ignore - Supabase types
        const property = component.properties;
        // @ts-ignore
        const interval = component.maintenance_intervals;

        if (!property || !interval) {
          console.log(`⚠️ Skipping component ${component.id}: Missing property or interval data`);
          continue;
        }

        // Get user details
        const propertyData = property[0]; // Access first element of array
        const { data: user, error: userError } = await supabase
          .from('profiles')
          .select('id, email, full_name')
          .eq('id', propertyData.user_id)
          .single();

        if (userError || !user) {
          console.log(`⚠️ Skipping component ${component.id}: User not found`);
          continue;
        }

        // Calculate days until maintenance
        const nextMaintenanceDate = new Date(component.next_maintenance);
        const daysUntil = Math.ceil((nextMaintenanceDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        const isOverdue = daysUntil < 0;

        // Notification logic: Send at specific intervals
        // - Overdue: Send every 7 days
        // - Warning: Send at 30 days, 14 days, 7 days, 3 days, 1 day, 0 days
        const shouldSendNotification = 
          (isOverdue && Math.abs(daysUntil) % 7 === 0) || // Every 7 days when overdue
          daysUntil === 30 || 
          daysUntil === 14 || 
          daysUntil === 7 || 
          daysUntil === 3 || 
          daysUntil === 1 ||
          daysUntil === 0; // Day of

        if (!shouldSendNotification) {
          console.log(`⏭️ Skipping notification for component ${component.id} (${daysUntil} days)`);
          continue;
        }

        // Prepare email data
        const componentDisplayName = component.custom_name || interval.component;
        const propertyAddress = `${propertyData.address || ''}, ${propertyData.postal_code || ''} ${propertyData.city || ''}`.trim();

        const maintenanceData: MaintenanceReminderData = {
          userName: user.full_name || 'Immobilien-Eigentümer',
          propertyName: propertyData.name || 'Ihre Immobilie',
          propertyAddress: propertyAddress,
          componentName: componentDisplayName,
          nextMaintenanceDate: component.next_maintenance,
          daysUntil: Math.abs(daysUntil),
          isOverdue
        };

        // Generate email
        const emailHtml = generateMaintenanceReminderEmail(maintenanceData);
        const emailSubject = getEmailSubject(maintenanceData);

        // Send email via Resend
        const { data: emailData, error: emailError } = await resend.emails.send({
          from: 'ImmoWächter <noreply@immowaechter.at>',
          to: user.email,
          subject: emailSubject,
          html: emailHtml,
        });

        if (emailError) {
          console.error(`❌ Failed to send email to ${user.email}:`, emailError);
          errors.push(`${user.email}: ${emailError.message}`);
          continue;
        }

        console.log(`✅ Sent ${isOverdue ? 'overdue' : 'reminder'} email to ${user.email} for ${componentDisplayName}`);
        emailsSent.push(user.email);

        notifications.push({
          componentId: component.id,
          userId: user.id,
          userEmail: user.email,
          userName: maintenanceData.userName,
          propertyId: property.id,
          propertyName: maintenanceData.propertyName,
          propertyAddress: propertyAddress,
          componentName: componentDisplayName,
          nextMaintenance: component.next_maintenance,
          daysUntil: Math.abs(daysUntil),
          isOverdue
        });

      } catch (error) {
        console.error(`❌ Error processing component ${component.id}:`, error);
        errors.push(`Component ${component.id}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }

    // Return summary
    return NextResponse.json({
      success: true,
      message: 'Notification check completed',
      checked: components.length,
      sent: emailsSent.length,
      notifications: notifications,
      errors: errors.length > 0 ? errors : undefined
    });

  } catch (error) {
    console.error('❌ Fatal error in notification check:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}