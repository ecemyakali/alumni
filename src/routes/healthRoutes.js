/**
 * Router Layer: Health Routes
 * File: src/routes/healthRoutes.js
 * 
 * Maps system health endpoints to healthController actions.
 */

const express = require('express');
const router = express.Router();
const healthController = require('../controllers/healthController');

// System health check endpoints
router.get(['/api/health', '/health'], healthController.getHealth);

module.exports = router;
