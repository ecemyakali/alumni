/**
 * ========================================================
 * View Layer: User View (UserView)
 * File: src/views/userView.js
 * ========================================================
 * 
 * Task 5: Dedicated View Layer for rendering User presentations.
 * Generates semantic, modern HTML views for:
 * 1. GET  .../users -> Users directory table and user registration form
 * 2. POST .../users -> Form submission confirmation and updated users list
 * 3. GET  .../users/:id -> Individual user profile presentation
 * 4. Error views (400, 404)
 */

const userView = {
  /**
   * Renders the complete HTML Users Directory page
   * Includes:
   * - Alumni Users table (GET /users)
   * - User registration form (POST /users)
   * - Feedback alert messages
   * 
   * @param {Array<Object>} users - List of user models
   * @param {Object} [options] - Optional rendering parameters (successMessage, errorMessage)
   * @returns {string} Formatted HTML document
   */
  renderUsersList(users = [], options = {}) {
    const { successMessage = null, errorMessage = null } = options;

    const userRows = users.length > 0
      ? users.map(u => `
        <tr>
          <td><span class="badge badge-id">#${u.id}</span></td>
          <td><strong>${this.escapeHtml(u.name)}</strong></td>
          <td>${this.escapeHtml(u.email)}</td>
          <td><span class="badge badge-role">${this.escapeHtml(u.role || 'alumni')}</span></td>
          <td>${this.escapeHtml(u.department || 'N/A')}</td>
          <td><small class="text-muted">${u.createdAt ? new Date(u.createdAt).toLocaleString() : '-'}</small></td>
        </tr>
      `).join('')
      : `<tr><td colspan="6" class="text-center text-muted py-4">No users registered yet. Use the form below to add the first user!</td></tr>`;

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Alumni Users Directory - Alumni Tracking System</title>
  <style>
    :root {
      --primary: #2563eb;
      --primary-dark: #1d4ed8;
      --success: #16a34a;
      --danger: #dc2626;
      --bg: #f8fafc;
      --card-bg: #ffffff;
      --text: #1e293b;
      --text-muted: #64748b;
      --border: #e2e8f0;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      background-color: var(--bg);
      color: var(--text);
      line-height: 1.5;
      padding: 2rem 1rem;
    }
    .container {
      max-width: 1000px;
      margin: 0 auto;
    }
    header {
      margin-bottom: 2rem;
      text-align: center;
    }
    h1 {
      font-size: 2rem;
      color: var(--text);
      margin-bottom: 0.5rem;
    }
    .subtitle {
      color: var(--text-muted);
      font-size: 1rem;
    }
    .card {
      background: var(--card-bg);
      border-radius: 12px;
      padding: 1.75rem;
      box-shadow: 0 4px 6px -1px rgba(0,0,0,0.07), 0 2px 4px -2px rgba(0,0,0,0.05);
      margin-bottom: 2rem;
      border: 1px solid var(--border);
    }
    .card-title {
      font-size: 1.25rem;
      font-weight: 600;
      margin-bottom: 1.25rem;
      border-bottom: 2px solid var(--border);
      padding-bottom: 0.5rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .alert {
      padding: 1rem 1.25rem;
      border-radius: 8px;
      margin-bottom: 1.5rem;
      font-weight: 500;
    }
    .alert-success {
      background-color: #dcfce7;
      color: #15803d;
      border: 1px solid #bbf7d0;
    }
    .alert-danger {
      background-color: #fee2e2;
      color: #b91c1c;
      border: 1px solid #fecaca;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      text-align: left;
    }
    th, td {
      padding: 0.75rem 1rem;
      border-bottom: 1px solid var(--border);
    }
    th {
      background-color: #f1f5f9;
      color: var(--text-muted);
      font-size: 0.85rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    tr:hover { background-color: #f8fafc; }
    .badge {
      display: inline-block;
      padding: 0.25rem 0.6rem;
      border-radius: 9999px;
      font-size: 0.75rem;
      font-weight: 600;
    }
    .badge-id { background: #e2e8f0; color: #475569; }
    .badge-role { background: #dbeafe; color: #1e40af; }
    .form-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 1rem;
    }
    .form-group {
      display: flex;
      flex-direction: column;
    }
    label {
      font-size: 0.875rem;
      font-weight: 600;
      margin-bottom: 0.35rem;
      color: var(--text);
    }
    input, select {
      padding: 0.65rem 0.85rem;
      border: 1px solid var(--border);
      border-radius: 6px;
      font-size: 0.95rem;
      transition: border-color 0.2s, box-shadow 0.2s;
    }
    input:focus, select:focus {
      outline: none;
      border-color: var(--primary);
      box-shadow: 0 0 0 3px rgba(37,99,235,0.15);
    }
    .form-actions {
      margin-top: 1.25rem;
    }
    button {
      background: var(--primary);
      color: #ffffff;
      border: none;
      border-radius: 6px;
      padding: 0.75rem 1.75rem;
      font-size: 0.95rem;
      font-weight: 600;
      cursor: pointer;
      transition: background-color 0.2s;
    }
    button:hover { background: var(--primary-dark); }
    .links {
      text-align: center;
      margin-top: 1.5rem;
      font-size: 0.9rem;
    }
    .links a {
      color: var(--primary);
      text-decoration: none;
      margin: 0 0.5rem;
    }
    .links a:hover { text-decoration: underline; }
    .text-center { text-align: center; }
    .text-muted { color: var(--text-muted); }
    .py-4 { padding-top: 1.5rem; padding-bottom: 1.5rem; }
  </style>
</head>
<body>
  <div class="container">
    <header>
      <h1>🎓 Alumni Users Directory</h1>
      <p class="subtitle">MVC View Layer: Web User Management Interface</p>
    </header>

    ${successMessage ? `<div class="alert alert-success">${this.escapeHtml(successMessage)}</div>` : ''}
    ${errorMessage ? `<div class="alert alert-danger">${this.escapeHtml(errorMessage)}</div>` : ''}

    <!-- View Layer: GET /users -> Displays Users Table -->
    <section class="card">
      <div class="card-title">
        <span>Registered Alumni Users</span>
        <span class="badge badge-role">${users.length} Total</span>
      </div>
      <div style="overflow-x: auto;">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Department</th>
              <th>Registered</th>
            </tr>
          </thead>
          <tbody>
            ${userRows}
          </tbody>
        </table>
      </div>
    </section>

    <!-- View Layer: POST /users -> Registration Form -->
    <section class="card">
      <div class="card-title">
        <span>Register New User (POST /users)</span>
      </div>
      <form method="POST" action="/users">
        <div class="form-grid">
          <div class="form-group">
            <label for="name">Full Name *</label>
            <input type="text" id="name" name="name" placeholder="e.g. Ece Yakali" required>
          </div>
          <div class="form-group">
            <label for="email">Email Address *</label>
            <input type="email" id="email" name="email" placeholder="e.g. ece@example.com" required>
          </div>
          <div class="form-group">
            <label for="role">Role</label>
            <select id="role" name="role">
              <option value="alumni" selected>Alumni</option>
              <option value="student">Student</option>
              <option value="faculty">Faculty</option>
              <option value="admin">Administrator</option>
            </select>
          </div>
          <div class="form-group">
            <label for="department">Department</label>
            <input type="text" id="department" name="department" placeholder="e.g. Computer Engineering">
          </div>
        </div>
        <div class="form-actions">
          <button type="submit">Submit & Register User</button>
        </div>
      </form>
    </section>

    <div class="links">
      <a href="/api/swagger">📖 Swagger UI Documentation</a> |
      <a href="/api/health">❤️ System Health Check</a> |
      <a href="/api/users">🌐 REST API (/api/users)</a>
    </div>
  </div>
</body>
</html>`;
  },

  /**
   * Renders single User Profile view page (GET /users/:id)
   * 
   * @param {Object} user - User model object
   * @returns {string} Formatted HTML document
   */
  renderUserDetail(user) {
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>User Profile - ${this.escapeHtml(user.name)}</title>
  <style>
    body { font-family: -apple-system, sans-serif; background: #f8fafc; color: #1e293b; padding: 2rem; }
    .card { max-width: 600px; margin: 0 auto; background: white; padding: 2rem; border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); border: 1px solid #e2e8f0; }
    h1 { font-size: 1.75rem; margin-bottom: 1rem; color: #1e293b; }
    p { margin: 0.5rem 0; font-size: 1rem; }
    .label { font-weight: 600; color: #64748b; }
    a { display: inline-block; margin-top: 1.5rem; color: #2563eb; text-decoration: none; font-weight: 500; }
    a:hover { text-decoration: underline; }
  </style>
</head>
<body>
  <div class="card">
    <h1>User Profile: ${this.escapeHtml(user.name)}</h1>
    <p><span class="label">User ID:</span> #${user.id}</p>
    <p><span class="label">Name:</span> ${this.escapeHtml(user.name)}</p>
    <p><span class="label">Email:</span> ${this.escapeHtml(user.email)}</p>
    <p><span class="label">Role:</span> ${this.escapeHtml(user.role || 'alumni')}</p>
    <p><span class="label">Department:</span> ${this.escapeHtml(user.department || 'N/A')}</p>
    <p><span class="label">Joined:</span> ${user.createdAt ? new Date(user.createdAt).toLocaleString() : '-'}</p>
    <a href="/users">← Back to Users Directory</a>
  </div>
</body>
</html>`;
  },

  /**
   * Renders error page
   * 
   * @param {string} message - Error explanation
   * @param {number} statusCode - HTTP status code
   * @returns {string} Formatted HTML document
   */
  renderError(message, statusCode = 404) {
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${statusCode} Error</title>
  <style>
    body { font-family: -apple-system, sans-serif; background: #f8fafc; color: #1e293b; padding: 3rem 1rem; text-align: center; }
    .card { max-width: 500px; margin: 0 auto; background: white; padding: 2.5rem; border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); border: 1px solid #e2e8f0; }
    h1 { font-size: 2rem; color: #dc2626; margin-bottom: 0.5rem; }
    p { color: #64748b; margin-bottom: 1.5rem; }
    a { color: #2563eb; text-decoration: none; font-weight: 500; }
  </style>
</head>
<body>
  <div class="card">
    <h1>${statusCode} Not Found</h1>
    <p>${this.escapeHtml(message)}</p>
    <a href="/users">← Return to Users Directory</a>
  </div>
</body>
</html>`;
  },

  /**
   * Basic HTML string sanitizer
   */
  escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
};

module.exports = userView;
