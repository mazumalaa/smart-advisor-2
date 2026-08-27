# PRD 2.0 Implementation Plan (mock up web/web statis)

## Goal

Implement the PRD 2.0 updates while preserving the existing application structure, visual language, and current workflows. The project is currently a Next.js prototype that uses mock data, so backend-dependent behavior must be isolated behind a clear data/service boundary.

## Scope Summary

- Add five selectable application themes.
- Add transaction time between transaction ID and date.
- Add sales-based AI suggestions in Forecast or Recommendations.
- Add a complete forgot-password user flow.
- Expand and improve the product category selector.

## Implementation Order

### Phase 0: Confirm Foundations (Complete, with backend decision pending)

- [x] Review the existing global styles and app layouts before changing theme tokens.
- [x] Confirm whether persistence is expected from the prototype. For the first pass, use browser persistence for UI preferences only.
- [ ] Decide the authentication and email provider required for a real password-reset flow.
- [ ] Define the transaction data contract used by both the table and AI suggestion logic.

### Phase 1: Shared Theme and Background Preferences (Implementation complete)

**Likely files:** `src/app/globals.css`, `src/app/layout.tsx`, `src/app/(app)/layout.tsx`, `src/app/(app)/settings/page.tsx`

- [x] Define shared CSS variables/tokens for the five themes:
  - [x] Base
  - [x] Dark
  - [x] Navy, marigold/gold, and cream
  - [x] Dark purple-indigo, mint/emerald, and white
  - [x] Coral/salmon, turquoise, and mustard
- [x] Add a client-side theme preference layer at the app layout boundary.
- [x] Apply the selected theme through a root data attribute or equivalent shared mechanism.
- [x] Persist the selected theme locally and restore it on reload/navigation.
- [x] Add theme selection controls to Settings.
- [ ] Validate contrast for headings, inputs, buttons, tables, cards, and navigation in all themes.
- [ ] Validate mobile behavior and avoid layout shifts while the preference loads.

### Phase 2: Transaction Time Data and Table

**Likely files:** `src/data/mockData.ts`, `src/app/(app)/transactions/page.tsx`

- [x] Add a `time` field to every existing mock transaction.
- [x] Capture the current time when a new transaction is created.
- [x] Add the `Time`/`Waktu` column immediately after `ID Transaksi` and before `Tanggal`.
- [x] Preserve existing sorting, searching, filtering, and table behavior.
- [x] Use one consistent display format, such as `14:30`.
- [x] Confirm transactions with missing or invalid time values have a readable fallback.

### Phase 3: Sales-Based AI Suggestions

**Likely files:** `src/data/mockData.ts`, `src/app/(app)/forecast/page.tsx`, `src/app/(app)/recommendations/page.tsx`, `src/components/recommendations/recommendation-card.tsx`

- [x] Define the input fields required for analysis: product, transaction date, transaction time, and quantity or product count.
- [x] Add enough representative mock transaction data to test product/time patterns.
- [x] Create a small analysis function/service that groups sales by product and time period.
- [x] Identify the strongest supported product and time window.
- [x] Generate a readable recommendation using the existing recommendation card or a focused Forecast section.
- [x] Include the product and time period in the suggestion when the data supports them.
- [x] Show a neutral “not enough data” state instead of inventing a pattern.
- [x] Keep the analysis logic separate from page rendering so a real AI/API service can replace the mock implementation later.
- [ ] Add loading, empty, and error states if the implementation becomes asynchronous.

### Phase 4: Forgot-Password Flow

**Likely files:** `src/app/login/page.tsx`, new recovery route under `src/app/`, shared UI components as needed

- [x] Replace the current `href="#"` link with a real forgot-password route.
- [x] Add an email entry form with validation.
- [x] Add a confirmation state that does not reveal whether an account exists.
- [ ] Add a reset-password route that accepts a secure, expiring reset token.
- [x] Add new-password and confirm-password fields with validation.
- [x] Add success and failure states, including an expired or invalid token state.
- [ ] Connect the flow to the selected authentication/email backend before calling it complete.
- [x] Avoid treating a client-only mock flow as production password recovery.

### Phase 5: Expanded Product Categories

**Likely files:** `src/app/(app)/products/page.tsx`, optionally `src/data/mockData.ts` or a shared constants file

- [x] Define the approximately 10 categories in one reusable constant:
  - [x] Makanan
  - [x] Minuman
  - [x] Pakaian dan Fashion
  - [x] Kecantikan dan Perawatan
  - [x] Rumah Tangga
  - [x] Elektronik
  - [x] Mainan
  - [x] Jasa
  - [x] Produk Digital
  - [x] Lainnya
- [x] Replace the native three-option select in Add New Product with a searchable category selector.
- [x] Keep the selected category visible and keyboard accessible.
- [x] Display categories in three columns with vertical scrolling for additional options.
- [x] Add an empty state when the search has no matching category.
- [x] Ensure the selector fits the modal and remains usable on small screens.
- [x] Preserve the existing default category and product-save behavior.

### Phase 6: Integration and Polish

- [x] Confirm Settings changes affect all authenticated application pages, not only Settings.
- [x] Confirm the new transaction time is available to AI analysis and visible in the table.
- [x] Confirm category selection saves the chosen value in the product table.
- [ ] Confirm AI suggestions update when the underlying transaction data changes.
- [ ] Check focus states, labels, keyboard navigation, and readable contrast.
- [ ] Check desktop, tablet, and mobile layouts.
- [x] Remove temporary alerts or mock success messages where real feedback is available.

## Verification Checklist

- [ ] Run `npm run lint`.
- [x] Run `npm run build`.
- [ ] Test each theme on Dashboard, Products, Transactions, Forecast, Recommendations, and Settings.
- [ ] Reload the app and confirm the selected theme/background persists.
- [ ] Add a transaction and confirm its time appears in the correct table position.
- [ ] Test AI suggestions with enough data and with insufficient data.
- [ ] Test forgot-password validation, success, invalid-token, and expired-token states.
- [ ] Search for categories, select a result, scroll the three-column list, and save a product.
- [ ] Test all changed flows at a mobile viewport.

## Definition of Done

The PRD acceptance criteria are met, changed flows work with the current prototype data model, the interface remains readable and responsive, and production-dependent behavior such as password recovery has a documented backend integration point rather than a misleading client-only implementation.
