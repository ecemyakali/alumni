/**
 * User Profile & Dashboard View (Mintlify Aurora Aesthetic)
 * File: src/views/profileView.js
 * 
 * Renders the authenticated user profile dashboard:
 * - Profile telemetry bento overview
 * - Personal & academic profile editing form
 * - Networking & mentorship preferences form
 * - Account security & password update form
 */

const sharedLayout = require('./sharedLayout');
const { escapeHtml } = sharedLayout;

const profileView = {
  /**
   * Renders the complete HTML Profile & Dashboard page
   * 
   * @param {Object} options
   * @param {Object} options.currentUser - The authenticated user entity
   * @param {string} [options.successMessage] - Optional success feedback
   * @param {string} [options.errorMessage] - Optional error feedback
   * @param {string} [options.activeTab='overview'] - Active tab indicator
   * @returns {string} Formatted HTML document
   */
  renderProfilePage(options = {}) {
    const user = options.currentUser || {};
    const successMessage = options.successMessage || '';
    const errorMessage = options.errorMessage || '';

    const roleClass = user.role === 'admin'
      ? 'badge-role-admin'
      : (user.role === 'student' ? 'badge-role-student' : 'badge-role-alumni');

    const statusBadgeStyle = user.status === 'ACTIVE'
      ? 'background: #ecfdf5; color: #065f46; border: 1px solid #a7f3d0;'
      : 'background: #fef2f2; color: #991b1b; border: 1px solid #fecaca;';

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

    const initial = (user.name || 'U').charAt(0).toUpperCase();
    const companyRoleText = [user.currentRole, user.company].filter(Boolean).join(' at ');

    // Networking preferences defaults
    const openToMentor = Boolean(user.openToMentor);
    const openToWork = user.openToWork !== undefined ? Boolean(user.openToWork) : true;
    const visibility = user.profileVisibility || 'public';
    const preferredContact = user.preferredContact || 'email';

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>My Profile & Dashboard | Alumni Tracking System</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    ${sharedLayout.getCommonStyles()}

    .profile-hero-card {
      background: #ffffff;
      border: 1px solid var(--hairline);
      border-radius: var(--rounded-xl);
      padding: 2.25rem;
      box-shadow: 0 4px 20px -2px rgba(0, 0, 0, 0.05);
      margin-bottom: 2rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1.5rem;
      flex-wrap: wrap;
    }
    .profile-avatar-lockup {
      display: flex;
      align-items: center;
      gap: 1.25rem;
    }
    .profile-avatar-circle {
      width: 72px;
      height: 72px;
      border-radius: 50%;
      background: linear-gradient(135deg, #10b981 0%, #06b6d4 100%);
      color: #ffffff;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 2rem;
      font-weight: 700;
      box-shadow: 0 8px 20px -4px rgba(16, 185, 129, 0.35);
      flex-shrink: 0;
    }
    .profile-details-group {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    .profile-user-name {
      font-size: 1.75rem;
      font-weight: 700;
      letter-spacing: -0.6px;
      color: var(--ink);
      line-height: 1.2;
    }
    .profile-user-meta {
      font-size: 13.5px;
      color: var(--ink-muted);
      display: flex;
      align-items: center;
      gap: 8px;
      flex-wrap: wrap;
    }

    .profile-bento-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 1.25rem;
      margin-bottom: 2.25rem;
    }
    .profile-bento-tile {
      background: #ffffff;
      border: 1px solid var(--hairline);
      border-radius: var(--rounded-lg);
      padding: 1.25rem;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.03);
      display: flex;
      flex-direction: column;
      gap: 6px;
    }
    .bento-tile-label {
      font-size: 11.5px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: var(--ink-subtle);
    }
    .bento-tile-value {
      font-size: 1.15rem;
      font-weight: 700;
      color: var(--ink);
    }
    .bento-tile-hint {
      font-size: 12px;
      color: var(--ink-tertiary);
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

    .toggle-row {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      padding: 1rem;
      background: var(--surface-subtle);
      border: 1px solid var(--hairline);
      border-radius: var(--rounded-md);
      margin-bottom: 1rem;
    }
    .toggle-row input[type="checkbox"] {
      width: 18px;
      height: 18px;
      margin-top: 2px;
      accent-color: var(--brand-mint);
      cursor: pointer;
    }
    .toggle-row-content {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }
    .toggle-row-title {
      font-size: 13.5px;
      font-weight: 600;
      color: var(--ink);
    }
    .toggle-row-desc {
      font-size: 12px;
      color: var(--ink-muted);
    }
  </style>
</head>
<body>
  ${sharedLayout.renderNavbar('profile', user)}

  <main class="page-wrapper">
    <div class="page-header-band">
      <div>
        <div class="page-header-pill">🎓 Verified Alumni Profile</div>
        <h1 class="page-title">My Profile & Dashboard</h1>
        <p class="page-subtitle">
          Keep your career trajectory, alumni networking preferences, and account credentials up to date.
        </p>
      </div>
      <div>
        <a href="/users/${user.id}" class="btn-pill-secondary" style="font-size: 13px; padding: 8px 16px;">
          <span>🌐</span> View Public Profile
        </a>
      </div>
    </div>

    ${errorAlertHtml}
    ${successAlertHtml}

    <!-- Top Bento Hero Spotlight -->
    <section class="profile-hero-card">
      <div class="profile-avatar-lockup">
        <div class="profile-avatar-circle">
          ${escapeHtml(initial)}
        </div>
        <div class="profile-details-group">
          <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
            <span class="profile-user-name">${escapeHtml(user.name)}</span>
            <span class="badge-pill ${roleClass}">${escapeHtml(user.role || 'alumni')}</span>
            <span class="badge-pill" style="${statusBadgeStyle} font-size: 11px;">${escapeHtml(user.status || 'ACTIVE')}</span>
          </div>
          <div class="profile-user-meta">
            <span>✉️ ${escapeHtml(user.email)}</span>
            ${user.department ? `<span>• 🏛️ ${escapeHtml(user.department)}</span>` : ''}
            ${user.graduationYear ? `<span>• 🎓 Class of ${escapeHtml(user.graduationYear)}</span>` : ''}
          </div>
          ${companyRoleText ? `<div style="font-size: 13px; color: var(--ink); font-weight: 500; margin-top: 4px;">💼 ${escapeHtml(companyRoleText)}</div>` : ''}
        </div>
      </div>
      <div style="display: flex; flex-direction: column; align-items: flex-end; gap: 6px;">
        <span class="badge-pill badge-id font-mono" style="font-size: 12px; padding: 4px 10px;">ID: #${escapeHtml(user.id)}</span>
        <span style="font-size: 12px; color: var(--ink-subtle);">Member since ${escapeHtml(user.createdAt ? user.createdAt.substring(0, 10) : '2026')}</span>
      </div>
    </section>

    <!-- Bento Overview Telemetry -->
    <div class="profile-bento-grid">
      <div class="profile-bento-tile">
        <span class="bento-tile-label">System Role</span>
        <span class="bento-tile-value" style="text-transform: capitalize;">${escapeHtml(user.role || 'alumni')}</span>
        <span class="bento-tile-hint">RBAC permissions level</span>
      </div>
      <div class="profile-bento-tile">
        <span class="bento-tile-label">Mentorship Status</span>
        <span class="bento-tile-value" style="color: ${openToMentor ? '#059669' : '#6b7280'};">
          ${openToMentor ? '✅ Active Mentor' : '⏸️ Not Available'}
        </span>
        <span class="bento-tile-hint">Open to student advice</span>
      </div>
      <div class="profile-bento-tile">
        <span class="bento-tile-label">Career Inquiries</span>
        <span class="bento-tile-value" style="color: ${openToWork ? '#059669' : '#6b7280'};">
          ${openToWork ? '💼 Open to Offers' : '🔒 Not Looking'}
        </span>
        <span class="bento-tile-hint">Visible to recruiters</span>
      </div>
      <div class="profile-bento-tile">
        <span class="bento-tile-label">Directory Privacy</span>
        <span class="bento-tile-value" style="text-transform: capitalize;">${escapeHtml(visibility)}</span>
        <span class="bento-tile-hint">Alumni search visibility</span>
      </div>
    </div>

    <!-- Section 1: Edit Profile Details -->
    <section class="content-card">
      <div class="card-header-bar">
        <div>
          <h2 class="card-heading">Personal & Career Information</h2>
          <p style="font-size: 13px; color: var(--ink-muted); margin-top: 4px;">
            Update your contact information, education history, and current employment.
          </p>
        </div>
      </div>

      <form method="POST" action="/profile/update">
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
            <label class="form-label" for="company">Current Company / Organization</label>
            <input
              type="text"
              id="company"
              name="company"
              class="form-input"
              value="${escapeHtml(user.company || '')}"
              placeholder="e.g. Google, Stripe, University"
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
              placeholder="e.g. Staff Software Engineer"
            />
          </div>
        </div>

        <div class="form-grid-2col" style="margin-bottom: 1.25rem;">
          <div class="form-group">
            <label class="form-label" for="location">Location / City</label>
            <input
              type="text"
              id="location"
              name="location"
              class="form-input"
              value="${escapeHtml(user.location || '')}"
              placeholder="e.g. San Francisco, CA or Istanbul, TR"
            />
          </div>

          <div class="form-group">
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
        </div>

        <div class="form-group" style="margin-bottom: 1.75rem;">
          <label class="form-label" for="bio">Bio & Professional Summary</label>
          <textarea
            id="bio"
            name="bio"
            class="form-textarea"
            rows="3"
            placeholder="Share a brief overview of your background, research interests, or industry experience..."
          >${escapeHtml(user.bio || '')}</textarea>
        </div>

        <div style="display: flex; justify-content: flex-end;">
          <button type="submit" class="btn-primary" style="padding: 10px 24px; font-size: 14px;">
            💾 Save Profile Details
          </button>
        </div>
      </form>
    </section>

    <!-- Section 2: Networking & Mentorship Preferences -->
    <section class="content-card">
      <div class="card-header-bar">
        <div>
          <h2 class="card-heading">Networking & Mentorship Preferences</h2>
          <p style="font-size: 13px; color: var(--ink-muted); margin-top: 4px;">
            Control your community availability for student mentorship, recruitment inquiries, and directory visibility.
          </p>
        </div>
      </div>

      <form method="POST" action="/profile/preferences">
        <label class="toggle-row" for="openToMentor">
          <input
            type="checkbox"
            id="openToMentor"
            name="openToMentor"
            value="true"
            ${openToMentor ? 'checked' : ''}
          />
          <div class="toggle-row-content">
            <span class="toggle-row-title">🤝 Open to Mentoring</span>
            <span class="toggle-row-desc">Allow students and fellow graduates to request career advice and 1-on-1 mentorship.</span>
          </div>
        </label>

        <label class="toggle-row" for="openToWork">
          <input
            type="checkbox"
            id="openToWork"
            name="openToWork"
            value="true"
            ${openToWork ? 'checked' : ''}
          />
          <div class="toggle-row-content">
            <span class="toggle-row-title">💼 Open to Job Opportunities</span>
            <span class="toggle-row-desc">Display the "Open to Work" badge to alumni recruiters and partner employers.</span>
          </div>
        </label>

        <div class="form-grid-2col" style="margin-top: 1.25rem; margin-bottom: 1.75rem;">
          <div class="form-group">
            <label class="form-label" for="profileVisibility">Directory Visibility</label>
            <select id="profileVisibility" name="profileVisibility" class="form-select">
              <option value="public" ${visibility === 'public' ? 'selected' : ''}>Public (Visible in public alumni directory)</option>
              <option value="alumni_only" ${visibility === 'alumni_only' ? 'selected' : ''}>Verified Alumni Only</option>
              <option value="private" ${visibility === 'private' ? 'selected' : ''}>Private (Hidden from directory searches)</option>
            </select>
          </div>

          <div class="form-group">
            <label class="form-label" for="preferredContact">Preferred Contact Channel</label>
            <select id="preferredContact" name="preferredContact" class="form-select">
              <option value="email" ${preferredContact === 'email' ? 'selected' : ''}>Primary Email (${escapeHtml(user.email)})</option>
              <option value="linkedin" ${preferredContact === 'linkedin' ? 'selected' : ''}>LinkedIn InMail / Message</option>
              <option value="platform" ${preferredContact === 'platform' ? 'selected' : ''}>Platform Internal Messaging</option>
            </select>
          </div>
        </div>

        <div style="display: flex; justify-content: flex-end;">
          <button type="submit" class="btn-primary" style="padding: 10px 24px; font-size: 14px;">
            🤝 Save Networking Preferences
          </button>
        </div>
      </form>
    </section>

    <!-- Section 3: Account Security & Password -->
    <section class="content-card">
      <div class="card-header-bar">
        <div>
          <h2 class="card-heading">Account Security & Credentials</h2>
          <p style="font-size: 13px; color: var(--ink-muted); margin-top: 4px;">
            Update your account password. Changes take effect on next login.
          </p>
        </div>
      </div>

      <form method="POST" action="/profile/password">
        <div class="form-grid-2col" style="margin-bottom: 1.25rem;">
          <div class="form-group">
            <label class="form-label" for="currentPassword">Current Password <span style="color: #ef4444;">*</span></label>
            <input
              type="password"
              id="currentPassword"
              name="currentPassword"
              class="form-input"
              placeholder="Enter your existing password"
              required
            />
          </div>

          <div class="form-group">
            <label class="form-label" for="newPassword">New Password <span style="color: #ef4444;">*</span></label>
            <input
              type="password"
              id="newPassword"
              name="newPassword"
              class="form-input"
              placeholder="At least 8 characters"
              minlength="8"
              required
            />
          </div>
        </div>

        <div class="form-group" style="max-width: 380px; margin-bottom: 1.75rem;">
          <label class="form-label" for="confirmPassword">Confirm New Password <span style="color: #ef4444;">*</span></label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            class="form-input"
            placeholder="Re-enter new password"
            minlength="8"
            required
          />
        </div>

        <div style="display: flex; justify-content: flex-end;">
          <button type="submit" class="btn-primary" style="padding: 10px 24px; font-size: 14px;">
            🔒 Update Account Password
          </button>
        </div>
      </form>
    </section>
  </main>

  ${sharedLayout.renderFooter()}
</body>
</html>`;
  }
};

module.exports = profileView;
