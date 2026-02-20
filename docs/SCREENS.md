# Screens Reference — BusTrackNow

## Authentication Flow

| Screen           | File                        | Description           |
| ---------------- | --------------------------- | --------------------- |
| Phone Login      | `app/(auth)/index.jsx`      | Enter phone number    |
| OTP Verification | `app/(auth)/otp.jsx`        | Enter 6-digit OTP     |
| Profile Setup    | `app/(auth)/profile.jsx`    | Name and avatar setup |
| UPI Verification | `app/(auth)/upi-verify.jsx` | Verify UPI ID         |
| UPI Info         | `app/(auth)/upi-info.jsx`   | Optional UPI linking  |

## Onboarding

| Screen  | File                        | Description            |
| ------- | --------------------------- | ---------------------- |
| Welcome | `app/onboarding/index.jsx`  | Intro + Get Started    |
| Slide 1 | `app/onboarding/slide1.jsx` | Real-time tracking     |
| Slide 2 | `app/onboarding/slide2.jsx` | Crowd-sourced location |
| Slide 3 | `app/onboarding/slide3.jsx` | Points & rewards       |
| Slide 4 | `app/onboarding/slide4.jsx` | Community alerts       |

## Main Tabs

| Tab      | Screen       | File                                  | Description               |
| -------- | ------------ | ------------------------------------- | ------------------------- |
| Home     | Map          | `app/(tabs)/index.jsx`                | Live map with bus markers |
| Routes   | Route List   | `app/(tabs)/routes/index.jsx`         | Browse/search routes      |
| Routes   | Route Detail | `app/(tabs)/routes/[id].jsx`          | Route info + stops        |
| Routes   | Stop Detail  | `app/(tabs)/routes/stop.jsx`          | Stop arrivals             |
| Wallet   | Balance      | `app/(tabs)/wallet/index.jsx`         | Points balance + actions  |
| Wallet   | History      | `app/(tabs)/wallet/history.jsx`       | Transaction log           |
| Wallet   | Redeem       | `app/(tabs)/wallet/redeem.jsx`        | UPI redemption flow       |
| Wallet   | Verify UPI   | `app/(tabs)/wallet/verify-upi.jsx`    | UPI verification step     |
| Wallet   | Receipt      | `app/(tabs)/wallet/receipt.jsx`       | Redemption confirmation   |
| Alerts   | Feed         | `app/(tabs)/alerts/index.jsx`         | Community alert feed      |
| Alerts   | Report       | `app/(tabs)/alerts/report.jsx`        | Report new alert          |
| Alerts   | Detail       | `app/(tabs)/alerts/[id].jsx`          | Alert detail + upvote     |
| Settings | Badges       | `app/(tabs)/settings/badges.jsx`      | Badges & levels           |
| Settings | Leaderboard  | `app/(tabs)/settings/leaderboard.jsx` | Top 50 leaderboard        |
| Settings | Saved        | `app/(tabs)/settings/saved.jsx`       | Saved/bookmarked routes   |

## Admin

| Screen       | File                     | Description                |
| ------------ | ------------------------ | -------------------------- |
| Dashboard    | `app/admin/index.jsx`    | Admin stats overview       |
| Route Mgmt   | `app/admin/routes.jsx`   | CRUD routes                |
| Stop Mgmt    | `app/admin/stops.jsx`    | CRUD stops                 |
| User Mgmt    | `app/admin/users.jsx`    | Ban/unban, role assignment |
| God Mode Map | `app/admin/god-mode.jsx` | Live map with all users    |

## Modals

| Modal              | File                                  | Description             |
| ------------------ | ------------------------------------- | ----------------------- |
| Active Sharing     | `app/modals/active-sharing-badge.jsx` | Live sharing indicator  |
| Points Toast       | `app/modals/points-toast.jsx`         | Points earned animation |
| Offline Banner     | `app/modals/offline-banner.jsx`       | Offline mode notice     |
| Permission Request | `app/modals/permission-modal.jsx`     | Location permission     |
