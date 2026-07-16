import { expect, test } from "@playwright/test";
import { tournaments } from "@/data/tournaments";

const expectedSitemapUrlCount = 1 + tournaments.reduce(
  (total, tournament) => total + 1 + tournament.teams.length + tournament.matches.length,
  0
);

test.beforeEach(({}, testInfo) => {
  test.skip(testInfo.project.name !== "desktop", "Search-discovery metadata only needs one HTTP client run.");
});

test("robots.txt permits crawling and advertises the canonical sitemap", async ({ request }) => {
  const response = await request.get("/robots.txt");
  const body = await response.text();

  expect(response.ok()).toBeTruthy();
  expect(response.headers()["content-type"]).toContain("text/plain");
  expect(body).toContain("User-Agent: *");
  expect(body).toContain("Allow: /");
  expect(body).toContain("Host: https://rewindcup.com");
  expect(body).toContain("Sitemap: https://rewindcup.com/sitemap.xml");
});

test("sitemap publishes every tournament, team journey, and fixture URL", async ({ request }) => {
  const response = await request.get("/sitemap.xml");
  const body = await response.text();

  expect(response.ok()).toBeTruthy();
  expect(response.headers()["content-type"]).toContain("application/xml");
  expect(body).toContain("<loc>https://rewindcup.com/</loc>");
  expect(body).toContain("<loc>https://rewindcup.com/world-cups/1930</loc>");
  expect(body).toContain("<loc>https://rewindcup.com/world-cups/2022/teams/ARG</loc>");
  expect(body).toContain("<loc>https://rewindcup.com/world-cups/2022/matches/wc-2022-64-arg-fra</loc>");
  expect(body).toContain("<loc>https://rewindcup.com/world-cups/2026</loc>");
  expect(body.match(/<loc>/g)).toHaveLength(expectedSitemapUrlCount);
});
