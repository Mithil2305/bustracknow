export interface User {
  uid: string;
  name: string;
  phone: string;
  email?: string;
  role: "viewer" | "admin";
  isBanned: boolean;
  trustScore: number;
  points: {
    balance: number;
    lifetime: number;
  };
  stats: UserStats;
  upiId?: string;
  profilePicture?: string;
  savedRoutes?: string[];
  createdAt: import("firebase/firestore").Timestamp;
  lastActive?: import("firebase/firestore").Timestamp;
}

export interface UserStats {
  broadcastSessions30d: number;
  alertsCreated: number;
  alertsUpvoted: number;
  currentStreak: number;
  communityRating?: number;
}
