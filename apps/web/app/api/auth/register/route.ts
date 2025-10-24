// app/api/auth/register/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-client';
import type { ApiResponse } from '@/types/database';

interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

interface RegisterResponse {
  message: string;
  user?: {
    id: string;
    email: string;
  };
}

export async function POST(request: NextRequest): Promise<NextResponse<ApiResponse<RegisterResponse>>> {
  try {
    const { email, password, firstName, lastName }: RegisterRequest = await request.json();

    // Validierung
    if (!email || !password || !firstName || !lastName) {
      return NextResponse.json(
        { success: false, error: 'Alle Felder sind erforderlich' },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { success: false, error: 'Passwort muss mindestens 8 Zeichen lang sein' },
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
        { success: false, error: authError.message },
        { status: 400 }
      );
    }

    if (!authData.user) {
      return NextResponse.json(
        { success: false, error: 'User creation failed' },
        { status: 500 }
      );
    }

    // 2. Profile erstellen
    const { error: profileError } = await supabaseAdmin
      .from('profiles')
      .insert([{
        id: authData.user.id,
        email: email,
        full_name: `${firstName} ${lastName}`,
        country: 'AT', // Österreich-First Approach
      }] as any);

    if (profileError) {
      console.error('Profile error:', profileError);
      // User wurde erstellt, aber Profile nicht - nicht kritisch
      if (!profileError.message.includes('duplicate')) {
        console.warn('Profile creation failed, but user exists');
      }
    }

    return NextResponse.json<ApiResponse<RegisterResponse>>({
      success: true,
      data: {
        message: 'Registrierung erfolgreich',
        user: {
          id: authData.user.id,
          email: authData.user.email || email,  // Fallback!
        }
      }
    });

  } catch (error: unknown) {
    console.error('Registration error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Registrierung fehlgeschlagen';
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}