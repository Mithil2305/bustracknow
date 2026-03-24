// services/firebase/firebaseConfig.js
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth, getReactNativePersistence, initializeAuth } from "firebase/auth";
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
  databaseURL: env.FIREBASE_DATABASE_URL,
};

const missingFirebaseValues = Object.entries(firebaseConfig)
  .filter(([, value]) => !value)
  .map(([key]) => key);

if (missingFirebaseValues.length > 0) {
  console.warn(`firebaseConfig: missing Firebase env values: ${missingFirebaseValues.join(", ")}`);
}

// Ensure we only initialize once (helps with HMR / fast refresh)
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

// Use React Native persistence when running in RN; fallback to getAuth on web
// Guard initializeAuth so it doesn't throw on hot reload (it can only be called once per app)
const isReactNative = typeof navigator !== "undefined" && navigator.product === "ReactNative";

let auth;
try {
  auth = isReactNative
    ? initializeAuth(app, {
        persistence: getReactNativePersistence(AsyncStorage),
      })
    : getAuth(app);
} catch (_e) {
  // initializeAuth already called (HMR / fast refresh) — fall back to getAuth
  auth = getAuth(app);
}

export { auth };
export const db = getFirestore(app);
export const firestore = db; // backwards compatibility
export const rtdb = getDatabase(app);

export default app;
