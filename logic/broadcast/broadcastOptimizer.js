// Deduplicate and throttle broadcast payloads before sending to listeners.
export function optimizeBroadcastPayload(
	events,
	{ maxPerBus = 1, maxAgeMs = 60_000 } = {},
) {
	if (!Array.isArray(events)) return [];

	const now = Date.now();
	const byBus = new Map();

	for (const evt of events) {
		if (!evt || !evt.busId) continue;
		const ageOk = evt.timestamp ? now - evt.timestamp <= maxAgeMs : true;
		if (!ageOk) continue;

		const list = byBus.get(evt.busId) || [];
		list.push(evt);
		byBus.set(evt.busId, list);
	}

	const optimized = [];
	for (const [, list] of byBus) {
		const sorted = list.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
		optimized.push(...sorted.slice(0, maxPerBus));
	}
	return optimized;
}
