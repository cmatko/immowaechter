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

  const urgencyColor = isOverdue ? '#dc2626' : (daysUntil <= 7 ? '#f59e0b' : '#667eea');
  const urgencyBg = isOverdue ? '#fef2f2' : (daysUntil <= 7 ? '#fffbeb' : '#eef2ff');
  
  const statusText = isOverdue
    ? `<strong style="color: #dc2626;">Ihre Wartung ist ${Math.abs(daysUntil)} Tage überfällig!</strong>`
    : `Ihre Wartung ist in <strong>${daysUntil} Tagen</strong> fällig.`;

  const urgencyMessage = isOverdue
    ? '⚠️ <strong>Wichtig:</strong> Bitte kümmern Sie sich zeitnah um diese Wartung, um die Sicherheit Ihrer Immobilie zu gewährleisten und mögliche Haftungsrisiken zu vermeiden.'
    : daysUntil <= 7
    ? '🔔 <strong>Bald fällig:</strong> Vereinbaren Sie rechtzeitig einen Termin mit einem qualifizierten Fachbetrieb.'
    : '💡 <strong>Tipp:</strong> Vereinbaren Sie rechtzeitig einen Termin mit einem qualifizierten Fachbetrieb, um böse Überraschungen zu vermeiden.';

  const html = `
<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Wartungserinnerung</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f3f4f6;">
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f3f4f6;">
    <tr>
      <td style="padding: 40px 20px;">
        
        <!-- Main Container -->
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="margin: 0 auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
          
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
              <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: bold;">
                🏠 ImmoWächter
              </h1>
              <p style="margin: 10px 0 0 0; color: #e0e7ff; font-size: 14px;">
                Ihr digitaler Wartungsassistent
              </p>
            </td>
          </tr>

          <!-- Greeting -->
          <tr>
            <td style="padding: 30px 30px 0 30px;">
              <p style="margin: 0; font-size: 16px; color: #111827;">
                Hallo ${userName},
              </p>
            </td>
          </tr>

          <!-- Urgency Banner -->
          <tr>
            <td style="padding: 20px 30px;">
              <div style="background-color: ${urgencyBg}; border-left: 4px solid ${urgencyColor}; padding: 15px; border-radius: 4px;">
                <p style="margin: 0; color: #111827; font-size: 16px;">
                  ${statusText}
                </p>
              </div>
            </td>
          </tr>

          <!-- Maintenance Details -->
          <tr>
            <td style="padding: 0 30px 20px 30px;">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f9fafb; border-radius: 8px; padding: 20px;">
                <tr>
                  <td>
                    <p style="margin: 0 0 15px 0; color: #6b7280; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">
                      Wartungsdetails
                    </p>
                    
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                      <tr>
                        <td style="padding: 8px 0; color: #6b7280; font-size: 14px; width: 40%;">
                          🏢 Immobilie:
                        </td>
                        <td style="padding: 8px 0; color: #111827; font-size: 14px; font-weight: 500;">
                          ${propertyName}
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">
                          📍 Adresse:
                        </td>
                        <td style="padding: 8px 0; color: #111827; font-size: 14px;">
                          ${propertyAddress}
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">
                          🔧 Komponente:
                        </td>
                        <td style="padding: 8px 0; color: #111827; font-size: 14px; font-weight: 500;">
                          ${componentName}
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">
                          📅 Fälligkeitsdatum:
                        </td>
                        <td style="padding: 8px 0; color: ${urgencyColor}; font-size: 14px; font-weight: 600;">
                          ${nextMaintenanceDate}
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Important Message -->
          <tr>
            <td style="padding: 0 30px 20px 30px;">
              <p style="margin: 0; padding: 15px; background-color: #eff6ff; border-radius: 6px; color: #1e40af; font-size: 14px; line-height: 1.6;">
                ${urgencyMessage}
              </p>
            </td>
          </tr>

          <!-- CTA Button -->
          <tr>
            <td style="padding: 0 30px 30px 30px; text-align: center;">
              <a href="https://www.immowaechter.at/dashboard" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 6px; font-weight: 600; font-size: 16px;">
                Zum Dashboard
              </a>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f9fafb; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0 0 10px 0; color: #6b7280; font-size: 14px;">
                Diese E-Mail wurde automatisch von ImmoWächter versendet.
              </p>
              <p style="margin: 0 0 15px 0; color: #9ca3af; font-size: 12px;">
                Sie erhalten diese E-Mail, weil Sie sich bei ImmoWächter registriert haben.
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