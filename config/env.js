/**
 * config/env.js
 * Centralized environment variable management.
 * * In Expo, utilize 'process.env' variables prefixed with EXPO_PUBLIC_
 * to expose them to the client side.
 */

const env = {
	// Firebase Configuration
	FIREBASE_API_KEY: process.env.EXPO_PUBLIC_FIREBASE_API_KEY || "",
	FIREBASE_AUTH_DOMAIN: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN || "",
	FIREBASE_PROJECT_ID: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID || "",
	FIREBASE_STORAGE_BUCKET:
		process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET || "",
	FIREBASE_MESSAGING_SENDER_ID:
		process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "",
	FIREBASE_APP_ID: process.env.EXPO_PUBLIC_FIREBASE_APP_ID || "",

	// Feature Flags
	ENABLE_GOD_MODE: process.env.EXPO_PUBLIC_ENABLE_GOD_MODE === "true",
	ENABLE_ANALYTICS: process.env.EXPO_PUBLIC_ENABLE_ANALYTICS === "true",

	// API Endpoints (if using external backend alongside Firebase)
	API_BASE_URL:
		process.env.EXPO_PUBLIC_API_URL || "https://api.bustracknow.com",

	// Environment Check
	IS_DEV: process.env.NODE_ENV === "development",
	IS_PROD: process.env.NODE_ENV === "production",
};

// validation or warning logic could go here
if (!env.FIREBASE_API_KEY) {
	console.warn(
		"config/env.js: Missing FIREBASE_API_KEY. Check your .env file.",
	);
}

export default env;
