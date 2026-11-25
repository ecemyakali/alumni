/**
 * ========================================================
 * View Layer: Announcement View (AnnouncementView) - Tactile SaaS Design
 * File: src/views/announcementView.js
 * ========================================================
 */

const sharedLayout = require('./sharedLayout');

const announcementView = {
  escapeHtml: sharedLayout.escapeHtml,

  /**
   * Renders the complete HTML Announcements Board page (GET /announcements)
   */
  renderAnnouncementsList(announcements = [], options = {}) {
    const { successMessage = null, errorMessage = null } = options;

    const rows = announcements.length > 0
      ? announcements.map(a => {
        const priorityBadgeColor = (a.priority === 'urgent')
          ? 'background:#fee2e2; color:#991b1b; border:1px solid #fecaca;'
          : ((a.priority === 'high')
            ? 'background:#ffedd5; color:#9a3412; border:1px solid #fed7aa;'
            : 'background:#f0fdf4; color:#166534; border:1px solid #bbf7d0;');

        return `
        <tr>
          <td><span class="badge-pill badge-id">#${a.id}</span></td>
          <td>
            <a href="/announcements/${a.id}" class="title-link" style="color:var(--colors-ink); text-decoration:none; font-weight:600;">
              <strong>${this.escapeHtml(a.title)}</strong>
            </a>
          </td>
          <td><span class="badge-pill" style="background:#eff6ff; color:#1d4ed8; border:1px solid #dbeafe;">${this.escapeHtml(a.category || 'General')}</span></td>
          <td><span class="badge-pill" style="${priorityBadgeColor}">${this.escapeHtml(a.priority || 'normal')}</span></td>
          <td>${this.escapeHtml(a.author || 'Alumni Office')}</td>
          <td><small style="color:var(--colors-muted);">${a.createdAt ? new Date(a.createdAt).toLocaleDateString() : '-'}</small></td>
          <td>
            <div style="display:flex; gap:6px;">
              <a href="/announcements/${a.id}" class="btn-action-view">View</a>
              <a href="/announcements/${a.id}/edit" class="btn-action-edit">Edit</a>
              <form method="POST" action="/announcements/${a.id}/delete" style="display:inline;" onsubmit="return confirm('Delete announcement #${a.id}?');">
                <button type="submit" class="btn-action-delete">Delete</button>
              </form>
            </div>
          </td>
        </tr>
      `;
      }).join('')
      : `<tr><td colspan="7" style="text-align:center; color:var(--colors-muted); padding:2rem;">No announcements posted yet. Use the form below to publish the first announcement!</td></tr>`;

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Alumni Announcements Board - Alumni Tracking System</title>
  <style>
    ${sharedLayout.getCommonStyles()}
  </style>
</head>
<body>

  ${sharedLayout.renderNavbar('announcements', options.currentUser)}

  <main class="page-wrapper">
    <div class="page-header-band">
      <div>
        <div class="page-header-pill">
          <span>📢 Institutional News & Reunions</span>
        </div>
        <h1 class="page-title">Alumni Announcements Board</h1>
        <p class="page-subtitle">
          Stay updated with campus news, alumni reunions, guest lectures, and institutional milestones.
        </p>
      </div>
      <div>
        <a href="#publish-announcement-section" class="btn-clay-primary">+ Publish Announcement</a>
      </div>
    </div>

    ${successMessage ? `<div class="alert-banner alert-success"><span>✅</span> <span>${this.escapeHtml(successMessage)}</span></div>` : ''}
    ${errorMessage ? `<div class="alert-banner alert-danger"><span>⚠️</span> <span>${this.escapeHtml(errorMessage)}</span></div>` : ''}

    <!-- READ ALL: GET /announcements -->
    <section class="content-card">
      <div class="card-header-bar">
        <h2 class="card-heading">Published Announcements</h2>
        <span class="badge-pill badge-id">${announcements.length} Total</span>
      </div>
      <div class="table-container">
        <table class="data-table">
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
    <section id="publish-announcement-section" class="content-card">
      <div class="card-header-bar">
        <h2 class="card-heading">Publish New Announcement (CREATE)</h2>
      </div>
      <form method="POST" action="/announcements">
        <div class="form-grid">
          <div class="form-group form-group-full">
            <label class="form-label" for="title">Announcement Title *</label>
            <input class="form-input" type="text" id="title" name="title" placeholder="e.g. Annual Alumni Career Fair 2026" required>
          </div>
          <div class="form-group form-group-full">
            <label class="form-label" for="content">Announcement Content / Description *</label>
            <textarea class="form-textarea" id="content" name="content" placeholder="Provide full announcement details, date, location, registration links..." required></textarea>
          </div>
          <div class="form-group">
            <label class="form-label" for="author">Author / Office</label>
            <input class="form-input" type="text" id="author" name="author" placeholder="e.g. Career Center" value="Alumni Office">
          </div>
          <div class="form-group">
            <label class="form-label" for="category">Category</label>
            <select class="form-select" id="category" name="category">
              <option value="General" selected>General</option>
              <option value="Event">Event</option>
              <option value="Career">Career & Job Posting</option>
              <option value="Academic">Academic Notice</option>
              <option value="Reunion">Homecoming & Reunion</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label" for="priority">Priority</label>
            <select class="form-select" id="priority" name="priority">
              <option value="low">Low</option>
              <option value="normal" selected>Normal</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>
        </div>
        <div style="margin-top:1.5rem;">
          <button type="submit" class="btn-clay-primary">Publish Announcement</button>
        </div>
      </form>
    </section>
  </main>

  ${sharedLayout.renderFooter()}

</body>
</html>`;
  },

  /**
   * Renders single Announcement Detail View page (GET /announcements/:id)
   */
  renderAnnouncementDetail(announcement, options = {}) {
    const { successMessage = null } = options;

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${this.escapeHtml(announcement.title)} - Alumni Tracking System</title>
  <style>
    ${sharedLayout.getCommonStyles()}
  </style>
</head>
<body>

  ${sharedLayout.renderNavbar('announcements', options.currentUser)}

  <main class="page-wrapper">
    <div style="max-width: 780px; margin: 0 auto;">
      ${successMessage ? `<div class="alert-banner alert-success"><span>✅</span> <span>${this.escapeHtml(successMessage)}</span></div>` : ''}

      <div class="content-card">
        <div style="display:flex; flex-wrap:wrap; gap:8px; align-items:center; margin-bottom:1.25rem;">
          <span class="badge-pill badge-id">#${announcement.id}</span>
          <span class="badge-pill" style="background:#eff6ff; color:#1d4ed8; border:1px solid #dbeafe;">${this.escapeHtml(announcement.category || 'General')}</span>
          <span class="badge-pill" style="background:#fef3c7; color:#b45309; border:1px solid #fde68a;">${this.escapeHtml(announcement.priority || 'normal')} Priority</span>
          <span style="color:var(--colors-muted); font-size:13px; margin-left:auto;">By <strong>${this.escapeHtml(announcement.author || 'Alumni Office')}</strong></span>
        </div>

        <h1 class="page-title" style="font-size:2rem; margin-bottom:1.5rem; line-height:1.2;">${this.escapeHtml(announcement.title)}</h1>

        <div style="font-size:16px; line-height:1.75; white-space:pre-wrap; margin-bottom:2rem; color:var(--colors-body); background:var(--colors-canvas); padding:24px; border-radius:var(--rounded-md); border:1px solid var(--colors-hairline);">
${this.escapeHtml(announcement.content)}
        </div>

        <div style="font-size:13px; color:var(--colors-muted); margin-bottom:1.5rem; display:flex; justify-content:space-between;">
          <span>Published: ${announcement.createdAt ? new Date(announcement.createdAt).toLocaleString() : '-'}</span>
          ${announcement.updatedAt ? `<span>Updated: ${new Date(announcement.updatedAt).toLocaleString()}</span>` : ''}
        </div>

        <div style="display:flex; gap:10px; align-items:center; border-top:1px solid var(--colors-hairline); padding-top:1.25rem;">
          <a href="/announcements/${announcement.id}/edit" class="btn-clay-primary">✏️ Edit Announcement</a>
          <form method="POST" action="/announcements/${announcement.id}/delete" style="display:inline;" onsubmit="return confirm('Delete announcement #${announcement.id}?');">
            <button type="submit" class="btn-action-delete" style="padding:10px 18px; border-radius:var(--rounded-md); font-size:14px;">🗑️ Delete</button>
          </form>
          <a href="/announcements" class="btn-clay-secondary" style="margin-left:auto;">← Back to Announcements</a>
        </div>
      </div>
    </div>
  </main>

  ${sharedLayout.renderFooter()}

</body>
</html>`;
  },

  /**
   * Renders the Edit Announcement Form View (GET /announcements/:id/edit)
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
    ${sharedLayout.getCommonStyles()}
  </style>
</head>
<body>

  ${sharedLayout.renderNavbar('announcements', options.currentUser)}

  <main class="page-wrapper">
    <div style="max-width: 720px; margin: 0 auto;">
      <div class="content-card">
        <h1 class="page-title" style="font-size:1.75rem; margin-bottom:1rem; border-bottom:1px solid var(--colors-hairline); padding-bottom:0.75rem;">
          ✏️ Edit Announcement #${announcement.id}
        </h1>

        ${errorMessage ? `<div class="alert-banner alert-danger"><span>⚠️</span> <span>${this.escapeHtml(errorMessage)}</span></div>` : ''}

        <form method="POST" action="/announcements/${announcement.id}/update">
          <div class="form-group" style="margin-bottom:1.25rem;">
            <label class="form-label" for="title">Announcement Title *</label>
            <input class="form-input" type="text" id="title" name="title" value="${this.escapeHtml(announcement.title)}" required>
          </div>

          <div class="form-group" style="margin-bottom:1.25rem;">
            <label class="form-label" for="content">Announcement Content *</label>
            <textarea class="form-textarea" id="content" name="content" required style="min-height:140px;">${this.escapeHtml(announcement.content)}</textarea>
          </div>

          <div class="form-grid">
            <div class="form-group">
              <label class="form-label" for="author">Author / Office</label>
              <input class="form-input" type="text" id="author" name="author" value="${this.escapeHtml(announcement.author || '')}">
            </div>

            <div class="form-group">
              <label class="form-label" for="category">Category</label>
              <select class="form-select" id="category" name="category">
                <option value="General" ${announcement.category === 'General' ? 'selected' : ''}>General</option>
                <option value="Event" ${announcement.category === 'Event' ? 'selected' : ''}>Event</option>
                <option value="Career" ${announcement.category === 'Career' ? 'selected' : ''}>Career & Job Posting</option>
                <option value="Academic" ${announcement.category === 'Academic' ? 'selected' : ''}>Academic Notice</option>
                <option value="Reunion" ${announcement.category === 'Reunion' ? 'selected' : ''}>Homecoming & Reunion</option>
              </select>
            </div>

            <div class="form-group">
              <label class="form-label" for="priority">Priority</label>
              <select class="form-select" id="priority" name="priority">
                <option value="low" ${announcement.priority === 'low' ? 'selected' : ''}>Low</option>
                <option value="normal" ${announcement.priority === 'normal' ? 'selected' : ''}>Normal</option>
                <option value="high" ${announcement.priority === 'high' ? 'selected' : ''}>High</option>
                <option value="urgent" ${announcement.priority === 'urgent' ? 'selected' : ''}>Urgent</option>
              </select>
            </div>
          </div>

          <div style="display:flex; gap:10px; align-items:center; margin-top:1.5rem;">
            <button type="submit" class="btn-clay-primary">Save Changes</button>
            <a href="/announcements/${announcement.id}" class="btn-clay-secondary">Cancel</a>
            <a href="/announcements" style="margin-left:auto; color:var(--colors-muted); font-size:14px; text-decoration:none;">← Announcements Board</a>
          </div>
        </form>
      </div>
    </div>
  </main>

  ${sharedLayout.renderFooter()}

</body>
</html>`;
  },

  /**
   * Renders error page
   */
  renderError(message, statusCode = 404, options = {}) {
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${statusCode} Error - Announcements</title>
  <style>
    ${sharedLayout.getCommonStyles()}
  </style>
</head>
<body>
  ${sharedLayout.renderNavbar('announcements', options && options.currentUser)}

  <main class="page-wrapper" style="display:flex; align-items:center; justify-content:center;">
    <div class="content-card" style="max-width:520px; width:100%; text-align:center; padding:3rem 2rem;">
      <h1 class="page-title" style="color:var(--colors-error); font-size:2rem; margin-bottom:0.75rem;">${statusCode} Not Found</h1>
      <p style="color:var(--colors-body); margin-bottom:1.75rem; font-size:15px;">${this.escapeHtml(message)}</p>
      <a href="/announcements" class="btn-clay-primary">← Return to Announcements Board</a>
    </div>
  </main>

  ${sharedLayout.renderFooter()}
</body>
</html>`;
  }
};

module.exports = announcementView;
