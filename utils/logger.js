/**
 * utils/logger.js
 * consistent logging interface that can be disabled in production.
 */

const isDev = process.env.NODE_ENV === "development";

const logger = {
	info: (message, ...args) => {
		if (isDev) {
			console.log(`[INFO] ${message}`, ...args);
		}
	},

	warn: (message, ...args) => {
		if (isDev) {
			console.warn(`[WARN] ${message}`, ...args);
		}
	},

	error: (message, error) => {
		// In production, this might send data to Sentry or Crashlytics
		console.error(`[ERROR] ${message}`, error);
	},

	debug: (message, data) => {
		if (isDev) {
			console.debug(`[DEBUG] ${message}`, data);
		}
	},
};

export default logger;
