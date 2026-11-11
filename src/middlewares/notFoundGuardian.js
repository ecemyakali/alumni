/**
 * 404 Not Found Guardian Middleware
 * File: src/middlewares/notFoundGuardian.js
 * 
 * Intercepts unhandled routes and returns 404 Not Found with explicit reason.
 * Redirects invalid browser/HTML requests to the generic 404 page (/404).
 */

const notFoundView = require('../views/notFoundView');

/**
 * Generates an informative reason explaining why the request failed
 * @param {import('express').Request} req
 * @returns {string} Detailed reason string
 */
function buildNotFoundReason(req) {
  const method = req.method ? req.method.toUpperCase() : 'GET';
  const path = req.originalUrl || req.url || req.path || '/';
  return `The requested endpoint '${method} ${path}' does not exist on this server.`;
}

/**
 * 404 Guardian Middleware
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} [next]
 */
function notFoundGuardian(req, res, next) {
  const reason = req.notFoundReason || buildNotFoundReason(req);
  const path = req.originalUrl || req.url || req.path || '/';

  // 1. Direct request to the generic /404 route
  if (req.path === '/404') {
    return res.status(404).send(notFoundView.renderNotFound({
      path: req.query.from || '/404',
      reason: req.query.reason || 'The requested page could not be found.'
    }));
  }

  // 2. Check if client is a browser requesting HTML (and not an API endpoint)
  const isApiRequest = path.startsWith('/api/') || path === '/api';
  const acceptsHtml = req.headers.accept && req.headers.accept.includes('text/html');

  if (acceptsHtml && !isApiRequest) {
    // Redirect invalid HTML browser requests to the generic 404 page
    const redirectUrl = `/404?from=${encodeURIComponent(path)}&reason=${encodeURIComponent(reason)}`;
    return res.redirect(302, redirectUrl);
  }

  // 3. Return 404 JSON with reason for API consumers, Postman, curl, and automated tests
  return res.status(404).json({
    success: false,
    status: 404,
    error: 'Not Found',
    reason,
    method: req.method,
    path,
    timestamp: new Date().toISOString()
  });
}

// Aliases
notFoundGuardian.notFoundGuardian = notFoundGuardian;
notFoundGuardian.guardian404 = notFoundGuardian;
notFoundGuardian.createNotFoundGuardian = () => notFoundGuardian;
notFoundGuardian.genericNotFoundPageHandler = notFoundGuardian;
notFoundGuardian.buildNotFoundReason = buildNotFoundReason;

module.exports = notFoundGuardian;
