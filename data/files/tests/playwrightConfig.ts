import type { Language } from "@/app/ide/types";

const content = `import { defineConfig, devices } from "@playwright/test";

// Three browsers - because a "no" at the type level isn't enough.
export default defineConfig({
  testDir: "./specs",
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  // Centralize all visual baselines under tests/visual-snapshots/
  // instead of scattering them next to each spec.
  snapshotPathTemplate:
    "./visual-snapshots/{testFileName}-snapshots/{arg}{ext}",
  reporter: [
    ["list"],
    ["html", { open: "never" }],
  ],
  use: {
    baseURL: "https://hire.kuba.dev",
    storageState: "tests/.auth/user.json",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    { name: "firefox", use: { ...devices["Desktop Firefox"] } },
    { name: "webkit", use: { ...devices["Desktop Safari"] } },
  ],
});
`;

export const playwrightConfig = {
  path: "tests/playwright.config.ts",
  name: "playwright.config.ts",
  language: "ts" as Language,
  content,
};
