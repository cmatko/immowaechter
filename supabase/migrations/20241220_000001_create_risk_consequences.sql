-- Create risk_consequences table for component risk management
CREATE TABLE risk_consequences (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  component_type TEXT NOT NULL UNIQUE,
  
  -- Risk Flags
  death_risk BOOLEAN DEFAULT FALSE,
  injury_risk BOOLEAN DEFAULT FALSE,
  insurance_void BOOLEAN DEFAULT FALSE,
  criminal_liability BOOLEAN DEFAULT FALSE,
  
  -- Financial Impact
  damage_cost_min INTEGER,
  damage_cost_max INTEGER,
  insurance_reduction_percent INTEGER,
  
  -- Legal References
  criminal_paragraph TEXT,
  max_fine_eur INTEGER,
  max_prison_years INTEGER,
  
  -- Warning Texts (4 escalation levels)
  warning_yellow TEXT NOT NULL,  -- 3 months before due
  warning_orange TEXT NOT NULL,  -- Overdue
  warning_red TEXT NOT NULL,     -- 6+ months overdue
  warning_black TEXT NOT NULL,   -- 12+ months - critical/legal
  
  -- Supporting Content
  real_case TEXT,
  statistic TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for fast lookups
CREATE INDEX idx_risk_consequences_component_type ON risk_consequences(component_type);

-- RLS Policies (read-only for authenticated users)
ALTER TABLE risk_consequences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "risk_consequences_read_policy" ON risk_consequences
  FOR SELECT TO authenticated
  USING (true);


