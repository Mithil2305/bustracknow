import { useEffect } from "react";
import { useBusStore } from "../store/busStore";

/**
 * Live buses hook.
 * Expected store shape (adjust if different):
 * - state: { buses, loading, error, lastUpdated }
 * - actions: fetchLive(), startPolling(intervalMs), stopPolling()
 */
export function useLiveBuses({ auto = true, pollInterval = 15000 } = {}) {
	const buses = useBusStore((s) => s.buses || []);
	const loading = useBusStore((s) => s.loading);
	const error = useBusStore((s) => s.error);
	const lastUpdated = useBusStore((s) => s.lastUpdated);

	const fetchLive = useBusStore((s) => s.fetchLive);
	const startPolling = useBusStore((s) => s.startPolling);
	const stopPolling = useBusStore((s) => s.stopPolling);

	useEffect(() => {
		if (auto && fetchLive && !loading) {
			fetchLive();
		}
	}, [auto, fetchLive, loading]);

	useEffect(() => {
		if (auto && startPolling && stopPolling) {
			startPolling(pollInterval);
			return () => stopPolling();
		}
	}, [auto, pollInterval, startPolling, stopPolling]);

	return {
		buses,
		loading,
		error,
		lastUpdated,
		refresh: fetchLive,
	};
}

export default useLiveBuses;
