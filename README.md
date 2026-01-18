BusTrackNow 🚌

Crowdsourced Real-Time Public Bus Tracking for Tier 2 & Tier 3 Cities.

BusTrackNow operates on a "Human-as-Sensor" model where passengers voluntarily broadcast their location to help others. Designed with a Zero-Cost Architecture, it leverages the Firebase Spark Plan and Cloudflare R2 to eliminate recurring server costs, relying on "Smart Client" logic rather than expensive cloud functions.

🚀 Features

📱 For Commuters (Viewers)

Live Tracking: Real-time bus movement on the map using Firebase Realtime Database.

Offline-First: Routes and stops are cached locally; the app works even with spotty internet.

Smart Search: Quickly find buses by route number or destination.

📡 For Contributors

Broadcast Mode: Passengers can "Go Live" to share their bus's location.

Trust System: Crowd-validation logic ensures data accuracy.

Battery Efficient: Optimized geolocation updates to minimize drain.

🛡️ Admin (God Mode)

Route Management: Create and edit routes/stops directly from the app.

User Management: Monitor trust scores and ban malicious actors.

Global Overview: View all active buses in the city simultaneously.

🛠 Tech Stack

Component

Technology

Description

Framework

React Native (Expo)

Cross-platform (iOS/Android) with Expo Router.

Styling

NativeWind

Tailwind CSS for React Native.

Auth

Firebase Auth

Phone (OTP) and Email authentication.

Live DB

Realtime Database

High-frequency, ephemeral GPS updates.

Static DB

Cloud Firestore

Persistent data (Routes, Stops, User Profiles).

Storage

Cloudflare R2

Zero egress fees for profile pics & assets.

State

Zustand

Lightweight global state management.

📂 Project Structure

```
bustracknow/
├─ .expo/
│  ├─ cache/
│  │  └─ eslint/
│  │     └─ .cache_k0w2r2
│  ├─ devices.json
│  └─ README.md
├─ .git/
├─ .gitignore
├─ .vscode/
│  ├─ extensions.json
│  └─ settings.json
├─ app/
│  ├─ _layout.jsx
│  ├─ index.jsx
│  ├─ profile.jsx
│  ├─ settings.jsx
│  ├─ splash.jsx
│  ├─ admin/
│  │  ├─ god-mode.jsx
│  │  ├─ index.jsx
│  │  ├─ routes.jsx
│  │  ├─ stops.jsx
│  │  └─ users.jsx
│  ├─ design/
│  │  └─ tokens.js
│  ├─ navigation/
│  │  ├─ AdminNavigator.jsx
│  │  ├─ RootNavigator.jsx
│  │  ├─ ViewerNavigator.jsx
│  │  ├─ linking.js
│  │  └─ stacks/
│  │     └─ AuthStack.jsx
│  └─ viewer/
│     ├─ contribute.jsx
│     ├─ index.jsx
│     ├─ live.jsx
│     └─ search.jsx
├─ app.config.js
├─ .env.example
├─ assets/
│  └─ logo.png
├─ components/
│  ├─ admin/
│  │  ├─ AdminBusCard.jsx
│  │  ├─ RouteEditor.jsx
│  │  └─ UserRow.jsx
│  ├─ common/
│  │  ├─ Button.jsx
│  │  ├─ CustomTabBar.jsx
│  │  ├─ EmptyState.jsx
│  │  ├─ ErrorBanner.jsx
│  │  ├─ Input.jsx
│  │  └─ Loader.jsx
│  └─ map/
│     ├─ BusMarker.jsx
│     ├─ LiveMap.jsx
│     ├─ RoutePolyline.jsx
│     └─ StopMarker.jsx
├─ config/
│  ├─ constants.js
│  ├─ env.js
│  └─ permissions.js
├─ eslint.config.js
├─ hooks/
│  ├─ useAuth.js
│  ├─ useCachedRoutes.js
│  ├─ useLiveBuses.js
│  ├─ useNetworkStatus.js
│  └─ useUserRole.js
├─ logic/
│  ├─ broadcast/
│  │  ├─ broadcastOptimizer.js
│  │  ├─ startBroadcast.js
│  │  └─ stopBroadcast.js
│  ├─ geo/
│  │  ├─ distanceCalculator.js
│  │  ├─ polylineMatcher.js
│  │  └─ speedEstimator.js
│  ├─ offline/
│  │  ├─ cacheManager.js
│  │  ├─ predictionEngine.js
│  │  └─ versionSync.js
│  └─ trust/
│     └─ crowdValidation.js
├─ rules/
│  ├─ firestore.rules
│  └─ realtime.rules
├─ package.json
├─ package-lock.json
├─ README.md
├─ screens/
│  ├─ admin/
│  │  ├─ AdminDashboard.jsx
│  │  ├─ GodModeMap.jsx
│  │  ├─ RouteManagement.jsx
│  │  ├─ StopManagement.jsx
│  │  └─ UserManagement.jsx
│  ├─ auth/
│  │  ├─ LoginScreen.jsx
│  │  ├─ OTPScreen.jsx
│  │  └─ RegisterScreen.jsx
│  ├─ shared/
│  │  ├─ ProfileScreen.jsx
│  │  └─ SettingsScreen.jsx
│  └─ viewer/
│     ├─ ContributionScreen.jsx
│     ├─ HomeScreen.jsx
│     ├─ LiveTrackingScreen.jsx
│     └─ RouteSearchScreen.jsx
├─ services/
│  ├─ analytics/
│  │  └─ eventTracker.js
│  ├─ firebase/
│  │  ├─ authService.js
│  │  ├─ firebaseConfig.js
│  │  ├─ firestoreService.js
│  │  ├─ realtimeService.js
│  │  └─ securityHelpers.js
│  └─ storage/
│     └─ r2UploadService.js
├─ store/
│  ├─ adminStore.js
│  ├─ authStore.js
│  ├─ busStore.js
│  └─ routeStore.js
├─ tests/
│  ├─ integration/
│  │  ├─ adminActions.test.js
│  │  ├─ authFlow.test.js
│  │  └─ liveTracking.test.js
│  ├─ mocks/
│  │  ├─ firebaseMock.js
│  │  └─ locationMock.js
│  └─ unit/
│     ├─ broadcast.test.js
│     ├─ cache.test.js
│     └─ geo.test.js
└─ utils/
   ├─ dateUtils.js
   ├─ debounce.js
   ├─ logger.js
   └─ uuid.js

```

🏗️ Architecture

1. The "Smart Client"

To maintain the "Zero Cost" promise, complex logic is handled on the user's device (/logic folder) rather than server-side functions:

Geo-Fencing: The app checks if a broadcaster is actually near the route path (logic/geo/polylineMatcher.js).

Auto-Termination: Accelerometer monitoring detects if a user gets off the bus and forgets to stop broadcasting.

2. Data Flow

Static Data (Routes/Stops): Fetched from Firestore and cached locally using AsyncStorage.

Live Data: Broadcasters write ephemeral coordinates to Realtime Database. Viewers subscribe to these changes.

Assets: Images are uploaded directly to Cloudflare R2.

⚡ Getting Started

Prerequisites

Node.js & npm/yarn

Expo CLI (npm install -g expo-cli)

Firebase Project Credentials

Installation

Clone the repository

git clone [https://github.com/your-username/bustracknow.git](https://github.com/your-username/bustracknow.git)
cd bustracknow

Install dependencies

npm install

Environment Setup

1. Copy `.env.example` to `.env` in the project root.
2. Fill in all Firebase keys (API key, auth domain, project ID, storage bucket, messaging sender ID, app ID, measurement ID).
3. Add your Google Maps API key to both `GOOGLE_MAPS_API_KEY` (used by native build config) and `EXPO_PUBLIC_GOOGLE_MAPS_API_KEY` (exposed to the client for MapView).
4. Optionally adjust `EXPO_PUBLIC_API_URL`, `EXPO_PUBLIC_ENABLE_GOD_MODE`, and `EXPO_PUBLIC_ENABLE_ANALYTICS` flags to match your deployment.

The Expo config (`app.config.js`) automatically injects the Google Maps key into Android and iOS native configs, and `config/env.js` reads the public variables at runtime.

Run the App

npx expo start

🤝 Contributing

Fork the Project

Create your Feature Branch (git checkout -b feature/AmazingFeature)

Commit your Changes (git commit -m 'Add some AmazingFeature')

Push to the Branch (git push origin feature/AmazingFeature)

Open a Pull Request

License: MIT
Contact: support@bustracknow.com
