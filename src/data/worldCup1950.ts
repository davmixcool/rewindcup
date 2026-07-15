import { createYoutubeHighlight } from "@/data/highlights";
import { teamNames } from "@/data/teamMetadata";
import {
  worldCup1950FinalRound,
  worldCup1950Format,
  worldCup1950Groups,
  worldCup1950TeamCoordinates
} from "@/data/worldCup1950Experience";
import type { Match, MatchHighlights, ReplayEvent, Score, TeamCode, Tournament, Venue } from "@/lib/types";

type VenueSeed = Pick<Venue, "id" | "name" | "city" | "country" | "coordinates"> & {
  bearing?: number;
  pitch?: number;
  zoom?: number;
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
  {
    id: "maracana",
    name: "Maracanã - Estádio Jornalista Mário Filho",
    city: "Rio de Janeiro",
    country: "BRA",
    coordinates: [-43.2302, -22.9121],
    bearing: -12
  },
  {
    id: "independencia",
    name: "Independencia - Estádio Raimundo Sampaio",
    city: "Belo Horizonte",
    country: "BRA",
    coordinates: [-43.9177, -19.9084],
    bearing: 13
  },
  {
    id: "durival-britto",
    name: "Estádio Durival Britto e Silva",
    city: "Curitiba",
    country: "BRA",
    coordinates: [-49.2553, -25.4397],
    bearing: -14
  },
  {
    id: "pacaembu",
    name: "Estádio do Pacaembu",
    city: "São Paulo",
    country: "BRA",
    coordinates: [-46.6658, -23.5489],
    bearing: 14
  },
  {
    id: "eucaliptos",
    name: "Eucaliptos - Estádio Ildo Meneghetti",
    city: "Porto Alegre",
    country: "BRA",
    coordinates: [-51.2308, -30.0426],
    bearing: -11
  },
  {
    id: "ilha-do-retiro",
    name: "Ilha do Retiro",
    city: "Recife",
    country: "BRA",
    coordinates: [-34.9024, -8.0628],
    bearing: 11
  }
];

const venues: Venue[] = venueSeeds.map((venue) => ({
  ...venue,
  stadiumView: {
    center: venue.coordinates,
    zoom: venue.zoom ?? 16.3,
    bearing: venue.bearing ?? -12,
    pitch: venue.pitch ?? 64
  }
}));

// Numbers and ordering follow FIFA's current match-centre archive for season 7.
// The last six fixtures are the championship's round-robin final phase, not a
// knockout bracket; Uruguay-Brazil was its decisive final-round match.
const fixtureSeeds: FixtureSeed[] = [
  { no: 1, stage: "group", date: "1950-06-24", venueId: "maracana", home: "BRA", away: "MEX", score: { home: 4, away: 0 } },
  { no: 5, stage: "group", date: "1950-06-25", venueId: "independencia", home: "YUG", away: "SUI", score: { home: 3, away: 0 } },
  { no: 2, stage: "group", date: "1950-06-25", venueId: "maracana", home: "ENG", away: "CHI", score: { home: 2, away: 0 } },
  { no: 3, stage: "group", date: "1950-06-25", venueId: "durival-britto", home: "ESP", away: "USA", score: { home: 3, away: 1 } },
  { no: 4, stage: "group", date: "1950-06-25", venueId: "pacaembu", home: "SWE", away: "ITA", score: { home: 3, away: 2 } },
  { no: 7, stage: "group", date: "1950-06-28", venueId: "eucaliptos", home: "YUG", away: "MEX", score: { home: 4, away: 1 } },
  { no: 6, stage: "group", date: "1950-06-28", venueId: "pacaembu", home: "BRA", away: "SUI", score: { home: 2, away: 2 } },
  { no: 10, stage: "group", date: "1950-06-29", venueId: "independencia", home: "USA", away: "ENG", score: { home: 1, away: 0 } },
  { no: 8, stage: "group", date: "1950-06-29", venueId: "maracana", home: "ESP", away: "CHI", score: { home: 2, away: 0 } },
  { no: 9, stage: "group", date: "1950-06-29", venueId: "durival-britto", home: "SWE", away: "PAR", score: { home: 2, away: 2 } },
  { no: 11, stage: "group", date: "1950-07-01", venueId: "maracana", home: "BRA", away: "YUG", score: { home: 2, away: 0 } },
  { no: 12, stage: "group", date: "1950-07-02", venueId: "maracana", home: "ESP", away: "ENG", score: { home: 1, away: 0 } },
  { no: 15, stage: "group", date: "1950-07-02", venueId: "ilha-do-retiro", home: "CHI", away: "USA", score: { home: 5, away: 2 } },
  { no: 16, stage: "group", date: "1950-07-02", venueId: "independencia", home: "URU", away: "BOL", score: { home: 8, away: 0 } },
  { no: 13, stage: "group", date: "1950-07-02", venueId: "pacaembu", home: "ITA", away: "PAR", score: { home: 2, away: 0 } },
  { no: 14, stage: "group", date: "1950-07-02", venueId: "eucaliptos", home: "SUI", away: "MEX", score: { home: 2, away: 1 } },
  { no: 18, stage: "group2", date: "1950-07-09", venueId: "maracana", home: "BRA", away: "SWE", score: { home: 7, away: 1 } },
  { no: 17, stage: "group2", date: "1950-07-09", venueId: "pacaembu", home: "URU", away: "ESP", score: { home: 2, away: 2 } },
  { no: 20, stage: "group2", date: "1950-07-13", venueId: "pacaembu", home: "URU", away: "SWE", score: { home: 3, away: 2 } },
  { no: 19, stage: "group2", date: "1950-07-13", venueId: "maracana", home: "BRA", away: "ESP", score: { home: 6, away: 1 } },
  { no: 22, stage: "group2", date: "1950-07-16", venueId: "maracana", home: "URU", away: "BRA", score: { home: 2, away: 1 } },
  { no: 21, stage: "group2", date: "1950-07-16", venueId: "pacaembu", home: "SWE", away: "ESP", score: { home: 3, away: 1 } }
];

// Scorers and minute labels follow the Fjelstul World Cup Database, joined to
// FIFA's official match sequence by date and exact team pairing.
const goalsByFixture: Partial<Record<number, GoalSeed[]>> = {
  1: [[30, "BRA", "Ademir"], [65, "BRA", "Jair"], [71, "BRA", "Baltazar"], [79, "BRA", "Ademir"]],
  5: [[59, "YUG", "Rajko Mitić"], [70, "YUG", "Kosta Tomašević"], [84, "YUG", "Tihomir Ognjanov"]],
  2: [[39, "ENG", "Stan Mortensen"], [51, "ENG", "Wilf Mannion"]],
  3: [[17, "USA", "Gino Pariani"], [81, "ESP", "Silvestre Igoa"], [83, "ESP", "Estanislau Basora"], [89, "ESP", "Telmo Zarra"]],
  4: [[7, "ITA", "Riccardo Carapellese"], [25, "SWE", "Hasse Jeppson"], [33, "SWE", "Sune Andersson"], [68, "SWE", "Hasse Jeppson"], [75, "ITA", "Ermes Muccinelli"]],
  7: [[20, "YUG", "Stjepan Bobek"], [23, "YUG", "Željko Čajkovski"], [51, "YUG", "Željko Čajkovski"], [81, "YUG", "Kosta Tomašević"], [89, "MEX", "Héctor Ortiz", "Héctor Ortiz scores from the penalty spot."]],
  6: [[3, "BRA", "Alfredo"], [17, "SUI", "Jacques Fatton"], [32, "BRA", "Baltazar"], [88, "SUI", "Jacques Fatton"]],
  10: [[38, "USA", "Joe Gaetjens"]],
  8: [[17, "ESP", "Estanislau Basora"], [30, "ESP", "Telmo Zarra"]],
  9: [[17, "SWE", "Stig Sundqvist"], [26, "SWE", "Karl-Erik Palmér"], [35, "PAR", "Atilio López"], [74, "PAR", "César López Fretes"]],
  11: [[4, "BRA", "Ademir"], [69, "BRA", "Zizinho"]],
  12: [[48, "ESP", "Telmo Zarra"]],
  15: [[16, "CHI", "George Robledo"], [32, "CHI", "Atilio Cremaschi"], [47, "USA", "Frank Wallace"], [48, "USA", "Joe Maca", "Joe Maca scores from the penalty spot."], [54, "CHI", "Andrés Prieto"], [60, "CHI", "Atilio Cremaschi"], [82, "CHI", "Fernando Riera"]],
  16: [[14, "URU", "Oscar Míguez"], [18, "URU", "Ernesto Vidal"], [23, "URU", "Juan Alberto Schiaffino"], [40, "URU", "Oscar Míguez"], [51, "URU", "Oscar Míguez"], [54, "URU", "Juan Alberto Schiaffino"], [83, "URU", "Julio Pérez"], [87, "URU", "Alcides Ghiggia"]],
  13: [[12, "ITA", "Riccardo Carapellese"], [62, "ITA", "Egisto Pandolfini"]],
  14: [[10, "SUI", "René Bader"], [44, "SUI", "Charles Antenen"], [89, "MEX", "Horacio Casarín"]],
  18: [[17, "BRA", "Ademir"], [36, "BRA", "Ademir"], [39, "BRA", "Chico"], [52, "BRA", "Ademir"], [58, "BRA", "Ademir"], [67, "SWE", "Sune Andersson", "Sune Andersson scores from the penalty spot."], [85, "BRA", "Maneca"], [88, "BRA", "Chico"]],
  17: [[29, "URU", "Alcides Ghiggia"], [37, "ESP", "Estanislau Basora"], [39, "ESP", "Estanislau Basora"], [73, "URU", "Obdulio Varela"]],
  20: [[5, "SWE", "Karl-Erik Palmér"], [39, "URU", "Alcides Ghiggia"], [40, "SWE", "Stig Sundqvist"], [77, "URU", "Oscar Míguez"], [85, "URU", "Oscar Míguez"]],
  19: [[15, "BRA", "Ademir"], [21, "BRA", "Jair"], [31, "BRA", "Chico"], [55, "BRA", "Chico"], [57, "BRA", "Ademir"], [67, "BRA", "Zizinho"], [71, "ESP", "Silvestre Igoa"]],
  22: [[47, "BRA", "Friaça"], [66, "URU", "Juan Alberto Schiaffino"], [79, "URU", "Alcides Ghiggia"]],
  21: [[15, "SWE", "Stig Sundqvist"], [33, "SWE", "Bror Mellberg"], [80, "SWE", "Karl-Erik Palmér"], [82, "ESP", "Telmo Zarra"]]
};

type YouTubeHighlightSeed = { videoId: string; sourceName: string };

// Every video matches the fixture teams and score and passed YouTube's real
// embed response with status OK and playableInEmbed=true on July 15, 2026.
const youtubeHighlightsByFixture: Record<number, YouTubeHighlightSeed> = {
  1: { videoId: "pgOT-TVqMt8", sourceName: "Joefa's World Cup History highlights" },
  2: { videoId: "cj42S-rUo1k", sourceName: "sp1873 highlights" },
  3: { videoId: "0V_CD1kDiVE", sourceName: "1986soccerman highlights" },
  4: { videoId: "VWE97MIPSLQ", sourceName: "sp1873 highlights" },
  5: { videoId: "nOCvx36GMow", sourceName: "1986soccerman highlights" },
  6: { videoId: "kwoEbWF70ws", sourceName: "Joefa's World Cup History highlights" },
  7: { videoId: "7QHrUDMOJQg", sourceName: "1986soccerman highlights" },
  8: { videoId: "MNjmqiSi2ys", sourceName: "sp1873 highlights" },
  9: { videoId: "xWMuFU30sLU", sourceName: "sp1873 highlights" },
  10: { videoId: "-vqQWrrzNWU", sourceName: "1986soccerman highlights" },
  11: { videoId: "U83a6zhSjqc", sourceName: "sp1873 highlights" },
  12: { videoId: "n93Q4gUNs9A", sourceName: "1986soccerman highlights" },
  13: { videoId: "5SAAlBhjUfQ", sourceName: "1986soccerman highlights" },
  14: { videoId: "T8kQUSE4Ayw", sourceName: "1986soccerman highlights" },
  15: { videoId: "E5r2UUM5ufw", sourceName: "sp1873 highlights" },
  16: { videoId: "WxhaeyBaDwM", sourceName: "sp1873 highlights" },
  17: { videoId: "pBY1D8gPVTg", sourceName: "Joefa's World Cup History highlights" },
  18: { videoId: "oagceEuXWn4", sourceName: "1986mansoccer highlights" },
  19: { videoId: "nEsXmcznteI", sourceName: "Joefa's World Cup History highlights" },
  20: { videoId: "DaiHbycH0yE", sourceName: "Joefa's World Cup History highlights" },
  21: { videoId: "MwpynHs-GfQ", sourceName: "Joefa's World Cup History highlights" },
  22: { videoId: "l8WMlT3XWCc", sourceName: "World Cup History highlights" }
};

const fifaMatchIdsByFixture: Record<number, string> = {
  1: "1187", 5: "1230", 2: "1192", 3: "1208", 4: "1219", 7: "1225", 6: "1188", 10: "1202",
  8: "1193", 9: "1228", 11: "1191", 12: "1199", 15: "1194", 16: "1185", 13: "1218", 14: "1222",
  18: "1189", 17: "1207", 20: "1231", 19: "1186", 22: "1190", 21: "1206"
};

const fifaStageIds: Record<Match["stage"], string> = {
  group: "208",
  playoff: "",
  group2: "209",
  r32: "",
  r16: "",
  qf: "",
  sf: "",
  third: "",
  final: ""
};

function getFifaMatchUrl(fixture: FixtureSeed) {
  return `https://www.fifa.com/en/match-centre/match/17/7/${fifaStageIds[fixture.stage]}/${fifaMatchIdsByFixture[fixture.no]}?date=${fixture.date}`;
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
      id: `wc-1950-${String(fixture.no).padStart(2, "0")}-${fixture.home.toLowerCase()}-${fixture.away.toLowerCase()}`,
      tournamentId: "wc-1950",
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

export const worldCup1950: Tournament = {
  id: "wc-1950",
  competition: "WORLD_CUP",
  name: "Brazil 1950",
  year: 1950,
  hosts: ["BRA"],
  teams: worldCup1950Groups.flatMap((group) => group.teams),
  groups: worldCup1950Groups,
  secondGroups: worldCup1950FinalRound,
  teamCoordinates: worldCup1950TeamCoordinates,
  format: worldCup1950Format,
  stages: ["group", "group2"],
  stageLabels: {
    group: "Opening group stage",
    group2: "Final round"
  },
  teamFinishes: {
    URU: "Champion",
    BRA: "Runner-up",
    SWE: "Third place",
    ESP: "Fourth place"
  },
  status: "complete",
  mapView: { center: [-47, -15], zoom: 3.5, bearing: -8, pitch: 42 },
  venues,
  featuredRoute: venues.map((venue) => venue.id),
  matches
};
