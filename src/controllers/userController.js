/**
 * ========================================================
 * Controller Layer: Web User Controller (UserController)
 * File: src/controllers/userController.js
 * ========================================================
 * 
 * Task 3, 5 & 6: Web / Application Controller for User resources.
 * Defines all CRUD operations integrated with the View Layer (userView):
 * - CREATE: createUser (POST /users)
 * - READ (All): getAllUsers (GET /users)
 * - READ (One): getUserById (GET /users/:id)
 * - UPDATE Form: getEditUserForm (GET /users/:id/edit)
 * - UPDATE: updateUser (POST /users/:id/update, PUT /users/:id, PATCH /users/:id)
 * - DELETE: deleteUser (POST /users/:id/delete, DELETE /users/:id)
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
   * CREATE: POST /users
   * Handles user creation form submission using the View layer
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
   * READ (All): GET /users
   * Retrieves all users from userModel and renders the HTML View layer
   */
  getAllUsers(req, res) {
    const users = userModel.getAll();

    if (isHtmlRequest(req)) {
      return res.status(200).send(userView.renderUsersList(users));
    }

    return res.status(200).json({
      success: true,
      count: users.length,
      data: users
    });
  },

  /**
   * READ (One): GET /users/:id
   * Retrieves single user and renders profile card View
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
   * UPDATE (Edit Form View): GET /users/:id/edit
   * Renders the pre-filled User Edit form View
   */
  getEditUserForm(req, res) {
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

    return res.status(200).send(userView.renderEditUserForm(user));
  },

  /**
   * UPDATE: POST /users/:id/update, PUT /users/:id, PATCH /users/:id
   * Updates user and renders updated View or JSON response
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
      if (expectsHtml) {
        return res.status(400).send(userView.renderEditUserForm(existingUser, {
          errorMessage: 'No update data provided. Please fill out the form fields.'
        }));
      }
      return res.status(400).json({
        success: false,
        error: 'No update data provided. Please send updated fields.'
      });
    }

    const updatedUser = userModel.update(userId, updateData);

    if (expectsHtml) {
      return res.status(200).send(userView.renderUserDetail(updatedUser, {
        successMessage: `User #${userId} (${updatedUser.name}) updated successfully!`
      }));
    }

    return res.status(200).json({
      success: true,
      message: 'User updated successfully',
      user: updatedUser
    });
  },

  /**
   * DELETE: POST /users/:id/delete, DELETE /users/:id
   * Deletes user and renders View with feedback or JSON response
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

    if (expectsHtml) {
      return res.status(200).send(userView.renderUsersList(userModel.getAll(), {
        successMessage: `User #${userId} (${deletedUser.name}) deleted successfully.`
      }));
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
