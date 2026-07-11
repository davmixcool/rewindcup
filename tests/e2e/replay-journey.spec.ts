import { expect, test, type Locator, type Page } from "@playwright/test";

type BrowserIssue = {
  text: string;
  url: string;
};

function watchForMapIssues(page: Page) {
  const issues: BrowserIssue[] = [];
  const mapIssuePattern = /404|maplibre|style is not done loading|expected value to be of type number|could not be loaded/i;

  page.on("console", (message) => {
    if (message.type() !== "error") return;

    const location = message.location();
    const issue = {
      text: message.text(),
      url: location.url || "browser console"
    };
    if (mapIssuePattern.test(`${issue.text} ${issue.url}`)) {
      issues.push(issue);
    }
  });

  page.on("pageerror", (error) => {
    if (mapIssuePattern.test(error.message)) {
      issues.push({ text: error.message, url: "page error" });
    }
  });

  return issues;
}

async function expectInsideViewport(locator: Locator, page: Page) {
  await expect(locator).toBeVisible();
  const box = await locator.boundingBox();
  const viewport = page.viewportSize();

  expect(box).not.toBeNull();
  expect(viewport).not.toBeNull();
  if (!box || !viewport) return;

  expect(box.x).toBeGreaterThanOrEqual(-1);
  expect(box.y).toBeGreaterThanOrEqual(-1);
  expect(box.x + box.width).toBeLessThanOrEqual(viewport.width + 1);
  expect(box.y + box.height).toBeLessThanOrEqual(viewport.height + 1);
}

async function expectNoHorizontalOverflow(page: Page) {
  const dimensions = await page.evaluate(() => ({
    clientWidth: document.documentElement.clientWidth,
    scrollWidth: document.documentElement.scrollWidth
  }));

  expect(dimensions.scrollWidth).toBeLessThanOrEqual(dimensions.clientWidth + 1);
}

async function waitForMapPaint(page: Page) {
  const canvas = page.locator(".maplibregl-canvas");
  await expect(canvas).toBeVisible();
  await expect.poll(async () => canvas.evaluate((element) => {
    const mapCanvas = element as HTMLCanvasElement;
    return mapCanvas.width > 0 && mapCanvas.height > 0;
  })).toBe(true);
  await page.waitForTimeout(900);
}

async function selectTournament(page: Page) {
  await page.getByTitle("Tournament selection").click();
  const tournamentTray = page.getByRole("region", { name: "Tournament selection", exact: true });
  await expectInsideViewport(tournamentTray, page);
  await tournamentTray.getByRole("button", { name: /Korea\/Japan 2002/i }).click();
  await expect(tournamentTray).toBeHidden();
  await expect(page.locator(".country-flag-marker")).toHaveCount(32);
}

async function selectSaudiArabiaRun(page: Page) {
  await page.getByTitle("Experience settings").click();
  const settingsTray = page.getByRole("region", { name: "Experience settings", exact: true });
  const spinSetting = settingsTray.getByRole("button", { name: /Slow globe spin/i });
  await spinSetting.click();
  await expect(spinSetting).toContainText("Off");
  await settingsTray.getByTitle("Close tray").click();

  await page.getByRole("button", { name: "Saudi Arabia tournament team" }).click();
  const fixtureTray = page.getByRole("region", { name: "Fixture selection", exact: true });
  await expect(fixtureTray).toBeVisible();
  await expect(fixtureTray.getByText("Saudi Arabia fixtures")).toBeVisible();
  await expect(fixtureTray.locator(".tray-fixture-row")).toHaveCount(3);
  await expectInsideViewport(page.locator(".bottom-tray.is-open"), page);
  return fixtureTray;
}

test("tournament, country, fixture, stadium, and replay journey", async ({ page }, testInfo) => {
  const mapIssues = watchForMapIssues(page);
  await page.goto("/");

  await expect(page.getByTitle("Tournament selection")).toBeEnabled();
  await expect(page.getByTitle("Group stages")).toBeDisabled();
  await expect(page.getByTitle("Fixture selection")).toBeDisabled();
  await expect(page.getByTitle("Replay")).toBeDisabled();
  await expectNoHorizontalOverflow(page);

  await selectTournament(page);
  await waitForMapPaint(page);
  await page.screenshot({ path: testInfo.outputPath("country-globe.png") });

  const fixtureTray = await selectSaudiArabiaRun(page);
  await expectNoHorizontalOverflow(page);
  await page.screenshot({ path: testInfo.outputPath("fixture-tray.png") });

  await fixtureTray.locator(".tray-fixture-row").first().click();
  const replayTray = page.getByRole("region", { name: "Match replay and highlights", exact: true });
  await expect(replayTray).toBeVisible({ timeout: 20_000 });
  await expect(replayTray.locator("iframe[title*='highlights']")).toBeVisible();
  await expectInsideViewport(page.locator(".bottom-tray.is-open"), page);
  await expectNoHorizontalOverflow(page);
  await page.screenshot({ path: testInfo.outputPath("replay-tray.png") });

  await page.getByTitle("Back to country globe").click();
  await expect(replayTray).toBeHidden();
  await expect(page.locator(".country-flag-marker")).toHaveCount(32);
  await expect(page.locator(".country-flag-marker.is-selected")).toHaveCount(0);
  await expect(page.getByTitle("Replay")).toBeDisabled();

  expect(mapIssues).toEqual([]);
});

test("fixture travel can be cancelled back to the country globe", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop", "The cancellation race only needs one browser viewport.");

  const mapIssues = watchForMapIssues(page);
  await page.goto("/");
  await selectTournament(page);
  const fixtureTray = await selectSaudiArabiaRun(page);
  await fixtureTray.locator(".tray-fixture-row").first().click();

  const replayTray = page.getByRole("region", { name: "Match replay and highlights", exact: true });
  await expect(replayTray).toBeVisible({ timeout: 20_000 });
  await page.getByTitle(/Next fixture in Saudi Arabia run/i).click();
  await expect(replayTray).toBeHidden();
  await page.getByTitle("Back to country globe").click();

  await expect(page.locator(".country-flag-marker")).toHaveCount(32);
  await page.waitForTimeout(4_000);
  await expect(replayTray).toBeHidden();
  await expect(page.locator(".country-flag-marker")).toHaveCount(32);
  await page.screenshot({ path: testInfo.outputPath("cancelled-flight-globe.png") });

  expect(mapIssues).toEqual([]);
});
