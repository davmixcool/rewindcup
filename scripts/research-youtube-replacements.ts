import { tournaments } from "../src/data/tournaments";
import { teamNames } from "../src/data/teamMetadata";
import type { Match, TeamCode, Tournament } from "../src/lib/types";

type Candidate = {
  channel: string;
  duration: string;
  title: string;
  videoId: string;
};

const origin = process.env.YOUTUBE_EMBED_ORIGIN || "https://rewindcup.com";
const requestedTournamentIds = process.argv.slice(2);
const selectedTournaments = requestedTournamentIds.length > 0
  ? tournaments.filter((tournament) => requestedTournamentIds.includes(tournament.id))
  : tournaments;

const aliases: Partial<Record<TeamCode, string[]>> = {
  BIH: ["Bosnia", "Bosnia Herzegovina"],
  CIV: ["Ivory Coast", "Cote d Ivoire"],
  CMR: ["Cameroon", "Cameroun"],
  CZE: ["Czech Republic", "Czechia"],
  GER: ["Germany", "West Germany"],
  IRL: ["Ireland", "Republic of Ireland"],
  KOR: ["South Korea", "Korea Republic", "Korea"],
  KSA: ["Saudi Arabia", "Saudi"],
  NED: ["Netherlands", "Holland"],
  PRK: ["North Korea", "Korea DPR"],
  RSA: ["South Africa"],
  SCG: ["Serbia Montenegro", "Serbia and Montenegro", "Serbia & Montenegro"],
  TCH: ["Czechoslovakia"],
  TRI: ["Trinidad Tobago", "Trinidad and Tobago", "Trinidad & Tobago"],
  URS: ["Soviet Union", "USSR"],
  USA: ["USA", "United States", "USMNT"],
  YUG: ["Yugoslavia"],
  ZAI: ["Zaire", "DR Congo"]
};

const existingVideoIds = new Set(
  tournaments.flatMap((tournament) =>
    tournament.matches.flatMap((match) => match.highlights.providerVideoId ?? [])
  )
);
const selectedVideoIds = new Set<string>();

function normalize(value: string) {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[’']/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function teamAliases(code: TeamCode) {
  return aliases[code] ?? [teamNames[code]];
}

function mentionsTeam(title: string, code: TeamCode) {
  const normalizedTitle = normalize(title);
  return teamAliases(code).some((alias) => normalizedTitle.includes(normalize(alias)));
}

function textOf(value: { simpleText?: string; runs?: Array<{ text?: string }> } | undefined) {
  return value?.simpleText ?? value?.runs?.map((run) => run.text ?? "").join("") ?? "";
}

function findRenderers(value: unknown, output: Record<string, unknown>[] = []) {
  if (!value || typeof value !== "object") return output;
  const record = value as Record<string, unknown>;
  if (record.videoRenderer && typeof record.videoRenderer === "object") {
    output.push(record.videoRenderer as Record<string, unknown>);
  }
  for (const child of Object.values(record)) findRenderers(child, output);
  return output;
}

async function fetchWithRetries(url: string, init: RequestInit, attempts = 3) {
  let lastError: unknown;
  for (let attempt = 0; attempt < attempts; attempt += 1) {
    try {
      return await fetch(url, { ...init, signal: AbortSignal.timeout(20_000) });
    } catch (error) {
      lastError = error;
      await new Promise((resolve) => setTimeout(resolve, 750 * (attempt + 1)));
    }
  }
  throw lastError;
}

async function searchYouTube(query: string): Promise<Candidate[]> {
  const response = await fetchWithRetries(
    `https://www.youtube.com/results?hl=en&gl=US&search_query=${encodeURIComponent(query)}`,
    {
      headers: {
        "Accept-Language": "en-US,en;q=0.9",
        Cookie: "CONSENT=YES+cb.20210328-17-p0.en+FX+410",
        "User-Agent": "Mozilla/5.0"
      }
    }
  );
  const html = await response.text();
  const marker = "var ytInitialData = ";
  const start = html.indexOf(marker);
  if (start < 0) throw new Error(`Missing ytInitialData for query: ${query}`);
  const jsonStart = start + marker.length;
  const jsonEnd = html.indexOf(";</script>", jsonStart);
  const initialData = JSON.parse(html.slice(jsonStart, jsonEnd));

  return findRenderers(initialData).flatMap((renderer) => {
    const videoId = typeof renderer.videoId === "string" ? renderer.videoId : "";
    if (!videoId) return [];
    return [{
      channel: textOf(renderer.ownerText as Parameters<typeof textOf>[0]),
      duration: textOf(renderer.lengthText as Parameters<typeof textOf>[0]),
      title: textOf(renderer.title as Parameters<typeof textOf>[0]),
      videoId
    }];
  });
}

function durationSeconds(duration: string) {
  if (!duration) return 0;
  return duration.split(":").reduce((total, part) => total * 60 + Number(part), 0);
}

function scoreVariants(match: Match) {
  const home = match.score.home;
  const away = match.score.away;
  return [
    `${home}-${away}`,
    `${home} ${away}`,
    `${home}:${away}`,
    `${home}x${away}`,
    `${home} x ${away}`,
    `${home}×${away}`,
    `${away}-${home}`,
    `${away} ${home}`,
    `${away}:${home}`
  ];
}

function titleHasTargetYear(title: string, year: number) {
  const normalizedTitle = normalize(title);
  const shortYear = String(year).slice(-2);
  return normalizedTitle.includes(String(year))
    || new RegExp(`(?:world cup|wc|france|korea japan|brazil|germany) 0?${Number(shortYear)}(?:\\b|$)`).test(normalizedTitle);
}

function candidateRank(candidate: Candidate, match: Match, tournament: Tournament) {
  const title = normalize(candidate.title);
  const duration = durationSeconds(candidate.duration);
  const hasScore = scoreVariants(match).some((score) => normalize(candidate.title).includes(normalize(score)));
  let rank = 0;
  if (/extended highlights|full highlights|highlights all goals|all goals highlights/.test(title)) rank += 60;
  else if (/highlights|minute match|world cup uncut/.test(title)) rank += 40;
  else if (/all goals|goals/.test(title)) rank += 20;
  if (titleHasTargetYear(candidate.title, tournament.year)) rank += 45;
  if (hasScore) rank += 25;
  if (duration >= 120 && duration <= 1_200) rank += 35;
  else if (duration >= 60 && duration <= 1_800) rank += 15;
  if (/tyfc hd|lapse football|worldcuphighlightstm|sp1873|soccer house|camperjoe|vintagehdtv2|football107/i.test(candidate.channel)) rank += 12;
  if (/qualif|preview|prediction|simulation|efootball|fifa 2[0-9]|anthem|reaction|watchalong|post match|postmatch|build up/.test(title)) rank -= 100;
  if (/\bgoal\b|shorts|fan cam|fans celebrate/.test(title)) rank -= 25;
  return rank;
}

function candidateMatches(candidate: Candidate, match: Match, tournament: Tournament) {
  if (!mentionsTeam(candidate.title, match.home) || !mentionsTeam(candidate.title, match.away)) return false;
  const years = candidate.title.match(/(?:19|20)\d{2}/g) ?? [];
  if (years.some((year) => Number(year) !== tournament.year)) return false;
  const hasYear = titleHasTargetYear(candidate.title, tournament.year);
  const hasScore = scoreVariants(match).some((score) => normalize(candidate.title).includes(normalize(score)));
  return hasYear || hasScore;
}

async function embedStatus(videoId: string) {
  const embedUrl = new URL(`https://www.youtube.com/embed/${videoId}`);
  embedUrl.searchParams.set("enablejsapi", "1");
  embedUrl.searchParams.set("origin", origin);
  try {
    const response = await fetchWithRetries(embedUrl.toString(), {
      headers: { Referer: `${origin}/`, "User-Agent": "Mozilla/5.0" }
    });
    const html = await response.text();
    const status = /\\"previewPlayabilityStatus\\":\{\\"status\\":\\"([^\\"]+)/.exec(html)?.[1] ?? null;
    return { playable: status === "OK" && html.includes('\\"playableInEmbed\\":true'), status };
  } catch {
    return { playable: false, status: null };
  }
}

async function findReplacement(match: Match, tournament: Tournament) {
  const home = teamNames[match.home];
  const away = teamNames[match.away];
  const score = `${match.score.home}-${match.score.away}`;
  const queries = [
    `${home} ${score} ${away} ${tournament.year} World Cup highlights`,
    `${home} vs ${away} ${tournament.year} World Cup highlights`
  ];
  const candidates = new Map<string, Candidate>();
  for (const query of queries) {
    for (const candidate of await searchYouTube(query)) {
      if (existingVideoIds.has(candidate.videoId) || selectedVideoIds.has(candidate.videoId)) continue;
      if (!candidateMatches(candidate, match, tournament)) continue;
      candidates.set(candidate.videoId, candidate);
    }
  }

  const ranked = [...candidates.values()]
    .sort((a, b) => candidateRank(b, match, tournament) - candidateRank(a, match, tournament));
  const playable: Candidate[] = [];
  for (const candidate of ranked.slice(0, 12)) {
    if ((await embedStatus(candidate.videoId)).playable) playable.push(candidate);
    if (playable.length === 3) break;
  }
  if (playable[0]) selectedVideoIds.add(playable[0].videoId);
  return playable;
}

async function main() {
  const missingTournamentIds = requestedTournamentIds.filter(
    (id) => !tournaments.some((tournament) => tournament.id === id)
  );
  if (missingTournamentIds.length > 0) {
    throw new Error(`Unknown tournament id(s): ${missingTournamentIds.join(", ")}`);
  }

  const results: unknown[] = [];
  for (const tournament of selectedTournaments) {
    for (const match of tournament.matches) {
      const oldVideoId = match.highlights.providerVideoId;
      if (!oldVideoId) continue;
      const current = await embedStatus(oldVideoId);
      if (current.playable) continue;
      let candidates: Candidate[];
      try {
        candidates = await findReplacement(match, tournament);
      } catch (error) {
        results.push({
          error: error instanceof Error ? error.message : String(error),
          matchId: match.id,
          oldSourceName: match.highlights.sourceName,
          oldVideoId,
          tournamentId: tournament.id
        });
        console.error(`${match.id}: SEARCH_ERROR`);
        continue;
      }
      results.push({
        candidate: candidates[0] ?? null,
        matchId: match.id,
        oldSourceName: match.highlights.sourceName,
        oldVideoId,
        tournamentId: tournament.id
      });
      console.error(`${match.id}: ${candidates[0]?.videoId ?? "MISSING"}`);
    }
  }
  process.stdout.write(`${JSON.stringify(results, null, 2)}\n`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.stack ?? error.message : String(error));
  process.exitCode = 1;
});
