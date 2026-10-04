
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Guardian project
const guardianRoot = path.resolve(__dirname, "..");

// Parent project
const parentRoot = path.resolve(guardianRoot, "..");

// Actual React project
const targetProject = path.join(parentRoot, "numpy-visual-explainer");

console.log("");
console.log("🛡️ NUMPY PROJECT GUARDIAN");
console.log("Project Integrity Check");
console.log("────────────────────────────────");

console.log(`Target: ${targetProject}`);
console.log("");

let hasError = false;

// --------------------------------------------------
// 1. Check target project
// --------------------------------------------------

if (!fs.existsSync(targetProject)) {
  console.log("❌ Target project not found");
  console.log("   Expected: numpy-visual-explainer/");
  hasError = true;
} else {
  console.log("✅ Target project found");
}

// --------------------------------------------------
// 2. Required project files
// --------------------------------------------------

const requiredFiles = [
  "package.json",
  "index.html",
  "vite.config.js",
  "src/App.jsx",
  "src/main.jsx",
  "src/index.css",
];

console.log("");
console.log("Required Files");
console.log("────────────────────────────────");

for (const relativeFile of requiredFiles) {
  const filePath = path.join(targetProject, relativeFile);

  if (fs.existsSync(filePath)) {
    console.log(`✅ ${relativeFile}`);
  } else {
    console.log(`❌ ${relativeFile} — MISSING`);
    hasError = true;
  }
}

// --------------------------------------------------
// 3. React source integrity
// --------------------------------------------------

const appPath = path.join(targetProject, "src", "App.jsx");
const cssPath = path.join(targetProject, "src", "index.css");

console.log("");
console.log("React Source Check");
console.log("────────────────────────────────");

if (fs.existsSync(appPath)) {
  const appContent = fs.readFileSync(appPath, "utf8");

  console.log(`✅ App.jsx readable (${appContent.length} characters)`);

  // These are basic project-level anchors.
  // Later these will become explicit Guardian feature markers.
  const appAnchors = [
    "NUMPY VISUAL EXPLAINER",
    "Banarasi Coder",
    "Array Playground",
    "SHAPE",
    "NDIM",
    "AXIS",
    "SIZE",
    "DTYPE",
    "Guardian Protected",
  ];

  for (const anchor of appAnchors) {
    if (appContent.includes(anchor)) {
      console.log(`   ✅ ${anchor}`);
    } else {
      console.log(`   ⚠️ ${anchor} — NOT FOUND`);
    }
  }
} else {
  console.log("❌ App.jsx cannot be checked");
  hasError = true;
}

if (fs.existsSync(cssPath)) {
  const cssContent = fs.readFileSync(cssPath, "utf8");

  console.log(`✅ index.css readable (${cssContent.length} characters)`);
} else {
  console.log("❌ index.css cannot be checked");
  hasError = true;
}

// --------------------------------------------------
// Final status
// --------------------------------------------------

console.log("");
console.log("────────────────────────────────");

if (hasError) {
  console.log("STATUS: 🔴 BLOCKED");
  console.log("Project integrity check failed.");
  process.exitCode = 1;
} else {
  console.log("STATUS: 🟢 SAFE");
  console.log("Project structure is intact.");
}

console.log("");
