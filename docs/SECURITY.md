# Security — BusTrackNow

## Threat Model

| Threat              | Mitigation                                          |
| ------------------- | --------------------------------------------------- |
| GPS spoofing        | 4-rule client-side detection + trust score penalty  |
| Ban bypass          | Server-side ban check in all Firestore rules        |
| Points manipulation | Immutable ledger — no client writes to transactions |
| Fake alerts         | Rate limiting + crowd validation + trust weighting  |
| Unauthorized admin  | Role-based Firestore rules + custom claims          |
| Data exfiltration   | Field-level read rules + banned user blocking       |

## Firestore Security Rules

Located in `rules/firestore.rules`. Key principles:

1. **Ban check in every rule** — `isBanned()` helper prevents all access for banned users
2. **Role-based access** — Admin actions require `isAdmin()` check
3. **Immutable points ledger** — `points_transactions` collection is append-only
4. **Redemption integrity** — Users can only create redemptions for themselves
5. **Alert rate limiting** — Validated at both client and rule level

## Realtime Database Rules

Located in `rules/realtime.rules`. Key principles:

1. **TTL enforcement** — Entries expire after configured period
2. **Speed limits** — Rejects locations with speed > 120 km/h
3. **Spoofing flags** — Banned data includes `isSpoofed` field
4. **Banned user blocking** — Cross-references Firestore ban status

## Storage Rules

Located in `rules/storage.rules`. Key principles:

1. **Image-only uploads** — Content type validation
2. **Size limits** — Max 5MB per file
3. **Owner-only profile writes** — Users can only modify their own profile photos
4. **Admin-only route images** — Only admins can upload route media

## Client-Side Detection

### Spoofing Detector (`logic/geo/spoofingDetector.js`)

Four rules evaluated on every location update:

1. **Speed check** — > 120 km/h = suspicious
2. **Teleportation** — > 1km in < 2 seconds = spoofed
3. **Speed mismatch** — Device speed vs calculated speed differ by > 50%
4. **Accuracy** — GPS accuracy < 1m = likely mock provider

### Trust Score (`logic/trust/trustScoreCalculator.js`)

Weighted composite score (0–100):

- 30% — Alert accuracy (upvoted alerts ratio)
- 25% — Broadcast consistency (sessions/month)
- 15% — Streak maintenance
- 15% — Account age
- 15% — Community rating
