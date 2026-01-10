import { logEvent } from 'firebase/analytics';
import { analytics } from '../firebase/firebaseConfig';

/**
 * Wrapper for Analytics to track user behavior and app performance.
 * Useful for the "Ad metrics" mentioned in the PDF.
 */
export const EventTracker = {
  
  /**
   * Track when a user starts a bus trip contribution
   */
  trackBroadcastStart: async (routeId) => {
    if (analytics) {
      await logEvent(analytics, 'broadcast_start', {
        route_id: routeId,
        timestamp: Date.now()
      });
    }
  },

  /**
   * Track when a user actively stops broadcasting
   */
  trackBroadcastStop: async (durationSeconds) => {
    if (analytics) {
      await logEvent(analytics, 'broadcast_stop', {
        duration: durationSeconds
      });
    }
  },

  /**
   * Track searches to understand demand
   */
  trackRouteSearch: async (searchTerm) => {
    if (analytics) {
      await logEvent(analytics, 'search', {
        search_term: searchTerm
      });
    }
  },

  /**
   * Track screen views manually if needed (Expo Router usually handles this, 
   * but good for specific states like "God Mode")
   */
  trackScreenView: async (screenName) => {
    if (analytics) {
      await logEvent(analytics, 'screen_view', {
        firebase_screen: screenName,
        firebase_screen_class: screenName
      });
    }
  }
};