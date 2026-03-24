/**
 * Lightweight event tracker.
 * Uses console logging only — no Firebase Analytics (removed).
 * Replace with a custom backend endpoint if needed in production.
 */
export const EventTracker = {
  trackBroadcastStart: async (routeId) => {
    console.log("[Analytics] broadcast_start", { route_id: routeId, timestamp: Date.now() });
  },

  trackBroadcastStop: async (durationSeconds) => {
    console.log("[Analytics] broadcast_stop", { duration: durationSeconds });
  },

  trackRouteSearch: async (searchTerm) => {
    console.log("[Analytics] search", { search_term: searchTerm });
  },

  trackScreenView: async (screenName) => {
    console.log("[Analytics] screen_view", { screen: screenName });
  },
};
