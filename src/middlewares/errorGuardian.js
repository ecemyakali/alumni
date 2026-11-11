/**
 * 5xx Server Error Guardian Middleware
 * File: src/middlewares/errorGuardian.js
 * 
 * Express error-handling middleware (4 parameters) that intercepts 5xx and unhandled errors,
 * persists structured error diagnostics to logs/error.logs, and returns user/API-friendly error payloads.
 */

const fs = require('fs');
const path = require('path');
const serverErrorView = require('../views/serverErrorView');

/**
 * Appends error details to logs/error.logs
 * @param {Error|Object} err - The error object
 * @param {import('express').Request} [req] - Express request object
 * @param {number} [statusCode=500] - HTTP status code
 * @param {string} [reason=''] - Error reason
 */
function logErrorToFile(err, req, statusCode = 500, reason = '') {
  try {
    const logDir = path.join(process.cwd(), 'logs');
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }

    const logFilePath = path.join(logDir, 'error.logs');
    const timestamp = new Date().toISOString();
    const method = req ? (req.method || 'UNKNOWN') : 'INTERNAL';
    const url = req ? (req.originalUrl || req.url || 'N/A') : 'N/A';
    const clientIp = req ? (req.ip || (req.socket && req.socket.remoteAddress) || '127.0.0.1') : '127.0.0.1';
    const stack = (err && err.stack) ? err.stack : (err && err.message ? err.message : String(err));
    const effectiveReason = reason || (err && err.message) || 'Internal Server Error';

    const logEntry = [
      `[${timestamp}] [STATUS ${statusCode}] [${method} ${url}] IP: ${clientIp}`,
      `Reason: ${effectiveReason}`,
      `Details: ${stack}`,
      '-'.repeat(80),
      ''
    ].join('\n');

    fs.appendFileSync(logFilePath, logEntry, 'utf8');
  } catch (logErr) {
    console.error('Failed writing to logs/error.logs:', logErr.message);
  }
}

/**
 * 5xx Error Guardian Middleware
 * Must accept 4 arguments: (err, req, res, next)
 * 
 * @param {Error|Object} err
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
function errorGuardian(err, req, res, next) {
  // Determine status code (default to 500 if not in 5xx range)
  let statusCode = 500;
  if (err && (err.status || err.statusCode)) {
    const code = Number(err.status || err.statusCode);
    if (!isNaN(code) && code >= 400 && code < 600) {
      statusCode = code;
    }
  }

  const reason = (err && (err.reason || err.message)) || 'An unexpected internal server error occurred.';
  const reqPath = req ? (req.originalUrl || req.url || '/') : '/';

  // 1. Write structured log to logs/error.logs (Task 6)
  logErrorToFile(err, req, statusCode, reason);

  // If headers have already been sent, delegate to Express default handler
  if (res.headersSent) {
    return next(err);
  }

  // 2. Check content negotiation: HTML vs JSON
  const isApiRequest = reqPath.startsWith('/api/') || reqPath === '/api';
  const acceptsHtml = req.headers.accept && req.headers.accept.includes('text/html');

  if (acceptsHtml && !isApiRequest) {
    // Deliver HTML error view for web clients
    return res.status(statusCode).send(serverErrorView.renderServerError({
      statusCode,
      message: err.message || 'Internal Server Error',
      reason
    }));
  }

  // 3. Deliver JSON error response with reason for API clients
  return res.status(statusCode).json({
    success: false,
    status: statusCode,
    error: statusCode >= 500 ? 'Internal Server Error' : 'Bad Request',
    reason,
    message: err.message || 'Internal Server Error',
    method: req ? req.method : 'UNKNOWN',
    path: reqPath,
    timestamp: new Date().toISOString()
  });
}

// Aliases and helpers
errorGuardian.errorGuardian = errorGuardian;
errorGuardian.serverErrorGuardian = errorGuardian;
errorGuardian.guardian5xx = errorGuardian;
errorGuardian.createServerErrorGuardian = () => errorGuardian;
errorGuardian.logErrorToFile = logErrorToFile;
errorGuardian.appendLogLine = logErrorToFile;

module.exports = errorGuardian;
