import { mkdir, rm, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { chromium } from "playwright";

const rootDir = resolve(import.meta.dirname, "..");
const recordingMode = process.env.REWINDCUP_RECORDING_MODE === "mobile" ? "mobile" : "desktop";
const isMobile = recordingMode === "mobile";
const viewport = isMobile ? { width: 432, height: 768 } : { width: 1280, height: 720 };
const recordingDir = `/private/tmp/rewindcup-launch-recording-${recordingMode}`;
const timingFile = `/private/tmp/rewindcup-launch-recording-${recordingMode}-start.txt`;
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
    "--autoplay-policy=no-user-gesture-required",
    "--hide-scrollbars",
    "--mute-audio",
    "--use-angle=swiftshader",
    "--use-gl=angle"
  ]
});

const context = await browser.newContext({
  colorScheme: "dark",
  deviceScaleFactor: 1,
  hasTouch: isMobile,
  isMobile,
  recordVideo: {
    dir: recordingDir,
    size: viewport
  },
  viewport
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

const qatar2022 = tournamentTray.getByRole("button", { name: /Qatar 2022/i });
await waitUntil(5_500);
await qatar2022.scrollIntoViewIfNeeded();
await waitUntil(6_250);
await qatar2022.click();

const argentinaMarker = page.getByRole("button", { name: "Argentina tournament team", exact: true });
await argentinaMarker.waitFor({ state: "visible", timeout: 15_000 });
await waitUntil(10_750);
await argentinaMarker.dispatchEvent("click");

const fixtureTray = page.getByRole("region", { name: "Fixture selection", exact: true });
await fixtureTray.waitFor({ state: "visible", timeout: 10_000 });
await waitUntil(13_500);
await page.emulateMedia({ reducedMotion: "reduce" });
await waitUntil(14_000);
await fixtureTray.getByRole("button", { name: "Final", exact: true }).click();

await waitUntil(15_300);
const finalFixture = fixtureTray.locator(".tray-fixture-row").first();
await finalFixture.waitFor({ state: "visible", timeout: 10_000 });
await finalFixture.dispatchEvent("click");

const replayTray = page.getByRole("region", { name: "Match replay and highlights", exact: true });
await replayTray.waitFor({ state: "visible", timeout: 15_000 });
if (!isMobile) {
  await page.addStyleTag({
    content: `
      .bottom-tray.is-open:has(.tray-replay-popover) {
        width: min(760px, calc(100vw - 48px)) !important;
      }
      .tray-replay-popover {
        max-height: min(76svh, 680px) !important;
      }
      .tray-replay-grid {
        grid-template-columns: minmax(0, 1fr) 280px !important;
        overflow-y: visible !important;
      }
      .tray-highlight-card {
        min-height: 280px !important;
      }
      .tray-highlight-embed {
        min-height: 225px !important;
      }
    `
  });
} else {
  await page.addStyleTag({
    content: `
      .bottom-tray.is-open:has(.tray-replay-popover) {
        width: calc(100vw - 12px) !important;
      }
      .tray-replay-popover {
        max-height: min(78svh, 620px) !important;
      }
      .tray-scoreline {
        display: none !important;
      }
      .tray-highlight-embed {
        min-height: 220px !important;
      }
    `
  });
}
await replayTray.getByRole("heading", { name: "Argentina vs France", exact: true }).waitFor();
const highlightFrame = replayTray.locator("iframe[title='Argentina vs France highlights']");
await highlightFrame.waitFor({ state: "visible", timeout: 10_000 });
await highlightFrame.evaluate((element) => {
  const embedUrl = new URL(element.src);
  embedUrl.searchParams.set("autoplay", "1");
  embedUrl.searchParams.set("mute", "1");
  embedUrl.searchParams.set("start", "8");
  element.src = embedUrl.toString();
});

await waitUntil(17_200);
const playButton = replayTray.getByRole("button", { name: "Play", exact: true });
if (await playButton.isVisible()) await playButton.click();

const highlightPlayer = highlightFrame.contentFrame();
const nativePlayButton = highlightPlayer.locator(".ytp-large-play-button");
await page.waitForTimeout(750);
if (await nativePlayButton.isVisible()) await nativePlayButton.click();

const highlightVideo = highlightPlayer.locator("video.html5-main-video");
await highlightVideo.waitFor({ state: "attached", timeout: 5_000 }).catch(() => {});
const playbackStartSeconds = 8;
await highlightVideo.evaluate(async (element, startSeconds) => {
  element.muted = true;
  if (element.currentTime < startSeconds) element.currentTime = startSeconds;
  await element.play();
}, playbackStartSeconds, { timeout: 5_000 }).catch(() => {});
let highlightPlaybackStarted = false;
for (let attempt = 0; attempt < 12; attempt += 1) {
  const currentTime = await highlightVideo.evaluate(
    (element) => element.currentTime,
    undefined,
    { timeout: 1_000 }
  ).catch(() => 0);
  if (currentTime > playbackStartSeconds + 0.25) {
    highlightPlaybackStarted = true;
    break;
  }
  await page.waitForTimeout(250);
}

if (!highlightPlaybackStarted) {
  const playerDiagnostics = await highlightVideo.evaluate((element) => ({
    currentTime: element.currentTime,
    error: element.error?.message ?? null,
    networkState: element.networkState,
    paused: element.paused,
    readyState: element.readyState,
    src: element.currentSrc
  })).catch(() => null);
  const playerText = await highlightPlayer.locator("body").innerText().catch(() => "");
  throw new Error(`The embedded highlight video did not begin playback: ${JSON.stringify({ playerDiagnostics, playerText })}`);
}

await waitUntil(24_200);
await writeFile(timingFile, `${trimStartSeconds.toFixed(3)}\n`, "utf8");

await context.close();
const rawVideoPath = await video.path();
await browser.close();

process.stdout.write(JSON.stringify({ highlightPlaybackStarted, rawVideoPath, timingFile, trimStartSeconds, recordingMode, rootDir, viewport }, null, 2));
