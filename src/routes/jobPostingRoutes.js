/**
 * ========================================================
 * Router Layer: Web Job Posting Routes
 * File: src/routes/jobPostingRoutes.js
 * ========================================================
 * 
 * Web / Application routes for JobPostingController.
 * Supports all CRUD operations with the View Layer.
 * Endpoints: .../job-postings
 */

const express = require('express');
const router = express.Router();
const jobPostingController = require('../controllers/jobPostingController');

// 1. READ ALL & CREATE Form View
router.get('/job-postings', (req, res) => jobPostingController.getAllJobPostings(req, res));
router.post('/job-postings', (req, res) => jobPostingController.createJobPosting(req, res));

// 2. READ ONE View
router.get('/job-postings/:id', (req, res) => jobPostingController.getJobPostingById(req, res));

// 3. UPDATE: Edit Form View & Update Actions
router.get('/job-postings/:id/edit', (req, res) => jobPostingController.getEditJobPostingForm(req, res));
router.post('/job-postings/:id/update', (req, res) => jobPostingController.updateJobPosting(req, res));
router.put('/job-postings/:id', (req, res) => jobPostingController.updateJobPosting(req, res));
router.patch('/job-postings/:id', (req, res) => jobPostingController.updateJobPosting(req, res));

// 4. DELETE: Form Delete & HTTP DELETE Actions
router.post('/job-postings/:id/delete', (req, res) => jobPostingController.deleteJobPosting(req, res));
router.delete('/job-postings/:id', (req, res) => jobPostingController.deleteJobPosting(req, res));

module.exports = router;
