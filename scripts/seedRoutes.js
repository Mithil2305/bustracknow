/**
 * Seed Routes Script
 * Run: node scripts/seedRoutes.js
 *
 * Seeds Firestore with sample bus routes for development/testing.
 * Requires: GOOGLE_APPLICATION_CREDENTIALS environment variable set
 * or Firebase Admin SDK initialized.
 */

const { initializeApp } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");

// Initialize with default credentials or service account
initializeApp();
const db = getFirestore();

const SAMPLE_ROUTES = [
  {
    number: "1A",
    name: "Central Station ↔ University Campus",
    distance: 12.5,
    stops: [
      { id: "s1", name: "Central Station", lat: 13.0827, lng: 80.2707 },
      { id: "s2", name: "Park Town", lat: 13.086, lng: 80.275 },
      { id: "s3", name: "Egmore", lat: 13.0732, lng: 80.2609 },
      { id: "s4", name: "T Nagar", lat: 13.0418, lng: 80.2341 },
      { id: "s5", name: "University Campus", lat: 13.0108, lng: 80.235 },
    ],
    polyline: [],
    isActive: true,
    createdAt: new Date(),
  },
  {
    number: "5C",
    name: "Airport ↔ Beach Road",
    distance: 18.3,
    stops: [
      { id: "s6", name: "Airport Terminal", lat: 12.9941, lng: 80.1709 },
      { id: "s7", name: "Guindy", lat: 13.0067, lng: 80.2206 },
      { id: "s8", name: "Adyar", lat: 13.0063, lng: 80.2574 },
      { id: "s9", name: "Besant Nagar", lat: 12.9994, lng: 80.2663 },
      { id: "s10", name: "Beach Road", lat: 13.05, lng: 80.2824 },
    ],
    polyline: [],
    isActive: true,
    createdAt: new Date(),
  },
  {
    number: "21G",
    name: "IT Corridor Express",
    distance: 22.1,
    stops: [
      { id: "s11", name: "Tambaram", lat: 12.9249, lng: 80.1 },
      { id: "s12", name: "Chrompet", lat: 12.9516, lng: 80.142 },
      { id: "s13", name: "Velachery", lat: 12.9815, lng: 80.218 },
      { id: "s14", name: "Sholinganallur", lat: 12.901, lng: 80.2279 },
      { id: "s15", name: "OMR IT Park", lat: 12.84, lng: 80.2265 },
    ],
    polyline: [],
    isActive: true,
    createdAt: new Date(),
  },
];

async function seed() {
  console.log("🌱 Seeding routes...");

  const batch = db.batch();

  for (const route of SAMPLE_ROUTES) {
    const ref = db.collection("routes").doc();
    batch.set(ref, route);
    console.log(`  ✓ ${route.number} — ${route.name}`);
  }

  await batch.commit();
  console.log(`\n✅ Seeded ${SAMPLE_ROUTES.length} routes successfully!`);
}

seed().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});
