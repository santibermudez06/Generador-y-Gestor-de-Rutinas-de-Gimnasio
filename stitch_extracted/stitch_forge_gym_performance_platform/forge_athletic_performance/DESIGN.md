---
name: Forge Athletic Performance
colors:
  surface: '#121413'
  surface-dim: '#121413'
  surface-bright: '#383a38'
  surface-container-lowest: '#0d0f0e'
  surface-container-low: '#1a1c1b'
  surface-container: '#1e201f'
  surface-container-high: '#282a29'
  surface-container-highest: '#333534'
  on-surface: '#e2e3e0'
  on-surface-variant: '#c3caac'
  inverse-surface: '#e2e3e0'
  inverse-on-surface: '#2f312f'
  outline: '#8d9479'
  outline-variant: '#434933'
  surface-tint: '#a6d700'
  primary: '#ffffff'
  on-primary: '#273500'
  primary-container: '#bef500'
  on-primary-container: '#536d00'
  inverse-primary: '#4e6700'
  secondary: '#aadd2f'
  on-secondary: '#263500'
  secondary-container: '#90c003'
  on-secondary-container: '#354a00'
  tertiary: '#ffffff'
  on-tertiary: '#68000d'
  tertiary-container: '#ffdad7'
  on-tertiary-container: '#bc2c32'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#bef500'
  primary-fixed-dim: '#a6d700'
  on-primary-fixed: '#151f00'
  on-primary-fixed-variant: '#3a4d00'
  secondary-fixed: '#c0f446'
  secondary-fixed-dim: '#a5d729'
  on-secondary-fixed: '#141f00'
  on-secondary-fixed-variant: '#384e00'
  tertiary-fixed: '#ffdad7'
  tertiary-fixed-dim: '#ffb3af'
  on-tertiary-fixed: '#410005'
  on-tertiary-fixed-variant: '#910519'
  background: '#121413'
  on-background: '#e2e3e0'
  surface-variant: '#333534'
typography:
  display-xl:
    fontFamily: Barlow Condensed
    fontSize: 72px
    fontWeight: '700'
    lineHeight: 72px
    letterSpacing: 0.02em
  display-xl-mobile:
    fontFamily: Barlow Condensed
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 48px
    letterSpacing: 0.02em
  display-lg:
    fontFamily: Barlow Condensed
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 52px
    letterSpacing: 0.02em
  display-lg-mobile:
    fontFamily: Barlow Condensed
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: 0.02em
  headline-lg:
    fontFamily: Barlow Condensed
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 36px
    letterSpacing: 0.03em
  headline-md:
    fontFamily: Barlow Condensed
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: 0.03em
  headline-sm:
    fontFamily: Barlow Condensed
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 24px
    letterSpacing: 0.04em
  metric-val:
    fontFamily: Barlow Condensed
    fontSize: 40px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 15px
    fontWeight: '400'
    lineHeight: 22px
  body-sm:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 18px
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.08em
  label-sm:
    fontFamily: Inter
    fontSize: 10px
    fontWeight: '700'
    lineHeight: 14px
    letterSpacing: 0.12em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  gutter: 1rem
  gutter-mobile: 0.75rem
  margin: 2rem
  margin-mobile: 1rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.5rem
---

## Brand & Style

This design system embodies high-output athletic conditioning and telemetry-driven physical performance. Built for competitive athletes, strength coaches, and data-focused fitness practitioners, the interface operates like precision cockpit instrumentation.

The design movement blends **High-Contrast Athletic Brutalism** with **Engineered Minimalist Telemetry**. Visual impact comes from sharp structural density, dark obsidian layers, technical hairline dividers, and electric chromatic accents that signal urgency, velocity, and readiness. It rejects decorative bloat, soft consumer gradients, and skeuomorphic weight textures in favor of clean digital readouts, industrial condensed typography, and unambiguous contrast.

## Colors

The palette relies on absolute darkness paired with hyper-saturated chromatic triggers:

- **Primary Accent (`#C6FF00`):** Electric Volt Lime. Reserved strictly for primary calls-to-action, active workout states, PR achievements, peak strain indicators, and live session timers.
- **Secondary Accent (`#8FBF00`):** Low-voltage olive/lime. Applied to secondary progress metrics, sub-targets, and stabilized baseline data.
- **Alert / Strain Max (`#FF5D5D`):** Kinetic Coral. Indicates cardiac threshold exceedance, form failures, fatigue warnings, and destructive actions.
- **Background Core (`#090B0A`):** Deep obsidian abyss, grounding the display with zero visual glare in low-light gym conditions.
- **Surface Layer 1 (`#121512`):** Primary structural panels, sheets, and elevated metric containers.
- **Surface Layer 2 (`#1B201B`):** Secondary cards, nested workout set blocks, and inactive input troughs.
- **Borders & Dividers (`#292F29`):** Hairline precision strokes establishing sharp data boundaries.
- **Text Primary (`#F5F7F2`):** Pure chalk white for primary readouts, reps, load metrics, and display headlines.
- **Text Technical (`#969D96`):** Calibrated muted gray for units (kg, lbs, rpm), micro-labels, timestamps, and secondary labels.

## Typography

The typographic hierarchy relies on a dual-engine architecture:

1. **Barlow Condensed** provides high-velocity, athletic impact. It is used for all section headlines, display telemetry, large numerical scoreboards, and lift readouts. Display titles and metric figures should always be rendered uppercase or tabular to maximize structural punch.
2. **Inter** acts as the high-legibility telemetry engine. It ensures rapid parsing under extreme physical exertion. It powers body copy, form labels, parameter descriptors, and metadata badges.

All unit annotations (e.g., `KG`, `RPE`, `BPM`, `SEC`) should use `label-sm` set to uppercase tracking to keep focus on the core values.

## Layout & Spacing

The layout is built on a tight, structured 12-column grid on desktop, collapsing to 6 columns on tablet and 4 columns on mobile. 

- **Grid Rhythms:** Vertical and horizontal rhythm is constrained to strict multiples of 4px and 8px. Compact spacing increases data density, letting athletes see entire workout regimes, velocity metrics, and set splits without excessive scrolling.
- **Form Factors:** On mobile, margins drop to `1rem` to maximize horizontal real estate for rep charts and tabular set counters. Interactive buttons and touch zones must maintain a minimum bounding height of 48px to accommodate chalked or moving hands.
- **Section Grouping:** Functional zones are partitioned using continuous border tracks (`#292F29`) rather than empty whitespace gaps, maintaining high mechanical density.

## Elevation & Depth

This system avoids soft, floating elevation shadows. Depth is communicated strictly via **Tonal Planar Stacking** and **Hairline Outlines**:

- **Ground Level (`#090B0A`):** The primary view layer and canvas.
- **Elevated Planar Panels (`#121512`):** Primary UI regions bounded by a crisp 1px stroke of `#292F29`.
- **Interactive Recesses & Sub-Cards (`#1B201B`):** Slotted data rows, active inputs, and set logs.
- **Target Glow:** Focused elements or active record indicators project a razor-sharp 1px border of `#C6FF00` paired with an electric neon drop shadow (`0 0 16px rgba(198, 255, 0, 0.25)`). All other drop shadows are excluded.

## Shapes

The design uses an intentional, precision-machined shape language defined by `roundedness: 1`:

- Standard components (buttons, cards, metric panels, inputs) adopt an exact `0.25rem` (4px) corner radius.
- Macro containers and bottom modal sheets scale to `0.5rem` (`rounded-lg`).
- Elements must never be fully pill-shaped or soft-rounded; they must feel chiseled, industrial, and calibrated like performance equipment.

## Components

### Buttons
- **Primary Action:** Solid `#C6FF00` background with `#090B0A` text, 4px corner radius, font `Barlow Condensed` (SemiBold, uppercase, tracking `0.05em`). Hover/active states trigger a micro-compression scale (0.98) and border illumination.
- **Secondary Action:** Transparent background with `#292F29` border, `#F5F7F2` text, shifting to a solid `#1B201B` fill on hover.
- **Destructive/Abort:** Outlined in `#FF5D5D` with `#FF5D5D` text; shifts to solid fill upon active hold state.

### Telemetry Cards & Metric Blocks
- Built on `#121512` with a 1px border of `#292F29`. 
- Metric values use `metric-val` in `#F5F7F2`, accented by a leading vertical status bar (2px width) indicating zone intensity (Electric Lime for optimal, Coral for peak strain).

### Input Fields & Set Trackers
- Background `#1B201B`, border `#292F29`, text `#F5F7F2`.
- Focus state instantly snaps border to `#C6FF00` with zero transition lag. Numerical input typography defaults to tabular spacing.

### Badges & Telemetry Chips
- Compact, flat, non-pill tags with 2px corner radius. Dark tinted backgrounds (e.g., `rgba(198, 255, 0, 0.12)`) paired with high-contrast text (`#C6FF00`).

### Checkboxes & Segmented Selectors
- Rigid, 4px-radius square toggles. Selected states fill with solid `#C6FF00` displaying a pure black `#090B0A` checkmark.
- Segmented switches sit on a recessed track (`#090B0A`), sliding a sharp `#1B201B` indicator panel bordered in `#C6FF00`.

### Domain-Specific Components: Set & Rep Matrix
- Tabular logs with alternating row accents using `#121512` and `#161B16`.
- Includes instant one-tap completion triggers, automated rest-timer progress bars running directly on card borders via `#C6FF00`, and inline RPE (Rate of Perceived Exertion) dial readouts.