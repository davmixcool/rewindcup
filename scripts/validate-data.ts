import { existsSync } from "node:fs";
import { join } from "node:path";
import { z } from "zod";
import { teamColors, teamFlags, teamNames, tournaments } from "../src/data/tournaments";
import type { Match, ReplayEvent, Tournament } from "../src/lib/types";

const teamCodeSchema = z.enum([
  "ARG",
  "BEL",
  "BRA",
  "CMR",
  "CHN",
  "CRC",
  "CRO",
  "DEN",
  "ECU",
  "ENG",
  "FRA",
  "GER",
  "IRL",
  "ITA",
  "JPN",
  "KOR",
  "KSA",
  "MEX",
  "NGA",
  "PAR",
  "POL",
  "POR",
  "RSA",
  "RUS",
  "SEN",
  "SVN",
  "ESP",
  "SWE",
  "TUN",
  "TUR",
  "URU",
  "USA"
]);
const coordinatesSchema = z.tuple([z.number().min(-180).max(180), z.number().min(-90).max(90)]);

const mapViewSchema = z.object({
  center: coordinatesSchema,
  zoom: z.number().min(0).max(22),
  bearing: z.number().min(-180).max(180),
  pitch: z.number().min(0).max(85)
});

const venueSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  city: z.string().min(1),
  country: teamCodeSchema,
  coordinates: coordinatesSchema,
  stadiumView: mapViewSchema,
  model: z
    .object({
      footprint: z.array(coordinatesSchema).min(4),
      heightMeters: z.number().positive(),
      baseHeightMeters: z.number().min(0).optional()
    })
    .optional()
});

const scoreSchema = z.object({
  home: z.number().int().min(0),
  away: z.number().int().min(0)
});

const eventSchema = z
  .object({
    id: z.string().min(1),
    minute: z.number().int().min(0).max(130).nullable(),
    type: z.enum(["kickoff", "goal", "half_time", "full_time", "result"]),
    team: teamCodeSchema.optional(),
    player: z.string().min(1).optional(),
    detail: z.string().min(1),
    scoreAfter: scoreSchema.optional()
  })
  .superRefine((event, ctx) => {
    if (event.type === "goal" && !event.player) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Goal events require a player."
      });
    }
  });

const highlightsSchema = z
  .object({
    officialUrl: z.string().url().optional(),
    officialSourceName: z.string().min(1).optional(),
    directUrl: z.string().url().optional(),
    embedUrl: z.string().url().optional(),
    provider: z.enum(["youtube", "vimeo", "external"]).optional(),
    providerVideoId: z.string().min(1).optional(),
    embeddable: z.boolean(),
    sourceName: z.string().min(1).optional()
  })
  .superRefine((highlights, ctx) => {
    if (highlights.embeddable && !highlights.embedUrl) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Embeddable highlights require embedUrl."
      });
    }

    if (highlights.provider === "youtube" && highlights.providerVideoId && highlights.embedUrl && !highlights.embedUrl.includes(highlights.providerVideoId)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "YouTube embedUrl must include providerVideoId."
      });
    }
  });

const matchSchema = z.object({
  id: z.string().min(1),
  tournamentId: z.string().min(1),
  stage: z.enum(["group", "r16", "qf", "sf", "third", "final"]),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  venueId: z.string().min(1),
  venue: z.string().min(1),
  home: teamCodeSchema,
  away: teamCodeSchema,
  score: scoreSchema,
  shootout: scoreSchema.nullable(),
  events: z.array(eventSchema).min(1),
  highlights: highlightsSchema,
  highlightUrl: z.string().url().optional(),
  highlightEmbeddable: z.boolean()
});

const tournamentSchema = z.object({
  id: z.string().min(1),
  competition: z.enum(["WORLD_CUP", "EURO", "AFCON", "COPA_AMERICA", "ASIAN_CUP"]),
  name: z.string().min(1),
  year: z.number().int().min(1900).max(2100),
  hosts: z.array(teamCodeSchema).min(1),
  teams: z.array(teamCodeSchema).min(1),
  stages: z.array(z.enum(["group", "r16", "qf", "sf", "third", "final"])).min(1),
  status: z.enum(["complete", "partial", "locked"]),
  mapView: mapViewSchema,
  venues: z.array(venueSchema).min(1),
  featuredRoute: z.array(z.string().min(1)).min(1),
  matches: z.array(matchSchema).min(1)
});

function countGoalEvents(match: Match) {
  return match.events.reduce(
    (score, event) => {
      if (event.type !== "goal" || !event.team) return score;
      if (event.team === match.home) score.home += 1;
      if (event.team === match.away) score.away += 1;
      return score;
    },
    { home: 0, away: 0 }
  );
}

function getLastScoreEvent(match: Match) {
  return [...match.events].reverse().find((event): event is ReplayEvent & { scoreAfter: { home: number; away: number } } =>
    Boolean(event.scoreAfter)
  );
}

function validateTournamentConsistency(tournament: Tournament) {
  const errors: string[] = [];
  const venueIds = new Set(tournament.venues.map((venue) => venue.id));
  const matchIds = new Set<string>();

  for (const venue of tournament.venues) {
    if (!tournament.hosts.includes(venue.country)) {
      errors.push(`${tournament.id}: venue ${venue.id} country ${venue.country} is not in hosts.`);
    }

    if (venue.model) {
      const first = venue.model.footprint[0];
      const last = venue.model.footprint[venue.model.footprint.length - 1];
      if (!first || !last || first[0] !== last[0] || first[1] !== last[1]) {
        errors.push(`${tournament.id}: venue ${venue.id} model footprint must be closed.`);
      }
    }
  }

  for (const routeVenueId of tournament.featuredRoute) {
    if (!venueIds.has(routeVenueId)) {
      errors.push(`${tournament.id}: featuredRoute references unknown venue ${routeVenueId}.`);
    }
  }

  for (const match of tournament.matches) {
    if (matchIds.has(match.id)) {
      errors.push(`${tournament.id}: duplicate match id ${match.id}.`);
    }
    matchIds.add(match.id);

    if (match.tournamentId !== tournament.id) {
      errors.push(`${match.id}: tournamentId does not match ${tournament.id}.`);
    }

    if (!venueIds.has(match.venueId)) {
      errors.push(`${match.id}: venueId ${match.venueId} is not defined in venues.`);
    }

    if (!tournament.teams.includes(match.home) || !tournament.teams.includes(match.away)) {
      errors.push(`${match.id}: home/away team must exist in tournament teams.`);
    }

    if (!match.events.some((event) => event.type === "kickoff")) {
      errors.push(`${match.id}: missing kickoff event.`);
    }

    if (!match.events.some((event) => event.type === "full_time")) {
      errors.push(`${match.id}: missing full_time event.`);
    }

    const lastScoreEvent = getLastScoreEvent(match);
    if (!lastScoreEvent || lastScoreEvent.scoreAfter.home !== match.score.home || lastScoreEvent.scoreAfter.away !== match.score.away) {
      errors.push(`${match.id}: final event scoreAfter must match match.score.`);
    }

    const goalScore = countGoalEvents(match);
    const hasGoalEvents = match.events.some((event) => event.type === "goal");
    if (hasGoalEvents && (goalScore.home !== match.score.home || goalScore.away !== match.score.away)) {
      errors.push(`${match.id}: goal events (${goalScore.home}-${goalScore.away}) do not match final score (${match.score.home}-${match.score.away}).`);
    }

    if (match.shootout && match.stage === "group") {
      errors.push(`${match.id}: group stage matches cannot have shootout scores.`);
    }

    const legacyHighlightUrl = match.highlights.directUrl ?? match.highlights.officialUrl;
    if (legacyHighlightUrl !== match.highlightUrl) {
      errors.push(`${match.id}: legacy highlightUrl must match highlights.directUrl or highlights.officialUrl while both fields exist.`);
    }

    if (match.highlights.embeddable !== match.highlightEmbeddable) {
      errors.push(`${match.id}: legacy highlightEmbeddable must match highlights.embeddable while both fields exist.`);
    }
  }

  if (tournament.status === "complete") {
    if (tournament.matches.length !== 64) {
      errors.push(`${tournament.id}: complete World Cup datasets must include 64 matches.`);
    }

    if (tournament.venues.length !== 20) {
      errors.push(`${tournament.id}: complete Korea/Japan 2002 datasets must include 20 venues.`);
    }

    for (const team of tournament.teams) {
      const teamMatches = tournament.matches.filter((match) => match.home === team || match.away === team);
      if (teamMatches.length === 0) {
        errors.push(`${tournament.id}: complete datasets must include at least one match for ${team}.`);
      }
    }
  }

  return errors;
}

const parseResult = z.array(tournamentSchema).safeParse(tournaments);

if (!parseResult.success) {
  console.error("Dataset schema validation failed.");
  for (const issue of parseResult.error.issues) {
    console.error(`- ${issue.path.join(".")}: ${issue.message}`);
  }
  process.exit(1);
}

const consistencyErrors = tournaments.flatMap((tournament) => validateTournamentConsistency(tournament));
const metadataErrors: string[] = [];
const publicDir = join(process.cwd(), "public");

for (const code of teamCodeSchema.options) {
  if (!teamNames[code]) {
    metadataErrors.push(`teamNames is missing ${code}.`);
  }

  if (!teamColors[code]) {
    metadataErrors.push(`teamColors is missing ${code}.`);
  }

  if (!teamFlags[code]) {
    metadataErrors.push(`teamFlags is missing ${code}.`);
  } else if (!teamFlags[code].startsWith("/flags/") || !teamFlags[code].endsWith(".svg")) {
    metadataErrors.push(`teamFlags.${code} must point to a local SVG in /flags.`);
  } else if (!existsSync(join(publicDir, teamFlags[code].slice(1)))) {
    metadataErrors.push(`teamFlags.${code} points to a missing file: ${teamFlags[code]}.`);
  }
}

if (consistencyErrors.length > 0 || metadataErrors.length > 0) {
  console.error("Dataset consistency validation failed.");
  for (const error of [...consistencyErrors, ...metadataErrors]) {
    console.error(`- ${error}`);
  }
  process.exit(1);
}

const matchCount = tournaments.reduce((count, tournament) => count + tournament.matches.length, 0);
console.log(`Dataset validation passed: ${tournaments.length} tournament(s), ${matchCount} match(es).`);
