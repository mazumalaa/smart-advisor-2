# Architecture & Implementation Plan: Custom User Background System

## Executive Summary

This specification outlines the technical design, UI/UX workflow, and step-by-step implementation for the **Custom Background Image & Glassmorphism Theme System** in the UMKM Smart Advisor application.

Users will be able to upload custom background images or select from curated presets in the **Settings** page. The background will apply dynamically across all authenticated application routes (**Dashboard**, **Products**, **Transactions**, **Forecast**, **Recommendations**, and **Settings**), utilizing adjustable opacity, blur, and theme-aware overlays to ensure flawless UI legibility and contrast.

---

## 1. Objectives & Key Requirements

1. **User Customization**:
   - File upload interface supporting `.png`, `.jpg`, `.jpeg`, `.webp`, `.svg`.
   - Built-in curated preset backgrounds (e.g., subtle geometric patterns, soft gradients, business textures).
   - Adjustable background opacity slider (5% to 60%, default 15%) and optional background blur slider (0px to 20px).
   - Instant "Reset / Clear Background" button.

2. **Universal Application Across Pages**:
   - Applies seamlessly to Dashboard, Settings, Transactions, Products, Forecast, Recommendations.
   - Preserves high visual aesthetic with responsive background positioning (`cover`, `center`, `no-repeat`).

3. **Theme & Legibility Guarantee (Glassmorphism)**:
   - Dynamic theme overlay (Base, Dark, Navy+Gold, Indigo+Mint, Coral+Tosca) applied over custom background so image tones harmonize with the chosen theme.
   - Card surfaces and navigation bars upgraded with subtle translucency (`bg-surface/85` + `backdrop-blur-md`) so content remains crisp and accessible (WCAG AA compliant).

4. **Persistence & Performance**:
   - Store lightweight images/presets efficiently via client-side storage (IndexedDB fallback or optimized Data URL in `localStorage`).
   - Graceful hydration without flash of unstyled content (FOUC) or layout shift.

---

## 2. Technical Architecture & State Management

### 2.1 Extended Appearance Context (`appearance-provider.tsx`)

We will expand `AppearanceProvider` to manage both theme tokens and custom background state:

```typescript
export type BackgroundConfig = {
  type: 'none' | 'preset' | 'custom'
  url: string | null
  opacity: number // e.g. 0.05 to 0.60
  blur: number    // e.g. 0 to 20 (px)
  overlayTint: boolean // whether to blend with active theme background color
}

type AppearanceContextValue = {
  theme: ThemeId
  setTheme: (theme: ThemeId) => void
  background: BackgroundConfig
  setBackground: React.Dispatch<React.SetStateAction<BackgroundConfig>>
  uploadCustomBackground: (file: File) => Promise<void>
  clearBackground: () => void
}
```

### 2.2 CSS Variable Integration (`globals.css`)

We will introduce global CSS properties at `:root` managed by `AppearanceProvider`:

```css
:root {
  --bg-custom-image: none;
  --bg-custom-opacity: 0.15;
  --bg-custom-blur: 0px;
}

/* Base fixed background container */
#app-custom-background {
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  background-image: var(--bg-custom-image);
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  opacity: var(--bg-custom-opacity);
  filter: blur(var(--bg-custom-blur));
  transition: opacity 0.3s ease, filter 0.3s ease, background-image 0.3s ease;
}

/* Glassmorphism surface enhancements */
[data-custom-bg="true"] .bg-surface {
  background-color: color-mix(in srgb, var(--theme-surface) 85%, transparent);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}
```

---

## 3. UI/UX Design for Settings Page

The **Tampilan (Appearance)** section in `src/app/(app)/settings/page.tsx` will be expanded into a 2-column rich layout:

1. **Preset & Upload Control Card**:
   - **Preset Gallery**: Quick-select grid (e.g. Minimalist Pattern, Abstract Waves, Soft Bokeh, Warm Coffee).
   - **Custom Upload Box**: Drag-and-drop zone with file validation (max 5MB, auto-compression via `<canvas>` if needed).
   - **Opacity & Blur Controls**: Interactive range inputs with live percent readouts.
   - **Live Mini-Preview**: Card preview displaying sample UI text & badge on top of the configured background.
   - **Action Buttons**: `Simpan Preferensi` and `Hapus Background`.

---

## 4. File-by-File Implementation Breakdown

### 🛠️ Component 1: `src/components/layout/appearance-provider.tsx`
- Expand state to store `BackgroundConfig`.
- Add local storage persistence for `smart-advisor-background-config` and IndexedDB/DataURL for custom uploaded image.
- Inject inline CSS custom properties on `document.documentElement` (`--bg-custom-image`, `--bg-custom-opacity`, `--bg-custom-blur`).
- Set `data-custom-bg="true"` attribute on root when background is enabled.

### 🛠️ Component 2: `src/app/globals.css`
- Define CSS custom properties defaults.
- Add utility styling for `#app-custom-background` layer.
- Add translucent glassmorphic styling for cards, tables, and top/side navigation when `data-custom-bg="true"`.

### 🛠️ Component 3: `src/app/(app)/layout.tsx`
- Insert `<div id="app-custom-background" aria-hidden="true" />` beneath main container.
- Ensure z-index layering (`z-0` background, `z-10` layout/sidebar/main content).

### 🛠️ Component 4: `src/app/(app)/settings/page.tsx`
- Build Background Customizer UI:
  - Preset Selector
  - Drag-and-Drop Image Uploader
  - Opacity Slider (5% – 60%)
  - Blur Slider (0px – 20px)
  - Live Interactive UI Preview Box
  - Reset / Remove Background Button

### 🛠️ Component 5: Card & Container Refinements
- Update `src/components/ui/card.tsx` to support translucent glass background variant when custom background is enabled.

---

## 5. Edge Cases & Reliability Checklist

- [x] **High Resolution / Large Images**: Automatically resize/compress images in browser canvas before saving to prevent memory or local storage overflow.
- [x] **Theme Switch Compatibility**: Ensure dark and light themes tint properly over dark/light custom images.
- [x] **Accessibility & Contrast**: Enforce minimum card surface opacity (never below 75%) so card text maintains WCAG 4.5:1 contrast ratio.
- [x] **Mobile Responsiveness**: Verify touch support for file upload and sliders on mobile viewports.
- [x] **Clear / Reset State**: One-click restore to clean default background.

---

## 6. Execution & Verification Steps

1. **Build & Typecheck**:
   ```bash
   npm run lint
   npm run build
   ```
2. **Visual Inspection**:
   - Verify Settings upload and preset picker.
   - Confirm background renders on Dashboard, Products, Transactions, Forecast, Recommendations.
   - Test opacity slider adjustments in real-time.
   - Switch between all 5 themes to confirm proper color blending and readability.