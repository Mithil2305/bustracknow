import { haversineDistance } from "./distanceCalculator";

/**
 * Finds the closest point on a polyline to a given coordinate.
 * @returns {Object} { closestPoint: {lat,lng}, distanceMeters, segmentIndex }
 */
export function matchToPolyline(point, polyline = []) {
	if (!point || !polyline.length)
		return { closestPoint: null, distanceMeters: Infinity, segmentIndex: -1 };

	let best = { closestPoint: null, distanceMeters: Infinity, segmentIndex: -1 };

	for (let i = 0; i < polyline.length - 1; i++) {
		const a = polyline[i];
		const b = polyline[i + 1];
		const proj = projectPointToSegment(point, a, b);
		const d = haversineDistance(point, proj);
		if (d < best.distanceMeters) {
			best = { closestPoint: proj, distanceMeters: d, segmentIndex: i };
		}
	}
	return best;
}

// Simple projection using planar approximation for short distances.
function projectPointToSegment(p, a, b) {
	const toXY = ({ lat, lng }) => ({ x: lng, y: lat });
	const pa = toXY(a);
	const pb = toXY(b);
	const pp = toXY(p);

	const dx = pb.x - pa.x;
	const dy = pb.y - pa.y;
	const len2 = dx * dx + dy * dy;
	if (len2 === 0) return a;

	const t = Math.max(
		0,
		Math.min(1, ((pp.x - pa.x) * dx + (pp.y - pa.y) * dy) / len2),
	);
	return { lat: pa.y + t * dy, lng: pa.x + t * dx };
}
