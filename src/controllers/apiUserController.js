/**
 * ========================================================
 * Controller Layer: API User Controller (ApiUserController)
 * File: src/controllers/apiUserController.js
 * ========================================================
 * 
 * Task 3: Dedicated RESTful API Controller for User resources.
 * Handles client requests and returns standardized JSON representations
 * with semantic HTTP status codes (200, 201, 400, 404).
 * Used by external API consumers, Mobile clients, Postman & Swagger UI.
 */

const userModel = require('../models/userModel');

const apiUserController = {
  /**
   * CREATE: POST /api/users
   * Creates a new user record from JSON or form-urlencoded request body.
   * 
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   */
  createUser(req, res) {
    const formData = req.body;

    if (!formData || Object.keys(formData).length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Form data is empty. Please provide user details (e.g. name, email).'
      });
    }

    const newUser = userModel.create(formData);

    return res.status(201).json({
      success: true,
      message: 'User created successfully',
      user: newUser,
      totalUsers: userModel.count()
    });
  },

  /**
   * READ (All): GET /api/users
   * Retrieves all users formatted as a JSON array.
   * 
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   */
  getAllUsers(req, res) {
    const users = userModel.getAll();
    return res.status(200).json({
      success: true,
      count: users.length,
      data: users
    });
  },

  /**
   * READ (By ID): GET /api/users/:id
   * Retrieves a single user record by numeric ID.
   * 
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   */
  getUserById(req, res) {
    const userId = Number(req.params.id);
    const user = userModel.getById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: `User with id ${req.params.id} not found`
      });
    }

    return res.status(200).json({
      success: true,
      data: user
    });
  },

  /**
   * UPDATE: PUT /api/users/:id or PATCH /api/users/:id
   * Updates existing user fields by numeric ID.
   * 
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   */
  updateUser(req, res) {
    const userId = Number(req.params.id);
    const existingUser = userModel.getById(userId);

    if (!existingUser) {
      return res.status(404).json({
        success: false,
        error: `User with id ${req.params.id} not found`
      });
    }

    const updateData = req.body;
    if (!updateData || Object.keys(updateData).length === 0) {
      return res.status(400).json({
        success: false,
        error: 'No update data provided. Please send updated fields.'
      });
    }

    const updatedUser = userModel.update(userId, updateData);

    return res.status(200).json({
      success: true,
      message: 'User updated successfully',
      user: updatedUser
    });
  },

  /**
   * DELETE: DELETE /api/users/:id
   * Removes a user by numeric ID.
   * 
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   */
  deleteUser(req, res) {
    const userId = Number(req.params.id);
    const deletedUser = userModel.delete(userId);

    if (!deletedUser) {
      return res.status(404).json({
        success: false,
        error: `User with id ${req.params.id} not found`
      });
    }

    return res.status(200).json({
      success: true,
      message: 'User deleted successfully',
      deletedUser,
      totalUsers: userModel.count()
    });
  },

  // Standard CRUD function aliases
  create(req, res) { return this.createUser(req, res); },
  getAll(req, res) { return this.getAllUsers(req, res); },
  getById(req, res) { return this.getUserById(req, res); },
  update(req, res) { return this.updateUser(req, res); },
  delete(req, res) { return this.deleteUser(req, res); }
};

module.exports = apiUserController;
