import {
	onAuthStateChanged,
	signInWithPhoneNumber,
	signOut,
} from "firebase/auth";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { auth, db } from "./firebaseConfig";

/**
 * Handles user authentication logic.
 * Note: For React Native (Expo), phone auth usually requires a recaptcha verifier ref
 * or the native firebase build. This code assumes standard JS SDK usage.
 */
export const AuthService = {
	/**
	 * Listen to auth state changes
	 * @param {Function} callback - Function to call with user object or null
	 * @returns {Function} - Unsubscribe function
	 */
	subscribeToAuth: (callback) => {
		return onAuthStateChanged(auth, async (user) => {
			if (user) {
				// Optional: Fetch extended profile from Firestore whenever auth state refreshes
				const userProfile = await AuthService.getUserProfile(user.uid);
				callback({ ...user, ...userProfile });
			} else {
				callback(null);
			}
		});
	},

	/**
	 * Send OTP to phone number
	 * @param {string} phoneNumber - E.164 format (e.g., +919999999999)
	 * @param {Object} recaptchaVerifier - Firebase RecaptchaVerifier instance
	 */
	sendOTP: async (phoneNumber, recaptchaVerifier) => {
		try {
			const confirmationResult = await signInWithPhoneNumber(
				auth,
				phoneNumber,
				recaptchaVerifier
			);
			return confirmationResult;
		} catch (error) {
			console.error("Error sending OTP:", error);
			throw error;
		}
	},

	/**
	 * Verify OTP code
	 * @param {Object} confirmationResult - Result from sendOTP
	 * @param {string} code - The 6-digit code entered by user
	 */
	verifyOTP: async (confirmationResult, code) => {
		try {
			const result = await confirmationResult.confirm(code);
			const user = result.user;

			// Check if user exists in Firestore, if not create basic profile
			await AuthService.ensureUserProfile(user);

			return user;
		} catch (error) {
			console.error("Error verifying OTP:", error);
			throw error;
		}
	},

	/**
	 * Create or update basic user profile in Firestore
	 */
	ensureUserProfile: async (user) => {
		const userRef = doc(db, "users", user.uid);
		const userSnap = await getDoc(userRef);

		if (!userSnap.exists()) {
			await setDoc(userRef, {
				uid: user.uid,
				phoneNumber: user.phoneNumber,
				createdAt: serverTimestamp(),
				role: "viewer", // Default role
				trustScore: 100,
				isBanned: false,
				displayName: "Commuter",
				photoURL: null,
			});
		}
	},

	getUserProfile: async (uid) => {
		try {
			const docRef = doc(db, "users", uid);
			const docSnap = await getDoc(docRef);
			return docSnap.exists() ? docSnap.data() : null;
		} catch (error) {
			console.error("Error fetching user profile:", error);
			return null;
		}
	},

	logout: async () => {
		try {
			await signOut(auth);
		} catch (error) {
			console.error("Logout failed:", error);
		}
	},
};
