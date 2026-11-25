/**
 * Web Authentication Controller
 * File: src/controllers/authController.js
 * 
 * Handles browser-based registration and authentication flows:
 * - GET  /register -> Renders interactive registration form
 * - POST /register -> Validates input, hashes password, assigns non-admin role, creates account
 * - GET  /login    -> Renders sign-in portal with status/error alerts
 * - POST /login    -> Verifies credentials, issues session token & cookie, redirects to application
 * - GET  /logout   -> Destroys session, clears cookie, redirects to login
 * - POST /logout   -> Form-action logout handler
 */

const userModel = require('../models/userModel');
const authView = require('../views/authView');
const authUtils = require('../utils/authUtils');
const sessionManager = require('../utils/sessionManager');

const authController = {
  /**
   * GET /register
   * Renders the registration view
   */
  renderRegisterPage(req, res) {
    return res.status(200).send(authView.renderRegister({
      formData: {},
      errors: []
    }));
  },

  /**
   * POST /register
   * Processes registration form submission with server-side validation and password hashing
   */
  handleRegister(req, res) {
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

    // 1. Server-side validation
    const validation = authUtils.validateRegistration(formData);
    if (!validation.isValid) {
      return res.status(400).send(authView.renderRegister({
        formData,
        errors: validation.errors
      }));
    }

    // 2. Check email uniqueness (case-insensitive)
    const existingUser = userModel.findByEmail(formData.email);
    if (existingUser) {
      return res.status(400).send(authView.renderRegister({
        formData,
        errors: ['An account with this email address already exists. Please log in or use a different email address.']
      }));
    }

    // 3. Secure password hashing
    const passwordHash = authUtils.hashPassword(formData.password);

    // 4. Default non-admin role assignment (enforcing domain invariants)
    const assignedRole = authUtils.determineDefaultRole(formData.graduationYear);

    // 5. Create user record
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

    // 6. Return registration confirmation view
    return res.status(201).send(authView.renderRegisterSuccess(newUser));
  },

  /**
   * GET /login
   * Renders the login view with dynamic status alerts
   */
  renderLoginPage(req, res) {
    let message = '';
    if (req.query) {
      if (req.query.registered) {
        message = 'Account created successfully! Please sign in with your credentials.';
      } else if (req.query.logged_out) {
        message = 'You have been signed out successfully.';
      } else if (req.query.expired) {
        message = 'Your session has expired. Please sign in again.';
      }
    }

    const email = (req.query && req.query.email) || '';
    const redirect = (req.query && req.query.redirect) || '';

    return res.status(200).send(authView.renderLogin({
      email,
      message,
      error: '',
      currentUser: req.user,
      redirect
    }));
  },

  /**
   * POST /login
   * Verifies credentials, generates session, sets HttpOnly cookie, and redirects
   */
  handleLogin(req, res) {
    const rawData = req.body || {};
    const email = typeof rawData.email === 'string' ? rawData.email.trim() : '';
    const password = typeof rawData.password === 'string' ? rawData.password : '';
    const redirect = typeof rawData.redirect === 'string' && rawData.redirect.startsWith('/') && !rawData.redirect.startsWith('//')
      ? rawData.redirect
      : '/users';

    // 1. Validate required fields
    if (!email || !password) {
      return res.status(400).send(authView.renderLogin({
        email,
        error: 'Email address and password are required.',
        currentUser: null,
        redirect
      }));
    }

    // 2. Verify credentials
    const verifiedUser = userModel.verifyCredentials(email, password);
    if (!verifiedUser) {
      return res.status(401).send(authView.renderLogin({
        email,
        error: 'Invalid email address or password. Please verify your credentials.',
        currentUser: null,
        redirect
      }));
    }

    // 3. Status boundary check (cannot log in if suspended or deactivated)
    if (verifiedUser.status && verifiedUser.status !== 'ACTIVE') {
      return res.status(403).send(authView.renderLogin({
        email,
        error: `Account status is ${verifiedUser.status}. Access denied.`,
        currentUser: null,
        redirect
      }));
    }

    // 4. Issue session token and write HttpOnly session cookie
    const session = sessionManager.createSession(verifiedUser);
    sessionManager.setSessionCookie(res, session.token);

    // 5. Redirect to destination application page
    return res.redirect(302, redirect);
  },

  /**
   * GET & POST /logout
   * Destroys active session, clears cookie, and redirects to login view
   */
  handleLogout(req, res) {
    const token = sessionManager.extractToken(req);
    if (token) {
      sessionManager.destroySession(token);
    }
    sessionManager.clearSessionCookie(res);

    return res.redirect(302, '/login?logged_out=true');
  }
};

module.exports = authController;
