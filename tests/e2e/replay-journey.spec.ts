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
  test.slow();
  await page.emulateMedia({ reducedMotion: "reduce" });

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
  const highlightsFrame = replayTray.locator("iframe[title='Germany vs Saudi Arabia highlights']");
  await expect(highlightsFrame).toBeVisible();
  await expect(highlightsFrame).toHaveAttribute("src", /youtube\.com\/embed\/FC_0MHwyhuk/);
  await expect(replayTray.getByRole("link", { name: "Open World Cup Goals highlights", exact: true })).toHaveAttribute(
    "href",
    "https://www.youtube.com/watch?v=FC_0MHwyhuk"
  );
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

test("2006 through 2026 journeys and tournament switching reset stale state", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop", "The cross-tournament regression only needs one browser viewport.");
  test.slow();

  await page.emulateMedia({ reducedMotion: "reduce" });
  const mapIssues = watchForMapIssues(page);
  await page.goto("/");

  await page.getByTitle("Tournament selection").click();
  const tournamentTray = page.getByRole("region", { name: "Tournament selection", exact: true });
  await expectInsideViewport(tournamentTray, page);
  await expect(tournamentTray.getByText("21 World Cups", { exact: true })).toBeVisible();
  await tournamentTray.getByRole("button", { name: /Germany 2006/i }).click();
  await expect(tournamentTray).toBeHidden();

  await expect(page.locator(".country-flag-marker")).toHaveCount(32);
  await expect(page.getByRole("button", { name: "Ghana tournament team", exact: true })).toBeVisible();
  await waitForMapPaint(page);

  await page.getByTitle("Group stages").click();
  const teamTray = page.getByRole("region", { name: "Group stage countries", exact: true });
  await expect(teamTray.locator(".tray-team-group")).toHaveCount(8);
  await expect(teamTray.locator(".tray-team-row")).toHaveCount(32);
  const groupSizes = await teamTray.locator(".tray-team-group").evaluateAll((groups) =>
    groups.map((group) => group.querySelectorAll(".tray-team-row").length)
  );
  expect(groupSizes).toEqual([4, 4, 4, 4, 4, 4, 4, 4]);
  await teamTray.getByRole("button", { name: /Ghana/i }).click();
  const fixtureTray = page.getByRole("region", { name: "Fixture selection", exact: true });
  await expect(fixtureTray.getByText("Ghana fixtures", { exact: true })).toBeVisible();
  await expect(fixtureTray.locator(".tray-fixture-row")).toHaveCount(4);

  const roundOf16Filter = fixtureTray.getByRole("button", { name: "R16", exact: true });
  await expect(fixtureTray.getByText("Watch highlights", { exact: true })).toHaveCount(4);
  await expect(fixtureTray.getByRole("button", { name: /Reports/i })).toHaveCount(0);
  await roundOf16Filter.click();
  await expect(roundOf16Filter).toHaveAttribute("aria-pressed", "true");
  await expect(fixtureTray.locator(".tray-fixture-row")).toHaveCount(1);
  await fixtureTray.locator(".tray-fixture-row").click();

  const replayTray = page.getByRole("region", { name: "Match replay and highlights", exact: true });
  await expect(replayTray).toBeVisible({ timeout: 20_000 });
  await expect(replayTray.getByRole("heading", { name: "Brazil vs Ghana", exact: true })).toBeVisible();
  const highlightsFrame = replayTray.locator("iframe[title='Brazil vs Ghana highlights']");
  await expect(highlightsFrame).toBeVisible();
  await expect(highlightsFrame).toHaveAttribute("src", /youtube\.com\/embed\/n1UWWqDpPYE/);
  const youtubeLink = replayTray.getByRole("link", { name: "Open WorldCupHighlightsTM highlights", exact: true });
  await expect(youtubeLink).toHaveAttribute("href", "https://www.youtube.com/watch?v=n1UWWqDpPYE");
  await expect(replayTray.getByRole("link", { name: "FIFA match report", exact: true })).toBeVisible();

  await page.getByTitle("Tournament selection").click();
  await expect(tournamentTray).toBeVisible();
  await tournamentTray.getByRole("button", { name: /Korea\/Japan 2002/i }).click();

  await expect(replayTray).toBeHidden();
  await expect(page.locator(".country-flag-marker")).toHaveCount(32);
  await expect(page.getByRole("button", { name: "Ghana tournament team", exact: true })).toHaveCount(0);
  await expect(page.getByRole("button", { name: "China tournament team", exact: true })).toBeVisible();
  await expect(page.locator(".country-flag-marker.is-selected")).toHaveCount(0);
  await expect(page.getByTitle("Replay")).toBeDisabled();

  await page.getByTitle("Fixture selection").click();
  await expect(fixtureTray.getByText("Korea/Japan 2002 fixtures", { exact: true })).toBeVisible();
  await expect(fixtureTray.locator(".tray-fixture-row")).toHaveCount(64);
  await expect(fixtureTray.getByRole("button", { name: "All", exact: true })).toHaveAttribute("aria-pressed", "true");
  await expect(fixtureTray.getByRole("button", { name: "R16", exact: true })).toHaveAttribute("aria-pressed", "false");
  await expect(fixtureTray.locator(".tray-fixture-row[aria-current='true']")).toHaveCount(0);
  await fixtureTray.getByTitle("Close tray").click();

  await page.getByTitle("Group stages").click();
  await expect(teamTray.locator(".tray-team-group")).toHaveCount(8);
  await expect(teamTray.locator(".tray-team-row")).toHaveCount(32);
  const groupE = teamTray.locator(".tray-team-group").filter({ hasText: "Group E" });
  await expect(groupE.getByRole("button", { name: /Germany/i })).toHaveCount(1);

  await page.getByTitle("Tournament selection").click();
  await tournamentTray.getByRole("button", { name: /South Africa 2010/i }).click();
  await expect(tournamentTray).toBeHidden();
  await expect(page.locator(".country-flag-marker")).toHaveCount(32);
  await expect(page.getByRole("button", { name: "Algeria tournament team", exact: true })).toBeVisible();

  await page.getByTitle("Group stages").click();
  await expect(teamTray.locator(".tray-team-group")).toHaveCount(8);
  await expect(teamTray.locator(".tray-team-row")).toHaveCount(32);
  await teamTray.getByRole("button", { name: /Spain/i }).click();
  await expect(fixtureTray.getByText("Spain fixtures", { exact: true })).toBeVisible();
  await expect(fixtureTray.locator(".tray-fixture-row")).toHaveCount(7);
  await expect(fixtureTray.getByText("Watch highlights", { exact: true })).toHaveCount(7);

  const finalFilter = fixtureTray.getByRole("button", { name: "Final", exact: true });
  await finalFilter.click();
  await expect(finalFilter).toHaveAttribute("aria-pressed", "true");
  await expect(fixtureTray.locator(".tray-fixture-row")).toHaveCount(1);
  await fixtureTray.locator(".tray-fixture-row").click();

  await expect(replayTray).toBeVisible({ timeout: 20_000 });
  await expect(replayTray.getByRole("heading", { name: "Netherlands vs Spain", exact: true })).toBeVisible();
  const finalHighlightsFrame = replayTray.locator("iframe[title='Netherlands vs Spain highlights']");
  await expect(finalHighlightsFrame).toBeVisible();
  await expect(finalHighlightsFrame).toHaveAttribute("src", /youtube\.com\/embed\/XJnIokctt7s/);
  await expect(replayTray.getByRole("link", { name: "Open TYFC HD highlights", exact: true })).toHaveAttribute(
    "href",
    "https://www.youtube.com/watch?v=XJnIokctt7s"
  );
  await expect(replayTray.getByRole("link", { name: "FIFA match report", exact: true })).toBeVisible();

  await page.getByTitle("Tournament selection").click();
  await expect(tournamentTray).toBeVisible();
  await tournamentTray.getByRole("button", { name: /Brazil 2014/i }).click();
  await expect(tournamentTray).toBeHidden();
  await expect(replayTray).toBeHidden();
  await expect(page.locator(".country-flag-marker")).toHaveCount(32);
  await expect(page.getByRole("button", { name: "Bosnia and Herzegovina tournament team", exact: true })).toBeVisible();
  await expect(page.getByRole("button", { name: "Colombia tournament team", exact: true })).toBeVisible();

  await page.getByTitle("Group stages").click();
  await expect(teamTray.locator(".tray-team-group")).toHaveCount(8);
  await expect(teamTray.locator(".tray-team-row")).toHaveCount(32);
  await teamTray.getByRole("button", { name: /Germany/i }).click();
  await expect(fixtureTray.getByText("Germany fixtures", { exact: true })).toBeVisible();
  await expect(fixtureTray.locator(".tray-fixture-row")).toHaveCount(7);
  await expect(fixtureTray.getByText("Watch highlights", { exact: true })).toHaveCount(7);

  await fixtureTray.getByRole("button", { name: "Final", exact: true }).click();
  await expect(fixtureTray.locator(".tray-fixture-row")).toHaveCount(1);
  await fixtureTray.locator(".tray-fixture-row").click();

  await expect(replayTray).toBeVisible({ timeout: 20_000 });
  await expect(replayTray.getByRole("heading", { name: "Germany vs Argentina", exact: true })).toBeVisible();
  const brazilFinalHighlightsFrame = replayTray.locator("iframe[title='Germany vs Argentina highlights']");
  await expect(brazilFinalHighlightsFrame).toBeVisible();
  await expect(brazilFinalHighlightsFrame).toHaveAttribute("src", /youtube\.com\/embed\/S4mRQnHPWTs/);
  await expect(replayTray.getByRole("link", { name: "Open TYFC HD highlights", exact: true })).toHaveAttribute(
    "href",
    "https://www.youtube.com/watch?v=S4mRQnHPWTs"
  );
  await expect(replayTray.getByRole("link", { name: "FIFA match report", exact: true })).toBeVisible();

  await page.getByTitle("Tournament selection").click();
  await tournamentTray.getByRole("button", { name: /Russia 2018/i }).click();
  await expect(tournamentTray).toBeHidden();
  await expect(replayTray).toBeHidden();
  await expect(page.locator(".country-flag-marker")).toHaveCount(32);
  await expect(page.getByRole("button", { name: "Iceland tournament team", exact: true })).toBeVisible();
  await expect(page.getByRole("button", { name: "Panama tournament team", exact: true })).toBeVisible();

  await page.getByTitle("Group stages").click();
  await expect(teamTray.locator(".tray-team-group")).toHaveCount(8);
  await expect(teamTray.locator(".tray-team-row")).toHaveCount(32);
  await teamTray.getByRole("button", { name: /France/i }).click();
  await expect(fixtureTray.getByText("France fixtures", { exact: true })).toBeVisible();
  await expect(fixtureTray.locator(".tray-fixture-row")).toHaveCount(7);
  await expect(fixtureTray.getByText("Watch highlights", { exact: true })).toHaveCount(7);

  await fixtureTray.getByRole("button", { name: "Final", exact: true }).click();
  await expect(fixtureTray.locator(".tray-fixture-row")).toHaveCount(1);
  await fixtureTray.locator(".tray-fixture-row").click();

  await expect(replayTray).toBeVisible({ timeout: 20_000 });
  await expect(replayTray.getByRole("heading", { name: "France vs Croatia", exact: true })).toBeVisible();
  const russiaFinalHighlightsFrame = replayTray.locator("iframe[title='France vs Croatia highlights']");
  await expect(russiaFinalHighlightsFrame).toHaveAttribute("src", /youtube\.com\/embed\/-FPXHR2bZBQ/);
  await expect(replayTray.getByRole("link", { name: "Open 101sports highlights", exact: true })).toHaveAttribute(
    "href",
    "https://www.youtube.com/watch?v=-FPXHR2bZBQ"
  );
  await expect(replayTray.getByRole("link", { name: "FIFA match report", exact: true })).toBeVisible();

  await page.getByTitle("Tournament selection").click();
  await tournamentTray.getByRole("button", { name: /Qatar 2022/i }).click();
  await expect(tournamentTray).toBeHidden();
  await expect(replayTray).toBeHidden();
  await expect(page.locator(".country-flag-marker")).toHaveCount(32);
  await expect(page.getByRole("button", { name: "Qatar tournament team", exact: true })).toBeVisible();
  await expect(page.getByRole("button", { name: "Wales tournament team", exact: true })).toBeVisible();

  await page.getByTitle("Group stages").click();
  await expect(teamTray.locator(".tray-team-group")).toHaveCount(8);
  await expect(teamTray.locator(".tray-team-row")).toHaveCount(32);
  await teamTray.getByRole("button", { name: /Argentina/i }).click();
  await expect(fixtureTray.getByText("Argentina fixtures", { exact: true })).toBeVisible();
  await expect(fixtureTray.locator(".tray-fixture-row")).toHaveCount(7);
  await expect(fixtureTray.getByText("Watch highlights", { exact: true })).toHaveCount(7);

  await fixtureTray.getByRole("button", { name: "Final", exact: true }).click();
  await expect(fixtureTray.locator(".tray-fixture-row")).toHaveCount(1);
  await fixtureTray.locator(".tray-fixture-row").click();

  await expect(replayTray).toBeVisible({ timeout: 20_000 });
  await expect(replayTray.getByRole("heading", { name: "Argentina vs France", exact: true })).toBeVisible();
  const qatarFinalHighlightsFrame = replayTray.locator("iframe[title='Argentina vs France highlights']");
  await expect(qatarFinalHighlightsFrame).toHaveAttribute("src", /youtube\.com\/embed\/xX_dwqVzc4c/);
  await expect(replayTray.getByRole("link", { name: "Open ITV Sport highlights", exact: true })).toHaveAttribute(
    "href",
    "https://www.youtube.com/watch?v=xX_dwqVzc4c"
  );
  await expect(replayTray.getByRole("link", { name: "FIFA match report", exact: true })).toBeVisible();

  await page.getByTitle("Tournament selection").click();
  await tournamentTray.getByRole("button", { name: /Canada, Mexico & USA 2026/i }).click();
  await expect(tournamentTray).toBeHidden();
  await expect(replayTray).toBeHidden();
  await expect(page.locator(".country-flag-marker")).toHaveCount(48);
  await expect(page.getByRole("button", { name: "Cabo Verde tournament team", exact: true })).toBeVisible();
  await expect(page.getByRole("button", { name: "Curaçao tournament team", exact: true })).toBeVisible();
  await expect(page.getByRole("button", { name: "Uzbekistan tournament team", exact: true })).toBeVisible();

  await page.getByTitle("Group stages").click();
  await expect(teamTray.locator(".tray-team-group")).toHaveCount(12);
  await expect(teamTray.locator(".tray-team-row")).toHaveCount(48);
  await teamTray.getByRole("button", { name: /France/i }).click();
  await expect(fixtureTray.getByText("France fixtures", { exact: true })).toBeVisible();
  await expect(fixtureTray.locator(".tray-fixture-row")).toHaveCount(7);
  await expect(fixtureTray.getByText("Watch highlights", { exact: true })).toHaveCount(7);
  await expect(fixtureTray.getByRole("button", { name: "R32", exact: true })).toBeVisible();

  await fixtureTray.getByRole("button", { name: "SF", exact: true }).click();
  await expect(fixtureTray.locator(".tray-fixture-row")).toHaveCount(1);
  await fixtureTray.locator(".tray-fixture-row").click();

  await expect(replayTray).toBeVisible({ timeout: 20_000 });
  await expect(replayTray.getByRole("heading", { name: "France vs Spain", exact: true })).toBeVisible();
  const northAmericaSemiFinalFrame = replayTray.locator("iframe[title='France vs Spain highlights']");
  await expect(northAmericaSemiFinalFrame).toHaveAttribute("src", /youtube\.com\/embed\/kKTLkp6iMLo/);
  await expect(replayTray.getByRole("link", { name: "Open SuperSport highlights", exact: true })).toHaveAttribute(
    "href",
    "https://www.youtube.com/watch?v=kKTLkp6iMLo"
  );
  await expect(replayTray.getByRole("link", { name: "FIFA match report", exact: true })).toBeVisible();

  expect(mapIssues).toEqual([]);
});

test("1938 through 1998 journeys preserve historical formats and reset tournament state", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop", "The historical-edition regression only needs one browser viewport.");
  test.slow();

  await page.emulateMedia({ reducedMotion: "reduce" });
  const mapIssues = watchForMapIssues(page);
  await page.goto("/");

  await page.getByTitle("Tournament selection").click();
  const tournamentTray = page.getByRole("region", { name: "Tournament selection", exact: true });
  await tournamentTray.getByRole("button", { name: /France 1938/i }).click();
  await expect(tournamentTray).toBeHidden();
  await expect(page.locator(".country-flag-marker")).toHaveCount(15);
  await expect(page.getByRole("button", { name: "Cuba tournament team", exact: true })).toBeVisible();
  await expect(page.getByRole("button", { name: "Dutch East Indies tournament team", exact: true })).toBeVisible();

  await page.getByTitle("Group stages").click();
  const teamTray = page.getByRole("region", { name: "Group stage countries", exact: true });
  await expect(teamTray.locator(".tray-team-group")).toHaveCount(1);
  await expect(teamTray.locator(".tray-team-row")).toHaveCount(15);
  await expect(teamTray.getByText("Knockout field", { exact: true })).toBeVisible();
  await teamTray.getByRole("button", { name: /Sweden/i }).click();

  const fixtureTray = page.getByRole("region", { name: "Fixture selection", exact: true });
  await expect(fixtureTray.getByText("Sweden fixtures", { exact: true })).toBeVisible();
  await expect(fixtureTray.locator(".tray-fixture-row")).toHaveCount(3);

  await page.getByTitle("Group stages").click();
  await teamTray.getByRole("button", { name: /Switzerland/i }).click();
  await expect(fixtureTray.getByText("Switzerland fixtures", { exact: true })).toBeVisible();
  await expect(fixtureTray.locator(".tray-fixture-row")).toHaveCount(3);
  await fixtureTray.getByRole("button", { name: "First round", exact: true }).click();
  await expect(fixtureTray.locator(".tray-fixture-row")).toHaveCount(2);
  await fixtureTray.locator(".tray-fixture-row").last().click();

  const replayTray = page.getByRole("region", { name: "Match replay and highlights", exact: true });
  await expect(replayTray).toBeVisible({ timeout: 20_000 });
  await expect(replayTray.getByRole("heading", { name: "Switzerland vs Germany", exact: true })).toBeVisible();
  await expect(replayTray.getByText("First-round replay · Paris", { exact: true })).toBeVisible();
  await expect(replayTray.locator("iframe[title='Switzerland vs Germany highlights']")).toHaveAttribute(
    "src",
    /youtube\.com\/embed\/3gu2Dnuvsa4/
  );
  await expect(replayTray.getByRole("link", { name: "Open Joefa's World Cup History highlights", exact: true })).toHaveAttribute(
    "href",
    "https://www.youtube.com/watch?v=3gu2Dnuvsa4"
  );
  await expect(replayTray.getByRole("link", { name: "FIFA match report", exact: true })).toBeVisible();

  await page.getByTitle("Tournament selection").click();
  await tournamentTray.getByRole("button", { name: /Brazil 1950/i }).click();
  await expect(tournamentTray).toBeHidden();
  await expect(page.locator(".country-flag-marker")).toHaveCount(13);
  await expect(page.getByRole("button", { name: "Bolivia tournament team", exact: true })).toBeVisible();
  await expect(page.getByRole("button", { name: "Paraguay tournament team", exact: true })).toBeVisible();

  await page.getByTitle("Group stages").click();
  await expect(teamTray.locator(".tray-team-group")).toHaveCount(5);
  await expect(teamTray.locator(".tray-team-row")).toHaveCount(17);
  await expect(teamTray.getByText("Final round · Group 1", { exact: true })).toBeVisible();
  await teamTray.getByRole("button", { name: /Uruguay/i }).first().click();

  await expect(fixtureTray.getByText("Uruguay fixtures", { exact: true })).toBeVisible();
  await expect(fixtureTray.locator(".tray-fixture-row")).toHaveCount(4);
  await expect(fixtureTray.getByText("Watch highlights", { exact: true })).toHaveCount(4);
  await fixtureTray.getByRole("button", { name: "Final round", exact: true }).click();
  await expect(fixtureTray.locator(".tray-fixture-row")).toHaveCount(3);
  await fixtureTray.locator(".tray-fixture-row").last().click();

  await expect(replayTray).toBeVisible({ timeout: 20_000 });
  await expect(replayTray.getByRole("heading", { name: "Uruguay vs Brazil", exact: true })).toBeVisible();
  await expect(replayTray.locator("iframe[title='Uruguay vs Brazil highlights']")).toHaveAttribute(
    "src",
    /youtube\.com\/embed\/l8WMlT3XWCc/
  );
  await expect(replayTray.getByRole("link", { name: "Open World Cup History highlights", exact: true })).toHaveAttribute(
    "href",
    "https://www.youtube.com/watch?v=l8WMlT3XWCc"
  );
  await expect(replayTray.getByRole("link", { name: "FIFA match report", exact: true })).toBeVisible();

  await page.getByTitle("Tournament selection").click();
  await tournamentTray.getByRole("button", { name: /Switzerland 1954/i }).click();
  await expect(tournamentTray).toBeHidden();
  await expect(page.locator(".country-flag-marker")).toHaveCount(16);
  await expect(page.getByRole("button", { name: "South Korea tournament team", exact: true })).toBeVisible();
  await expect(page.getByRole("button", { name: "Turkey tournament team", exact: true })).toBeVisible();

  await page.getByTitle("Group stages").click();
  await expect(teamTray.locator(".tray-team-group")).toHaveCount(4);
  await expect(teamTray.locator(".tray-team-row")).toHaveCount(16);
  await teamTray.getByRole("button", { name: /Switzerland/i }).first().click();

  await expect(fixtureTray.getByText("Switzerland fixtures", { exact: true })).toBeVisible();
  await expect(fixtureTray.locator(".tray-fixture-row")).toHaveCount(4);
  await expect(fixtureTray.getByText("Watch highlights", { exact: true })).toHaveCount(4);
  await fixtureTray.getByRole("button", { name: "Play-off", exact: true }).click();
  await expect(fixtureTray.locator(".tray-fixture-row")).toHaveCount(1);
  await fixtureTray.locator(".tray-fixture-row").click();

  await expect(replayTray).toBeVisible({ timeout: 20_000 });
  await expect(replayTray.getByRole("heading", { name: "Switzerland vs Italy", exact: true })).toBeVisible();
  await expect(replayTray.locator("iframe[title='Switzerland vs Italy highlights']")).toHaveAttribute(
    "src",
    /youtube\.com\/embed\/S11lGSZj_yE/
  );
  await expect(replayTray.getByRole("link", { name: "Open World cup History highlights", exact: true })).toHaveAttribute(
    "href",
    "https://www.youtube.com/watch?v=S11lGSZj_yE"
  );
  await expect(replayTray.getByRole("link", { name: "FIFA match report", exact: true })).toBeVisible();

  await page.getByTitle("Tournament selection").click();
  await tournamentTray.getByRole("button", { name: /Sweden 1958/i }).click();
  await expect(tournamentTray).toBeHidden();
  await expect(page.locator(".country-flag-marker")).toHaveCount(16);
  await expect(page.getByRole("button", { name: "Northern Ireland tournament team", exact: true })).toBeVisible();
  await expect(page.getByRole("button", { name: "Soviet Union tournament team", exact: true })).toBeVisible();

  await page.getByTitle("Group stages").click();
  await expect(teamTray.locator(".tray-team-group")).toHaveCount(4);
  await expect(teamTray.locator(".tray-team-row")).toHaveCount(16);
  await teamTray.getByRole("button", { name: /Northern Ireland/i }).first().click();

  await expect(fixtureTray.getByText("Northern Ireland fixtures", { exact: true })).toBeVisible();
  await expect(fixtureTray.locator(".tray-fixture-row")).toHaveCount(5);
  await expect(fixtureTray.getByText("Watch highlights", { exact: true })).toHaveCount(5);
  await fixtureTray.getByRole("button", { name: "Play-off", exact: true }).click();
  await expect(fixtureTray.locator(".tray-fixture-row")).toHaveCount(1);
  await fixtureTray.locator(".tray-fixture-row").click();

  await expect(replayTray).toBeVisible({ timeout: 20_000 });
  await expect(replayTray.getByRole("heading", { name: "Northern Ireland vs Czechoslovakia", exact: true })).toBeVisible();
  await expect(replayTray.locator("iframe[title='Northern Ireland vs Czechoslovakia highlights']")).toHaveAttribute(
    "src",
    /youtube\.com\/embed\/McmeYt85114/
  );
  await expect(replayTray.getByRole("link", { name: "Open Joefa's World Cup History highlights", exact: true })).toHaveAttribute(
    "href",
    "https://www.youtube.com/watch?v=McmeYt85114"
  );
  await expect(replayTray.getByRole("link", { name: "FIFA match report", exact: true })).toBeVisible();

  await page.getByTitle("Tournament selection").click();
  await tournamentTray.getByRole("button", { name: /Chile 1962/i }).click();
  await expect(tournamentTray).toBeHidden();
  await expect(page.locator(".country-flag-marker")).toHaveCount(16);
  await expect(page.getByRole("button", { name: "Colombia tournament team", exact: true })).toBeVisible();
  await expect(page.getByRole("button", { name: "Yugoslavia tournament team", exact: true })).toBeVisible();

  await page.getByTitle("Group stages").click();
  await expect(teamTray.locator(".tray-team-group")).toHaveCount(4);
  await expect(teamTray.locator(".tray-team-row")).toHaveCount(16);
  await teamTray.getByRole("button", { name: /Chile/i }).first().click();

  await expect(fixtureTray.getByText("Chile fixtures", { exact: true })).toBeVisible();
  await expect(fixtureTray.locator(".tray-fixture-row")).toHaveCount(6);
  await expect(fixtureTray.getByText("Watch highlights", { exact: true })).toHaveCount(6);
  await fixtureTray.getByRole("button", { name: "QF", exact: true }).click();
  await expect(fixtureTray.locator(".tray-fixture-row")).toHaveCount(1);
  await fixtureTray.getByRole("button", { name: "3rd", exact: true }).click();
  await expect(fixtureTray.locator(".tray-fixture-row")).toHaveCount(1);
  await fixtureTray.locator(".tray-fixture-row").click();

  await expect(replayTray).toBeVisible({ timeout: 20_000 });
  await expect(replayTray.getByRole("heading", { name: "Chile vs Yugoslavia", exact: true })).toBeVisible();
  await expect(replayTray.locator("iframe[title='Chile vs Yugoslavia highlights']")).toHaveAttribute(
    "src",
    /youtube\.com\/embed\/po7_zQ7cMq8/
  );
  await expect(replayTray.getByRole("link", { name: "Open sp1873 highlights", exact: true })).toHaveAttribute(
    "href",
    "https://www.youtube.com/watch?v=po7_zQ7cMq8"
  );
  await expect(replayTray.getByRole("link", { name: "FIFA match report", exact: true })).toBeVisible();

  await page.getByTitle("Tournament selection").click();
  await tournamentTray.getByRole("button", { name: /England 1966/i }).click();
  await expect(tournamentTray).toBeHidden();
  await expect(page.locator(".country-flag-marker")).toHaveCount(16);
  await expect(page.getByRole("button", { name: "North Korea tournament team", exact: true })).toBeVisible();

  await page.getByTitle("Group stages").click();
  await expect(teamTray.locator(".tray-team-group")).toHaveCount(4);
  await expect(teamTray.locator(".tray-team-row")).toHaveCount(16);
  await teamTray.getByRole("button", { name: /England/i }).first().click();

  await expect(fixtureTray.getByText("England fixtures", { exact: true })).toBeVisible();
  await expect(fixtureTray.locator(".tray-fixture-row")).toHaveCount(6);
  await expect(fixtureTray.getByText("Watch highlights", { exact: true })).toHaveCount(6);
  await fixtureTray.getByRole("button", { name: "QF", exact: true }).click();
  await expect(fixtureTray.locator(".tray-fixture-row")).toHaveCount(1);
  await fixtureTray.getByRole("button", { name: "Final", exact: true }).click();
  await expect(fixtureTray.locator(".tray-fixture-row")).toHaveCount(1);
  await fixtureTray.locator(".tray-fixture-row").click();

  await expect(replayTray).toBeVisible({ timeout: 20_000 });
  await expect(replayTray.getByRole("heading", { name: "England vs Germany", exact: true })).toBeVisible();
  await expect(replayTray.locator("iframe[title='England vs Germany highlights']")).toHaveAttribute(
    "src",
    /youtube\.com\/embed\/tZHo-rw1fjg/
  );
  await expect(replayTray.getByRole("link", { name: "Open Football Flashback 6 highlights", exact: true })).toHaveAttribute(
    "href",
    "https://www.youtube.com/watch?v=tZHo-rw1fjg"
  );
  await expect(replayTray.getByRole("link", { name: "FIFA match report", exact: true })).toBeVisible();

  await page.getByTitle("Tournament selection").click();
  await tournamentTray.getByRole("button", { name: /Mexico 1970/i }).click();
  await expect(tournamentTray).toBeHidden();
  await expect(page.locator(".country-flag-marker")).toHaveCount(16);
  await expect(page.getByRole("button", { name: "Israel tournament team", exact: true })).toBeVisible();

  await page.getByTitle("Group stages").click();
  await expect(teamTray.locator(".tray-team-group")).toHaveCount(4);
  await expect(teamTray.locator(".tray-team-row")).toHaveCount(16);
  await teamTray.getByRole("button", { name: /Brazil/i }).first().click();

  await expect(fixtureTray.getByText("Brazil fixtures", { exact: true })).toBeVisible();
  await expect(fixtureTray.locator(".tray-fixture-row")).toHaveCount(6);
  await expect(fixtureTray.getByText("Watch highlights", { exact: true })).toHaveCount(6);
  await fixtureTray.getByRole("button", { name: "QF", exact: true }).click();
  await expect(fixtureTray.locator(".tray-fixture-row")).toHaveCount(1);
  await fixtureTray.getByRole("button", { name: "Final", exact: true }).click();
  await expect(fixtureTray.locator(".tray-fixture-row")).toHaveCount(1);
  await fixtureTray.locator(".tray-fixture-row").click();

  await expect(replayTray).toBeVisible({ timeout: 20_000 });
  await expect(replayTray.getByRole("heading", { name: "Brazil vs Italy", exact: true })).toBeVisible();
  await expect(replayTray.locator("iframe[title='Brazil vs Italy highlights']")).toHaveAttribute(
    "src",
    /youtube\.com\/embed\/QMe3uoUbhkA/
  );
  await expect(replayTray.getByRole("link", { name: "Open Southstandred highlights", exact: true })).toHaveAttribute(
    "href",
    "https://www.youtube.com/watch?v=QMe3uoUbhkA"
  );
  await expect(replayTray.getByRole("link", { name: "FIFA match report", exact: true })).toBeVisible();

  await page.getByTitle("Tournament selection").click();
  await tournamentTray.getByRole("button", { name: /West Germany 1974/i }).click();
  await expect(tournamentTray).toBeHidden();
  await expect(page.locator(".country-flag-marker")).toHaveCount(16);
  await expect(page.getByRole("button", { name: "East Germany tournament team", exact: true })).toBeVisible();
  await expect(page.getByRole("button", { name: "Haiti tournament team", exact: true })).toBeVisible();
  await expect(page.getByRole("button", { name: "Zaire tournament team", exact: true })).toBeVisible();

  await page.getByTitle("Group stages").click();
  await expect(teamTray.locator(".tray-team-group")).toHaveCount(6);
  await expect(teamTray.locator(".tray-team-row")).toHaveCount(24);
  await expect(teamTray.getByText("Second group stage · Group B", { exact: true })).toBeVisible();
  await teamTray.getByRole("button", { name: /Netherlands/i }).first().click();

  await expect(fixtureTray.getByText("Netherlands fixtures", { exact: true })).toBeVisible();
  await expect(fixtureTray.locator(".tray-fixture-row")).toHaveCount(7);
  await expect(fixtureTray.getByText("Watch highlights", { exact: true })).toHaveCount(7);
  await fixtureTray.getByRole("button", { name: "Group 2", exact: true }).click();
  await expect(fixtureTray.locator(".tray-fixture-row")).toHaveCount(3);
  await fixtureTray.getByRole("button", { name: "Final", exact: true }).click();
  await expect(fixtureTray.locator(".tray-fixture-row")).toHaveCount(1);
  await fixtureTray.locator(".tray-fixture-row").click();

  await expect(replayTray).toBeVisible({ timeout: 20_000 });
  await expect(replayTray.getByRole("heading", { name: "Netherlands vs Germany", exact: true })).toBeVisible();
  await expect(replayTray.locator("iframe[title='Netherlands vs Germany highlights']")).toHaveAttribute(
    "src",
    /youtube\.com\/embed\/KpUCKi4yvuU/
  );
  await expect(replayTray.getByRole("link", { name: "Open LegendFootballForAll highlights", exact: true })).toHaveAttribute(
    "href",
    "https://www.youtube.com/watch?v=KpUCKi4yvuU"
  );
  await expect(replayTray.getByRole("link", { name: "FIFA match report", exact: true })).toBeVisible();

  await page.getByTitle("Tournament selection").click();
  await tournamentTray.getByRole("button", { name: /Argentina 1978/i }).click();
  await expect(tournamentTray).toBeHidden();
  await expect(page.locator(".country-flag-marker")).toHaveCount(16);
  await expect(page.getByRole("button", { name: "Iran tournament team", exact: true })).toBeVisible();
  await expect(page.getByRole("button", { name: "Tunisia tournament team", exact: true })).toBeVisible();

  await page.getByTitle("Group stages").click();
  await expect(teamTray.locator(".tray-team-group")).toHaveCount(6);
  await expect(teamTray.locator(".tray-team-row")).toHaveCount(24);
  await expect(teamTray.getByText("Second group stage · Group B", { exact: true })).toBeVisible();
  await teamTray.getByRole("button", { name: /Argentina/i }).first().click();

  await expect(fixtureTray.getByText("Argentina fixtures", { exact: true })).toBeVisible();
  await expect(fixtureTray.locator(".tray-fixture-row")).toHaveCount(7);
  await expect(fixtureTray.getByText("Watch highlights", { exact: true })).toHaveCount(7);
  await fixtureTray.getByRole("button", { name: "Group 2", exact: true }).click();
  await expect(fixtureTray.locator(".tray-fixture-row")).toHaveCount(3);
  await fixtureTray.getByRole("button", { name: "Final", exact: true }).click();
  await expect(fixtureTray.locator(".tray-fixture-row")).toHaveCount(1);
  await fixtureTray.locator(".tray-fixture-row").click();

  await expect(replayTray).toBeVisible({ timeout: 20_000 });
  await expect(replayTray.getByRole("heading", { name: "Argentina vs Netherlands", exact: true })).toBeVisible();
  await expect(replayTray.locator("iframe[title='Argentina vs Netherlands highlights']")).toHaveAttribute(
    "src",
    /youtube\.com\/embed\/Y8lHUkJlWw4/
  );
  await expect(replayTray.getByRole("link", { name: "Open LoL Football highlights", exact: true })).toHaveAttribute(
    "href",
    "https://www.youtube.com/watch?v=Y8lHUkJlWw4"
  );
  await expect(replayTray.getByRole("link", { name: "FIFA match report", exact: true })).toBeVisible();

  await page.getByTitle("Tournament selection").click();
  await tournamentTray.getByRole("button", { name: /Spain 1982/i }).click();
  await expect(tournamentTray).toBeHidden();
  await expect(page.locator(".country-flag-marker")).toHaveCount(24);
  await expect(page.getByRole("button", { name: "Kuwait tournament team", exact: true })).toBeVisible();
  await expect(page.getByRole("button", { name: "Peru tournament team", exact: true })).toBeVisible();
  await expect(page.getByRole("button", { name: "El Salvador tournament team", exact: true })).toBeVisible();

  await page.getByTitle("Group stages").click();
  await expect(teamTray.locator(".tray-team-group")).toHaveCount(10);
  await expect(teamTray.locator(".tray-team-row")).toHaveCount(36);
  await expect(teamTray.getByText("Second group stage · Group C", { exact: true })).toBeVisible();
  await teamTray.getByRole("button", { name: /Italy/i }).first().click();

  await expect(fixtureTray.getByText("Italy fixtures", { exact: true })).toBeVisible();
  await expect(fixtureTray.locator(".tray-fixture-row")).toHaveCount(7);
  await expect(fixtureTray.getByText("Watch highlights", { exact: true })).toHaveCount(7);
  await fixtureTray.getByRole("button", { name: "Group 2", exact: true }).click();
  await expect(fixtureTray.locator(".tray-fixture-row")).toHaveCount(2);
  await fixtureTray.getByRole("button", { name: "Final", exact: true }).click();
  await expect(fixtureTray.locator(".tray-fixture-row")).toHaveCount(1);
  await fixtureTray.locator(".tray-fixture-row").click();

  await expect(replayTray).toBeVisible({ timeout: 20_000 });
  await expect(replayTray.getByRole("heading", { name: "Italy vs Germany", exact: true })).toBeVisible();
  await expect(replayTray.locator("iframe[title='Italy vs Germany highlights']")).toHaveAttribute(
    "src",
    /youtube\.com\/embed\/PZaskSOIbLc/
  );
  await expect(replayTray.getByRole("link", { name: "Open World Football Classics highlights", exact: true })).toHaveAttribute(
    "href",
    "https://www.youtube.com/watch?v=PZaskSOIbLc"
  );
  await expect(replayTray.getByRole("link", { name: "FIFA match report", exact: true })).toBeVisible();

  await page.getByTitle("Tournament selection").click();
  await tournamentTray.getByRole("button", { name: /Mexico 1986/i }).click();
  await expect(tournamentTray).toBeHidden();
  await expect(page.locator(".country-flag-marker")).toHaveCount(24);
  await expect(page.getByRole("button", { name: "Canada tournament team", exact: true })).toBeVisible();
  await expect(page.getByRole("button", { name: "Hungary tournament team", exact: true })).toBeVisible();
  await expect(page.getByRole("button", { name: "Iraq tournament team", exact: true })).toBeVisible();
  await expect(page.getByRole("button", { name: "Northern Ireland tournament team", exact: true })).toBeVisible();

  await page.getByTitle("Group stages").click();
  await expect(teamTray.locator(".tray-team-group")).toHaveCount(6);
  await expect(teamTray.locator(".tray-team-row")).toHaveCount(24);
  await teamTray.getByRole("button", { name: /Argentina/i }).click();

  await expect(fixtureTray.getByText("Argentina fixtures", { exact: true })).toBeVisible();
  await expect(fixtureTray.locator(".tray-fixture-row")).toHaveCount(7);
  await expect(fixtureTray.getByText("Watch highlights", { exact: true })).toHaveCount(7);
  await fixtureTray.getByRole("button", { name: "Final", exact: true }).click();
  await expect(fixtureTray.locator(".tray-fixture-row")).toHaveCount(1);
  await fixtureTray.locator(".tray-fixture-row").click();

  await expect(replayTray).toBeVisible({ timeout: 20_000 });
  await expect(replayTray.getByRole("heading", { name: "Argentina vs Germany", exact: true })).toBeVisible();
  await expect(replayTray.locator("iframe[title='Argentina vs Germany highlights']")).toHaveAttribute(
    "src",
    /youtube\.com\/embed\/EP4DxS2wwIA/
  );
  await expect(replayTray.getByRole("link", { name: "Open Football Flashback 6 highlights", exact: true })).toHaveAttribute(
    "href",
    "https://www.youtube.com/watch?v=EP4DxS2wwIA"
  );
  await expect(replayTray.getByRole("link", { name: "FIFA match report", exact: true })).toBeVisible();

  await page.getByTitle("Tournament selection").click();
  await tournamentTray.getByRole("button", { name: /Italy 1990/i }).click();
  await expect(tournamentTray).toBeHidden();
  await expect(page.locator(".country-flag-marker")).toHaveCount(24);
  await expect(page.getByRole("button", { name: "Czechoslovakia tournament team", exact: true })).toBeVisible();
  await expect(page.getByRole("button", { name: "Egypt tournament team", exact: true })).toBeVisible();
  await expect(page.getByRole("button", { name: "Soviet Union tournament team", exact: true })).toBeVisible();
  await expect(page.getByRole("button", { name: "United Arab Emirates tournament team", exact: true })).toBeVisible();

  await page.getByTitle("Group stages").click();
  await expect(teamTray.locator(".tray-team-group")).toHaveCount(6);
  await expect(teamTray.locator(".tray-team-row")).toHaveCount(24);
  await teamTray.getByRole("button", { name: /Germany/i }).click();

  await expect(fixtureTray.getByText("Germany fixtures", { exact: true })).toBeVisible();
  await expect(fixtureTray.locator(".tray-fixture-row")).toHaveCount(7);
  await expect(fixtureTray.getByText("Watch highlights", { exact: true })).toHaveCount(7);
  await fixtureTray.getByRole("button", { name: "Final", exact: true }).click();
  await expect(fixtureTray.locator(".tray-fixture-row")).toHaveCount(1);
  await fixtureTray.locator(".tray-fixture-row").click();

  await expect(replayTray).toBeVisible({ timeout: 20_000 });
  await expect(replayTray.getByRole("heading", { name: "Germany vs Argentina", exact: true })).toBeVisible();
  await expect(replayTray.locator("iframe[title='Germany vs Argentina highlights']")).toHaveAttribute(
    "src",
    /youtube\.com\/embed\/RG7SaUhHJ8E/
  );
  await expect(replayTray.getByRole("link", { name: "Open Football Flashback 6 highlights", exact: true })).toHaveAttribute(
    "href",
    "https://www.youtube.com/watch?v=RG7SaUhHJ8E"
  );
  await expect(replayTray.getByRole("link", { name: "FIFA match report", exact: true })).toBeVisible();

  await page.getByTitle("Tournament selection").click();
  await tournamentTray.getByRole("button", { name: /USA 1994/i }).click();
  await expect(tournamentTray).toBeHidden();
  await expect(replayTray).toBeHidden();
  await expect(page.locator(".country-flag-marker")).toHaveCount(24);
  await expect(page.getByRole("button", { name: "Bolivia tournament team", exact: true })).toBeVisible();
  await expect(page.getByRole("button", { name: "Romania tournament team", exact: true })).toBeVisible();

  await page.getByTitle("Group stages").click();
  await expect(teamTray.locator(".tray-team-group")).toHaveCount(6);
  await expect(teamTray.locator(".tray-team-row")).toHaveCount(24);
  await teamTray.getByRole("button", { name: /Brazil/i }).click();

  await expect(fixtureTray.getByText("Brazil fixtures", { exact: true })).toBeVisible();
  await expect(fixtureTray.locator(".tray-fixture-row")).toHaveCount(7);
  await expect(fixtureTray.getByText("Watch highlights", { exact: true })).toHaveCount(7);
  await fixtureTray.getByRole("button", { name: "Final", exact: true }).click();
  await expect(fixtureTray.locator(".tray-fixture-row")).toHaveCount(1);
  await fixtureTray.locator(".tray-fixture-row").click();

  await expect(replayTray).toBeVisible({ timeout: 20_000 });
  await expect(replayTray.getByRole("heading", { name: "Brazil vs Italy", exact: true })).toBeVisible();
  await expect(replayTray.locator("iframe[title='Brazil vs Italy highlights']")).toHaveAttribute(
    "src",
    /youtube\.com\/embed\/g6Zi32X1u1Q/
  );
  await expect(replayTray.getByRole("link", { name: "Open fifa tv online highlights", exact: true })).toHaveAttribute(
    "href",
    "https://www.youtube.com/watch?v=g6Zi32X1u1Q"
  );
  await expect(replayTray.getByRole("link", { name: "FIFA match report", exact: true })).toBeVisible();

  await page.getByTitle("Tournament selection").click();
  await tournamentTray.getByRole("button", { name: /France 1998/i }).click();
  await expect(replayTray).toBeHidden();
  await expect(page.locator(".country-flag-marker")).toHaveCount(32);
  await expect(page.getByRole("button", { name: "Scotland tournament team", exact: true })).toBeVisible();
  await expect(page.getByRole("button", { name: "Jamaica tournament team", exact: true })).toBeVisible();
  await expect(page.getByRole("button", { name: "Yugoslavia tournament team", exact: true })).toBeVisible();

  await page.getByTitle("Group stages").click();
  await expect(teamTray.locator(".tray-team-group")).toHaveCount(8);
  await expect(teamTray.locator(".tray-team-row")).toHaveCount(32);
  await teamTray.getByRole("button", { name: /France/i }).click();
  await expect(fixtureTray.getByText("France fixtures", { exact: true })).toBeVisible();
  await expect(fixtureTray.locator(".tray-fixture-row")).toHaveCount(7);
  await fixtureTray.getByRole("button", { name: "Final", exact: true }).click();
  await expect(fixtureTray.locator(".tray-fixture-row")).toHaveCount(1);
  await fixtureTray.locator(".tray-fixture-row").click();

  await expect(replayTray).toBeVisible({ timeout: 20_000 });
  await expect(replayTray.getByRole("heading", { name: "Brazil vs France", exact: true })).toBeVisible();
  await expect(replayTray.locator("iframe[title='Brazil vs France highlights']")).toHaveAttribute(
    "src",
    /youtube\.com\/embed\/xgWQmliYf2M/
  );
  await expect(replayTray.getByRole("link", { name: "Open World Cup Goals highlights", exact: true })).toHaveAttribute(
    "href",
    "https://www.youtube.com/watch?v=xgWQmliYf2M"
  );
  await expect(replayTray.getByRole("link", { name: "FIFA match report", exact: true })).toBeVisible();

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
