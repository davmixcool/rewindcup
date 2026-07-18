import { createYoutubeHighlight } from "@/data/highlights";
import { teamNames } from "@/data/teamMetadata";
import {
  worldCup1978Format,
  worldCup1978Groups,
  worldCup1978SecondGroups,
  worldCup1978TeamCoordinates
} from "@/data/worldCup1978Experience";
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
  { id: "estadio-monumental", name: "Estadio Monumental Antonio Vespucio Liberti", city: "Buenos Aires", country: "ARG", coordinates: [-58.4497, -34.5453], bearing: -16, zoom: 16.4 },
  { id: "estadio-jose-maria-minella", name: "Estadio José María Minella", city: "Mar del Plata", country: "ARG", coordinates: [-57.5824, -38.0178], bearing: 18 },
  { id: "estadio-dr-lisandro-de-la-torre", name: "Estadio Dr. Lisandro de la Torre", city: "Rosario", country: "ARG", coordinates: [-60.6255, -32.9141], bearing: -18 },
  { id: "estadio-jose-amalfitani", name: "Estadio José Amalfitani", city: "Buenos Aires", country: "ARG", coordinates: [-58.5209, -34.6353], bearing: 16 },
  { id: "estadio-mario-alberto-kempes", name: "Estadio Mario Alberto Kempes", city: "Córdoba", country: "ARG", coordinates: [-64.2462, -31.3687], bearing: -14 },
  { id: "estadio-ciudad-de-mendoza", name: "Estadio Ciudad de Mendoza", city: "Mendoza", country: "ARG", coordinates: [-68.8797, -32.8897], bearing: 14 }
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

// Numbers and ordering follow FIFA's current match-centre archive for season 50.
const fixtureSeeds: FixtureSeed[] = [
  { no: 1, stage: "group", date: "1978-06-01", venueId: "estadio-monumental", home: "GER", away: "POL", score: { home: 0, away: 0 } },
  { no: 2, stage: "group", date: "1978-06-02", venueId: "estadio-monumental", home: "ARG", away: "HUN", score: { home: 2, away: 1 } },
  { no: 3, stage: "group", date: "1978-06-02", venueId: "estadio-jose-maria-minella", home: "ITA", away: "FRA", score: { home: 2, away: 1 } },
  { no: 4, stage: "group", date: "1978-06-02", venueId: "estadio-dr-lisandro-de-la-torre", home: "TUN", away: "MEX", score: { home: 3, away: 1 } },
  { no: 5, stage: "group", date: "1978-06-03", venueId: "estadio-jose-amalfitani", home: "AUT", away: "ESP", score: { home: 2, away: 1 } },
  { no: 6, stage: "group", date: "1978-06-03", venueId: "estadio-jose-maria-minella", home: "SWE", away: "BRA", score: { home: 1, away: 1 } },
  { no: 7, stage: "group", date: "1978-06-03", venueId: "estadio-mario-alberto-kempes", home: "PER", away: "SCO", score: { home: 3, away: 1 } },
  { no: 8, stage: "group", date: "1978-06-03", venueId: "estadio-ciudad-de-mendoza", home: "NED", away: "IRN", score: { home: 3, away: 0 } },
  { no: 9, stage: "group", date: "1978-06-06", venueId: "estadio-monumental", home: "ARG", away: "FRA", score: { home: 2, away: 1 } },
  { no: 10, stage: "group", date: "1978-06-06", venueId: "estadio-jose-maria-minella", home: "ITA", away: "HUN", score: { home: 3, away: 1 } },
  { no: 11, stage: "group", date: "1978-06-06", venueId: "estadio-dr-lisandro-de-la-torre", home: "POL", away: "TUN", score: { home: 1, away: 0 } },
  { no: 12, stage: "group", date: "1978-06-06", venueId: "estadio-mario-alberto-kempes", home: "GER", away: "MEX", score: { home: 6, away: 0 } },
  { no: 13, stage: "group", date: "1978-06-07", venueId: "estadio-jose-amalfitani", home: "AUT", away: "SWE", score: { home: 1, away: 0 } },
  { no: 14, stage: "group", date: "1978-06-07", venueId: "estadio-jose-maria-minella", home: "BRA", away: "ESP", score: { home: 0, away: 0 } },
  { no: 15, stage: "group", date: "1978-06-07", venueId: "estadio-mario-alberto-kempes", home: "SCO", away: "IRN", score: { home: 1, away: 1 } },
  { no: 16, stage: "group", date: "1978-06-07", venueId: "estadio-ciudad-de-mendoza", home: "NED", away: "PER", score: { home: 0, away: 0 } },
  { no: 17, stage: "group", date: "1978-06-10", venueId: "estadio-monumental", home: "ITA", away: "ARG", score: { home: 1, away: 0 } },
  { no: 18, stage: "group", date: "1978-06-10", venueId: "estadio-jose-maria-minella", home: "FRA", away: "HUN", score: { home: 3, away: 1 } },
  { no: 19, stage: "group", date: "1978-06-10", venueId: "estadio-dr-lisandro-de-la-torre", home: "POL", away: "MEX", score: { home: 3, away: 1 } },
  { no: 20, stage: "group", date: "1978-06-10", venueId: "estadio-mario-alberto-kempes", home: "GER", away: "TUN", score: { home: 0, away: 0 } },
  { no: 21, stage: "group", date: "1978-06-11", venueId: "estadio-jose-amalfitani", home: "ESP", away: "SWE", score: { home: 1, away: 0 } },
  { no: 22, stage: "group", date: "1978-06-11", venueId: "estadio-jose-maria-minella", home: "BRA", away: "AUT", score: { home: 1, away: 0 } },
  { no: 23, stage: "group", date: "1978-06-11", venueId: "estadio-mario-alberto-kempes", home: "PER", away: "IRN", score: { home: 4, away: 1 } },
  { no: 24, stage: "group", date: "1978-06-11", venueId: "estadio-ciudad-de-mendoza", home: "SCO", away: "NED", score: { home: 3, away: 2 } },
  { no: 25, stage: "group2", date: "1978-06-14", venueId: "estadio-monumental", home: "GER", away: "ITA", score: { home: 0, away: 0 } },
  { no: 26, stage: "group2", date: "1978-06-14", venueId: "estadio-dr-lisandro-de-la-torre", home: "ARG", away: "POL", score: { home: 2, away: 0 } },
  { no: 27, stage: "group2", date: "1978-06-14", venueId: "estadio-mario-alberto-kempes", home: "NED", away: "AUT", score: { home: 5, away: 1 } },
  { no: 28, stage: "group2", date: "1978-06-14", venueId: "estadio-ciudad-de-mendoza", home: "BRA", away: "PER", score: { home: 3, away: 0 } },
  { no: 29, stage: "group2", date: "1978-06-18", venueId: "estadio-monumental", home: "ITA", away: "AUT", score: { home: 1, away: 0 } },
  { no: 30, stage: "group2", date: "1978-06-18", venueId: "estadio-dr-lisandro-de-la-torre", home: "ARG", away: "BRA", score: { home: 0, away: 0 } },
  { no: 31, stage: "group2", date: "1978-06-18", venueId: "estadio-mario-alberto-kempes", home: "GER", away: "NED", score: { home: 2, away: 2 } },
  { no: 32, stage: "group2", date: "1978-06-18", venueId: "estadio-ciudad-de-mendoza", home: "POL", away: "PER", score: { home: 1, away: 0 } },
  { no: 33, stage: "group2", date: "1978-06-21", venueId: "estadio-monumental", home: "NED", away: "ITA", score: { home: 2, away: 1 } },
  { no: 34, stage: "group2", date: "1978-06-21", venueId: "estadio-dr-lisandro-de-la-torre", home: "ARG", away: "PER", score: { home: 6, away: 0 } },
  { no: 35, stage: "group2", date: "1978-06-21", venueId: "estadio-mario-alberto-kempes", home: "AUT", away: "GER", score: { home: 3, away: 2 } },
  { no: 36, stage: "group2", date: "1978-06-21", venueId: "estadio-ciudad-de-mendoza", home: "BRA", away: "POL", score: { home: 3, away: 1 } },
  { no: 37, stage: "third", date: "1978-06-24", venueId: "estadio-monumental", home: "BRA", away: "ITA", score: { home: 2, away: 1 } },
  { no: 38, stage: "final", date: "1978-06-25", venueId: "estadio-monumental", home: "ARG", away: "NED", score: { home: 3, away: 1 }, durationMinutes: 120, note: "After extra time" }
];

// Scorers and minute labels follow the Fjelstul World Cup Database, joined to
// FIFA's official match numbers by date and exact team pairing.
const goalsByFixture: Partial<Record<number, GoalSeed[]>> = {
  2: [[9, "HUN", "Károly Csapó"], [14, "ARG", "Leopoldo Luque"], [83, "ARG", "Daniel Bertoni"]],
  3: [[1, "FRA", "Bernard Lacombe"], [29, "ITA", "Paolo Rossi"], [54, "ITA", "Renato Zaccarelli"]],
  4: [[45, "MEX", "Arturo Vázquez Ayala", "Arturo Vázquez Ayala scores from the penalty spot."], [55, "TUN", "Ali Kaabi"], [79, "TUN", "Néjib Ghommidh"], [87, "TUN", "Mokhtar Dhouib"]],
  5: [[10, "AUT", "Walter Schachner"], [21, "ESP", "Dani"], [76, "AUT", "Hans Krankl"]],
  6: [[37, "SWE", "Thomas Sjöberg"], [45, "BRA", "Reinaldo"]],
  7: [[14, "SCO", "Joe Jordan"], [43, "PER", "César Cueto"], [71, "PER", "Teófilo Cubillas"], [77, "PER", "Teófilo Cubillas"]],
  8: [[40, "NED", "Rob Rensenbrink", "Rob Rensenbrink scores from the penalty spot."], [62, "NED", "Rob Rensenbrink"], [78, "NED", "Rob Rensenbrink", "Rob Rensenbrink scores from the penalty spot."]],
  9: [[45, "ARG", "Daniel Passarella", "Daniel Passarella scores from the penalty spot."], [60, "FRA", "Michel Platini"], [73, "ARG", "Leopoldo Luque"]],
  10: [[34, "ITA", "Paolo Rossi"], [35, "ITA", "Roberto Bettega"], [61, "ITA", "Romeo Benetti"], [81, "HUN", "András Tóth", "András Tóth scores from the penalty spot."]],
  11: [[43, "POL", "Grzegorz Lato"]],
  12: [[15, "GER", "Dieter Müller"], [30, "GER", "Hansi Müller"], [38, "GER", "Karl-Heinz Rummenigge"], [44, "GER", "Heinz Flohe"], [73, "GER", "Karl-Heinz Rummenigge"], [89, "GER", "Heinz Flohe"]],
  13: [[42, "AUT", "Hans Krankl", "Hans Krankl scores from the penalty spot."]],
  15: [[43, "SCO", "Andranik Eskandarian", "Andranik Eskandarian scores an own goal."], [60, "IRN", "Iraj Danaeifard"]],
  17: [[67, "ITA", "Roberto Bettega"]],
  18: [[23, "FRA", "Christian Lopez"], [38, "FRA", "Marc Berdoll"], [41, "HUN", "Sándor Zombori"], [42, "FRA", "Dominique Rocheteau"]],
  19: [[43, "POL", "Zbigniew Boniek"], [52, "MEX", "Víctor Rangel"], [56, "POL", "Kazimierz Deyna"], [84, "POL", "Zbigniew Boniek"]],
  21: [[75, "ESP", "Juan Manuel Asensi"]],
  22: [[40, "BRA", "Roberto Dinamite"]],
  23: [[2, "PER", "José Velásquez"], [36, "PER", "Teófilo Cubillas", "Teófilo Cubillas scores from the penalty spot."], [39, "PER", "Teófilo Cubillas", "Teófilo Cubillas scores from the penalty spot."], [41, "IRN", "Hassan Roshan"], [79, "PER", "Teófilo Cubillas"]],
  24: [[34, "NED", "Rob Rensenbrink", "Rob Rensenbrink scores from the penalty spot."], [45, "SCO", "Kenny Dalglish"], [46, "SCO", "Archie Gemmill", "Archie Gemmill scores from the penalty spot."], [68, "SCO", "Archie Gemmill"], [71, "NED", "Johnny Rep"]],
  26: [[16, "ARG", "Mario Kempes"], [71, "ARG", "Mario Kempes"]],
  27: [[6, "NED", "Ernie Brandts"], [35, "NED", "Rob Rensenbrink", "Rob Rensenbrink scores from the penalty spot."], [36, "NED", "Johnny Rep"], [53, "NED", "Johnny Rep"], [80, "AUT", "Erich Obermayer"], [82, "NED", "Willy van de Kerkhof"]],
  28: [[15, "BRA", "Dirceu"], [27, "BRA", "Dirceu"], [72, "BRA", "Zico", "Zico scores from the penalty spot."]],
  29: [[13, "ITA", "Paolo Rossi"]],
  31: [[3, "GER", "Rüdiger Abramczik"], [27, "NED", "Arie Haan"], [70, "GER", "Dieter Müller"], [82, "NED", "René van de Kerkhof"]],
  32: [[65, "POL", "Andrzej Szarmach"]],
  33: [[19, "ITA", "Ernie Brandts", "Ernie Brandts scores an own goal."], [49, "NED", "Ernie Brandts"], [76, "NED", "Arie Haan"]],
  34: [[21, "ARG", "Mario Kempes"], [43, "ARG", "Alberto Tarantini"], [49, "ARG", "Mario Kempes"], [50, "ARG", "Leopoldo Luque"], [67, "ARG", "René Houseman"], [72, "ARG", "Leopoldo Luque"]],
  35: [[19, "GER", "Karl-Heinz Rummenigge"], [59, "AUT", "Berti Vogts", "Berti Vogts scores an own goal."], [66, "AUT", "Hans Krankl"], [68, "GER", "Bernd Hölzenbein"], [87, "AUT", "Hans Krankl"]],
  36: [[13, "BRA", "Nelinho"], [45, "POL", "Grzegorz Lato"], [58, "BRA", "Roberto Dinamite"], [63, "BRA", "Roberto Dinamite"]],
  37: [[38, "ITA", "Franco Causio"], [64, "BRA", "Nelinho"], [71, "BRA", "Dirceu"]],
  38: [[38, "ARG", "Mario Kempes"], [82, "NED", "Dick Nanninga"], [105, "ARG", "Mario Kempes"], [115, "ARG", "Daniel Bertoni"]]
};

type YouTubeHighlightSeed = { videoId: string; sourceName: string };

// Every video matches the fixture teams and score and passed YouTube's real
// embed response with status OK and playableInEmbed=true on July 13, 2026.
const youtubeHighlightsByFixture: Record<number, YouTubeHighlightSeed> = {
  1: { videoId: "ciEnsUH-oP8", sourceName: "sp1873 highlights" },
  2: { videoId: "DAkegAJu0i0", sourceName: "Football Flashback 6 highlights" },
  3: { videoId: "kZFBWyZdcuQ", sourceName: "Football Flashback 6 highlights" },
  4: { videoId: "gSZlmAdfA_8", sourceName: "Tunisia Sport Replay highlights" },
  5: { videoId: "Ctg0-qpgyKo", sourceName: "Football Flashback 6 highlights" },
  6: { videoId: "auhA2fza3Pc", sourceName: "Football Flashback 6 highlights" },
  7: { videoId: "uqdSCvhHYVw", sourceName: "LND fOoTy Legend highlights" },
  8: { videoId: "8_dlVFPRPQg", sourceName: "Football Flashback 6 highlights" },
  9: { videoId: "Pgy4B1VO1jY", sourceName: "Football Flashback 6 highlights" },
  10: { videoId: "9xql3CxN-Ds", sourceName: "Football Flashback 6 highlights" },
  11: { videoId: "RcLKU_qpGfM", sourceName: "Football Flashback 6 highlights" },
  12: { videoId: "s7qEicJqY-0", sourceName: "Football Flashback 6 highlights" },
  13: { videoId: "LE74nfeBH_0", sourceName: "LND fOoTy Legend highlights" },
  14: { videoId: "2TrE5WJ-m3A", sourceName: "Football Flashback 6 highlights" },
  15: { videoId: "O8_AL57bdnE", sourceName: "Football Flashback 6 highlights" },
  16: { videoId: "f8E-4DGF_Rs", sourceName: "Football Flashback 6 highlights" },
  17: { videoId: "Bcb8tMIY-3U", sourceName: "Football Flashback 6 highlights" },
  18: { videoId: "VV4zamhBMlQ", sourceName: "Football Flashback 6 highlights" },
  19: { videoId: "sFt46Tu8UaI", sourceName: "Football Flashback 6 highlights" },
  20: { videoId: "1xmqrU-5bnw", sourceName: "Tunisia Sport Replay highlights" },
  21: { videoId: "8z7JEwXK24c", sourceName: "Futbol Market highlights" },
  22: { videoId: "fU3qLXQ2K1k", sourceName: "Football Flashback 6 highlights" },
  23: { videoId: "mEQvNY-MhZA", sourceName: "Topolab highlights" },
  24: { videoId: "iDghF9QJT2M", sourceName: "Football Flashback 6 highlights" },
  25: { videoId: "xS84sLQvD2Q", sourceName: "Football Flashback 6 highlights" },
  26: { videoId: "HqHUREJuIRs", sourceName: "Pasión Argentina highlights" },
  27: { videoId: "tAoPv1HnDsU", sourceName: "Football Flashback 6 highlights" },
  28: { videoId: "7YTQ-a9LnDI", sourceName: "Football Flashback 6 highlights" },
  29: { videoId: "-5q9MbMG35c", sourceName: "Football Flashback 6 highlights" },
  30: { videoId: "JviaCIEK0vc", sourceName: "Football Flashback 6 highlights" },
  31: { videoId: "LJaLqr8kbTo", sourceName: "Football Flashback 6 highlights" },
  32: { videoId: "Jt8feK7KFNo", sourceName: "Football Flashback 6 highlights" },
  33: { videoId: "nkuT0efzgbY", sourceName: "Football Flashback 6 highlights" },
  34: { videoId: "8v5J2ugV_34", sourceName: "Futebol Clássico Seleções highlights" },
  35: { videoId: "_aBnNj5jka4", sourceName: "LND fOoTy Legend highlights" },
  36: { videoId: "v-vg6EpQYHc", sourceName: "Football Flashback 6 highlights" },
  37: { videoId: "gdpMj0SZDy0", sourceName: "Classic Football highlights" },
  38: { videoId: "Y8lHUkJlWw4", sourceName: "LoL Football highlights" }
};

const fifaMatchIdsByFixture: Record<number, string> = {
  1: "2351", 2: "2199", 3: "2347", 4: "2433", 5: "2216", 6: "2253",
  7: "2451", 8: "2388", 9: "2197", 10: "2396", 11: "2454", 12: "2350",
  13: "2224", 14: "2246", 15: "2408", 16: "2394", 17: "2200", 18: "2344",
  19: "2431", 20: "2352", 21: "2337", 22: "2215", 23: "2405", 24: "2395",
  25: "2349", 26: "2202", 27: "2220", 28: "2251", 29: "2221", 30: "2196",
  31: "2348", 32: "2450", 33: "2391", 34: "2201", 35: "2217", 36: "2252",
  37: "2247", 38: "2198"
};

function getFifaStageId(no: number) {
  if (no <= 24) return "278";
  if (no <= 36) return "279";
  if (no === 37) return "280";
  return "639";
}

function getFifaMatchUrl(fixture: FixtureSeed) {
  return `https://www.fifa.com/en/match-centre/match/17/50/${getFifaStageId(fixture.no)}/${fifaMatchIdsByFixture[fixture.no]}?date=${fixture.date}`;
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
      id: `wc-1978-${String(fixture.no).padStart(2, "0")}-${fixture.home.toLowerCase()}-${fixture.away.toLowerCase()}`,
      tournamentId: "wc-1978",
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

export const worldCup1978: Tournament = {
  id: "wc-1978",
  competition: "WORLD_CUP",
  name: "Argentina 1978",
  year: 1978,
  hosts: ["ARG"],
  teams: worldCup1978Groups.flatMap((group) => group.teams),
  groups: worldCup1978Groups,
  secondGroups: worldCup1978SecondGroups,
  teamCoordinates: worldCup1978TeamCoordinates,
  format: worldCup1978Format,
  stages: ["group", "group2", "third", "final"],
  status: "complete",
  mapView: { center: [-64.2, -34.5], zoom: 3.7, bearing: -8, pitch: 42 },
  venues,
  featuredRoute: venues.map((venue) => venue.id),
  matches
};
