import { existsSync } from "node:fs";
import { join } from "node:path";
import { z } from "zod";
import { teamColors, teamFlags, teamNames, tournaments } from "../src/data/tournaments";
import { TEAM_CODES } from "../src/lib/types";
import type { Match, ReplayEvent, TeamCode, Tournament } from "../src/lib/types";

const teamCodeSchema = z.enum(TEAM_CODES);
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
    status: z.enum(["none", "official-report", "external-video", "embeddable-video"]),
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

    if (highlights.status === "embeddable-video" && (!highlights.embeddable || !highlights.embedUrl || !highlights.directUrl)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Embeddable video highlights require embeddable, embedUrl, and directUrl."
      });
    }

    if (
      highlights.status === "external-video" &&
      (!highlights.directUrl || highlights.embeddable || highlights.embedUrl || highlights.provider !== "external" || !highlights.sourceName)
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "External video highlights require directUrl, provider, and sourceName, and must not include an embed."
      });
    }

    if (
      highlights.status === "external-video" &&
      highlights.sourceName === "FIFA+ highlights" &&
      highlights.directUrl &&
      new URL(highlights.directUrl).hostname !== "www.plus.fifa.com"
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "FIFA+ highlights must use the official www.plus.fifa.com host."
      });
    }

    if (highlights.status === "official-report" && (!highlights.officialUrl || highlights.embeddable || highlights.directUrl || highlights.embedUrl)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Official report highlights require only an officialUrl and must not be marked embeddable."
      });
    }

    if (highlights.status === "none" && (highlights.officialUrl || highlights.directUrl || highlights.embedUrl || highlights.embeddable)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Missing highlights must not include URLs or be marked embeddable."
      });
    }

    if (highlights.provider === "youtube") {
      const videoId = highlights.providerVideoId;

      if (highlights.status !== "embeddable-video" || !videoId || !/^[A-Za-z0-9_-]{11}$/.test(videoId)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "YouTube highlights require embeddable-video status and an 11-character providerVideoId."
        });
      }

      if (videoId && highlights.directUrl) {
        const directUrl = new URL(highlights.directUrl);
        if (directUrl.hostname !== "www.youtube.com" || directUrl.pathname !== "/watch" || directUrl.searchParams.get("v") !== videoId) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "YouTube directUrl must be the canonical watch URL for providerVideoId."
          });
        }
      }

      if (videoId && highlights.embedUrl) {
        const embedUrl = new URL(highlights.embedUrl);
        if (embedUrl.hostname !== "www.youtube.com" || embedUrl.pathname !== `/embed/${videoId}`) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "YouTube embedUrl must be the canonical embed URL for providerVideoId."
          });
        }
      }
    }
  });

const matchSchema = z.object({
  id: z.string().min(1),
  tournamentId: z.string().min(1),
  stage: z.enum(["group", "playoff", "group2", "r32", "r16", "qf", "sf", "third", "final"]),
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

const tournamentGroupSchema = z.object({
  id: z.string().min(1),
  teams: z.array(teamCodeSchema).min(1)
});

const tournamentFormatSchema = z.object({
  expectedGoalCount: z.number().int().nonnegative().nullable(),
  expectedMatchCount: z.number().int().positive(),
  expectedVenueCount: z.number().int().positive(),
  groupMatchesPerTeam: z.number().int().min(0),
  secondGroupMatchesPerTeam: z.number().int().min(0).optional()
});

const tournamentSchema = z.object({
  id: z.string().min(1),
  competition: z.enum(["WORLD_CUP", "EURO", "AFCON", "COPA_AMERICA", "ASIAN_CUP"]),
  name: z.string().min(1),
  year: z.number().int().min(1900).max(2100),
  hosts: z.array(teamCodeSchema).min(1),
  teams: z.array(teamCodeSchema).min(1),
  groups: z.array(tournamentGroupSchema).min(1),
  secondGroups: z.array(tournamentGroupSchema).min(1).optional(),
  teamCoordinates: z.partialRecord(teamCodeSchema, coordinatesSchema),
  format: tournamentFormatSchema,
  stages: z.array(z.enum(["group", "playoff", "group2", "r32", "r16", "qf", "sf", "third", "final"])).min(1),
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

function findDuplicates(values: string[]) {
  const seen = new Set<string>();
  const duplicates = new Set<string>();

  for (const value of values) {
    if (seen.has(value)) duplicates.add(value);
    seen.add(value);
  }

  return [...duplicates];
}

function validateTournamentConsistency(tournament: Tournament) {
  const errors: string[] = [];
  const teamIds = new Set(tournament.teams);
  const venueIds = new Set<string>();
  const venueById = new Map(tournament.venues.map((venue) => [venue.id, venue]));
  const usedVenueIds = new Set(tournament.matches.map((match) => match.venueId));
  const matchIds = new Set<string>();
  const directHighlightUrls = new Set<string>();
  const providerVideoIds = new Set<string>();
  const groupIds = new Set<string>();
  const groupsByTeam = new Map<TeamCode, string[]>();

  for (const duplicate of findDuplicates(tournament.hosts)) {
    errors.push(`${tournament.id}: duplicate host ${duplicate}.`);
  }

  for (const duplicate of findDuplicates(tournament.teams)) {
    errors.push(`${tournament.id}: duplicate team ${duplicate}.`);
  }

  for (const duplicate of findDuplicates(tournament.stages)) {
    errors.push(`${tournament.id}: duplicate stage ${duplicate}.`);
  }

  for (const host of tournament.hosts) {
    if (!teamIds.has(host)) {
      errors.push(`${tournament.id}: host ${host} is not in tournament teams.`);
    }
  }

  for (const group of tournament.groups) {
    if (groupIds.has(group.id)) {
      errors.push(`${tournament.id}: duplicate group id ${group.id}.`);
    }
    groupIds.add(group.id);

    for (const duplicate of findDuplicates(group.teams)) {
      errors.push(`${tournament.id}: group ${group.id} contains duplicate team ${duplicate}.`);
    }

    for (const team of group.teams) {
      if (!teamIds.has(team)) {
        errors.push(`${tournament.id}: group ${group.id} references non-participant ${team}.`);
      }

      const assignedGroups = groupsByTeam.get(team) ?? [];
      assignedGroups.push(group.id);
      groupsByTeam.set(team, assignedGroups);
    }
  }

  for (const team of tournament.teams) {
    const assignedGroups = groupsByTeam.get(team) ?? [];
    if (assignedGroups.length === 0) {
      errors.push(`${tournament.id}: team ${team} has no group assignment.`);
    } else if (assignedGroups.length > 1) {
      errors.push(`${tournament.id}: team ${team} belongs to multiple groups (${assignedGroups.join(", ")}).`);
    }

    if (!tournament.teamCoordinates[team]) {
      errors.push(`${tournament.id}: team ${team} is missing globe coordinates.`);
    }
  }

  for (const code of Object.keys(tournament.teamCoordinates) as TeamCode[]) {
    if (!teamIds.has(code)) {
      errors.push(`${tournament.id}: teamCoordinates includes non-participant ${code}.`);
    }
  }

  for (const venue of tournament.venues) {
    if (venueIds.has(venue.id)) {
      errors.push(`${tournament.id}: duplicate venue id ${venue.id}.`);
    }
    venueIds.add(venue.id);

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

  for (const duplicate of findDuplicates(tournament.featuredRoute)) {
    errors.push(`${tournament.id}: featuredRoute contains duplicate venue ${duplicate}.`);
  }

  for (const routeVenueId of tournament.featuredRoute) {
    if (!venueIds.has(routeVenueId)) {
      errors.push(`${tournament.id}: featuredRoute references unknown venue ${routeVenueId}.`);
    }
  }

  for (const [matchIndex, match] of tournament.matches.entries()) {
    if (matchIds.has(match.id)) {
      errors.push(`${tournament.id}: duplicate match id ${match.id}.`);
    }
    matchIds.add(match.id);

    if (match.tournamentId !== tournament.id) {
      errors.push(`${match.id}: tournamentId does not match ${tournament.id}.`);
    }

    if (!venueIds.has(match.venueId)) {
      errors.push(`${match.id}: venueId ${match.venueId} is not defined in venues.`);
    } else if (venueById.get(match.venueId)?.name !== match.venue) {
      errors.push(`${match.id}: venue name does not match venueId ${match.venueId}.`);
    }

    if (!teamIds.has(match.home) || !teamIds.has(match.away)) {
      errors.push(`${match.id}: home/away team must exist in tournament teams.`);
    }

    if (match.home === match.away) {
      errors.push(`${match.id}: home and away teams must differ.`);
    }

    if (!tournament.stages.includes(match.stage)) {
      errors.push(`${match.id}: stage ${match.stage} is not declared by ${tournament.id}.`);
    }

    if (matchIndex > 0 && tournament.matches[matchIndex - 1].date > match.date) {
      errors.push(`${tournament.id}: match sequence is not chronological at ${match.id}.`);
    }

    const assignedHomeGroups = groupsByTeam.get(match.home) ?? [];
    const assignedAwayGroups = groupsByTeam.get(match.away) ?? [];
    if (match.stage === "group" && (assignedHomeGroups.length !== 1 || assignedAwayGroups.length !== 1 || assignedHomeGroups[0] !== assignedAwayGroups[0])) {
      errors.push(`${match.id}: group-stage opponents must belong to the same group.`);
    }

    const eventIds = new Set<string>();
    let previousMinute = -1;
    for (const event of match.events) {
      if (eventIds.has(event.id)) {
        errors.push(`${match.id}: duplicate event id ${event.id}.`);
      }
      eventIds.add(event.id);

      if (event.team && event.team !== match.home && event.team !== match.away) {
        errors.push(`${match.id}: event ${event.id} references team ${event.team}, which is not playing.`);
      }

      if (event.minute !== null) {
        if (event.minute < previousMinute) {
          errors.push(`${match.id}: event ${event.id} is out of chronological order.`);
        }
        previousMinute = event.minute;
      }
    }

    const kickoffEvents = match.events.filter((event) => event.type === "kickoff");
    if (kickoffEvents.length !== 1) {
      errors.push(`${match.id}: expected exactly one kickoff event, found ${kickoffEvents.length}.`);
    } else if (match.events[0]?.type !== "kickoff") {
      errors.push(`${match.id}: kickoff must be the first replay event.`);
    }

    const fullTimeEvents = match.events.filter((event) => event.type === "full_time");
    if (fullTimeEvents.length !== 1) {
      errors.push(`${match.id}: expected exactly one full_time event, found ${fullTimeEvents.length}.`);
    }

    const lastScoreEvent = getLastScoreEvent(match);
    if (!lastScoreEvent || lastScoreEvent.scoreAfter.home !== match.score.home || lastScoreEvent.scoreAfter.away !== match.score.away) {
      errors.push(`${match.id}: final event scoreAfter must match match.score.`);
    }

    const goalScore = countGoalEvents(match);
    if (goalScore.home !== match.score.home || goalScore.away !== match.score.away) {
      errors.push(`${match.id}: goal events (${goalScore.home}-${goalScore.away}) do not match final score (${match.score.home}-${match.score.away}).`);
    }

    if (match.shootout) {
      if (match.stage === "group") {
        errors.push(`${match.id}: group stage matches cannot have shootout scores.`);
      }
      if (match.score.home !== match.score.away) {
        errors.push(`${match.id}: shootouts require a tied match score.`);
      }
      if (match.shootout.home === match.shootout.away) {
        errors.push(`${match.id}: shootout score must identify a winner.`);
      }
    }

    const legacyHighlightUrl = match.highlights.directUrl ?? match.highlights.officialUrl;
    if (legacyHighlightUrl !== match.highlightUrl) {
      errors.push(`${match.id}: legacy highlightUrl must match highlights.directUrl or highlights.officialUrl while both fields exist.`);
    }

    if (match.highlights.embeddable !== match.highlightEmbeddable) {
      errors.push(`${match.id}: legacy highlightEmbeddable must match highlights.embeddable while both fields exist.`);
    }

    if (match.highlights.directUrl) {
      if (directHighlightUrls.has(match.highlights.directUrl)) {
        errors.push(`${match.id}: direct highlight URL is duplicated within ${tournament.id}.`);
      }
      directHighlightUrls.add(match.highlights.directUrl);
    }

    if (match.highlights.providerVideoId) {
      if (providerVideoIds.has(match.highlights.providerVideoId)) {
        errors.push(`${match.id}: provider video ID is duplicated within ${tournament.id}.`);
      }
      providerVideoIds.add(match.highlights.providerVideoId);
    }

    if (tournament.status === "complete" && !match.highlights.officialUrl) {
      errors.push(`${match.id}: complete datasets must include an official highlight/report URL.`);
    }
  }

  if (tournament.status === "complete") {
    const goalCount = tournament.matches.reduce(
      (count, match) => count + match.events.filter((event) => event.type === "goal").length,
      0
    );

    if (tournament.format.expectedGoalCount === null) {
      errors.push(`${tournament.id}: complete datasets must declare expectedGoalCount.`);
    } else if (goalCount !== tournament.format.expectedGoalCount) {
      errors.push(
        `${tournament.id}: complete dataset must include ${tournament.format.expectedGoalCount} goals, found ${goalCount}.`
      );
    }

    if (tournament.matches.length !== tournament.format.expectedMatchCount) {
      errors.push(
        `${tournament.id}: complete dataset must include ${tournament.format.expectedMatchCount} matches, found ${tournament.matches.length}.`
      );
    }

    if (tournament.venues.length !== tournament.format.expectedVenueCount) {
      errors.push(
        `${tournament.id}: complete dataset must include ${tournament.format.expectedVenueCount} venues, found ${tournament.venues.length}.`
      );
    }

    for (const team of tournament.teams) {
      const teamMatches = tournament.matches.filter((match) => match.home === team || match.away === team);
      const groupMatches = teamMatches.filter((match) => match.stage === "group");
      if (teamMatches.length === 0) {
        errors.push(`${tournament.id}: complete datasets must include at least one match for ${team}.`);
      }
      if (groupMatches.length !== tournament.format.groupMatchesPerTeam) {
        errors.push(
          `${tournament.id}: ${team} must have ${tournament.format.groupMatchesPerTeam} group matches, found ${groupMatches.length}.`
        );
      }
    }

    for (const venue of tournament.venues) {
      if (!usedVenueIds.has(venue.id)) {
        errors.push(`${tournament.id}: complete dataset venue ${venue.id} is not used by any match.`);
      }
    }
  } else {
    if (tournament.matches.length > tournament.format.expectedMatchCount) {
      errors.push(`${tournament.id}: match count exceeds its declared format maximum.`);
    }
    if (tournament.venues.length > tournament.format.expectedVenueCount) {
      errors.push(`${tournament.id}: venue count exceeds its declared format maximum.`);
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
for (const duplicate of findDuplicates(tournaments.map((tournament) => tournament.id))) {
  consistencyErrors.push(`Duplicate tournament id ${duplicate}.`);
}
const metadataErrors: string[] = [];
const publicDir = join(process.cwd(), "public");

for (const code of TEAM_CODES) {
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
