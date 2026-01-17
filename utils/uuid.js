/**
 * utils/uuid.js
 * Simple UUID v4 generator for frontend-generated keys.
 */

export const generateUUID = () => {
	// If crypto.randomUUID is available (modern environments), use it.
	if (typeof crypto !== "undefined" && crypto.randomUUID) {
		return crypto.randomUUID();
	}

	// Fallback for environments without crypto support
	return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
		const r = (Math.random() * 16) | 0;
		const v = c === "x" ? r : (r & 0x3) | 0x8;
		return v.toString(16);
	});
};
