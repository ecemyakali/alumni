/**
 * Model Layer: User Model
 * File: src/models/userModel.js
 * 
 * Manages the User data entity, in-memory data store,
 * and data manipulation operations (CRUD).
 */

// In-memory user storage
const users = [];

const userModel = {
  /**
   * Get all users
   * @returns {Array} Array of user objects
   */
  getAll() {
    return users;
  },

  /**
   * Find a user by their numeric ID
   * @param {number} id - Numeric user ID
   * @returns {Object|undefined} Found user or undefined
   */
  getById(id) {
    return users.find(u => u.id === id);
  },

  /**
   * Create and persist a new user in memory
   * @param {Object} userData - Data sent from form or JSON
   * @returns {Object} Newly created user
   */
  create(userData) {
    const newUser = {
      id: users.length + 1,
      ...userData,
      createdAt: new Date().toISOString()
    };
    users.push(newUser);
    return newUser;
  },

  /**
   * Update an existing user's fields
   * @param {number} id - User ID
   * @param {Object} updateData - Fields to update
   * @returns {Object|null} Updated user or null if not found
   */
  update(id, updateData) {
    const userIndex = users.findIndex(u => u.id === id);
    if (userIndex === -1) {
      return null;
    }

    users[userIndex] = {
      ...users[userIndex],
      ...updateData,
      id: id,
      updatedAt: new Date().toISOString()
    };

    return users[userIndex];
  },

  /**
   * Delete a user by numeric ID
   * @param {number} id - User ID
   * @returns {Object|null} Deleted user or null if not found
   */
  delete(id) {
    const userIndex = users.findIndex(u => u.id === id);
    if (userIndex === -1) {
      return null;
    }

    const deletedUser = users.splice(userIndex, 1)[0];
    return deletedUser;
  },

  /**
   * Get the total count of users
   * @returns {number}
   */
  count() {
    return users.length;
  }
};

module.exports = userModel;
