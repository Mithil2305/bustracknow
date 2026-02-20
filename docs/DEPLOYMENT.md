# Deployment Guide — BusTrackNow

## Prerequisites

- Node.js 18+
- Expo CLI (`npm install -g expo-cli`)
- EAS CLI (`npm install -g eas-cli`)
- Firebase CLI (`npm install -g firebase-tools`)
- Firebase project with Auth, Firestore, Realtime DB, and Storage enabled
- Google Maps API key (Android + iOS)
- Cloudflare R2 bucket (optional, for zero-egress storage)

## Environment Setup

1. Copy `.env.development` → `.env.local`
2. Fill in all Firebase and Maps API keys
3. Configure R2 credentials if using Cloudflare storage

## Development

```bash
# Install dependencies
npm install

# Start Expo dev server
npx expo start

# Run on Android
npx expo run:android

# Run on iOS
npx expo run:ios
```

## Firebase Setup

```bash
# Login to Firebase
firebase login

# Initialize project (select existing project)
firebase init

# Deploy security rules
node scripts/deployRules.js

# Seed sample routes
node scripts/seedRoutes.js

# Generate mock data (dev only)
node scripts/generateMockData.js
```

## Production Build (EAS)

```bash
# Configure EAS
eas build:configure

# Build for Android (APK)
eas build --platform android --profile production

# Build for iOS
eas build --platform ios --profile production

# Submit to stores
eas submit --platform android
eas submit --platform ios
```

## Firestore Indexes

Deploy the composite indexes required for queries:

```bash
firebase deploy --only firestore:indexes
```

## Data Migrations

Run when upgrading the schema:

```bash
node scripts/migrateData.js
```

## Monitoring

- Firebase Console → Analytics for event tracking
- Firebase Console → Crashlytics for crash reports
- Realtime DB → Monitor `active_buses` for live load
