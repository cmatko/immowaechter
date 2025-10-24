// app/api/admin/waitlist/route.ts

import { NextResponse } from 'next/server';
import { typedSupabaseAdmin } from '@/lib/supabase-client';
import type { Waitlist, ApiResponse } from '@/types/database';

export async function GET(): Promise<NextResponse<ApiResponse<Waitlist[]>>> {
  try {
    const { data, error } = await typedSupabaseAdmin.getWaitlistEntries();

    if (error) {
      console.error('Supabase error:', error);
    return NextResponse.json<ApiResponse<Waitlist[]>>({ 
      success: false, 
      error: error.message, 
      data: [] 
    }, { status: 500 });
    }

    return NextResponse.json<ApiResponse<Waitlist[]>>({ 
      success: true, 
      data: data || [], 
      error: undefined 
    });
  } catch (err) {
    console.error('Catch error:', err);
    return NextResponse.json<ApiResponse<Waitlist[]>>({ 
      success: false, 
      error: 'Server error', 
      data: [] 
    }, { status: 500 });
  }
}