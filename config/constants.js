/**
 * config/constants.js
 * Application-wide constants for configuration, timeouts, and default values.
 */

export const APP_CONFIG = {
	NAME: "BusTrackNow",
	VERSION: "1.0.0",
	SUPPORT_EMAIL: "support@bustracknow.com",
};

// Map default settings (e.g., center of the city the app serves)
export const MAP_DEFAULTS = {
	INITIAL_REGION: {
		latitude: 19.076, // Example: Mumbai coordinates
		longitude: 72.8777,
		latitudeDelta: 0.0922,
		longitudeDelta: 0.0421,
	},
	ZOOM_LEVEL: 15,
};

// Location tracking settings
export const TRACKING_CONFIG = {
	UPDATE_INTERVAL_MS: 3000, // Update location every 3 seconds
	DISTANCE_FILTER_METERS: 10, // Update if moved by 10 meters
	BACKGROUND_FETCH_INTERVAL: 15, // Minutes (for background tasks if any)
};

// User Roles
export const USER_ROLES = {
	ADMIN: "admin", // Can manage routes, stops, and users
	CONTRIBUTOR: "contributor", // Can broadcast location
	VIEWER: "viewer", // Read-only access
};

// Collection Names (Firestore)
export const COLLECTIONS = {
	USERS: "users",
	ROUTES: "routes",
	STOPS: "stops",
	CONTRIBUTIONS: "contributions",
	FEEDBACK: "feedback",
};

// Realtime DB Paths
export const REALTIME_PATHS = {
	BUS_LOCATIONS: "buses",
	ACTIVE_BROADCASTS: "active_broadcasts",
};

export const ERROR_MESSAGES = {
	LOCATION_PERMISSION_DENIED: "Location permission is required to track buses.",
	NETWORK_ERROR:
		"Unable to connect to server. Please check your internet connection.",
	AUTH_REQUIRED: "You must be logged in to perform this action.",
};
