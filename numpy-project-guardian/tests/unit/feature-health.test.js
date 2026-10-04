import { describe, it, expect } from "vitest";
import fs from "fs";

const manifestPath = "guardian/FEATURE_MANIFEST.json";
const healthPath = "guardian/feature-health.json";

function loadJson(filePath) {
  return JSON.parse(
    fs.readFileSync(filePath, "utf8")
  );
}

describe("NumPy Project Guardian - Feature Health Map", () => {
  it("should have a valid feature health file", () => {
    const health = loadJson(healthPath);

    expect(health).toBeDefined();
    expect(health.features).toBeInstanceOf(Array);
  });

  it("every protected feature should have a health mapping", () => {
    const manifest = loadJson(manifestPath);
    const health = loadJson(healthPath);

    const protectedIds = manifest.features
      .filter((feature) => feature.mustPreserve === true)
      .map((feature) => feature.id);

    const healthIds = health.features.map(
      (feature) => feature.id
    );

    for (const id of protectedIds) {
      expect(healthIds).toContain(id);
    }
  });

  it("should not contain duplicate health feature IDs", () => {
    const health = loadJson(healthPath);

    const ids = health.features.map(
      (feature) => feature.id
    );

    expect(new Set(ids).size).toBe(ids.length);
  });

  it("should not contain unknown feature IDs", () => {
    const manifest = loadJson(manifestPath);
    const health = loadJson(healthPath);

    const manifestIds = new Set(
      manifest.features.map(
        (feature) => feature.id
      )
    );

    for (const feature of health.features) {
      expect(manifestIds.has(feature.id)).toBe(true);
    }
  });

  it("every health mapping should define a verification type", () => {
    const health = loadJson(healthPath);

    for (const feature of health.features) {
      expect(
        feature.verification?.type
      ).toBeTruthy();
    }
  });

  it("every health mapping should define tests", () => {
    const health = loadJson(healthPath);

    for (const feature of health.features) {
      expect(
        feature.verification?.tests
      ).toBeInstanceOf(Array);

      expect(
        feature.verification.tests.length
      ).toBeGreaterThan(0);
    }
  });
});