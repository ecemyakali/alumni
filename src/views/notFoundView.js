/**
 * Generic 404 Not Found HTML View
 * File: src/views/notFoundView.js
 * 
 * Provides a user-friendly, responsive HTML presentation for 404 Not Found errors
 * displaying error reason, attempted path, and navigation routes.
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

const notFoundView = {
  escapeHtml,

  /**
   * Renders generic 404 Not Found HTML document
   * @param {Object} [options={}]
   * @param {string} [options.path=''] - The attempted route / URL
   * @param {string} [options.reason=''] - The specific reason for the 404 error
   * @returns {string} Formatted HTML document
   */
  renderNotFound(options = {}) {
    const attemptedPath = options.path || '';
    const reason = options.reason || 'The requested URL or resource could not be found on this server.';

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>404 - Page Not Found | Alumni Tracking System</title>
  <style>
    :root {
      --primary: #2563eb;
      --primary-dark: #1d4ed8;
      --danger: #dc2626;
      --text: #0f172a;
      --text-muted: #64748b;
      --bg: #f8fafc;
      --card-bg: #ffffff;
      --border: #e2e8f0;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      background: var(--bg);
      color: var(--text);
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 1.5rem;
    }
    .card {
      background: var(--card-bg);
      border: 1px solid var(--border);
      border-radius: 16px;
      box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.08), 0 8px 10px -6px rgba(0, 0, 0, 0.04);
      max-width: 580px;
      width: 100%;
      padding: 2.5rem;
      text-align: center;
    }
    .status-badge {
      display: inline-block;
      font-size: 3.5rem;
      font-weight: 800;
      color: var(--danger);
      background: #fef2f2;
      border: 2px solid #fee2e2;
      border-radius: 12px;
      padding: 0.25rem 1.5rem;
      margin-bottom: 1.25rem;
      letter-spacing: -0.05em;
    }
    h1 {
      font-size: 1.75rem;
      font-weight: 700;
      margin-bottom: 0.75rem;
      color: var(--text);
    }
    .reason-box {
      background: #f1f5f9;
      border-left: 4px solid var(--primary);
      border-radius: 6px;
      padding: 0.875rem 1rem;
      margin: 1.25rem 0;
      text-align: left;
      font-size: 0.95rem;
      color: #334155;
    }
    .reason-title {
      font-weight: 600;
      color: #1e293b;
      margin-bottom: 0.25rem;
    }
    .path-text {
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      font-size: 0.875rem;
      color: #475569;
      word-break: break-all;
    }
    .links-header {
      font-size: 0.85rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--text-muted);
      margin: 1.5rem 0 0.75rem;
    }
    .nav-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
      gap: 0.75rem;
      margin-top: 0.5rem;
    }
    .nav-btn {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 0.75rem 0.5rem;
      background: var(--bg);
      border: 1px solid var(--border);
      border-radius: 8px;
      color: var(--text);
      text-decoration: none;
      font-size: 0.85rem;
      font-weight: 600;
      transition: all 0.15s ease-in-out;
    }
    .nav-btn:hover {
      background: #eff6ff;
      border-color: var(--primary);
      color: var(--primary);
      transform: translateY(-2px);
    }
    .nav-btn .icon {
      font-size: 1.25rem;
      margin-bottom: 0.25rem;
    }
  </style>
</head>
<body>
  <div class="card">
    <div class="status-badge">404</div>
    <h1>Page Not Found</h1>
    
    <div class="reason-box">
      <div class="reason-title">Reason:</div>
      <div>${escapeHtml(reason)}</div>
      ${attemptedPath ? `<div style="margin-top: 0.5rem;"><span style="font-weight: 600;">Requested URL:</span> <span class="path-text">${escapeHtml(attemptedPath)}</span></div>` : ''}
    </div>

    <div class="links-header">Helpful Destinations</div>
    <div class="nav-grid">
      <a href="/main" class="nav-btn"><span class="icon">🏠</span><span>Home</span></a>
      <a href="/users" class="nav-btn"><span class="icon">👥</span><span>Alumni Directory</span></a>
      <a href="/job-postings" class="nav-btn"><span class="icon">💼</span><span>Careers</span></a>
      <a href="/announcements" class="nav-btn"><span class="icon">📢</span><span>Announcements</span></a>
      <a href="/api/swagger" class="nav-btn"><span class="icon">📄</span><span>API Docs</span></a>
    </div>
  </div>
</body>
</html>`;
  }
};

module.exports = notFoundView;
