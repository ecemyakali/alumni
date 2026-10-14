/**
 * ========================================================
 * Database Migration & Database Creation Runner
 * File: scripts/migrate.js
 * ========================================================
 * 
 * Automates:
 * 1. Database creation (alumni_db) if it does not exist
 * 2. Migration tracking table creation
 * 3. Idempotent execution of all pending SQL migration files in migrations/
 */

const fs = require('fs');
const path = require('path');
const { Client } = require('pg');

const targetDbName = process.env.DB_NAME || process.env.POSTGRES_DB || 'alumni_db';
const dbHost = process.env.DB_HOST || 'localhost';
const dbPort = Number(process.env.DB_PORT) || 5432;
const dbUser = process.env.DB_USER || process.env.POSTGRES_USER || 'postgres';
const dbPassword = process.env.DB_PASSWORD || process.env.POSTGRES_PASSWORD || 'postgres';

const migrationsDir = path.join(__dirname, '..', 'migrations');

/**
 * Step 1: Ensure Target Database Exists
 */
async function ensureDatabaseExists() {
  console.log(`\n🔍 Checking if database '${targetDbName}' exists on ${dbHost}:${dbPort}...`);

  // Connect to default maintenance database 'postgres'
  const maintenanceClient = new Client({
    host: dbHost,
    port: dbPort,
    user: dbUser,
    password: dbPassword,
    database: 'postgres',
    connectionTimeoutMillis: 5000,
  });

  try {
    await maintenanceClient.connect();
    const checkRes = await maintenanceClient.query(
      'SELECT 1 FROM pg_database WHERE datname = $1',
      [targetDbName]
    );

    if (checkRes.rowCount === 0) {
      console.log(`📦 Database '${targetDbName}' does not exist. Creating...`);
      // Escape database name safely
      await maintenanceClient.query(`CREATE DATABASE "${targetDbName}"`);
      console.log(`✅ Database '${targetDbName}' created successfully!`);
    } else {
      console.log(`✅ Database '${targetDbName}' already exists.`);
    }
  } catch (err) {
    if (err.code === 'ECONNREFUSED' || err.message.includes('connect ECONNREFUSED')) {
      console.warn(`\n⚠️  [PostgreSQL Offline]: Could not connect to PostgreSQL on ${dbHost}:${dbPort}.`);
      console.warn(`👉 To start PostgreSQL with Docker, run:\n   docker compose up -d db\n`);
      return false;
    }
    console.error('Error checking/creating database:', err.message);
    throw err;
  } finally {
    await maintenanceClient.end().catch(() => {});
  }

  return true;
}

/**
 * Step 2: Execute All Pending SQL Migrations
 */
async function runMigrations() {
  const isDbReady = await ensureDatabaseExists();
  if (!isDbReady) {
    console.log('Skipping migration execution because database server is offline.');
    return;
  }

  console.log(`\n🚀 Connecting to '${targetDbName}' to run migrations...`);

  const client = new Client({
    host: dbHost,
    port: dbPort,
    user: dbUser,
    password: dbPassword,
    database: targetDbName,
    connectionTimeoutMillis: 5000,
  });

  try {
    await client.connect();

    // Create migrations tracking table
    await client.query(`
      CREATE TABLE IF NOT EXISTS migrations (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) UNIQUE NOT NULL,
        executed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Get list of already applied migrations
    const appliedRes = await client.query('SELECT name FROM migrations ORDER BY id ASC');
    const appliedMigrations = new Set(appliedRes.rows.map(r => r.name));

    // Read all .sql files in migrations directory
    const files = fs
      .readdirSync(migrationsDir)
      .filter(f => f.endsWith('.sql'))
      .sort();

    console.log(`📂 Found ${files.length} migration file(s) in migrations/:`);
    let appliedCount = 0;

    for (const file of files) {
      if (appliedMigrations.has(file)) {
        console.log(`   ⏭️  [SKIPPED] ${file} (already executed)`);
        continue;
      }

      console.log(`   ⚙️  [APPLYING] ${file}...`);
      const filePath = path.join(migrationsDir, file);
      const sql = fs.readFileSync(filePath, 'utf-8');

      // Execute migration in a transaction
      await client.query('BEGIN');
      try {
        await client.query(sql);
        await client.query('INSERT INTO migrations (name) VALUES ($1)', [file]);
        await client.query('COMMIT');
        console.log(`   ✅ [SUCCESS] ${file} applied successfully.`);
        appliedCount++;
      } catch (migrationErr) {
        await client.query('ROLLBACK');
        console.error(`   ❌ [FAILED] Error applying ${file}:`, migrationErr.message);
        throw migrationErr;
      }
    }

    console.log(`\n✨ Migration complete! ${appliedCount} new migration(s) applied.`);
  } catch (err) {
    console.error('\n❌ Migration failed:', err.message);
    process.exitCode = 1;
  } finally {
    await client.end().catch(() => {});
  }
}

// Run if called directly
if (require.main === module) {
  runMigrations();
}

module.exports = {
  ensureDatabaseExists,
  runMigrations,
};
