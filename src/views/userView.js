/**
 * ========================================================
 * View Layer: User View (UserView) - Tactile SaaS Design
 * File: src/views/userView.js
 * ========================================================
 */

const sharedLayout = require('./sharedLayout');

const userView = {
  escapeHtml: sharedLayout.escapeHtml,

  /**
   * Renders the complete HTML Users Directory page (GET /users)
   */
  renderUsersList(users = [], options = {}) {
    const { successMessage = null, errorMessage = null } = options;

    const userRows = users.length > 0
      ? users.map(u => `
        <tr>
          <td><span class="badge-pill badge-id">#${u.id}</span></td>
          <td>
            <a href="/users/${u.id}" style="color:var(--colors-ink); text-decoration:none; font-weight:600;">
              ${this.escapeHtml(u.name)}
            </a>
          </td>
          <td><span style="color:var(--colors-body);">${this.escapeHtml(u.email)}</span></td>
          <td><span class="badge-pill badge-role-${(u.role || 'alumni').toLowerCase()}">${this.escapeHtml(u.role || 'alumni')}</span></td>
          <td>${this.escapeHtml(u.department || 'N/A')}</td>
          <td><small style="color:var(--colors-muted);">${u.createdAt ? new Date(u.createdAt).toLocaleDateString() : '-'}</small></td>
          <td>
            <div style="display:flex; gap:6px;">
              <a href="/users/${u.id}" class="btn-action-view" title="View Profile">View</a>
              <a href="/users/${u.id}/edit" class="btn-action-edit" title="Edit User">Edit</a>
              <form method="POST" action="/users/${u.id}/delete" style="display:inline;" onsubmit="return confirm('Are you sure you want to delete ${this.escapeHtml(u.name)}?');">
                <button type="submit" class="btn-action-delete" title="Delete User">Delete</button>
              </form>
            </div>
          </td>
        </tr>
      `).join('')
      : `<tr><td colspan="7" style="text-align:center; color:var(--colors-muted); padding:2rem;">No users registered yet. Use the form below to add the first user!</td></tr>`;

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Alumni Users Directory - Alumni Tracking System</title>
  <style>
    ${sharedLayout.getCommonStyles()}
  </style>
</head>
<body>

  ${sharedLayout.renderNavbar('users')}

  <main class="page-wrapper">
    <div class="page-header-band">
      <div>
        <div class="page-header-pill">
          <span>👥 Verified Alumni Network</span>
        </div>
        <h1 class="page-title">Alumni Users Directory</h1>
        <p class="page-subtitle">
          Manage and connect with verified graduates, students, and faculty across all university departments.
        </p>
      </div>
      <div>
        <a href="#register-user-section" class="btn-clay-primary">+ Register Alumnus</a>
      </div>
    </div>

    ${successMessage ? `<div class="alert-banner alert-success"><span>✅</span> <span>${this.escapeHtml(successMessage)}</span></div>` : ''}
    ${errorMessage ? `<div class="alert-banner alert-danger"><span>⚠️</span> <span>${this.escapeHtml(errorMessage)}</span></div>` : ''}

    <!-- READ ALL VIEW: GET /users -->
    <section class="content-card">
      <div class="card-header-bar">
        <h2 class="card-heading">Registered Alumni Users</h2>
        <span class="badge-pill badge-id">${users.length} Total</span>
      </div>
      <div class="table-container">
        <table class="data-table">
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
    <section id="register-user-section" class="content-card">
      <div class="card-header-bar">
        <h2 class="card-heading">Register New User (CREATE)</h2>
      </div>
      <form method="POST" action="/users">
        <div class="form-grid">
          <div class="form-group">
            <label class="form-label" for="name">Full Name *</label>
            <input class="form-input" type="text" id="name" name="name" placeholder="e.g. Ece Yakali" required>
          </div>
          <div class="form-group">
            <label class="form-label" for="email">Email Address *</label>
            <input class="form-input" type="email" id="email" name="email" placeholder="e.g. ece@example.com" required>
          </div>
          <div class="form-group">
            <label class="form-label" for="role">Role</label>
            <select class="form-select" id="role" name="role">
              <option value="alumni" selected>Alumni</option>
              <option value="student">Student</option>
              <option value="faculty">Faculty</option>
              <option value="admin">Administrator</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label" for="department">Department</label>
            <input class="form-input" type="text" id="department" name="department" placeholder="e.g. Computer Engineering">
          </div>
        </div>
        <div style="margin-top:1.5rem;">
          <button type="submit" class="btn-clay-primary">Submit & Register User</button>
        </div>
      </form>
    </section>
  </main>

  ${sharedLayout.renderFooter()}

</body>
</html>`;
  },

  /**
   * Renders single User Profile view page (GET /users/:id)
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
    ${sharedLayout.getCommonStyles()}
  </style>
</head>
<body>

  ${sharedLayout.renderNavbar('users')}

  <main class="page-wrapper">
    <div style="max-width: 680px; margin: 0 auto;">
      ${successMessage ? `<div class="alert-banner alert-success"><span>✅</span> <span>${this.escapeHtml(successMessage)}</span></div>` : ''}

      <div class="content-card">
        <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:1.5rem; padding-bottom:1rem; border-bottom:1px solid var(--colors-hairline);">
          <div style="display:flex; align-items:center; gap:14px;">
            <div style="width:52px; height:52px; border-radius:var(--rounded-md); background:var(--colors-brand-pink); color:#ffffff; display:flex; align-items:center; justify-content:center; font-size:22px; font-weight:700;">
              ${this.escapeHtml((user.name || 'U').charAt(0).toUpperCase())}
            </div>
            <div>
              <h1 class="page-title" style="font-size:1.75rem; margin-bottom:2px;">User Profile: ${this.escapeHtml(user.name)}</h1>
              <span class="badge-pill badge-id">#${user.id}</span>
            </div>
          </div>
          <span class="badge-pill badge-role-${(user.role || 'alumni').toLowerCase()}">${this.escapeHtml(user.role || 'alumni')}</span>
        </div>

        <div style="display:flex; flex-direction:column; gap:12px; margin-bottom:2rem; font-size:15px;">
          <div style="display:flex; justify-content:space-between; padding:8px 0; border-bottom:1px solid var(--colors-hairline);">
            <span style="color:var(--colors-muted); font-weight:500;">User ID:</span>
            <strong>#${user.id}</strong>
          </div>
          <div style="display:flex; justify-content:space-between; padding:8px 0; border-bottom:1px solid var(--colors-hairline);">
            <span style="color:var(--colors-muted); font-weight:500;">Full Name:</span>
            <strong>${this.escapeHtml(user.name)}</strong>
          </div>
          <div style="display:flex; justify-content:space-between; padding:8px 0; border-bottom:1px solid var(--colors-hairline);">
            <span style="color:var(--colors-muted); font-weight:500;">Email:</span>
            <span>${this.escapeHtml(user.email)}</span>
          </div>
          <div style="display:flex; justify-content:space-between; padding:8px 0; border-bottom:1px solid var(--colors-hairline);">
            <span style="color:var(--colors-muted); font-weight:500;">Role:</span>
            <span class="badge-pill badge-role-${(user.role || 'alumni').toLowerCase()}">${this.escapeHtml(user.role || 'alumni')}</span>
          </div>
          <div style="display:flex; justify-content:space-between; padding:8px 0; border-bottom:1px solid var(--colors-hairline);">
            <span style="color:var(--colors-muted); font-weight:500;">Department:</span>
            <strong>${this.escapeHtml(user.department || 'N/A')}</strong>
          </div>
          <div style="display:flex; justify-content:space-between; padding:8px 0; border-bottom:1px solid var(--colors-hairline);">
            <span style="color:var(--colors-muted); font-weight:500;">Created:</span>
            <span>${user.createdAt ? new Date(user.createdAt).toLocaleString() : '-'}</span>
          </div>
          ${user.updatedAt ? `
          <div style="display:flex; justify-content:space-between; padding:8px 0; border-bottom:1px solid var(--colors-hairline);">
            <span style="color:var(--colors-muted); font-weight:500;">Updated:</span>
            <span>${new Date(user.updatedAt).toLocaleString()}</span>
          </div>` : ''}
        </div>

        <div style="display:flex; gap:10px; align-items:center; flex-wrap:wrap;">
          <a href="/users/${user.id}/edit" class="btn-clay-primary">✏️ Edit Profile</a>
          <form method="POST" action="/users/${user.id}/delete" style="display:inline;" onsubmit="return confirm('Delete this user profile?');">
            <button type="submit" class="btn-action-delete" style="padding:10px 18px; border-radius:var(--rounded-md); font-size:14px;">🗑️ Delete</button>
          </form>
          <a href="/users" class="btn-clay-secondary" style="margin-left:auto;">← Back to Users</a>
        </div>
      </div>
    </div>
  </main>

  ${sharedLayout.renderFooter()}

</body>
</html>`;
  },

  /**
   * Renders the Edit User Form View (GET /users/:id/edit)
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
    ${sharedLayout.getCommonStyles()}
  </style>
</head>
<body>

  ${sharedLayout.renderNavbar('users')}

  <main class="page-wrapper">
    <div style="max-width: 640px; margin: 0 auto;">
      <div class="content-card">
        <h1 class="page-title" style="font-size:1.65rem; margin-bottom:1rem; border-bottom:1px solid var(--colors-hairline); padding-bottom:0.75rem;">
          ✏️ Edit User #${user.id}: ${this.escapeHtml(user.name)}
        </h1>

        ${errorMessage ? `<div class="alert-banner alert-danger"><span>⚠️</span> <span>${this.escapeHtml(errorMessage)}</span></div>` : ''}

        <!-- UPDATE FORM: POST /users/:id/update -->
        <form method="POST" action="/users/${user.id}/update">
          <div class="form-group" style="margin-bottom:1rem;">
            <label class="form-label" for="name">Full Name *</label>
            <input class="form-input" type="text" id="name" name="name" value="${this.escapeHtml(user.name)}" required>
          </div>
          <div class="form-group" style="margin-bottom:1rem;">
            <label class="form-label" for="email">Email Address *</label>
            <input class="form-input" type="email" id="email" name="email" value="${this.escapeHtml(user.email)}" required>
          </div>
          <div class="form-group" style="margin-bottom:1rem;">
            <label class="form-label" for="role">Role</label>
            <select class="form-select" id="role" name="role">
              <option value="alumni" ${user.role === 'alumni' ? 'selected' : ''}>Alumni</option>
              <option value="student" ${user.role === 'student' ? 'selected' : ''}>Student</option>
              <option value="faculty" ${user.role === 'faculty' ? 'selected' : ''}>Faculty</option>
              <option value="admin" ${user.role === 'admin' ? 'selected' : ''}>Administrator</option>
            </select>
          </div>
          <div class="form-group" style="margin-bottom:1.5rem;">
            <label class="form-label" for="department">Department</label>
            <input class="form-input" type="text" id="department" name="department" value="${this.escapeHtml(user.department || '')}">
          </div>

          <div style="display:flex; gap:10px; align-items:center;">
            <button type="submit" class="btn-clay-primary">Save Changes</button>
            <a href="/users/${user.id}" class="btn-clay-secondary">Cancel</a>
            <a href="/users" style="margin-left:auto; color:var(--colors-muted); font-size:14px; text-decoration:none;">← Directory</a>
          </div>
        </form>
      </div>
    </div>
  </main>

  ${sharedLayout.renderFooter()}

</body>
</html>`;
  },

  /**
   * Renders semantic error page
   */
  renderError(message, statusCode = 404) {
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${statusCode} Error</title>
  <style>
    ${sharedLayout.getCommonStyles()}
  </style>
</head>
<body>
  ${sharedLayout.renderNavbar('users')}

  <main class="page-wrapper" style="display:flex; align-items:center; justify-content:center;">
    <div class="content-card" style="max-width:520px; width:100%; text-align:center; padding:3rem 2rem;">
      <h1 class="page-title" style="color:var(--colors-error); font-size:2rem; margin-bottom:0.75rem;">${statusCode} Not Found</h1>
      <p style="color:var(--colors-body); margin-bottom:1.75rem; font-size:15px;">${this.escapeHtml(message)}</p>
      <a href="/users" class="btn-clay-primary">← Return to Users Directory</a>
    </div>
  </main>

  ${sharedLayout.renderFooter()}
</body>
</html>`;
  }
};

module.exports = userView;
