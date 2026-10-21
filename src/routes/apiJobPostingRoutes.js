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

// RESTful API Routes: .../api/job-postings
router.post('/api/job-postings', (req, res) => apiJobPostingController.createJobPosting(req, res));
router.get('/api/job-postings', (req, res) => apiJobPostingController.getAllJobPostings(req, res));
router.get('/api/job-postings/:id', (req, res) => apiJobPostingController.getJobPostingById(req, res));
router.put('/api/job-postings/:id', (req, res) => apiJobPostingController.updateJobPosting(req, res));
router.patch('/api/job-postings/:id', (req, res) => apiJobPostingController.updateJobPosting(req, res));
router.delete('/api/job-postings/:id', (req, res) => apiJobPostingController.deleteJobPosting(req, res));

module.exports = router;
