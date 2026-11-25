/**
 * RESTful Authentication API Controller
 * File: src/controllers/apiAuthController.js
 * 
 * Provides RESTful JSON API endpoints for user registration & authentication:
 * - POST /api/auth/register -> Validates JSON, hashes password, assigns non-admin role, returns 201 JSON
 * - POST /api/auth/login    -> Validates credentials, issues session token, returns 200 JSON
 * - POST /api/auth/logout   -> Invalidates active session token, clears cookie, returns 200 JSON
 * - GET  /api/auth/me       -> Retrieves current authenticated user profile
 */

const userModel = require('../models/userModel');
const authUtils = require('../utils/authUtils');
const sessionManager = require('../utils/sessionManager');

const apiAuthController = {
  /**
   * POST /api/auth/register
   * Registers a new user account via JSON API
   */
  register(req, res) {
    const rawData = req.body || {};

    const formData = {
      name: typeof rawData.name === 'string' ? rawData.name.trim() : '',
      email: typeof rawData.email === 'string' ? rawData.email.trim() : '',
      password: typeof rawData.password === 'string' ? rawData.password : '',
      department: typeof rawData.department === 'string' ? rawData.department.trim() : '',
      graduationYear: rawData.graduationYear !== undefined ? Number(rawData.graduationYear) : NaN,
      currentRole: typeof rawData.currentRole === 'string' ? rawData.currentRole.trim() : '',
      company: typeof rawData.company === 'string' ? rawData.company.trim() : '',
      linkedinUrl: typeof rawData.linkedinUrl === 'string' ? rawData.linkedinUrl.trim() : ''
    };

    // 1. Validate inputs
    const validation = authUtils.validateRegistration(formData);
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        errors: validation.errors
      });
    }

    // 2. Email uniqueness check (409 Conflict)
    const existing = userModel.findByEmail(formData.email);
    if (existing) {
      return res.status(409).json({
        success: false,
        error: 'An account with this email address already exists.'
      });
    }

    // 3. Password hashing
    const passwordHash = authUtils.hashPassword(formData.password);

    // 4. Default non-admin role assignment (prevents role elevation)
    const assignedRole = authUtils.determineDefaultRole(formData.graduationYear);

    // 5. Create user in model
    const newUser = userModel.create({
      name: formData.name,
      email: formData.email,
      department: formData.department,
      graduationYear: formData.graduationYear,
      role: assignedRole,
      status: 'ACTIVE',
      currentRole: formData.currentRole,
      company: formData.company,
      linkedinUrl: formData.linkedinUrl,
      passwordHash
    });

    const safeUser = userModel.sanitize(newUser);

    return res.status(201).json({
      success: true,
      message: 'Account registered successfully',
      data: safeUser
    });
  },

  /**
   * POST /api/auth/login
   * Authenticates user via JSON API and returns session token
   */
  login(req, res) {
    const { email, password } = req.body || {};

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Email and password are required.'
      });
    }

    const verifiedUser = userModel.verifyCredentials(email, password);
    if (!verifiedUser) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password.'
      });
    }

    if (verifiedUser.status && verifiedUser.status !== 'ACTIVE') {
      return res.status(403).json({
        success: false,
        error: `Account status is ${verifiedUser.status}. Access denied.`
      });
    }

    // Generate active session token
    const session = sessionManager.createSession(verifiedUser);
    sessionManager.setSessionCookie(res, session.token);

    const safeUser = userModel.sanitize(verifiedUser);

    return res.status(200).json({
      success: true,
      message: 'Authentication successful',
      token: session.token,
      expiresAt: session.expiresAt,
      data: safeUser
    });
  },

  /**
   * POST /api/auth/logout
   * Invalidates active session token and clears cookie
   */
  logout(req, res) {
    const token = sessionManager.extractToken(req);
    if (token) {
      sessionManager.destroySession(token);
    }
    sessionManager.clearSessionCookie(res);

    return res.status(200).json({
      success: true,
      message: 'Logged out successfully'
    });
  },

  /**
   * GET /api/auth/me
   * Returns current authenticated user identity
   */
  getCurrentUser(req, res) {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required. No valid session or token provided.'
      });
    }

    const safeUser = userModel.sanitize(req.user);

    return res.status(200).json({
      success: true,
      data: safeUser,
      session: req.session
    });
  }
};

module.exports = apiAuthController;
