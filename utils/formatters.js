/**
 * Display formatters used across the app.
 */

/**
 * Format a number with commas (e.g., 1,234).
 * @param {number} num
 * @returns {string}
 */
export function formatNumber(num) {
  if (num == null) return "0";
  return num.toLocaleString("en-IN");
}

/**
 * Format points with + prefix (e.g., +150).
 * @param {number} points
 * @returns {string}
 */
export function formatPoints(points) {
  if (points == null) return "0";
  return points > 0 ? `+${formatNumber(points)}` : formatNumber(points);
}

/**
 * Format distance in meters to human readable string.
 * @param {number} meters
 * @returns {string}
 */
export function formatDistance(meters) {
  if (meters == null) return "—";
  if (meters < 1000) return `${Math.round(meters)} m`;
  return `${(meters / 1000).toFixed(1)} km`;
}

/**
 * Format a Firestore Timestamp or Date to relative time (e.g., "2h ago").
 * @param {Date|{ toDate: () => Date }} timestamp
 * @returns {string}
 */
export function formatRelativeTime(timestamp) {
  const date = timestamp?.toDate ? timestamp.toDate() : timestamp;
  if (!date) return "—";

  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);

  if (seconds < 60) return "Just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;

  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
  });
}

/**
 * Format speed in m/s to km/h.
 * @param {number} mps - meters per second
 * @returns {string}
 */
export function formatSpeed(mps) {
  if (mps == null) return "— km/h";
  return `${Math.round(mps * 3.6)} km/h`;
}

/**
 * Truncate text to a max length with ellipsis.
 * @param {string} text
 * @param {number} max
 * @returns {string}
 */
export function truncate(text, max = 100) {
  if (!text) return "";
  return text.length > max ? text.slice(0, max - 1) + "…" : text;
}
