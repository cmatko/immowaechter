# 🔧 ImmoWächter Notifications Setup Instructions

## **VAPID KEYS GENERIERT ✅**

**Public Key:**
```
BNp-0-m8_W9f403vyLSrjhpeHP9zEfGO29jJYUneE06SoQo9liQA8iTY845iFOO_bske6GbE1IVpQnMbkeu7NDU
```

**Private Key:**
```
oiefjb5IZ630CnFaEhV_4eIfj2ZpLcxuzaarWvF5lxQ
```

## **📋 MANUAL SETUP STEPS:**

### **1. Erstelle .env.local Datei:**
```bash
# ImmoWächter Environment Variables
# Generated on 2024-12-22

# Supabase Configuration (replace with actual values)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here

# VAPID Keys for Push Notifications (GENERATED)
NEXT_PUBLIC_VAPID_PUBLIC_KEY="BNp-0-m8_W9f403vyLSrjhpeHP9zEfGO29jJYUneE06SoQo9liQA8iTY845iFOO_bske6GbE1IVpQnMbkeu7NDU"
VAPID_PRIVATE_KEY="oiefjb5IZ630CnFaEhV_4eIfj2ZpLcxuzaarWvF5lxQ"

# Email Service (Resend) - replace with actual key
RESEND_API_KEY=your_resend_api_key_here

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3001
NEXT_PUBLIC_DOMAIN=https://immowaechter.at

# Cron Job Authentication
CRON_SECRET=zqwthnkk7p9jetpvfw1wr

# Database
DATABASE_URL=your_database_url_here
```

### **2. Database Migration ausführen:**
```sql
-- Supabase Dashboard → SQL Editor → Execute:

-- Push Notifications Support
CREATE TABLE IF NOT EXISTS push_subscriptions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  endpoint TEXT NOT NULL UNIQUE,
  keys JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_used TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_push_subscriptions_user_id ON push_subscriptions(user_id);

-- RLS
ALTER TABLE push_subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own subscriptions" ON push_subscriptions
  FOR ALL TO authenticated
  USING (auth.uid() = user_id);

-- User preferences
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS email_notifications BOOLEAN DEFAULT TRUE,
ADD COLUMN IF NOT EXISTS push_notifications BOOLEAN DEFAULT TRUE;
```

### **3. Test ausführen:**
```bash
npm run test:notifications:full
```

## **🎯 ERWARTETES ERGEBNIS:**

Nach dem Setup sollten alle Tests grün sein:
- ✅ Dependencies: 3/3
- ✅ Environment Variables: 5/5
- ✅ Required Files: 8/8
- ✅ Email Templates: 2/2
- ✅ Database Connection: 2/2
- ✅ API Endpoints: 4/4

**Total: 24/24 Tests = 100% Success Rate! 🎉**

## **🚀 PRODUCTION READY:**

Nach dem Setup ist das Notifications System vollständig funktional:
- 🔔 Push Notifications
- 📧 Email Notifications
- ⚙️ User Settings
- 🤖 Automated Cron Jobs
- 🇦🇹 Austrian Content

**ImmoWächter ist bereit für Production!** 🎉





