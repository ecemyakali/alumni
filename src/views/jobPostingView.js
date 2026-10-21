/**
 * ========================================================
 * View Layer: JobPosting View (JobPostingView)
 * File: src/views/jobPostingView.js
 * ========================================================
 * 
 * Dedicated View Layer for Career & Job Opportunities management.
 * Generates semantic, responsive, interactive HTML views for:
 * 1. READ ALL & CREATE: Career Board, metrics, filter, & posting form (GET /job-postings)
 * 2. READ ONE: Full job posting detail view with inline "Quick Apply" & applications received (GET /job-postings/:id)
 * 3. UPDATE: Pre-filled job posting edit form (GET /job-postings/:id/edit)
 * 4. DELETE: Row-level form delete actions with confirmation
 * 5. ERRORS: Semantic 400 and 404 pages
 */

const jobPostingView = {
  /**
   * Escape HTML utility to prevent XSS
   */
  escapeHtml(str) {
    if (str === null || str === undefined) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  },

  /**
   * Global Navigation Header
   */
  renderNavbar(activePage = 'jobs') {
    return `
    <nav class="top-navbar">
      <div class="nav-brand">
        <span class="brand-icon">🎓</span>
        <span class="brand-title">Alumni Tracking System</span>
      </div>
      <div class="nav-links">
        <a href="/users" class="nav-item ${activePage === 'users' ? 'active' : ''}">👥 Alumni Directory</a>
        <a href="/announcements" class="nav-item ${activePage === 'announcements' ? 'active' : ''}">📢 Announcements</a>
        <a href="/job-postings" class="nav-item ${activePage === 'jobs' ? 'active' : ''}">💼 Career Opportunities</a>
        <a href="/applications" class="nav-item ${activePage === 'applications' ? 'active' : ''}">📝 Job Applications</a>
        <a href="/api/swagger" target="_blank" class="nav-item nav-badge">📘 Swagger API</a>
      </div>
    </nav>
    `;
  },

  /**
   * Renders the complete HTML Job Postings Board page
   * 
   * @param {Array<Object>} jobPostings - List of job posting models
   * @param {Object} [options] - Options (successMessage, errorMessage, applications)
   * @returns {string} Formatted HTML document
   */
  renderJobPostingsList(jobPostings = [], options = {}) {
    const { successMessage = null, errorMessage = null, applications = [] } = options;

    const totalJobs = jobPostings.length;
    const fullTimeCount = jobPostings.filter(j => (j.type || '').toLowerCase() === 'full-time').length;
    const remoteCount = jobPostings.filter(j => (j.location || '').toLowerCase().includes('remote') || (j.type || '').toLowerCase() === 'remote').length;
    const appCount = applications.length;

    const rows = jobPostings.length > 0
      ? jobPostings.map(j => {
        const typeClass = `badge-type-${(j.type || 'full-time').toLowerCase().replace(/\s+/g, '-')}`;
        return `
        <tr class="job-row" data-type="${this.escapeHtml(j.type || 'full-time').toLowerCase()}" data-text="${this.escapeHtml((j.title + ' ' + j.company + ' ' + (j.location || '') + ' ' + (j.requirements || '')).toLowerCase())}">
          <td><span class="badge badge-id">#${j.id}</span></td>
          <td>
            <a href="/job-postings/${j.id}" class="title-link">
              <strong>${this.escapeHtml(j.title)}</strong>
            </a>
            <div class="company-subtext">🏢 ${this.escapeHtml(j.company)}</div>
          </td>
          <td><span class="badge badge-location">📍 ${this.escapeHtml(j.location || 'Remote')}</span></td>
          <td><span class="badge ${typeClass}">${this.escapeHtml(j.type || 'full-time')}</span></td>
          <td><span class="salary-tag">${this.escapeHtml(j.salary || 'Competitive')}</span></td>
          <td class="action-cell">
            <a href="/job-postings/${j.id}" class="btn-sm btn-view">View</a>
            <a href="/applications?jobPostingId=${j.id}" class="btn-sm btn-apply" title="Apply for this role">Apply</a>
            <a href="/job-postings/${j.id}/edit" class="btn-sm btn-edit">Edit</a>
            <form method="POST" action="/job-postings/${j.id}/delete" style="display:inline;" onsubmit="return confirm('Delete job posting #${j.id}?');">
              <button type="submit" class="btn-sm btn-delete">Delete</button>
            </form>
          </td>
        </tr>
      `;
      }).join('')
      : `<tr><td colspan="6" class="text-center text-muted py-4">No job opportunities posted yet. Use the form below to share an opportunity!</td></tr>`;

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Career Opportunities - Alumni Tracking System</title>
  <style>
    :root {
      --primary: #2563eb;
      --primary-hover: #1d4ed8;
      --success: #16a34a;
      --danger: #dc2626;
      --warning: #d97706;
      --bg: #f8fafc;
      --card-bg: #ffffff;
      --text: #0f172a;
      --text-muted: #64748b;
      --border: #e2e8f0;
      --font: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: var(--font);
      background: var(--bg);
      color: var(--text);
      line-height: 1.5;
    }
    .top-navbar {
      background: #ffffff;
      border-bottom: 1px solid var(--border);
      padding: 0.85rem 2rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 1rem;
      position: sticky;
      top: 0;
      z-index: 100;
      box-shadow: 0 1px 2px rgba(0,0,0,0.03);
    }
    .nav-brand { display: flex; align-items: center; gap: 0.6rem; font-weight: 700; font-size: 1.15rem; color: #1e293b; }
    .brand-icon { font-size: 1.35rem; }
    .nav-links { display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap; }
    .nav-item {
      padding: 0.45rem 0.85rem;
      border-radius: 6px;
      color: var(--text-muted);
      text-decoration: none;
      font-size: 0.875rem;
      font-weight: 500;
      transition: all 0.15s ease;
    }
    .nav-item:hover { color: var(--primary); background: #f1f5f9; }
    .nav-item.active { color: var(--primary); background: #eff6ff; font-weight: 600; }
    .nav-badge { background: #e0f2fe; color: #0284c7; }
    .container { max-width: 1180px; margin: 0 auto; padding: 2rem 1rem; }
    .page-header {
      margin-bottom: 1.75rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 1rem;
    }
    h1 { font-size: 1.875rem; font-weight: 700; color: #1e293b; letter-spacing: -0.02em; }
    .header-sub { color: var(--text-muted); font-size: 0.95rem; margin-top: 0.25rem; }
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
      margin-bottom: 2rem;
    }
    .stat-card {
      background: var(--card-bg);
      border: 1px solid var(--border);
      border-radius: 10px;
      padding: 1.25rem 1.5rem;
      box-shadow: 0 1px 3px rgba(0,0,0,0.05);
    }
    .stat-number { font-size: 1.85rem; font-weight: 700; color: #1e293b; line-height: 1; }
    .stat-label { font-size: 0.825rem; text-transform: uppercase; color: var(--text-muted); font-weight: 600; margin-top: 0.4rem; letter-spacing: 0.05em; }
    .filter-panel {
      background: var(--card-bg);
      border: 1px solid var(--border);
      border-radius: 10px;
      padding: 1rem 1.25rem;
      margin-bottom: 1.5rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 1rem;
    }
    .search-box {
      flex: 1;
      min-width: 250px;
      position: relative;
    }
    .search-input {
      width: 100%;
      padding: 0.6rem 1rem 0.6rem 2.25rem;
      border: 1px solid var(--border);
      border-radius: 6px;
      font-size: 0.875rem;
      font-family: inherit;
    }
    .search-icon {
      position: absolute;
      left: 0.75rem;
      top: 50%;
      transform: translateY(-50%);
      color: var(--text-muted);
      font-size: 0.875rem;
    }
    .filter-pills { display: flex; gap: 0.4rem; flex-wrap: wrap; }
    .filter-pill {
      border: 1px solid var(--border);
      background: #ffffff;
      padding: 0.4rem 0.85rem;
      border-radius: 20px;
      font-size: 0.8rem;
      font-weight: 500;
      color: var(--text-muted);
      cursor: pointer;
      transition: all 0.15s ease;
    }
    .filter-pill:hover, .filter-pill.active {
      background: var(--primary);
      color: white;
      border-color: var(--primary);
    }
    .alert {
      padding: 1rem 1.25rem;
      border-radius: 8px;
      margin-bottom: 1.5rem;
      font-weight: 500;
    }
    .alert-success { background: #dcfce7; color: #15803d; border: 1px solid #bbf7d0; }
    .alert-danger { background: #fee2e2; color: #b91c1c; border: 1px solid #fecaca; }
    .card {
      background: var(--card-bg);
      border-radius: 12px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.06);
      border: 1px solid var(--border);
      margin-bottom: 2rem;
      overflow: hidden;
    }
    .card-header {
      padding: 1.25rem 1.5rem;
      background: #f8fafc;
      border-bottom: 1px solid var(--border);
      font-weight: 600;
      color: #334155;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .card-body { padding: 1.5rem; }
    table { width: 100%; border-collapse: collapse; text-align: left; }
    th {
      background: #f8fafc;
      padding: 0.85rem 1rem;
      font-size: 0.75rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--text-muted);
      border-bottom: 1px solid var(--border);
    }
    td { padding: 1rem; border-bottom: 1px solid var(--border); font-size: 0.875rem; vertical-align: middle; }
    tr:hover td { background: #fbfcfe; }
    .title-link { color: #1e293b; text-decoration: none; font-size: 0.95rem; }
    .title-link:hover { color: var(--primary); text-decoration: underline; }
    .company-subtext { font-size: 0.8rem; color: var(--text-muted); margin-top: 0.15rem; }
    .badge {
      display: inline-block;
      padding: 0.25rem 0.6rem;
      border-radius: 9999px;
      font-size: 0.75rem;
      font-weight: 600;
      white-space: nowrap;
    }
    .badge-id { background: #f1f5f9; color: #475569; }
    .badge-location { background: #f3e8ff; color: #7e22ce; }
    .badge-type-full-time { background: #dbeafe; color: #1d4ed8; }
    .badge-type-part-time { background: #e0e7ff; color: #4338ca; }
    .badge-type-internship { background: #fef3c7; color: #b45309; }
    .badge-type-remote { background: #dcfce7; color: #15803d; }
    .badge-type-contract { background: #ffedd5; color: #c2410c; }
    .salary-tag { font-weight: 600; color: #334155; font-size: 0.825rem; }
    .action-cell { white-space: nowrap; }
    .btn-sm {
      display: inline-block;
      padding: 0.35rem 0.65rem;
      border-radius: 6px;
      font-size: 0.75rem;
      font-weight: 600;
      text-decoration: none;
      cursor: pointer;
      border: none;
      margin-right: 0.25rem;
      transition: background-color 0.15s ease;
    }
    .btn-view { background: #e0f2fe; color: #0284c7; }
    .btn-view:hover { background: #bae6fd; }
    .btn-apply { background: #dcfce7; color: #15803d; }
    .btn-apply:hover { background: #bbf7d0; }
    .btn-edit { background: #fef3c7; color: #d97706; }
    .btn-edit:hover { background: #fde68a; }
    .btn-delete { background: #fee2e2; color: #dc2626; }
    .btn-delete:hover { background: #fecaca; }
    .form-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 1.25rem;
      margin-bottom: 1.25rem;
    }
    .form-group { display: flex; flex-direction: column; gap: 0.35rem; }
    .form-group.full-width { grid-column: 1 / -1; }
    label { font-size: 0.875rem; font-weight: 600; color: #334155; }
    input, select, textarea {
      padding: 0.625rem 0.85rem;
      border-radius: 6px;
      border: 1px solid var(--border);
      font-size: 0.875rem;
      font-family: inherit;
    }
    input:focus, select:focus, textarea:focus {
      outline: none;
      border-color: var(--primary);
      box-shadow: 0 0 0 3px rgba(37,99,235,0.12);
    }
    .btn-submit {
      background: var(--primary);
      color: white;
      font-weight: 600;
      padding: 0.75rem 1.75rem;
      border-radius: 6px;
      border: none;
      cursor: pointer;
      font-size: 0.875rem;
      transition: background-color 0.15s ease;
    }
    .btn-submit:hover { background: var(--primary-hover); }
    .text-center { text-align: center; }
    .py-4 { padding-top: 2rem; padding-bottom: 2rem; }
    .text-muted { color: var(--text-muted); }
  </style>
</head>
<body>
  ${this.renderNavbar('jobs')}

  <div class="container">
    <div class="page-header">
      <div>
        <h1>💼 Career Opportunities Board</h1>
        <p class="header-sub">
          Discover and share professional opportunities across the alumni network.
        </p>
      </div>
      <div>
        <a href="#post-job" class="btn-submit" style="text-decoration: none; display: inline-block;">+ Post Opportunity</a>
      </div>
    </div>

    ${successMessage ? `<div class="alert alert-success">${this.escapeHtml(successMessage)}</div>` : ''}
    ${errorMessage ? `<div class="alert alert-danger">${this.escapeHtml(errorMessage)}</div>` : ''}

    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-number">${totalJobs}</div>
        <div class="stat-label">Total Listings</div>
      </div>
      <div class="stat-card">
        <div class="stat-number" style="color: #16a34a;">${remoteCount}</div>
        <div class="stat-label">Remote / Hybrid</div>
      </div>
      <div class="stat-card">
        <div class="stat-number" style="color: #2563eb;">${fullTimeCount}</div>
        <div class="stat-label">Full-Time Roles</div>
      </div>
      <div class="stat-card">
        <div class="stat-number" style="color: #7c3aed;">${appCount}</div>
        <div class="stat-label">Total Applications</div>
      </div>
    </div>

    <div class="filter-panel">
      <div class="search-box">
        <span class="search-icon">🔍</span>
        <input type="text" id="jobSearch" class="search-input" placeholder="Search by title, company, skills, or location...">
      </div>
      <div class="filter-pills">
        <button class="filter-pill active" data-filter="all">All Roles</button>
        <button class="filter-pill" data-filter="full-time">Full-Time</button>
        <button class="filter-pill" data-filter="contract">Contract</button>
        <button class="filter-pill" data-filter="internship">Internship</button>
        <button class="filter-pill" data-filter="remote">Remote</button>
      </div>
    </div>

    <div class="card">
      <div class="card-header">
        <span>Active Career Listings (${totalJobs})</span>
      </div>
      <div style="overflow-x: auto;">
        <table id="jobsTable">
          <thead>
            <tr>
              <th>ID</th>
              <th>Position & Company</th>
              <th>Location</th>
              <th>Type</th>
              <th>Compensation</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            ${rows}
          </tbody>
        </table>
      </div>
    </div>

    <div class="card" id="post-job">
      <div class="card-header">
        Share a New Career Opportunity
      </div>
      <div class="card-body">
        <form method="POST" action="/job-postings">
          <div class="form-grid">
            <div class="form-group">
              <label for="title">Position Title *</label>
              <input type="text" id="title" name="title" required placeholder="e.g. Senior Backend Engineer">
            </div>
            <div class="form-group">
              <label for="company">Company / Organization *</label>
              <input type="text" id="company" name="company" required placeholder="e.g. TechCorp Solutions">
            </div>
            <div class="form-group">
              <label for="location">Location</label>
              <input type="text" id="location" name="location" placeholder="e.g. Remote or Istanbul, Turkey">
            </div>
            <div class="form-group">
              <label for="type">Employment Type</label>
              <select id="type" name="type">
                <option value="full-time" selected>Full-Time</option>
                <option value="part-time">Part-Time</option>
                <option value="contract">Contract</option>
                <option value="internship">Internship</option>
                <option value="remote">Remote</option>
              </select>
            </div>
            <div class="form-group">
              <label for="salary">Compensation / Salary Range</label>
              <input type="text" id="salary" name="salary" placeholder="e.g. $80,000 - $100,000 / Competitive">
            </div>
            <div class="form-group">
              <label for="contactEmail">Contact / Application Email</label>
              <input type="email" id="contactEmail" name="contactEmail" placeholder="e.g. careers@techcorp.com">
            </div>
            <div class="form-group full-width">
              <label for="requirements">Requirements & Skills</label>
              <input type="text" id="requirements" name="requirements" placeholder="e.g. Node.js, Express, PostgreSQL, Docker, Git">
            </div>
            <div class="form-group full-width">
              <label for="description">Role Description *</label>
              <textarea id="description" name="description" rows="4" required placeholder="Describe key responsibilities, team impact, and day-to-day work..."></textarea>
            </div>
          </div>
          <button type="submit" class="btn-submit">Publish Career Opportunity</button>
        </form>
      </div>
    </div>
  </div>

  <script>
    // Client-side interactive job search & filtering
    const searchInput = document.getElementById('jobSearch');
    const filterPills = document.querySelectorAll('.filter-pill');
    const jobRows = document.querySelectorAll('.job-row');

    let currentFilter = 'all';

    function applyFilters() {
      const query = (searchInput ? searchInput.value : '').toLowerCase().trim();
      jobRows.forEach(row => {
        const text = row.getAttribute('data-text') || '';
        const type = row.getAttribute('data-type') || '';
        const matchesQuery = !query || text.includes(query);
        const matchesType = currentFilter === 'all' || type === currentFilter;
        row.style.display = (matchesQuery && matchesType) ? '' : 'none';
      });
    }

    if (searchInput) {
      searchInput.addEventListener('input', applyFilters);
    }

    filterPills.forEach(pill => {
      pill.addEventListener('click', () => {
        filterPills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        currentFilter = pill.getAttribute('data-filter');
        applyFilters();
      });
    });
  </script>
</body>
</html>`;
  },

  /**
   * Renders detailed single Job Opportunity card with inline Quick Apply and received applications
   * 
   * @param {Object} job - JobPosting entity
   * @param {Object} [options] - Options (successMessage, applications, users)
   * @returns {string} Formatted HTML document
   */
  renderJobPostingDetail(job, options = {}) {
    if (!job) return this.renderError('Job posting not found', { statusCode: 404 });
    const { successMessage = null, applications = [], users = [] } = options;
    const typeClass = `badge-type-${(job.type || 'full-time').toLowerCase().replace(/\s+/g, '-')}`;

    const appRows = applications.length > 0
      ? applications.map(app => {
        const statusBadge = `badge-status-${(app.status || 'pending').toLowerCase()}`;
        return `
        <tr>
          <td><span class="badge badge-id">#${app.id}</span></td>
          <td>
            <a href="/users/${app.userId}" style="color: var(--primary); text-decoration: none; font-weight: 600;">
              User #${app.userId}
            </a>
          </td>
          <td><span class="badge ${statusBadge}">${this.escapeHtml(app.status || 'pending')}</span></td>
          <td>
            ${app.resumeUrl ? `<a href="${this.escapeHtml(app.resumeUrl)}" target="_blank" style="color: var(--primary); text-decoration: none;">📄 Resume</a>` : '<span class="text-muted">-</span>'}
          </td>
          <td><small>${this.escapeHtml(app.coverNote || '-')}</small></td>
          <td><small class="text-muted">${app.createdAt ? new Date(app.createdAt).toLocaleDateString() : 'N/A'}</small></td>
          <td>
            <a href="/applications/${app.id}" class="btn-sm btn-view">Review</a>
          </td>
        </tr>
      `;
      }).join('')
      : `<tr><td colspan="7" class="text-center text-muted py-4">No applications received for this position yet. Be the first to apply below!</td></tr>`;

    // Generate options for user select dropdown if available
    const userOptions = users.length > 0
      ? users.map(u => `<option value="${u.id}">${this.escapeHtml(u.name)} (${this.escapeHtml(u.email)}) - #${u.id}</option>`).join('')
      : '';

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${this.escapeHtml(job.title)} at ${this.escapeHtml(job.company)} - Alumni Tracking System</title>
  <style>
    :root {
      --primary: #2563eb;
      --primary-hover: #1d4ed8;
      --bg: #f8fafc;
      --card-bg: #ffffff;
      --text: #0f172a;
      --text-muted: #64748b;
      --border: #e2e8f0;
      --font: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: var(--font);
      background: var(--bg);
      color: var(--text);
      line-height: 1.6;
    }
    .top-navbar {
      background: #ffffff;
      border-bottom: 1px solid var(--border);
      padding: 0.85rem 2rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 1rem;
      position: sticky;
      top: 0;
      z-index: 100;
    }
    .nav-brand { display: flex; align-items: center; gap: 0.6rem; font-weight: 700; font-size: 1.15rem; color: #1e293b; }
    .nav-links { display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap; }
    .nav-item { padding: 0.45rem 0.85rem; border-radius: 6px; color: var(--text-muted); text-decoration: none; font-size: 0.875rem; font-weight: 500; }
    .nav-item:hover { color: var(--primary); background: #f1f5f9; }
    .nav-item.active { color: var(--primary); background: #eff6ff; font-weight: 600; }
    .container { max-width: 900px; margin: 0 auto; padding: 2rem 1rem; }
    .back-nav { margin-bottom: 1.5rem; }
    .back-nav a { color: var(--primary); text-decoration: none; font-weight: 600; font-size: 0.9rem; }
    .back-nav a:hover { text-decoration: underline; }
    .card {
      background: var(--card-bg);
      border-radius: 12px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.06);
      border: 1px solid var(--border);
      padding: 2rem;
      margin-bottom: 2rem;
    }
    .header-section {
      border-bottom: 1px solid var(--border);
      padding-bottom: 1.25rem;
      margin-bottom: 1.5rem;
    }
    h1 { font-size: 1.75rem; color: #1e293b; margin-bottom: 0.5rem; }
    .meta-bar {
      display: flex;
      flex-wrap: wrap;
      gap: 0.75rem;
      align-items: center;
      color: var(--text-muted);
      font-size: 0.875rem;
    }
    .badge {
      display: inline-block;
      padding: 0.25rem 0.6rem;
      border-radius: 9999px;
      font-size: 0.75rem;
      font-weight: 600;
    }
    .badge-id { background: #f1f5f9; color: #475569; }
    .badge-type-full-time { background: #dbeafe; color: #1d4ed8; }
    .badge-type-part-time { background: #e0e7ff; color: #4338ca; }
    .badge-type-internship { background: #fef3c7; color: #b45309; }
    .badge-type-remote { background: #dcfce7; color: #15803d; }
    .badge-type-contract { background: #ffedd5; color: #c2410c; }
    .badge-status-pending { background: #fef3c7; color: #b45309; }
    .badge-status-reviewing { background: #e0f2fe; color: #0369a1; }
    .badge-status-accepted { background: #dcfce7; color: #15803d; }
    .badge-status-rejected { background: #fee2e2; color: #b91c1c; }
    .badge-status-withdrawn { background: #f1f5f9; color: #64748b; }
    .section-title {
      font-size: 1.1rem;
      font-weight: 700;
      color: #334155;
      margin-top: 1.5rem;
      margin-bottom: 0.5rem;
    }
    .content-box {
      background: #f8fafc;
      padding: 1.25rem;
      border-radius: 8px;
      border: 1px solid var(--border);
      white-space: pre-wrap;
      font-size: 0.95rem;
      color: #334155;
    }
    .actions {
      display: flex;
      gap: 0.75rem;
      margin-top: 2rem;
      padding-top: 1.5rem;
      border-top: 1px solid var(--border);
      flex-wrap: wrap;
    }
    .btn {
      padding: 0.6rem 1.25rem;
      border-radius: 6px;
      font-weight: 600;
      text-decoration: none;
      font-size: 0.875rem;
      cursor: pointer;
      border: none;
    }
    .btn-primary { background: var(--primary); color: white; }
    .btn-primary:hover { background: var(--primary-hover); }
    .btn-secondary { background: #f1f5f9; color: #334155; }
    .btn-secondary:hover { background: #e2e8f0; }
    .btn-danger { background: #fee2e2; color: #dc2626; }
    .btn-danger:hover { background: #fecaca; }
    .btn-sm {
      display: inline-block;
      padding: 0.35rem 0.65rem;
      border-radius: 6px;
      font-size: 0.75rem;
      font-weight: 600;
      text-decoration: none;
      cursor: pointer;
      border: none;
    }
    .btn-view { background: #e0f2fe; color: #0284c7; }
    .alert-success { background: #dcfce7; color: #15803d; padding: 1rem; border-radius: 8px; margin-bottom: 1.5rem; border: 1px solid #bbf7d0; font-weight: 500; }
    table { width: 100%; border-collapse: collapse; text-align: left; }
    th {
      background: #f8fafc;
      padding: 0.75rem 1rem;
      font-size: 0.75rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--text-muted);
      border-bottom: 1px solid var(--border);
    }
    td { padding: 0.85rem 1rem; border-bottom: 1px solid var(--border); font-size: 0.875rem; vertical-align: middle; }
    .form-group { margin-bottom: 1rem; display: flex; flex-direction: column; gap: 0.35rem; }
    label { font-size: 0.875rem; font-weight: 600; color: #334155; }
    input, select, textarea {
      padding: 0.625rem 0.75rem;
      border-radius: 6px;
      border: 1px solid var(--border);
      font-size: 0.875rem;
      font-family: inherit;
    }
    input:focus, select:focus, textarea:focus { outline: none; border-color: var(--primary); }
    .btn-submit {
      background: #16a34a;
      color: white;
      font-weight: 600;
      padding: 0.75rem 1.5rem;
      border-radius: 6px;
      border: none;
      cursor: pointer;
      font-size: 0.875rem;
    }
    .btn-submit:hover { background: #15803d; }
    .text-center { text-align: center; }
    .py-4 { padding-top: 1.5rem; padding-bottom: 1.5rem; }
    .text-muted { color: var(--text-muted); }
  </style>
</head>
<body>
  ${this.renderNavbar('jobs')}

  <div class="container">
    <div class="back-nav">
      <a href="/job-postings">&larr; Back to Career Opportunities</a>
    </div>

    ${successMessage ? `<div class="alert-success">${this.escapeHtml(successMessage)}</div>` : ''}

    <div class="card">
      <div class="header-section">
        <h1>${this.escapeHtml(job.title)}</h1>
        <div class="meta-bar">
          <strong>🏢 ${this.escapeHtml(job.company)}</strong>
          <span>•</span>
          <span>📍 ${this.escapeHtml(job.location || 'Remote')}</span>
          <span>•</span>
          <span class="badge ${typeClass}">${this.escapeHtml(job.type || 'full-time')}</span>
          ${job.salary ? `<span>• 💰 ${this.escapeHtml(job.salary)}</span>` : ''}
          <span>• 🗓️ Posted ${job.createdAt ? new Date(job.createdAt).toLocaleDateString() : 'Recently'}</span>
        </div>
      </div>

      <div class="section-title">Role Description</div>
      <div class="content-box">${this.escapeHtml(job.description)}</div>

      ${job.requirements ? `
        <div class="section-title">Requirements & Qualifications</div>
        <div class="content-box">${this.escapeHtml(job.requirements)}</div>
      ` : ''}

      ${job.contactEmail ? `
        <div class="section-title">Application Inquiries</div>
        <p style="font-size: 0.95rem;">Direct inquiries: <a href="mailto:${this.escapeHtml(job.contactEmail)}" style="color: var(--primary); font-weight: 600;">${this.escapeHtml(job.contactEmail)}</a></p>
      ` : ''}

      <div class="actions">
        <a href="#quick-apply" class="btn btn-primary">🚀 Apply for this Role</a>
        <a href="/job-postings/${job.id}/edit" class="btn btn-secondary">✏️ Edit Opportunity</a>
        <form method="POST" action="/job-postings/${job.id}/delete" onsubmit="return confirm('Delete this job posting?');" style="display:inline;">
          <button type="submit" class="btn btn-danger">🗑️ Delete</button>
        </form>
      </div>
    </div>

    <!-- Quick Application Form Section -->
    <div class="card" id="quick-apply">
      <h2 style="font-size: 1.35rem; color: #1e293b; margin-bottom: 0.5rem;">🚀 Apply for this Position</h2>
      <p style="color: var(--text-muted); font-size: 0.875rem; margin-bottom: 1.5rem;">
        Submit your application directly for <strong>${this.escapeHtml(job.title)}</strong> at <strong>${this.escapeHtml(job.company)}</strong>.
      </p>

      <form method="POST" action="/applications">
        <input type="hidden" name="jobPostingId" value="${job.id}">
        
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1rem;">
          <div class="form-group">
            <label for="userId">Applicant (Alumni User) *</label>
            ${userOptions ? `
              <select id="userId" name="userId" required>
                <option value="">Select your alumni profile...</option>
                ${userOptions}
              </select>
            ` : `
              <input type="number" id="userId" name="userId" required placeholder="Enter your User ID (e.g. 1)" min="1">
            `}
          </div>

          <div class="form-group">
            <label for="resumeUrl">Resume / Portfolio Link (URL)</label>
            <input type="url" id="resumeUrl" name="resumeUrl" placeholder="https://cdn.example.com/cv.pdf">
          </div>
        </div>

        <div class="form-group">
          <label for="coverNote">Cover Note / Statement of Interest</label>
          <textarea id="coverNote" name="coverNote" rows="3" placeholder="Highlight relevant skills, achievements, and why you are interested in this position..."></textarea>
        </div>

        <button type="submit" class="btn-submit">Submit Application</button>
      </form>
    </div>

    <!-- Received Applications for this Job -->
    <div class="card">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
        <h2 style="font-size: 1.25rem; color: #1e293b;">📋 Received Applications (${applications.length})</h2>
      </div>
      <div style="overflow-x: auto;">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Applicant</th>
              <th>Status</th>
              <th>Resume</th>
              <th>Cover Note</th>
              <th>Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            ${appRows}
          </tbody>
        </table>
      </div>
    </div>
  </div>
</body>
</html>`;
  },

  /**
   * Renders pre-filled edit job posting form
   * 
   * @param {Object} job - JobPosting entity
   * @param {Object} [options] - Options (errorMessage)
   * @returns {string} Formatted HTML document
   */
  renderEditJobPostingForm(job, options = {}) {
    if (!job) return this.renderError('Job posting not found', { statusCode: 404 });
    const { errorMessage = null } = options;

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Edit ${this.escapeHtml(job.title)} - Alumni Tracking System</title>
  <style>
    :root {
      --primary: #2563eb;
      --primary-hover: #1d4ed8;
      --bg: #f8fafc;
      --card-bg: #ffffff;
      --text: #0f172a;
      --text-muted: #64748b;
      --border: #e2e8f0;
      --font: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: var(--font);
      background: var(--bg);
      color: var(--text);
      line-height: 1.5;
    }
    .top-navbar {
      background: #ffffff;
      border-bottom: 1px solid var(--border);
      padding: 0.85rem 2rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .nav-brand { font-weight: 700; font-size: 1.15rem; color: #1e293b; }
    .container { max-width: 800px; margin: 0 auto; padding: 2rem 1rem; }
    .card {
      background: var(--card-bg);
      border-radius: 12px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.06);
      border: 1px solid var(--border);
      padding: 2rem;
    }
    h1 { font-size: 1.5rem; margin-bottom: 1.5rem; color: #1e293b; }
    .alert-danger {
      padding: 1rem 1.25rem;
      border-radius: 8px;
      margin-bottom: 1.5rem;
      font-weight: 500;
      background: #fee2e2;
      color: #b91c1c;
      border: 1px solid #fecaca;
    }
    .form-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 1.25rem;
      margin-bottom: 1.25rem;
    }
    .form-group { display: flex; flex-direction: column; gap: 0.35rem; }
    .form-group.full-width { grid-column: 1 / -1; }
    label { font-size: 0.875rem; font-weight: 600; color: #334155; }
    input, select, textarea {
      padding: 0.625rem 0.85rem;
      border-radius: 6px;
      border: 1px solid var(--border);
      font-size: 0.875rem;
      font-family: inherit;
    }
    input:focus, select:focus, textarea:focus {
      outline: none;
      border-color: var(--primary);
      box-shadow: 0 0 0 3px rgba(37,99,235,0.12);
    }
    .actions { display: flex; gap: 1rem; align-items: center; margin-top: 1.5rem; }
    .btn-submit {
      background: var(--primary);
      color: white;
      font-weight: 600;
      padding: 0.75rem 1.75rem;
      border-radius: 6px;
      border: none;
      cursor: pointer;
      font-size: 0.875rem;
    }
    .btn-submit:hover { background: var(--primary-hover); }
    .btn-cancel { color: var(--text-muted); text-decoration: none; font-size: 0.875rem; font-weight: 500; }
    .btn-cancel:hover { text-decoration: underline; }
  </style>
</head>
<body>
  <div class="top-navbar">
    <div class="nav-brand">🎓 Alumni Tracking System</div>
  </div>

  <div class="container">
    <div style="margin-bottom: 1.5rem;">
      <a href="/job-postings/${job.id}" style="color: var(--primary); text-decoration: none; font-weight: 600;">&larr; Cancel & Back to Details</a>
    </div>

    ${errorMessage ? `<div class="alert-danger">${this.escapeHtml(errorMessage)}</div>` : ''}

    <div class="card">
      <h1>Edit Job Posting: ${this.escapeHtml(job.title)}</h1>
      <form method="POST" action="/job-postings/${job.id}/update">
        <div class="form-grid">
          <div class="form-group">
            <label for="title">Position Title *</label>
            <input type="text" id="title" name="title" value="${this.escapeHtml(job.title)}" required>
          </div>
          <div class="form-group">
            <label for="company">Company / Organization *</label>
            <input type="text" id="company" name="company" value="${this.escapeHtml(job.company)}" required>
          </div>
          <div class="form-group">
            <label for="location">Location</label>
            <input type="text" id="location" name="location" value="${this.escapeHtml(job.location || '')}">
          </div>
          <div class="form-group">
            <label for="type">Employment Type</label>
            <select id="type" name="type">
              <option value="full-time" ${job.type === 'full-time' ? 'selected' : ''}>Full-Time</option>
              <option value="part-time" ${job.type === 'part-time' ? 'selected' : ''}>Part-Time</option>
              <option value="contract" ${job.type === 'contract' ? 'selected' : ''}>Contract</option>
              <option value="internship" ${job.type === 'internship' ? 'selected' : ''}>Internship</option>
              <option value="remote" ${job.type === 'remote' ? 'selected' : ''}>Remote</option>
            </select>
          </div>
          <div class="form-group">
            <label for="salary">Compensation / Salary Range</label>
            <input type="text" id="salary" name="salary" value="${this.escapeHtml(job.salary || '')}">
          </div>
          <div class="form-group">
            <label for="contactEmail">Contact / Application Email</label>
            <input type="email" id="contactEmail" name="contactEmail" value="${this.escapeHtml(job.contactEmail || '')}">
          </div>
          <div class="form-group full-width">
            <label for="requirements">Requirements & Skills</label>
            <input type="text" id="requirements" name="requirements" value="${this.escapeHtml(job.requirements || '')}">
          </div>
          <div class="form-group full-width">
            <label for="description">Role Description *</label>
            <textarea id="description" name="description" rows="5" required>${this.escapeHtml(job.description || '')}</textarea>
          </div>
        </div>
        <div class="actions">
          <button type="submit" class="btn-submit">Save Changes</button>
          <a href="/job-postings/${job.id}" class="btn-cancel">Cancel</a>
        </div>
      </form>
    </div>
  </div>
</body>
</html>`;
  },

  /**
   * Renders semantic error page
   * 
   * @param {string} message - Error description
   * @param {Object} [options] - Options (statusCode)
   * @returns {string} Formatted HTML document
   */
  renderError(message, options = {}) {
    const { statusCode = 404 } = options;

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Error ${statusCode} - Alumni Tracking System</title>
  <style>
    body {
      font-family: system-ui, -apple-system, sans-serif;
      background: #f8fafc;
      color: #0f172a;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      margin: 0;
      padding: 1rem;
    }
    .card {
      background: white;
      padding: 2.5rem;
      border-radius: 12px;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
      max-width: 480px;
      width: 100%;
      text-align: center;
      border: 1px solid #e2e8f0;
    }
    h1 { font-size: 3rem; color: #dc2626; margin: 0; line-height: 1; }
    h2 { font-size: 1.25rem; color: #1e293b; margin: 1rem 0; }
    p { color: #64748b; margin-bottom: 2rem; font-size: 0.95rem; }
    a {
      background: #2563eb;
      color: white;
      text-decoration: none;
      padding: 0.75rem 1.5rem;
      border-radius: 6px;
      font-weight: 600;
      display: inline-block;
    }
    a:hover { background: #1d4ed8; }
  </style>
</head>
<body>
  <div class="card">
    <h1>${statusCode}</h1>
    <h2>Action Failed</h2>
    <p>${this.escapeHtml(message)}</p>
    <a href="/job-postings">Return to Career Board</a>
  </div>
</body>
</html>`;
  }
};

module.exports = jobPostingView;
