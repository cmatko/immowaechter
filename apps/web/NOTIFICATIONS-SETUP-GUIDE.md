# 🔔 Notifications Setup Guide

## **SCHRITT 1: VAPID KEYS GENERIEREN**

### **Automatisch (Empfohlen):**
```bash
cd apps/web
node scripts/setup-vapid-keys.js
```

### **Manuell:**
```bash
cd apps/web
npx web-push generate-vapid-keys
```

**Output:**
```
Public Key: BN...xyz
Private Key: ab...123
```

## **SCHRITT 2: ENVIRONMENT VARIABLES SETZEN**

### **Erstelle .env.local:**
```bash
# Kopiere von env.example
cp env.example .env.local
```

### **Füge VAPID Keys hinzu:**
```bash
# .env.local
NEXT_PUBLIC_VAPID_PUBLIC_KEY="BN...xyz"
VAPID_PRIVATE_KEY="ab...123"
CRON_SECRET="generate-random-secret-here"
```

### **Prüfe andere Variables:**
```bash
# Supabase (bereits vorhanden)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Email Service
RESEND_API_KEY=your_resend_key

# App Configuration
NEXT_PUBLIC_APP_URL=https://immowaechter.at
```

## **SCHRITT 3: DEPENDENCIES INSTALLIEREN**

```bash
cd apps/web
npm install web-push resend
```

## **SCHRITT 4: DATABASE MIGRATION**

```bash
cd apps/web
supabase db push
```

**Migration wird ausgeführt:**
- `push_subscriptions` table
- `email_notifications` column
- `push_notifications` column
- RLS policies

## **SCHRITT 5: SERVICE WORKER REGISTRIEREN**

**Füge zu `app/layout.tsx` hinzu:**
```javascript
'use client';

import { useEffect } from 'react';

export default function RootLayout({ children }) {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then(registration => console.log('SW registered:', registration))
        .catch(error => console.log('SW registration failed:', error));
    }
  }, []);

  return (
    <html lang="de-AT">
      <body>
        {children}
      </body>
    </html>
  );
}
```

## **SCHRITT 6: VERCEL CRON KONFIGURIEREN**

### **Vercel Dashboard:**
1. Gehe zu deinem Projekt
2. Settings → Functions
3. Cron Jobs hinzufügen:

```json
{
  "crons": [
    {
      "path": "/api/cron/check-maintenances",
      "schedule": "0 8 * * *"
    },
    {
      "path": "/api/cron/weekly-summary", 
      "schedule": "0 9 * * 1"
    }
  ]
}
```

### **Environment Variables in Vercel:**
- `CRON_SECRET` - Random secret für Authentication
- `VAPID_PRIVATE_KEY` - Private VAPID Key
- `RESEND_API_KEY` - Email service key

## **SCHRITT 7: TESTING**

### **Push Notifications testen:**
```bash
# Test Script ausführen
npm run test:notifications
```

### **Browser testen:**
1. Öffne ImmoWächter
2. Gehe zu Settings → Notifications
3. Aktiviere Push Notifications
4. Erstelle eine kritische Wartung
5. Prüfe ob Notification erscheint

### **Email testen:**
1. Erstelle kritische Wartung
2. Prüfe Email in Resend Dashboard
3. Teste wöchentliche Zusammenfassung

## **SCHRITT 8: PRODUCTION DEPLOYMENT**

### **Vercel Deployment:**
```bash
# Deploy to Vercel
vercel --prod
```

### **Environment Variables in Vercel:**
- Alle .env.local Variables zu Vercel hinzufügen
- CRON_SECRET setzen
- VAPID keys setzen

### **Domain Configuration:**
- `NEXT_PUBLIC_APP_URL=https://immowaechter.at`
- Resend Domain verifizieren
- Service Worker HTTPS

## **🔧 TROUBLESHOOTING**

### **Push Notifications funktionieren nicht:**
- Prüfe VAPID keys in .env.local
- Prüfe Service Worker registration
- Prüfe Browser permissions
- Prüfe HTTPS (required für Push)

### **Email funktioniert nicht:**
- Prüfe RESEND_API_KEY
- Prüfe Domain verification in Resend
- Prüfe Email templates

### **Cron Jobs funktionieren nicht:**
- Prüfe CRON_SECRET in Vercel
- Prüfe Vercel cron configuration
- Prüfe API routes

## **📊 VERIFICATION CHECKLIST**

- [ ] VAPID keys generiert und gesetzt
- [ ] Environment variables konfiguriert
- [ ] Dependencies installiert
- [ ] Database migration ausgeführt
- [ ] Service Worker registriert
- [ ] Vercel cron konfiguriert
- [ ] Push notifications getestet
- [ ] Email notifications getestet
- [ ] Production deployment

## **🎉 ERFOLG!**

**Das Notification System ist jetzt vollständig funktional:**
- 🔔 Push Notifications für kritische Wartungen
- 📧 Email Notifications mit schönen Templates
- ⚙️ User Settings für Preferences
- 🤖 Automated Cron Jobs
- 🇦🇹 Austrian Content in allen Templates

**ImmoWächter ist bereit für Production!** 🚀





