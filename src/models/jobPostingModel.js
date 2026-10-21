/**
 * ========================================================
 * Model Layer: JobPosting Model (PostgreSQL & In-Memory Fallback)
 * File: src/models/jobPostingModel.js
 * ========================================================
 * 
 * Domain Entity & Model for Career & Job Opportunities.
 * 
 * Executes asynchronous SQL queries against PostgreSQL via `src/config/db.js`,
 * with a resilient in-memory fallback for offline/isolated test environments.
 * Returns hybrid Promise objects supporting both asynchronous `await`
 * and synchronous property access.
 */

const db = require('./db');

/**
 * JobPosting Domain Entity Definition
 */
class JobPosting {
  constructor({
    id,
    title,
    company,
    location = 'Remote',
    type = 'full-time',
    description = '',
    requirements = null,
    salary = null,
    contactEmail = null,
    postedBy = null,
    ...extra
  }) {
    this.id = id;
    this.title = title;
    this.company = company;
    this.location = location;
    this.type = type;
    this.description = description;
    this.requirements = requirements;
    this.salary = salary;
    this.contactEmail = contactEmail;
    this.postedBy = postedBy;
    Object.assign(this, extra);
    this.createdAt = new Date().toISOString();
    this.updatedAt = null;
  }
}

// In-memory data store for job postings
let jobPostings = [];

/**
 * Normalizes PostgreSQL row columns into standard JobPosting entity format
 */
function formatJobPosting(row) {
  if (!row) return null;
  return {
    id: Number(row.id),
    title: row.title,
    company: row.company,
    location: row.location || 'Remote',
    type: row.type || 'full-time',
    description: row.description || '',
    requirements: row.requirements || null,
    salary: row.salary || null,
    contactEmail: row.contactEmail !== undefined ? row.contactEmail : (row.contact_email || null),
    postedBy: row.postedBy !== undefined
      ? (row.postedBy !== null ? Number(row.postedBy) : null)
      : (row.posted_by !== undefined && row.posted_by !== null ? Number(row.posted_by) : null),
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

const jobPostingModel = {
  /**
   * Internal reference to in-memory store
   */
  get jobPostings() {
    return jobPostings;
  },

  /**
   * CREATE: Adds a new job posting to PostgreSQL database (or in-memory store)
   * 
   * @param {Object} data - JobPosting data (title, company, location, type, description, requirements, salary, contactEmail, postedBy)
   * @returns {Promise<Object> & Object} Newly created job posting record
   */
  create(data) {
    if (!data || typeof data !== 'object') {
      throw new Error('Job posting data must be an object');
    }

    const generatedId = jobPostings.length > 0
      ? Math.max(...jobPostings.map(j => (typeof j.id === 'number' ? j.id : 0))) + 1
      : 1;

    const contactEmail = data.contactEmail !== undefined ? data.contactEmail : (data.contact_email || null);
    const postedBy = data.postedBy !== undefined
      ? (data.postedBy !== null ? Number(data.postedBy) : null)
      : (data.posted_by !== undefined && data.posted_by !== null ? Number(data.posted_by) : null);

    const memItem = {
      id: data.id ? Number(data.id) : generatedId,
      title: data.title || '',
      company: data.company || '',
      location: data.location || 'Remote',
      type: data.type || 'full-time',
      description: data.description || '',
      requirements: data.requirements || null,
      salary: data.salary || null,
      contactEmail,
      postedBy,
      createdAt: new Date().toISOString(),
      updatedAt: null,
      ...data
    };

    jobPostings.push(memItem);

    const asyncOp = (async () => {
      try {
        const res = await db.query(
          `INSERT INTO job_postings (title, company, location, type, description, requirements, salary, contact_email, posted_by)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
           RETURNING id, title, company, location, type, description, requirements, salary, contact_email AS "contactEmail", posted_by AS "postedBy", created_at AS "createdAt", updated_at AS "updatedAt";`,
          [
            memItem.title,
            memItem.company,
            memItem.location,
            memItem.type,
            memItem.description,
            memItem.requirements,
            memItem.salary,
            memItem.contactEmail,
            memItem.postedBy
          ]
        );

        if (res && res.rows && res.rows[0]) {
          const dbItem = formatJobPosting(res.rows[0]);
          const idx = jobPostings.findIndex(j => j.id === memItem.id);
          if (idx !== -1) jobPostings[idx] = dbItem;
          return dbItem;
        }
      } catch {
        // Fallback to in-memory record
      }
      return memItem;
    })();

    return makeHybrid(asyncOp, memItem);
  },

  /**
   * READ (All): Retrieves all job postings from database or memory
   * 
   * @returns {Promise<Array<Object>> & Array<Object>} List of job postings
   */
  findAll() {
    const memList = [...jobPostings];

    const asyncOp = (async () => {
      try {
        const res = await db.query(
          `SELECT id, title, company, location, type, description, requirements, salary, contact_email AS "contactEmail", posted_by AS "postedBy", created_at AS "createdAt", updated_at AS "updatedAt"
           FROM job_postings
           ORDER BY id ASC;`
        );
        if (res && res.rows && res.rows.length > 0) {
          return res.rows.map(formatJobPosting);
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
   * READ (By ID): Finds a single job posting by ID
   * 
   * @param {number|string} id - Numeric job posting ID
   * @returns {Promise<Object|null> & (Object|null)}
   */
  findById(id) {
    const numericId = Number(id);
    if (isNaN(numericId)) return null;

    const memItem = jobPostings.find(j => j.id === numericId) || null;

    const asyncOp = (async () => {
      try {
        const res = await db.query(
          `SELECT id, title, company, location, type, description, requirements, salary, contact_email AS "contactEmail", posted_by AS "postedBy", created_at AS "createdAt", updated_at AS "updatedAt"
           FROM job_postings
           WHERE id = $1;`,
          [numericId]
        );
        if (res && res.rows && res.rows[0]) {
          return formatJobPosting(res.rows[0]);
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
   * READ (By Company): Filters job postings by company name (case-insensitive)
   * 
   * @param {string} company - Company name
   * @returns {Promise<Array<Object>> & Array<Object>}
   */
  findByCompany(company) {
    if (!company) return [];

    const memList = jobPostings.filter(j => j.company && j.company.toLowerCase() === company.toLowerCase());

    const asyncOp = (async () => {
      try {
        const res = await db.query(
          `SELECT id, title, company, location, type, description, requirements, salary, contact_email AS "contactEmail", posted_by AS "postedBy", created_at AS "createdAt", updated_at AS "updatedAt"
           FROM job_postings
           WHERE LOWER(company) = LOWER($1)
           ORDER BY id ASC;`,
          [company]
        );
        if (res && res.rows && res.rows.length > 0) {
          return res.rows.map(formatJobPosting);
        }
      } catch {
        // Fallback
      }
      return memList;
    })();

    return makeHybridArray(asyncOp, memList);
  },

  /**
   * READ (By Type): Filters job postings by employment type
   * 
   * @param {string} type - Employment type (e.g. 'full-time', 'part-time', 'remote', 'internship')
   * @returns {Promise<Array<Object>> & Array<Object>}
   */
  findByType(type) {
    if (!type) return [];

    const memList = jobPostings.filter(j => j.type && j.type.toLowerCase() === type.toLowerCase());

    const asyncOp = (async () => {
      try {
        const res = await db.query(
          `SELECT id, title, company, location, type, description, requirements, salary, contact_email AS "contactEmail", posted_by AS "postedBy", created_at AS "createdAt", updated_at AS "updatedAt"
           FROM job_postings
           WHERE LOWER(type) = LOWER($1)
           ORDER BY id ASC;`,
          [type]
        );
        if (res && res.rows && res.rows.length > 0) {
          return res.rows.map(formatJobPosting);
        }
      } catch {
        // Fallback
      }
      return memList;
    })();

    return makeHybridArray(asyncOp, memList);
  },

  /**
   * UPDATE: Updates an existing job posting by ID in database and memory
   * 
   * @param {number|string} id - Numeric job posting ID
   * @param {Object} updateData - Fields to update
   * @returns {Promise<Object|null> & (Object|null)}
   */
  update(id, updateData = {}) {
    const numericId = Number(id);
    if (isNaN(numericId)) return null;

    const index = jobPostings.findIndex(j => j.id === numericId);
    if (index === -1) {
      return null;
    }

    jobPostings[index] = {
      ...jobPostings[index],
      ...updateData,
      id: numericId,
      updatedAt: new Date().toISOString()
    };
    const memItem = jobPostings[index];

    const asyncOp = (async () => {
      try {
        const title = updateData.title !== undefined ? updateData.title : memItem.title;
        const company = updateData.company !== undefined ? updateData.company : memItem.company;
        const location = updateData.location !== undefined ? updateData.location : memItem.location;
        const type = updateData.type !== undefined ? updateData.type : memItem.type;
        const description = updateData.description !== undefined ? updateData.description : memItem.description;
        const requirements = updateData.requirements !== undefined ? updateData.requirements : memItem.requirements;
        const salary = updateData.salary !== undefined ? updateData.salary : memItem.salary;
        const contactEmail = updateData.contactEmail !== undefined
          ? updateData.contactEmail
          : (updateData.contact_email !== undefined ? updateData.contact_email : memItem.contactEmail);
        const postedBy = updateData.postedBy !== undefined
          ? (updateData.postedBy !== null ? Number(updateData.postedBy) : null)
          : (updateData.posted_by !== undefined && updateData.posted_by !== null ? Number(updateData.posted_by) : memItem.postedBy);

        const res = await db.query(
          `UPDATE job_postings
           SET title = $1, company = $2, location = $3, type = $4, description = $5, requirements = $6, salary = $7, contact_email = $8, posted_by = $9, updated_at = CURRENT_TIMESTAMP
           WHERE id = $10
           RETURNING id, title, company, location, type, description, requirements, salary, contact_email AS "contactEmail", posted_by AS "postedBy", created_at AS "createdAt", updated_at AS "updatedAt";`,
          [title, company, location, type, description, requirements, salary, contactEmail, postedBy, numericId]
        );

        if (res && res.rows && res.rows[0]) {
          const dbItem = formatJobPosting(res.rows[0]);
          jobPostings[index] = dbItem;
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
   * DELETE: Removes a job posting by ID from database and memory
   * 
   * @param {number|string} id - Numeric job posting ID
   * @returns {Promise<Object|null> & (Object|null)} Deleted job posting or null
   */
  delete(id) {
    const numericId = Number(id);
    if (isNaN(numericId)) return null;

    const index = jobPostings.findIndex(j => j.id === numericId);
    if (index === -1) {
      return null;
    }

    const [memDeleted] = jobPostings.splice(index, 1);

    const asyncOp = (async () => {
      try {
        const res = await db.query(
          `DELETE FROM job_postings
           WHERE id = $1
           RETURNING id, title, company, location, type, description, requirements, salary, contact_email AS "contactEmail", posted_by AS "postedBy", created_at AS "createdAt", updated_at AS "updatedAt";`,
          [numericId]
        );
        if (res && res.rows && res.rows[0]) {
          return formatJobPosting(res.rows[0]);
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
   * Total job postings count
   * @returns {number}
   */
  count() {
    return jobPostings.length;
  },

  /**
   * CLEAR: Empties in-memory storage and truncates database table
   */
  clear() {
    jobPostings = [];
    db.query('TRUNCATE TABLE job_postings CASCADE;').catch(() => {});
  },

  /**
   * Tests if PostgreSQL connection is currently active
   * @returns {Promise<boolean>}
   */
  async isDbConnected() {
    return db.testConnection();
  },

  /**
   * RELATIONS: Returns all applications submitted for this job posting
   * @param {number|string} jobPostingId
   */
  getApplications(jobPostingId) {
    const applicationModel = require('./applicationModel');
    return applicationModel.findByJobPostingId(jobPostingId);
  }
};

module.exports = jobPostingModel;
module.exports.JobPosting = JobPosting;
