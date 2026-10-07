/**
 * ========================================================
 * Model Layer: User Model (In-Memory Without Database)
 * File: src/models/userModel.js
 * ========================================================
 * 
 * Task 2: Create User Model without database connection
 * it includes complete CRUD (Create, Read, Update, Delete) functions.
 * 
 * Stores user entities in-memory using an internal array store,
 * providing data manipulation methods completely decoupled from
 * HTTP/Express routing logic.
 */

/**
 * User Domain Entity Definition
 */
class User {
  constructor({ id, name, email, role = 'alumni', department = '', ...extra }) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.role = role;
    this.department = department;
    Object.assign(this, extra);
    this.createdAt = new Date().toISOString();
    this.updatedAt = null;
  }
}

// In-memory data store (no database connection required)
let users = [];

const userModel = {
  /**
   * CREATE: Adds a new user to in-memory storage
   * 
   * @param {Object} userData - Data object containing user properties
   * @returns {Object} Newly created user record
   */
  create(userData) {
    if (!userData || typeof userData !== 'object') {
      throw new Error('User data must be an object');
    }

    // Auto-generate numeric ID based on existing users
    const generatedId = users.length > 0
      ? Math.max(...users.map(u => (typeof u.id === 'number' ? u.id : 0))) + 1
      : 1;

    const newUser = {
      id: userData.id ? Number(userData.id) : generatedId,
      ...userData,
      createdAt: new Date().toISOString()
    };

    users.push(newUser);
    return newUser;
  },

  /**
   * READ (All): Retrieves all user records
   * 
   * @returns {Array<Object>} List of all users in memory
   */
  findAll() {
    return users;
  },

  /**
   * READ (All) - Alias for findAll
   * @returns {Array<Object>}
   */
  getAll() {
    return this.findAll();
  },

  /**
   * READ (By ID): Finds a single user by their numeric ID
   * 
   * @param {number|string} id - Numeric user ID
   * @returns {Object|null} User record or null if not found
   */
  findById(id) {
    const numericId = Number(id);
    const user = users.find(u => u.id === numericId);
    return user || null;
  },

  /**
   * READ (By ID) - Alias for findById
   * @param {number|string} id
   * @returns {Object|null}
   */
  getById(id) {
    return this.findById(id);
  },

  /**
   * READ (By Email): Searches user by email address
   * 
   * @param {string} email - Email address to search
   * @returns {Object|null} User record or null if not found
   */
  findByEmail(email) {
    if (!email || typeof email !== 'string') return null;
    const user = users.find(u => u.email && u.email.toLowerCase() === email.toLowerCase());
    return user || null;
  },

  /**
   * UPDATE: Updates an existing user's details by ID
   * 
   * @param {number|string} id - Numeric user ID
   * @param {Object} updateData - Fields to be updated
   * @returns {Object|null} Updated user record or null if not found
   */
  update(id, updateData) {
    const numericId = Number(id);
    const index = users.findIndex(u => u.id === numericId);

    if (index === -1) {
      return null;
    }

    // Merge changes while preserving original ID and creation timestamp
    users[index] = {
      ...users[index],
      ...updateData,
      id: numericId,
      updatedAt: new Date().toISOString()
    };

    return users[index];
  },

  /**
   * DELETE: Removes a user from in-memory storage by ID
   * 
   * @param {number|string} id - Numeric user ID
   * @returns {Object|null} The deleted user record or null if not found
   */
  delete(id) {
    const numericId = Number(id);
    const index = users.findIndex(u => u.id === numericId);

    if (index === -1) {
      return null;
    }

    const [deletedUser] = users.splice(index, 1);
    return deletedUser;
  },

  /**
   * DELETE - Alias for delete
   * @param {number|string} id
   * @returns {Object|null}
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
   * CLEAR: Clears all users from memory (useful for testing)
   */
  clear() {
    users = [];
  }
};

module.exports = userModel;
module.exports.User = User;
