### folder structure

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
│  ├─ App.jsx
│  ├─ index.js
│  ├─ login.jsx
│  ├─ otp.jsx
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
│  │  └─ ViewerNavigator.jsx
│  └─ viewer/
│     ├─ contribute.jsx
│     ├─ index.jsx
│     ├─ live.jsx
│     └─ search.jsx
├─ app.json
├─ components/
│  ├─ admin/
│  │  ├─ AdminBusCard.jsx
│  │  ├─ RouteEditor.jsx
│  │  └─ UserRow.jsx
│  ├─ common/
│  │  ├─ Button.jsx
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
├─ node_modules/  (omitted contents)
├─ package-lock.json
├─ package.json
├─ README.md
├─ rules/
│  ├─ firestore.rules
│  └─ realtime.rules
├─ screens/
│  ├─ admin/
│  │  ├─ AdminDashboard.jsx
│  │  ├─ GodModeMap.jsx
│  │  ├─ RouteManagement.jsx
│  │  ├─ StopManagement.jsx
│  │  └─ UserManagement.jsx
│  ├─ auth/
│  │  ├─ LoginScreen.jsx
│  │  └─ OTPScreen.jsx
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
