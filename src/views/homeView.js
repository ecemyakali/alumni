/**
 * Homepage View
 * File: src/views/homeView.js
 * 
 * Provides a responsive, professional Homepage presentation for the Alumni Tracking System.
 */

function escapeHtml(str) {
  if (!str) return '';
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
   * @param {Object} [options={}]
   * @returns {string} Formatted HTML document
   */
  renderHomePage(data = {}, options = {}) {
    const userCount = data.userCount ?? 0;
    const jobPostingCount = data.jobPostingCount ?? 0;
    const announcementCount = data.announcementCount ?? 0;
    const applicationCount = data.applicationCount ?? 0;
    const recentAnnouncements = data.recentAnnouncements || [];
    const recentJobPostings = data.recentJobPostings || [];

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Alumni Tracking System — Empowering Graduate Connections & Careers</title>
  <style>
    :root {
      --primary: #2563eb;
      --primary-dark: #1d4ed8;
      --primary-light: #eff6ff;
      --secondary: #0f172a;
      --accent: #3b82f6;
      --success: #16a34a;
      --warning: #d97706;
      --danger: #dc2626;
      --text: #0f172a;
      --text-muted: #64748b;
      --bg: #f8fafc;
      --card-bg: #ffffff;
      --border: #e2e8f0;
      --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
      --shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.08), 0 2px 4px -2px rgba(0, 0, 0, 0.04);
      --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.05);
      --radius: 12px;
    }

    * { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      background-color: var(--bg);
      color: var(--text);
      line-height: 1.6;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    }

    /* TOP NAVBAR */
    .navbar {
      background: var(--card-bg);
      border-bottom: 1px solid var(--border);
      position: sticky;
      top: 0;
      z-index: 100;
      box-shadow: var(--shadow-sm);
    }
    .nav-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0.875rem 1.5rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
      flex-wrap: wrap;
    }
    .brand {
      display: flex;
      align-items: center;
      gap: 0.6rem;
      text-decoration: none;
      color: var(--secondary);
      font-weight: 700;
      font-size: 1.25rem;
      letter-spacing: -0.02em;
    }
    .brand-icon {
      font-size: 1.5rem;
      background: var(--primary-light);
      padding: 0.35rem 0.5rem;
      border-radius: 8px;
    }
    .nav-menu {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      list-style: none;
      flex-wrap: wrap;
    }
    .nav-link {
      text-decoration: none;
      color: var(--text-muted);
      font-weight: 600;
      font-size: 0.925rem;
      padding: 0.5rem 0.85rem;
      border-radius: 6px;
      transition: all 0.15s ease-in-out;
    }
    .nav-link:hover {
      color: var(--primary);
      background: var(--primary-light);
    }
    .nav-btn-primary {
      background: var(--primary);
      color: #ffffff !important;
      padding: 0.5rem 1.1rem;
      border-radius: 6px;
      font-weight: 600;
      text-decoration: none;
      font-size: 0.925rem;
      transition: background 0.15s ease;
    }
    .nav-btn-primary:hover {
      background: var(--primary-dark);
    }

    /* MAIN CONTAINER */
    .main-content {
      flex: 1;
      max-width: 1200px;
      width: 100%;
      margin: 0 auto;
      padding: 2.5rem 1.5rem;
    }

    /* HERO SECTION */
    .hero {
      background: linear-gradient(135deg, #1e3a8a 0%, #2563eb 60%, #3b82f6 100%);
      color: #ffffff;
      border-radius: 20px;
      padding: 3.5rem 2.5rem;
      margin-bottom: 2.5rem;
      box-shadow: var(--shadow-lg);
      position: relative;
      overflow: hidden;
    }
    .hero::after {
      content: "";
      position: absolute;
      top: -50%;
      right: -10%;
      width: 400px;
      height: 400px;
      background: radial-gradient(circle, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0) 70%);
      border-radius: 50%;
      pointer-events: none;
    }
    .hero-badge {
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      background: rgba(255, 255, 255, 0.18);
      backdrop-filter: blur(8px);
      padding: 0.35rem 0.85rem;
      border-radius: 999px;
      font-size: 0.85rem;
      font-weight: 600;
      margin-bottom: 1.25rem;
      border: 1px solid rgba(255, 255, 255, 0.25);
    }
    .hero-title {
      font-size: 2.5rem;
      font-weight: 800;
      line-height: 1.2;
      margin-bottom: 1rem;
      letter-spacing: -0.025em;
    }
    .hero-subtitle {
      font-size: 1.125rem;
      line-height: 1.6;
      max-width: 680px;
      margin-bottom: 2rem;
      color: #e0e7ff;
    }
    .hero-actions {
      display: flex;
      gap: 1rem;
      flex-wrap: wrap;
    }
    .btn-hero-primary {
      background: #ffffff;
      color: var(--primary);
      padding: 0.85rem 1.75rem;
      border-radius: 8px;
      font-weight: 700;
      text-decoration: none;
      font-size: 1rem;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      transition: transform 0.15s ease, box-shadow 0.15s ease;
    }
    .btn-hero-primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
    }
    .btn-hero-secondary {
      background: rgba(255, 255, 255, 0.15);
      color: #ffffff;
      padding: 0.85rem 1.75rem;
      border-radius: 8px;
      font-weight: 600;
      text-decoration: none;
      font-size: 1rem;
      border: 1px solid rgba(255, 255, 255, 0.3);
      transition: background 0.15s ease;
    }
    .btn-hero-secondary:hover {
      background: rgba(255, 255, 255, 0.25);
    }

    /* STATS COUNTER STRIP */
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 1.25rem;
      margin-bottom: 3rem;
    }
    .stat-card {
      background: var(--card-bg);
      border: 1px solid var(--border);
      border-radius: var(--radius);
      padding: 1.5rem;
      display: flex;
      align-items: center;
      gap: 1.25rem;
      box-shadow: var(--shadow-sm);
      transition: transform 0.15s ease, box-shadow 0.15s ease;
    }
    .stat-card:hover {
      transform: translateY(-3px);
      box-shadow: var(--shadow);
    }
    .stat-icon {
      font-size: 2rem;
      background: var(--primary-light);
      padding: 0.75rem;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      min-width: 60px;
      min-height: 60px;
    }
    .stat-number {
      font-size: 2rem;
      font-weight: 800;
      color: var(--secondary);
      line-height: 1;
      margin-bottom: 0.25rem;
    }
    .stat-label {
      font-size: 0.875rem;
      color: var(--text-muted);
      font-weight: 600;
    }

    /* SECTION TITLES */
    .section-header {
      margin-bottom: 1.5rem;
    }
    .section-title {
      font-size: 1.5rem;
      font-weight: 700;
      color: var(--secondary);
      margin-bottom: 0.35rem;
    }
    .section-desc {
      color: var(--text-muted);
      font-size: 0.95rem;
    }

    /* MODULES FEATURE CARDS */
    .modules-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
      gap: 1.5rem;
      margin-bottom: 3rem;
    }
    .module-card {
      background: var(--card-bg);
      border: 1px solid var(--border);
      border-radius: var(--radius);
      padding: 1.75rem;
      box-shadow: var(--shadow-sm);
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
    }
    .module-card:hover {
      transform: translateY(-4px);
      box-shadow: var(--shadow-lg);
      border-color: var(--accent);
    }
    .module-header {
      display: flex;
      align-items: center;
      gap: 0.85rem;
      margin-bottom: 1rem;
    }
    .module-icon {
      font-size: 1.75rem;
      background: var(--primary-light);
      padding: 0.5rem;
      border-radius: 10px;
    }
    .module-title {
      font-size: 1.25rem;
      font-weight: 700;
      color: var(--secondary);
    }
    .module-body {
      color: var(--text-muted);
      font-size: 0.95rem;
      margin-bottom: 1.5rem;
      line-height: 1.55;
    }
    .module-footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-top: 1px solid var(--border);
      padding-top: 1rem;
    }
    .module-link {
      color: var(--primary);
      text-decoration: none;
      font-weight: 600;
      font-size: 0.925rem;
      display: inline-flex;
      align-items: center;
      gap: 0.35rem;
    }
    .module-link:hover {
      text-decoration: underline;
    }
    .badge-feature {
      font-size: 0.75rem;
      font-weight: 600;
      background: #f1f5f9;
      color: #475569;
      padding: 0.25rem 0.6rem;
      border-radius: 6px;
    }

    /* RECENT ACTIVITY DUAL COLUMN */
    .activity-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
      gap: 1.5rem;
      margin-bottom: 3rem;
    }
    .activity-card {
      background: var(--card-bg);
      border: 1px solid var(--border);
      border-radius: var(--radius);
      padding: 1.5rem;
      box-shadow: var(--shadow-sm);
    }
    .activity-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 2px solid var(--border);
      padding-bottom: 0.75rem;
      margin-bottom: 1rem;
    }
    .activity-title {
      font-size: 1.15rem;
      font-weight: 700;
      color: var(--secondary);
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    .activity-view-all {
      font-size: 0.85rem;
      font-weight: 600;
      color: var(--primary);
      text-decoration: none;
    }
    .activity-view-all:hover {
      text-decoration: underline;
    }
    .activity-item {
      padding: 0.85rem 0;
      border-bottom: 1px solid var(--border);
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
    }
    .activity-item:last-child {
      border-bottom: none;
      padding-bottom: 0;
    }
    .activity-item-title {
      font-weight: 600;
      font-size: 0.95rem;
      color: var(--text);
      text-decoration: none;
    }
    .activity-item-title:hover {
      color: var(--primary);
    }
    .activity-item-sub {
      font-size: 0.825rem;
      color: var(--text-muted);
      margin-top: 0.15rem;
    }
    .badge-pill {
      font-size: 0.75rem;
      font-weight: 600;
      padding: 0.25rem 0.65rem;
      border-radius: 999px;
      background: var(--primary-light);
      color: var(--primary);
      white-space: nowrap;
    }

    /* FOOTER */
    .footer {
      background: #0f172a;
      color: #94a3b8;
      padding: 3rem 1.5rem 2rem;
      margin-top: auto;
      border-top: 1px solid #1e293b;
    }
    .footer-container {
      max-width: 1200px;
      margin: 0 auto;
      display: grid;
      grid-template-columns: 2fr 1fr 1fr;
      gap: 2rem;
      margin-bottom: 2rem;
    }
    @media (max-width: 768px) {
      .footer-container { grid-template-columns: 1fr; }
      .hero-title { font-size: 1.875rem; }
      .activity-grid { grid-template-columns: 1fr; }
    }
    .footer-brand {
      color: #ffffff;
      font-weight: 700;
      font-size: 1.25rem;
      margin-bottom: 0.75rem;
    }
    .footer-desc {
      font-size: 0.9rem;
      line-height: 1.6;
      max-width: 400px;
    }
    .footer-heading {
      color: #ffffff;
      font-size: 0.95rem;
      font-weight: 600;
      margin-bottom: 1rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    .footer-links {
      list-style: none;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
    .footer-links a {
      color: #94a3b8;
      text-decoration: none;
      font-size: 0.9rem;
      transition: color 0.15s;
    }
    .footer-links a:hover {
      color: #ffffff;
    }
    .footer-bottom {
      max-width: 1200px;
      margin: 0 auto;
      padding-top: 1.5rem;
      border-top: 1px solid #1e293b;
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 0.85rem;
      flex-wrap: wrap;
      gap: 0.75rem;
    }
    .tech-pill {
      display: inline-block;
      background: #1e293b;
      color: #cbd5e1;
      padding: 0.2rem 0.5rem;
      border-radius: 4px;
      font-size: 0.75rem;
      margin-left: 0.25rem;
    }
  </style>
</head>
<body>

  <!-- TOP NAVBAR -->
  <nav class="navbar">
    <div class="nav-container">
      <a href="/main" class="brand">
        <span class="brand-icon">🎓</span>
        <span>Alumni Tracking System</span>
      </a>
      <ul class="nav-menu">
        <li><a href="/users" class="nav-link">👥 Alumni Directory</a></li>
        <li><a href="/job-postings" class="nav-link">💼 Career Board</a></li>
        <li><a href="/announcements" class="nav-link">📢 Announcements</a></li>
        <li><a href="/applications" class="nav-link">📝 Applications</a></li>
        <li><a href="/api/swagger" class="nav-link">📑 API Docs</a></li>
        <li><a href="/api/health" class="nav-link">🩺 Health</a></li>
        <li><a href="/job-postings" class="nav-btn-primary">+ Post Opportunity</a></li>
      </ul>
    </div>
  </nav>

  <!-- MAIN HOMEPAGE CONTENT -->
  <main class="main-content">

    <!-- HERO SECTION -->
    <section class="hero">
      <div class="hero-badge">
        <span>🌟</span>
        <span>Official University Alumni & Career Network</span>
      </div>
      <h1 class="hero-title">Connecting Graduates, Empowering Careers</h1>
      <p class="hero-subtitle">
        A modern, unified portal designed to bridge academic institutions, alumni, and industry leaders through professional networking, career opportunities, and institutional announcements.
      </p>
      <div class="hero-actions">
        <a href="/users" class="btn-hero-primary">Explore Alumni Directory →</a>
        <a href="/job-postings" class="btn-hero-secondary">Browse Career Board</a>
        <a href="/announcements" class="btn-hero-secondary">View Announcements</a>
      </div>
    </section>

    <!-- LIVE METRICS COUNTER STRIP -->
    <section class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon">👥</div>
        <div>
          <div class="stat-number">${userCount}</div>
          <div class="stat-label">Registered Alumni</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">💼</div>
        <div>
          <div class="stat-number">${jobPostingCount}</div>
          <div class="stat-label">Career Postings</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">📢</div>
        <div>
          <div class="stat-number">${announcementCount}</div>
          <div class="stat-label">Announcements</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">📝</div>
        <div>
          <div class="stat-number">${applicationCount}</div>
          <div class="stat-label">Applications Filed</div>
        </div>
      </div>
    </section>

    <!-- CORE PLATFORM MODULES -->
    <section>
      <div class="section-header">
        <h2 class="section-title">Core Platform Modules</h2>
        <p class="section-desc">Access centralized services built on an MVC architecture with dual REST API and Web interfaces.</p>
      </div>

      <div class="modules-grid">
        <!-- Module 1: Alumni Directory -->
        <div class="module-card">
          <div>
            <div class="module-header">
              <span class="module-icon">👥</span>
              <h3 class="module-title">Alumni Directory</h3>
            </div>
            <p class="module-body">
              Discover fellow graduates across engineering, business, and science departments. Maintain your profile, update career milestones, and connect with peers.
            </p>
          </div>
          <div class="module-footer">
            <a href="/users" class="module-link">Open Directory →</a>
            <span class="badge-feature">MVC Web + REST</span>
          </div>
        </div>

        <!-- Module 2: Career Opportunities -->
        <div class="module-card">
          <div>
            <div class="module-header">
              <span class="module-icon">💼</span>
              <h3 class="module-title">Career Opportunities</h3>
            </div>
            <p class="module-body">
              Browse curated full-time, remote, and internship job offers. Recruit talent by posting openings with role requirements, salary estimates, and contact channels.
            </p>
          </div>
          <div class="module-footer">
            <a href="/job-postings" class="module-link">Explore Careers →</a>
            <span class="badge-feature">Job Board</span>
          </div>
        </div>

        <!-- Module 3: Announcements -->
        <div class="module-card">
          <div>
            <div class="module-header">
              <span class="module-icon">📢</span>
              <h3 class="module-title">Announcements Board</h3>
            </div>
            <p class="module-body">
              Stay informed on campus reunions, career workshops, guest lectures, and institutional news categorized with high, normal, and low priority indicators.
            </p>
          </div>
          <div class="module-footer">
            <a href="/announcements" class="module-link">View Board →</a>
            <span class="badge-feature">Campus News</span>
          </div>
        </div>

        <!-- Module 4: Application Tracking -->
        <div class="module-card">
          <div>
            <div class="module-header">
              <span class="module-icon">📝</span>
              <h3 class="module-title">Application Tracking</h3>
            </div>
            <p class="module-body">
              Manage the end-to-end job application lifecycle linking alumni to postings. Submit resume URLs, attach cover notes, and monitor review statuses.
            </p>
          </div>
          <div class="module-footer">
            <a href="/applications" class="module-link">Track Applications →</a>
            <span class="badge-feature">Action Table (M:N)</span>
          </div>
        </div>

        <!-- Module 5: OpenAPI / Swagger Docs -->
        <div class="module-card">
          <div>
            <div class="module-header">
              <span class="module-icon">📑</span>
              <h3 class="module-title">Developer API Docs</h3>
            </div>
            <p class="module-body">
              Explore interactive Swagger UI OpenAPI 3.0 specifications. Test endpoints directly, review request/response schemas, and build programmatic integrations.
            </p>
          </div>
          <div class="module-footer">
            <a href="/api/swagger" class="module-link">Launch Swagger UI →</a>
            <span class="badge-feature">OpenAPI 3.0</span>
          </div>
        </div>

        <!-- Module 6: System Health & Diagnostics -->
        <div class="module-card">
          <div>
            <div class="module-header">
              <span class="module-icon">🩺</span>
              <h3 class="module-title">System Diagnostics</h3>
            </div>
            <p class="module-body">
              Real-time monitoring of application uptime, PostgreSQL database connection pool health, server metrics, and error guardian middleware status.
            </p>
          </div>
          <div class="module-footer">
            <a href="/api/health" class="module-link">Check Status →</a>
            <span class="badge-feature">Live Health</span>
          </div>
        </div>
      </div>
    </section>

    <!-- RECENT ACTIVITY SECTION -->
    <section class="activity-grid">
      <!-- Recent Announcements -->
      <div class="activity-card">
        <div class="activity-header">
          <div class="activity-title">
            <span>📢</span>
            <span>Latest Announcements</span>
          </div>
          <a href="/announcements" class="activity-view-all">View All →</a>
        </div>
        ${recentAnnouncements.length > 0
          ? recentAnnouncements.slice(0, 3).map(a => `
            <div class="activity-item">
              <div>
                <a href="/announcements/${a.id}" class="activity-item-title">${escapeHtml(a.title)}</a>
                <div class="activity-item-sub">By ${escapeHtml(a.author || 'Alumni Office')} • ${escapeHtml(a.category || 'General')}</div>
              </div>
              <span class="badge-pill">${escapeHtml(a.priority || 'Normal')}</span>
            </div>
          `).join('')
          : `<div style="color:var(--text-muted); font-size:0.9rem; padding:1rem 0;">No announcements published yet. Visit <a href="/announcements" style="color:var(--primary);">Announcements Board</a> to publish one!</div>`
        }
      </div>

      <!-- Recent Job Postings -->
      <div class="activity-card">
        <div class="activity-header">
          <div class="activity-title">
            <span>💼</span>
            <span>Featured Careers</span>
          </div>
          <a href="/job-postings" class="activity-view-all">View All →</a>
        </div>
        ${recentJobPostings.length > 0
          ? recentJobPostings.slice(0, 3).map(j => `
            <div class="activity-item">
              <div>
                <a href="/job-postings/${j.id}" class="activity-item-title">${escapeHtml(j.title)}</a>
                <div class="activity-item-sub">${escapeHtml(j.company)} • ${escapeHtml(j.city || j.location || 'Remote')}</div>
              </div>
              <span class="badge-pill">${escapeHtml(j.type || 'Full-time')}</span>
            </div>
          `).join('')
          : `<div style="color:var(--text-muted); font-size:0.9rem; padding:1rem 0;">No job postings available yet. Visit <a href="/job-postings" style="color:var(--primary);">Career Opportunities</a> to create one!</div>`
        }
      </div>
    </section>

  </main>

  <!-- FOOTER -->
  <footer class="footer">
    <div class="footer-container">
      <div>
        <div class="footer-brand">🎓 Alumni Tracking System</div>
        <p class="footer-desc">
          A modern, scalable alumni platform connecting graduates and academic institutions through career networking, opportunities, and campus events.
        </p>
      </div>
      <div>
        <div class="footer-heading">Navigation</div>
        <ul class="footer-links">
          <li><a href="/main">Home</a></li>
          <li><a href="/users">Alumni Directory</a></li>
          <li><a href="/job-postings">Career Board</a></li>
          <li><a href="/announcements">Announcements</a></li>
          <li><a href="/applications">Applications</a></li>
        </ul>
      </div>
      <div>
        <div class="footer-heading">Developer API</div>
        <ul class="footer-links">
          <li><a href="/api/swagger">Swagger UI</a></li>
          <li><a href="/api/swagger.json">OpenAPI 3.0 Spec</a></li>
          <li><a href="/api/health">System Health</a></li>
          <li><a href="/404">404 Guardian</a></li>
        </ul>
      </div>
    </div>
    <div class="footer-bottom">
      <div>© 2026 Alumni Tracking System. All rights reserved.</div>
      <div>
        Built with: 
        <span class="tech-pill">Node.js</span>
        <span class="tech-pill">Express</span>
        <span class="tech-pill">PostgreSQL</span>
        <span class="tech-pill">Docker</span>
      </div>
    </div>
  </footer>

</body>
</html>`;
  }
};

module.exports = homeView;
