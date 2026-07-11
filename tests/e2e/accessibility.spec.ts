import { expect, test } from "@playwright/test";

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
