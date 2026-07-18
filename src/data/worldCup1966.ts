import { createYoutubeHighlight } from "@/data/highlights";
import { teamNames } from "@/data/teamMetadata";
import {
  worldCup1966Format,
  worldCup1966Groups,
  worldCup1966TeamCoordinates
} from "@/data/worldCup1966Experience";
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
  durationMinutes?: 90 | 120;
  note?: string;
};

const venueSeeds: VenueSeed[] = [
  { id: "wembley-stadium", name: "Wembley Stadium", city: "London", country: "ENG", coordinates: [-0.2795, 51.556], bearing: -12, zoom: 16.2 },
  { id: "hillsborough", name: "Hillsborough", city: "Sheffield", country: "ENG", coordinates: [-1.5009, 53.4114], bearing: 9 },
  { id: "goodison-park", name: "Goodison Park", city: "Liverpool", country: "ENG", coordinates: [-2.9664, 53.4388], bearing: -13 },
  { id: "ayresome-park", name: "Ayresome Park", city: "Middlesbrough", country: "ENG", coordinates: [-1.2345, 54.5642], bearing: 15 },
  { id: "villa-park", name: "Villa Park", city: "Birmingham", country: "ENG", coordinates: [-1.8847, 52.5092], bearing: -10 },
  { id: "old-trafford", name: "Old Trafford", city: "Manchester", country: "ENG", coordinates: [-2.2913, 53.4631], bearing: 13 },
  { id: "roker-park", name: "Roker Park", city: "Sunderland", country: "ENG", coordinates: [-1.3752, 54.9213], bearing: -9 },
  { id: "white-city-stadium", name: "White City Stadium", city: "London", country: "ENG", coordinates: [-0.2246, 51.5137], bearing: 14 }
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

// Numbers and ordering follow FIFA's current match-centre archive for season 26.
const fixtureSeeds: FixtureSeed[] = [
  { no: 1, stage: "group", date: "1966-07-11", venueId: "wembley-stadium", home: "ENG", away: "URU", score: { home: 0, away: 0 } },
  { no: 2, stage: "group", date: "1966-07-12", venueId: "hillsborough", home: "GER", away: "SUI", score: { home: 5, away: 0 } },
  { no: 3, stage: "group", date: "1966-07-12", venueId: "goodison-park", home: "BRA", away: "BUL", score: { home: 2, away: 0 } },
  { no: 4, stage: "group", date: "1966-07-12", venueId: "ayresome-park", home: "URS", away: "PRK", score: { home: 3, away: 0 } },
  { no: 5, stage: "group", date: "1966-07-13", venueId: "wembley-stadium", home: "FRA", away: "MEX", score: { home: 1, away: 1 } },
  { no: 6, stage: "group", date: "1966-07-13", venueId: "villa-park", home: "ARG", away: "ESP", score: { home: 2, away: 1 } },
  { no: 7, stage: "group", date: "1966-07-13", venueId: "old-trafford", home: "POR", away: "HUN", score: { home: 3, away: 1 } },
  { no: 8, stage: "group", date: "1966-07-13", venueId: "roker-park", home: "ITA", away: "CHI", score: { home: 2, away: 0 } },
  { no: 9, stage: "group", date: "1966-07-15", venueId: "white-city-stadium", home: "URU", away: "FRA", score: { home: 2, away: 1 } },
  { no: 10, stage: "group", date: "1966-07-15", venueId: "hillsborough", home: "ESP", away: "SUI", score: { home: 2, away: 1 } },
  { no: 11, stage: "group", date: "1966-07-15", venueId: "goodison-park", home: "HUN", away: "BRA", score: { home: 3, away: 1 } },
  { no: 12, stage: "group", date: "1966-07-15", venueId: "ayresome-park", home: "PRK", away: "CHI", score: { home: 1, away: 1 } },
  { no: 13, stage: "group", date: "1966-07-16", venueId: "wembley-stadium", home: "ENG", away: "MEX", score: { home: 2, away: 0 } },
  { no: 14, stage: "group", date: "1966-07-16", venueId: "villa-park", home: "GER", away: "ARG", score: { home: 0, away: 0 } },
  { no: 15, stage: "group", date: "1966-07-16", venueId: "old-trafford", home: "POR", away: "BUL", score: { home: 3, away: 0 } },
  { no: 16, stage: "group", date: "1966-07-16", venueId: "roker-park", home: "URS", away: "ITA", score: { home: 1, away: 0 } },
  { no: 17, stage: "group", date: "1966-07-19", venueId: "wembley-stadium", home: "URU", away: "MEX", score: { home: 0, away: 0 } },
  { no: 18, stage: "group", date: "1966-07-19", venueId: "hillsborough", home: "ARG", away: "SUI", score: { home: 2, away: 0 } },
  { no: 19, stage: "group", date: "1966-07-19", venueId: "goodison-park", home: "POR", away: "BRA", score: { home: 3, away: 1 } },
  { no: 20, stage: "group", date: "1966-07-19", venueId: "ayresome-park", home: "PRK", away: "ITA", score: { home: 1, away: 0 } },
  { no: 21, stage: "group", date: "1966-07-20", venueId: "wembley-stadium", home: "ENG", away: "FRA", score: { home: 2, away: 0 } },
  { no: 22, stage: "group", date: "1966-07-20", venueId: "villa-park", home: "GER", away: "ESP", score: { home: 2, away: 1 } },
  { no: 23, stage: "group", date: "1966-07-20", venueId: "old-trafford", home: "HUN", away: "BUL", score: { home: 3, away: 1 } },
  { no: 24, stage: "group", date: "1966-07-20", venueId: "roker-park", home: "URS", away: "CHI", score: { home: 2, away: 1 } },
  { no: 25, stage: "qf", date: "1966-07-23", venueId: "wembley-stadium", home: "ENG", away: "ARG", score: { home: 1, away: 0 } },
  { no: 26, stage: "qf", date: "1966-07-23", venueId: "hillsborough", home: "GER", away: "URU", score: { home: 4, away: 0 } },
  { no: 27, stage: "qf", date: "1966-07-23", venueId: "roker-park", home: "URS", away: "HUN", score: { home: 2, away: 1 } },
  { no: 28, stage: "qf", date: "1966-07-23", venueId: "goodison-park", home: "POR", away: "PRK", score: { home: 5, away: 3 } },
  { no: 29, stage: "sf", date: "1966-07-25", venueId: "goodison-park", home: "GER", away: "URS", score: { home: 2, away: 1 } },
  { no: 30, stage: "sf", date: "1966-07-26", venueId: "wembley-stadium", home: "ENG", away: "POR", score: { home: 2, away: 1 } },
  { no: 31, stage: "third", date: "1966-07-28", venueId: "wembley-stadium", home: "POR", away: "URS", score: { home: 2, away: 1 } },
  { no: 32, stage: "final", date: "1966-07-30", venueId: "wembley-stadium", home: "ENG", away: "GER", score: { home: 4, away: 2 }, durationMinutes: 120, note: "After extra time" }
];

// Scorers and minute labels follow the Fjelstul World Cup Database, joined to
// FIFA's official match numbers by date and exact team pairing.
const goalsByFixture: Partial<Record<number, GoalSeed[]>> = {
  2: [[16, "GER", "Sigfried Held"], [21, "GER", "Helmut Haller"], [40, "GER", "Franz Beckenbauer"], [52, "GER", "Franz Beckenbauer"], [77, "GER", "Helmut Haller", "Helmut Haller scores from the penalty spot."]],
  3: [[15, "BRA", "Pelé"], [63, "BRA", "Garrincha"]],
  4: [[31, "URS", "Eduard Malofeyev"], [33, "URS", "Anatoliy Banishevskiy"], [88, "URS", "Eduard Malofeyev"]],
  5: [[48, "MEX", "Enrique Borja"], [62, "FRA", "Gérard Hausser"]],
  6: [[65, "ARG", "Luis Artime"], [71, "ESP", "Pirri"], [77, "ARG", "Luis Artime"]],
  7: [[2, "POR", "José Augusto"], [60, "HUN", "Ferenc Bene"], [67, "POR", "José Augusto"], [90, "POR", "José Torres"]],
  8: [[8, "ITA", "Sandro Mazzola"], [88, "ITA", "Paolo Barison"]],
  9: [[15, "FRA", "Héctor De Bourgoing", "Héctor De Bourgoing scores from the penalty spot."], [26, "URU", "Pedro Rocha"], [31, "URU", "Julio César Cortés"]],
  10: [[31, "SUI", "René-Pierre Quentin"], [57, "ESP", "Manuel Sanchís"], [75, "ESP", "Amancio"]],
  11: [[2, "HUN", "Ferenc Bene"], [14, "BRA", "Tostão"], [64, "HUN", "János Farkas"], [73, "HUN", "Kálmán Mészöly", "Kálmán Mészöly scores from the penalty spot."]],
  12: [[26, "CHI", "Rubén Marcos", "Rubén Marcos scores from the penalty spot."], [88, "PRK", "Seung-zin Pak"]],
  13: [[37, "ENG", "Bobby Charlton"], [75, "ENG", "Roger Hunt"]],
  15: [[7, "POR", "Ivan Vutsov", "Ivan Vutsov scores an own goal."], [38, "POR", "Eusébio"], [81, "POR", "José Torres"]],
  16: [[57, "URS", "Igor Chislenko"]],
  18: [[52, "ARG", "Luis Artime"], [79, "ARG", "Ermindo Onega"]],
  19: [[15, "POR", "António Simões"], [27, "POR", "Eusébio"], [73, "BRA", "Rildo"], [85, "POR", "Eusébio"]],
  20: [[42, "PRK", "Doo-ik Pak"]],
  21: [[38, "ENG", "Roger Hunt"], [75, "ENG", "Roger Hunt"]],
  22: [[23, "ESP", "Josep Maria Fusté"], [39, "GER", "Lothar Emmerich"], [84, "GER", "Uwe Seeler"]],
  23: [[15, "BUL", "Georgi Asparuhov"], [43, "HUN", "Ivan Davidov", "Ivan Davidov scores an own goal."], [45, "HUN", "Kálmán Mészöly"], [54, "HUN", "Ferenc Bene"]],
  24: [[28, "URS", "Valeriy Porkujan"], [32, "CHI", "Rubén Marcos"], [85, "URS", "Valeriy Porkujan"]],
  25: [[78, "ENG", "Geoff Hurst"]],
  26: [[11, "GER", "Helmut Haller"], [70, "GER", "Franz Beckenbauer"], [75, "GER", "Uwe Seeler"], [83, "GER", "Helmut Haller"]],
  27: [[5, "URS", "Igor Chislenko"], [46, "URS", "Valeriy Porkujan"], [57, "HUN", "Ferenc Bene"]],
  28: [[1, "PRK", "Seung-zin Pak"], [22, "PRK", "Dong-woon Li"], [25, "PRK", "Seung-kook Yang"], [27, "POR", "Eusébio"], [43, "POR", "Eusébio", "Eusébio scores from the penalty spot."], [56, "POR", "Eusébio"], [59, "POR", "Eusébio", "Eusébio scores from the penalty spot."], [80, "POR", "José Augusto"]],
  29: [[43, "GER", "Helmut Haller"], [67, "GER", "Franz Beckenbauer"], [88, "URS", "Valeriy Porkujan"]],
  30: [[30, "ENG", "Bobby Charlton"], [80, "ENG", "Bobby Charlton"], [82, "POR", "Eusébio", "Eusébio scores from the penalty spot."]],
  31: [[12, "POR", "Eusébio", "Eusébio scores from the penalty spot."], [43, "URS", "Eduard Malofeyev"], [89, "POR", "José Torres"]],
  32: [[12, "GER", "Helmut Haller"], [18, "ENG", "Geoff Hurst"], [78, "ENG", "Martin Peters"], [89, "GER", "Wolfgang Weber"], [101, "ENG", "Geoff Hurst"], [120, "ENG", "Geoff Hurst"]]
};

type YouTubeHighlightSeed = { videoId: string; sourceName: string };

// Every video matches the fixture teams and score and passed YouTube's real
// embed response with status OK and playableInEmbed=true on July 13, 2026.
const youtubeHighlightsByFixture: Record<number, YouTubeHighlightSeed> = {
  1: { videoId: "gSt7KNq-kcs", sourceName: "sp1873 highlights" },
  2: { videoId: "lbMuG2kWOPM", sourceName: "sp1873 highlights" },
  3: { videoId: "TPlHdo5mDHM", sourceName: "sp1873 highlights" },
  4: { videoId: "dB5ck3jmEr0", sourceName: "sp1873 highlights" },
  5: { videoId: "M-_kJWujJLI", sourceName: "sp1873 highlights" },
  6: { videoId: "t7N1uZrcXrw", sourceName: "MatchMomentZ highlights" },
  7: { videoId: "PJSlT-WU8Sg", sourceName: "Fútbol Total highlights" },
  8: { videoId: "iOFYIOeFzTo", sourceName: "sp1873 highlights" },
  9: { videoId: "znlgsnOE2-Q", sourceName: "sp1873 highlights" },
  10: { videoId: "Uxhi2NT62hs", sourceName: "sp1873 highlights" },
  11: { videoId: "W8dVleUYohE", sourceName: "sp1873 highlights" },
  12: { videoId: "W6fCDR3ccFs", sourceName: "sp1873 highlights" },
  13: { videoId: "t3G5PAkoKTY", sourceName: "sp1873 highlights" },
  14: { videoId: "GJZ1UEZ5wpM", sourceName: "sp1873 highlights" },
  15: { videoId: "RK2Oc3DjBZk", sourceName: "sp1873 highlights" },
  16: { videoId: "lPMEL3DBFlg", sourceName: "sp1873 highlights" },
  17: { videoId: "29g0A6yGIkY", sourceName: "sp1873 highlights" },
  18: { videoId: "R9SAJ5-lSy0", sourceName: "La Argentinidad al Arco highlights" },
  19: { videoId: "z-ToXLPv0ac", sourceName: "pamemundial highlights" },
  20: { videoId: "UlmPaObZ1AA", sourceName: "sp1873 highlights" },
  21: { videoId: "06FqofkFmhM", sourceName: "ClassicEngland highlights" },
  22: { videoId: "YpLTXngxbT8", sourceName: "sp1873 highlights" },
  23: { videoId: "ll2CYBygd1M", sourceName: "alessiafromcetona highlights" },
  24: { videoId: "xDUa301E3no", sourceName: "футбольный болельщик highlights" },
  25: { videoId: "aq0nxUlgXm8", sourceName: "ClassicEngland highlights" },
  26: { videoId: "pFWRyYySbQE", sourceName: "sp1873 highlights" },
  27: { videoId: "g4F-ePy8Xco", sourceName: "sp1873 highlights" },
  28: { videoId: "a-TggTiOpmM", sourceName: "ForeverCR7_ highlights" },
  29: { videoId: "hEbCSqFsu9w", sourceName: "World Cup History highlights" },
  30: { videoId: "s0lNNXzxiT0", sourceName: "ClassicEngland highlights" },
  31: { videoId: "xMmlh-V7hC8", sourceName: "sp1873 highlights" },
  32: { videoId: "v55OBRpuPuw", sourceName: "ClassicEngland highlights" }
};

const fifaMatchIdsByFixture: Record<number, string> = {
  1: "1636", 2: "1656", 3: "1596", 4: "1710", 5: "1650", 6: "1578", 7: "1675", 8: "1608",
  9: "1653", 10: "1641", 11: "1597", 12: "1609", 13: "1634", 14: "1579", 15: "1602", 16: "1682",
  17: "1689", 18: "1582", 19: "1598", 20: "1679", 21: "1632", 22: "1637", 23: "1599", 24: "1610",
  25: "1577", 26: "1660", 27: "1676", 28: "1702", 29: "1659", 30: "1635", 31: "1709", 32: "1633"
};

function getFifaStageId(no: number) {
  if (no <= 24) return "238";
  if (no <= 28) return "239";
  if (no <= 30) return "536";
  if (no === 31) return "3479";
  return "3478";
}

function getFifaMatchUrl(fixture: FixtureSeed) {
  return `https://www.fifa.com/en/match-centre/match/17/26/${getFifaStageId(fixture.no)}/${fifaMatchIdsByFixture[fixture.no]}?date=${fixture.date}`;
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
  const resultDetail = `${teamNames[fixture.home]} ${fixture.score.home}-${fixture.score.away} ${teamNames[fixture.away]}${fixture.note ? ` (${fixture.note})` : ""}.`;
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
      id: `wc-1966-${String(fixture.no).padStart(2, "0")}-${fixture.home.toLowerCase()}-${fixture.away.toLowerCase()}`,
      tournamentId: "wc-1966",
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

export const worldCup1966: Tournament = {
  id: "wc-1966",
  competition: "WORLD_CUP",
  name: "England 1966",
  year: 1966,
  hosts: ["ENG"],
  teams: worldCup1966Groups.flatMap((group) => group.teams),
  groups: worldCup1966Groups,
  teamCoordinates: worldCup1966TeamCoordinates,
  format: worldCup1966Format,
  stages: ["group", "qf", "sf", "third", "final"],
  status: "complete",
  mapView: { center: [-1.8, 53], zoom: 5.2, bearing: -7, pitch: 42 },
  venues,
  featuredRoute: venues.map((venue) => venue.id),
  matches
};
