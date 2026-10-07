/**
 * ========================================================
 * Router Layer: Web Announcement Routes
 * File: src/routes/announcementRoutes.js
 * ========================================================
 * 
 * Homework: Web / Application routes for AnnouncementController.
 * Supports all CRUD operations with the View Layer.
 * Endpoints: .../announcements
 */

const express = require('express');
const router = express.Router();
const announcementController = require('../controllers/announcementController');

// 1. READ ALL & CREATE Form View
router.get('/announcements', (req, res) => announcementController.getAllAnnouncements(req, res));
router.post('/announcements', (req, res) => announcementController.createAnnouncement(req, res));

// 2. READ ONE View
router.get('/announcements/:id', (req, res) => announcementController.getAnnouncementById(req, res));

// 3. UPDATE: Edit Form View & Update Actions
router.get('/announcements/:id/edit', (req, res) => announcementController.getEditAnnouncementForm(req, res));
router.post('/announcements/:id/update', (req, res) => announcementController.updateAnnouncement(req, res));
router.put('/announcements/:id', (req, res) => announcementController.updateAnnouncement(req, res));
router.patch('/announcements/:id', (req, res) => announcementController.updateAnnouncement(req, res));

// 4. DELETE: Form Delete & HTTP DELETE Actions
router.post('/announcements/:id/delete', (req, res) => announcementController.deleteAnnouncement(req, res));
router.delete('/announcements/:id', (req, res) => announcementController.deleteAnnouncement(req, res));

module.exports = router;
