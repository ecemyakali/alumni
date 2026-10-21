-- ========================================================
-- Migration: 003_create_job_postings_table.sql
-- Description: Create job_postings table, indexes, and triggers
-- ========================================================

-- 1. Create Job Postings Table
CREATE TABLE IF NOT EXISTS job_postings (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    company VARCHAR(255) NOT NULL,
    location VARCHAR(255) DEFAULT 'Remote',
    type VARCHAR(50) DEFAULT 'full-time' CHECK (type IN ('full-time', 'part-time', 'contract', 'internship', 'remote')),
    description TEXT NOT NULL,
    requirements TEXT,
    salary VARCHAR(100),
    contact_email VARCHAR(255),
    posted_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Indexes for search, filter, foreign keys, and sorting
CREATE INDEX IF NOT EXISTS idx_job_postings_company ON job_postings (LOWER(company));
CREATE INDEX IF NOT EXISTS idx_job_postings_type ON job_postings (type);
CREATE INDEX IF NOT EXISTS idx_job_postings_posted_by ON job_postings (posted_by);
CREATE INDEX IF NOT EXISTS idx_job_postings_created_at ON job_postings (created_at DESC);

-- 3. Automatic updated_at Trigger Procedure
CREATE OR REPLACE FUNCTION update_timestamp_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_job_postings_updated_at ON job_postings;
CREATE TRIGGER trg_job_postings_updated_at
    BEFORE UPDATE ON job_postings
    FOR EACH ROW
    EXECUTE FUNCTION update_timestamp_column();
