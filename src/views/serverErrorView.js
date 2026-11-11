/**
 * Generic 500 Server Error HTML View
 * File: src/views/serverErrorView.js
 * 
 * Provides a user-friendly, responsive HTML presentation for 5xx Server errors.
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

const serverErrorView = {
  escapeHtml,

  /**
   * Renders generic 500 / 5xx Server Error HTML document
   * @param {Object} [options={}]
   * @param {number} [options.statusCode=500] - HTTP status code
   * @param {string} [options.message=''] - Error message
   * @param {string} [options.reason=''] - Error reason
   * @returns {string} Formatted HTML document
   */
  renderServerError(options = {}) {
    const statusCode = options.statusCode || 500;
    const reason = options.reason || options.message || 'An unexpected internal server error occurred.';

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${statusCode} - Internal Server Error | Alumni Tracking System</title>
  <style>
    :root {
      --primary: #2563eb;
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
      box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.08);
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
    }
    h1 {
      font-size: 1.75rem;
      font-weight: 700;
      margin-bottom: 0.75rem;
    }
    .reason-box {
      background: #fef2f2;
      border-left: 4px solid var(--danger);
      border-radius: 6px;
      padding: 0.875rem 1rem;
      margin: 1.25rem 0;
      text-align: left;
      font-size: 0.95rem;
      color: #991b1b;
    }
    .nav-grid {
      display: flex;
      gap: 1rem;
      justify-content: center;
      margin-top: 1.5rem;
    }
    .btn {
      padding: 0.75rem 1.5rem;
      background: var(--primary);
      color: #ffffff;
      border-radius: 8px;
      text-decoration: none;
      font-weight: 600;
    }
  </style>
</head>
<body>
  <div class="card">
    <div class="status-badge">${statusCode}</div>
    <h1>Internal Server Error</h1>
    <div class="reason-box">
      <strong>Reason:</strong> ${escapeHtml(reason)}
    </div>
    <div class="nav-grid">
      <a href="/main" class="btn">Return to Home</a>
      <a href="/users" class="btn" style="background:#475569;">Alumni Directory</a>
    </div>
  </div>
</body>
</html>`;
  }
};

module.exports = serverErrorView;
