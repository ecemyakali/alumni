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
const { logger, notFoundGuardian, errorGuardian } = require('./middlewares');

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

// Generic 404 View Route: GET /404
app.get('/404', notFoundGuardian);

// 404 Guardian Middleware: Catches all unhandled routes, returns reason, redirects invalid web requests
app.use(notFoundGuardian);

// 5xx Guardian Middleware: Intercepts unhandled errors, logs to logs/error.logs, returns 500 with reason
app.use(errorGuardian);

module.exports = app;
