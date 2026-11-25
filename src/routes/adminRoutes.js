/**
 * Administrator Protected Routes
 * File: src/routes/adminRoutes.js
 * 
 * Enforces role-based access control (requireAdmin):
 * - GET    /admin                -> Protected Admin Control Center view with search & filtering
 * - GET    /admin/users/:id/edit -> Protected edit user view
 * - POST   /admin/users/:id/update -> Protected form user update action
 * - POST   /admin/users/:id/role   -> Protected form role update action
 * - POST   /admin/users/:id/status -> Protected form status update action
 * - POST   /admin/users/:id/delete -> Protected form user deletion action
 * - PATCH  /api/users/:id/role   -> Protected API role update endpoint
 * - PATCH  /api/users/:id/status -> Protected API status update endpoint
 */

const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { requireAdmin } = require('../middlewares/authMiddleware');

// Web Admin Dashboard & Directory
router.get('/admin', requireAdmin, (req, res) => adminController.renderDashboard(req, res));

// User Profile Editing & Form Mutations
router.get('/admin/users/:id/edit', requireAdmin, (req, res) => adminController.renderUserEdit(req, res));
router.post('/admin/users/:id/update', requireAdmin, (req, res) => adminController.handleUpdateUser(req, res));
router.post('/admin/users/:id/role', requireAdmin, (req, res) => adminController.handleAssignRole(req, res));
router.post('/admin/users/:id/status', requireAdmin, (req, res) => adminController.handleAssignStatus(req, res));
router.post('/admin/users/:id/delete', requireAdmin, (req, res) => adminController.handleDeleteUser(req, res));

// RESTful API Admin Endpoints
router.patch('/api/users/:id/role', requireAdmin, (req, res) => adminController.apiAssignRole(req, res));
router.patch('/api/users/:id/status', requireAdmin, (req, res) => adminController.apiAssignStatus(req, res));

module.exports = router;
