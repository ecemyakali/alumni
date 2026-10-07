/**
 * Controller Layer: User Controller
 * File: src/controllers/userController.js
 * 
 * Handles incoming HTTP requests for User resources,
 * interacts with userModel, and returns JSON presentation responses.
 */

const userModel = require('../models/userModel');

const userController = {
  /**
   * Create a new user from request body (form-urlencoded or JSON)
   * POST /api/users
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
   * Retrieve all users
   * GET /api/users
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
   * Retrieve a single user by ID
   * GET /api/users/:id
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
   * Update an existing user by ID (handles PUT and PATCH)
   * PUT /api/users/:id
   * PATCH /api/users/:id
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
   * Delete an existing user by ID
   * DELETE /api/users/:id
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
  }
};

module.exports = userController;
