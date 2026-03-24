/**
 * config/env.js
 * Single source of truth for all environment variables.
 * All values are sourced from the root .env file via Expo's
 * EXPO_PUBLIC_ prefix (inlined at build time by Metro).
 */

const env = {
  // ── Firebase ────────────────────────────────────────────────────
  FIREBASE_API_KEY: process.env.EXPO_PUBLIC_FIREBASE_API_KEY || "",
  FIREBASE_AUTH_DOMAIN: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN || "",
  FIREBASE_PROJECT_ID: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID || "",
  FIREBASE_STORAGE_BUCKET: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET || "",
  FIREBASE_MESSAGING_SENDER_ID: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "",
  FIREBASE_APP_ID: process.env.EXPO_PUBLIC_FIREBASE_APP_ID || "",
  FIREBASE_DATABASE_URL: process.env.EXPO_PUBLIC_FIREBASE_DATABASE_URL || "",

  // ── App Config ──────────────────────────────────────────────────
  PILOT_CITY: process.env.EXPO_PUBLIC_PILOT_CITY || "coimbatore",
  MIN_REDEMPTION_AMOUNT: Number(process.env.EXPO_PUBLIC_MIN_REDEMPTION_AMOUNT) || 100,
  POINTS_TO_INR_RATIO: Number(process.env.EXPO_PUBLIC_POINTS_TO_INR_RATIO) || 100,
  ENABLE_GOD_MODE: process.env.EXPO_PUBLIC_ENABLE_GOD_MODE === "true",

  // ── Runtime Helpers ─────────────────────────────────────────────
  IS_DEV: process.env.NODE_ENV === "development",
  IS_PROD: process.env.NODE_ENV === "production",
};

// Warn loudly if any Firebase key is missing at startup
const missingKeys = [
  "FIREBASE_API_KEY",
  "FIREBASE_AUTH_DOMAIN",
  "FIREBASE_PROJECT_ID",
  "FIREBASE_APP_ID",
  "FIREBASE_DATABASE_URL",
].filter((k) => !env[k]);

if (missingKeys.length > 0) {
  console.warn(`[env] Missing required env vars: ${missingKeys.join(", ")}. Check your .env file.`);
}

export default env;
