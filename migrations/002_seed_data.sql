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

-- 3. Seed Job Postings
INSERT INTO job_postings (title, company, location, type, description, requirements, salary, contact_email, posted_by)
VALUES
    ('Software Engineer (Backend)', 'TechCorp Solutions', 'Remote', 'full-time', 'Designing and developing high-performance RESTful APIs, distributed microservices, and database layers with Node.js and PostgreSQL.', '3+ years experience with Node.js, Express, PostgreSQL, Docker, Git.', '$85,000 - $110,000', 'careers@techcorp.com', 1),
    ('Full-Stack Developer', 'CloudScale Innovations', 'Istanbul, Turkey (Hybrid)', 'full-time', 'Building scalable modern web applications with responsive React frontend and Express/PostgreSQL backend services.', 'Proficiency in React, Node.js, REST APIs, SQL databases, and modern CSS/Tailwind.', '$70,000 - $90,000', 'jobs@cloudscale.io', 1),
    ('Machine Learning Engineer', 'DeepData Labs', 'Ankara, Turkey', 'full-time', 'Developing, fine-tuning, and deploying large-scale predictive models, computer vision, and LLM agent pipelines in production.', 'Strong proficiency in Python, PyTorch, LangChain, API serving, and Vector DBs.', '$95,000 - $130,000', 'ai-careers@deepdata.com', 2),
    ('DevOps & Cloud Infrastructure Engineer', 'Nexus Infrastructure', 'Remote', 'contract', 'Automating multi-environment CI/CD pipelines, container orchestration with Kubernetes, and managing cloud security.', 'Hands-on experience with Docker, Kubernetes, AWS/GCP, GitHub Actions, and Terraform.', '$90,000 - $120,000', 'devops@nexusinfra.net', 2)
ON CONFLICT DO NOTHING;

