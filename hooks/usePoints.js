// hooks/usePoints.js
import { doc, onSnapshot } from "firebase/firestore";
import { useCallback, useEffect, useState } from "react";
import { awardPoints, POINTS_CONFIG } from "../logic/points/calculationEngine";
import {
	calculateStreak,
	checkAndAwardStreakBonus,
	getStreakProgress,
} from "../logic/points/streakCalculator";
import { firestore } from "../services/firebase/firebaseConfig";
import { useAuth } from "./useAuth";

/**
 * Hook for managing user points state, awarding, and streak tracking.
 * Provides real-time points updates via Firestore listener.
 */
export const usePoints = () => {
	const { user } = useAuth();
	const [points, setPoints] = useState(0);
	const [streak, setStreak] = useState({
		currentStreak: 0,
		lastContributionDate: null,
	});
	const [streakProgress, setStreakProgress] = useState({
		nextMilestone: 3,
		pointsAtNextMilestone: 30,
		progress: 0,
	});
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	// Real-time points listener
	useEffect(() => {
		if (!user?.uid) {
			setLoading(false);
			return;
		}

		const userRef = doc(firestore, "users", user.uid);
		const unsubscribe = onSnapshot(
			userRef,
			(snap) => {
				if (snap.exists()) {
					const data = snap.data();
					setPoints(data.points || 0);
				}
				setLoading(false);
			},
			(err) => {
				console.error("Points listener error:", err);
				setError(err.message);
				setLoading(false);
			},
		);

		return () => unsubscribe();
	}, [user]);

	// Fetch streak data
	useEffect(() => {
		if (!user?.uid) return;

		const fetchStreak = async () => {
			try {
				const streakData = await calculateStreak(user.uid);
				setStreak(streakData);
				setStreakProgress(getStreakProgress(streakData.currentStreak));
			} catch (e) {
				console.error("Streak fetch error:", e);
			}
		};
		fetchStreak();
	}, [user, points]); // Re-fetch when points change

	// Award points wrapper with streak check
	const award = useCallback(
		async (type, context = {}) => {
			if (!user?.uid) return { success: false, reason: "NOT_AUTHENTICATED" };

			try {
				const result = await awardPoints(user.uid, type, context);

				// Check for streak bonus after successful award
				if (result.success) {
					await checkAndAwardStreakBonus(user.uid);
				}

				return result;
			} catch (e) {
				console.error("Award points error:", e);
				return { success: false, reason: e.message };
			}
		},
		[user],
	);

	return {
		points,
		streak,
		streakProgress,
		loading,
		error,
		awardPoints: award,
		config: POINTS_CONFIG,
		canRedeem: points >= POINTS_CONFIG.MIN_REDEMPTION,
		inrValue: (points / 100).toFixed(2),
	};
};

export default usePoints;
