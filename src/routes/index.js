/**
 * Router Aggregator
 * File: src/routes/index.js
 * 
 * Aggregates all modular route definitions (Whiteboard, Health, Users)
 * and exposes them as a unified Express Router.
 */

const express = require('express');
const router = express.Router();
const swaggerDocument = require('../config/swagger');

const whiteboardRoutes = require('./whiteboardRoutes');
const healthRoutes = require('./healthRoutes');
const userRoutes = require('./userRoutes');

// Mount modular sub-routers
router.use('/', whiteboardRoutes);
router.use('/', healthRoutes);
router.use('/', userRoutes);

// Swagger JSON Spec endpoints
router.get(['/api/swagger.json', '/swagger.json'], (req, res) => {
  res.json(swaggerDocument);
});

module.exports = router;
