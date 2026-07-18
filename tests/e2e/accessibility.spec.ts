import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
});

test("tray disclosures expose state and keep keyboard focus in context", async ({ page }) => {
  await page.goto("/");

  const tournamentTrigger = page.getByRole("button", { name: "Tournament selection", exact: true });
  await tournamentTrigger.focus();
  await tournamentTrigger.press("Enter");

  const tournamentTray = page.getByRole("region", { name: "Tournament selection", exact: true });
  const tournamentClose = tournamentTray.getByRole("button", { name: "Close tournament selection", exact: true });
  await expect(tournamentTrigger).toHaveAttribute("aria-expanded", "true");
  await expect(tournamentClose).toBeFocused();

  await page.keyboard.press("Escape");
  await expect(tournamentTray).toBeHidden();
  await expect(tournamentTrigger).toHaveAttribute("aria-expanded", "false");
  await expect(tournamentTrigger).toBeFocused();

  const settingsTrigger = page.getByRole("button", { name: "Experience settings", exact: true });
  await settingsTrigger.focus();
  await settingsTrigger.press("Enter");

  const settingsTray = page.getByRole("region", { name: "Experience settings", exact: true });
  await expect(settingsTray.getByRole("button", { name: "Close experience settings", exact: true })).toBeFocused();
  const spinSetting = settingsTray.getByRole("button", { name: /Slow globe spin/i });
  await expect(spinSetting).toHaveAttribute("aria-pressed", "true");
  await spinSetting.focus();
  await spinSetting.press("Enter");
  await expect(spinSetting).toHaveAttribute("aria-pressed", "false");
});

test("the keyboard-focusable map keeps a visible focus indicator", async ({ page }) => {
  await page.goto("/");

  const mapCanvas = page.locator(".maplibregl-canvas");
  await expect(mapCanvas).toBeVisible();
  await mapCanvas.focus();

  const outline = await mapCanvas.evaluate((element) => {
    const styles = window.getComputedStyle(element);
    return {
      style: styles.outlineStyle,
      width: Number.parseFloat(styles.outlineWidth)
    };
  });

  expect(outline.style).not.toBe("none");
  expect(outline.width).toBeGreaterThanOrEqual(3);
});

test("root onboarding clearly leads into tournament selection", async ({ page }) => {
  await page.goto("/");

  const prompt = page.getByRole("region", { name: "Pick a year. Relive the World Cup.", exact: true });
  const browseButton = prompt.getByRole("button", { name: "Explore tournaments", exact: true });
  const banner = prompt.locator(".landing-prompt-banner");
  const creatorCredit = prompt.getByRole("link", { name: "Made with love by David Oti on X", exact: true });
  await expect(prompt).toBeVisible();
  await expect(browseButton).toBeVisible();
  await expect(banner).toBeVisible();
  await expect(banner).toHaveAttribute("src", /world-cup-archive-banner\.webp/);
  await expect(creatorCredit).toBeVisible();
  await expect(creatorCredit).toHaveAttribute("href", "https://x.com/iamdavidoti");
  await expect(creatorCredit).toHaveAttribute("target", "_blank");
  await expect(browseButton).toHaveCSS("background-color", "rgb(103, 198, 253)");
  await expect(browseButton).toHaveCSS("color", "rgb(13, 23, 32)");

  const viewport = page.viewportSize();
  const promptBox = await prompt.boundingBox();
  expect(viewport).not.toBeNull();
  expect(promptBox).not.toBeNull();
  expect(promptBox!.x).toBeGreaterThanOrEqual(0);
  expect(promptBox!.y).toBeGreaterThanOrEqual(0);
  expect(promptBox!.x + promptBox!.width).toBeLessThanOrEqual(viewport!.width);
  expect(promptBox!.y + promptBox!.height).toBeLessThanOrEqual(viewport!.height);

  await browseButton.focus();
  await expect(browseButton).toBeFocused();
  await browseButton.press("Enter");

  const tournamentTray = page.getByRole("region", { name: "Tournament selection", exact: true });
  await expect(tournamentTray).toBeVisible();
  await expect(tournamentTray.getByRole("button", { name: "Close tournament selection", exact: true })).toBeFocused();
  await tournamentTray.getByRole("button", { name: /Uruguay 1930/i }).click();
  await expect(prompt).toBeHidden();
  await expect(page).toHaveURL(/\/world-cups\/1930$/);
});

test("landing credit and global report control stay visible and keyboard reachable", async ({ page }) => {
  await page.goto("/");

  const creatorCredit = page.getByRole("link", { name: "Made with love by David Oti on X", exact: true });
  const reportButton = page.getByRole("button", { name: "Report an issue with this page", exact: true });
  const sourceLink = page.getByRole("link", { name: "View Rewind Cup source code on GitHub", exact: true });
  await expect(creatorCredit).toBeVisible();
  await expect(reportButton).toBeVisible();
  await expect(sourceLink).toBeVisible();
  await expect(sourceLink).toHaveAttribute("href", "https://github.com/davmixcool/rewindcup");
  await expect(sourceLink).toHaveAttribute("target", "_blank");

  const viewport = page.viewportSize();
  expect(viewport).not.toBeNull();
  for (const control of [creatorCredit, reportButton, sourceLink]) {
    const box = await control.boundingBox();
    expect(box).not.toBeNull();
    expect(box!.x).toBeGreaterThanOrEqual(0);
    expect(box!.y).toBeGreaterThanOrEqual(0);
    expect(box!.x + box!.width).toBeLessThanOrEqual(viewport!.width);
    expect(box!.y + box!.height).toBeLessThanOrEqual(viewport!.height);
  }

  await reportButton.focus();
  await expect(reportButton).toBeFocused();
  await sourceLink.focus();
  await expect(sourceLink).toBeFocused();

  await page.goto("/world-cups/2022/matches/wc-2022-64-arg-fra");
  await expect(creatorCredit).toHaveCount(0);
  await expect(sourceLink).toBeVisible();
  const fixtureReportButton = page.getByRole("button", { name: "Report this fixture on X", exact: true });
  await expect(fixtureReportButton).toBeVisible();
  const fixtureReportBox = await fixtureReportButton.boundingBox();
  expect(fixtureReportBox).not.toBeNull();
  expect(fixtureReportBox!.x).toBeGreaterThanOrEqual(0);
  expect(fixtureReportBox!.y).toBeGreaterThanOrEqual(0);
  expect(fixtureReportBox!.x + fixtureReportBox!.width).toBeLessThanOrEqual(viewport!.width);
  expect(fixtureReportBox!.y + fixtureReportBox!.height).toBeLessThanOrEqual(viewport!.height);
});

test("tournament menus expose scroll range and reach their final option", async ({ page }) => {
  await page.goto("/");

  await page.locator(".app-identity").click();
  const dropdown = page.locator(".nav-dropdown");
  await expect(dropdown).toBeVisible();
  await expect(dropdown).toHaveCSS("overflow-y", "auto");
  await expect.poll(() => dropdown.evaluate((element) => element.scrollHeight > element.clientHeight)).toBe(true);
  await dropdown.evaluate((element) => element.scrollTo({ top: element.scrollHeight }));
  await expect.poll(() => dropdown.evaluate((element) => element.scrollTop > 0)).toBe(true);
  await expect(dropdown.getByRole("button", { name: /Canada, Mexico & USA 2026/i })).toBeVisible();

  await page.locator(".app-identity").click();
  await page.getByRole("button", { name: "Tournament selection", exact: true }).click();
  const bottomMenu = page.getByRole("region", { name: "Tournament selection", exact: true });
  await expect(bottomMenu).toHaveCSS("overflow-y", "auto");
  await expect.poll(() => bottomMenu.evaluate((element) => element.scrollHeight > element.clientHeight)).toBe(true);
  await bottomMenu.evaluate((element) => element.scrollTo({ top: element.scrollHeight }));
  await expect.poll(() => bottomMenu.evaluate((element) => element.scrollTop > 0)).toBe(true);
  await expect(bottomMenu.getByRole("button", { name: /Canada, Mexico & USA 2026/i })).toBeVisible();
});
