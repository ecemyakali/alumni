/**
 * Shared Layout & Design System Components
 * File: src/views/sharedLayout.js
 * 
 * Provides unified, tactile B2B SaaS layout elements (Clay.com inspired):
 * - Sticky Top Navigation Bar
 * - Warm Cream Footer (NOT dark navy!)
 * - Shared CSS Design Tokens & Base Styles
 */

function escapeHtml(str) {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

const sharedLayout = {
  escapeHtml,

  /**
   * Generates common CSS variables, resets, and component styles
   */
  getCommonStyles() {
    return `
    :root {
      /* Surface Tokens (Warm Cream Canvas System) */
      --colors-canvas: #fffaf0;
      --colors-surface-soft: #faf5e8;
      --colors-surface-card: #f5f0e0;
      --colors-surface-strong: #ebe6d6;
      --colors-hairline: #e5e5e5;
      --colors-surface-dark: #0a1a1a;

      /* Saturated Feature Card Palette */
      --colors-brand-pink: #ff4d8b;
      --colors-brand-teal: #1a3a3a;
      --colors-brand-lavender: #b8a4ed;
      --colors-brand-peach: #ffb084;
      --colors-brand-ochre: #e8b94a;
      --colors-brand-mint: #a4d4c5;
      --colors-brand-blue: #2563eb;

      /* Ink & Typography Tokens */
      --colors-primary: #0a0a0a;
      --colors-ink: #0a0a0a;
      --colors-body-strong: #1a1a1a;
      --colors-body: #3a3a3a;
      --colors-muted: #6a6a6a;
      --colors-muted-soft: #9a9a9a;
      --colors-on-dark: #ffffff;

      /* Semantic Status Tokens */
      --colors-success: #22c55e;
      --colors-warning: #f59e0b;
      --colors-error: #ef4444;

      /* Border Radius Scale */
      --rounded-xs: 6px;
      --rounded-sm: 8px;
      --rounded-md: 12px;
      --rounded-lg: 16px;
      --rounded-xl: 24px;
      --rounded-pill: 9999px;

      /* Spacing Scale */
      --spacing-xxs: 4px;
      --spacing-xs: 8px;
      --spacing-sm: 12px;
      --spacing-md: 16px;
      --spacing-lg: 24px;
      --spacing-xl: 32px;
      --spacing-section: 96px;

      /* Typography Font Families */
      --font-display: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      --font-body: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      --font-mono: ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace;
    }

    * { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      font-family: var(--font-body);
      background-color: var(--colors-canvas);
      color: var(--colors-ink);
      line-height: 1.6;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      -webkit-font-smoothing: antialiased;
    }

    /* TOP NAVIGATION */
    .top-nav {
      background: var(--colors-canvas);
      border-bottom: 1px solid var(--colors-hairline);
      position: sticky;
      top: 0;
      z-index: 100;
      backdrop-filter: blur(8px);
    }
    .nav-container {
      max-width: 1280px;
      margin: 0 auto;
      padding: 0 1.5rem;
      height: 64px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1.5rem;
    }
    .brand-lockup {
      display: flex;
      align-items: center;
      gap: 0.6rem;
      text-decoration: none;
      color: var(--colors-ink);
      font-weight: 600;
      font-size: 1.15rem;
      letter-spacing: -0.5px;
    }
    .brand-emblem {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 34px;
      height: 34px;
      background: var(--colors-surface-card);
      border: 1px solid var(--colors-hairline);
      border-radius: var(--rounded-sm);
      font-size: 1.25rem;
    }
    .nav-menu {
      display: flex;
      align-items: center;
      gap: 0.35rem;
      list-style: none;
    }
    .nav-link {
      text-decoration: none;
      color: var(--colors-body);
      font-weight: 500;
      font-size: 14px;
      padding: 7px 12px;
      border-radius: var(--rounded-md);
      transition: background 0.15s ease, color 0.15s ease;
      white-space: nowrap;
    }
    .nav-link:hover, .nav-link.active {
      color: var(--colors-ink);
      background: var(--colors-surface-card);
    }
    .nav-link.active {
      font-weight: 600;
    }
    .nav-actions {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }
    .btn-nav-primary {
      background: var(--colors-primary);
      color: var(--colors-on-dark) !important;
      padding: 8px 16px;
      border-radius: var(--rounded-md);
      font-weight: 600;
      font-size: 13.5px;
      text-decoration: none;
      transition: transform 0.15s ease, opacity 0.15s ease;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      white-space: nowrap;
    }
    .btn-nav-primary:hover {
      opacity: 0.92;
      transform: translateY(-1px);
    }

    /* SHARED PAGE STRUCTURE */
    .page-wrapper {
      flex: 1;
      max-width: 1280px;
      width: 100%;
      margin: 0 auto;
      padding: 2.5rem 1.5rem 4rem 1.5rem;
    }
    .page-header-band {
      margin-bottom: 2.5rem;
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 1.5rem;
      flex-wrap: wrap;
    }
    .page-title {
      font-family: var(--font-display);
      font-size: 2.25rem;
      font-weight: 500;
      letter-spacing: -1.2px;
      color: var(--colors-ink);
      line-height: 1.15;
      margin-bottom: 0.5rem;
    }
    .page-subtitle {
      font-size: 1rem;
      color: var(--colors-body);
      max-width: 680px;
      line-height: 1.5;
    }
    .page-header-pill {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 5px 12px;
      background: var(--colors-surface-card);
      border: 1px solid var(--colors-hairline);
      border-radius: var(--rounded-pill);
      font-size: 12.5px;
      font-weight: 500;
      color: var(--colors-body-strong);
      margin-bottom: 0.75rem;
    }

    /* CARD COMPONENTS */
    .content-card {
      background: #ffffff;
      border: 1px solid var(--colors-hairline);
      border-radius: var(--rounded-lg);
      padding: 2rem;
      box-shadow: 0 4px 16px rgba(10, 10, 10, 0.03);
      margin-bottom: 2rem;
    }
    .card-header-bar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid var(--colors-hairline);
      padding-bottom: 1rem;
      margin-bottom: 1.5rem;
    }
    .card-heading {
      font-family: var(--font-display);
      font-size: 1.25rem;
      font-weight: 600;
      letter-spacing: -0.4px;
      color: var(--colors-ink);
    }

    /* BUTTONS */
    .btn-clay-primary {
      background: var(--colors-primary);
      color: var(--colors-on-dark) !important;
      padding: 10px 20px;
      border-radius: var(--rounded-md);
      font-weight: 600;
      font-size: 14px;
      text-decoration: none;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      cursor: pointer;
      border: none;
      transition: transform 0.15s ease, opacity 0.15s ease;
    }
    .btn-clay-primary:hover {
      opacity: 0.92;
      transform: translateY(-1px);
    }
    .btn-clay-secondary {
      background: var(--colors-canvas);
      color: var(--colors-ink) !important;
      border: 1px solid var(--colors-hairline);
      padding: 10px 18px;
      border-radius: var(--rounded-md);
      font-weight: 600;
      font-size: 14px;
      text-decoration: none;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      cursor: pointer;
      transition: background 0.15s ease;
    }
    .btn-clay-secondary:hover {
      background: var(--colors-surface-card);
    }
    .btn-action-view {
      background: var(--colors-surface-card);
      color: var(--colors-ink);
      border: 1px solid var(--colors-hairline);
      padding: 5px 12px;
      border-radius: var(--rounded-sm);
      font-size: 12.5px;
      font-weight: 600;
      text-decoration: none;
    }
    .btn-action-edit {
      background: #fef3c7;
      color: #92400e;
      border: 1px solid #fde68a;
      padding: 5px 12px;
      border-radius: var(--rounded-sm);
      font-size: 12.5px;
      font-weight: 600;
      text-decoration: none;
    }
    .btn-action-delete {
      background: #fee2e2;
      color: #991b1b;
      border: 1px solid #fecaca;
      padding: 5px 12px;
      border-radius: var(--rounded-sm);
      font-size: 12.5px;
      font-weight: 600;
      cursor: pointer;
    }

    /* FORMS & INPUTS */
    .form-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: 1.25rem;
      margin-bottom: 1.25rem;
    }
    .form-group {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }
    .form-group-full {
      grid-column: 1 / -1;
    }
    .form-label {
      font-size: 13.5px;
      font-weight: 600;
      color: var(--colors-body-strong);
    }
    .form-input, .form-select, .form-textarea {
      padding: 10px 14px;
      border: 1px solid var(--colors-hairline);
      border-radius: var(--rounded-md);
      font-size: 14.5px;
      font-family: inherit;
      color: var(--colors-ink);
      background: var(--colors-canvas);
      transition: border-color 0.15s ease, box-shadow 0.15s ease;
    }
    .form-input:focus, .form-select:focus, .form-textarea:focus {
      outline: none;
      border-color: var(--colors-ink);
      box-shadow: 0 0 0 3px rgba(10, 10, 10, 0.08);
      background: #ffffff;
    }
    .form-textarea {
      min-height: 100px;
      resize: vertical;
    }

    /* DATA TABLES */
    .table-container {
      overflow-x: auto;
      border-radius: var(--rounded-md);
      border: 1px solid var(--colors-hairline);
    }
    .data-table {
      width: 100%;
      border-collapse: collapse;
      text-align: left;
      font-size: 14px;
    }
    .data-table th {
      background: var(--colors-surface-soft);
      color: var(--colors-muted);
      font-weight: 600;
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: 0.6px;
      padding: 12px 16px;
      border-bottom: 1px solid var(--colors-hairline);
    }
    .data-table td {
      padding: 14px 16px;
      border-bottom: 1px solid var(--colors-hairline);
      vertical-align: middle;
    }
    .data-table tr:hover td {
      background: var(--colors-surface-card);
    }

    /* BADGES */
    .badge-pill {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      padding: 4px 10px;
      border-radius: var(--rounded-pill);
      font-size: 12px;
      font-weight: 600;
    }
    .badge-id {
      background: var(--colors-surface-card);
      color: var(--colors-muted);
      border: 1px solid var(--colors-hairline);
      font-family: var(--font-mono);
      font-size: 11.5px;
    }
    .badge-role-alumni {
      background: #eff6ff;
      color: #1d4ed8;
      border: 1px solid #dbeafe;
    }
    .badge-role-student {
      background: #fef3c7;
      color: #b45309;
      border: 1px solid #fde68a;
    }
    .badge-role-faculty, .badge-role-admin {
      background: #f3e8ff;
      color: #6b21a8;
      border: 1px solid #e9d5ff;
    }

    /* ALERTS */
    .alert-banner {
      padding: 14px 18px;
      border-radius: var(--rounded-md);
      margin-bottom: 1.5rem;
      font-size: 14px;
      font-weight: 500;
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .alert-success {
      background: #dcfce7;
      color: #166534;
      border: 1px solid #bbf7d0;
    }
    .alert-danger {
      background: #fee2e2;
      color: #991b1b;
      border: 1px solid #fecaca;
    }

    /* WARM FOOTER */
    .warm-footer {
      background: var(--colors-surface-soft);
      border-top: 1px solid var(--colors-hairline);
      padding: 56px 0 28px 0;
      color: var(--colors-body);
      font-size: 14px;
      margin-top: auto;
    }
    .footer-container {
      max-width: 1280px;
      margin: 0 auto;
      padding: 0 1.5rem;
      display: grid;
      grid-template-columns: 2fr 1fr 1fr 1fr;
      gap: 40px;
      margin-bottom: 40px;
    }
    .footer-brand {
      font-family: var(--font-display);
      font-size: 18px;
      font-weight: 600;
      color: var(--colors-ink);
      margin-bottom: 12px;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .footer-desc {
      font-size: 13.5px;
      color: var(--colors-muted);
      line-height: 1.6;
      max-width: 340px;
    }
    .footer-col-title {
      font-size: 13px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.8px;
      color: var(--colors-ink);
      margin-bottom: 16px;
    }
    .footer-links {
      list-style: none;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    .footer-links a {
      color: var(--colors-body);
      text-decoration: none;
      font-size: 13.5px;
      transition: color 0.15s ease;
    }
    .footer-links a:hover {
      color: var(--colors-ink);
      text-decoration: underline;
    }
    .footer-bottom {
      max-width: 1280px;
      margin: 0 auto;
      padding: 20px 1.5rem 0 1.5rem;
      border-top: 1px solid var(--colors-hairline);
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 13px;
      color: var(--colors-muted);
      flex-wrap: wrap;
      gap: 16px;
    }
    .tech-pill {
      background: var(--colors-canvas);
      border: 1px solid var(--colors-hairline);
      padding: 3px 8px;
      border-radius: var(--rounded-xs);
      font-size: 11.5px;
      font-weight: 500;
      color: var(--colors-body-strong);
    }

    @media (max-width: 1024px) {
      .footer-container { grid-template-columns: 1fr 1fr; }
    }
    @media (max-width: 768px) {
      .nav-menu { display: none; }
      .footer-container { grid-template-columns: 1fr; }
      .page-wrapper { padding: 1.5rem 1rem; }
      .page-title { font-size: 1.75rem; }
    }
    `;
  },

  /**
   * Renders the top sticky navigation header
   * @param {string} [activePage='home']
   */
  renderNavbar(activePage = 'home') {
    return `
  <header class="top-nav">
    <div class="nav-container">
      <a href="/main" class="brand-lockup">
        <span class="brand-emblem">🎓</span>
        <span>Alumni Tracking System</span>
      </a>
      <ul class="nav-menu">
        <li><a href="/main" class="nav-link ${activePage === 'home' ? 'active' : ''}">Home</a></li>
        <li><a href="/users" class="nav-link ${activePage === 'users' ? 'active' : ''}">Alumni Directory</a></li>
        <li><a href="/job-postings" class="nav-link ${activePage === 'jobs' ? 'active' : ''}">Career Board</a></li>
        <li><a href="/announcements" class="nav-link ${activePage === 'announcements' ? 'active' : ''}">Announcements</a></li>
        <li><a href="/applications" class="nav-link ${activePage === 'applications' ? 'active' : ''}">Applications</a></li>
        <li><a href="/api/swagger" class="nav-link" target="_blank">API Docs</a></li>
        <li><a href="/api/health" class="nav-link">Health</a></li>
      </ul>
      <div class="nav-actions">
        <a href="/job-postings" class="btn-nav-primary">
          <span>+</span> Post Opportunity
        </a>
      </div>
    </div>
  </header>`;
  },

  /**
   * Renders the warm cream footer
   */
  renderFooter() {
    return `
  <footer class="warm-footer">
    <div class="footer-container">
      <div>
        <div class="footer-brand">🎓 Alumni Tracking System</div>
        <p class="footer-desc">
          A tactile, playful, and unified ecosystem bridging academic excellence and industry leadership.
        </p>
      </div>
      <div>
        <div class="footer-col-title">Navigation</div>
        <ul class="footer-links">
          <li><a href="/main">Home</a></li>
          <li><a href="/users">Alumni Directory</a></li>
          <li><a href="/job-postings">Career Board</a></li>
          <li><a href="/announcements">Announcements</a></li>
          <li><a href="/applications">Applications</a></li>
        </ul>
      </div>
      <div>
        <div class="footer-col-title">Developer API</div>
        <ul class="footer-links">
          <li><a href="/api/swagger">Swagger UI</a></li>
          <li><a href="/api/swagger.json">OpenAPI 3.0 Spec</a></li>
          <li><a href="/api/health">System Health</a></li>
          <li><a href="/404">404 Guardian</a></li>
        </ul>
      </div>
      <div>
        <div class="footer-col-title">Alma Mater</div>
        <ul class="footer-links">
          <li><a href="/about">About Platform</a></li>
          <li><a href="/alumni">Alumni Chapters</a></li>
          <li><a href="https://github.com/ecemyakali/alumni" target="_blank" rel="noopener">GitHub Repository</a></li>
        </ul>
      </div>
    </div>

    <div class="footer-bottom">
      <div>© 2026 Alumni Tracking System. All rights reserved.</div>
      <div style="display:flex; gap:8px;">
        <span class="tech-pill">Node.js</span>
        <span class="tech-pill">Express</span>
        <span class="tech-pill">PostgreSQL</span>
        <span class="tech-pill">Docker</span>
      </div>
    </div>
  </footer>`;
  }
};

module.exports = sharedLayout;
