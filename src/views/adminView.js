/**
 * Admin Dashboard View (Mintlify Aurora Aesthetic)
 * File: src/views/adminView.js
 * 
 * Renders the protected administrator dashboard with user role management,
 * security boundary status, and system metric counters.
 */

const sharedLayout = require('./sharedLayout');
const { escapeHtml } = sharedLayout;

const adminView = {
  /**
   * Renders the Administrator Dashboard
   * 
   * @param {Object} options
   * @param {Object} options.currentUser - The authenticated administrator
   * @param {Array<Object>} [options.users=[]] - List of registered users
   * @param {Object} [options.stats={}] - System counts (users, jobs, announcements, applications)
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

    const usersRowsHtml = users.length > 0
      ? users.map(u => {
          const roleClass = u.role === 'admin'
            ? 'badge-role-admin'
            : (u.role === 'student' ? 'badge-role-student' : 'badge-role-alumni');

          return `
          <tr>
            <td class="font-mono">#${escapeHtml(u.id)}</td>
            <td>
              <strong style="color: var(--ink); display: block;">${escapeHtml(u.name)}</strong>
              <span style="font-size: 12px; color: var(--ink-subtle);">${escapeHtml(u.department || 'General')}</span>
            </td>
            <td>
              <a href="mailto:${escapeHtml(u.email)}" style="color: var(--brand-mint); text-decoration: none;">
                ${escapeHtml(u.email)}
              </a>
            </td>
            <td>
              <span class="badge-pill ${roleClass}">${escapeHtml(u.role || 'alumni')}</span>
            </td>
            <td>
              <span class="badge-pill" style="background:#ecfdf5; color:#065f46; font-size:11.5px;">${escapeHtml(u.status || 'ACTIVE')}</span>
            </td>
            <td style="font-size: 12px; color: var(--ink-subtle);">
              ${escapeHtml(u.createdAt ? u.createdAt.substring(0, 10) : 'N/A')}
            </td>
            <td>
              <form method="POST" action="/admin/users/${u.id}/role" style="display:flex; align-items:center; gap:6px;">
                <select name="role" class="form-select" style="padding: 4px 8px; font-size: 12px; border-radius: var(--rounded-md);">
                  <option value="alumni" ${u.role === 'alumni' ? 'selected' : ''}>Alumni</option>
                  <option value="student" ${u.role === 'student' ? 'selected' : ''}>Student</option>
                  <option value="faculty" ${u.role === 'faculty' ? 'selected' : ''}>Faculty</option>
                  <option value="admin" ${u.role === 'admin' ? 'selected' : ''}>Admin</option>
                  <option value="guest" ${u.role === 'guest' ? 'selected' : ''}>Guest</option>
                </select>
                <button type="submit" class="btn-action-view" style="font-size: 11.5px; padding: 4px 10px;">
                  Update
                </button>
              </form>
            </td>
          </tr>`;
        }).join('')
      : `<tr><td colspan="7" style="text-align:center; padding: 2rem; color: var(--ink-subtle);">No registered users found.</td></tr>`;

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
          Manage system users, enforce Role-Based Access Control (RBAC), and review core platform metrics.
        </p>
      </div>
      <div>
        <span class="badge-pill badge-role-admin" style="font-size: 13px; padding: 8px 16px;">
          Signed in: ${escapeHtml(currentUser.name)} (${escapeHtml(currentUser.role)})
        </span>
      </div>
    </div>

    ${errorAlertHtml}
    ${successAlertHtml}

    <!-- Key Metrics Grid -->
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

    <!-- Role Management Section -->
    <section class="content-card">
      <div class="card-header-bar">
        <div>
          <h2 class="card-heading">User Role & Access Control Management</h2>
          <p style="font-size: 13px; color: var(--ink-muted); margin-top: 4px;">
            Enforce role boundaries. Demoting the last active administrator is blocked by system invariants.
          </p>
        </div>
      </div>

      <div class="table-container">
        <table class="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>User Name</th>
              <th>Email Address</th>
              <th>Current Role</th>
              <th>Status</th>
              <th>Registered</th>
              <th>Assign Role Action</th>
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
  }
};

module.exports = adminView;
