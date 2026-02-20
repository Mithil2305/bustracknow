/* eslint-env jest */
/**
 * Integration tests for Spoofing Detection.
 */

import { haversineDistance } from "../../logic/geo/distanceCalculator";
import { detectSpoofing, isOnRoute } from "../../logic/geo/spoofingDetector";

// Mock Firebase
jest.mock("../../services/firebase/firebaseConfig", () => ({ db: {} }));
jest.mock("firebase/firestore", () => ({
  doc: jest.fn(),
  updateDoc: jest.fn(() => Promise.resolve()),
  increment: jest.fn((n) => n),
}));

describe("Spoofing Detection", () => {
  describe("detectSpoofing", () => {
    it("should return not spoofing for normal movement", () => {
      const prev = { latitude: 13.0827, longitude: 80.2707, timestamp: Date.now() - 5000 };
      const curr = { latitude: 13.0828, longitude: 80.2708, timestamp: Date.now() };
      const result = detectSpoofing(prev, curr, "user1");
      expect(result.isSpoofed).toBeFalsy();
    });

    it("should detect teleportation", () => {
      const prev = { latitude: 13.0827, longitude: 80.2707, timestamp: Date.now() - 3000 };
      const curr = { latitude: 28.6139, longitude: 77.209, timestamp: Date.now() }; // Delhi
      const result = detectSpoofing(prev, curr, "user1");
      expect(result.isSpoofed).toBeTruthy();
    });

    it("should detect mock location (low accuracy)", () => {
      const prev = { latitude: 13.0827, longitude: 80.2707, timestamp: Date.now() - 3000 };
      const curr = { latitude: 13.0828, longitude: 80.2708, timestamp: Date.now(), accuracy: 0.5 };
      const result = detectSpoofing(prev, curr, "user1");
      expect(result.isSpoofed).toBeTruthy();
    });
  });

  describe("isOnRoute", () => {
    const routeCoords = [
      { latitude: 13.0827, longitude: 80.2707 },
      { latitude: 13.085, longitude: 80.273 },
      { latitude: 13.09, longitude: 80.277 },
    ];

    it("should return true for a point near the route", () => {
      const point = { latitude: 13.0828, longitude: 80.2708 };
      expect(isOnRoute(point, routeCoords)).toBe(true);
    });

    it("should return false for a point far from the route", () => {
      const point = { latitude: 14.0, longitude: 81.0 };
      expect(isOnRoute(point, routeCoords)).toBe(false);
    });
  });

  describe("haversineDistance", () => {
    it("should return 0 for same point", () => {
      const p = { latitude: 13.0827, longitude: 80.2707 };
      expect(haversineDistance(p, p)).toBe(0);
    });

    it("should return reasonable distance between known points", () => {
      const a = { latitude: 13.0827, longitude: 80.2707 }; // Chennai Central
      const b = { latitude: 13.0732, longitude: 80.2609 }; // Egmore
      const dist = haversineDistance(a, b);
      // ~1.4 km
      expect(dist).toBeGreaterThan(1000);
      expect(dist).toBeLessThan(2000);
    });
  });
});
