import { 
  collection, 
  getDocs, 
  getDoc, 
  doc, 
  query, 
  where, 
  addDoc, 
  updateDoc, 
  serverTimestamp 
} from 'firebase/firestore';
import { db } from './firebaseConfig';

/**
 * Handles interactions with static data (Routes, Stops, Config).
 * Optimized to reduce reads by checking versions.
 */
export const FirestoreService = {
  
  /**
   * Get global config to check data version
   */
  getConfig: async () => {
    try {
      const configRef = doc(db, 'global', 'config');
      const snapshot = await getDoc(configRef);
      return snapshot.exists() ? snapshot.data() : null;
    } catch (error) {
      console.error("Error fetching config:", error);
      throw error;
    }
  },

  /**
   * Fetch all routes (Heavy read operation - Should be cached locally)
   */
  getAllRoutes: async () => {
    try {
      const routesCol = collection(db, 'routes');
      const snapshot = await getDocs(routesCol);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error("Error fetching routes:", error);
      throw error;
    }
  },

  /**
   * Fetch all stops (Heavy read operation - Should be cached locally)
   */
  getAllStops: async () => {
    try {
      const stopsCol = collection(db, 'stops');
      const snapshot = await getDocs(stopsCol);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error("Error fetching stops:", error);
      throw error;
    }
  },

  /**
   * Admin: Add a new route
   */
  addRoute: async (routeData) => {
    try {
      const docRef = await addDoc(collection(db, 'routes'), {
        ...routeData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      return docRef.id;
    } catch (error) {
      console.error("Error adding route:", error);
      throw error;
    }
  },

  /**
   * Update User Profile (e.g., after R2 image upload)
   */
  updateUserProfile: async (uid, data) => {
    try {
      const userRef = doc(db, 'users', uid);
      await updateDoc(userRef, {
        ...data,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      throw error;
    }
  }
};