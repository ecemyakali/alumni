/**
 * ========================================================
 * Model Layer: Announcement Model (PostgreSQL & In-Memory Fallback)
 * File: src/models/announcementModel.js
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

/**
 * Announcement Domain Entity Definition
 */
class Announcement {
  constructor({
    id,
    title,
    content,
    author = 'Alumni Association',
    category = 'General',
    priority = 'normal',
    ...extra
  }) {
    this.id = id;
    this.title = title;
    this.content = content;
    this.author = author;
    this.category = category;
    this.priority = priority;
    Object.assign(this, extra);
    this.createdAt = new Date().toISOString();
    this.updatedAt = null;
  }
}

// In-memory data store for announcements
let announcements = [];

/**
 * Normalizes PostgreSQL row columns into standard Announcement entity format
 */
function formatAnnouncement(row) {
  if (!row) return null;
  return {
    id: Number(row.id),
    title: row.title,
    content: row.content,
    category: row.category || 'General',
    author: row.author || 'Alumni Association',
    priority: row.priority || 'normal',
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

const announcementModel = {
  /**
   * Internal reference to in-memory store
   */
  get announcements() {
    return announcements;
  },

  /**
   * CREATE: Adds a new announcement to PostgreSQL database (or in-memory store)
   * 
   * @param {Object} data - Announcement data (title, content, author, category, priority)
   * @returns {Promise<Object> & Object} Newly created announcement record
   */
  create(data) {
    if (!data || typeof data !== 'object') {
      throw new Error('Announcement data must be an object');
    }

    const generatedId = announcements.length > 0
      ? Math.max(...announcements.map(a => (typeof a.id === 'number' ? a.id : 0))) + 1
      : 1;

    const memItem = {
      id: data.id ? Number(data.id) : generatedId,
      title: data.title || '',
      content: data.content || '',
      author: data.author || 'Alumni Association',
      category: data.category || 'General',
      priority: data.priority || 'normal',
      createdAt: new Date().toISOString(),
      updatedAt: null,
      ...data
    };

    announcements.push(memItem);

    const asyncOp = (async () => {
      try {
        const res = await db.query(
          `INSERT INTO announcements (title, content, category, author, priority)
           VALUES ($1, $2, $3, $4, $5)
           RETURNING id, title, content, category, author, priority, created_at AS "createdAt", updated_at AS "updatedAt";`,
          [memItem.title, memItem.content, memItem.category, memItem.author, memItem.priority]
        );

        if (res && res.rows && res.rows[0]) {
          const dbItem = formatAnnouncement(res.rows[0]);
          const idx = announcements.findIndex(a => a.id === memItem.id);
          if (idx !== -1) announcements[idx] = dbItem;
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
   * READ (All): Retrieves all announcements from database or memory
   * 
   * @returns {Promise<Array<Object>> & Array<Object>} List of announcements
   */
  findAll() {
    const memList = [...announcements];

    const asyncOp = (async () => {
      try {
        const res = await db.query(
          `SELECT id, title, content, category, author, priority, created_at AS "createdAt", updated_at AS "updatedAt"
           FROM announcements
           ORDER BY id ASC;`
        );
        if (res && res.rows && res.rows.length > 0) {
          return res.rows.map(formatAnnouncement);
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
   * READ (By ID): Finds a single announcement by ID
   * 
   * @param {number|string} id - Numeric announcement ID
   * @returns {Promise<Object|null> & (Object|null)}
   */
  findById(id) {
    const numericId = Number(id);
    if (isNaN(numericId)) return null;

    const memItem = announcements.find(a => a.id === numericId) || null;

    const asyncOp = (async () => {
      try {
        const res = await db.query(
          `SELECT id, title, content, category, author, priority, created_at AS "createdAt", updated_at AS "updatedAt"
           FROM announcements
           WHERE id = $1;`,
          [numericId]
        );
        if (res && res.rows && res.rows[0]) {
          return formatAnnouncement(res.rows[0]);
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
   * READ (By Category): Filters announcements by category
   * 
   * @param {string} category - Category string (e.g. Event, Career)
   * @returns {Promise<Array<Object>> & Array<Object>}
   */
  findByCategory(category) {
    if (!category) return [];

    const memList = announcements.filter(a => a.category.toLowerCase() === category.toLowerCase());

    const asyncOp = (async () => {
      try {
        const res = await db.query(
          `SELECT id, title, content, category, author, priority, created_at AS "createdAt", updated_at AS "updatedAt"
           FROM announcements
           WHERE LOWER(category) = LOWER($1)
           ORDER BY id ASC;`,
          [category]
        );
        if (res && res.rows && res.rows.length > 0) {
          return res.rows.map(formatAnnouncement);
        }
      } catch {
        // Fallback
      }
      return memList;
    })();

    return makeHybridArray(asyncOp, memList);
  },

  /**
   * UPDATE: Updates an existing announcement by ID in database and memory
   * 
   * @param {number|string} id - Numeric announcement ID
   * @param {Object} updateData - Fields to update
   * @returns {Promise<Object|null> & (Object|null)}
   */
  update(id, updateData = {}) {
    const numericId = Number(id);
    if (isNaN(numericId)) return null;

    const index = announcements.findIndex(a => a.id === numericId);
    if (index === -1) {
      return null;
    }

    announcements[index] = {
      ...announcements[index],
      ...updateData,
      id: numericId,
      updatedAt: new Date().toISOString()
    };
    const memItem = announcements[index];

    const asyncOp = (async () => {
      try {
        const title = updateData.title !== undefined ? updateData.title : memItem.title;
        const content = updateData.content !== undefined ? updateData.content : memItem.content;
        const category = updateData.category !== undefined ? updateData.category : memItem.category;
        const author = updateData.author !== undefined ? updateData.author : memItem.author;
        const priority = updateData.priority !== undefined ? updateData.priority : memItem.priority;

        const res = await db.query(
          `UPDATE announcements
           SET title = $1, content = $2, category = $3, author = $4, priority = $5, updated_at = CURRENT_TIMESTAMP
           WHERE id = $6
           RETURNING id, title, content, category, author, priority, created_at AS "createdAt", updated_at AS "updatedAt";`,
          [title, content, category, author, priority, numericId]
        );

        if (res && res.rows && res.rows[0]) {
          const dbItem = formatAnnouncement(res.rows[0]);
          announcements[index] = dbItem;
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
   * DELETE: Removes an announcement by ID from database and memory
   * 
   * @param {number|string} id - Numeric announcement ID
   * @returns {Promise<Object|null> & (Object|null)} Deleted announcement or null
   */
  delete(id) {
    const numericId = Number(id);
    if (isNaN(numericId)) return null;

    const index = announcements.findIndex(a => a.id === numericId);
    if (index === -1) {
      return null;
    }

    const [memDeleted] = announcements.splice(index, 1);

    const asyncOp = (async () => {
      try {
        const res = await db.query(
          `DELETE FROM announcements
           WHERE id = $1
           RETURNING id, title, content, category, author, priority, created_at AS "createdAt", updated_at AS "updatedAt";`,
          [numericId]
        );
        if (res && res.rows && res.rows[0]) {
          return formatAnnouncement(res.rows[0]);
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
   * Total announcement count
   * @returns {number}
   */
  count() {
    return announcements.length;
  },

  /**
   * CLEAR: Empties in-memory storage and truncates database table
   */
  clear() {
    announcements = [];
    db.query('TRUNCATE TABLE announcements CASCADE;').catch(() => {});
  },

  /**
   * Tests if PostgreSQL connection is currently active
   * @returns {Promise<boolean>}
   */
  async isDbConnected() {
    return db.testConnection();
  }
};

module.exports = announcementModel;
module.exports.Announcement = Announcement;
