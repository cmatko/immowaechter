import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { sendVerificationEmail } from '@/lib/email';
import crypto from 'crypto';

// Service Role Key verwenden
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    // 1. Email-Validierung
    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Bitte geben Sie eine gültige Email-Adresse ein.' },
        { status: 400 }
      );
    }

    // 2. Prüfe ob Email bereits existiert
    const { data: existing } = await supabase
      .from('waitlist')
      .select('email, verified')
      .eq('email', email.toLowerCase())
      .single();

    if (existing) {
      if (existing.verified) {
        // Email ist bereits verifiziert
        return NextResponse.json(
          { error: 'Diese Email-Adresse ist bereits verifiziert.' },
          { status: 409 }
        );
      } else {
        // Email existiert aber ist nicht verifiziert
        // Neuen Token generieren und Email erneut senden
        const newToken = crypto.randomBytes(32).toString('hex');
        const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24h

        await supabase
          .from('waitlist')
          .update({
            verification_token: newToken,
            token_expires_at: expiresAt.toISOString() // 👈 WICHTIG!
          })
          .eq('email', email.toLowerCase());

        // Verification Email senden
        const emailResult = await sendVerificationEmail(email, newToken);

        if (!emailResult.success) {
          return NextResponse.json(
            { error: 'Email konnte nicht gesendet werden. Bitte versuchen Sie es später erneut.' },
            { status: 500 }
          );
        }

        return NextResponse.json({
          message: 'Bestätigungs-Email wurde erneut gesendet. Bitte prüfen Sie Ihr Postfach.',
          resent: true
        });
      }
    }

    // 3. Token generieren (24 Stunden gültig)
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 👈 24h from now

    // 4. In Datenbank speichern
    const { error: insertError } = await supabase
      .from('waitlist')
      .insert({
        email: email.toLowerCase(),
        verified: false,
        verification_token: token,
        token_expires_at: expiresAt.toISOString(), // 👈 WICHTIG!
        created_at: new Date().toISOString()
      });

    if (insertError) {
      console.error('Database error:', insertError);
      
      // Falls doch Duplicate (Race Condition)
      if (insertError.code === '23505') {
        return NextResponse.json(
          { error: 'Diese Email-Adresse wurde gerade eben registriert.' },
          { status: 409 }
        );
      }
      
      return NextResponse.json(
        { error: 'Ein Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.' },
        { status: 500 }
      );
    }

    // 5. Verification Email senden
    const emailResult = await sendVerificationEmail(email, token);

    if (!emailResult.success) {
      // Email konnte nicht gesendet werden - Eintrag löschen
      await supabase
        .from('waitlist')
        .delete()
        .eq('email', email.toLowerCase());

      return NextResponse.json(
        { error: 'Email konnte nicht gesendet werden. Bitte versuchen Sie es erneut.' },
        { status: 500 }
      );
    }

    // 6. Erfolg!
    return NextResponse.json({
      message: 'Bestätigungs-Email wurde gesendet! Bitte prüfen Sie Ihr Postfach.',
      success: true
    });

  } catch (error) {
    console.error('Waitlist API error:', error);
    return NextResponse.json(
      { error: 'Ein unerwarteter Fehler ist aufgetreten.' },
      { status: 500 }
    );
  }
}