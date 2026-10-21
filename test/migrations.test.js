const { test, describe } = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');
const dbConfig = require('../src/config/db');
const { ensureDatabaseExists, runMigrations } = require('../scripts/migrate');

describe('🗄️ Database Migrations & Pool Architecture Tests', () => {
  const migrationsDir = path.join(__dirname, '..', 'migrations');

  test('Migration files exist in migrations/ and follow numeric order', () => {
    assert.ok(fs.existsSync(migrationsDir), 'migrations/ directory must exist');

    const files = fs
      .readdirSync(migrationsDir)
      .filter(f => f.endsWith('.sql'))
      .sort();

    assert.ok(files.length >= 3, 'Must have at least 3 migration files');
    assert.strictEqual(files[0], '001_create_tables.sql');
    assert.strictEqual(files[1], '002_seed_data.sql');
    assert.strictEqual(files[2], '003_create_job_postings_table.sql');
  });

  test('003_create_job_postings_table.sql contains DDL for job_postings, triggers and indexes', () => {
    const ddl = fs.readFileSync(path.join(migrationsDir, '003_create_job_postings_table.sql'), 'utf-8');

    assert.ok(ddl.includes('CREATE TABLE IF NOT EXISTS job_postings'), 'Must create job_postings table');
    assert.ok(ddl.includes('idx_job_postings_company'), 'Must create job_postings company index');
    assert.ok(ddl.includes('idx_job_postings_type'), 'Must create job_postings type index');
    assert.ok(ddl.includes('idx_job_postings_posted_by'), 'Must create job_postings posted_by index');
    assert.ok(ddl.includes('trg_job_postings_updated_at'), 'Must create job_postings updated_at trigger');
  });

  test('001_create_tables.sql contains DDL for users, announcements, triggers and indexes', () => {
    const ddl = fs.readFileSync(path.join(migrationsDir, '001_create_tables.sql'), 'utf-8');

    assert.ok(ddl.includes('CREATE TABLE IF NOT EXISTS users'), 'Must create users table');
    assert.ok(ddl.includes('CREATE TABLE IF NOT EXISTS announcements'), 'Must create announcements table');
    assert.ok(ddl.includes('idx_users_email_lower'), 'Must create email lower index');
    assert.ok(ddl.includes('trg_users_updated_at'), 'Must create users updated_at trigger');
    assert.ok(ddl.includes('trg_announcements_updated_at'), 'Must create announcements updated_at trigger');
  });

  test('002_seed_data.sql contains initial seed records with conflict handling', () => {
    const seed = fs.readFileSync(path.join(migrationsDir, '002_seed_data.sql'), 'utf-8');

    assert.ok(seed.includes('INSERT INTO users'), 'Must seed users');
    assert.ok(seed.includes('ON CONFLICT (email)'), 'Must have conflict resolution on email');
    assert.ok(seed.includes('INSERT INTO announcements'), 'Must seed announcements');
    assert.ok(seed.includes('Ece Yakali'), 'Must seed Ece Yakali record');
  });

  test('db.js exposes pool, query, getClient, testConnection, and close helpers', () => {
    assert.ok(dbConfig.pool, 'db.js must export pool');
    assert.strictEqual(typeof dbConfig.query, 'function', 'db.js must export query function');
    assert.strictEqual(typeof dbConfig.getClient, 'function', 'db.js must export getClient function');
    assert.strictEqual(typeof dbConfig.testConnection, 'function', 'db.js must export testConnection');
    assert.strictEqual(typeof dbConfig.close, 'function', 'db.js must export close function');
  });

  test('migrate.js exports ensureDatabaseExists and runMigrations runners', () => {
    assert.strictEqual(typeof ensureDatabaseExists, 'function');
    assert.strictEqual(typeof runMigrations, 'function');
  });
});
