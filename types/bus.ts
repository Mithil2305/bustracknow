export interface Bus {
  id: string;
  routeId: string;
  userId: string;
  latitude: number;
  longitude: number;
  speed: number;
  heading: number;
  accuracy: number;
  timestamp: number;
  ttl: number;
  isSpoofed?: boolean;
}

export interface BroadcastSession {
  userId: string;
  routeId: string;
  startedAt: number;
  lastUpdate: number;
  pointsEarned: number;
  isActive: boolean;
}
