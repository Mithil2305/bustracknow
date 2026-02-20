export type RedemptionStatus = "pending" | "approved" | "rejected" | "completed";

export interface Redemption {
  id: string;
  userId: string;
  amount: number;
  upiId: string;
  status: RedemptionStatus;
  transactionId?: string;
  reason?: string;
  createdAt: import("firebase/firestore").Timestamp;
  processedAt?: import("firebase/firestore").Timestamp;
}
