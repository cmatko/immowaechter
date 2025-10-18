import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendVerificationEmail(
  email: string, 
  token: string
) {
  const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL}/verify?token=${token}`;
  
  try {
    const { data, error } = await resend.emails.send({
      from: 'ImmoWächter <onboarding@resend.dev>', // Später: team@immowaechter.at
      to: email,
      subject: '✅ Bestätigen Sie Ihre Anmeldung bei ImmoWächter',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Email Bestätigung</title>
          </head>
          <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f3f4f6;">
            <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f3f4f6; padding: 40px 20px;">
              <tr>
                <td align="center">
                  <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                    
                    <!-- Header -->
                    <tr>
                      <td style="padding: 40px 40px 20px; text-align: center; background: linear-gradient(135deg, #DC2626 0%, #B91C1C 100%); border-radius: 8px 8px 0 0;">
                        <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700;">
                          🏠 ImmoWächter
                        </h1>
                      </td>
                    </tr>
                    
                    <!-- Body -->
                    <tr>
                      <td style="padding: 40px;">
                        <h2 style="margin: 0 0 20px; color: #111827; font-size: 24px; font-weight: 600;">
                          Willkommen bei ImmoWächter!
                        </h2>
                        
                        <p style="margin: 0 0 20px; color: #4b5563; font-size: 16px; line-height: 1.6;">
                          Vielen Dank für Ihr Interesse! Bitte bestätigen Sie Ihre Email-Adresse, um auf die Warteliste zu kommen.
                        </p>
                        
                        <p style="margin: 0 0 30px; color: #4b5563; font-size: 16px; line-height: 1.6;">
                          Sie sind nur einen Klick davon entfernt, nie wieder eine wichtige Wartung zu verpassen!
                        </p>
                        
                        <!-- CTA Button -->
                        <table width="100%" cellpadding="0" cellspacing="0">
                          <tr>
                            <td align="center" style="padding: 20px 0;">
                              <a href="${verificationUrl}" 
                                 style="display: inline-block; padding: 16px 40px; background-color: #DC2626; color: #ffffff; text-decoration: none; border-radius: 6px; font-size: 16px; font-weight: 600; box-shadow: 0 4px 6px rgba(220, 38, 38, 0.3);">
                                Jetzt Email bestätigen
                              </a>
                            </td>
                          </tr>
                        </table>
                        
                        <p style="margin: 30px 0 0; color: #6b7280; font-size: 14px; line-height: 1.6;">
                          Oder kopieren Sie diesen Link in Ihren Browser:
                        </p>
                        <p style="margin: 10px 0 0; color: #9ca3af; font-size: 12px; word-break: break-all;">
                          ${verificationUrl}
                        </p>
                        
                        <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
                        
                        <p style="margin: 0; color: #6b7280; font-size: 14px; line-height: 1.6;">
                          ⏰ Dieser Link ist <strong>24 Stunden</strong> gültig.
                        </p>
                        
                        <p style="margin: 20px 0 0; color: #9ca3af; font-size: 12px; line-height: 1.5;">
                          Sie haben sich nicht bei ImmoWächter angemeldet? Ignorieren Sie diese Email einfach.
                        </p>
                      </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                      <td style="padding: 30px 40px; background-color: #f9fafb; border-radius: 0 0 8px 8px; text-align: center;">
                        <p style="margin: 0; color: #6b7280; font-size: 14px;">
                          ImmoWächter - Ihr digitaler Wartungsassistent
                        </p>
                        <p style="margin: 10px 0 0; color: #9ca3af; font-size: 12px;">
                          © 2025 ImmoWächter. Alle Rechte vorbehalten.
                        </p>
                      </td>
                    </tr>
                    
                  </table>
                </td>
              </tr>
            </table>
          </body>
        </html>
      `,
      // Plain Text Fallback
      text: `
Willkommen bei ImmoWächter!

Bitte bestätigen Sie Ihre Email-Adresse mit diesem Link:
${verificationUrl}

Dieser Link ist 24 Stunden gültig.

Sie haben sich nicht angemeldet? Ignorieren Sie diese Email.

---
ImmoWächter - Ihr digitaler Wartungsassistent
      `.trim()
    });

    if (error) {
      console.error('Resend error:', error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Email send error:', error);
    return { success: false, error };
  }
}