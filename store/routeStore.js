import { create } from "zustand";
import { FirestoreService } from "../services/firebase/firestoreService";

/**
 * store/routeStore.js
 * Manages static route data with a 5-minute TTL client-side cache.
 */

const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

const useRouteStore = create((set, get) => ({
  routes: [],
  filteredRoutes: [],
  selectedRoute: null,
  loading: false,
  error: null,
  lastFetched: null,

  // ── Actions ────────────────────────────────────────────────────

  /** Fetch all routes from Firestore, respecting TTL cache */
  fetchRoutes: async () => {
    const { loading, lastFetched, routes } = get();
    if (loading) return;

    // Return cached data if still fresh
    const isFresh = lastFetched && Date.now() - lastFetched < CACHE_TTL_MS;
    if (isFresh && routes.length > 0) return;

    set({ loading: true, error: null });
    try {
      const data = await FirestoreService.getAllRoutes();
      set({
        routes: data,
        filteredRoutes: data,
        loading: false,
        lastFetched: Date.now(),
        error: null,
      });
    } catch (err) {
      set({ loading: false, error: err.message || "Failed to load routes" });
    }
  },

  /** Force re-fetch bypassing the TTL */
  invalidate: () => {
    set({ lastFetched: null });
    get().fetchRoutes();
  },

  setRoutes: (routes) => set({ routes, filteredRoutes: routes }),

  selectRoute: (route) => set({ selectedRoute: route }),

  clearSelection: () => set({ selectedRoute: null }),

  /**
   * Client-side search across number, name, origin, destination, and stops.
   * Pass empty/null query to reset to full list.
   */
  searchRoutes: (query) => {
    const { routes } = get();
    if (!query || !query.trim()) {
      set({ filteredRoutes: routes });
      return;
    }
    const q = query.toLowerCase().trim();
    const filtered = routes.filter((r) => {
      if (r.number?.toLowerCase().includes(q)) return true;
      if (r.name?.toLowerCase().includes(q)) return true;
      if (r.origin?.toLowerCase().includes(q)) return true;
      if (r.destination?.toLowerCase().includes(q)) return true;
      if (r.stops?.some((s) => s.toLowerCase().includes(q))) return true;
      return false;
    });
    set({ filteredRoutes: filtered });
  },
}));

export { useRouteStore };
export default useRouteStore;
