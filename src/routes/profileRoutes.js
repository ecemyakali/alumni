/**
 * Profile & Dashboard Protected Routes
 * File: src/routes/profileRoutes.js
 * 
 * Enforces requireAuth middleware on all endpoints:
 * - GET  /profile, /dashboard     -> Web profile & dashboard view
 * - POST /profile                 -> Profile form submission
 * - POST /profile/update          -> Profile details update action
 * - POST /profile/preferences     -> Mentorship & networking update action
 * - POST /profile/password        -> Password change action
 * - GET  /api/profile             -> RESTful API profile details
 * - PUT  /api/profile             -> RESTful API profile update
 * - PATCH /api/profile            -> RESTful API partial update
 * - PUT  /api/profile/password    -> RESTful API password change
 */

const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');
const { requireAuth } = require('../middlewares/authMiddleware');

// Web Profile & Dashboard
router.get('/profile', requireAuth, (req, res) => profileController.renderProfile(req, res));
router.get('/dashboard', requireAuth, (req, res) => profileController.renderProfile(req, res));
router.post('/profile', requireAuth, (req, res) => profileController.handleUpdateProfile(req, res));
router.post('/profile/update', requireAuth, (req, res) => profileController.handleUpdateProfile(req, res));
router.post('/profile/preferences', requireAuth, (req, res) => profileController.handleUpdatePreferences(req, res));
router.post('/profile/password', requireAuth, (req, res) => profileController.handleChangePassword(req, res));

// RESTful API Profile Endpoints
router.get('/api/profile', requireAuth, (req, res) => profileController.apiGetProfile(req, res));
router.put('/api/profile', requireAuth, (req, res) => profileController.apiUpdateProfile(req, res));
router.patch('/api/profile', requireAuth, (req, res) => profileController.apiUpdateProfile(req, res));
router.put('/api/profile/password', requireAuth, (req, res) => profileController.apiChangePassword(req, res));

module.exports = router;
