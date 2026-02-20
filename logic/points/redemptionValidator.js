import { collection, doc, getDocs, query, Timestamp, updateDoc, where } from "firebase/firestore";
import { db } from "../../services/firebase/firebaseConfig";

const REDEMPTIONS_COL = "redemptions";

/**
 * Validate a redemption request before processing.
 * @param {string} userId
 * @param {number} amount - points to redeem
 * @param {string} upiId - target UPI ID
 * @returns {{ valid: boolean, error?: string }}
 */
export async function validateRedemption(userId, amount, upiId) {
  if (!userId || !amount || !upiId) {
    return { valid: false, error: "Missing required fields" };
  }

  if (amount < 100) {
    return { valid: false, error: "Minimum redemption is 100 points" };
  }

  if (amount > 10000) {
    return { valid: false, error: "Maximum redemption is 10,000 points per request" };
  }

  const UPI_REGEX = /^[\w.-]+@[\w]+$/;
  if (!UPI_REGEX.test(upiId)) {
    return { valid: false, error: "Invalid UPI ID format" };
  }

  // Check for pending redemptions (max 1 at a time)
  const pendingQuery = query(
    collection(db, REDEMPTIONS_COL),
    where("userId", "==", userId),
    where("status", "==", "pending")
  );
  const pendingSnap = await getDocs(pendingQuery);
  if (!pendingSnap.empty) {
    return {
      valid: false,
      error: "You have a pending redemption. Please wait for it to complete.",
    };
  }

  // Check cooldown — no redemption within last 24 hours
  const oneDayAgo = Timestamp.fromDate(new Date(Date.now() - 24 * 60 * 60 * 1000));
  const recentQuery = query(
    collection(db, REDEMPTIONS_COL),
    where("userId", "==", userId),
    where("createdAt", ">", oneDayAgo)
  );
  const recentSnap = await getDocs(recentQuery);
  if (!recentSnap.empty) {
    return { valid: false, error: "Cooldown active — try again after 24 hours" };
  }

  return { valid: true };
}

/**
 * Mark a redemption as processed by admin.
 * @param {string} redemptionId
 * @param {"approved"|"rejected"} status
 * @param {string} [reason]
 */
export async function processRedemption(redemptionId, status, reason = "") {
  const ref = doc(db, REDEMPTIONS_COL, redemptionId);
  await updateDoc(ref, {
    status,
    processedAt: Timestamp.now(),
    ...(reason && { reason }),
  });
}
