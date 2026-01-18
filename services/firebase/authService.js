// app/services/firebase/authService.js
import {
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
	signOut,
} from "firebase/auth";
import { auth } from "./firebaseConfig";

export async function loginWithEmail(email, password) {
	const userCred = await signInWithEmailAndPassword(auth, email, password);
	return userCred.user;
}

export async function registerWithEmail(email, password) {
	try {
		const userCred = await createUserWithEmailAndPassword(
			auth,
			email,
			password,
		);
		return userCred.user;
	} catch (err) {
		// Provide a friendlier hint when email/password auth isn't enabled in Firebase console
		if (
			err?.code === "auth/configuration-not-found" ||
			err?.code === "auth/operation-not-allowed"
		) {
			err.message =
				"Email/Password sign-in isn't enabled for this Firebase project. Enable it in Firebase Console > Authentication > Sign-in method.";
		}
		throw err;
	}
}

export async function logout() {
	await signOut(auth);
}
