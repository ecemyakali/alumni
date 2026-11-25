/**
 * Authentication & Registration Views (Mintlify Aurora Aesthetic)
 * File: src/views/authView.js
 * 
 * Provides unified, accessible, and responsive authentication views:
 * - /register: Account creation with client-side & server-side validation feedback
 * - /register (Success): Registration confirmation card with account summary
 * - /login: Authentication portal matching the Mintlify Aurora design system
 */

const sharedLayout = require('./sharedLayout');
const { escapeHtml } = sharedLayout;

const authView = {
  /**
   * Renders the Registration Page (GET /register)
   * 
   * @param {Object} options
   * @param {Object} [options.formData={}] - Previously submitted values to preserve input state
   * @param {Array<string>|string} [options.errors] - Validation error messages
   * @param {string} [options.successMessage] - Feedback on successful operation
   * @returns {string} Complete HTML Document
   */
  renderRegister(options = {}) {
    const formData = options.formData || {};
    const rawErrors = options.errors;
    const errors = Array.isArray(rawErrors)
      ? rawErrors
      : (typeof rawErrors === 'string' && rawErrors ? [rawErrors] : []);
    const successMessage = options.successMessage || '';

    const errorAlertHtml = errors.length > 0
      ? `
        <div class="alert-banner alert-danger" role="alert" style="margin-bottom: 1.5rem; text-align: left;">
          <span style="font-size: 1.25rem; flex-shrink: 0;">⚠️</span>
          <div style="flex: 1;">
            <strong style="display: block; margin-bottom: ${errors.length > 1 ? '4px' : '0'};">Please correct the following:</strong>
            ${errors.length > 1
              ? `<ul style="margin: 0; padding-left: 1.2rem; font-size: 13px; line-height: 1.5;">${errors.map(err => `<li>${escapeHtml(err)}</li>`).join('')}</ul>`
              : `<span style="font-size: 13px;">${escapeHtml(errors[0])}</span>`
            }
          </div>
        </div>`
      : '';

    const successAlertHtml = successMessage
      ? `
        <div class="alert-banner alert-success" role="status" style="margin-bottom: 1.5rem; text-align: left;">
          <span style="font-size: 1.25rem;">✅</span>
          <div style="font-size: 13.5px;">${escapeHtml(successMessage)}</div>
        </div>`
      : '';

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Create Your Account | Alumni Tracking System</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    ${sharedLayout.getCommonStyles()}

    .auth-wrapper {
      max-width: 680px;
      margin: 2.5rem auto 4rem auto;
      padding: 0 1rem;
      width: 100%;
    }
    .auth-card {
      background: #ffffff;
      border: 1px solid var(--hairline);
      border-radius: var(--rounded-xl);
      padding: 2.5rem 2.25rem;
      box-shadow: 0 10px 30px -5px rgba(0, 0, 0, 0.05), 0 4px 12px -2px rgba(0, 0, 0, 0.03);
    }
    .auth-header {
      text-align: center;
      margin-bottom: 2rem;
    }
    .auth-eyebrow {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 4px 12px;
      background: #ecfdf5;
      color: var(--brand-mint);
      border: 1px solid var(--brand-mint-border);
      border-radius: var(--rounded-pill);
      font-size: 12px;
      font-weight: 600;
      letter-spacing: 0.3px;
      margin-bottom: 0.75rem;
    }
    .auth-title {
      font-size: 1.85rem;
      font-weight: 700;
      letter-spacing: -0.7px;
      color: var(--ink);
      line-height: 1.2;
      margin-bottom: 0.5rem;
    }
    .auth-subtitle {
      font-size: 14.5px;
      color: var(--ink-muted);
      line-height: 1.55;
      max-width: 480px;
      margin: 0 auto;
    }
    .field-hint {
      font-size: 12px;
      color: var(--ink-subtle);
      margin-top: 4px;
      line-height: 1.4;
    }
    .field-required {
      color: var(--semantic-error);
      margin-left: 2px;
    }
    .password-input-wrapper {
      position: relative;
      display: flex;
      align-items: center;
    }
    .password-input-wrapper input {
      padding-right: 42px;
      width: 100%;
    }
    .password-toggle-btn {
      position: absolute;
      right: 10px;
      background: transparent;
      border: none;
      color: var(--ink-subtle);
      cursor: pointer;
      font-size: 14px;
      padding: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: color 0.15s ease;
    }
    .password-toggle-btn:hover {
      color: var(--ink);
    }
    .password-rules {
      background: var(--surface-subtle);
      border: 1px solid var(--hairline);
      border-radius: var(--rounded-md);
      padding: 10px 14px;
      margin-top: 6px;
      font-size: 12px;
      color: var(--ink-subtle);
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 6px;
    }
    .rule-item {
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .rule-item.valid {
      color: var(--brand-mint);
      font-weight: 500;
    }
    .section-divider {
      display: flex;
      align-items: center;
      gap: 12px;
      margin: 1.75rem 0 1.25rem 0;
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.6px;
      color: var(--ink-tertiary);
    }
    .section-divider::before, .section-divider::after {
      content: "";
      flex: 1;
      height: 1px;
      background: var(--hairline);
    }
    .auth-footer-nav {
      margin-top: 2rem;
      padding-top: 1.5rem;
      border-top: 1px solid var(--hairline);
      text-align: center;
      font-size: 13.5px;
      color: var(--ink-muted);
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .auth-footer-nav a {
      color: var(--brand-mint);
      text-decoration: none;
      font-weight: 600;
      transition: color 0.15s ease;
    }
    .auth-footer-nav a:hover {
      color: var(--brand-mint-hover);
      text-decoration: underline;
    }
  </style>
</head>
<body>
  ${sharedLayout.renderNavbar('register')}

  <main class="auth-wrapper">
    <div class="auth-card">
      <div class="auth-header">
        <div class="auth-eyebrow">🎓 Member Registration</div>
        <h1 class="auth-title">Create your Alumni Account</h1>
        <p class="auth-subtitle">
          Join thousands of graduates, discover career opportunities, and stay connected with your alumni community.
        </p>
      </div>

      ${errorAlertHtml}
      ${successAlertHtml}

      <form id="registration-form" method="POST" action="/register" novalidate>
        <!-- Account Credentials Section -->
        <div class="form-grid">
          <div class="form-group form-group-full">
            <label for="name" class="form-label">Full Name <span class="field-required">*</span></label>
            <input
              type="text"
              id="name"
              name="name"
              class="form-input"
              placeholder="e.g. Jane Doe"
              value="${escapeHtml(formData.name || '')}"
              required
              minlength="2"
              maxlength="255"
              autocomplete="name"
            />
            <div class="field-hint">Your legal or preferred first and last name.</div>
          </div>

          <div class="form-group form-group-full">
            <label for="email" class="form-label">Email Address <span class="field-required">*</span></label>
            <input
              type="email"
              id="email"
              name="email"
              class="form-input"
              placeholder="e.g. jane.doe@alumni.university.edu"
              value="${escapeHtml(formData.email || '')}"
              required
              autocomplete="email"
            />
            <div class="field-hint">Used for sign-in and official announcements. Must be unique.</div>
          </div>

          <div class="form-group">
            <label for="password" class="form-label">Password <span class="field-required">*</span></label>
            <div class="password-input-wrapper">
              <input
                type="password"
                id="password"
                name="password"
                class="form-input"
                placeholder="Create a strong password"
                required
                minlength="8"
                autocomplete="new-password"
              />
              <button type="button" class="password-toggle-btn" id="toggle-password" title="Show or hide password" aria-label="Toggle password visibility">
                👁️
              </button>
            </div>
          </div>

          <div class="form-group">
            <label for="confirmPassword" class="form-label">Confirm Password <span class="field-required">*</span></label>
            <div class="password-input-wrapper">
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                class="form-input"
                placeholder="Re-enter password"
                required
                minlength="8"
                autocomplete="new-password"
              />
              <button type="button" class="password-toggle-btn" id="toggle-confirm-password" title="Show or hide confirm password" aria-label="Toggle confirm password visibility">
                👁️
              </button>
            </div>
          </div>
        </div>

        <!-- Realtime Password Complexity Indicator -->
        <div class="password-rules" id="password-rules">
          <div class="rule-item" id="rule-length"><span>⚪</span> Min. 8 characters</div>
          <div class="rule-item" id="rule-case"><span>⚪</span> Upper & lower case</div>
          <div class="rule-item" id="rule-number"><span>⚪</span> At least 1 number</div>
          <div class="rule-item" id="rule-special"><span>⚪</span> 1 special symbol (!@#$)</div>
        </div>

        <!-- Academic Affiliation Section -->
        <div class="section-divider">Academic Details</div>

        <div class="form-grid">
          <div class="form-group">
            <label for="department" class="form-label">Department / Major <span class="field-required">*</span></label>
            <input
              type="text"
              id="department"
              name="department"
              class="form-input"
              placeholder="e.g. Computer Science"
              value="${escapeHtml(formData.department || '')}"
              required
              minlength="2"
            />
          </div>

          <div class="form-group">
            <label for="graduationYear" class="form-label">Graduation Year <span class="field-required">*</span></label>
            <input
              type="number"
              id="graduationYear"
              name="graduationYear"
              class="form-input"
              placeholder="e.g. 2024"
              value="${escapeHtml(formData.graduationYear || '')}"
              required
              min="1950"
              max="2100"
            />
            <div class="field-hint">Future year = Student role; Past/current year = Alumni role.</div>
          </div>
        </div>

        <!-- Professional Career Profile (Optional) Section -->
        <div class="section-divider">Career Profile (Optional)</div>

        <div class="form-grid">
          <div class="form-group">
            <label for="currentRole" class="form-label">Current Role / Title</label>
            <input
              type="text"
              id="currentRole"
              name="currentRole"
              class="form-input"
              placeholder="e.g. Senior Software Engineer"
              value="${escapeHtml(formData.currentRole || '')}"
            />
          </div>

          <div class="form-group">
            <label for="company" class="form-label">Company / Organization</label>
            <input
              type="text"
              id="company"
              name="company"
              class="form-input"
              placeholder="e.g. Google, Microsoft, Startup"
              value="${escapeHtml(formData.company || '')}"
            />
          </div>

          <div class="form-group form-group-full">
            <label for="linkedinUrl" class="form-label">LinkedIn Profile URL</label>
            <input
              type="url"
              id="linkedinUrl"
              name="linkedinUrl"
              class="form-input"
              placeholder="e.g. https://linkedin.com/in/username"
              value="${escapeHtml(formData.linkedinUrl || '')}"
            />
            <div class="field-hint">Helps fellow alumni and recruiters connect with your professional network.</div>
          </div>
        </div>

        <div style="margin-top: 2rem;">
          <button type="submit" id="submit-btn" class="btn-pill-primary" style="width: 100%; justify-content: center; padding: 12px 24px; font-size: 15px;">
            <span>Create Alumni Account</span>
            <span>➔</span>
          </button>
        </div>
      </form>

      <div class="auth-footer-nav">
        <div>
          Already have an account? <a href="/login">Log in here</a>
        </div>
        <div>
          Looking for network directory? <a href="/users">Browse Alumni Directory</a>
        </div>
      </div>
    </div>
  </main>

  ${sharedLayout.renderFooter()}

  <script>
    (function() {
      const passwordInput = document.getElementById('password');
      const confirmInput = document.getElementById('confirmPassword');
      const togglePasswordBtn = document.getElementById('toggle-password');
      const toggleConfirmBtn = document.getElementById('toggle-confirm-password');
      const form = document.getElementById('registration-form');

      // Password visibility toggles
      if (togglePasswordBtn && passwordInput) {
        togglePasswordBtn.addEventListener('click', function() {
          const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
          passwordInput.setAttribute('type', type);
        });
      }
      if (toggleConfirmBtn && confirmInput) {
        toggleConfirmBtn.addEventListener('click', function() {
          const type = confirmInput.getAttribute('type') === 'password' ? 'text' : 'password';
          confirmInput.setAttribute('type', type);
        });
      }

      // Password rule checks
      const ruleLength = document.getElementById('rule-length');
      const ruleCase = document.getElementById('rule-case');
      const ruleNumber = document.getElementById('rule-number');
      const ruleSpecial = document.getElementById('rule-special');

      function updateRules(val) {
        if (!val) {
          [ruleLength, ruleCase, ruleNumber, ruleSpecial].forEach(el => {
            if (el) {
              el.classList.remove('valid');
              el.firstElementChild.textContent = '⚪';
            }
          });
          return;
        }

        const hasLen = val.length >= 8;
        const hasCase = /[a-z]/.test(val) && /[A-Z]/.test(val);
        const hasNum = /\\d/.test(val);
        const hasSpec = /[!@#$%^&*()_+\\-=\\[\\]{};':"\\\\|,.<>\\/?]/.test(val);

        const setRule = (el, valid) => {
          if (!el) return;
          if (valid) {
            el.classList.add('valid');
            el.firstElementChild.textContent = '🟢';
          } else {
            el.classList.remove('valid');
            el.firstElementChild.textContent = '⚪';
          }
        };

        setRule(ruleLength, hasLen);
        setRule(ruleCase, hasCase);
        setRule(ruleNumber, hasNum);
        setRule(ruleSpecial, hasSpec);
      }

      if (passwordInput) {
        passwordInput.addEventListener('input', function() {
          updateRules(this.value);
        });
      }

      // Client-side submit validation guard
      if (form) {
        form.addEventListener('submit', function(e) {
          const pwd = passwordInput ? passwordInput.value : '';
          const conf = confirmInput ? confirmInput.value : '';

          if (pwd && conf && pwd !== conf) {
            e.preventDefault();
            alert('Passwords do not match. Please re-enter.');
            confirmInput.focus();
            return false;
          }
        });
      }
    })();
  </script>
</body>
</html>`;
  },

  /**
   * Renders Registration Success Confirmation Page
   * 
   * @param {Object} user - Newly created user object
   * @returns {string} Complete HTML Document
   */
  renderRegisterSuccess(user = {}) {
    const roleBadgeClass = user.role === 'student' ? 'badge-role-student' : 'badge-role-alumni';
    const roleLabel = user.role === 'student' ? 'Current Student' : 'Alumnus Member';

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to the Network! | Alumni Tracking System</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    ${sharedLayout.getCommonStyles()}

    .success-wrapper {
      max-width: 640px;
      margin: 3rem auto 5rem auto;
      padding: 0 1rem;
      width: 100%;
    }
    .success-card {
      background: #ffffff;
      border: 1px solid var(--hairline);
      border-radius: var(--rounded-xl);
      padding: 3rem 2.5rem;
      text-align: center;
      box-shadow: 0 14px 34px -6px rgba(0, 0, 0, 0.08), 0 4px 12px rgba(0, 0, 0, 0.03);
    }
    .success-icon-badge {
      width: 68px;
      height: 68px;
      border-radius: 50%;
      background: #ecfdf5;
      border: 2px solid #a7f3d0;
      color: var(--brand-mint);
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-size: 2rem;
      margin-bottom: 1.5rem;
      box-shadow: 0 6px 16px rgba(13, 147, 115, 0.15);
    }
    .success-title {
      font-size: 2rem;
      font-weight: 700;
      letter-spacing: -0.8px;
      color: var(--ink);
      line-height: 1.2;
      margin-bottom: 0.75rem;
    }
    .success-desc {
      font-size: 15px;
      color: var(--ink-muted);
      line-height: 1.6;
      max-width: 480px;
      margin: 0 auto 2rem auto;
    }
    .account-summary {
      background: var(--surface-subtle);
      border: 1px solid var(--hairline);
      border-radius: var(--rounded-lg);
      padding: 1.25rem 1.5rem;
      margin-bottom: 2rem;
      text-align: left;
    }
    .summary-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 8px 0;
      border-bottom: 1px solid var(--hairline);
      font-size: 13.5px;
    }
    .summary-row:last-child {
      border-bottom: none;
    }
    .summary-label {
      color: var(--ink-subtle);
      font-weight: 500;
    }
    .summary-value {
      color: var(--ink);
      font-weight: 600;
    }
    .cta-group {
      display: flex;
      justify-content: center;
      gap: 12px;
      flex-wrap: wrap;
    }
  </style>
</head>
<body>
  ${sharedLayout.renderNavbar('register')}

  <main class="success-wrapper">
    <div class="success-card">
      <div class="success-icon-badge">✓</div>
      <h1 class="success-title">Welcome, ${escapeHtml(user.name || 'Alumnus')}!</h1>
      <p class="success-desc">
        Your registration is complete. Your account has been initialized with the <strong>${roleLabel}</strong> role.
      </p>

      <div class="account-summary">
        <div class="summary-row">
          <span class="summary-label">Account ID:</span>
          <span class="summary-value font-mono">#${escapeHtml(user.id)}</span>
        </div>
        <div class="summary-row">
          <span class="summary-label">Registered Email:</span>
          <span class="summary-value">${escapeHtml(user.email)}</span>
        </div>
        <div class="summary-row">
          <span class="summary-label">Assigned Role:</span>
          <span class="badge-pill ${roleBadgeClass}">${escapeHtml(user.role || 'alumni')}</span>
        </div>
        <div class="summary-row">
          <span class="summary-label">Department:</span>
          <span class="summary-value">${escapeHtml(user.department || 'N/A')}</span>
        </div>
        <div class="summary-row">
          <span class="summary-label">Graduation Class:</span>
          <span class="summary-value">${escapeHtml(user.graduationYear || 'N/A')}</span>
        </div>
      </div>

      <div class="cta-group">
        <a href="/users" class="btn-pill-primary">
          <span>👥 View Alumni Directory</span>
        </a>
        <a href="/job-postings" class="btn-pill-secondary">
          <span>💼 Explore Career Opportunities</span>
        </a>
      </div>
    </div>
  </main>

  ${sharedLayout.renderFooter()}
</body>
</html>`;
  },

  /**
   * Renders the Login Portal (GET /login)
   * 
   * @param {Object} options
   * @param {string} [options.email] - Previously entered email to retain
   * @param {string} [options.message] - Success or status notification
   * @param {string} [options.error] - Failure or validation error message
   * @param {Object|null} [options.currentUser=null] - Currently logged-in user if any
   * @param {string} [options.redirect] - URL to redirect to after successful sign-in
   * @returns {string} Complete HTML Document
   */
  renderLogin(options = {}) {
    const errorAlertHtml = options.error
      ? `
        <div class="alert-banner alert-danger" role="alert" style="margin-bottom: 1.5rem; text-align: left;">
          <span style="font-size: 1.25rem; flex-shrink: 0;">⚠️</span>
          <div style="font-size: 13.5px; flex: 1;">${escapeHtml(options.error)}</div>
        </div>`
      : '';

    const messageAlertHtml = options.message
      ? `
        <div class="alert-banner alert-success" role="status" style="margin-bottom: 1.5rem; text-align: left;">
          <span style="font-size: 1.25rem; flex-shrink: 0;">✅</span>
          <div style="font-size: 13.5px; flex: 1;">${escapeHtml(options.message)}</div>
        </div>`
      : '';

    const redirectInputHtml = options.redirect
      ? `<input type="hidden" name="redirect" value="${escapeHtml(options.redirect)}" />`
      : '';

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Sign In | Alumni Tracking System</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    ${sharedLayout.getCommonStyles()}

    .login-wrapper {
      max-width: 500px;
      margin: 3.5rem auto 5.5rem auto;
      padding: 0 1rem;
      width: 100%;
    }
    .login-card {
      background: #ffffff;
      border: 1px solid var(--hairline);
      border-radius: var(--rounded-xl);
      padding: 2.75rem 2.25rem;
      box-shadow: 0 10px 30px -5px rgba(0, 0, 0, 0.05), 0 4px 12px -2px rgba(0, 0, 0, 0.03);
    }
    .login-header {
      text-align: center;
      margin-bottom: 2rem;
    }
    .login-eyebrow {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 4px 12px;
      background: #ecfdf5;
      color: var(--brand-mint);
      border: 1px solid var(--brand-mint-border);
      border-radius: var(--rounded-pill);
      font-size: 12px;
      font-weight: 600;
      letter-spacing: 0.3px;
      margin-bottom: 0.75rem;
    }
    .login-title {
      font-size: 1.85rem;
      font-weight: 700;
      letter-spacing: -0.7px;
      color: var(--ink);
      line-height: 1.2;
      margin-bottom: 0.5rem;
    }
    .login-subtitle {
      font-size: 14.5px;
      color: var(--ink-muted);
      line-height: 1.5;
    }
    .password-input-wrapper {
      position: relative;
      display: flex;
      align-items: center;
    }
    .password-input-wrapper input {
      padding-right: 42px;
      width: 100%;
    }
    .password-toggle-btn {
      position: absolute;
      right: 10px;
      background: transparent;
      border: none;
      color: var(--ink-subtle);
      cursor: pointer;
      font-size: 14px;
      padding: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: color 0.15s ease;
    }
    .password-toggle-btn:hover {
      color: var(--ink);
    }
    .form-options-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin: 0.75rem 0 1.5rem 0;
      font-size: 13px;
    }
    .remember-label {
      display: flex;
      align-items: center;
      gap: 6px;
      color: var(--ink-muted);
      cursor: pointer;
      user-select: none;
    }
    .auth-footer-nav {
      margin-top: 1.75rem;
      padding-top: 1.5rem;
      border-top: 1px solid var(--hairline);
      text-align: center;
      font-size: 13.5px;
      color: var(--ink-muted);
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .auth-footer-nav a {
      color: var(--brand-mint);
      text-decoration: none;
      font-weight: 600;
      transition: color 0.15s ease;
    }
    .auth-footer-nav a:hover {
      color: var(--brand-mint-hover);
      text-decoration: underline;
    }
  </style>
</head>
<body>
  ${sharedLayout.renderNavbar('login', options.currentUser)}

  <main class="login-wrapper">
    <div class="login-card">
      <div class="login-header">
        <div class="login-eyebrow">🔐 Member Portal Sign In</div>
        <h1 class="login-title">Welcome Back</h1>
        <p class="login-subtitle">Sign in to access your profile, alumni network, and career opportunities.</p>
      </div>

      ${errorAlertHtml}
      ${messageAlertHtml}

      <form method="POST" action="/login">
        ${redirectInputHtml}

        <div class="form-group" style="margin-bottom: 1.25rem;">
          <label for="login-email" class="form-label">Email Address</label>
          <input
            type="email"
            id="login-email"
            name="email"
            class="form-input"
            placeholder="e.g. jane.doe@alumni.university.edu"
            value="${escapeHtml(options.email || '')}"
            required
            autocomplete="email"
            autofocus
          />
        </div>

        <div class="form-group" style="margin-bottom: 0.25rem;">
          <label for="login-password" class="form-label">Password</label>
          <div class="password-input-wrapper">
            <input
              type="password"
              id="login-password"
              name="password"
              class="form-input"
              placeholder="Enter your account password"
              required
              autocomplete="current-password"
            />
            <button type="button" class="password-toggle-btn" id="toggle-login-password" title="Show or hide password" aria-label="Toggle password visibility">
              👁️
            </button>
          </div>
        </div>

        <div class="form-options-row">
          <label class="remember-label">
            <input type="checkbox" name="rememberMe" value="true" checked />
            <span>Stay signed in for 24 hours</span>
          </label>
        </div>

        <button type="submit" class="btn-pill-primary" style="width: 100%; justify-content: center; padding: 12px 20px; font-size: 15px;">
          <span>Sign In</span>
          <span>➔</span>
        </button>
      </form>

      <div class="auth-footer-nav">
        <div>
          Don't have an account yet? <a href="/register">Register here</a>
        </div>
        <div>
          <a href="/main" style="color: var(--ink-subtle); font-weight: normal;">Return to Homepage</a>
        </div>
      </div>
    </div>
  </main>

  ${sharedLayout.renderFooter()}

  <script>
    (function() {
      const passwordInput = document.getElementById('login-password');
      const toggleBtn = document.getElementById('toggle-login-password');
      if (toggleBtn && passwordInput) {
        toggleBtn.addEventListener('click', function() {
          const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
          passwordInput.setAttribute('type', type);
        });
      }
    })();
  </script>
</body>
</html>`;
  }
};

module.exports = authView;
