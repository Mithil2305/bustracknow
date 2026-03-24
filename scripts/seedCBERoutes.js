"use strict";
/**
 * scripts/seedCBERoutes.js
 * Seed Coimbatore bus routes into Firestore using the REST API.
 * Uses ONLY credentials from .env — no service account key needed.
 *
 * Usage: node scripts/seedCBERoutes.js
 *
 * Requires: Firestore rules must allow unauthenticated writes.
 *   allow read, write: if true;   <- set this temporarily
 */

const fs = require("fs");
const path = require("path");
const https = require("https");

// ── Load .env ─────────────────────────────────────────────────────
const envRaw = fs.readFileSync(path.resolve(__dirname, "../.env"), "utf8");
const env = {};
for (const line of envRaw.split(/\r?\n/)) {
  const t = line.trim();
  if (!t || t.startsWith("#")) continue;
  const eq = t.indexOf("=");
  if (eq === -1) continue;
  env[t.slice(0, eq).trim()] = t.slice(eq + 1).trim();
}

const API_KEY = env["EXPO_PUBLIC_FIREBASE_API_KEY"];
const PROJECT_ID = env["EXPO_PUBLIC_FIREBASE_PROJECT_ID"];

if (!API_KEY || !PROJECT_ID) {
  console.error(
    "❌  Missing EXPO_PUBLIC_FIREBASE_API_KEY or EXPO_PUBLIC_FIREBASE_PROJECT_ID in .env"
  );
  process.exit(1);
}

const BASE = "firestore.googleapis.com";
const DB = `v1/projects/${PROJECT_ID}/databases/(default)/documents`;

// ── Firestore value encoder ───────────────────────────────────────
function toFV(val) {
  if (val === null || val === undefined) return { nullValue: null };
  if (typeof val === "boolean") return { booleanValue: val };
  if (typeof val === "number")
    return Number.isInteger(val) ? { integerValue: String(val) } : { doubleValue: val };
  if (typeof val === "string") return { stringValue: val };
  if (Array.isArray(val)) return { arrayValue: { values: val.map(toFV) } };
  if (typeof val === "object") {
    const fields = {};
    for (const [k, v] of Object.entries(val)) fields[k] = toFV(v);
    return { mapValue: { fields } };
  }
  return { stringValue: String(val) };
}

function toFields(obj) {
  const f = {};
  for (const [k, v] of Object.entries(obj)) f[k] = toFV(v);
  return f;
}

// ── PATCH (create or update) a single doc ────────────────────────
function patchDoc(collection, docId, data) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify({ fields: toFields(data) });
    const reqPath = `/${DB}/${collection}/${encodeURIComponent(docId)}?key=${API_KEY}`;
    const opts = {
      hostname: BASE,
      path: reqPath,
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(body),
      },
    };
    const req = https.request(opts, (res) => {
      let raw = "";
      res.on("data", (c) => (raw += c));
      res.on("end", () => {
        if (res.statusCode >= 200 && res.statusCode < 300) resolve();
        else reject(new Error(`HTTP ${res.statusCode}: ${raw.slice(0, 300)}`));
      });
    });
    req.on("error", reject);
    req.write(body);
    req.end();
  });
}

// ── Load asset data ───────────────────────────────────────────────
const CBE = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, "../assets/cbe_combined.json"), "utf8")
);
const POY = JSON.parse(fs.readFileSync(path.resolve(__dirname, "../assets/poy.json"), "utf8"));

// ── Helpers ───────────────────────────────────────────────────────
function slug(str) {
  return String(str)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 100);
}

function normaliseRoute(raw, source) {
  const busNumber = String(raw.bus_number || "N/A").trim();
  const origin = String(raw.origin || "").trim();
  const destination = String(raw.destination || "").trim();
  const via = (raw.via_stops || []).map((s) => String(s).trim()).filter(Boolean);

  const allStops = [origin, ...via, destination].filter(Boolean);
  // Remove consecutive duplicates
  const stops = allStops.filter((s, i) => i === 0 || s !== allStops[i - 1]);

  return {
    number: busNumber,
    name: `${origin} -> ${destination}`,
    origin,
    destination,
    stops,
    stopIds: stops.map((s) => slug(`cbe-${s}`)),
    scheduleTimes: (raw.schedule_times || []).map((t) => String(t).trim()).filter(Boolean),
    distance: null,
    isActive: true,
    source,
    updatedAt: new Date().toISOString(),
  };
}

// ── Concurrency limiter ───────────────────────────────────────────
function runLimited(tasks, limit) {
  let idx = 0,
    active = 0,
    done = 0;
  const total = tasks.length;
  return new Promise((resolve, reject) => {
    function next() {
      while (active < limit && idx < tasks.length) {
        const task = tasks[idx++];
        active++;
        task()
          .then(() => {
            active--;
            done++;
            done === total ? resolve() : next();
          })
          .catch(reject);
      }
    }
    next();
  });
}

// ── Main ──────────────────────────────────────────────────────────
async function seed() {
  console.log("\n╔══════════════════════════════════════════╗");
  console.log("║   BusTrackNow — Coimbatore Route Seeder  ║");
  console.log("╚══════════════════════════════════════════╝\n");
  console.log(`  Project : ${PROJECT_ID}`);
  console.log(`  API Key : ${API_KEY.slice(0, 10)}...\n`);

  const raw = [
    ...CBE.map((r) => ({ ...r, _src: "cbe" })),
    ...POY.map((r) => ({ ...r, _src: "poy" })),
  ];

  console.log(`  Loaded  : ${CBE.length} CBE + ${POY.length} Pollachi = ${raw.length} routes\n`);

  // ── Collect unique stops ────────────────────────────────────────
  const stopMap = new Map();
  for (const r of raw) {
    const names = [r.origin, ...(r.via_stops || []), r.destination]
      .map((s) => String(s || "").trim())
      .filter(Boolean);
    for (const name of names) {
      const id = slug(`cbe-${name}`);
      if (!stopMap.has(id)) stopMap.set(id, name);
    }
  }

  console.log(`  Stops   : ${stopMap.size} unique`);
  console.log("  Writing stops...");

  let stopsDone = 0;
  await runLimited(
    [...stopMap.entries()].map(([id, name]) => async () => {
      await patchDoc("stops", id, {
        name,
        city: "coimbatore",
        lat: null,
        lng: null,
        isActive: true,
      });
      stopsDone++;
      process.stdout.write(`\r    ${stopsDone}/${stopMap.size} stops written   `);
    }),
    10
  );
  console.log(`\n  ✅ Stops done\n`);

  // ── Build deduplicated route list ───────────────────────────────
  const seen = new Set();
  const entries = [];
  for (const r of raw) {
    let id = slug(`${r._src}-${r.bus_number}-${r.origin}`);
    if (seen.has(id)) {
      let n = 2;
      while (seen.has(`${id}-${n}`)) n++;
      id = `${id}-${n}`;
    }
    seen.add(id);
    entries.push([id, normaliseRoute(r, r._src)]);
  }

  console.log(`  Routes  : ${entries.length} total`);
  console.log("  Writing routes...");

  let routesDone = 0;
  await runLimited(
    entries.map(([id, data]) => async () => {
      await patchDoc("routes", id, data);
      routesDone++;
      process.stdout.write(
        `\r    ${routesDone}/${entries.length}  (${data.number} — ${data.origin.slice(0, 22)})   `
      );
    }),
    10
  );
  console.log(`\n  ✅ Routes done\n`);

  // ── Write config doc ────────────────────────────────────────────
  await patchDoc("global", "config", {
    dataVersion: 1,
    seededAt: new Date().toISOString(),
    routeCount: entries.length,
    stopCount: stopMap.size,
  });

  console.log("  ✅ global/config written\n");
  console.log("╔══════════════════════════════════════════╗");
  console.log(`║  Routes seeded : ${String(entries.length).padEnd(24)}║`);
  console.log(`║  Stops seeded  : ${String(stopMap.size).padEnd(24)}║`);
  console.log("╚══════════════════════════════════════════╝");
  console.log(`\n  Verify: https://console.firebase.google.com/project/${PROJECT_ID}/firestore\n`);
}

seed().catch((err) => {
  console.error("\n❌  Seed failed:", err.message);
  if (err.message.includes("403") || err.message.includes("PERMISSION_DENIED")) {
    console.error(
      "\n  ⚠️  Firestore security rules are blocking writes.\n" +
        "     In Firebase Console → Firestore → Rules, temporarily set:\n\n" +
        "       rules_version = '2';\n" +
        "       service cloud.firestore {\n" +
        "         match /databases/{database}/documents {\n" +
        "           match /{document=**} {\n" +
        "             allow read, write: if true;\n" +
        "           }\n" +
        "         }\n" +
        "       }\n\n" +
        "     Then re-run: node scripts/seedCBERoutes.js\n" +
        "     Then restore your real rules.\n"
    );
  }
  process.exit(1);
});
