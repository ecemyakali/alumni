/**
 * Admin Dashboard & Management Views (Mintlify Aurora Aesthetic)
 * File: src/views/adminView.js
 * 
 * Renders the protected administrator dashboard with user record management,
 * multi-field search and filtering, inline role/status mutators, deletion controls,
 * and user record editing forms.
 */

const sharedLayout = require('./sharedLayout');
const { escapeHtml } = sharedLayout;

const adminView = {
  /**
   * Renders the Administrator Dashboard
   * 
   * @param {Object} options
   * @param {Object} options.currentUser - The authenticated administrator
   * @param {Array<Object>} [options.users=[]] - List of filtered users
   * @param {Object} [options.stats={}] - System counts (users, jobs, announcements, applications)
   * @param {string} [options.q=''] - Current search keyword
   * @param {string} [options.role=''] - Current role filter
   * @param {string} [options.status=''] - Current status filter
   * @param {string} [options.successMessage] - Action confirmation message
   * @param {string} [options.errorMessage] - Validation or invariant error message
   * @returns {string} Complete HTML Document
   */
  renderDashboard(options = {}) {
    const currentUser = options.currentUser;
    const users = options.users || [];
    const stats = options.stats || {
      usersCount: users.length,
      jobsCount: 0,
      announcementsCount: 0,
      applicationsCount: 0
    };
    const q = options.q || '';
    const selectedRole = options.role || '';
    const selectedStatus = options.status || '';
    const successMessage = options.successMessage || '';
    const errorMessage = options.errorMessage || '';

    const isFiltered = Boolean(q || selectedRole || selectedStatus);

    const errorAlertHtml = errorMessage
      ? `
        <div class="alert-banner alert-danger" role="alert">
          <span style="font-size: 1.25rem; flex-shrink: 0;">⚠️</span>
          <div style="font-size: 13.5px; flex: 1;">${escapeHtml(errorMessage)}</div>
        </div>`
      : '';

    const successAlertHtml = successMessage
      ? `
        <div class="alert-banner alert-success" role="status">
          <span style="font-size: 1.25rem; flex-shrink: 0;">✅</span>
          <div style="font-size: 13.5px; flex: 1;">${escapeHtml(successMessage)}</div>
        </div>`
      : '';

    const usersRowsHtml = users.length > 0
      ? users.map(u => {
          const roleClass = u.role === 'admin'
            ? 'badge-role-admin'
            : (u.role === 'student' ? 'badge-role-student' : 'badge-role-alumni');

          const statusBadgeStyle = u.status === 'ACTIVE'
            ? 'background: #ecfdf5; color: #065f46; border: 1px solid #a7f3d0;'
            : (u.status === 'SUSPENDED'
                ? 'background: #fef2f2; color: #991b1b; border: 1px solid #fecaca;'
                : 'background: #f3f4f6; color: #4b5563; border: 1px solid #e5e7eb;');

          const companyRoleText = [u.currentRole, u.company].filter(Boolean).join(' at ');

          return `
          <tr>
            <td class="font-mono" style="font-size: 12.5px;">#${escapeHtml(u.id)}</td>
            <td>
              <strong style="color: var(--ink); display: block; font-size: 14px;">${escapeHtml(u.name)}</strong>
              <span style="font-size: 12px; color: var(--ink-muted);">
                ${escapeHtml(u.department || 'General')}
                ${u.graduationYear ? ` • Class of ${escapeHtml(u.graduationYear)}` : ''}
              </span>
            </td>
            <td>
              <a href="mailto:${escapeHtml(u.email)}" style="color: var(--brand-mint); text-decoration: none; font-size: 13px; font-weight: 500;">
                ${escapeHtml(u.email)}
              </a>
              ${companyRoleText ? `<span style="font-size: 12px; color: var(--ink-subtle); display: block; margin-top: 2px;">💼 ${escapeHtml(companyRoleText)}</span>` : ''}
            </td>
            <td>
              <div style="display: flex; flex-direction: column; gap: 4px;">
                <span class="badge-pill ${roleClass}" style="align-self: flex-start;">${escapeHtml(u.role || 'alumni')}</span>
                <form method="POST" action="/admin/users/${u.id}/role" style="display:flex; align-items:center; gap:4px; margin-top: 4px;">
                  <select name="role" class="form-select" style="padding: 3px 6px; font-size: 11.5px; border-radius: var(--rounded-md); height: 26px;">
                    <option value="alumni" ${u.role === 'alumni' ? 'selected' : ''}>Alumni</option>
                    <option value="student" ${u.role === 'student' ? 'selected' : ''}>Student</option>
                    <option value="faculty" ${u.role === 'faculty' ? 'selected' : ''}>Faculty</option>
                    <option value="admin" ${u.role === 'admin' ? 'selected' : ''}>Admin</option>
                    <option value="guest" ${u.role === 'guest' ? 'selected' : ''}>Guest</option>
                  </select>
                  <button type="submit" class="btn-action-view" style="font-size: 11px; padding: 2px 8px; height: 26px;">
                    Save
                  </button>
                </form>
              </div>
            </td>
            <td>
              <div style="display: flex; flex-direction: column; gap: 4px;">
                <span class="badge-pill" style="${statusBadgeStyle} align-self: flex-start; font-size: 11px;">
                  ${escapeHtml(u.status || 'ACTIVE')}
                </span>
                <form method="POST" action="/admin/users/${u.id}/status" style="display:flex; align-items:center; gap:4px; margin-top: 4px;">
                  <select name="status" class="form-select" style="padding: 3px 6px; font-size: 11.5px; border-radius: var(--rounded-md); height: 26px;">
                    <option value="ACTIVE" ${u.status === 'ACTIVE' ? 'selected' : ''}>ACTIVE</option>
                    <option value="INACTIVE" ${u.status === 'INACTIVE' ? 'selected' : ''}>INACTIVE</option>
                    <option value="SUSPENDED" ${u.status === 'SUSPENDED' ? 'selected' : ''}>SUSPENDED</option>
                  </select>
                  <button type="submit" class="btn-action-view" style="font-size: 11px; padding: 2px 8px; height: 26px;">
                    Save
                  </button>
                </form>
              </div>
            </td>
            <td>
              <div style="display: flex; align-items: center; gap: 8px;">
                <a href="/admin/users/${u.id}/edit" class="btn-action-view" style="text-decoration: none; display: inline-flex; align-items: center; gap: 4px; padding: 5px 10px; font-size: 12px;">
                  ✏️ Edit
                </a>
                <form method="POST" action="/admin/users/${u.id}/delete" onsubmit="return confirm('Are you sure you want to delete user \\'${escapeHtml(u.name)}\\'? This action cannot be undone.');" style="display:inline; margin:0;">
                  <button type="submit" class="btn-action-delete" style="font-size: 12px; padding: 5px 10px; border-radius: var(--rounded-md); cursor: pointer;">
                    🗑️ Delete
                  </button>
                </form>
              </div>
            </td>
          </tr>`;
        }).join('')
      : `<tr><td colspan="6" style="text-align:center; padding: 3rem 1rem; color: var(--ink-subtle);">
           <div style="font-size: 1.5rem; margin-bottom: 0.5rem;">🔍</div>
           <strong>No users found matching your search criteria.</strong>
           <div style="margin-top: 0.5rem;"><a href="/admin" class="btn-secondary" style="font-size: 12px; padding: 4px 12px;">Reset Filters</a></div>
         </td></tr>`;

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Admin Control Center | Alumni Tracking System</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    ${sharedLayout.getCommonStyles()}

    .stats-bento-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 1.25rem;
      margin-bottom: 2rem;
    }
    .stat-bento-card {
      background: #ffffff;
      border: 1px solid var(--hairline);
      border-radius: var(--rounded-xl);
      padding: 1.5rem;
      box-shadow: 0 4px 16px -2px rgba(0, 0, 0, 0.04);
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .stat-bento-label {
      font-size: 12.5px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: var(--ink-subtle);
    }
    .stat-bento-value {
      font-size: 2.25rem;
      font-weight: 700;
      letter-spacing: -1px;
      color: var(--ink);
      line-height: 1;
    }
    .stat-bento-hint {
      font-size: 12px;
      color: var(--ink-tertiary);
    }

    .filter-panel {
      background: var(--surface-subtle);
      border: 1px solid var(--hairline);
      border-radius: var(--rounded-lg);
      padding: 1rem 1.25rem;
      margin-bottom: 1.5rem;
      display: flex;
      flex-wrap: wrap;
      gap: 1rem;
      align-items: flex-end;
    }
    .filter-group {
      display: flex;
      flex-direction: column;
      gap: 4px;
      flex: 1;
      min-width: 180px;
    }
    .filter-label {
      font-size: 12px;
      font-weight: 600;
      color: var(--ink-muted);
    }
  </style>
</head>
<body>
  ${sharedLayout.renderNavbar('admin', currentUser)}

  <main class="page-wrapper">
    <div class="page-header-band">
      <div>
        <div class="page-header-pill">🛡️ System Administration</div>
        <h1 class="page-title">Admin Control Center</h1>
        <p class="page-subtitle">
          Manage system users, enforce Role-Based Access Control (RBAC), edit alumni profiles, and inspect core platform metrics.
        </p>
      </div>
      <div style="display: flex; align-items: center; gap: 10px; flex-wrap: wrap;">
        <span class="badge-pill badge-role-admin" style="font-size: 13px; padding: 8px 16px;">
          Signed in: ${escapeHtml(currentUser.name)} (${escapeHtml(currentUser.role)})
        </span>
      </div>
    </div>

    ${errorAlertHtml}
    ${successAlertHtml}

    <!-- Key Metrics Bento Grid -->
    <section class="stats-bento-grid">
      <div class="stat-bento-card">
        <span class="stat-bento-label">👥 Total Users</span>
        <div class="stat-bento-value font-mono">${escapeHtml(stats.usersCount)}</div>
        <span class="stat-bento-hint">Across all 5 system roles</span>
      </div>
      <div class="stat-bento-card">
        <span class="stat-bento-label">💼 Career Opportunities</span>
        <div class="stat-bento-value font-mono">${escapeHtml(stats.jobsCount)}</div>
        <span class="stat-bento-hint">Active employment postings</span>
      </div>
      <div class="stat-bento-card">
        <span class="stat-bento-label">📢 Announcements</span>
        <div class="stat-bento-value font-mono">${escapeHtml(stats.announcementsCount)}</div>
        <span class="stat-bento-hint">Published broadcast articles</span>
      </div>
      <div class="stat-bento-card">
        <span class="stat-bento-label">📝 Applications</span>
        <div class="stat-bento-value font-mono">${escapeHtml(stats.applicationsCount)}</div>
        <span class="stat-bento-hint">Submitted career applications</span>
      </div>
    </section>

    <!-- Records & Management Section -->
    <section class="content-card">
      <div class="card-header-bar">
        <div>
          <h2 class="card-heading">User Role & Access Control Management</h2>
          <p style="font-size: 13px; color: var(--ink-muted); margin-top: 4px;">
            Filter, edit, delete, and manage permissions. Last active administrator protection is strictly enforced.
          </p>
        </div>
        <div style="font-size: 13px; color: var(--ink-muted);">
          Showing <strong>${users.length}</strong> user record${users.length === 1 ? '' : 's'}
        </div>
      </div>

      <!-- Search and Filter Form -->
      <form method="GET" action="/admin" class="filter-panel">
        <div class="filter-group" style="flex: 2; min-width: 240px;">
          <label class="filter-label" for="q">Search Users</label>
          <input
            type="text"
            id="q"
            name="q"
            class="form-input"
            placeholder="Search by name, email, department, company..."
            value="${escapeHtml(q)}"
            style="height: 38px;"
          />
        </div>

        <div class="filter-group">
          <label class="filter-label" for="role">Role</label>
          <select id="role" name="role" class="form-select" style="height: 38px;">
            <option value="">All Roles</option>
            <option value="alumni" ${selectedRole === 'alumni' ? 'selected' : ''}>Alumni</option>
            <option value="student" ${selectedRole === 'student' ? 'selected' : ''}>Student</option>
            <option value="faculty" ${selectedRole === 'faculty' ? 'selected' : ''}>Faculty</option>
            <option value="admin" ${selectedRole === 'admin' ? 'selected' : ''}>Admin</option>
            <option value="guest" ${selectedRole === 'guest' ? 'selected' : ''}>Guest</option>
          </select>
        </div>

        <div class="filter-group">
          <label class="filter-label" for="status">Status</label>
          <select id="status" name="status" class="form-select" style="height: 38px;">
            <option value="">All Statuses</option>
            <option value="ACTIVE" ${selectedStatus === 'ACTIVE' ? 'selected' : ''}>ACTIVE</option>
            <option value="INACTIVE" ${selectedStatus === 'INACTIVE' ? 'selected' : ''}>INACTIVE</option>
            <option value="SUSPENDED" ${selectedStatus === 'SUSPENDED' ? 'selected' : ''}>SUSPENDED</option>
          </select>
        </div>

        <div style="display: flex; gap: 8px;">
          <button type="submit" class="btn-primary" style="height: 38px; padding: 0 16px; font-size: 13px; font-weight: 600;">
            🔍 Filter
          </button>
          ${isFiltered ? `<a href="/admin" class="btn-secondary" style="height: 38px; padding: 0 14px; font-size: 13px; display: inline-flex; align-items: center; text-decoration: none;">Clear</a>` : ''}
        </div>
      </form>

      <!-- Users Data Table -->
      <div class="table-container">
        <table class="data-table">
          <thead>
            <tr>
              <th style="width: 60px;">ID</th>
              <th>User Name & Education</th>
              <th>Email & Career</th>
              <th>Role</th>
              <th>Status</th>
              <th style="width: 170px;">Actions</th>
            </tr>
          </thead>
          <tbody>
            ${usersRowsHtml}
          </tbody>
        </table>
      </div>
    </section>
  </main>

  ${sharedLayout.renderFooter()}
</body>
</html>`;
  },

  /**
   * Renders the User Edit Form View
   * 
   * @param {Object} options
   * @param {Object} options.currentUser - The authenticated administrator
   * @param {Object} options.user - The user record being edited
   * @param {string} [options.successMessage] - Feedback message
   * @param {string} [options.errorMessage] - Validation or domain invariant error
   * @returns {string} Complete HTML Document
   */
  renderAdminUserEdit(options = {}) {
    const currentUser = options.currentUser;
    const user = options.user || {};
    const successMessage = options.successMessage || '';
    const errorMessage = options.errorMessage || '';

    const errorAlertHtml = errorMessage
      ? `
        <div class="alert-banner alert-danger" role="alert">
          <span style="font-size: 1.25rem; flex-shrink: 0;">⚠️</span>
          <div style="font-size: 13.5px; flex: 1;">${escapeHtml(errorMessage)}</div>
        </div>`
      : '';

    const successAlertHtml = successMessage
      ? `
        <div class="alert-banner alert-success" role="status">
          <span style="font-size: 1.25rem; flex-shrink: 0;">✅</span>
          <div style="font-size: 13.5px; flex: 1;">${escapeHtml(successMessage)}</div>
        </div>`
      : '';

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Edit User #${escapeHtml(user.id)} | Admin Control Center</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    ${sharedLayout.getCommonStyles()}

    .edit-form-card {
      background: #ffffff;
      border: 1px solid var(--hairline);
      border-radius: var(--rounded-xl);
      padding: 2.25rem;
      box-shadow: 0 4px 20px -2px rgba(0, 0, 0, 0.05);
      max-width: 800px;
      margin: 0 auto;
    }
    .form-grid-2col {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1.25rem;
    }
    @media (max-width: 680px) {
      .form-grid-2col {
        grid-template-columns: 1fr;
      }
    }
  </style>
</head>
<body>
  ${sharedLayout.renderNavbar('admin', currentUser)}

  <main class="page-wrapper">
    <div style="max-width: 800px; margin: 0 auto 1.5rem auto;">
      <a href="/admin" style="display: inline-flex; align-items: center; gap: 6px; font-size: 13px; font-weight: 600; color: var(--ink-muted); text-decoration: none; margin-bottom: 1rem;">
        ← Back to Admin Directory
      </a>
      <div class="page-header-band" style="margin-bottom: 1rem;">
        <div>
          <div class="page-header-pill">🛡️ User Administration</div>
          <h1 class="page-title" style="font-size: 2rem;">Edit User: ${escapeHtml(user.name || `User #${user.id}`)}</h1>
          <p class="page-subtitle">
            Update personal information, academic credentials, and system roles.
          </p>
        </div>
      </div>
    </div>

    ${errorAlertHtml}
    ${successAlertHtml}

    <div class="edit-form-card">
      <form method="POST" action="/admin/users/${escapeHtml(user.id)}/update">
        <div class="form-grid-2col" style="margin-bottom: 1.25rem;">
          <div class="form-group">
            <label class="form-label" for="name">Full Name <span style="color: #ef4444;">*</span></label>
            <input
              type="text"
              id="name"
              name="name"
              class="form-input"
              value="${escapeHtml(user.name || '')}"
              required
            />
          </div>

          <div class="form-group">
            <label class="form-label" for="email">Email Address <span style="color: #ef4444;">*</span></label>
            <input
              type="email"
              id="email"
              name="email"
              class="form-input"
              value="${escapeHtml(user.email || '')}"
              required
            />
          </div>
        </div>

        <div class="form-grid-2col" style="margin-bottom: 1.25rem;">
          <div class="form-group">
            <label class="form-label" for="department">Department / Major</label>
            <input
              type="text"
              id="department"
              name="department"
              class="form-input"
              value="${escapeHtml(user.department || '')}"
              placeholder="e.g. Computer Engineering"
            />
          </div>

          <div class="form-group">
            <label class="form-label" for="graduationYear">Graduation Year</label>
            <input
              type="number"
              id="graduationYear"
              name="graduationYear"
              class="form-input"
              value="${escapeHtml(user.graduationYear || 2024)}"
              min="1950"
              max="2035"
            />
          </div>
        </div>

        <div class="form-grid-2col" style="margin-bottom: 1.25rem;">
          <div class="form-group">
            <label class="form-label" for="role">System Role <span style="color: #ef4444;">*</span></label>
            <select id="role" name="role" class="form-select" required>
              <option value="alumni" ${user.role === 'alumni' ? 'selected' : ''}>Alumni</option>
              <option value="student" ${user.role === 'student' ? 'selected' : ''}>Student</option>
              <option value="faculty" ${user.role === 'faculty' ? 'selected' : ''}>Faculty</option>
              <option value="admin" ${user.role === 'admin' ? 'selected' : ''}>Admin (Administrator)</option>
              <option value="guest" ${user.role === 'guest' ? 'selected' : ''}>Guest</option>
            </select>
            <span style="font-size: 11.5px; color: var(--ink-tertiary); margin-top: 4px; display: block;">
              Protects against demoting the last active administrator.
            </span>
          </div>

          <div class="form-group">
            <label class="form-label" for="status">Account Status <span style="color: #ef4444;">*</span></label>
            <select id="status" name="status" class="form-select" required>
              <option value="ACTIVE" ${user.status === 'ACTIVE' ? 'selected' : ''}>ACTIVE</option>
              <option value="INACTIVE" ${user.status === 'INACTIVE' ? 'selected' : ''}>INACTIVE</option>
              <option value="SUSPENDED" ${user.status === 'SUSPENDED' ? 'selected' : ''}>SUSPENDED</option>
            </select>
          </div>
        </div>

        <div class="form-grid-2col" style="margin-bottom: 1.25rem;">
          <div class="form-group">
            <label class="form-label" for="company">Company / Organization</label>
            <input
              type="text"
              id="company"
              name="company"
              class="form-input"
              value="${escapeHtml(user.company || '')}"
              placeholder="e.g. Google, Microsoft, Startup"
            />
          </div>

          <div class="form-group">
            <label class="form-label" for="currentRole">Current Job Title / Position</label>
            <input
              type="text"
              id="currentRole"
              name="currentRole"
              class="form-input"
              value="${escapeHtml(user.currentRole || '')}"
              placeholder="e.g. Senior Software Engineer"
            />
          </div>
        </div>

        <div class="form-group" style="margin-bottom: 2rem;">
          <label class="form-label" for="linkedinUrl">LinkedIn Profile URL</label>
          <input
            type="url"
            id="linkedinUrl"
            name="linkedinUrl"
            class="form-input"
            value="${escapeHtml(user.linkedinUrl || '')}"
            placeholder="https://linkedin.com/in/username"
          />
        </div>

        <div style="display: flex; align-items: center; justify-content: flex-end; gap: 1rem; border-top: 1px solid var(--surface-subtle); padding-top: 1.5rem;">
          <a href="/admin" class="btn-secondary" style="text-decoration: none; padding: 10px 18px; font-size: 14px;">
            Cancel
          </a>
          <button type="submit" class="btn-primary" style="padding: 10px 24px; font-size: 14px;">
            💾 Save Record Changes
          </button>
        </div>
      </form>
    </div>
  </main>

  ${sharedLayout.renderFooter()}
</body>
</html>`;
  }
};

module.exports = adminView;
