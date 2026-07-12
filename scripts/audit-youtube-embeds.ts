import { tournaments } from "../src/data/tournaments";

type VideoCheck = {
  matchId: string;
  tournamentId: string;
  videoId: string;
};

type CheckResult = VideoCheck & {
  error?: string;
  playableInEmbed: boolean;
  status: string | null;
};

const origin = process.env.YOUTUBE_EMBED_ORIGIN ?? "http://localhost:3001";
const requestedTournamentIds = process.argv.slice(2);
const selectedTournaments = requestedTournamentIds.length > 0
  ? tournaments.filter((tournament) => requestedTournamentIds.includes(tournament.id))
  : tournaments;

const missingTournamentIds = requestedTournamentIds.filter(
  (id) => !tournaments.some((tournament) => tournament.id === id)
);

if (missingTournamentIds.length > 0) {
  console.error(`Unknown tournament id(s): ${missingTournamentIds.join(", ")}`);
  process.exit(1);
}

const checks: VideoCheck[] = selectedTournaments.flatMap((tournament) =>
  tournament.matches.flatMap((match) => {
    const videoId = match.highlights.provider === "youtube" ? match.highlights.providerVideoId : undefined;
    return videoId ? [{ matchId: match.id, tournamentId: tournament.id, videoId }] : [];
  })
);

async function checkVideoOnce(check: VideoCheck): Promise<CheckResult> {
  const embedUrl = new URL(`https://www.youtube.com/embed/${check.videoId}`);
  embedUrl.searchParams.set("enablejsapi", "1");
  embedUrl.searchParams.set("origin", origin);

  try {
    const response = await fetch(embedUrl, {
      headers: {
        Referer: `${origin}/`,
        "User-Agent": "Mozilla/5.0"
      },
      signal: AbortSignal.timeout(20_000)
    });
    const html = await response.text();
    const status = /\\"previewPlayabilityStatus\\":\{\\"status\\":\\"([^\\"]+)/.exec(html)?.[1] ?? null;
    const playableInEmbed = html.includes('\\"playableInEmbed\\":true');

    return {
      ...check,
      error: response.ok ? undefined : `HTTP ${response.status}`,
      playableInEmbed,
      status
    };
  } catch (error) {
    return {
      ...check,
      error: error instanceof Error ? error.message : String(error),
      playableInEmbed: false,
      status: null
    };
  }
}

async function checkVideo(check: VideoCheck): Promise<CheckResult> {
  let result = await checkVideoOnce(check);

  for (let attempt = 1; attempt < 3; attempt += 1) {
    if (!result.error && result.status !== null) return result;
    await new Promise((resolve) => setTimeout(resolve, attempt * 300));
    result = await checkVideoOnce(check);
  }

  return result;
}

async function runWithConcurrency<T, R>(items: T[], concurrency: number, task: (item: T) => Promise<R>) {
  const results = new Array<R>(items.length);
  let cursor = 0;

  async function worker() {
    while (cursor < items.length) {
      const index = cursor;
      cursor += 1;
      results[index] = await task(items[index]);
    }
  }

  await Promise.all(Array.from({ length: Math.min(concurrency, items.length) }, () => worker()));
  return results;
}

async function main() {
  if (checks.length === 0) {
    throw new Error("No YouTube highlights found for the selected tournament(s).");
  }

  console.log(`Checking ${checks.length} YouTube embeds with origin ${origin}...`);
  const results = await runWithConcurrency(checks, 4, checkVideo);
  const failures = results.filter(
    (result) => result.error || result.status !== "OK" || !result.playableInEmbed
  );

  for (const tournament of selectedTournaments) {
    const tournamentResults = results.filter((result) => result.tournamentId === tournament.id);
    const passed = tournamentResults.filter(
      (result) => !result.error && result.status === "OK" && result.playableInEmbed
    ).length;
    console.log(`${tournament.name}: ${passed}/${tournamentResults.length} playable in embeds`);
  }

  if (failures.length > 0) {
    console.error(`YouTube embed audit failed for ${failures.length} video(s):`);
    for (const failure of failures) {
      console.error(
        `- ${failure.matchId}: ${failure.videoId} (status=${failure.status ?? "missing"}, playableInEmbed=${failure.playableInEmbed}${failure.error ? `, ${failure.error}` : ""})`
      );
    }
    process.exitCode = 1;
    return;
  }

  console.log(`YouTube embed audit passed: ${results.length}/${results.length} videos are playable.`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});
