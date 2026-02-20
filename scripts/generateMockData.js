/**
 * Generate Mock Data Script
 * Run: node scripts/generateMockData.js
 *
 * Populates Firestore with mock users, alerts, and points transactions
 * for development and testing.
 */

const { initializeApp } = require("firebase-admin/app");
const { getFirestore, Timestamp } = require("firebase-admin/firestore");

initializeApp();
const db = getFirestore();

function randomPick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const NAMES = [
  "Arjun",
  "Priya",
  "Karthik",
  "Ananya",
  "Ravi",
  "Sneha",
  "Vikram",
  "Divya",
  "Suresh",
  "Meera",
];
const ALERT_TYPES = ["delay", "breakdown", "safety", "crowding", "route_change"];
const POINT_TYPES = ["broadcast", "alert_validated", "streak_bonus", "first_broadcast"];

async function generateUsers(count = 10) {
  console.log(`  → Generating ${count} mock users...`);
  const batch = db.batch();

  for (let i = 0; i < count; i++) {
    const ref = db.collection("users").doc(`mock_user_${i}`);
    batch.set(ref, {
      name: NAMES[i % NAMES.length],
      phone: `+9199${String(i).padStart(8, "0")}`,
      role: i === 0 ? "admin" : "viewer",
      points: {
        balance: randomBetween(0, 5000),
        lifetime: randomBetween(1000, 20000),
      },
      trustScore: randomBetween(30, 95),
      isBanned: false,
      createdAt: Timestamp.now(),
      stats: {
        broadcastSessions30d: randomBetween(0, 25),
        alertsCreated: randomBetween(0, 15),
        alertsUpvoted: randomBetween(0, 10),
        currentStreak: randomBetween(0, 14),
      },
    });
  }

  await batch.commit();
  console.log(`    ✓ Created ${count} users`);
}

async function generateAlerts(count = 20) {
  console.log(`  → Generating ${count} mock alerts...`);
  const batch = db.batch();

  for (let i = 0; i < count; i++) {
    const ref = db.collection("alerts").doc();
    batch.set(ref, {
      userId: `mock_user_${randomBetween(0, 9)}`,
      type: randomPick(ALERT_TYPES),
      routeId: `route_${randomBetween(1, 5)}`,
      message: `Mock alert #${i + 1} — ${randomPick(ALERT_TYPES)} reported`,
      upvotes: randomBetween(0, 12),
      upvotedBy: [],
      resolved: Math.random() > 0.7,
      createdAt: Timestamp.fromDate(new Date(Date.now() - randomBetween(0, 48) * 60 * 60 * 1000)),
    });
  }

  await batch.commit();
  console.log(`    ✓ Created ${count} alerts`);
}

async function generateTransactions(count = 50) {
  console.log(`  → Generating ${count} mock point transactions...`);
  const batch = db.batch();

  for (let i = 0; i < count; i++) {
    const ref = db.collection("points_transactions").doc();
    const type = randomPick(POINT_TYPES);
    batch.set(ref, {
      userId: `mock_user_${randomBetween(0, 9)}`,
      type,
      amount: type === "streak_bonus" ? randomBetween(50, 200) : randomBetween(5, 30),
      timestamp: Timestamp.fromDate(new Date(Date.now() - randomBetween(0, 168) * 60 * 60 * 1000)),
    });
  }

  await batch.commit();
  console.log(`    ✓ Created ${count} transactions`);
}

async function main() {
  console.log("🎲 Generating mock data...\n");
  await generateUsers();
  await generateAlerts();
  await generateTransactions();
  console.log("\n✅ Mock data generation complete!");
}

main().catch((err) => {
  console.error("❌ Failed:", err);
  process.exit(1);
});
