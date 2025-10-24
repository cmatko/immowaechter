import { RiskLevel } from '@/types/database';

export const emailTemplates = {
  criticalMaintenance: (data: {
    userName: string;
    componentName: string;
    propertyName: string;
    daysOverdue: number;
    riskLevel: RiskLevel;
    detailsUrl: string;
  }) => ({
    subject: `🚨 DRINGEND: ${data.componentName} ${data.daysOverdue} Tage überfällig!`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #DC2626; color: white; padding: 20px; border-radius: 8px 8px 0 0; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
          .button { display: inline-block; background: #DC2626; color: white !important; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; margin-top: 20px; }
          .warning { background: #FEF2F2; border-left: 4px solid #DC2626; padding: 15px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="margin: 0;">⚠️ Kritische Wartung überfällig!</h1>
          </div>
          <div class="content">
            <p>Hallo ${data.userName},</p>
            
            <p>Ihre <strong>${data.componentName}</strong> in <strong>${data.propertyName}</strong> ist seit <strong>${data.daysOverdue} Tagen</strong> überfällig!</p>
            
            <div class="warning">
              <strong>⚫ KRITISCH:</strong> Rechtliche Konsequenzen möglich!<br>
              • Versicherungsschutz gefährdet<br>
              • Grobe Fahrlässigkeit nach ABGB<br>
              • Strafrechtliche Folgen bei Schäden
            </div>
            
            <p><strong>Handeln Sie jetzt:</strong></p>
            <ol>
              <li>Handwerker beauftragen</li>
              <li>Wartung durchführen lassen</li>
              <li>In ImmoWächter dokumentieren</li>
            </ol>
            
            <a href="${data.detailsUrl}" class="button">
              Risiko-Details anzeigen
            </a>
            
            <p style="margin-top: 30px; font-size: 12px; color: #666;">
              Diese Email wurde automatisch von ImmoWächter versendet.<br>
              Sie erhalten sie, weil eine kritische Wartung überfällig ist.
            </p>
          </div>
        </div>
      </body>
      </html>
    `
  }),

  weeklySummary: (data: {
    userName: string;
    criticalCount: number;
    dangerCount: number;
    warningCount: number;
    dashboardUrl: string;
  }) => ({
    subject: `📊 Ihre Wartungs-Übersicht: ${data.criticalCount} dringende Wartungen`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #4F46E5; color: white; padding: 20px; border-radius: 8px 8px 0 0; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
          .stat-box { background: white; border-radius: 8px; padding: 15px; margin: 10px 0; border-left: 4px solid #DC2626; }
          .button { display: inline-block; background: #4F46E5; color: white !important; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="margin: 0;">📊 Ihre wöchentliche Wartungs-Übersicht</h1>
          </div>
          <div class="content">
            <p>Hallo ${data.userName},</p>
            
            <p>Hier ist Ihre Übersicht für diese Woche:</p>
            
            ${data.criticalCount > 0 ? `
              <div class="stat-box" style="border-left-color: #DC2626;">
                <strong>⚫ ${data.criticalCount} KRITISCHE Wartungen</strong><br>
                <span style="color: #666; font-size: 14px;">Sofortiges Handeln erforderlich!</span>
              </div>
            ` : ''}
            
            ${data.dangerCount > 0 ? `
              <div class="stat-box" style="border-left-color: #F59E0B;">
                <strong>🟠 ${data.dangerCount} überfällige Wartungen</strong><br>
                <span style="color: #666; font-size: 14px;">Bitte schnellstmöglich erledigen</span>
              </div>
            ` : ''}
            
            ${data.warningCount > 0 ? `
              <div class="stat-box" style="border-left-color: #FBBF24;">
                <strong>🟡 ${data.warningCount} bald fällige Wartungen</strong><br>
                <span style="color: #666; font-size: 14px;">Jetzt Termine vereinbaren</span>
              </div>
            ` : ''}
            
            ${data.criticalCount === 0 && data.dangerCount === 0 && data.warningCount === 0 ? `
              <div class="stat-box" style="border-left-color: #10B981;">
                <strong>🟢 Alle Wartungen aktuell!</strong><br>
                <span style="color: #666; font-size: 14px;">Weiter so! 🎉</span>
              </div>
            ` : ''}
            
            <a href="${data.dashboardUrl}" class="button" style="margin-top: 20px;">
              Zum Dashboard
            </a>
            
            <p style="margin-top: 30px; font-size: 12px; color: #666;">
              Sie erhalten diese wöchentliche Zusammenfassung, weil Sie bei ImmoWächter registriert sind.<br>
              <a href="#" style="color: #666;">Benachrichtigungseinstellungen ändern</a>
            </p>
          </div>
        </div>
      </body>
      </html>
    `
  })
};





