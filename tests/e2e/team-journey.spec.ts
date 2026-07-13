import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop", "The journey behavior is covered once at the desktop viewport.");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await page.evaluate(() => window.localStorage.clear());
});

test("team URL opens a route summary and chronological highlight journey", async ({ page }) => {
  await page.goto("/world-cups/2022/teams/ARG");

  const fixtureTray = page.getByRole("region", { name: "Fixture selection", exact: true });
  const summary = fixtureTray.getByRole("region", { name: "Argentina journey summary", exact: true });
  const journey = fixtureTray.getByRole("list", { name: "Chronological Argentina journey", exact: true });

  await expect(page.locator("main")).toHaveClass(/mode-host/);
  await expect(summary.getByText("Team journey", { exact: true })).toBeVisible();
  await expect(summary).toContainText("Group C · Champion");
  await expect(summary).toContainText("6W 0D 1L");
  await expect(summary).toContainText("16-8");
  await expect(summary).toContainText("0 of 7 replays completed");
  await expect(journey.locator(".team-journey-stop")).toHaveCount(7);
  await expect(journey.getByText("Watch highlights", { exact: true }).first()).toBeVisible();

  const finalStop = journey.locator(".tray-fixture-row").last();
  await finalStop.focus();
  await expect(finalStop).toHaveAttribute("aria-current", "true");
  await expect(finalStop).toContainText("Final");
  await expect(finalStop).toContainText("France");
});

test("journey distinguishes saved and completed replays", async ({ page }) => {
  await page.evaluate(() => {
    window.localStorage.setItem("rewindcup:preferences:v1", JSON.stringify({
      completedMatchIds: ["wc-2022-64-arg-fra"],
      favorites: [],
      recent: [],
      resume: {
        cursor: 1,
        matchId: "wc-2022-50-arg-aus",
        mode: "live-score",
        teamCode: "ARG",
        tournamentId: "wc-2022",
        updatedAt: new Date().toISOString()
      }
    }));
  });

  await page.goto("/world-cups/2022/teams/ARG");
  const fixtureTray = page.getByRole("region", { name: "Fixture selection", exact: true });

  await expect(fixtureTray.getByText("1 of 7 replays completed", { exact: true })).toBeVisible();
  await expect(fixtureTray.getByText("Replay completed", { exact: true })).toBeVisible();
  await expect(fixtureTray.getByText("Resume at moment 2", { exact: true })).toBeVisible();
});
