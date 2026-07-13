import { createYoutubeHighlight } from "@/data/highlights";
import { teamNames } from "@/data/teamMetadata";
import {
  worldCup1962Format,
  worldCup1962Groups,
  worldCup1962TeamCoordinates
} from "@/data/worldCup1962Experience";
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
  { id: "estadio-carlos-dittborn", name: "Estadio Carlos Dittborn", city: "Arica", country: "CHI", coordinates: [-70.2995, -18.4876], bearing: -12, zoom: 16.3 },
  { id: "estadio-nacional", name: "Estadio Nacional", city: "Santiago", country: "CHI", coordinates: [-70.6105, -33.4648], bearing: 11 },
  { id: "estadio-sausalito", name: "Estadio Sausalito", city: "Viña del Mar", country: "CHI", coordinates: [-71.5354, -33.0147], bearing: -14 },
  { id: "estadio-el-teniente", name: "Estadio El Teniente", city: "Rancagua", country: "CHI", coordinates: [-70.7374, -34.1778], bearing: 14 }
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

// Numbers and ordering follow FIFA's current match-centre archive for season 21.
const fixtureSeeds: FixtureSeed[] = [
  { no: 1, stage: "group", date: "1962-05-30", venueId: "estadio-carlos-dittborn", home: "URU", away: "COL", score: { home: 2, away: 1 } },
  { no: 2, stage: "group", date: "1962-05-30", venueId: "estadio-nacional", home: "CHI", away: "SUI", score: { home: 3, away: 1 } },
  { no: 3, stage: "group", date: "1962-05-30", venueId: "estadio-sausalito", home: "BRA", away: "MEX", score: { home: 2, away: 0 } },
  { no: 4, stage: "group", date: "1962-05-30", venueId: "estadio-el-teniente", home: "ARG", away: "BUL", score: { home: 1, away: 0 } },
  { no: 5, stage: "group", date: "1962-05-31", venueId: "estadio-carlos-dittborn", home: "URS", away: "YUG", score: { home: 2, away: 0 } },
  { no: 6, stage: "group", date: "1962-05-31", venueId: "estadio-nacional", home: "GER", away: "ITA", score: { home: 0, away: 0 } },
  { no: 7, stage: "group", date: "1962-05-31", venueId: "estadio-sausalito", home: "TCH", away: "ESP", score: { home: 1, away: 0 } },
  { no: 8, stage: "group", date: "1962-05-31", venueId: "estadio-el-teniente", home: "HUN", away: "ENG", score: { home: 2, away: 1 } },
  { no: 9, stage: "group", date: "1962-06-02", venueId: "estadio-carlos-dittborn", home: "YUG", away: "URU", score: { home: 3, away: 1 } },
  { no: 10, stage: "group", date: "1962-06-02", venueId: "estadio-nacional", home: "CHI", away: "ITA", score: { home: 2, away: 0 } },
  { no: 11, stage: "group", date: "1962-06-02", venueId: "estadio-sausalito", home: "BRA", away: "TCH", score: { home: 0, away: 0 } },
  { no: 12, stage: "group", date: "1962-06-02", venueId: "estadio-el-teniente", home: "ENG", away: "ARG", score: { home: 3, away: 1 } },
  { no: 13, stage: "group", date: "1962-06-03", venueId: "estadio-carlos-dittborn", home: "URS", away: "COL", score: { home: 4, away: 4 } },
  { no: 14, stage: "group", date: "1962-06-03", venueId: "estadio-nacional", home: "GER", away: "SUI", score: { home: 2, away: 1 } },
  { no: 15, stage: "group", date: "1962-06-03", venueId: "estadio-sausalito", home: "ESP", away: "MEX", score: { home: 1, away: 0 } },
  { no: 16, stage: "group", date: "1962-06-03", venueId: "estadio-el-teniente", home: "HUN", away: "BUL", score: { home: 6, away: 1 } },
  { no: 17, stage: "group", date: "1962-06-06", venueId: "estadio-carlos-dittborn", home: "URS", away: "URU", score: { home: 2, away: 1 } },
  { no: 18, stage: "group", date: "1962-06-06", venueId: "estadio-nacional", home: "GER", away: "CHI", score: { home: 2, away: 0 } },
  { no: 19, stage: "group", date: "1962-06-06", venueId: "estadio-sausalito", home: "BRA", away: "ESP", score: { home: 2, away: 1 } },
  { no: 20, stage: "group", date: "1962-06-06", venueId: "estadio-el-teniente", home: "HUN", away: "ARG", score: { home: 0, away: 0 } },
  { no: 21, stage: "group", date: "1962-06-07", venueId: "estadio-carlos-dittborn", home: "YUG", away: "COL", score: { home: 5, away: 0 } },
  { no: 22, stage: "group", date: "1962-06-07", venueId: "estadio-nacional", home: "ITA", away: "SUI", score: { home: 3, away: 0 } },
  { no: 23, stage: "group", date: "1962-06-07", venueId: "estadio-sausalito", home: "MEX", away: "TCH", score: { home: 3, away: 1 } },
  { no: 24, stage: "group", date: "1962-06-07", venueId: "estadio-el-teniente", home: "ENG", away: "BUL", score: { home: 0, away: 0 } },
  { no: 25, stage: "qf", date: "1962-06-10", venueId: "estadio-carlos-dittborn", home: "CHI", away: "URS", score: { home: 2, away: 1 } },
  { no: 26, stage: "qf", date: "1962-06-10", venueId: "estadio-nacional", home: "YUG", away: "GER", score: { home: 1, away: 0 } },
  { no: 27, stage: "qf", date: "1962-06-10", venueId: "estadio-sausalito", home: "BRA", away: "ENG", score: { home: 3, away: 1 } },
  { no: 28, stage: "qf", date: "1962-06-10", venueId: "estadio-el-teniente", home: "TCH", away: "HUN", score: { home: 1, away: 0 } },
  { no: 29, stage: "sf", date: "1962-06-13", venueId: "estadio-nacional", home: "BRA", away: "CHI", score: { home: 4, away: 2 } },
  { no: 30, stage: "sf", date: "1962-06-13", venueId: "estadio-sausalito", home: "TCH", away: "YUG", score: { home: 3, away: 1 } },
  { no: 31, stage: "third", date: "1962-06-16", venueId: "estadio-nacional", home: "CHI", away: "YUG", score: { home: 1, away: 0 } },
  { no: 32, stage: "final", date: "1962-06-17", venueId: "estadio-nacional", home: "BRA", away: "TCH", score: { home: 3, away: 1 } }
];

// Scorers and minute labels follow the Fjelstul World Cup Database, joined to
// FIFA's official match numbers by date and exact team pairing.
const goalsByFixture: Partial<Record<number, GoalSeed[]>> = {
  1: [[19, "COL", "Francisco Zuluaga", "Francisco Zuluaga scores from the penalty spot."], [56, "URU", "Luis Cubilla"], [75, "URU", "José Sasía"]],
  2: [[6, "SUI", "Rolf Wüthrich"], [44, "CHI", "Leonel Sánchez"], [51, "CHI", "Jaime Ramírez"], [55, "CHI", "Leonel Sánchez"]],
  3: [[56, "BRA", "Mário Zagallo"], [73, "BRA", "Pelé"]],
  4: [[4, "ARG", "Héctor Facundo"]],
  5: [[51, "URS", "Valentin Ivanov"], [83, "URS", "Viktor Ponedelnik"]],
  7: [[80, "TCH", "Jozef Štibrányi"]],
  8: [[17, "HUN", "Lajos Tichy"], [60, "ENG", "Ron Flowers", "Ron Flowers scores from the penalty spot."], [71, "HUN", "Flórián Albert"]],
  9: [[19, "URU", "Ángel Cabrera"], [25, "YUG", "Josip Skoblar", "Josip Skoblar scores from the penalty spot."], [29, "YUG", "Milan Galić"], [49, "YUG", "Dražan Jerković"]],
  10: [[73, "CHI", "Jaime Ramírez"], [87, "CHI", "Jorge Toro"]],
  12: [[17, "ENG", "Ron Flowers", "Ron Flowers scores from the penalty spot."], [42, "ENG", "Bobby Charlton"], [67, "ENG", "Jimmy Greaves"], [81, "ARG", "José Sanfilippo"]],
  13: [[8, "URS", "Valentin Ivanov"], [10, "URS", "Igor Chislenko"], [11, "URS", "Valentin Ivanov"], [21, "COL", "Germán Aceros"], [56, "URS", "Viktor Ponedelnik"], [68, "COL", "Marcos Coll"], [72, "COL", "Antonio Rada"], [86, "COL", "Marino Klinger"]],
  14: [[45, "GER", "Albert Brülls"], [59, "GER", "Uwe Seeler"], [73, "SUI", "Heinz Schneiter"]],
  15: [[90, "ESP", "Joaquín Peiró"]],
  16: [[1, "HUN", "Flórián Albert"], [6, "HUN", "Flórián Albert"], [8, "HUN", "Lajos Tichy"], [12, "HUN", "Ernő Solymosi"], [53, "HUN", "Flórián Albert"], [64, "BUL", "Georgi Sokolov"], [70, "HUN", "Lajos Tichy"]],
  17: [[38, "URS", "Aleksei Mamykin"], [54, "URU", "José Sasía"], [89, "URS", "Valentin Ivanov"]],
  18: [[21, "GER", "Horst Szymaniak", "Horst Szymaniak scores from the penalty spot."], [82, "GER", "Uwe Seeler"]],
  19: [[35, "ESP", "Adelardo"], [72, "BRA", "Amarildo"], [86, "BRA", "Amarildo"]],
  21: [[20, "YUG", "Milan Galić"], [25, "YUG", "Dražan Jerković"], [61, "YUG", "Milan Galić"], [82, "YUG", "Vojislav Melić"], [87, "YUG", "Dražan Jerković"]],
  22: [[2, "ITA", "Bruno Mora"], [65, "ITA", "Giacomo Bulgarelli"], [67, "ITA", "Giacomo Bulgarelli"]],
  23: [[1, "TCH", "Václav Mašek"], [12, "MEX", "Isidoro Díaz"], [29, "MEX", "Alfredo del Águila"], [90, "MEX", "Héctor Hernández", "Héctor Hernández scores from the penalty spot."]],
  25: [[11, "CHI", "Leonel Sánchez"], [26, "URS", "Igor Chislenko"], [29, "CHI", "Eladio Rojas"]],
  26: [[85, "YUG", "Petar Radaković"]],
  27: [[31, "BRA", "Garrincha"], [38, "ENG", "Gerry Hitchens"], [53, "BRA", "Vavá"], [59, "BRA", "Garrincha"]],
  28: [[13, "TCH", "Adolf Scherer"]],
  29: [[9, "BRA", "Garrincha"], [32, "BRA", "Garrincha"], [42, "CHI", "Jorge Toro"], [47, "BRA", "Vavá"], [61, "CHI", "Leonel Sánchez", "Leonel Sánchez scores from the penalty spot."], [78, "BRA", "Vavá"]],
  30: [[48, "TCH", "Josef Kadraba"], [69, "YUG", "Dražan Jerković"], [80, "TCH", "Adolf Scherer"], [84, "TCH", "Adolf Scherer", "Adolf Scherer scores from the penalty spot."]],
  31: [[90, "CHI", "Eladio Rojas"]],
  32: [[15, "TCH", "Josef Masopust"], [17, "BRA", "Amarildo"], [69, "BRA", "Zito"], [78, "BRA", "Vavá"]]
};

type YouTubeHighlightSeed = { videoId: string; sourceName: string };

// Every video matches the fixture teams and score and passed YouTube's real
// embed response with status OK and playableInEmbed=true on July 13, 2026.
const youtubeHighlightsByFixture: Record<number, YouTubeHighlightSeed> = {
  1: { videoId: "BQ_VQQS2_H4", sourceName: "The Free Football Library highlights" },
  2: { videoId: "JkeyrAM5EAs", sourceName: "sp1873 highlights" },
  3: { videoId: "RjTiECpLsYQ", sourceName: "bapqapmoc highlights" },
  4: { videoId: "V7k7jb4T3lA", sourceName: "rluiz66 highlights" },
  5: { videoId: "y6BCK3tdqtQ", sourceName: "The Free Football Library highlights" },
  6: { videoId: "LO-kgkNDnqA", sourceName: "The Free Football Library highlights" },
  7: { videoId: "aCd14O4bVFE", sourceName: "sp1873 highlights" },
  8: { videoId: "44njBw4SQ4c", sourceName: "The Free Football Library highlights" },
  9: { videoId: "KXcLF_KTTTs", sourceName: "The Free Football Library highlights" },
  10: { videoId: "T5jVMSlpZhg", sourceName: "broodje80 highlights" },
  11: { videoId: "ghebqQTYZQQ", sourceName: "sp1873 highlights" },
  12: { videoId: "-XyJDNjRe3w", sourceName: "Joefa's World Cup History highlights" },
  13: { videoId: "dDIqr33ANac", sourceName: "Tiburón de Curramba highlights" },
  14: { videoId: "V7o5rvfDDpQ", sourceName: "1986soccerman highlights" },
  15: { videoId: "9ggjfP3lav0", sourceName: "sp1873 highlights" },
  16: { videoId: "fW7fiU6DXm4", sourceName: "Joefa's World Cup History highlights" },
  17: { videoId: "qe-ua8d4oL4", sourceName: "1986soccerman highlights" },
  18: { videoId: "5pFo_gasHZg", sourceName: "The Free Football Library highlights" },
  19: { videoId: "_j90ppP2GBw", sourceName: "bapqapmoc highlights" },
  20: { videoId: "iSO-H6MScPs", sourceName: "The Free Football Library highlights" },
  21: { videoId: "Zn6o1ZNbYeg", sourceName: "1986soccerman highlights" },
  22: { videoId: "004iLqZGS-s", sourceName: "The Free Football Library highlights" },
  23: { videoId: "4hmjT38-Grk", sourceName: "Soccer Almanac highlights" },
  24: { videoId: "ugcdbY1SF1Y", sourceName: "Joefa's World Cup History highlights" },
  25: { videoId: "xGwZL_XTpqo", sourceName: "sp1873 highlights" },
  26: { videoId: "ojZXxRXLrjQ", sourceName: "sp1873 highlights" },
  27: { videoId: "5YCELVWtBAY", sourceName: "Tom Baleya HD highlights" },
  28: { videoId: "fxK5nYk35eA", sourceName: "sp1873 highlights" },
  29: { videoId: "mWlpba4i5Mw", sourceName: "Ruda TV highlights" },
  30: { videoId: "yQEvyRkX72I", sourceName: "The Free Football Library highlights" },
  31: { videoId: "po7_zQ7cMq8", sourceName: "sp1873 highlights" },
  32: { videoId: "n3R9no0Gjdo", sourceName: "bapqapmoc highlights" }
};

const fifaMatchIdsByFixture: Record<number, string> = {
  1: "1479", 2: "1473", 3: "1461", 4: "1447", 5: "1563", 6: "1507", 7: "1498", 8: "1490",
  9: "1564", 10: "1472", 11: "1462", 12: "1450", 13: "1478", 14: "1510", 15: "1497", 16: "1470",
  17: "1562", 18: "1471", 19: "1460", 20: "1451", 21: "1480", 22: "1532", 23: "1544", 24: "1464",
  25: "1474", 26: "1511", 27: "1459", 28: "1525", 29: "1458", 30: "1559", 31: "1475", 32: "1463"
};

function getFifaStageId(no: number) {
  if (no <= 24) return "231";
  if (no <= 28) return "232";
  if (no <= 30) return "514";
  if (no === 31) return "3481";
  return "3480";
}

function getFifaMatchUrl(fixture: FixtureSeed) {
  return `https://www.fifa.com/en/match-centre/match/17/21/${getFifaStageId(fixture.no)}/${fifaMatchIdsByFixture[fixture.no]}?date=${fixture.date}`;
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
  const resultDetail = `${teamNames[fixture.home]} ${fixture.score.home}-${fixture.score.away} ${teamNames[fixture.away]}.`;
  const fullTimeMinute = Math.max(90, ...goals.map(([minute]) => minute));

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
      id: `wc-1962-${String(fixture.no).padStart(2, "0")}-${fixture.home.toLowerCase()}-${fixture.away.toLowerCase()}`,
      tournamentId: "wc-1962",
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

export const worldCup1962: Tournament = {
  id: "wc-1962",
  competition: "WORLD_CUP",
  name: "Chile 1962",
  year: 1962,
  hosts: ["CHI"],
  teams: worldCup1962Groups.flatMap((group) => group.teams),
  groups: worldCup1962Groups,
  teamCoordinates: worldCup1962TeamCoordinates,
  format: worldCup1962Format,
  stages: ["group", "qf", "sf", "third", "final"],
  status: "complete",
  mapView: { center: [-70.7, -26.5], zoom: 3.8, bearing: -8, pitch: 42 },
  venues,
  featuredRoute: venues.map((venue) => venue.id),
  matches
};
