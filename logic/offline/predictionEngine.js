import { estimateSpeed } from "../geo/speedEstimator";

/**
 * Predict next position given recent samples and heading (very lightweight).
 * Uses constant-velocity extrapolation.
 * @param {Array} samples [{lat,lng,timestamp}]
 * @param {number} horizonSec prediction horizon
 * @returns {{lat,lng}} predicted coordinate
 */
export function predictNextPosition(samples = [], horizonSec = 15) {
	if (!samples.length) return null;
	const speed = estimateSpeed(samples); // m/s
	const last = samples[samples.length - 1];
	if (!last?.lat || !last?.lng) return last || null;

	// naive displacement northward scaled by speed (no bearing, minimal calc)
	const earthRadiusM = 6371e3;
	const deltaLat = ((speed * horizonSec) / earthRadiusM) * (180 / Math.PI);

	return { lat: last.lat + deltaLat, lng: last.lng };
}
