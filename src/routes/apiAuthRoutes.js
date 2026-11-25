/**
 * RESTful Authentication API Routes
 * File: src/routes/apiAuthRoutes.js
 * 
 * Defines JSON API endpoints for user registration & authentication:
 * - POST /api/auth/register -> Account creation
 * - POST /api/auth/login    -> Credential verification
 */

const express = require('express');
const router = express.Router();
const apiAuthController = require('../controllers/apiAuthController');

router.post('/api/auth/register', (req, res) => apiAuthController.register(req, res));
router.post('/api/auth/login', (req, res) => apiAuthController.login(req, res));

module.exports = router;
