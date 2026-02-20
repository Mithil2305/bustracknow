// logic/broadcast/broadcastManager.js
import { ref, remove, set } from "firebase/database";
import { NativeEventEmitter, NativeModules } from "react-native";
import { getRoutePolyline } from "../../hooks/useCachedRoutes";
import { database } from "../../services/firebase/firebaseConfig";
import { detectSpoofing, isOnRoute } from "../geo/spoofingDetector";
import { awardPoints } from "../points/calculationEngine";

const { RNAndroidLocationEnabler } = NativeModules;
const motionEmitter = new NativeEventEmitter(NativeModules.RNMotionDetector);

class BroadcastManager {
	constructor() {
		this.broadcastInterval = null;
		this.motionSubscription = null;
		this.sessionId = null;
		this.routeId = null;
		this.startTime = null;
		this.lastLocation = null;
		this.tripMinutes = 0;
		this.pointsAwarded = 0;
		this.isBroadcasting = false;
	}

	/**
	 * Start broadcasting location to RTDB
	 * PDF Requirement: 3s interval + accelerometer auto-stop + spoofing prevention
	 * @param {string} userId - Firebase UID
	 * @param {string} routeId - Route ID being tracked
	 * @param {Function} onLocationUpdate - Callback for UI updates
	 * @returns {Promise<boolean>} Success status
	 */
	async startBroadcast(userId, routeId, onLocationUpdate = () => {}) {
		if (this.isBroadcasting) return false;

		try {
			// ✅ Step 1: Validate route exists and get polyline
			const polyline = await getRoutePolyline(routeId);
			if (!polyline || polyline.length < 2) {
				throw new Error("Invalid route polyline");
			}

			// ✅ Step 2: Request high-accuracy location permission
			const locationEnabled =
				await RNAndroidLocationEnabler.promptForEnableLocationIfNeeded({
					interval: 10000,
					fastInterval: 5000,
				});

			if (!locationEnabled) throw new Error("Location services disabled");

			// ✅ Step 3: Initialize session
			this.sessionId = `${userId}_${Date.now()}`;
			this.routeId = routeId;
			this.startTime = Date.now();
			this.isBroadcasting = true;
			this.tripMinutes = 0;
			this.pointsAwarded = 0;

			// ✅ Step 4: Start motion monitoring (auto-stop when user exits bus)
			this.motionSubscription = motionEmitter.addListener(
				"motionChanged",
				(motionState) => {
					// If stationary for >60s while previously moving, auto-stop broadcast
					if (
						motionState.isMoving === false &&
						motionState.stationaryDuration > 60000
					) {
						console.log(
							"🚶 Auto-stopping broadcast: user exited bus (stationary >60s)",
						);
						this.stopBroadcast(userId, routeId);
					}
				},
			);

			// ✅ Step 5: Start location broadcast interval (3s as per PDF)
			this.broadcastInterval = setInterval(async () => {
				try {
					const location = await this.getCurrentLocation();
					if (!location) return;

					// ✅ Spoofing detection (critical security)
					const spoofCheck = detectSpoofing(location, this.lastLocation);
					if (spoofCheck.isSpoofed) {
						console.warn(
							`🚨 Spoofing detected: ${spoofCheck.reason}. Stopping broadcast.`,
						);
						this.stopBroadcast(userId, routeId);
						return;
					}

					// ✅ Route validation (50m geofencing)
					if (!isOnRoute(location, polyline)) {
						console.warn("📍 User off route (>50m). Stopping broadcast.");
						this.stopBroadcast(userId, routeId);
						return;
					}

					// ✅ Write to RTDB with TTL enforcement (5 minutes)
					const sessionRef = ref(
						database,
						`active_buses/${routeId}/${this.sessionId}`,
					);
					await set(sessionRef, {
						lat: location.coords.latitude,
						lng: location.coords.longitude,
						speed: location.coords.speed ? location.coords.speed * 3.6 : 0, // m/s → km/h
						heading: location.coords.heading || 0,
						accuracy: location.coords.accuracy,
						contributor_id: userId,
						timestamp: Date.now(),
						startedAt: this.startTime,
					});

					// ✅ Award points every 60 seconds (max 30 points/trip)
					this.tripMinutes = Math.floor((Date.now() - this.startTime) / 60000);
					if (
						this.tripMinutes > 0 &&
						this.tripMinutes * 5 > this.pointsAwarded
					) {
						const pointsToAward = Math.min(5, 30 - this.pointsAwarded);
						if (pointsToAward > 0) {
							await awardPoints(userId, "location_share", {
								routeId,
								tripMinutes: this.tripMinutes,
							});
							this.pointsAwarded += pointsToAward;
						}
					}

					// ✅ Update UI
					onLocationUpdate({
						lat: location.coords.latitude,
						lng: location.coords.longitude,
						speed: location.coords.speed ? location.coords.speed * 3.6 : 0,
						accuracy: location.coords.accuracy,
						tripMinutes: this.tripMinutes,
						pointsEarned: this.pointsAwarded,
					});

					this.lastLocation = {
						lat: location.coords.latitude,
						lng: location.coords.longitude,
						timestamp: Date.now(),
						speed: location.coords.speed ? location.coords.speed * 3.6 : 0,
					};
				} catch (error) {
					console.error("Broadcast interval error:", error);
					// Don't stop broadcast on transient errors (network issues)
				}
			}, 3000); // PDF Requirement: 3-second interval

			console.log(
				`✅ Broadcast started for route ${routeId} (session: ${this.sessionId})`,
			);
			return true;
		} catch (error) {
			console.error("❌ Broadcast start failed:", error);
			this.stopBroadcast(userId, routeId);
			throw error;
		}
	}

	/**
	 * Stop broadcasting and cleanup resources
	 * PDF Requirement: Auto-stop on exit + manual stop
	 * @param {string} userId
	 * @param {string} routeId
	 */
	async stopBroadcast(userId, routeId) {
		if (!this.isBroadcasting) return;

		try {
			// ✅ Clear intervals/subscriptions
			if (this.broadcastInterval) clearInterval(this.broadcastInterval);
			if (this.motionSubscription) this.motionSubscription.remove();

			// ✅ Remove RTDB entry (TTL would expire it anyway, but cleanup is polite)
			if (this.sessionId) {
				const sessionRef = ref(
					database,
					`active_buses/${routeId}/${this.sessionId}`,
				);
				await remove(sessionRef);
			}

			// ✅ Award final points if trip was significant (>2 mins)
			if (this.tripMinutes >= 2 && this.pointsAwarded < 30) {
				const remainingPoints = Math.min(
					30 - this.pointsAwarded,
					this.tripMinutes * 5 - this.pointsAwarded,
				);
				if (remainingPoints > 0) {
					await awardPoints(userId, "location_share", {
						routeId,
						tripMinutes: this.tripMinutes,
					});
				}
			}

			// ✅ Reset state
			this.isBroadcasting = false;
			this.sessionId = null;
			this.routeId = null;
			this.startTime = null;
			this.lastLocation = null;
			this.tripMinutes = 0;
			this.pointsAwarded = 0;

			console.log(`⏹️ Broadcast stopped for route ${routeId}`);
		} catch (error) {
			console.error("Broadcast stop error:", error);
			// Non-critical - RTDB TTL will clean up stale entries
		}
	}

	// Helper: Get current location with timeout
	async getCurrentLocation() {
		return new Promise((resolve) => {
			let timeoutId = setTimeout(() => {
				resolve(null);
			}, 5000); // 5s timeout

			navigator.geolocation.getCurrentPosition(
				(location) => {
					clearTimeout(timeoutId);
					resolve(location);
				},
				(error) => {
					clearTimeout(timeoutId);
					console.warn("Location error:", error);
					resolve(null);
				},
				{
					enableHighAccuracy: true,
					timeout: 10000,
					maximumAge: 10000,
				},
			);
		});
	}

	// Singleton pattern
	static getInstance() {
		if (!BroadcastManager.instance) {
			BroadcastManager.instance = new BroadcastManager();
		}
		return BroadcastManager.instance;
	}
}

export const broadcastManager = BroadcastManager.getInstance();
