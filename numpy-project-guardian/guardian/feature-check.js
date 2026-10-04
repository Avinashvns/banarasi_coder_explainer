
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const guardianRoot = path.resolve(__dirname, "..");
const parentRoot = path.resolve(guardianRoot, "..");

const manifestPath = path.join(
  guardianRoot,
  "guardian",
  "FEATURE_MANIFEST.json"
);

const registryPath = path.join(
  guardianRoot,
  "guardian",
  "feature-registry.json"
);

const projectRoot = path.join(
  parentRoot,
  "numpy-visual-explainer"
);

let blocked = false;
let warnings = 0;

console.log("");
console.log("🛡️ NUMPY PROJECT GUARDIAN");
console.log("Feature Protection Check");
console.log("────────────────────────────────");

// --------------------------------------------------
// Manifest
// --------------------------------------------------

if (!fs.existsSync(manifestPath)) {
  console.log("❌ FEATURE_MANIFEST.json not found");
  process.exitCode = 1;
  process.exit();
}

const manifest = JSON.parse(
  fs.readFileSync(manifestPath, "utf8")
);

if (!Array.isArray(manifest.features)) {
  console.log("❌ Manifest features array is invalid");
  process.exitCode = 1;
  process.exit();
}

console.log(`Manifest Features: ${manifest.features.length}`);

// --------------------------------------------------
// Registry
// --------------------------------------------------

if (!fs.existsSync(registryPath)) {
  console.log("❌ feature-registry.json not found");
  process.exitCode = 1;
  process.exit();
}

const registry = JSON.parse(
  fs.readFileSync(registryPath, "utf8")
);

if (!Array.isArray(registry.features)) {
  console.log("❌ Feature registry is invalid");
  process.exitCode = 1;
  process.exit();
}

// --------------------------------------------------
// Compare manifest and registry
// --------------------------------------------------

const manifestIds = new Set(
  manifest.features.map((feature) => feature.id)
);

const registryIds = new Set(
  registry.features.map((feature) => feature.id)
);

console.log("");
console.log("Feature Registry");
console.log("────────────────────────────────");

for (const feature of manifest.features) {
  if (!registryIds.has(feature.id)) {
    console.log(`❌ ${feature.id} — missing from registry`);
    blocked = true;
  }
}

for (const feature of registry.features) {
  if (!manifestIds.has(feature.id)) {
    console.log(`⚠️ ${feature.id} — not in manifest`);
    warnings++;
  }
}

// --------------------------------------------------
// Verify actual project features
// --------------------------------------------------

console.log("");
console.log("Actual Project Verification");
console.log("────────────────────────────────");

for (const feature of registry.features) {
  const verification = feature.verification;

  if (!verification?.file) {
    console.log(`⚠️ ${feature.id} — no verification file`);
    warnings++;
    continue;
  }

  const filePath = path.join(
    projectRoot,
    verification.file
  );

  if (!fs.existsSync(filePath)) {
    if (feature.status === "implemented") {
      console.log(
        `🔴 ${feature.id} — IMPLEMENTED FILE MISSING`
      );
      blocked = true;
    } else {
      console.log(
        `⚪ ${feature.id} — planned`
      );
    }

    continue;
  }

  const content = fs.readFileSync(
    filePath,
    "utf8"
  );

  // Planned feature
  if (feature.status === "planned") {
    console.log(
      `⚪ ${feature.id} — PLANNED`
    );
    continue;
  }

  // Implemented feature
  const anchors = verification.anchors || [];

  const missingAnchors = anchors.filter(
    (anchor) => !content.includes(anchor)
  );

  if (missingAnchors.length === 0) {
    console.log(
      `✅ ${feature.id} — protected`
    );
  } else {
    console.log(
      `🔴 ${feature.id} — FEATURE ANCHOR MISSING`
    );

    for (const anchor of missingAnchors) {
      console.log(`   Missing: "${anchor}"`);
    }

    blocked = true;
  }
}

// --------------------------------------------------
// Final status
// --------------------------------------------------

console.log("");
console.log("────────────────────────────────");

if (blocked) {
  console.log("STATUS: 🔴 BLOCKED");
  console.log("Protected feature verification failed.");
  process.exitCode = 1;
} else if (warnings > 0) {
  console.log("STATUS: 🟡 WARNING");
  console.log(`Warnings: ${warnings}`);
} else {
  console.log("STATUS: 🟢 SAFE");
  console.log("All implemented features are protected.");
}

console.log("");
