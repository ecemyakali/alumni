/**
 * Administrator Controller
 * File: src/controllers/adminController.js
 * 
 * Manages administrative operations, dashboard views, and role mutations:
 * - GET   /admin               -> Protected Admin Control Center view
 * - POST  /admin/users/:id/role -> Web form role assignment
 * - PATCH /api/users/:id/role  -> RESTful API role assignment
 */

const userModel = require('../models/userModel');
const jobPostingModel = require('../models/jobPostingModel');
const announcementModel = require('../models/announcementModel');
const applicationModel = require('../models/applicationModel');
const adminView = require('../views/adminView');

const adminController = {
  /**
   * GET /admin
   * Renders the administrative dashboard with platform metrics and user role controls
   */
  renderDashboard(req, res) {
    const users = userModel.getAll() || [];
    const stats = {
      usersCount: userModel.count(),
      jobsCount: jobPostingModel.count(),
      announcementsCount: announcementModel.count(),
      applicationsCount: applicationModel.count()
    };

    const successMessage = (req.query && req.query.success) || '';
    const errorMessage = (req.query && req.query.error) || '';

    return res.status(200).send(adminView.renderDashboard({
      currentUser: req.user,
      users,
      stats,
      successMessage,
      errorMessage
    }));
  },

  /**
   * POST /admin/users/:id/role
   * Handles browser form role update submissions
   */
  handleAssignRole(req, res) {
    const targetUserId = req.params.id;
    const newRole = req.body && req.body.role;

    const result = userModel.assignRole(targetUserId, newRole, req.user);
    if (!result.success) {
      const users = userModel.getAll() || [];
      const stats = {
        usersCount: userModel.count(),
        jobsCount: jobPostingModel.count(),
        announcementsCount: announcementModel.count(),
        applicationsCount: applicationModel.count()
      };

      return res.status(result.statusCode || 400).send(adminView.renderDashboard({
        currentUser: req.user,
        users,
        stats,
        errorMessage: result.error
      }));
    }

    return res.redirect(302, `/admin?success=${encodeURIComponent(`User #${targetUserId} role updated to ${newRole}.`)}`);
  },

  /**
   * PATCH /api/users/:id/role
   * RESTful API endpoint for administrative role assignment
   */
  apiAssignRole(req, res) {
    const targetUserId = req.params.id;
    const newRole = req.body && req.body.role;

    if (!newRole) {
      return res.status(400).json({
        success: false,
        error: 'Field "role" is required in request body.'
      });
    }

    const result = userModel.assignRole(targetUserId, newRole, req.user);
    if (!result.success) {
      return res.status(result.statusCode || 400).json({
        success: false,
        error: result.error
      });
    }

    const safeUser = userModel.sanitize(result.user);

    return res.status(200).json({
      success: true,
      message: `User #${targetUserId} role updated to ${newRole} successfully.`,
      data: safeUser
    });
  }
};

module.exports = adminController;
