---
version: 2.0.0
name: alumni-hybrid-design-system
description: "A synthesis of Mintlify's airy, readable documentation aesthetic and Linear's dense, high-craft Bento grid discipline. Built around a clean white canvas (#ffffff) with subtle soft background tints (#f8fafc), crisp 1px hairline borders (#e2e8f0), deep ink typography (#090a0f), the signature Linear craft lavender (#5e6ad2) for accents, and Mintlify's vibrant mint (#10b981) for verified statuses. Features an asymmetric 2/3 + 1/3 Bento showcase, full pill buttons, and surgical typographic contrast."

colors:
  canvas: "#ffffff"
  surface-subtle: "#f8fafc"
  surface-card: "#ffffff"
  surface-elevated: "#f1f5f9"
  surface-dark: "#090a0f"
  surface-dark-panel: "#12131a"
  
  hairline: "#e2e8f0"
  hairline-strong: "#cbd5e1"
  hairline-subtle: "#f1f5f9"
  hairline-dark: "#23252a"

  ink: "#090a0f"
  ink-muted: "#475569"
  ink-subtle: "#64748b"
  ink-tertiary: "#94a3b8"
  on-dark: "#ffffff"
  on-dark-muted: "#94a3b8"

  primary: "#090a0f"
  primary-hover: "#1e293b"
  on-primary: "#ffffff"

  brand-accent: "#5e6ad2"
  brand-accent-hover: "#4f5abf"
  brand-accent-subtle: "#eef0fb"

  brand-mint: "#10b981"
  brand-mint-deep: "#059669"
  brand-mint-subtle: "#ecfdf5"

  semantic-success: "#10b981"
  semantic-warning: "#f59e0b"
  semantic-error: "#ef4444"
  semantic-info: "#3b82f6"

typography:
  fontFamily:
    display: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    body: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    mono: 'ui-monospace, "SF Mono", "Geist Mono", Menlo, Consolas, monospace'
  
  scale:
    display-xl:
      fontSize: "72px"
      fontWeight: 700
      lineHeight: 1.05
      letterSpacing: "-2.5px"
    display-lg:
      fontSize: "48px"
      fontWeight: 700
      lineHeight: 1.10
      letterSpacing: "-1.8px"
    display-md:
      fontSize: "36px"
      fontWeight: 600
      lineHeight: 1.15
      letterSpacing: "-1.2px"
    headline:
      fontSize: "28px"
      fontWeight: 600
      lineHeight: 1.25
      letterSpacing: "-0.8px"
    card-title:
      fontSize: "20px"
      fontWeight: 600
      lineHeight: 1.30
      letterSpacing: "-0.4px"
    subhead:
      fontSize: "18px"
      fontWeight: 400
      lineHeight: 1.50
      letterSpacing: "-0.2px"
    body:
      fontSize: "15px"
      fontWeight: 400
      lineHeight: 1.55
      letterSpacing: "-0.05px"
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
    eyebrow:
      fontSize: "12px"
      fontWeight: 600
      lineHeight: 1.30
      letterSpacing: "0.5px"
    mono:
      fontSize: "13px"
      fontWeight: 500
      lineHeight: 1.40
      letterSpacing: "0px"

rounded:
  xs: "4px"
  sm: "6px"
  md: "8px"
  lg: "12px"
  xl: "16px"
  xxl: "24px"
  pill: "9999px"

spacing:
  xxs: "4px"
  xs: "8px"
  sm: "12px"
  md: "16px"
  lg: "24px"
  xl: "32px"
  xxl: "48px"
  section: "80px"
  hero: "96px"
---

# 📐 Alumni Tracking System — Master Design Specification (`DESIGN.md`)

## 1. Executive Synthesis: Mintlify & Linear Convergence

The **Alumni Tracking System Design System** represents a deliberate, high-craft architectural synthesis of two industry-defining design philosophies:

1. **Mintlify’s Atmospheric Openness & Reading Comfort:**
   - A bright, crisp, airy foundation (`#ffffff` canvas with subtle `#f8fafc` surface fills).
   - Generous breathing room across sections (`80px–96px` vertical cadence) allowing information to breathe without claustrophobia.
   - Disciplined pill geometry (`rounded.pill` / `9999px`) on all primary and secondary action triggers.
   - Fresh status indicator accents using Mintlify Mint (`#10b981`), symbolizing verified credentials, active memberships, and network health.

2. **Linear’s Precision Engineering & Bento Hierarchy:**
   - Razor-sharp 1px hairline borders (`#e2e8f0` in light spaces, `#23252a` on dark accent panels) establishing structural definition without heavy drop shadows.
   - High typographic contrast with authoritative deep ink headlines (`#090a0f`) set with aggressive negative letter-spacing (`-2.5px` at hero scale).
   - An **Asymmetric Bento Grid** architecture that rejects repetitive, uniform card walls in favor of intentional visual priority (2/3 featured anchor + 1/3 metric stack).
   - Linear’s signature craft lavender-indigo (`#5e6ad2`) reserved as a refined chromatic accent for links, focal outlines, and highlight rings.
   - Compact horizontal changelog-style lists for secondary content (such as announcements), preserving page momentum and keeping secondary items from competing with major hero features.

---

## 2. Color System & Design Tokens

### 2.1 Canvas & Surfaces
| Token | Hex | Role & Application |
|---|---|---|
| `{colors.canvas}` | `#ffffff` | Primary viewport background; clean, breathable, white foundation |
| `{colors.surface-subtle}` | `#f8fafc` | Subtle section backgrounds, search boxes, and secondary panels |
| `{colors.surface-card}` | `#ffffff` | Standard card surfaces framed by 1px hairlines |
| `{colors.surface-elevated}` | `#f1f5f9` | Hover states, pill containers, and badge backdrops |
| `{colors.surface-dark}` | `#090a0f` | High-contrast dark panels for code, telemetry, and dark hero accents |
| `{colors.surface-dark-panel}` | `#12131a` | Lifted dark bento panels with hairline-dark borders |

### 2.2 Borders & Hairlines
| Token | Hex | Role & Application |
|---|---|---|
| `{colors.hairline}` | `#e2e8f0` | Standard 1px structural border for cards, inputs, and dividers |
| `{colors.hairline-strong}` | `#cbd5e1` | Emphasized 1px border for active states, inputs, and hover cards |
| `{colors.hairline-subtle}` | `#f1f5f9` | Quiet horizontal rules for compact lists |
| `{colors.hairline-dark}` | `#23252a` | 1px border for dark bento cards and inverted containers |

### 2.3 Ink & Typography
| Token | Hex | Contrast & Use |
|---|---|---|
| `{colors.ink}` | `#090a0f` | Primary headlines, display text, and high-emphasis body |
| `{colors.ink-muted}` | `#475569` | Secondary paragraphs, card descriptions, and subheads |
| `{colors.ink-subtle}` | `#64748b` | Metadata, dates, category tags, and table headers |
| `{colors.ink-tertiary}` | `#94a3b8` | Micro-copy, disabled text, and fine-print disclaimers |
| `{colors.on-dark}` | `#ffffff` | Pure white text rendered on dark bento cards |
| `{colors.on-dark-muted}` | `#94a3b8` | Secondary copy rendered on dark panels |

### 2.4 Signature Brand Accents
| Token | Hex | Role |
|---|---|---|
| `{colors.primary}` | `#090a0f` | Dominant primary CTA button background (Mintlify/Linear black pill) |
| `{colors.brand-accent}` | `#5e6ad2` | Linear signature craft lavender — links, active tabs, focus rings |
| `{colors.brand-accent-hover}`| `#4f5abf` | Darker lavender for pressed and hover states |
| `{colors.brand-mint}` | `#10b981` | Mintlify mint — verified badge dot, live metrics, accepted status |
| `{colors.brand-mint-subtle}`| `#ecfdf5` | Subtle emerald pill background for status indicators |

---

## 3. Typographic Architecture

### 3.1 Type Families
- **Display & Headings:** `Inter` (with native macOS `SF Pro Display` and Windows `Segoe UI` fallback). Weight `600–700`. Set with negative letter-spacing proportional to font size to deliver a modern, authoritative product voice.
- **Body & Operational UI:** `Inter` at weight `400` and `500`. Set with `1.50–1.55` line-height for effortless reading.
- **Numbers, Metadata & Code:** Monospace font stack (`ui-monospace, "SF Mono", "Geist Mono", Menlo, Consolas`). Used for counters, application IDs, timestamps, and salary ranges.

### 3.2 Hierarchy Matrix

| Token | Size | Weight | Line Height | Letter Spacing | Context |
|---|---|---|---|---|---|
| `display-xl` | 72px | 700 | 1.05 | -2.5px | Homepage Hero headline |
| `display-lg` | 48px | 700 | 1.10 | -1.8px | Major section headers |
| `display-md` | 36px | 600 | 1.15 | -1.2px | Subsection openers, bento headline |
| `headline` | 28px | 600 | 1.25 | -0.8px | Card category headers, modal titles |
| `card-title` | 20px | 600 | 1.30 | -0.4px | Opportunity & profile card titles |
| `subhead` | 18px | 400 | 1.50 | -0.2px | Hero lead subhead, section intros |
| `body` | 15px | 400 | 1.55 | -0.05px | Default running text |
| `body-sm` | 14px | 400 | 1.50 | 0px | Compact table cells, metadata, footers |
| `caption` | 12px | 500 | 1.40 | 0px | Status badges, graduation year pills |
| `eyebrow` | 12px | 600 | 1.30 | +0.5px | Uppercase section markers |
| `mono` | 13px | 500 | 1.40 | 0px | Timestamps, counters, salary chips |

---

## 4. Visual Hierarchy & 4-Tier Homepage Structure

To permanently resolve flat, monotonous layouts where every card fights for equal attention, the platform mandates four distinct visual importance layers:

```
┌────────────────────────────────────────────────────────────────────────┐
│  KATMAN 1: HERO (En Baskın Bölüm)                                      │
│  - Mintlify ferahlığı, 96px üst boşluk                                 │
│  - Hairline duyuru rozeti (Announcement Pill Badge)                    │
│  - 72px tight-tracking display başlık + ikna edici alt başlık          │
│  - Siyah pill birincil CTA + 1px hairline ikincil aksiyon butonu       │
└────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────┬───────────────────────────────┐
│  KATMAN 2: ASİMETRİK BENTO VİTRİN      │  1/3 SAĞ METRİK SÜTUNU        │
│  2/3 SOL GENİŞ KART                    │  - Toplam Mezun Sayısı (Bento)│
│  - Öne Çıkan Mezun Buluşması / Zirve   │  - Aktif Kariyer İlanları     │
│  - Canlı "Öne Çıkan" rozeti            │  - Başvuru Başarı Oranı       │
│  - Tarih, konuşmacılar ve kayıt CTA'sı │  - 40px kalın mono rakamlar   │
└────────────────────────────────────────┴───────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│  KATMAN 3: SEÇİLİ MEZUNLAR & KARİYER FIRSATLARI (3 Sütunlu Grid)       │
│  - 1px hairline çerçeveli, 12px yuvarlak köşeli dengeli kartlar        │
│  - Rol rozetleri, mezuniyet yılı etiketleri, şirket ve maaş bilgileri │
└────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│  KATMAN 4: SON DUYURULAR (Kompakt Liste — Linear Changelog Stili)      │
│  - Kartlarla yarışmayan, sade yatay satırlar                           │
│  - Geist Mono tarih, kategori rozeti, başlık ve yönlendirme oku         │
└────────────────────────────────────────────────────────────────────────┘
```

### Katman 1: Hero (The Dominant Section)
- **Visual Weight:** 100% focal priority.
- **Composition:** Centered or generous split with ample vertical padding (`spacing.hero` 96px).
- **Badge Pill:** Top centered pill with 1px hairline border (`border: 1px solid var(--colors-hairline)`), subtle hover lift, and a glowing pulse dot.
- **Typography:** `display-xl` (72px, bold, `-2.5px` tracking).
- **Dual Buttons:**
  - *Primary Button (`button-primary`):* Deep black pill (`#090a0f`), white text, `border-radius: 9999px`, padding `12px 24px`.
  - *Secondary Button (`button-secondary`):* Clean white/transparent pill with 1px hairline border (`#e2e8f0`), deep ink text.

### Katman 2: Asymmetric Bento Showcase (Linear Style)
- **Ratio:** `2fr` (left anchor) to `1fr` (right vertical stack).
- **Left 2/3 Feature Card:**
  - Highlights the most prestigious upcoming event (e.g. *Annual Global Alumni Tech Summit 2026*).
  - Contains a live "ÖNE ÇIKAN / FEATURED" pill badge with an emerald pulse indicator.
  - Event metadata (Date, Location, Keynote Speakers, RSVP CTA) in high-contrast structure.
- **Right 1/3 Metric Stack:**
  - Multiple stacked metric cards displaying key platform telemetry:
    - Verified Alumni Count (`2,400+` or dynamic count).
    - Active Job Listings (`18` or dynamic count).
    - Career Placement Rate (`98.4%`).
  - Set in `font-family: mono`, `36px–40px` bold numbers with crisp uppercase labels.

### Katman 3: Curated Directory & Career Grid
- **Ratio:** 3-column desktop grid (`1fr 1fr 1fr`).
- **Styling:** Clean white cards, 1px `#e2e8f0` hairline borders, `12px` rounded corners.
- **Content:** Curated alumni profiles and top job postings with clear role pills, location icons, and compensation tags.

### Katman 4: Recent Announcements (Compact Linear Changelog)
- **Ratio:** Full-width structured list.
- **Styling:** Clean horizontal rows separated by 1px hairlines (`border-bottom: 1px solid var(--colors-hairline-subtle)`).
- **Philosophy:** Does not compete with the cards above; provides dense, high-efficiency information scanning.
- **Elements:** Date in `Geist Mono`, category pill (`Akademik`, `Kariyer`, `Etkinlik`), title with hover highlight, and subtle view arrow (`→`).

---

## 5. Component Library & Tokens

### 5.1 Buttons (`rounded.pill`)
- **`button-primary`:** Solid `#090a0f` fill, `#ffffff` text, `border-radius: 9999px`, padding `10px 22px`. Hover lifts with subtle shadow `0 2px 8px rgba(0,0,0,0.12)`.
- **`button-secondary`:** White background, 1px `#e2e8f0` border, `#090a0f` text, `border-radius: 9999px`, padding `10px 20px`. Hover shifts to `#f8fafc` and `#cbd5e1` border.
- **`button-accent`:** Solid Linear lavender `#5e6ad2` fill, `#ffffff` text, `border-radius: 9999px`.
- **`button-sm`:** Compact pill for row-level actions, padding `6px 14px`, `fontSize: 13px`.

### 5.2 Badges & Status Pills
- **`badge-pill`:** `border-radius: 9999px`, `padding: 4px 12px`, `font-size: 12px`, `font-weight: 500`.
- **`badge-mint`:** `#ecfdf5` background, `#059669` text, 1px `#a7f3d0` border, includes a green status dot (`●`).
- **`badge-accent`:** `#eef0fb` background, `#5e6ad2` text, 1px `#d5daf7` border.
- **`badge-neutral`:** `#f1f5f9` background, `#475569` text, 1px `#e2e8f0` border.

### 5.3 Bento & Feature Cards
- **`bento-container`:** `display: grid; grid-template-columns: 2fr 1fr; gap: 24px;`
- **`card-featured`:** 1px hairline border, `border-radius: 16px`, soft drop shadow `0 1px 3px rgba(0,0,0,0.04)`.
- **`card-metric`:** Clean hairline border, `border-radius: 14px`, bold numbers with micro-uppercase label.

### 5.4 Top Navigation Bar
- Pinned sticky navbar with `height: 64px`, `backdrop-filter: blur(12px)`, background `rgba(255, 255, 255, 0.92)`, and bottom border `1px solid var(--colors-hairline)`.
- Wordmark left: `🎓 Alumni Tracking System` with bold tracking.
- Navigation links center: understated `ink-muted` text with subtle hover background pills.
- Quick actions right: secondary link + black pill primary CTA (`+ Post Opportunity`).

### 5.5 Site Footer
- Clean multi-column layout on `#ffffff` canvas with top 1px hairline border (`#e2e8f0`).
- Columns for Directory, Career Hub, Documentation & API, Alma Mater heritage.
- Technology stack indicators (`Node.js`, `Express`, `PostgreSQL`, `REST API`, `OpenAPI 3.0`).

---

## 6. Do's and Don'ts

### Do:
- **Do** respect the 4-layer importance hierarchy on the homepage; let the Hero and Bento showcase dominate.
- **Do** use full pill buttons (`rounded.pill` / `9999px`) for all action buttons and status tags.
- **Do** enforce 1px hairline borders (`#e2e8f0`) to provide structural craft rather than heavy shadows.
- **Do** format numbers, dates, and metrics in monospace for an authentic software-craft feel.
- **Do** use Linear lavender (`#5e6ad2`) and Mintlify mint (`#10b981`) with surgical restraint.

### Don't:
- **Don't** create equal-sized, identical box grids that produce visual monotony.
- **Don't** use squared or semi-rounded corners on buttons; buttons must always be pills (`9999px`).
- **Don't** introduce heavy multi-color gradients or muddy drop shadows.
- **Don't** let secondary announcements compete visually with major event cards.
- **Don't** loosen display letter-spacing; keep hero headlines at `-2.0px` to `-2.5px`.

---

## 7. Responsive Breakpoint Standards
- **Desktop-XL (≥1280px):** Full 2/3 + 1/3 Bento showcase, 3-column curated grid, 96px hero padding.
- **Tablet (768px–1023px):** Bento collapses to stacked (Featured top, metrics 2-up below), 2-column curated grid.
- **Mobile (<768px):** Single-column stack, hero headline scales to 38px–42px, horizontal scroll or stacked table previews.

---

## 8. File Reference & Verification
- Document Path: `DESIGN.md` (Repository Root)
- Design Architecture: Mintlify + Linear Hybrid
- Target Audience: Alumni, Graduating Students, Faculty, Recruiters
