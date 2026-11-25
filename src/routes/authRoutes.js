/**
 * Web Authentication Routes
 * File: src/routes/authRoutes.js
 * 
 * Defines web routes for user registration and login:
 * - GET  /register -> Registration form View
 * - POST /register -> Form submission handler
 * - GET  /login    -> Sign-in form View
 * - POST /login    -> Sign-in submission handler
 */

const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.get('/register', (req, res) => authController.renderRegisterPage(req, res));
router.post('/register', (req, res) => authController.handleRegister(req, res));

router.get('/login', (req, res) => authController.renderLoginPage(req, res));
router.post('/login', (req, res) => authController.handleLogin(req, res));

module.exports = router;
