/**
 * Aggregate trust scores and majority confidence for a set of reports.
 * @param {Array} reports [{ value, trustScore (0-1) }]
 * @returns {{value: any, confidence: number, avgTrust: number}}
 */
export function crowdValidate(reports = []) {
	if (!reports.length) return { value: null, confidence: 0, avgTrust: 0 };

	const trustSum = reports.reduce((acc, r) => acc + (r.trustScore ?? 0.5), 0);
	const avgTrust = trustSum / reports.length;

	// Majority vote weighted by trust
	const tally = new Map();
	for (const r of reports) {
		const key = r.value;
		const weight = r.trustScore ?? 0.5;
		tally.set(key, (tally.get(key) || 0) + weight);
	}

	let best = { value: null, weight: -Infinity };
	for (const [val, weight] of tally.entries()) {
		if (weight > best.weight) best = { value: val, weight };
	}

	const totalWeight =
		Array.from(tally.values()).reduce((a, b) => a + b, 0) || 1;
	const confidence = best.weight / totalWeight;

	return { value: best.value, confidence, avgTrust };
}
