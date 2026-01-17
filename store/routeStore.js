import { create } from "zustand";

/**
 * store/routeStore.js
 * Manages static route data, caching, and search selection.
 */
const useRouteStore = create((set, get) => ({
	routes: [], // Array of all available routes
	stops: [], // Array of all stops
	filteredRoutes: [], // Search results
	selectedRoute: null, // The route currently being viewed on map
	loading: false,
	lastSyncTimestamp: null,

	// Actions
	setRoutes: (routes) => set({ routes, filteredRoutes: routes }),

	setStops: (stops) => set({ stops }),

	selectRoute: (route) => set({ selectedRoute: route }),

	clearSelection: () => set({ selectedRoute: null }),

	searchRoutes: (query) => {
		const { routes } = get();
		if (!query) {
			set({ filteredRoutes: routes });
			return;
		}

		const lowerQuery = query.toLowerCase();
		const filtered = routes.filter(
			(route) =>
				route.name.toLowerCase().includes(lowerQuery) ||
				route.number.toLowerCase().includes(lowerQuery),
		);
		set({ filteredRoutes: filtered });
	},

	setLoading: (loading) => set({ loading }),
}));

export default useRouteStore;
