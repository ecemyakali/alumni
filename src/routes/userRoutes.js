/**
 * Router Layer: User Routes
 * File: src/routes/userRoutes.js
 * 
 * Maps HTTP methods and endpoints to userController actions.
 */

const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// User CRUD endpoints (supporting both /api/users and /users paths)
router.post(['/api/users', '/users'], userController.createUser);
router.get(['/api/users', '/users'], userController.getAllUsers);
router.get(['/api/users/:id', '/users/:id'], userController.getUserById);
router.put(['/api/users/:id', '/users/:id'], userController.updateUser);
router.patch(['/api/users/:id', '/users/:id'], userController.updateUser);
router.delete(['/api/users/:id', '/users/:id'], userController.deleteUser);

module.exports = router;
