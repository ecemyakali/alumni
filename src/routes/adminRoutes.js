/**
 * Administrator Protected Routes
 * File: src/routes/adminRoutes.js
 * 
 * Enforces role-based access control (requireAdmin):
 * - GET   /admin               -> Protected Admin Control Center view
 * - POST  /admin/users/:id/role -> Protected web role update action
 * - PATCH /api/users/:id/role  -> Protected API role update endpoint
 */

const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { requireAdmin } = require('../middlewares/authMiddleware');

router.get('/admin', requireAdmin, (req, res) => adminController.renderDashboard(req, res));
router.post('/admin/users/:id/role', requireAdmin, (req, res) => adminController.handleAssignRole(req, res));
router.patch('/api/users/:id/role', requireAdmin, (req, res) => adminController.apiAssignRole(req, res));

module.exports = router;
