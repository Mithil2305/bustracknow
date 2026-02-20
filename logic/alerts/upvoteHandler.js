import { arrayRemove, arrayUnion, doc, getDoc, increment, updateDoc } from "firebase/firestore";
import { db } from "../../services/firebase/firebaseConfig";
import { awardPoints } from "../points/calculationEngine";

const ALERTS_COL = "alerts";

/**
 * Upvote an alert.
 * @param {string} alertId
 * @param {string} userId
 * @returns {Promise<{ success: boolean, error?: string }>}
 */
export async function upvoteAlert(alertId, userId) {
  const alertRef = doc(db, ALERTS_COL, alertId);
  const snap = await getDoc(alertRef);

  if (!snap.exists()) {
    return { success: false, error: "Alert not found" };
  }

  const data = snap.data();

  // Prevent self-upvote
  if (data.userId === userId) {
    return { success: false, error: "Cannot upvote your own alert" };
  }

  // Prevent duplicate upvote
  if (data.upvotedBy?.includes(userId)) {
    return { success: false, error: "Already upvoted" };
  }

  await updateDoc(alertRef, {
    upvotes: increment(1),
    upvotedBy: arrayUnion(userId),
  });

  // Award points to the alert creator when threshold reached
  const newUpvotes = (data.upvotes || 0) + 1;
  if (newUpvotes === 3) {
    await awardPoints(data.userId, "alert_validated", { alertId });
  }

  return { success: true };
}

/**
 * Remove an upvote from an alert.
 * @param {string} alertId
 * @param {string} userId
 */
export async function removeUpvote(alertId, userId) {
  const alertRef = doc(db, ALERTS_COL, alertId);
  await updateDoc(alertRef, {
    upvotes: increment(-1),
    upvotedBy: arrayRemove(userId),
  });
}
