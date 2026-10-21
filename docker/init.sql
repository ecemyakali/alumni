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

-- 4. Applications Action / Junction Table (Many-to-Many Users & JobPostings)
CREATE TABLE IF NOT EXISTS applications (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    job_posting_id INTEGER NOT NULL REFERENCES job_postings(id) ON DELETE CASCADE,
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'reviewing', 'accepted', 'rejected', 'withdrawn')),
    resume_url VARCHAR(500),
    cover_note TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_user_job_application UNIQUE (user_id, job_posting_id)
);

-- Indexes for applications
CREATE INDEX IF NOT EXISTS idx_applications_user_id ON applications (user_id);
CREATE INDEX IF NOT EXISTS idx_applications_job_posting_id ON applications (job_posting_id);
CREATE INDEX IF NOT EXISTS idx_applications_status ON applications (status);
CREATE INDEX IF NOT EXISTS idx_applications_created_at ON applications (created_at DESC);

DROP TRIGGER IF EXISTS trg_applications_updated_at ON applications;
CREATE TRIGGER trg_applications_updated_at
    BEFORE UPDATE ON applications
    FOR EACH ROW
    EXECUTE FUNCTION update_timestamp_column();

-- 5. Initial Seed Data
INSERT INTO users (name, email, department, graduation_year, role)
VALUES
    ('Ece Yakali', 'ece@example.com', 'Computer Engineering', 2024, 'alumni'),
    ('Admin User', 'admin@example.com', 'System Administration', 2020, 'admin')
ON CONFLICT (email) DO NOTHING;

INSERT INTO announcements (title, content, category, author, priority)
VALUES
    ('Annual Alumni Reunion 2026', 'Welcome back to campus! Join us for the annual gala dinner and networking panel.', 'Event', 'Alumni Office', 'high'),
    ('Tech Career Fair 2026', 'Meet top engineering firms and explore exciting internship and career opportunities.', 'Career', 'Career Center', 'normal'),
    ('Alumni Mentorship Program', 'Share your industry experience with recent graduates. Register as a mentor today!', 'Networking', 'Alumni Association', 'normal')
ON CONFLICT DO NOTHING;

INSERT INTO job_postings (title, company, location, type, description, requirements, salary, contact_email, posted_by)
VALUES
    ('Software Engineer (Backend)', 'TechCorp Solutions', 'Remote', 'full-time', 'Designing and developing high-performance RESTful APIs, distributed microservices, and database layers with Node.js and PostgreSQL.', '3+ years experience with Node.js, Express, PostgreSQL, Docker, Git.', '$85,000 - $110,000', 'careers@techcorp.com', 1),
    ('Full-Stack Developer', 'CloudScale Innovations', 'Istanbul, Turkey (Hybrid)', 'full-time', 'Building scalable modern web applications with responsive React frontend and Express/PostgreSQL backend services.', 'Proficiency in React, Node.js, REST APIs, SQL databases, and modern CSS/Tailwind.', '$70,000 - $90,000', 'jobs@cloudscale.io', 1),
    ('Machine Learning Engineer', 'DeepData Labs', 'Ankara, Turkey', 'full-time', 'Developing, fine-tuning, and deploying large-scale predictive models, computer vision, and LLM agent pipelines in production.', 'Strong proficiency in Python, PyTorch, LangChain, API serving, and Vector DBs.', '$95,000 - $130,000', 'ai-careers@deepdata.com', 2),
    ('DevOps & Cloud Infrastructure Engineer', 'Nexus Infrastructure', 'Remote', 'contract', 'Automating multi-environment CI/CD pipelines, container orchestration with Kubernetes, and managing cloud security.', 'Hands-on experience with Docker, Kubernetes, AWS/GCP, GitHub Actions, and Terraform.', '$90,000 - $120,000', 'devops@nexusinfra.net', 2)
ON CONFLICT DO NOTHING;

