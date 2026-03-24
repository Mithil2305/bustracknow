import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { db } from "./firebaseConfig";

export const FirestoreService = {
  getConfig: async () => {
    try {
      const snapshot = await getDoc(doc(db, "global", "config"));
      return snapshot.exists() ? snapshot.data() : null;
    } catch (error) {
      console.error("Error fetching config:", error);
      throw error;
    }
  },

  getAllRoutes: async () => {
    try {
      // Simple getDocs — no composite index needed.
      // All seeded routes have isActive:true so no where() filter required.
      // Sort client-side by bus number.
      const snapshot = await getDocs(collection(db, "routes"));
      const docs = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
      docs.sort((a, b) =>
        String(a.number || "").localeCompare(String(b.number || ""), undefined, { numeric: true })
      );
      return docs;
    } catch (error) {
      console.error("Error fetching routes:", error);
      throw error;
    }
  },

  getRoutes: async () => FirestoreService.getAllRoutes(),

  getRouteById: async (id) => {
    try {
      const snapshot = await getDoc(doc(db, "routes", id));
      if (!snapshot.exists()) return null;
      return { id: snapshot.id, ...snapshot.data() };
    } catch (error) {
      console.error("Error fetching route by ID:", error);
      throw error;
    }
  },

  getAllStops: async () => {
    try {
      const snapshot = await getDocs(collection(db, "stops"));
      return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
    } catch (error) {
      console.error("Error fetching stops:", error);
      throw error;
    }
  },

  addRoute: async (routeData) => {
    try {
      const docRef = await addDoc(collection(db, "routes"), {
        ...routeData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      return docRef.id;
    } catch (error) {
      console.error("Error adding route:", error);
      throw error;
    }
  },

  updateUserProfile: async (uid, data) => {
    try {
      await updateDoc(doc(db, "users", uid), {
        ...data,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      throw error;
    }
  },
};
