// config/constants.js
export const APP_CONSTANTS = {
	// ✅ Points System (PDF Section 6)
	POINTS: {
		LOCATION_SHARE_PER_MIN: 5,
		LOCATION_SHARE_MAX_PER_TRIP: 30,
		STOP_CONFIRM: 2,
		ALERT_FULL: 10,
		ALERT_LATE: 8,
		ALERT_NOT_RUNNING: 15,
		STREAK_3DAY: 30,
		STREAK_7DAY: 50,
		STREAK_30DAY: 200,
		REFERRAL: 100,
		FIRST_CONTRIBUTION: 50,
		MIN_REDEMPTION_POINTS: 10000, // ₹100
		POINTS_TO_INR_RATIO: 100, // 100 points = ₹1
		DAILY_ALERT_LIMIT: 1,
		MIN_STOPS_FOR_POINTS: 2,
	},

	// ✅ Geofencing (PDF Architecture)
	GEOFENCE: {
		MAX_DISTANCE_TO_ROUTE_M: 50, // meters
		SPOOFING_MAX_SPEED_KMH: 120,
		SPOOFING_MAX_JUMP_M: 500,
		SPOOFING_MAX_JUMP_MS: 3000,
		AUTO_STOP_STATIONARY_MS: 60000, // 60 seconds
	},

	// ✅ Broadcast (PDF Architecture)
	BROADCAST: {
		INTERVAL_MS: 3000, // 3 seconds
		TTL_MS: 300000, // 5 minutes
		MIN_ACCURACY_M: 50,
	},

	// ✅ UI/UX (PDF Design Tokens)
	COLORS: {
		PRIMARY: "#0D9488", // Teal (brand)
		SECONDARY: "#2563EB", // Blue (actions)
		SUCCESS: "#10B981", // Green (positive)
		WARNING: "#F59E0B", // Amber (alerts)
		DANGER: "#EF4444", // Red (errors)
		OFFLINE: "#64748B", // Gray (offline state)
	},

	// ✅ App Limits (PDF Scalability)
	LIMITS: {
		MAX_CONCURRENT_BUSES: 100, // Firebase Spark Plan limit
		MAX_ROUTES_CACHED: 200,
		MAX_ALERTS_PER_DAY: 10,
		MIN_REDEMPTION_AMOUNT: 100, // ₹100
	},
};
