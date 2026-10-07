/**
 * ========================================================
 * Router Layer: Web User Routes (UserRoutes)
 * File: src/routes/userRoutes.js
 * ========================================================
 * 
 * Task 4: Defines application routes for UserController (/users).
 * Handles web client operations, browser form submissions, and HTML views.
 */

const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Web / Application Routes: .../users
router.post('/users', (req, res) => userController.createUser(req, res));
router.get('/users', (req, res) => userController.getAllUsers(req, res));
router.get('/users/:id', (req, res) => userController.getUserById(req, res));
router.put('/users/:id', (req, res) => userController.updateUser(req, res));
router.patch('/users/:id', (req, res) => userController.updateUser(req, res));
router.delete('/users/:id', (req, res) => userController.deleteUser(req, res));

module.exports = router;
