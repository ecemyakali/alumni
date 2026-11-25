/**
 * 403 Forbidden / Access Denied View (Mintlify Aurora Aesthetic)
 * File: src/views/forbiddenView.js
 * 
 * Renders an accessible, brand-consistent 403 Access Denied view
 * when an authenticated user attempts to access an unauthorized route.
 */

const sharedLayout = require('./sharedLayout');
const { escapeHtml } = sharedLayout;

const forbiddenView = {
  /**
   * Renders the 403 Forbidden page
   * 
   * @param {Object} options
   * @param {Object} options.currentUser - The currently authenticated user
   * @param {Array<string>} [options.requiredRoles=['admin']] - Roles authorized to access resource
   * @param {string} [options.message] - Custom explanation
   * @returns {string} Complete HTML Document
   */
  renderForbidden(options = {}) {
    const user = options.currentUser || { name: 'Guest', role: 'guest' };
    const requiredRoles = options.requiredRoles || ['admin'];
    const requiredStr = requiredRoles.map(r => r.toUpperCase()).join(' or ');
    const userRoleBadgeClass = user.role === 'admin'
      ? 'badge-role-admin'
      : (user.role === 'student' ? 'badge-role-student' : 'badge-role-alumni');

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>403 - Access Denied | Alumni Tracking System</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    ${sharedLayout.getCommonStyles()}

    .forbidden-wrapper {
      max-width: 580px;
      margin: 4rem auto 6rem auto;
      padding: 0 1rem;
      width: 100%;
    }
    .forbidden-card {
      background: #ffffff;
      border: 1px solid var(--hairline);
      border-radius: var(--rounded-xl);
      padding: 3rem 2.25rem;
      text-align: center;
      box-shadow: 0 14px 34px -6px rgba(0, 0, 0, 0.08), 0 4px 12px rgba(0, 0, 0, 0.03);
    }
    .forbidden-icon-badge {
      width: 72px;
      height: 72px;
      border-radius: 50%;
      background: #fef2f2;
      border: 2px solid #fecaca;
      color: var(--semantic-error);
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-size: 2.25rem;
      margin-bottom: 1.5rem;
      box-shadow: 0 6px 16px rgba(239, 68, 68, 0.15);
    }
    .forbidden-eyebrow {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 4px 12px;
      background: #fef2f2;
      color: #991b1b;
      border: 1px solid #fecaca;
      border-radius: var(--rounded-pill);
      font-size: 12px;
      font-weight: 600;
      letter-spacing: 0.3px;
      margin-bottom: 0.75rem;
    }
    .forbidden-title {
      font-size: 2rem;
      font-weight: 700;
      letter-spacing: -0.8px;
      color: var(--ink);
      line-height: 1.2;
      margin-bottom: 0.5rem;
    }
    .forbidden-subtitle {
      font-size: 14.5px;
      color: var(--ink-muted);
      line-height: 1.6;
      max-width: 440px;
      margin: 0 auto 1.75rem auto;
    }
    .role-detail-box {
      background: var(--surface-subtle);
      border: 1px solid var(--hairline);
      border-radius: var(--rounded-lg);
      padding: 1.25rem 1.5rem;
      margin-bottom: 2rem;
      text-align: left;
      font-size: 13.5px;
    }
    .role-detail-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 6px 0;
    }
    .role-detail-row:not(:last-child) {
      border-bottom: 1px solid var(--hairline);
    }
    .actions-group {
      display: flex;
      justify-content: center;
      gap: 10px;
      flex-wrap: wrap;
    }
  </style>
</head>
<body>
  ${sharedLayout.renderNavbar('', user)}

  <main class="forbidden-wrapper">
    <div class="forbidden-card">
      <div class="forbidden-icon-badge">🚫</div>
      <div><span class="forbidden-eyebrow">HTTP 403 Forbidden</span></div>
      <h1 class="forbidden-title">Access Denied</h1>
      <p class="forbidden-subtitle">
        You do not have sufficient privileges to access this administrative resource or restricted area.
      </p>

      <div class="role-detail-box">
        <div class="role-detail-row">
          <span style="color: var(--ink-subtle);">Signed in as:</span>
          <span style="font-weight: 600; color: var(--ink);">${escapeHtml(user.name)}</span>
        </div>
        <div class="role-detail-row">
          <span style="color: var(--ink-subtle);">Your Active Role:</span>
          <span class="badge-pill ${userRoleBadgeClass}">${escapeHtml(user.role)}</span>
        </div>
        <div class="role-detail-row">
          <span style="color: var(--ink-subtle);">Required Role:</span>
          <span class="badge-pill badge-role-admin" style="font-weight: 600;">${escapeHtml(requiredStr)}</span>
        </div>
      </div>

      <div class="actions-group">
        <a href="/main" class="btn-pill-primary">
          <span>🏠 Return to Homepage</span>
        </a>
        <a href="/users" class="btn-pill-secondary">
          <span>👥 Alumni Directory</span>
        </a>
        <a href="/logout" class="btn-pill-secondary" style="color: var(--semantic-error) !important;">
          <span>Log Out</span>
        </a>
      </div>
    </div>
  </main>

  ${sharedLayout.renderFooter()}
</body>
</html>`;
  }
};

module.exports = forbiddenView;
