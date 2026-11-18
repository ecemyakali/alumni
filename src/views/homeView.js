/**
 * ========================================================
 * View Layer: Homepage View (Mintlify-First Design)
 * File: src/views/homeView.js
 * ========================================================
 * 
 * Implements a clean, airy, highly readable Mintlify-style layout:
 * 1. Bright white background with subtle pastel emerald radial glow in hero.
 * 2. Signature centered search bar with 🔍 icon and Ctrl K / ⌘K badge.
 * 3. Flawless navigation tabs with white-space nowrap, 8px 16px padding, gap 8px.
 * 4. Streamlined 3-section flow:
 *    - Section 1: Airy Hero + Central Search Bar + 2 Clear Action Buttons.
 *    - Section 2: Single Featured Event Card + 3 Clean Metric Tiles.
 *    - Section 3: Filterable Category Tabs + Minimalist Curated Cards (Avatar, Name, Badge, Org, View Link).
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
        { id: 1, title: 'Annual Alumni Homecoming 2026', author: 'Mühendislik Fakültesi Dekanlığı', date: '2026-11-20', category: 'Etkinlik' },
        { id: 2, title: 'Sonbahar Kariyer Fuarı ve Şirket Görüşmeleri', author: 'Kariyer Merkezi', date: '2026-11-15', category: 'Kariyer' }
      ];

    const recentJobPostings = Array.isArray(data.recentJobPostings) && data.recentJobPostings.length > 0
      ? data.recentJobPostings
      : [
        { id: 1, title: 'Senior Cloud Architect', company: 'Google Cloud', city: 'Zurich', type: 'Full-time' },
        { id: 2, title: 'Staff Distributed Systems Engineer', company: 'Stripe Platforms', city: 'Berlin / Remote', type: 'Full-time' }
      ];

    const firstAnnouncement = recentAnnouncements[0] || {
      id: 1,
      title: 'Annual Alumni Homecoming 2026',
      author: 'Mühendislik Fakültesi Dekanlığı',
      date: '2026-11-20'
    };

    const firstJob = recentJobPostings[0] || {
      id: 1,
      title: 'Senior Cloud Architect',
      company: 'Google Cloud',
      city: 'Zurich',
      type: 'Full-time'
    };

    return `<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Alumni Tracking System — Modern Mezun ve Kariyer Ağı</title>
  <style>
    :root {
      /* Mintlify-First Bright Color Palette */
      --canvas: #ffffff;
      --surface-subtle: #f9fafb;
      --surface-card: #ffffff;
      --surface-hover: #f3f4f6;

      --hairline: #e5e7eb;
      --hairline-strong: #d1d5db;

      --ink: #111827;
      --ink-muted: #4b5563;
      --ink-subtle: #6b7280;
      --ink-tertiary: #9ca3af;

      --primary: #111827;
      --primary-hover: #1f2937;

      --brand-mint: #0d9373;
      --brand-mint-hover: #0b7c61;
      --brand-mint-subtle: #ecfdf5;
      --brand-mint-border: #a7f3d0;

      --rounded-md: 8px;
      --rounded-lg: 12px;
      --rounded-xl: 16px;
      --rounded-pill: 9999px;

      --font-sans: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      --font-mono: ui-monospace, "SF Mono", "Geist Mono", Menlo, Consolas, monospace;
    }

    * { box-sizing: border-box; margin: 0; padding: 0; }

    html, body {
      overflow-x: hidden;
    }

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

    /* ========================================================
     * GEREKSİNİM 2: ÜST MENÜ & SEKME (TAB) YAZILARI
     * ======================================================== */
    .top-nav {
      position: sticky;
      top: 0;
      z-index: 100;
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(12px);
      border-bottom: 1px solid var(--hairline);
    }
    .nav-container {
      max-width: 1280px;
      margin: 0 auto;
      padding: 0 1.25rem;
      height: 64px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 0.75rem;
    }
    .brand-lockup {
      display: flex;
      align-items: center;
      gap: 8px;
      text-decoration: none;
      color: var(--ink);
      font-weight: 700;
      font-size: 0.98rem;
      letter-spacing: -0.3px;
      white-space: nowrap;
      flex-shrink: 0;
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
      flex-wrap: nowrap;
    }
    .nav-link {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      padding: 6px 11px;
      font-size: 13px;
      font-weight: 500;
      white-space: nowrap;
      text-decoration: none;
      color: var(--ink-muted);
      border-radius: var(--rounded-pill);
      transition: all 0.15s ease;
    }
    .nav-link:hover {
      color: var(--ink);
      background: var(--surface-subtle);
    }
    .nav-link.active {
      color: var(--brand-mint);
      background: var(--brand-mint-subtle);
      font-weight: 600;
    }
    .nav-actions {
      display: flex;
      align-items: center;
      gap: 8px;
      white-space: nowrap;
      flex-shrink: 0;
    }
    .nav-actions .btn-pill-primary {
      padding: 8px 16px;
      font-size: 13px;
    }

    /* PILL BUTONLAR */
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
      white-space: nowrap;
    }
    .btn-pill-primary:hover {
      background: var(--primary-hover);
      transform: translateY(-1px);
      box-shadow: 0 4px 14px rgba(0, 0, 0, 0.08);
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
      white-space: nowrap;
    }
    .btn-pill-secondary:hover {
      background: var(--surface-subtle);
      border-color: var(--hairline-strong);
      transform: translateY(-1px);
    }

    /* ========================================================
     * GEREKSİNİM 1: MINTLIFY TARZI AYDINLIK & RADIAL GLOW HERO
     * ======================================================== */
    .hero-wrapper {
      position: relative;
      background: radial-gradient(ellipse 80% 50% at 50% -20%, rgba(13, 147, 115, 0.08), rgba(255, 255, 255, 0)), #ffffff;
      padding: 4.5rem 1.5rem 3.5rem 1.5rem;
      border-bottom: 1px solid var(--hairline);
    }
    .hero-content {
      max-width: 900px;
      margin: 0 auto;
      text-align: center;
    }
    .hero-badge {
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
      box-shadow: 0 1px 3px rgba(0,0,0,0.03);
      margin-bottom: 1.5rem;
      transition: all 0.15s ease;
    }
    .hero-badge:hover {
      border-color: var(--hairline-strong);
      transform: translateY(-1px);
    }
    .pulse-dot {
      width: 7px;
      height: 7px;
      background: var(--brand-mint);
      border-radius: 50%;
      display: inline-block;
      box-shadow: 0 0 0 2px rgba(13, 147, 115, 0.25);
    }
    .hero-title {
      font-size: clamp(2.2rem, 4.5vw, 3.75rem);
      font-weight: 700;
      letter-spacing: -2px;
      line-height: 1.12;
      color: var(--ink);
      margin-bottom: 1.25rem;
    }
    .hero-subtitle {
      font-size: clamp(1rem, 1.8vw, 1.2rem);
      color: var(--ink-muted);
      max-width: 680px;
      margin: 0 auto 2rem auto;
      line-height: 1.6;
    }

    /* ========================================================
     * GEREKSİNİM 3: MINTLIFY İMZASI: MERKEZİ ARAMA ÇUBUĞU
     * ======================================================== */
    .search-box-wrapper {
      max-width: 600px;
      margin: 0 auto 2rem auto;
      position: relative;
    }
    .search-bar {
      display: flex;
      align-items: center;
      background: #ffffff;
      border: 1px solid var(--hairline-strong);
      border-radius: var(--rounded-xl);
      padding: 6px 8px 6px 16px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05), 0 1px 3px rgba(0, 0, 0, 0.03);
      transition: all 0.2s ease;
    }
    .search-bar:focus-within {
      border-color: var(--brand-mint);
      box-shadow: 0 0 0 3px rgba(13, 147, 115, 0.15), 0 6px 24px rgba(0, 0, 0, 0.06);
    }
    .search-icon {
      font-size: 16px;
      color: var(--ink-subtle);
      margin-right: 12px;
      line-height: 1;
    }
    .search-input {
      flex: 1;
      border: none;
      outline: none;
      font-size: 15px;
      color: var(--ink);
      font-family: inherit;
      background: transparent;
    }
    .search-input::placeholder {
      color: var(--ink-tertiary);
      font-size: 14.5px;
    }
    .search-badge {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      background: var(--surface-subtle);
      border: 1px solid var(--hairline);
      padding: 4px 8px;
      border-radius: 6px;
      font-size: 12px;
      font-family: var(--font-mono);
      color: var(--ink-subtle);
      user-select: none;
    }

    .hero-actions {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 12px;
      flex-wrap: wrap;
    }

    /* ========================================================
     * GEREKSİNİM 4: SADE VE ANLAŞILIR 3'LÜ AKIŞ
     * ======================================================== */
    .content-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 3.5rem 1.5rem;
    }
    .section-heading-wrap {
      margin-bottom: 2rem;
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      flex-wrap: wrap;
      gap: 1rem;
    }
    .section-title {
      font-size: 1.65rem;
      font-weight: 700;
      letter-spacing: -0.6px;
      color: var(--ink);
    }
    .section-desc {
      font-size: 14.5px;
      color: var(--ink-muted);
      margin-top: 4px;
    }

    /* BÖLÜM 2: ÖNE ÇIKAN TEK BÜYÜK DUYURU + 3 İSTATİSTİK */
    .spotlight-grid {
      display: grid;
      grid-template-columns: 1.8fr 1fr;
      gap: 24px;
      margin-bottom: 4rem;
      align-items: stretch;
    }
    .featured-event-card {
      background: #ffffff;
      border: 1px solid var(--hairline);
      border-radius: var(--rounded-xl);
      padding: 2.25rem;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.02);
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      position: relative;
      border-left: 4px solid var(--brand-mint);
    }
    .featured-badge-bar {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 1rem;
    }
    .badge-mint {
      background: var(--brand-mint-subtle);
      color: var(--brand-mint);
      border: 1px solid var(--brand-mint-border);
      padding: 4px 12px;
      border-radius: var(--rounded-pill);
      font-size: 12px;
      font-weight: 600;
      display: inline-flex;
      align-items: center;
      gap: 6px;
    }
    .badge-date {
      font-size: 13px;
      color: var(--ink-subtle);
      font-family: var(--font-mono);
    }
    .featured-event-title {
      font-size: 1.75rem;
      font-weight: 700;
      letter-spacing: -0.8px;
      color: var(--ink);
      line-height: 1.25;
      margin-bottom: 0.75rem;
    }
    .featured-event-desc {
      font-size: 15px;
      color: var(--ink-muted);
      line-height: 1.6;
      margin-bottom: 1.75rem;
    }
    .featured-event-footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 12px;
      padding-top: 1.25rem;
      border-top: 1px solid var(--surface-subtle);
    }

    /* 3 İSTATİSTİK KUTUSU */
    .stats-stack {
      display: flex;
      flex-direction: column;
      gap: 14px;
      justify-content: space-between;
    }
    .stat-tile {
      background: var(--surface-subtle);
      border: 1px solid var(--hairline);
      border-radius: var(--rounded-lg);
      padding: 1.25rem 1.5rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      transition: all 0.15s ease;
      text-decoration: none;
    }
    .stat-tile:hover {
      background: #ffffff;
      border-color: var(--hairline-strong);
      transform: translateY(-1px);
      box-shadow: 0 2px 8px rgba(0,0,0,0.03);
    }
    .stat-meta {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }
    .stat-label {
      font-size: 13px;
      color: var(--ink-muted);
      font-weight: 500;
    }
    .stat-sub {
      font-size: 11.5px;
      color: var(--ink-tertiary);
    }
    .stat-count {
      font-size: 1.85rem;
      font-weight: 700;
      color: var(--ink);
      font-family: var(--font-mono);
      line-height: 1;
    }

    /* ========================================================
     * BÖLÜM 3: KATEGORİ SEKMELERİ & SADE KARTLAR
     * ======================================================== */
    .tabs-bar {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 1.75rem;
      overflow-x: auto;
      padding-bottom: 4px;
    }
    .tab-btn {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 8px 18px;
      font-size: 14px;
      font-weight: 500;
      white-space: nowrap;
      background: var(--surface-subtle);
      border: 1px solid var(--hairline);
      border-radius: var(--rounded-pill);
      color: var(--ink-muted);
      cursor: pointer;
      transition: all 0.15s ease;
    }
    .tab-btn:hover {
      background: var(--surface-hover);
      color: var(--ink);
    }
    .tab-btn.active {
      background: var(--primary);
      color: #ffffff;
      border-color: var(--primary);
      font-weight: 600;
    }

    .cards-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
      gap: 20px;
    }
    .clean-card {
      background: #ffffff;
      border: 1px solid var(--hairline);
      border-radius: var(--rounded-lg);
      padding: 1.5rem;
      box-shadow: 0 1px 3px rgba(0,0,0,0.02);
      transition: all 0.15s ease;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
    .clean-card:hover {
      border-color: var(--hairline-strong);
      transform: translateY(-2px);
      box-shadow: 0 6px 18px rgba(0,0,0,0.04);
    }
    .clean-card-header {
      display: flex;
      align-items: center;
      gap: 14px;
      margin-bottom: 1.25rem;
    }
    .card-avatar {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      background: var(--surface-subtle);
      border: 1px solid var(--hairline);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.35rem;
      flex-shrink: 0;
    }
    .card-title-group {
      display: flex;
      flex-direction: column;
      gap: 2px;
      overflow: hidden;
    }
    .card-name {
      font-size: 1.05rem;
      font-weight: 600;
      color: var(--ink);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .card-subtext {
      font-size: 13.5px;
      color: var(--ink-muted);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .card-meta-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding-top: 1rem;
      border-top: 1px solid var(--surface-subtle);
    }
    .pill-tag {
      background: var(--surface-subtle);
      border: 1px solid var(--hairline);
      padding: 3px 9px;
      border-radius: var(--rounded-pill);
      font-size: 12px;
      color: var(--ink-subtle);
      font-weight: 500;
    }
    .card-action-link {
      color: var(--brand-mint);
      text-decoration: none;
      font-size: 13.5px;
      font-weight: 600;
      display: inline-flex;
      align-items: center;
      gap: 4px;
      transition: gap 0.15s ease;
    }
    .card-action-link:hover {
      gap: 8px;
    }

    /* FOOTER */
    .site-footer {
      border-top: 1px solid var(--hairline);
      background: #ffffff;
      padding: 4rem 1.5rem 2.5rem 1.5rem;
      margin-top: 2rem;
    }
    .footer-container {
      max-width: 1200px;
      margin: 0 auto;
      display: grid;
      grid-template-columns: 2fr 1fr 1fr 1fr;
      gap: 3rem;
      margin-bottom: 3rem;
    }
    .footer-brand {
      font-weight: 700;
      font-size: 1.05rem;
      color: var(--ink);
      margin-bottom: 0.5rem;
    }
    .footer-desc {
      font-size: 13.5px;
      color: var(--ink-muted);
      line-height: 1.6;
      max-width: 320px;
    }
    .footer-col-title {
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.6px;
      color: var(--ink);
      margin-bottom: 1rem;
    }
    .footer-links {
      list-style: none;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .footer-links a {
      color: var(--ink-subtle);
      text-decoration: none;
      font-size: 13px;
      transition: color 0.15s ease;
    }
    .footer-links a:hover {
      color: var(--ink);
    }
    .footer-bottom {
      max-width: 1200px;
      margin: 0 auto;
      padding-top: 1.75rem;
      border-top: 1px solid var(--hairline);
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 1rem;
      font-size: 13px;
      color: var(--ink-tertiary);
    }

    @media (max-width: 1024px) {
      .spotlight-grid { grid-template-columns: 1fr; }
      .footer-container { grid-template-columns: 1fr 1fr; }
    }
    @media (max-width: 768px) {
      .nav-menu { display: none; }
      .footer-container { grid-template-columns: 1fr; }
      .hero-title { font-size: 2.2rem; }
    }
  </style>
</head>
<body>

  <!-- ========================================================
   * ÜST MENÜ & SEKME (TAB) YAZILARI
   * ======================================================== -->
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
   * BÖLÜM 1: FERAH HERO + BÜYÜK ARAMA ÇUBUĞU + 2 NET BUTON
   * ======================================================== -->
  <section class="hero-wrapper">
    <div class="hero-content">
      <a href="/announcements" class="hero-badge">
        <span class="pulse-dot"></span>
        <span>${this.escapeHtml(firstAnnouncement.title)}</span>
        <span>&rarr;</span>
      </a>

      <h1 class="hero-title">
        The Premier Network for Verified Alumni & Modern Careers
      </h1>

      <p class="hero-subtitle">
        Mezunlar, öğrenciler ve akademisyenleri bir araya getiren yeni nesil doğruluk odaklı kariyer ve mentörlük ağı.
      </p>

      <!-- Mintlify İmzası: Merkezi Arama Çubuğu -->
      <div class="search-box-wrapper">
        <div class="search-bar">
          <span class="search-icon">🔍</span>
          <input 
            type="text" 
            id="globalSearchInput" 
            class="search-input" 
            placeholder="Mezun adı, bölüm, şirket veya iş ilanı ara..." 
            autocomplete="off"
          />
          <kbd class="search-badge font-mono">Ctrl K</kbd>
        </div>
      </div>

      <div class="hero-actions">
        <a href="/users" class="btn-pill-primary">Mezun Rehberini Keşfet &rarr;</a>
        <a href="/job-postings#post-job" class="btn-pill-secondary">+ İlan Paylaş</a>
      </div>
    </div>
  </section>

  <main class="content-container">

    <!-- ========================================================
     * BÖLÜM 2: ÖNE ÇIKAN TEK BÜYÜK DUYURU + 3 İSTATİSTİK
     * ======================================================== -->
    <section class="section-heading-wrap">
      <div>
        <h2 class="section-title">Topluluk Vitrini & İstatistikler</h2>
        <p class="section-desc">Öne çıkan en son kurumsal duyuru ve ağ genelindeki canlı veriler.</p>
      </div>
    </section>

    <div class="spotlight-grid">
      <!-- Öne Çıkan Tek Büyük Etkinlik / Duyuru Kartı -->
      <article class="featured-event-card">
        <div>
          <div class="featured-badge-bar">
            <span class="badge-mint">
              <span class="pulse-dot"></span>
              Öne Çıkan (Featured)
            </span>
            <span class="badge-date font-mono">📅 20–22 Kasım 2026</span>
          </div>
          <h3 class="featured-event-title">${this.escapeHtml(firstAnnouncement.title)}</h3>
          <p class="featured-event-desc">
            Büyük mezunlar buluşması ve teknoloji zirvesi için kayıtlar açıldı. Küresel teknoloji liderleri, sektör oturumları ve mentörlük atölyeleri için yerinizi hemen ayırtın.
          </p>
        </div>
        <div class="featured-event-footer">
          <a href="/announcements" class="btn-pill-primary">Detayları İncele & Kayıt Ol &rarr;</a>
          <span style="font-size:13px; color:var(--ink-subtle);" class="font-mono">Organizatör: ${this.escapeHtml(firstAnnouncement.author)}</span>
        </div>
      </article>

      <!-- Yanında 3 Temiz İstatistik -->
      <aside class="stats-stack">
        <a href="/users" class="stat-tile">
          <div class="stat-meta">
            <span class="stat-label">Alumni Directory</span>
            <span class="stat-sub">Doğrulanmış Mezunlar</span>
          </div>
          <div class="stat-count">${userCount}</div>
        </a>

        <a href="/job-postings" class="stat-tile">
          <div class="stat-meta">
            <span class="stat-label">Career Opportunities</span>
            <span class="stat-sub">Aktif İş İlanları</span>
          </div>
          <div class="stat-count" style="color:var(--brand-mint);">${jobPostingCount}</div>
        </a>

        <a href="/applications" class="stat-tile">
          <div class="stat-meta">
            <span class="stat-label">Application Tracking</span>
            <span class="stat-sub">Aday Başvuruları</span>
          </div>
          <div class="stat-count">${applicationCount}</div>
        </a>
      </aside>
    </div>

    <!-- ========================================================
     * BÖLÜM 3: KATEGORİ SEKMELİ ÖNE ÇIKAN MEZUNLAR & FIRSATLAR
     * ======================================================== -->
    <section class="section-heading-wrap">
      <div>
        <h2 class="section-title">Öne Çıkanlar & Fırsatlar</h2>
        <p class="section-desc">Kategorilere göre filtrelenebilir doğrulanmış mezun profilleri ve kariyer fırsatları.</p>
      </div>
    </section>

    <!-- Temiz Kategori Sekmeleri -->
    <div class="tabs-bar" id="categoryTabs">
      <button class="tab-btn active" data-filter="all">Tümü (All)</button>
      <button class="tab-btn" data-filter="jobs">Kariyer Fırsatları</button>
      <button class="tab-btn" data-filter="alumni">Mezun Profilleri</button>
      <button class="tab-btn" data-filter="announcements">Announcements Board (${announcementCount})</button>
    </div>

    <!-- Minimalist & Sade Kartlar Izgarası -->
    <div class="cards-grid" id="curatedCardsGrid">
      <!-- Kart 1: İş Fırsatı (Google Cloud) -->
      <article class="clean-card" data-category="jobs" data-title="${this.escapeHtml(firstJob.title)} ${this.escapeHtml(firstJob.company)}">
        <div class="clean-card-header">
          <div class="card-avatar" style="background:#eff6ff;">💼</div>
          <div class="card-title-group">
            <h3 class="card-name">${this.escapeHtml(firstJob.title)}</h3>
            <div class="card-subtext">🏢 ${this.escapeHtml(firstJob.company)} · ${this.escapeHtml(firstJob.city || 'Zurich')}</div>
          </div>
        </div>
        <div class="card-meta-row">
          <span class="pill-tag">${this.escapeHtml(firstJob.type || 'Full-time')}</span>
          <a href="/job-postings" class="card-action-link">İncele &rarr;</a>
        </div>
      </article>

      <!-- Kart 2: Doğrulanmış Mezun Profili -->
      <article class="clean-card" data-category="alumni" data-title="Dr. Selin Demir Stanford AI Lab Bilgisayar Mühendisliği">
        <div class="clean-card-header">
          <div class="card-avatar" style="background:#ecfdf5;">🎓</div>
          <div class="card-title-group">
            <h3 class="card-name">Dr. Selin Demir</h3>
            <div class="card-subtext">Principal Scientist · Stanford AI Lab</div>
          </div>
        </div>
        <div class="card-meta-row">
          <span class="pill-tag font-mono">2018 Mezunu</span>
          <a href="/users" class="card-action-link">İncele &rarr;</a>
        </div>
      </article>

      <!-- Kart 3: İkinci Kariyer Fırsatı -->
      <article class="clean-card" data-category="jobs" data-title="Staff Systems Engineer Stripe Platforms">
        <div class="clean-card-header">
          <div class="card-avatar" style="background:#f5f3ff;">🚀</div>
          <div class="card-title-group">
            <h3 class="card-name">Staff Systems Engineer</h3>
            <div class="card-subtext">🏢 Stripe Platforms · Remote / Berlin</div>
          </div>
        </div>
        <div class="card-meta-row">
          <span class="pill-tag">Full-time</span>
          <a href="/job-postings" class="card-action-link">İncele &rarr;</a>
        </div>
      </article>

      <!-- Kart 4: Doğrulanmış Mezun 2 -->
      <article class="clean-card" data-category="alumni" data-title="Barış Akın Product Lead Revolut">
        <div class="clean-card-header">
          <div class="card-avatar" style="background:#fef3c7;">👨‍💻</div>
          <div class="card-title-group">
            <h3 class="card-name">Barış Akın</h3>
            <div class="card-subtext">Senior Product Manager · Revolut London</div>
          </div>
        </div>
        <div class="card-meta-row">
          <span class="pill-tag font-mono">2020 Mezunu</span>
          <a href="/users" class="card-action-link">İncele &rarr;</a>
        </div>
      </article>

      <!-- Kart 5: Resmi Duyuru -->
      <article class="clean-card" data-category="announcements" data-title="Yıllık Mezunlar Zirvesi Kayıtları">
        <div class="clean-card-header">
          <div class="card-avatar" style="background:#ecfdf5;">📢</div>
          <div class="card-title-group">
            <h3 class="card-name">Annual Alumni Homecoming 2026</h3>
            <div class="card-subtext">Mühendislik Fakültesi · 20 Kasım 2026</div>
          </div>
        </div>
        <div class="card-meta-row">
          <span class="pill-tag">Etkinlik</span>
          <a href="/announcements" class="card-action-link">İncele &rarr;</a>
        </div>
      </article>

      <!-- Kart 6: Kariyer Fırsatı 3 -->
      <article class="clean-card" data-category="jobs" data-title="Frontend Infrastructure Lead Vercel">
        <div class="clean-card-header">
          <div class="card-avatar" style="background:#eff6ff;">💻</div>
          <div class="card-title-group">
            <h3 class="card-name">Frontend Infrastructure Lead</h3>
            <div class="card-subtext">🏢 Vercel · Remote Global</div>
          </div>
        </div>
        <div class="card-meta-row">
          <span class="pill-tag">Full-time</span>
          <a href="/job-postings" class="card-action-link">İncele &rarr;</a>
        </div>
      </article>
    </div>

  </main>

  <!-- ========================================================
   * FOOTER
   * ======================================================== -->
  <footer class="site-footer">
    <div class="footer-container">
      <div>
        <div class="footer-brand">🎓 Alumni Tracking System</div>
        <p class="footer-desc">
          Mintlify aydınlığı ve ferahlığında geliştirilmiş, doğrulanmış mezun ve kariyer platformu.
        </p>
      </div>
      <div>
        <div class="footer-col-title">Navigasyon</div>
        <ul class="footer-links">
          <li><a href="/main">Home</a></li>
          <li><a href="/users">Alumni Directory</a></li>
          <li><a href="/job-postings">Career Opportunities</a></li>
          <li><a href="/announcements">Announcements Board</a></li>
          <li><a href="/applications">Application Tracking</a></li>
        </ul>
      </div>
      <div>
        <div class="footer-col-title">Geliştirici & API</div>
        <ul class="footer-links">
          <li><a href="/api/swagger">Swagger UI</a></li>
          <li><a href="/api/swagger.json">OpenAPI 3.0 Spec</a></li>
          <li><a href="/api/health">System Health</a></li>
          <li><a href="/404">404 Guardian</a></li>
        </ul>
      </div>
      <div>
        <div class="footer-col-title">Dokümantasyon</div>
        <ul class="footer-links">
          <li><a href="/brand.md">Brand Manual (brand.md)</a></li>
          <li><a href="/DESIGN.md">Design System (DESIGN.md)</a></li>
          <li><a href="https://github.com/ecemyakali/alumni" target="_blank" rel="noopener">GitHub Repository</a></li>
        </ul>
      </div>
    </div>

    <div class="footer-bottom">
      <div>© 2026 Alumni Tracking System. Tüm hakları saklıdır.</div>
      <div style="display:flex; gap:8px;">
        <span class="pill-tag font-mono">Node.js</span>
        <span class="pill-tag font-mono">Express</span>
        <span class="pill-tag font-mono">PostgreSQL</span>
      </div>
    </div>
  </footer>

  <!-- İNTERAKTİF İSTEMCİ SCRİPTİ: Arama ve Kategori Filtreleme -->
  <script>
    (function() {
      const searchInput = document.getElementById('globalSearchInput');
      const tabButtons = document.querySelectorAll('.tab-btn');
      const cards = document.querySelectorAll('.clean-card');

      let currentCategory = 'all';

      function filterCards() {
        const query = (searchInput ? searchInput.value : '').toLowerCase().trim();

        cards.forEach(card => {
          const cat = card.getAttribute('data-category') || '';
          const text = (card.getAttribute('data-title') || '').toLowerCase();

          const matchesCat = currentCategory === 'all' || cat === currentCategory;
          const matchesQuery = !query || text.includes(query);

          card.style.display = (matchesCat && matchesQuery) ? 'flex' : 'none';
        });
      }

      if (searchInput) {
        searchInput.addEventListener('input', filterCards);
        // Ctrl+K / Cmd+K shortcut
        window.addEventListener('keydown', function(e) {
          if ((e.ctrlKey || e.metaKey) && (e.key === 'k' || e.key === 'K')) {
            e.preventDefault();
            searchInput.focus();
          }
        });
      }

      tabButtons.forEach(btn => {
        btn.addEventListener('click', function() {
          tabButtons.forEach(b => b.classList.remove('active'));
          this.classList.add('active');
          currentCategory = this.getAttribute('data-filter') || 'all';
          filterCards();
        });
      });
    })();
  </script>
</body>
</html>`;
  }
};

module.exports = homeView;
