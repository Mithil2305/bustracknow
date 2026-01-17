/**
 * config/permissions.js
 * Helper functions to handle device permissions, primarily for Location services.
 */
import * as Location from "expo-location";
import { Alert, Linking } from "react-native";

/**
 * Requests foreground location permission.
 * Returns boolean indicating success.
 */
export const requestLocationPermission = async () => {
	try {
		const { status } = await Location.requestForegroundPermissionsAsync();

		if (status !== "granted") {
			Alert.alert(
				"Permission Denied",
				"BusTrackNow needs location access to show you nearby stops and buses. Please enable it in settings.",
				[
					{ text: "Cancel", style: "cancel" },
					{ text: "Open Settings", onPress: () => Linking.openSettings() },
				],
			);
			return false;
		}
		return true;
	} catch (error) {
		console.error("Error requesting location permission:", error);
		return false;
	}
};

/**
 * Checks current permission status without requesting.
 */
export const checkLocationPermission = async () => {
	try {
		const { status } = await Location.getForegroundPermissionsAsync();
		return status === "granted";
	} catch (error) {
		console.error("Error checking location permission:", error);
		return false;
	}
};

/**
 * For background location updates (if needed for Contributors/Drivers).
 */
export const requestBackgroundLocationPermission = async () => {
	try {
		// Background permissions usually require foreground to be granted first
		const foregroundGranted = await requestLocationPermission();
		if (!foregroundGranted) return false;

		const { status } = await Location.requestBackgroundPermissionsAsync();

		if (status !== "granted") {
			Alert.alert(
				"Background Location Required",
				'To broadcast bus location while the app is in background, please select "Allow all the time".',
				[
					{ text: "Cancel", style: "cancel" },
					{ text: "Open Settings", onPress: () => Linking.openSettings() },
				],
			);
			return false;
		}
		return true;
	} catch (error) {
		console.error("Error requesting background location permission:", error);
		return false;
	}
};
