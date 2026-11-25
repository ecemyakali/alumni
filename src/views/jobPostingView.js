/**
 * ========================================================
 * View Layer: JobPosting View (JobPostingView) - Tactile SaaS Design
 * File: src/views/jobPostingView.js
 * ========================================================
 * 
 * Dedicated View Layer for Career & Job Opportunities management.
 * Generates semantic, responsive, tactile B2B SaaS HTML views:
 * 1. READ ALL & CREATE: Career Board, metrics, filter, & posting form (GET /job-postings)
 * 2. READ ONE: Full job posting detail view with inline "Quick Apply" & applications received (GET /job-postings/:id)
 * 3. UPDATE: Pre-filled job posting edit form (GET /job-postings/:id/edit)
 * 4. DELETE: Row-level form delete actions with confirmation
 * 5. ERRORS: Semantic 400 and 404 pages
 */

const sharedLayout = require('./sharedLayout');

const jobPostingView = {
  /**
   * Escape HTML utility to prevent XSS
   */
  escapeHtml(str) {
    return sharedLayout.escapeHtml(str);
  },

  /**
   * Global Navigation Header
   */
  renderNavbar(activePage = 'jobs', currentUser = null) {
    return sharedLayout.renderNavbar(activePage, currentUser);
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
          <td><span class="badge-pill badge-id">#${j.id}</span></td>
          <td>
            <a href="/job-postings/${j.id}" class="title-link" style="color:var(--colors-ink); text-decoration:none; font-weight:600;">
              ${this.escapeHtml(j.title)}
            </a>
            <div style="font-size:12.5px; color:var(--colors-muted); margin-top:2px;">🏢 ${this.escapeHtml(j.company)}</div>
          </td>
          <td><span class="badge-pill" style="background:var(--colors-surface-card); color:var(--colors-body-strong);">📍 ${this.escapeHtml(j.location || 'Remote')}</span></td>
          <td><span class="badge-pill ${typeClass}">${this.escapeHtml(j.type || 'full-time')}</span></td>
          <td><span style="font-weight:600; color:var(--colors-body-strong); font-size:13.5px;">${this.escapeHtml(j.salary || 'Competitive')}</span></td>
          <td>
            <div style="display:flex; gap:6px; flex-wrap:wrap;">
              <a href="/job-postings/${j.id}" class="btn-action-view btn-view">View</a>
              <a href="/applications?jobPostingId=${j.id}" class="btn-action-view btn-apply" style="background:#e0f2fe; color:#0369a1; border-color:#bae6fd;" title="Apply for this role">Apply</a>
              <a href="/job-postings/${j.id}/edit" class="btn-action-edit btn-edit">Edit</a>
              <form method="POST" action="/job-postings/${j.id}/delete" style="display:inline;" onsubmit="return confirm('Delete job posting #${j.id}?');">
                <button type="submit" class="btn-action-delete btn-delete">Delete</button>
              </form>
            </div>
          </td>
        </tr>
      `;
      }).join('')
      : `<tr><td colspan="6" style="text-align:center; color:var(--colors-muted); padding:2rem;">No job opportunities posted yet. Use the form below to share an opportunity!</td></tr>`;

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Career Opportunities - Alumni Tracking System</title>
  <style>
    ${sharedLayout.getCommonStyles()}

    .stats-kpi-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(210px, 1fr));
      gap: 1.25rem;
      margin-bottom: 2rem;
    }
    .kpi-card {
      background: #ffffff;
      border: 1px solid var(--hairline);
      border-radius: var(--rounded-lg);
      padding: 1.5rem;
      box-shadow: 0 4px 20px -2px rgba(0, 0, 0, 0.05), 0 2px 6px -1px rgba(0, 0, 0, 0.03);
      transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .kpi-card:hover {
      border-color: var(--brand-mint-border);
      transform: translateY(-2px);
      box-shadow: 0 12px 28px -4px rgba(13, 147, 115, 0.09);
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
      border: 1px solid var(--hairline);
      border-radius: var(--rounded-lg);
      padding: 1rem 1.25rem;
      margin-bottom: 1.75rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 1rem;
      box-shadow: 0 4px 16px -2px rgba(0, 0, 0, 0.04);
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

    .badge-type-full-time { background: #dbeafe; color: #1d4ed8; }
    .badge-type-part-time { background: #e0e7ff; color: #4338ca; }
    .badge-type-internship { background: #fef3c7; color: #b45309; }
    .badge-type-remote { background: #dcfce7; color: #15803d; }
    .badge-type-contract { background: #ffedd5; color: #c2410c; }
  </style>
</head>
<body>

  ${this.renderNavbar('jobs', options.currentUser)}

  <main class="page-wrapper">
    <div class="page-header-band">
      <div>
        <div class="page-header-pill">
          <span>💼 Career & Talent Marketplace</span>
        </div>
        <h1 class="page-title">Career Opportunities Board</h1>
        <p class="page-subtitle">
          Discover and share professional opportunities across the alumni network.
        </p>
      </div>
      <div>
        <a href="#post-job" class="btn-clay-primary">+ Post Opportunity</a>
      </div>
    </div>

    ${successMessage ? `<div class="alert-banner alert-success"><span>✅</span> <span>${this.escapeHtml(successMessage)}</span></div>` : ''}
    ${errorMessage ? `<div class="alert-banner alert-danger"><span>⚠️</span> <span>${this.escapeHtml(errorMessage)}</span></div>` : ''}

    <!-- KPI Metric Cards -->
    <div class="stats-kpi-grid">
      <div class="kpi-card">
        <div class="kpi-value" style="color:var(--colors-ink);">${totalJobs}</div>
        <div class="kpi-title">Total Listings</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-value" style="color:var(--colors-success);">${remoteCount}</div>
        <div class="kpi-title">Remote / Hybrid</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-value" style="color:var(--colors-brand-blue);">${fullTimeCount}</div>
        <div class="kpi-title">Full-Time Roles</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-value" style="color:var(--colors-brand-lavender);">${appCount}</div>
        <div class="kpi-title">Total Applications</div>
      </div>
    </div>

    <!-- Filter & Search Toolbar -->
    <div class="filter-panel">
      <div class="search-box-wrap">
        <span class="search-icon-symbol">🔍</span>
        <input type="text" id="jobSearch" class="search-input-field" placeholder="Search by title, company, skills, or location...">
      </div>
      <div class="filter-pills-row">
        <button type="button" class="filter-pill active" data-filter="all">All Roles</button>
        <button type="button" class="filter-pill" data-filter="full-time">Full-Time</button>
        <button type="button" class="filter-pill" data-filter="contract">Contract</button>
        <button type="button" class="filter-pill" data-filter="internship">Internship</button>
        <button type="button" class="filter-pill" data-filter="remote">Remote</button>
      </div>
    </div>

    <!-- Active Listings Table Card -->
    <section class="content-card">
      <div class="card-header-bar">
        <h2 class="card-heading">Active Career Listings</h2>
        <span class="badge-pill badge-id">${totalJobs} Opportunities</span>
      </div>
      <div class="table-container">
        <table id="jobsTable" class="data-table">
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
    </section>

    <!-- Share New Opportunity Form Card -->
    <section class="content-card" id="post-job">
      <div class="card-header-bar">
        <h2 class="card-heading">Share a New Career Opportunity</h2>
      </div>
      <form method="POST" action="/job-postings">
        <div class="form-grid">
          <div class="form-group">
            <label class="form-label" for="title">Position Title *</label>
            <input class="form-input" type="text" id="title" name="title" required maxlength="120" placeholder="e.g. Senior Backend Engineer (Max 120 chars)">
          </div>
          <div class="form-group">
            <label class="form-label" for="company">Company / Organization *</label>
            <input class="form-input" type="text" id="company" name="company" required placeholder="e.g. TechCorp Solutions">
          </div>
          <div class="form-group">
            <label class="form-label" for="city">City (Optional)</label>
            <input class="form-input" type="text" id="city" name="city" placeholder="e.g. Istanbul, Ankara">
          </div>
          <div class="form-group">
            <label class="form-label" for="location">Location / Work Policy (Optional)</label>
            <input class="form-input" type="text" id="location" name="location" placeholder="e.g. Remote or Hybrid">
          </div>
          <div class="form-group">
            <label class="form-label" for="type">Employment Type</label>
            <select class="form-select" id="type" name="type">
              <option value="full-time" selected>Full-Time</option>
              <option value="part-time">Part-Time</option>
              <option value="contract">Contract</option>
              <option value="internship">Internship</option>
              <option value="remote">Remote</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label" for="salary">Compensation / Salary Range</label>
            <input class="form-input" type="text" id="salary" name="salary" placeholder="e.g. $80,000 - $100,000 / Competitive">
          </div>
          <div class="form-group">
            <label class="form-label" for="contactEmail">Contact / Application Email</label>
            <input class="form-input" type="email" id="contactEmail" name="contactEmail" placeholder="e.g. careers@techcorp.com">
          </div>
          <div class="form-group form-col-full">
            <label class="form-label" for="requirements">Requirements & Skills</label>
            <input class="form-input" type="text" id="requirements" name="requirements" placeholder="e.g. Node.js, Express, PostgreSQL, Docker, Git">
          </div>
          <div class="form-group form-col-full">
            <label class="form-label" for="description">Role Description (Optional)</label>
            <textarea class="form-textarea" id="description" name="description" rows="4" placeholder="Describe key responsibilities, team impact, and day-to-day work (Optional)..."></textarea>
          </div>
        </div>
        <div style="margin-top:1.5rem;">
          <button type="submit" class="btn-clay-primary">Publish Career Opportunity</button>
        </div>
      </form>
    </section>
  </main>

  ${sharedLayout.renderFooter()}

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
          <td><span class="badge-pill badge-id">#${app.id}</span></td>
          <td>
            <a href="/users/${app.userId}" style="color:var(--colors-ink); text-decoration:none; font-weight:600;">
              User #${app.userId}
            </a>
          </td>
          <td><span class="badge-pill ${statusBadge}">${this.escapeHtml(app.status || 'pending')}</span></td>
          <td>
            ${app.resumeUrl ? `<a href="${this.escapeHtml(app.resumeUrl)}" target="_blank" style="color:var(--colors-brand-blue); text-decoration:none; font-weight:500;">📄 Resume</a>` : '<span style="color:var(--colors-muted);">-</span>'}
          </td>
          <td><small style="color:var(--colors-body);">${this.escapeHtml(app.coverNote || '-')}</small></td>
          <td><small style="color:var(--colors-muted);">${app.createdAt ? new Date(app.createdAt).toLocaleDateString() : 'N/A'}</small></td>
          <td>
            <a href="/applications/${app.id}" class="btn-action-view btn-view">Review</a>
          </td>
        </tr>
      `;
      }).join('')
      : `<tr><td colspan="7" style="text-align:center; color:var(--colors-muted); padding:2rem;">No applications received for this position yet. Be the first to apply below!</td></tr>`;

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
    ${sharedLayout.getCommonStyles()}

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

    .content-box-tactile {
      background: var(--colors-canvas);
      padding: 1.25rem 1.5rem;
      border-radius: var(--rounded-md);
      border: 1px solid var(--colors-hairline);
      white-space: pre-wrap;
      font-size: 15px;
      color: var(--colors-body-strong);
      line-height: 1.6;
    }
  </style>
</head>
<body>

  ${this.renderNavbar('jobs', options.currentUser)}

  <main class="page-wrapper" style="max-width:960px;">
    <div style="margin-bottom:1.5rem;">
      <a href="/job-postings" style="color:var(--colors-ink); text-decoration:none; font-weight:600; font-size:14px; display:inline-flex; align-items:center; gap:6px;">
        &larr; Back to Career Opportunities
      </a>
    </div>

    ${successMessage ? `<div class="alert-banner alert-success"><span>✅</span> <span>${this.escapeHtml(successMessage)}</span></div>` : ''}

    <article class="content-card">
      <div style="border-bottom:1px solid var(--colors-hairline); padding-bottom:1.5rem; margin-bottom:1.75rem;">
        <h1 class="page-title" style="margin-bottom:0.75rem;">${this.escapeHtml(job.title)}</h1>
        <div style="display:flex; flex-wrap:wrap; gap:0.6rem; align-items:center; color:var(--colors-muted); font-size:14px;">
          <strong style="color:var(--colors-ink);">🏢 ${this.escapeHtml(job.company)}</strong>
          <span>•</span>
          <span>📍 ${this.escapeHtml(job.location || 'Remote')}</span>
          <span>•</span>
          <span class="badge-pill ${typeClass}">${this.escapeHtml(job.type || 'full-time')}</span>
          ${job.salary ? `<span>• 💰 ${this.escapeHtml(job.salary)}</span>` : ''}
          <span>• 🗓️ Posted ${job.createdAt ? new Date(job.createdAt).toLocaleDateString() : 'Recently'}</span>
        </div>
      </div>

      <h3 style="font-size:1.1rem; font-weight:600; margin-bottom:0.5rem; color:var(--colors-ink);">Role Description</h3>
      <div class="content-box-tactile">${this.escapeHtml(job.description)}</div>

      ${job.requirements ? `
        <h3 style="font-size:1.1rem; font-weight:600; margin-top:1.5rem; margin-bottom:0.5rem; color:var(--colors-ink);">Requirements & Qualifications</h3>
        <div class="content-box-tactile">${this.escapeHtml(job.requirements)}</div>
      ` : ''}

      ${job.contactEmail ? `
        <h3 style="font-size:1.1rem; font-weight:600; margin-top:1.5rem; margin-bottom:0.5rem; color:var(--colors-ink);">Application Inquiries</h3>
        <p style="font-size:14.5px; color:var(--colors-body);">
          Direct inquiries: <a href="mailto:${this.escapeHtml(job.contactEmail)}" style="color:var(--colors-brand-blue); font-weight:600; text-decoration:none;">${this.escapeHtml(job.contactEmail)}</a>
        </p>
      ` : ''}

      <div style="display:flex; gap:0.75rem; margin-top:2rem; padding-top:1.5rem; border-top:1px solid var(--colors-hairline); flex-wrap:wrap; align-items:center;">
        <a href="#quick-apply" class="btn-clay-primary">🚀 Apply for this Role</a>
        <a href="/job-postings/${job.id}/edit" class="btn-clay-secondary">✏️ Edit Opportunity</a>
        <form method="POST" action="/job-postings/${job.id}/delete" onsubmit="return confirm('Delete this job posting?');" style="display:inline;">
          <button type="submit" class="btn-action-delete" style="padding:10px 18px; font-size:14px; border-radius:var(--rounded-md);">🗑️ Delete</button>
        </form>
      </div>
    </article>

    <!-- Quick Application Form Section -->
    <section class="content-card" id="quick-apply">
      <div class="card-header-bar">
        <div>
          <h2 class="card-heading">🚀 Apply for this Position</h2>
          <p style="color:var(--colors-body); font-size:13.5px; margin-top:4px;">
            Submit your application directly for <strong>${this.escapeHtml(job.title)}</strong> at <strong>${this.escapeHtml(job.company)}</strong>.
          </p>
        </div>
      </div>

      <form method="POST" action="/applications">
        <input type="hidden" name="jobPostingId" value="${job.id}">
        
        <div class="form-grid">
          <div class="form-group">
            <label class="form-label" for="userId">Applicant (Alumni User) *</label>
            ${userOptions ? `
              <select class="form-select" id="userId" name="userId" required>
                <option value="">Select your alumni profile...</option>
                ${userOptions}
              </select>
            ` : `
              <input class="form-input" type="number" id="userId" name="userId" required placeholder="Enter your User ID (e.g. 1)" min="1">
            `}
          </div>

          <div class="form-group">
            <label class="form-label" for="resumeUrl">Resume / Portfolio Link (URL)</label>
            <input class="form-input" type="url" id="resumeUrl" name="resumeUrl" placeholder="https://cdn.example.com/cv.pdf">
          </div>

          <div class="form-group form-col-full">
            <label class="form-label" for="coverNote">Cover Note / Statement of Interest</label>
            <textarea class="form-textarea" id="coverNote" name="coverNote" rows="3" placeholder="Highlight relevant skills, achievements, and why you are interested in this position..."></textarea>
          </div>
        </div>

        <div style="margin-top:1.5rem;">
          <button type="submit" class="btn-clay-primary">Submit Application</button>
        </div>
      </form>
    </section>

    <!-- Received Applications for this Job -->
    <section class="content-card">
      <div class="card-header-bar">
        <h2 class="card-heading">📋 Received Applications</h2>
        <span class="badge-pill badge-id">${applications.length} Applicants</span>
      </div>
      <div class="table-container">
        <table class="data-table">
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
    </section>
  </main>

  ${sharedLayout.renderFooter()}
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
    ${sharedLayout.getCommonStyles()}
  </style>
</head>
<body>

  ${this.renderNavbar('jobs', options.currentUser)}

  <main class="page-wrapper" style="max-width:820px;">
    <div style="margin-bottom:1.5rem;">
      <a href="/job-postings/${job.id}" style="color:var(--colors-ink); text-decoration:none; font-weight:600; font-size:14px; display:inline-flex; align-items:center; gap:6px;">
        &larr; Cancel & Back to Details
      </a>
    </div>

    ${errorMessage ? `<div class="alert-banner alert-danger"><span>⚠️</span> <span>${this.escapeHtml(errorMessage)}</span></div>` : ''}

    <section class="content-card">
      <div class="card-header-bar">
        <h1 class="card-heading" style="font-size:1.5rem;">Edit Job Posting: ${this.escapeHtml(job.title)}</h1>
      </div>
      <form method="POST" action="/job-postings/${job.id}/update">
        <div class="form-grid">
          <div class="form-group">
            <label class="form-label" for="title">Position Title *</label>
            <input class="form-input" type="text" id="title" name="title" value="${this.escapeHtml(job.title)}" required maxlength="120">
          </div>
          <div class="form-group">
            <label class="form-label" for="company">Company / Organization *</label>
            <input class="form-input" type="text" id="company" name="company" value="${this.escapeHtml(job.company)}" required>
          </div>
          <div class="form-group">
            <label class="form-label" for="city">City (Optional)</label>
            <input class="form-input" type="text" id="city" name="city" value="${this.escapeHtml(job.city || '')}" placeholder="e.g. Istanbul">
          </div>
          <div class="form-group">
            <label class="form-label" for="location">Location / Work Policy (Optional)</label>
            <input class="form-input" type="text" id="location" name="location" value="${this.escapeHtml(job.location || '')}">
          </div>
          <div class="form-group">
            <label class="form-label" for="type">Employment Type</label>
            <select class="form-select" id="type" name="type">
              <option value="full-time" ${job.type === 'full-time' ? 'selected' : ''}>Full-Time</option>
              <option value="part-time" ${job.type === 'part-time' ? 'selected' : ''}>Part-Time</option>
              <option value="contract" ${job.type === 'contract' ? 'selected' : ''}>Contract</option>
              <option value="internship" ${job.type === 'internship' ? 'selected' : ''}>Internship</option>
              <option value="remote" ${job.type === 'remote' ? 'selected' : ''}>Remote</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label" for="salary">Compensation / Salary Range</label>
            <input class="form-input" type="text" id="salary" name="salary" value="${this.escapeHtml(job.salary || '')}">
          </div>
          <div class="form-group">
            <label class="form-label" for="contactEmail">Contact / Application Email</label>
            <input class="form-input" type="email" id="contactEmail" name="contactEmail" value="${this.escapeHtml(job.contactEmail || '')}">
          </div>
          <div class="form-group form-col-full">
            <label class="form-label" for="requirements">Requirements & Skills</label>
            <input class="form-input" type="text" id="requirements" name="requirements" value="${this.escapeHtml(job.requirements || '')}">
          </div>
          <div class="form-group form-col-full">
            <label class="form-label" for="description">Role Description (Optional)</label>
            <textarea class="form-textarea" id="description" name="description" rows="5">${this.escapeHtml(job.description || '')}</textarea>
          </div>
        </div>
        <div style="display:flex; gap:1rem; align-items:center; margin-top:1.75rem;">
          <button type="submit" class="btn-clay-primary">Save Changes</button>
          <a href="/job-postings/${job.id}" class="btn-clay-secondary">Cancel</a>
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
  ${this.renderNavbar('jobs', options.currentUser)}

  <main class="page-wrapper" style="display:flex; align-items:center; justify-content:center;">
    <div class="content-card" style="max-width:520px; width:100%; text-align:center; padding:3rem 2rem;">
      <h1 class="page-title" style="color:var(--colors-error); font-size:3rem; margin:0 0 0.5rem 0;">${statusCode}</h1>
      <h2 style="font-size:1.25rem; color:var(--colors-ink); margin-bottom:1rem;">Action Failed</h2>
      <p style="color:var(--colors-body); margin-bottom:1.75rem; font-size:15px;">${this.escapeHtml(message)}</p>
      <a href="/job-postings" class="btn-clay-primary">Return to Career Board</a>
    </div>
  </main>

  ${sharedLayout.renderFooter()}
</body>
</html>`;
  }
};

module.exports = jobPostingView;
