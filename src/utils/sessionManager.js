/**
 * Session & Token Manager
 * File: src/utils/sessionManager.js
 * 
 * Provides cryptographically secure session and token management:
 * - Issues 32-byte secure random tokens
 * - Manages in-memory active sessions with automatic TTL expiry
 * - Handles HTTP-only cookie extraction, serialization, and clearing
 * - Supports Bearer token authorization for RESTful APIs
 */

const crypto = require('crypto');

// Default session time-to-live: 24 hours
const DEFAULT_TTL_MS = 24 * 60 * 60 * 1000;
const COOKIE_NAME = 'alumni_session';

// In-memory active session store
const sessions = new Map();

const sessionManager = {
  COOKIE_NAME,

  /**
   * Generates a cryptographically random session token and stores the session
   * @param {Object} user - User domain entity
   * @param {number} [ttlMs=DEFAULT_TTL_MS] - Time to live in milliseconds
   * @returns {Object} Active session record
   */
  createSession(user, ttlMs = DEFAULT_TTL_MS) {
    if (!user || !user.id) {
      throw new Error('User entity with ID is required to create a session');
    }

    const token = crypto.randomBytes(32).toString('hex');
    const now = new Date();
    const expiresAt = new Date(now.getTime() + ttlMs);

    const session = {
      token,
      userId: Number(user.id),
      email: user.email,
      name: user.name,
      role: user.role || 'alumni',
      createdAt: now.toISOString(),
      expiresAt: expiresAt.toISOString()
    };

    sessions.set(token, session);
    return session;
  },

  /**
   * Retrieves and validates an active session by token
   * @param {string} token 
   * @returns {Object|null} Session record if valid and unexpired, else null
   */
  getSession(token) {
    if (!token || typeof token !== 'string') return null;

    const session = sessions.get(token);
    if (!session) return null;

    // Check expiration
    if (new Date(session.expiresAt) <= new Date()) {
      sessions.delete(token);
      return null;
    }

    return session;
  },

  /**
   * Invalidates and deletes a session token
   * @param {string} token 
   * @returns {boolean} True if a session was removed
   */
  destroySession(token) {
    if (!token || typeof token !== 'string') return false;
    return sessions.delete(token);
  },

  /**
   * Invalidates all active sessions for a specific user ID
   * @param {number|string} userId 
   * @returns {number} Number of revoked sessions
   */
  destroyUserSessions(userId) {
    const numId = Number(userId);
    let revoked = 0;
    for (const [token, session] of sessions.entries()) {
      if (session.userId === numId) {
        sessions.delete(token);
        revoked++;
      }
    }
    return revoked;
  },

  /**
   * Clears all sessions (useful for test isolation)
   */
  clearAll() {
    sessions.clear();
  },

  /**
   * Total number of currently active sessions
   * @returns {number}
   */
  count() {
    // Purge any expired sessions before returning count
    const now = new Date();
    for (const [token, session] of sessions.entries()) {
      if (new Date(session.expiresAt) <= now) {
        sessions.delete(token);
      }
    }
    return sessions.size;
  },

  /**
   * Parses Cookie request header into a dictionary of key-value pairs
   * @param {string} cookieHeader 
   * @returns {Object}
   */
  parseCookies(cookieHeader) {
    const list = {};
    if (!cookieHeader || typeof cookieHeader !== 'string') return list;

    cookieHeader.split(';').forEach(cookie => {
      let [name, ...rest] = cookie.split('=');
      name = name.trim();
      if (!name) return;
      const value = rest.join('=').trim();
      list[name] = decodeURIComponent(value);
    });

    return list;
  },

  /**
   * Extracts session token from HTTP request headers (Bearer auth or Cookie)
   * @param {Object} req - Express request object
   * @returns {string|null} Extracted token or null
   */
  extractToken(req) {
    if (!req) return null;

    // 1. Authorization: Bearer <token>
    const authHeader = req.headers && req.headers.authorization;
    if (authHeader && typeof authHeader === 'string') {
      const parts = authHeader.split(' ');
      if (parts.length === 2 && /^Bearer$/i.test(parts[0])) {
        return parts[1].trim();
      }
    }

    // 2. Cookie: alumni_session=<token>
    const cookieHeader = req.headers && req.headers.cookie;
    if (cookieHeader) {
      const cookies = this.parseCookies(cookieHeader);
      if (cookies[COOKIE_NAME]) {
        return cookies[COOKIE_NAME];
      }
      if (cookies['alumni_token']) {
        return cookies['alumni_token'];
      }
    }

    // 3. Query Parameter: ?token=<token>
    if (req.query && req.query.token && typeof req.query.token === 'string') {
      return req.query.token.trim();
    }

    return null;
  },

  /**
   * Writes Set-Cookie header for session token
   * @param {Object} res - Express response object
   * @param {string} token - Session token
   * @param {number} [maxAgeSeconds=86400] - 24 hours in seconds
   */
  setSessionCookie(res, token, maxAgeSeconds = 86400) {
    if (!res || !res.setHeader) return;
    res.setHeader(
      'Set-Cookie',
      `${COOKIE_NAME}=${encodeURIComponent(token)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${maxAgeSeconds}`
    );
  },

  /**
   * Writes Set-Cookie header that expires and destroys the cookie
   * @param {Object} res - Express response object
   */
  clearSessionCookie(res) {
    if (!res || !res.setHeader) return;
    res.setHeader(
      'Set-Cookie',
      `${COOKIE_NAME}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; SameSite=Lax`
    );
  }
};

module.exports = sessionManager;
