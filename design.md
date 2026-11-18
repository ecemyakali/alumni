# 🎨 Alumni Tracking System — Master Design System Specification (`design.md`)

## 1. Executive Overview & Design Philosophy

The **Alumni Tracking System** employs a playful, human-centric, yet institutionally prestigious design language inspired by modern high-voltage B2B SaaS interfaces. While traditional higher-education portals often suffer from sterile, cool-gray corporate monotony or archaic institutional bureaucracy, this platform creates an inviting, tactile atmosphere that alumni genuinely enjoy revisiting.

### Core Visual Tenets
- **Warm Cream Canvas (`#fffaf0`):** Replaces cold grays with a subtle, warm, cream-tinted foundation that conveys community warmth and editorial craftsmanship.
- **Saturated Domain Feature Cards:** High-energy, single-color feature cards across 6 signature hues representing the core platform capabilities (Alumni Directory, Career Board, Announcements, Applications, Mentorship, and System Metrics).
- **Tactile 3D Claymation & Academic Depth:** 3D-rendered claymation illustrations (academic caps, career ladders, campus horizons, mascot characters) anchor the hero and CTA sections, establishing memorable brand voltage without heavy drop shadows.
- **Warm Rounded Display Typography:** Display headlines set in a warm, rounded face at weight 500 with tight negative letter-spacing (`-1px` to `-2.5px`), paired with crisp **Inter** for dense tabular data and operational UI.
- **Embedded Product UI Fragments:** Rather than abstract marketing graphics, cards embed live product fragments—mini alumni cards, job tags, application status pipelines, and real-time metric indicators.
- **Warm-Through Closing Rhythm:** The entire page pacing stays warm—including the footer, which deliberately uses a soft cream tint (`#faf5e8`) instead of a harsh dark block.

---

## 2. Color Palette & Design Tokens

### 2.1 Surface & Canvas Tokens
| Token | Hex Code | Purpose / Application |
|---|---|---|
| `{colors.canvas}` | `#fffaf0` | Primary page canvas floor; warm cream-tinted white |
| `{colors.surface-soft}` | `#faf5e8` | Footer, pre-footer CTA band, hero illustration container |
| `{colors.surface-card}` | `#f5f0e0` | Secondary / testimonial cards, subtle container panels |
| `{colors.surface-strong}`| `#ebe6d6` | Emphasized sections, filter sidebars, sub-nav containers |
| `{colors.hairline}` | `#e5e5e5` | 1px clean borders for inputs, cards, and table dividers |
| `{colors.surface-dark}` | `#0a1a1a` | Dark teal-tinted slate for rare developer/terminal previews |

### 2.2 Saturated Domain Feature Cards Palette
Each core domain of the Alumni Tracking System is visually coded with a signature saturated card color:

| Domain / Token | Hex Code | Card Background | Foreground Text | Domain Mapping |
|---|---|---|---|---|
| `{colors.brand-blue}` | `#2563eb` | Vibrant Royal Blue | `{colors.on-dark}` (`#ffffff`) | **Alumni Directory:** Profiles, networking & verified badges |
| `{colors.brand-teal}` | `#1a3a3a` | Deep Forest Teal | `{colors.on-dark}` (`#ffffff`) | **Career Board:** High-priority job postings & salary insights |
| `{colors.brand-lavender}`| `#b8a4ed` | Soft Lavender | `{colors.ink}` (`#0a0a0a`) | **Applications & Mentorship:** Tracking status & student mentor ties |
| `{colors.brand-peach}` | `#ffb084` | Warm Peach | `{colors.ink}` (`#0a0a0a`) | **Announcements Board:** Campus events, reunions & department news |
| `{colors.brand-ochre}` | `#e8b94a` | Golden Ochre | `{colors.ink}` (`#0a0a0a`) | **Global Alumni Chapters:** Regional meetups & donor circles |
| `{colors.brand-mint}` | `#a4d4c5` | Fresh Mint Accent | `{colors.ink}` (`#0a0a0a`) | **System Health & Swagger:** API uptime & active telemetry |

### 2.3 Ink & Typography Colors
| Token | Hex Code | Role |
|---|---|---|
| `{colors.primary}` / `{colors.ink}` | `#0a0a0a` | Display headlines, h1/h2 headings, primary buttons |
| `{colors.body-strong}` | `#1a1a1a` | Emphasized paragraphs, table headers, form field labels |
| `{colors.body}` | `#3a3a3a` | Standard running text, card descriptions, directory details |
| `{colors.muted}` | `#6a6a6a` | Sub-titles, metadata pills, breadcrumbs, table footers |
| `{colors.muted-soft}` | `#9a9a9a` | Timestamps, fine-print, legal disclaimers, input placeholders |
| `{colors.on-dark}` | `#ffffff` | Pure white text on Blue, Teal, and Dark surfaces |

### 2.4 Semantic Feedback Tokens
| Token | Hex Code | Context |
|---|---|---|
| `{colors.success}` | `#16a34a` | Application accepted, user profile verified, 200 OK |
| `{colors.warning}` | `#d97706` | Application under review, deadline approaching |
| `{colors.error}` | `#dc2626` | 400 Bad Request, 404 Guardian rejection, 500 server alerts |
| `{colors.info}` | `#0284c7` | Institutional broadcast notices, Swagger endpoint badges |

---

## 3. Typography Architecture

### 3.1 Typeface Strategy
- **Display Headings:** **Plain Black** (or rounded display **Inter** / **Recoleta**) at weight **500** with deliberate negative letter-spacing. A lighter weight with rounded terminals delivers human warmth without aggressive corporate dominance.
- **Body & Operational UI:** **Inter** (`-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto`) for clean legibility at small sizes, form fields, and dense database tables.
- **API Payloads & Code:** Native monospace stack (`ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas`).

### 3.2 Typographic Hierarchy Matrix

| Token | Size | Weight | Line Height | Letter Spacing | Primary Use Case |
|---|---|---|---|---|---|
| `{typography.display-xl}` | `72px` | 500 | 1.00 | `-2.5px` | Homepage hero h1 ("Connect, Grow, and Mentor") |
| `{typography.display-lg}` | `56px` | 500 | 1.05 | `-2.0px` | Main section headings (e.g. "Career Board Opportunities") |
| `{typography.display-md}` | `40px` | 500 | 1.10 | `-1.0px` | Pre-footer CTA titles, major module headings |
| `{typography.display-sm}` | `32px` | 500 | 1.15 | `-0.5px` | Feature card titles, modal window titles |
| `{typography.title-lg}` | `24px` | 600 | 1.30 | `-0.3px` | Section sub-heads, job posting titles in detail views |
| `{typography.title-md}` | `18px` | 600 | 1.40 | `0` | Directory card names, table headers, form group titles |
| `{typography.title-sm}` | `16px` | 600 | 1.40 | `0` | Compact card headers, navigation dropdown labels |
| `{typography.body-md}` | `16px` | 400 | 1.55 | `0` | Default running paragraphs, announcement contents |
| `{typography.body-sm}` | `14px` | 400 | 1.55 | `0` | Compact table cells, footer links, form hints |
| `{typography.caption}` | `13px` | 500 | 1.40 | `0` | Status badges, graduation year pills, role chips |
| `{typography.caption-upper}` | `12px` | 600 | 1.40 | `1.5px` | Uppercase category markers (e.g. "FEATURED JOB") |
| `{typography.button}` | `14px` | 600 | 1.00 | `0` | Action buttons, submission CTAs, table action links |
| `{typography.nav-link}` | `14px` | 500 | 1.40 | `0` | Top navbar links and breadcrumb segments |

---

## 4. Spacing, Rhythm & Layout Grid

### 4.1 4px Spacing Scale
- `{spacing.xxs}`: `4px`
- `{spacing.xs}`: `8px`
- `{spacing.sm}`: `12px`
- `{spacing.md}`: `16px`
- `{spacing.lg}`: `24px`
- `{spacing.xl}`: `32px`
- `{spacing.xxl}`: `48px`
- `{spacing.section}`: `96px` (Strict vertical breathing room between major page bands)

### 4.2 Grid Structure
- **Max Content Container:** `1280px` centered with responsive horizontal margins (`24px` desktop, `16px` mobile).
- **Hero Grid (7/5 Split):** 7 columns allocated to headline, proposition, and action buttons; 5 columns allocated to the 3D claymation artifact card.
- **Feature Cards Grid:** 
  - Desktop: 3-column (`repeat(3, 1fr)`) with `24px` gutter.
  - Tablet: 2-column (`repeat(2, 1fr)`) with `16px` gutter.
  - Mobile: 1-column stack.
- **Recent Activity Split:** Dual-column 6/6 split showcasing *Latest Campus Announcements* on the left and *Hot Job Postings* on the right.

---

## 5. Elevation, Shapes & Depth

### 5.1 Border Radius Scale
The generous radius curve matches the rounded character of the display typography:
- `{rounded.xs}` (`6px`): Small badges, metadata pills.
- `{rounded.sm}` (`8px`): Sub-navigation pills, table action buttons.
- `{rounded.md}` (`12px`): Primary CTAs, form input fields, search bars.
- `{rounded.lg}` (`16px`): Content cards, table surfaces, profile containers.
- `{rounded.xl}` (`24px`): Saturated feature cards, hero illustration containers, CTA bands.
- `{rounded.pill}` (`9999px`): Category filter tabs, role indicator badges.

### 5.2 Elevation Tokens
Rather than muddy multi-layer drop shadows, the system prioritizes flat saturated color contrast and tactile 1px hairlines:
- **Flat:** Canvas sections, navigation bar, hero band.
- **Hairline Border:** `1px solid {colors.hairline}` on form inputs and white content cards.
- **Saturated Fill:** Saturated card surfaces with zero shadow—color provides all required depth.
- **Subtle Elevation (Hover):** `box-shadow: 0 8px 24px rgba(10, 10, 10, 0.06); transform: translateY(-2px);` for interactive card states.

---

## 6. Component Specifications

### 6.1 Top Navigation (`top-nav`)
- **Height & Behavior:** `64px` sticky top bar on `{colors.canvas}` with a clean `1px solid {colors.hairline}` bottom boundary.
- **Left Cluster:** Academic mortarboard icon (`🎓`) + `Alumni Tracking System` wordmark in `{colors.ink}`.
- **Center Cluster:** Links (`Alumni`, `Careers`, `Announcements`, `Applications`, `API Docs`) in `{typography.nav-link}`.
- **Right Cluster:** Secondary "Sign In" link paired with Primary `{component.button-primary}` "Join Network".

### 6.2 Button System
- **`button-primary`:** 
  - Background: `{colors.primary}` (`#0a0a0a`), Text: `{colors.on-dark}` (`#ffffff`).
  - Height: `44px`, Padding: `12px 24px`, Radius: `{rounded.md}` (`12px`).
  - Typography: `{typography.button}` (Inter 14px / 600).
- **`button-secondary`:** 
  - Background: `{colors.canvas}`, Text: `{colors.ink}`, Border: `1px solid {colors.hairline}`.
- **`button-on-color`:** 
  - Used strictly inside saturated feature cards. Background: Pure White (`#ffffff`), Text: `{colors.ink}`, subtle hover scale.
- **`button-text-link`:** 
  - Transparent background, underlined on hover, used for tertiary actions ("View All →", "Back to Directory").

### 6.3 Domain Feature Cards (`feature-card-*`)
- **Dimensions & Padding:** Internal padding `{spacing.xl}` (`32px`), border radius `{rounded.xl}` (`24px`).
- **Internal Anatomy:**
  1. Top Row: Monospace / Uppercase domain tag (`{typography.caption-upper}`) + Domain Icon.
  2. Heading: Title in `{typography.title-lg}`.
  3. Description: 2-3 lines explaining value in `{typography.body-md}`.
  4. **Product UI Fragment:** An interactive micro-preview of the actual product (e.g. mini user row with avatar and graduation badge, job salary pill, or application status indicator).
  5. Action Link: Direct link into the domain module ("Explore Careers →").

### 6.4 Form Inputs (`text-input`)
- Height: `44px`, Radius: `{rounded.md}` (`12px`), Border: `1px solid {colors.hairline}`.
- Background: `{colors.canvas}` or White surface.
- Focus State (`text-input-focused`): Border color switches to `{colors.ink}` (`#0a0a0a`) with `0 0 0 2px rgba(10, 10, 10, 0.1)`.

### 6.5 Signature Warm Pre-Footer & Footer
- **Pre-Footer CTA Band (`cta-band-illustrated`):** Rounded container (`{rounded.xl}`) with `{colors.surface-soft}` background, 80px vertical padding, bold heading ("Ready to re-connect with your alma mater?"), action buttons, and a 3D claymation campus graphic.
- **Footer (`footer`):** Styled on `{colors.surface-soft}` (never dark navy). Multi-column layout containing institutional links, Swagger/API references, copyright, and active tech stack tags (Node.js, Express, PostgreSQL, Docker).

---

## 7. Accessibility (WCAG 2.1 AA) Standards

1. **Color Contrast Enforcement:**
   - Dark text (`#0a0a0a`) on `{colors.canvas}` (`#fffaf0`): Contrast ratio **18.4:1** (Far exceeds AA standard 4.5:1).
   - White text on `{colors.brand-blue}` (`#2563eb`): Contrast ratio **4.6:1** (Meets AA).
   - White text on `{colors.brand-teal}` (`#1a3a3a`): Contrast ratio **13.5:1** (Meets AAA).
   - Dark text on Lavender (`#b8a4ed`), Peach (`#ffb084`), and Ochre (`#e8b94a`): All exceed **5.2:1**.
2. **Touch Targets:** All primary buttons and form inputs maintain a minimum touch target of `44px × 44px`.
3. **Focus Rings:** Unbroken, high-visibility keyboard navigation focus rings:
   `outline: 2px solid {colors.primary}; outline-offset: 2px;`
4. **Semantic HTML:** Mandatory usage of native `<nav>`, `<main>`, `<section>`, `<article>`, `<header>`, and `<footer>` tags across all server-rendered views.

---

## 8. Do's and Don'ts (System Integrity)

### ✅ Do:
- Anchor all view layers to the `{colors.canvas}` cream baseline (`#fffaf0`).
- Cycle saturated feature cards sequentially (Blue → Teal → Lavender → Peach → Ochre → Cream) to maintain visual rhythm.
- Retain rounded display type at weight 500 with negative letter spacing for display headers.
- Embed authentic product UI fragments (application status rows, job pills, profile cards) inside feature cards.
- Keep the footer warm and light (`{colors.surface-soft}`); never introduce an abrupt dark footer.
- Use generous `{spacing.section}` (`96px`) between major editorial sections.

### ❌ Don't:
- Don't use sterile cold grays (`#f3f4f6`) for main canvas backgrounds.
- Don't repeat the same saturated card color twice in consecutive sequence.
- Don't bump display typography weight to 700+; bold weights crush the friendly, rounded character of the type.
- Don't apply heavy, blurry, multi-stop black drop shadows.
- Don't replace 3D claymation/handcrafted illustration elements with generic flat corporate clip art.
- Don't omit explicit 44px touch targets on mobile viewports.

---

## 9. Responsive Breakpoints

| Breakpoint | Viewport Width | Layout Adaptations |
|---|---|---|
| **Mobile** | `< 768px` | Top-nav collapses to clean drawer; hero h1 drops from `72px` to `36px`; hero illustration card stacks below copy; feature cards 1-up. |
| **Tablet** | `768px – 1024px` | Hero 7/5 grid condenses; feature cards display 2-up; sub-navigation scrollable horizontally. |
| **Desktop** | `1024px – 1440px` | Full horizontal navigation; feature cards 3-up; dual-column recent activity feed. |
| **Wide** | `> 1440px` | Max container pinned at `1280px` with proportional auto margins. |

---

## 10. Technical Implementation: CSS Variable Tokens

To immediately adopt this design system across Express.js view templates, embed the following token set in the root stylesheet:

```css
:root {
  /* Surface Tokens */
  --colors-canvas: #fffaf0;
  --colors-surface-soft: #faf5e8;
  --colors-surface-card: #f5f0e0;
  --colors-surface-strong: #ebe6d6;
  --colors-hairline: #e5e5e5;
  --colors-surface-dark: #0a1a1a;

  /* Saturated Feature Card Tokens */
  --colors-brand-blue: #2563eb;
  --colors-brand-teal: #1a3a3a;
  --colors-brand-lavender: #b8a4ed;
  --colors-brand-peach: #ffb084;
  --colors-brand-ochre: #e8b94a;
  --colors-brand-mint: #a4d4c5;
  --colors-brand-pink: #ff4d8b;

  /* Text & Ink Tokens */
  --colors-primary: #0a0a0a;
  --colors-ink: #0a0a0a;
  --colors-body-strong: #1a1a1a;
  --colors-body: #3a3a3a;
  --colors-muted: #6a6a6a;
  --colors-muted-soft: #9a9a9a;
  --colors-on-dark: #ffffff;

  /* Semantic Feedback Tokens */
  --colors-success: #16a34a;
  --colors-warning: #d97706;
  --colors-error: #dc2626;
  --colors-info: #0284c7;

  /* Border Radius Tokens */
  --rounded-xs: 6px;
  --rounded-sm: 8px;
  --rounded-md: 12px;
  --rounded-lg: 16px;
  --rounded-xl: 24px;
  --rounded-pill: 9999px;

  /* Spacing Rhythm Tokens */
  --spacing-xxs: 4px;
  --spacing-xs: 8px;
  --spacing-sm: 12px;
  --spacing-md: 16px;
  --spacing-lg: 24px;
  --spacing-xl: 32px;
  --spacing-xxl: 48px;
  --spacing-section: 96px;

  /* Font Families */
  --font-display: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  --font-body: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-mono: ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace;
}
```

---

> 📖 **Cross-Document References:**
> - [`brand.md`](./brand.md) — Institutional Brand Identity, Logo Rules & Voice Guidelines
> - [`ddd.md`](./ddd.md) — Domain-Driven Design, Entity Schemas & Database Contracts
> - [`README.md`](./README.md) — System Architecture, Quick Start & API Directory
