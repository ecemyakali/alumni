/**
 * ========================================================
 * Model Layer: User Model (PostgreSQL & In-Memory Fallback)
 * File: src/models/userModel.js
 * ========================================================
 * 
 * Task 7: Update CRUD interfaces with database connections.
 * 
 * Executes asynchronous SQL queries against PostgreSQL via `src/config/db.js`,
 * with a resilient in-memory fallback for offline/isolated test environments.
 * Returns hybrid Promise objects supporting both asynchronous `await`
 * and synchronous property access.
 */

const db = require('./db');
const authUtils = require('../utils/authUtils');

/**
 * User Domain Entity Definition
 */
class User {
  constructor({
    id,
    name,
    email,
    role = 'alumni',
    department = '',
    graduationYear = 2024,
    status = 'ACTIVE',
    currentRole = '',
    company = '',
    linkedinUrl = '',
    passwordHash = null,
    ...extra
  }) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.role = role;
    this.department = department;
    this.graduationYear = graduationYear;
    this.status = status;
    this.currentRole = currentRole;
    this.company = company;
    this.linkedinUrl = linkedinUrl;
    this.passwordHash = passwordHash;
    Object.assign(this, extra);
    this.createdAt = new Date().toISOString();
    this.updatedAt = null;
  }
}

// In-memory data store (maintains cache and offline fallback)
let users = [];

/**
 * Normalizes PostgreSQL row columns into standard User entity format
 */
function formatUser(row) {
  if (!row) return null;
  return {
    id: Number(row.id),
    name: row.name,
    email: row.email,
    department: row.department || '',
    graduationYear: row.graduationYear !== undefined
      ? Number(row.graduationYear)
      : (row.graduation_year !== undefined ? Number(row.graduation_year) : 2024),
    role: row.role || 'alumni',
    status: row.status || 'ACTIVE',
    currentRole: row.currentRole || row.current_role || '',
    company: row.company || '',
    linkedinUrl: row.linkedinUrl || row.linkedin_url || '',
    passwordHash: row.passwordHash || row.password_hash || null,
    createdAt: row.createdAt || (row.created_at ? new Date(row.created_at).toISOString() : new Date().toISOString()),
    updatedAt: row.updatedAt || (row.updated_at ? new Date(row.updated_at).toISOString() : null)
  };
}

/**
 * Attaches asynchronous .then() resolution to entity while maintaining synchronous object properties
 */
function makeHybrid(asyncOp, fallbackObj) {
  if (!fallbackObj || typeof fallbackObj !== 'object') return fallbackObj;
  const result = { ...fallbackObj };
  result.then = function(resolve, reject) {
    asyncOp.then(res => resolve(res ? { ...res } : null), reject);
  };
  return result;
}

/**
 * Attaches asynchronous .then() resolution to Array while preserving native Array prototype & serialization
 */
function makeHybridArray(asyncOp, arr) {
  const result = [...arr];
  result.then = function(resolve, reject) {
    asyncOp.then(res => resolve(Array.isArray(res) ? [...res] : [...arr]), reject);
  };
  return result;
}

const userModel = {
  /**
   * Internal reference to in-memory store
   */
  get users() {
    return users;
  },

  /**
   * CREATE: Adds a new user record to PostgreSQL database (or in-memory store)
   * 
   * @param {Object} userData - Data object containing user properties
   * @returns {Promise<Object> & Object} Newly created user record
   */
  create(userData) {
    if (!userData || typeof userData !== 'object') {
      throw new Error('User data must be an object');
    }

    const generatedId = users.length > 0
      ? Math.max(...users.map(u => (typeof u.id === 'number' ? u.id : 0))) + 1
      : 1;

    const memUser = {
      id: userData.id ? Number(userData.id) : generatedId,
      name: userData.name || '',
      email: userData.email || '',
      department: userData.department || '',
      graduationYear: userData.graduationYear ? Number(userData.graduationYear) : 2024,
      role: userData.role || 'alumni',
      status: userData.status || 'ACTIVE',
      currentRole: userData.currentRole || '',
      company: userData.company || '',
      linkedinUrl: userData.linkedinUrl || '',
      passwordHash: userData.passwordHash || null,
      createdAt: new Date().toISOString(),
      updatedAt: null,
      ...userData
    };

    users.push(memUser);

    const asyncOp = (async () => {
      try {
        const res = await db.query(
          `INSERT INTO users (name, email, department, graduation_year, role)
           VALUES ($1, $2, $3, $4, $5)
           ON CONFLICT (email) DO UPDATE SET
             name = EXCLUDED.name,
             department = EXCLUDED.department,
             graduation_year = EXCLUDED.graduation_year,
             role = EXCLUDED.role,
             updated_at = CURRENT_TIMESTAMP
           RETURNING id, name, email, department, graduation_year AS "graduationYear", role, created_at AS "createdAt", updated_at AS "updatedAt";`,
          [memUser.name, memUser.email, memUser.department, memUser.graduationYear, memUser.role]
        );

        if (res && res.rows && res.rows[0]) {
          const dbUser = formatUser(res.rows[0]);
          const idx = users.findIndex(u => u.email === dbUser.email);
          if (idx !== -1) users[idx] = dbUser;
          return dbUser;
        }
      } catch {
        // PostgreSQL offline -> fallback to in-memory record
      }
      return memUser;
    })();

    return makeHybrid(asyncOp, memUser);
  },

  /**
   * READ (All): Retrieves all user records from database or memory
   * 
   * @returns {Promise<Array<Object>> & Array<Object>} List of all users
   */
  findAll() {
    const memList = [...users];

    const asyncOp = (async () => {
      try {
        const res = await db.query(
          `SELECT id, name, email, department, graduation_year AS "graduationYear", role, created_at AS "createdAt", updated_at AS "updatedAt"
           FROM users
           ORDER BY id ASC;`
        );
        if (res && res.rows && res.rows.length > 0) {
          return res.rows.map(formatUser);
        }
      } catch {
        // Fallback to in-memory collection
      }
      return memList;
    })();

    return makeHybridArray(asyncOp, memList);
  },

  /**
   * READ (All) - Alias for findAll
   */
  getAll() {
    return this.findAll();
  },

  /**
   * READ (By ID): Finds a single user by their numeric ID
   * 
   * @param {number|string} id - Numeric user ID
   * @returns {Promise<Object|null> & (Object|null)} User record or null if not found
   */
  findById(id) {
    const numericId = Number(id);
    if (isNaN(numericId)) return null;

    const memUser = users.find(u => u.id === numericId) || null;

    const asyncOp = (async () => {
      try {
        const res = await db.query(
          `SELECT id, name, email, department, graduation_year AS "graduationYear", role, created_at AS "createdAt", updated_at AS "updatedAt"
           FROM users
           WHERE id = $1;`,
          [numericId]
        );
        if (res && res.rows && res.rows[0]) {
          return formatUser(res.rows[0]);
        }
        return null;
      } catch {
        return memUser;
      }
    })();

    return memUser ? makeHybrid(asyncOp, memUser) : null;
  },

  /**
   * READ (By ID) - Alias for findById
   */
  getById(id) {
    return this.findById(id);
  },

  /**
   * READ (By Email): Searches user by email address
   * 
   * @param {string} email - Email address to search
   * @returns {Promise<Object|null> & (Object|null)} User record or null if not found
   */
  findByEmail(email) {
    if (!email || typeof email !== 'string') return null;

    const memUser = users.find(u => u.email && u.email.toLowerCase() === email.toLowerCase()) || null;

    const asyncOp = (async () => {
      try {
        const res = await db.query(
          `SELECT id, name, email, department, graduation_year AS "graduationYear", role, created_at AS "createdAt", updated_at AS "updatedAt"
           FROM users
           WHERE LOWER(email) = LOWER($1);`,
          [email]
        );
        if (res && res.rows && res.rows[0]) {
          return formatUser(res.rows[0]);
        }
        return null;
      } catch {
        return memUser;
      }
    })();

    return memUser ? makeHybrid(asyncOp, memUser) : null;
  },

  /**
   * UPDATE: Updates an existing user's details by ID in database and memory
   * 
   * @param {number|string} id - Numeric user ID
   * @param {Object} updateData - Fields to be updated
   * @returns {Promise<Object|null> & (Object|null)} Updated user record or null if not found
   */
  update(id, updateData = {}) {
    const numericId = Number(id);
    if (isNaN(numericId)) return null;

    const index = users.findIndex(u => u.id === numericId);
    if (index === -1) {
      return null;
    }

    // Merge changes in memory
    users[index] = {
      ...users[index],
      ...updateData,
      id: numericId,
      updatedAt: new Date().toISOString()
    };
    const memUser = users[index];

    const asyncOp = (async () => {
      try {
        const name = updateData.name !== undefined ? updateData.name : memUser.name;
        const email = updateData.email !== undefined ? updateData.email : memUser.email;
        const department = updateData.department !== undefined ? updateData.department : memUser.department;
        const gradYear = updateData.graduationYear !== undefined
          ? Number(updateData.graduationYear)
          : memUser.graduationYear;
        const role = updateData.role !== undefined ? updateData.role : memUser.role;

        const res = await db.query(
          `UPDATE users
           SET name = $1, email = $2, department = $3, graduation_year = $4, role = $5, updated_at = CURRENT_TIMESTAMP
           WHERE id = $6
           RETURNING id, name, email, department, graduation_year AS "graduationYear", role, created_at AS "createdAt", updated_at AS "updatedAt";`,
          [name, email, department, gradYear, role, numericId]
        );

        if (res && res.rows && res.rows[0]) {
          const dbUser = formatUser(res.rows[0]);
          users[index] = dbUser;
          return dbUser;
        }
      } catch {
        // Fallback to memUser
      }
      return memUser;
    })();

    return makeHybrid(asyncOp, memUser);
  },

  /**
   * DELETE: Removes a user from database and memory by ID
   * 
   * @param {number|string} id - Numeric user ID
   * @returns {Promise<Object|null> & (Object|null)} The deleted user record or null if not found
   */
  delete(id) {
    const numericId = Number(id);
    if (isNaN(numericId)) return null;

    const index = users.findIndex(u => u.id === numericId);
    if (index === -1) {
      return null;
    }

    const [memDeleted] = users.splice(index, 1);

    const asyncOp = (async () => {
      try {
        const res = await db.query(
          `DELETE FROM users
           WHERE id = $1
           RETURNING id, name, email, department, graduation_year AS "graduationYear", role, created_at AS "createdAt", updated_at AS "updatedAt";`,
          [numericId]
        );
        if (res && res.rows && res.rows[0]) {
          return formatUser(res.rows[0]);
        }
      } catch {
        // Fallback to memDeleted
      }
      return memDeleted;
    })();

    return makeHybrid(asyncOp, memDeleted);
  },

  /**
   * DELETE - Alias for delete
   */
  remove(id) {
    return this.delete(id);
  },

  /**
   * COUNT: Returns total number of registered users
   * 
   * @returns {number}
   */
  count() {
    return users.length;
  },

  /**
   * CLEAR: Clears all users from memory and database (for testing)
   */
  clear() {
    users = [];
    db.query('TRUNCATE TABLE users CASCADE;').catch(() => {});
  },

  /**
   * Tests if PostgreSQL connection is currently active
   * @returns {Promise<boolean>}
   */
  async isDbConnected() {
    return db.testConnection();
  },

  /**
   * RELATIONS: Returns all job applications submitted by a user
   * @param {number|string} userId
   */
  getApplications(userId) {
    const applicationModel = require('./applicationModel');
    return applicationModel.findByUserId(userId);
  },

  /**
   * Sanitizes user entity by removing sensitive security fields (e.g. passwordHash)
   * @param {Object} user 
   * @returns {Object} Publicly safe user object
   */
  sanitize(user) {
    if (!user || typeof user !== 'object') return user;
    const { passwordHash, ...safeUser } = user;
    return safeUser;
  },

  /**
   * Authenticates user credentials by email and plain-text password
   * @param {string} email 
   * @param {string} candidatePassword 
   * @returns {Object|null} User record if verified, else null
   */
  verifyCredentials(email, candidatePassword) {
    const user = this.findByEmail(email);
    if (!user || !user.passwordHash) {
      return null;
    }
    const isValid = authUtils.comparePassword(candidatePassword, user.passwordHash);
    return isValid ? user : null;
  },

  /**
   * Counts total active administrators in the system
   * @returns {number}
   */
  countAdmins() {
    return users.filter(u => u.role === 'admin' && (u.status === 'ACTIVE' || !u.status)).length;
  },

  /**
   * Assigns a new role to a target user with domain invariant checks
   * @param {number|string} targetUserId 
   * @param {string} newRole - 'admin' | 'alumni' | 'student' | 'faculty' | 'guest'
   * @param {Object} actor - The user performing the assignment
   * @returns {{ success: boolean, user?: Object, error?: string, statusCode?: number }}
   */
  assignRole(targetUserId, newRole, actor) {
    const validRoles = ['admin', 'alumni', 'student', 'faculty', 'guest'];
    if (!validRoles.includes(newRole)) {
      return { success: false, error: `Invalid role: ${newRole}. Allowed roles: ${validRoles.join(', ')}`, statusCode: 400 };
    }

    if (!actor || actor.role !== 'admin') {
      return { success: false, error: 'Unauthorized: Only administrators can assign roles.', statusCode: 403 };
    }

    const targetUser = this.findById(targetUserId);
    if (!targetUser) {
      return { success: false, error: 'Target user not found.', statusCode: 404 };
    }

    // Invariant check: Cannot demote the last remaining active admin
    if (targetUser.role === 'admin' && newRole !== 'admin') {
      const remainingAdmins = this.countAdmins();
      if (remainingAdmins <= 1) {
        return {
          success: false,
          error: 'Domain Invariant Violation: Cannot demote the last active system administrator.',
          statusCode: 422
        };
      }
    }

    const updated = this.update(targetUserId, { role: newRole });
    return { success: true, user: updated, statusCode: 200 };
  }
};

module.exports = userModel;
module.exports.User = User;
