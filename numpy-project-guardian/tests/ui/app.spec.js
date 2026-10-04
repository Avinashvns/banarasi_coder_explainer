
import { test, expect } from "@playwright/test";

test.describe("NumPy Visual Explainer — UI Protection", () => {

  test("application loads successfully", async ({ page }) => {
    await page.goto("/");

    await expect(
      page.getByText("NUMPY VISUAL EXPLAINER")
    ).toBeVisible();
  });

  test("main application shell exists", async ({ page }) => {
    await page.goto("/");

    await expect(
      page.getByText("Array Playground")
    ).toBeVisible();

    await expect(
      page.getByText("NUMPY CODE")
    ).toBeVisible();
  });

  test("protected inspector features exist", async ({ page }) => {
    await page.goto("/");

    await expect(
      page.getByText("SHAPE", { exact: true })
    ).toBeVisible();

    await expect(
      page.getByText("NDIM", { exact: true })
    ).toBeVisible();

    await expect(
      page.getByText("AXIS", { exact: true })
    ).toBeVisible();

    await expect(
      page.getByText("SIZE", { exact: true })
    ).toBeVisible();

    await expect(
      page.getByText("DTYPE", { exact: true })
    ).toBeVisible();
  });



  test("Guardian Protected section exists", async ({ page }) => {
    await page.goto("/");

    await expect(
      page.locator("strong").filter({ hasText: "Guardian Protected" })
    ).toBeVisible();
  });



});
