import { teamNames } from "@/data/teamMetadata";
import { createOfficialReportHighlight, createYoutubeHighlight } from "@/data/highlights";
import {
  worldCup1994Format,
  worldCup1994Groups,
  worldCup1994TeamCoordinates
} from "@/data/worldCup1994Experience";
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
  shootout?: Score;
  durationMinutes?: 90 | 120;
  note?: string;
};

const venueSeeds: VenueSeed[] = [
  { id: "soldier-field", name: "Soldier Field", city: "Chicago", country: "USA", coordinates: [-87.6167, 41.8623], bearing: -18, zoom: 16.5 },
  { id: "cotton-bowl", name: "Cotton Bowl", city: "Dallas", country: "USA", coordinates: [-96.7597, 32.7797], bearing: 18 },
  { id: "pontiac-silverdome", name: "Pontiac Silverdome", city: "Pontiac", country: "USA", coordinates: [-83.2551, 42.6458], bearing: -20 },
  { id: "giants-stadium", name: "Giants Stadium", city: "East Rutherford", country: "USA", coordinates: [-74.0758, 40.8128], bearing: 20 },
  { id: "rose-bowl", name: "Rose Bowl", city: "Pasadena", country: "USA", coordinates: [-118.1676, 34.1613], bearing: -14, zoom: 16.5 },
  { id: "citrus-bowl", name: "Citrus Bowl", city: "Orlando", country: "USA", coordinates: [-81.4028, 28.5392], bearing: 16 },
  { id: "rfk-stadium", name: "RFK Stadium", city: "Washington, D.C.", country: "USA", coordinates: [-76.9717, 38.8897], bearing: -22 },
  { id: "stanford-stadium", name: "Stanford Stadium", city: "Stanford", country: "USA", coordinates: [-122.1611, 37.4345], bearing: 22 },
  { id: "foxboro-stadium", name: "Foxboro Stadium", city: "Foxborough", country: "USA", coordinates: [-71.2665, 42.0909], bearing: -24 }
];

const venues: Venue[] = venueSeeds.map((venue) => ({
  ...venue,
  stadiumView: {
    center: venue.coordinates,
    zoom: venue.zoom ?? 16.35,
    bearing: venue.bearing ?? -12,
    pitch: venue.pitch ?? 64
  }
}));

// Numbering follows the tournament's official final match schedule, not a
// pure kickoff-time sort. The simultaneous final group games numbered 25-26,
// 29-30, 33-34 and 35-36 are the important differences from some databases.
const fixtureSeeds: FixtureSeed[] = [
  { no: 1, stage: "group", date: "1994-06-17", venueId: "soldier-field", home: "GER", away: "BOL", score: { home: 1, away: 0 } },
  { no: 2, stage: "group", date: "1994-06-17", venueId: "cotton-bowl", home: "ESP", away: "KOR", score: { home: 2, away: 2 } },
  { no: 3, stage: "group", date: "1994-06-18", venueId: "pontiac-silverdome", home: "USA", away: "SUI", score: { home: 1, away: 1 } },
  { no: 4, stage: "group", date: "1994-06-18", venueId: "giants-stadium", home: "ITA", away: "IRL", score: { home: 0, away: 1 } },
  { no: 5, stage: "group", date: "1994-06-18", venueId: "rose-bowl", home: "COL", away: "ROU", score: { home: 1, away: 3 } },
  { no: 6, stage: "group", date: "1994-06-19", venueId: "citrus-bowl", home: "BEL", away: "MAR", score: { home: 1, away: 0 } },
  { no: 7, stage: "group", date: "1994-06-19", venueId: "rfk-stadium", home: "NOR", away: "MEX", score: { home: 1, away: 0 } },
  { no: 8, stage: "group", date: "1994-06-19", venueId: "rose-bowl", home: "CMR", away: "SWE", score: { home: 2, away: 2 } },
  { no: 9, stage: "group", date: "1994-06-20", venueId: "stanford-stadium", home: "BRA", away: "RUS", score: { home: 2, away: 0 } },
  { no: 10, stage: "group", date: "1994-06-20", venueId: "rfk-stadium", home: "NED", away: "KSA", score: { home: 2, away: 1 } },
  { no: 11, stage: "group", date: "1994-06-21", venueId: "foxboro-stadium", home: "ARG", away: "GRE", score: { home: 4, away: 0 } },
  { no: 12, stage: "group", date: "1994-06-21", venueId: "soldier-field", home: "GER", away: "ESP", score: { home: 1, away: 1 } },
  { no: 13, stage: "group", date: "1994-06-21", venueId: "cotton-bowl", home: "NGA", away: "BUL", score: { home: 3, away: 0 } },
  { no: 14, stage: "group", date: "1994-06-22", venueId: "pontiac-silverdome", home: "ROU", away: "SUI", score: { home: 1, away: 4 } },
  { no: 15, stage: "group", date: "1994-06-22", venueId: "rose-bowl", home: "USA", away: "COL", score: { home: 2, away: 1 } },
  { no: 16, stage: "group", date: "1994-06-23", venueId: "giants-stadium", home: "ITA", away: "NOR", score: { home: 1, away: 0 } },
  { no: 17, stage: "group", date: "1994-06-23", venueId: "foxboro-stadium", home: "KOR", away: "BOL", score: { home: 0, away: 0 } },
  { no: 18, stage: "group", date: "1994-06-24", venueId: "citrus-bowl", home: "MEX", away: "IRL", score: { home: 2, away: 1 } },
  { no: 19, stage: "group", date: "1994-06-24", venueId: "stanford-stadium", home: "BRA", away: "CMR", score: { home: 3, away: 0 } },
  { no: 20, stage: "group", date: "1994-06-24", venueId: "pontiac-silverdome", home: "SWE", away: "RUS", score: { home: 3, away: 1 } },
  { no: 21, stage: "group", date: "1994-06-25", venueId: "citrus-bowl", home: "BEL", away: "NED", score: { home: 1, away: 0 } },
  { no: 22, stage: "group", date: "1994-06-25", venueId: "giants-stadium", home: "KSA", away: "MAR", score: { home: 2, away: 1 } },
  { no: 23, stage: "group", date: "1994-06-25", venueId: "foxboro-stadium", home: "ARG", away: "NGA", score: { home: 2, away: 1 } },
  { no: 24, stage: "group", date: "1994-06-26", venueId: "soldier-field", home: "BUL", away: "GRE", score: { home: 4, away: 0 } },
  { no: 25, stage: "group", date: "1994-06-26", venueId: "rose-bowl", home: "USA", away: "ROU", score: { home: 0, away: 1 } },
  { no: 26, stage: "group", date: "1994-06-26", venueId: "stanford-stadium", home: "SUI", away: "COL", score: { home: 0, away: 2 } },
  { no: 27, stage: "group", date: "1994-06-27", venueId: "soldier-field", home: "BOL", away: "ESP", score: { home: 1, away: 3 } },
  { no: 28, stage: "group", date: "1994-06-27", venueId: "cotton-bowl", home: "GER", away: "KOR", score: { home: 3, away: 2 } },
  { no: 29, stage: "group", date: "1994-06-28", venueId: "giants-stadium", home: "IRL", away: "NOR", score: { home: 0, away: 0 } },
  { no: 30, stage: "group", date: "1994-06-28", venueId: "rfk-stadium", home: "ITA", away: "MEX", score: { home: 1, away: 1 } },
  { no: 31, stage: "group", date: "1994-06-28", venueId: "stanford-stadium", home: "RUS", away: "CMR", score: { home: 6, away: 1 } },
  { no: 32, stage: "group", date: "1994-06-28", venueId: "pontiac-silverdome", home: "BRA", away: "SWE", score: { home: 1, away: 1 } },
  { no: 33, stage: "group", date: "1994-06-29", venueId: "citrus-bowl", home: "MAR", away: "NED", score: { home: 1, away: 2 } },
  { no: 34, stage: "group", date: "1994-06-29", venueId: "rfk-stadium", home: "BEL", away: "KSA", score: { home: 0, away: 1 } },
  { no: 35, stage: "group", date: "1994-06-30", venueId: "foxboro-stadium", home: "GRE", away: "NGA", score: { home: 0, away: 2 } },
  { no: 36, stage: "group", date: "1994-06-30", venueId: "cotton-bowl", home: "ARG", away: "BUL", score: { home: 0, away: 2 } },
  { no: 37, stage: "r16", date: "1994-07-02", venueId: "soldier-field", home: "GER", away: "BEL", score: { home: 3, away: 2 } },
  { no: 38, stage: "r16", date: "1994-07-02", venueId: "rfk-stadium", home: "ESP", away: "SUI", score: { home: 3, away: 0 } },
  { no: 39, stage: "r16", date: "1994-07-03", venueId: "cotton-bowl", home: "KSA", away: "SWE", score: { home: 1, away: 3 } },
  { no: 40, stage: "r16", date: "1994-07-03", venueId: "rose-bowl", home: "ROU", away: "ARG", score: { home: 3, away: 2 } },
  { no: 41, stage: "r16", date: "1994-07-04", venueId: "citrus-bowl", home: "NED", away: "IRL", score: { home: 2, away: 0 } },
  { no: 42, stage: "r16", date: "1994-07-04", venueId: "stanford-stadium", home: "BRA", away: "USA", score: { home: 1, away: 0 } },
  { no: 43, stage: "r16", date: "1994-07-05", venueId: "foxboro-stadium", home: "NGA", away: "ITA", score: { home: 1, away: 2 }, durationMinutes: 120, note: "After extra time" },
  { no: 44, stage: "r16", date: "1994-07-05", venueId: "giants-stadium", home: "MEX", away: "BUL", score: { home: 1, away: 1 }, shootout: { home: 1, away: 3 }, durationMinutes: 120, note: "Bulgaria won 3-1 on penalties" },
  { no: 45, stage: "qf", date: "1994-07-09", venueId: "foxboro-stadium", home: "ITA", away: "ESP", score: { home: 2, away: 1 } },
  { no: 46, stage: "qf", date: "1994-07-09", venueId: "cotton-bowl", home: "NED", away: "BRA", score: { home: 2, away: 3 } },
  { no: 47, stage: "qf", date: "1994-07-10", venueId: "giants-stadium", home: "BUL", away: "GER", score: { home: 2, away: 1 } },
  { no: 48, stage: "qf", date: "1994-07-10", venueId: "stanford-stadium", home: "ROU", away: "SWE", score: { home: 2, away: 2 }, shootout: { home: 4, away: 5 }, durationMinutes: 120, note: "Sweden won 5-4 on penalties" },
  { no: 49, stage: "sf", date: "1994-07-13", venueId: "giants-stadium", home: "BUL", away: "ITA", score: { home: 1, away: 2 } },
  { no: 50, stage: "sf", date: "1994-07-13", venueId: "rose-bowl", home: "SWE", away: "BRA", score: { home: 0, away: 1 } },
  { no: 51, stage: "third", date: "1994-07-16", venueId: "rose-bowl", home: "SWE", away: "BUL", score: { home: 4, away: 0 } },
  { no: 52, stage: "final", date: "1994-07-17", venueId: "rose-bowl", home: "BRA", away: "ITA", score: { home: 0, away: 0 }, shootout: { home: 3, away: 2 }, durationMinutes: 120, note: "Brazil won 3-2 on penalties" }
];

// Scorers and minute labels follow the Fjelstul World Cup Database and are
// remapped above to the official match numbers. Shootout kicks are excluded.
// Added-time goals retain the regulation minute for replay ordering.
const goalsByFixture: Partial<Record<number, GoalSeed[]>> = {
  1: [[61, "GER", "Jürgen Klinsmann"]],
  2: [[51, "ESP", "Julio Salinas"], [55, "ESP", "Andoni Goikoetxea"], [85, "KOR", "Hong Myung-bo"], [90, "KOR", "Seo Jung-won"]],
  3: [[39, "SUI", "Georges Bregy"], [44, "USA", "Eric Wynalda"]],
  4: [[11, "IRL", "Ray Houghton"]],
  5: [[15, "ROU", "Florin Răducioiu"], [34, "ROU", "Gheorghe Hagi"], [43, "COL", "Adolfo Valencia"], [89, "ROU", "Florin Răducioiu"]],
  6: [[11, "BEL", "Marc Degryse"]],
  7: [[84, "NOR", "Kjetil Rekdal"]],
  8: [[8, "SWE", "Roger Ljung"], [31, "CMR", "David Embé"], [47, "CMR", "François Omam-Biyik"], [75, "SWE", "Martin Dahlin"]],
  9: [[26, "BRA", "Romário"], [52, "BRA", "Raí", "Raí scores from the penalty spot."]],
  10: [[18, "KSA", "Fuad Anwar"], [50, "NED", "Wim Jonk"], [86, "NED", "Gaston Taument"]],
  11: [[2, "ARG", "Gabriel Batistuta"], [44, "ARG", "Gabriel Batistuta"], [60, "ARG", "Diego Maradona"], [90, "ARG", "Gabriel Batistuta", "Gabriel Batistuta scores from the penalty spot."]],
  12: [[14, "ESP", "Andoni Goikoetxea"], [48, "GER", "Jürgen Klinsmann"]],
  13: [[21, "NGA", "Rashidi Yekini"], [43, "NGA", "Daniel Amokachi"], [55, "NGA", "Emmanuel Amunike"]],
  14: [[16, "SUI", "Alain Sutter"], [35, "ROU", "Gheorghe Hagi"], [52, "SUI", "Stéphane Chapuisat"], [65, "SUI", "Adrian Knup"], [72, "SUI", "Adrian Knup"]],
  15: [[35, "USA", "Andrés Escobar own goal", "Andrés Escobar turns the ball into his own net."], [52, "USA", "Earnie Stewart"], [90, "COL", "Adolfo Valencia"]],
  16: [[69, "ITA", "Dino Baggio"]],
  18: [[42, "MEX", "Luis García"], [65, "MEX", "Luis García"], [84, "IRL", "John Aldridge"]],
  19: [[39, "BRA", "Romário"], [66, "BRA", "Márcio Santos"], [73, "BRA", "Bebeto"]],
  20: [[4, "RUS", "Oleg Salenko", "Oleg Salenko scores from the penalty spot."], [39, "SWE", "Tomas Brolin", "Tomas Brolin scores from the penalty spot."], [60, "SWE", "Martin Dahlin"], [82, "SWE", "Martin Dahlin"]],
  21: [[65, "BEL", "Philippe Albert"]],
  22: [[7, "KSA", "Sami Al-Jaber", "Sami Al-Jaber scores from the penalty spot."], [26, "MAR", "Mohammed Chaouch"], [45, "KSA", "Fuad Anwar"]],
  23: [[8, "NGA", "Samson Siasia"], [21, "ARG", "Claudio Caniggia"], [28, "ARG", "Claudio Caniggia"]],
  24: [[5, "BUL", "Hristo Stoichkov", "Hristo Stoichkov scores from the penalty spot."], [55, "BUL", "Hristo Stoichkov", "Hristo Stoichkov scores from the penalty spot."], [65, "BUL", "Yordan Letchkov"], [90, "BUL", "Daniel Borimirov"]],
  25: [[18, "ROU", "Dan Petrescu"]],
  26: [[44, "COL", "Hernán Gaviria"], [90, "COL", "John Harold Lozano"]],
  27: [[19, "ESP", "Josep Guardiola", "Josep Guardiola scores from the penalty spot."], [66, "ESP", "José Luis Caminero"], [67, "BOL", "Erwin Sánchez"], [70, "ESP", "José Luis Caminero"]],
  28: [[12, "GER", "Jürgen Klinsmann"], [20, "GER", "Karl-Heinz Riedle"], [37, "GER", "Jürgen Klinsmann"], [52, "KOR", "Hwang Sun-hong"], [63, "KOR", "Hong Myung-bo"]],
  30: [[48, "ITA", "Daniele Massaro"], [57, "MEX", "Marcelino Bernal"]],
  31: [[15, "RUS", "Oleg Salenko"], [41, "RUS", "Oleg Salenko"], [44, "RUS", "Oleg Salenko", "Oleg Salenko scores from the penalty spot."], [46, "CMR", "Roger Milla"], [72, "RUS", "Oleg Salenko"], [75, "RUS", "Oleg Salenko"], [81, "RUS", "Dmitri Radchenko"]],
  32: [[23, "SWE", "Kennet Andersson"], [47, "BRA", "Romário"]],
  33: [[43, "NED", "Dennis Bergkamp"], [47, "MAR", "Hassan Nader"], [77, "NED", "Bryan Roy"]],
  34: [[5, "KSA", "Saeed Al-Owairan"]],
  35: [[45, "NGA", "Finidi George", "Finidi George scores in first-half stoppage time."], [90, "NGA", "Daniel Amokachi", "Daniel Amokachi scores in second-half stoppage time."]],
  36: [[61, "BUL", "Hristo Stoichkov"], [90, "BUL", "Nasko Sirakov", "Nasko Sirakov scores in second-half stoppage time."]],
  37: [[6, "GER", "Rudi Völler"], [8, "BEL", "Georges Grün"], [11, "GER", "Jürgen Klinsmann"], [38, "GER", "Rudi Völler"], [90, "BEL", "Philippe Albert"]],
  38: [[15, "ESP", "Fernando Hierro"], [74, "ESP", "Luis Enrique"], [86, "ESP", "Txiki Begiristain", "Txiki Begiristain scores from the penalty spot."]],
  39: [[6, "SWE", "Martin Dahlin"], [51, "SWE", "Kennet Andersson"], [85, "KSA", "Fahad Al-Ghesheyan"], [88, "SWE", "Kennet Andersson"]],
  40: [[11, "ROU", "Ilie Dumitrescu"], [16, "ARG", "Gabriel Batistuta", "Gabriel Batistuta scores from the penalty spot."], [18, "ROU", "Ilie Dumitrescu"], [58, "ROU", "Gheorghe Hagi"], [75, "ARG", "Abel Balbo"]],
  41: [[11, "NED", "Dennis Bergkamp"], [41, "NED", "Wim Jonk"]],
  42: [[72, "BRA", "Bebeto"]],
  43: [[25, "NGA", "Emmanuel Amunike"], [88, "ITA", "Roberto Baggio"], [102, "ITA", "Roberto Baggio", "Roberto Baggio scores from the penalty spot."]],
  44: [[6, "BUL", "Hristo Stoichkov"], [18, "MEX", "Alberto García Aspe", "Alberto García Aspe scores from the penalty spot."]],
  45: [[25, "ITA", "Dino Baggio"], [58, "ESP", "José Luis Caminero"], [88, "ITA", "Roberto Baggio"]],
  46: [[53, "BRA", "Romário"], [63, "BRA", "Bebeto"], [64, "NED", "Dennis Bergkamp"], [76, "NED", "Aron Winter"], [81, "BRA", "Branco"]],
  47: [[47, "GER", "Lothar Matthäus", "Lothar Matthäus scores from the penalty spot."], [75, "BUL", "Hristo Stoichkov"], [78, "BUL", "Yordan Letchkov"]],
  48: [[78, "SWE", "Tomas Brolin"], [88, "ROU", "Florin Răducioiu"], [101, "ROU", "Florin Răducioiu"], [115, "SWE", "Kennet Andersson"]],
  49: [[21, "ITA", "Roberto Baggio"], [25, "ITA", "Roberto Baggio"], [44, "BUL", "Hristo Stoichkov", "Hristo Stoichkov scores from the penalty spot."]],
  50: [[80, "BRA", "Romário"]],
  51: [[8, "SWE", "Tomas Brolin"], [30, "SWE", "Håkan Mild"], [37, "SWE", "Henrik Larsson"], [39, "SWE", "Kennet Andersson"]]
};

type YouTubeHighlightSeed = {
  videoId: string;
  sourceName: string;
};

// Keys follow FIFA's published schedule rather than chronological database
// ordering. Every selection was checked against the teams and score and passed
// YouTube's real embed response with status OK and playableInEmbed=true.
const youtubeHighlightsByFixture: Record<number, YouTubeHighlightSeed> = {
  1: { videoId: "pPipLOxbXJ4", sourceName: "Mr Soccer highlights" },
  2: { videoId: "QYC6UqZ2x_w", sourceName: "Global Goal Pulse highlights" },
  3: { videoId: "BIQwUrVVL2E", sourceName: "Mr Soccer highlights" },
  4: { videoId: "-0EmKwn1PiQ", sourceName: "Football Flashback 6 highlights" },
  5: { videoId: "AXqkvGBPWWU", sourceName: "Caderno de Esportes highlights" },
  6: { videoId: "z9VDl-TqsYA", sourceName: "sp1873 highlights" },
  7: { videoId: "QNcxtUj2_6A", sourceName: "ST highlights" },
  8: { videoId: "Z0GZh3F3g_8", sourceName: "Football Flashback 6 highlights" },
  9: { videoId: "Wyx6-jV0Pzg", sourceName: "elregioenatlanta1 highlights" },
  10: { videoId: "KZiBzN1MmvY", sourceName: "Glory Of Oranje highlights" },
  11: { videoId: "trvSvgaHxRg", sourceName: "STEC highlights" },
  12: { videoId: "vZHAPU_y7eg", sourceName: "LegendFootballForAll highlights" },
  13: { videoId: "0WYAGj0oztU", sourceName: "Football Flashback 6 highlights" },
  14: { videoId: "2SPvwJM-jis", sourceName: "HistoryFull Worldcup highlights" },
  15: { videoId: "ZdWGDq2eooU", sourceName: "Sport Root highlights" },
  16: { videoId: "tHEoikSmXlc", sourceName: "sp1873 highlights" },
  17: { videoId: "PhGmfrbUWTk", sourceName: "HistoryFull Worldcup highlights" },
  18: { videoId: "hv0D2JBoBNo", sourceName: "HistoryFull Worldcup highlights" },
  19: { videoId: "Re6bIv_dbC8", sourceName: "Mr Soccer highlights" },
  20: { videoId: "8dgv4toc3jA", sourceName: "Nikolay Pavlov highlights" },
  21: { videoId: "KR_ec5zZBj8", sourceName: "HistoryFull Worldcup highlights" },
  22: { videoId: "i5Qzr-Bph1E", sourceName: "HistoryFull Worldcup highlights" },
  23: { videoId: "k3DgKYlezpg", sourceName: "Caderno de Esportes highlights" },
  24: { videoId: "XJnNevyaDV8", sourceName: "HistoryFull Worldcup highlights" },
  25: { videoId: "Z3o5i542MxU", sourceName: "HistoryFull Worldcup highlights" },
  26: { videoId: "585soMdUt-k", sourceName: "HistoryFull Worldcup highlights" },
  27: { videoId: "Z3RozHHEuxw", sourceName: "HistoryFull Worldcup highlights" },
  28: { videoId: "XqvKgOO2BY4", sourceName: "HistoryFull Worldcup highlights" },
  29: { videoId: "HVPmp-fEW4M", sourceName: "Irelandfootballarchive highlights" },
  30: { videoId: "B_6_IS-jbb0", sourceName: "Football Flashback 6 highlights" },
  31: { videoId: "S6IOnEZyTEI", sourceName: "Crossbar TV highlights" },
  32: { videoId: "WPYvsebMAmc", sourceName: "Football Flashback 6 highlights" },
  33: { videoId: "PkTAe68vGOk", sourceName: "Goles Mundiales highlights" },
  34: { videoId: "JCs_Maw9n2A", sourceName: "Football Flashback 6 highlights" },
  35: { videoId: "JF315fN4tKk", sourceName: "HistoryFull Worldcup highlights" },
  36: { videoId: "5u5QsJNVAAo", sourceName: "HistoryFull Worldcup highlights" },
  37: { videoId: "BkizC_lWch8", sourceName: "LegendFootballForAll highlights" },
  38: { videoId: "ZD8Efwyo5hs", sourceName: "HistoryFull Worldcup highlights" },
  39: { videoId: "tax0GKzj6Uc", sourceName: "Caderno de Esportes highlights" },
  40: { videoId: "mjMQj6cnIb8", sourceName: "Football Flashback 6 highlights" },
  41: { videoId: "Qrbp1zBm_Sc", sourceName: "Football Flashback 6 highlights" },
  42: { videoId: "RlJw_AT9KRM", sourceName: "HistoryFull Worldcup highlights" },
  43: { videoId: "YuvNo8Y3GRQ", sourceName: "VintageHDtv highlights" },
  44: { videoId: "5RcY-yfcQ0o", sourceName: "Football Flashback 6 highlights" },
  45: { videoId: "aQ9yiAGqfm0", sourceName: "VintageHDtv2 highlights" },
  46: { videoId: "HgwnzxrJJM4", sourceName: "Football Flashback 6 highlights" },
  47: { videoId: "BN7UL37zVl4", sourceName: "EPL 77 highlights" },
  48: { videoId: "a7FUuoM636o", sourceName: "Football Flashback 6 highlights" },
  49: { videoId: "j6w5PKKH-oM", sourceName: "Coloraturas Magellan Project highlights" },
  50: { videoId: "jfoICeVsyKY", sourceName: "Football Flashback 6 highlights" },
  51: { videoId: "EcE842FxpQk", sourceName: "Football Flashback 6 highlights" },
  52: { videoId: "g6Zi32X1u1Q", sourceName: "fifa tv online highlights" }
};

// FIFA's archive uses internal match and round IDs. These current routes were
// checked against the team pairing shown on each official report page.
const fifaMatchIdsByFixture: Record<number, string> = {
  1: "3049", 2: "3050", 3: "3051", 4: "3052", 5: "3053", 6: "3054",
  7: "3055", 8: "3056", 9: "3057", 10: "3058", 11: "3059", 12: "3060",
  13: "3061", 14: "3062", 15: "3063", 16: "3064", 17: "3065", 18: "3066",
  19: "3067", 20: "3068", 21: "3069", 22: "3070", 23: "3071", 24: "3072",
  25: "3073", 26: "3074", 27: "3075", 28: "3076", 29: "3077", 30: "3078",
  31: "3079", 32: "3080", 33: "3081", 34: "3082", 35: "3083", 36: "3084",
  37: "3085", 38: "3086", 39: "3087", 40: "3088", 41: "3089", 42: "3090",
  43: "3091", 44: "3092", 45: "3097", 46: "3098", 47: "3096", 48: "3095",
  49: "3100", 50: "3099", 51: "3103", 52: "3104"
};

function getFifaRoundId(no: number) {
  if (no <= 36) return "337";
  if (no <= 44) return "338";
  if (no <= 48) return "796";
  if (no <= 50) return "3461";
  if (no === 51) return "3460";
  return "3459";
}

function getFifaMatchUrl(fixture: FixtureSeed) {
  const roundId = getFifaRoundId(fixture.no);
  const matchId = fifaMatchIdsByFixture[fixture.no];
  return `https://www.fifa.com/en/match-centre/match/17/84/${roundId}/${matchId}?date=${fixture.date}`;
}

function getHighlights(fixture: FixtureSeed): MatchHighlights {
  const officialUrl = getFifaMatchUrl(fixture);
  const youtube = youtubeHighlightsByFixture[fixture.no];

  return youtube
    ? createYoutubeHighlight(youtube.videoId, officialUrl, youtube.sourceName)
    : createOfficialReportHighlight(officialUrl);
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
    {
      id: "kickoff",
      minute: 0,
      type: "kickoff",
      detail: `${teamNames[fixture.home]} and ${teamNames[fixture.away]} kick off at ${venue}.`,
      scoreAfter: { home: 0, away: 0 }
    },
    ...goalEvents.filter((event) => event.minute !== null && event.minute <= 45),
    {
      id: "half-time",
      minute: 45,
      type: "half_time",
      detail: `Half-time at ${venue}.`,
      scoreAfter: halftimeScore
    },
    ...goalEvents.filter((event) => event.minute !== null && event.minute > 45),
    {
      id: "full-time",
      minute: fullTimeMinute,
      type: "full_time",
      detail: `Full time. ${resultDetail}`,
      scoreAfter: fixture.score
    },
    {
      id: "result",
      minute: null,
      type: "result",
      detail: resultDetail,
      scoreAfter: fixture.score
    }
  ];
}

const matches: Match[] = fixtureSeeds
  .map((fixture) => {
    const highlights = getHighlights(fixture);

    return {
      id: `wc-1994-${String(fixture.no).padStart(2, "0")}-${fixture.home.toLowerCase()}-${fixture.away.toLowerCase()}`,
      tournamentId: "wc-1994",
      stage: fixture.stage,
      date: fixture.date,
      venueId: fixture.venueId,
      venue: getVenueName(fixture.venueId),
      home: fixture.home,
      away: fixture.away,
      score: fixture.score,
      shootout: fixture.shootout ?? null,
      events: createEvents(fixture),
      highlights,
      highlightUrl: highlights.directUrl ?? highlights.officialUrl,
      highlightEmbeddable: highlights.embeddable
    };
  })
  .sort((left, right) => left.date.localeCompare(right.date) || left.id.localeCompare(right.id));

export const worldCup1994: Tournament = {
  id: "wc-1994",
  competition: "WORLD_CUP",
  name: "USA 1994",
  year: 1994,
  hosts: ["USA"],
  teams: worldCup1994Groups.flatMap((group) => group.teams),
  groups: worldCup1994Groups,
  teamCoordinates: worldCup1994TeamCoordinates,
  format: worldCup1994Format,
  stages: ["group", "r16", "qf", "sf", "third", "final"],
  status: "complete",
  mapView: {
    center: [-98.6, 38.2],
    zoom: 2.85,
    bearing: -8,
    pitch: 42
  },
  venues,
  featuredRoute: venues.map((venue) => venue.id),
  matches
};
