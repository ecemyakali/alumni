/**
 * ========================================================
 * Router Layer: API Announcement Routes
 * File: src/routes/apiAnnouncementRoutes.js
 * ========================================================
 * 
 * Homework: RESTful API routes for ApiAnnouncementController.
 * Endpoints: .../api/announcements
 */

const express = require('express');
const router = express.Router();
const apiAnnouncementController = require('../controllers/apiAnnouncementController');

// RESTful API Routes: .../api/announcements
router.post('/api/announcements', (req, res) => apiAnnouncementController.createAnnouncement(req, res));
router.get('/api/announcements', (req, res) => apiAnnouncementController.getAllAnnouncements(req, res));
router.get('/api/announcements/:id', (req, res) => apiAnnouncementController.getAnnouncementById(req, res));
router.put('/api/announcements/:id', (req, res) => apiAnnouncementController.updateAnnouncement(req, res));
router.patch('/api/announcements/:id', (req, res) => apiAnnouncementController.updateAnnouncement(req, res));
router.delete('/api/announcements/:id', (req, res) => apiAnnouncementController.deleteAnnouncement(req, res));

module.exports = router;
