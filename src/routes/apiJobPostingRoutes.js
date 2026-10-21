/**
 * ========================================================
 * Router Layer: API Job Posting Routes
 * File: src/routes/apiJobPostingRoutes.js
 * ========================================================
 * 
 * RESTful API routes for ApiJobPostingController.
 * Endpoints: .../api/job-postings
 */

const express = require('express');
const router = express.Router();
const apiJobPostingController = require('../controllers/apiJobPostingController');

// RESTful API Routes: .../api/job-postings and .../api/jobs
router.post(['/api/job-postings', '/api/jobs'], (req, res) => apiJobPostingController.createJobPosting(req, res));
router.get(['/api/job-postings', '/api/jobs'], (req, res) => apiJobPostingController.getAllJobPostings(req, res));
router.get(['/api/job-postings/:id', '/api/jobs/:id'], (req, res) => apiJobPostingController.getJobPostingById(req, res));
router.put(['/api/job-postings/:id', '/api/jobs/:id'], (req, res) => apiJobPostingController.updateJobPosting(req, res));
router.patch(['/api/job-postings/:id', '/api/jobs/:id'], (req, res) => apiJobPostingController.updateJobPosting(req, res));
router.delete(['/api/job-postings/:id', '/api/jobs/:id'], (req, res) => apiJobPostingController.deleteJobPosting(req, res));

// Nested Routes: /api/users/:userId/jobs & /api/users/:userId/job-postings
router.get(['/api/users/:userId/jobs', '/api/users/:userId/job-postings'], (req, res) => apiJobPostingController.getAllJobPostings(req, res));

module.exports = router;
