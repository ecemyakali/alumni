/**
 * ========================================================
 * View Layer: Announcement View (AnnouncementView)
 * File: src/views/announcementView.js
 * ========================================================
 * 
 * Homework: Dedicated View Layer for Announcement management without database.
 * Generates semantic, responsive HTML views for:
 * 1. READ ALL & CREATE: Announcements board & publishing form (GET /announcements)
 * 2. READ ONE: Full announcement detail view (GET /announcements/:id)
 * 3. UPDATE: Pre-filled announcement edit form (GET /announcements/:id/edit)
 * 4. DELETE: Row-level form delete actions with confirmation
 * 5. ERRORS: Semantic 400 and 404 pages
 */

const announcementView = {
  /**
   * Renders the complete HTML Announcements Board page
   * 
   * @param {Array<Object>} announcements - List of announcement models
   * @param {Object} [options] - Options (successMessage, errorMessage)
   * @returns {string} Formatted HTML document
   */
  renderAnnouncementsList(announcements = [], options = {}) {
    const { successMessage = null, errorMessage = null } = options;

    const rows = announcements.length > 0
      ? announcements.map(a => {
        const priorityClass = `priority-${(a.priority || 'normal').toLowerCase()}`;
        return `
        <tr>
          <td><span class="badge badge-id">#${a.id}</span></td>
          <td>
            <a href="/announcements/${a.id}" class="title-link">
              <strong>${this.escapeHtml(a.title)}</strong>
            </a>
          </td>
          <td><span class="badge badge-category">${this.escapeHtml(a.category || 'General')}</span></td>
          <td><span class="badge ${priorityClass}">${this.escapeHtml(a.priority || 'normal')}</span></td>
          <td>${this.escapeHtml(a.author || 'Alumni Office')}</td>
          <td><small class="text-muted">${a.createdAt ? new Date(a.createdAt).toLocaleDateString() : '-'}</small></td>
          <td class="action-cell">
            <a href="/announcements/${a.id}" class="btn-sm btn-view">View</a>
            <a href="/announcements/${a.id}/edit" class="btn-sm btn-edit">Edit</a>
            <form method="POST" action="/announcements/${a.id}/delete" style="display:inline;" onsubmit="return confirm('Delete announcement #${a.id}?');">
              <button type="submit" class="btn-sm btn-delete">Delete</button>
            </form>
          </td>
        </tr>
      `;
      }).join('')
      : `<tr><td colspan="7" class="text-center text-muted py-4">No announcements posted yet. Use the form below to publish the first announcement!</td></tr>`;

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Alumni Announcements Board - Alumni Tracking System</title>
  <style>
    :root {
      --primary: #2563eb;
      --primary-dark: #1d4ed8;
      --success: #16a34a;
      --warning: #d97706;
      --danger: #dc2626;
      --bg: #f8fafc;
      --card-bg: #ffffff;
      --text: #1e293b;
      --text-muted: #64748b;
      --border: #e2e8f0;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      background-color: var(--bg);
      color: var(--text);
      line-height: 1.5;
      padding: 2rem 1rem;
    }
    .container { max-width: 1100px; margin: 0 auto; }
    header { text-align: center; margin-bottom: 2rem; }
    h1 { font-size: 2rem; color: var(--text); margin-bottom: 0.5rem; }
    .subtitle { color: var(--text-muted); font-size: 1rem; }
    .card {
      background: var(--card-bg);
      border-radius: 12px;
      padding: 1.75rem;
      box-shadow: 0 4px 6px -1px rgba(0,0,0,0.07);
      margin-bottom: 2rem;
      border: 1px solid var(--border);
    }
    .card-title {
      font-size: 1.25rem;
      font-weight: 600;
      margin-bottom: 1.25rem;
      border-bottom: 2px solid var(--border);
      padding-bottom: 0.5rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .alert { padding: 1rem 1.25rem; border-radius: 8px; margin-bottom: 1.5rem; font-weight: 500; }
    .alert-success { background-color: #dcfce7; color: #15803d; border: 1px solid #bbf7d0; }
    .alert-danger { background-color: #fee2e2; color: #b91c1c; border: 1px solid #fecaca; }
    table { width: 100%; border-collapse: collapse; text-align: left; }
    th, td { padding: 0.75rem 0.85rem; border-bottom: 1px solid var(--border); }
    th { background-color: #f1f5f9; color: var(--text-muted); font-size: 0.82rem; text-transform: uppercase; letter-spacing: 0.05em; }
    tr:hover { background-color: #f8fafc; }
    .title-link { color: #1e293b; text-decoration: none; }
    .title-link:hover { color: var(--primary); text-decoration: underline; }
    .badge {
      display: inline-block;
      padding: 0.25rem 0.6rem;
      border-radius: 9999px;
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: capitalize;
    }
    .badge-id { background: #e2e8f0; color: #475569; }
    .badge-category { background: #e0e7ff; color: #3730a3; }
    .priority-urgent { background: #fee2e2; color: #991b1b; }
    .priority-high { background: #ffedd5; color: #9a3412; }
    .priority-normal { background: #dcfce7; color: #166534; }
    .priority-low { background: #f1f5f9; color: #475569; }
    .action-cell { white-space: nowrap; }
    .btn-sm {
      display: inline-block;
      padding: 0.3rem 0.65rem;
      font-size: 0.8rem;
      font-weight: 600;
      border-radius: 4px;
      text-decoration: none;
      cursor: pointer;
      border: none;
      margin-right: 0.25rem;
    }
    .btn-view { background: #e0f2fe; color: #0369a1; }
    .btn-edit { background: #fef3c7; color: #b45309; }
    .btn-delete { background: #fee2e2; color: #b91c1c; }
    .form-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 1rem;
      margin-bottom: 1rem;
    }
    .form-group { display: flex; flex-direction: column; }
    .form-group-full { grid-column: 1 / -1; }
    label { font-size: 0.875rem; font-weight: 600; margin-bottom: 0.35rem; }
    input, select, textarea {
      padding: 0.65rem 0.85rem;
      border: 1px solid var(--border);
      border-radius: 6px;
      font-size: 0.95rem;
      font-family: inherit;
    }
    input:focus, select:focus, textarea:focus {
      outline: none;
      border-color: var(--primary);
      box-shadow: 0 0 0 3px rgba(37,99,235,0.15);
    }
    textarea { min-height: 90px; resize: vertical; }
    button[type="submit"] {
      background: var(--primary);
      color: #ffffff;
      border: none;
      border-radius: 6px;
      padding: 0.75rem 1.75rem;
      font-size: 0.95rem;
      font-weight: 600;
      cursor: pointer;
    }
    button[type="submit"]:hover { background: var(--primary-dark); }
    .links { text-align: center; margin-top: 1.5rem; font-size: 0.9rem; }
    .links a { color: var(--primary); text-decoration: none; margin: 0 0.5rem; }
    .links a:hover { text-decoration: underline; }
    .text-center { text-align: center; }
    .text-muted { color: var(--text-muted); }
    .py-4 { padding-top: 1.5rem; padding-bottom: 1.5rem; }
  </style>
</head>
<body>
  <div class="container">
    <header>
      <h1>📢 Alumni Announcements Board</h1>
      <p class="subtitle">MVC In-Memory Announcement Management System</p>
    </header>

    ${successMessage ? `<div class="alert alert-success">${this.escapeHtml(successMessage)}</div>` : ''}
    ${errorMessage ? `<div class="alert alert-danger">${this.escapeHtml(errorMessage)}</div>` : ''}

    <!-- READ ALL: GET /announcements -->
    <section class="card">
      <div class="card-title">
        <span>Published Announcements</span>
        <span class="badge badge-category">${announcements.length} Total</span>
      </div>
      <div style="overflow-x: auto;">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Category</th>
              <th>Priority</th>
              <th>Author</th>
              <th>Published</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            ${rows}
          </tbody>
        </table>
      </div>
    </section>

    <!-- CREATE: POST /announcements -->
    <section class="card">
      <div class="card-title">
        <span>Publish New Announcement (CREATE)</span>
      </div>
      <form method="POST" action="/announcements">
        <div class="form-grid">
          <div class="form-group form-group-full">
            <label for="title">Announcement Title *</label>
            <input type="text" id="title" name="title" placeholder="e.g. Annual Alumni Career Fair 2026" required>
          </div>
          <div class="form-group form-group-full">
            <label for="content">Announcement Content / Description *</label>
            <textarea id="content" name="content" placeholder="Provide full announcement details, date, location, registration links..." required></textarea>
          </div>
          <div class="form-group">
            <label for="author">Author / Office</label>
            <input type="text" id="author" name="author" placeholder="e.g. Career Center" value="Alumni Office">
          </div>
          <div class="form-group">
            <label for="category">Category</label>
            <select id="category" name="category">
              <option value="General" selected>General</option>
              <option value="Event">Event</option>
              <option value="Career">Career & Job Posting</option>
              <option value="Academic">Academic Notice</option>
              <option value="Reunion">Homecoming & Reunion</option>
            </select>
          </div>
          <div class="form-group">
            <label for="priority">Priority</label>
            <select id="priority" name="priority">
              <option value="low">Low</option>
              <option value="normal" selected>Normal</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>
        </div>
        <button type="submit">Publish Announcement</button>
      </form>
    </section>

    <div class="links">
      <a href="/users">👥 Users Directory</a> |
      <a href="/api/swagger">📖 Swagger UI Docs</a> |
      <a href="/api/announcements">🌐 REST API (/api/announcements)</a> |
      <a href="/api/health">❤️ Health Check</a>
    </div>
  </div>
</body>
</html>`;
  },

  /**
   * Renders single Announcement Detail View (GET /announcements/:id)
   * 
   * @param {Object} announcement - Announcement model
   * @param {Object} [options] - Options (successMessage)
   * @returns {string} Formatted HTML document
   */
  renderAnnouncementDetail(announcement, options = {}) {
    const { successMessage = null } = options;
    const priorityClass = `priority-${(announcement.priority || 'normal').toLowerCase()}`;

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${this.escapeHtml(announcement.title)} - Alumni Tracking System</title>
  <style>
    body { font-family: -apple-system, sans-serif; background: #f8fafc; color: #1e293b; padding: 2rem 1rem; }
    .card { max-width: 750px; margin: 0 auto; background: white; padding: 2.25rem; border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); border: 1px solid #e2e8f0; }
    .alert-success { background: #dcfce7; color: #15803d; border: 1px solid #bbf7d0; padding: 0.75rem 1rem; border-radius: 6px; margin-bottom: 1.25rem; }
    h1 { font-size: 1.85rem; margin-bottom: 0.75rem; color: #1e293b; }
    .meta-bar { display: flex; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 1.5rem; align-items: center; border-bottom: 1px solid #e2e8f0; padding-bottom: 1rem; }
    .badge { padding: 0.25rem 0.65rem; border-radius: 9999px; font-size: 0.8rem; font-weight: 600; text-transform: capitalize; }
    .badge-id { background: #e2e8f0; color: #475569; }
    .badge-category { background: #e0e7ff; color: #3730a3; }
    .priority-urgent { background: #fee2e2; color: #991b1b; }
    .priority-high { background: #ffedd5; color: #9a3412; }
    .priority-normal { background: #dcfce7; color: #166534; }
    .priority-low { background: #f1f5f9; color: #475569; }
    .content-box { font-size: 1.05rem; line-height: 1.7; white-space: pre-wrap; margin-bottom: 2rem; color: #334155; }
    .dates-bar { font-size: 0.85rem; color: #64748b; margin-bottom: 1.5rem; }
    .btn-group { display: flex; gap: 0.75rem; align-items: center; border-top: 1px solid #e2e8f0; padding-top: 1.25rem; }
    .btn { display: inline-block; padding: 0.5rem 1.1rem; font-size: 0.9rem; font-weight: 600; border-radius: 6px; text-decoration: none; cursor: pointer; border: none; }
    .btn-edit { background: #fef3c7; color: #b45309; }
    .btn-danger { background: #fee2e2; color: #b91c1c; }
    .btn-back { color: #64748b; text-decoration: none; margin-left: auto; font-weight: 500; }
    .btn-back:hover { text-decoration: underline; }
  </style>
</head>
<body>
  <div class="card">
    ${successMessage ? `<div class="alert-success">${this.escapeHtml(successMessage)}</div>` : ''}
    <div class="meta-bar">
      <span class="badge badge-id">#${announcement.id}</span>
      <span class="badge badge-category">${this.escapeHtml(announcement.category || 'General')}</span>
      <span class="badge ${priorityClass}">${this.escapeHtml(announcement.priority || 'normal')} Priority</span>
      <span style="color:#64748b;font-size:0.875rem;">By <strong>${this.escapeHtml(announcement.author || 'Alumni Office')}</strong></span>
    </div>

    <h1>${this.escapeHtml(announcement.title)}</h1>

    <div class="content-box">
      ${this.escapeHtml(announcement.content)}
    </div>

    <div class="dates-bar">
      Published: ${announcement.createdAt ? new Date(announcement.createdAt).toLocaleString() : '-'}
      ${announcement.updatedAt ? ` | Updated: ${new Date(announcement.updatedAt).toLocaleString()}` : ''}
    </div>

    <div class="btn-group">
      <a href="/announcements/${announcement.id}/edit" class="btn btn-edit">✏️ Edit Announcement</a>
      <form method="POST" action="/announcements/${announcement.id}/delete" style="display:inline;" onsubmit="return confirm('Delete this announcement?');">
        <button type="submit" class="btn btn-danger">🗑️ Delete</button>
      </form>
      <a href="/announcements" class="btn-back">← Back to Board</a>
    </div>
  </div>
</body>
</html>`;
  },

  /**
   * Renders the Pre-filled Announcement Edit Form View (GET /announcements/:id/edit)
   * 
   * @param {Object} announcement - Announcement model to edit
   * @param {Object} [options] - Options (errorMessage)
   * @returns {string} Formatted HTML document
   */
  renderEditAnnouncementForm(announcement, options = {}) {
    const { errorMessage = null } = options;

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Edit Announcement #${announcement.id} - Alumni Tracking System</title>
  <style>
    body { font-family: -apple-system, sans-serif; background: #f8fafc; color: #1e293b; padding: 2rem 1rem; }
    .card { max-width: 700px; margin: 0 auto; background: white; padding: 2rem; border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); border: 1px solid #e2e8f0; }
    h1 { font-size: 1.5rem; margin-bottom: 1.25rem; border-bottom: 2px solid #e2e8f0; padding-bottom: 0.5rem; }
    .alert-danger { background: #fee2e2; color: #b91c1c; border: 1px solid #fecaca; padding: 0.75rem 1rem; border-radius: 6px; margin-bottom: 1rem; }
    .form-group { margin-bottom: 1.15rem; display: flex; flex-direction: column; }
    label { font-weight: 600; margin-bottom: 0.35rem; font-size: 0.9rem; }
    input, select, textarea { padding: 0.65rem 0.85rem; border: 1px solid #cbd5e1; border-radius: 6px; font-size: 0.95rem; font-family: inherit; }
    textarea { min-height: 110px; resize: vertical; }
    input:focus, select:focus, textarea:focus { outline: none; border-color: #2563eb; }
    .btn-group { margin-top: 1.5rem; display: flex; gap: 0.75rem; align-items: center; }
    button[type="submit"] { background: #2563eb; color: white; border: none; padding: 0.75rem 1.5rem; border-radius: 6px; font-weight: 600; cursor: pointer; }
    button[type="submit"]:hover { background: #1d4ed8; }
    .btn-cancel { color: #64748b; text-decoration: none; }
    .btn-cancel:hover { text-decoration: underline; }
  </style>
</head>
<body>
  <div class="card">
    <h1>✏️ Edit Announcement #${announcement.id}</h1>
    ${errorMessage ? `<div class="alert-danger">${this.escapeHtml(errorMessage)}</div>` : ''}

    <form method="POST" action="/announcements/${announcement.id}/update">
      <div class="form-group">
        <label for="title">Announcement Title *</label>
        <input type="text" id="title" name="title" value="${this.escapeHtml(announcement.title)}" required>
      </div>

      <div class="form-group">
        <label for="content">Announcement Content *</label>
        <textarea id="content" name="content" required>${this.escapeHtml(announcement.content)}</textarea>
      </div>

      <div class="form-group">
        <label for="author">Author / Office</label>
        <input type="text" id="author" name="author" value="${this.escapeHtml(announcement.author || '')}">
      </div>

      <div class="form-group">
        <label for="category">Category</label>
        <select id="category" name="category">
          <option value="General" ${announcement.category === 'General' ? 'selected' : ''}>General</option>
          <option value="Event" ${announcement.category === 'Event' ? 'selected' : ''}>Event</option>
          <option value="Career" ${announcement.category === 'Career' ? 'selected' : ''}>Career & Job Posting</option>
          <option value="Academic" ${announcement.category === 'Academic' ? 'selected' : ''}>Academic Notice</option>
          <option value="Reunion" ${announcement.category === 'Reunion' ? 'selected' : ''}>Homecoming & Reunion</option>
        </select>
      </div>

      <div class="form-group">
        <label for="priority">Priority</label>
        <select id="priority" name="priority">
          <option value="low" ${announcement.priority === 'low' ? 'selected' : ''}>Low</option>
          <option value="normal" ${announcement.priority === 'normal' ? 'selected' : ''}>Normal</option>
          <option value="high" ${announcement.priority === 'high' ? 'selected' : ''}>High</option>
          <option value="urgent" ${announcement.priority === 'urgent' ? 'selected' : ''}>Urgent</option>
        </select>
      </div>

      <div class="btn-group">
        <button type="submit">Save Changes</button>
        <a href="/announcements/${announcement.id}" class="btn-cancel">Cancel</a>
        <a href="/announcements" class="btn-cancel" style="margin-left:auto;">← Announcements Board</a>
      </div>
    </form>
  </div>
</body>
</html>`;
  },

  /**
   * Renders semantic error page
   * 
   * @param {string} message - Error explanation
   * @param {number} statusCode - HTTP status code
   * @returns {string} Formatted HTML document
   */
  renderError(message, statusCode = 404) {
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${statusCode} Error - Announcements</title>
  <style>
    body { font-family: -apple-system, sans-serif; background: #f8fafc; color: #1e293b; padding: 3rem 1rem; text-align: center; }
    .card { max-width: 500px; margin: 0 auto; background: white; padding: 2.5rem; border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); border: 1px solid #e2e8f0; }
    h1 { font-size: 2rem; color: #dc2626; margin-bottom: 0.5rem; }
    p { color: #64748b; margin-bottom: 1.5rem; }
    a { color: #2563eb; text-decoration: none; font-weight: 500; }
  </style>
</head>
<body>
  <div class="card">
    <h1>${statusCode} Not Found</h1>
    <p>${this.escapeHtml(message)}</p>
    <a href="/announcements">← Return to Announcements Board</a>
  </div>
</body>
</html>`;
  },

  /**
   * Basic HTML string sanitizer
   */
  escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
};

module.exports = announcementView;
