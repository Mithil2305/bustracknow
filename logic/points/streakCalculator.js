// logic/points/streakCalculator.js
import {
	addDoc,
	collection,
	doc,
	getDoc,
	getDocs,
	increment,
	limit,
	orderBy,
	query,
	serverTimestamp,
	updateDoc,
	where,
} from "firebase/firestore";
import { firestore } from "../../services/firebase/firebaseConfig";
import { POINTS_CONFIG } from "./calculationEngine";

/**
 * Calculate the user's current contribution streak (consecutive days)
 * @param {string} userId
 * @returns {Promise<{ currentStreak: number, lastContributionDate: string | null }>}
 */
export const calculateStreak = async (userId) => {
	try {
		const txQuery = query(
			collection(firestore, "points_transactions"),
			where("userId", "==", userId),
			orderBy("createdAt", "desc"),
			limit(90), // Look back max 90 days
		);

		const snapshot = await getDocs(txQuery);
		if (snapshot.empty) {
			return { currentStreak: 0, lastContributionDate: null };
		}

		// Extract unique contribution dates (YYYY-MM-DD)
		const contributionDates = new Set();
		snapshot.docs.forEach((doc) => {
			const data = doc.data();
			if (data.createdAt && data.createdAt.toDate) {
				const date = data.createdAt.toDate();
				contributionDates.add(formatDate(date));
			}
		});

		if (contributionDates.size === 0) {
			return { currentStreak: 0, lastContributionDate: null };
		}

		// Sort dates descending
		const sortedDates = Array.from(contributionDates).sort().reverse();
		const today = formatDate(new Date());
		const yesterday = formatDate(getYesterday());

		// Streak must include today or yesterday to be active
		if (sortedDates[0] !== today && sortedDates[0] !== yesterday) {
			return { currentStreak: 0, lastContributionDate: sortedDates[0] };
		}

		// Count consecutive days
		let streak = 1;
		for (let i = 0; i < sortedDates.length - 1; i++) {
			const current = new Date(sortedDates[i]);
			const next = new Date(sortedDates[i + 1]);
			const diffMs = current.getTime() - next.getTime();
			const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

			if (diffDays === 1) {
				streak++;
			} else {
				break;
			}
		}

		return { currentStreak: streak, lastContributionDate: sortedDates[0] };
	} catch (error) {
		console.error("Streak calculation failed:", error);
		return { currentStreak: 0, lastContributionDate: null };
	}
};

/**
 * Check and award streak bonuses if milestones are reached
 * @param {string} userId
 * @returns {Promise<{ bonusAwarded: number, milestone: string | null }>}
 */
export const checkAndAwardStreakBonus = async (userId) => {
	try {
		const { currentStreak } = await calculateStreak(userId);

		const userRef = doc(firestore, "users", userId);
		const userDoc = await getDoc(userRef);
		if (!userDoc.exists() || userDoc.data().isBanned) {
			return { bonusAwarded: 0, milestone: null };
		}

		const userData = userDoc.data();
		const lastStreakBonus = userData.lastStreakBonus || 0;

		let bonusPoints = 0;
		let milestone = null;

		// Award only the highest unawarded milestone
		if (currentStreak >= 30 && lastStreakBonus < 30) {
			bonusPoints = POINTS_CONFIG.STREAK_30DAY;
			milestone = "30-day";
		} else if (currentStreak >= 7 && lastStreakBonus < 7) {
			bonusPoints = POINTS_CONFIG.STREAK_7DAY;
			milestone = "7-day";
		} else if (currentStreak >= 3 && lastStreakBonus < 3) {
			bonusPoints = POINTS_CONFIG.STREAK_3DAY;
			milestone = "3-day";
		}

		if (bonusPoints > 0 && milestone) {
			// Atomic update: award points + record milestone
			await updateDoc(userRef, {
				points: increment(bonusPoints),
				lastStreakBonus: currentStreak,
				updatedAt: serverTimestamp(),
			});

			// Immutable transaction record
			await addDoc(collection(firestore, "points_transactions"), {
				userId,
				points: bonusPoints,
				type: `streak_${milestone.replace("-", "")}`,
				context: {
					streak: currentStreak,
					milestone,
					timestamp: serverTimestamp(),
				},
				createdAt: serverTimestamp(),
			});

			return { bonusAwarded: bonusPoints, milestone };
		}

		return { bonusAwarded: 0, milestone: null };
	} catch (error) {
		console.error("Streak bonus award failed:", error);
		return { bonusAwarded: 0, milestone: null };
	}
};

/**
 * Get streak display info for the UI
 * @param {number} currentStreak
 * @returns {{ nextMilestone: number, pointsAtNextMilestone: number, progress: number }}
 */
export const getStreakProgress = (currentStreak) => {
	if (currentStreak < 3) {
		return {
			nextMilestone: 3,
			pointsAtNextMilestone: POINTS_CONFIG.STREAK_3DAY,
			progress: currentStreak / 3,
		};
	}
	if (currentStreak < 7) {
		return {
			nextMilestone: 7,
			pointsAtNextMilestone: POINTS_CONFIG.STREAK_7DAY,
			progress: currentStreak / 7,
		};
	}
	if (currentStreak < 30) {
		return {
			nextMilestone: 30,
			pointsAtNextMilestone: POINTS_CONFIG.STREAK_30DAY,
			progress: currentStreak / 30,
		};
	}
	return { nextMilestone: 30, pointsAtNextMilestone: 0, progress: 1 };
};

// Helpers
const formatDate = (date) => date.toISOString().split("T")[0];
const getYesterday = () => {
	const d = new Date();
	d.setDate(d.getDate() - 1);
	return d;
};
