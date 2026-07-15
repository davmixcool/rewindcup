import { createYoutubeHighlight } from "@/data/highlights";
import { teamNames } from "@/data/teamMetadata";
import {
  worldCup1958Format,
  worldCup1958Groups,
  worldCup1958TeamCoordinates
} from "@/data/worldCup1958Experience";
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
  { id: "rasunda-stadium", name: "Rasunda Stadium", city: "Solna", country: "SWE", coordinates: [18.0716, 59.3628], bearing: -12 },
  { id: "idrottsparken", name: "Idrottsparken", city: "Norrköping", country: "SWE", coordinates: [16.173, 58.5845], bearing: 11 },
  { id: "malmo-stadion", name: "Malmo Stadion", city: "Malmö", country: "SWE", coordinates: [13.0048, 55.5866], bearing: -14 },
  { id: "nya-ullevi", name: "Nya Ullevi", city: "Gothenburg", country: "SWE", coordinates: [11.9865, 57.7059], bearing: 14 },
  { id: "jarnvallen", name: "Jarnvallen", city: "Sandviken", country: "SWE", coordinates: [16.617, 60.619], bearing: -10 },
  { id: "orjans-vall", name: "Orjans Vall", city: "Halmstad", country: "SWE", coordinates: [12.8682, 56.6747], bearing: 12 },
  { id: "arosvallen", name: "Arosvallen", city: "Västerås", country: "SWE", coordinates: [16.53, 59.617], bearing: -13 },
  { id: "rimnersvallen", name: "Rimnersvallen", city: "Uddevalla", country: "SWE", coordinates: [11.9507, 58.354], bearing: 13 },
  { id: "ryavallen", name: "Ryavallen", city: "Borås", country: "SWE", coordinates: [12.919, 57.734], bearing: -11 },
  { id: "olympia-stadium", name: "Olympia Stadium", city: "Helsingborg", country: "SWE", coordinates: [12.706, 56.05], bearing: 11 },
  { id: "tunavallen", name: "Tunavallen", city: "Eskilstuna", country: "SWE", coordinates: [16.522, 59.372], bearing: -14 },
  { id: "eyravallen", name: "Eyravallen", city: "Örebro", country: "SWE", coordinates: [15.224, 59.266], bearing: 14 }
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

// Numbers and ordering follow FIFA's current match-centre archive for season 15.
// The three tied-group deciders remain separate group play-offs in the app.
const fixtureSeeds: FixtureSeed[] = [
  { no: 1, stage: "group", date: "1958-06-08", venueId: "rasunda-stadium", home: "SWE", away: "MEX", score: { home: 3, away: 0 } },
  { no: 3, stage: "group", date: "1958-06-08", venueId: "idrottsparken", home: "FRA", away: "PAR", score: { home: 7, away: 3 } },
  { no: 7, stage: "group", date: "1958-06-08", venueId: "malmo-stadion", home: "ARG", away: "GER", score: { home: 1, away: 3 } },
  { no: 5, stage: "group", date: "1958-06-08", venueId: "nya-ullevi", home: "URS", away: "ENG", score: { home: 2, away: 2 } },
  { no: 2, stage: "group", date: "1958-06-08", venueId: "jarnvallen", home: "HUN", away: "WAL", score: { home: 1, away: 1 } },
  { no: 8, stage: "group", date: "1958-06-08", venueId: "orjans-vall", home: "NIR", away: "TCH", score: { home: 1, away: 0 } },
  { no: 4, stage: "group", date: "1958-06-08", venueId: "arosvallen", home: "YUG", away: "SCO", score: { home: 1, away: 1 } },
  { no: 6, stage: "group", date: "1958-06-08", venueId: "rimnersvallen", home: "BRA", away: "AUT", score: { home: 3, away: 0 } },
  { no: 11, stage: "group", date: "1958-06-11", venueId: "arosvallen", home: "YUG", away: "FRA", score: { home: 3, away: 2 } },
  { no: 13, stage: "group", date: "1958-06-11", venueId: "ryavallen", home: "URS", away: "AUT", score: { home: 2, away: 0 } },
  { no: 12, stage: "group", date: "1958-06-11", venueId: "nya-ullevi", home: "BRA", away: "ENG", score: { home: 0, away: 0 } },
  { no: 14, stage: "group", date: "1958-06-11", venueId: "olympia-stadium", home: "GER", away: "TCH", score: { home: 2, away: 2 } },
  { no: 15, stage: "group", date: "1958-06-11", venueId: "orjans-vall", home: "ARG", away: "NIR", score: { home: 3, away: 1 } },
  { no: 10, stage: "group", date: "1958-06-11", venueId: "idrottsparken", home: "PAR", away: "SCO", score: { home: 3, away: 2 } },
  { no: 9, stage: "group", date: "1958-06-11", venueId: "rasunda-stadium", home: "MEX", away: "WAL", score: { home: 1, away: 1 } },
  { no: 16, stage: "group", date: "1958-06-12", venueId: "rasunda-stadium", home: "SWE", away: "HUN", score: { home: 2, away: 1 } },
  { no: 17, stage: "group", date: "1958-06-15", venueId: "rasunda-stadium", home: "SWE", away: "WAL", score: { home: 0, away: 0 } },
  { no: 19, stage: "group", date: "1958-06-15", venueId: "tunavallen", home: "PAR", away: "YUG", score: { home: 3, away: 3 } },
  { no: 24, stage: "group", date: "1958-06-15", venueId: "olympia-stadium", home: "TCH", away: "ARG", score: { home: 6, away: 1 } },
  { no: 20, stage: "group", date: "1958-06-15", venueId: "eyravallen", home: "FRA", away: "SCO", score: { home: 2, away: 1 } },
  { no: 23, stage: "group", date: "1958-06-15", venueId: "malmo-stadion", home: "GER", away: "NIR", score: { home: 2, away: 2 } },
  { no: 18, stage: "group", date: "1958-06-15", venueId: "jarnvallen", home: "HUN", away: "MEX", score: { home: 4, away: 0 } },
  { no: 21, stage: "group", date: "1958-06-15", venueId: "nya-ullevi", home: "BRA", away: "URS", score: { home: 2, away: 0 } },
  { no: 22, stage: "group", date: "1958-06-15", venueId: "ryavallen", home: "ENG", away: "AUT", score: { home: 2, away: 2 } },
  { no: 33, stage: "playoff", date: "1958-06-17", venueId: "rasunda-stadium", home: "WAL", away: "HUN", score: { home: 2, away: 1 } },
  { no: 37, stage: "playoff", date: "1958-06-17", venueId: "nya-ullevi", home: "URS", away: "ENG", score: { home: 1, away: 0 } },
  { no: 39, stage: "playoff", date: "1958-06-17", venueId: "malmo-stadion", home: "NIR", away: "TCH", score: { home: 2, away: 1 }, durationMinutes: 120, note: "Northern Ireland won after extra time." },
  { no: 28, stage: "qf", date: "1958-06-19", venueId: "malmo-stadion", home: "GER", away: "YUG", score: { home: 1, away: 0 } },
  { no: 25, stage: "qf", date: "1958-06-19", venueId: "rasunda-stadium", home: "SWE", away: "URS", score: { home: 2, away: 0 } },
  { no: 27, stage: "qf", date: "1958-06-19", venueId: "nya-ullevi", home: "BRA", away: "WAL", score: { home: 1, away: 0 } },
  { no: 26, stage: "qf", date: "1958-06-19", venueId: "idrottsparken", home: "FRA", away: "NIR", score: { home: 4, away: 0 } },
  { no: 29, stage: "sf", date: "1958-06-24", venueId: "rasunda-stadium", home: "BRA", away: "FRA", score: { home: 5, away: 2 } },
  { no: 30, stage: "sf", date: "1958-06-24", venueId: "nya-ullevi", home: "SWE", away: "GER", score: { home: 3, away: 1 } },
  { no: 31, stage: "third", date: "1958-06-28", venueId: "nya-ullevi", home: "FRA", away: "GER", score: { home: 6, away: 3 } },
  { no: 32, stage: "final", date: "1958-06-29", venueId: "rasunda-stadium", home: "BRA", away: "SWE", score: { home: 5, away: 2 } }
];

// Scorers and minute labels follow the Fjelstul World Cup Database, joined to
// FIFA's official match numbers by date and exact team pairing.
const goalsByFixture: Partial<Record<number, GoalSeed[]>> = {
  1: [[17, "SWE", "Agne Simonsson"], [57, "SWE", "Nils Liedholm", "Nils Liedholm scores from the penalty spot."], [64, "SWE", "Agne Simonsson"]],
  3: [[20, "PAR", "Florencio Amarilla"], [24, "FRA", "Just Fontaine"], [30, "FRA", "Just Fontaine"], [44, "PAR", "Florencio Amarilla", "Florencio Amarilla scores from the penalty spot."], [50, "PAR", "Jorge Lino Romero"], [52, "FRA", "Roger Piantoni"], [61, "FRA", "Maryan Wisnieski"], [67, "FRA", "Just Fontaine"], [70, "FRA", "Raymond Kopa"], [83, "FRA", "Jean Vincent"]],
  7: [[3, "ARG", "Oreste Corbatta"], [32, "GER", "Helmut Rahn"], [42, "GER", "Uwe Seeler"], [79, "GER", "Helmut Rahn"]],
  5: [[13, "URS", "Nikita Simonyan"], [56, "URS", "Aleksandr Ivanov"], [66, "ENG", "Derek Kevan"], [85, "ENG", "Tom Finney", "Tom Finney scores from the penalty spot."]],
  2: [[5, "HUN", "József Bozsik"], [27, "WAL", "John Charles"]],
  8: [[21, "NIR", "Wilbur Cush"]],
  4: [[6, "YUG", "Aleksandar Petaković"], [49, "SCO", "Jimmy Murray"]],
  6: [[37, "BRA", "José Altafini"], [50, "BRA", "Nílton Santos"], [85, "BRA", "José Altafini"]],
  11: [[4, "FRA", "Just Fontaine"], [16, "YUG", "Aleksandar Petaković"], [63, "YUG", "Todor Veselinović"], [85, "FRA", "Just Fontaine"], [88, "YUG", "Todor Veselinović"]],
  13: [[15, "URS", "Anatoli Ilyin"], [62, "URS", "Valentin Ivanov"]],
  14: [[24, "TCH", "Milan Dvořák", "Milan Dvořák scores from the penalty spot."], [42, "TCH", "Zdeněk Zikán"], [60, "GER", "Hans Schäfer"], [71, "GER", "Helmut Rahn"]],
  15: [[4, "NIR", "Peter McParland"], [37, "ARG", "Oreste Corbatta", "Oreste Corbatta scores from the penalty spot."], [56, "ARG", "Norberto Menéndez"], [60, "ARG", "Ludovico Avio"]],
  10: [[4, "PAR", "Juan Bautista Agüero"], [24, "SCO", "Jackie Mudie"], [45, "PAR", "Cayetano Ré"], [73, "PAR", "José Parodi"], [74, "SCO", "Bobby Collins"]],
  9: [[32, "WAL", "Ivor Allchurch"], [89, "MEX", "Jaime Belmonte"]],
  16: [[34, "SWE", "Kurt Hamrin"], [55, "SWE", "Kurt Hamrin"], [77, "HUN", "Lajos Tichy"]],
  19: [[18, "YUG", "Radivoje Ognjanović"], [20, "PAR", "José Parodi"], [21, "YUG", "Todor Veselinović"], [52, "PAR", "Juan Bautista Agüero"], [73, "YUG", "Zdravko Rajkov"], [80, "PAR", "Jorge Lino Romero"]],
  24: [[8, "TCH", "Milan Dvořák"], [17, "TCH", "Zdeněk Zikán"], [40, "TCH", "Zdeněk Zikán"], [65, "ARG", "Oreste Corbatta", "Oreste Corbatta scores from the penalty spot."], [69, "TCH", "Jiří Feureisl"], [82, "TCH", "Václav Hovorka"], [89, "TCH", "Václav Hovorka"]],
  20: [[22, "FRA", "Raymond Kopa"], [44, "FRA", "Just Fontaine"], [58, "SCO", "Sammy Baird"]],
  23: [[18, "NIR", "Peter McParland"], [20, "GER", "Helmut Rahn"], [60, "NIR", "Peter McParland"], [78, "GER", "Uwe Seeler"]],
  18: [[19, "HUN", "Lajos Tichy"], [46, "HUN", "Lajos Tichy"], [54, "HUN", "Károly Sándor"], [69, "HUN", "József Bencsics"]],
  21: [[3, "BRA", "Vavá"], [77, "BRA", "Vavá"]],
  22: [[15, "AUT", "Karl Koller"], [56, "ENG", "Johnny Haynes"], [71, "AUT", "Alfred Körner"], [74, "ENG", "Derek Kevan"]],
  33: [[33, "HUN", "Lajos Tichy"], [55, "WAL", "Ivor Allchurch"], [76, "WAL", "Terry Medwin"]],
  37: [[69, "URS", "Anatoli Ilyin"]],
  39: [[18, "TCH", "Zdeněk Zikán"], [44, "NIR", "Peter McParland"], [97, "NIR", "Peter McParland"]],
  28: [[12, "GER", "Helmut Rahn"]],
  25: [[49, "SWE", "Kurt Hamrin"], [88, "SWE", "Agne Simonsson"]],
  27: [[66, "BRA", "Pelé"]],
  26: [[44, "FRA", "Maryan Wisnieski"], [55, "FRA", "Just Fontaine"], [63, "FRA", "Just Fontaine"], [68, "FRA", "Roger Piantoni"]],
  29: [[2, "BRA", "Vavá"], [9, "FRA", "Just Fontaine"], [39, "BRA", "Didi"], [52, "BRA", "Pelé"], [64, "BRA", "Pelé"], [75, "BRA", "Pelé"], [83, "FRA", "Roger Piantoni"]],
  30: [[24, "GER", "Hans Schäfer"], [32, "SWE", "Lennart Skoglund"], [81, "SWE", "Gunnar Gren"], [88, "SWE", "Kurt Hamrin"]],
  31: [[16, "FRA", "Just Fontaine"], [18, "GER", "Hans Cieslarczyk"], [27, "FRA", "Raymond Kopa", "Raymond Kopa scores from the penalty spot."], [36, "FRA", "Just Fontaine"], [50, "FRA", "Yvon Douis"], [52, "GER", "Helmut Rahn"], [78, "FRA", "Just Fontaine"], [84, "GER", "Hans Schäfer"], [89, "FRA", "Just Fontaine"]],
  32: [[4, "SWE", "Nils Liedholm"], [9, "BRA", "Vavá"], [32, "BRA", "Vavá"], [55, "BRA", "Pelé"], [68, "BRA", "Mário Zagallo"], [80, "SWE", "Agne Simonsson"], [90, "BRA", "Pelé"]]
};

type YouTubeHighlightSeed = { videoId: string; sourceName: string };

// Every video matches the fixture teams and score and passed YouTube's real
// embed response with status OK and playableInEmbed=true on July 15, 2026.
const youtubeHighlightsByFixture: Record<number, YouTubeHighlightSeed> = {
  1: { videoId: "bNmw0bBbTck", sourceName: "pamemundial highlights" },
  2: { videoId: "F5YybA9ehts", sourceName: "1986soccerman highlights" },
  3: { videoId: "kBAJ_llCQE4", sourceName: "Joefa's World Cup History highlights" },
  4: { videoId: "EzN9DD3dT4s", sourceName: "Joefa's World Cup History highlights" },
  5: { videoId: "EM0JaxPQI3k", sourceName: "cestrian81 highlights" },
  6: { videoId: "tkqsxGXQRuc", sourceName: "pamemundial highlights" },
  7: { videoId: "OBG9QA8ha_c", sourceName: "World cup History highlights" },
  8: { videoId: "a8ZfcS52AnY", sourceName: "Northern Ireland Football Highlights" },
  9: { videoId: "XYOHv4UP7SU", sourceName: "1986soccerman highlights" },
  10: { videoId: "BUKdapkHKbQ", sourceName: "1986soccerman highlights" },
  11: { videoId: "qVmWoWQK2I0", sourceName: "World cup History highlights" },
  12: { videoId: "IXWHdQEFZag", sourceName: "Joefa's World Cup History highlights" },
  13: { videoId: "-kscHXzijjU", sourceName: "Joefa's World Cup History highlights" },
  14: { videoId: "8GdKCia7oYc", sourceName: "Joefa's World Cup History highlights" },
  15: { videoId: "3Z1-ZHj790s", sourceName: "1986soccerman highlights" },
  16: { videoId: "9VttKAtx92Y", sourceName: "Joefa's World Cup History highlights" },
  17: { videoId: "HVbnt3ApwLM", sourceName: "Joefa's World Cup History match film" },
  18: { videoId: "TX4VoU3VLxI", sourceName: "sp1873 highlights" },
  19: { videoId: "7BCt4yGuWyQ", sourceName: "World cup History highlights" },
  20: { videoId: "qip3RX9xU0s", sourceName: "pamemundial highlights" },
  21: { videoId: "zyDB1ssjs4k", sourceName: "World cup vintage colorized highlights" },
  22: { videoId: "kbYFxT8PvQo", sourceName: "Joefa's World Cup History highlights" },
  23: { videoId: "6l-9l2DmDFw", sourceName: "Northern Ireland Football Highlights" },
  24: { videoId: "E1F5t-G-3W4", sourceName: "1986soccerman highlights" },
  25: { videoId: "npeQxdYwvrc", sourceName: "World cup History highlights" },
  26: { videoId: "isQuLhaf26o", sourceName: "World cup History highlights" },
  27: { videoId: "bvgbin1MPF0", sourceName: "Voetballegends1 highlights" },
  28: { videoId: "aBUvla7Lr8g", sourceName: "Joefa's World Cup History highlights" },
  29: { videoId: "CMO7_qXT4so", sourceName: "bapqapmoc highlights" },
  30: { videoId: "4jwUt3vOIDo", sourceName: "World cup History highlights" },
  31: { videoId: "m7MK9ng9IbY", sourceName: "LND fOoTy Legend highlights" },
  32: { videoId: "Eb-YIfxFrMY", sourceName: "bapqapmoc highlights" },
  33: { videoId: "CFFy20SgNZ4", sourceName: "Joefa's World Cup History highlights" },
  37: { videoId: "xWxc9zVVgnU", sourceName: "World cup History highlights" },
  39: { videoId: "McmeYt85114", sourceName: "Joefa's World Cup History highlights" }
};

const fifaMatchIdsByFixture: Record<number, string> = {
  1: "1415", 3: "1386", 7: "1323", 5: "1372", 2: "1407", 8: "1421", 4: "1434", 6: "1326",
  11: "1388", 13: "1332", 12: "1339", 14: "1391", 15: "1324", 10: "1423", 9: "1418", 16: "1406",
  17: "1438", 19: "1426", 24: "1325", 20: "1387", 23: "1389", 18: "1403", 21: "1344", 22: "1327",
  33: "1408", 37: "1373", 39: "1422", 28: "1392", 25: "1437", 27: "1345", 26: "1385", 29: "1340",
  30: "1390", 31: "1382", 32: "1343"
};

const fifaStageIds: Record<Match["stage"], string> = {
  group: "220",
  playoff: "220",
  group2: "",
  r32: "",
  r16: "",
  qf: "221",
  sf: "488",
  third: "3483",
  final: "3482"
};

function getFifaMatchUrl(fixture: FixtureSeed) {
  return `https://www.fifa.com/en/match-centre/match/17/15/${fifaStageIds[fixture.stage]}/${fifaMatchIdsByFixture[fixture.no]}?date=${fixture.date}`;
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
      id: `wc-1958-${String(fixture.no).padStart(2, "0")}-${fixture.home.toLowerCase()}-${fixture.away.toLowerCase()}`,
      tournamentId: "wc-1958",
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

export const worldCup1958: Tournament = {
  id: "wc-1958",
  competition: "WORLD_CUP",
  name: "Sweden 1958",
  year: 1958,
  hosts: ["SWE"],
  teams: worldCup1958Groups.flatMap((group) => group.teams),
  groups: worldCup1958Groups,
  teamCoordinates: worldCup1958TeamCoordinates,
  format: worldCup1958Format,
  stages: ["group", "playoff", "qf", "sf", "third", "final"],
  status: "complete",
  mapView: { center: [15.2, 58.7], zoom: 4.4, bearing: -8, pitch: 42 },
  venues,
  featuredRoute: venues.map((venue) => venue.id),
  matches
};
