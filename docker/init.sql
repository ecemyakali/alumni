-- ========================================================
-- Alumni Tracking System - Production Database Initialization
-- Database: PostgreSQL 16
-- File: docker/init.sql
-- ========================================================

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    department VARCHAR(255),
    graduation_year INTEGER,
    role VARCHAR(50) DEFAULT 'alumni' CHECK (role IN ('alumni', 'admin', 'faculty', 'student')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Index for case-insensitive fast email lookup
CREATE UNIQUE INDEX IF NOT EXISTS idx_users_email_lower ON users (LOWER(email));

-- 2. Announcements Table
CREATE TABLE IF NOT EXISTS announcements (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    category VARCHAR(100) DEFAULT 'General',
    author VARCHAR(255) DEFAULT 'Alumni Association',
    priority VARCHAR(20) DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for category and chronology lookups
CREATE INDEX IF NOT EXISTS idx_announcements_category ON announcements (category);
CREATE INDEX IF NOT EXISTS idx_announcements_created_at ON announcements (created_at DESC);

-- 3. Automatic updated_at Trigger Procedure
CREATE OR REPLACE FUNCTION update_timestamp_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_users_updated_at ON users;
CREATE TRIGGER trg_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_timestamp_column();

DROP TRIGGER IF EXISTS trg_announcements_updated_at ON announcements;
CREATE TRIGGER trg_announcements_updated_at
    BEFORE UPDATE ON announcements
    FOR EACH ROW
    EXECUTE FUNCTION update_timestamp_column();

-- 3. Job Postings Table
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

-- Indexes for job postings
CREATE INDEX IF NOT EXISTS idx_job_postings_company ON job_postings (LOWER(company));
CREATE INDEX IF NOT EXISTS idx_job_postings_type ON job_postings (type);
CREATE INDEX IF NOT EXISTS idx_job_postings_posted_by ON job_postings (posted_by);
CREATE INDEX IF NOT EXISTS idx_job_postings_created_at ON job_postings (created_at DESC);

DROP TRIGGER IF EXISTS trg_job_postings_updated_at ON job_postings;
CREATE TRIGGER trg_job_postings_updated_at
    BEFORE UPDATE ON job_postings
    FOR EACH ROW
    EXECUTE FUNCTION update_timestamp_column();

-- 4. Initial Seed Data
INSERT INTO users (name, email, department, graduation_year, role)
VALUES
    ('Ece Yakali', 'ece@example.com', 'Computer Engineering', 2024, 'alumni'),
    ('Admin User', 'admin@example.com', 'System Administration', 2020, 'admin')
ON CONFLICT (email) DO NOTHING;

INSERT INTO announcements (title, content, category, author, priority)
VALUES
    ('Annual Alumni Reunion 2026', 'Welcome back to campus! Join us for the annual gala dinner and networking panel.', 'Event', 'Alumni Office', 'high'),
    ('Tech Career Fair 2026', 'Meet top engineering firms and explore exciting internship and career opportunities.', 'Career', 'Career Center', 'normal'),
    ('Alumni Mentorship Program', 'Share your industry experience with recent graduates. Register as a mentor today!', 'Networking', 'Alumni Association', 'normal');
