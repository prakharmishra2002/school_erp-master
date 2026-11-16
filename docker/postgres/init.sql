-- ═══════════════════════════════════════════════════════════════════════════════
-- 🗄️ PostgreSQL Initialization Script
-- ═══════════════════════════════════════════════════════════════════════════════
-- This script runs when the PostgreSQL container is first created.
-- It sets up extensions and initial configuration.
-- ═══════════════════════════════════════════════════════════════════════════════

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Create function for updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Grant permissions
GRANT ALL PRIVILEGES ON DATABASE school_erp TO school_erp;

-- Log initialization
DO $$
BEGIN
    RAISE NOTICE '✅ School ERP database initialized successfully!';
END $$;
