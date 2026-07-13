import { createYoutubeHighlight } from "@/data/highlights";
import { teamNames } from "@/data/teamMetadata";
import {
  worldCup1970Format,
  worldCup1970Groups,
  worldCup1970TeamCoordinates
} from "@/data/worldCup1970Experience";
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
  { id: "estadio-azteca", name: "Estadio Azteca", city: "Mexico City", country: "MEX", coordinates: [-99.1505, 19.3029], bearing: -14, zoom: 16.35 },
  { id: "estadio-cuauhtemoc", name: "Estadio Cuauhtémoc", city: "Puebla", country: "MEX", coordinates: [-98.1645, 19.078], bearing: 16 },
  { id: "estadio-jalisco", name: "Estadio Jalisco", city: "Guadalajara", country: "MEX", coordinates: [-103.3234, 20.705], bearing: -18 },
  { id: "estadio-nou-camp", name: "Estadio Nou Camp", city: "León", country: "MEX", coordinates: [-101.6576, 21.1152], bearing: 18 },
  { id: "estadio-nemesio-diez", name: "Estadio Nemesio Díez", city: "Toluca", country: "MEX", coordinates: [-99.666, 19.2871], bearing: -12 }
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

// Numbers and ordering follow FIFA's current match-centre archive for season 32.
const fixtureSeeds: FixtureSeed[] = [
  { no: 1, stage: "group", date: "1970-05-31", venueId: "estadio-azteca", home: "MEX", away: "URS", score: { home: 0, away: 0 } },
  { no: 2, stage: "group", date: "1970-06-02", venueId: "estadio-cuauhtemoc", home: "URU", away: "ISR", score: { home: 2, away: 0 } },
  { no: 3, stage: "group", date: "1970-06-02", venueId: "estadio-jalisco", home: "ENG", away: "ROU", score: { home: 1, away: 0 } },
  { no: 4, stage: "group", date: "1970-06-02", venueId: "estadio-nou-camp", home: "PER", away: "BUL", score: { home: 3, away: 2 } },
  { no: 5, stage: "group", date: "1970-06-03", venueId: "estadio-azteca", home: "BEL", away: "SLV", score: { home: 3, away: 0 } },
  { no: 6, stage: "group", date: "1970-06-03", venueId: "estadio-nemesio-diez", home: "ITA", away: "SWE", score: { home: 1, away: 0 } },
  { no: 7, stage: "group", date: "1970-06-03", venueId: "estadio-jalisco", home: "BRA", away: "TCH", score: { home: 4, away: 1 } },
  { no: 8, stage: "group", date: "1970-06-03", venueId: "estadio-nou-camp", home: "GER", away: "MAR", score: { home: 2, away: 1 } },
  { no: 9, stage: "group", date: "1970-06-06", venueId: "estadio-azteca", home: "URS", away: "BEL", score: { home: 4, away: 1 } },
  { no: 10, stage: "group", date: "1970-06-06", venueId: "estadio-cuauhtemoc", home: "URU", away: "ITA", score: { home: 0, away: 0 } },
  { no: 11, stage: "group", date: "1970-06-06", venueId: "estadio-jalisco", home: "ROU", away: "TCH", score: { home: 2, away: 1 } },
  { no: 12, stage: "group", date: "1970-06-06", venueId: "estadio-nou-camp", home: "PER", away: "MAR", score: { home: 3, away: 0 } },
  { no: 13, stage: "group", date: "1970-06-07", venueId: "estadio-azteca", home: "MEX", away: "SLV", score: { home: 4, away: 0 } },
  { no: 14, stage: "group", date: "1970-06-07", venueId: "estadio-nemesio-diez", home: "SWE", away: "ISR", score: { home: 1, away: 1 } },
  { no: 15, stage: "group", date: "1970-06-07", venueId: "estadio-jalisco", home: "BRA", away: "ENG", score: { home: 1, away: 0 } },
  { no: 16, stage: "group", date: "1970-06-07", venueId: "estadio-nou-camp", home: "GER", away: "BUL", score: { home: 5, away: 2 } },
  { no: 17, stage: "group", date: "1970-06-10", venueId: "estadio-azteca", home: "URS", away: "SLV", score: { home: 2, away: 0 } },
  { no: 18, stage: "group", date: "1970-06-10", venueId: "estadio-cuauhtemoc", home: "SWE", away: "URU", score: { home: 1, away: 0 } },
  { no: 19, stage: "group", date: "1970-06-10", venueId: "estadio-jalisco", home: "BRA", away: "ROU", score: { home: 3, away: 2 } },
  { no: 20, stage: "group", date: "1970-06-10", venueId: "estadio-nou-camp", home: "GER", away: "PER", score: { home: 3, away: 1 } },
  { no: 21, stage: "group", date: "1970-06-11", venueId: "estadio-azteca", home: "MEX", away: "BEL", score: { home: 1, away: 0 } },
  { no: 22, stage: "group", date: "1970-06-11", venueId: "estadio-nemesio-diez", home: "ITA", away: "ISR", score: { home: 0, away: 0 } },
  { no: 23, stage: "group", date: "1970-06-11", venueId: "estadio-jalisco", home: "ENG", away: "TCH", score: { home: 1, away: 0 } },
  { no: 24, stage: "group", date: "1970-06-11", venueId: "estadio-nou-camp", home: "BUL", away: "MAR", score: { home: 1, away: 1 } },
  { no: 25, stage: "qf", date: "1970-06-14", venueId: "estadio-azteca", home: "URU", away: "URS", score: { home: 1, away: 0 }, durationMinutes: 120, note: "After extra time" },
  { no: 26, stage: "qf", date: "1970-06-14", venueId: "estadio-nemesio-diez", home: "ITA", away: "MEX", score: { home: 4, away: 1 } },
  { no: 27, stage: "qf", date: "1970-06-14", venueId: "estadio-jalisco", home: "BRA", away: "PER", score: { home: 4, away: 2 } },
  { no: 28, stage: "qf", date: "1970-06-14", venueId: "estadio-nou-camp", home: "GER", away: "ENG", score: { home: 3, away: 2 }, durationMinutes: 120, note: "After extra time" },
  { no: 29, stage: "sf", date: "1970-06-17", venueId: "estadio-jalisco", home: "BRA", away: "URU", score: { home: 3, away: 1 } },
  { no: 30, stage: "sf", date: "1970-06-17", venueId: "estadio-azteca", home: "ITA", away: "GER", score: { home: 4, away: 3 }, durationMinutes: 120, note: "After extra time" },
  { no: 31, stage: "third", date: "1970-06-20", venueId: "estadio-azteca", home: "GER", away: "URU", score: { home: 1, away: 0 } },
  { no: 32, stage: "final", date: "1970-06-21", venueId: "estadio-azteca", home: "BRA", away: "ITA", score: { home: 4, away: 1 } }
];

// Scorers and minute labels follow the Fjelstul World Cup Database, joined to
// FIFA's official match numbers by date and exact team pairing.
const goalsByFixture: Partial<Record<number, GoalSeed[]>> = {
  2: [[23, "URU", "Ildo Maneiro"], [50, "URU", "Juan Mujica"]],
  3: [[65, "ENG", "Geoff Hurst"]],
  4: [[13, "BUL", "Dinko Dermendzhiev"], [49, "BUL", "Hristo Bonev"], [50, "PER", "Alberto Gallardo"], [55, "PER", "Héctor Chumpitaz"], [73, "PER", "Teófilo Cubillas"]],
  5: [[12, "BEL", "Wilfried Van Moer"], [54, "BEL", "Wilfried Van Moer"], [76, "BEL", "Raoul Lambert", "Raoul Lambert scores from the penalty spot."]],
  6: [[10, "ITA", "Angelo Domenghini"]],
  7: [[11, "TCH", "Ladislav Petráš"], [24, "BRA", "Rivellino"], [59, "BRA", "Pelé"], [61, "BRA", "Jairzinho"], [83, "BRA", "Jairzinho"]],
  8: [[21, "MAR", "Houmane Jarir"], [56, "GER", "Uwe Seeler"], [80, "GER", "Gerd Müller"]],
  9: [[14, "URS", "Anatoliy Byshovets"], [57, "URS", "Kakhi Asatiani"], [63, "URS", "Anatoliy Byshovets"], [76, "URS", "Vitaly Khmelnitsky"], [86, "BEL", "Raoul Lambert"]],
  11: [[5, "TCH", "Ladislav Petráš"], [52, "ROU", "Alexandru Neagu"], [75, "ROU", "Florea Dumitrache", "Florea Dumitrache scores from the penalty spot."]],
  12: [[65, "PER", "Teófilo Cubillas"], [67, "PER", "Roberto Challe"], [75, "PER", "Teófilo Cubillas"]],
  13: [[45, "MEX", "Javier Valdivia"], [46, "MEX", "Javier Valdivia"], [58, "MEX", "Javier Fragoso"], [83, "MEX", "Juan Ignacio Basaguren"]],
  14: [[53, "SWE", "Tom Turesson"], [56, "ISR", "Mordechai Spiegler"]],
  15: [[59, "BRA", "Jairzinho"]],
  16: [[12, "BUL", "Asparuh Nikodimov"], [20, "GER", "Reinhard Libuda"], [27, "GER", "Gerd Müller"], [52, "GER", "Gerd Müller", "Gerd Müller scores from the penalty spot."], [67, "GER", "Uwe Seeler"], [88, "GER", "Gerd Müller"], [89, "BUL", "Todor Kolev"]],
  17: [[51, "URS", "Anatoliy Byshovets"], [74, "URS", "Anatoliy Byshovets"]],
  18: [[90, "SWE", "Ove Grahn"]],
  19: [[19, "BRA", "Pelé"], [22, "BRA", "Jairzinho"], [34, "ROU", "Florea Dumitrache"], [67, "BRA", "Pelé"], [84, "ROU", "Emerich Dembrovschi"]],
  20: [[19, "GER", "Gerd Müller"], [26, "GER", "Gerd Müller"], [39, "GER", "Gerd Müller"], [44, "PER", "Teófilo Cubillas"]],
  21: [[14, "MEX", "Gustavo Peña", "Gustavo Peña scores from the penalty spot."]],
  23: [[50, "ENG", "Allan Clarke", "Allan Clarke scores from the penalty spot."]],
  24: [[40, "BUL", "Dobromir Zhechev"], [61, "MAR", "Maouhoub Ghazouani"]],
  25: [[117, "URU", "Víctor Espárrago"]],
  26: [[13, "MEX", "José Luis González"], [25, "ITA", "Javier Guzmán", "Javier Guzmán scores an own goal."], [63, "ITA", "Gigi Riva"], [70, "ITA", "Gianni Rivera"], [76, "ITA", "Gigi Riva"]],
  27: [[11, "BRA", "Rivellino"], [15, "BRA", "Tostão"], [28, "PER", "Alberto Gallardo"], [52, "BRA", "Tostão"], [70, "PER", "Teófilo Cubillas"], [75, "BRA", "Jairzinho"]],
  28: [[31, "ENG", "Alan Mullery"], [49, "ENG", "Martin Peters"], [68, "GER", "Franz Beckenbauer"], [82, "GER", "Uwe Seeler"], [108, "GER", "Gerd Müller"]],
  29: [[19, "URU", "Luis Cubilla"], [44, "BRA", "Clodoaldo"], [76, "BRA", "Jairzinho"], [89, "BRA", "Rivellino"]],
  30: [[8, "ITA", "Roberto Boninsegna"], [90, "GER", "Karl-Heinz Schnellinger"], [94, "GER", "Gerd Müller"], [98, "ITA", "Tarcisio Burgnich"], [104, "ITA", "Gigi Riva"], [110, "GER", "Gerd Müller"], [111, "ITA", "Gianni Rivera"]],
  31: [[26, "GER", "Wolfgang Overath"]],
  32: [[18, "BRA", "Pelé"], [37, "ITA", "Roberto Boninsegna"], [66, "BRA", "Gérson"], [71, "BRA", "Jairzinho"], [86, "BRA", "Carlos Alberto"]]
};

type YouTubeHighlightSeed = { videoId: string; sourceName: string };

// Every video matches the fixture teams and score and passed YouTube's real
// embed response with status OK and playableInEmbed=true on July 13, 2026.
const youtubeHighlightsByFixture: Record<number, YouTubeHighlightSeed> = {
  1: { videoId: "uj6MlYsj3u4", sourceName: "Football Flashback 6 highlights" },
  2: { videoId: "LTVz4Y_1Xnw", sourceName: "Football Flashback 6 highlights" },
  3: { videoId: "e5dvDOSdsA0", sourceName: "Football Flashback 6 highlights" },
  4: { videoId: "x3sYY80g7to", sourceName: "Football Flashback 6 highlights" },
  5: { videoId: "hY2YabQUT_c", sourceName: "Football Flashback 6 highlights" },
  6: { videoId: "n7rBtQ6L30c", sourceName: "Football Flashback 6 highlights" },
  7: { videoId: "q2sF1b6IBnc", sourceName: "Football Flashback 6 highlights" },
  8: { videoId: "GH-tEsFGhl4", sourceName: "Football Flashback 6 highlights" },
  9: { videoId: "EYRrHs8_BGE", sourceName: "Football Flashback 6 highlights" },
  10: { videoId: "lD2_Ff3gNLA", sourceName: "Football Flashback 6 highlights" },
  11: { videoId: "21Ztm6a0P7g", sourceName: "Football Flashback 6 highlights" },
  12: { videoId: "iTGPDlaof2g", sourceName: "Football Flashback 6 highlights" },
  13: { videoId: "cjZSnlaDYrM", sourceName: "Joyitas del Futbol Mexicano highlights" },
  14: { videoId: "vurNeYwFg90", sourceName: "rarefooty highlights" },
  15: { videoId: "9IFa5ddQHes", sourceName: "Football Flashback 6 highlights" },
  16: { videoId: "gQMHsYoPtPs", sourceName: "Football Flashback 6 highlights" },
  17: { videoId: "i9BKMmlThzA", sourceName: "football highlights" },
  18: { videoId: "_JpV5jzd9EQ", sourceName: "Football Flashback 6 highlights" },
  19: { videoId: "hmPcB6SVPV4", sourceName: "sp1873 highlights" },
  20: { videoId: "q-HTi4v2n_c", sourceName: "Football Flashback 6 highlights" },
  21: { videoId: "0zsLLOrpjbA", sourceName: "rarefooty highlights" },
  22: { videoId: "avl59QKSQmM", sourceName: "Football Flashback 6 highlights" },
  23: { videoId: "s59hUXxHI2o", sourceName: "Football Flashback 6 highlights" },
  24: { videoId: "ZO2vx2ZdQKA", sourceName: "Football Flashback 6 highlights" },
  25: { videoId: "ONrLOuJAkpo", sourceName: "tdspm highlights" },
  26: { videoId: "uwnuSrMVsYQ", sourceName: "VintageHDtv highlights" },
  27: { videoId: "aj0Oyb4SxbA", sourceName: "videosdaselecao highlights" },
  28: { videoId: "lc50LpoJCeg", sourceName: "LND fOoTy Legend highlights" },
  29: { videoId: "HZ61obs49u4", sourceName: "David highlights" },
  30: { videoId: "zaEV9eoH4Iw", sourceName: "LND fOoTy Legend highlights" },
  31: { videoId: "6BCDVs46duk", sourceName: "Football Flashback 6 highlights" },
  32: { videoId: "QMe3uoUbhkA", sourceName: "Southstandred highlights" }
};

const fifaMatchIdsByFixture: Record<number, string> = {
  1: "1902", 2: "1881", 3: "1812", 4: "1780", 5: "1747", 6: "1883",
  7: "1770", 8: "1839", 9: "1753", 10: "1884", 11: "1919", 12: "1893",
  13: "1820", 14: "1880", 15: "1764", 16: "1774", 17: "1823", 18: "1922",
  19: "1769", 20: "1840", 21: "1752", 22: "1877", 23: "1813", 24: "1779",
  25: "1925", 26: "1882", 27: "1768", 28: "1811", 29: "1771", 30: "1838",
  31: "1843", 32: "1765"
};

function getFifaStageId(no: number) {
  if (no <= 24) return "250";
  if (no <= 28) return "251";
  if (no <= 30) return "569";
  if (no === 31) return "3477";
  return "3476";
}

function getFifaMatchUrl(fixture: FixtureSeed) {
  return `https://www.fifa.com/en/match-centre/match/17/32/${getFifaStageId(fixture.no)}/${fifaMatchIdsByFixture[fixture.no]}?date=${fixture.date}`;
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
      id: `wc-1970-${String(fixture.no).padStart(2, "0")}-${fixture.home.toLowerCase()}-${fixture.away.toLowerCase()}`,
      tournamentId: "wc-1970",
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

export const worldCup1970: Tournament = {
  id: "wc-1970",
  competition: "WORLD_CUP",
  name: "Mexico 1970",
  year: 1970,
  hosts: ["MEX"],
  teams: worldCup1970Groups.flatMap((group) => group.teams),
  groups: worldCup1970Groups,
  teamCoordinates: worldCup1970TeamCoordinates,
  format: worldCup1970Format,
  stages: ["group", "qf", "sf", "third", "final"],
  status: "complete",
  mapView: { center: [-101.5, 22.2], zoom: 4.0, bearing: -8, pitch: 42 },
  venues,
  featuredRoute: venues.map((venue) => venue.id),
  matches
};
