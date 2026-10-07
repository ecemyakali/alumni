/**
 * ========================================================
 * Controller Layer: Web User Controller (UserController)
 * File: src/controllers/userController.js
 * ========================================================
 * 
 * Task 3 & Task 5: Web / Application Controller for User resources.
 * Coordinates with the Model Layer (userModel) and View Layer (userView):
 * - GET  .../users -> Retrieves users from Model and renders Users View
 * - POST .../users -> Validates form data, saves via Model, renders View with feedback
 * - GET  .../users/:id -> Renders individual User Profile View
 */

const userModel = require('../models/userModel');
const userView = require('../views/userView');

/**
 * Safely determines if incoming request expects HTML View response
 */
function isHtmlRequest(req) {
  if (req.headers && typeof req.headers.accept === 'string' && req.headers.accept.includes('text/html')) {
    return true;
  }
  if (typeof req.is === 'function' && req.is('application/x-www-form-urlencoded')) {
    return true;
  }
  if (req.query && req.query.format === 'html') {
    return true;
  }
  return false;
}

const userController = {
  /**
   * Task 5: POST .../users
   * Handles user creation form submission using the View layer
   * 
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   */
  createUser(req, res) {
    const formData = req.body;
    const expectsHtml = isHtmlRequest(req);

    if (!formData || Object.keys(formData).length === 0) {
      if (expectsHtml) {
        return res.status(400).send(userView.renderUsersList(userModel.getAll(), {
          errorMessage: 'Form data is empty. Please provide full name and email.'
        }));
      }
      return res.status(400).json({
        success: false,
        error: 'Form data is empty. Please provide user details (e.g. name, email).'
      });
    }

    const newUser = userModel.create(formData);

    // If requested by a web browser or HTML form submission, render View layer
    if (expectsHtml) {
      return res.status(201).send(userView.renderUsersList(userModel.getAll(), {
        successMessage: `Welcome, ${newUser.name}! User #${newUser.id} registered successfully.`
      }));
    }

    // JSON fallback for programmatic API clients
    return res.status(201).json({
      success: true,
      message: 'User created successfully',
      user: newUser,
      totalUsers: userModel.count()
    });
  },

  /**
   * Task 5: GET .../users
   * Retrieves users from userModel and renders the HTML View layer
   * 
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   */
  getAllUsers(req, res) {
    const users = userModel.getAll();

    // When requested with text/html (browsers), render the User View layer
    if (isHtmlRequest(req)) {
      return res.status(200).send(userView.renderUsersList(users));
    }

    // Default JSON fallback
    return res.status(200).json({
      success: true,
      count: users.length,
      data: users
    });
  },

  /**
   * GET .../users/:id
   * Retrieves single user and renders profile view
   * 
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   */
  getUserById(req, res) {
    const userId = Number(req.params.id);
    const user = userModel.getById(userId);
    const expectsHtml = isHtmlRequest(req);

    if (!user) {
      if (expectsHtml) {
        return res.status(404).send(userView.renderError(`User with id ${req.params.id} not found.`, 404));
      }
      return res.status(404).json({
        success: false,
        error: `User with id ${req.params.id} not found`
      });
    }

    if (expectsHtml) {
      return res.status(200).send(userView.renderUserDetail(user));
    }

    return res.status(200).json({
      success: true,
      data: user
    });
  },

  /**
   * PUT .../users/:id or PATCH .../users/:id
   * Updates user and returns status
   * 
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   */
  updateUser(req, res) {
    const userId = Number(req.params.id);
    const existingUser = userModel.getById(userId);
    const expectsHtml = isHtmlRequest(req);

    if (!existingUser) {
      if (expectsHtml) {
        return res.status(404).send(userView.renderError(`User with id ${req.params.id} not found.`, 404));
      }
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
   * DELETE .../users/:id
   * Deletes user and returns confirmation
   * 
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   */
  deleteUser(req, res) {
    const userId = Number(req.params.id);
    const deletedUser = userModel.delete(userId);
    const expectsHtml = isHtmlRequest(req);

    if (!deletedUser) {
      if (expectsHtml) {
        return res.status(404).send(userView.renderError(`User with id ${req.params.id} not found.`, 404));
      }
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

module.exports = userController;
