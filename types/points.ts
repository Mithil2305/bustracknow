export type PointType =
  | "broadcast"
  | "alert_validated"
  | "streak_bonus"
  | "first_broadcast"
  | "referral";

export interface PointTransaction {
  id: string;
  userId: string;
  type: PointType;
  amount: number;
  metadata?: Record<string, unknown>;
  timestamp: import("firebase/firestore").Timestamp;
}

export interface PointsBalance {
  balance: number;
  lifetime: number;
}
