import { execFileSync } from "child_process";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const projectRoot = path.resolve(__dirname, "..");
const manifestPath = path.join(
  __dirname,
  "FEATURE_MANIFEST.json"
);

function runGit(args) {
  try {
    return execFileSync("git", args, {
      cwd: projectRoot,
      encoding: "utf8"
    }).trim();
  } catch (error) {
    throw new Error(
      `Git command failed: git ${args.join(" ")}\n${error.message}`
    );
  }
}

function loadManifest() {
  if (!fs.existsSync(manifestPath)) {
    throw new Error(
      "FEATURE_MANIFEST.json not found."
    );
  }

  return JSON.parse(
    fs.readFileSync(manifestPath, "utf8")
  );
}

function getBaseline() {
  const manifest = loadManifest();

  // Future mein baseline config se aayega.
  // Filhaal Guardian ke first stable tag ko use karenge.
  const baseline = "v0.1.0-guardian-foundation";

  const tags = runGit([
    "tag",
    "--list",
    baseline
  ]);

  if (!tags) {
    throw new Error(
      `Baseline tag "${baseline}" was not found.`
    );
  }

  return baseline;
}

function getChangedFiles(baseline) {
  const output = runGit([
    "diff",
    "--name-status",
    `${baseline}..HEAD`
  ]);

  if (!output) {
    return [];
  }

  return output
    .split("\n")
    .filter(Boolean)
    .map((line) => {
      const parts = line.split("\t");

      return {
        status: parts[0],
        file: parts[parts.length - 1]
      };
    });
}

function getDiffStats(baseline) {
  const output = runGit([
    "diff",
    "--shortstat",
    `${baseline}..HEAD`
  ]);

  return output || "No changes.";
}

function printReport() {
  console.log("");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("🛡️  NUMPY PROJECT GUARDIAN");
  console.log("       GIT DIFF CHECK");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

  const baseline = getBaseline();
  const changedFiles = getChangedFiles(baseline);
  const stats = getDiffStats(baseline);

  console.log("");
  console.log(`Baseline: ${baseline}`);
  console.log(`Current:  HEAD`);

  console.log("");
  console.log("Changed Files:");

  if (changedFiles.length === 0) {
    console.log("✓ No changes detected.");
  } else {
    for (const change of changedFiles) {
      let symbol = "•";

      if (change.status === "A") {
        symbol = "➕";
      } else if (change.status === "M") {
        symbol = "✏️";
      } else if (change.status === "D") {
        symbol = "❌";
      } else if (change.status === "R") {
        symbol = "🔄";
      }

      console.log(
        `${symbol} ${change.status} ${change.file}`
      );
    }
  }

  console.log("");
  console.log("Diff Stats:");
  console.log(stats);

  console.log("");
  console.log(
    changedFiles.length === 0
      ? "STATUS: 🟢 SAFE"
      : "STATUS: 🟡 CHANGES DETECTED"
  );

  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("");
}

try {
  printReport();
} catch (error) {
  console.error("");
  console.error("🔴 Guardian Error");
  console.error(error.message);
  console.error("");

  process.exitCode = 1;
}