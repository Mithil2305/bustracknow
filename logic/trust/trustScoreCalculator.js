import { doc, getDoc, increment, updateDoc } from "firebase/firestore";
import { db } from "../../services/firebase/firebaseConfig";

const USERS_COL = "users";

/**
 * Weights for trust score calculation.
 */
const WEIGHTS = {
  alertAccuracy: 0.3, // % of alerts that received ≥3 upvotes
  broadcastConsistency: 0.25, // regular broadcast sessions
  streakBonus: 0.15, // streak length factor
  accountAge: 0.15, // days since registration
  communityRating: 0.15, // crowd validation score
};

/**
 * Calculate a user's trust score (0–100).
 * @param {string} userId
 * @returns {Promise<number>} trust score
 */
export async function calculateTrustScore(userId) {
  const userRef = doc(db, USERS_COL, userId);
  const snap = await getDoc(userRef);
  if (!snap.exists()) return 0;

  const data = snap.data();
  const stats = data.stats || {};

  // 1. Alert accuracy
  const totalAlerts = stats.alertsCreated || 0;
  const upvotedAlerts = stats.alertsUpvoted || 0;
  const alertScore = totalAlerts > 0 ? Math.min((upvotedAlerts / totalAlerts) * 100, 100) : 50;

  // 2. Broadcast consistency (sessions in last 30 days)
  const sessions30d = stats.broadcastSessions30d || 0;
  const broadcastScore = Math.min((sessions30d / 20) * 100, 100); // 20 sessions = 100

  // 3. Streak bonus
  const streak = stats.currentStreak || 0;
  const streakScore = Math.min((streak / 14) * 100, 100); // 14-day streak = 100

  // 4. Account age
  const createdAt = data.createdAt?.toDate?.() || new Date();
  const ageDays = (Date.now() - createdAt.getTime()) / (1000 * 60 * 60 * 24);
  const ageScore = Math.min((ageDays / 90) * 100, 100); // 90 days = 100

  // 5. Community rating
  const communityScore = stats.communityRating || 50;

  const score = Math.round(
    alertScore * WEIGHTS.alertAccuracy +
      broadcastScore * WEIGHTS.broadcastConsistency +
      streakScore * WEIGHTS.streakBonus +
      ageScore * WEIGHTS.accountAge +
      communityScore * WEIGHTS.communityRating
  );

  // Persist the score
  await updateDoc(userRef, { trustScore: score });

  return score;
}

/**
 * Adjust a user's trust score by a delta (e.g., after spoofing detection).
 * @param {string} userId
 * @param {number} delta - positive or negative adjustment
 */
export async function adjustTrustScore(userId, delta) {
  const userRef = doc(db, USERS_COL, userId);
  await updateDoc(userRef, {
    trustScore: increment(delta),
  });
}
