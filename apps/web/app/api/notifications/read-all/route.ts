import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServerClient } from '@/lib/supabase-client';

export async function POST(request: NextRequest) {
  try {
    const supabase = getSupabaseServerClient();
    
    // Get user from session
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      );
    }
    
    // Mark all notifications as read
    const { data, error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('user_id', user.id)
      .eq('read', false)
      .select();
    
    if (error) {
      throw error;
    }
    
    return NextResponse.json({
      success: true,
      data: data || []
    });
    
  } catch (error) {
    console.error('Mark all notifications as read error:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to mark all notifications as read',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

