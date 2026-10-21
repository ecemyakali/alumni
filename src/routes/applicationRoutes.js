/**
 * ========================================================
 * Router Layer: Web Application Routes
 * File: src/routes/applicationRoutes.js
 * ========================================================
 * 
 * Web / Application routes for ApplicationController.
 * Supports all CRUD operations with the View Layer.
 * Endpoints: .../applications
 */

const express = require('express');
const router = express.Router();
const applicationController = require('../controllers/applicationController');

// 1. READ ALL & CREATE Form View
router.get('/applications', (req, res) => applicationController.getAllApplications(req, res));
router.post('/applications', (req, res) => applicationController.createApplication(req, res));

// 2. READ ONE View
router.get('/applications/:id', (req, res) => applicationController.getApplicationById(req, res));

// 3. UPDATE: Edit Form View & Update Actions
router.get('/applications/:id/edit', (req, res) => applicationController.getEditApplicationForm(req, res));
router.post('/applications/:id/update', (req, res) => applicationController.updateApplication(req, res));
router.put('/applications/:id', (req, res) => applicationController.updateApplication(req, res));
router.patch('/applications/:id', (req, res) => applicationController.updateApplication(req, res));

// 4. DELETE: Form Delete & HTTP DELETE Actions
router.post('/applications/:id/delete', (req, res) => applicationController.deleteApplication(req, res));
router.delete('/applications/:id', (req, res) => applicationController.deleteApplication(req, res));

module.exports = router;
