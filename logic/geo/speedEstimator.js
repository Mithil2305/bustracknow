import { haversineDistance } from "./distanceCalculator";

/**
 * Estimate speed (m/s) from ordered samples [{lat,lng,timestamp}]
 */
export function estimateSpeed(samples = []) {
	if (!Array.isArray(samples) || samples.length < 2) return 0;

	let dist = 0;
	let dt = 0;

	for (let i = 1; i < samples.length; i++) {
		const prev = samples[i - 1];
		const curr = samples[i];
		if (!prev?.timestamp || !curr?.timestamp) continue;
		const deltaT = (curr.timestamp - prev.timestamp) / 1000; // seconds
		if (deltaT <= 0) continue;
		dist += haversineDistance(
			{ lat: prev.lat, lng: prev.lng },
			{ lat: curr.lat, lng: curr.lng },
		);
		dt += deltaT;
	}
	return dt > 0 ? dist / dt : 0; // m/s
}
