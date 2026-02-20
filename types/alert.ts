export type AlertType = "delay" | "breakdown" | "safety" | "route_change" | "crowding" | "other";

export interface Alert {
  id: string;
  userId: string;
  type: AlertType;
  routeId: string;
  message: string;
  location?: {
    latitude: number;
    longitude: number;
  };
  photoUrl?: string;
  upvotes: number;
  upvotedBy: string[];
  resolved: boolean;
  createdAt: import("firebase/firestore").Timestamp;
}
