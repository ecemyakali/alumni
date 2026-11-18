/**
 * Generic 404 Not Found HTML View (Mintlify Aurora Aesthetic)
 * File: src/views/notFoundView.js
 * 
 * Provides a user-friendly, responsive HTML presentation for 404 Not Found errors
 * displaying error reason, attempted path, and quick navigation routes.
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
      --canvas: #ffffff;
      --surface-subtle: #f9fafb;
      --hairline: #e5e7eb;
      --hairline-strong: #d1d5db;
      --ink: #111827;
      --ink-muted: #4b5563;
      --ink-subtle: #6b7280;
      --primary: #111827;
      --primary-hover: #1f2937;
      --brand-mint: #0d9373;
      --brand-mint-subtle: #ecfdf5;
      --brand-mint-border: #a7f3d0;
      --font-sans: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      --font-mono: ui-monospace, "SF Mono", "Geist Mono", Menlo, Consolas, monospace;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: var(--font-sans);
      background-color: #ffffff;
      background-image: 
        radial-gradient(at 15% 10%, rgba(16, 185, 129, 0.22) 0px, transparent 50%),
        radial-gradient(at 85% 15%, rgba(6, 182, 212, 0.20) 0px, transparent 50%),
        radial-gradient(at 50% 0%, rgba(59, 130, 246, 0.14) 0px, transparent 60%),
        linear-gradient(180deg, rgba(236, 253, 245, 0.72) 0%, rgba(255, 255, 255, 1) 100%);
      background-attachment: fixed;
      color: var(--ink);
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 1.5rem;
      -webkit-font-smoothing: antialiased;
    }
    .card {
      background: #ffffff;
      border: 1px solid var(--hairline);
      border-radius: 20px;
      box-shadow: 0 16px 40px -8px rgba(0, 0, 0, 0.08), 0 4px 16px -2px rgba(0, 0, 0, 0.03);
      max-width: 580px;
      width: 100%;
      padding: 2.75rem 2.25rem;
      text-align: center;
    }
    .status-badge {
      display: inline-block;
      font-size: 3.25rem;
      font-weight: 700;
      color: #ef4444;
      background: #fef2f2;
      border: 1px solid #fee2e2;
      border-radius: 12px;
      padding: 0.25rem 1.5rem;
      margin-bottom: 1.25rem;
      letter-spacing: -1.5px;
      font-family: var(--font-mono);
    }
    h1 {
      font-size: 1.85rem;
      font-weight: 700;
      letter-spacing: -0.6px;
      margin-bottom: 0.75rem;
      color: var(--ink);
    }
    .reason-box {
      background: var(--surface-subtle);
      border-left: 4px solid var(--brand-mint);
      border-radius: 8px;
      padding: 1rem 1.25rem;
      margin: 1.5rem 0;
      text-align: left;
      font-size: 0.95rem;
      color: var(--ink-muted);
      border-top: 1px solid var(--hairline);
      border-right: 1px solid var(--hairline);
      border-bottom: 1px solid var(--hairline);
    }
    .reason-title {
      font-weight: 600;
      color: var(--ink);
      margin-bottom: 0.35rem;
    }
    .path-text {
      font-family: var(--font-mono);
      font-size: 0.85rem;
      color: var(--ink);
      background: #ffffff;
      padding: 2px 6px;
      border-radius: 4px;
      border: 1px solid var(--hairline);
      word-break: break-all;
    }
    .links-header {
      font-size: 0.8rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: var(--ink-subtle);
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
      padding: 0.85rem 0.5rem;
      background: #ffffff;
      border: 1px solid var(--hairline);
      border-radius: 12px;
      color: var(--ink);
      text-decoration: none;
      font-size: 0.85rem;
      font-weight: 600;
      transition: all 0.15s ease;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.02);
    }
    .nav-btn:hover {
      background: var(--brand-mint-subtle);
      border-color: var(--brand-mint-border);
      color: var(--brand-mint);
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(13, 147, 115, 0.10);
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
      <div class="reason-title">Status Details:</div>
      <div>${escapeHtml(reason)}</div>
      ${attemptedPath ? `<div style="margin-top: 0.6rem;"><span style="font-weight: 600;">Requested URL:</span> <span class="path-text">${escapeHtml(attemptedPath)}</span></div>` : ''}
    </div>

    <div class="links-header">Helpful Destinations</div>
    <div class="nav-grid">
      <a href="/main" class="nav-btn"><span class="icon">🏠</span><span>Home</span></a>
      <a href="/users" class="nav-btn"><span class="icon">👥</span><span>Alumni Directory</span></a>
      <a href="/job-postings" class="nav-btn"><span class="icon">💼</span><span>Careers</span></a>
      <a href="/announcements" class="nav-btn"><span class="icon">📢</span><span>Announcements</span></a>
      <a href="/api/swagger" class="nav-btn" target="_blank"><span class="icon">📄</span><span>Swagger UI</span></a>
    </div>
  </div>
</body>
</html>`;
  }
};

module.exports = notFoundView;
