---
version: 2.2.0
name: alumni-mintlify-aurora-design-system
description: "A Mintlify-inspired aesthetic for the Alumni Tracking System. Features an iconic multi-layer mesh/aurora gradient backdrop (emerald green, turquoise, and soft sky blue), deep diffuse shadows, a signature central search bar with ⌘K shortcut, frosted-glass sticky navigation, and a clear 3-stage visual hierarchy."

colors:
  canvas: "#ffffff"
  surface-subtle: "#f9fafb"
  surface-card: "#ffffff"
  surface-elevated: "#f3f4f6"
  
  aurora:
    emerald: "rgba(16, 185, 129, 0.24)"
    cyan: "rgba(6, 182, 212, 0.22)"
    sky: "rgba(59, 130, 246, 0.15)"
    base-gradient: "linear-gradient(180deg, rgba(236, 253, 245, 0.75) 0%, rgba(255, 255, 255, 1) 100%)"

  hairline: "#e5e7eb"
  hairline-strong: "#d1d5db"
  hairline-subtle: "#f3f4f6"

  ink: "#111827"
  ink-muted: "#4b5563"
  ink-subtle: "#6b7280"
  ink-tertiary: "#9ca3af"

  primary: "#111827"
  primary-hover: "#1f2937"
  on-primary: "#ffffff"

  brand-mint: "#0d9373"
  brand-mint-hover: "#0b7c61"
  brand-mint-subtle: "#ecfdf5"
  brand-mint-border: "#a7f3d0"

  brand-accent: "#5e6ad2"
  brand-accent-subtle: "#eef0fb"

  semantic-success: "#10b981"
  semantic-warning: "#f59e0b"
  semantic-error: "#ef4444"
  semantic-info: "#3b82f6"

shadows:
  card: "0 4px 20px -2px rgba(0, 0, 0, 0.05), 0 2px 6px -1px rgba(0, 0, 0, 0.03)"
  card-hover: "0 20px 40px -15px rgba(0, 0, 0, 0.08), 0 0 0 1px rgba(0, 0, 0, 0.05)"
  search-bar: "0 10px 30px -5px rgba(13, 147, 115, 0.08), 0 4px 12px rgba(0, 0, 0, 0.04)"
  spotlight: "0 12px 32px -4px rgba(16, 185, 129, 0.08), 0 2px 8px rgba(0, 0, 0, 0.02)"

typography:
  fontFamily:
    display: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    body: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    mono: 'ui-monospace, "SF Mono", "Geist Mono", Menlo, Consolas, monospace'
  
  scale:
    display-xl:
      fontSize: "64px"
      fontWeight: 700
      lineHeight: 1.10
      letterSpacing: "-2.0px"
    display-lg:
      fontSize: "44px"
      fontWeight: 700
      lineHeight: 1.15
      letterSpacing: "-1.5px"
    heading:
      fontSize: "24px"
      fontWeight: 600
      lineHeight: 1.30
      letterSpacing: "-0.5px"
    card-title:
      fontSize: "18px"
      fontWeight: 600
      lineHeight: 1.35
      letterSpacing: "-0.2px"
    body:
      fontSize: "15px"
      fontWeight: 400
      lineHeight: 1.60
      letterSpacing: "0px"
    body-sm:
      fontSize: "14px"
      fontWeight: 400
      lineHeight: 1.50
      letterSpacing: "0px"
    caption:
      fontSize: "12px"
      fontWeight: 500
      lineHeight: 1.40
      letterSpacing: "0px"

rounded:
  xs: "4px"
  sm: "6px"
  md: "8px"
  lg: "12px"
  xl: "16px"
  pill: "9999px"

spacing:
  xs: "8px"
  sm: "12px"
  md: "16px"
  lg: "24px"
  xl: "32px"
  xxl: "48px"
  section: "72px"
  hero: "80px"
---

# 📐 Alumni Tracking System — Master Design Specification (`DESIGN.md`)

## 1. Design Vision: Mintlify Aurora & Deep Elevation

The **Alumni Tracking System** employs an airy, multi-dimensional aesthetic inspired by modern documentation platforms (Mintlify). It replaces sterile flat grays with an iconic **Aurora / Mesh Gradient** canvas that radiates warmth, academic prestige, and high-velocity clarity.

### Core Architectural Pillars
1. **Iconic Aurora / Mesh Gradient Backdrop:**
   - The top hero and header area feature a multi-layered light cloud composed of emerald green (`rgba(16, 185, 129, 0.24)`), cyan/turquoise (`rgba(6, 182, 212, 0.22)`), and sky blue (`rgba(59, 130, 246, 0.15)`), softly fading into a crisp white canvas.
   ```css
   background-color: #ffffff;
   background-image: 
     radial-gradient(at 15% 10%, rgba(16, 185, 129, 0.24) 0px, transparent 50%),
     radial-gradient(at 85% 15%, rgba(6, 182, 212, 0.22) 0px, transparent 50%),
     radial-gradient(at 50% 0%, rgba(59, 130, 246, 0.15) 0px, transparent 60%),
     linear-gradient(180deg, rgba(236, 253, 245, 0.75) 0%, rgba(255, 255, 255, 1) 100%);
   ```
2. **Deep, Diffuse Shadows & Glassmorphism:**
   - Frosted-glass header (`rgba(255, 255, 255, 0.70)` with `backdrop-filter: blur(16px)`), allowing the vibrant aurora mesh to softly shine through.
   - Cards utilize soft, multi-layered diffuse shadows (`box-shadow: 0 20px 40px -15px rgba(0, 0, 0, 0.08)`) establishing clean spatial elevation.
3. **Central Signature Search Bar:**
   - A prominent central search box framed in the hero with a magnifying glass (`🔍`), descriptive placeholder, and a tactile keyboard shortcut chip (`Ctrl K` / `⌘K`).
4. **Clean 3-Section Visual Hierarchy:**
   - **Section 1: Hero + Central Search + Dual Action Buttons.**
   - **Section 2: Single Large Featured Event / Announcement Card + 3 Clean Telemetry Tiles.**
   - **Section 3: Category-Filtered Curated Cards (Alumni & Career Highlights).**

---

## 2. Navigation Standards

To guarantee that navigation items and tabs never cramp, wrap, or generate unwanted horizontal scrollbars:
- Enforce `white-space: nowrap` and `flex-wrap: nowrap`.
- Font size set at `13px–13.5px`, with `padding: 6px 12px` and `gap: 4px`.
- Active tab highlighted with an emerald/mint pill tint (`var(--brand-mint-subtle)`).

---

## 3. Component Design Tokens

### 3.1 Buttons
- **`btn-pill-primary`:** Deep near-black (`#111827`), white text, `border-radius: 9999px`, padding `10px 22px`.
- **`btn-pill-secondary`:** White surface, 1px border (`#e5e7eb`), `#111827` text, `border-radius: 9999px`, padding `10px 20px`.
- **`btn-pill-sm`:** Compact action link button, padding `6px 14px`, `border-radius: 9999px`.

### 3.2 Cards
- **`featured-card`:** White background, 1px `#e5e7eb` hairline, 16px corner radius (`rounded-xl`), prominent emerald left border accent (`border-left: 4px solid var(--brand-mint)`), and diffuse elevation shadow.
- **`stat-card`:** Clean, uncluttered metric tiles with bold numbers in `Geist Mono` / `SF Mono` and micro subtitles.
- **`curated-card`:** Minimalist cards with circular avatar (48px), name/title, department/location, status pill tag, and direct `View Details →` action link.

---

## 4. Subpages & Multi-Page Architectural Consistency

To ensure the entire web application delivers a unified, premium user experience, all subpages follow the exact same architectural tokens:

1. **Global Mesh / Aurora Backdrop:**
   - Every subpage (`/users`, `/job-postings`, `/announcements`, `/applications`, `/404`, `/500`) applies the fixed Aurora Mesh gradient on the `<body>` element, preventing plain flat white surfaces and preserving visual continuity across all routes.
   ```css
   background-color: #ffffff;
   background-image: 
     radial-gradient(at 15% 10%, rgba(16, 185, 129, 0.22) 0px, transparent 50%),
     radial-gradient(at 85% 15%, rgba(6, 182, 212, 0.20) 0px, transparent 50%),
     radial-gradient(at 50% 0%, rgba(59, 130, 246, 0.14) 0px, transparent 60%),
     linear-gradient(180deg, rgba(236, 253, 245, 0.72) 0%, rgba(255, 255, 255, 1) 100%);
   background-attachment: fixed;
   background-repeat: no-repeat;
   ```
2. **Unified Navigation Bar:**
   - Single-row sticky navigation across every subpage with uniform pill buttons, frosted glass blur (`backdrop-filter: blur(16px)`), and active route highlighting.
3. **Deep Diffuse Shadows:**
   - Content cards, KPI metrics, tables, and modal dialogs employ multi-tiered diffuse shadows (`box-shadow: 0 4px 20px -2px rgba(0, 0, 0, 0.05), 0 2px 6px -1px rgba(0, 0, 0, 0.03)`).
4. **100% English Language Standard:**
   - All page headings, form labels, buttons, status badges, placeholders, and error messages strictly adhere to professional, idiomatic English.

---

*Last Updated: November 2026 · Alumni Tracking System Core Team*
