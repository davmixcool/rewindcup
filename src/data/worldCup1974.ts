import { createYoutubeHighlight } from "@/data/highlights";
import { teamNames } from "@/data/teamMetadata";
import {
  worldCup1974Format,
  worldCup1974Groups,
  worldCup1974SecondGroups,
  worldCup1974TeamCoordinates
} from "@/data/worldCup1974Experience";
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
  { id: "olympiastadion-berlin", name: "Olympiastadion", city: "West Berlin", country: "GER", coordinates: [13.2395, 52.5147], bearing: -16 },
  { id: "volksparkstadion", name: "Volksparkstadion", city: "Hamburg", country: "GER", coordinates: [9.8986, 53.5872], bearing: 18 },
  { id: "waldstadion", name: "Waldstadion", city: "Frankfurt", country: "GER", coordinates: [8.6454, 50.0686], bearing: -18 },
  { id: "westfalenstadion", name: "Westfalenstadion", city: "Dortmund", country: "GER", coordinates: [7.4519, 51.4926], bearing: 16 },
  { id: "niedersachsenstadion", name: "Niedersachsenstadion", city: "Hanover", country: "GER", coordinates: [9.7332, 52.36], bearing: -14 },
  { id: "rheinstadion", name: "Rheinstadion", city: "Düsseldorf", country: "GER", coordinates: [6.731, 51.2602], bearing: 14 },
  { id: "olympiastadion-munich", name: "Olympiastadion", city: "Munich", country: "GER", coordinates: [11.5467, 48.1732], bearing: -20, zoom: 16.4 },
  { id: "neckarstadion", name: "Neckarstadion", city: "Stuttgart", country: "GER", coordinates: [9.232, 48.7923], bearing: 20 },
  { id: "parkstadion", name: "Parkstadion", city: "Gelsenkirchen", country: "GER", coordinates: [7.0676, 51.559], bearing: -12 }
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

// Numbers and ordering follow FIFA's current match-centre archive for season 39.
const fixtureSeeds: FixtureSeed[] = [
  { no: 1, stage: "group", date: "1974-06-14", venueId: "olympiastadion-berlin", home: "GER", away: "CHI", score: { home: 1, away: 0 } },
  { no: 2, stage: "group", date: "1974-06-14", venueId: "volksparkstadion", home: "GDR", away: "AUS", score: { home: 2, away: 0 } },
  { no: 3, stage: "group", date: "1974-06-13", venueId: "waldstadion", home: "BRA", away: "YUG", score: { home: 0, away: 0 } },
  { no: 4, stage: "group", date: "1974-06-14", venueId: "westfalenstadion", home: "ZAI", away: "SCO", score: { home: 0, away: 2 } },
  { no: 5, stage: "group", date: "1974-06-15", venueId: "niedersachsenstadion", home: "URU", away: "NED", score: { home: 0, away: 2 } },
  { no: 6, stage: "group", date: "1974-06-15", venueId: "rheinstadion", home: "SWE", away: "BUL", score: { home: 0, away: 0 } },
  { no: 7, stage: "group", date: "1974-06-15", venueId: "olympiastadion-munich", home: "ITA", away: "HAI", score: { home: 3, away: 1 } },
  { no: 8, stage: "group", date: "1974-06-15", venueId: "neckarstadion", home: "POL", away: "ARG", score: { home: 3, away: 2 } },
  { no: 9, stage: "group", date: "1974-06-18", venueId: "olympiastadion-berlin", home: "CHI", away: "GDR", score: { home: 1, away: 1 } },
  { no: 10, stage: "group", date: "1974-06-18", venueId: "volksparkstadion", home: "AUS", away: "GER", score: { home: 0, away: 3 } },
  { no: 11, stage: "group", date: "1974-06-18", venueId: "parkstadion", home: "YUG", away: "ZAI", score: { home: 9, away: 0 } },
  { no: 12, stage: "group", date: "1974-06-18", venueId: "waldstadion", home: "SCO", away: "BRA", score: { home: 0, away: 0 } },
  { no: 13, stage: "group", date: "1974-06-19", venueId: "westfalenstadion", home: "NED", away: "SWE", score: { home: 0, away: 0 } },
  { no: 14, stage: "group", date: "1974-06-19", venueId: "niedersachsenstadion", home: "BUL", away: "URU", score: { home: 1, away: 1 } },
  { no: 15, stage: "group", date: "1974-06-19", venueId: "olympiastadion-munich", home: "HAI", away: "POL", score: { home: 0, away: 7 } },
  { no: 16, stage: "group", date: "1974-06-19", venueId: "neckarstadion", home: "ARG", away: "ITA", score: { home: 1, away: 1 } },
  { no: 17, stage: "group", date: "1974-06-22", venueId: "olympiastadion-berlin", home: "AUS", away: "CHI", score: { home: 0, away: 0 } },
  { no: 18, stage: "group", date: "1974-06-22", venueId: "volksparkstadion", home: "GDR", away: "GER", score: { home: 1, away: 0 } },
  { no: 19, stage: "group", date: "1974-06-22", venueId: "waldstadion", home: "SCO", away: "YUG", score: { home: 1, away: 1 } },
  { no: 20, stage: "group", date: "1974-06-22", venueId: "parkstadion", home: "ZAI", away: "BRA", score: { home: 0, away: 3 } },
  { no: 21, stage: "group", date: "1974-06-23", venueId: "westfalenstadion", home: "BUL", away: "NED", score: { home: 1, away: 4 } },
  { no: 22, stage: "group", date: "1974-06-23", venueId: "rheinstadion", home: "SWE", away: "URU", score: { home: 3, away: 0 } },
  { no: 23, stage: "group", date: "1974-06-23", venueId: "olympiastadion-munich", home: "ARG", away: "HAI", score: { home: 4, away: 1 } },
  { no: 24, stage: "group", date: "1974-06-23", venueId: "neckarstadion", home: "POL", away: "ITA", score: { home: 2, away: 1 } },
  { no: 25, stage: "group2", date: "1974-06-26", venueId: "niedersachsenstadion", home: "BRA", away: "GDR", score: { home: 1, away: 0 } },
  { no: 26, stage: "group2", date: "1974-06-26", venueId: "parkstadion", home: "NED", away: "ARG", score: { home: 4, away: 0 } },
  { no: 27, stage: "group2", date: "1974-06-26", venueId: "rheinstadion", home: "YUG", away: "GER", score: { home: 0, away: 2 } },
  { no: 28, stage: "group2", date: "1974-06-26", venueId: "neckarstadion", home: "SWE", away: "POL", score: { home: 0, away: 1 } },
  { no: 29, stage: "group2", date: "1974-06-30", venueId: "parkstadion", home: "GDR", away: "NED", score: { home: 0, away: 2 } },
  { no: 30, stage: "group2", date: "1974-06-30", venueId: "niedersachsenstadion", home: "ARG", away: "BRA", score: { home: 1, away: 2 } },
  { no: 31, stage: "group2", date: "1974-06-30", venueId: "rheinstadion", home: "GER", away: "SWE", score: { home: 4, away: 2 } },
  { no: 32, stage: "group2", date: "1974-06-30", venueId: "waldstadion", home: "POL", away: "YUG", score: { home: 2, away: 1 } },
  { no: 33, stage: "group2", date: "1974-07-03", venueId: "parkstadion", home: "ARG", away: "GDR", score: { home: 1, away: 1 } },
  { no: 34, stage: "group2", date: "1974-07-03", venueId: "westfalenstadion", home: "NED", away: "BRA", score: { home: 2, away: 0 } },
  { no: 35, stage: "group2", date: "1974-07-03", venueId: "waldstadion", home: "POL", away: "GER", score: { home: 0, away: 1 } },
  { no: 36, stage: "group2", date: "1974-07-03", venueId: "rheinstadion", home: "SWE", away: "YUG", score: { home: 2, away: 1 } },
  { no: 37, stage: "third", date: "1974-07-06", venueId: "olympiastadion-munich", home: "BRA", away: "POL", score: { home: 0, away: 1 } },
  { no: 38, stage: "final", date: "1974-07-07", venueId: "olympiastadion-munich", home: "NED", away: "GER", score: { home: 1, away: 2 } }
];

// Scorers and minute labels follow the Fjelstul World Cup Database, joined to
// FIFA's official match numbers by date and exact team pairing.
const goalsByFixture: Partial<Record<number, GoalSeed[]>> = {
  1: [[18, "GER", "Paul Breitner"]],
  2: [[58, "GDR", "Colin Curran", "Colin Curran scores an own goal."], [72, "GDR", "Joachim Streich"]],
  4: [[26, "SCO", "Peter Lorimer"], [34, "SCO", "Joe Jordan"]],
  5: [[7, "NED", "Johnny Rep"], [86, "NED", "Johnny Rep"]],
  7: [[46, "HAI", "Emmanuel Sanon"], [52, "ITA", "Gianni Rivera"], [66, "ITA", "Romeo Benetti"], [79, "ITA", "Pietro Anastasi"]],
  8: [[7, "POL", "Grzegorz Lato"], [8, "POL", "Andrzej Szarmach"], [60, "ARG", "Ramón Heredia"], [62, "POL", "Grzegorz Lato"], [66, "ARG", "Carlos Babington"]],
  9: [[55, "GDR", "Martin Hoffmann"], [69, "CHI", "Sergio Ahumada"]],
  10: [[12, "GER", "Wolfgang Overath"], [34, "GER", "Bernhard Cullmann"], [53, "GER", "Gerd Müller"]],
  11: [[8, "YUG", "Dušan Bajević"], [14, "YUG", "Dragan Džajić"], [18, "YUG", "Ivica Šurjak"], [22, "YUG", "Josip Katalinski"], [30, "YUG", "Dušan Bajević"], [35, "YUG", "Vladislav Bogićević"], [61, "YUG", "Branko Oblak"], [65, "YUG", "Ilija Petković"], [81, "YUG", "Dušan Bajević"]],
  14: [[75, "BUL", "Hristo Bonev"], [87, "URU", "Ricardo Pavoni"]],
  15: [[17, "POL", "Grzegorz Lato"], [18, "POL", "Kazimierz Deyna"], [30, "POL", "Andrzej Szarmach"], [31, "POL", "Jerzy Gorgoń"], [34, "POL", "Andrzej Szarmach"], [50, "POL", "Andrzej Szarmach"], [87, "POL", "Grzegorz Lato"]],
  16: [[20, "ARG", "René Houseman"], [35, "ITA", "Roberto Perfumo", "Roberto Perfumo scores an own goal."]],
  18: [[77, "GDR", "Jürgen Sparwasser"]],
  19: [[81, "YUG", "Stanislav Karasi"], [88, "SCO", "Joe Jordan"]],
  20: [[12, "BRA", "Jairzinho"], [66, "BRA", "Rivellino"], [79, "BRA", "Valdomiro"]],
  21: [[5, "NED", "Johan Neeskens", "Johan Neeskens scores from the penalty spot."], [44, "NED", "Johan Neeskens", "Johan Neeskens scores from the penalty spot."], [71, "NED", "Johnny Rep"], [78, "BUL", "Ruud Krol", "Ruud Krol scores an own goal."], [88, "NED", "Theo de Jong"]],
  22: [[46, "SWE", "Ralf Edström"], [74, "SWE", "Roland Sandberg"], [77, "SWE", "Ralf Edström"]],
  23: [[15, "ARG", "Héctor Yazalde"], [18, "ARG", "René Houseman"], [55, "ARG", "Rubén Ayala"], [63, "HAI", "Emmanuel Sanon"], [68, "ARG", "Héctor Yazalde"]],
  24: [[38, "POL", "Andrzej Szarmach"], [44, "POL", "Kazimierz Deyna"], [85, "ITA", "Fabio Capello"]],
  25: [[60, "BRA", "Rivellino"]],
  26: [[11, "NED", "Johan Cruyff"], [25, "NED", "Ruud Krol"], [73, "NED", "Johnny Rep"], [90, "NED", "Johan Cruyff"]],
  27: [[39, "GER", "Paul Breitner"], [82, "GER", "Gerd Müller"]],
  28: [[43, "POL", "Grzegorz Lato"]],
  29: [[7, "NED", "Johan Neeskens"], [59, "NED", "Rob Rensenbrink"]],
  30: [[32, "BRA", "Rivellino"], [35, "ARG", "Miguel Ángel Brindisi"], [49, "BRA", "Jairzinho"]],
  31: [[24, "SWE", "Ralf Edström"], [51, "GER", "Wolfgang Overath"], [52, "GER", "Rainer Bonhof"], [53, "SWE", "Roland Sandberg"], [76, "GER", "Jürgen Grabowski"], [89, "GER", "Uli Hoeneß", "Uli Hoeneß scores from the penalty spot."]],
  32: [[24, "POL", "Kazimierz Deyna", "Kazimierz Deyna scores from the penalty spot."], [43, "YUG", "Stanislav Karasi"], [62, "POL", "Grzegorz Lato"]],
  33: [[14, "GDR", "Joachim Streich"], [20, "ARG", "René Houseman"]],
  34: [[50, "NED", "Johan Neeskens"], [65, "NED", "Johan Cruyff"]],
  35: [[76, "GER", "Gerd Müller"]],
  36: [[27, "YUG", "Ivica Šurjak"], [29, "SWE", "Ralf Edström"], [85, "SWE", "Conny Torstensson"]],
  37: [[76, "POL", "Grzegorz Lato"]],
  38: [[2, "NED", "Johan Neeskens", "Johan Neeskens scores from the penalty spot."], [25, "GER", "Paul Breitner", "Paul Breitner scores from the penalty spot."], [43, "GER", "Gerd Müller"]]
};

type YouTubeHighlightSeed = { videoId: string; sourceName: string };

// Every video matches the fixture teams and score and passed YouTube's real
// embed response with status OK and playableInEmbed=true on July 13, 2026.
const youtubeHighlightsByFixture: Record<number, YouTubeHighlightSeed> = {
  1: { videoId: "HAkGsX1t2L0", sourceName: "Football Flashback 6 highlights" },
  2: { videoId: "SifjZRYNFug", sourceName: "Mr Soccer highlights" },
  3: { videoId: "avrOH4RN1ug", sourceName: "Football Flashback 6 highlights" },
  4: { videoId: "2YD8wjJj-s0", sourceName: "LND fOoTy Legend highlights" },
  5: { videoId: "pgkQgaNis6U", sourceName: "Football Flashback 6 highlights" },
  6: { videoId: "q-FB6GJdwV8", sourceName: "Mr Soccer highlights" },
  7: { videoId: "FcosakSIHHA", sourceName: "Sancheznews highlights" },
  8: { videoId: "DxB9kdYZdbA", sourceName: "Football Flashback 6 highlights" },
  9: { videoId: "xofDhN__H60", sourceName: "Estadio Legendario highlights" },
  10: { videoId: "4Vv7bFW61sE", sourceName: "LND fOoTy Legend highlights" },
  11: { videoId: "mNAM7B4M_7Q", sourceName: "LND fOoTy Legend highlights" },
  12: { videoId: "YJNyZWWIqaw", sourceName: "Football Flashback 6 highlights" },
  13: { videoId: "YqoSfDPbTj8", sourceName: "Football Highlights" },
  14: { videoId: "1a5zPaDgOCY", sourceName: "LND fOoTy Legend highlights" },
  15: { videoId: "D4XSBpj-Lfg", sourceName: "LND fOoTy Legend highlights" },
  16: { videoId: "SJsrkvVlu_k", sourceName: "Football Flashback 6 highlights" },
  17: { videoId: "CFc45Me_If8", sourceName: "sp1873 highlights" },
  18: { videoId: "__gt7yZGG_Y", sourceName: "LND fOoTy Legend highlights" },
  19: { videoId: "a_CsNB2e-bE", sourceName: "Football Flashback 6 highlights" },
  20: { videoId: "3mfLggNEuQY", sourceName: "LND fOoTy Legend highlights" },
  21: { videoId: "X624TVxpkU0", sourceName: "LND fOoTy Legend highlights" },
  22: { videoId: "jxFvdjz3eMA", sourceName: "LND fOoTy Legend highlights" },
  23: { videoId: "ZX0N3Tz_Ym0", sourceName: "LND fOoTy Legend highlights" },
  24: { videoId: "D2yVSWVQDDI", sourceName: "LND fOoTy Legend highlights" },
  25: { videoId: "8rZXdqNG_6w", sourceName: "Football Flashback 6 highlights" },
  26: { videoId: "vv8QWLjFwzI", sourceName: "Football Flashback 6 highlights" },
  27: { videoId: "ABVzpxd1-q4", sourceName: "LND fOoTy Legend highlights" },
  28: { videoId: "9ouc1PoxHL0", sourceName: "sp1873 highlights" },
  29: { videoId: "keCfYahmS8M", sourceName: "Football Flashback 6 highlights" },
  30: { videoId: "cDzThE67GFY", sourceName: "Football Flashback 6 highlights" },
  31: { videoId: "-2wRbuS8uM8", sourceName: "Football Flashback 6 highlights" },
  32: { videoId: "rB6hnXC5byk", sourceName: "sp1873 highlights" },
  33: { videoId: "JUUgAegoEEA", sourceName: "sp1873 highlights" },
  34: { videoId: "Tvt8WaCFPv4", sourceName: "Football Flashback 6 highlights" },
  35: { videoId: "gTVqaAKZVeU", sourceName: "AgliKatchor highlights" },
  36: { videoId: "N2_jnEZt0WU", sourceName: "LND fOoTy Legend highlights" },
  37: { videoId: "XhGwRjDrJ6c", sourceName: "Football Flashback 6 highlights" },
  38: { videoId: "KpUCKi4yvuU", sourceName: "LegendFootballForAll highlights" }
};

const fifaMatchIdsByFixture: Record<number, string> = {
  1: "2003", 2: "1955", 3: "1986", 4: "2176", 5: "2098", 6: "1995",
  7: "2083", 8: "1952", 9: "2004", 10: "1954", 11: "2186", 12: "1985",
  13: "2097", 14: "1996", 15: "2085", 16: "1949", 17: "1953", 18: "2062",
  19: "2175", 20: "1987", 21: "1990", 22: "2181", 23: "1947", 24: "2129",
  25: "1982", 26: "1948", 27: "2066", 28: "2167", 29: "2067", 30: "1945",
  31: "2065", 32: "2170", 33: "1946", 34: "1983", 35: "2064", 36: "2182",
  37: "1984", 38: "2063"
};

function getFifaStageId(no: number) {
  if (no <= 24) return "262";
  if (no <= 36) return "263";
  if (no === 37) return "264";
  return "605";
}

function getFifaMatchUrl(fixture: FixtureSeed) {
  return `https://www.fifa.com/en/match-centre/match/17/39/${getFifaStageId(fixture.no)}/${fifaMatchIdsByFixture[fixture.no]}?date=${fixture.date}`;
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
      id: `wc-1974-${String(fixture.no).padStart(2, "0")}-${fixture.home.toLowerCase()}-${fixture.away.toLowerCase()}`,
      tournamentId: "wc-1974",
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

export const worldCup1974: Tournament = {
  id: "wc-1974",
  competition: "WORLD_CUP",
  name: "West Germany 1974",
  year: 1974,
  hosts: ["GER"],
  teams: worldCup1974Groups.flatMap((group) => group.teams),
  groups: worldCup1974Groups,
  secondGroups: worldCup1974SecondGroups,
  teamCoordinates: worldCup1974TeamCoordinates,
  format: worldCup1974Format,
  stages: ["group", "group2", "third", "final"],
  status: "complete",
  mapView: { center: [9.8, 51.2], zoom: 4.65, bearing: -7, pitch: 42 },
  venues,
  featuredRoute: venues.map((venue) => venue.id),
  matches
};
