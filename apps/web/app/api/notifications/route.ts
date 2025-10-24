import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Mock data for now - replace with real Supabase when ready
    const mockNotifications = [
      {
        id: 'notif-1',
        type: 'critical',
        title: 'Wartung überfällig',
        message: 'Elektrische Anlage in Wohnung Wien-Innere Stadt ist seit 45 Tagen überfällig',
        created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
        read: false,
        action_url: '/dashboard/properties/prop-1'
      },
      {
        id: 'notif-2',
        type: 'warning',
        title: 'Wartung fällig',
        message: 'Heizungsanlage in Einfamilienhaus Salzburg muss in 3 Tagen gewartet werden',
        created_at: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(), // 1 hour ago
        read: false,
        action_url: '/dashboard/properties/prop-2'
      },
      {
        id: 'notif-3',
        type: 'info',
        title: 'Neue Inspektion geplant',
        message: 'Brandschutzanlage in Bürogebäude Graz wird in 2 Wochen inspiziert',
        created_at: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 minutes ago
        read: false,
        action_url: '/dashboard/properties/prop-3'
      },
      {
        id: 'notif-4',
        type: 'success',
        title: 'Wartung abgeschlossen',
        message: 'Wasserversorgung in Ferienhaus Tirol wurde erfolgreich gewartet',
        created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
        read: true,
        action_url: '/dashboard/properties/prop-4'
      }
    ];
    
    return NextResponse.json({
      success: true,
      data: mockNotifications
    });
    
  } catch (error) {
    console.error('Notifications API error:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch notifications',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { type, title, message, actionUrl, userId } = await request.json();
    
    if (!type || !title || !message || !userId) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    const supabase = getSupabaseServerClient();
    
    const { data, error } = await supabase
      .from('notifications')
      .insert({
        user_id: userId,
        type,
        title,
        message,
        action_url: actionUrl,
        read: false
      })
      .select()
      .single();
    
    if (error) {
      throw error;
    }
    
    return NextResponse.json({
      success: true,
      data
    });
    
  } catch (error) {
    console.error('Create notification error:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create notification',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
