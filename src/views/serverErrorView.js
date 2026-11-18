/**
 * Generic 500 Server Error HTML View (Mintlify Aurora Aesthetic)
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
      background: #fef2f2;
      border-left: 4px solid #ef4444;
      border-radius: 8px;
      padding: 1rem 1.25rem;
      margin: 1.5rem 0;
      text-align: left;
      font-size: 0.95rem;
      color: #991b1b;
      border-top: 1px solid #fee2e2;
      border-right: 1px solid #fee2e2;
      border-bottom: 1px solid #fee2e2;
    }
    .nav-grid {
      display: flex;
      gap: 1rem;
      justify-content: center;
      margin-top: 1.75rem;
      flex-wrap: wrap;
    }
    .btn-pill-primary {
      padding: 9px 20px;
      background: var(--primary);
      color: #ffffff;
      border-radius: 9999px;
      text-decoration: none;
      font-weight: 600;
      font-size: 14px;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      transition: all 0.15s ease;
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.06);
    }
    .btn-pill-primary:hover {
      background: var(--primary-hover);
      transform: translateY(-1px);
      box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12);
    }
    .btn-pill-secondary {
      padding: 9px 18px;
      background: #ffffff;
      color: var(--ink);
      border: 1px solid var(--hairline);
      border-radius: 9999px;
      text-decoration: none;
      font-weight: 600;
      font-size: 14px;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      transition: all 0.15s ease;
    }
    .btn-pill-secondary:hover {
      background: var(--surface-subtle);
      border-color: var(--hairline-strong);
      transform: translateY(-1px);
    }
  </style>
</head>
<body>
  <div class="card">
    <div class="status-badge">${statusCode}</div>
    <h1>Internal Server Error</h1>
    <div class="reason-box">
      <strong>Details:</strong> ${escapeHtml(reason)}
    </div>
    <div class="nav-grid">
      <a href="/main" class="btn-pill-primary">Return to Home</a>
      <a href="/users" class="btn-pill-secondary">Alumni Directory</a>
    </div>
  </div>
</body>
</html>`;
  }
};

module.exports = serverErrorView;
