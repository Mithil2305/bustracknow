/**
 * Data Migration Script
 * Run: node scripts/migrateData.js
 *
 * Handles schema migrations for Firestore documents.
 * Add new migration functions below and register them in MIGRATIONS array.
 */

const { initializeApp } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");

initializeApp();
const db = getFirestore();

/**
 * Migration: Add points structure to existing users.
 */
async function addPointsToUsers() {
  console.log("  → Adding points structure to users...");
  const usersSnap = await db.collection("users").get();
  const batch = db.batch();
  let count = 0;

  usersSnap.forEach((doc) => {
    const data = doc.data();
    if (!data.points) {
      batch.update(doc.ref, {
        points: { balance: 0, lifetime: 0 },
        trustScore: 50,
        stats: {
          broadcastSessions30d: 0,
          alertsCreated: 0,
          alertsUpvoted: 0,
          currentStreak: 0,
        },
      });
      count++;
    }
  });

  if (count > 0) {
    await batch.commit();
  }
  console.log(`    ✓ Updated ${count} users`);
}

/**
 * Migration: Add upvotedBy array to existing alerts.
 */
async function addUpvoteArrayToAlerts() {
  console.log("  → Adding upvotedBy array to alerts...");
  const alertsSnap = await db.collection("alerts").get();
  const batch = db.batch();
  let count = 0;

  alertsSnap.forEach((doc) => {
    const data = doc.data();
    if (!data.upvotedBy) {
      batch.update(doc.ref, {
        upvotedBy: [],
        upvotes: data.upvotes || 0,
      });
      count++;
    }
  });

  if (count > 0) {
    await batch.commit();
  }
  console.log(`    ✓ Updated ${count} alerts`);
}

// ── Register migrations in order ──
const MIGRATIONS = [
  { name: "addPointsToUsers", fn: addPointsToUsers },
  { name: "addUpvoteArrayToAlerts", fn: addUpvoteArrayToAlerts },
];

async function runMigrations() {
  console.log("🔄 Running data migrations...\n");

  for (const migration of MIGRATIONS) {
    try {
      console.log(`📦 ${migration.name}`);
      await migration.fn();
      console.log(`  ✅ Done\n`);
    } catch (err) {
      console.error(`  ❌ Failed: ${err.message}`);
      process.exit(1);
    }
  }

  console.log("🎉 All migrations completed!");
}

runMigrations();
