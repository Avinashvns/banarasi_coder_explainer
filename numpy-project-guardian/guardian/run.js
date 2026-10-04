
import { spawnSync } from "child_process";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const guardianRoot = path.resolve(__dirname, "..");

console.log("");
console.log("╔════════════════════════════════════════════╗");
console.log("║      🛡️ NUMPY PROJECT GUARDIAN            ║");
console.log("║          FULL PROTECTION RUN               ║");
console.log("╚════════════════════════════════════════════╝");
console.log("");

const checks = [
  {
    name: "Feature Protection",
    command: "node",
    args: ["guardian/feature-check.js"],
  },
  {
    name: "Project Integrity",
    command: "node",
    args: ["guardian/project-check.js"],
  },
  {
    name: "Git Diff",
    command: "node",
    args: ["guardian/diff-check.js"],
  },
  {
    name: "Unit Tests",
    command: "node",
    args: ["node_modules/vitest/vitest.mjs", "run"],
  },
];

let failed = false;

for (const check of checks) {
  console.log("");
  console.log("════════════════════════════════════════════");
  console.log(`🔎 ${check.name}`);
  console.log("════════════════════════════════════════════");
  console.log("");

  const result = spawnSync(
    check.command,
    check.args,
    {
      cwd: guardianRoot,
      stdio: "inherit",
      shell: process.platform === "win32",
    }
  );

  if (result.error) {
    console.log("");
    console.log(`❌ ${check.name} could not run`);
    console.log(result.error.message);
    failed = true;
    continue;
  }

  if (result.status !== 0) {
    console.log("");
    console.log(`❌ ${check.name} FAILED`);
    failed = true;
  } else {
    console.log("");
    console.log(`✅ ${check.name} PASSED`);
  }
}

// --------------------------------------------------
// Final Guardian Verdict
// --------------------------------------------------

console.log("");
console.log("");
console.log("╔════════════════════════════════════════════╗");
console.log("║           GUARDIAN FINAL VERDICT           ║");
console.log("╚════════════════════════════════════════════╝");
console.log("");

if (failed) {
  console.log("🚨 STATUS: 🔴 BLOCKED");
  console.log("");
  console.log("Guardian detected a failed protection check.");
  console.log("Review the failed section before accepting changes.");
  console.log("");

  process.exitCode = 1;
} else {
  console.log("🟢 STATUS: SAFE");
  console.log("");
  console.log("All Guardian checks passed.");
  console.log("Project changes are currently safe.");
  console.log("");

  process.exitCode = 0;
}
