-- Add Country Support for Multi-Country Risk System
-- Profiles: Country Field
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS country TEXT DEFAULT 'AT';

-- Risk Consequences: Country Field  
ALTER TABLE risk_consequences 
ADD COLUMN IF NOT EXISTS country TEXT DEFAULT 'AT';

-- Index für Performance
CREATE INDEX IF NOT EXISTS idx_risk_consequences_country 
ON risk_consequences(country);

COMMENT ON COLUMN profiles.country IS 'ISO Country Code: AT, DE, etc.';
COMMENT ON COLUMN risk_consequences.country IS 'Country-specific content. BOTH = applies to all';





