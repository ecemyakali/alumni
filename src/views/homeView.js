/**
 * Homepage View (Clay.com-inspired Tactile SaaS Design System)
 * File: src/views/homeView.js
 * 
 * Implements the master design system:
 * - Warm cream canvas floor (#fffaf0)
 * - 6-color saturated domain feature cards (Pink, Teal, Peach, Lavender, Ochre, Mint)
 * - 3D claymation illustration depth & academic hero card
 * - Rounded display typography at weight 500 with negative letter spacing
 * - Embedded product UI fragments inside feature cards
 * - Warm cream pre-footer CTA band & warm footer (#faf5e8)
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
   * @param {Object} [options={}]
   * @returns {string} Formatted HTML document
   */
  renderHomePage(data = {}, options = {}) {
    const userCount = data.userCount ?? 0;
    const jobPostingCount = data.jobPostingCount ?? 0;
    const announcementCount = data.announcementCount ?? 0;
    const applicationCount = data.applicationCount ?? 0;
    const recentAnnouncements = data.recentAnnouncements || [];
    const recentJobPostings = data.recentJobPostings || [];

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Alumni Tracking System — Empowering Graduate Connections & Careers</title>
  <style>
    :root {
      /* Surface Tokens (Warm Cream Canvas System) */
      --colors-canvas: #fffaf0;
      --colors-surface-soft: #faf5e8;
      --colors-surface-card: #f5f0e0;
      --colors-surface-strong: #ebe6d6;
      --colors-hairline: #e5e5e5;
      --colors-surface-dark: #0a1a1a;

      /* Saturated Feature Card Palette */
      --colors-brand-pink: #ff4d8b;
      --colors-brand-teal: #1a3a3a;
      --colors-brand-lavender: #b8a4ed;
      --colors-brand-peach: #ffb084;
      --colors-brand-ochre: #e8b94a;
      --colors-brand-mint: #a4d4c5;
      --colors-brand-blue: #2563eb;

      /* Ink & Typography Tokens */
      --colors-primary: #0a0a0a;
      --colors-ink: #0a0a0a;
      --colors-body-strong: #1a1a1a;
      --colors-body: #3a3a3a;
      --colors-muted: #6a6a6a;
      --colors-muted-soft: #9a9a9a;
      --colors-on-dark: #ffffff;

      /* Semantic Status Tokens */
      --colors-success: #22c55e;
      --colors-warning: #f59e0b;
      --colors-error: #ef4444;

      /* Border Radius Scale */
      --rounded-xs: 6px;
      --rounded-sm: 8px;
      --rounded-md: 12px;
      --rounded-lg: 16px;
      --rounded-xl: 24px;
      --rounded-pill: 9999px;

      /* Spacing Scale */
      --spacing-xxs: 4px;
      --spacing-xs: 8px;
      --spacing-sm: 12px;
      --spacing-md: 16px;
      --spacing-lg: 24px;
      --spacing-xl: 32px;
      --spacing-xxl: 48px;
      --spacing-section: 96px;

      /* Typography Font Families */
      --font-display: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      --font-body: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      --font-mono: ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace;
    }

    * { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      font-family: var(--font-body);
      background-color: var(--colors-canvas);
      color: var(--colors-ink);
      line-height: 1.6;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      -webkit-font-smoothing: antialiased;
    }

    /* TOP NAVIGATION (Sticky Cream Bar) */
    .top-nav {
      background: var(--colors-canvas);
      border-bottom: 1px solid var(--colors-hairline);
      position: sticky;
      top: 0;
      z-index: 100;
      backdrop-filter: blur(8px);
    }
    .nav-container {
      max-width: 1280px;
      margin: 0 auto;
      padding: 0 1.5rem;
      height: 64px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1.5rem;
    }
    .brand-lockup {
      display: flex;
      align-items: center;
      gap: 0.6rem;
      text-decoration: none;
      color: var(--colors-ink);
      font-weight: 600;
      font-size: 1.15rem;
      letter-spacing: -0.5px;
    }
    .brand-emblem {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 34px;
      height: 34px;
      background: var(--colors-surface-card);
      border: 1px solid var(--colors-hairline);
      border-radius: var(--rounded-sm);
      font-size: 1.25rem;
    }
    .nav-menu {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      list-style: none;
    }
    .nav-link {
      text-decoration: none;
      color: var(--colors-body);
      font-weight: 500;
      font-size: 14px;
      padding: 8px 14px;
      border-radius: var(--rounded-md);
      transition: background 0.15s ease, color 0.15s ease;
    }
    .nav-link:hover {
      color: var(--colors-ink);
      background: var(--colors-surface-card);
    }
    .nav-actions {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }
    .btn-nav-primary {
      background: var(--colors-primary);
      color: var(--colors-on-dark) !important;
      padding: 10px 18px;
      border-radius: var(--rounded-md);
      font-weight: 600;
      font-size: 14px;
      text-decoration: none;
      transition: transform 0.15s ease, opacity 0.15s ease;
      display: inline-flex;
      align-items: center;
      gap: 6px;
    }
    .btn-nav-primary:hover {
      opacity: 0.92;
      transform: translateY(-1px);
    }

    /* MAIN CONTAINER */
    .page-main {
      flex: 1;
      max-width: 1280px;
      width: 100%;
      margin: 0 auto;
      padding: 0 1.5rem;
    }

    /* HERO BAND (7/5 Split Grid) */
    .hero-band {
      padding: 64px 0 72px 0;
      display: grid;
      grid-template-columns: 7fr 5fr;
      gap: 48px;
      align-items: center;
    }
    .hero-content {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }
    .hero-badge-pill {
      align-self: flex-start;
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 6px 14px;
      background: var(--colors-surface-card);
      border: 1px solid var(--colors-hairline);
      border-radius: var(--rounded-pill);
      font-size: 13px;
      font-weight: 500;
      color: var(--colors-body-strong);
    }
    .hero-badge-dot {
      width: 8px;
      height: 8px;
      border-radius: var(--rounded-pill);
      background: var(--colors-brand-pink);
    }
    .hero-headline {
      font-family: var(--font-display);
      font-size: 64px;
      line-height: 1.05;
      font-weight: 500;
      letter-spacing: -2.5px;
      color: var(--colors-ink);
    }
    .hero-subtitle {
      font-size: 18px;
      line-height: 1.55;
      color: var(--colors-body);
      max-width: 580px;
    }
    .hero-cta-cluster {
      display: flex;
      align-items: center;
      gap: 12px;
      flex-wrap: wrap;
      margin-top: 8px;
    }
    .btn-clay-primary {
      background: var(--colors-primary);
      color: var(--colors-on-dark);
      padding: 12px 24px;
      height: 46px;
      border-radius: var(--rounded-md);
      font-weight: 600;
      font-size: 14px;
      text-decoration: none;
      display: inline-flex;
      align-items: center;
      gap: 8px;
      transition: transform 0.15s ease, opacity 0.15s ease;
    }
    .btn-clay-primary:hover {
      transform: translateY(-2px);
      opacity: 0.92;
    }
    .btn-clay-secondary {
      background: var(--colors-canvas);
      color: var(--colors-ink);
      border: 1px solid var(--colors-hairline);
      padding: 12px 20px;
      height: 46px;
      border-radius: var(--rounded-md);
      font-weight: 600;
      font-size: 14px;
      text-decoration: none;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      transition: background 0.15s ease, border-color 0.15s ease;
    }
    .btn-clay-secondary:hover {
      background: var(--colors-surface-card);
      border-color: #d0d0d0;
    }

    /* 3D CLAYMATION HERO CARD */
    .hero-illustration-card {
      background: var(--colors-surface-soft);
      border: 1px solid var(--colors-hairline);
      border-radius: var(--rounded-xl);
      padding: 36px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      position: relative;
      overflow: hidden;
      min-height: 380px;
    }
    .clay-art-container {
      position: relative;
      width: 100%;
      max-width: 280px;
      height: 200px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .clay-mountain-bg {
      position: absolute;
      bottom: 0;
      width: 240px;
      height: 110px;
      background: linear-gradient(135deg, #ffb084 0%, #e8b94a 100%);
      border-radius: 90px 90px 24px 24px;
      opacity: 0.85;
      box-shadow: inset 0 -8px 16px rgba(0,0,0,0.06);
    }
    .clay-cap-mascot {
      position: relative;
      font-size: 84px;
      filter: drop-shadow(0 14px 18px rgba(10,26,26,0.12));
      animation: floatMascot 4s ease-in-out infinite alternate;
      z-index: 2;
    }
    @keyframes floatMascot {
      0% { transform: translateY(0px) rotate(-1deg); }
      100% { transform: translateY(-8px) rotate(2deg); }
    }
    .hero-card-meta {
      margin-top: 18px;
      z-index: 3;
    }
    .hero-card-title {
      font-family: var(--font-display);
      font-size: 20px;
      font-weight: 600;
      letter-spacing: -0.5px;
      color: var(--colors-ink);
    }
    .hero-card-tag {
      font-size: 13px;
      color: var(--colors-muted);
      margin-top: 4px;
    }

    /* LIVE METRICS COUNTER STRIP */
    .metrics-section {
      margin-bottom: 72px;
    }
    .metrics-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 16px;
    }
    .metric-card {
      background: var(--colors-surface-card);
      border: 1px solid var(--colors-hairline);
      border-radius: var(--rounded-lg);
      padding: 24px 20px;
      transition: transform 0.15s ease;
    }
    .metric-card:hover {
      transform: translateY(-2px);
    }
    .metric-count {
      font-family: var(--font-display);
      font-size: 38px;
      font-weight: 500;
      letter-spacing: -1px;
      color: var(--colors-ink);
      line-height: 1.1;
    }
    .metric-label {
      font-size: 13px;
      font-weight: 500;
      color: var(--colors-muted);
      margin-top: 6px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    /* 6-COLOR SATURATED FEATURE CARDS BAND */
    .features-band {
      margin-bottom: 96px;
    }
    .section-header-block {
      margin-bottom: 40px;
    }
    .section-tag {
      font-size: 12px;
      font-weight: 600;
      letter-spacing: 1.5px;
      text-transform: uppercase;
      color: var(--colors-muted);
      margin-bottom: 8px;
    }
    .section-heading {
      font-family: var(--font-display);
      font-size: 40px;
      font-weight: 500;
      letter-spacing: -1.2px;
      line-height: 1.15;
      color: var(--colors-ink);
    }
    .section-subtext {
      font-size: 16px;
      color: var(--colors-body);
      margin-top: 8px;
      max-width: 640px;
    }

    .features-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 24px;
    }
    .feature-card {
      border-radius: var(--rounded-xl);
      padding: 32px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      min-height: 380px;
      position: relative;
      overflow: hidden;
      transition: transform 0.2s ease;
    }
    .feature-card:hover {
      transform: translateY(-3px);
    }
    .card-top {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 20px;
    }
    .card-badge {
      font-size: 12px;
      font-weight: 600;
      letter-spacing: 1px;
      text-transform: uppercase;
      padding: 4px 10px;
      border-radius: var(--rounded-pill);
    }
    .card-icon {
      font-size: 28px;
    }
    .card-title {
      font-family: var(--font-display);
      font-size: 26px;
      font-weight: 500;
      letter-spacing: -0.6px;
      margin-bottom: 10px;
      line-height: 1.2;
    }
    .card-description {
      font-size: 14.5px;
      line-height: 1.5;
      margin-bottom: 24px;
    }

    /* Embedded Product UI Fragments inside Cards */
    .ui-fragment {
      background: rgba(255, 255, 255, 0.85);
      backdrop-filter: blur(4px);
      border-radius: var(--rounded-md);
      padding: 14px 16px;
      font-size: 13px;
      color: var(--colors-ink);
      margin-bottom: 24px;
      border: 1px solid rgba(0,0,0,0.06);
    }
    .ui-fragment-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
    }
    .ui-fragment-pill {
      font-size: 11px;
      font-weight: 600;
      padding: 3px 8px;
      border-radius: var(--rounded-pill);
      background: var(--colors-canvas);
      border: 1px solid var(--colors-hairline);
    }

    .card-action-btn {
      align-self: flex-start;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 10px 18px;
      border-radius: var(--rounded-md);
      font-size: 13px;
      font-weight: 600;
      text-decoration: none;
      transition: opacity 0.15s ease;
    }
    .card-action-btn:hover {
      opacity: 0.88;
    }

    /* Card Specific Colors */
    /* 1. Hot Pink Card (Outbound/Directory) */
    .card-pink {
      background: var(--colors-brand-pink);
      color: #ffffff;
    }
    .card-pink .card-badge {
      background: rgba(255, 255, 255, 0.25);
      color: #ffffff;
    }
    .card-pink .card-description {
      color: rgba(255, 255, 255, 0.9);
    }
    .card-pink .card-action-btn {
      background: #ffffff;
      color: var(--colors-ink);
    }

    /* 2. Deep Teal Card (Career Board) */
    .card-teal {
      background: var(--colors-brand-teal);
      color: #ffffff;
    }
    .card-teal .card-badge {
      background: rgba(255, 255, 255, 0.2);
      color: #ffffff;
    }
    .card-teal .card-description {
      color: rgba(255, 255, 255, 0.85);
    }
    .card-teal .card-action-btn {
      background: #ffffff;
      color: var(--colors-brand-teal);
    }

    /* 3. Warm Peach Card (Announcements) */
    .card-peach {
      background: var(--colors-brand-peach);
      color: var(--colors-ink);
    }
    .card-peach .card-badge {
      background: rgba(0, 0, 0, 0.08);
      color: var(--colors-ink);
    }
    .card-peach .card-description {
      color: var(--colors-body);
    }
    .card-peach .card-action-btn {
      background: var(--colors-primary);
      color: #ffffff;
    }

    /* 4. Soft Lavender Card (Applications) */
    .card-lavender {
      background: var(--colors-brand-lavender);
      color: var(--colors-ink);
    }
    .card-lavender .card-badge {
      background: rgba(0, 0, 0, 0.08);
      color: var(--colors-ink);
    }
    .card-lavender .card-description {
      color: var(--colors-body);
    }
    .card-lavender .card-action-btn {
      background: var(--colors-primary);
      color: #ffffff;
    }

    /* 5. Golden Ochre Card (API Docs / Swagger) */
    .card-ochre {
      background: var(--colors-brand-ochre);
      color: var(--colors-ink);
    }
    .card-ochre .card-badge {
      background: rgba(0, 0, 0, 0.08);
      color: var(--colors-ink);
    }
    .card-ochre .card-description {
      color: var(--colors-body);
    }
    .card-ochre .card-action-btn {
      background: var(--colors-primary);
      color: #ffffff;
    }

    /* 6. Fresh Mint Card (Health / Telemetry) */
    .card-mint {
      background: var(--colors-brand-mint);
      color: var(--colors-ink);
    }
    .card-mint .card-badge {
      background: rgba(0, 0, 0, 0.08);
      color: var(--colors-ink);
    }
    .card-mint .card-description {
      color: var(--colors-body);
    }
    .card-mint .card-action-btn {
      background: var(--colors-primary);
      color: #ffffff;
    }

    /* RECENT ACTIVITY (Dual Column Split) */
    .recent-band {
      margin-bottom: 96px;
    }
    .recent-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 24px;
    }
    .recent-column {
      background: var(--colors-surface-card);
      border: 1px solid var(--colors-hairline);
      border-radius: var(--rounded-lg);
      padding: 28px;
    }
    .recent-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 20px;
    }
    .recent-title {
      font-family: var(--font-display);
      font-size: 20px;
      font-weight: 500;
      letter-spacing: -0.4px;
    }
    .recent-link-all {
      font-size: 13px;
      font-weight: 600;
      color: var(--colors-ink);
      text-decoration: none;
    }
    .recent-link-all:hover {
      text-decoration: underline;
    }
    .activity-list {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .activity-item {
      background: var(--colors-canvas);
      border: 1px solid var(--colors-hairline);
      border-radius: var(--rounded-md);
      padding: 14px 16px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
    }
    .activity-item-title {
      font-weight: 600;
      font-size: 14px;
      color: var(--colors-ink);
      text-decoration: none;
    }
    .activity-item-title:hover {
      text-decoration: underline;
    }
    .activity-item-meta {
      font-size: 12px;
      color: var(--colors-muted);
      margin-top: 2px;
    }

    /* PRE-FOOTER ILLUSTRATED CTA BAND */
    .cta-band-illustrated {
      background: var(--colors-surface-soft);
      border: 1px solid var(--colors-hairline);
      border-radius: var(--rounded-xl);
      padding: 72px 48px;
      margin-bottom: 80px;
      display: grid;
      grid-template-columns: 1.5fr 1fr;
      gap: 36px;
      align-items: center;
    }
    .cta-heading {
      font-family: var(--font-display);
      font-size: 38px;
      font-weight: 500;
      line-height: 1.15;
      letter-spacing: -1px;
      margin-bottom: 12px;
    }
    .cta-subtext {
      font-size: 16px;
      color: var(--colors-body);
      margin-bottom: 24px;
      max-width: 520px;
    }
    .cta-actions {
      display: flex;
      gap: 12px;
      flex-wrap: wrap;
    }
    .cta-art-box {
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 96px;
      filter: drop-shadow(0 10px 14px rgba(0,0,0,0.06));
    }

    /* FOOTER (Warm Cream Pacing - NOT Dark!) */
    .warm-footer {
      background: var(--colors-surface-soft);
      border-top: 1px solid var(--colors-hairline);
      padding: 64px 0 32px 0;
      color: var(--colors-body);
      font-size: 14px;
    }
    .footer-container {
      max-width: 1280px;
      margin: 0 auto;
      padding: 0 1.5rem;
      display: grid;
      grid-template-columns: 2fr 1fr 1fr 1fr;
      gap: 40px;
      margin-bottom: 48px;
    }
    .footer-brand {
      font-family: var(--font-display);
      font-size: 18px;
      font-weight: 600;
      color: var(--colors-ink);
      margin-bottom: 12px;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .footer-desc {
      font-size: 13.5px;
      color: var(--colors-muted);
      line-height: 1.6;
      max-width: 340px;
    }
    .footer-col-title {
      font-size: 13px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.8px;
      color: var(--colors-ink);
      margin-bottom: 16px;
    }
    .footer-links {
      list-style: none;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    .footer-links a {
      color: var(--colors-body);
      text-decoration: none;
      font-size: 13.5px;
      transition: color 0.15s ease;
    }
    .footer-links a:hover {
      color: var(--colors-ink);
      text-decoration: underline;
    }
    .footer-bottom {
      max-width: 1280px;
      margin: 0 auto;
      padding: 24px 1.5rem 0 1.5rem;
      border-top: 1px solid var(--colors-hairline);
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 13px;
      color: var(--colors-muted);
      flex-wrap: wrap;
      gap: 16px;
    }
    .footer-pills {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
    }
    .tech-pill {
      background: var(--colors-canvas);
      border: 1px solid var(--colors-hairline);
      padding: 3px 8px;
      border-radius: var(--rounded-xs);
      font-size: 11.5px;
      font-weight: 500;
      color: var(--colors-body-strong);
    }

    /* RESPONSIVE BREAKPOINTS */
    @media (max-width: 1024px) {
      .hero-band {
        grid-template-columns: 1fr;
        gap: 36px;
      }
      .features-grid {
        grid-template-columns: repeat(2, 1fr);
      }
      .footer-container {
        grid-template-columns: 1fr 1fr;
      }
    }
    @media (max-width: 768px) {
      .hero-headline {
        font-size: 40px;
        letter-spacing: -1.2px;
      }
      .metrics-grid {
        grid-template-columns: repeat(2, 1fr);
      }
      .features-grid {
        grid-template-columns: 1fr;
      }
      .recent-grid {
        grid-template-columns: 1fr;
      }
      .cta-band-illustrated {
        grid-template-columns: 1fr;
        padding: 40px 24px;
        text-align: center;
      }
      .cta-actions {
        justify-content: center;
      }
      .footer-container {
        grid-template-columns: 1fr;
      }
      .nav-menu {
        display: none;
      }
    }
  </style>
</head>
<body>

  <!-- STICKY TOP NAVIGATION -->
  <header class="top-nav">
    <div class="nav-container">
      <a href="/main" class="brand-lockup">
        <span class="brand-emblem">🎓</span>
        <span>Alumni Tracking System</span>
      </a>
      <ul class="nav-menu">
        <li><a href="/users" class="nav-link">Alumni Directory</a></li>
        <li><a href="/job-postings" class="nav-link">Career Board</a></li>
        <li><a href="/announcements" class="nav-link">Announcements</a></li>
        <li><a href="/applications" class="nav-link">Applications</a></li>
        <li><a href="/api/swagger" class="nav-link">API Docs</a></li>
        <li><a href="/api/health" class="nav-link">Health</a></li>
      </ul>
      <div class="nav-actions">
        <a href="/job-postings" class="btn-nav-primary">
          <span>+</span> Post Opportunity
        </a>
      </div>
    </div>
  </header>

  <!-- MAIN VIEWPORT CONTAINER -->
  <main class="page-main">

    <!-- HERO BAND (7/5 Split) -->
    <section class="hero-band">
      <div class="hero-content">
        <div class="hero-badge-pill">
          <span class="hero-badge-dot"></span>
          <span>Official University Alumni & Career Network</span>
        </div>
        <h1 class="hero-headline">Connecting Graduates, Empowering Careers</h1>
        <p class="hero-subtitle">
          A tactile, playful, and unified ecosystem bridging academic excellence and industry leadership. Re-connect with fellow alumni, discover career opportunities, and mentor the next generation.
        </p>
        <div class="hero-cta-cluster">
          <a href="/users" class="btn-clay-primary">Explore Alumni Directory →</a>
          <a href="/job-postings" class="btn-clay-secondary">Browse Career Board</a>
          <a href="/announcements" class="btn-clay-secondary">View Announcements</a>
        </div>
      </div>

      <!-- 3D Claymation Style Hero Card -->
      <div class="hero-illustration-card">
        <div class="clay-art-container">
          <div class="clay-mountain-bg"></div>
          <div class="clay-cap-mascot">🎓</div>
        </div>
        <div class="hero-card-meta">
          <div class="hero-card-title">Lifetime Alumni Community</div>
          <div class="hero-card-tag">Handcrafted for graduates across 40+ departments</div>
        </div>
      </div>
    </section>

    <!-- LIVE METRICS COUNTER STRIP -->
    <section class="metrics-section">
      <div class="metrics-grid">
        <div class="metric-card">
          <div class="metric-count">${userCount}</div>
          <div class="metric-label">Registered Alumni</div>
        </div>
        <div class="metric-card">
          <div class="metric-count">${jobPostingCount}</div>
          <div class="metric-label">Career Postings</div>
        </div>
        <div class="metric-card">
          <div class="metric-count">${announcementCount}</div>
          <div class="metric-label">Announcements</div>
        </div>
        <div class="metric-card">
          <div class="metric-count">${applicationCount}</div>
          <div class="metric-label">Applications Filed</div>
        </div>
      </div>
    </section>

    <!-- 6-COLOR SATURATED FEATURE CARDS BAND -->
    <section class="features-band">
      <div class="section-header-block">
        <div class="section-tag">Core Platform Modules</div>
        <h2 class="section-heading">Everything needed to stay connected</h2>
        <p class="section-subtext">
          High-voltage tools designed for modern graduates, department chairs, and corporate recruiters.
        </p>
      </div>

      <div class="features-grid">

        <!-- Card 1: Hot Pink (Alumni Directory) -->
        <div class="feature-card card-pink">
          <div>
            <div class="card-top">
              <span class="card-badge">Directory</span>
              <span class="card-icon">👥</span>
            </div>
            <h3 class="card-title">Alumni Directory</h3>
            <p class="card-description">
              Verified graduate profiles across departments, graduation years, and current company roles.
            </p>
            <div class="ui-fragment">
              <div class="ui-fragment-row">
                <span>🎓 Class of 2024</span>
                <span class="ui-fragment-pill">Active Member</span>
              </div>
            </div>
          </div>
          <a href="/users" class="card-action-btn">Browse Alumni Directory →</a>
        </div>

        <!-- Card 2: Deep Teal (Career Board) -->
        <div class="feature-card card-teal">
          <div>
            <div class="card-top">
              <span class="card-badge">Recruitment</span>
              <span class="card-icon">💼</span>
            </div>
            <h3 class="card-title">Career Opportunities</h3>
            <p class="card-description">
              Exclusive jobs and internships shared directly by alumni recruiters and verified partner companies.
            </p>
            <div class="ui-fragment">
              <div class="ui-fragment-row">
                <span>Full-time • Hybrid</span>
                <span class="ui-fragment-pill">High Priority</span>
              </div>
            </div>
          </div>
          <a href="/job-postings" class="card-action-btn">Explore Career Opportunities →</a>
        </div>

        <!-- Card 3: Warm Peach (Announcements) -->
        <div class="feature-card card-peach">
          <div>
            <div class="card-top">
              <span class="card-badge">Community</span>
              <span class="card-icon">📢</span>
            </div>
            <h3 class="card-title">Announcements Board</h3>
            <p class="card-description">
              Institutional news, alumni gala events, guest lectures, and campus homecoming invitations.
            </p>
            <div class="ui-fragment">
              <div class="ui-fragment-row">
                <span>Campus Gala 2026</span>
                <span class="ui-fragment-pill">New Update</span>
              </div>
            </div>
          </div>
          <a href="/announcements" class="card-action-btn">View Announcements Board →</a>
        </div>

        <!-- Card 4: Soft Lavender (Application Tracking) -->
        <div class="feature-card card-lavender">
          <div>
            <div class="card-top">
              <span class="card-badge">Applications</span>
              <span class="card-icon">📝</span>
            </div>
            <h3 class="card-title">Application Tracking</h3>
            <p class="card-description">
              Track multi-stage job submissions and mentorship pairings with real-time status flows.
            </p>
            <div class="ui-fragment">
              <div class="ui-fragment-row">
                <span>Application Flow</span>
                <span class="ui-fragment-pill">Under Review</span>
              </div>
            </div>
          </div>
          <a href="/applications" class="card-action-btn">Track Applications →</a>
        </div>

        <!-- Card 5: Golden Ochre (Swagger UI API) -->
        <div class="feature-card card-ochre">
          <div>
            <div class="card-top">
              <span class="card-badge">API Spec</span>
              <span class="card-icon">📑</span>
            </div>
            <h3 class="card-title">Swagger UI</h3>
            <p class="card-description">
              Interactive OpenAPI 3.0 documentation for integrating external services with our RESTful endpoints.
            </p>
            <div class="ui-fragment">
              <div class="ui-fragment-row">
                <span>GET /api/users</span>
                <span class="ui-fragment-pill">200 OK</span>
              </div>
            </div>
          </div>
          <a href="/api/swagger" class="card-action-btn">Open Swagger UI →</a>
        </div>

        <!-- Card 6: Fresh Mint (System Health) -->
        <div class="feature-card card-mint">
          <div>
            <div class="card-top">
              <span class="card-badge">Diagnostics</span>
              <span class="card-icon">🩺</span>
            </div>
            <h3 class="card-title">System Health</h3>
            <p class="card-description">
              Real-time server telemetry, memory consumption metrics, and database connection monitors.
            </p>
            <div class="ui-fragment">
              <div class="ui-fragment-row">
                <span>System Status</span>
                <span class="ui-fragment-pill">Online • 99.9%</span>
              </div>
            </div>
          </div>
          <a href="/api/health" class="card-action-btn">Inspect System Health →</a>
        </div>

      </div>
    </section>

    <!-- RECENT ACTIVITY SECTION -->
    <section class="recent-band">
      <div class="recent-grid">
        <!-- Announcements Column -->
        <div class="recent-column">
          <div class="recent-header">
            <h3 class="recent-title">Latest Announcements</h3>
            <a href="/announcements" class="recent-link-all">View All →</a>
          </div>
          <div class="activity-list">
            ${recentAnnouncements.length > 0
              ? recentAnnouncements.slice(0, 3).map(a => `
                <div class="activity-item">
                  <div>
                    <a href="/announcements/${a.id}" class="activity-item-title">${escapeHtml(a.title)}</a>
                    <div class="activity-item-meta">${escapeHtml(a.author || 'Dean Office')} • ${escapeHtml(a.date || 'Recent')}</div>
                  </div>
                  <span class="ui-fragment-pill">News</span>
                </div>
              `).join('')
              : `<div style="color:var(--colors-muted); font-size:14px; padding:12px 0;">No announcements published yet. Visit <a href="/announcements" style="color:var(--colors-ink); font-weight:600;">Announcements Board</a> to publish one!</div>`
            }
          </div>
        </div>

        <!-- Job Postings Column -->
        <div class="recent-column">
          <div class="recent-header">
            <h3 class="recent-title">Career Opportunities</h3>
            <a href="/job-postings" class="recent-link-all">View All →</a>
          </div>
          <div class="activity-list">
            ${recentJobPostings.length > 0
              ? recentJobPostings.slice(0, 3).map(j => `
                <div class="activity-item">
                  <div>
                    <a href="/job-postings/${j.id}" class="activity-item-title">${escapeHtml(j.title)}</a>
                    <div class="activity-item-meta">${escapeHtml(j.company)} • ${escapeHtml(j.city || j.location || 'Remote')}</div>
                  </div>
                  <span class="ui-fragment-pill">${escapeHtml(j.type || 'Full-time')}</span>
                </div>
              `).join('')
              : `<div style="color:var(--colors-muted); font-size:14px; padding:12px 0;">No job postings available yet. Visit <a href="/job-postings" style="color:var(--colors-ink); font-weight:600;">Career Opportunities</a> to create one!</div>`
            }
          </div>
        </div>
      </div>
    </section>

    <!-- PRE-FOOTER ILLUSTRATED CTA BAND -->
    <section class="cta-band-illustrated">
      <div>
        <h2 class="cta-heading">Ready to reconnect with your alumni network?</h2>
        <p class="cta-subtext">
          Join thousands of graduates building careers, mentoring students, and expanding professional connections worldwide.
        </p>
        <div class="cta-actions">
          <a href="/users" class="btn-clay-primary">Get Started Now →</a>
          <a href="/job-postings" class="btn-clay-secondary">Post an Opportunity</a>
        </div>
      </div>
      <div class="cta-art-box">
        🏔️
      </div>
    </section>

  </main>

  <!-- WARM CREAM FOOTER (NOT Dark Navy!) -->
  <footer class="warm-footer">
    <div class="footer-container">
      <div>
        <div class="footer-brand">🎓 Alumni Tracking System</div>
        <p class="footer-desc">
          The playful, tactile B2B SaaS alumni platform connecting graduates and institutions through verified networking, jobs, and campus events.
        </p>
      </div>
      <div>
        <div class="footer-col-title">Navigation</div>
        <ul class="footer-links">
          <li><a href="/main">Home</a></li>
          <li><a href="/users">Alumni Directory</a></li>
          <li><a href="/job-postings">Career Board</a></li>
          <li><a href="/announcements">Announcements</a></li>
          <li><a href="/applications">Applications</a></li>
        </ul>
      </div>
      <div>
        <div class="footer-col-title">Developer API</div>
        <ul class="footer-links">
          <li><a href="/api/swagger">Swagger UI</a></li>
          <li><a href="/api/swagger.json">OpenAPI 3.0 Spec</a></li>
          <li><a href="/api/health">System Health</a></li>
          <li><a href="/404">404 Guardian</a></li>
        </ul>
      </div>
      <div>
        <div class="footer-col-title">Alma Mater</div>
        <ul class="footer-links">
          <li><a href="/about">About Platform</a></li>
          <li><a href="/alumni">Alumni Chapters</a></li>
          <li><a href="https://github.com/ecemyakali/alumni" target="_blank" rel="noopener">GitHub Repository</a></li>
        </ul>
      </div>
    </div>

    <div class="footer-bottom">
      <div>© 2026 Alumni Tracking System. All rights reserved.</div>
      <div class="footer-pills">
        <span class="tech-pill">Node.js</span>
        <span class="tech-pill">Express</span>
        <span class="tech-pill">PostgreSQL</span>
        <span class="tech-pill">Docker</span>
      </div>
    </div>
  </footer>

</body>
</html>`;
  }
};

module.exports = homeView;
