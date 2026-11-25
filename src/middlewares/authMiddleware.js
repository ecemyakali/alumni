/**
 * Authentication Middleware
 * File: src/middlewares/authMiddleware.js
 * 
 * Provides session-aware request decoration and access control guards:
 * - attachUser: Inspects request headers and cookies, decorating req.user and res.locals.currentUser
 * - requireAuth: Enforces authentication, redirecting unauthenticated web clients or returning 401 JSON
 */

const sessionManager = require('../utils/sessionManager');
const userModel = require('../models/userModel');

/**
 * Checks if request prefers HTML response
 */
function isHtmlRequest(req) {
  if (req.headers && typeof req.headers.accept === 'string' && req.headers.accept.includes('text/html')) {
    return true;
  }
  return false;
}

const authMiddleware = {
  /**
   * Global middleware that detects active sessions and binds authenticated user to req & res.locals
   */
  attachUser(req, res, next) {
    req.user = null;
    req.session = null;
    res.locals.currentUser = null;
    res.locals.session = null;

    const token = sessionManager.extractToken(req);
    if (!token) {
      return next();
    }

    const session = sessionManager.getSession(token);
    if (!session) {
      return next();
    }

    const user = userModel.findById(session.userId);
    if (!user) {
      // Invalidate orphaned session
      sessionManager.destroySession(token);
      return next();
    }

    req.user = user;
    req.session = session;
    res.locals.currentUser = user;
    res.locals.session = session;

    return next();
  },

  /**
   * Route-level guard that requires an authenticated session
   */
  requireAuth(req, res, next) {
    if (req.user) {
      return next();
    }

    if (isHtmlRequest(req)) {
      const redirectUrl = req.originalUrl ? `?redirect=${encodeURIComponent(req.originalUrl)}` : '';
      return res.redirect(`/login${redirectUrl}`);
    }

    return res.status(401).json({
      success: false,
      error: 'Authentication required. Please log in.'
    });
  }
};

module.exports = authMiddleware;
