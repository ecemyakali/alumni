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

const app = express();

// Global Middlewares (JSON and URL-encoded body parsing)
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
