// app/services/firebase/firebaseConfig.js
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
	getAnalytics,
	isSupported as isAnalyticsSupported,
} from "firebase/analytics";
import { getApp, getApps, initializeApp } from "firebase/app";
import {
	getAuth,
	getReactNativePersistence,
	initializeAuth,
} from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getFirestore } from "firebase/firestore";
import env from "../../config/env";

const firebaseConfig = {
	apiKey: env.FIREBASE_API_KEY,
	authDomain: env.FIREBASE_AUTH_DOMAIN,
	projectId: env.FIREBASE_PROJECT_ID,
	storageBucket: env.FIREBASE_STORAGE_BUCKET,
	messagingSenderId: env.FIREBASE_MESSAGING_SENDER_ID,
	appId: env.FIREBASE_APP_ID,
	measurementId: env.FIREBASE_MEASUREMENT_ID || undefined,
};

const missingFirebaseValues = Object.entries(firebaseConfig)
	.filter(([key, value]) => !value && key !== "measurementId")
	.map(([key]) => key);

if (missingFirebaseValues.length > 0) {
	console.warn(
		`firebaseConfig: missing Firebase env values: ${missingFirebaseValues.join(", ")}`,
	);
}

// Ensure we only initialize once (helps with HMR / fast refresh)
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

// Use React Native persistence when running in RN; fallback to getAuth on web
const isReactNative =
	typeof navigator !== "undefined" && navigator.product === "ReactNative";

export const auth = isReactNative
	? initializeAuth(app, {
			persistence: getReactNativePersistence(AsyncStorage),
		})
	: getAuth(app);
export const db = getFirestore(app);
export const firestore = db; // backwards compatibility
export const rtdb = getDatabase(app);

let analytics = null;
// firebase/analytics works only on web; guard to avoid native crashes
if (typeof window !== "undefined") {
	isAnalyticsSupported()
		.then((supported) => {
			if (supported) {
				analytics = getAnalytics(app);
			}
		})
		.catch(() => {
			// ignore analytics setup errors on unsupported platforms
		});
}

export { analytics };
export default app;
