/**
 * ========================================================
 * View Layer: JobPosting View (JobPostingView)
 * File: src/views/jobPostingView.js
 * ========================================================
 * 
 * Dedicated View Layer for Career & Job Opportunities management.
 * Generates semantic, responsive HTML views for:
 * 1. READ ALL & CREATE: Job board & submission form (GET /job-postings)
 * 2. READ ONE: Full job posting detail view (GET /job-postings/:id)
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
   * Renders the complete HTML Job Postings Board page
   * 
   * @param {Array<Object>} jobPostings - List of job posting models
   * @param {Object} [options] - Options (successMessage, errorMessage)
   * @returns {string} Formatted HTML document
   */
  renderJobPostingsList(jobPostings = [], options = {}) {
    const { successMessage = null, errorMessage = null } = options;

    const rows = jobPostings.length > 0
      ? jobPostings.map(j => {
        const typeClass = `badge-type-${(j.type || 'full-time').toLowerCase().replace(/\s+/g, '-')}`;
        return `
        <tr>
          <td><span class="badge badge-id">#${j.id}</span></td>
          <td>
            <a href="/job-postings/${j.id}" class="title-link">
              <strong>${this.escapeHtml(j.title)}</strong>
            </a>
          </td>
          <td>${this.escapeHtml(j.company)}</td>
          <td><span class="badge badge-location">${this.escapeHtml(j.location || 'Remote')}</span></td>
          <td><span class="badge ${typeClass}">${this.escapeHtml(j.type || 'full-time')}</span></td>
          <td><small class="text-muted">${this.escapeHtml(j.salary || 'Competitive')}</small></td>
          <td class="action-cell">
            <a href="/job-postings/${j.id}" class="btn-sm btn-view">View</a>
            <a href="/job-postings/${j.id}/edit" class="btn-sm btn-edit">Edit</a>
            <form method="POST" action="/job-postings/${j.id}/delete" style="display:inline;" onsubmit="return confirm('Delete job posting #${j.id}?');">
              <button type="submit" class="btn-sm btn-delete">Delete</button>
            </form>
          </td>
        </tr>
      `;
      }).join('')
      : `<tr><td colspan="7" class="text-center text-muted py-4">No job opportunities posted yet. Use the form below to share an opportunity!</td></tr>`;

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
      --bg: #f8fafc;
      --card-bg: #ffffff;
      --text: #0f172a;
      --text-muted: #64748b;
      --border: #e2e8f0;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      background: var(--bg);
      color: var(--text);
      line-height: 1.5;
      padding: 2rem 1rem;
    }
    .container { max-width: 1100px; margin: 0 auto; }
    header {
      margin-bottom: 2rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 1rem;
      border-bottom: 1px solid var(--border);
      padding-bottom: 1.5rem;
    }
    h1 { font-size: 1.875rem; font-weight: 700; color: #1e293b; }
    .nav-links a {
      color: var(--primary);
      text-decoration: none;
      font-weight: 500;
      margin-left: 1rem;
    }
    .nav-links a:hover { text-decoration: underline; }
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
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
      border: 1px solid var(--border);
      margin-bottom: 2rem;
      overflow: hidden;
    }
    .card-header {
      padding: 1.25rem 1.5rem;
      background: #f1f5f9;
      border-bottom: 1px solid var(--border);
      font-weight: 600;
      color: #334155;
    }
    .card-body { padding: 1.5rem; }
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
    td { padding: 1rem; border-bottom: 1px solid var(--border); font-size: 0.875rem; vertical-align: middle; }
    tr:hover td { background: #f8fafc; }
    .title-link { color: #1e293b; text-decoration: none; }
    .title-link:hover { color: var(--primary); }
    .badge {
      display: inline-block;
      padding: 0.25rem 0.5rem;
      border-radius: 9999px;
      font-size: 0.75rem;
      font-weight: 600;
    }
    .badge-id { background: #e2e8f0; color: #475569; }
    .badge-location { background: #f3e8ff; color: #7e22ce; }
    .badge-type-full-time { background: #dbeafe; color: #1d4ed8; }
    .badge-type-part-time { background: #e0e7ff; color: #4338ca; }
    .badge-type-internship { background: #fef3c7; color: #b45309; }
    .badge-type-remote { background: #dcfce7; color: #15803d; }
    .badge-type-contract { background: #ffedd5; color: #c2410c; }
    .action-cell { white-space: nowrap; }
    .btn-sm {
      display: inline-block;
      padding: 0.35rem 0.65rem;
      font-size: 0.75rem;
      font-weight: 600;
      border-radius: 6px;
      text-decoration: none;
      cursor: pointer;
      border: 1px solid transparent;
      margin-right: 0.25rem;
    }
    .btn-view { background: #f1f5f9; color: #334155; }
    .btn-view:hover { background: #e2e8f0; }
    .btn-edit { background: #e0e7ff; color: #3730a3; }
    .btn-edit:hover { background: #c7d2fe; }
    .btn-delete { background: #fee2e2; color: #991b1b; }
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
      padding: 0.65rem 0.85rem;
      border: 1px solid var(--border);
      border-radius: 6px;
      font-size: 0.875rem;
      font-family: inherit;
    }
    input:focus, select:focus, textarea:focus {
      outline: none;
      border-color: var(--primary);
      box-shadow: 0 0 0 3px rgba(37,99,235,0.1);
    }
    .btn-submit {
      background: var(--primary);
      color: white;
      font-weight: 600;
      padding: 0.75rem 1.5rem;
      border-radius: 6px;
      border: none;
      cursor: pointer;
      font-size: 0.875rem;
    }
    .btn-submit:hover { background: var(--primary-hover); }
    .text-center { text-align: center; }
    .py-4 { padding-top: 2rem; padding-bottom: 2rem; }
  </style>
</head>
<body>
  <div class="container">
    <header>
      <div>
        <h1>💼 Career Opportunities Board</h1>
        <p style="color: var(--text-muted); font-size: 0.875rem; margin-top: 0.25rem;">
          Discover and share professional opportunities across the alumni network.
        </p>
      </div>
      <div class="nav-links">
        <a href="/users">👥 Alumni Directory</a>
        <a href="/announcements">📢 Announcements</a>
        <a href="/api/job-postings" target="_blank">🌐 REST API</a>
        <a href="/api/swagger" target="_blank">📘 Swagger Docs</a>
      </div>
    </header>

    ${successMessage ? `<div class="alert alert-success">${this.escapeHtml(successMessage)}</div>` : ''}
    ${errorMessage ? `<div class="alert alert-danger">${this.escapeHtml(errorMessage)}</div>` : ''}

    <div class="card">
      <div class="card-header">
        Active Career Listings (${jobPostings.length})
      </div>
      <div class="card-body" style="padding: 0; overflow-x: auto;">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Position Title</th>
              <th>Company</th>
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

    <div class="card">
      <div class="card-header">
        ➕ Post a Career Opportunity
      </div>
      <div class="card-body">
        <form method="POST" action="/job-postings">
          <div class="form-grid">
            <div class="form-group">
              <label for="title">Position Title *</label>
              <input type="text" id="title" name="title" placeholder="e.g. Senior Backend Engineer" required>
            </div>
            <div class="form-group">
              <label for="company">Company / Organization *</label>
              <input type="text" id="company" name="company" placeholder="e.g. Acme Tech Solutions" required>
            </div>
            <div class="form-group">
              <label for="location">Location</label>
              <input type="text" id="location" name="location" placeholder="e.g. Istanbul / Remote" value="Remote">
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
              <label for="salary">Salary / Compensation</label>
              <input type="text" id="salary" name="salary" placeholder="e.g. $80,000 - $100,000 or Competitive">
            </div>
            <div class="form-group">
              <label for="contactEmail">Contact / Application Email</label>
              <input type="email" id="contactEmail" name="contactEmail" placeholder="careers@company.com">
            </div>
            <div class="form-group full-width">
              <label for="description">Role Description *</label>
              <textarea id="description" name="description" rows="4" placeholder="Overview of responsibilities and day-to-day duties..." required></textarea>
            </div>
            <div class="form-group full-width">
              <label for="requirements">Key Requirements / Qualifications</label>
              <textarea id="requirements" name="requirements" rows="3" placeholder="Key skills, tech stack, and background prerequisites..."></textarea>
            </div>
          </div>
          <button type="submit" class="btn-submit">Publish Job Opportunity</button>
        </form>
      </div>
    </div>
  </div>
</body>
</html>`;
  },

  /**
   * Renders single job posting detail view
   * 
   * @param {Object} job - JobPosting entity
   * @param {Object} [options] - Options (successMessage, errorMessage)
   * @returns {string} Formatted HTML document
   */
  renderJobPostingDetail(job, options = {}) {
    if (!job) return this.renderError('Job posting not found', { statusCode: 404 });
    const { successMessage = null } = options;
    const typeClass = `badge-type-${(job.type || 'full-time').toLowerCase().replace(/\s+/g, '-')}`;

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${this.escapeHtml(job.title)} - Career Details</title>
  <style>
    :root {
      --primary: #2563eb;
      --bg: #f8fafc;
      --card-bg: #ffffff;
      --text: #0f172a;
      --text-muted: #64748b;
      --border: #e2e8f0;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      background: var(--bg);
      color: var(--text);
      line-height: 1.6;
      padding: 2rem 1rem;
    }
    .container { max-width: 800px; margin: 0 auto; }
    .card {
      background: var(--card-bg);
      border-radius: 12px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
      border: 1px solid var(--border);
      padding: 2rem;
      margin-top: 1.5rem;
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
      padding: 0.25rem 0.5rem;
      border-radius: 9999px;
      font-size: 0.75rem;
      font-weight: 600;
    }
    .badge-type-full-time { background: #dbeafe; color: #1d4ed8; }
    .badge-type-part-time { background: #e0e7ff; color: #4338ca; }
    .badge-type-internship { background: #fef3c7; color: #b45309; }
    .badge-type-remote { background: #dcfce7; color: #15803d; }
    .badge-type-contract { background: #ffedd5; color: #c2410c; }
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
    }
    .actions {
      display: flex;
      gap: 0.75rem;
      margin-top: 2rem;
      padding-top: 1.5rem;
      border-top: 1px solid var(--border);
    }
    .btn {
      padding: 0.6rem 1.2rem;
      border-radius: 6px;
      font-weight: 600;
      text-decoration: none;
      font-size: 0.875rem;
      cursor: pointer;
      border: none;
    }
    .btn-primary { background: var(--primary); color: white; }
    .btn-secondary { background: #e2e8f0; color: #334155; }
    .btn-danger { background: #fee2e2; color: #991b1b; }
    .alert-success { background: #dcfce7; color: #15803d; padding: 1rem; border-radius: 8px; margin-bottom: 1rem; }
  </style>
</head>
<body>
  <div class="container">
    <a href="/job-postings" style="color: var(--primary); text-decoration: none; font-weight: 600;">&larr; Back to Job Postings</a>

    ${successMessage ? `<div class="alert-success" style="margin-top: 1rem;">${this.escapeHtml(successMessage)}</div>` : ''}

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
        <p>Direct inquiries: <a href="mailto:${this.escapeHtml(job.contactEmail)}" style="color: var(--primary); font-weight: 600;">${this.escapeHtml(job.contactEmail)}</a></p>
      ` : ''}

      <div class="actions">
        <a href="/job-postings/${job.id}/edit" class="btn btn-secondary">✏️ Edit Opportunity</a>
        <form method="POST" action="/job-postings/${job.id}/delete" onsubmit="return confirm('Delete this job posting?');" style="display:inline;">
          <button type="submit" class="btn btn-danger">🗑️ Delete</button>
        </form>
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
      --bg: #f8fafc;
      --card-bg: #ffffff;
      --text: #0f172a;
      --border: #e2e8f0;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      background: var(--bg);
      color: var(--text);
      line-height: 1.5;
      padding: 2rem 1rem;
    }
    .container { max-width: 800px; margin: 0 auto; }
    .card {
      background: var(--card-bg);
      border-radius: 12px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
      border: 1px solid var(--border);
      padding: 2rem;
      margin-top: 1.5rem;
    }
    h1 { font-size: 1.5rem; margin-bottom: 1.5rem; color: #1e293b; }
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
      padding: 0.65rem 0.85rem;
      border: 1px solid var(--border);
      border-radius: 6px;
      font-size: 0.875rem;
      font-family: inherit;
    }
    .actions { display: flex; gap: 1rem; margin-top: 1.5rem; }
    .btn {
      padding: 0.75rem 1.5rem;
      border-radius: 6px;
      font-weight: 600;
      text-decoration: none;
      font-size: 0.875rem;
      cursor: pointer;
      border: none;
    }
    .btn-primary { background: var(--primary); color: white; }
    .btn-secondary { background: #e2e8f0; color: #334155; }
    .alert-danger { background: #fee2e2; color: #b91c1c; padding: 1rem; border-radius: 8px; margin-bottom: 1rem; }
  </style>
</head>
<body>
  <div class="container">
    <a href="/job-postings/${job.id}" style="color: var(--primary); text-decoration: none; font-weight: 600;">&larr; Cancel and View Details</a>

    <div class="card">
      <h1>✏️ Edit Job Posting #${job.id}</h1>

      ${errorMessage ? `<div class="alert-danger">${this.escapeHtml(errorMessage)}</div>` : ''}

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
            <input type="text" id="location" name="location" value="${this.escapeHtml(job.location || 'Remote')}">
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
            <label for="salary">Salary / Compensation</label>
            <input type="text" id="salary" name="salary" value="${this.escapeHtml(job.salary || '')}">
          </div>
          <div class="form-group">
            <label for="contactEmail">Contact / Application Email</label>
            <input type="email" id="contactEmail" name="contactEmail" value="${this.escapeHtml(job.contactEmail || '')}">
          </div>
          <div class="form-group full-width">
            <label for="description">Role Description *</label>
            <textarea id="description" name="description" rows="5" required>${this.escapeHtml(job.description || '')}</textarea>
          </div>
          <div class="form-group full-width">
            <label for="requirements">Key Requirements / Qualifications</label>
            <textarea id="requirements" name="requirements" rows="3">${this.escapeHtml(job.requirements || '')}</textarea>
          </div>
        </div>
        <div class="actions">
          <button type="submit" class="btn btn-primary">Save Changes</button>
          <a href="/job-postings/${job.id}" class="btn btn-secondary">Cancel</a>
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
  renderError(message = 'An unexpected error occurred', options = {}) {
    const { statusCode = 400 } = options;
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Error ${statusCode} - Alumni Tracking System</title>
  <style>
    body { font-family: sans-serif; background: #f8fafc; color: #1e293b; padding: 3rem 1rem; text-align: center; }
    .card { max-width: 500px; margin: 0 auto; background: white; padding: 2rem; border-radius: 12px; border: 1px solid #e2e8f0; }
    h1 { color: #dc2626; font-size: 2rem; margin-bottom: 0.5rem; }
    p { color: #64748b; margin-bottom: 1.5rem; }
    a { color: #2563eb; text-decoration: none; font-weight: 600; }
  </style>
</head>
<body>
  <div class="card">
    <h1>Error ${statusCode}</h1>
    <p>${this.escapeHtml(message)}</p>
    <a href="/job-postings">&larr; Return to Career Board</a>
  </div>
</body>
</html>`;
  }
};

module.exports = jobPostingView;
