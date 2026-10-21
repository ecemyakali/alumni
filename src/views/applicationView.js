/**
 * ========================================================
 * View Layer: Application View (ApplicationView)
 * File: src/views/applicationView.js
 * ========================================================
 * 
 * Dedicated View Layer for Job Application (Many-to-Many Relational) management.
 * Generates semantic, responsive HTML views for:
 * 1. READ ALL & CREATE: Application listing, status KPI metrics, filters, & submission form (GET /applications)
 * 2. READ ONE: Full application detail card with quick status actions (GET /applications/:id)
 * 3. UPDATE: Pre-filled application edit form (GET /applications/:id/edit)
 * 4. DELETE: Row-level form delete actions with confirmation
 * 5. ERRORS: Semantic 400, 404, and 409 conflict pages
 */

const applicationView = {
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
  renderNavbar(activePage = 'applications') {
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
   * Status badge styling helper
   */
  getStatusBadgeClass(status) {
    switch ((status || '').toLowerCase()) {
      case 'accepted': return 'badge-status-accepted';
      case 'reviewing': return 'badge-status-reviewing';
      case 'rejected': return 'badge-status-rejected';
      case 'withdrawn': return 'badge-status-withdrawn';
      case 'pending':
      default:
        return 'badge-status-pending';
    }
  },

  /**
   * Renders the complete HTML Applications Management page
   * 
   * @param {Array<Object>} applications - List of application models
   * @param {Object} [options] - Options (successMessage, errorMessage, jobs, users, selectedJobId)
   * @returns {string} Formatted HTML document
   */
  renderApplicationsList(applications = [], options = {}) {
    const { successMessage = null, errorMessage = null, jobs = [], users = [], selectedJobId = null } = options;

    const totalApps = applications.length;
    const pendingCount = applications.filter(a => (a.status || 'pending').toLowerCase() === 'pending').length;
    const reviewingCount = applications.filter(a => (a.status || '').toLowerCase() === 'reviewing').length;
    const acceptedCount = applications.filter(a => (a.status || '').toLowerCase() === 'accepted').length;
    const rejectedCount = applications.filter(a => ['rejected', 'withdrawn'].includes((a.status || '').toLowerCase())).length;

    // Build user and job lookup maps if provided
    const userMap = new Map((users || []).map(u => [Number(u.id), u]));
    const jobMap = new Map((jobs || []).map(j => [Number(j.id), j]));

    const rows = applications.length > 0
      ? applications.map(app => {
        const badgeClass = this.getStatusBadgeClass(app.status);
        const userObj = userMap.get(Number(app.userId));
        const jobObj = jobMap.get(Number(app.jobPostingId));

        const userLabel = userObj ? `${this.escapeHtml(userObj.name)} (#${app.userId})` : `User #${app.userId}`;
        const jobLabel = jobObj ? `${this.escapeHtml(jobObj.title)} (#${app.jobPostingId})` : `Job #${app.jobPostingId}`;

        const resumeLink = app.resumeUrl
          ? `<a href="${this.escapeHtml(app.resumeUrl)}" target="_blank" class="resume-link">📄 View Resume</a>`
          : `<span class="text-muted">None</span>`;
        const notePreview = app.coverNote
          ? (app.coverNote.length > 45 ? `${this.escapeHtml(app.coverNote.substring(0, 45))}...` : this.escapeHtml(app.coverNote))
          : `<span class="text-muted">-</span>`;

        return `
        <tr class="app-row" data-status="${this.escapeHtml(app.status || 'pending').toLowerCase()}" data-text="${this.escapeHtml((userLabel + ' ' + jobLabel + ' ' + (app.coverNote || '')).toLowerCase())}">
          <td><span class="badge badge-id">#${app.id}</span></td>
          <td>
            <a href="/users/${app.userId}" class="entity-link">
              <strong>${userLabel}</strong>
            </a>
          </td>
          <td>
            <a href="/job-postings/${app.jobPostingId}" class="entity-link">
              <strong>${jobLabel}</strong>
            </a>
            ${jobObj ? `<div style="font-size:0.75rem; color:var(--muted);">🏢 ${this.escapeHtml(jobObj.company)}</div>` : ''}
          </td>
          <td><span class="badge ${badgeClass}">${this.escapeHtml(app.status || 'pending')}</span></td>
          <td>${resumeLink}</td>
          <td><small>${notePreview}</small></td>
          <td><small class="text-muted">${app.createdAt ? new Date(app.createdAt).toLocaleDateString() : 'N/A'}</small></td>
          <td class="action-cell">
            <a href="/applications/${app.id}" class="btn-sm btn-view">View</a>
            <a href="/applications/${app.id}/edit" class="btn-sm btn-edit">Edit</a>
            <form method="POST" action="/applications/${app.id}/delete" style="display:inline;" onsubmit="return confirm('Delete application #${app.id}?');">
              <button type="submit" class="btn-sm btn-delete">Delete</button>
            </form>
          </td>
        </tr>
      `;
      }).join('')
      : `<tr><td colspan="8" class="text-center text-muted py-4">No job applications submitted yet. Use the form below to submit an application!</td></tr>`;

    // Dropdown options for User and Job selection
    const userSelectOptions = users.length > 0
      ? users.map(u => `<option value="${u.id}">${this.escapeHtml(u.name)} (${this.escapeHtml(u.email)}) - #${u.id}</option>`).join('')
      : '';

    const jobSelectOptions = jobs.length > 0
      ? jobs.map(j => `<option value="${j.id}" ${Number(selectedJobId) === Number(j.id) ? 'selected' : ''}>${this.escapeHtml(j.title)} @ ${this.escapeHtml(j.company)} - #${j.id}</option>`).join('')
      : '';

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Job Applications - Alumni Tracking System</title>
  <style>
    :root {
      --primary: #2563eb;
      --primary-hover: #1d4ed8;
      --success: #16a34a;
      --warning: #d97706;
      --danger: #dc2626;
      --muted: #64748b;
      --bg: #f8fafc;
      --card-bg: #ffffff;
      --text: #0f172a;
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
      color: var(--muted);
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
    .header-sub { color: var(--muted); font-size: 0.95rem; margin-top: 0.25rem; }
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
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
    .stat-label { font-size: 0.8rem; text-transform: uppercase; color: var(--muted); font-weight: 600; margin-top: 0.4rem; letter-spacing: 0.05em; }
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
      color: var(--muted);
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
      color: var(--muted);
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
      color: var(--muted);
      border-bottom: 1px solid var(--border);
    }
    td { padding: 1rem; border-bottom: 1px solid var(--border); font-size: 0.875rem; vertical-align: middle; }
    tr:hover td { background: #fbfcfe; }
    .entity-link { color: #1e293b; text-decoration: none; }
    .entity-link:hover { color: var(--primary); text-decoration: underline; }
    .resume-link { color: var(--primary); text-decoration: none; font-weight: 500; }
    .resume-link:hover { text-decoration: underline; }
    .badge {
      display: inline-block;
      padding: 0.25rem 0.6rem;
      border-radius: 9999px;
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: capitalize;
      white-space: nowrap;
    }
    .badge-id { background: #f1f5f9; color: #475569; }
    .badge-status-pending { background: #fef3c7; color: #b45309; }
    .badge-status-reviewing { background: #e0f2fe; color: #0369a1; }
    .badge-status-accepted { background: #dcfce7; color: #15803d; }
    .badge-status-rejected { background: #fee2e2; color: #b91c1c; }
    .badge-status-withdrawn { background: #f1f5f9; color: #64748b; }
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
    .text-muted { color: var(--muted); }
  </style>
</head>
<body>
  ${this.renderNavbar('applications')}

  <div class="container">
    <div class="page-header">
      <div>
        <h1>📝 Job Applications Management</h1>
        <p class="header-sub">
          Track, review, and manage career applications linking Alumni Applicants and Job Opportunities.
        </p>
      </div>
      <div>
        <a href="#new-app" class="btn-submit" style="text-decoration: none; display: inline-block;">+ Submit Application</a>
      </div>
    </div>

    ${successMessage ? `<div class="alert alert-success">${this.escapeHtml(successMessage)}</div>` : ''}
    ${errorMessage ? `<div class="alert alert-danger">${this.escapeHtml(errorMessage)}</div>` : ''}

    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-number">${totalApps}</div>
        <div class="stat-label">Total Applications</div>
      </div>
      <div class="stat-card">
        <div class="stat-number" style="color: #d97706;">${pendingCount}</div>
        <div class="stat-label">Pending Review</div>
      </div>
      <div class="stat-card">
        <div class="stat-number" style="color: #0284c7;">${reviewingCount}</div>
        <div class="stat-label">Under Review</div>
      </div>
      <div class="stat-card">
        <div class="stat-number" style="color: #16a34a;">${acceptedCount}</div>
        <div class="stat-label">Accepted Offers</div>
      </div>
      <div class="stat-card">
        <div class="stat-number" style="color: #dc2626;">${rejectedCount}</div>
        <div class="stat-label">Rejected / Withdrawn</div>
      </div>
    </div>

    <div class="filter-panel">
      <div class="search-box">
        <span class="search-icon">🔍</span>
        <input type="text" id="appSearch" class="search-input" placeholder="Search by applicant, job title, company, or keywords...">
      </div>
      <div class="filter-pills">
        <button class="filter-pill active" data-status="all">All Applications</button>
        <button class="filter-pill" data-status="pending">Pending</button>
        <button class="filter-pill" data-status="reviewing">Reviewing</button>
        <button class="filter-pill" data-status="accepted">Accepted</button>
        <button class="filter-pill" data-status="rejected">Rejected</button>
        <button class="filter-pill" data-status="withdrawn">Withdrawn</button>
      </div>
    </div>

    <div class="card">
      <div class="card-header">
        <span>Submitted Applications (${totalApps})</span>
      </div>
      <div style="overflow-x: auto;">
        <table id="applicationsTable">
          <thead>
            <tr>
              <th>ID</th>
              <th>Applicant (User)</th>
              <th>Job Posting</th>
              <th>Status</th>
              <th>Resume</th>
              <th>Cover Note</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            ${rows}
          </tbody>
        </table>
      </div>
    </div>

    <div class="card" id="new-app">
      <div class="card-header">
        Submit New Job Application
      </div>
      <div class="card-body">
        <form method="POST" action="/applications">
          <div class="form-grid">
            <div class="form-group">
              <label for="userId">Applicant (User) *</label>
              ${userSelectOptions ? `
                <select id="userId" name="userId" required>
                  <option value="">Select alumni applicant...</option>
                  ${userSelectOptions}
                </select>
              ` : `
                <input type="number" id="userId" name="userId" required placeholder="e.g. 1" min="1">
              `}
            </div>

            <div class="form-group">
              <label for="jobPostingId">Job Posting *</label>
              ${jobSelectOptions ? `
                <select id="jobPostingId" name="jobPostingId" required>
                  <option value="">Select career opportunity...</option>
                  ${jobSelectOptions}
                </select>
              ` : `
                <input type="number" id="jobPostingId" name="jobPostingId" required placeholder="e.g. 1" min="1">
              `}
            </div>

            <div class="form-group">
              <label for="status">Initial Status</label>
              <select id="status" name="status">
                <option value="pending" selected>Pending</option>
                <option value="reviewing">Reviewing</option>
                <option value="accepted">Accepted</option>
                <option value="rejected">Rejected</option>
                <option value="withdrawn">Withdrawn</option>
              </select>
            </div>

            <div class="form-group">
              <label for="resumeUrl">Resume URL (Optional)</label>
              <input type="url" id="resumeUrl" name="resumeUrl" placeholder="https://cdn.example.com/resumes/cv.pdf">
            </div>

            <div class="form-group full-width">
              <label for="coverNote">Cover Note / Statement of Interest (Optional)</label>
              <textarea id="coverNote" name="coverNote" rows="3" placeholder="Briefly describe relevant background, skills, and interest in this role..."></textarea>
            </div>
          </div>
          <button type="submit" class="btn-submit">Submit Application</button>
        </form>
      </div>
    </div>
  </div>

  <script>
    // Client-side interactive applications search & status filtering
    const appSearch = document.getElementById('appSearch');
    const filterPills = document.querySelectorAll('.filter-pill');
    const appRows = document.querySelectorAll('.app-row');

    let activeStatus = 'all';

    function applyAppFilters() {
      const query = (appSearch ? appSearch.value : '').toLowerCase().trim();
      appRows.forEach(row => {
        const text = row.getAttribute('data-text') || '';
        const status = row.getAttribute('data-status') || '';
        const matchesQuery = !query || text.includes(query);
        const matchesStatus = activeStatus === 'all' || status === activeStatus;
        row.style.display = (matchesQuery && matchesStatus) ? '' : 'none';
      });
    }

    if (appSearch) {
      appSearch.addEventListener('input', applyAppFilters);
    }

    filterPills.forEach(pill => {
      pill.addEventListener('click', () => {
        filterPills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        activeStatus = pill.getAttribute('data-status');
        applyAppFilters();
      });
    });
  </script>
</body>
</html>`;
  },

  /**
   * Renders single Application detail view with quick review actions
   * 
   * @param {Object} application - Application model instance
   * @param {Object} [options] - Options (successMessage, user, job)
   * @returns {string} Formatted HTML document
   */
  renderApplicationDetail(application, options = {}) {
    const { successMessage = null, user = null, job = null } = options;
    const badgeClass = this.getStatusBadgeClass(application.status);

    const userName = user ? user.name : `User #${application.userId}`;
    const userEmail = user ? user.email : '';
    const jobTitle = job ? job.title : `Job #${application.jobPostingId}`;
    const jobCompany = job ? job.company : '';

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Application #${application.id} - Alumni Tracking System</title>
  <style>
    :root {
      --primary: #2563eb;
      --primary-hover: #1d4ed8;
      --bg: #f8fafc;
      --card-bg: #ffffff;
      --text: #0f172a;
      --muted: #64748b;
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
    }
    .nav-brand { font-weight: 700; font-size: 1.15rem; color: #1e293b; }
    .container { max-width: 840px; margin: 0 auto; padding: 2rem 1rem; }
    .back-nav { margin-bottom: 1.5rem; }
    .back-nav a { color: var(--primary); text-decoration: none; font-weight: 600; font-size: 0.9rem; }
    .back-nav a:hover { text-decoration: underline; }
    .alert {
      padding: 1rem 1.25rem;
      border-radius: 8px;
      margin-bottom: 1.5rem;
      font-weight: 500;
      background: #dcfce7;
      color: #15803d;
      border: 1px solid #bbf7d0;
    }
    .card {
      background: var(--card-bg);
      border-radius: 12px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.06);
      border: 1px solid var(--border);
      padding: 2rem;
      margin-bottom: 1.5rem;
    }
    .header-row {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 1.5rem;
      border-bottom: 1px solid var(--border);
      padding-bottom: 1rem;
      flex-wrap: wrap;
      gap: 1rem;
    }
    h1 { font-size: 1.5rem; color: #1e293b; }
    .badge {
      display: inline-block;
      padding: 0.35rem 0.75rem;
      border-radius: 9999px;
      font-size: 0.875rem;
      font-weight: 600;
      text-transform: capitalize;
    }
    .badge-status-pending { background: #fef3c7; color: #b45309; }
    .badge-status-reviewing { background: #e0f2fe; color: #0369a1; }
    .badge-status-accepted { background: #dcfce7; color: #15803d; }
    .badge-status-rejected { background: #fee2e2; color: #b91c1c; }
    .badge-status-withdrawn { background: #f1f5f9; color: #64748b; }
    .meta-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 1.25rem;
      margin-bottom: 1.5rem;
    }
    .meta-item { display: flex; flex-direction: column; }
    .meta-label { font-size: 0.75rem; text-transform: uppercase; color: var(--muted); font-weight: 600; letter-spacing: 0.05em; }
    .meta-value { font-size: 1.05rem; font-weight: 600; color: #1e293b; margin-top: 0.25rem; }
    .meta-value a { color: var(--primary); text-decoration: none; }
    .meta-value a:hover { text-decoration: underline; }
    .meta-sub { font-size: 0.825rem; color: var(--muted); font-weight: normal; margin-top: 0.15rem; }
    .section-title { font-size: 1rem; font-weight: 700; margin: 1.5rem 0 0.5rem; color: #334155; }
    .cover-note-box {
      background: #f8fafc;
      padding: 1.25rem;
      border-radius: 8px;
      border: 1px solid var(--border);
      font-size: 0.95rem;
      white-space: pre-line;
      color: #334155;
    }
    .status-actions-bar {
      background: #f8fafc;
      border: 1px solid var(--border);
      border-radius: 8px;
      padding: 1.25rem;
      margin-top: 1.5rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 1rem;
    }
    .status-btns { display: flex; gap: 0.5rem; flex-wrap: wrap; }
    .btn-status-act {
      padding: 0.45rem 0.85rem;
      border-radius: 6px;
      border: 1px solid var(--border);
      background: white;
      font-size: 0.8rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.15s ease;
    }
    .btn-status-act:hover { background: #f1f5f9; }
    .btn-status-accept { background: #dcfce7; color: #15803d; border-color: #bbf7d0; }
    .btn-status-accept:hover { background: #bbf7d0; }
    .btn-status-review { background: #e0f2fe; color: #0369a1; border-color: #bae6fd; }
    .btn-status-review:hover { background: #bae6fd; }
    .btn-status-reject { background: #fee2e2; color: #b91c1c; border-color: #fecaca; }
    .btn-status-reject:hover { background: #fecaca; }
    .actions {
      display: flex;
      gap: 0.75rem;
      margin-top: 2rem;
      border-top: 1px solid var(--border);
      padding-top: 1.5rem;
      flex-wrap: wrap;
    }
    .btn {
      padding: 0.6rem 1.25rem;
      border-radius: 6px;
      font-size: 0.875rem;
      font-weight: 600;
      text-decoration: none;
      cursor: pointer;
      border: none;
    }
    .btn-edit { background: #fef3c7; color: #d97706; }
    .btn-edit:hover { background: #fde68a; }
    .btn-delete { background: #fee2e2; color: #dc2626; }
    .btn-delete:hover { background: #fecaca; }
    .btn-back { background: #f1f5f9; color: #475569; }
    .btn-back:hover { background: #e2e8f0; }
  </style>
</head>
<body>
  <div class="top-navbar">
    <div class="nav-brand">🎓 Alumni Tracking System</div>
  </div>

  <div class="container">
    <div class="back-nav">
      <a href="/applications">&larr; Back to Applications</a>
    </div>

    ${successMessage ? `<div class="alert">${this.escapeHtml(successMessage)}</div>` : ''}

    <div class="card">
      <div class="header-row">
        <div>
          <h1>Application #${application.id}</h1>
          <p style="color: var(--muted); font-size: 0.875rem; margin-top: 0.25rem;">
            Submitted on ${application.createdAt ? new Date(application.createdAt).toLocaleString() : 'N/A'}
          </p>
        </div>
        <span class="badge ${badgeClass}">${this.escapeHtml(application.status || 'pending')}</span>
      </div>

      <div class="meta-grid">
        <div class="meta-item">
          <span class="meta-label">Applicant</span>
          <span class="meta-value">
            <a href="/users/${application.userId}">User #${application.userId}</a>
          </span>
          ${user ? `<span class="meta-sub">${this.escapeHtml(userName)}${userEmail ? ' (' + this.escapeHtml(userEmail) + ')' : ''}</span>` : ''}
        </div>
        <div class="meta-item">
          <span class="meta-label">Job Opportunity</span>
          <span class="meta-value">
            <a href="/job-postings/${application.jobPostingId}">Job #${application.jobPostingId}</a>
          </span>
          ${job ? `<span class="meta-sub">${this.escapeHtml(jobTitle)} @ ${this.escapeHtml(jobCompany)}</span>` : ''}
        </div>
        <div class="meta-item">
          <span class="meta-label">Resume Document</span>
          <span class="meta-value">
            ${application.resumeUrl ? `<a href="${this.escapeHtml(application.resumeUrl)}" target="_blank">📄 Open Resume Link</a>` : '<span style="color: var(--muted); font-weight: normal;">None provided</span>'}
          </span>
        </div>
        <div class="meta-item">
          <span class="meta-label">Last Updated</span>
          <span class="meta-value" style="font-weight: normal; font-size: 0.875rem;">
            ${application.updatedAt ? new Date(application.updatedAt).toLocaleString() : 'Never'}
          </span>
        </div>
      </div>

      <div class="section-title">Cover Note / Candidate Statement</div>
      <div class="cover-note-box">
        ${application.coverNote ? this.escapeHtml(application.coverNote) : '<em>No cover note submitted with this application.</em>'}
      </div>

      <!-- Quick Review Actions Bar -->
      <div class="status-actions-bar">
        <span style="font-size: 0.875rem; font-weight: 600; color: #334155;">⚡ Quick Review Action:</span>
        <div class="status-btns">
          <form method="POST" action="/applications/${application.id}/update" style="display:inline;">
            <input type="hidden" name="status" value="reviewing">
            <button type="submit" class="btn-status-act btn-status-review">Set Reviewing</button>
          </form>
          <form method="POST" action="/applications/${application.id}/update" style="display:inline;">
            <input type="hidden" name="status" value="accepted">
            <button type="submit" class="btn-status-act btn-status-accept">Accept Candidate</button>
          </form>
          <form method="POST" action="/applications/${application.id}/update" style="display:inline;">
            <input type="hidden" name="status" value="rejected">
            <button type="submit" class="btn-status-act btn-status-reject">Reject</button>
          </form>
        </div>
      </div>

      <div class="actions">
        <a href="/applications/${application.id}/edit" class="btn btn-edit">Edit Application</a>
        <form method="POST" action="/applications/${application.id}/delete" style="display:inline;" onsubmit="return confirm('Permanently delete application #${application.id}?');">
          <button type="submit" class="btn btn-delete">Delete Application</button>
        </form>
        <a href="/applications" class="btn btn-back">Back to List</a>
      </div>
    </div>
  </div>
</body>
</html>`;
  },

  /**
   * Renders pre-filled Application Edit Form
   * 
   * @param {Object} application - Existing application model
   * @param {Object} [options] - Options (errorMessage, user, job)
   * @returns {string} Formatted HTML document
   */
  renderEditApplicationForm(application, options = {}) {
    const { errorMessage = null, user = null, job = null } = options;

    const userLabel = user ? `${this.escapeHtml(user.name)} (#${application.userId})` : `User #${application.userId}`;
    const jobLabel = job ? `${this.escapeHtml(job.title)} @ ${this.escapeHtml(job.company)} (#${application.jobPostingId})` : `Job #${application.jobPostingId}`;

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Edit Application #${application.id} - Alumni Tracking System</title>
  <style>
    :root {
      --primary: #2563eb;
      --primary-hover: #1d4ed8;
      --bg: #f8fafc;
      --card-bg: #ffffff;
      --text: #0f172a;
      --muted: #64748b;
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
    .container { max-width: 720px; margin: 0 auto; padding: 2rem 1rem; }
    .back-nav { margin-bottom: 1.5rem; }
    .back-nav a { color: var(--primary); text-decoration: none; font-weight: 600; font-size: 0.9rem; }
    .back-nav a:hover { text-decoration: underline; }
    .card {
      background: var(--card-bg);
      border-radius: 12px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.06);
      border: 1px solid var(--border);
      padding: 2rem;
    }
    h1 { font-size: 1.5rem; font-weight: 700; color: #1e293b; margin-bottom: 1.5rem; }
    .alert-danger {
      padding: 1rem 1.25rem;
      border-radius: 8px;
      margin-bottom: 1.5rem;
      font-weight: 500;
      background: #fee2e2;
      color: #b91c1c;
      border: 1px solid #fecaca;
    }
    .form-group { margin-bottom: 1.25rem; display: flex; flex-direction: column; gap: 0.4rem; }
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
    .btn-cancel { color: var(--muted); text-decoration: none; font-size: 0.875rem; font-weight: 500; }
    .btn-cancel:hover { text-decoration: underline; }
  </style>
</head>
<body>
  <div class="top-navbar">
    <div class="nav-brand">🎓 Alumni Tracking System</div>
  </div>

  <div class="container">
    <div class="back-nav">
      <a href="/applications/${application.id}">&larr; Cancel & Back to Details</a>
    </div>

    ${errorMessage ? `<div class="alert-danger">${this.escapeHtml(errorMessage)}</div>` : ''}

    <div class="card">
      <h1>Edit Application #${application.id}</h1>
      <form method="POST" action="/applications/${application.id}/update">
        <div class="form-group">
          <label>Applicant</label>
          <input type="text" value="${userLabel}" disabled style="background: #f1f5f9; color: #64748b; cursor: not-allowed;">
        </div>

        <div class="form-group">
          <label>Job Opportunity</label>
          <input type="text" value="${jobLabel}" disabled style="background: #f1f5f9; color: #64748b; cursor: not-allowed;">
        </div>

        <div class="form-group">
          <label for="status">Application Review Status</label>
          <select id="status" name="status">
            <option value="pending" ${application.status === 'pending' ? 'selected' : ''}>Pending</option>
            <option value="reviewing" ${application.status === 'reviewing' ? 'selected' : ''}>Reviewing</option>
            <option value="accepted" ${application.status === 'accepted' ? 'selected' : ''}>Accepted</option>
            <option value="rejected" ${application.status === 'rejected' ? 'selected' : ''}>Rejected</option>
            <option value="withdrawn" ${application.status === 'withdrawn' ? 'selected' : ''}>Withdrawn</option>
          </select>
        </div>

        <div class="form-group">
          <label for="resumeUrl">Resume Document URL</label>
          <input type="url" id="resumeUrl" name="resumeUrl" value="${this.escapeHtml(application.resumeUrl || '')}" placeholder="https://cdn.example.com/resumes/cv.pdf">
        </div>

        <div class="form-group">
          <label for="coverNote">Cover Note</label>
          <textarea id="coverNote" name="coverNote" rows="4">${this.escapeHtml(application.coverNote || '')}</textarea>
        </div>

        <div class="actions">
          <button type="submit" class="btn-submit">Save Changes</button>
          <a href="/applications/${application.id}" class="btn-cancel">Cancel</a>
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
    <a href="/applications">Return to Applications</a>
  </div>
</body>
</html>`;
  }
};

module.exports = applicationView;
