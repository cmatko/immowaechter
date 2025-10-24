-- Test Healing Sessions Table
CREATE TABLE healing_sessions (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at timestamptz DEFAULT now(),
  
  -- Session Info
  trigger text NOT NULL CHECK (trigger IN ('manual', 'ci', 'watch')),
  mode text NOT NULL CHECK (mode IN ('interactive', 'smart', 'auto', 'force')),
  
  -- Test Info
  failed_tests integer NOT NULL DEFAULT 0,
  test_files text[] NOT NULL DEFAULT '{}',
  
  -- Pattern Detection
  pattern_type text,
  confidence numeric CHECK (confidence >= 0 AND confidence <= 1),
  
  -- Safety Assessment
  safety_level text CHECK (safety_level IN ('high', 'medium', 'low')),
  auto_heal_decision boolean NOT NULL DEFAULT false,
  
  -- Results
  fixes_applied integer NOT NULL DEFAULT 0,
  duration_seconds integer NOT NULL DEFAULT 0,
  success boolean NOT NULL DEFAULT false,
  
  -- Claude API
  tokens_used integer,
  api_cost numeric,
  
  -- Linear Integration
  linear_task_created text,
  
  -- Metadata
  user_id uuid REFERENCES auth.users(id),
  error_message text,
  details jsonb
);

-- Indexes
CREATE INDEX idx_healing_created ON healing_sessions(created_at DESC);
CREATE INDEX idx_healing_pattern ON healing_sessions(pattern_type);
CREATE INDEX idx_healing_user ON healing_sessions(user_id);

-- RLS Policies
ALTER TABLE healing_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own sessions"
  ON healing_sessions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create sessions"
  ON healing_sessions FOR INSERT
  WITH CHECK (auth.uid() = user_id);
