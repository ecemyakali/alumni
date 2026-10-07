/**
 * Router Layer: User Routes
 * File: src/routes/userRoutes.js
 * 
 * Maps HTTP methods and endpoints to both ApiUserController and UserController.
 */

const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const apiUserController = require('../controllers/apiUserController');

// REST API Endpoints (/api/users) -> Handled by ApiUserController
router.post('/api/users', (req, res) => apiUserController.createUser(req, res));
router.get('/api/users', (req, res) => apiUserController.getAllUsers(req, res));
router.get('/api/users/:id', (req, res) => apiUserController.getUserById(req, res));
router.put('/api/users/:id', (req, res) => apiUserController.updateUser(req, res));
router.patch('/api/users/:id', (req, res) => apiUserController.updateUser(req, res));
router.delete('/api/users/:id', (req, res) => apiUserController.deleteUser(req, res));

// Web / Application Endpoints (/users) -> Handled by UserController
router.post('/users', (req, res) => userController.createUser(req, res));
router.get('/users', (req, res) => userController.getAllUsers(req, res));
router.get('/users/:id', (req, res) => userController.getUserById(req, res));
router.put('/users/:id', (req, res) => userController.updateUser(req, res));
router.patch('/users/:id', (req, res) => userController.updateUser(req, res));
router.delete('/users/:id', (req, res) => userController.deleteUser(req, res));

module.exports = router;
