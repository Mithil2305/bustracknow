# API Reference — BusTrackNow

## Firebase Services

### AuthService (`services/firebase/authService.js`)

| Method                            | Description              |
| --------------------------------- | ------------------------ |
| `signInWithPhone(phone)`          | Send OTP to phone number |
| `verifyOTP(verificationId, code)` | Verify OTP code          |
| `signOut()`                       | Sign out current user    |

### FirestoreService (`services/firebase/firestoreService.js`)

| Method                  | Description                       |
| ----------------------- | --------------------------------- |
| `getRoutes()`           | Fetch all active routes           |
| `getRouteById(id)`      | Fetch a single route              |
| `createRoute(data)`     | Create a new route (admin)        |
| `updateRoute(id, data)` | Update route (admin)              |
| `deleteRoute(id)`       | Delete route (admin)              |
| `getUsers()`            | Fetch all users (admin)           |
| `getUserById(id)`       | Fetch user profile                |
| `updateUser(id, data)`  | Update user data                  |
| `banUser(id)`           | Ban a user (admin)                |
| `getAlerts(routeId?)`   | Fetch alerts, optionally by route |
| `createAlert(data)`     | Create a community alert          |

### RealtimeService (`services/firebase/realtimeService.js`)

| Method                          | Description                    |
| ------------------------------- | ------------------------------ |
| `publishLocation(busId, data)`  | Write bus location to RTDB     |
| `subscribeToRoute(routeId, cb)` | Listen to bus updates on route |
| `unsubscribe(ref)`              | Remove listener                |

## Logic Modules

### Points (`logic/points/`)

| Function                                    | Description                      |
| ------------------------------------------- | -------------------------------- |
| `awardPoints(userId, type, metadata)`       | Award points atomically          |
| `calculateStreak(history)`                  | Calculate consecutive day streak |
| `checkAndAwardStreakBonus(userId)`          | Award streak bonus if due        |
| `validateRedemption(userId, amount, upiId)` | Validate redemption              |

### Geo (`logic/geo/`)

| Function                             | Description                     |
| ------------------------------------ | ------------------------------- |
| `haversineDistance(a, b)`            | Distance between two points (m) |
| `detectSpoofing(prev, curr, userId)` | 4-rule spoofing check           |
| `isOnRoute(point, routeCoords)`      | 50m geofence check              |

### Trust (`logic/trust/`)

| Function                          | Description                  |
| --------------------------------- | ---------------------------- |
| `calculateTrustScore(userId)`     | Weighted trust score (0–100) |
| `adjustTrustScore(userId, delta)` | Manual trust adjustment      |
| `crowdValidate(reports)`          | Weighted majority vote       |

## UPI Service (`services/payments/upiService.js`)

| Function                   | Description                  |
| -------------------------- | ---------------------------- |
| `isValidUPI(upiId)`        | Validate UPI ID format       |
| `verifyUPI(upiId)`         | Verify UPI account (mock)    |
| `initiateTransfer(params)` | Initiate UPI transfer (mock) |
