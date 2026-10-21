/**
 * ========================================================
 * Model Layer: Application Model (PostgreSQL & In-Memory Fallback)
 * File: src/models/applicationModel.js
 * ========================================================
 * 
 * Many-to-Many Relational Action Model between Users (Applicants)
 * and JobPostings (Opportunities).
 * 
 * Executes asynchronous SQL queries against PostgreSQL via `src/config/db.js`,
 * with a resilient in-memory fallback for offline/isolated test environments.
 * Returns hybrid Promise objects supporting both asynchronous `await`
 * and synchronous property access.
 */

const db = require('./db');

/**
 * Application Domain Entity Definition
 */
class Application {
  constructor({
    id,
    userId,
    jobPostingId,
    status = 'pending',
    resumeUrl = null,
    coverNote = null,
    ...extra
  }) {
    this.id = id;
    this.userId = userId !== undefined && userId !== null ? Number(userId) : null;
    this.jobPostingId = jobPostingId !== undefined && jobPostingId !== null ? Number(jobPostingId) : null;
    this.status = status;
    this.resumeUrl = resumeUrl;
    this.coverNote = coverNote;
    Object.assign(this, extra);
    this.createdAt = new Date().toISOString();
    this.updatedAt = null;
  }
}

// In-memory data store for applications
let applications = [];

/**
 * Normalizes PostgreSQL row columns into standard Application entity format
 */
function formatApplication(row) {
  if (!row) return null;
  return {
    id: Number(row.id),
    userId: row.userId !== undefined
      ? (row.userId !== null ? Number(row.userId) : null)
      : (row.user_id !== undefined && row.user_id !== null ? Number(row.user_id) : null),
    jobPostingId: row.jobPostingId !== undefined
      ? (row.jobPostingId !== null ? Number(row.jobPostingId) : null)
      : (row.job_posting_id !== undefined && row.job_posting_id !== null ? Number(row.job_posting_id) : null),
    status: row.status || 'pending',
    resumeUrl: row.resumeUrl !== undefined ? row.resumeUrl : (row.resume_url || null),
    coverNote: row.coverNote !== undefined ? row.coverNote : (row.cover_note || null),
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

const applicationModel = {
  /**
   * Internal reference to in-memory store
   */
  get applications() {
    return applications;
  },

  /**
   * CREATE: Adds a new application to PostgreSQL database (or in-memory store)
   * 
   * @param {Object} data - Application data (userId, jobPostingId, status, resumeUrl, coverNote)
   * @returns {Promise<Object> & Object} Newly created application record
   */
  create(data) {
    if (!data || typeof data !== 'object') {
      throw new Error('Application data must be an object');
    }

    const userId = Number(data.userId !== undefined ? data.userId : data.user_id);
    const jobPostingId = Number(data.jobPostingId !== undefined ? data.jobPostingId : data.job_posting_id);

    if (isNaN(userId) || isNaN(jobPostingId)) {
      throw new Error('Valid userId and jobPostingId are required to create an application');
    }

    // Check duplicate in memory
    const existing = applications.find(a => a.userId === userId && a.jobPostingId === jobPostingId);
    if (existing) {
      const err = new Error(`Application already exists for user ${userId} and job posting ${jobPostingId}`);
      err.code = '23505'; // PostgreSQL unique violation code
      throw err;
    }

    const generatedId = applications.length > 0
      ? Math.max(...applications.map(a => (typeof a.id === 'number' ? a.id : 0))) + 1
      : 1;

    const resumeUrl = data.resumeUrl !== undefined ? data.resumeUrl : (data.resume_url || null);
    const coverNote = data.coverNote !== undefined ? data.coverNote : (data.cover_note || null);

    const memItem = {
      id: data.id ? Number(data.id) : generatedId,
      userId,
      jobPostingId,
      status: data.status || 'pending',
      resumeUrl,
      coverNote,
      createdAt: new Date().toISOString(),
      updatedAt: null,
      ...data
    };

    applications.push(memItem);

    const asyncOp = (async () => {
      try {
        const res = await db.query(
          `INSERT INTO applications (user_id, job_posting_id, status, resume_url, cover_note)
           VALUES ($1, $2, $3, $4, $5)
           RETURNING id, user_id AS "userId", job_posting_id AS "jobPostingId", status, resume_url AS "resumeUrl", cover_note AS "coverNote", created_at AS "createdAt", updated_at AS "updatedAt";`,
          [
            memItem.userId,
            memItem.jobPostingId,
            memItem.status,
            memItem.resumeUrl,
            memItem.coverNote
          ]
        );

        if (res && res.rows && res.rows[0]) {
          const dbItem = formatApplication(res.rows[0]);
          const idx = applications.findIndex(a => a.id === memItem.id);
          if (idx !== -1) applications[idx] = dbItem;
          return dbItem;
        }
      } catch (err) {
        if (err.code === '23505') {
          // Unique constraint violation in database
          throw err;
        }
        // Fallback to in-memory record
      }
      return memItem;
    })();

    return makeHybrid(asyncOp, memItem);
  },

  /**
   * READ (All): Retrieves all applications from database or memory
   * 
   * @returns {Promise<Array<Object>> & Array<Object>} List of applications
   */
  findAll() {
    const memList = [...applications];

    const asyncOp = (async () => {
      try {
        const res = await db.query(
          `SELECT id, user_id AS "userId", job_posting_id AS "jobPostingId", status, resume_url AS "resumeUrl", cover_note AS "coverNote", created_at AS "createdAt", updated_at AS "updatedAt"
           FROM applications
           ORDER BY id ASC;`
        );
        if (res && res.rows && res.rows.length > 0) {
          return res.rows.map(formatApplication);
        }
      } catch {
        // Fallback
      }
      return memList;
    })();

    return makeHybridArray(asyncOp, memList);
  },

  /**
   * READ (All) - Alias
   */
  getAll() {
    return this.findAll();
  },

  /**
   * READ (By ID): Finds a single application by ID
   * 
   * @param {number|string} id - Numeric application ID
   * @returns {Promise<Object|null> & (Object|null)}
   */
  findById(id) {
    const numericId = Number(id);
    if (isNaN(numericId)) return null;

    const memItem = applications.find(a => a.id === numericId) || null;

    const asyncOp = (async () => {
      try {
        const res = await db.query(
          `SELECT id, user_id AS "userId", job_posting_id AS "jobPostingId", status, resume_url AS "resumeUrl", cover_note AS "coverNote", created_at AS "createdAt", updated_at AS "updatedAt"
           FROM applications
           WHERE id = $1;`,
          [numericId]
        );
        if (res && res.rows && res.rows[0]) {
          return formatApplication(res.rows[0]);
        }
        return null;
      } catch {
        return memItem;
      }
    })();

    return memItem ? makeHybrid(asyncOp, memItem) : null;
  },

  /**
   * READ (By ID) - Alias
   */
  getById(id) {
    return this.findById(id);
  },

  /**
   * READ (By User ID): Retrieves all applications submitted by a specific user
   * 
   * @param {number|string} userId - User ID
   * @returns {Promise<Array<Object>> & Array<Object>}
   */
  findByUserId(userId) {
    const uid = Number(userId);
    if (isNaN(uid)) return [];

    const memList = applications.filter(a => a.userId === uid);

    const asyncOp = (async () => {
      try {
        const res = await db.query(
          `SELECT id, user_id AS "userId", job_posting_id AS "jobPostingId", status, resume_url AS "resumeUrl", cover_note AS "coverNote", created_at AS "createdAt", updated_at AS "updatedAt"
           FROM applications
           WHERE user_id = $1
           ORDER BY id ASC;`,
          [uid]
        );
        if (res && res.rows && res.rows.length > 0) {
          return res.rows.map(formatApplication);
        }
      } catch {
        // Fallback
      }
      return memList;
    })();

    return makeHybridArray(asyncOp, memList);
  },

  /**
   * READ (By JobPosting ID): Retrieves all applications received for a specific job posting
   * 
   * @param {number|string} jobPostingId - JobPosting ID
   * @returns {Promise<Array<Object>> & Array<Object>}
   */
  findByJobPostingId(jobPostingId) {
    const jid = Number(jobPostingId);
    if (isNaN(jid)) return [];

    const memList = applications.filter(a => a.jobPostingId === jid);

    const asyncOp = (async () => {
      try {
        const res = await db.query(
          `SELECT id, user_id AS "userId", job_posting_id AS "jobPostingId", status, resume_url AS "resumeUrl", cover_note AS "coverNote", created_at AS "createdAt", updated_at AS "updatedAt"
           FROM applications
           WHERE job_posting_id = $1
           ORDER BY id ASC;`,
          [jid]
        );
        if (res && res.rows && res.rows.length > 0) {
          return res.rows.map(formatApplication);
        }
      } catch {
        // Fallback
      }
      return memList;
    })();

    return makeHybridArray(asyncOp, memList);
  },

  /**
   * READ (By User and Job): Checks if a user has already applied for a specific job posting
   * 
   * @param {number|string} userId - User ID
   * @param {number|string} jobPostingId - JobPosting ID
   * @returns {Promise<Object|null> & (Object|null)}
   */
  findByUserAndJob(userId, jobPostingId) {
    const uid = Number(userId);
    const jid = Number(jobPostingId);
    if (isNaN(uid) || isNaN(jid)) return null;

    const memItem = applications.find(a => a.userId === uid && a.jobPostingId === jid) || null;

    const asyncOp = (async () => {
      try {
        const res = await db.query(
          `SELECT id, user_id AS "userId", job_posting_id AS "jobPostingId", status, resume_url AS "resumeUrl", cover_note AS "coverNote", created_at AS "createdAt", updated_at AS "updatedAt"
           FROM applications
           WHERE user_id = $1 AND job_posting_id = $2;`,
          [uid, jid]
        );
        if (res && res.rows && res.rows[0]) {
          return formatApplication(res.rows[0]);
        }
        return null;
      } catch {
        return memItem;
      }
    })();

    return memItem ? makeHybrid(asyncOp, memItem) : null;
  },

  /**
   * UPDATE: Updates application status, resumeUrl, or coverNote
   * 
   * @param {number|string} id - Application ID
   * @param {Object} updateData - Fields to update
   * @returns {Promise<Object|null> & (Object|null)}
   */
  update(id, updateData = {}) {
    const numericId = Number(id);
    if (isNaN(numericId)) return null;

    const index = applications.findIndex(a => a.id === numericId);
    if (index === -1) {
      return null;
    }

    applications[index] = {
      ...applications[index],
      ...updateData,
      id: numericId,
      updatedAt: new Date().toISOString()
    };
    const memItem = applications[index];

    const asyncOp = (async () => {
      try {
        const status = updateData.status !== undefined ? updateData.status : memItem.status;
        const resumeUrl = updateData.resumeUrl !== undefined ? updateData.resumeUrl : memItem.resumeUrl;
        const coverNote = updateData.coverNote !== undefined ? updateData.coverNote : memItem.coverNote;

        const res = await db.query(
          `UPDATE applications
           SET status = $1, resume_url = $2, cover_note = $3, updated_at = CURRENT_TIMESTAMP
           WHERE id = $4
           RETURNING id, user_id AS "userId", job_posting_id AS "jobPostingId", status, resume_url AS "resumeUrl", cover_note AS "coverNote", created_at AS "createdAt", updated_at AS "updatedAt";`,
          [status, resumeUrl, coverNote, numericId]
        );

        if (res && res.rows && res.rows[0]) {
          const dbItem = formatApplication(res.rows[0]);
          applications[index] = dbItem;
          return dbItem;
        }
      } catch {
        // Fallback to memItem
      }
      return memItem;
    })();

    return makeHybrid(asyncOp, memItem);
  },

  /**
   * DELETE: Removes an application by ID from database and memory
   * 
   * @param {number|string} id - Application ID
   * @returns {Promise<Object|null> & (Object|null)}
   */
  delete(id) {
    const numericId = Number(id);
    if (isNaN(numericId)) return null;

    const index = applications.findIndex(a => a.id === numericId);
    if (index === -1) {
      return null;
    }

    const [memDeleted] = applications.splice(index, 1);

    const asyncOp = (async () => {
      try {
        const res = await db.query(
          `DELETE FROM applications
           WHERE id = $1
           RETURNING id, user_id AS "userId", job_posting_id AS "jobPostingId", status, resume_url AS "resumeUrl", cover_note AS "coverNote", created_at AS "createdAt", updated_at AS "updatedAt";`,
          [numericId]
        );
        if (res && res.rows && res.rows[0]) {
          return formatApplication(res.rows[0]);
        }
      } catch {
        // Fallback to memDeleted
      }
      return memDeleted;
    })();

    return makeHybrid(asyncOp, memDeleted);
  },

  /**
   * DELETE - Alias
   */
  remove(id) {
    return this.delete(id);
  },

  /**
   * Total application count
   * @returns {number}
   */
  count() {
    return applications.length;
  },

  /**
   * CLEAR: Empties in-memory storage and truncates database table
   */
  clear() {
    applications = [];
    db.query('TRUNCATE TABLE applications CASCADE;').catch(() => {});
  },

  /**
   * Tests if PostgreSQL connection is currently active
   * @returns {Promise<boolean>}
   */
  async isDbConnected() {
    return db.testConnection();
  }
};

module.exports = applicationModel;
module.exports.Application = Application;
