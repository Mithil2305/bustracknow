import AsyncStorage from "@react-native-async-storage/async-storage";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getApp, getApps, initializeApp } from "firebase/app";
import {
	getAuth,
	getReactNativePersistence,
	initializeAuth,
} from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getFirestore } from "firebase/firestore";
import {
	FIREBASE_API_KEY,
	FIREBASE_APP_ID,
	FIREBASE_AUTH_DOMAIN,
	FIREBASE_MEASUREMENT_ID,
	FIREBASE_MESSAGING_SENDER_ID,
	FIREBASE_PROJECT_ID,
	FIREBASE_STORAGE_BUCKET,
} from "../../config/env"; // Assuming you have an env file

const firebaseConfig = {
	apiKey: FIREBASE_API_KEY,
	authDomain: FIREBASE_AUTH_DOMAIN,
	databaseURL: `https://${FIREBASE_PROJECT_ID}-default-rtdb.firebaseio.com`, // Typical RTDB URL format
	projectId: FIREBASE_PROJECT_ID,
	storageBucket: FIREBASE_STORAGE_BUCKET,
	messagingSenderId: FIREBASE_MESSAGING_SENDER_ID,
	appId: FIREBASE_APP_ID,
	measurementId: FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase (Singleton Pattern)
let app;
let auth;
let db;
let rtdb;
let analytics;

if (!getApps().length) {
	app = initializeApp(firebaseConfig);

	// Initialize Auth with AsyncStorage persistence for React Native
	auth = initializeAuth(app, {
		persistence: getReactNativePersistence(AsyncStorage),
	});
} else {
	app = getApp();
	auth = getAuth(app);
}

db = getFirestore(app);
rtdb = getDatabase(app);

// Analytics is often web-only or requires native linking, checking support safely
isSupported().then((supported) => {
	if (supported) {
		analytics = getAnalytics(app);
	}
});

export { analytics, app, auth, db, rtdb };
