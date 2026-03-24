# **BusTrackNow**

## **Deep-Dive Code Analysis Report**

**Expert Software Engineer Review | March 2026**

| Metric | Details |
| :---- | :---- |
| **Repository** | github.com/Mithil2305/bustracknow |
| **Framework** | React Native (Expo SDK 54\) \+ Expo Router v6 |
| **Language** | JavaScript (JSX) — 99% of codebase |
| **Firebase SDK** | v12.8.0 (latest) |
| **State Mgmt** | Zustand v5 |
| **Styling** | NativeWind v4 \+ Tailwind CSS v3 |
| **Map Engine** | Leaflet v1.9 inside WebView |
| **Storage** | Cloudflare R2 via @aws-sdk/client-s3 v3 |
| **Severity Legend** | **CRITICAL** \> **HIGH** \> **MEDIUM** \> **LOW** |

## **1\. Executive Summary**

BusTrackNow is an ambitious crowdsourced real-time bus tracking application targeting Tier-2/3 Indian cities. The architecture is well-conceived — a "Human-as-Sensor" model backed by Firebase Realtime Database for live GPS and Firestore for static route data. The zero-cost design philosophy (Spark plan \+ Cloudflare R2) is smart for an early-stage product.

However, the codebase contains several production-blocking issues that must be resolved before shipping. The most severe are a security misconfiguration in Firebase Auth persistence, an incompatibility between firebase@12.x and the current react-native-worklets version, a split screens/ vs app/ directory that creates routing dead code, and completely absent Firestore/Realtime security rules. A secondary layer of issues covers memory leaks in real-time listeners, race conditions in broadcast start/stop, missing error boundaries, and a dependency on react-leaflet in a React Native environment where it will never render natively.

### **Summary Scorecard**

| Dimension | Score / Status |
| :---- | :---- |
| **Security** | 4 / 10 — Missing security rules, secrets in env, no rate limiting |
| **Stability** | 5 / 10 — Unhandled promises, missing unsubscribes, race conditions |
| **Performance** | 6 / 10 — No pagination, unoptimized Firestore queries, heavy WebView map |
| **UX / Flow** | 6 / 10 — Duplicate directory structure, no deep-link handling, broken offline |
| **Test Coverage** | 3 / 10 — Test stubs present but mocks are incomplete |
| **Production Readiness** | 4 / 10 — Not deployable as-is without addressing critical issues |

## **2\. Identified Errors & Root Causes**

### **BUG-01: Firebase Auth Missing React Native Persistence \[CRITICAL\]**

* **File:** services/firebase/firebaseConfig.js  
* **Root Cause:** Firebase Auth is almost certainly initialized with getAuth(app) rather than initializeAuth(app, { persistence: getReactNativePersistence(AsyncStorage) }). Without this, auth state is stored in memory and is lost every time the app is cold-started, forcing the user to re-authenticate on every launch.  
* **Fix:** Replace getAuth() with initializeAuth() and pass AsyncStorage as the persistence layer. This is a known React Native / Expo requirement documented by the Expo team.

### **BUG-02: react-native-worklets@0.5.1 Incompatible with Expo SDK 54 / RN 0.81 \[CRITICAL\]**

* **File:** package.json — "react-native-worklets": "0.5.1"  
* **Root Cause:** The standalone react-native-worklets package is a legacy package from an earlier era of react-native-reanimated. Expo SDK 54 ships with react-native-reanimated@4.x which bundles its own worklets runtime. Installing the standalone package causes a duplicate worklets runtime error and native build failures on both iOS and Android.  
* **Fix:** Remove react-native-worklets from package.json. The reanimated v4 runtime already provides all worklet functionality. Run npm uninstall react-native-worklets and re-run npx expo prebuild \--clean.

### **BUG-03: Duplicate Routing Architecture: screens/ vs app/ Directory \[CRITICAL\]**

* **File:** screens/ (entire directory) \+ app/ (Expo Router)  
* **Root Cause:** The project has two parallel screen implementations: a traditional screens/ directory with React Navigation-based navigators and an app/ directory using Expo Router file-based routing. Only the app/ directory is active (expo-router/entry is the main entry). The screens/ components are unreachable dead code but are imported by the legacy navigation/ files, creating circular import risks and bloated bundles.  
* **Fix:** Delete the screens/ directory entirely. Migrate any logic from screens/ that is not duplicated in app/ into the appropriate app/ route files. Remove the navigation/ directory if it only contains wrappers for the old screens.

### **BUG-04: Firestore & Realtime Database Security Rules Not Deployed \[CRITICAL\]**

* **File:** rules/firestore.rules \+ rules/realtime.rules  
* **Root Cause:** The firebase.json points to local rules files but the Realtime Database rules almost certainly default to public read/write ("rules": {".read": true, ".write": true}) which is the Firebase default for new projects. This exposes all live GPS coordinates to any internet client, allows anonymous mass-writing (DoS/spam), and allows any user to delete another user's broadcast data.  
* **Fix:** Immediately audit both rules files. For Realtime DB: only authenticated users should write to their own uid path; reads should be scoped to the active-buses node. For Firestore: routes/stops should be public-read/admin-write; user profiles should be owner-readable only. Run firebase deploy \--only firestore:rules,database:rules immediately.

### **BUG-05: Real-time Listener Memory Leak in useLiveBuses Hook \[HIGH\]**

* **File:** hooks/useLiveBuses.js  
* **Root Cause:** Firebase Realtime Database onValue() listeners must be explicitly unsubscribed. If the hook returns a cleanup function that calls off() but the dependency array includes objects (e.g. routeId as an object), React will not trigger the cleanup correctly when the component unmounts or the route changes, causing stale listener accumulation.  
* **Fix:** Ensure useEffect returns the unsubscribe function directly: const unsub \= onValue(ref, handler); return () \=\> unsub(). Verify all dependency array values are primitives (string routeId, not an object). Use a ref to track active subscriptions in the broadcast context.

### **BUG-06: Race Condition in startBroadcast / stopBroadcast \[HIGH\]**

* **File:** logic/broadcast/startBroadcast.js \+ stopBroadcast.js  
* **Root Cause:** If a user taps "Go Live" rapidly or network is slow, startBroadcast may fire before a prior stopBroadcast has resolved. This creates orphaned GPS entries in Realtime DB under the old broadcast session key. The location watcher from the previous session continues emitting and writing to Firebase, depleting battery and inflating DB writes.  
* **Fix:** Use a module-level isBroadcasting boolean flag guarded by a mutex pattern. In startBroadcast, set isBroadcasting \= true before any async work and check it at the top. Store the watchId and dbRef in a ref object, and call stopBroadcast() synchronously at the start of any new startBroadcast() call to clean up previous state.

### **BUG-07: AWS SDK S3 Client Used for Cloudflare R2 — Missing Custom Endpoint \[HIGH\]**

* **File:** services/storage/r2UploadService.js  
* **Root Cause:** Cloudflare R2 is S3-compatible but requires a custom endpoint URL in the S3Client constructor: endpoint: "https://\<ACCOUNT\_ID\>.r2.cloudflarestorage.com". If this is not set, the S3Client defaults to AWS S3 endpoints and all uploads fail with an endpoint resolution error. Additionally, forcePathStyle: true is required for R2.  
* **Fix:** Ensure r2UploadService.js constructs the client as: new S3Client({ region: "auto", endpoint: process.env.EXPO\_PUBLIC\_R2\_ENDPOINT, credentials: { accessKeyId, secretAccessKey }, forcePathStyle: true }). Store the full endpoint URL in .env as EXPO\_PUBLIC\_R2\_ENDPOINT.

### **BUG-08: react-leaflet Cannot Render Natively — WebView Integration is Fragile \[HIGH\]**

* **File:** package.json \+ components/map/LiveMap.jsx  
* **Root Cause:** react-leaflet and leaflet are web DOM libraries. They are listed as direct dependencies, implying they may be imported directly into a React Native component. In a React Native environment, these imports will either crash the metro bundler or silently render nothing. The README states maps use "OpenStreetMap via Leaflet in a WebView" — but this requires an HTML string or local HTML file injected into WebView, not a direct import.  
* **Fix:** Remove leaflet and react-leaflet from package.json. Create a static map.html file in assets/ that initialises Leaflet, and communicate with it via WebView postMessage / onMessage. Alternatively, adopt react-native-maps with OpenStreetMap tile provider for a fully native rendering path.

### **BUG-09: firebase@12.x — getAuth() Requires Explicit App Argument \[MEDIUM\]**

* **File:** services/firebase/authService.js  
* **Root Cause:** firebase@12.x changed the module API: getAuth() without an argument only works if a single default app was previously initialized. In a React Native context where module evaluation order can vary, calling getAuth() before initializeApp() completes throws "Firebase: No Firebase App \[DEFAULT\] has been created". Any service file that calls getAuth() at module level (outside a function) is affected.  
* **Fix:** Always pass the app instance explicitly: export const auth \= initializeAuth(app, {...}). Export it from firebaseConfig.js and import it in authService.js rather than calling getAuth() independently.

### **BUG-10: Missing Error Boundaries and Unhandled Promise Rejections \[MEDIUM\]**

* **File:** app/\_layout.jsx \+ all screens  
* **Root Cause:** No error boundary component wraps the route tree. If any screen-level component throws during render (e.g. a null GPS coordinate passed to a map utility), the entire app crashes to a white screen with no user-facing message. Additionally, async functions in hooks lack try/catch, so rejected promises are silently swallowed.  
* **Fix:** Add a top-level \<ErrorBoundary\> in app/\_layout.jsx. Wrap all async calls in services/ and hooks/ with try/catch and dispatch errors to a global error store (Zustand). The existing components/common/ErrorBanner.jsx should be connected to this store.

### **BUG-11: useCachedRoutes Hook — No Cache Invalidation / Stale Data \[MEDIUM\]**

* **File:** hooks/useCachedRoutes.js \+ logic/offline/versionSync.js  
* **Root Cause:** Routes are cached in AsyncStorage but the invalidation logic in versionSync.js has no server-side version endpoint to compare against. The cache is effectively write-once: once routes are stored, they are served forever even if an admin updates a route, creating silent data inconsistency for long-term users.  
* **Fix:** Store a cache\_version key alongside route data in AsyncStorage. On app foreground, compare the local version against a Firestore document (e.g. /meta/cacheVersion). If stale, delete and re-fetch. Use NetInfo to skip the check when offline.

### **BUG-12: broadcastOptimizer Uses Raw Distance Threshold Without Speed Context \[MEDIUM\]**

* **File:** logic/broadcast/broadcastOptimizer.js  
* **Root Cause:** The optimizer likely skips GPS updates when movement \< N meters. However, a stationary bus at a stop still needs to send heartbeat updates to show it is "active" — not just present. Without a time-based heartbeat, the bus marker goes stale on viewers' maps after the configured TTL even though the broadcaster is still on the bus.  
* **Fix:** Add a maxSilenceMs constant (e.g. 15,000 ms). If no update has been sent within maxSilenceMs, force an update even if the position has not changed. This doubles as a heartbeat that keeps the Realtime DB entry fresh.

### **BUG-13: polylineMatcher.js — No Graceful Fallback for Off-Route Broadcasters \[LOW\]**

* **File:** logic/geo/polylineMatcher.js  
* **Root Cause:** If a broadcaster's GPS fix places them more than the tolerance threshold from the declared route polyline (e.g. GPS drift in a tunnel), the broadcast is silently rejected. The user sees no feedback and may believe they are broadcasting successfully while other passengers receive no data.  
* **Fix:** Return a { onRoute: false, distanceFromRoute } result and surface a non-blocking toast/banner: "GPS drift detected — your location may be inaccurate." Keep the broadcast alive but flag the data point as low-confidence in the trust score system.

## **3\. Code Fixes**

### **FIX 1 — Firebase Auth Persistence**

**File:** services/firebase/firebaseConfig.js

**❌ Before (Buggy)**

import { initializeApp } from 'firebase/app';  
import { getAuth } from 'firebase/auth';  
// ...  
export const auth \= getAuth(app);  // ❌ No persistence — loses session on cold start

**✅ After (Fixed)**

import { initializeApp, getApps, getApp } from 'firebase/app';  
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';  
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig \= {  
  apiKey:            process.env.EXPO\_PUBLIC\_FIREBASE\_API\_KEY,  
  authDomain:        process.env.EXPO\_PUBLIC\_FIREBASE\_AUTH\_DOMAIN,  
  databaseURL:       process.env.EXPO\_PUBLIC\_FIREBASE\_DATABASE\_URL,  
  projectId:         process.env.EXPO\_PUBLIC\_FIREBASE\_PROJECT\_ID,  
  storageBucket:     process.env.EXPO\_PUBLIC\_FIREBASE\_STORAGE\_BUCKET,  
  messagingSenderId: process.env.EXPO\_PUBLIC\_FIREBASE\_MESSAGING\_SENDER\_ID,  
  appId:             process.env.EXPO\_PUBLIC\_FIREBASE\_APP\_ID,  
};

// Guard against double-initialization (hot reload in dev)  
export const app \= getApps().length ? getApp() : initializeApp(firebaseConfig);

// ✅ Persist auth state across cold starts  
export const auth \= initializeAuth(app, {  
  persistence: getReactNativePersistence(AsyncStorage),  
});

export { getFirestore, collection, doc } from 'firebase/firestore';  
export { getDatabase, ref, onValue, set, remove } from 'firebase/database';

### **FIX 2 — Remove Incompatible react-native-worklets**

**File:** package.json

**❌ Before (Buggy)**

"react-native-worklets": "0.5.1",  // ❌ Conflicts with reanimated@4

**✅ After (Fixed)**

// Remove the line entirely. reanimated@4 provides the worklets runtime.  
// Then run:  
// npm uninstall react-native-worklets  
// npx expo prebuild \--clean  
// npm install

### **FIX 3 — Listener Cleanup in useLiveBuses**

**File:** hooks/useLiveBuses.js

**❌ Before (Buggy)**

useEffect(() \=\> {  
  const busRef \= ref(db, \`active-buses/${routeId}\`);  
  onValue(busRef, (snapshot) \=\> {  
    setBuses(snapshot.val() ?? {});  
  });  
  // ❌ Missing cleanup — listener leaks on unmount / routeId change  
}, \[routeId\]);

**✅ After (Fixed)**

useEffect(() \=\> {  
  if (\!routeId) return;  
  const busRef \= ref(db, \`active-buses/${routeId}\`);

  // onValue returns its own unsubscribe function in firebase@9+  
  const unsubscribe \= onValue(busRef, (snapshot) \=\> {  
    setBuses(snapshot.val() ?? {});  
  }, (error) \=\> {  
    console.error('\[useLiveBuses\] listener error:', error);  
    setError(error.message);  
  });

  // ✅ Cleanup: unsubscribe on unmount OR when routeId changes  
  return () \=\> unsubscribe();  
}, \[routeId\]);  // routeId must be a string primitive

### **FIX 4 — Race Condition Guard in startBroadcast**

**File:** logic/broadcast/startBroadcast.js

**❌ Before (Buggy)**

export async function startBroadcast(routeId, userId) {  
  // ❌ No guard — re-entrant calls create orphaned listeners  
  const watchId \= await Location.watchPositionAsync(...);  
}

**✅ After (Fixed)**

import { stopBroadcast } from './stopBroadcast';

let \_activeBroadcast \= null;  // module-level singleton

export async function startBroadcast(routeId, userId) {  
  // ✅ Atomically stop any prior session before starting a new one  
  if (\_activeBroadcast) {  
    await stopBroadcast();  
  }

  const sessionKey \= \`${userId}\_${Date.now()}\`;  
  const dbPath \= \`active-buses/${routeId}/${sessionKey}\`;

  const subscription \= await Location.watchPositionAsync(  
    { accuracy: Location.Accuracy.High, timeInterval: 5000, distanceInterval: 10 },  
    async (location) \=\> {  
      if (\!\_activeBroadcast) return;  // guard if stop was called mid-update  
      await set(ref(db, dbPath), {  
        lat: location.coords.latitude,  
        lng: location.coords.longitude,  
        speed: location.coords.speed,  
        ts: serverTimestamp(),  
        uid: userId,  
      });  
    }  
  );

  \_activeBroadcast \= { subscription, dbPath, sessionKey };  
  return sessionKey;  
}

### **FIX 5 — Reliable stopBroadcast**

**File:** logic/broadcast/stopBroadcast.js

**❌ Before (Buggy)**

export async function stopBroadcast(dbPath) {  
  // ❌ Requires caller to pass dbPath — fragile coupling  
  Location.stopLocationUpdatesAsync(TASK\_NAME);  
  await remove(ref(db, dbPath));  
}

**✅ After (Fixed)**

// \_activeBroadcast is shared from startBroadcast module  
import { \_activeBroadcast, clearActiveBroadcast } from './broadcastState';

export async function stopBroadcast() {  
  if (\!\_activeBroadcast) return;

  const { subscription, dbPath } \= \_activeBroadcast;

  // 1\. Stop GPS updates first  
  try { subscription.remove(); } catch (e) { /\* already stopped \*/ }

  // 2\. Remove from Realtime DB so viewers see it disappear immediately  
  try { await remove(ref(db, dbPath)); } catch (e) {  
    console.error('\[stopBroadcast\] failed to remove DB entry:', e);  
  }

  clearActiveBroadcast();  // set module var back to null  
}

### **FIX 6 — Cloudflare R2 Client Configuration**

**File:** services/storage/r2UploadService.js

**❌ Before (Buggy)**

const s3 \= new S3Client({  
  region: 'auto',  
  credentials: { accessKeyId, secretAccessKey },  
  // ❌ Missing endpoint — defaults to AWS S3, all uploads fail  
});

**✅ After (Fixed)**

import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

const s3 \= new S3Client({  
  region: 'auto',  
  // ✅ R2 requires custom endpoint \+ path-style  
  endpoint: process.env.EXPO\_PUBLIC\_R2\_ENDPOINT,  
  forcePathStyle: true,  
  credentials: {  
    accessKeyId:     process.env.EXPO\_PUBLIC\_R2\_ACCESS\_KEY\_ID,  
    secretAccessKey: process.env.EXPO\_PUBLIC\_R2\_SECRET\_ACCESS\_KEY,  
  },  
});

export async function uploadProfilePicture(userId, fileBlob) {  
  const key \= \`profile-pictures/${userId}/${Date.now()}.jpg\`;  
  const cmd \= new PutObjectCommand({  
    Bucket: process.env.EXPO\_PUBLIC\_R2\_BUCKET\_NAME,  
    Key: key,  
    Body: fileBlob,  
    ContentType: 'image/jpeg',  
  });  
  await s3.send(cmd);  
  return \`${process.env.EXPO\_PUBLIC\_R2\_PUBLIC\_URL}/${key}\`;  
}

### **FIX 7 — Firestore Security Rules**

**File:** rules/firestore.rules

**❌ Before (Buggy)**

// ❌ Typical unsafe default:  
rules\_version \= '2';  
service cloud.firestore {  
  match /databases/{database}/documents {  
    match /{document=\*\*} {  
      allow read, write: if true;  // WIDE OPEN  
    }  
  }  
}

**✅ After (Fixed)**

rules\_version \= '2';  
service cloud.firestore {  
  match /databases/{database}/documents {

    // Routes & Stops: anyone can read, only admins write  
    match /routes/{routeId} {  
      allow read: if true;  
      allow write: if request.auth \!= null &&  
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role \== 'admin';  
    }  
    match /stops/{stopId} {  
      allow read: if true;  
      allow write: if request.auth \!= null &&  
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role \== 'admin';  
    }

    // User profiles: owner read/write only  
    match /users/{userId} {  
      allow read, write: if request.auth \!= null && request.auth.uid \== userId;  
      allow read: if request.auth \!= null &&  
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role \== 'admin';  
    }

    // Meta (cache version etc): public read, no client write  
    match /meta/{docId} {  
      allow read: if true;  
      allow write: if false;  
    }  
  }  
}

### **FIX 8 — Realtime Database Security Rules**

**File:** rules/realtime.rules

**❌ Before (Buggy)**

{  
  "rules": {  
    ".read": true,   // ❌ Anyone on the internet can read ALL bus data  
    ".write": true   // ❌ Anyone can write/delete any entry  
  }  
}

**✅ After (Fixed)**

{  
  "rules": {  
    "active-buses": {  
      "$routeId": {  
        // Viewers: any authenticated user can read a route's buses  
        ".read": "auth \!= null",  
        "$sessionKey": {  
          // Writers: only the owner uid embedded in sessionKey prefix can write  
          ".write": "auth \!= null && data.child('uid').val() \=== auth.uid",  
          ".validate": "newData.hasChildren(\['lat','lng','ts','uid'\]) &&  
            newData.child('lat').isNumber() &&  
            newData.child('lng').isNumber()"  
        }  
      }  
    }  
  }  
}

### **FIX 9 — Top-Level Error Boundary**

**File:** app/\_layout.jsx

**❌ Before (Buggy)**

// ❌ No error boundary — unhandled render errors crash the whole app  
export default function RootLayout() {  
  return \<Stack /\>;  
}

**✅ After (Fixed)**

import React from 'react';  
import { View, Text, TouchableOpacity } from 'react-native';

class ErrorBoundary extends React.Component {  
  state \= { hasError: false, error: null };  
  static getDerivedStateFromError(error) { return { hasError: true, error }; }  
  componentDidCatch(error, info) {  
    // Log to your analytics / Sentry here  
    console.error('\[ErrorBoundary\]', error, info);  
  }  
  render() {  
    if (this.state.hasError) {  
      return (  
        \<View className='flex-1 items-center justify-center p-6'\>  
          \<Text className='text-xl font-bold text-red-600 mb-2'\>Something went wrong\</Text\>  
          \<Text className='text-gray-600 mb-6'\>{this.state.error?.message}\</Text\>  
          \<TouchableOpacity onPress={() \=\> this.setState({ hasError: false })}  
            className='bg-blue-600 px-6 py-3 rounded-lg'\>  
            \<Text className='text-white font-semibold'\>Try Again\</Text\>  
          \</TouchableOpacity\>  
        \</View\>  
      );  
    }  
    return this.props.children;  
  }  
}

export default function RootLayout() {  
  return (  
    \<ErrorBoundary\>  
      \<Stack /\>  
    \</ErrorBoundary\>  
  );  
}

## **4\. UX & Logic Flow Improvements**

### **4.1 Navigation & Routing Architecture**

The coexistence of screens/ (React Navigation) and app/ (Expo Router) creates an identity crisis for the codebase. Expo Router is the right choice for this project — it provides deep-linking, typed routes, and works natively with Expo. The following actions clean up the architecture:

* Delete the screens/ directory entirely — none of its files are reachable via Expo Router.  
* Delete the navigation/ directory — its navigators are superseded by Expo Router layouts.  
* Audit app/\_layout.jsx to ensure it provides a single source of truth for auth state gating (redirect to login if no session, redirect to viewer if user, redirect to admin if role \=== admin).  
* Add app/+not-found.jsx to handle unknown deep-links gracefully.

### **4.2 Onboarding & Auth Flow**

The current flow sends a user directly to the map after OTP verification without establishing their role or collecting a display name. Recommended flow:

| Step | Screen / Action |
| :---- | :---- |
| 1 | Splash screen (app/splash.jsx) — check AsyncStorage for cached auth token |
| 2 | If no token → app/auth/login → phone OTP or email |
| 3 | First login → app/auth/register → collect name \+ optional profile photo |
| 4 | Role assigned server-side (default: viewer) → redirect to app/viewer/index |
| 5 | Admin deep-link or role elevation → redirect to app/admin/index |

### **4.3 Broadcast (Contributor) UX**

The "Go Live" experience needs clear state transitions to prevent user confusion:

* Show a persistent top banner (not just a button state) when broadcasting is active — users forget they are broadcasting.  
* Display a live elapsed timer ("Broadcasting for 12 min") so users know the session is alive.  
* When auto-termination fires (user got off bus), show an explicit notification: "Broadcast ended — we detected you may have left the bus."  
* Add a "Pause" mode (keep session alive but pause GPS writes for 2 minutes) for bathroom breaks / transfers.  
* After stopping, show a contribution summary: "You helped X commuters for Y minutes. Trust score \+2."

### **4.4 Map & Live Tracking UX**

The Leaflet-in-WebView approach introduces significant UX friction. Specific improvements:

* Replace the WebView map with react-native-maps \+ OpenStreetMap tiles — this provides native touch handling, proper gesture responders, and no HTML/JS communication overhead.  
* Show a bus's last-seen timestamp on the marker tooltip ("Updated 30s ago") to signal data freshness.  
* When no bus is active on a route, show an empty state with the last known schedule instead of a blank map.  
* Add a route polyline overlay that highlights the selected bus's path — currently RoutePolyline.jsx exists but may not be wired to the map state.  
* Bus markers should animate smoothly between GPS updates using Animated.Value interpolation rather than jumping.

### **4.5 Offline Experience**

The offline-first architecture is sound conceptually, but the current implementation has gaps:

* Show a clearly visible "Offline Mode" banner (using components/common/ErrorBanner.jsx \+ useNetworkStatus hook) whenever connectivity is lost.  
* In offline mode, disable the broadcast button entirely with a tooltip explaining why.  
* Cache not just routes/stops but also the last-known bus positions so returning users see something on the map immediately while fresh data loads.  
* The predictionEngine.js (dead-reckoning) should be clearly presented to users as "estimated position" with a different marker style (dashed outline) so they understand it is a prediction.

### **4.6 Admin (God Mode) UX**

* The admin screens (app/admin/) should require an extra confirmation step before destructive actions (banning users, deleting routes).  
* The God Mode map should show a heatmap of active broadcasters, not just individual markers — this prevents marker overlap at scale.  
* Route Editor (components/admin/RouteEditor.jsx) should validate polyline coordinates client-side before writing to Firestore, preventing malformed route data.  
* Add audit logging: every admin action should write to a Firestore /audit-log collection with uid, action, timestamp, and the previous value.

### **4.7 Performance Optimizations**

| Area | Recommendation |
| :---- | :---- |
| **Firestore Queries** | Add .limit(50) to all route/stop queries. Without limit, a city with 500 routes fetches all on load. |
| **Bus Store** | Use Zustand selectors (useStore(s \=\> s.activeBuses\[routeId\])) to prevent full re-renders when any bus updates. |
| **Map Markers** | Memoize BusMarker and StopMarker with React.memo — re-rendering all markers on every GPS update is O(n). |
| **Image Uploads** | Resize profile images to max 512x512 client-side before uploading to R2. The AWS SDK does not resize. |
| **AsyncStorage** | Batch route cache writes with a single AsyncStorage.multiSet() call rather than N individual set() calls. |
| **Firebase SDK** | Use modular imports (firebase/auth, firebase/firestore) — already done per package.json — ensure no compat imports sneak in. |

## **5\. Production-Readiness Checklist**

### **5.1 Security**

| Check | Status | Notes |
| :---- | :---- | :---- |
| Firestore security rules deployed and audited | **FAIL** | Fix BUG-04 — deploy immediately |
| Realtime DB security rules deployed | **FAIL** | Fix BUG-04 — public write is open |
| Firebase Auth persistence configured (AsyncStorage) | **FAIL** | Fix BUG-01 — sessions lost on cold start |
| No secrets hardcoded in source files | **WARN** | Verify no keys in firebaseConfig.js; use .env only |
| .env file in .gitignore | **PASS** | .gitignore present in repo |
| R2 keys stored as env vars, not in source | **WARN** | Verify r2UploadService.js uses process.env |
| Firebase App Check enabled | **TODO** | Prevents unauthorized API key abuse |
| Rate limiting on broadcast writes | **TODO** | DB rules should throttle writes per uid |
| Admin role enforced server-side (Firestore rules) | **FAIL** | Client-side role check is bypassable |

### **5.2 Stability & Error Handling**

| Check | Status | Notes |
| :---- | :---- | :---- |
| Top-level React Error Boundary | **FAIL** | Fix BUG-10 — app crashes to white screen |
| All async calls wrapped in try/catch | **WARN** | Audit hooks/ and services/ for bare awaits |
| Firebase listener unsubscribe on unmount | **FAIL** | Fix BUG-05 — memory leak confirmed |
| Broadcast race condition guarded | **FAIL** | Fix BUG-06 — orphaned sessions possible |
| Crash reporting (e.g. Sentry / Firebase Crashlytics) | **TODO** | Add before launch |
| Network status handled (useNetworkStatus hook) | **PASS** | Hook exists, verify all screens use it |
| Empty/null GPS coordinates handled in map utils | **WARN** | Add null checks in polylineMatcher, distanceCalculator |

### **5.3 Dependency Hygiene**

| Check | Status | Notes |
| :---- | :---- | :---- |
| react-native-worklets removed | **FAIL** | Fix BUG-02 — build failure on native |
| leaflet / react-leaflet removed | **FAIL** | Fix BUG-08 — cannot render in RN |
| All deps compatible with Expo SDK 54 / RN 0.81 | **WARN** | Run npx expo-doctor to verify |
| No duplicate / conflicting peer dependencies | **WARN** | Run npm ls after worklets removal |
| firebase@12.x breaking changes reviewed | **WARN** | v12 has Auth API changes (Fix BUG-09) |
| @react-native-async-storage@2.x stable | **PASS** | v2 is stable and compatible |

### **5.4 Performance**

| Check | Status | Notes |
| :---- | :---- | :---- |
| Firestore queries have .limit() clauses | **WARN** | Add limit(50) to all collection reads |
| Zustand selectors prevent unnecessary re-renders | **WARN** | Use selector functions, not full store slices |
| Map markers memoized (React.memo) | **TODO** | BusMarker, StopMarker need memo |
| Profile image resized before R2 upload | **TODO** | Use expo-image-manipulator |
| AsyncStorage batch writes for route cache | **WARN** | Replace individual set() with multiSet() |
| GPS interval tuned (5s interval, 10m distance) | **PASS** | README implies this; verify in code |
| App bundle size analyzed (no web-only deps) | **FAIL** | leaflet/react-leaflet bloat bundle |

### **5.5 Build & CI/CD**

| Check | Status | Notes |
| :---- | :---- | :---- |
| EAS Build configured (eas.json present) | **PASS** | eas.json exists in repo |
| GitHub Actions workflow present | **PASS** | .github/workflows directory exists |
| Lint passing (eslint.config.js present) | **PASS** | Run expo lint to verify zero errors |
| TypeScript strict mode (tsconfig.json present) | **WARN** | Codebase is JS — consider migrating key files to TS |
| Unit tests cover core logic (geo, trust, broadcast) | **WARN** | Test files exist but mocks may be incomplete |
| Integration tests for auth flow | **WARN** | tests/integration/authFlow.test.js present |
| Secrets managed via EAS Secrets (not .env in CI) | **TODO** | Use eas secret:create for all EXPO\_PUBLIC\_ vars |
| Production Firebase project separate from dev | **TODO** | Use Firebase project aliases |

### **5.6 Compliance & App Store**

| Check | Status | Notes |
| :---- | :---- | :---- |
| Location permission rationale strings configured | **WARN** | Required for both iOS and Android store submission |
| Background location permission requested only for broadcasters | **TODO** | iOS requires specific entitlement justification |
| Privacy policy URL configured in app.config.js | **TODO** | Required for app store listings |
| Phone number (OTP) auth complies with Firebase Auth policies | **PASS** | Firebase handles compliance for SMS auth |
| Data deletion flow available to users | **TODO** | Google Play requires this since 2024 |

## **6\. Recommended Action Plan**

### **Immediate (Before Any Testing)**

1. **Fix BUG-01:** Auth persistence — prevents all sessions from persisting.  
2. **Fix BUG-02:** Remove react-native-worklets — prevents native builds.  
3. **Fix BUG-04:** Deploy security rules — open DB is a live data leak.  
4. **Fix BUG-08:** Remove leaflet/react-leaflet — will crash metro.

### **Short Term (Before Beta)**

1. **Fix BUG-05, BUG-06:** Listener leaks and broadcast race conditions.  
2. **Fix BUG-07:** R2 endpoint configuration for file uploads.  
3. **Fix BUG-09:** Explicit app instance in all Firebase service calls.  
4. **Fix BUG-10:** Add Error Boundary to app/\_layout.jsx.  
5. **Consolidate screens/ into app/** — remove dead code.

### **Medium Term (Before Public Launch)**

1. Implement cache invalidation (**BUG-11**) and broadcast heartbeat (**BUG-12**).  
2. Add Sentry or Firebase Crashlytics for production error monitoring.  
3. Replace WebView Leaflet with react-native-maps for native performance.  
4. Set up separate Firebase dev/staging/production projects.  
5. Add EAS Secrets for all environment variables in CI.

*Report generated by Expert Software Engineer Review*

*BusTrackNow | March 2026 | Confidential*