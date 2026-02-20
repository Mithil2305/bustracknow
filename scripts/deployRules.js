/**
 * Deploy Rules Script
 * Run: node scripts/deployRules.js
 *
 * Deploys Firestore, Realtime DB, and Storage security rules to Firebase.
 * Requires: firebase-tools installed globally (npm i -g firebase-tools)
 */

const { execSync } = require("child_process");

const RULES = [
  { name: "Firestore", command: "firebase deploy --only firestore:rules" },
  { name: "Realtime DB", command: "firebase deploy --only database" },
  { name: "Storage", command: "firebase deploy --only storage" },
];

console.log("🚀 Deploying Firebase security rules...\n");

for (const rule of RULES) {
  try {
    console.log(`  ⏳ Deploying ${rule.name} rules...`);
    execSync(rule.command, { stdio: "inherit" });
    console.log(`  ✅ ${rule.name} rules deployed!\n`);
  } catch (err) {
    console.error(`  ❌ Failed to deploy ${rule.name} rules:`, err.message);
    process.exit(1);
  }
}

console.log("🎉 All rules deployed successfully!");
