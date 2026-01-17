import { useEffect } from "react";
import { useRouteStore } from "../store/routeStore";

/**
 * Routes cache hook.
 * Expected store shape (adjust if different):
 * - state: { routes, loading, error, lastFetched }
 * - actions: fetchRoutes(), invalidate()
 */
export function useCachedRoutes({ auto = true } = {}) {
	const routes = useRouteStore((s) => s.routes || []);
	const loading = useRouteStore((s) => s.loading);
	const error = useRouteStore((s) => s.error);
	const lastFetched = useRouteStore((s) => s.lastFetched);
	const fetchRoutes = useRouteStore((s) => s.fetchRoutes);
	const invalidate = useRouteStore((s) => s.invalidate);

	useEffect(() => {
		if (auto && fetchRoutes && !routes?.length && !loading) {
			fetchRoutes();
		}
	}, [auto, fetchRoutes, routes?.length, loading]);

	return {
		routes,
		loading,
		error,
		lastFetched,
		refresh: fetchRoutes,
		invalidate,
	};
}

export default useCachedRoutes;
