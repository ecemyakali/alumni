/**
 * Authentication & Security Utilities
 * File: src/utils/authUtils.js
 * 
 * Provides password hashing, credential verification, and registration validation
 * enforcing Domain-Driven Design (DDD) rules and security invariants.
 */

const bcrypt = require('bcryptjs');

const BCRYPT_SALT_ROUNDS = 10;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_COMPLEXITY_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;

const authUtils = {
  /**
   * Hashes a plain-text password using bcrypt
   * @param {string} password 
   * @returns {string} Hashed password
   */
  hashPassword(password) {
    if (!password || typeof password !== 'string') {
      throw new Error('Password must be a non-empty string');
    }
    return bcrypt.hashSync(password, BCRYPT_SALT_ROUNDS);
  },

  /**
   * Compares a plain password against a bcrypt hash
   * @param {string} password 
   * @param {string} hash 
   * @returns {boolean}
   */
  comparePassword(password, hash) {
    if (!password || !hash || typeof password !== 'string' || typeof hash !== 'string') {
      return false;
    }
    try {
      return bcrypt.compareSync(password, hash);
    } catch {
      return false;
    }
  },

  /**
   * Validates password complexity:
   * Min 8 chars, at least 1 uppercase, 1 lowercase, 1 digit, 1 special character.
   * @param {string} password 
   * @returns {{ isValid: boolean, message?: string }}
   */
  validatePasswordComplexity(password) {
    if (!password || typeof password !== 'string') {
      return { isValid: false, message: 'Password is required' };
    }
    if (password.length < 8) {
      return { isValid: false, message: 'Password must be at least 8 characters long' };
    }
    if (!PASSWORD_COMPLEXITY_REGEX.test(password)) {
      return {
        isValid: false,
        message: 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character (!@#$%^&* etc.)'
      };
    }
    return { isValid: true };
  },

  /**
   * Validates standard RFC 5322 email format
   * @param {string} email 
   * @returns {boolean}
   */
  validateEmail(email) {
    return Boolean(email && typeof email === 'string' && EMAIL_REGEX.test(email.trim()));
  },

  /**
   * Validates graduation year within valid academic bounds [1950, 2100]
   * @param {number|string} year 
   * @returns {boolean}
   */
  validateGraduationYear(year) {
    const num = Number(year);
    return !isNaN(num) && Number.isInteger(num) && num >= 1950 && num <= 2100;
  },

  /**
   * Automatically determines default role based on graduation year
   * (Alumni if graduated; Student if expected graduation is in the future).
   * Prevents self-assignment of administrative or faculty roles.
   * @param {number|string} graduationYear 
   * @returns {'student'|'alumni'}
   */
  determineDefaultRole(graduationYear) {
    const currentYear = new Date().getFullYear();
    const year = Number(graduationYear);
    if (!isNaN(year) && year > currentYear) {
      return 'student';
    }
    return 'alumni';
  },

  /**
   * Validates registration form inputs (server-side validation)
   * @param {Object} data 
   * @returns {{ isValid: boolean, errors: string[] }}
   */
  validateRegistration(data = {}) {
    const errors = [];

    // 1. Full Name
    if (!data.name || typeof data.name !== 'string' || data.name.trim().length < 2) {
      errors.push('Full Name is required (minimum 2 characters).');
    } else if (data.name.trim().length > 255) {
      errors.push('Full Name cannot exceed 255 characters.');
    }

    // 2. Email
    if (!data.email || !this.validateEmail(data.email)) {
      errors.push('A valid email address is required (e.g. name@university.edu).');
    }

    // 3. Password
    const passwordCheck = this.validatePasswordComplexity(data.password);
    if (!passwordCheck.isValid) {
      errors.push(passwordCheck.message);
    }

    // 4. Graduation Year
    if (!data.graduationYear || !this.validateGraduationYear(data.graduationYear)) {
      errors.push('Graduation Year must be a valid 4-digit year between 1950 and 2100.');
    }

    // 5. Department / Major
    if (!data.department || typeof data.department !== 'string' || data.department.trim().length < 2) {
      errors.push('Department or Major is required (minimum 2 characters).');
    }

    // 6. Optional LinkedIn URL validation
    if (data.linkedinUrl && typeof data.linkedinUrl === 'string' && data.linkedinUrl.trim()) {
      const trimmedUrl = data.linkedinUrl.trim();
      if (!trimmedUrl.startsWith('http://') && !trimmedUrl.startsWith('https://') && !trimmedUrl.includes('linkedin.com')) {
        errors.push('LinkedIn Profile must be a valid URL (e.g. https://linkedin.com/in/username).');
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
};

module.exports = authUtils;
