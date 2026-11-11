/**
 * Express Application Configuration
 * File: src/app.js
 * 
 * Configures global middlewares, registers Swagger UI documentation,
 * and mounts the modular routing system.
 */

const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./config/swagger');
const routes = require('./routes');
const logger = require('./middlewares/logger');

const app = express();

// Global Middlewares
// 1. Terminal Request Logger (logs method, route, res type, duration, time)
app.use(logger);

// 2. Body Parsing (JSON and URL-encoded)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Swagger UI API Documentation: GET /api/swagger and /api/docs
const swaggerOptions = {
  customSiteTitle: 'Alumni Tracking System API Docs'
};

app.use('/api/swagger', swaggerUi.serve, swaggerUi.setup(swaggerDocument, swaggerOptions));
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, swaggerOptions));

// Mount routes at both root and /alumni prefix for maximum flexibility
app.use('/', routes);
app.use('/alumni', routes);

module.exports = app;
