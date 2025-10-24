-- Add risk fields to components table for risk calculations
ALTER TABLE components
ADD COLUMN IF NOT EXISTS risk_level TEXT CHECK (risk_level IN ('safe', 'warning', 'danger', 'critical', 'legal')),
ADD COLUMN IF NOT EXISTS days_overdue INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS last_risk_calculation TIMESTAMPTZ;

-- Update function to auto-calculate risk
CREATE OR REPLACE FUNCTION calculate_component_risk()
RETURNS TRIGGER AS $$
BEGIN
  -- Calculate days overdue
  NEW.days_overdue := CASE
    WHEN NEW.next_maintenance IS NULL THEN 0
    WHEN NEW.next_maintenance < CURRENT_DATE THEN 
      CURRENT_DATE - NEW.next_maintenance
    ELSE 0
  END;
  
  -- Calculate risk level based on days overdue
  NEW.risk_level := CASE
    WHEN NEW.days_overdue < -90 THEN 'safe'
    WHEN NEW.days_overdue < 0 THEN 'warning'
    WHEN NEW.days_overdue < 180 THEN 'danger'
    WHEN NEW.days_overdue < 365 THEN 'critical'
    ELSE 'legal'
  END;
  
  NEW.last_risk_calculation := NOW();
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-calculate on insert/update
CREATE TRIGGER trigger_calculate_risk
  BEFORE INSERT OR UPDATE ON components
  FOR EACH ROW
  EXECUTE FUNCTION calculate_component_risk();

-- Backfill existing components
UPDATE components SET next_maintenance = next_maintenance;


