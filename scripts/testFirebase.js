"use strict";
/**
 * scripts/testFirebase.js
 * Quick connectivity test — no extra dependencies.
 * Uses the Firestore REST API with the API key from .env
 *
 * Tests:
 *  1. Parse .env and extract credentials
 *  2. GET  /routes  (list existing documents — even empty is OK)
 *  3. PATCH /global/connection-test  (write a test doc)
 *  4. GET  /global/connection-test   (read it back)
 *  5. DELETE /global/connection-test (clean up)
 *
 * Usage: node scripts/testFirebase.js
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
const DB_URL = env["EXPO_PUBLIC_FIREBASE_DATABASE_URL"];

console.log("\n╔══════════════════════════════════════════╗");
console.log("║   BusTrackNow — Firebase Connectivity    ║");
console.log("╚══════════════════════════════════════════╝\n");
console.log("  Project  :", PROJECT_ID);
console.log("  API Key  :", API_KEY ? API_KEY.slice(0, 10) + "..." : "MISSING ❌");
console.log("  RTDB URL :", DB_URL || "MISSING ❌");
console.log("");

if (!API_KEY || !PROJECT_ID) {
  console.error("❌  Missing credentials in .env — aborting.");
  process.exit(1);
}

const BASE = "firestore.googleapis.com";
const DB = `v1/projects/${PROJECT_ID}/databases/(default)/documents`;

// ── HTTP helpers ──────────────────────────────────────────────────
function request(method, urlPath, body) {
  return new Promise((resolve, reject) => {
    const bodyStr = body ? JSON.stringify(body) : null;
    const opts = {
      hostname: BASE,
      path: urlPath,
      method,
      headers: {
        "Content-Type": "application/json",
        ...(bodyStr ? { "Content-Length": Buffer.byteLength(bodyStr) } : {}),
      },
    };
    const req = https.request(opts, (res) => {
      let data = "";
      res.on("data", (c) => (data += c));
      res.on("end", () => resolve({ status: res.statusCode, body: data }));
    });
    req.on("error", reject);
    if (bodyStr) req.write(bodyStr);
    req.end();
  });
}

function ok(label) {
  console.log("  ✅ " + label);
}
function fail(label, detail) {
  console.log("  ❌ " + label + (detail ? "\n     " + detail : ""));
}
function info(label) {
  console.log("  ℹ️  " + label);
}

// ── Tests ─────────────────────────────────────────────────────────
async function run() {
  // ── 1. List routes collection (read test) ───────────────────────
  console.log("[ 1 ] Firestore read — listing routes/ ...");
  const listRes = await request("GET", `/${DB}/routes?key=${API_KEY}&pageSize=3`);
  if (listRes.status === 200) {
    const parsed = JSON.parse(listRes.body);
    const count = parsed.documents?.length ?? 0;
    ok(
      `Firestore read OK  (${count} route docs found — ${count === 0 ? "empty, seed not run yet" : "data exists!"})`
    );
  } else if (listRes.status === 403) {
    fail("Firestore read BLOCKED (rules deny unauthenticated reads)", listRes.body.slice(0, 120));
    info("That's OK — your security rules are protecting the data.");
  } else {
    fail(`Firestore read HTTP ${listRes.status}`, listRes.body.slice(0, 200));
  }

  // ── 2. Write test doc ────────────────────────────────────────────
  console.log("\n[ 2 ] Firestore write — patching global/connection-test ...");
  const writeRes = await request("PATCH", `/${DB}/global/connection-test?key=${API_KEY}`, {
    fields: {
      ok: { booleanValue: true },
      testedAt: { stringValue: new Date().toISOString() },
      message: { stringValue: "BusTrackNow connectivity check" },
    },
  });
  if (writeRes.status === 200) {
    ok("Firestore write OK");
  } else if (writeRes.status === 403) {
    fail("Firestore write BLOCKED by security rules", writeRes.body.slice(0, 120));
    info("To seed data you need to temporarily open rules. See instructions below.");
  } else {
    fail(`Firestore write HTTP ${writeRes.status}`, writeRes.body.slice(0, 200));
  }

  // ── 3. Read it back ──────────────────────────────────────────────
  if (writeRes.status === 200) {
    console.log("\n[ 3 ] Firestore read-back — fetching global/connection-test ...");
    const readRes = await request("GET", `/${DB}/global/connection-test?key=${API_KEY}`);
    if (readRes.status === 200) {
      const doc = JSON.parse(readRes.body);
      const msg = doc.fields?.message?.stringValue;
      ok(`Read-back OK: "${msg}"`);
    } else {
      fail(`Read-back HTTP ${readRes.status}`, readRes.body.slice(0, 200));
    }

    // ── 4. Clean up ────────────────────────────────────────────────
    console.log("\n[ 4 ] Cleaning up test doc ...");
    const delRes = await request("DELETE", `/${DB}/global/connection-test?key=${API_KEY}`);
    if (delRes.status === 200) {
      ok("Test doc deleted");
    } else {
      info(
        `Delete HTTP ${delRes.status} — you can manually remove global/connection-test in the console`
      );
    }
  } else {
    info("Skipping read-back and cleanup (write was blocked).");
  }

  // ── 5. RTDB ping ─────────────────────────────────────────────────
  console.log("\n[ 5 ] Realtime Database — GET .json ping ...");
  const rtdbHost = DB_URL.replace("https://", "").replace(/\/$/, "");
  const rtdbRes = await new Promise((resolve, reject) => {
    const req = https.request(
      { hostname: rtdbHost, path: "/.json?shallow=true", method: "GET" },
      (res) => {
        let d = "";
        res.on("data", (c) => (d += c));
        res.on("end", () => resolve({ status: res.statusCode, body: d }));
      }
    );
    req.on("error", reject);
    req.end();
  });
  if (rtdbRes.status === 200) {
    ok("RTDB reachable — response: " + rtdbRes.body.slice(0, 60));
  } else if (rtdbRes.status === 401 || rtdbRes.status === 403) {
    ok("RTDB reachable (rules locked — HTTP " + rtdbRes.status + ") ✓");
  } else {
    fail("RTDB HTTP " + rtdbRes.status, rtdbRes.body.slice(0, 120));
  }

  // ── Summary ───────────────────────────────────────────────────────
  console.log("\n╔══════════════════════════════════════════╗");
  if (writeRes.status === 200) {
    console.log("║  ✅  Firebase is connected and working!  ║");
    console.log("╠══════════════════════════════════════════╣");
    console.log("║  Next: open Firestore rules temporarily  ║");
    console.log("║  then run:  node scripts/seedCBERoutes.js ║");
  } else {
    console.log("║  ⚠️   Connected but writes are blocked.  ║");
    console.log("╠══════════════════════════════════════════╣");
    console.log("║  Open rules temporarily to seed data:    ║");
    console.log("║  allow read, write: if true;             ║");
    console.log("║  then run:  node scripts/seedCBERoutes.js ║");
  }
  console.log("╚══════════════════════════════════════════╝\n");
}

run().catch((err) => {
  console.error("\n❌  Test crashed:", err.message);
  process.exit(1);
});
