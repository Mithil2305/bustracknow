/* eslint-env jest */
/**
 * Integration tests for the Points System.
 */

import { POINTS_CONFIG } from "../../logic/points/calculationEngine";
import { validateRedemption } from "../../logic/points/redemptionValidator";
import { calculateStreak } from "../../logic/points/streakCalculator";

// Mock Firebase
jest.mock("../../services/firebase/firebaseConfig", () => ({
  db: {},
}));

jest.mock("firebase/firestore", () => ({
  collection: jest.fn(),
  doc: jest.fn(),
  getDoc: jest.fn(() => Promise.resolve({ exists: () => true, data: () => ({}) })),
  getDocs: jest.fn(() => Promise.resolve({ empty: true, size: 0 })),
  setDoc: jest.fn(() => Promise.resolve()),
  updateDoc: jest.fn(() => Promise.resolve()),
  addDoc: jest.fn(() => Promise.resolve({ id: "mock_tx_id" })),
  writeBatch: jest.fn(() => ({
    set: jest.fn(),
    update: jest.fn(),
    commit: jest.fn(() => Promise.resolve()),
  })),
  increment: jest.fn((n) => n),
  Timestamp: {
    now: jest.fn(() => ({ toDate: () => new Date() })),
    fromDate: jest.fn((d) => ({ toDate: () => d })),
  },
  query: jest.fn(),
  where: jest.fn(),
}));

describe("Points System Integration", () => {
  describe("POINTS_CONFIG", () => {
    it("should have all required point types", () => {
      expect(POINTS_CONFIG).toHaveProperty("broadcast");
      expect(POINTS_CONFIG).toHaveProperty("alert_validated");
      expect(POINTS_CONFIG).toHaveProperty("streak_bonus");
      expect(POINTS_CONFIG).toHaveProperty("first_broadcast");
    });

    it("broadcast points should be positive", () => {
      expect(POINTS_CONFIG.broadcast.amount).toBeGreaterThan(0);
    });
  });

  describe("validateRedemption", () => {
    it("should reject empty fields", async () => {
      const result = await validateRedemption("", 100, "test@upi");
      expect(result.valid).toBe(false);
    });

    it("should reject amounts below minimum", async () => {
      const result = await validateRedemption("user1", 50, "test@upi");
      expect(result.valid).toBe(false);
      expect(result.error).toContain("Minimum");
    });

    it("should reject invalid UPI format", async () => {
      const result = await validateRedemption("user1", 100, "invalid-upi");
      expect(result.valid).toBe(false);
      expect(result.error).toContain("UPI");
    });

    it("should accept valid redemption", async () => {
      const result = await validateRedemption("user1", 500, "name@upi");
      expect(result.valid).toBe(true);
    });
  });

  describe("Streak calculation", () => {
    it("should return 0 for empty history", () => {
      expect(calculateStreak([])).toBe(0);
    });
  });
});
