// logic/geo/spoofingDetector.js
import { haversineDistance } from "./distanceCalculator";

/**
 * Detect GPS spoofing using multi-factor validation
 * @param {Object} current - { lat, lng, timestamp, speed, accuracy }
 * @param {Object|null} previous - Previous valid location
 * @returns {Object} { isSpoofed: boolean, reason: string }
 */
export const detectSpoofing = (current, previous) => {
	// Rule 1: Impossible speed (>120 km/h for city buses)
	if (current.speed > 120) {
		return {
			isSpoofed: true,
			reason: `Impossible speed: ${current.speed.toFixed(1)} km/h`,
		};
	}

	// Rule 2: Teleportation (location jump >500m in <3s)
	if (previous && current.timestamp && previous.timestamp) {
		const timeDiffMs = current.timestamp - previous.timestamp;
		const distanceM = haversineDistance(
			{ lat: previous.lat, lng: previous.lng },
			{ lat: current.lat, lng: current.lng },
		);

		if (timeDiffMs < 3000 && distanceM > 500) {
			return {
				isSpoofed: true,
				reason: `Teleportation: ${distanceM.toFixed(0)}m in ${timeDiffMs}ms`,
			};
		}

		// Rule 3: Speed anomaly (calculated vs reported)
		if (timeDiffMs > 1000) {
			const calcSpeed = (distanceM / (timeDiffMs / 1000)) * 3.6;
			if (Math.abs(calcSpeed - current.speed) > 30 && calcSpeed > 5) {
				return {
					isSpoofed: true,
					reason: `Speed mismatch: reported ${current.speed.toFixed(1)} vs calc ${calcSpeed.toFixed(1)} km/h`,
				};
			}
		}
	}

	// Rule 4: Poor accuracy + high speed combo
	if (current.accuracy > 100 && current.speed > 30) {
		return {
			isSpoofed: true,
			reason: `Low accuracy (${current.accuracy.toFixed(0)}m) with high speed`,
		};
	}

	return { isSpoofed: false, reason: null };
};

/**
 * Validate location is on route polyline (50m geofencing)
 * @param {{lat: number, lng: number}} location
 * @param {Array<{lat: number, lng: number}>} polyline
 * @returns {boolean}
 */
export const isOnRoute = (location, polyline, maxDistanceM = 50) => {
	if (!polyline || polyline.length < 2) return false;

	let minDistance = Infinity;
	for (let i = 0; i < polyline.length - 1; i++) {
		const dist = distanceToSegment(location, polyline[i], polyline[i + 1]);
		minDistance = Math.min(minDistance, dist);
		if (minDistance <= maxDistanceM) return true;
	}
	return minDistance <= maxDistanceM;
};

// Helper: Distance from point to line segment (meters)
const distanceToSegment = (p, a, b) => {
	const A = p.lat - a.lat;
	const B = p.lng - a.lng;
	const C = b.lat - a.lat;
	const D = b.lng - a.lng;

	const dot = A * C + B * D;
	const lenSq = C * C + D * D;
	const param = lenSq !== 0 ? dot / lenSq : -1;

	let xx, yy;
	if (param < 0) {
		xx = a.lat;
		yy = a.lng;
	} else if (param > 1) {
		xx = b.lat;
		yy = b.lng;
	} else {
		xx = a.lat + param * C;
		yy = a.lng + param * D;
	}

	const dx = p.lat - xx;
	const dy = p.lng - yy;
	return Math.sqrt(dx * dx + dy * dy) * 111000; // Degrees to meters
};
