import { createOfficialReportHighlight, createYoutubeHighlight } from "@/data/highlights";
import { teamNames } from "@/data/teamMetadata";
import {
  worldCup1986Format,
  worldCup1986Groups,
  worldCup1986TeamCoordinates
} from "@/data/worldCup1986Experience";
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
  { id: "estadio-azteca", name: "Estadio Azteca", city: "Mexico City", country: "MEX", coordinates: [-99.1505, 19.3029], bearing: -14, zoom: 16.35 },
  { id: "estadio-jalisco", name: "Estadio Jalisco", city: "Guadalajara", country: "MEX", coordinates: [-103.3234, 20.705], bearing: 18 },
  { id: "estadio-nou-camp", name: "Estadio Nou Camp", city: "León", country: "MEX", coordinates: [-101.6576, 21.1152], bearing: -18 },
  { id: "estadio-olimpico-universitario", name: "Estadio Olímpico Universitario", city: "Mexico City", country: "MEX", coordinates: [-99.1924, 19.332], bearing: 16 },
  { id: "estadio-sergio-leon-chavez", name: "Estadio Sergio León Chávez", city: "Irapuato", country: "MEX", coordinates: [-101.3505, 20.6764], bearing: -20 },
  { id: "estadio-universitario", name: "Estadio Universitario", city: "San Nicolás de los Garza", country: "MEX", coordinates: [-100.311, 25.7223], bearing: 20 },
  { id: "estadio-tres-de-marzo", name: "Estadio Tres de Marzo", city: "Guadalajara", country: "MEX", coordinates: [-103.416, 20.693], bearing: -16 },
  { id: "estadio-tecnologico", name: "Estadio Tecnológico", city: "Monterrey", country: "MEX", coordinates: [-100.2864, 25.6513], bearing: 14 },
  { id: "estadio-nemesio-diez", name: "Estadio Nemesio Díez", city: "Toluca", country: "MEX", coordinates: [-99.666, 19.2871], bearing: -22 },
  { id: "estadio-la-corregidora", name: "Estadio La Corregidora", city: "Querétaro", country: "MEX", coordinates: [-100.366, 20.578], bearing: 22 },
  { id: "estadio-neza-86", name: "Estadio Neza 86", city: "Nezahualcóyotl", country: "MEX", coordinates: [-98.9703, 19.404], bearing: -12 },
  { id: "estadio-cuauhtemoc", name: "Estadio Cuauhtémoc", city: "Puebla", country: "MEX", coordinates: [-98.1645, 19.078], bearing: 12 }
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

// Numbers follow FIFA's published match sequence. It differs from simple
// kickoff chronology at 2/3, 14/15, 27/28, 31-34, 39/40, 47/48 and 49/50.
const fixtureSeeds: FixtureSeed[] = [
  { no: 1, stage: "group", date: "1986-05-31", venueId: "estadio-azteca", home: "BUL", away: "ITA", score: { home: 1, away: 1 } },
  { no: 2, stage: "group", date: "1986-06-01", venueId: "estadio-nou-camp", home: "CAN", away: "FRA", score: { home: 0, away: 1 } },
  { no: 3, stage: "group", date: "1986-06-01", venueId: "estadio-jalisco", home: "ESP", away: "BRA", score: { home: 0, away: 1 } },
  { no: 4, stage: "group", date: "1986-06-02", venueId: "estadio-olimpico-universitario", home: "ARG", away: "KOR", score: { home: 3, away: 1 } },
  { no: 5, stage: "group", date: "1986-06-02", venueId: "estadio-sergio-leon-chavez", home: "URS", away: "HUN", score: { home: 6, away: 0 } },
  { no: 6, stage: "group", date: "1986-06-02", venueId: "estadio-universitario", home: "MAR", away: "POL", score: { home: 0, away: 0 } },
  { no: 7, stage: "group", date: "1986-06-03", venueId: "estadio-azteca", home: "BEL", away: "MEX", score: { home: 1, away: 2 } },
  { no: 8, stage: "group", date: "1986-06-03", venueId: "estadio-tres-de-marzo", home: "ALG", away: "NIR", score: { home: 1, away: 1 } },
  { no: 9, stage: "group", date: "1986-06-03", venueId: "estadio-tecnologico", home: "POR", away: "ENG", score: { home: 1, away: 0 } },
  { no: 10, stage: "group", date: "1986-06-04", venueId: "estadio-nemesio-diez", home: "PAR", away: "IRQ", score: { home: 1, away: 0 } },
  { no: 11, stage: "group", date: "1986-06-04", venueId: "estadio-la-corregidora", home: "URU", away: "GER", score: { home: 1, away: 1 } },
  { no: 12, stage: "group", date: "1986-06-04", venueId: "estadio-neza-86", home: "SCO", away: "DEN", score: { home: 0, away: 1 } },
  { no: 13, stage: "group", date: "1986-06-05", venueId: "estadio-cuauhtemoc", home: "ITA", away: "ARG", score: { home: 1, away: 1 } },
  { no: 14, stage: "group", date: "1986-06-05", venueId: "estadio-olimpico-universitario", home: "KOR", away: "BUL", score: { home: 1, away: 1 } },
  { no: 15, stage: "group", date: "1986-06-05", venueId: "estadio-nou-camp", home: "FRA", away: "URS", score: { home: 1, away: 1 } },
  { no: 16, stage: "group", date: "1986-06-06", venueId: "estadio-sergio-leon-chavez", home: "HUN", away: "CAN", score: { home: 2, away: 0 } },
  { no: 17, stage: "group", date: "1986-06-06", venueId: "estadio-jalisco", home: "BRA", away: "ALG", score: { home: 1, away: 0 } },
  { no: 18, stage: "group", date: "1986-06-06", venueId: "estadio-tecnologico", home: "ENG", away: "MAR", score: { home: 0, away: 0 } },
  { no: 19, stage: "group", date: "1986-06-07", venueId: "estadio-azteca", home: "MEX", away: "PAR", score: { home: 1, away: 1 } },
  { no: 20, stage: "group", date: "1986-06-07", venueId: "estadio-tres-de-marzo", home: "NIR", away: "ESP", score: { home: 1, away: 2 } },
  { no: 21, stage: "group", date: "1986-06-07", venueId: "estadio-universitario", home: "POL", away: "POR", score: { home: 1, away: 0 } },
  { no: 22, stage: "group", date: "1986-06-08", venueId: "estadio-nemesio-diez", home: "IRQ", away: "BEL", score: { home: 1, away: 2 } },
  { no: 23, stage: "group", date: "1986-06-08", venueId: "estadio-la-corregidora", home: "GER", away: "SCO", score: { home: 2, away: 1 } },
  { no: 24, stage: "group", date: "1986-06-08", venueId: "estadio-neza-86", home: "DEN", away: "URU", score: { home: 6, away: 1 } },
  { no: 25, stage: "group", date: "1986-06-09", venueId: "estadio-nou-camp", home: "HUN", away: "FRA", score: { home: 0, away: 3 } },
  { no: 26, stage: "group", date: "1986-06-09", venueId: "estadio-sergio-leon-chavez", home: "URS", away: "CAN", score: { home: 2, away: 0 } },
  { no: 27, stage: "group", date: "1986-06-10", venueId: "estadio-cuauhtemoc", home: "KOR", away: "ITA", score: { home: 2, away: 3 } },
  { no: 28, stage: "group", date: "1986-06-10", venueId: "estadio-olimpico-universitario", home: "ARG", away: "BUL", score: { home: 2, away: 0 } },
  { no: 29, stage: "group", date: "1986-06-11", venueId: "estadio-azteca", home: "IRQ", away: "MEX", score: { home: 0, away: 1 } },
  { no: 30, stage: "group", date: "1986-06-11", venueId: "estadio-nemesio-diez", home: "PAR", away: "BEL", score: { home: 2, away: 2 } },
  { no: 31, stage: "group", date: "1986-06-11", venueId: "estadio-tres-de-marzo", home: "POR", away: "MAR", score: { home: 1, away: 3 } },
  { no: 32, stage: "group", date: "1986-06-11", venueId: "estadio-tecnologico", home: "ENG", away: "POL", score: { home: 3, away: 0 } },
  { no: 33, stage: "group", date: "1986-06-12", venueId: "estadio-jalisco", home: "NIR", away: "BRA", score: { home: 0, away: 3 } },
  { no: 34, stage: "group", date: "1986-06-12", venueId: "estadio-tecnologico", home: "ALG", away: "ESP", score: { home: 0, away: 3 } },
  { no: 35, stage: "group", date: "1986-06-13", venueId: "estadio-la-corregidora", home: "DEN", away: "GER", score: { home: 2, away: 0 } },
  { no: 36, stage: "group", date: "1986-06-13", venueId: "estadio-neza-86", home: "SCO", away: "URU", score: { home: 0, away: 0 } },
  { no: 37, stage: "r16", date: "1986-06-15", venueId: "estadio-azteca", home: "MEX", away: "BUL", score: { home: 2, away: 0 } },
  { no: 38, stage: "r16", date: "1986-06-15", venueId: "estadio-nou-camp", home: "URS", away: "BEL", score: { home: 3, away: 4 }, durationMinutes: 120, note: "After extra time" },
  { no: 39, stage: "r16", date: "1986-06-16", venueId: "estadio-cuauhtemoc", home: "ARG", away: "URU", score: { home: 1, away: 0 } },
  { no: 40, stage: "r16", date: "1986-06-16", venueId: "estadio-jalisco", home: "BRA", away: "POL", score: { home: 4, away: 0 } },
  { no: 41, stage: "r16", date: "1986-06-17", venueId: "estadio-olimpico-universitario", home: "ITA", away: "FRA", score: { home: 0, away: 2 } },
  { no: 42, stage: "r16", date: "1986-06-17", venueId: "estadio-universitario", home: "MAR", away: "GER", score: { home: 0, away: 1 } },
  { no: 43, stage: "r16", date: "1986-06-18", venueId: "estadio-azteca", home: "ENG", away: "PAR", score: { home: 3, away: 0 } },
  { no: 44, stage: "r16", date: "1986-06-18", venueId: "estadio-la-corregidora", home: "DEN", away: "ESP", score: { home: 1, away: 5 } },
  { no: 45, stage: "qf", date: "1986-06-21", venueId: "estadio-jalisco", home: "BRA", away: "FRA", score: { home: 1, away: 1 }, shootout: { home: 3, away: 4 }, durationMinutes: 120, note: "France won 4-3 on penalties" },
  { no: 46, stage: "qf", date: "1986-06-21", venueId: "estadio-universitario", home: "GER", away: "MEX", score: { home: 0, away: 0 }, shootout: { home: 4, away: 1 }, durationMinutes: 120, note: "West Germany won 4-1 on penalties" },
  { no: 47, stage: "qf", date: "1986-06-22", venueId: "estadio-cuauhtemoc", home: "ESP", away: "BEL", score: { home: 1, away: 1 }, shootout: { home: 4, away: 5 }, durationMinutes: 120, note: "Belgium won 5-4 on penalties" },
  { no: 48, stage: "qf", date: "1986-06-22", venueId: "estadio-azteca", home: "ARG", away: "ENG", score: { home: 2, away: 1 } },
  { no: 49, stage: "sf", date: "1986-06-25", venueId: "estadio-azteca", home: "ARG", away: "BEL", score: { home: 2, away: 0 } },
  { no: 50, stage: "sf", date: "1986-06-25", venueId: "estadio-jalisco", home: "FRA", away: "GER", score: { home: 0, away: 2 } },
  { no: 51, stage: "third", date: "1986-06-28", venueId: "estadio-cuauhtemoc", home: "FRA", away: "BEL", score: { home: 4, away: 2 }, durationMinutes: 120, note: "After extra time" },
  { no: 52, stage: "final", date: "1986-06-29", venueId: "estadio-azteca", home: "ARG", away: "GER", score: { home: 3, away: 2 } }
];

// Scorer identity and minute labels follow the Fjelstul World Cup Database,
// joined to FIFA's official match numbers by date and exact team pairing.
// Shootout kicks are excluded.
const goalsByFixture: Partial<Record<number, GoalSeed[]>> = {
  1: [[44, "ITA", "Alessandro Altobelli"], [85, "BUL", "Nasko Sirakov"]],
  2: [[79, "FRA", "Jean-Pierre Papin"]],
  3: [[62, "BRA", "Sócrates"]],
  4: [[6, "ARG", "Jorge Valdano"], [18, "ARG", "Oscar Ruggeri"], [46, "ARG", "Jorge Valdano"], [73, "KOR", "Chang-sun Park"]],
  5: [[2, "URS", "Pavel Yakovenko"], [4, "URS", "Sergei Aleinikov"], [24, "URS", "Ihor Belanov", "Ihor Belanov scores from the penalty spot."], [66, "URS", "Ivan Yaremchuk"], [73, "URS", "László Dajka", "László Dajka scores an own goal."], [80, "URS", "Sergey Rodionov"]],
  7: [[23, "MEX", "Fernando Quirarte"], [39, "MEX", "Hugo Sánchez"], [45, "BEL", "Erwin Vandenbergh"]],
  8: [[6, "NIR", "Norman Whiteside"], [59, "ALG", "Djamel Zidane"]],
  9: [[75, "POR", "Carlos Manuel"]],
  10: [[35, "PAR", "Julio César Romero"]],
  11: [[4, "URU", "Antonio Alzamendi"], [84, "GER", "Klaus Allofs"]],
  12: [[57, "DEN", "Preben Elkjær"]],
  13: [[6, "ITA", "Alessandro Altobelli", "Alessandro Altobelli scores from the penalty spot."], [34, "ARG", "Diego Maradona"]],
  14: [[11, "BUL", "Plamen Getov"], [70, "KOR", "Jong-boo Kim"]],
  15: [[53, "URS", "Vasyl Rats"], [62, "FRA", "Luis Fernández"]],
  16: [[2, "HUN", "Márton Esterházy"], [75, "HUN", "Lajos Détári"]],
  17: [[66, "BRA", "Careca"]],
  19: [[3, "MEX", "Luis Flores"], [85, "PAR", "Julio César Romero"]],
  20: [[1, "ESP", "Emilio Butragueño"], [18, "ESP", "Julio Salinas"], [46, "NIR", "Colin Clarke"]],
  21: [[68, "POL", "Włodzimierz Smolarek"]],
  22: [[16, "BEL", "Enzo Scifo"], [21, "BEL", "Nico Claesen", "Nico Claesen scores from the penalty spot."], [59, "IRQ", "Ahmed Radhi"]],
  23: [[18, "SCO", "Gordon Strachan"], [23, "GER", "Rudi Völler"], [49, "GER", "Klaus Allofs"]],
  24: [[11, "DEN", "Preben Elkjær"], [41, "DEN", "Søren Lerby"], [45, "URU", "Enzo Francescoli", "Enzo Francescoli scores from the penalty spot."], [52, "DEN", "Michael Laudrup"], [67, "DEN", "Preben Elkjær"], [80, "DEN", "Preben Elkjær"], [88, "DEN", "Jesper Olsen"]],
  25: [[29, "FRA", "Yannick Stopyra"], [62, "FRA", "Jean Tigana"], [84, "FRA", "Dominique Rocheteau"]],
  26: [[58, "URS", "Oleh Blokhin"], [74, "URS", "Oleksandr Zavarov"]],
  27: [[17, "ITA", "Alessandro Altobelli"], [62, "KOR", "Soon-ho Choi"], [73, "ITA", "Alessandro Altobelli"], [82, "ITA", "Kwang-rae Cho", "Kwang-rae Cho scores an own goal."], [83, "KOR", "Jung-moo Huh"]],
  28: [[4, "ARG", "Jorge Valdano"], [77, "ARG", "Jorge Burruchaga"]],
  29: [[54, "MEX", "Fernando Quirarte"]],
  30: [[30, "BEL", "Franky Vercauteren"], [50, "PAR", "Roberto Cabañas"], [59, "BEL", "Daniel Veyt"], [76, "PAR", "Roberto Cabañas"]],
  31: [[19, "MAR", "Abderrazak Khairi"], [26, "MAR", "Abderrazak Khairi"], [62, "MAR", "Abdelkrim Merry"], [80, "POR", "Diamantino"]],
  32: [[9, "ENG", "Gary Lineker"], [14, "ENG", "Gary Lineker"], [34, "ENG", "Gary Lineker"]],
  33: [[15, "BRA", "Careca"], [42, "BRA", "Josimar"], [87, "BRA", "Careca"]],
  34: [[15, "ESP", "Ramón Calderé"], [68, "ESP", "Ramón Calderé"], [70, "ESP", "Eloy"]],
  35: [[43, "DEN", "Jesper Olsen", "Jesper Olsen scores from the penalty spot."], [62, "DEN", "John Eriksen"]],
  37: [[34, "MEX", "Manuel Negrete"], [61, "MEX", "Raúl Servín"]],
  38: [[27, "URS", "Ihor Belanov"], [56, "BEL", "Enzo Scifo"], [70, "URS", "Ihor Belanov"], [77, "BEL", "Jan Ceulemans"], [102, "BEL", "Stéphane Demol"], [110, "BEL", "Nico Claesen"], [111, "URS", "Ihor Belanov", "Ihor Belanov scores from the penalty spot."]],
  39: [[42, "ARG", "Pedro Pasculli"]],
  40: [[30, "BRA", "Sócrates", "Sócrates scores from the penalty spot."], [55, "BRA", "Josimar"], [79, "BRA", "Edinho"], [83, "BRA", "Careca", "Careca scores from the penalty spot."]],
  41: [[15, "FRA", "Michel Platini"], [57, "FRA", "Yannick Stopyra"]],
  42: [[87, "GER", "Lothar Matthäus"]],
  43: [[31, "ENG", "Gary Lineker"], [56, "ENG", "Peter Beardsley"], [73, "ENG", "Gary Lineker"]],
  44: [[33, "DEN", "Jesper Olsen", "Jesper Olsen scores from the penalty spot."], [43, "ESP", "Emilio Butragueño"], [56, "ESP", "Emilio Butragueño"], [68, "ESP", "Andoni Goikoetxea", "Andoni Goikoetxea scores from the penalty spot."], [80, "ESP", "Emilio Butragueño"], [88, "ESP", "Emilio Butragueño", "Emilio Butragueño scores from the penalty spot."]],
  45: [[17, "BRA", "Careca"], [40, "FRA", "Michel Platini"]],
  47: [[35, "BEL", "Jan Ceulemans"], [85, "ESP", "Juan Antonio Señor"]],
  48: [[51, "ARG", "Diego Maradona"], [55, "ARG", "Diego Maradona"], [81, "ENG", "Gary Lineker"]],
  49: [[51, "ARG", "Diego Maradona"], [63, "ARG", "Diego Maradona"]],
  50: [[9, "GER", "Andreas Brehme"], [90, "GER", "Rudi Völler"]],
  51: [[11, "BEL", "Jan Ceulemans"], [27, "FRA", "Jean-Marc Ferreri"], [43, "FRA", "Jean-Pierre Papin"], [73, "BEL", "Nico Claesen"], [104, "FRA", "Bernard Genghini"], [111, "FRA", "Manuel Amoros", "Manuel Amoros scores from the penalty spot."]],
  52: [[23, "ARG", "José Luis Brown"], [56, "ARG", "Jorge Valdano"], [74, "GER", "Karl-Heinz Rummenigge"], [81, "GER", "Rudi Völler"], [84, "ARG", "Jorge Burruchaga"]]
};

type YouTubeHighlightSeed = {
  videoId: string;
  sourceName: string;
};

// Every video matches the fixture teams and score and passed YouTube's real
// embed response with status OK and playableInEmbed=true on July 13, 2026.
const youtubeHighlightsByFixture: Record<number, YouTubeHighlightSeed> = {
  1: { videoId: "M0eTCWLGTfo", sourceName: "Football Flashback 6 highlights" },
  2: { videoId: "lIUVkVickbQ", sourceName: "Football Flashback 6 highlights" },
  3: { videoId: "r10ID8dNo7k", sourceName: "Football Flashback 6 highlights" },
  4: { videoId: "cBjRKVZb4z4", sourceName: "Football Flashback 6 highlights" },
  5: { videoId: "KMtBKLEkLq0", sourceName: "Football Flashback 6 highlights" },
  6: { videoId: "q27qUuCfMng", sourceName: "Mr Soccer highlights" },
  7: { videoId: "PRd0Op8q2RY", sourceName: "Caderno de Esportes highlights" },
  8: { videoId: "SOHsUCjZ6XU", sourceName: "Caderno de Esportes highlights" },
  9: { videoId: "Q96knGZ3Of4", sourceName: "Football Flashback 6 highlights" },
  10: { videoId: "zGbN1q3L4TA", sourceName: "Football Flashback 6 highlights" },
  11: { videoId: "cDOY6IR8u5Y", sourceName: "Football Flashback 6 highlights" },
  12: { videoId: "Gfftlr9qtrQ", sourceName: "Football Flashback 6 highlights" },
  13: { videoId: "IHGSoYFuHow", sourceName: "Football Flashback 6 highlights" },
  14: { videoId: "W6nvsT9eTwQ", sourceName: "sp1873 highlights" },
  15: { videoId: "4uNEIWX5-z8", sourceName: "Football Flashback 6 highlights" },
  16: { videoId: "DbMqZBx2gQA", sourceName: "sp1873 highlights" },
  17: { videoId: "Z_5K_AS1RSo", sourceName: "Football Flashback 6 highlights" },
  18: { videoId: "wR5_td9j8hc", sourceName: "Football Flashback 6 highlights" },
  19: { videoId: "Th_4x5enMMU", sourceName: "HistoryFull Worldcup highlights" },
  20: { videoId: "Z0BVcMent4k", sourceName: "sp1873 highlights" },
  21: { videoId: "cBWVDbtlzQM", sourceName: "Football Flashback 6 highlights" },
  22: { videoId: "Sqjr6hPxmiI", sourceName: "Football Flashback 6 highlights" },
  23: { videoId: "dr3WW3pjpXs", sourceName: "Football Flashback 6 highlights" },
  24: { videoId: "rrAbsPhX9eQ", sourceName: "Caderno de Esportes highlights" },
  25: { videoId: "Gt0pBAeQuC0", sourceName: "Football Flashback 6 highlights" },
  26: { videoId: "GWxxnqQ3oaY", sourceName: "Football Flashback 6 highlights" },
  27: { videoId: "03ISodmB7jg", sourceName: "Football Flashback 6 highlights" },
  28: { videoId: "Cyy0KjsS0os", sourceName: "Football Flashback 6 highlights" },
  29: { videoId: "5cGxNaU14eI", sourceName: "sp1873 highlights" },
  30: { videoId: "sWSomoYayig", sourceName: "Football Flashback 6 highlights" },
  31: { videoId: "hkauTeF1NA8", sourceName: "Football Flashback 6 highlights" },
  32: { videoId: "1h7_QUa69tQ", sourceName: "HistoryFull Worldcup highlights" },
  33: { videoId: "mY7bZlV0-s4", sourceName: "Football Flashback 6 highlights" },
  34: { videoId: "gFLa77Xo_zk", sourceName: "Football Flashback 6 highlights" },
  35: { videoId: "wh9AxJCLIFc", sourceName: "Football Flashback 6 highlights" },
  36: { videoId: "DgJPjmKy7c8", sourceName: "Football Flashback 6 highlights" },
  37: { videoId: "g5DMugjNsFc", sourceName: "Football Flashback 6 highlights" },
  38: { videoId: "5K9R8BLHOXs", sourceName: "Football Flashback 6 highlights" },
  39: { videoId: "n5KDJOIJ2r0", sourceName: "Football Flashback 6 highlights" },
  40: { videoId: "K726pfbVRW0", sourceName: "Football Flashback 6 highlights" },
  41: { videoId: "LM8nOBZV4zM", sourceName: "MuseoBNCesena highlights" },
  42: { videoId: "zNA2e_cdt4I", sourceName: "Football Flashback 6 highlights" },
  43: { videoId: "ToN4ZNtJQAk", sourceName: "Football Flashback 6 highlights" },
  44: { videoId: "do4tdtXyn18", sourceName: "Football Flashback 6 highlights" },
  45: { videoId: "G3VbBJIH0js", sourceName: "greensterRox highlights" },
  46: { videoId: "UI46dXRrj9E", sourceName: "Football Flashback 6 highlights" },
  47: { videoId: "4MEQS80XkEU", sourceName: "Mr Soccer highlights" },
  48: { videoId: "ZN3jcfJSJMY", sourceName: "Football Flashback 6 highlights" },
  49: { videoId: "V8lZypv5cI0", sourceName: "Football Flashback 6 highlights" },
  50: { videoId: "3_TcUTmidVg", sourceName: "Football Flashback 6 highlights" },
  51: { videoId: "G9seWRe_RbQ", sourceName: "Mr Soccer highlights" },
  52: { videoId: "EP4DxS2wwIA", sourceName: "Football Flashback 6 highlights" }
};

// FIFA's current match-centre archive identifies the edition as season 68.
// These match and stage IDs come directly from its calendar API.
const fifaMatchIdsByFixture: Record<number, string> = {
  1: "459", 2: "468", 3: "439", 4: "395", 5: "610", 6: "674",
  7: "428", 8: "379", 9: "538", 10: "628", 11: "585", 12: "517",
  13: "394", 14: "460", 15: "571", 16: "475", 17: "377", 18: "533",
  19: "680", 20: "551", 21: "701", 22: "427", 23: "580", 24: "522",
  25: "567", 26: "476", 27: "643", 28: "389", 29: "627", 30: "429",
  31: "675", 32: "537", 33: "441", 34: "378", 35: "512", 36: "712",
  37: "463", 38: "432", 39: "398", 40: "444", 41: "568", 42: "574",
  43: "536", 44: "511", 45: "440", 46: "575", 47: "421", 48: "392",
  49: "388", 50: "564", 51: "422", 52: "393"
};

function getFifaStageId(no: number) {
  if (no <= 36) return "308";
  if (no <= 44) return "309";
  if (no <= 48) return "714";
  if (no <= 50) return "3469";
  if (no === 51) return "3468";
  return "3467";
}

function getFifaMatchUrl(fixture: FixtureSeed) {
  const stageId = getFifaStageId(fixture.no);
  const matchId = fifaMatchIdsByFixture[fixture.no];
  return `https://www.fifa.com/en/match-centre/match/17/68/${stageId}/${matchId}?date=${fixture.date}`;
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
      id: `wc-1986-${String(fixture.no).padStart(2, "0")}-${fixture.home.toLowerCase()}-${fixture.away.toLowerCase()}`,
      tournamentId: "wc-1986",
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

export const worldCup1986: Tournament = {
  id: "wc-1986",
  competition: "WORLD_CUP",
  name: "Mexico 1986",
  year: 1986,
  hosts: ["MEX"],
  teams: worldCup1986Groups.flatMap((group) => group.teams),
  groups: worldCup1986Groups,
  teamCoordinates: worldCup1986TeamCoordinates,
  format: worldCup1986Format,
  stages: ["group", "r16", "qf", "sf", "third", "final"],
  status: "complete",
  mapView: {
    center: [-101.5, 22.8],
    zoom: 3.85,
    bearing: -8,
    pitch: 42
  },
  venues,
  featuredRoute: venues.map((venue) => venue.id),
  matches
};
