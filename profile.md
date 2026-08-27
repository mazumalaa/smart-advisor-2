# Profile Page & Notification Page Specification

## 1. Overview

This project needs a dedicated profile management page and a notification center to make user account information and business information easier to access and manage. The profile section must contain both personal owner information and business information so the user no longer has to rely on the settings page for these critical details.

The profile page will serve as the main user dashboard for identity, business ownership, and account personalization, while the notification page will centralize all system and business alerts in a single place.

---

## 2. Goals

1. Provide a dedicated Profile page where users can view and update their personal and business information.
2. Restore owner profile and business information access that was previously removed from settings.
3. Allow users to customize their profile photo.
4. Centralize all notifications into one page with readability and filter support.
5. Improve usability, trust, and professionalism for the application.

---

## 3. User Needs

### 3.1 Personal profile information
Users need to manage and view:
- Full name
- Email address
- Phone number
- Address
- Profile photo

### 3.2 Business profile information
Users need to manage and view:
- Business name
- Business type / category
- Business address
- Owner name
- Contact information
- Business logo or profile image

### 3.3 Notification information
Users need to see:
- New orders and transactions
- Inventory alerts
- Low stock warnings
- Sales or revenue updates
- Payment status
- Recommendation notifications
- System reminders
- Security or account updates

---

## 4. Main Features

## 4.1 Profile Page

The Profile page is a dedicated section in the application. It should include the following areas:

### A. Profile Header
- Profile photo or avatar
- User name
- Business name
- Status indicator (active / verified / online)
- Edit profile button

### B. Profile Information Section
Fields required:
- Full Name
- Email
- Phone Number
- Address

Additional optional fields:
- Date of birth
- Gender
- Social media contact
- Preferred language

### C. Business Information Section
Fields required:
- Business Name
- Business Type
- Business Address
- Owner Name
- Phone Number
- Email

Optional fields:
- Website
- Business description
- Business hours
- Tax ID / NPWP
- City / region

### D. Profile Photo Customization
The user should be able to:
- Upload a profile picture
- Replace the current profile picture
- Remove the current photo and use the default avatar
- Preview image before saving

Supported file types:
- JPG
- PNG
- WEBP

Recommended limits:
- Max upload size: 2MB to 5MB
- Image resolution: auto crop / fit to profile circle

### E. Save / Cancel Actions
- Save profile changes
- Save business information
- Cancel edits
- Show success message after saving

---

## 4.2 Settings Page Update

The profile and business information that previously existed in settings should be moved or duplicated into the Profile page so users can access them from a more logical and dedicated location.

Recommended behavior:
- Settings page remains for application configuration such as theme, appearance, notifications preferences, and background settings.
- Profile page handles user and business identity information.
- Remove redundant duplicates from settings to keep the interface clean.

---

## 4.3 Notification Page

The Notification page should function as a central hub for all incoming updates and alerts.

### Notification categories
- Transaction notifications
- Inventory notifications
- Sales notifications
- Payment notifications
- Recommendation notifications
- System notifications
- Security notifications

### Notification fields
Each notification item should include:
- Title
- Description
- Category
- Time / date
- Read / unread status
- Priority indicator

### Notification actions
- Mark as read
- Mark all as read
- Delete notification
- Filter by category
- Filter by unread only
- Open notification detail if needed

### Example notification list
- Low stock alert: "Coffe Beans remaining 12 packs"
- Sales update: "Revenue increased 18% compared to yesterday"
- Payment status: "Invoice #INV-1024 has been paid"
- Recommendation: "Your inventory forecast suggests increasing supply for product A"
- System update: "New recommendations feature is available"

---

## 5. UI/UX Requirements

### Layout
- Profile page should use a clean card-based layout.
- Personal info and business info should be grouped into separate cards for clarity.
- Profile header should be visually prominent at the top.
- Notification page should use a list layout with filter controls and action buttons.

### Visual design
- Use modern and professional styling
- Keep spacing consistent with dashboard style
- Use strong labels and readable typography
- Highlight required fields with validation messages

### Mobile responsiveness
- Profile page must work well on tablet and mobile
- Forms should stack properly on smaller screens
- Image upload must be easy to access on mobile devices

---

## 6. Functional Requirements

### Profile page requirements
1. User can view existing profile information.
2. User can edit full name, email, phone, and address.
3. User can update business information.
4. User can upload and replace profile photo.
5. User can save the changes successfully.
6. Validation prevents invalid email or phone fields.
7. System should show a confirmation notification after saving.

### Notification page requirements
1. Notification list loads from available data or mock data.
2. Items can be marked as read or unread.
3. User can filter notifications by category.
4. User can see unread count.
5. Notification page supports empty state when there are no notifications.

---

## 7. Data Structure Example

```ts
type ProfileData = {
  fullName: string
  email: string
  phone: string
  address: string
  profilePhoto?: string
}

type BusinessData = {
  businessName: string
  businessType: string
  businessAddress: string
  ownerName: string
  businessPhone: string
  businessEmail: string
  logo?: string
}

type NotificationItem = {
  id: string
  title: string
  description: string
  category: 'transaction' | 'inventory' | 'sales' | 'system' | 'payment' | 'recommendation'
  createdAt: string
  isRead: boolean
  priority: 'low' | 'medium' | 'high'
}
```

---

## 8. Acceptance Criteria

### Profile page
- [ ] A dedicated profile page exists.
- [ ] Personal info can be viewed and updated.
- [ ] Business info can be viewed and updated.
- [ ] Profile photo can be uploaded and changed.
- [ ] The UI is accessible from the main navigation or user menu.
- [ ] Profile information is no longer missing from the application's user flow.

### Notification page
- [ ] Notification page exists and displays all relevant notification items.
- [ ] Each item contains title, description, date, and read status.
- [ ] Users can mark notifications as read.
- [ ] Users can filter notifications.
- [ ] Empty-state handling is implemented when there are no notifications.

---

## 9. Implementation Plan

## 9.1 Project Goal

Build the new profile and notification functionality in a way that matches the existing app structure, uses the current design system, and can be extended later to connect with a real backend or API.

---

## 9.2 Implementation Scope

### A. Profile Page
- Create a dedicated route at `/profile`
- Display owner profile information and business information in separate sections
- Add profile photo upload and preview
- Add edit/save actions for user and business data
- Reuse existing `Card`, `Input`, `Button`, and avatar styling patterns

### B. Notification Page
- Create a dedicated route at `/notifications`
- Display notifications in a list/table format
- Include filters and unread status
- Allow users to mark items as read
- Support empty states and sorting by recency

### C. Navigation Update
- Add links to the new pages in sidebar or top navigation
- Ensure users can access these pages from the main app flow

### D. Settings Page Cleanup
- Move or simplify owner/business info forms from settings
- Keep settings focused on visual customization and app preferences

---








## 9.3 Feature Breakdown by Phase

### Phase 1: Foundation and Page Setup

Tasks:
1. Create the profile route in the app structure.
2. Create the notifications route in the app structure.
3. Add navigation entries for both pages.
4. Add mock data for profile and notifications in `src/data/mockData.ts`.
5. Confirm app layout and spacing match the dashboard style.

Expected output:
- Users can open `/profile` and `/notifications` from the UI.
- The pages render with placeholder data and correct layout.

### Phase 2: Profile Page Build

Tasks:
1. Add profile header with avatar, name, and business name.
2. Create a profile information card with:
   - full name
   - email
   - phone number
   - address
3. Create a business information card with:
   - business name
   - business type
   - business address
   - owner name
   - business phone
   - business email
4. Add upload field for profile photo and preview before save.
5. Add Save and Cancel actions.
6. Add validation for required fields and email format.

Expected output:
- Users can view and edit all personal and business profile details.
- The profile photo can be replaced and previewed.

### Phase 3: Notifications Page Build

Tasks:
1. Create a notifications page with a header and summary stats.
2. Display cards or rows for each notification item.
3. Add category filters and unread-only filter.
4. Add action buttons such as:
   - Mark as read
   - Mark all as read
   - Delete
5. Add unread count indicator.
6. Add empty state layout when no notifications exist.

Expected output:
- The notification page feels like a central inbox.
- Users can process notifications quickly.

### Phase 4: Settings Cleanup and UX Polish

Tasks:
1. Remove duplicate owner/business form sections from settings if they are no longer needed.
2. Keep appearance and theme controls in settings.
3. Improve spacing and responsiveness.
4. Add success messages after save.
5. Add loading or disabled states for save and upload actions.

Expected output:
- Settings page becomes focused on app configuration.
- Profile page becomes the main access point for user identity details.

---

## 9.4 File Structure Recommendation

Suggested file additions and changes:

- `src/app/(app)/profile/page.tsx`
  - Main profile page layout
- `src/app/(app)/notifications/page.tsx`
  - Main notification page layout
- `src/data/mockData.ts`
  - Add `profileData`, `businessData`, and `notifications` mock objects
- `src/components/layout/sidebar.tsx`
  - Add navigation items for Profile and Notifications
- `src/components/ui/avatar.tsx`
  - Reuse for profile image rendering
- `src/components/ui/card.tsx`
  - Reuse standard card styling

Optional future additions:
- `src/components/profile/profile-form.tsx`
- `src/components/profile/business-form.tsx`
- `src/components/notifications/notification-list.tsx`
- `src/components/notifications/notification-filter.tsx`

---

## 9.5 Data Model for Implementation

```ts
export const profileData = {
  fullName: "Andi Pratama",
  email: "andi@kopisenja.com",
  phone: "+628123456789",
  address: "Jl. Merdeka No. 12, Bandung",
  profilePhoto: "/images/profile.jpg",
}

export const businessData = {
  businessName: "Kopi Senja",
  businessType: "Coffee Shop",
  businessAddress: "Jl. Merdeka No. 12, Bandung",
  ownerName: "Andi Pratama",
  businessPhone: "+628123456789",
  businessEmail: "hello@kopisenja.com",
  logo: "/images/logo.jpg",
}

export const notifications = [
  {
    id: "N001",
    title: "Low Stock Alert",
    description: "Kopi Susu tersisa 12 unit.",
    category: "inventory",
    createdAt: "2026-08-27T09:00:00",
    isRead: false,
    priority: "high",
  },
  {
    id: "N002",
    title: "Sales Update",
    description: "Pendapatan naik 18% dibanding kemarin.",
    category: "sales",
    createdAt: "2026-08-27T08:30:00",
    isRead: true,
    priority: "medium",
  },
]
```

---

## 9.6 Development Checklist

### Functional checklist
- [ ] Profile page route is created
- [ ] Notification page route is created
- [ ] Sidebar links are added
- [ ] Owner and business data appear on profile page
- [ ] Profile photo upload works
- [ ] Save action works with form state
- [ ] Validation is applied to email and required fields
- [ ] Notification list is displayed
- [ ] Mark as read works
- [ ] Filters work correctly
- [ ] Empty state appears when no notifications exist

### UX checklist
- [ ] Page is responsive on desktop and mobile
- [ ] Cards have clean spacing and hierarchy
- [ ] Buttons and actions are easy to use
- [ ] Color and typography match app theme
- [ ] Save actions provide confirmation feedback

---

## 9.7 Implementation Priority

Priority 1:
- Create profile page
- Add business and owner details
- Add profile photo upload

Priority 2:
- Create notification page
- Add unread count and filters
- Add mark-as-read interactions

Priority 3:
- Clean up settings page
- Refine responsive behavior
- Add final polish and validation

---

## 9.8 Completion Target

The feature is considered complete when:
- users can access and update their profile information from a dedicated page,
- business information is available again without relying on settings,
- profile photo customization works correctly,
- notifications are visible and manageable in one page,
- and the overall experience is consistent with the application design system.

This implementation plan gives a clear path for building the full feature without missing the required profile and notification flows.

---

## 9. Recommended Implementation Notes

1. Use a dedicated route such as `/profile`.
2. Add a navigation link to the Profile page in top navigation or sidebar.
3. Reuse existing UI components such as cards, inputs, buttons, and avatar styling.
4. Add local mock data first, then integrate with real backend data later.
5. Use validation on forms for email, phone number, and required fields.
6. Add success and error toast messages after save actions.

---

## 10. Final Product Goal

The final user experience should feel simple, trustworthy, and professional. Users should be able to manage their identity and business details easily, while also receiving and keeping track of all important alerts in one organized notification system.

This profile and notification setup will improve the overall product quality and make the application feel complete for real-world business users.

