/**
 * ========================================================
 * Model Layer: Announcement Model (In-Memory Without Database)
 * File: src/models/announcementModel.js
 * ========================================================
 * 
 * Homework: Create Announcement model without database connection.
 * Includes complete CRUD (Create, Read, Update, Delete) operations.
 * 
 * Represents announcements, news, events, and job postings
 * in the Alumni Tracking System.
 */

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
    this.priority = priority; // low, normal, high, urgent
    Object.assign(this, extra);
    this.createdAt = new Date().toISOString();
    this.updatedAt = null;
  }
}

// In-memory data store for announcements
let announcements = [];

const announcementModel = {
  /**
   * CREATE: Adds a new announcement to in-memory storage
   * 
   * @param {Object} data - Announcement data (title, content, author, category, priority)
   * @returns {Object} Newly created announcement record
   */
  create(data) {
    if (!data || typeof data !== 'object') {
      throw new Error('Announcement data must be an object');
    }

    const generatedId = announcements.length > 0
      ? Math.max(...announcements.map(a => (typeof a.id === 'number' ? a.id : 0))) + 1
      : 1;

    const newAnnouncement = {
      id: data.id ? Number(data.id) : generatedId,
      title: data.title || '',
      content: data.content || '',
      author: data.author || 'Alumni Office',
      category: data.category || 'General',
      priority: data.priority || 'normal',
      createdAt: new Date().toISOString()
    };

    announcements.push(newAnnouncement);
    return newAnnouncement;
  },

  /**
   * READ (All): Retrieves all announcements
   * 
   * @returns {Array<Object>} List of announcements
   */
  findAll() {
    return announcements;
  },

  /**
   * READ (All) - Alias
   * @returns {Array<Object>}
   */
  getAll() {
    return this.findAll();
  },

  /**
   * READ (By ID): Finds a single announcement by ID
   * 
   * @param {number|string} id - Numeric announcement ID
   * @returns {Object|null}
   */
  findById(id) {
    const numericId = Number(id);
    const item = announcements.find(a => a.id === numericId);
    return item || null;
  },

  /**
   * READ (By ID) - Alias
   * @param {number|string} id
   * @returns {Object|null}
   */
  getById(id) {
    return this.findById(id);
  },

  /**
   * READ (By Category): Filters announcements by category
   * 
   * @param {string} category - Category string (e.g. Event, Career)
   * @returns {Array<Object>}
   */
  findByCategory(category) {
    if (!category) return [];
    return announcements.filter(a => a.category.toLowerCase() === category.toLowerCase());
  },

  /**
   * UPDATE: Updates an existing announcement by ID
   * 
   * @param {number|string} id - Numeric announcement ID
   * @param {Object} updateData - Fields to update
   * @returns {Object|null}
   */
  update(id, updateData) {
    const numericId = Number(id);
    const index = announcements.findIndex(a => a.id === numericId);

    if (index === -1) {
      return null;
    }

    announcements[index] = {
      ...announcements[index],
      ...updateData,
      id: numericId, // Immutable ID
      updatedAt: new Date().toISOString()
    };

    return announcements[index];
  },

  /**
   * DELETE: Removes an announcement by ID
   * 
   * @param {number|string} id - Numeric announcement ID
   * @returns {Object|null} Deleted announcement or null
   */
  delete(id) {
    const numericId = Number(id);
    const index = announcements.findIndex(a => a.id === numericId);

    if (index === -1) {
      return null;
    }

    const [deletedItem] = announcements.splice(index, 1);
    return deletedItem;
  },

  /**
   * DELETE - Alias
   * @param {number|string} id
   * @returns {Object|null}
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
   * Clear storage (for isolated testing)
   */
  clear() {
    announcements = [];
  }
};

module.exports = announcementModel;
module.exports.Announcement = Announcement;
