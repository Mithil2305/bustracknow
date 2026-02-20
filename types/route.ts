export interface Route {
  id: string;
  number: string;
  name: string;
  distance: number;
  stops: Stop[];
  polyline: LatLng[];
  isActive: boolean;
  activeBuses?: number;
  createdAt: import("firebase/firestore").Timestamp;
  updatedAt?: import("firebase/firestore").Timestamp;
}

export interface Stop {
  id: string;
  name: string;
  lat: number;
  lng: number;
  routeIds?: string[];
}

export interface LatLng {
  latitude: number;
  longitude: number;
}
