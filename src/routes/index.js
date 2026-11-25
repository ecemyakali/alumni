/**
 * Router Aggregator
 * File: src/routes/index.js
 * 
 * Aggregates all modular route definitions:
 * - Whiteboard Routes (Classroom)
 * - Health Routes (/api/health)
 * - User Routes (/users -> UserController & /api/users -> ApiUserController)
 * - Announcement Routes (/announcements -> AnnouncementController & /api/announcements -> ApiAnnouncementController)
 * - OpenAPI / Swagger Specification endpoints
 */

const express = require('express');
const router = express.Router();
const swaggerDocument = require('../config/swagger');

const whiteboardRoutes = require('./whiteboardRoutes');
const healthRoutes = require('./healthRoutes');
const userRoutes = require('./userRoutes');
const apiUserRoutes = require('./apiUserRoutes');
const announcementRoutes = require('./announcementRoutes');
const apiAnnouncementRoutes = require('./apiAnnouncementRoutes');
const jobPostingRoutes = require('./jobPostingRoutes');
const apiJobPostingRoutes = require('./apiJobPostingRoutes');
const applicationRoutes = require('./applicationRoutes');
const apiApplicationRoutes = require('./apiApplicationRoutes');
const authRoutes = require('./authRoutes');
const apiAuthRoutes = require('./apiAuthRoutes');
const adminRoutes = require('./adminRoutes');
const profileRoutes = require('./profileRoutes');

// Mount modular sub-routers
router.use('/', whiteboardRoutes);
router.use('/', healthRoutes);
router.use('/', authRoutes);                   // /register, /login -> AuthController
router.use('/', apiAuthRoutes);                // /api/auth/* -> ApiAuthController
router.use('/', adminRoutes);                  // /admin, /api/users/:id/role -> AdminController
router.use('/', profileRoutes);                // /profile, /dashboard, /api/profile -> ProfileController
router.use('/', userRoutes);                // .../users -> UserController
router.use('/', apiUserRoutes);             // .../api/users -> ApiUserController
router.use('/', announcementRoutes);        // .../announcements -> AnnouncementController
router.use('/', apiAnnouncementRoutes);     // .../api/announcements -> ApiAnnouncementController
router.use('/', jobPostingRoutes);           // .../job-postings -> JobPostingController
router.use('/', apiJobPostingRoutes);        // .../api/job-postings -> ApiJobPostingController
router.use('/', applicationRoutes);          // .../applications -> ApplicationController
router.use('/', apiApplicationRoutes);       // .../api/applications -> ApiApplicationController

// Swagger JSON Spec endpoints
router.get(['/api/swagger.json', '/swagger.json'], (req, res) => {
  res.json(swaggerDocument);
});

module.exports = router;
