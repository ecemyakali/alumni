/**
 * ========================================================
 * Admin Privilege CLI Utility
 * File: scripts/make-admin.js
 * ========================================================
 * 
 * Promotes an existing user to 'admin' role or creates a new administrator.
 * 
 * Usage:
 *   npm run admin:make <email>
 *   node scripts/make-admin.js ece@example.com
 */

const authUtils = require('../src/utils/authUtils');
const userModel = require('../src/models/userModel');
const db = require('../src/config/db');

async function makeAdmin() {
  const email = process.argv[2];

  if (!email) {
    console.error('❌ Error: Email address required.');
    console.log('Usage: npm run admin:make <email>');
    console.log('Example: npm run admin:make ece@example.com');
    process.exit(1);
  }

  const normalizedEmail = email.trim().toLowerCase();
  console.log(`🛡️ Promoting user "${normalizedEmail}" to Administrator role...`);

  const isDbUp = await db.testConnection();
  console.log(`📡 Database status: ${isDbUp ? 'ONLINE (PostgreSQL)' : 'OFFLINE (In-Memory Store)'}`);

  const defaultPassword = process.env.ADMIN_PASSWORD || 'AdminPass123!';
  const passwordHash = authUtils.hashPassword(defaultPassword);

  let updated = false;

  // 1. Update in PostgreSQL if online
  if (isDbUp) {
    try {
      const res = await db.query(
        `UPDATE users
         SET role = 'admin', status = 'ACTIVE', updated_at = CURRENT_TIMESTAMP
         WHERE LOWER(email) = LOWER($1)
         RETURNING id, name, email, role, status;`,
        [normalizedEmail]
      );

      if (res && res.rows && res.rows.length > 0) {
        console.log(`🐘 [PostgreSQL] Promoted existing user: ${res.rows[0].name} <${res.rows[0].email}> to role "${res.rows[0].role}".`);
        updated = true;
      } else {
        // Create user as admin if not present
        const insertRes = await db.query(
          `INSERT INTO users (name, email, department, graduation_year, role, status, password_hash)
           VALUES ($1, $2, 'Platform Administration', 2024, 'admin', 'ACTIVE', $3)
           RETURNING id, name, email, role, status;`,
          [normalizedEmail.split('@')[0], normalizedEmail, passwordHash]
        );
        console.log(`🐘 [PostgreSQL] Created new admin user: ${insertRes.rows[0].email} with role "${insertRes.rows[0].role}".`);
        updated = true;
      }
    } catch (err) {
      console.warn(`⚠️ [PostgreSQL Warning]: ${err.message}`);
    }
  }

  // 2. Update in-memory userModel
  const existing = userModel.findByEmail(normalizedEmail);
  if (existing) {
    userModel.update(existing.id, {
      role: 'admin',
      status: 'ACTIVE'
    });
    console.log(`💾 [In-Memory] Promoted user #${existing.id} (${existing.name}) to role "admin".`);
    updated = true;
  } else {
    userModel.create({
      name: normalizedEmail.split('@')[0],
      email: normalizedEmail,
      department: 'Platform Administration',
      graduationYear: 2024,
      role: 'admin',
      status: 'ACTIVE',
      passwordHash
    });
    console.log(`💾 [In-Memory] Created new admin user <${normalizedEmail}> with role "admin".`);
    updated = true;
  }

  if (updated) {
    console.log('✅ Admin promotion completed successfully.');
    console.log(`🔑 Credentials hint: Login at /login with password: ${defaultPassword}`);
    process.exit(0);
  } else {
    console.error('❌ Failed to promote user to admin.');
    process.exit(1);
  }
}

if (require.main === module) {
  makeAdmin().catch(err => {
    console.error('Fatal error during makeAdmin:', err);
    process.exit(1);
  });
}

module.exports = { makeAdmin };
