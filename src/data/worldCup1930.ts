import { createYoutubeHighlight } from "@/data/highlights";
import { teamNames } from "@/data/teamMetadata";
import {
  worldCup1930Format,
  worldCup1930Groups,
  worldCup1930TeamCoordinates
} from "@/data/worldCup1930Experience";
import type { Match, MatchHighlights, ReplayEvent, Score, TeamCode, Tournament, Venue } from "@/lib/types";

type VenueSeed = Pick<Venue, "id" | "name" | "city" | "country" | "coordinates"> & {
  bearing?: number;
};

type GoalSeed = readonly [minute: number, team: TeamCode, player: string, detail?: string];

type FixtureSeed = {
  no: number;
  stage: Match["stage"];
  date: string;
  venueId: string;
  home: TeamCode;
  away: TeamCode;
  score: Score;
};

const venueSeeds: VenueSeed[] = [
  { id: "pocitos", name: "Pocitos", city: "Montevideo", country: "URU", coordinates: [-56.1517, -34.9055], bearing: -12 },
  { id: "parque-central", name: "Parque Central", city: "Montevideo", country: "URU", coordinates: [-56.1589, -34.8848], bearing: 10 },
  { id: "estadio-centenario", name: "Estadio Centenario", city: "Montevideo", country: "URU", coordinates: [-56.1528, -34.8945], bearing: -8 }
];

const venues: Venue[] = venueSeeds.map((venue) => ({
  ...venue,
  stadiumView: {
    center: venue.coordinates,
    zoom: 16.4,
    bearing: venue.bearing ?? -10,
    pitch: 64
  }
}));

// Numbers and ordering follow FIFA's current match-centre archive for season 1.
// Only each group's winner advanced to the semi-finals; no third-place match was played.
const fixtureSeeds: FixtureSeed[] = [
  { no: 1, stage: "group", date: "1930-07-13", venueId: "pocitos", home: "FRA", away: "MEX", score: { home: 4, away: 1 } },
  { no: 2, stage: "group", date: "1930-07-13", venueId: "parque-central", home: "USA", away: "BEL", score: { home: 3, away: 0 } },
  { no: 3, stage: "group", date: "1930-07-14", venueId: "parque-central", home: "YUG", away: "BRA", score: { home: 2, away: 1 } },
  { no: 4, stage: "group", date: "1930-07-14", venueId: "pocitos", home: "ROU", away: "PER", score: { home: 3, away: 1 } },
  { no: 5, stage: "group", date: "1930-07-15", venueId: "parque-central", home: "ARG", away: "FRA", score: { home: 1, away: 0 } },
  { no: 6, stage: "group", date: "1930-07-16", venueId: "parque-central", home: "CHI", away: "MEX", score: { home: 3, away: 0 } },
  { no: 7, stage: "group", date: "1930-07-17", venueId: "parque-central", home: "YUG", away: "BOL", score: { home: 4, away: 0 } },
  { no: 8, stage: "group", date: "1930-07-17", venueId: "parque-central", home: "USA", away: "PAR", score: { home: 3, away: 0 } },
  { no: 9, stage: "group", date: "1930-07-18", venueId: "estadio-centenario", home: "URU", away: "PER", score: { home: 1, away: 0 } },
  { no: 10, stage: "group", date: "1930-07-19", venueId: "estadio-centenario", home: "CHI", away: "FRA", score: { home: 1, away: 0 } },
  { no: 11, stage: "group", date: "1930-07-19", venueId: "estadio-centenario", home: "ARG", away: "MEX", score: { home: 6, away: 3 } },
  { no: 12, stage: "group", date: "1930-07-20", venueId: "estadio-centenario", home: "BRA", away: "BOL", score: { home: 4, away: 0 } },
  { no: 13, stage: "group", date: "1930-07-20", venueId: "estadio-centenario", home: "PAR", away: "BEL", score: { home: 1, away: 0 } },
  { no: 14, stage: "group", date: "1930-07-21", venueId: "estadio-centenario", home: "URU", away: "ROU", score: { home: 4, away: 0 } },
  { no: 15, stage: "group", date: "1930-07-22", venueId: "estadio-centenario", home: "ARG", away: "CHI", score: { home: 3, away: 1 } },
  { no: 16, stage: "sf", date: "1930-07-26", venueId: "estadio-centenario", home: "ARG", away: "USA", score: { home: 6, away: 1 } },
  { no: 17, stage: "sf", date: "1930-07-27", venueId: "estadio-centenario", home: "URU", away: "YUG", score: { home: 6, away: 1 } },
  { no: 18, stage: "final", date: "1930-07-30", venueId: "estadio-centenario", home: "URU", away: "ARG", score: { home: 4, away: 2 } }
];

// Scorers and minute labels follow the Fjelstul World Cup Database, joined to
// FIFA's official match sequence by date and exact team pairing.
const goalsByFixture: Record<number, GoalSeed[]> = {
  1: [[19, "FRA", "Lucien Laurent"], [40, "FRA", "Marcel Langiller"], [43, "FRA", "André Maschinot"], [70, "MEX", "Juan Carreño"], [87, "FRA", "André Maschinot"]],
  2: [[23, "USA", "Bart McGhee"], [45, "USA", "Tom Florie"], [69, "USA", "Bert Patenaude"]],
  3: [[21, "YUG", "Aleksandar Tirnanić"], [30, "YUG", "Ivan Bek"], [62, "BRA", "Preguinho"]],
  4: [[1, "ROU", "Adalbert Deșu"], [75, "PER", "Luis Souza Ferreira"], [79, "ROU", "Constantin Stanciu"], [89, "ROU", "Miklós Kovács"]],
  5: [[81, "ARG", "Luis Monti"]],
  6: [[3, "CHI", "Carlos Vidal"], [52, "CHI", "Manuel Rosas", "Manuel Rosas scores an own goal for Chile."], [65, "CHI", "Carlos Vidal"]],
  7: [[60, "YUG", "Ivan Bek"], [65, "YUG", "Blagoje Marjanović"], [67, "YUG", "Ivan Bek"], [85, "YUG", "Đorđe Vujadinović"]],
  8: [[10, "USA", "Bert Patenaude"], [15, "USA", "Bert Patenaude"], [50, "USA", "Bert Patenaude"]],
  9: [[65, "URU", "Héctor Castro"]],
  10: [[67, "CHI", "Guillermo Subiabre"]],
  11: [[8, "ARG", "Guillermo Stábile"], [12, "ARG", "Adolfo Zumelzú"], [17, "ARG", "Guillermo Stábile"], [42, "MEX", "Manuel Rosas", "Manuel Rosas scores from the penalty spot."], [53, "ARG", "Francisco Varallo"], [55, "ARG", "Adolfo Zumelzú"], [65, "MEX", "Manuel Rosas"], [75, "MEX", "Roberto Gayón"], [80, "ARG", "Guillermo Stábile"]],
  12: [[37, "BRA", "Moderato"], [57, "BRA", "Preguinho"], [73, "BRA", "Moderato"], [83, "BRA", "Preguinho"]],
  13: [[40, "PAR", "Luis Vargas Peña"]],
  14: [[7, "URU", "Pablo Dorado"], [26, "URU", "Héctor Scarone"], [31, "URU", "Peregrino Anselmo"], [35, "URU", "Pedro Cea"]],
  15: [[12, "ARG", "Guillermo Stábile"], [13, "ARG", "Guillermo Stábile"], [15, "CHI", "Guillermo Subiabre"], [51, "ARG", "Mario Evaristo"]],
  16: [[20, "ARG", "Luis Monti"], [56, "ARG", "Alejandro Scopelli"], [69, "ARG", "Guillermo Stábile"], [80, "ARG", "Carlos Peucelle"], [85, "ARG", "Carlos Peucelle"], [87, "ARG", "Guillermo Stábile"], [89, "USA", "Jim Brown"]],
  17: [[4, "YUG", "Đorđe Vujadinović"], [18, "URU", "Pedro Cea"], [20, "URU", "Peregrino Anselmo"], [31, "URU", "Peregrino Anselmo"], [61, "URU", "Santos Iriarte"], [67, "URU", "Pedro Cea"], [72, "URU", "Pedro Cea"]],
  18: [[12, "URU", "Pablo Dorado"], [20, "ARG", "Carlos Peucelle"], [37, "ARG", "Guillermo Stábile"], [57, "URU", "Pedro Cea"], [68, "URU", "Santos Iriarte"], [89, "URU", "Héctor Castro"]]
};

type YouTubeHighlightSeed = { videoId: string; sourceName: string };

// Every video matches the fixture teams and score and passed YouTube's real
// embed response with status OK and playableInEmbed=true on July 16, 2026.
const youtubeHighlightsByFixture: Record<number, YouTubeHighlightSeed> = {
  1: { videoId: "W3T680jTYQ8", sourceName: "Joefa's World Cup History highlights" },
  2: { videoId: "eqEkj2ynVpg", sourceName: "Joefa's World Cup History highlights" },
  3: { videoId: "cRxm3MJX5aM", sourceName: "Joefa's World Cup History highlights" },
  4: { videoId: "T3SlZUiUJz8", sourceName: "Joefa's World Cup History highlights" },
  5: { videoId: "aJNTN0bkH10", sourceName: "Joefa's World Cup History highlights" },
  6: { videoId: "FLs0oUrC9nM", sourceName: "Joefa's World Cup History highlights" },
  7: { videoId: "AsUk3v4p5rw", sourceName: "Joefa's World Cup History highlights" },
  8: { videoId: "TDKVCxcJa_A", sourceName: "Joefa's World Cup History highlights" },
  9: { videoId: "LBhirjwWs0Y", sourceName: "Joefa's World Cup History highlights" },
  10: { videoId: "dKjeC80_o40", sourceName: "Joefa's World Cup History highlights" },
  11: { videoId: "uyhEPX6U7tc", sourceName: "Joefa's World Cup History highlights" },
  12: { videoId: "KohSdJRe9TE", sourceName: "Joefa's World Cup History highlights" },
  13: { videoId: "xzeOcxvKuOo", sourceName: "Joefa's World Cup History highlights" },
  14: { videoId: "ABbUSnm1dlk", sourceName: "Joefa's World Cup History highlights" },
  15: { videoId: "drQhxpdW3Oc", sourceName: "Joefa's World Cup History highlights" },
  16: { videoId: "PQG3KugZx9A", sourceName: "Joefa's World Cup History highlights" },
  17: { videoId: "-3-oRADPFHo", sourceName: "Joefa's World Cup History highlights" },
  18: { videoId: "Ku2o7tC6GVY", sourceName: "Joefa's World Cup History highlights" }
};

const fifaMatchIdsByFixture: Record<number, string> = {
  1: "1096", 2: "1090", 3: "1093", 4: "1098", 5: "1085", 6: "1095", 7: "1092", 8: "1097", 9: "1099",
  10: "1094", 11: "1086", 12: "1091", 13: "1089", 14: "1100", 15: "1084", 16: "1088", 17: "1101", 18: "1087"
};

const fifaStageIds: Record<Match["stage"], string> = {
  group: "201",
  playoff: "",
  group2: "",
  r32: "",
  r16: "",
  qf: "",
  sf: "202",
  third: "",
  final: "405"
};

function getFifaMatchUrl(fixture: FixtureSeed) {
  return `https://www.fifa.com/en/match-centre/match/17/1/${fifaStageIds[fixture.stage]}/${fifaMatchIdsByFixture[fixture.no]}?date=${fixture.date}`;
}

function getHighlights(fixture: FixtureSeed): MatchHighlights {
  const youtube = youtubeHighlightsByFixture[fixture.no];
  return createYoutubeHighlight(youtube.videoId, getFifaMatchUrl(fixture), youtube.sourceName);
}

function getVenueName(venueId: string) {
  return venues.find((venue) => venue.id === venueId)?.name ?? venueId;
}

function getGoals(fixture: FixtureSeed) {
  return goalsByFixture[fixture.no] ?? [];
}

function getHalftimeScore(goals: GoalSeed[], home: TeamCode, away: TeamCode): Score {
  return goals.reduce(
    (score, [minute, team]) => {
      if (minute > 45) return score;
      if (team === home) score.home += 1;
      if (team === away) score.away += 1;
      return score;
    },
    { home: 0, away: 0 }
  );
}

function createGoalEvents(fixture: FixtureSeed): ReplayEvent[] {
  let homeScore = 0;
  let awayScore = 0;

  return [...getGoals(fixture)]
    .sort((left, right) => left[0] - right[0])
    .map(([minute, team, player, detail], index) => {
      if (team === fixture.home) homeScore += 1;
      if (team === fixture.away) awayScore += 1;

      return {
        id: `goal-${index + 1}`,
        minute,
        type: "goal" as const,
        team,
        player,
        detail: detail ?? `${player} scores for ${teamNames[team]}.`,
        scoreAfter: { home: homeScore, away: awayScore }
      };
    });
}

function createEvents(fixture: FixtureSeed): ReplayEvent[] {
  const venue = getVenueName(fixture.venueId);
  const goals = getGoals(fixture);
  const goalEvents = createGoalEvents(fixture);
  const halftimeScore = getHalftimeScore(goals, fixture.home, fixture.away);
  const result = `${teamNames[fixture.home]} ${fixture.score.home}-${fixture.score.away} ${teamNames[fixture.away]}.`;
  const fullTimeMinute = Math.max(90, ...goals.map(([minute]) => minute));

  return [
    { id: "kickoff", minute: 0, type: "kickoff", detail: `${teamNames[fixture.home]} and ${teamNames[fixture.away]} kick off at ${venue}.`, scoreAfter: { home: 0, away: 0 } },
    ...goalEvents.filter((event) => event.minute !== null && event.minute <= 45),
    { id: "half-time", minute: 45, type: "half_time", detail: `Half-time at ${venue}.`, scoreAfter: halftimeScore },
    ...goalEvents.filter((event) => event.minute !== null && event.minute > 45),
    { id: "full-time", minute: fullTimeMinute, type: "full_time", detail: `Full time. ${result}`, scoreAfter: fixture.score },
    { id: "result", minute: null, type: "result", detail: result, scoreAfter: fixture.score }
  ];
}

const matches: Match[] = fixtureSeeds
  .map((fixture) => {
    const highlights = getHighlights(fixture);
    return {
      id: `wc-1930-${String(fixture.no).padStart(2, "0")}-${fixture.home.toLowerCase()}-${fixture.away.toLowerCase()}`,
      tournamentId: "wc-1930",
      stage: fixture.stage,
      date: fixture.date,
      venueId: fixture.venueId,
      venue: getVenueName(fixture.venueId),
      home: fixture.home,
      away: fixture.away,
      score: fixture.score,
      shootout: null,
      events: createEvents(fixture),
      highlights,
      highlightUrl: highlights.directUrl ?? highlights.officialUrl,
      highlightEmbeddable: highlights.embeddable
    };
  })
  .sort((left, right) => left.date.localeCompare(right.date) || left.id.localeCompare(right.id));

export const worldCup1930: Tournament = {
  id: "wc-1930",
  competition: "WORLD_CUP",
  name: "Uruguay 1930",
  year: 1930,
  hosts: ["URU"],
  teams: worldCup1930Groups.flatMap((group) => group.teams),
  groups: worldCup1930Groups,
  teamCoordinates: worldCup1930TeamCoordinates,
  format: worldCup1930Format,
  stages: ["group", "sf", "final"],
  teamFinishes: {
    URU: "Champion",
    ARG: "Runner-up",
    USA: "Semi-finalist",
    YUG: "Semi-finalist"
  },
  status: "complete",
  mapView: { center: [-56.16, -34.9], zoom: 11.4, bearing: -8, pitch: 42 },
  venues,
  featuredRoute: venues.map((venue) => venue.id),
  matches
};
