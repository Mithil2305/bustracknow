### folder structure

```
BusTrackNow/
│
├── app/
│   ├── App.jsx
│   ├── index.js
│   └── navigation/
│       ├── RootNavigator.jsx
│       ├── ViewerNavigator.jsx
│       └── AdminNavigator.jsx
│
├── assets/
│   ├── images/
│   ├── icons/
│   └── lottie/
│
├── components/
│   ├── common/
│   │   ├── Button.jsx
│   │   ├── Input.jsx
│   │   ├── Loader.jsx
│   │   ├── EmptyState.jsx
│   │   └── ErrorBanner.jsx
│   │
│   ├── map/
│   │   ├── BusMarker.jsx
│   │   ├── StopMarker.jsx
│   │   ├── RoutePolyline.jsx
│   │   └── LiveMap.jsx
│   │
│   ├── admin/
│   │   ├── AdminBusCard.jsx
│   │   ├── UserRow.jsx
│   │   └── RouteEditor.jsx
│
├── screens/
│   ├── auth/
│   │   ├── LoginScreen.jsx
│   │   └── OTPScreen.jsx
│   │
│   ├── viewer/
│   │   ├── HomeScreen.jsx
│   │   ├── RouteSearchScreen.jsx
│   │   ├── LiveTrackingScreen.jsx
│   │   └── ContributionScreen.jsx
│   │
│   ├── admin/
│   │   ├── AdminDashboard.jsx
│   │   ├── RouteManagement.jsx
│   │   ├── StopManagement.jsx
│   │   ├── UserManagement.jsx
│   │   └── GodModeMap.jsx
│
│   └── shared/
│       ├── ProfileScreen.jsx
│       └── SettingsScreen.jsx
│
├── services/
│   ├── firebase/
│   │   ├── firebaseConfig.js
│   │   ├── authService.js
│   │   ├── firestoreService.js
│   │   ├── realtimeService.js
│   │   └── securityHelpers.js
│   │
│   ├── storage/
│   │   └── r2UploadService.js
│   │
│   └── analytics/
│       └── eventTracker.js
│
├── logic/
│   ├── geo/
│   │   ├── polylineMatcher.js
│   │   ├── distanceCalculator.js
│   │   └── speedEstimator.js
│   │
│   ├── broadcast/
│   │   ├── startBroadcast.js
│   │   ├── stopBroadcast.js
│   │   └── broadcastOptimizer.js
│   │
│   ├── offline/
│   │   ├── cacheManager.js
│   │   ├── versionSync.js
│   │   └── predictionEngine.js
│   │
│   └── trust/
│       └── crowdValidation.js
│
├── hooks/
│   ├── useAuth.js
│   ├── useUserRole.js
│   ├── useLiveBuses.js
│   ├── useCachedRoutes.js
│   └── useNetworkStatus.js
│
├── store/
│   ├── authStore.js
│   ├── routeStore.js
│   ├── busStore.js
│   └── adminStore.js
│
├── config/
│   ├── env.js
│   ├── constants.js
│   └── permissions.js
│
├── utils/
│   ├── dateUtils.js
│   ├── debounce.js
│   ├── logger.js
│   └── uuid.js
│
├── rules/
│   ├── firestore.rules
│   └── realtime.rules
│
├── tests/
│   ├── unit/
│   │   ├── geo.test.js
│   │   ├── cache.test.js
│   │   └── broadcast.test.js
│   │
│   ├── integration/
│   │   ├── authFlow.test.js
│   │   ├── liveTracking.test.js
│   │   └── adminActions.test.js
│   │
│   └── mocks/
│       ├── firebaseMock.js
│       └── locationMock.js
│
├── scripts/
│   ├── seedFirestore.js
│   └── migrateRoutes.js
│
├── package.json
├── babel.config.js
├── metro.config.js
└── README.md

```
