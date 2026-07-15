import { createYoutubeHighlight } from "@/data/highlights";
import { teamNames } from "@/data/teamMetadata";
import {
  worldCup1938Field,
  worldCup1938Format,
  worldCup1938TeamCoordinates
} from "@/data/worldCup1938Experience";
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
  { id: "parc-des-princes", name: "Parc des Princes", city: "Paris", country: "FRA", coordinates: [2.253, 48.8414], bearing: -12 },
  { id: "velodrome-municipale", name: "Velodrome Municipale", city: "Reims", country: "FRA", coordinates: [4.0242, 49.2466], bearing: 12 },
  { id: "stade-olympique", name: "Stade Olympique", city: "Colombes", country: "FRA", coordinates: [2.2476, 48.9297], bearing: -14 },
  { id: "stade-velodrome", name: "Stade Vélodrome", city: "Marseille", country: "FRA", coordinates: [5.3959, 43.2698], bearing: 14 },
  { id: "stade-de-toulouse", name: "Stade de Toulouse", city: "Toulouse", country: "FRA", coordinates: [1.434, 43.599], bearing: -11 },
  { id: "stade-de-la-meinau", name: "Stade de la Meinau", city: "Strasbourg", country: "FRA", coordinates: [7.7549, 48.5601], bearing: 11 },
  { id: "cavee-verte", name: "Cavee Verte", city: "Le Havre", country: "FRA", coordinates: [0.1716, 49.5017], bearing: -13 },
  { id: "victor-boucquey", name: "Victor Boucquey", city: "Lille", country: "FRA", coordinates: [3.0476, 50.626], bearing: 13 },
  { id: "stade-de-bordeaux", name: "Stade de Bordeaux", city: "Bordeaux", country: "FRA", coordinates: [-0.5981, 44.8293], bearing: -10 },
  { id: "fort-carree", name: "Fort Carree", city: "Antibes", country: "FRA", coordinates: [7.1227, 43.5893], bearing: 10 }
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

// Numbers and ordering follow FIFA's current match-centre archive for season 5.
// Sweden advanced directly to the quarter-finals after Austria withdrew. Drawn
// knockout ties were replayed in full because penalty shoot-outs did not exist.
const fixtureSeeds: FixtureSeed[] = [
  { no: 1, stage: "r16", date: "1938-06-04", venueId: "parc-des-princes", home: "SUI", away: "GER", score: { home: 1, away: 1 }, durationMinutes: 120, note: "Match finished after extra time and required a replay." },
  { no: 2, stage: "r16", date: "1938-06-05", venueId: "velodrome-municipale", home: "HUN", away: "DEI", score: { home: 6, away: 0 } },
  { no: 3, stage: "r16", date: "1938-06-05", venueId: "stade-olympique", home: "FRA", away: "BEL", score: { home: 3, away: 1 } },
  { no: 4, stage: "r16", date: "1938-06-05", venueId: "stade-de-toulouse", home: "CUB", away: "ROU", score: { home: 3, away: 3 }, durationMinutes: 120, note: "Match finished after extra time and required a replay." },
  { no: 5, stage: "r16", date: "1938-06-05", venueId: "stade-velodrome", home: "ITA", away: "NOR", score: { home: 2, away: 1 }, durationMinutes: 120, note: "Italy won after extra time." },
  { no: 6, stage: "r16", date: "1938-06-05", venueId: "stade-de-la-meinau", home: "BRA", away: "POL", score: { home: 6, away: 5 }, durationMinutes: 120, note: "Brazil won after extra time." },
  { no: 7, stage: "r16", date: "1938-06-05", venueId: "cavee-verte", home: "TCH", away: "NED", score: { home: 3, away: 0 }, durationMinutes: 120, note: "Czechoslovakia won after extra time." },
  { no: 8, stage: "r16", stageLabel: "First-round replay", date: "1938-06-09", venueId: "stade-de-toulouse", home: "CUB", away: "ROU", score: { home: 2, away: 1 } },
  { no: 9, stage: "r16", stageLabel: "First-round replay", date: "1938-06-09", venueId: "parc-des-princes", home: "SUI", away: "GER", score: { home: 4, away: 2 } },
  { no: 10, stage: "qf", date: "1938-06-12", venueId: "stade-de-bordeaux", home: "BRA", away: "TCH", score: { home: 1, away: 1 }, durationMinutes: 120, note: "Match finished after extra time and required a replay." },
  { no: 11, stage: "qf", date: "1938-06-12", venueId: "victor-boucquey", home: "HUN", away: "SUI", score: { home: 2, away: 0 } },
  { no: 12, stage: "qf", date: "1938-06-12", venueId: "fort-carree", home: "SWE", away: "CUB", score: { home: 8, away: 0 } },
  { no: 13, stage: "qf", date: "1938-06-12", venueId: "stade-olympique", home: "ITA", away: "FRA", score: { home: 3, away: 1 } },
  { no: 14, stage: "qf", stageLabel: "Quarter-final replay", date: "1938-06-14", venueId: "stade-de-bordeaux", home: "BRA", away: "TCH", score: { home: 2, away: 1 } },
  { no: 15, stage: "sf", date: "1938-06-16", venueId: "parc-des-princes", home: "HUN", away: "SWE", score: { home: 5, away: 1 } },
  { no: 16, stage: "sf", date: "1938-06-16", venueId: "stade-velodrome", home: "ITA", away: "BRA", score: { home: 2, away: 1 } },
  { no: 17, stage: "third", date: "1938-06-19", venueId: "stade-de-bordeaux", home: "BRA", away: "SWE", score: { home: 4, away: 2 } },
  { no: 18, stage: "final", date: "1938-06-19", venueId: "stade-olympique", home: "ITA", away: "HUN", score: { home: 4, away: 2 } }
];

// Scorers and minute labels follow the Fjelstul World Cup Database, joined to
// FIFA's official match sequence by date and exact team pairing.
const goalsByFixture: Partial<Record<number, GoalSeed[]>> = {
  1: [[29, "GER", "Josef Gauchel"], [43, "SUI", "André Abegglen"]],
  2: [[13, "HUN", "Vilmos Kohut"], [15, "HUN", "Géza Toldi"], [28, "HUN", "György Sárosi"], [35, "HUN", "Gyula Zsengellér"], [76, "HUN", "Gyula Zsengellér"], [89, "HUN", "György Sárosi"]],
  3: [[1, "FRA", "Émile Veinante"], [16, "FRA", "Jean Nicolas"], [38, "BEL", "Hendrik Isemborghs"], [69, "FRA", "Jean Nicolas"]],
  4: [[35, "ROU", "Silviu Bindea"], [44, "CUB", "Héctor Socorro"], [69, "CUB", "José Magriñá"], [88, "ROU", "Iuliu Baratky"], [103, "CUB", "Héctor Socorro"], [105, "ROU", "Ștefan Dobay"]],
  5: [[2, "ITA", "Pietro Ferraris"], [83, "NOR", "Arne Brustad"], [94, "ITA", "Silvio Piola"]],
  6: [[18, "BRA", "Leônidas"], [23, "POL", "Fryderyk Scherfke", "Fryderyk Scherfke scores from the penalty spot."], [25, "BRA", "Romeu"], [44, "BRA", "Perácio"], [53, "POL", "Ernst Wilimowski"], [59, "POL", "Ernst Wilimowski"], [71, "BRA", "Perácio"], [89, "POL", "Ernst Wilimowski"], [93, "BRA", "Leônidas"], [104, "BRA", "Leônidas"], [118, "POL", "Ernst Wilimowski"]],
  7: [[93, "TCH", "Josef Košťálek"], [111, "TCH", "Josef Zeman"], [118, "TCH", "Oldřich Nejedlý"]],
  8: [[35, "ROU", "Ștefan Dobay"], [51, "CUB", "Héctor Socorro"], [57, "CUB", "Tomás Fernández"]],
  9: [[8, "GER", "Wilhelm Hahnemann"], [22, "GER", "Ernst Lörtscher", "Ernst Lörtscher scores an own goal."], [42, "SUI", "Eugen Walaschek"], [64, "SUI", "Alfred Bickel"], [75, "SUI", "André Abegglen"], [78, "SUI", "André Abegglen"]],
  10: [[30, "BRA", "Leônidas"], [65, "TCH", "Oldřich Nejedlý", "Oldřich Nejedlý scores from the penalty spot."]],
  11: [[40, "HUN", "György Sárosi"], [89, "HUN", "Gyula Zsengellér"]],
  12: [[9, "SWE", "Harry Andersson"], [22, "SWE", "Gustav Wetterström"], [37, "SWE", "Gustav Wetterström"], [44, "SWE", "Gustav Wetterström"], [80, "SWE", "Tore Keller"], [81, "SWE", "Harry Andersson"], [84, "SWE", "Arne Nyberg"], [89, "SWE", "Harry Andersson"]],
  13: [[9, "ITA", "Gino Colaussi"], [10, "FRA", "Oscar Heisserer"], [51, "ITA", "Silvio Piola"], [72, "ITA", "Silvio Piola"]],
  14: [[25, "TCH", "Vlastimil Kopecký"], [57, "BRA", "Leônidas"], [62, "BRA", "Roberto"]],
  15: [[1, "SWE", "Arne Nyberg"], [19, "HUN", "Sven Jacobsson", "Sven Jacobsson scores an own goal."], [37, "HUN", "Pál Titkos"], [39, "HUN", "Gyula Zsengellér"], [65, "HUN", "György Sárosi"], [85, "HUN", "Gyula Zsengellér"]],
  16: [[51, "ITA", "Gino Colaussi"], [60, "ITA", "Giuseppe Meazza", "Giuseppe Meazza scores from the penalty spot."], [87, "BRA", "Romeu"]],
  17: [[28, "SWE", "Sven Jonasson"], [38, "SWE", "Arne Nyberg"], [44, "BRA", "Romeu"], [63, "BRA", "Leônidas"], [74, "BRA", "Leônidas"], [80, "BRA", "Perácio"]],
  18: [[6, "ITA", "Gino Colaussi"], [8, "HUN", "Pál Titkos"], [16, "ITA", "Silvio Piola"], [35, "ITA", "Gino Colaussi"], [70, "HUN", "György Sárosi"], [82, "ITA", "Silvio Piola"]]
};

type YouTubeHighlightSeed = { videoId: string; sourceName: string };

// Every video matches the fixture teams and score and passed YouTube's real
// embed response with status OK and playableInEmbed=true on July 15, 2026.
const youtubeHighlightsByFixture: Record<number, YouTubeHighlightSeed> = {
  1: { videoId: "ux6LwHV5g_Q", sourceName: "Joefa's World Cup History highlights" },
  2: { videoId: "ySJvb6Fqv2s", sourceName: "Joefa's World Cup History highlights" },
  3: { videoId: "IHdLy-cr59I", sourceName: "Joefa's World Cup History highlights" },
  4: { videoId: "GUXQdAfHVzc", sourceName: "Joefa's World Cup History highlights" },
  5: { videoId: "wlVB0IZp8HU", sourceName: "Joefa's World Cup History highlights" },
  6: { videoId: "tB-_NVPUZQM", sourceName: "Joefa's World Cup History highlights" },
  7: { videoId: "Wg68fU2SKWY", sourceName: "Joefa's World Cup History highlights" },
  8: { videoId: "IkaC9-WWDPI", sourceName: "Joefa's World Cup History highlights" },
  9: { videoId: "3gu2Dnuvsa4", sourceName: "Joefa's World Cup History highlights" },
  10: { videoId: "xFeU86eSuHw", sourceName: "Joefa's World Cup History highlights" },
  11: { videoId: "_By-gI04k7A", sourceName: "Joefa's World Cup History highlights" },
  12: { videoId: "Lgxg_ldmlDE", sourceName: "EL FANTASMA DE LA PATERNIDAD 1891 highlights" },
  13: { videoId: "xy8IWUsdrMA", sourceName: "Joefa's World Cup History highlights" },
  14: { videoId: "RFDX0lTQA4E", sourceName: "Joefa's World Cup History highlights" },
  15: { videoId: "qgPiUojqcnQ", sourceName: "Joefa's World Cup History highlights" },
  16: { videoId: "QMySmgKxGwU", sourceName: "Joefa's World Cup History highlights" },
  17: { videoId: "ABGSAcPXe8k", sourceName: "Joefa's World Cup History highlights" },
  18: { videoId: "T7yPYHL0JZI", sourceName: "1986soccerman highlights" }
};

const fifaMatchIdsByFixture: Record<number, string> = {
  1: "1165", 2: "1173", 3: "1146", 4: "1156", 5: "1179", 6: "1150", 7: "1172", 8: "1157", 9: "1166",
  10: "1152", 11: "1175", 12: "1158", 13: "1164", 14: "1153", 15: "1176", 16: "1149", 17: "1151", 18: "1174"
};

const fifaStageIds: Record<Match["stage"], string> = {
  group: "",
  playoff: "",
  group2: "",
  r32: "",
  r16: "206",
  qf: "429",
  sf: "3489",
  third: "3488",
  final: "3487"
};

function getFifaMatchUrl(fixture: FixtureSeed) {
  return `https://www.fifa.com/en/match-centre/match/17/5/${fifaStageIds[fixture.stage]}/${fifaMatchIdsByFixture[fixture.no]}?date=${fixture.date}`;
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
      id: `wc-1938-${String(fixture.no).padStart(2, "0")}-${fixture.home.toLowerCase()}-${fixture.away.toLowerCase()}`,
      tournamentId: "wc-1938",
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

export const worldCup1938: Tournament = {
  id: "wc-1938",
  competition: "WORLD_CUP",
  name: "France 1938",
  year: 1938,
  hosts: ["FRA"],
  teams: worldCup1938Field.flatMap((group) => group.teams),
  groups: worldCup1938Field,
  teamCoordinates: worldCup1938TeamCoordinates,
  format: worldCup1938Format,
  stages: ["r16", "qf", "sf", "third", "final"],
  stageLabels: { r16: "First round" },
  teamFinishes: {
    ITA: "Champion",
    HUN: "Runner-up",
    BRA: "Third place",
    SWE: "Fourth place"
  },
  status: "complete",
  mapView: { center: [2.2, 46.5], zoom: 5.2, bearing: -8, pitch: 42 },
  venues,
  featuredRoute: venues.map((venue) => venue.id),
  matches
};
