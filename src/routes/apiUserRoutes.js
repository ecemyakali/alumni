/**
 * ========================================================
 * Router Layer: API User Routes (ApiUserRoutes)
 * File: src/routes/apiUserRoutes.js
 * ========================================================
 * 
 * Task 4: Defines RESTful routes for ApiUserController (/api/users).
 * Handles API operations for external clients, mobile apps, Postman and Swagger.
 */

const express = require('express');
const router = express.Router();
const apiUserController = require('../controllers/apiUserController');

// RESTful API Routes: .../api/users
router.post('/api/users', (req, res) => apiUserController.createUser(req, res));
router.get('/api/users', (req, res) => apiUserController.getAllUsers(req, res));
router.get('/api/users/:id', (req, res) => apiUserController.getUserById(req, res));
router.put('/api/users/:id', (req, res) => apiUserController.updateUser(req, res));
router.patch('/api/users/:id', (req, res) => apiUserController.updateUser(req, res));
router.delete('/api/users/:id', (req, res) => apiUserController.deleteUser(req, res));

module.exports = router;
