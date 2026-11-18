/**
 * ========================================================
 * View Layer: Application View (ApplicationView) - Tactile SaaS Design
 * File: src/views/applicationView.js
 * ========================================================
 * 
 * Dedicated View Layer for Job Application (Many-to-Many Relational) management.
 * Generates semantic, responsive, tactile B2B SaaS HTML views:
 * 1. READ ALL & CREATE: Application listing, status KPI metrics, filters, & submission form (GET /applications)
 * 2. READ ONE: Full application detail card with quick status actions (GET /applications/:id)
 * 3. UPDATE: Pre-filled application edit form (GET /applications/:id/edit)
 * 4. DELETE: Row-level form delete actions with confirmation
 * 5. ERRORS: Semantic 400, 404, and 409 conflict pages
 */

const sharedLayout = require('./sharedLayout');

const applicationView = {
  /**
   * Escape HTML utility to prevent XSS
   */
  escapeHtml(str) {
    return sharedLayout.escapeHtml(str);
  },

  /**
   * Global Navigation Header
   */
  renderNavbar(activePage = 'applications') {
    return sharedLayout.renderNavbar(activePage);
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
          ? `<a href="${this.escapeHtml(app.resumeUrl)}" target="_blank" class="resume-link" style="color:var(--colors-brand-blue); text-decoration:none; font-weight:500;">📄 View Resume</a>`
          : `<span style="color:var(--colors-muted);">None</span>`;
        const notePreview = app.coverNote
          ? (app.coverNote.length > 45 ? `${this.escapeHtml(app.coverNote.substring(0, 45))}...` : this.escapeHtml(app.coverNote))
          : `<span style="color:var(--colors-muted);">-</span>`;

        return `
        <tr class="app-row" data-status="${this.escapeHtml(app.status || 'pending').toLowerCase()}" data-text="${this.escapeHtml((userLabel + ' ' + jobLabel + ' ' + (app.coverNote || '')).toLowerCase())}">
          <td><span class="badge-pill badge-id">#${app.id}</span></td>
          <td>
            <a href="/users/${app.userId}" class="entity-link" style="color:var(--colors-ink); text-decoration:none; font-weight:600;">
              <strong>${userLabel}</strong>
            </a>
          </td>
          <td>
            <a href="/job-postings/${app.jobPostingId}" class="entity-link" style="color:var(--colors-ink); text-decoration:none; font-weight:600;">
              <strong>${jobLabel}</strong>
            </a>
            ${jobObj ? `<div style="font-size:12px; color:var(--colors-muted); margin-top:2px;">🏢 ${this.escapeHtml(jobObj.company)}</div>` : ''}
          </td>
          <td><span class="badge-pill ${badgeClass}">${this.escapeHtml(app.status || 'pending')}</span></td>
          <td>${resumeLink}</td>
          <td><small style="color:var(--colors-body);">${notePreview}</small></td>
          <td><small style="color:var(--colors-muted);">${app.createdAt ? new Date(app.createdAt).toLocaleDateString() : 'N/A'}</small></td>
          <td class="action-cell">
            <div style="display:flex; gap:6px;">
              <a href="/applications/${app.id}" class="btn-action-view btn-view">View</a>
              <a href="/applications/${app.id}/edit" class="btn-action-edit btn-edit">Edit</a>
              <form method="POST" action="/applications/${app.id}/delete" style="display:inline;" onsubmit="return confirm('Delete application #${app.id}?');">
                <button type="submit" class="btn-action-delete btn-delete">Delete</button>
              </form>
            </div>
          </td>
        </tr>
      `;
      }).join('')
      : `<tr><td colspan="8" style="text-align:center; color:var(--colors-muted); padding:2rem;">No job applications submitted yet. Use the form below to submit an application!</td></tr>`;

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
    ${sharedLayout.getCommonStyles()}

    .stats-kpi-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1.25rem;
      margin-bottom: 2rem;
    }
    .kpi-card {
      background: #ffffff;
      border: 1px solid var(--colors-hairline);
      border-radius: var(--rounded-lg);
      padding: 1.5rem;
      box-shadow: 0 2px 10px rgba(10,10,10,0.02);
      transition: transform 0.15s ease;
    }
    .kpi-card:hover {
      transform: translateY(-2px);
    }
    .kpi-value {
      font-family: var(--font-display);
      font-size: 2.25rem;
      font-weight: 500;
      line-height: 1;
      margin-bottom: 0.35rem;
      letter-spacing: -1px;
    }
    .kpi-title {
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.8px;
      color: var(--colors-muted);
    }

    .filter-panel {
      background: #ffffff;
      border: 1px solid var(--colors-hairline);
      border-radius: var(--rounded-md);
      padding: 1rem 1.25rem;
      margin-bottom: 1.75rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 1rem;
    }
    .search-box-wrap {
      flex: 1;
      min-width: 260px;
      position: relative;
    }
    .search-input-field {
      width: 100%;
      padding: 9px 14px 9px 36px;
      border: 1px solid var(--colors-hairline);
      border-radius: var(--rounded-md);
      background: var(--colors-canvas);
      font-size: 14px;
      font-family: inherit;
      color: var(--colors-ink);
    }
    .search-icon-symbol {
      position: absolute;
      left: 12px;
      top: 50%;
      transform: translateY(-50%);
      color: var(--colors-muted);
      font-size: 14px;
      pointer-events: none;
    }
    .filter-pills-row {
      display: flex;
      gap: 6px;
      flex-wrap: wrap;
    }
    .filter-pill {
      border: 1px solid var(--colors-hairline);
      background: var(--colors-surface-card);
      padding: 6px 14px;
      border-radius: var(--rounded-pill);
      font-size: 13px;
      font-weight: 500;
      color: var(--colors-body);
      cursor: pointer;
      transition: all 0.15s ease;
    }
    .filter-pill:hover, .filter-pill.active {
      background: var(--colors-primary);
      color: #ffffff;
      border-color: var(--colors-primary);
    }

    .badge-status-pending { background: #fef3c7; color: #b45309; }
    .badge-status-reviewing { background: #e0f2fe; color: #0369a1; }
    .badge-status-accepted { background: #dcfce7; color: #15803d; }
    .badge-status-rejected { background: #fee2e2; color: #b91c1c; }
    .badge-status-withdrawn { background: #f1f5f9; color: #64748b; }
  </style>
</head>
<body>

  ${this.renderNavbar('applications')}

  <main class="page-wrapper">
    <div class="page-header-band">
      <div>
        <div class="page-header-pill">
          <span>📝 Candidate Pipelines & Hiring Flow</span>
        </div>
        <h1 class="page-title">Job Applications Management</h1>
        <p class="page-subtitle">
          Track, review, and manage career applications linking Alumni Applicants and Job Opportunities.
        </p>
      </div>
      <div>
        <a href="#new-app" class="btn-clay-primary">+ Submit Application</a>
      </div>
    </div>

    ${successMessage ? `<div class="alert-banner alert-success"><span>✅</span> <span>${this.escapeHtml(successMessage)}</span></div>` : ''}
    ${errorMessage ? `<div class="alert-banner alert-danger"><span>⚠️</span> <span>${this.escapeHtml(errorMessage)}</span></div>` : ''}

    <!-- KPI Metric Cards -->
    <div class="stats-kpi-grid">
      <div class="kpi-card">
        <div class="kpi-value" style="color:var(--colors-ink);">${totalApps}</div>
        <div class="kpi-title">Total Applications</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-value" style="color:var(--colors-warning);">${pendingCount}</div>
        <div class="kpi-title">Pending Review</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-value" style="color:var(--colors-brand-blue);">${reviewingCount}</div>
        <div class="kpi-title">Under Review</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-value" style="color:var(--colors-success);">${acceptedCount}</div>
        <div class="kpi-title">Accepted Offers</div>
      </div>
    </div>

    <!-- Filter & Search Toolbar -->
    <div class="filter-panel">
      <div class="search-box-wrap">
        <span class="search-icon-symbol">🔍</span>
        <input type="text" id="appSearch" class="search-input-field" placeholder="Search by applicant, job position, company, or note...">
      </div>
      <div class="filter-pills-row">
        <button type="button" class="filter-pill active" data-status="all">All</button>
        <button type="button" class="filter-pill" data-status="pending">Pending</button>
        <button type="button" class="filter-pill" data-status="reviewing">Reviewing</button>
        <button type="button" class="filter-pill" data-status="accepted">Accepted</button>
        <button type="button" class="filter-pill" data-status="rejected">Rejected</button>
      </div>
    </div>

    <!-- Applications Table Section -->
    <section class="content-card">
      <div class="card-header-bar">
        <h2 class="card-heading">Submitted Applications</h2>
        <span class="badge-pill badge-id">${totalApps} Total</span>
      </div>
      <div class="table-container">
        <table id="applicationsTable" class="data-table">
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
    </section>

    <!-- New Application Submission Section -->
    <section class="content-card" id="new-app">
      <div class="card-header-bar">
        <h2 class="card-heading">Submit New Job Application</h2>
      </div>
      <form method="POST" action="/applications">
        <div class="form-grid">
          <div class="form-group">
            <label class="form-label" for="userId">Applicant (User) *</label>
            ${userSelectOptions ? `
              <select class="form-select" id="userId" name="userId" required>
                <option value="">Select alumni applicant...</option>
                ${userSelectOptions}
              </select>
            ` : `
              <input class="form-input" type="number" id="userId" name="userId" required placeholder="e.g. 1" min="1">
            `}
          </div>

          <div class="form-group">
            <label class="form-label" for="jobPostingId">Job Posting *</label>
            ${jobSelectOptions ? `
              <select class="form-select" id="jobPostingId" name="jobPostingId" required>
                <option value="">Select career opportunity...</option>
                ${jobSelectOptions}
              </select>
            ` : `
              <input class="form-input" type="number" id="jobPostingId" name="jobPostingId" required placeholder="e.g. 1" min="1">
            `}
          </div>

          <div class="form-group">
            <label class="form-label" for="status">Initial Status</label>
            <select class="form-select" id="status" name="status">
              <option value="pending" selected>Pending</option>
              <option value="reviewing">Reviewing</option>
              <option value="accepted">Accepted</option>
              <option value="rejected">Rejected</option>
              <option value="withdrawn">Withdrawn</option>
            </select>
          </div>

          <div class="form-group">
            <label class="form-label" for="resumeUrl">Resume URL (Optional)</label>
            <input class="form-input" type="url" id="resumeUrl" name="resumeUrl" placeholder="https://cdn.example.com/resumes/cv.pdf">
          </div>

          <div class="form-group form-col-full">
            <label class="form-label" for="coverNote">Cover Note / Statement of Interest (Optional)</label>
            <textarea class="form-textarea" id="coverNote" name="coverNote" rows="3" placeholder="Briefly describe relevant background, skills, and interest in this role..."></textarea>
          </div>
        </div>
        <div style="margin-top:1.5rem;">
          <button type="submit" class="btn-clay-primary">Submit Application</button>
        </div>
      </form>
    </section>
  </main>

  ${sharedLayout.renderFooter()}

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
    ${sharedLayout.getCommonStyles()}

    .badge-status-pending { background: #fef3c7; color: #b45309; }
    .badge-status-reviewing { background: #e0f2fe; color: #0369a1; }
    .badge-status-accepted { background: #dcfce7; color: #15803d; }
    .badge-status-rejected { background: #fee2e2; color: #b91c1c; }
    .badge-status-withdrawn { background: #f1f5f9; color: #64748b; }

    .detail-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2rem;
    }
    .detail-box {
      background: var(--colors-canvas);
      padding: 1.5rem;
      border-radius: var(--rounded-md);
      border: 1px solid var(--colors-hairline);
    }
    .detail-box-title {
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.8px;
      color: var(--colors-muted);
      margin-bottom: 0.5rem;
    }
    .btn-status-act {
      padding: 8px 16px;
      border-radius: var(--rounded-md);
      font-weight: 600;
      font-size: 13.5px;
      border: none;
      cursor: pointer;
      transition: transform 0.15s ease, opacity 0.15s ease;
    }
    .btn-status-act:hover {
      opacity: 0.92;
      transform: translateY(-1px);
    }
    .btn-status-accept { background: #16a34a; color: #ffffff; }
    .btn-status-review { background: #0284c7; color: #ffffff; }
    .btn-status-reject { background: #dc2626; color: #ffffff; }
  </style>
</head>
<body>

  ${this.renderNavbar('applications')}

  <main class="page-wrapper" style="max-width:920px;">
    <div style="margin-bottom:1.5rem;">
      <a href="/applications" style="color:var(--colors-ink); text-decoration:none; font-weight:600; font-size:14px; display:inline-flex; align-items:center; gap:6px;">
        &larr; Back to Applications
      </a>
    </div>

    ${successMessage ? `<div class="alert-banner alert-success"><span>✅</span> <span>${this.escapeHtml(successMessage)}</span></div>` : ''}

    <article class="content-card">
      <div style="border-bottom:1px solid var(--colors-hairline); padding-bottom:1.5rem; margin-bottom:1.75rem; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:1rem;">
        <div>
          <h1 class="page-title" style="margin-bottom:0.25rem;">Application #${application.id}</h1>
          <p style="color:var(--colors-muted); font-size:14px;">
            Submitted on ${application.createdAt ? new Date(application.createdAt).toLocaleString() : 'N/A'}
          </p>
        </div>
        <div>
          <span class="badge-pill ${badgeClass}" style="font-size:14px; padding:6px 14px;">${this.escapeHtml(application.status || 'pending')}</span>
        </div>
      </div>

      <!-- Applicant & Opportunity Grid -->
      <div class="detail-grid">
        <div class="detail-box">
          <div class="detail-box-title">Applicant Profile</div>
          <h3 style="font-size:1.15rem; color:var(--colors-ink); margin-bottom:0.25rem;">
            <a href="/users/${application.userId}" style="color:var(--colors-ink); text-decoration:none;">${this.escapeHtml(userName)}</a>
          </h3>
          ${userEmail ? `<p style="font-size:13.5px; color:var(--colors-muted); margin-bottom:0.5rem;">${this.escapeHtml(userEmail)}</p>` : ''}
          <a href="/users/${application.userId}" class="btn-action-view" style="display:inline-block; margin-top:4px;">View User Profile &rarr;</a>
        </div>

        <div class="detail-box">
          <div class="detail-box-title">Applied Career Opportunity</div>
          <h3 style="font-size:1.15rem; color:var(--colors-ink); margin-bottom:0.25rem;">
            <a href="/job-postings/${application.jobPostingId}" style="color:var(--colors-ink); text-decoration:none;">${this.escapeHtml(jobTitle)}</a>
          </h3>
          ${jobCompany ? `<p style="font-size:13.5px; color:var(--colors-muted); margin-bottom:0.5rem;">🏢 ${this.escapeHtml(jobCompany)}</p>` : ''}
          <a href="/job-postings/${application.jobPostingId}" class="btn-action-view" style="display:inline-block; margin-top:4px;">View Job Listing &rarr;</a>
        </div>
      </div>

      <!-- Resume and Note -->
      <div style="margin-bottom:1.75rem;">
        <h4 style="font-size:14px; font-weight:600; color:var(--colors-muted); text-transform:uppercase; letter-spacing:0.8px; margin-bottom:0.5rem;">Resume Document</h4>
        ${application.resumeUrl ? `
          <div style="padding:12px 16px; background:var(--colors-canvas); border:1px solid var(--colors-hairline); border-radius:var(--rounded-md); display:flex; align-items:center; justify-content:space-between;">
            <span style="font-size:14px; color:var(--colors-ink);">📄 ${this.escapeHtml(application.resumeUrl)}</span>
            <a href="${this.escapeHtml(application.resumeUrl)}" target="_blank" class="btn-clay-secondary" style="padding:6px 14px; font-size:13px;">Open Document &nearr;</a>
          </div>
        ` : `
          <p style="color:var(--colors-muted); font-size:14px;">No resume document provided with this application.</p>
        `}
      </div>

      <div style="margin-bottom:2rem;">
        <h4 style="font-size:14px; font-weight:600; color:var(--colors-muted); text-transform:uppercase; letter-spacing:0.8px; margin-bottom:0.5rem;">Cover Note / Statement</h4>
        <div style="background:var(--colors-canvas); border:1px solid var(--colors-hairline); border-radius:var(--rounded-md); padding:1.25rem 1.5rem; font-size:15px; color:var(--colors-body-strong); line-height:1.6; white-space:pre-wrap;">
          ${this.escapeHtml(application.coverNote || 'No cover statement submitted.')}
        </div>
      </div>

      <!-- Pipeline Status Management -->
      <div style="background:var(--colors-surface-card); border:1px solid var(--colors-hairline); border-radius:var(--rounded-md); padding:1.5rem; margin-bottom:2rem;">
        <h4 style="font-size:14px; font-weight:600; color:var(--colors-ink); margin-bottom:0.75rem;">⚡ Change Pipeline Review Status</h4>
        <div style="display:flex; gap:0.6rem; flex-wrap:wrap;">
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

      <!-- Action Footer -->
      <div style="display:flex; gap:0.75rem; align-items:center; border-top:1px solid var(--colors-hairline); padding-top:1.5rem; flex-wrap:wrap;">
        <a href="/applications/${application.id}/edit" class="btn-clay-secondary btn-edit">✏️ Edit Application</a>
        <form method="POST" action="/applications/${application.id}/delete" style="display:inline;" onsubmit="return confirm('Permanently delete application #${application.id}?');">
          <button type="submit" class="btn-action-delete btn-delete" style="padding:10px 18px; font-size:14px; border-radius:var(--rounded-md);">🗑️ Delete Application</button>
        </form>
        <a href="/applications" class="btn-clay-secondary btn-back">Back to List</a>
      </div>
    </article>
  </main>

  ${sharedLayout.renderFooter()}
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
    ${sharedLayout.getCommonStyles()}
  </style>
</head>
<body>

  ${this.renderNavbar('applications')}

  <main class="page-wrapper" style="max-width:760px;">
    <div style="margin-bottom:1.5rem;">
      <a href="/applications/${application.id}" style="color:var(--colors-ink); text-decoration:none; font-weight:600; font-size:14px; display:inline-flex; align-items:center; gap:6px;">
        &larr; Cancel & Back to Details
      </a>
    </div>

    ${errorMessage ? `<div class="alert-banner alert-danger"><span>⚠️</span> <span>${this.escapeHtml(errorMessage)}</span></div>` : ''}

    <section class="content-card">
      <div class="card-header-bar">
        <h1 class="card-heading" style="font-size:1.5rem;">Edit Application #${application.id}</h1>
      </div>
      <form method="POST" action="/applications/${application.id}/update">
        <div class="form-grid">
          <div class="form-group form-col-full">
            <label class="form-label">Applicant</label>
            <input class="form-input" type="text" value="${userLabel}" disabled style="background:var(--colors-surface-card); color:var(--colors-muted); cursor:not-allowed;">
          </div>

          <div class="form-group form-col-full">
            <label class="form-label">Job Opportunity</label>
            <input class="form-input" type="text" value="${jobLabel}" disabled style="background:var(--colors-surface-card); color:var(--colors-muted); cursor:not-allowed;">
          </div>

          <div class="form-group form-col-full">
            <label class="form-label" for="status">Application Review Status</label>
            <select class="form-select" id="status" name="status">
              <option value="pending" ${application.status === 'pending' ? 'selected' : ''}>Pending</option>
              <option value="reviewing" ${application.status === 'reviewing' ? 'selected' : ''}>Reviewing</option>
              <option value="accepted" ${application.status === 'accepted' ? 'selected' : ''}>Accepted</option>
              <option value="rejected" ${application.status === 'rejected' ? 'selected' : ''}>Rejected</option>
              <option value="withdrawn" ${application.status === 'withdrawn' ? 'selected' : ''}>Withdrawn</option>
            </select>
          </div>

          <div class="form-group form-col-full">
            <label class="form-label" for="resumeUrl">Resume Document URL</label>
            <input class="form-input" type="url" id="resumeUrl" name="resumeUrl" value="${this.escapeHtml(application.resumeUrl || '')}" placeholder="https://cdn.example.com/resumes/cv.pdf">
          </div>

          <div class="form-group form-col-full">
            <label class="form-label" for="coverNote">Cover Note</label>
            <textarea class="form-textarea" id="coverNote" name="coverNote" rows="4">${this.escapeHtml(application.coverNote || '')}</textarea>
          </div>
        </div>

        <div style="display:flex; gap:1rem; align-items:center; margin-top:1.75rem;">
          <button type="submit" class="btn-clay-primary">Save Changes</button>
          <a href="/applications/${application.id}" class="btn-clay-secondary">Cancel</a>
        </div>
      </form>
    </section>
  </main>

  ${sharedLayout.renderFooter()}
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
    ${sharedLayout.getCommonStyles()}
  </style>
</head>
<body>
  ${this.renderNavbar('applications')}

  <main class="page-wrapper" style="display:flex; align-items:center; justify-content:center;">
    <div class="content-card" style="max-width:520px; width:100%; text-align:center; padding:3rem 2rem;">
      <h1 class="page-title" style="color:var(--colors-error); font-size:3rem; margin:0 0 0.5rem 0;">${statusCode}</h1>
      <h2 style="font-size:1.25rem; color:var(--colors-ink); margin-bottom:1rem;">Action Failed</h2>
      <p style="color:var(--colors-body); margin-bottom:1.75rem; font-size:15px;">${this.escapeHtml(message)}</p>
      <a href="/applications" class="btn-clay-primary">Return to Applications</a>
    </div>
  </main>

  ${sharedLayout.renderFooter()}
</body>
</html>`;
  }
};

module.exports = applicationView;
