
const runButton = document.getElementById("runGuardian");
const clearLogButton = document.getElementById("clearLog");

const logElement = document.getElementById("log");

const overallStatus = document.getElementById("overallStatus");
const overallMessage = document.getElementById("overallMessage");
const statusIcon = document.getElementById("statusIcon");
const systemStatus = document.getElementById("systemStatus");

const featureStatus = document.getElementById("featureStatus");
const projectStatus = document.getElementById("projectStatus");
const gitStatus = document.getElementById("gitStatus");
const testStatus = document.getElementById("testStatus");

const featureValue = document.getElementById("featureValue");
const projectValue = document.getElementById("projectValue");
const gitValue = document.getElementById("gitValue");
const testValue = document.getElementById("testValue");

const featureList = document.getElementById("featureList");
const featureCount = document.getElementById("featureCount");

const baseline = document.getElementById("baseline");
const current = document.getElementById("current");
const changedFiles = document.getElementById("changedFiles");


// ==================================================
// Browser / UI Test Card
// ==================================================

function ensureUiTestCard() {

  let uiStatus = document.getElementById("uiTestStatus");
  let uiValue = document.getElementById("uiTestValue");

  if (uiStatus && uiValue) {
    return {
      status: uiStatus,
      value: uiValue
    };
  }

  const checksGrid =
    document.querySelector(".checks-grid");

  if (!checksGrid) {
    return {
      status: null,
      value: null
    };
  }

  const card = document.createElement("div");

  card.className = "check-card";

  card.id = "uiTestCard";

  card.innerHTML = `
    <div class="check-icon">🧪</div>

    <div class="check-info">
      <span class="check-title">
        Browser / UI Tests
      </span>

      <span
        class="check-status"
        id="uiTestStatus"
      >
        —
      </span>
    </div>

    <div
      class="check-value"
      id="uiTestValue"
    >
      Waiting
    </div>
  `;

  checksGrid.appendChild(card);

  uiStatus =
    document.getElementById("uiTestStatus");

  uiValue =
    document.getElementById("uiTestValue");

  return {
    status: uiStatus,
    value: uiValue
  };
}


const uiTestElements =
  ensureUiTestCard();


// ==================================================
// Status Helpers
// ==================================================

function setStatus(element, state, text) {

  if (!element) return;

  element.className =
    `check-status ${state}`;

  element.textContent =
    text;
}


function setSystemStatus(state, text) {

  if (!systemStatus) return;

  systemStatus.className =
    `status-badge ${state}`;

  systemStatus.textContent =
    `● ${text}`;
}


function setOverall(state, title, message) {

  if (overallStatus) {
    overallStatus.textContent =
      title;
  }

  if (overallMessage) {
    overallMessage.textContent =
      message;
  }

  if (statusIcon) {

    statusIcon.className =
      `status-icon ${state}`;

    if (state === "safe") {
      statusIcon.textContent = "✓";
    }

    else if (
      state === "warning" ||
      state === "blocked"
    ) {
      statusIcon.textContent = "!";
    }

    else {
      statusIcon.textContent = "🛡️";
    }

  }

}


// ==================================================
// Parse Guardian Output
// ==================================================

function parseResult(output) {

  const result = {

    feature: "neutral",
    project: "neutral",
    git: "neutral",
    tests: "neutral",
    uiTests: "neutral",

    featureValue: "Waiting",
    projectValue: "Waiting",
    gitValue: "Waiting",
    testValue: "Waiting",
    uiTestValue: "Waiting",

    baseline: "—",
    current: "—",
    changedFiles: "—",

    features: []

  };


  // ================================================
  // Feature Protection
  // ================================================

  if (
    output.includes(
      "Feature Protection PASSED"
    )
  ) {

    result.feature = "safe";
    result.featureValue = "PASS";

  }

  if (
    output.includes(
      "Feature Protection FAILED"
    ) ||
    output.includes(
      "FEATURE ANCHOR MISSING"
    )
  ) {

    result.feature = "blocked";
    result.featureValue = "BLOCKED";

  }


  // ================================================
  // Project Integrity
  // ================================================

  if (
    output.includes(
      "Project Integrity PASSED"
    )
  ) {

    result.project = "safe";
    result.projectValue = "PASS";

  }

  if (
    output.includes(
      "Project Integrity FAILED"
    )
  ) {

    result.project = "blocked";
    result.projectValue = "BLOCKED";

  }


  // ================================================
  // Git Diff
  // ================================================

  if (
    output.includes(
      "Git Diff PASSED"
    )
  ) {

    result.git = "safe";
    result.gitValue = "PASS";

  }

  if (
    output.includes(
      "Git Diff FAILED"
    )
  ) {

    result.git = "blocked";
    result.gitValue = "BLOCKED";

  }


  // ================================================
  // Git Baseline
  // ================================================

  const baselineMatch =
    output.match(
      /Baseline:\s*(.+)/
    );

  const currentMatch =
    output.match(
      /Current:\s*(.+)/
    );

  if (baselineMatch) {

    result.baseline =
      baselineMatch[1].trim();

  }

  if (currentMatch) {

    result.current =
      currentMatch[1].trim();

  }


  // ================================================
  // Changed Files
  // ================================================

  if (
    output.includes(
      "No changes detected."
    )
  ) {

    result.changedFiles = "0";

  }

  else {

    const changedMatch =
      output.match(
        /Changed Files:\s*([\s\S]*?)Diff Stats:/
      );

    if (changedMatch) {

      const lines =
        changedMatch[1]
          .split("\n")
          .map(line => line.trim())
          .filter(
            line =>
              line &&
              !line.startsWith("✓")
          );

      result.changedFiles =
        lines.length.toString();

    }

  }


  // ================================================
  // Unit Tests
  // ================================================

  const testMatch =
    output.match(
      /Tests\s+(\d+)\s+passed\s+\((\d+)\)/
    );

  if (
    output.includes(
      "Unit Tests PASSED"
    )
  ) {

    result.tests = "safe";

    if (testMatch) {

      result.testValue =
        `${testMatch[1]}/${testMatch[2]}`;

    }

    else {

      result.testValue =
        "PASS";

    }

  }


  if (
    output.includes(
      "Unit Tests FAILED"
    )
  ) {

    result.tests = "blocked";

    result.testValue =
      "FAILED";

  }


  // ================================================
  // Browser / UI Tests
  // ================================================

  const uiSection =
    output.split("🔎 Browser / UI Tests").pop() || "";

  const uiPassedMatch =
    uiSection.match(/(\d+)\s+passed/);

  if (
    output.includes(
      "Browser / UI Tests PASSED"
    )
  ) {

    result.uiTests = "safe";

    if (uiPassedMatch) {

      result.uiTestValue =
        `${uiPassedMatch[1]}/4`;

    }

    else {

      result.uiTestValue =
        "PASS";

    }

  }


  if (
    output.includes(
      "Browser / UI Tests FAILED"
    )
  ) {

    result.uiTests = "blocked";

    result.uiTestValue =
      "FAILED";

  }


  // ================================================
  // Feature List
  // ================================================

  const featureRegex =
    /([a-z0-9-]+)\s+—\s+(PLANNED|protected|FEATURE ANCHOR MISSING)/g;

  let match;

  while (
    (match = featureRegex.exec(output))
  ) {

    let state = "planned";

    if (
      match[2] === "protected"
    ) {

      state = "safe";

    }

    if (
      match[2] ===
      "FEATURE ANCHOR MISSING"
    ) {

      state = "blocked";

    }

    result.features.push({

      id: match[1],

      state,

      label: match[2]

    });

  }


  return result;
}


// ==================================================
// Render Features
// ==================================================

function renderFeatures(features) {

  if (!featureList) return;

  if (!features.length) {

    featureList.innerHTML = `
      <div class="empty-state">
        No feature data available.
      </div>
    `;

    if (featureCount) {
      featureCount.textContent = "—";
    }

    return;

  }


  if (featureCount) {

    featureCount.textContent =
      `${features.length} tracked`;

  }


  featureList.innerHTML =
    features
      .map(feature => {

        let icon = "○";

        if (
          feature.state === "safe"
        ) {

          icon = "✓";

        }

        if (
          feature.state === "blocked"
        ) {

          icon = "✕";

        }

        return `
          <div class="feature-row">

            <span class="feature-name">
              ${feature.id}
            </span>

            <span
              class="feature-state ${feature.state}"
            >
              ${icon} ${feature.label}
            </span>

          </div>
        `;

      })
      .join("");

}


// ==================================================
// Render Guardian Result
// ==================================================

function renderResult(output, exitCode) {

  const result =
    parseResult(output);


  // -----------------------------------------------
  // Feature
  // -----------------------------------------------

  setStatus(
    featureStatus,
    result.feature,
    result.feature === "safe"
      ? "PASS"
      : result.feature === "blocked"
        ? "BLOCKED"
        : "—"
  );


  // -----------------------------------------------
  // Project
  // -----------------------------------------------

  setStatus(
    projectStatus,
    result.project,
    result.project === "safe"
      ? "PASS"
      : result.project === "blocked"
        ? "BLOCKED"
        : "—"
  );


  // -----------------------------------------------
  // Git
  // -----------------------------------------------

  setStatus(
    gitStatus,
    result.git,
    result.git === "safe"
      ? "PASS"
      : result.git === "blocked"
        ? "BLOCKED"
        : "—"
  );


  // -----------------------------------------------
  // Unit Tests
  // -----------------------------------------------

  setStatus(
    testStatus,
    result.tests,
    result.tests === "safe"
      ? "PASS"
      : result.tests === "blocked"
        ? "BLOCKED"
        : "—"
  );


  // -----------------------------------------------
  // Browser / UI Tests
  // -----------------------------------------------

  if (
    uiTestElements.status
  ) {

    setStatus(
      uiTestElements.status,
      result.uiTests,
      result.uiTests === "safe"
        ? "PASS"
        : result.uiTests === "blocked"
          ? "BLOCKED"
          : "—"
    );

  }


  // -----------------------------------------------
  // Values
  // -----------------------------------------------

  if (featureValue) {

    featureValue.textContent =
      result.featureValue;

  }

  if (projectValue) {

    projectValue.textContent =
      result.projectValue;

  }

  if (gitValue) {

    gitValue.textContent =
      result.gitValue;

  }

  if (testValue) {

    testValue.textContent =
      result.testValue;

  }

  if (
    uiTestElements.value
  ) {

    uiTestElements.value.textContent =
      result.uiTestValue;

  }


  // -----------------------------------------------
  // Git Information
  // -----------------------------------------------

  if (baseline) {

    baseline.textContent =
      result.baseline;

  }

  if (current) {

    current.textContent =
      result.current;

  }

  if (changedFiles) {

    changedFiles.textContent =
      result.changedFiles;

  }


  // -----------------------------------------------
  // Features
  // -----------------------------------------------

  renderFeatures(
    result.features
  );


  // -----------------------------------------------
  // Overall Guardian Verdict
  // -----------------------------------------------

  if (
    exitCode === 0
  ) {

    setOverall(
      "safe",
      "PROJECT SAFE",
      "All Guardian checks passed."
    );

    setSystemStatus(
      "safe",
      "SAFE"
    );

  }

  else {

    setOverall(
      "blocked",
      "PROJECT BLOCKED",
      "Guardian detected a protection failure."
    );

    setSystemStatus(
      "blocked",
      "BLOCKED"
    );

  }

}


// ==================================================
// Run Guardian
// ==================================================

async function runGuardian() {

  runButton.disabled = true;

  runButton.textContent =
    "⏳ RUNNING...";


  setSystemStatus(
    "neutral",
    "RUNNING"
  );


  setOverall(
    "neutral",
    "CHECKING PROJECT",
    "Guardian is running all protection checks..."
  );


  logElement.textContent =
    "Starting Guardian...\n\n";


  // Reset all cards

  setStatus(
    featureStatus,
    "neutral",
    "—"
  );

  setStatus(
    projectStatus,
    "neutral",
    "—"
  );

  setStatus(
    gitStatus,
    "neutral",
    "—"
  );

  setStatus(
    testStatus,
    "neutral",
    "—"
  );

  if (
    uiTestElements.status
  ) {

    setStatus(
      uiTestElements.status,
      "neutral",
      "—"
    );

  }


  try {

    const response =
      await fetch(
        "/api/run",
        {
          method: "POST"
        }
      );


    if (!response.ok) {

      throw new Error(
        `Guardian server returned HTTP ${response.status}`
      );

    }


    const data =
      await response.json();


    logElement.textContent =
      data.output ||
      "No output received.";


    renderResult(
      data.output || "",
      data.exitCode
    );


  }

  catch (error) {

    logElement.textContent =
      `Guardian server error:\n\n${error.message}`;


    setOverall(
      "blocked",
      "GUARDIAN ERROR",
      "Could not communicate with the Guardian server."
    );


    setSystemStatus(
      "blocked",
      "ERROR"
    );

  }


  runButton.disabled = false;

  runButton.textContent =
    "🛡 RUN GUARDIAN";

}


// ==================================================
// Event Listeners
// ==================================================

runButton.addEventListener(
  "click",
  runGuardian
);


clearLogButton.addEventListener(
  "click",
  () => {

    logElement.textContent =
      "Guardian is ready.";

  }
);
