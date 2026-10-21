/**
 * ========================================================
 * View Layer: Application View (ApplicationView)
 * File: src/views/applicationView.js
 * ========================================================
 * 
 * Dedicated View Layer for Job Application (Many-to-Many Relational) management.
 * Generates semantic, responsive HTML views for:
 * 1. READ ALL & CREATE: Application listing & submission form (GET /applications)
 * 2. READ ONE: Full application detail card (GET /applications/:id)
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
   * @param {Object} [options] - Options (successMessage, errorMessage)
   * @returns {string} Formatted HTML document
   */
  renderApplicationsList(applications = [], options = {}) {
    const { successMessage = null, errorMessage = null } = options;

    const rows = applications.length > 0
      ? applications.map(app => {
        const badgeClass = this.getStatusBadgeClass(app.status);
        const resumeLink = app.resumeUrl
          ? `<a href="${this.escapeHtml(app.resumeUrl)}" target="_blank" class="resume-link">📄 View Resume</a>`
          : `<span class="text-muted">None</span>`;
        const notePreview = app.coverNote
          ? (app.coverNote.length > 45 ? `${this.escapeHtml(app.coverNote.substring(0, 45))}...` : this.escapeHtml(app.coverNote))
          : `<span class="text-muted">-</span>`;

        return `
        <tr>
          <td><span class="badge badge-id">#${app.id}</span></td>
          <td>
            <a href="/users/${app.userId}" class="entity-link">
              <strong>User #${app.userId}</strong>
            </a>
          </td>
          <td>
            <a href="/job-postings/${app.jobPostingId}" class="entity-link">
              <strong>Job #${app.jobPostingId}</strong>
            </a>
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
      color: var(--muted);
      border-bottom: 1px solid var(--border);
    }
    td { padding: 1rem; border-bottom: 1px solid var(--border); font-size: 0.875rem; vertical-align: middle; }
    tr:hover td { background: #f8fafc; }
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
    }
    .btn-view { background: #e0f2fe; color: #0284c7; }
    .btn-view:hover { background: #bae6fd; }
    .btn-edit { background: #fef3c7; color: #d97706; }
    .btn-edit:hover { background: #fde68a; }
    .btn-delete { background: #fee2e2; color: #dc2626; }
    .btn-delete:hover { background: #fecaca; }
    .form-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: 1.25rem;
      margin-bottom: 1.25rem;
    }
    .form-group { display: flex; flex-direction: column; gap: 0.4rem; }
    .form-group.full-width { grid-column: 1 / -1; }
    label { font-size: 0.875rem; font-weight: 600; color: #334155; }
    input, select, textarea {
      padding: 0.625rem 0.75rem;
      border-radius: 6px;
      border: 1px solid var(--border);
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
    .text-muted { color: var(--muted); }
  </style>
</head>
<body>
  <div class="container">
    <header>
      <div>
        <h1>📝 Job Applications Management</h1>
        <p style="color: var(--muted); font-size: 0.875rem; margin-top: 0.25rem;">
          Track, review, and manage career applications linking Alumni Applicants and Job Opportunities.
        </p>
      </div>
      <div class="nav-links">
        <a href="/users">👥 Alumni Directory</a>
        <a href="/announcements">📢 Announcements</a>
        <a href="/job-postings">💼 Career Board</a>
        <a href="/api/applications" target="_blank">🌐 REST API</a>
        <a href="/api/swagger" target="_blank">📘 Swagger Docs</a>
      </div>
    </header>

    ${successMessage ? `<div class="alert alert-success">${this.escapeHtml(successMessage)}</div>` : ''}
    ${errorMessage ? `<div class="alert alert-danger">${this.escapeHtml(errorMessage)}</div>` : ''}

    <div class="card">
      <div class="card-header">
        Submitted Applications (${applications.length})
      </div>
      <div style="overflow-x: auto;">
        <table>
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

    <div class="card">
      <div class="card-header">
        Submit New Job Application
      </div>
      <div class="card-body">
        <form method="POST" action="/applications">
          <div class="form-grid">
            <div class="form-group">
              <label for="userId">User ID (Applicant) *</label>
              <input type="number" id="userId" name="userId" required placeholder="e.g. 1" min="1">
            </div>
            <div class="form-group">
              <label for="jobPostingId">Job Posting ID *</label>
              <input type="number" id="jobPostingId" name="jobPostingId" required placeholder="e.g. 1" min="1">
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
</body>
</html>`;
  },

  /**
   * Renders single Application detail view
   * 
   * @param {Object} application - Application model instance
   * @param {Object} [options] - Options (successMessage)
   * @returns {string} Formatted HTML document
   */
  renderApplicationDetail(application, options = {}) {
    const { successMessage = null } = options;
    const badgeClass = this.getStatusBadgeClass(application.status);

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Application #${application.id} - Alumni Tracking System</title>
  <style>
    :root {
      --primary: #2563eb;
      --bg: #f8fafc;
      --card-bg: #ffffff;
      --text: #0f172a;
      --muted: #64748b;
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
    .back-nav { margin-bottom: 1.5rem; }
    .back-nav a { color: var(--primary); text-decoration: none; font-weight: 500; }
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
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
      border: 1px solid var(--border);
      padding: 2rem;
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
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1.25rem;
      margin-bottom: 1.5rem;
    }
    .meta-item { display: flex; flex-direction: column; }
    .meta-label { font-size: 0.75rem; text-transform: uppercase; color: var(--muted); font-weight: 600; }
    .meta-value { font-size: 1rem; font-weight: 600; color: #1e293b; margin-top: 0.2rem; }
    .meta-value a { color: var(--primary); text-decoration: none; }
    .meta-value a:hover { text-decoration: underline; }
    .section-title { font-size: 1rem; font-weight: 600; margin: 1.5rem 0 0.5rem; color: #334155; }
    .cover-note-box {
      background: #f8fafc;
      padding: 1.25rem;
      border-radius: 8px;
      border: 1px solid var(--border);
      font-size: 0.95rem;
      white-space: pre-line;
      color: #334155;
    }
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
  <div class="container">
    <div class="back-nav">
      <a href="/applications">← Back to Applications</a>
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
        </div>
        <div class="meta-item">
          <span class="meta-label">Job Opportunity</span>
          <span class="meta-value">
            <a href="/job-postings/${application.jobPostingId}">Job #${application.jobPostingId}</a>
          </span>
        </div>
        <div class="meta-item">
          <span class="meta-label">Resume Document</span>
          <span class="meta-value">
            ${application.resumeUrl ? `<a href="${this.escapeHtml(application.resumeUrl)}" target="_blank">📄 Open Resume Link</a>` : '<span style="color: var(--muted);">None provided</span>'}
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
   * @param {Object} [options] - Options (errorMessage)
   * @returns {string} Formatted HTML document
   */
  renderEditApplicationForm(application, options = {}) {
    const { errorMessage = null } = options;

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
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      background: var(--bg);
      color: var(--text);
      line-height: 1.5;
      padding: 2rem 1rem;
    }
    .container { max-width: 700px; margin: 0 auto; }
    .back-nav { margin-bottom: 1.5rem; }
    .back-nav a { color: var(--primary); text-decoration: none; font-weight: 500; }
    .back-nav a:hover { text-decoration: underline; }
    .card {
      background: var(--card-bg);
      border-radius: 12px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
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
      padding: 0.625rem 0.75rem;
      border-radius: 6px;
      border: 1px solid var(--border);
      font-size: 0.875rem;
      font-family: inherit;
    }
    input:focus, select:focus, textarea:focus {
      outline: none;
      border-color: var(--primary);
      box-shadow: 0 0 0 3px rgba(37,99,235,0.1);
    }
    .actions { display: flex; gap: 1rem; align-items: center; margin-top: 1.5rem; }
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
    .btn-cancel { color: var(--muted); text-decoration: none; font-size: 0.875rem; }
    .btn-cancel:hover { text-decoration: underline; }
  </style>
</head>
<body>
  <div class="container">
    <div class="back-nav">
      <a href="/applications/${application.id}">← Cancel & Back to Details</a>
    </div>

    ${errorMessage ? `<div class="alert-danger">${this.escapeHtml(errorMessage)}</div>` : ''}

    <div class="card">
      <h1>Edit Application #${application.id}</h1>
      <form method="POST" action="/applications/${application.id}/update">
        <div class="form-group">
          <label>Applicant (User ID)</label>
          <input type="text" value="User #${application.userId}" disabled style="background: #f1f5f9; color: #64748b; cursor: not-allowed;">
        </div>

        <div class="form-group">
          <label>Job Posting ID</label>
          <input type="text" value="Job #${application.jobPostingId}" disabled style="background: #f1f5f9; color: #64748b; cursor: not-allowed;">
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
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
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
      max-width: 500px;
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
