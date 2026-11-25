/**
 * Administrator Controller
 * File: src/controllers/adminController.js
 * 
 * Manages administrative operations, dashboard views, search filtering,
 * user record mutations, status/role updates, and domain invariant enforcement:
 * - GET    /admin                -> Protected Admin Control Center view with search & filtering
 * - GET    /admin/users/:id/edit -> Edit user record view
 * - POST   /admin/users/:id/update -> Web form update user record
 * - POST   /admin/users/:id/role   -> Web form role assignment
 * - POST   /admin/users/:id/status -> Web form status assignment
 * - POST   /admin/users/:id/delete -> Web form delete user record
 * - PATCH  /api/users/:id/role   -> RESTful API role assignment
 * - PATCH  /api/users/:id/status -> RESTful API status assignment
 * - PUT    /api/users/:id        -> RESTful API full update
 * - DELETE /api/users/:id        -> RESTful API delete user
 */

const userModel = require('../models/userModel');
const jobPostingModel = require('../models/jobPostingModel');
const announcementModel = require('../models/announcementModel');
const applicationModel = require('../models/applicationModel');
const adminView = require('../views/adminView');

const adminController = {
  /**
   * GET /admin
   * Renders the administrative dashboard with platform metrics and user search/filtering
   */
  renderDashboard(req, res) {
    let allUsers = userModel.getAll() || [];

    const q = ((req.query && req.query.q) || '').trim().toLowerCase();
    const roleFilter = ((req.query && req.query.role) || '').trim().toLowerCase();
    const statusFilter = ((req.query && req.query.status) || '').trim().toUpperCase();

    // Apply filtering
    let filteredUsers = allUsers.filter(u => {
      if (roleFilter && (u.role || '').toLowerCase() !== roleFilter) {
        return false;
      }
      if (statusFilter && (u.status || 'ACTIVE').toUpperCase() !== statusFilter) {
        return false;
      }
      if (q) {
        const nameMatch = (u.name || '').toLowerCase().includes(q);
        const emailMatch = (u.email || '').toLowerCase().includes(q);
        const deptMatch = (u.department || '').toLowerCase().includes(q);
        const companyMatch = (u.company || '').toLowerCase().includes(q);
        const roleMatch = (u.currentRole || '').toLowerCase().includes(q);
        if (!nameMatch && !emailMatch && !deptMatch && !companyMatch && !roleMatch) {
          return false;
        }
      }
      return true;
    });

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
      users: filteredUsers,
      stats,
      q,
      role: roleFilter,
      status: statusFilter,
      successMessage,
      errorMessage
    }));
  },

  /**
   * GET /admin/users/:id/edit
   * Renders the user edit view for administrators
   */
  renderUserEdit(req, res) {
    const targetUserId = req.params.id;
    const user = userModel.findById(targetUserId);

    if (!user) {
      return res.status(404).send(adminView.renderDashboard({
        currentUser: req.user,
        users: userModel.getAll() || [],
        stats: {
          usersCount: userModel.count(),
          jobsCount: jobPostingModel.count(),
          announcementsCount: announcementModel.count(),
          applicationsCount: applicationModel.count()
        },
        errorMessage: `User #${targetUserId} not found.`
      }));
    }

    const successMessage = (req.query && req.query.success) || '';
    const errorMessage = (req.query && req.query.error) || '';

    return res.status(200).send(adminView.renderAdminUserEdit({
      currentUser: req.user,
      user,
      successMessage,
      errorMessage
    }));
  },

  /**
   * POST /admin/users/:id/update
   * Handles browser form user updates from the admin panel
   */
  handleUpdateUser(req, res) {
    const targetUserId = req.params.id;
    const targetUser = userModel.findById(targetUserId);

    if (!targetUser) {
      return res.redirect(302, `/admin?error=${encodeURIComponent(`User #${targetUserId} not found.`)}`);
    }

    const {
      name,
      email,
      department,
      graduationYear,
      role,
      status,
      company,
      currentRole,
      linkedinUrl
    } = req.body || {};

    if (!name || !email) {
      return res.status(400).send(adminView.renderAdminUserEdit({
        currentUser: req.user,
        user: { ...targetUser, ...req.body },
        errorMessage: 'Name and email address are required fields.'
      }));
    }

    // Invariant check: Demoting or deactivating the last active administrator
    if (targetUser.role === 'admin') {
      const willDemote = role && role !== 'admin';
      const willDeactivate = status && status !== 'ACTIVE';

      if (willDemote || willDeactivate) {
        const remainingAdmins = userModel.countAdmins();
        if (remainingAdmins <= 1) {
          return res.status(422).send(adminView.renderAdminUserEdit({
            currentUser: req.user,
            user: { ...targetUser, ...req.body },
            errorMessage: 'Domain Invariant Violation: Cannot demote or deactivate the last active system administrator.'
          }));
        }
      }
    }

    const updateData = {
      name: name.trim(),
      email: email.trim(),
      department: (department || '').trim(),
      graduationYear: graduationYear ? Number(graduationYear) : targetUser.graduationYear,
      role: role || targetUser.role,
      status: status || targetUser.status || 'ACTIVE',
      company: (company || '').trim(),
      currentRole: (currentRole || '').trim(),
      linkedinUrl: (linkedinUrl || '').trim()
    };

    userModel.update(targetUserId, updateData);

    return res.redirect(302, `/admin?success=${encodeURIComponent(`User "${updateData.name}" (#${targetUserId}) updated successfully.`)}`);
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

    return res.redirect(302, `/admin?success=${encodeURIComponent(`User #${targetUserId} role updated to "${newRole}".`)}`);
  },

  /**
   * POST /admin/users/:id/status
   * Handles browser form status update submissions
   */
  handleAssignStatus(req, res) {
    const targetUserId = req.params.id;
    const newStatus = req.body && req.body.status;

    const result = userModel.assignStatus(targetUserId, newStatus, req.user);
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

    return res.redirect(302, `/admin?success=${encodeURIComponent(`User #${targetUserId} status updated to "${newStatus}".`)}`);
  },

  /**
   * POST /admin/users/:id/delete
   * Handles browser form user deletion from the admin panel
   */
  handleDeleteUser(req, res) {
    const targetUserId = req.params.id;

    const result = userModel.deleteUser(targetUserId, req.user);
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

    return res.redirect(302, `/admin?success=${encodeURIComponent(`User #${targetUserId} deleted successfully.`)}`);
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
      message: `User #${targetUserId} role updated to "${newRole}" successfully.`,
      data: safeUser
    });
  },

  /**
   * PATCH /api/users/:id/status
   * RESTful API endpoint for administrative status assignment
   */
  apiAssignStatus(req, res) {
    const targetUserId = req.params.id;
    const newStatus = req.body && req.body.status;

    if (!newStatus) {
      return res.status(400).json({
        success: false,
        error: 'Field "status" is required in request body.'
      });
    }

    const result = userModel.assignStatus(targetUserId, newStatus, req.user);
    if (!result.success) {
      return res.status(result.statusCode || 400).json({
        success: false,
        error: result.error
      });
    }

    const safeUser = userModel.sanitize(result.user);

    return res.status(200).json({
      success: true,
      message: `User #${targetUserId} status updated to "${newStatus}" successfully.`,
      data: safeUser
    });
  }
};

module.exports = adminController;
