import { 
  ref, 
  set, 
  onValue, 
  off, 
  remove, 
  update,
  serverTimestamp
} from 'firebase/database';
import { rtdb } from './firebaseConfig';

/**
 * Handles ephemeral, high-frequency live tracking data.
 */
export const RealtimeService = {

  /**
   * Broadcast User Location
   * Writes to /active_buses/{routeID}/{busID}
   * @param {string} routeId - The route the user is contributing to
   * @param {string} busSessionId - Unique ID for this specific trip
   * @param {Object} data - { lat, long, speed, heading, contributor_id }
   */
  broadcastLocation: async (routeId, busSessionId, data) => {
    try {
      const busRef = ref(rtdb, `active_buses/${routeId}/${busSessionId}`);
      
      // We update rather than set to preserve creation metadata if needed
      // Adding timestamp server-side to prevent client clock skew issues
      await update(busRef, {
        ...data,
        last_updated: serverTimestamp()
      });
    } catch (error) {
      console.error("Error broadcasting location:", error);
      // Don't throw here to prevent app crash on minor network blip, 
      // but maybe log to analytics
    }
  },

  /**
   * Stop Broadcast
   * Removes the node from RTDB
   */
  stopBroadcast: async (routeId, busSessionId) => {
    try {
      const busRef = ref(rtdb, `active_buses/${routeId}/${busSessionId}`);
      await remove(busRef);
    } catch (error) {
      console.error("Error stopping broadcast:", error);
    }
  },

  /**
   * Subscribe to live buses for a specific route
   * @param {string} routeId 
   * @param {Function} callback - Receives array of active buses
   * @returns {Function} unsubscribe function
   */
  subscribeToRoute: (routeId, callback) => {
    const routeRef = ref(rtdb, `active_buses/${routeId}`);
    
    const listener = onValue(routeRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        // Convert object { id1: {}, id2: {} } to array [{id: id1, ...}, ...]
        const buses = Object.entries(data).map(([key, value]) => ({
          id: key,
          ...value
        }));
        callback(buses);
      } else {
        callback([]);
      }
    });

    // Return unsubscriber
    return () => off(routeRef, 'value', listener);
  },

  /**
   * Admin: Subscribe to ALL active buses in the city
   * @param {Function} callback 
   */
  subscribeToAllBuses: (callback) => {
    const allBusesRef = ref(rtdb, `active_buses`);
    
    const listener = onValue(allBusesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        // Flatten the structure for the "God Mode" map
        // Structure: { routeId: { busId: {} } }
        let allBuses = [];
        Object.keys(data).forEach(routeId => {
          const routeBuses = data[routeId];
          Object.keys(routeBuses).forEach(busId => {
            allBuses.push({
              id: busId,
              routeId: routeId,
              ...routeBuses[busId]
            });
          });
        });
        callback(allBuses);
      } else {
        callback([]);
      }
    });

    return () => off(allBusesRef, 'value', listener);
  }
};