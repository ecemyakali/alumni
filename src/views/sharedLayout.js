/**
 * Shared Layout & Design System Components (Mintlify Aurora Aesthetic)
 * File: src/views/sharedLayout.js
 * 
 * Provides unified, airy Mintlify B2B SaaS layout elements:
 * - Multi-layered Aurora / Mesh Gradient background (emerald, cyan, sky blue)
 * - Sticky Frosted-Glass Top Navigation Bar with single-row fit at 1280px
 * - Deep diffuse shadows and elevated cards
 * - Modern 100% English footer with API & documentation links
 * - Full backward-compatibility mapping for existing views
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
   * Generates common CSS design tokens, resets, typography, and Mintlify Aurora component styles
   */
  getCommonStyles() {
    return `
    :root {
      /* Mintlify Aurora Core Design Tokens */
      --canvas: #ffffff;
      --surface-subtle: #f9fafb;
      --surface-card: #ffffff;
      --surface-hover: #f3f4f6;

      --hairline: #e5e7eb;
      --hairline-strong: #d1d5db;

      --ink: #111827;
      --ink-muted: #4b5563;
      --ink-subtle: #6b7280;
      --ink-tertiary: #9ca3af;

      --primary: #111827;
      --primary-hover: #1f2937;

      --brand-mint: #0d9373;
      --brand-mint-hover: #0b7c61;
      --brand-mint-subtle: #ecfdf5;
      --brand-mint-border: #a7f3d0;

      --brand-accent: #5e6ad2;
      --brand-accent-subtle: #eef0fb;

      --semantic-success: #10b981;
      --semantic-warning: #f59e0b;
      --semantic-error: #ef4444;
      --semantic-info: #3b82f6;

      --rounded-xs: 4px;
      --rounded-sm: 6px;
      --rounded-md: 8px;
      --rounded-lg: 12px;
      --rounded-xl: 16px;
      --rounded-pill: 9999px;

      --font-sans: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      --font-display: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      --font-body: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      --font-mono: ui-monospace, "SF Mono", "Geist Mono", Menlo, Consolas, monospace;

      /* Legacy compatibility mappings */
      --colors-canvas: var(--canvas);
      --colors-surface-soft: var(--surface-subtle);
      --colors-surface-card: var(--surface-card);
      --colors-surface-strong: var(--surface-hover);
      --colors-hairline: var(--hairline);
      --colors-surface-dark: #0a1a1a;
      --colors-primary: var(--primary);
      --colors-ink: var(--ink);
      --colors-body-strong: var(--ink);
      --colors-body: var(--ink-muted);
      --colors-muted: var(--ink-subtle);
      --colors-muted-soft: var(--ink-tertiary);
      --colors-on-dark: #ffffff;
      --colors-brand-mint: var(--brand-mint);
      --colors-brand-blue: #2563eb;
      --colors-brand-pink: #ec4899;
      --colors-brand-lavender: #8b5cf6;
      --colors-brand-peach: #f97316;
      --colors-brand-teal: #0d9488;
      --colors-success: var(--semantic-success);
      --colors-warning: var(--semantic-warning);
      --colors-error: var(--semantic-error);
    }

    * { box-sizing: border-box; margin: 0; padding: 0; }

    html, body {
      overflow-x: hidden;
    }

    body {
      font-family: var(--font-sans);
      background-color: #ffffff;
      background-image: 
        radial-gradient(at 15% 10%, rgba(16, 185, 129, 0.22) 0px, transparent 50%),
        radial-gradient(at 85% 15%, rgba(6, 182, 212, 0.20) 0px, transparent 50%),
        radial-gradient(at 50% 0%, rgba(59, 130, 246, 0.14) 0px, transparent 60%),
        linear-gradient(180deg, rgba(236, 253, 245, 0.72) 0%, rgba(255, 255, 255, 1) 100%);
      background-attachment: fixed;
      background-repeat: no-repeat;
      color: var(--ink);
      line-height: 1.55;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      -webkit-font-smoothing: antialiased;
    }

    .font-mono {
      font-family: var(--font-mono);
    }

    /* ========================================================
     * TOP NAVIGATION (Frosted-Glass, 1280px Fit)
     * ======================================================== */
    .top-nav {
      position: sticky;
      top: 0;
      z-index: 100;
      background: rgba(255, 255, 255, 0.85);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      border-bottom: 1px solid var(--hairline);
    }
    .nav-container {
      max-width: 1280px;
      margin: 0 auto;
      padding: 0 1.25rem;
      height: 64px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 0.75rem;
    }
    .brand-lockup {
      display: flex;
      align-items: center;
      gap: 8px;
      text-decoration: none;
      color: var(--ink);
      font-weight: 700;
      font-size: 0.98rem;
      letter-spacing: -0.3px;
      white-space: nowrap;
      flex-shrink: 0;
    }
    .brand-icon, .brand-emblem {
      font-size: 1.25rem;
      line-height: 1;
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }
    .nav-menu {
      display: flex;
      align-items: center;
      gap: 2px;
      list-style: none;
      flex-wrap: nowrap;
    }
    .nav-link {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      padding: 6px 11px;
      font-size: 13px;
      font-weight: 500;
      white-space: nowrap;
      text-decoration: none;
      color: var(--ink-muted);
      border-radius: var(--rounded-pill);
      transition: all 0.15s ease;
    }
    .nav-link:hover {
      color: var(--ink);
      background: var(--surface-subtle);
    }
    .nav-link.active {
      color: var(--brand-mint);
      background: var(--brand-mint-subtle);
      font-weight: 600;
    }
    .nav-actions {
      display: flex;
      align-items: center;
      gap: 8px;
      white-space: nowrap;
      flex-shrink: 0;
    }
    .nav-actions .btn-pill-primary,
    .nav-actions .btn-nav-primary {
      padding: 8px 16px;
      font-size: 13px;
    }

    /* BUTTONS */
    .btn-pill-primary, .btn-clay-primary, .btn-nav-primary {
      background: var(--primary);
      color: #ffffff !important;
      padding: 9px 20px;
      border-radius: var(--rounded-pill);
      font-size: 13.5px;
      font-weight: 600;
      text-decoration: none;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      border: 1px solid transparent;
      transition: all 0.15s ease;
      cursor: pointer;
      white-space: nowrap;
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
    }
    .btn-pill-primary:hover, .btn-clay-primary:hover, .btn-nav-primary:hover {
      background: var(--primary-hover);
      transform: translateY(-1px);
      box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12);
    }
    .btn-pill-secondary, .btn-clay-secondary {
      background: #ffffff;
      color: var(--ink) !important;
      padding: 9px 18px;
      border-radius: var(--rounded-pill);
      font-size: 13.5px;
      font-weight: 600;
      text-decoration: none;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      border: 1px solid var(--hairline);
      transition: all 0.15s ease;
      cursor: pointer;
      white-space: nowrap;
    }
    .btn-pill-secondary:hover, .btn-clay-secondary:hover {
      background: var(--surface-subtle);
      border-color: var(--hairline-strong);
      transform: translateY(-1px);
    }

    /* ROW ACTION BUTTONS */
    .btn-action-view {
      background: var(--surface-subtle);
      color: var(--ink);
      border: 1px solid var(--hairline);
      padding: 5px 12px;
      border-radius: var(--rounded-pill);
      font-size: 12px;
      font-weight: 600;
      text-decoration: none;
      display: inline-flex;
      align-items: center;
      gap: 4px;
      transition: all 0.15s ease;
    }
    .btn-action-view:hover {
      background: #ffffff;
      border-color: var(--hairline-strong);
      transform: translateY(-1px);
    }
    .btn-action-edit {
      background: #fef3c7;
      color: #92400e;
      border: 1px solid #fde68a;
      padding: 5px 12px;
      border-radius: var(--rounded-pill);
      font-size: 12px;
      font-weight: 600;
      text-decoration: none;
      display: inline-flex;
      align-items: center;
      gap: 4px;
      transition: all 0.15s ease;
    }
    .btn-action-edit:hover {
      background: #fde68a;
      transform: translateY(-1px);
    }
    .btn-action-delete {
      background: #fee2e2;
      color: #991b1b;
      border: 1px solid #fecaca;
      padding: 5px 12px;
      border-radius: var(--rounded-pill);
      font-size: 12px;
      font-weight: 600;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 4px;
      transition: all 0.15s ease;
    }
    .btn-action-delete:hover {
      background: #fecaca;
      transform: translateY(-1px);
    }

    /* PAGE STRUCTURE */
    .page-wrapper {
      flex: 1;
      max-width: 1200px;
      width: 100%;
      margin: 0 auto;
      padding: 2.5rem 1.5rem 4rem 1.5rem;
    }
    .page-header-band {
      margin-bottom: 2rem;
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 1.5rem;
      flex-wrap: wrap;
    }
    .page-title {
      font-size: 2.25rem;
      font-weight: 700;
      letter-spacing: -1px;
      color: var(--ink);
      line-height: 1.2;
      margin-bottom: 0.5rem;
    }
    .page-subtitle {
      font-size: 15px;
      color: var(--ink-muted);
      max-width: 680px;
      line-height: 1.6;
    }
    .page-header-pill {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 4px 12px;
      background: #ffffff;
      border: 1px solid var(--hairline);
      border-radius: var(--rounded-pill);
      font-size: 12.5px;
      font-weight: 500;
      color: var(--ink-muted);
      margin-bottom: 0.75rem;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.03);
    }

    /* CARD COMPONENTS WITH DEEP DIFFUSE SHADOWS */
    .content-card {
      background: #ffffff;
      border: 1px solid var(--hairline);
      border-radius: var(--rounded-xl);
      padding: 2rem;
      box-shadow: 0 4px 20px -2px rgba(0, 0, 0, 0.05), 0 2px 6px -1px rgba(0, 0, 0, 0.03);
      margin-bottom: 2rem;
      transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .content-card:hover {
      border-color: var(--hairline-strong);
      box-shadow: 0 14px 34px -6px rgba(0, 0, 0, 0.08), 0 4px 12px rgba(0, 0, 0, 0.03);
    }
    .card-header-bar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid var(--surface-subtle);
      padding-bottom: 1rem;
      margin-bottom: 1.5rem;
      flex-wrap: wrap;
      gap: 12px;
    }
    .card-heading {
      font-size: 1.25rem;
      font-weight: 600;
      letter-spacing: -0.4px;
      color: var(--ink);
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
      color: var(--ink);
    }
    .form-input, .form-select, .form-textarea {
      padding: 9px 13px;
      border: 1px solid var(--hairline-strong);
      border-radius: var(--rounded-md);
      font-size: 14px;
      font-family: inherit;
      color: var(--ink);
      background: #ffffff;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.02);
      transition: all 0.15s ease;
    }
    .form-input:focus, .form-select:focus, .form-textarea:focus {
      outline: none;
      border-color: var(--brand-mint);
      box-shadow: 0 0 0 3px rgba(13, 147, 115, 0.15);
      background: #ffffff;
    }
    .form-textarea {
      min-height: 100px;
      resize: vertical;
    }

    /* DATA TABLES */
    .table-container {
      overflow-x: auto;
      border-radius: var(--rounded-lg);
      border: 1px solid var(--hairline);
      background: #ffffff;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.02);
    }
    .data-table {
      width: 100%;
      border-collapse: collapse;
      text-align: left;
      font-size: 13.5px;
    }
    .data-table th {
      background: var(--surface-subtle);
      color: var(--ink-subtle);
      font-weight: 600;
      font-size: 11.5px;
      text-transform: uppercase;
      letter-spacing: 0.6px;
      padding: 12px 16px;
      border-bottom: 1px solid var(--hairline);
    }
    .data-table td {
      padding: 13px 16px;
      border-bottom: 1px solid var(--hairline);
      vertical-align: middle;
    }
    .data-table tr:hover td {
      background: var(--surface-hover);
    }

    /* BADGES */
    .badge-pill {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      padding: 3px 10px;
      border-radius: var(--rounded-pill);
      font-size: 12px;
      font-weight: 500;
    }
    .badge-id {
      background: var(--surface-subtle);
      color: var(--ink-subtle);
      border: 1px solid var(--hairline);
      font-family: var(--font-mono);
      font-size: 11.5px;
    }
    .badge-role-alumni {
      background: #ecfdf5;
      color: var(--brand-mint);
      border: 1px solid var(--brand-mint-border);
    }
    .badge-role-student {
      background: #fef3c7;
      color: #b45309;
      border: 1px solid #fde68a;
    }
    .badge-role-faculty, .badge-role-admin {
      background: #eff6ff;
      color: #1d4ed8;
      border: 1px solid #dbeafe;
    }

    /* ALERTS */
    .alert-banner {
      padding: 12px 16px;
      border-radius: var(--rounded-md);
      margin-bottom: 1.5rem;
      font-size: 13.5px;
      font-weight: 500;
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .alert-success {
      background: #ecfdf5;
      color: #065f46;
      border: 1px solid #a7f3d0;
    }
    .alert-danger {
      background: #fef2f2;
      color: #991b1b;
      border: 1px solid #fecaca;
    }

    /* MINTLIFY FOOTER */
    .warm-footer, .site-footer {
      border-top: 1px solid var(--hairline);
      background: #ffffff;
      padding: 4rem 1.5rem 2.5rem 1.5rem;
      margin-top: auto;
    }
    .footer-container {
      max-width: 1200px;
      margin: 0 auto;
      display: grid;
      grid-template-columns: 2fr 1fr 1fr 1fr;
      gap: 3rem;
      margin-bottom: 3rem;
    }
    .footer-brand {
      font-weight: 700;
      font-size: 1.05rem;
      color: var(--ink);
      margin-bottom: 0.5rem;
    }
    .footer-desc {
      font-size: 13.5px;
      color: var(--ink-muted);
      line-height: 1.6;
      max-width: 320px;
    }
    .footer-col-title {
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.6px;
      color: var(--ink);
      margin-bottom: 1rem;
    }
    .footer-links {
      list-style: none;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .footer-links a {
      color: var(--ink-subtle);
      text-decoration: none;
      font-size: 13px;
      transition: color 0.15s ease;
    }
    .footer-links a:hover {
      color: var(--ink);
    }
    .footer-bottom {
      max-width: 1200px;
      margin: 0 auto;
      padding-top: 1.75rem;
      border-top: 1px solid var(--hairline);
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 1rem;
      font-size: 13px;
      color: var(--ink-tertiary);
    }
    .tech-pill {
      background: var(--surface-subtle);
      border: 1px solid var(--hairline);
      padding: 3px 8px;
      border-radius: var(--rounded-pill);
      font-size: 11.5px;
      font-family: var(--font-mono);
      color: var(--ink-subtle);
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
   * Renders the top sticky frosted-glass navigation header
   * @param {string} [activePage='home']
   */
  renderNavbar(activePage = 'home') {
    return `
  <header class="top-nav">
    <div class="nav-container">
      <a href="/main" class="brand-lockup">
        <span class="brand-icon">🎓</span>
        <span>Alumni Tracking System</span>
      </a>
      <ul class="nav-menu">
        <li><a href="/main" class="nav-link ${activePage === 'home' ? 'active' : ''}">Home</a></li>
        <li><a href="/users" class="nav-link ${activePage === 'users' ? 'active' : ''}">Alumni Directory</a></li>
        <li><a href="/job-postings" class="nav-link ${activePage === 'jobs' ? 'active' : ''}">Career Opportunities</a></li>
        <li><a href="/announcements" class="nav-link ${activePage === 'announcements' ? 'active' : ''}">Announcements Board</a></li>
        <li><a href="/applications" class="nav-link ${activePage === 'applications' ? 'active' : ''}">Application Tracking</a></li>
        <li><a href="/api/swagger" class="nav-link" target="_blank">Swagger UI</a></li>
        <li><a href="/api/health" class="nav-link ${activePage === 'health' ? 'active' : ''}">System Health</a></li>
      </ul>
      <div class="nav-actions">
        <a href="/job-postings#post-job" class="btn-pill-primary">
          <span>+</span> Post Opportunity
        </a>
      </div>
    </div>
  </header>`;
  },

  /**
   * Renders the clean Mintlify footer in English
   */
  renderFooter() {
    return `
  <footer class="site-footer">
    <div class="footer-container">
      <div>
        <div class="footer-brand">🎓 Alumni Tracking System</div>
        <p class="footer-desc">
          A modern, scalable network engineered to bridge academic excellence with lifetime career achievement.
        </p>
      </div>
      <div>
        <div class="footer-col-title">Navigation</div>
        <ul class="footer-links">
          <li><a href="/main">Home</a></li>
          <li><a href="/users">Alumni Directory</a></li>
          <li><a href="/job-postings">Career Opportunities</a></li>
          <li><a href="/announcements">Announcements Board</a></li>
          <li><a href="/applications">Application Tracking</a></li>
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
        <div class="footer-col-title">Documentation</div>
        <ul class="footer-links">
          <li><a href="/brand.md">Brand Manual (brand.md)</a></li>
          <li><a href="/DESIGN.md">Design System (DESIGN.md)</a></li>
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
      </div>
    </div>
  </footer>`;
  }
};

module.exports = sharedLayout;
