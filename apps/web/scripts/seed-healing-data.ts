#!/usr/bin/env tsx

/**
 * Seed Healing Data Script
 * 
 * Creates test data for the healing dashboard.
 * This is a CLI script for testing purposes only.
 */

import { createClient } from '@supabase/supabase-js';

async function seedHealingData() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Missing Supabase environment variables');
    console.error('Required: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY');
    process.exit(1);
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  console.log('🌱 Seeding healing sessions...');

  const testSessions = [
    {
      trigger: 'manual',
      mode: 'auto',
      failed_tests: 8,
      test_files: ['tests/maintenance.e2e.ts', 'tests/heating.test.ts'],
      pattern_type: 'oib-interval',
      confidence: 0.85,
      safety_level: 'high',
      auto_heal_decision: true,
      fixes_applied: 8,
      duration_seconds: 30,
      success: true,
      tokens_used: 15000,
      api_cost: 0.15,
    },
    {
      trigger: 'manual',
      mode: 'smart',
      failed_tests: 3,
      test_files: ['tests/subsidy.test.ts'],
      pattern_type: 'calculation',
      confidence: 0.75,
      safety_level: 'low',
      auto_heal_decision: false,
      fixes_applied: 0,
      duration_seconds: 5,
      success: false,
      tokens_used: 8000,
      api_cost: 0.08,
      linear_task_created: 'KOT-126',
    },
    {
      trigger: 'ci',
      mode: 'auto',
      failed_tests: 5,
      test_files: ['tests/properties.e2e.ts'],
      pattern_type: 'timeout',
      confidence: 0.92,
      safety_level: 'high',
      auto_heal_decision: true,
      fixes_applied: 5,
      duration_seconds: 45,
      success: true,
      tokens_used: 12000,
      api_cost: 0.12,
    },
    {
      trigger: 'watch',
      mode: 'interactive',
      failed_tests: 2,
      test_files: ['tests/risk.test.ts'],
      pattern_type: 'selector',
      confidence: 0.88,
      safety_level: 'medium',
      auto_heal_decision: false,
      fixes_applied: 2,
      duration_seconds: 60,
      success: true,
      tokens_used: 6000,
      api_cost: 0.06,
    },
    {
      trigger: 'manual',
      mode: 'force',
      failed_tests: 12,
      test_files: ['tests/auth.e2e.ts', 'tests/payment.test.ts'],
      pattern_type: 'authentication',
      confidence: 0.65,
      safety_level: 'low',
      auto_heal_decision: true,
      fixes_applied: 0,
      duration_seconds: 10,
      success: false,
      tokens_used: 20000,
      api_cost: 0.20,
      error_message: 'Force mode failed - authentication patterns detected',
    },
  ];

  for (const session of testSessions) {
    const { error } = await supabase
      .from('healing_sessions')
      .insert(session);
    
    if (error) {
      console.error('❌ Error inserting:', error);
    } else {
      console.log('✅ Inserted:', session.pattern_type);
    }
  }

  console.log('🎉 Seed complete!');
  console.log('📊 Visit http://localhost:3000/dashboard/healing to see the dashboard');
}

seedHealingData().catch(console.error);
