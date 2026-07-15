import { createYoutubeHighlight } from "@/data/highlights";
import { teamNames } from "@/data/teamMetadata";
import {
  worldCup1954Format,
  worldCup1954Groups,
  worldCup1954TeamCoordinates
} from "@/data/worldCup1954Experience";
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
  durationMinutes?: 120;
  note?: string;
};

const venueSeeds: VenueSeed[] = [
  { id: "hardturm", name: "Hardturm", city: "Zürich", country: "SUI", coordinates: [8.5047, 47.393], bearing: -12 },
  { id: "charmilles", name: "Charmilles", city: "Geneva", country: "SUI", coordinates: [6.1169, 46.2097], bearing: 12 },
  { id: "la-pontaise", name: "La Pontaise", city: "Lausanne", country: "SUI", coordinates: [6.6245, 46.5331], bearing: -14 },
  { id: "stade-de-suisse", name: "Stade de Suisse", city: "Bern", country: "SUI", coordinates: [7.4653, 46.963], bearing: 14 },
  { id: "st-jakob-park", name: "St. Jakob-Park", city: "Basel", country: "SUI", coordinates: [7.6202, 47.5416], bearing: -11 },
  { id: "comunale-di-cornaredo", name: "Comunale di Cornaredo", city: "Lugano", country: "SUI", coordinates: [8.9614, 46.0235], bearing: 11 }
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

// Numbers and ordering follow FIFA's current match-centre archive for season 9.
// FIFA leaves the two tied-group play-offs unnumbered, so they use the local
// stable identifiers 25 and 26 while retaining their official archive links.
const fixtureSeeds: FixtureSeed[] = [
  { no: 2, stage: "group", date: "1954-06-16", venueId: "hardturm", home: "AUT", away: "SCO", score: { home: 1, away: 0 } },
  { no: 3, stage: "group", date: "1954-06-16", venueId: "charmilles", home: "BRA", away: "MEX", score: { home: 5, away: 0 } },
  { no: 4, stage: "group", date: "1954-06-16", venueId: "la-pontaise", home: "YUG", away: "FRA", score: { home: 1, away: 0 } },
  { no: 1, stage: "group", date: "1954-06-16", venueId: "stade-de-suisse", home: "URU", away: "TCH", score: { home: 2, away: 0 } },
  { no: 7, stage: "group", date: "1954-06-17", venueId: "la-pontaise", home: "SUI", away: "ITA", score: { home: 2, away: 1 } },
  { no: 8, stage: "group", date: "1954-06-17", venueId: "hardturm", home: "HUN", away: "KOR", score: { home: 9, away: 0 } },
  { no: 5, stage: "group", date: "1954-06-17", venueId: "stade-de-suisse", home: "GER", away: "TUR", score: { home: 4, away: 1 } },
  { no: 6, stage: "group", date: "1954-06-17", venueId: "st-jakob-park", home: "ENG", away: "BEL", score: { home: 4, away: 4 }, durationMinutes: 120, note: "Match finished after extra time." },
  { no: 12, stage: "group", date: "1954-06-19", venueId: "st-jakob-park", home: "URU", away: "SCO", score: { home: 7, away: 0 } },
  { no: 10, stage: "group", date: "1954-06-19", venueId: "la-pontaise", home: "BRA", away: "YUG", score: { home: 1, away: 1 }, durationMinutes: 120, note: "Match finished after extra time." },
  { no: 9, stage: "group", date: "1954-06-19", venueId: "hardturm", home: "AUT", away: "TCH", score: { home: 5, away: 0 } },
  { no: 11, stage: "group", date: "1954-06-19", venueId: "charmilles", home: "FRA", away: "MEX", score: { home: 3, away: 2 } },
  { no: 14, stage: "group", date: "1954-06-20", venueId: "st-jakob-park", home: "HUN", away: "GER", score: { home: 8, away: 3 } },
  { no: 15, stage: "group", date: "1954-06-20", venueId: "charmilles", home: "TUR", away: "KOR", score: { home: 7, away: 0 } },
  { no: 16, stage: "group", date: "1954-06-20", venueId: "comunale-di-cornaredo", home: "ITA", away: "BEL", score: { home: 4, away: 1 } },
  { no: 13, stage: "group", date: "1954-06-20", venueId: "stade-de-suisse", home: "ENG", away: "SUI", score: { home: 2, away: 0 } },
  { no: 25, stage: "playoff", date: "1954-06-23", venueId: "hardturm", home: "GER", away: "TUR", score: { home: 7, away: 2 } },
  { no: 26, stage: "playoff", date: "1954-06-23", venueId: "st-jakob-park", home: "SUI", away: "ITA", score: { home: 4, away: 1 } },
  { no: 19, stage: "qf", date: "1954-06-26", venueId: "la-pontaise", home: "AUT", away: "SUI", score: { home: 7, away: 5 } },
  { no: 20, stage: "qf", date: "1954-06-26", venueId: "st-jakob-park", home: "URU", away: "ENG", score: { home: 4, away: 2 } },
  { no: 17, stage: "qf", date: "1954-06-27", venueId: "charmilles", home: "GER", away: "YUG", score: { home: 2, away: 0 } },
  { no: 18, stage: "qf", date: "1954-06-27", venueId: "stade-de-suisse", home: "HUN", away: "BRA", score: { home: 4, away: 2 } },
  { no: 21, stage: "sf", date: "1954-06-30", venueId: "st-jakob-park", home: "GER", away: "AUT", score: { home: 6, away: 1 } },
  { no: 22, stage: "sf", date: "1954-06-30", venueId: "la-pontaise", home: "HUN", away: "URU", score: { home: 4, away: 2 }, durationMinutes: 120, note: "Match finished after extra time." },
  { no: 23, stage: "third", date: "1954-07-03", venueId: "hardturm", home: "AUT", away: "URU", score: { home: 3, away: 1 } },
  { no: 24, stage: "final", date: "1954-07-04", venueId: "stade-de-suisse", home: "GER", away: "HUN", score: { home: 3, away: 2 } }
];

// Scorers and minute labels follow the Fjelstul World Cup Database, joined to
// FIFA's official match sequence by date and exact team pairing.
const goalsByFixture: Partial<Record<number, GoalSeed[]>> = {
  2: [[33, "AUT", "Erich Probst"]],
  3: [[23, "BRA", "Baltazar"], [30, "BRA", "Didi"], [34, "BRA", "Pinga"], [43, "BRA", "Pinga"], [69, "BRA", "Julinho"]],
  4: [[15, "YUG", "Miloš Milutinović"]],
  1: [[71, "URU", "Oscar Míguez"], [84, "URU", "Juan Alberto Schiaffino"]],
  7: [[18, "SUI", "Robert Ballaman"], [44, "ITA", "Giampiero Boniperti"], [78, "SUI", "Josef Hügi"]],
  8: [[12, "HUN", "Ferenc Puskás"], [18, "HUN", "Mihály Lantos"], [24, "HUN", "Sándor Kocsis"], [36, "HUN", "Sándor Kocsis"], [50, "HUN", "Sándor Kocsis"], [59, "HUN", "Zoltán Czibor"], [75, "HUN", "Péter Palotás"], [83, "HUN", "Péter Palotás"], [89, "HUN", "Ferenc Puskás"]],
  5: [[2, "TUR", "Suat Mamat"], [14, "GER", "Hans Schäfer"], [52, "GER", "Bernhard Klodt"], [60, "GER", "Ottmar Walter"], [84, "GER", "Max Morlock"]],
  6: [[5, "BEL", "Léopold Anoul"], [26, "ENG", "Ivor Broadis"], [36, "ENG", "Nat Lofthouse"], [63, "ENG", "Ivor Broadis"], [67, "BEL", "Henri Coppens"], [71, "BEL", "Léopold Anoul"], [91, "ENG", "Nat Lofthouse"], [94, "BEL", "Jimmy Dickinson", "Jimmy Dickinson scores an own goal."]],
  12: [[17, "URU", "Carlos Borges"], [30, "URU", "Oscar Míguez"], [47, "URU", "Carlos Borges"], [54, "URU", "Julio Abbadie"], [57, "URU", "Carlos Borges"], [83, "URU", "Oscar Míguez"], [85, "URU", "Julio Abbadie"]],
  10: [[48, "YUG", "Branko Zebec"], [69, "BRA", "Didi"]],
  9: [[3, "AUT", "Ernst Stojaspal"], [4, "AUT", "Erich Probst"], [21, "AUT", "Erich Probst"], [24, "AUT", "Erich Probst"], [65, "AUT", "Ernst Stojaspal"]],
  11: [[19, "FRA", "Jean Vincent"], [46, "FRA", "Raúl Cárdenas", "Raúl Cárdenas scores an own goal."], [54, "MEX", "José Luis Lamadrid"], [85, "MEX", "Tomás Balcázar"], [88, "FRA", "Raymond Kopa", "Raymond Kopa scores from the penalty spot."]],
  14: [[3, "HUN", "Sándor Kocsis"], [17, "HUN", "Ferenc Puskás"], [21, "HUN", "Sándor Kocsis"], [25, "GER", "Alfred Pfaff"], [52, "HUN", "Nándor Hidegkuti"], [54, "HUN", "Nándor Hidegkuti"], [69, "HUN", "Sándor Kocsis"], [75, "HUN", "József Tóth"], [77, "GER", "Helmut Rahn"], [78, "HUN", "Sándor Kocsis"], [84, "GER", "Richard Herrmann"]],
  15: [[10, "TUR", "Suat Mamat"], [24, "TUR", "Lefter Küçükandonyadis"], [30, "TUR", "Suat Mamat"], [37, "TUR", "Burhan Sargun"], [64, "TUR", "Burhan Sargun"], [70, "TUR", "Burhan Sargun"], [76, "TUR", "Erol Keskin"]],
  16: [[41, "ITA", "Egisto Pandolfini", "Egisto Pandolfini scores from the penalty spot."], [48, "ITA", "Carlo Galli"], [58, "ITA", "Amleto Frignani"], [78, "ITA", "Benito Lorenzi"], [81, "BEL", "Léopold Anoul"]],
  13: [[43, "ENG", "Jimmy Mullen"], [69, "ENG", "Dennis Wilshaw"]],
  25: [[7, "GER", "Ottmar Walter"], [12, "GER", "Hans Schäfer"], [21, "TUR", "Mustafa Ertan"], [30, "GER", "Max Morlock"], [60, "GER", "Max Morlock"], [62, "GER", "Fritz Walter"], [77, "GER", "Max Morlock"], [79, "GER", "Hans Schäfer"], [82, "TUR", "Lefter Küçükandonyadis"]],
  26: [[14, "SUI", "Josef Hügi"], [48, "SUI", "Robert Ballaman"], [67, "ITA", "Fulvio Nesti"], [85, "SUI", "Josef Hügi"], [90, "SUI", "Jacques Fatton"]],
  19: [[16, "SUI", "Robert Ballaman"], [17, "SUI", "Josef Hügi"], [19, "SUI", "Josef Hügi"], [25, "AUT", "Theodor Wagner"], [26, "AUT", "Alfred Körner"], [27, "AUT", "Theodor Wagner"], [32, "AUT", "Ernst Ocwirk"], [34, "AUT", "Alfred Körner"], [39, "SUI", "Robert Ballaman"], [53, "AUT", "Theodor Wagner"], [60, "SUI", "Josef Hügi"], [76, "AUT", "Erich Probst"]],
  20: [[5, "URU", "Carlos Borges"], [16, "ENG", "Nat Lofthouse"], [39, "URU", "Obdulio Varela"], [46, "URU", "Juan Alberto Schiaffino"], [67, "ENG", "Tom Finney"], [78, "URU", "Javier Ambrois"]],
  17: [[9, "GER", "Ivica Horvat", "Ivica Horvat scores an own goal."], [85, "GER", "Helmut Rahn"]],
  18: [[4, "HUN", "Nándor Hidegkuti"], [7, "HUN", "Sándor Kocsis"], [18, "BRA", "Djalma Santos", "Djalma Santos scores from the penalty spot."], [60, "HUN", "Mihály Lantos", "Mihály Lantos scores from the penalty spot."], [65, "BRA", "Julinho"], [88, "HUN", "Sándor Kocsis"]],
  21: [[31, "GER", "Hans Schäfer"], [47, "GER", "Max Morlock"], [51, "AUT", "Erich Probst"], [54, "GER", "Fritz Walter", "Fritz Walter scores from the penalty spot."], [61, "GER", "Ottmar Walter"], [64, "GER", "Fritz Walter", "Fritz Walter scores from the penalty spot."], [89, "GER", "Ottmar Walter"]],
  22: [[13, "HUN", "Zoltán Czibor"], [46, "HUN", "Nándor Hidegkuti"], [75, "URU", "Juan Hohberg"], [86, "URU", "Juan Hohberg"], [111, "HUN", "Sándor Kocsis"], [116, "HUN", "Sándor Kocsis"]],
  23: [[16, "AUT", "Ernst Stojaspal", "Ernst Stojaspal scores from the penalty spot."], [22, "URU", "Juan Hohberg"], [59, "AUT", "Luis Cruz", "Luis Cruz scores an own goal."], [89, "AUT", "Ernst Ocwirk"]],
  24: [[6, "HUN", "Ferenc Puskás"], [8, "HUN", "Zoltán Czibor"], [10, "GER", "Max Morlock"], [18, "GER", "Helmut Rahn"], [84, "GER", "Helmut Rahn"]]
};

type YouTubeHighlightSeed = { videoId: string; sourceName: string };

// Every video matches the fixture teams and score and passed YouTube's real
// embed response with status OK and playableInEmbed=true on July 15, 2026.
const youtubeHighlightsByFixture: Record<number, YouTubeHighlightSeed> = {
  1: { videoId: "af4BQU3HbhA", sourceName: "World cup History highlights" },
  2: { videoId: "pAwZb5j9lwE", sourceName: "1986soccerman highlights" },
  3: { videoId: "4ud9afgmWvg", sourceName: "Mulderre highlights" },
  4: { videoId: "IpM119cRxuU", sourceName: "World cup History highlights" },
  5: { videoId: "b_it6dAkdZY", sourceName: "World cup History highlights" },
  6: { videoId: "GdkmtvQdqRk", sourceName: "World cup History highlights" },
  7: { videoId: "fLhCBC7EqiU", sourceName: "Joefa's World Cup History highlights" },
  8: { videoId: "2BLzQ_YOywM", sourceName: "Joefa's World Cup History highlights" },
  9: { videoId: "e3V346_kiv8", sourceName: "A. Cosín highlights" },
  10: { videoId: "aRhJoqZZt9o", sourceName: "World cup History highlights" },
  11: { videoId: "zuWMGGrP58A", sourceName: "World cup History highlights" },
  12: { videoId: "Ob-QL2noc0o", sourceName: "World cup History highlights" },
  13: { videoId: "40RV8ko3bUg", sourceName: "World cup History highlights" },
  14: { videoId: "RxNmUybVzqg", sourceName: "sp1873 highlights" },
  15: { videoId: "ao2nSUtAHt0", sourceName: "World cup History highlights" },
  16: { videoId: "VkzpssCAFkk", sourceName: "Joefa's World Cup History highlights" },
  17: { videoId: "UMWwcy-3WMU", sourceName: "World cup History highlights" },
  18: { videoId: "uX_04MhiDTA", sourceName: "eljaygee82 highlights" },
  19: { videoId: "T-BQWvSyIyI", sourceName: "World cup History highlights" },
  20: { videoId: "4SPr7jo_JXk", sourceName: "World cup History highlights" },
  21: { videoId: "nhQVEhOtCbc", sourceName: "World cup History highlights" },
  22: { videoId: "Hwvr0Rzy81M", sourceName: "World cup History highlights" },
  23: { videoId: "Gw1Ba_F2IAc", sourceName: "sp1873 highlights" },
  24: { videoId: "E4zup8Oy5Ck", sourceName: "British Movietone highlights" },
  25: { videoId: "ujMExsCPtzk", sourceName: "World cup History highlights" },
  26: { videoId: "S11lGSZj_yE", sourceName: "World cup History highlights" }
};

const fifaMatchIdsByFixture: Record<number, string> = {
  2: "1236", 3: "1249", 4: "1276", 1: "1315", 7: "1300", 8: "1294", 5: "1283", 6: "1240",
  12: "1313", 10: "1252", 9: "1238", 11: "1275", 14: "1277", 15: "1304", 16: "1243", 13: "1263",
  25: "1284", 26: "1301", 19: "1237", 20: "1264", 17: "1285", 18: "1248", 21: "1233", 22: "1295",
  23: "1239", 24: "1278"
};

const fifaStageIds: Record<Match["stage"], string> = {
  group: "211",
  playoff: "211",
  group2: "",
  r32: "",
  r16: "",
  qf: "212",
  sf: "462",
  third: "3485",
  final: "3484"
};

function getFifaMatchUrl(fixture: FixtureSeed) {
  return `https://www.fifa.com/en/match-centre/match/17/9/${fifaStageIds[fixture.stage]}/${fifaMatchIdsByFixture[fixture.no]}?date=${fixture.date}`;
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
      id: `wc-1954-${String(fixture.no).padStart(2, "0")}-${fixture.home.toLowerCase()}-${fixture.away.toLowerCase()}`,
      tournamentId: "wc-1954",
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

export const worldCup1954: Tournament = {
  id: "wc-1954",
  competition: "WORLD_CUP",
  name: "Switzerland 1954",
  year: 1954,
  hosts: ["SUI"],
  teams: worldCup1954Groups.flatMap((group) => group.teams),
  groups: worldCup1954Groups,
  teamCoordinates: worldCup1954TeamCoordinates,
  format: worldCup1954Format,
  stages: ["group", "playoff", "qf", "sf", "third", "final"],
  status: "complete",
  mapView: { center: [8.2, 46.9], zoom: 6.2, bearing: -8, pitch: 42 },
  venues,
  featuredRoute: venues.map((venue) => venue.id),
  matches
};
