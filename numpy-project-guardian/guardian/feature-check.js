import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const manifestPath = path.join(
  __dirname,
  "FEATURE_MANIFEST.json"
);

function loadManifest() {
  if (!fs.existsSync(manifestPath)) {
    throw new Error(
      "FEATURE_MANIFEST.json not found."
    );
  }

  const content = fs.readFileSync(
    manifestPath,
    "utf-8"
  );

  return JSON.parse(content);
}

function checkFeatures() {
  const manifest = loadManifest();

  const features = manifest.features;

  if (!Array.isArray(features)) {
    throw new Error(
      "Invalid FEATURE_MANIFEST.json: features must be an array."
    );
  }

  const errors = [];
  const warnings = [];
  const protectedFeatures = [];

  const ids = new Set();

  for (const feature of features) {
    if (!feature.id) {
      errors.push("Feature is missing an id.");
      continue;
    }

    if (ids.has(feature.id)) {
      errors.push(
        `Duplicate feature id: ${feature.id}`
      );
      continue;
    }

    ids.add(feature.id);

    if (!feature.name) {
      errors.push(
        `Feature "${feature.id}" is missing a name.`
      );
    }

    if (feature.mustPreserve === true) {
      protectedFeatures.push(feature);
    }

    if (
      feature.status === "locked" &&
      feature.mustPreserve !== true
    ) {
      warnings.push(
        `Locked feature "${feature.name}" does not have mustPreserve=true.`
      );
    }
  }

  return {
    project: manifest.project,
    guardian: manifest.guardian,
    totalFeatures: features.length,
    protectedFeatures: protectedFeatures.length,
    errors,
    warnings,
    status:
      errors.length > 0
        ? "BLOCKED"
        : warnings.length > 0
          ? "WARNING"
          : "SAFE"
  };
}

function printReport(result) {
  console.log("");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("🛡️  NUMPY PROJECT GUARDIAN");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

  console.log("");
  console.log(`Project: ${result.project}`);
  console.log(`Guardian: ${result.guardian}`);

  console.log("");
  console.log(`Features: ${result.totalFeatures}`);
  console.log(
    `Protected: ${result.protectedFeatures}`
  );

  if (result.errors.length > 0) {
    console.log("");
    console.log("ERRORS:");

    for (const error of result.errors) {
      console.log(`❌ ${error}`);
    }
  }

  if (result.warnings.length > 0) {
    console.log("");
    console.log("WARNINGS:");

    for (const warning of result.warnings) {
      console.log(`⚠️  ${warning}`);
    }
  }

  console.log("");
  console.log(
    `STATUS: ${
      result.status === "SAFE"
        ? "🟢 SAFE"
        : result.status === "WARNING"
          ? "🟡 WARNING"
          : "🔴 BLOCKED"
    }`
  );

  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("");
}

try {
  const result = checkFeatures();

  printReport(result);

  if (result.status === "BLOCKED") {
    process.exitCode = 1;
  }
} catch (error) {
  console.error("");
  console.error("🔴 Guardian Error");
  console.error(error.message);
  console.error("");

  process.exitCode = 1;
}