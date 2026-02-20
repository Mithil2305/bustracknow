import { addDoc, collection, doc, Timestamp, updateDoc } from "firebase/firestore";
import { useCallback, useState } from "react";
import { Alert } from "react-native";
import { validateRedemption } from "../logic/points/redemptionValidator";
import { db } from "../services/firebase/firebaseConfig";
import { useAuthStore } from "../store/authStore";

/**
 * Hook for managing UPI redemption flow.
 */
export default function useRedemption() {
  const [loading, setLoading] = useState(false);
  const [receipt, setReceipt] = useState(null);
  const { user } = useAuthStore();

  /**
   * Submit a redemption request.
   * @param {number} amount - points to redeem
   * @param {string} upiId - UPI ID
   */
  const submitRedemption = useCallback(
    async (amount, upiId) => {
      if (!user?.uid) {
        Alert.alert("Error", "You must be logged in");
        return null;
      }

      setLoading(true);
      try {
        const validation = await validateRedemption(user.uid, amount, upiId);
        if (!validation.valid) {
          Alert.alert("Cannot Redeem", validation.error);
          return null;
        }

        const redemptionData = {
          userId: user.uid,
          amount,
          upiId,
          status: "pending",
          createdAt: Timestamp.now(),
        };

        const docRef = await addDoc(collection(db, "redemptions"), redemptionData);

        // Deduct points from user balance
        const userRef = doc(db, "users", user.uid);
        await updateDoc(userRef, {
          "points.balance": (await import("firebase/firestore")).increment(-amount),
        });

        const result = { id: docRef.id, ...redemptionData };
        setReceipt(result);
        return result;
      } catch (error) {
        Alert.alert("Error", error.message || "Redemption failed");
        return null;
      } finally {
        setLoading(false);
      }
    },
    [user]
  );

  const clearReceipt = useCallback(() => setReceipt(null), []);

  return {
    loading,
    receipt,
    submitRedemption,
    clearReceipt,
  };
}
