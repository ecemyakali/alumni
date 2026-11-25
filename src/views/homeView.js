/**
 * ========================================================
 * View Layer: Homepage View (Mintlify Aurora 4-Section Design)
 * File: src/views/homeView.js
 * ========================================================
 * 
 * Implements a modern, high-contrast, shaded gradient 4-section layout:
 * - Section 1: Focused Hero & Live Search with Network Telemetry Bar
 * - Section 2: Bento Quick-Access Grid (Directory, Profile, Events, Admin/Jobs)
 * - Section 3: Featured / Recent Alumni Spotlight with high-contrast badges
 * - Section 4: Call-to-Action Shaded Card & Minimal Footer
 */

const sharedLayout = require('./sharedLayout');

function escapeHtml(str) {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

const homeView = {
  escapeHtml,

  /**
   * Renders the complete HTML homepage document
   * @param {Object} [data={}]
   * @param {number} [data.userCount=0]
   * @param {number} [data.jobPostingCount=0]
   * @param {number} [data.announcementCount=0]
   * @param {number} [data.applicationCount=0]
   * @param {Array<Object>} [data.recentAnnouncements=[]]
   * @param {Array<Object>} [data.recentJobPostings=[]]
   * @param {Array<Object>} [data.recentUsers=[]]
   * @param {Object|null} [data.currentUser=null]
   * @param {Object} [options={}]
   * @returns {string} Formatted HTML document
   */
  renderHomePage(data = {}, options = {}) {
    const currentUser = data.currentUser || options.currentUser || null;
    const isAuthenticated = Boolean(currentUser);
    const isAdmin = isAuthenticated && currentUser.role === 'admin';

    const userCount = data.userCount !== undefined ? data.userCount : 0;
    const jobPostingCount = data.jobPostingCount !== undefined ? data.jobPostingCount : 0;
    const announcementCount = data.announcementCount !== undefined ? data.announcementCount : 0;
    const applicationCount = data.applicationCount !== undefined ? data.applicationCount : 0;

    const recentAnnouncements = Array.isArray(data.recentAnnouncements) && data.recentAnnouncements.length > 0
      ? data.recentAnnouncements
      : [
        { id: 1, title: 'Annual Alumni Homecoming 2026', author: 'Dean of Engineering', date: '2026-11-20', category: 'Event' },
        { id: 2, title: 'Fall Career Fair & Executive Networking', author: 'Career Development Center', date: '2026-11-15', category: 'Career' }
      ];

    const recentJobPostings = Array.isArray(data.recentJobPostings) && data.recentJobPostings.length > 0
      ? data.recentJobPostings
      : [
        { id: 1, title: 'Senior Cloud Architect', company: 'Google Cloud', city: 'Zurich', type: 'Full-time' },
        { id: 2, title: 'Staff Distributed Systems Engineer', company: 'Stripe Platforms', city: 'Berlin / Remote', type: 'Full-time' }
      ];

    const firstAnnouncement = recentAnnouncements[0] || {
      id: 1,
      title: 'Annual Alumni Homecoming 2026',
      author: 'Dean of Engineering',
      date: '2026-11-20'
    };

    const firstJob = recentJobPostings[0] || {
      id: 1,
      title: 'Senior Cloud Architect',
      company: 'Google Cloud',
      city: 'Zurich',
      type: 'Full-time'
    };

    const recentUsers = Array.isArray(data.recentUsers) && data.recentUsers.length > 0
      ? data.recentUsers.slice(0, 4)
      : [
        {
          id: 1,
          name: 'Dr. Selin Demir',
          graduationYear: 2018,
          department: 'Computer Science',
          currentRole: 'Principal Scientist',
          company: 'Stanford AI Lab'
        },
        {
          id: 2,
          name: 'Baris Akin',
          graduationYear: 2020,
          department: 'Software Engineering',
          currentRole: 'Senior Product Manager',
          company: 'Revolut'
        },
        {
          id: 3,
          name: 'Elena Rostova',
          graduationYear: 2019,
          department: 'Electrical Engineering',
          currentRole: 'Senior Cloud Architect',
          company: 'Google Cloud'
        },
        {
          id: 4,
          name: 'Marcus Chen',
          graduationYear: 2022,
          department: 'Data Science',
          currentRole: 'Staff Systems Engineer',
          company: 'Stripe Platforms'
        }
      ];

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Alumni Tracking System — Modern Alumni &amp; Career Network</title>
  <style>
    ${sharedLayout.getCommonStyles()}

    /* ========================================================
     * HOMEPAGE SECTION FRAMING & TYPOGRAPHY
     * ======================================================== */
    .section-framing {
      text-align: center;
      max-width: 760px;
      margin: 0 auto 3rem auto;
    }
    .eyebrow-badge {
      display: inline-flex;
      align-items: center;
      gap: 7px;
      padding: 4px 12px;
      background: #ffffff;
      border: 1px solid var(--brand-mint-border);
      border-radius: var(--rounded-pill);
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.8px;
      text-transform: uppercase;
      color: var(--brand-mint);
      margin-bottom: 1rem;
      box-shadow: 0 1px 3px rgba(13, 147, 115, 0.08);
    }
    .eyebrow-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: var(--brand-mint);
      box-shadow: 0 0 0 2px rgba(13, 147, 115, 0.25);
    }
    .tracking-tight {
      letter-spacing: -1.2px;
    }
    .text-gradient {
      background: linear-gradient(135deg, #0d9373 0%, #2563eb 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .section-heading-lg {
      font-size: clamp(1.85rem, 3.2vw, 2.5rem);
      font-weight: 700;
      color: var(--ink);
      line-height: 1.2;
      margin-bottom: 0.75rem;
    }
    .section-subtext {
      font-size: 15px;
      color: var(--ink-muted);
      line-height: 1.6;
      max-width: 620px;
      margin: 0 auto;
    }

    /* ========================================================
     * SECTION 1: FOCUSED HERO & LIVE SEARCH
     * ======================================================== */
    .hero-section {
      position: relative;
      background-color: #ffffff;
      background-image: 
        radial-gradient(at 15% 10%, rgba(16, 185, 129, 0.22) 0px, transparent 50%),
        radial-gradient(at 85% 15%, rgba(6, 182, 212, 0.18) 0px, transparent 50%),
        radial-gradient(at 50% 0%, rgba(59, 130, 246, 0.12) 0px, transparent 60%),
        linear-gradient(180deg, rgba(236, 253, 245, 0.70) 0%, rgba(255, 255, 255, 1) 100%);
      padding: 5.5rem 1.5rem 4.5rem 1.5rem;
      border-bottom: 1px solid var(--hairline);
    }
    .hero-inner {
      max-width: 960px;
      margin: 0 auto;
      text-align: center;
    }
    .hero-announcement-pill {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 5px 14px;
      background: #ffffff;
      border: 1px solid var(--hairline);
      border-radius: var(--rounded-pill);
      text-decoration: none;
      color: var(--ink);
      font-size: 13px;
      font-weight: 500;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.03);
      margin-bottom: 1.5rem;
      transition: all 0.15s ease;
    }
    .hero-announcement-pill:hover {
      border-color: var(--brand-mint-border);
      transform: translateY(-1px);
    }
    .hero-title {
      font-size: clamp(2.3rem, 4.5vw, 3.8rem);
      font-weight: 700;
      line-height: 1.12;
      color: var(--ink);
      margin-bottom: 1.25rem;
    }
    .hero-subtitle {
      font-size: clamp(1rem, 1.8vw, 1.2rem);
      color: var(--ink-muted);
      max-width: 680px;
      margin: 0 auto 2.25rem auto;
      line-height: 1.6;
    }

    /* CENTRAL SEARCH BAR */
    .search-box-wrapper {
      max-width: 620px;
      margin: 0 auto 2.5rem auto;
    }
    .search-bar {
      display: flex;
      align-items: center;
      background: #ffffff;
      border: 1px solid var(--hairline-strong);
      border-radius: var(--rounded-xl);
      padding: 8px 12px 8px 18px;
      box-shadow: 0 10px 30px -5px rgba(13, 147, 115, 0.10), 0 4px 16px rgba(0, 0, 0, 0.04);
      transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .search-bar:focus-within {
      border-color: var(--brand-mint);
      box-shadow: 0 0 0 3px rgba(13, 147, 115, 0.18), 0 12px 32px -4px rgba(13, 147, 115, 0.18);
    }
    .search-icon {
      font-size: 16px;
      color: var(--ink-subtle);
      margin-right: 12px;
      line-height: 1;
    }
    .search-input {
      flex: 1;
      border: none;
      outline: none;
      font-size: 15px;
      color: var(--ink);
      font-family: inherit;
      background: transparent;
    }
    .search-input::placeholder {
      color: var(--ink-tertiary);
      font-size: 14.5px;
    }
    .search-badge {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      background: var(--surface-subtle);
      border: 1px solid var(--hairline);
      padding: 4px 8px;
      border-radius: 6px;
      font-size: 11.5px;
      font-family: var(--font-mono);
      color: var(--ink-subtle);
      user-select: none;
    }

    /* HORIZONTAL NETWORK METRICS BAR */
    .metrics-bar-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 16px;
      max-width: 900px;
      margin: 0 auto 2.25rem auto;
    }
    .metric-card {
      background: rgba(255, 255, 255, 0.85);
      backdrop-filter: blur(8px);
      border: 1px solid var(--hairline);
      border-radius: var(--rounded-lg);
      padding: 1.15rem 1rem;
      text-decoration: none;
      color: var(--ink);
      transition: all 0.2s ease;
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.02);
    }
    .metric-card:hover {
      background: #ffffff;
      border-color: var(--brand-mint-border);
      transform: translateY(-2px);
      box-shadow: 0 10px 24px -4px rgba(13, 147, 115, 0.08), 0 2px 8px rgba(0, 0, 0, 0.03);
    }
    .metric-num {
      font-size: 1.85rem;
      font-weight: 700;
      color: var(--ink);
      font-family: var(--font-mono);
      line-height: 1;
      margin-bottom: 4px;
    }
    .metric-num.highlight {
      color: var(--brand-mint);
    }
    .metric-title {
      font-size: 13px;
      font-weight: 600;
      color: var(--ink);
    }
    .metric-sub {
      font-size: 11px;
      color: var(--ink-subtle);
      margin-top: 2px;
    }

    .hero-actions {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 12px;
      flex-wrap: wrap;
    }

    /* ========================================================
     * SECTION 2: BENTO QUICK-ACCESS GRID
     * ======================================================== */
    .bento-section {
      background: linear-gradient(180deg, #f9fafb 0%, #f3f4f6 100%);
      padding: 5.5rem 1.5rem;
      border-bottom: 1px solid var(--hairline);
    }
    .bento-container {
      max-width: 1200px;
      margin: 0 auto;
    }
    .bento-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(270px, 1fr));
      gap: 22px;
    }
    .bento-card {
      background: #ffffff;
      border: 1px solid var(--hairline);
      border-radius: var(--rounded-xl);
      padding: 2rem;
      box-shadow: 0 4px 14px rgba(0, 0, 0, 0.03), 0 1px 3px rgba(0, 0, 0, 0.02);
      transition: all 0.22s cubic-bezier(0.16, 1, 0.3, 1);
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      position: relative;
      overflow: hidden;
    }
    .bento-card:hover {
      border-color: var(--brand-mint-border);
      transform: translateY(-3px);
      box-shadow: 0 16px 36px -4px rgba(0, 0, 0, 0.08), 0 4px 12px rgba(0, 0, 0, 0.03);
    }
    .bento-card.admin-card {
      border-top: 3px solid #2563eb;
    }
    .bento-card.standard-card {
      border-top: 3px solid var(--brand-mint);
    }
    .bento-card-top {
      margin-bottom: 1.5rem;
    }
    .bento-tag-bar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 1rem;
    }
    .bento-tag {
      font-size: 10.5px;
      font-weight: 700;
      letter-spacing: 0.6px;
      text-transform: uppercase;
      padding: 3px 8px;
      border-radius: var(--rounded-pill);
      background: var(--surface-subtle);
      color: var(--ink-subtle);
      border: 1px solid var(--hairline);
    }
    .bento-icon-wrap {
      width: 44px;
      height: 44px;
      border-radius: var(--rounded-md);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.4rem;
      background: var(--surface-subtle);
      border: 1px solid var(--hairline);
      margin-bottom: 1.25rem;
    }
    .bento-card-title {
      font-size: 1.25rem;
      font-weight: 700;
      letter-spacing: -0.4px;
      color: var(--ink);
      margin-bottom: 0.5rem;
    }
    .bento-card-desc {
      font-size: 13.5px;
      color: var(--ink-muted);
      line-height: 1.6;
    }
    .bento-card-action {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      font-size: 13.5px;
      font-weight: 600;
      color: var(--brand-mint);
      text-decoration: none;
      transition: gap 0.15s ease;
      padding-top: 1rem;
      border-top: 1px solid var(--surface-subtle);
    }
    .bento-card-action:hover {
      gap: 9px;
    }

    /* ========================================================
     * SECTION 3: FEATURED / RECENT ALUMNI SPOTLIGHT
     * ======================================================== */
    .spotlight-section {
      background: #ffffff;
      padding: 5.5rem 1.5rem;
      border-bottom: 1px solid var(--hairline);
    }
    .spotlight-container {
      max-width: 1200px;
      margin: 0 auto;
    }
    .spotlight-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 22px;
    }
    .alumni-card {
      background: #ffffff;
      border: 1px solid var(--hairline);
      border-radius: var(--rounded-xl);
      padding: 1.75rem;
      box-shadow: 0 4px 14px rgba(0, 0, 0, 0.03), 0 1px 3px rgba(0, 0, 0, 0.02);
      transition: all 0.22s cubic-bezier(0.16, 1, 0.3, 1);
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
    .alumni-card:hover {
      border-color: var(--hairline-strong);
      transform: translateY(-3px);
      box-shadow: 0 16px 36px -4px rgba(0, 0, 0, 0.08), 0 4px 12px rgba(0, 0, 0, 0.03);
    }
    .alumni-header {
      display: flex;
      align-items: center;
      gap: 14px;
      margin-bottom: 1.25rem;
    }
    .alumni-avatar {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      background: linear-gradient(135deg, rgba(13, 147, 115, 0.15) 0%, rgba(37, 99, 235, 0.15) 100%);
      border: 1px solid var(--brand-mint-border);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.3rem;
      flex-shrink: 0;
    }
    .alumni-name {
      font-size: 1.1rem;
      font-weight: 700;
      color: var(--ink);
      letter-spacing: -0.3px;
    }
    .alumni-badges-row {
      display: flex;
      align-items: center;
      gap: 6px;
      flex-wrap: wrap;
      margin-bottom: 1rem;
    }
    .alumni-badge-pill {
      font-size: 11.5px;
      font-weight: 500;
      padding: 3px 9px;
      border-radius: var(--rounded-pill);
      background: var(--surface-subtle);
      border: 1px solid var(--hairline);
      color: var(--ink-subtle);
    }
    .alumni-badge-pill.grad-year {
      font-family: var(--font-mono);
      background: var(--brand-mint-subtle);
      color: var(--brand-mint);
      border-color: var(--brand-mint-border);
      font-weight: 600;
    }
    .alumni-role-info {
      font-size: 13.5px;
      color: var(--ink-muted);
      line-height: 1.5;
      margin-bottom: 1.25rem;
    }
    .alumni-role-company {
      font-weight: 600;
      color: var(--ink);
    }
    .alumni-card-footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding-top: 1rem;
      border-top: 1px solid var(--surface-subtle);
    }
    .alumni-action-link {
      font-size: 13px;
      font-weight: 600;
      color: var(--brand-mint);
      text-decoration: none;
      display: inline-flex;
      align-items: center;
      gap: 4px;
      transition: gap 0.15s ease;
    }
    .alumni-action-link:hover {
      gap: 8px;
    }

    /* ========================================================
     * SECTION 4: CALL-TO-ACTION FOOTER BANNER
     * ======================================================== */
    .cta-section {
      background: linear-gradient(180deg, #f9fafb 0%, #ffffff 100%);
      padding: 5.5rem 1.5rem 4rem 1.5rem;
    }
    .cta-container {
      max-width: 1100px;
      margin: 0 auto;
    }
    .cta-card {
      background: linear-gradient(135deg, #111827 0%, #1f2937 100%);
      border-radius: var(--rounded-xl);
      padding: 4rem 3rem;
      color: #ffffff;
      text-align: center;
      position: relative;
      overflow: hidden;
      box-shadow: 0 20px 40px -10px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(13, 147, 115, 0.25);
    }
    .cta-card::before {
      content: "";
      position: absolute;
      top: -50%;
      left: -50%;
      width: 200%;
      height: 200%;
      background: radial-gradient(circle at 50% 20%, rgba(13, 147, 115, 0.25) 0%, transparent 50%),
                  radial-gradient(circle at 80% 80%, rgba(37, 99, 235, 0.20) 0%, transparent 50%);
      pointer-events: none;
    }
    .cta-inner {
      position: relative;
      z-index: 2;
      max-width: 720px;
      margin: 0 auto;
    }
    .cta-eyebrow {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 4px 12px;
      background: rgba(255, 255, 255, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: var(--rounded-pill);
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.8px;
      text-transform: uppercase;
      color: #a7f3d0;
      margin-bottom: 1.25rem;
    }
    .cta-heading {
      font-size: clamp(2rem, 3.5vw, 2.75rem);
      font-weight: 700;
      line-height: 1.15;
      margin-bottom: 1rem;
      color: #ffffff;
    }
    .cta-subtext {
      font-size: 15px;
      color: #d1d5db;
      line-height: 1.6;
      margin-bottom: 2.25rem;
    }
    .cta-buttons {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 14px;
      flex-wrap: wrap;
    }
    .btn-cta-primary {
      background: #0d9373;
      color: #ffffff !important;
      padding: 11px 26px;
      border-radius: var(--rounded-pill);
      font-size: 14px;
      font-weight: 600;
      text-decoration: none;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      transition: all 0.15s ease;
      box-shadow: 0 4px 14px rgba(13, 147, 115, 0.4);
    }
    .btn-cta-primary:hover {
      background: #0b7c61;
      transform: translateY(-1px);
      box-shadow: 0 6px 20px rgba(13, 147, 115, 0.5);
    }
    .btn-cta-secondary {
      background: rgba(255, 255, 255, 0.1);
      color: #ffffff !important;
      border: 1px solid rgba(255, 255, 255, 0.25);
      padding: 11px 24px;
      border-radius: var(--rounded-pill);
      font-size: 14px;
      font-weight: 600;
      text-decoration: none;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      transition: all 0.15s ease;
    }
    .btn-cta-secondary:hover {
      background: rgba(255, 255, 255, 0.18);
      transform: translateY(-1px);
    }

    @media (max-width: 900px) {
      .metrics-bar-grid { grid-template-columns: repeat(2, 1fr); }
      .cta-card { padding: 3rem 1.5rem; }
    }
    @media (max-width: 600px) {
      .metrics-bar-grid { grid-template-columns: 1fr; }
    }
  </style>
</head>
<body>

  <!-- Sticky Single-Row Top Navigation Bar -->
  ${sharedLayout.renderNavbar('home', currentUser)}

  <!-- ========================================================
   * SECTION 1: FOCUSED HERO & LIVE SEARCH
   * ======================================================== -->
  <section class="hero-section">
    <div class="hero-inner">
      <div class="eyebrow-badge">
        <span class="eyebrow-dot"></span>
        <span>OFFICIAL ALUMNI PORTAL</span>
      </div>

      <h1 class="hero-title tracking-tight">
        Where Graduates <span class="text-gradient">Reconnect, Mentor, and Grow</span> Together
      </h1>

      <p class="hero-subtitle">
        A verified academic and career network uniting alumni, industry leaders, and students worldwide.
      </p>

      <!-- Actionable Central Search Bar -->
      <div class="search-box-wrapper" id="search">
        <div class="search-bar">
          <span class="search-icon">🔍</span>
          <input 
            type="text" 
            id="globalSearchInput" 
            class="search-input" 
            placeholder="Search alumni by name, graduation year, department, or company..." 
            autocomplete="off"
            aria-label="Search alumni network"
          />
          <kbd class="search-badge font-mono">⌘K</kbd>
        </div>
      </div>

      <!-- Live Network Key Metrics Bar -->
      <div class="metrics-bar-grid">
        <a href="/users" class="metric-card">
          <div class="metric-num highlight">${userCount}</div>
          <div class="metric-title">Alumni Directory</div>
          <div class="metric-sub">Verified Alumni</div>
        </a>

        <a href="/job-postings" class="metric-card">
          <div class="metric-num">${jobPostingCount}</div>
          <div class="metric-title">Career Opportunities</div>
          <div class="metric-sub">Active Job Postings</div>
        </a>

        <a href="/announcements" class="metric-card">
          <div class="metric-num highlight">${announcementCount}</div>
          <div class="metric-title">Announcements Board</div>
          <div class="metric-sub">Institutional Updates</div>
        </a>

        <a href="/applications" class="metric-card">
          <div class="metric-num">${applicationCount}</div>
          <div class="metric-title">Application Tracking</div>
          <div class="metric-sub">Applications Tracked</div>
        </a>
      </div>

      <!-- Hero Call-to-Actions -->
      <div class="hero-actions">
        <a href="/users" class="btn-pill-primary">
          <span>Explore Alumni Directory</span>
          <span>&rarr;</span>
        </a>
        <a href="/job-postings#post-job" class="btn-pill-secondary">
          <span>+ Post Opportunity</span>
        </a>
      </div>
    </div>
  </section>

  <!-- ========================================================
   * SECTION 2: BENTO QUICK-ACCESS GRID
   * ======================================================== -->
  <section class="bento-section">
    <div class="bento-container">
      <div class="section-framing">
        <div class="eyebrow-badge">
          <span class="eyebrow-dot"></span>
          <span>EXPLORE THE PLATFORM</span>
        </div>
        <h2 class="section-heading-lg tracking-tight">
          Everything You Need to <span class="text-gradient">Stay Connected</span>
        </h2>
        <p class="section-subtext">
          Fast access to core platform services, directory lookups, and career acceleration tools.
        </p>
      </div>

      <div class="bento-grid">
        <!-- Card 1: Browse Directory -->
        <article class="bento-card standard-card">
          <div class="bento-card-top">
            <div class="bento-tag-bar">
              <span class="bento-tag">COMMUNITY</span>
            </div>
            <div class="bento-icon-wrap">👥</div>
            <h3 class="bento-card-title">Browse Directory</h3>
            <p class="bento-card-desc">
              Search, filter, and connect with verified graduates across departments, industries, and graduation classes worldwide.
            </p>
          </div>
          <a href="/users" class="bento-card-action">
            <span>Explore Directory</span>
            <span>&rarr;</span>
          </a>
        </article>

        <!-- Card 2: Update Your Profile -->
        <article class="bento-card standard-card">
          <div class="bento-card-top">
            <div class="bento-tag-bar">
              <span class="bento-tag">MEMBERSHIP</span>
            </div>
            <div class="bento-icon-wrap">👤</div>
            <h3 class="bento-card-title">Update Your Profile</h3>
            <p class="bento-card-desc">
              Keep your career trajectory, industry milestones, mentorship availability, and networking preferences up to date.
            </p>
          </div>
          <a href="/profile" class="bento-card-action">
            <span>Manage Profile</span>
            <span>&rarr;</span>
          </a>
        </article>

        <!-- Card 3: Events & Community -->
        <article class="bento-card standard-card">
          <div class="bento-card-top">
            <div class="bento-tag-bar">
              <span class="bento-tag">CAMPUS LIFE</span>
            </div>
            <div class="bento-icon-wrap">📢</div>
            <h3 class="bento-card-title">Events &amp; Community</h3>
            <p class="bento-card-desc">
              Stay informed with institutional summits, alumni reunions, workshops, and official updates like <em>${this.escapeHtml(firstAnnouncement.title)}</em>.
            </p>
          </div>
          <a href="/announcements" class="bento-card-action">
            <span>View Announcements</span>
            <span>&rarr;</span>
          </a>
        </article>

        <!-- Card 4: Conditionally Admin Dashboard (admin) or Career Opportunities (non-admin) -->
        ${isAdmin ? `
        <article class="bento-card admin-card">
          <div class="bento-card-top">
            <div class="bento-tag-bar">
              <span class="bento-tag" style="background:#eff6ff; color:#1d4ed8; border-color:#dbeafe;">ADMINISTRATION</span>
            </div>
            <div class="bento-icon-wrap" style="background:#eff6ff; border-color:#dbeafe;">🛡️</div>
            <h3 class="bento-card-title">Admin Dashboard</h3>
            <p class="bento-card-desc">
              Manage verified member accounts, enforce role-based access, search directory records, and oversee platform health.
            </p>
          </div>
          <a href="/admin" class="bento-card-action" style="color:#1d4ed8;">
            <span>Open Admin Panel</span>
            <span>&rarr;</span>
          </a>
        </article>` : `
        <article class="bento-card standard-card">
          <div class="bento-card-top">
            <div class="bento-tag-bar">
              <span class="bento-tag">CAREERS</span>
            </div>
            <div class="bento-icon-wrap">💼</div>
            <h3 class="bento-card-title">Career Opportunities</h3>
            <p class="bento-card-desc">
              Discover exclusive job openings, internships, and executive positions shared by alumni employers at companies like ${this.escapeHtml(firstJob.company)}.
            </p>
          </div>
          <a href="/job-postings" class="bento-card-action">
            <span>Explore Opportunities</span>
            <span>&rarr;</span>
          </a>
        </article>`}
      </div>
    </div>
  </section>

  <!-- ========================================================
   * SECTION 3: FEATURED / RECENT ALUMNI SPOTLIGHT
   * ======================================================== -->
  <section class="spotlight-section">
    <div class="spotlight-container">
      <div class="section-framing">
        <div class="eyebrow-badge">
          <span class="eyebrow-dot"></span>
          <span>COMMUNITY SPOTLIGHT</span>
        </div>
        <h2 class="section-heading-lg tracking-tight">
          Meet the Minds Behind Our <span class="text-gradient">Growing Network</span>
        </h2>
        <p class="section-subtext">
          Celebrating recent graduates and distinguished alumni driving innovation across global industries.
        </p>
      </div>

      <div class="spotlight-grid" id="alumniSpotlightGrid">
        ${recentUsers.map(u => `
        <article class="alumni-card" data-search-term="${this.escapeHtml((u.name || '') + ' ' + (u.department || '') + ' ' + (u.company || '') + ' ' + (u.currentRole || '')).toLowerCase()}">
          <div>
            <div class="alumni-header">
              <div class="alumni-avatar">🎓</div>
              <div>
                <h3 class="alumni-name">${this.escapeHtml(u.name)}</h3>
                <div style="font-size:12px; color:var(--ink-subtle);">${this.escapeHtml(u.department || 'General Alumni')}</div>
              </div>
            </div>

            <div class="alumni-badges-row">
              <span class="alumni-badge-pill grad-year">Class of ${this.escapeHtml(u.graduationYear || '2024')}</span>
              <span class="alumni-badge-pill">Verified Alumnus</span>
            </div>

            <p class="alumni-role-info">
              <span class="alumni-role-company">${this.escapeHtml(u.currentRole || 'Professional')}</span> · ${this.escapeHtml(u.company || 'Alumni Network')}
            </p>
          </div>

          <div class="alumni-card-footer">
            <span style="font-size:12px; color:var(--ink-subtle);">Active Member</span>
            <a href="/users" class="alumni-action-link">
              <span>View Profile</span>
              <span>&rarr;</span>
            </a>
          </div>
        </article>
        `).join('')}
      </div>
    </div>
  </section>

  <!-- ========================================================
   * SECTION 4: CALL-TO-ACTION FOOTER BANNER
   * ======================================================== -->
  <section class="cta-section">
    <div class="cta-container">
      <div class="cta-card">
        <div class="cta-inner">
          <div class="cta-eyebrow">
            <span>✦</span>
            <span>JOIN THE MOVEMENT</span>
          </div>
          <h2 class="cta-heading tracking-tight">
            Empower Your Career and Inspire the Next Generation
          </h2>
          <p class="cta-subtext">
            Join thousands of verified alumni worldwide. Share your journey, mentor aspiring graduates, and discover unlisted career opportunities.
          </p>
          <div class="cta-buttons">
            ${isAuthenticated ? `
              <a href="/profile" class="btn-cta-primary">Update Your Profile &rarr;</a>
              <a href="/users" class="btn-cta-secondary">Explore Alumni Directory</a>
            ` : `
              <a href="/register" class="btn-cta-primary">Create Your Account &rarr;</a>
              <a href="/login" class="btn-cta-secondary">Log In to Portal</a>
            `}
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Standard Mintlify Footer -->
  ${sharedLayout.renderFooter()}

  <!-- Client-side Interactive Search & Shortcut Controller -->
  <script>
    (function() {
      const searchInput = document.getElementById('globalSearchInput');
      const cards = document.querySelectorAll('#alumniSpotlightGrid .alumni-card');

      if (searchInput) {
        searchInput.addEventListener('input', function() {
          const q = this.value.toLowerCase().trim();
          cards.forEach(card => {
            const text = card.getAttribute('data-search-term') || '';
            card.style.display = (!q || text.includes(q)) ? 'flex' : 'none';
          });
        });

        searchInput.addEventListener('keydown', function(e) {
          if (e.key === 'Enter') {
            const q = this.value.trim();
            if (q) {
              window.location.href = '/users?q=' + encodeURIComponent(q);
            }
          }
        });
      }

      // Cmd+K / Ctrl+K listener
      window.addEventListener('keydown', function(e) {
        if ((e.ctrlKey || e.metaKey) && (e.key === 'k' || e.key === 'K')) {
          e.preventDefault();
          if (searchInput) {
            searchInput.focus();
            searchInput.select();
          }
        }
      });
    })();
  </script>
</body>
</html>`;
  }
};

module.exports = homeView;
