let intervalRef = null;

/**
 * Starts periodic broadcasting of live bus positions.
 * @param {Function} fetchFn async function returning array of events
 * @param {Function} publishFn function to publish optimized events
 * @param {Object} opts { intervalMs }
 */
export function startBroadcast(
	fetchFn,
	publishFn,
	{ intervalMs = 15_000 } = {},
) {
	if (intervalRef) return intervalRef; // already running
	if (typeof fetchFn !== "function" || typeof publishFn !== "function") {
		throw new Error("fetchFn and publishFn are required");
	}
	intervalRef = setInterval(async () => {
		try {
			const events = await fetchFn();
			publishFn(events);
		} catch (err) {
			console.warn("broadcast tick failed:", err?.message || err);
		}
	}, intervalMs);
	return intervalRef;
}
