// app/api/admin/waitlist/route.ts

import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

// USE SERVICE ROLE KEY - CAN BYPASS RLS!
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!, // THIS KEY BYPASSES RLS
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from('waitlist')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json({ error: error.message, data: [] }, { status: 500 });
    }

    return NextResponse.json({ data, error: null });
  } catch (err) {
    console.error('Catch error:', err);
    return NextResponse.json({ error: 'Server error', data: [] }, { status: 500 });
  }
}