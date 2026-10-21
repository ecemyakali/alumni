/**
 * ========================================================
 * Router Layer: API Application Routes
 * File: src/routes/apiApplicationRoutes.js
 * ========================================================
 * 
 * RESTful API routes for ApiApplicationController (Many-to-Many).
 * Endpoints: .../api/applications
 */

const express = require('express');
const router = express.Router();
const apiApplicationController = require('../controllers/apiApplicationController');

// RESTful API Routes: .../api/applications
router.post('/api/applications', (req, res) => apiApplicationController.createApplication(req, res));
router.get('/api/applications', (req, res) => apiApplicationController.getAllApplications(req, res));
router.get('/api/applications/:id', (req, res) => apiApplicationController.getApplicationById(req, res));
router.put('/api/applications/:id', (req, res) => apiApplicationController.updateApplication(req, res));
router.patch('/api/applications/:id', (req, res) => apiApplicationController.updateApplication(req, res));
router.delete('/api/applications/:id', (req, res) => apiApplicationController.deleteApplication(req, res));

// Nested Routes: /api/users/:userId/applications & /api/jobs/:jobId/applications
router.get('/api/users/:userId/applications', (req, res) => apiApplicationController.getAllApplications(req, res));
router.get(['/api/jobs/:jobId/applications', '/api/job-postings/:jobPostingId/applications'], (req, res) => apiApplicationController.getAllApplications(req, res));

module.exports = router;
