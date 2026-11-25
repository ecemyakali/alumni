/**
 * ========================================================
 * Admin Seeding Script
 * File: scripts/seed-admin.js
 * ========================================================
 * 
 * Ensures the primary administrator account (Ece Yakalı / admin@alumni.edu)
 * exists with the 'admin' role, active status, and secure bcrypt password.
 * 
 * Usage:
 *   npm run seed:admin
 *   or: node scripts/seed-admin.js
 */

const authUtils = require('../src/utils/authUtils');
const userModel = require('../src/models/userModel');
const db = require('../src/config/db');

const ADMIN_ACCOUNTS = [
  {
    name: 'Ece Yakali',
    email: 'ece@example.com',
    department: 'Computer Engineering',
    graduationYear: 2024,
    role: 'admin',
    status: 'ACTIVE',
    currentRole: 'Lead Platform Architect',
    company: 'Alumni Network',
    password: process.env.ADMIN_PASSWORD || 'AdminPass123!'
  },
  {
    name: 'System Administrator',
    email: 'admin@alumni.edu',
    department: 'System Administration',
    graduationYear: 2020,
    role: 'admin',
    status: 'ACTIVE',
    currentRole: 'Super Administrator',
    company: 'University Alumni Office',
    password: process.env.ADMIN_PASSWORD || 'AdminPass123!'
  }
];

async function seedAdmin() {
  console.log('====================================================');
  console.log('🛡️  Alumni Tracking System - Admin Account Provisioning');
  console.log('====================================================');

  const isDbUp = await db.testConnection();
  console.log(`📡 Database connection status: ${isDbUp ? 'ONLINE (PostgreSQL)' : 'OFFLINE (In-Memory Store)'}`);

  for (const admin of ADMIN_ACCOUNTS) {
    const passwordHash = authUtils.hashPassword(admin.password);

    if (isDbUp) {
      try {
        await db.query(`
          INSERT INTO users (name, email, department, graduation_year, role, status, password_hash)
          VALUES ($1, $2, $3, $4, $5, $6, $7)
          ON CONFLICT (email) DO UPDATE SET
            name = EXCLUDED.name,
            department = EXCLUDED.department,
            graduation_year = EXCLUDED.graduation_year,
            role = EXCLUDED.role,
            status = EXCLUDED.status,
            password_hash = EXCLUDED.password_hash,
            updated_at = CURRENT_TIMESTAMP;
        `, [admin.name, admin.email, admin.department, admin.graduationYear, admin.role, admin.status, passwordHash]);
        console.log(`🐘 [PostgreSQL] Provisioned Admin: ${admin.name} <${admin.email}> (Role: ${admin.role})`);
      } catch (err) {
        console.warn(`⚠️  [PostgreSQL Error]: ${err.message}`);
      }
    }

    // Also populate in-memory model
    const existing = userModel.findByEmail(admin.email);
    if (existing) {
      userModel.update(existing.id, {
        name: admin.name,
        role: admin.role,
        status: admin.status,
        department: admin.department,
        graduationYear: admin.graduationYear,
        passwordHash
      });
      console.log(`💾 [In-Memory] Updated existing user to Admin: ${admin.name} <${admin.email}>`);
    } else {
      userModel.create({
        name: admin.name,
        email: admin.email,
        department: admin.department,
        graduationYear: admin.graduationYear,
        role: admin.role,
        status: admin.status,
        currentRole: admin.currentRole,
        company: admin.company,
        passwordHash
      });
      console.log(`💾 [In-Memory] Created new Admin: ${admin.name} <${admin.email}>`);
    }
  }

  console.log('\n----------------------------------------------------');
  console.log('🔑 ADMIN CREDENTIALS FOR TESTING & ACCESS:');
  console.log('----------------------------------------------------');
  console.log('• User:     Ece Yakali');
  console.log('  Email:    ece@example.com');
  console.log('  Password: AdminPass123!');
  console.log('  Role:     admin');
  console.log('');
  console.log('• User:     System Administrator');
  console.log('  Email:    admin@alumni.edu');
  console.log('  Password: AdminPass123!');
  console.log('  Role:     admin');
  console.log('----------------------------------------------------');
  console.log('👉 Log in at: http://localhost:5000/login');
  console.log('👉 Admin panel: http://localhost:5000/admin\n');
}

if (require.main === module) {
  seedAdmin().then(() => {
    process.exit(0);
  }).catch(err => {
    console.error('Fatal admin seeding error:', err);
    process.exit(1);
  });
}

module.exports = seedAdmin;
