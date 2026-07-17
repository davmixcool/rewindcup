import { defineConfig } from "@playwright/test";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

const macChromiumExecutable = "/opt/homebrew/bin/chromium";
const chromiumExecutable = process.env.PLAYWRIGHT_CHROMIUM_PATH
  || (existsSync(macChromiumExecutable) ? macChromiumExecutable : undefined);
const recordedDevUrl = (() => {
  try {
    return readFileSync(resolve(process.cwd(), ".dev-url"), "utf8").trim();
  } catch {
    return "";
  }
})();
const baseURL = process.env.PLAYWRIGHT_BASE_URL || recordedDevUrl || "http://localhost:3001";

export default defineConfig({
  testDir: "./tests/e2e",
  outputDir: "test-results",
  timeout: 60_000,
  expect: {
    timeout: 15_000
  },
  fullyParallel: false,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  reporter: [["list"], ["html", { open: "never", outputFolder: "playwright-report" }]],
  use: {
    baseURL,
    browserName: "chromium",
    headless: true,
    launchOptions: chromiumExecutable ? { executablePath: chromiumExecutable } : undefined,
    screenshot: "only-on-failure",
    trace: "retain-on-failure",
    video: "off"
  },
  projects: [
    {
      name: "desktop",
      use: { viewport: { width: 1440, height: 900 } }
    },
    {
      name: "tablet",
      use: { viewport: { width: 1024, height: 768 } }
    },
    {
      name: "mobile",
      use: {
        hasTouch: true,
        isMobile: true,
        viewport: { width: 390, height: 844 }
      }
    }
  ]
});
