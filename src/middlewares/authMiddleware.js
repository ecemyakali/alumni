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
  if (req.headers && typeof req.headers.accept === 'string') {
    if (req.headers.accept.includes('text/html')) return true;
    if (req.headers.accept.includes('application/json')) return false;
  }
  // Web routes (not starting with /api) default to HTML browser requests
  if (req.path && !req.path.startsWith('/api')) {
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
  },

  /**
   * Route-level role-based access control (RBAC) guard
   * @param {...(string|string[])} allowedRoles - Single role or list of authorized roles
   * @returns {Function} Express middleware handler
   */
  requireRole(...allowedRoles) {
    const roles = allowedRoles.flat();

    return function roleGuard(req, res, next) {
      // 1. Unauthenticated users must log in first
      if (!req.user) {
        if (isHtmlRequest(req)) {
          const redirectUrl = req.originalUrl ? `?redirect=${encodeURIComponent(req.originalUrl)}` : '';
          return res.redirect(`/login${redirectUrl}`);
        }
        return res.status(401).json({
          success: false,
          error: 'Authentication required. Please log in.'
        });
      }

      // 2. Check if user's role matches any allowed role
      if (!roles.includes(req.user.role)) {
        if (isHtmlRequest(req)) {
          const forbiddenView = require('../views/forbiddenView');
          return res.status(403).send(forbiddenView.renderForbidden({
            currentUser: req.user,
            requiredRoles: roles
          }));
        }

        return res.status(403).json({
          success: false,
          error: `Forbidden: Insufficient privileges. Required role: ${roles.join(' or ')}.`,
          userRole: req.user.role,
          requiredRoles: roles
        });
      }

      // 3. User is authorized
      return next();
    };
  },

  /**
   * Shortcut guard requiring administrator privileges (role: 'admin')
   */
  requireAdmin(req, res, next) {
    return authMiddleware.requireRole('admin')(req, res, next);
  },

  /**
   * Shortcut guard requiring alumni or admin role
   */
  requireAlumniOrAdmin(req, res, next) {
    return authMiddleware.requireRole('admin', 'alumni')(req, res, next);
  },

  /**
   * Shortcut guard requiring faculty or admin role
   */
  requireFacultyOrAdmin(req, res, next) {
    return authMiddleware.requireRole('admin', 'faculty')(req, res, next);
  }
};

module.exports = authMiddleware;
