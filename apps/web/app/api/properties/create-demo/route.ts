import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Service Role Client (bypasses RLS)
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const formData = await request.json();
    
    console.log('🚀 Demo Property Creation API called:', formData);

    // Suche nach einem existierenden User in der Datenbank
    const { data: existingUsers, error: userError } = await supabaseAdmin
      .from('profiles')
      .select('id')
      .limit(1);

    let userId = null;
    if (existingUsers && existingUsers.length > 0) {
      userId = existingUsers[0].id;
      console.log('✅ Found existing user:', userId);
    } else {
      console.log('⚠️ No existing users found, trying without user_id');
    }

    const { data, error } = await supabaseAdmin
      .from('properties')
      .insert({
        user_id: userId, // Verwende existierenden User oder NULL
        name: formData.name,
        address: formData.address,
        postal_code: formData.postal_code,
        city: formData.city,
        property_type: formData.property_type,
        build_year: formData.build_year,
        living_area: formData.living_area ? parseFloat(formData.living_area) : null,
        country: 'AT',
      })
      .select()
      .single();

    if (error) {
      console.error('❌ Supabase Error:', error);
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    console.log('✅ Demo Property created:', data);
    return NextResponse.json({ success: true, data });

  } catch (error) {
    console.error('❌ API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
