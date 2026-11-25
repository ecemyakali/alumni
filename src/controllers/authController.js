/**
 * Web Authentication Controller
 * File: src/controllers/authController.js
 * 
 * Handles browser-based registration and authentication flows:
 * - GET  /register -> Renders interactive registration form
 * - POST /register -> Validates input, hashes password, assigns non-admin role, creates account
 * - GET  /login    -> Renders sign-in portal
 * - POST /login    -> Verifies credentials
 */

const userModel = require('../models/userModel');
const authView = require('../views/authView');
const authUtils = require('../utils/authUtils');

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
   * Renders the login view
   */
  renderLoginPage(req, res) {
    const message = req.query && req.query.registered ? 'Account created successfully! Please sign in.' : '';
    return res.status(200).send(authView.renderLogin({ message }));
  },

  /**
   * POST /login
   * Validates credentials
   */
  handleLogin(req, res) {
    const { email, password } = req.body || {};

    if (!email || !password) {
      return res.status(400).send(authView.renderLogin({
        error: 'Email and password are required.'
      }));
    }

    const verifiedUser = userModel.verifyCredentials(email, password);
    if (!verifiedUser) {
      return res.status(401).send(authView.renderLogin({
        error: 'Invalid email or password.'
      }));
    }

    return res.status(200).send(authView.renderLogin({
      message: `Welcome back, ${verifiedUser.name}! (Signed in successfully as ${verifiedUser.role})`
    }));
  }
};

module.exports = authController;
