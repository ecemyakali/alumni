---
version: 2.1.0
name: alumni-mintlify-first-design-system
description: "A refined, ultra-clean Mintlify-dominant design system for the Alumni Tracking System. Emphasizes an airy white canvas (#FFFFFF and #F9FAFB), a subtle pastel emerald hero glow (radial gradient with rgba(13, 147, 115, 0.08)), a signature central search bar with ⌘K shortcut, flawlessly aligned navigation tabs with white-space nowrap and 8px 16px padding, and a calm, 3-section layout hierarchy that eliminates visual clutter."

colors:
  canvas: "#ffffff"
  surface-subtle: "#f9fafb"
  surface-card: "#ffffff"
  surface-elevated: "#f3f4f6"
  hero-glow: "rgba(13, 147, 115, 0.08)"
  
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

## 1. Design Vision: Mintlify-First Clarity & Breathing Room

The **Alumni Tracking System** follows an airy, light-first design aesthetic derived directly from modern developer documentation and community platforms (Mintlify). By rejecting dark, cluttered card containers and dense borders, the interface achieves maximum reading comfort, visual calm, and rapid comprehension.

### Core Principles
1. **Airy & Clean Foundation (`#FFFFFF` and `#F9FAFB`):**
   - The entire page rests on a clean white canvas floor.
   - Contrast is established through typography and soft `#F9FAFB` surfaces rather than dark background blocks.
2. **Subtle Pastel Emerald Glow:**
   - The top hero is accented with a delicate, non-intrusive radial gradient glow (`rgba(13, 147, 115, 0.08)` fading smoothly into pure white). This delivers modern visual warmth without distracting from the typography.
3. **Central Signature Search Bar:**
   - The Hero features a prominent, centered search box with a search icon, placeholder, and interactive `Ctrl K` / `⌘K` keyboard badge. It invites instant user engagement.
4. **Flawless Navigation & Tab Alignment:**
   - All navigation items and category filter tabs enforce `white-space: nowrap`, generous `padding: 8px 16px`, `font-size: 14px`, and `gap: 8px`. Items never wrap awkwardly onto multiple lines.
5. **Streamlined 3-Stage Layout:**
   - Rather than overwhelming users with crowded bento boxes, the page flows through 3 clean, focused sections:
     1. **Hero + Central Search Bar + Dual Action Buttons** (Primary Focus).
     2. **Single Featured Announcement Card + 3 Clean Metrics** (Curated Spotlight).
     3. **Category-Filtered Curated Cards** (Alumni & Career Highlights with minimal, essential metadata).

---

## 2. Color System & Design Tokens

### 2.1 Surfaces & Glows
| Token | Hex / Value | Purpose |
|---|---|---|
| `{colors.canvas}` | `#ffffff` | Primary page background |
| `{colors.surface-subtle}` | `#f9fafb` | Section background, search inputs, tag pills |
| `{colors.surface-card}` | `#ffffff` | Cards with 1px border and soft diffuse shadow |
| `{colors.surface-elevated}` | `#f3f4f6` | Hover states, tab backgrounds |
| `{colors.hero-glow}` | `rgba(13, 147, 115, 0.08)` | Radial gradient glow at top center of hero |
| `{colors.hairline}` | `#e5e7eb` | 1px clean border on cards, inputs, and dividers |
| `{colors.hairline-strong}` | `#d1d5db` | Hover/focus border state |

### 2.2 Inks & Typography
| Token | Hex | Role |
|---|---|---|
| `{colors.ink}` | `#111827` | Headings, primary text, high-contrast labels |
| `{colors.ink-muted}` | `#4b5563` | Subtitles, body descriptions |
| `{colors.ink-subtle}` | `#6b7280` | Metadata, tags, dates, and placeholders |
| `{colors.ink-tertiary}` | `#9ca3af` | Secondary badges, disabled text |

### 2.3 Brand Accents
| Token | Hex | Role |
|---|---|---|
| `{colors.primary}` | `#111827` | Primary dark pill button |
| `{colors.brand-mint}` | `#0d9373` | Mintlify signature emerald/mint accent (badges, dots, highlights) |
| `{colors.brand-mint-subtle}`| `#ecfdf5` | Soft mint background for pills and status badges |
| `{colors.brand-mint-border}`| `#a7f3d0` | 1px border for mint status badges |
| `{colors.brand-accent}` | `#5e6ad2` | Subtle lavender-blue accent for links and secondary highlights |

---

## 3. Navigation & Tab Bar Standards

To guarantee that tabs and navigation links never look cramped, distorted, or wrap onto multiple lines:

```css
.nav-link, .tab-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  font-size: 14px;
  font-weight: 500;
  white-space: nowrap;
  border-radius: 9999px;
  text-decoration: none;
  transition: all 0.15s ease;
}
.nav-link.active, .tab-btn.active {
  background: #f3f4f6;
  color: #111827;
  font-weight: 600;
}
```

---

## 4. The 3-Section Page Architecture

```
┌────────────────────────────────────────────────────────────────────────┐
│  BÖLÜM 1: MINTLIFY HERO & MERKEZİ ARAMA ÇUBUĞU                         │
│  - Yumuşak pastel zümrüt radial glow arka plan                         │
│  - Üst duyuru hapı (Örn: "Alumni Summit 2026 Kayıtları Açıldı →")      │
│  - 64px modern ana başlık + nefes alan alt başlık                      │
│  - MERKEZİ BÜYÜK ARAMA ÇUBUĞU (🔍 İkon + Placeholder + ⌘K Rozeti)      │
│  - 2 Net Hap Buton (Mezun Rehberi & İlan Yayınla)                      │
└────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────┬───────────────────────────────┐
│  BÖLÜM 2: ÖNE ÇIKAN TEK BÜYÜK ETKİNLİK │  3 TEMİZ İSTATİSTİK KUTUSU    │
│  - "Öne Çıkan (Featured)" yeşil rozet  │  - Toplam Mezun               │
│  - Tarih, mekan ve konuşmacı bilgisi   │  - Aktif İlanlar              │
│  - Sade, okunaklı, tek bir büyük kart  │  - Başvuru Takibi             │
└────────────────────────────────────────┴───────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│  BÖLÜM 3: KATEGORİ SEKMELİ ÖNE ÇIKAN MEZUNLAR & FIRSATLAR              │
│  - Temiz kategori sekmeleri: [Tümü] [Mezunlar] [Kariyer] [Duyurular]   │
│  - Her kartta SADECE: Avatar, İsim/Başlık, Rozet, Kurum ve Tek İncele  │
│  - Aşırı metinden ve karmaşık kutulardan arındırılmış temiz 3'lü grid  │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 5. Central Search Bar Specification

- **Placement:** Positioned centrally in the Hero section, directly between the subtitle and action buttons.
- **Dimensions:** Width `100%`, `max-width: 600px`, `height: 52px`.
- **Styling:** White background, 1px border (`#e5e7eb`), soft diffuse shadow (`0 4px 20px rgba(0, 0, 0, 0.05)`), border-radius `14px` (`rounded-xl` / pill).
- **Interior:** Left magnifying glass (`🔍`), text placeholder (`Mezun adı, bölüm, şirket veya iş ilanı ara...`), right keyboard shortcut chip (`⌘K` or `Ctrl K`).

---

## 6. Curated Cards: Minimalist & Focused

Cards must not be overloaded with multi-paragraph text or excessive nested boxes. Each card holds only:
1. Avatar or Company Icon (Circular, 44px).
2. Title & Verified Badge.
3. Subtitle (Department, graduation year, or location).
4. Direct action link (`İncele &rarr;`).

---

*Last Updated: November 2026 · Alumni Tracking System Core Team*
