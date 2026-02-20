/* eslint-env jest */
/**
 * Unit tests for Points calculation.
 */

import { POINTS_CONFIG } from "../../logic/points/calculationEngine";
import { calculateStreak } from "../../logic/points/streakCalculator";

jest.mock("../../services/firebase/firebaseConfig", () => ({ db: {} }));
jest.mock("firebase/firestore", () => ({
  collection: jest.fn(),
  doc: jest.fn(),
  getDoc: jest.fn(() => Promise.resolve({ exists: () => true, data: () => ({}) })),
  getDocs: jest.fn(() => Promise.resolve({ empty: true, docs: [] })),
  setDoc: jest.fn(() => Promise.resolve()),
  updateDoc: jest.fn(() => Promise.resolve()),
  addDoc: jest.fn(() => Promise.resolve({ id: "mock" })),
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
  orderBy: jest.fn(),
  limit: jest.fn(),
}));

describe("Points Unit Tests", () => {
  describe("POINTS_CONFIG", () => {
    it("broadcast should award correct points", () => {
      expect(POINTS_CONFIG.broadcast.amount).toBeGreaterThan(0);
    });

    it("alert_validated should have higher reward", () => {
      expect(POINTS_CONFIG.alert_validated.amount).toBeGreaterThanOrEqual(
        POINTS_CONFIG.broadcast.amount
      );
    });

    it("streak_bonus should exist", () => {
      expect(POINTS_CONFIG.streak_bonus).toBeDefined();
      expect(POINTS_CONFIG.streak_bonus.amount).toBeGreaterThan(0);
    });
  });

  describe("calculateStreak", () => {
    it("returns 0 for empty array", () => {
      expect(calculateStreak([])).toBe(0);
    });

    it("returns 0 for null input", () => {
      expect(calculateStreak(null)).toBe(0);
    });

    it("returns 1 for single day", () => {
      const today = new Date();
      expect(calculateStreak([{ timestamp: { toDate: () => today } }])).toBe(1);
    });
  });
});
