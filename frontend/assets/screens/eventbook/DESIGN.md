---
name: EventBook
colors:
  surface: '#f7f9fb'
  surface-dim: '#d8dadc'
  surface-bright: '#f7f9fb'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f4f6'
  surface-container: '#eceef0'
  surface-container-high: '#e6e8ea'
  surface-container-highest: '#e0e3e5'
  on-surface: '#191c1e'
  on-surface-variant: '#464555'
  inverse-surface: '#2d3133'
  inverse-on-surface: '#eff1f3'
  outline: '#777587'
  outline-variant: '#c7c4d8'
  surface-tint: '#4d44e3'
  primary: '#3525cd'
  on-primary: '#ffffff'
  primary-container: '#4f46e5'
  on-primary-container: '#dad7ff'
  inverse-primary: '#c3c0ff'
  secondary: '#565e74'
  on-secondary: '#ffffff'
  secondary-container: '#dae2fd'
  on-secondary-container: '#5c647a'
  tertiary: '#005338'
  on-tertiary: '#ffffff'
  tertiary-container: '#006e4c'
  on-tertiary-container: '#7df1bd'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e2dfff'
  primary-fixed-dim: '#c3c0ff'
  on-primary-fixed: '#0f0069'
  on-primary-fixed-variant: '#3323cc'
  secondary-fixed: '#dae2fd'
  secondary-fixed-dim: '#bec6e0'
  on-secondary-fixed: '#131b2e'
  on-secondary-fixed-variant: '#3f465c'
  tertiary-fixed: '#85f8c4'
  tertiary-fixed-dim: '#68dba9'
  on-tertiary-fixed: '#002114'
  on-tertiary-fixed-variant: '#005137'
  background: '#f7f9fb'
  on-background: '#191c1e'
  surface-variant: '#e0e3e5'
typography:
  display-hero:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '800'
    lineHeight: 56px
    letterSpacing: -0.025em
  display-hero-mobile:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '800'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
    letterSpacing: -0.015em
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.015em
  headline-sm:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: -0.01em
  title-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 24px
    letterSpacing: -0.005em
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 26px
    letterSpacing: 0em
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 22px
    letterSpacing: 0em
  body-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 18px
    letterSpacing: 0.005em
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
    letterSpacing: 0em
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.02em
  badge:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '600'
    lineHeight: 14px
    letterSpacing: 0.04em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1.5rem
  gutter-mobile: 1rem
  margin: 2rem
  margin-mobile: 1rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2rem
---

## Brand & Style
The design system embodies a modern, approachable, and friction-free event discovery and ticketing experience. It targets event organizers, attendees, and cultural enthusiasts who value speed, clarity, and reliability when browsing schedules, choosing seats, and completing checkouts.

The design movement is **Corporate / Modern** infused with warm, friendly product minimalism. High visual clarity is achieved through pure white modular cards placed atop an ultra-soft cool slate canvas. Precise micro-typography, thoughtful density, and direct functional affordances ensure users can parse venue capacities, schedules, and pricing tiers effortlessly without visual fatigue.

## Colors
The palette balances an energetic digital indigo against a structural slate foundation and clear semantic availability indicators.

### Palette Architecture
- **Primary Canvas**: `#F8FAFC` (Slate 50) serves as the full-viewport background, creating gentle separation for elevated white surfaces.
- **Surface Elevation**: `#FFFFFF` (Pure White) applied exclusively to interactive cards, modals, sticky summary bars, and floating controls.
- **Primary Accent**: `#4F46E5` (Indigo 600) for primary checkout CTAs, selected tabs, progress bars, and active focus rings. Interacts via `#4338CA` (Indigo 700) on hover and active states.
- **Secondary Accent**: `#0F172A` (Slate 900) for high-contrast header anchors, key metric counters, and stark inverted badges.
- **Borders & Dividers**: Structural boundaries utilize `#E2E8F0` (Slate 200). Subtle inner dividers use `#F1F5F9` (Slate 100).
- **Text Hierarchy**:
  - Headings & Titles: `#0F172A` (Slate 900)
  - Body Copy & Primary Data: `#475569` (Slate 600)
  - Muted Captions, Metadata, Icons: `#94A3B8` (Slate 400)
  - Disabled Elements: `#CBD5E1` (Slate 300)

### Availability & Feedback System
- **Plenty Left (Success)**: Text & Border `#059669` (Emerald 600), Tint Background `#ECFDF5` (Emerald 50).
- **Few Left (Warning)**: Text & Border `#D97706` (Amber 600), Tint Background `#FEF3C7` (Amber 50).
- **Sold Out (Destructive)**: Text & Border `#DC2626` (Red 600), Tint Background `#FEE2E2` (Red 50).
- **Informational Note**: Text `#2563EB` (Blue 600), Background `#EFF6FF` (Blue 50).

## Typography
The system uses **Inter** across all typographical roles. Variable font weights (400, 500, 600, 700, 800) supply clear structural hierarchy across deep event schedules, seating matrices, and checkout breakdowns.

- **Display & Headlines**: Tighter negative tracking (`-0.025em` to `-0.01em`) ensures titles and event names stay crisp and compact.
- **Labels & Badges**: Small metadata, status tags, and seating codes employ semi-bold to bold weights with neutral or slightly expanded tracking (`+0.02em` to `+0.04em`) to maintain legibility at 11–12px.
- **Numeric Data**: Tabular numerals (`font-feature-settings: "tnum"`) must be activated for ticket pricing tables, countdown timers, seat availability counters, and checkout tallies.

## Layout & Spacing
The layout relies on a 12-column responsive fluid grid anchored by max-width containers of 1280px (standard content) and 1440px (event discovery feeds).

### Grid & Breakpoints
- **Desktop (1024px and above)**: 12 columns, 24px (`1.5rem`) gutter, 32px (`2rem`) horizontal page margin. Standard layout allocates 8 columns to the main interactive event feed/seating plan and 4 columns to the sticky checkout/summary sidebar.
- **Tablet (768px to 1023px)**: 8 columns, 20px gutter, 24px page margin. Sticky sidebars collapse into a floating bottom sheet or dock to the base of the page.
- **Mobile (below 768px)**: 4 columns, 16px (`1rem`) gutter, 16px (`1rem`) page margin. Multi-column cards stack vertically into a unified vertical flow.

### Spacing Scale
- `space-xs` (4px): Micro-gaps between badge status dots and text labels; checkbox/radio label alignment.
- `space-sm` (8px): Gaps between form labels and inputs; chip group spacing; tag clusters.
- `space-md` (16px): Internal padding for standard table cells, text input containers, and compact list items.
- `space-lg` (24px): Padding for cards, modular blocks, modal bodies, and ticket tiers.
- `space-xl` (32px): Vertical separation between primary layout sections, headers, and footer blocks.

## Elevation & Depth
Depth in this system is deliberately restrained, using crisp hairline boundaries (`#E2E8F0`) reinforced by featherweight, cool-tinted slate shadows. Surfaces never look floating or disconnected; they remain grounded, clean, and tactile.

- **Level 0 (Flat Canvas)**: `#F8FAFC`. Background layer across all pages.
- **Level 1 (Card & Section Elevation)**: Pure `#FFFFFF` fill with a `1px solid #E2E8F0` border and `box-shadow: 0 1px 2px 0 rgba(15, 23, 42, 0.05)`. Used for event cards, data tables, and input groupings.
- **Level 1 Hover (Interactive State)**: `box-shadow: 0 4px 6px -1px rgba(15, 23, 42, 0.08), 0 2px 4px -2px rgba(15, 23, 42, 0.04)` combined with border color shifting to `#CBD5E1`.
- **Level 2 (Sticky Elements & Dropdowns)**: Pure `#FFFFFF` with `1px solid #E2E8F0` and `box-shadow: 0 10px 15px -3px rgba(15, 23, 42, 0.08), 0 4px 6px -4px rgba(15, 23, 42, 0.03)`. Used for sticky booking summary cards and filter flyouts.
- **Level 3 (Modals & Overlays)**: Pure `#FFFFFF` surface with `box-shadow: 0 20px 25px -5px rgba(15, 23, 42, 0.1), 0 8px 10px -6px rgba(15, 23, 42, 0.04)`. Supported by a modal backdrop scrim of `#0F172A` at 40% opacity with a `4px` blur filter.

## Shapes
A unified radius of **12px** (`rounded-xl` in default tokenization) acts as the signature cornerstone across cards, modals, and sticky containers.

- **Containers & Cards (`12px`)**: Applied to all structural event cards, venue preview blocks, checkout sidebars, modal windows, and data table envelopes.
- **Interactive Controls (`8px` / `0.5rem`)**: Form inputs, standard buttons, tabs, dropdown selectors, and table headers use an 8px radius to keep smaller elements sharp and structurally tight.
- **Pills & Status Badges (`9999px`)**: Seat availability indicators, filter category tags, category chips, and live notification pulses adopt full pill borders for contrast against rectilinear card blocks.

## Components

### Buttons
- **Primary**: Solid `#4F46E5` fill, `#FFFFFF` text, 8px border radius, font weight 600. Hover: `#4338CA`. Active: `#3730A3`. Focus ring: 2px offset with 2px solid `#4F46E5`.
- **Secondary / Outline**: `#FFFFFF` background, `1px solid #E2E8F0`, `#0F172A` text. Hover: `#F8FAFC` background with border `#CBD5E1`.
- **Ghost / Tertiary**: Transparent background, `#475569` text. Hover: `#F1F5F9` background, `#0F172A` text.
- **Sizes**: 
  - Large (Checkout CTA): 48px height, 16px typography, 20px horizontal padding.
  - Medium (Standard): 40px height, 14px typography, 16px horizontal padding.
  - Small (Table Actions): 32px height, 12px typography, 12px horizontal padding.

### Seat Availability Badges
- **Shared Specs**: Full pill radius (`9999px`), 4px vertical / 10px horizontal padding, 11px font size, font weight 600, uppercase or sentence case, inline-flex with a 6px centered status dot.
- **Plenty Left**: Text `#059669`, background `#ECFDF5`, border `1px solid #A7F3D0`. Status dot `#059669`.
- **Few Left**: Text `#D97706`, background `#FEF3C7`, border `1px solid #FDE68A`. Status dot `#D97706`.
- **Sold Out**: Text `#DC2626`, background `#FEE2E2`, border `1px solid #FECACA`. Status dot `#DC2626`.

### Form Inputs & Selectors
- **Container**: 42px height, pure `#FFFFFF` background, `1px solid #E2E8F0` border, 8px border radius, 14px text in `#0F172A`.
- **Placeholder**: `#94A3B8`.
- **Focus**: Border color `#4F46E5`, box-shadow `0 0 0 3px rgba(79, 70, 229, 0.15)`.
- **Error State**: Border color `#DC2626`, box-shadow `0 0 0 3px rgba(220, 38, 38, 0.15)`.

### Cards & Sticky Sidebar Cards
- **Event Card**: Pure `#FFFFFF` surface, 12px radius, `1px solid #E2E8F0`, 24px inner padding, `shadow-sm`. Includes aspect-ratio locked media container with an 8px nested radius.
- **Sticky Sidebar (Booking Summary)**: Position `sticky`, top offset `24px`, `#FFFFFF` surface, 12px radius, `1px solid #E2E8F0`, `shadow-sm`. Features top breakdown panel, subtotal/tax rows with dotted dividers, and full-width Primary CTA.

### Data Tables (Schedules & Pricing Tiers)
- **Container**: Border `1px solid #E2E8F0`, 12px radius, overflow hidden.
- **Header**: `#F8FAFC` background, 12px semi-bold `#475569` text, letter-spacing `0.04em`, 12px vertical / 16px horizontal padding, border bottom `1px solid #E2E8F0`.
- **Row**: Background `#FFFFFF`, border bottom `1px solid #F1F5F9`. Hover state `#F8FAFC`. 14px body text with numbers aligned right using tabular figures.

### Navigation Tabs
- **Segmented / Underline**: Clean horizontal arrangement. Active tab has `#4F46E5` text and a 2px bottom indicator line in `#4F46E5`. Inactive tabs use `#475569` text and transition to `#0F172A` on hover.

### Modals
- **Frame**: Centered, max-width 560px, 12px radius, pure `#FFFFFF`, Level 3 elevation. Header with title and cross-dismiss button, 24px padding throughout, footer with right-aligned action buttons on `#F8FAFC` background separated by `#E2E8F0` top border.

### Loading Skeleton States
- Base color `#F1F5F9` with a smooth horizontal shimmer highlight in `#E2E8F0`. Matching border radius: 12px for card frames, 8px for button/input placeholders, and 4px for line text placeholders.