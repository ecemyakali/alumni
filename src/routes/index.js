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

// Mount modular sub-routers
router.use('/', whiteboardRoutes);
router.use('/', healthRoutes);
router.use('/', userRoutes);                // .../users -> UserController
router.use('/', apiUserRoutes);             // .../api/users -> ApiUserController
router.use('/', announcementRoutes);        // .../announcements -> AnnouncementController
router.use('/', apiAnnouncementRoutes);     // .../api/announcements -> ApiAnnouncementController

// Swagger JSON Spec endpoints
router.get(['/api/swagger.json', '/swagger.json'], (req, res) => {
  res.json(swaggerDocument);
});

module.exports = router;
