import dotenv from "dotenv";
import { defineConfig, devices } from "@playwright/test";

dotenv.config();

const baseURL = process.env.BASE_URL ?? "https://cloud.idurarapp.com";
const authFile = "playwright/.auth/idurar.json";
const isCI = Boolean(process.env.CI);

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: isCI,
  retries: 1,
  workers: 5,
  reporter: [
    ["list"],
    ["html", { outputFolder: "playwright-report", open: "on-failure" }],
  ],
  timeout: 45_000,
  expect: { timeout: 10_000 },
  use: {
    baseURL,
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    video: "off",
    // actionTimeout: 15_000,
    // navigationTimeout: 30_000,
  },
  projects: [
    {
      name: "setup",
      testMatch: "**/auth.setup.ts",
    },
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
        storageState: authFile,
      },
      dependencies: ["setup"],
      testIgnore: "**/auth.setup.ts",
    },
  ],
});
