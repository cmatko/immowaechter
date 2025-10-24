import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Service Role Client (bypasses RLS)
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: NextRequest) {
  try {
    console.log('🔄 Loading properties via API...');
    
    const { data, error } = await supabaseAdmin
      .from('properties')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ Error loading properties:', error);
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    console.log('✅ Properties loaded via API:', data?.length || 0, 'properties');
    return NextResponse.json({ success: true, data });

  } catch (error) {
    console.error('❌ API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
