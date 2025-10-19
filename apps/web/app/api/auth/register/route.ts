// app/api/auth/register/route.ts

import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

// Admin client für User-Erstellung
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

export async function POST(request: NextRequest) {
  try {
    const { email, password, firstName, lastName } = await request.json();

    // Validierung
    if (!email || !password || !firstName || !lastName) {
      return NextResponse.json(
        { message: 'Alle Felder sind erforderlich' },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { message: 'Passwort muss mindestens 8 Zeichen lang sein' },
        { status: 400 }
      );
    }

    // 1. User in Supabase Auth erstellen
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Auto-confirm für Development
      user_metadata: {
        full_name: `${firstName} ${lastName}`,
      }
    });

    if (authError) {
      console.error('Auth error:', authError);
      return NextResponse.json(
        { message: authError.message },
        { status: 400 }
      );
    }

    if (!authData.user) {
      return NextResponse.json(
        { message: 'User creation failed' },
        { status: 500 }
      );
    }

    // 2. Profile erstellen
    const { error: profileError } = await supabaseAdmin
      .from('profiles')
      .insert({
        id: authData.user.id,
        email: email,
        full_name: `${firstName} ${lastName}`,
      });

    if (profileError) {
      console.error('Profile error:', profileError);
      // User wurde erstellt, aber Profile nicht - nicht kritisch
      if (!profileError.message.includes('duplicate')) {
        console.warn('Profile creation failed, but user exists');
      }
    }

    return NextResponse.json({
      message: 'Registrierung erfolgreich',
      user: {
        id: authData.user.id,
        email: authData.user.email,
      }
    });

  } catch (error: any) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { message: error.message || 'Registrierung fehlgeschlagen' },
      { status: 500 }
    );
  }
}