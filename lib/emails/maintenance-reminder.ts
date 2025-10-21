// lib/emails/maintenance-reminder.ts
export interface MaintenanceReminderData {
  userName: string;
  propertyName: string;
  propertyAddress: string;
  componentName: string;
  nextMaintenanceDate: string;
  daysUntil: number;
  isOverdue: boolean;
}

export function generateMaintenanceReminderEmail(data: MaintenanceReminderData): string {
  const { userName, propertyName, propertyAddress, componentName, nextMaintenanceDate, daysUntil, isOverdue } = data;

  const subject = isOverdue 
    ? `⚠️ Überfällige Wartung: ${componentName} in ${propertyName}`
    : `🔔 Wartungserinnerung: ${componentName} in ${propertyName}`;

  const statusText = isOverdue
    ? `<strong style="color: #dc2626;">Ihre Wartung ist ${Math.abs(daysUntil)} Tage überfällig!</strong>`
    : `Ihre Wartung ist in <strong>${daysUntil} Tagen</strong> fällig.`;

  const urgencyColor = isOverdue ? '#dc2626' : '#f59e0b';

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f3f4f6;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f3f4f6; padding: 40px 0;">
    <tr>
      <td align="center">
        <!-- Main Container -->
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold;">
                ImmoWächter
              </h1>
              <p style="margin: 10px 0 0 0; color: #e0e7ff; font-size: 14px;">
                Ihre Immobilie im Blick
              </p>
            </td>
          </tr>

          <!-- Alert Banner -->
          <tr>
            <td style="background-color: ${urgencyColor}; padding: 20px 30px; text-align: center;">
              <p style="margin: 0; color: #ffffff; font-size: 18px; font-weight: 600;">
                ${isOverdue ? '⚠️ Wartung überfällig!' : '🔔 Wartungserinnerung'}
              </p>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 40px 30px;">
              <p style="margin: 0 0 20px 0; color: #1f2937; font-size: 16px; line-height: 1.6;">
                Hallo ${userName},
              </p>
              
              <p style="margin: 0 0 30px 0; color: #4b5563; font-size: 16px; line-height: 1.6;">
                ${statusText}
              </p>

              <!-- Property Info Box -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f9fafb; border-left: 4px solid ${urgencyColor}; border-radius: 4px; margin-bottom: 30px;">
                <tr>
                  <td style="padding: 20px;">
                    <p style="margin: 0 0 10px 0; color: #6b7280; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600;">
                      Immobilie
                    </p>
                    <p style="margin: 0 0 15px 0; color: #1f2937; font-size: 18px; font-weight: 600;">
                      ${propertyName}
                    </p>
                    <p style="margin: 0 0 15px 0; color: #6b7280; font-size: 14px;">
                      📍 ${propertyAddress}
                    </p>
                    <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 15px 0;">
                    <p style="margin: 0 0 5px 0; color: #6b7280; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600;">
                      Wartung
                    </p>
                    <p style="margin: 0 0 10px 0; color: #1f2937; font-size: 16px; font-weight: 600;">
                      ${componentName}
                    </p>
                    <p style="margin: 0; color: #6b7280; font-size: 14px;">
                      📅 Fällig am: <strong>${new Date(nextMaintenanceDate).toLocaleDateString('de-AT', { day: '2-digit', month: 'long', year: 'numeric' })}</strong>
                    </p>
                  </td>
                </tr>
              </table>

              <!-- CTA Button -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 30px;">
                <tr>
                  <td align="center">
                    <a href="https://www.immowaechter.at/dashboard" 
                       style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 6px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 6px rgba(102, 126, 234, 0.25);">
                      Zum Dashboard
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin: 0 0 20px 0; color: #6b7280; font-size: 14px; line-height: 1.6;">
                ${isOverdue 
                  ? '⚠️ <strong>Wichtig:</strong> Bitte kümmern Sie sich zeitnah um diese Wartung, um die Sicherheit Ihrer Immobilie zu gewährleisten und mögliche Haftungsrisiken zu vermeiden.'
                  : '💡 <strong>Tipp:</strong> Vereinbaren Sie rechtzeitig einen Termin mit einem qualifizierten Fachbetrieb, um böse Überraschungen zu vermeiden.'
                }
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f9fafb; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0 0 10px 0; color: #6b7280; font-size: 14px;">
                Diese Email wurde automatisch von ImmoWächter versendet.
              </p>
              <p style="margin: 0 0 15px 0; color: #9ca3af; font-size: 12px;">
                Sie erhalten diese Email, weil Sie sich bei ImmoWächter registriert haben.
              </p>
              <p style="margin: 0; color: #9ca3af; font-size: 12px;">
                <a href="https://www.immowaechter.at" style="color: #667eea; text-decoration: none;">www.immowaechter.at</a> • 
                <a href="https://www.immowaechter.at/datenschutz" style="color: #667eea; text-decoration: none;">Datenschutz</a> • 
                <a href="https://www.immowaechter.at/impressum" style="color: #667eea; text-decoration: none;">Impressum</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;

  return html;
}

export function getEmailSubject(data: MaintenanceReminderData): string {
  return data.isOverdue 
    ? `⚠️ Überfällige Wartung: ${data.componentName} in ${data.propertyName}`
    : `🔔 Wartungserinnerung: ${data.componentName} in ${data.propertyName}`;
}