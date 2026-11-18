/**
 * ========================================================
 * View Layer: Homepage View (Mintlify & Linear Hybrid Synthesis)
 * File: src/views/homeView.js
 * ========================================================
 * 
 * Implements the 4-tier visual importance hierarchy:
 * 1. Katman 1 (Hero — En Baskın Bölüm): Mintlify airiness, tight letter-spacing display headline,
 *    top hairline-bordered announcement badge pill, black pill primary CTA, hairline secondary action button.
 * 2. Katman 2 (Asimetrik Bento Vitrin — Linear Tarzı): 2/3 left featured event anchor with live "Öne Çıkan"
 *    pulse badge + 1/3 right telemetry metric stack with large, bold numbers.
 * 3. Katman 3 (Seçili Mezunlar / Fırsatlar): 1px hairline cards showcasing curated alumni & career opportunities.
 * 4. Katman 4 (Son Duyurular — Kompakt Liste): Linear changelog-style horizontal rows with 1px hairline dividers.
 */

function escapeHtml(str) {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

const homeView = {
  escapeHtml,

  /**
   * Renders the complete HTML homepage document
   * @param {Object} [data={}]
   * @param {number} [data.userCount=0]
   * @param {number} [data.jobPostingCount=0]
   * @param {number} [data.announcementCount=0]
   * @param {number} [data.applicationCount=0]
   * @param {Array<Object>} [data.recentAnnouncements=[]]
   * @param {Array<Object>} [data.recentJobPostings=[]]
   * @param {Array<Object>} [data.recentUsers=[]]
   * @param {Object} [options={}]
   * @returns {string} Formatted HTML document
   */
  renderHomePage(data = {}, options = {}) {
    const userCount = data.userCount !== undefined ? data.userCount : 0;
    const jobPostingCount = data.jobPostingCount !== undefined ? data.jobPostingCount : 0;
    const announcementCount = data.announcementCount !== undefined ? data.announcementCount : 0;
    const applicationCount = data.applicationCount !== undefined ? data.applicationCount : 0;

    const recentAnnouncements = Array.isArray(data.recentAnnouncements) && data.recentAnnouncements.length > 0
      ? data.recentAnnouncements
      : [
        { id: 1, title: 'Annual Alumni Homecoming 2026', author: 'Dean Office · Faculty of Engineering', date: '2026-11-20', category: 'Etkinlik' },
        { id: 2, title: 'Fall Career Fair & Engineering Recruitment Keynote', author: 'Career Center', date: '2026-11-15', category: 'Kariyer' },
        { id: 3, title: 'AI Research Lab Opens Doctoral Fellowship Applications', author: 'Graduate Studies', date: '2026-11-10', category: 'Akademik' }
      ];

    const recentJobPostings = Array.isArray(data.recentJobPostings) && data.recentJobPostings.length > 0
      ? data.recentJobPostings
      : [
        { id: 1, title: 'Senior Cloud Architect', company: 'Google Cloud', city: 'Zurich', type: 'Full-time', salary: '$170,000 - $210,000' },
        { id: 2, title: 'Staff Distributed Systems Engineer', company: 'Stripe Platforms', city: 'Berlin / Remote', type: 'Full-time', salary: '$160,000 - $190,000' }
      ];

    const firstJob = recentJobPostings[0] || {
      id: 1,
      title: 'Senior Cloud Architect',
      company: 'Google Cloud',
      city: 'Zurich',
      type: 'Full-time',
      salary: '$170,000 - $210,000'
    };

    const secondJob = recentJobPostings[1] || {
      id: 2,
      title: 'Staff Distributed Systems Engineer',
      company: 'Stripe Platforms',
      city: 'Berlin / Remote',
      type: 'Full-time',
      salary: '$160,000 - $190,000'
    };

    // Render Katman 4: Compact Announcement Rows (Linear Changelog Style)
    const announcementRowsHtml = recentAnnouncements.map((item, idx) => {
      const itemTitle = this.escapeHtml(item.title || 'Institutional Announcement');
      const itemAuthor = this.escapeHtml(item.author || item.department || 'University Administration');
      const itemDate = this.escapeHtml(item.date || (item.createdAt ? new Date(item.createdAt).toISOString().split('T')[0] : '2026-11-20'));
      const itemCategory = this.escapeHtml(item.category || (idx % 2 === 0 ? 'Etkinlik' : 'Akademik'));
      const itemId = item.id || idx + 1;

      return `
        <div class="changelog-row">
          <div class="changelog-date font-mono">${itemDate}</div>
          <div class="changelog-badge-wrap">
            <span class="badge-pill badge-neutral">${itemCategory}</span>
          </div>
          <div class="changelog-content">
            <a href="/announcements/${itemId}" class="changelog-title-link">
              ${itemTitle}
            </a>
            <span class="changelog-meta">${itemAuthor}</span>
          </div>
          <div class="changelog-arrow">
            <a href="/announcements/${itemId}" class="changelog-icon-btn" title="View details">&rarr;</a>
          </div>
        </div>
      `;
    }).join('');

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Alumni Tracking System — The Premier Network for Verified Alumni & Modern Careers</title>
  <style>
    :root {
      /* Mintlify & Linear Hybrid Tokens */
      --canvas: #ffffff;
      --surface-subtle: #f8fafc;
      --surface-card: #ffffff;
      --surface-dark: #090a0f;
      --surface-dark-panel: #111218;

      --hairline: #e2e8f0;
      --hairline-strong: #cbd5e1;
      --hairline-subtle: #f1f5f9;
      --hairline-dark: #23252a;

      --ink: #090a0f;
      --ink-muted: #475569;
      --ink-subtle: #64748b;
      --ink-tertiary: #94a3b8;
      --on-dark: #ffffff;

      --primary: #090a0f;
      --primary-hover: #1e293b;

      --brand-accent: #5e6ad2;
      --brand-accent-hover: #4f5abf;
      --brand-accent-subtle: #eef0fb;

      --brand-mint: #10b981;
      --brand-mint-deep: #059669;
      --brand-mint-subtle: #ecfdf5;

      --rounded-xs: 4px;
      --rounded-sm: 6px;
      --rounded-md: 8px;
      --rounded-lg: 12px;
      --rounded-xl: 16px;
      --rounded-pill: 9999px;

      --font-sans: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      --font-mono: ui-monospace, "SF Mono", "Geist Mono", Menlo, Consolas, monospace;
    }

    * { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      font-family: var(--font-sans);
      background-color: var(--canvas);
      color: var(--ink);
      line-height: 1.55;
      -webkit-font-smoothing: antialiased;
    }

    .font-mono {
      font-family: var(--font-mono);
    }

    /* TOP STICKY NAVIGATION */
    .top-nav {
      position: sticky;
      top: 0;
      z-index: 100;
      background: rgba(255, 255, 255, 0.94);
      backdrop-filter: blur(12px);
      border-bottom: 1px solid var(--hairline);
    }
    .nav-container {
      max-width: 1240px;
      margin: 0 auto;
      padding: 0 1.5rem;
      height: 64px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
    }
    .brand-lockup {
      display: flex;
      align-items: center;
      gap: 8px;
      text-decoration: none;
      color: var(--ink);
      font-weight: 700;
      font-size: 1rem;
      letter-spacing: -0.3px;
      white-space: nowrap;
    }
    .brand-icon {
      font-size: 1.25rem;
      line-height: 1;
    }
    .nav-menu {
      display: flex;
      align-items: center;
      gap: 2px;
      list-style: none;
    }
    .nav-link {
      text-decoration: none;
      color: var(--ink-muted);
      font-size: 13px;
      font-weight: 500;
      padding: 5px 9px;
      border-radius: var(--rounded-pill);
      transition: all 0.15s ease;
      white-space: nowrap;
    }
    .nav-link:hover {
      color: var(--ink);
      background: var(--surface-subtle);
    }
    .nav-link.active {
      color: var(--ink);
      background: var(--surface-subtle);
      font-weight: 600;
    }
    .nav-actions {
      display: flex;
      align-items: center;
      gap: 8px;
      white-space: nowrap;
    }

    /* PILL BUTTONS (Mintlify & Linear Spec) */
    .btn-pill-primary {
      background: var(--primary);
      color: #ffffff !important;
      padding: 10px 22px;
      border-radius: var(--rounded-pill);
      font-size: 14px;
      font-weight: 600;
      text-decoration: none;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      border: 1px solid transparent;
      transition: all 0.15s ease;
      cursor: pointer;
      line-height: 1.2;
    }
    .btn-pill-primary:hover {
      background: var(--primary-hover);
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    }
    .btn-pill-secondary {
      background: #ffffff;
      color: var(--ink) !important;
      padding: 10px 20px;
      border-radius: var(--rounded-pill);
      font-size: 14px;
      font-weight: 600;
      text-decoration: none;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      border: 1px solid var(--hairline);
      transition: all 0.15s ease;
      cursor: pointer;
      line-height: 1.2;
    }
    .btn-pill-secondary:hover {
      background: var(--surface-subtle);
      border-color: var(--hairline-strong);
      transform: translateY(-1px);
    }
    .btn-pill-sm {
      background: var(--surface-subtle);
      color: var(--ink) !important;
      padding: 6px 14px;
      border-radius: var(--rounded-pill);
      font-size: 13px;
      font-weight: 500;
      text-decoration: none;
      border: 1px solid var(--hairline);
      display: inline-flex;
      align-items: center;
      gap: 4px;
      transition: all 0.15s ease;
    }
    .btn-pill-sm:hover {
      background: var(--primary);
      color: #ffffff !important;
      border-color: var(--primary);
    }

    /* BADGE PILLS */
    .badge-pill {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 4px 10px;
      border-radius: var(--rounded-pill);
      font-size: 12px;
      font-weight: 500;
      line-height: 1;
      white-space: nowrap;
    }
    .badge-mint {
      background: var(--brand-mint-subtle);
      color: var(--brand-mint-deep);
      border: 1px solid #a7f3d0;
    }
    .badge-accent {
      background: var(--brand-accent-subtle);
      color: var(--brand-accent);
      border: 1px solid #d5daf7;
    }
    .badge-neutral {
      background: var(--surface-subtle);
      color: var(--ink-subtle);
      border: 1px solid var(--hairline);
    }

    /* PULSING DOT */
    .pulse-dot {
      width: 7px;
      height: 7px;
      background: var(--brand-mint);
      border-radius: 50%;
      display: inline-block;
      box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.25);
    }

    /* ========================================================
     * KATMAN 1: HERO (En Baskın Bölüm — Mintlify Ferahlığı)
     * ======================================================== */
    .hero-section {
      padding: 5rem 1.5rem 3.5rem 1.5rem;
      max-width: 1040px;
      margin: 0 auto;
      text-align: center;
    }
    .hero-badge-wrap {
      display: flex;
      justify-content: center;
      margin-bottom: 1.5rem;
    }
    .hero-pill-badge {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 5px 14px;
      background: #ffffff;
      border: 1px solid var(--hairline);
      border-radius: var(--rounded-pill);
      text-decoration: none;
      color: var(--ink);
      font-size: 13px;
      font-weight: 500;
      box-shadow: 0 1px 4px rgba(0,0,0,0.03);
      transition: all 0.15s ease;
    }
    .hero-pill-badge:hover {
      border-color: var(--hairline-strong);
      transform: translateY(-1px);
    }
    .badge-arrow {
      color: var(--brand-accent);
      font-weight: 600;
    }
    .hero-headline {
      font-size: clamp(2.4rem, 5vw, 4.25rem);
      font-weight: 700;
      letter-spacing: -2.5px;
      line-height: 1.08;
      color: var(--ink);
      margin-bottom: 1.25rem;
    }
    .hero-subhead {
      font-size: clamp(1.05rem, 2vw, 1.25rem);
      color: var(--ink-muted);
      max-width: 740px;
      margin: 0 auto 2.25rem auto;
      line-height: 1.55;
      font-weight: 400;
    }
    .hero-actions {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 12px;
      flex-wrap: wrap;
      margin-bottom: 2.5rem;
    }
    .hero-trust-bar {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 12px;
      color: var(--ink-tertiary);
      font-size: 13px;
      flex-wrap: wrap;
    }

    /* SECTION CONTAINERS */
    .section-wrap {
      max-width: 1240px;
      margin: 0 auto;
      padding: 2.5rem 1.5rem 4rem 1.5rem;
    }
    .section-header {
      margin-bottom: 2rem;
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      flex-wrap: wrap;
      gap: 1rem;
    }
    .section-eyebrow {
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.8px;
      color: var(--brand-accent);
      margin-bottom: 6px;
    }
    .section-title {
      font-size: 2rem;
      font-weight: 700;
      letter-spacing: -1.2px;
      color: var(--ink);
      line-height: 1.2;
    }
    .section-sub {
      color: var(--ink-muted);
      font-size: 15px;
      margin-top: 6px;
      max-width: 640px;
    }
    .section-more-link {
      color: var(--brand-accent);
      text-decoration: none;
      font-size: 14px;
      font-weight: 600;
      display: inline-flex;
      align-items: center;
      gap: 4px;
    }
    .section-more-link:hover {
      text-decoration: underline;
    }

    /* ========================================================
     * KATMAN 2: ASİMETRİK BENTO VİTRİN (Linear Tarzı 2/3 + 1/3)
     * ======================================================== */
    .bento-grid {
      display: grid;
      grid-template-columns: 1.85fr 1fr;
      gap: 24px;
      align-items: stretch;
    }
    .bento-card-main {
      background: #ffffff;
      border: 1px solid var(--hairline);
      border-radius: var(--rounded-xl);
      padding: 2.5rem;
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.03);
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      position: relative;
      overflow: hidden;
    }
    .bento-card-main::before {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 3px;
      background: linear-gradient(90deg, var(--brand-accent), var(--brand-mint));
    }
    .bento-badge-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 1.25rem;
      flex-wrap: wrap;
      gap: 8px;
    }
    .bento-event-title {
      font-size: clamp(1.6rem, 3vw, 2.25rem);
      font-weight: 700;
      letter-spacing: -1.2px;
      color: var(--ink);
      line-height: 1.2;
      margin-bottom: 1rem;
    }
    .bento-event-desc {
      color: var(--ink-muted);
      font-size: 15px;
      line-height: 1.6;
      margin-bottom: 2rem;
    }
    .bento-mini-features {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 12px;
      margin-bottom: 2rem;
    }
    .bento-feature-tile {
      background: var(--surface-subtle);
      border: 1px solid var(--hairline);
      padding: 12px 14px;
      border-radius: var(--rounded-md);
      font-size: 13px;
      color: var(--ink);
      font-weight: 500;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .bento-bottom-bar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 12px;
      padding-top: 1.5rem;
      border-top: 1px solid var(--hairline-subtle);
    }
    .bento-action-btns {
      display: flex;
      gap: 10px;
      align-items: center;
    }
    .bento-live-counter {
      font-size: 13px;
      color: var(--ink-subtle);
    }

    /* RIGHT 1/3 METRIC STACK */
    .bento-metric-stack {
      display: flex;
      flex-direction: column;
      gap: 14px;
      justify-content: space-between;
    }
    .metric-card {
      background: #ffffff;
      border: 1px solid var(--hairline);
      border-radius: var(--rounded-lg);
      padding: 1.4rem 1.5rem;
      box-shadow: 0 1px 4px rgba(0,0,0,0.02);
      transition: all 0.15s ease;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
    .metric-card:hover {
      border-color: var(--hairline-strong);
      transform: translateY(-1px);
    }
    .metric-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.5rem;
    }
    .metric-label {
      font-size: 11.5px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.8px;
      color: var(--ink-subtle);
    }
    .metric-number {
      font-size: 2.25rem;
      font-weight: 700;
      line-height: 1;
      letter-spacing: -1px;
      color: var(--ink);
      margin-bottom: 0.35rem;
    }
    .metric-sub {
      font-size: 12.5px;
      color: var(--ink-muted);
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 4px;
    }
    .metric-link {
      color: var(--brand-accent);
      text-decoration: none;
      font-weight: 500;
    }
    .metric-link:hover {
      text-decoration: underline;
    }

    /* ========================================================
     * KATMAN 3: SEÇİLİ MEZUNLAR & FIRSATLAR (Curated 3-Up Grid)
     * ======================================================== */
    .curated-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
      gap: 20px;
    }
    .curated-card {
      background: #ffffff;
      border: 1px solid var(--hairline);
      border-radius: var(--rounded-lg);
      padding: 1.75rem;
      box-shadow: 0 1px 4px rgba(0, 0, 0, 0.02);
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      transition: all 0.15s ease;
    }
    .curated-card:hover {
      border-color: var(--hairline-strong);
      transform: translateY(-2px);
      box-shadow: 0 6px 18px rgba(0, 0, 0, 0.04);
    }
    .card-top {
      margin-bottom: 1.25rem;
    }
    .card-badge-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
    }
    .card-heading {
      font-size: 1.25rem;
      font-weight: 700;
      letter-spacing: -0.4px;
      color: var(--ink);
      margin-bottom: 0.35rem;
    }
    .card-company {
      font-size: 14px;
      color: var(--ink-muted);
      font-weight: 500;
      margin-bottom: 0.75rem;
    }
    .card-meta-pills {
      display: flex;
      gap: 6px;
      flex-wrap: wrap;
      margin-bottom: 1rem;
    }
    .meta-tag {
      background: var(--surface-subtle);
      border: 1px solid var(--hairline);
      padding: 3px 8px;
      border-radius: var(--rounded-pill);
      font-size: 12px;
      color: var(--ink-subtle);
    }
    .card-body-text {
      font-size: 14px;
      color: var(--ink-muted);
      line-height: 1.5;
      margin-bottom: 1.5rem;
    }
    .card-footer-action {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-top: 1rem;
      border-top: 1px solid var(--hairline-subtle);
    }

    /* ========================================================
     * KATMAN 4: SON DUYURULAR (Kompakt Liste — Linear Changelog)
     * ======================================================== */
    .changelog-box {
      background: #ffffff;
      border: 1px solid var(--hairline);
      border-radius: var(--rounded-lg);
      overflow: hidden;
      box-shadow: 0 1px 4px rgba(0,0,0,0.02);
    }
    .changelog-row {
      display: grid;
      grid-template-columns: 110px 100px 1fr 40px;
      align-items: center;
      gap: 16px;
      padding: 16px 24px;
      border-bottom: 1px solid var(--hairline-subtle);
      transition: background 0.15s ease;
    }
    .changelog-row:last-child {
      border-bottom: none;
    }
    .changelog-row:hover {
      background: var(--surface-subtle);
    }
    .changelog-date {
      font-size: 13px;
      color: var(--ink-subtle);
    }
    .changelog-badge-wrap {
      display: flex;
      align-items: center;
    }
    .changelog-content {
      display: flex;
      align-items: center;
      gap: 12px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
    .changelog-title-link {
      color: var(--ink);
      text-decoration: none;
      font-size: 14.5px;
      font-weight: 600;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .changelog-title-link:hover {
      color: var(--brand-accent);
      text-decoration: underline;
    }
    .changelog-meta {
      font-size: 13px;
      color: var(--ink-tertiary);
      white-space: nowrap;
    }
    .changelog-arrow {
      text-align: right;
    }
    .changelog-icon-btn {
      color: var(--ink-subtle);
      text-decoration: none;
      font-size: 16px;
      font-weight: 600;
      transition: color 0.15s ease;
    }
    .changelog-icon-btn:hover {
      color: var(--brand-accent);
    }

    /* FOOTER */
    .site-footer {
      border-top: 1px solid var(--hairline);
      background: #ffffff;
      padding: 4.5rem 1.5rem 2.5rem 1.5rem;
      margin-top: 3rem;
    }
    .footer-container {
      max-width: 1240px;
      margin: 0 auto;
      display: grid;
      grid-template-columns: 2fr 1fr 1fr 1fr;
      gap: 3rem;
      margin-bottom: 3.5rem;
    }
    .footer-brand {
      font-weight: 700;
      font-size: 1.1rem;
      color: var(--ink);
      margin-bottom: 0.75rem;
    }
    .footer-desc {
      font-size: 14px;
      color: var(--ink-muted);
      line-height: 1.6;
      max-width: 320px;
    }
    .footer-col-title {
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.8px;
      color: var(--ink);
      margin-bottom: 1.25rem;
    }
    .footer-links {
      list-style: none;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    .footer-links a {
      color: var(--ink-subtle);
      text-decoration: none;
      font-size: 13.5px;
      transition: color 0.15s ease;
    }
    .footer-links a:hover {
      color: var(--ink);
      text-decoration: underline;
    }
    .footer-bottom {
      max-width: 1240px;
      margin: 0 auto;
      padding-top: 2rem;
      border-top: 1px solid var(--hairline);
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 1rem;
      font-size: 13px;
      color: var(--ink-tertiary);
    }
    .tech-badges {
      display: flex;
      gap: 8px;
      align-items: center;
    }
    .tech-pill {
      background: var(--surface-subtle);
      border: 1px solid var(--hairline);
      padding: 3px 8px;
      border-radius: var(--rounded-pill);
      font-size: 11.5px;
      font-weight: 500;
      color: var(--ink-subtle);
    }

    /* RESPONSIVE DESIGN */
    @media (max-width: 1024px) {
      .bento-grid {
        grid-template-columns: 1fr;
      }
      .footer-container {
        grid-template-columns: 1fr 1fr;
      }
    }
    @media (max-width: 768px) {
      .nav-menu {
        display: none;
      }
      .changelog-row {
        grid-template-columns: 1fr;
        gap: 8px;
      }
      .changelog-content {
        flex-direction: column;
        align-items: flex-start;
      }
      .footer-container {
        grid-template-columns: 1fr;
      }
    }
  </style>
</head>
<body>

  <!-- STICKY NAVIGATION -->
  <header class="top-nav">
    <div class="nav-container">
      <a href="/main" class="brand-lockup">
        <span class="brand-icon">🎓</span>
        <span>Alumni Tracking System</span>
      </a>
      <ul class="nav-menu">
        <li><a href="/main" class="nav-link active">Home</a></li>
        <li><a href="/users" class="nav-link">Alumni Directory</a></li>
        <li><a href="/job-postings" class="nav-link">Career Opportunities</a></li>
        <li><a href="/announcements" class="nav-link">Announcements Board</a></li>
        <li><a href="/applications" class="nav-link">Application Tracking</a></li>
        <li><a href="/api/swagger" class="nav-link" target="_blank">Swagger UI</a></li>
        <li><a href="/api/health" class="nav-link">System Health</a></li>
      </ul>
      <div class="nav-actions">
        <a href="/job-postings#post-job" class="btn-pill-primary">
          <span>+</span> Post Opportunity
        </a>
      </div>
    </div>
  </header>

  <!-- ========================================================
   * KATMAN 1: HERO (En Baskın Bölüm — Mintlify Ferahlığı)
   * ======================================================== -->
  <section class="hero-section">
    <div class="hero-badge-wrap">
      <a href="#bento-showcase" class="hero-pill-badge">
        <span class="pulse-dot"></span>
        <span class="badge-text">Annual Alumni Homecoming 2026 Registration Open</span>
        <span class="badge-arrow">&rarr;</span>
      </a>
    </div>

    <h1 class="hero-headline">
      The Premier Network for Verified Alumni & Modern Careers
    </h1>

    <p class="hero-subhead">
      Connecting distinguished graduates, ambitious students, and academic faculties through verified credentials, high-impact mentorship, and exclusive career opportunities.
    </p>

    <div class="hero-actions">
      <a href="/users" class="btn-pill-primary">Explore Alumni Directory &rarr;</a>
      <a href="/job-postings#post-job" class="btn-pill-secondary">+ Post Career Opportunity</a>
    </div>

    <div class="hero-trust-bar font-mono">
      <span>✓ Verified institutional credentials</span>
      <span>•</span>
      <span>✓ Direct executive mentorship</span>
      <span>•</span>
      <span>✓ Real-time hiring pipeline</span>
    </div>
  </section>

  <!-- ========================================================
   * KATMAN 2: ASİMETRİK BENTO VİTRİN (Linear Tarzı 2/3 Sol + 1/3 Sağ)
   * ======================================================== -->
  <section class="section-wrap" id="bento-showcase">
    <div class="section-header">
      <div>
        <div class="section-eyebrow">BENTO SPOTLIGHT & PLATFORM TELEMETRY</div>
        <h2 class="section-title">Flagship Community Showcase</h2>
        <p class="section-sub">
          Major upcoming institutional gatherings paired with live platform telemetry.
        </p>
      </div>
    </div>

    <div class="bento-grid">
      <!-- 2/3 SOL GENİŞ KART: Öne Çıkan Mezun Buluşması / Zirve -->
      <article class="bento-card-main">
        <div>
          <div class="bento-badge-row">
            <span class="badge-pill badge-mint">
              <span class="pulse-dot"></span>
              Öne Çıkan (Featured)
            </span>
            <span class="badge-pill badge-neutral font-mono">📅 20–22 Kasım 2026</span>
          </div>

          <h3 class="bento-event-title">Annual Global Alumni Tech Summit 2026</h3>
          <p class="bento-event-desc">
            Join 1,200+ distinguished alumni, keynote leaders from Google, OpenAI, Apple, and premier research faculties. Three days of cross-disciplinary keynotes, venture showcases, and departmental reunions.
          </p>

          <div class="bento-mini-features">
            <div class="bento-feature-tile">
              <span>🎙️</span> 32 Keynote Alumni Speakers
            </div>
            <div class="bento-feature-tile">
              <span>💼</span> Executive Hiring Lounge
            </div>
            <div class="bento-feature-tile">
              <span>🏛️</span> Grand Hall & Hybrid Stream
            </div>
          </div>
        </div>

        <div class="bento-bottom-bar">
          <div class="bento-action-btns">
            <a href="/announcements" class="btn-pill-primary">RSVP & Full Agenda &rarr;</a>
            <a href="/announcements/1" class="btn-pill-secondary">Event Details</a>
          </div>
          <span class="bento-live-counter font-mono">🔥 842 Alumni Registered</span>
        </div>
      </article>

      <!-- 1/3 SAĞ METRİK SÜTUNU: Kalın Rakamlar & Telemetri -->
      <aside class="bento-metric-stack">
        <div class="metric-card">
          <div class="metric-header">
            <span class="metric-label">VERIFIED ALUMNI DIRECTORY</span>
            <span class="badge-pill badge-mint">Live</span>
          </div>
          <div class="metric-number font-mono">${userCount}</div>
          <div class="metric-sub">
            <span>Verified graduate profiles</span>
            <a href="/users" class="metric-link">Browse &rarr;</a>
          </div>
        </div>

        <div class="metric-card">
          <div class="metric-header">
            <span class="metric-label">CAREER OPPORTUNITIES</span>
            <span class="badge-pill badge-accent">Active</span>
          </div>
          <div class="metric-number font-mono" style="color:var(--brand-accent);">${jobPostingCount}</div>
          <div class="metric-sub">
            <span>Engineering & executive roles</span>
            <a href="/job-postings" class="metric-link">View board &rarr;</a>
          </div>
        </div>

        <div class="metric-card">
          <div class="metric-header">
            <span class="metric-label">APPLICATION TRACKING</span>
            <span class="badge-pill badge-neutral">Pipeline</span>
          </div>
          <div class="metric-number font-mono" style="color:var(--brand-mint-deep);">${applicationCount}</div>
          <div class="metric-sub">
            <span>Active candidate submissions</span>
            <a href="/applications" class="metric-link">Track &rarr;</a>
          </div>
        </div>
      </aside>
    </div>
  </section>

  <!-- ========================================================
   * KATMAN 3: SEÇİLİ MEZUNLAR & FIRSATLAR (Curated 3-Up Grid)
   * ======================================================== -->
  <section class="section-wrap">
    <div class="section-header">
      <div>
        <div class="section-eyebrow">CURATED HIGHLIGHTS & TALENT</div>
        <h2 class="section-title">Distinguished Alumni & Career Roles</h2>
        <p class="section-sub">
          Hand-picked mentors and verified career openings across top global technology teams.
        </p>
      </div>
      <div>
        <a href="/job-postings" class="section-more-link">Explore all career postings &rarr;</a>
      </div>
    </div>

    <div class="curated-grid">
      <!-- Opportunity 1 (Dynamic / Fallback) -->
      <article class="curated-card">
        <div class="card-top">
          <div class="card-badge-row">
            <span class="badge-pill badge-accent">Featured Opportunity</span>
            <span class="meta-tag font-mono">${this.escapeHtml(firstJob.type || 'Full-time')}</span>
          </div>
          <h3 class="card-heading">${this.escapeHtml(firstJob.title || 'Senior Cloud Architect')}</h3>
          <div class="card-company">🏢 ${this.escapeHtml(firstJob.company || 'Google Cloud')}</div>
          <div class="card-meta-pills">
            <span class="meta-tag">📍 ${this.escapeHtml(firstJob.city || 'Zurich')}</span>
            <span class="meta-tag font-mono">${this.escapeHtml(firstJob.salary || '$170,000 - $210,000')}</span>
          </div>
          <p class="card-body-text">
            Lead enterprise multi-region cloud infrastructures and scale mission-critical backend microservices alongside senior alumni staff engineers.
          </p>
        </div>
        <div class="card-footer-action">
          <a href="/job-postings/${firstJob.id || 1}" class="btn-pill-sm">Review & Apply &rarr;</a>
          <span style="font-size:12px; color:var(--ink-tertiary);" class="font-mono">ID #${firstJob.id || 1}</span>
        </div>
      </article>

      <!-- Alumnus Spotlight 2 -->
      <article class="curated-card">
        <div class="card-top">
          <div class="card-badge-row">
            <span class="badge-pill badge-mint">
              <span class="pulse-dot"></span>
              Verified Alumnus
            </span>
            <span class="meta-tag font-mono">Class of '18</span>
          </div>
          <h3 class="card-heading">Dr. Selin Demir</h3>
          <div class="card-company">Principal Research Scientist · Stanford AI Lab</div>
          <div class="card-meta-pills">
            <span class="meta-tag">Computer Science</span>
            <span class="meta-tag">Distributed AI Systems</span>
          </div>
          <p class="card-body-text">
            Pioneering frontier foundation models and autonomous agent reasoning. Active alumni career mentor providing weekly office hours for graduating seniors.
          </p>
        </div>
        <div class="card-footer-action">
          <a href="/users" class="btn-pill-sm">Connect Profile &rarr;</a>
          <span style="font-size:12px; color:var(--ink-tertiary);" class="font-mono">User #1</span>
        </div>
      </article>

      <!-- Opportunity 2 -->
      <article class="curated-card">
        <div class="card-top">
          <div class="card-badge-row">
            <span class="badge-pill" style="background:#eff6ff; color:#2563eb; border:1px solid #bfdbfe;">New Listing</span>
            <span class="meta-tag font-mono">${this.escapeHtml(secondJob.type || 'Full-time')}</span>
          </div>
          <h3 class="card-heading">${this.escapeHtml(secondJob.title || 'Staff Distributed Systems Engineer')}</h3>
          <div class="card-company">🏢 ${this.escapeHtml(secondJob.company || 'Stripe Platforms')}</div>
          <div class="card-meta-pills">
            <span class="meta-tag">📍 ${this.escapeHtml(secondJob.city || 'Berlin / Remote')}</span>
            <span class="meta-tag font-mono">${this.escapeHtml(secondJob.salary || '$160,000 - $190,000')}</span>
          </div>
          <p class="card-body-text">
            Architect real-time transaction processing ledgers serving millions of daily global payments with zero-downtime consistency guarantees.
          </p>
        </div>
        <div class="card-footer-action">
          <a href="/job-postings/${secondJob.id || 2}" class="btn-pill-sm">Review & Apply &rarr;</a>
          <span style="font-size:12px; color:var(--ink-tertiary);" class="font-mono">ID #${secondJob.id || 2}</span>
        </div>
      </article>
    </div>
  </section>

  <!-- ========================================================
   * KATMAN 4: SON DUYURULAR (Kompakt Liste — Linear Changelog Stili)
   * ======================================================== -->
  <section class="section-wrap">
    <div class="section-header">
      <div>
        <div class="section-eyebrow">OFFICIAL DISPATCHES & NOTICES</div>
        <h2 class="section-title">Announcements Board</h2>
        <p class="section-sub">
          Official departmental memos, symposium dates, and community milestones.
        </p>
      </div>
      <div>
        <a href="/announcements" class="section-more-link">View all announcements (${announcementCount}) &rarr;</a>
      </div>
    </div>

    <div class="changelog-box">
      ${announcementRowsHtml}
    </div>
  </section>

  <!-- SITE FOOTER -->
  <footer class="site-footer">
    <div class="footer-container">
      <div>
        <div class="footer-brand">🎓 Alumni Tracking System</div>
        <p class="footer-desc">
          A high-velocity academic network synthesizing Mintlify’s documentation clarity with Linear’s Bento precision. Built for alumni, students, and faculty.
        </p>
      </div>
      <div>
        <div class="footer-col-title">Navigation</div>
        <ul class="footer-links">
          <li><a href="/main">Home</a></li>
          <li><a href="/users">Alumni Directory</a></li>
          <li><a href="/job-postings">Career Opportunities</a></li>
          <li><a href="/announcements">Announcements Board</a></li>
          <li><a href="/applications">Application Tracking</a></li>
        </ul>
      </div>
      <div>
        <div class="footer-col-title">Developer & API</div>
        <ul class="footer-links">
          <li><a href="/api/swagger">Swagger UI</a></li>
          <li><a href="/api/swagger.json">OpenAPI 3.0 Spec</a></li>
          <li><a href="/api/health">System Health</a></li>
          <li><a href="/404">404 Guardian</a></li>
        </ul>
      </div>
      <div>
        <div class="footer-col-title">Documentation</div>
        <ul class="footer-links">
          <li><a href="/brand.md">Brand Manual (brand.md)</a></li>
          <li><a href="/DESIGN.md">Design System (DESIGN.md)</a></li>
          <li><a href="https://github.com/ecemyakali/alumni" target="_blank" rel="noopener">GitHub Repository</a></li>
        </ul>
      </div>
    </div>

    <div class="footer-bottom">
      <div>© 2026 Alumni Tracking System. All rights reserved.</div>
      <div class="tech-badges">
        <span class="tech-pill font-mono">Node.js</span>
        <span class="tech-pill font-mono">Express</span>
        <span class="tech-pill font-mono">PostgreSQL</span>
        <span class="tech-pill font-mono">REST API</span>
        <span class="tech-pill font-mono">Docker</span>
      </div>
    </div>
  </footer>

</body>
</html>`;
  }
};

module.exports = homeView;
