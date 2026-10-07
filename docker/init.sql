-- ========================================================
-- Alumni Tracking System - Initial Database Schema
-- Database: PostgreSQL
-- File: docker/init.sql
-- ========================================================

CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    role VARCHAR(100) DEFAULT 'alumni',
    department VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Seed initial test users
INSERT INTO users (name, email, role, department)
VALUES
    ('Ece Yakali', 'ece@example.com', 'alumni', 'Computer Engineering'),
    ('Admin User', 'admin@example.com', 'admin', 'System Administration')
ON CONFLICT (email) DO NOTHING;
