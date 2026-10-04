
import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/ui",

  testMatch: "**/*.spec.js",

  timeout: 30000,

  use: {
    browserName: "chromium",
    baseURL: "http://127.0.0.1:5173",
    headless: true,
    screenshot: "only-on-failure",
    video: "retain-on-failure"
  },

  webServer: {
    command: "npm run dev -- --host 127.0.0.1",
    cwd: "../numpy-visual-explainer",
    url: "http://127.0.0.1:5173",
    reuseExistingServer: true,
    timeout: 120000
  },

  reporter: "list"
});
