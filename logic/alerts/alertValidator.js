import { collection, doc, getDoc, getDocs, query, Timestamp, where } from "firebase/firestore";
import { db } from "../../services/firebase/firebaseConfig";

const ALERTS_COL = "alerts";

/** Allowed alert types */
const VALID_TYPES = ["delay", "breakdown", "safety", "route_change", "crowding", "other"];

/** Max alerts a user can create per day */
const MAX_DAILY_ALERTS = 10;

/**
 * Validate an alert before creation.
 * @param {{ userId: string, type: string, routeId: string, message: string, location?: object }} alert
 * @returns {{ valid: boolean, error?: string }}
 */
export async function validateAlert(alert) {
  const { userId, type, routeId, message } = alert;

  if (!userId || !type || !routeId) {
    return { valid: false, error: "Missing required fields (userId, type, routeId)" };
  }

  if (!VALID_TYPES.includes(type)) {
    return { valid: false, error: `Invalid alert type. Must be one of: ${VALID_TYPES.join(", ")}` };
  }

  if (!message || message.trim().length < 5) {
    return { valid: false, error: "Alert message must be at least 5 characters" };
  }

  if (message.length > 500) {
    return { valid: false, error: "Alert message must not exceed 500 characters" };
  }

  // Rate limit: max daily alerts
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);
  const dailyQuery = query(
    collection(db, ALERTS_COL),
    where("userId", "==", userId),
    where("createdAt", ">=", Timestamp.fromDate(startOfDay))
  );
  const dailySnap = await getDocs(dailyQuery);
  if (dailySnap.size >= MAX_DAILY_ALERTS) {
    return { valid: false, error: `Daily alert limit reached (${MAX_DAILY_ALERTS})` };
  }

  return { valid: true };
}

/**
 * Check if an alert is still relevant (not expired, not resolved).
 * @param {string} alertId
 * @returns {Promise<boolean>}
 */
export async function isAlertActive(alertId) {
  const ref = doc(db, ALERTS_COL, alertId);
  const snap = await getDoc(ref);
  if (!snap.exists()) return false;

  const data = snap.data();
  if (data.resolved) return false;

  // Auto-expire after 4 hours
  const createdAt = data.createdAt?.toDate?.();
  if (createdAt && Date.now() - createdAt.getTime() > 4 * 60 * 60 * 1000) {
    return false;
  }

  return true;
}
