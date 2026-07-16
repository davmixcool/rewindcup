import { createYoutubeHighlight } from "@/data/highlights";
import { teamNames } from "@/data/teamMetadata";
import {
  worldCup1934Field,
  worldCup1934Format,
  worldCup1934TeamCoordinates
} from "@/data/worldCup1934Experience";
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
  stageLabel?: string;
  date: string;
  venueId: string;
  home: TeamCode;
  away: TeamCode;
  score: Score;
  durationMinutes?: 120;
  note?: string;
};

const venueSeeds: VenueSeed[] = [
  { id: "littorio", name: "Littorio", city: "Trieste", country: "ITA", coordinates: [13.779, 45.634], bearing: -12 },
  { id: "giovanni-berta", name: "Giovanni Berta", city: "Florence", country: "ITA", coordinates: [11.282, 43.781], bearing: 12 },
  { id: "stadio-olimpico", name: "Stadio Olimpico", city: "Turin", country: "ITA", coordinates: [7.6501, 45.0418], bearing: -14 },
  { id: "giuseppe-meazza", name: "Stadio Giuseppe Meazza", city: "Milan", country: "ITA", coordinates: [9.124, 45.4781], bearing: 14 },
  { id: "luigi-ferraris", name: "Estadio Luigi Ferraris", city: "Genoa", country: "ITA", coordinates: [8.9525, 44.4164], bearing: -11 },
  { id: "littorale", name: "Littorale", city: "Bologna", country: "ITA", coordinates: [11.309, 44.4923], bearing: 11 },
  { id: "nazionale-pnf", name: "Nazionale PNF", city: "Rome", country: "ITA", coordinates: [12.4729, 41.9271], bearing: -13 },
  { id: "giorgio-ascarelli", name: "Giorgio Ascarelli", city: "Naples", country: "ITA", coordinates: [14.3005, 40.852], bearing: 13 }
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

// Numbers and ordering follow FIFA's current match-centre archive for season 3.
// The drawn Italy-Spain quarter-final was replayed in full the following day.
const fixtureSeeds: FixtureSeed[] = [
  { no: 1, stage: "r16", date: "1934-05-27", venueId: "littorale", home: "SWE", away: "ARG", score: { home: 3, away: 2 } },
  { no: 2, stage: "r16", date: "1934-05-27", venueId: "stadio-olimpico", home: "AUT", away: "FRA", score: { home: 3, away: 2 }, durationMinutes: 120, note: "Austria won after extra time." },
  { no: 3, stage: "r16", date: "1934-05-27", venueId: "giovanni-berta", home: "GER", away: "BEL", score: { home: 5, away: 2 } },
  { no: 4, stage: "r16", date: "1934-05-27", venueId: "luigi-ferraris", home: "ESP", away: "BRA", score: { home: 3, away: 1 } },
  { no: 5, stage: "r16", date: "1934-05-27", venueId: "giorgio-ascarelli", home: "HUN", away: "EGY", score: { home: 4, away: 2 } },
  { no: 6, stage: "r16", date: "1934-05-27", venueId: "giuseppe-meazza", home: "SUI", away: "NED", score: { home: 3, away: 2 } },
  { no: 7, stage: "r16", date: "1934-05-27", venueId: "nazionale-pnf", home: "ITA", away: "USA", score: { home: 7, away: 1 } },
  { no: 8, stage: "r16", date: "1934-05-27", venueId: "littorio", home: "TCH", away: "ROU", score: { home: 2, away: 1 } },
  { no: 9, stage: "qf", date: "1934-05-31", venueId: "stadio-olimpico", home: "TCH", away: "SUI", score: { home: 3, away: 2 } },
  { no: 10, stage: "qf", date: "1934-05-31", venueId: "giuseppe-meazza", home: "GER", away: "SWE", score: { home: 2, away: 1 } },
  { no: 11, stage: "qf", date: "1934-05-31", venueId: "giovanni-berta", home: "ITA", away: "ESP", score: { home: 1, away: 1 }, durationMinutes: 120, note: "Match finished after extra time and required a replay." },
  { no: 12, stage: "qf", date: "1934-05-31", venueId: "littorale", home: "AUT", away: "HUN", score: { home: 2, away: 1 } },
  { no: 13, stage: "qf", stageLabel: "Quarter-final replay", date: "1934-06-01", venueId: "giovanni-berta", home: "ITA", away: "ESP", score: { home: 1, away: 0 } },
  { no: 14, stage: "sf", date: "1934-06-03", venueId: "giuseppe-meazza", home: "ITA", away: "AUT", score: { home: 1, away: 0 } },
  { no: 15, stage: "sf", date: "1934-06-03", venueId: "nazionale-pnf", home: "TCH", away: "GER", score: { home: 3, away: 1 } },
  { no: 16, stage: "third", date: "1934-06-07", venueId: "giorgio-ascarelli", home: "GER", away: "AUT", score: { home: 3, away: 2 } },
  { no: 17, stage: "final", date: "1934-06-10", venueId: "nazionale-pnf", home: "ITA", away: "TCH", score: { home: 2, away: 1 }, durationMinutes: 120, note: "Italy won after extra time." }
];

// Scorers and minute labels follow the Fjelstul World Cup Database, joined to
// FIFA's official match sequence by date and exact team pairing.
const goalsByFixture: Partial<Record<number, GoalSeed[]>> = {
  1: [[4, "ARG", "Ernesto Belis"], [9, "SWE", "Sven Jonasson"], [48, "ARG", "Alberto Galateo"], [67, "SWE", "Sven Jonasson"], [79, "SWE", "Knut Kroon"]],
  2: [[18, "FRA", "Jean Nicolas"], [44, "AUT", "Matthias Sindelar"], [93, "AUT", "Anton Schall"], [109, "AUT", "Josef Bican"], [116, "FRA", "Georges Verriest", "Georges Verriest scores from the penalty spot."]],
  3: [[25, "GER", "Stanislaus Kobierski"], [29, "BEL", "Bernard Voorhoof"], [43, "BEL", "Bernard Voorhoof"], [49, "GER", "Otto Siffling"], [66, "GER", "Edmund Conen"], [70, "GER", "Edmund Conen"], [87, "GER", "Edmund Conen"]],
  4: [[18, "ESP", "José Iraragorri", "José Iraragorri scores from the penalty spot."], [25, "ESP", "José Iraragorri"], [29, "ESP", "Isidro Lángara"], [55, "BRA", "Leônidas"]],
  5: [[11, "HUN", "Pál Teleki"], [31, "HUN", "Géza Toldi"], [35, "EGY", "Abdulrahman Fawzi"], [39, "EGY", "Abdulrahman Fawzi"], [53, "HUN", "Jenő Vincze"], [61, "HUN", "Géza Toldi"]],
  6: [[7, "SUI", "Leopold Kielholz"], [29, "NED", "Kick Smit"], [43, "SUI", "Leopold Kielholz"], [66, "SUI", "André Abegglen"], [69, "NED", "Leen Vente"]],
  7: [[18, "ITA", "Angelo Schiavio"], [20, "ITA", "Raimundo Orsi"], [29, "ITA", "Angelo Schiavio"], [57, "USA", "Aldo Donelli"], [63, "ITA", "Giovanni Ferrari"], [64, "ITA", "Angelo Schiavio"], [69, "ITA", "Raimundo Orsi"], [90, "ITA", "Giuseppe Meazza"]],
  8: [[11, "ROU", "Ștefan Dobay"], [50, "TCH", "Antonín Puč"], [67, "TCH", "Oldřich Nejedlý"]],
  9: [[18, "SUI", "Leopold Kielholz"], [24, "TCH", "František Svoboda"], [49, "TCH", "Jiří Sobotka"], [78, "SUI", "Willy Jäggi"], [82, "TCH", "Oldřich Nejedlý"]],
  10: [[60, "GER", "Karl Hohmann"], [63, "GER", "Karl Hohmann"], [82, "SWE", "Gösta Dunker"]],
  11: [[30, "ESP", "Luis Regueiro"], [44, "ITA", "Giovanni Ferrari"]],
  12: [[8, "AUT", "Johann Horvath"], [51, "AUT", "Karl Zischek"], [60, "HUN", "György Sárosi", "György Sárosi scores from the penalty spot."]],
  13: [[11, "ITA", "Giuseppe Meazza"]],
  14: [[19, "ITA", "Enrique Guaita"]],
  15: [[21, "TCH", "Oldřich Nejedlý"], [62, "GER", "Rudolf Noack"], [69, "TCH", "Oldřich Nejedlý"], [80, "TCH", "Oldřich Nejedlý"]],
  16: [[1, "GER", "Ernst Lehner"], [27, "GER", "Edmund Conen"], [28, "AUT", "Johann Horvath"], [42, "GER", "Ernst Lehner"], [54, "AUT", "Karl Sesta"]],
  17: [[71, "TCH", "Antonín Puč"], [81, "ITA", "Raimundo Orsi"], [95, "ITA", "Angelo Schiavio"]]
};

type YouTubeHighlightSeed = { videoId: string; sourceName: string };

// Every video matches the fixture teams and score and passed YouTube's real
// embed response with status OK and playableInEmbed=true on July 15, 2026.
const youtubeHighlightsByFixture: Record<number, YouTubeHighlightSeed> = {
  1: { videoId: "IqP7ylpkJEA", sourceName: "Joefa's World Cup History highlights" },
  2: { videoId: "touPGDza_7c", sourceName: "Joefa's World Cup History highlights" },
  3: { videoId: "SfhFoXUeGms", sourceName: "Joefa's World Cup History highlights" },
  4: { videoId: "ZX1QvcTdWUk", sourceName: "Joefa's World Cup History highlights" },
  5: { videoId: "1jun-30nIdI", sourceName: "Joefa's World Cup History highlights" },
  6: { videoId: "xh5v8XlDiNM", sourceName: "Joefa's World Cup History highlights" },
  7: { videoId: "Auvn_EOhUnM", sourceName: "Joefa's World Cup History highlights" },
  8: { videoId: "dBJcFtRMxTE", sourceName: "Joefa's World Cup History highlights" },
  9: { videoId: "FvWhrvn89-c", sourceName: "Joefa's World Cup History highlights" },
  10: { videoId: "T5ib0ChXvJM", sourceName: "Joefa's World Cup History highlights" },
  11: { videoId: "b3kxeZf0J2w", sourceName: "1986soccerman highlights" },
  12: { videoId: "f5I-suLybRI", sourceName: "Joefa's World Cup History highlights" },
  13: { videoId: "5kNVRtdPZN4", sourceName: "Joefa's World Cup History highlights" },
  14: { videoId: "ZoBU8ZNIC2M", sourceName: "Joefa's World Cup History highlights" },
  15: { videoId: "k2Lj7jzJWhc", sourceName: "Joefa's World Cup History highlights" },
  16: { videoId: "0KWspCbruTU", sourceName: "Joefa's World Cup History highlights" },
  17: { videoId: "ADewdNQCn6s", sourceName: "Joefa's World Cup History highlights" }
};

const fifaMatchIdsByFixture: Record<number, string> = {
  1: "1102", 2: "1104", 3: "1108", 4: "1111", 5: "1119", 6: "1133", 7: "1135", 8: "1141", 9: "1143",
  10: "1129", 11: "1122", 12: "1106", 13: "1123", 14: "1107", 15: "1130", 16: "1105", 17: "1134"
};

const fifaStageIds: Record<Match["stage"], string> = {
  group: "",
  playoff: "",
  group2: "",
  r32: "",
  r16: "204",
  qf: "418",
  sf: "3492",
  third: "3491",
  final: "3490"
};

function getFifaMatchUrl(fixture: FixtureSeed) {
  return `https://www.fifa.com/en/match-centre/match/17/3/${fifaStageIds[fixture.stage]}/${fifaMatchIdsByFixture[fixture.no]}?date=${fixture.date}`;
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
  const resultDetail = fixture.note ? `${result} ${fixture.note}` : result;
  const fullTimeMinute = Math.max(fixture.durationMinutes ?? 90, ...goals.map(([minute]) => minute));

  return [
    { id: "kickoff", minute: 0, type: "kickoff", detail: `${teamNames[fixture.home]} and ${teamNames[fixture.away]} kick off at ${venue}.`, scoreAfter: { home: 0, away: 0 } },
    ...goalEvents.filter((event) => event.minute !== null && event.minute <= 45),
    { id: "half-time", minute: 45, type: "half_time", detail: `Half-time at ${venue}.`, scoreAfter: halftimeScore },
    ...goalEvents.filter((event) => event.minute !== null && event.minute > 45),
    { id: "full-time", minute: fullTimeMinute, type: "full_time", detail: `Full time. ${resultDetail}`, scoreAfter: fixture.score },
    { id: "result", minute: null, type: "result", detail: resultDetail, scoreAfter: fixture.score }
  ];
}

const matches: Match[] = fixtureSeeds
  .map((fixture) => {
    const highlights = getHighlights(fixture);
    return {
      id: `wc-1934-${String(fixture.no).padStart(2, "0")}-${fixture.home.toLowerCase()}-${fixture.away.toLowerCase()}`,
      tournamentId: "wc-1934",
      stage: fixture.stage,
      stageLabel: fixture.stageLabel,
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

export const worldCup1934: Tournament = {
  id: "wc-1934",
  competition: "WORLD_CUP",
  name: "Italy 1934",
  year: 1934,
  hosts: ["ITA"],
  teams: worldCup1934Field.flatMap((group) => group.teams),
  groups: worldCup1934Field,
  teamCoordinates: worldCup1934TeamCoordinates,
  format: worldCup1934Format,
  stages: ["r16", "qf", "sf", "third", "final"],
  stageLabels: { r16: "First round" },
  teamFinishes: {
    ITA: "Champion",
    TCH: "Runner-up",
    GER: "Third place",
    AUT: "Fourth place"
  },
  status: "complete",
  mapView: { center: [12.5, 42.5], zoom: 5.3, bearing: -8, pitch: 42 },
  venues,
  featuredRoute: venues.map((venue) => venue.id),
  matches
};
