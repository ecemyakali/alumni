-- ========================================================
-- Migration: 002_seed_data.sql
-- Description: Insert initial seed records for users and announcements
-- ========================================================

-- 1. Seed Users
INSERT INTO users (name, email, department, graduation_year, role)
VALUES
    ('Ece Yakali', 'ece@example.com', 'Computer Engineering', 2024, 'alumni'),
    ('Admin User', 'admin@example.com', 'System Administration', 2020, 'admin'),
    ('Can Demir', 'can.demir@alumni.edu', 'Industrial Engineering', 2023, 'alumni'),
    ('Zeynep Kaya', 'zeynep.kaya@alumni.edu', 'Electrical & Electronics Engineering', 2022, 'alumni')
ON CONFLICT (email) DO UPDATE SET
    name = EXCLUDED.name,
    department = EXCLUDED.department,
    graduation_year = EXCLUDED.graduation_year,
    role = EXCLUDED.role,
    updated_at = CURRENT_TIMESTAMP;

-- 2. Seed Announcements
INSERT INTO announcements (title, content, category, author, priority)
VALUES
    ('Annual Alumni Reunion 2026', 'Welcome back to campus! Join us for the annual gala dinner and networking panel.', 'Event', 'Alumni Office', 'high'),
    ('Tech Career Fair 2026', 'Meet top engineering firms and explore exciting internship and career opportunities.', 'Career', 'Career Center', 'normal'),
    ('Alumni Mentorship Program', 'Share your industry experience with recent graduates. Register as a mentor today!', 'Networking', 'Alumni Association', 'normal')
ON CONFLICT DO NOTHING;
