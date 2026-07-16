import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop", "Phase-one navigation coverage only needs one browser viewport.");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await page.evaluate(() => window.localStorage.clear());
});

test("permanent tournament, team, and match URLs restore the experience", async ({ page }) => {
  await page.goto("/world-cups/2022");
  await expect(page.locator(".app-identity")).toContainText("Qatar 2022");
  await expect(page.locator(".country-flag-marker")).toHaveCount(32);

  await page.goto("/world-cups/2022/teams/ARG");
  const fixtureTray = page.getByRole("region", { name: "Fixture selection", exact: true });
  await expect(fixtureTray.getByText("Argentina fixtures", { exact: true })).toBeVisible();
  await expect(fixtureTray.locator(".tray-fixture-row")).toHaveCount(7);
  await expect(page).toHaveURL(/\/world-cups\/2022\/teams\/ARG$/);

  await page.goto("/world-cups/2022/matches/wc-2022-64-arg-fra");
  const replayTray = page.getByRole("region", { name: "Match replay and highlights", exact: true });
  await expect(replayTray.getByRole("heading", { name: "Argentina vs France", exact: true })).toBeVisible();
  await expect(replayTray.locator("iframe[title='Argentina vs France highlights']")).toHaveAttribute(
    "src",
    /youtube\.com\/embed\/xX_dwqVzc4c/
  );
  await expect(page).toHaveURL(/\/world-cups\/2022\/matches\/wc-2022-64-arg-fra$/);
});

test("command palette searches fixtures, players, venues, teams, and years", async ({ page }) => {
  await page.keyboard.press("Control+k");
  const palette = page.getByRole("dialog", { name: "Search the World Cup archive", exact: true });
  const search = palette.getByRole("combobox");
  await expect(palette).toBeVisible();
  await expect(search).toBeFocused();

  await search.fill("Argentina France 2022");
  const finalResult = palette.getByRole("option", { name: /Argentina vs France/i });
  await expect(finalResult).toBeVisible();
  await finalResult.click();
  await expect(page).toHaveURL(/\/world-cups\/2022\/matches\/wc-2022-64-arg-fra$/);
  await expect(page.getByRole("heading", { name: "Argentina vs France", exact: true })).toBeVisible();

  await page.keyboard.press("Control+k");
  await search.fill("Lusail 2022");
  await expect(palette.getByRole("option", { name: /Lusail Stadium/i })).toBeVisible();

  await search.fill("Kylian Mbappé 2018");
  await expect(palette.getByRole("option", { name: /Kylian Mbappé/i })).toBeVisible();

  await search.fill("Cabo Verde 2026");
  await expect(palette.getByRole("option", { name: /Cabo Verde Canada, Mexico & USA 2026 · Group H/i })).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(palette).toBeHidden();
});

test("favorites persist and continue watching restores the replay cursor", async ({ page }) => {
  await page.getByTitle("Tournament selection").click();
  const tournamentTray = page.getByRole("region", { name: "Tournament selection", exact: true });
  await tournamentTray.getByRole("button", { name: /Qatar 2022/i }).click();
  const favoriteButton = page.getByRole("button", { name: "Add Qatar 2022 to favorites", exact: true });
  await favoriteButton.click();
  await expect(page.getByRole("button", { name: "Remove Qatar 2022 from favorites", exact: true })).toHaveAttribute(
    "aria-pressed",
    "true"
  );

  await page.goto("/");
  await page.reload();
  await page.keyboard.press("Control+k");
  const palette = page.getByRole("dialog", { name: "Search the World Cup archive", exact: true });
  await expect(palette.getByRole("option", { name: /Qatar 2022.*Favorite/i })).toBeVisible();
  const search = palette.getByRole("combobox");
  await search.fill("Argentina France 2022");
  await palette.getByRole("option", { name: /Argentina vs France/i }).click();
  const replayTray = page.getByRole("region", { name: "Match replay and highlights", exact: true });
  await replayTray.getByRole("button", { name: "Play", exact: true }).click();
  await replayTray.getByRole("button", { name: "Next", exact: true }).click();
  await expect.poll(() => page.evaluate(() => {
    const stored = window.localStorage.getItem("rewindcup:preferences:v1");
    return stored ? JSON.parse(stored).resume?.cursor : null;
  })).toBe(1);

  await page.goto("/");
  const continueCard = page.getByRole("region", { name: "Continue watching", exact: true });
  await expect(continueCard.getByText("Argentina vs France", { exact: true })).toBeVisible();
  await expect(continueCard.getByRole("button", { name: "Choose a tournament", exact: true })).toBeVisible();
  await continueCard.getByRole("button", { name: "Resume replay", exact: true }).click();

  await expect(page).toHaveURL(/\/world-cups\/2022\/matches\/wc-2022-64-arg-fra$/);
  await expect(replayTray.getByRole("progressbar", { name: "Replay progress", exact: true })).toHaveAttribute(
    "aria-valuetext",
    /2 of \d+ moments/
  );
});

test("share control sends the current permanent URL to the native share sheet", async ({ page }) => {
  await page.evaluate(() => {
    Object.defineProperty(navigator, "share", {
      configurable: true,
      value: async (data: ShareData) => {
        window.localStorage.setItem("rewindcup:test-share", JSON.stringify(data));
      }
    });
  });

  await page.getByTitle("Tournament selection").click();
  const tournamentTray = page.getByRole("region", { name: "Tournament selection", exact: true });
  await tournamentTray.getByRole("button", { name: /Qatar 2022/i }).click();
  await expect(page).toHaveURL(/\/world-cups\/2022$/);
  const expectedShareUrl = page.url();

  await page.getByRole("button", { name: "Share current experience", exact: true }).click();
  await expect(page.locator(".share-toast")).toHaveText("Shared successfully.");
  await expect.poll(() => page.evaluate(() => {
    const stored = window.localStorage.getItem("rewindcup:test-share");
    return stored ? JSON.parse(stored) : null;
  })).toMatchObject({
    title: "Qatar 2022 · Rewind Cup",
    url: expectedShareUrl
  });
});

test("creator credit and report control include the current permanent URL", async ({ page }) => {
  await page.goto("/world-cups/2022/matches/wc-2022-64-arg-fra");
  const currentUrl = page.url();

  const creatorCredit = page.getByRole("link", { name: "Made with love by David Oti on X", exact: true });
  await expect(creatorCredit).toBeVisible();
  await expect(creatorCredit).toHaveAttribute("href", "https://x.com/iamdavidoti");
  await expect(creatorCredit).toHaveAttribute("target", "_blank");

  await page.evaluate(() => {
    Object.defineProperty(window, "open", {
      configurable: true,
      value: (url: string | URL | undefined) => {
        window.localStorage.setItem("rewindcup:test-report", String(url));
        return null;
      }
    });
  });

  await page.getByRole("button", { name: "Report this fixture on X", exact: true }).click();
  await expect.poll(() => page.evaluate(() => window.localStorage.getItem("rewindcup:test-report"))).not.toBeNull();

  const openedReportUrl = await page.evaluate(() => window.localStorage.getItem("rewindcup:test-report"));
  expect(openedReportUrl).not.toBeNull();
  const parsedReportUrl = new URL(openedReportUrl!);
  expect(parsedReportUrl.origin + parsedReportUrl.pathname).toBe("https://x.com/intent/post");
  expect(parsedReportUrl.searchParams.get("text")).toContain("@iamdavidoti");
  expect(parsedReportUrl.searchParams.get("text")).toContain("Argentina vs France at Qatar 2022");
  expect(parsedReportUrl.searchParams.get("text")).toContain(currentUrl);
});
