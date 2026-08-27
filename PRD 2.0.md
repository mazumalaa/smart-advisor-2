# PRD 2.0 - Web Updates

## Background

After the team meeting, we agreed to update the web application with the features below. The existing functionality and visual language should remain unchanged unless a requirement below needs an adjustment.

## 1. Settings: Themes

Add five selectable themes in Settings so users can personalize the application:

1. Base theme
2. Dark theme
3. Navy tua with marigold/gold yellow and cream
4. Dark purple-indigo with mint/emerald accents and clean white
5. Bright coral/salmon with turquoise blue and mustard yellow

The selected theme should be applied consistently across the application and remain active when the user navigates between sections.

## 2. Settings: Custom Background

Allow users to set a custom background image. The image should have a light blur or softened treatment so it blends with the UI and does not reduce the readability of text, tables, or controls.

## 3. Transactions: Transaction Time

In the Transactions table, add a `Time` column between `ID` and `Date` to show the time at which each transaction occurred (`jam berapa transaksi terjadi`). Existing columns and table behavior should remain unchanged.

## 4. AI Forecast or Recommendations: Sales Suggestions

Add AI-generated suggestions to the AI Forecast or Recommendations section. The AI should analyze sales transaction data and provide practical, data-based recommendations.

Example:

> Berdasarkan data penjualan minggu ini, Produk A lebih sering terjual pada pagi hari antara jam A dan B. Saya menyarankan untuk memperbanyak stok Produk A pada jam tersebut.

Suggestions should be based on available transaction data, identify the relevant product and time period when possible, and avoid presenting unsupported conclusions when there is not enough data.

## 5. Settings: Forgot Password

Add a `Forgot password` flow for account recovery. Users should be able to request password-reset instructions from the login flow and create a new password through the provided recovery process.

## 6. Products: Expanded Categories

In Products > Add New Product, expand the Category options beyond the current `Makanan`, `Minuman`, and `Lainnya` categories to better support UMKM businesses.

Include approximately 10 categories, for example:

- Makanan
- Minuman
- Pakaian dan Fashion
- Kecantikan dan Perawatan
- Rumah Tangga
- Elektronik
- Mainan
- Jasa
- Produk Digital
- Lainnya

Add category search so users can quickly find an option without making the form difficult to use. The category selector should display three columns at a time, with the remaining options accessible through vertical scrolling. The layout must remain usable on smaller screens.

## Acceptance Criteria

- All five themes can be selected from Settings and are applied consistently.
- A custom background image can be set and remains visually subtle enough for the UI to stay readable.
- The Transactions table displays `Time` between `ID` and `Date`.
- AI suggestions use transaction sales data and communicate the product and relevant time period when supported by the data.
- Users can start and complete the forgot-password flow.
- Product categories include the expanded options, support search, and use a scrollable three-column layout without damaging the existing UI/UX.


