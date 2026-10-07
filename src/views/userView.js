/**
 * ========================================================
 * View Layer: User View (UserView)
 * File: src/views/userView.js
 * ========================================================
 * 
 * Task 5 & Task 6: Dedicated View Layer for all User CRUD operations:
 * 1. CREATE: User registration form & success feedback view (POST /users)
 * 2. READ (All): Users Directory table with row actions (GET /users)
 * 3. READ (One): Individual User Profile card view (GET /users/:id)
 * 4. UPDATE: Pre-filled User Edit form view (GET /users/:id/edit) & update confirmation
 * 5. DELETE: Row-level delete form action & deletion feedback view (POST /users/:id/delete)
 * 6. ERRORS: Semantic error view pages (400, 404)
 */

const userView = {
  /**
   * Renders the complete HTML Users Directory page
   * Includes:
   * - Alumni Users table with View, Edit, and Delete actions
   * - User registration form (Create)
   * - Success and error alert feedback banners
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
          <td><small class="text-muted">${u.createdAt ? new Date(u.createdAt).toLocaleDateString() : '-'}</small></td>
          <td class="action-cell">
            <a href="/users/${u.id}" class="btn-sm btn-view" title="View Profile">View</a>
            <a href="/users/${u.id}/edit" class="btn-sm btn-edit" title="Edit User">Edit</a>
            <form method="POST" action="/users/${u.id}/delete" style="display:inline;" onsubmit="return confirm('Are you sure you want to delete ${this.escapeHtml(u.name)}?');">
              <button type="submit" class="btn-sm btn-delete" title="Delete User">Delete</button>
            </form>
          </td>
        </tr>
      `).join('')
      : `<tr><td colspan="7" class="text-center text-muted py-4">No users registered yet. Use the form below to add the first user!</td></tr>`;

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
      --warning: #d97706;
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
      max-width: 1050px;
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
      padding: 0.75rem 0.85rem;
      border-bottom: 1px solid var(--border);
      font-size: 0.95rem;
    }
    th {
      background-color: #f1f5f9;
      color: var(--text-muted);
      font-size: 0.82rem;
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
    .action-cell {
      white-space: nowrap;
    }
    .btn-sm {
      display: inline-block;
      padding: 0.3rem 0.65rem;
      font-size: 0.8rem;
      font-weight: 600;
      border-radius: 4px;
      text-decoration: none;
      cursor: pointer;
      border: none;
      margin-right: 0.25rem;
      transition: background-color 0.15s;
    }
    .btn-view { background: #e0f2fe; color: #0369a1; }
    .btn-view:hover { background: #bae6fd; }
    .btn-edit { background: #fef3c7; color: #b45309; }
    .btn-edit:hover { background: #fde68a; }
    .btn-delete { background: #fee2e2; color: #b91c1c; }
    .btn-delete:hover { background: #fecaca; }
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
    button[type="submit"] {
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
    button[type="submit"]:hover { background: var(--primary-dark); }
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
      <p class="subtitle">MVC Architecture: Full Web CRUD Operations with Dedicated View Layer</p>
    </header>

    ${successMessage ? `<div class="alert alert-success">${this.escapeHtml(successMessage)}</div>` : ''}
    ${errorMessage ? `<div class="alert alert-danger">${this.escapeHtml(errorMessage)}</div>` : ''}

    <!-- READ ALL VIEW: GET /users -->
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
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            ${userRows}
          </tbody>
        </table>
      </div>
    </section>

    <!-- CREATE VIEW: POST /users -->
    <section class="card">
      <div class="card-title">
        <span>Register New User (CREATE)</span>
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
      <a href="/api/swagger">📖 Interactive Swagger UI</a> |
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
   * @param {Object} [options] - Optional options
   * @returns {string} Formatted HTML document
   */
  renderUserDetail(user, options = {}) {
    const { successMessage = null } = options;

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>User Profile - ${this.escapeHtml(user.name)}</title>
  <style>
    body { font-family: -apple-system, sans-serif; background: #f8fafc; color: #1e293b; padding: 2rem 1rem; }
    .card { max-width: 600px; margin: 0 auto; background: white; padding: 2rem; border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); border: 1px solid #e2e8f0; }
    h1 { font-size: 1.75rem; margin-bottom: 1.25rem; color: #1e293b; border-bottom: 2px solid #e2e8f0; padding-bottom: 0.5rem; }
    .alert-success { background: #dcfce7; color: #15803d; border: 1px solid #bbf7d0; padding: 0.75rem 1rem; border-radius: 6px; margin-bottom: 1rem; }
    p { margin: 0.65rem 0; font-size: 1rem; }
    .label { font-weight: 600; color: #64748b; width: 120px; display: inline-block; }
    .btn-group { margin-top: 1.75rem; display: flex; gap: 0.75rem; align-items: center; }
    .btn { display: inline-block; padding: 0.5rem 1rem; font-size: 0.9rem; font-weight: 600; border-radius: 6px; text-decoration: none; cursor: pointer; border: none; }
    .btn-primary { background: #2563eb; color: white; }
    .btn-edit { background: #fef3c7; color: #b45309; }
    .btn-danger { background: #fee2e2; color: #b91c1c; }
    .btn-back { color: #64748b; text-decoration: none; margin-left: auto; }
    .btn-back:hover { text-decoration: underline; }
  </style>
</head>
<body>
  <div class="card">
    ${successMessage ? `<div class="alert-success">${this.escapeHtml(successMessage)}</div>` : ''}
    <h1>User Profile: ${this.escapeHtml(user.name)}</h1>
    <p><span class="label">User ID:</span> <strong>#${user.id}</strong></p>
    <p><span class="label">Full Name:</span> ${this.escapeHtml(user.name)}</p>
    <p><span class="label">Email:</span> ${this.escapeHtml(user.email)}</p>
    <p><span class="label">Role:</span> <span style="background:#dbeafe;color:#1e40af;padding:2px 8px;border-radius:10px;font-size:0.85rem;">${this.escapeHtml(user.role || 'alumni')}</span></p>
    <p><span class="label">Department:</span> ${this.escapeHtml(user.department || 'N/A')}</p>
    <p><span class="label">Created:</span> ${user.createdAt ? new Date(user.createdAt).toLocaleString() : '-'}</p>
    ${user.updatedAt ? `<p><span class="label">Updated:</span> ${new Date(user.updatedAt).toLocaleString()}</p>` : ''}

    <div class="btn-group">
      <a href="/users/${user.id}/edit" class="btn btn-edit">✏️ Edit Profile</a>
      <form method="POST" action="/users/${user.id}/delete" style="display:inline;" onsubmit="return confirm('Delete this user profile?');">
        <button type="submit" class="btn btn-danger">🗑️ Delete</button>
      </form>
      <a href="/users" class="btn-back">← Back to Users</a>
    </div>
  </div>
</body>
</html>`;
  },

  /**
   * Renders the Edit User Form View (GET /users/:id/edit)
   * 
   * @param {Object} user - User to edit
   * @param {Object} [options] - Optional options
   * @returns {string} Formatted HTML document
   */
  renderEditUserForm(user, options = {}) {
    const { errorMessage = null } = options;

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Edit User #${user.id} - ${this.escapeHtml(user.name)}</title>
  <style>
    body { font-family: -apple-system, sans-serif; background: #f8fafc; color: #1e293b; padding: 2rem 1rem; }
    .card { max-width: 600px; margin: 0 auto; background: white; padding: 2rem; border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); border: 1px solid #e2e8f0; }
    h1 { font-size: 1.5rem; margin-bottom: 1.25rem; border-bottom: 2px solid #e2e8f0; padding-bottom: 0.5rem; }
    .alert-danger { background: #fee2e2; color: #b91c1c; border: 1px solid #fecaca; padding: 0.75rem 1rem; border-radius: 6px; margin-bottom: 1rem; }
    .form-group { margin-bottom: 1rem; display: flex; flex-direction: column; }
    label { font-weight: 600; margin-bottom: 0.35rem; font-size: 0.9rem; }
    input, select { padding: 0.65rem 0.85rem; border: 1px solid #cbd5e1; border-radius: 6px; font-size: 0.95rem; }
    input:focus, select:focus { outline: none; border-color: #2563eb; }
    .btn-group { margin-top: 1.5rem; display: flex; gap: 0.75rem; align-items: center; }
    button[type="submit"] { background: #2563eb; color: white; border: none; padding: 0.75rem 1.5rem; border-radius: 6px; font-weight: 600; cursor: pointer; }
    button[type="submit"]:hover { background: #1d4ed8; }
    .btn-cancel { color: #64748b; text-decoration: none; }
    .btn-cancel:hover { text-decoration: underline; }
  </style>
</head>
<body>
  <div class="card">
    <h1>✏️ Edit User #${user.id}: ${this.escapeHtml(user.name)}</h1>
    ${errorMessage ? `<div class="alert-danger">${this.escapeHtml(errorMessage)}</div>` : ''}

    <!-- UPDATE FORM: POST /users/:id/update -->
    <form method="POST" action="/users/${user.id}/update">
      <div class="form-group">
        <label for="name">Full Name *</label>
        <input type="text" id="name" name="name" value="${this.escapeHtml(user.name)}" required>
      </div>
      <div class="form-group">
        <label for="email">Email Address *</label>
        <input type="email" id="email" name="email" value="${this.escapeHtml(user.email)}" required>
      </div>
      <div class="form-group">
        <label for="role">Role</label>
        <select id="role" name="role">
          <option value="alumni" ${user.role === 'alumni' ? 'selected' : ''}>Alumni</option>
          <option value="student" ${user.role === 'student' ? 'selected' : ''}>Student</option>
          <option value="faculty" ${user.role === 'faculty' ? 'selected' : ''}>Faculty</option>
          <option value="admin" ${user.role === 'admin' ? 'selected' : ''}>Administrator</option>
        </select>
      </div>
      <div class="form-group">
        <label for="department">Department</label>
        <input type="text" id="department" name="department" value="${this.escapeHtml(user.department || '')}">
      </div>

      <div class="btn-group">
        <button type="submit">Save Changes</button>
        <a href="/users/${user.id}" class="btn-cancel">Cancel</a>
        <a href="/users" class="btn-cancel" style="margin-left:auto;">← Directory</a>
      </div>
    </form>
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
