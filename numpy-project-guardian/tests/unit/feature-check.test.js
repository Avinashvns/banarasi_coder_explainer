import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";

const manifestPath = path.resolve(
  "guardian",
  "FEATURE_MANIFEST.json"
);

function loadManifest() {
  return JSON.parse(
    fs.readFileSync(manifestPath, "utf8")
  );
}

describe("NumPy Project Guardian - Feature Manifest", () => {
  it("should have a valid feature manifest", () => {
    const manifest = loadManifest();

    expect(manifest).toBeDefined();
    expect(manifest.features).toBeInstanceOf(Array);
  });

  it("should contain protected features", () => {
    const manifest = loadManifest();

    const protectedFeatures =
      manifest.features.filter(
        (feature) => feature.mustPreserve === true
      );

    expect(protectedFeatures.length).toBeGreaterThan(0);
  });

  it("every locked feature must be protected", () => {
    const manifest = loadManifest();

    const invalidFeatures =
      manifest.features.filter(
        (feature) =>
          feature.status === "locked" &&
          feature.mustPreserve !== true
      );

    expect(invalidFeatures).toHaveLength(0);
  });

  it("every feature must have a unique id", () => {
    const manifest = loadManifest();

    const ids = manifest.features.map(
      (feature) => feature.id
    );

    expect(new Set(ids).size).toBe(ids.length);
  });

  it("every feature must have a name", () => {
    const manifest = loadManifest();

    for (const feature of manifest.features) {
      expect(feature.name).toBeTruthy();
    }
  });

  it("should protect the core NumPy features", () => {
    const manifest = loadManifest();

    const requiredFeatures = [
      "array-input",
      "array-validation",
      "array-rendering",
      "shape",
      "ndim",
      "size",
      "dtype",
      "cell-selection",
      "quick-examples",
      "numpy-code",
      "shape-playground",
      "step-controls"
    ];

    const featureIds = manifest.features.map(
      (feature) => feature.id
    );

    for (const requiredId of requiredFeatures) {
      expect(featureIds).toContain(requiredId);
    }
  });
});