/**
 * ========================================================
 * Database & In-Memory Seeder Script
 * File: scripts/seed.js
 * ========================================================
 * 
 * Uses UserFactory and AnnouncementFactory to populate:
 * 1. PostgreSQL Database (if available / online)
 * 2. In-Memory Store (for local runtime & offline development)
 */

const { Client } = require('pg');
const userFactory = require('../factories/userFactory');
const announcementFactory = require('../factories/announcementFactory');
const jobPostingFactory = require('../factories/jobPostingFactory');
const userModel = require('../src/models/userModel');
const announcementModel = require('../src/models/announcementModel');
const jobPostingModel = require('../src/models/jobPostingModel');

const targetDbName = process.env.DB_NAME || process.env.POSTGRES_DB || 'alumni_db';
const dbHost = process.env.DB_HOST || 'localhost';
const dbPort = Number(process.env.DB_PORT) || 5432;
const dbUser = process.env.DB_USER || process.env.POSTGRES_USER || 'postgres';
const dbPassword = process.env.DB_PASSWORD || process.env.POSTGRES_PASSWORD || 'postgres';

/**
 * Seeds data into PostgreSQL database (if reachable)
 * @param {Array<Object>} users 
 * @param {Array<Object>} announcements 
 * @param {Array<Object>} jobPostings
 * @returns {Promise<boolean>} True if PostgreSQL was seeded, false if skipped
 */
async function seedPostgres(users, announcements, jobPostings = []) {
  console.log(`\n🐘 Checking PostgreSQL connection on ${dbHost}:${dbPort}/${targetDbName}...`);

  const client = new Client({
    host: dbHost,
    port: dbPort,
    user: dbUser,
    password: dbPassword,
    database: targetDbName,
    connectionTimeoutMillis: 3000,
  });

  try {
    await client.connect();

    console.log(`🌱 Seeding ${users.length} users into PostgreSQL...`);
    for (const u of users) {
      await client.query(`
        INSERT INTO users (name, email, department, graduation_year, role)
        VALUES ($1, $2, $3, $4, $5)
        ON CONFLICT (email) DO UPDATE SET
          name = EXCLUDED.name,
          department = EXCLUDED.department,
          graduation_year = EXCLUDED.graduation_year,
          role = EXCLUDED.role,
          updated_at = CURRENT_TIMESTAMP;
      `, [u.name, u.email, u.department, u.graduationYear, u.role]);
    }

    console.log(`📢 Seeding ${announcements.length} announcements into PostgreSQL...`);
    for (const a of announcements) {
      await client.query(`
        INSERT INTO announcements (title, content, category, author, priority)
        VALUES ($1, $2, $3, $4, $5);
      `, [a.title, a.content, a.category, a.author, a.priority]);
    }

    if (jobPostings.length > 0) {
      console.log(`💼 Seeding ${jobPostings.length} job postings into PostgreSQL...`);
      for (const j of jobPostings) {
        await client.query(`
          INSERT INTO job_postings (title, company, location, type, description, requirements, salary, contact_email, posted_by)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9);
        `, [j.title, j.company, j.location, j.type, j.description, j.requirements, j.salary, j.contactEmail, j.postedBy]);
      }
    }

    console.log('✅ PostgreSQL seeding completed successfully!');
    return true;
  } catch (err) {
    console.warn(`⚠️  [PostgreSQL Skipped]: ${err.message}`);
    console.warn('👉 In-memory store will be seeded instead.');
    return false;
  } finally {
    await client.end().catch(() => {});
  }
}

/**
 * Seeds data into the in-memory models
 * @param {Array<Object>} users 
 * @param {Array<Object>} announcements 
 * @param {Array<Object>} jobPostings
 */
function seedInMemory(users, announcements, jobPostings = []) {
  console.log(`\n💾 Seeding In-Memory Model Store...`);
  userModel.clear();
  announcementModel.clear();
  jobPostingModel.clear();

  for (const u of users) {
    userModel.create(u);
  }

  for (const a of announcements) {
    announcementModel.create(a);
  }

  for (const j of jobPostings) {
    jobPostingModel.create(j);
  }

  console.log(`✅ In-Memory Seeded: ${userModel.count()} Users, ${announcementModel.count()} Announcements, ${jobPostingModel.count()} Job Postings.`);
}

/**
 * Main seed execution function
 */
async function runSeed() {
  console.log('====================================================');
  console.log('🚀 Alumni Tracking System - Data Seeding Automation');
  console.log('====================================================');

  // Reset factory counters
  userFactory.reset();
  announcementFactory.reset();
  jobPostingFactory.reset();

  // Generate realistic domain records via factories
  const mockUsers = userFactory.buildMany(10);
  const mockAnnouncements = announcementFactory.buildMany(6);
  const mockJobPostings = jobPostingFactory.buildMany(6);

  // 1. Try seeding PostgreSQL
  await seedPostgres(mockUsers, mockAnnouncements, mockJobPostings);

  // 2. Seed In-Memory Store
  seedInMemory(mockUsers, mockAnnouncements, mockJobPostings);

  console.log('\n✨ All data factories and seeders executed successfully!\n');
}

// Run if called directly
if (require.main === module) {
  runSeed().catch(err => {
    console.error('Fatal Seeding Error:', err);
    process.exit(1);
  });
}

module.exports = {
  runSeed,
  seedPostgres,
  seedInMemory,
};
