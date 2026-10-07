/**
 * ========================================================
 * Router Layer: Web User Routes (UserRoutes)
 * File: src/routes/userRoutes.js
 * ========================================================
 * 
 * Task 6: Defines all CRUD operations on user route and controller with view:
 * 1. CREATE:
 *    - POST /users -> Create user form submission
 * 2. READ:
 *    - GET  /users -> Users directory table View
 *    - GET  /users/:id -> User profile detail View
 * 3. UPDATE:
 *    - GET  /users/:id/edit -> Pre-filled Edit User form View
 *    - POST /users/:id/update -> Browser form update submission
 *    - PUT  /users/:id -> Standard HTTP PUT update
 *    - PATCH /users/:id -> Standard HTTP PATCH update
 * 4. DELETE:
 *    - POST /users/:id/delete -> Browser form delete submission
 *    - DELETE /users/:id -> Standard HTTP DELETE
 */

const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// 1. READ ALL & CREATE Form View
router.get('/users', (req, res) => userController.getAllUsers(req, res));
router.post('/users', (req, res) => userController.createUser(req, res));

// 2. READ ONE View
router.get('/users/:id', (req, res) => userController.getUserById(req, res));

// 3. UPDATE: Edit Form View & Update Actions
router.get('/users/:id/edit', (req, res) => userController.getEditUserForm(req, res));
router.post('/users/:id/update', (req, res) => userController.updateUser(req, res));
router.put('/users/:id', (req, res) => userController.updateUser(req, res));
router.patch('/users/:id', (req, res) => userController.updateUser(req, res));

// 4. DELETE: Form Delete & HTTP DELETE Actions
router.post('/users/:id/delete', (req, res) => userController.deleteUser(req, res));
router.delete('/users/:id', (req, res) => userController.deleteUser(req, res));

module.exports = router;
