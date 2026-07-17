import { mkdir, rm, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { chromium } from "playwright";

const rootDir = resolve(import.meta.dirname, "..");
const recordingDir = "/private/tmp/rewindcup-launch-recording";
const timingFile = "/private/tmp/rewindcup-launch-recording-start.txt";
const browserExecutable = process.env.PLAYWRIGHT_CHROMIUM_PATH || "/opt/homebrew/bin/chromium";
const productionUrl = process.env.REWINDCUP_URL || "https://rewindcup.com/";

await rm(recordingDir, { force: true, recursive: true });
await mkdir(recordingDir, { recursive: true });

const browser = await chromium.launch({
  executablePath: browserExecutable,
  headless: true,
  args: [
    "--disable-background-networking",
    "--disable-renderer-backgrounding",
    "--disable-background-timer-throttling",
    "--hide-scrollbars",
    "--use-angle=swiftshader",
    "--use-gl=angle"
  ]
});

const context = await browser.newContext({
  colorScheme: "dark",
  deviceScaleFactor: 1,
  recordVideo: {
    dir: recordingDir,
    size: { width: 1280, height: 720 }
  },
  viewport: { width: 1280, height: 720 }
});

await context.addInitScript(() => {
  window.localStorage.clear();
});

const page = await context.newPage();
const video = page.video();
const recordingOrigin = Date.now();

function elapsed() {
  return Date.now() - captureOrigin;
}

async function waitUntil(milliseconds) {
  const remaining = milliseconds - elapsed();
  if (remaining > 0) await page.waitForTimeout(remaining);
}

await page.goto(productionUrl, { waitUntil: "domcontentloaded", timeout: 45_000 });
await page.getByRole("heading", { name: "Pick a year. Relive the World Cup.", exact: true }).waitFor();
await page.locator(".maplibregl-canvas").waitFor({ state: "visible", timeout: 30_000 });
await page.waitForTimeout(1_200);

const captureOrigin = Date.now();
const trimStartSeconds = (captureOrigin - recordingOrigin) / 1000;

await waitUntil(2_500);
await page.getByRole("button", { name: "Explore tournaments", exact: true }).click();

const tournamentTray = page.getByRole("region", { name: "Tournament selection", exact: true });
await tournamentTray.waitFor({ state: "visible" });
await waitUntil(3_000);
await tournamentTray.evaluate((element) => {
  element.scrollTo({ top: element.scrollHeight, behavior: "smooth" });
});
await waitUntil(4_500);
await tournamentTray.evaluate((element) => {
  element.scrollTo({ top: Math.round(element.scrollHeight * 0.42), behavior: "smooth" });
});

const france1998 = tournamentTray.getByRole("button", { name: /France 1998/i });
await waitUntil(5_500);
await france1998.scrollIntoViewIfNeeded();
await waitUntil(6_250);
await france1998.click();

const franceMarker = page.getByRole("button", { name: "France tournament team", exact: true });
await franceMarker.waitFor({ state: "visible", timeout: 15_000 });
await waitUntil(9_300);
await franceMarker.dispatchEvent("click");

const fixtureTray = page.getByRole("region", { name: "Fixture selection", exact: true });
await fixtureTray.waitFor({ state: "visible", timeout: 10_000 });
await waitUntil(11_800);
await page.emulateMedia({ reducedMotion: "reduce" });
await waitUntil(12_300);
await fixtureTray.getByRole("button", { name: "Final", exact: true }).click();

await waitUntil(13_600);
await fixtureTray.locator(".tray-fixture-row").click();

const replayTray = page.getByRole("region", { name: "Match replay and highlights", exact: true });
await replayTray.waitFor({ state: "visible", timeout: 10_000 });
await replayTray.getByRole("heading", { name: "Brazil vs France", exact: true }).waitFor();
await replayTray.locator("iframe[title='Brazil vs France highlights']").waitFor({ state: "visible", timeout: 10_000 });

const playButton = replayTray.getByRole("button", { name: "Play", exact: true });
if (await playButton.isVisible()) await playButton.click();

await waitUntil(20_200);
await writeFile(timingFile, `${trimStartSeconds.toFixed(3)}\n`, "utf8");

await context.close();
const rawVideoPath = await video.path();
await browser.close();

process.stdout.write(JSON.stringify({ rawVideoPath, timingFile, trimStartSeconds, rootDir }, null, 2));
