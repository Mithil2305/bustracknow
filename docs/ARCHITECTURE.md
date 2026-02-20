# Architecture — BusTrackNow

## Overview

BusTrackNow is a crowd-sourced, real-time bus tracking app built with **Expo SDK 54** and **Firebase**. It follows a **file-based routing** architecture via Expo Router v6.

## Tech Stack

| Layer         | Technology                                  |
| ------------- | ------------------------------------------- |
| Framework     | React Native 0.81 + Expo ~54                |
| Routing       | Expo Router v6 (file-based)                 |
| State         | Zustand v5                                  |
| Backend       | Firebase (Auth, Firestore, Realtime DB)     |
| Storage       | Cloudflare R2 (primary) + Firebase fallback |
| Maps          | react-native-maps (Google Maps)             |
| Design System | Custom tokens (palette, radius, spacing)    |

## Directory Structure

```
app/                  → Expo Router screens (file-based routing)
  (auth)/             → Authentication flow (login, OTP, profile)
  (tabs)/             → Main tab navigator (Home, Routes, Wallet, Alerts, Settings)
  admin/              → Admin-only screens
  modals/             → Modal presentations
  onboarding/         → First-time user onboarding slides
components/           → Reusable UI components
  admin/              → Admin-specific components
  bottom-sheet/       → Bottom sheet + route cards
  common/             → Shared primitives (Button, Input, Loader, etc.)
  map/                → Map components (BusMarker, LiveMap, etc.)
  overlays/           → Floating overlays (toasts, badges, banners)
  ui/                 → Design system atoms (Badge, Chip, Card, etc.)
config/               → App configuration (env, constants, permissions)
design/               → Design tokens (palette, typography, spacing)
hooks/                → Custom React hooks
logic/                → Pure business logic (no UI)
  alerts/             → Alert validation + upvoting
  broadcast/          → Location broadcast management
  geo/                → Distance, spoofing, polyline matching
  offline/            → Caching, predictions, version sync
  points/             → Points calculation, streaks, redemption
  trust/              → Trust score + crowd validation
navigation/           → React Navigation navigators (legacy, alongside Expo Router)
rules/                → Firebase security rules
screens/              → Screen components (used by navigators)
services/             → External service integrations
  analytics/          → Event tracking
  firebase/           → Firebase CRUD services
  payments/           → UPI payment service
  storage/            → R2 upload service
store/                → Zustand stores
tests/                → Jest tests
types/                → TypeScript type definitions
utils/                → Utility functions
```

## Data Flow

```
User Action → Screen → Hook → Logic Module → Firebase Service → Firestore/RTDB
                                ↕
                          Zustand Store → UI Update
```

## Security Model

1. **Firestore Rules** — Role-based access, ban-bypass prevention, immutable ledgers
2. **Realtime DB Rules** — TTL enforcement, speed limits, spoofing prevention
3. **Client-side spoofing detection** — 4-rule validation in `spoofingDetector.js`
4. **Crowd validation** — Weighted majority vote via `crowdValidation.js`
5. **Trust scores** — Calculated per-user, affects validation weight

## Points & Gamification

- Points awarded for: broadcasting, validated alerts, streaks, first broadcast
- Streaks calculated from consecutive daily broadcast sessions
- Redemption via UPI with validation + 24h cooldown
- Leaderboard based on lifetime points
