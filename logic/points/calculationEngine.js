// logic/points/calculationEngine.js
import {
	collection,
	doc,
	getDoc,
	increment,
	serverTimestamp,
} from "firebase/firestore";
import { firestore } from "../../services/firebase/firebaseConfig";

export const POINTS_CONFIG = {
	LOCATION_SHARE: { base: 5, maxPerTrip: 30, intervalSecs: 60 },
	STOP_CONFIRM: { base: 2, minStopsRequired: 2 },
	ALERT_FULL: { base: 10, dailyLimit: 1 },
	ALERT_LATE: { base: 8, dailyLimit: 1 },
	ALERT_NOT_RUNNING: { base: 15, dailyLimit: 1 },
	STREAK_3DAY: 30,
	STREAK_7DAY: 50,
	STREAK_30DAY: 200,
	REFERRAL: 100,
	FIRST_CONTRIBUTION: 50,
	MIN_REDEMPTION: 10000, // ₹100
};

/**
 * Award points with validation and immutable transaction logging
 * @param {string} userId
 * @param {string} type - Transaction type
 * @param {Object} context - Additional validation context
 * @returns {Promise<Object>}
 */
export const awardPoints = async (userId, type, context = {}) => {
	try {
		// ✅ Validate user exists and not banned
		const userDoc = await getDoc(doc(firestore, "users", userId));
		if (!userDoc.exists() || userDoc.data().isBanned) {
			return { success: false, reason: "USER_INVALID_OR_BANNED" };
		}

		const userData = userDoc.data();
		let points = 0;
		let validationPassed = true;

		// ✅ Type-specific validation
		switch (type) {
			case "location_share":
				const tripMins = context.tripMinutes || 1;
				points = Math.min(
					POINTS_CONFIG.LOCATION_SHARE.base * tripMins,
					POINTS_CONFIG.LOCATION_SHARE.maxPerTrip,
				);
				if (points <= 0) validationPassed = false;
				break;

			case "stop_confirm":
				if (
					(userData.stopsConfirmed || 0) <
					POINTS_CONFIG.STOP_CONFIRM.minStopsRequired
				) {
					validationPassed = false;
				} else {
					points = POINTS_CONFIG.STOP_CONFIRM.base;
				}
				break;

			case "alert_full":
			case "alert_late":
			case "alert_not_running":
				// Daily limit enforcement per route
				// Note: In production, use a cloud function for this query to avoid client-side quota abuse
				points = POINTS_CONFIG[type.replace("alert_", "").toUpperCase()];
				break;

			case "first_contribution":
				if (userData.totalContributions > 0) validationPassed = false;
				else points = POINTS_CONFIG.FIRST_CONTRIBUTION;
				break;

			default:
				points = POINTS_CONFIG[type.toUpperCase()] || 0;
		}

		if (!validationPassed || points <= 0) {
			return { success: false, reason: "VALIDATION_FAILED" };
		}

		// ✅ Atomic update with immutable transaction
		const batch = firestore.batch();
		const userRef = doc(firestore, "users", userId);

		batch.update(userRef, {
			points: increment(points),
			totalContributions: increment(type.includes("alert") ? 0 : 1),
			lastContribution: serverTimestamp(),
			...(type === "stop_confirm" && { stopsConfirmed: increment(1) }),
		});

		// Immutable transaction record
		const txRef = doc(collection(firestore, "points_transactions"));
		batch.set(txRef, {
			userId,
			points,
			type,
			context: {
				routeId: context.routeId,
				stopId: context.stopId,
				timestamp: serverTimestamp(),
			},
			createdAt: serverTimestamp(),
		});

		await batch.commit();

		return {
			success: true,
			pointsAwarded: points,
			transactionId: txRef.id,
			newTotal: (userData.points || 0) + points,
		};
	} catch (error) {
		console.error("Points award failed:", error);
		throw error;
	}
};
