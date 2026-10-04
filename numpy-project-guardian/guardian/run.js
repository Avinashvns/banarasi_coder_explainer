import { spawnSync } from "child_process";
import path from "path";

const projectRoot = process.cwd();

function runCheck(name, command, args) {
  console.log("");
  console.log(`▶ ${name}`);

  const result = spawnSync(command, args, {
    cwd: projectRoot,
    stdio: "inherit",
    shell: false
  });

  return result.status === 0;
}

console.log("");
console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
console.log("🛡️  NUMPY PROJECT GUARDIAN");
console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

const featureCheck = runCheck(
  "FEATURE CHECK",
  process.execPath,
  ["guardian/feature-check.js"]
);

const diffCheck = runCheck(
  "GIT DIFF CHECK",
  process.execPath,
  ["guardian/diff-check.js"]
);

const unitTests = runCheck(
  "UNIT TESTS",
  process.execPath,
  [
    path.resolve(
      projectRoot,
      "node_modules",
      "vitest",
      "vitest.mjs"
    ),
    "run"
  ]
);

console.log("");
console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
console.log("FINAL GUARDIAN STATUS");
console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

if (featureCheck && diffCheck && unitTests) {
  console.log("");
  console.log("🟢 SAFE");
  console.log("");
  console.log("All Guardian checks passed.");
} else {
  console.log("");
  console.log("🔴 BLOCKED");
  console.log("");
  console.log("One or more Guardian checks failed.");
}

console.log("");
console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

if (!featureCheck || !diffCheck || !unitTests) {
  process.exitCode = 1;
}