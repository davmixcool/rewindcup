import { createYoutubeHighlight } from "@/data/highlights";
import { teamNames } from "@/data/teamMetadata";
import {
  worldCup1982Format,
  worldCup1982Groups,
  worldCup1982SecondGroups,
  worldCup1982TeamCoordinates
} from "@/data/worldCup1982Experience";
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
  { id: "camp-nou", name: "Camp Nou", city: "Barcelona", country: "ESP", coordinates: [2.1228, 41.3809], bearing: -15 },
  { id: "estadio-municipal-de-balaidos", name: "Estadio Municipal de Balaídos", city: "Vigo", country: "ESP", coordinates: [-8.7397, 42.2118], bearing: 18 },
  { id: "estadio-ramon-sanchez-pizjuan", name: "Estadio Ramón Sánchez-Pizjuán", city: "Seville", country: "ESP", coordinates: [-5.9706, 37.3841], bearing: -18 },
  { id: "estadio-municipal-de-riazor", name: "Estadio Municipal de Riazor", city: "A Coruña", country: "ESP", coordinates: [-8.4175, 43.3688], bearing: 12 },
  { id: "nuevo-estadio", name: "Nuevo Estadio", city: "Elche", country: "ESP", coordinates: [-0.6633, 38.2669], bearing: -12 },
  { id: "estadio-la-rosaleda", name: "Estadio La Rosaleda", city: "Málaga", country: "ESP", coordinates: [-4.4265, 36.734], bearing: 16 },
  { id: "estadio-el-molinon", name: "Estadio El Molinón", city: "Gijón", country: "ESP", coordinates: [-5.6372, 43.5361], bearing: -20 },
  { id: "estadio-san-mames", name: "Estadio San Mamés", city: "Bilbao", country: "ESP", coordinates: [-2.9496, 43.2642], bearing: 20 },
  { id: "estadio-luis-casanova", name: "Estadio Luis Casanova", city: "Valencia", country: "ESP", coordinates: [-0.3583, 39.4747], bearing: -14 },
  { id: "estadio-carlos-tartiere", name: "Estadio Carlos Tartiere", city: "Oviedo", country: "ESP", coordinates: [-5.879, 43.361], bearing: 14 },
  { id: "estadio-jose-zorrilla", name: "Estadio José Zorrilla", city: "Valladolid", country: "ESP", coordinates: [-4.7611, 41.6445], bearing: -16 },
  { id: "estadio-la-romareda", name: "Estadio La Romareda", city: "Zaragoza", country: "ESP", coordinates: [-0.9017, 41.6365], bearing: 16 },
  { id: "estadio-jose-rico-perez", name: "Estadio José Rico Pérez", city: "Alicante", country: "ESP", coordinates: [-0.4925, 38.3573], bearing: -18 },
  { id: "estadio-benito-villamarin", name: "Estadio Benito Villamarín", city: "Seville", country: "ESP", coordinates: [-5.9817, 37.3564], bearing: 18 },
  { id: "estadio-vicente-calderon", name: "Estadio Vicente Calderón", city: "Madrid", country: "ESP", coordinates: [-3.7217, 40.4017], bearing: -22 },
  { id: "estadi-de-sarria", name: "Estadi de Sarrià", city: "Barcelona", country: "ESP", coordinates: [2.1303, 41.3932], bearing: 22 },
  { id: "estadio-santiago-bernabeu", name: "Estadio Santiago Bernabéu", city: "Madrid", country: "ESP", coordinates: [-3.6883, 40.4531], bearing: -10, zoom: 16.45 }
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

// Numbers follow FIFA's current match-centre sequence for season 59.
const fixtureSeeds: FixtureSeed[] = [
  { no: 1, stage: "group", date: "1982-06-13", venueId: "camp-nou", home: "ARG", away: "BEL", score: { home: 0, away: 1 } },
  { no: 2, stage: "group", date: "1982-06-14", venueId: "estadio-municipal-de-balaidos", home: "ITA", away: "POL", score: { home: 0, away: 0 } },
  { no: 3, stage: "group", date: "1982-06-14", venueId: "estadio-ramon-sanchez-pizjuan", home: "BRA", away: "URS", score: { home: 2, away: 1 } },
  { no: 4, stage: "group", date: "1982-06-15", venueId: "estadio-municipal-de-riazor", home: "PER", away: "CMR", score: { home: 0, away: 0 } },
  { no: 5, stage: "group", date: "1982-06-15", venueId: "nuevo-estadio", home: "HUN", away: "SLV", score: { home: 10, away: 1 } },
  { no: 6, stage: "group", date: "1982-06-15", venueId: "estadio-la-rosaleda", home: "SCO", away: "NZL", score: { home: 5, away: 2 } },
  { no: 7, stage: "group", date: "1982-06-16", venueId: "estadio-el-molinon", home: "GER", away: "ALG", score: { home: 1, away: 2 } },
  { no: 8, stage: "group", date: "1982-06-16", venueId: "estadio-san-mames", home: "ENG", away: "FRA", score: { home: 3, away: 1 } },
  { no: 9, stage: "group", date: "1982-06-16", venueId: "estadio-luis-casanova", home: "ESP", away: "HON", score: { home: 1, away: 1 } },
  { no: 10, stage: "group", date: "1982-06-17", venueId: "estadio-carlos-tartiere", home: "CHI", away: "AUT", score: { home: 0, away: 1 } },
  { no: 11, stage: "group", date: "1982-06-17", venueId: "estadio-jose-zorrilla", home: "TCH", away: "KUW", score: { home: 1, away: 1 } },
  { no: 12, stage: "group", date: "1982-06-17", venueId: "estadio-la-romareda", home: "YUG", away: "NIR", score: { home: 0, away: 0 } },
  { no: 13, stage: "group", date: "1982-06-18", venueId: "estadio-municipal-de-balaidos", home: "ITA", away: "PER", score: { home: 1, away: 1 } },
  { no: 14, stage: "group", date: "1982-06-18", venueId: "estadio-jose-rico-perez", home: "ARG", away: "HUN", score: { home: 4, away: 1 } },
  { no: 15, stage: "group", date: "1982-06-18", venueId: "estadio-benito-villamarin", home: "BRA", away: "SCO", score: { home: 4, away: 1 } },
  { no: 16, stage: "group", date: "1982-06-19", venueId: "estadio-municipal-de-riazor", home: "POL", away: "CMR", score: { home: 0, away: 0 } },
  { no: 17, stage: "group", date: "1982-06-19", venueId: "nuevo-estadio", home: "BEL", away: "SLV", score: { home: 1, away: 0 } },
  { no: 18, stage: "group", date: "1982-06-19", venueId: "estadio-la-rosaleda", home: "URS", away: "NZL", score: { home: 3, away: 0 } },
  { no: 19, stage: "group", date: "1982-06-20", venueId: "estadio-el-molinon", home: "GER", away: "CHI", score: { home: 4, away: 1 } },
  { no: 20, stage: "group", date: "1982-06-20", venueId: "estadio-san-mames", home: "ENG", away: "TCH", score: { home: 2, away: 0 } },
  { no: 21, stage: "group", date: "1982-06-20", venueId: "estadio-luis-casanova", home: "ESP", away: "YUG", score: { home: 2, away: 1 } },
  { no: 22, stage: "group", date: "1982-06-21", venueId: "estadio-carlos-tartiere", home: "ALG", away: "AUT", score: { home: 0, away: 2 } },
  { no: 23, stage: "group", date: "1982-06-21", venueId: "estadio-jose-zorrilla", home: "FRA", away: "KUW", score: { home: 4, away: 1 } },
  { no: 24, stage: "group", date: "1982-06-21", venueId: "estadio-la-romareda", home: "HON", away: "NIR", score: { home: 1, away: 1 } },
  { no: 25, stage: "group", date: "1982-06-22", venueId: "estadio-municipal-de-riazor", home: "POL", away: "PER", score: { home: 5, away: 1 } },
  { no: 26, stage: "group", date: "1982-06-22", venueId: "nuevo-estadio", home: "BEL", away: "HUN", score: { home: 1, away: 1 } },
  { no: 27, stage: "group", date: "1982-06-22", venueId: "estadio-la-rosaleda", home: "URS", away: "SCO", score: { home: 2, away: 2 } },
  { no: 28, stage: "group", date: "1982-06-23", venueId: "estadio-municipal-de-balaidos", home: "ITA", away: "CMR", score: { home: 1, away: 1 } },
  { no: 29, stage: "group", date: "1982-06-23", venueId: "estadio-jose-rico-perez", home: "ARG", away: "SLV", score: { home: 2, away: 0 } },
  { no: 30, stage: "group", date: "1982-06-23", venueId: "estadio-benito-villamarin", home: "BRA", away: "NZL", score: { home: 4, away: 0 } },
  { no: 31, stage: "group", date: "1982-06-24", venueId: "estadio-carlos-tartiere", home: "ALG", away: "CHI", score: { home: 3, away: 2 } },
  { no: 32, stage: "group", date: "1982-06-24", venueId: "estadio-jose-zorrilla", home: "FRA", away: "TCH", score: { home: 1, away: 1 } },
  { no: 33, stage: "group", date: "1982-06-24", venueId: "estadio-la-romareda", home: "HON", away: "YUG", score: { home: 0, away: 1 } },
  { no: 34, stage: "group", date: "1982-06-25", venueId: "estadio-el-molinon", home: "GER", away: "AUT", score: { home: 1, away: 0 } },
  { no: 35, stage: "group", date: "1982-06-25", venueId: "estadio-san-mames", home: "ENG", away: "KUW", score: { home: 1, away: 0 } },
  { no: 36, stage: "group", date: "1982-06-25", venueId: "estadio-luis-casanova", home: "NIR", away: "ESP", score: { home: 1, away: 0 } },
  { no: 37, stage: "group2", date: "1982-06-28", venueId: "estadio-vicente-calderon", home: "AUT", away: "FRA", score: { home: 0, away: 1 } },
  { no: 38, stage: "group2", date: "1982-06-28", venueId: "camp-nou", home: "POL", away: "BEL", score: { home: 3, away: 0 } },
  { no: 39, stage: "group2", date: "1982-06-29", venueId: "estadi-de-sarria", home: "ITA", away: "ARG", score: { home: 2, away: 1 } },
  { no: 40, stage: "group2", date: "1982-06-29", venueId: "estadio-santiago-bernabeu", home: "GER", away: "ENG", score: { home: 0, away: 0 } },
  { no: 41, stage: "group2", date: "1982-07-01", venueId: "estadio-vicente-calderon", home: "AUT", away: "NIR", score: { home: 2, away: 2 } },
  { no: 42, stage: "group2", date: "1982-07-01", venueId: "camp-nou", home: "BEL", away: "URS", score: { home: 0, away: 1 } },
  { no: 43, stage: "group2", date: "1982-07-02", venueId: "estadi-de-sarria", home: "ARG", away: "BRA", score: { home: 1, away: 3 } },
  { no: 44, stage: "group2", date: "1982-07-02", venueId: "estadio-santiago-bernabeu", home: "GER", away: "ESP", score: { home: 2, away: 1 } },
  { no: 45, stage: "group2", date: "1982-07-04", venueId: "estadio-vicente-calderon", home: "FRA", away: "NIR", score: { home: 4, away: 1 } },
  { no: 46, stage: "group2", date: "1982-07-04", venueId: "camp-nou", home: "URS", away: "POL", score: { home: 0, away: 0 } },
  { no: 47, stage: "group2", date: "1982-07-05", venueId: "estadi-de-sarria", home: "ITA", away: "BRA", score: { home: 3, away: 2 } },
  { no: 48, stage: "group2", date: "1982-07-05", venueId: "estadio-santiago-bernabeu", home: "ESP", away: "ENG", score: { home: 0, away: 0 } },
  { no: 49, stage: "sf", date: "1982-07-08", venueId: "camp-nou", home: "POL", away: "ITA", score: { home: 0, away: 2 } },
  { no: 50, stage: "sf", date: "1982-07-08", venueId: "estadio-ramon-sanchez-pizjuan", home: "GER", away: "FRA", score: { home: 3, away: 3 }, shootout: { home: 5, away: 4 }, durationMinutes: 120, note: "West Germany won 5-4 on penalties" },
  { no: 51, stage: "third", date: "1982-07-10", venueId: "estadio-jose-rico-perez", home: "POL", away: "FRA", score: { home: 3, away: 2 } },
  { no: 52, stage: "final", date: "1982-07-11", venueId: "estadio-santiago-bernabeu", home: "ITA", away: "GER", score: { home: 3, away: 1 } }
];

// Scorers and minute labels follow the Fjelstul World Cup Database, joined to
// FIFA's official schedule by date and exact team pairing. Shootout kicks are excluded.
const goalsByFixture: Partial<Record<number, GoalSeed[]>> = {
  1: [[62, "BEL", "Erwin Vandenbergh"]],
  3: [[34, "URS", "Andriy Bal"], [75, "BRA", "Sócrates"], [88, "BRA", "Éder"]],
  5: [[4, "HUN", "Tibor Nyilasi"], [11, "HUN", "Gábor Pölöskei"], [23, "HUN", "László Fazekas"], [50, "HUN", "József Tóth"], [54, "HUN", "László Fazekas"], [64, "SLV", "Luis Ramírez Zapata"], [69, "HUN", "László Kiss"], [70, "HUN", "Lázár Szentes"], [72, "HUN", "László Kiss"], [76, "HUN", "László Kiss"], [83, "HUN", "Tibor Nyilasi"]],
  6: [[18, "SCO", "Kenny Dalglish"], [29, "SCO", "John Wark"], [32, "SCO", "John Wark"], [54, "NZL", "Steve Sumner"], [64, "NZL", "Steve Wooddin"], [73, "SCO", "John Robertson"], [79, "SCO", "Steve Archibald"]],
  7: [[54, "ALG", "Rabah Madjer"], [67, "GER", "Karl-Heinz Rummenigge"], [68, "ALG", "Lakhdar Belloumi"]],
  8: [[1, "ENG", "Bryan Robson"], [24, "FRA", "Gérard Soler"], [67, "ENG", "Bryan Robson"], [83, "ENG", "Paul Mariner"]],
  9: [[8, "HON", "Héctor Zelaya"], [65, "ESP", "Roberto López Ufarte", "Roberto López Ufarte scores from the penalty spot."]],
  10: [[22, "AUT", "Walter Schachner"]],
  11: [[21, "TCH", "Antonín Panenka", "Antonín Panenka scores from the penalty spot."], [57, "KUW", "Faisal Al-Dakhil"]],
  13: [[18, "ITA", "Bruno Conti"], [83, "PER", "Rubén Toribio Díaz"]],
  14: [[26, "ARG", "Daniel Bertoni"], [28, "ARG", "Diego Maradona"], [57, "ARG", "Diego Maradona"], [60, "ARG", "Osvaldo Ardiles"], [76, "HUN", "Gábor Pölöskei"]],
  15: [[18, "SCO", "David Narey"], [33, "BRA", "Zico"], [48, "BRA", "Oscar"], [63, "BRA", "Éder"], [87, "BRA", "Falcão"]],
  17: [[19, "BEL", "Ludo Coeck"]],
  18: [[24, "URS", "Yuri Gavrilov"], [48, "URS", "Oleh Blokhin"], [68, "URS", "Sergei Baltacha"]],
  19: [[9, "GER", "Karl-Heinz Rummenigge"], [57, "GER", "Karl-Heinz Rummenigge"], [66, "GER", "Karl-Heinz Rummenigge"], [81, "GER", "Uwe Reinders"], [90, "CHI", "Gustavo Moscoso"]],
  20: [[62, "ENG", "Trevor Francis"], [66, "ENG", "Jozef Barmoš", "Jozef Barmoš scores an own goal."]],
  21: [[10, "YUG", "Ivan Gudelj"], [14, "ESP", "Juanito", "Juanito scores from the penalty spot."], [66, "ESP", "Enrique Saura"]],
  22: [[55, "AUT", "Walter Schachner"], [67, "AUT", "Hans Krankl"]],
  23: [[31, "FRA", "Bernard Genghini"], [43, "FRA", "Michel Platini"], [48, "FRA", "Didier Six"], [75, "KUW", "Abdullah Al-Buloushi"], [89, "FRA", "Maxime Bossis"]],
  24: [[10, "NIR", "Gerry Armstrong"], [60, "HON", "Antonio Laing"]],
  25: [[55, "POL", "Włodzimierz Smolarek"], [58, "POL", "Grzegorz Lato"], [61, "POL", "Zbigniew Boniek"], [68, "POL", "Andrzej Buncol"], [76, "POL", "Włodzimierz Ciołek"], [83, "PER", "Guillermo La Rosa"]],
  26: [[27, "HUN", "József Varga"], [76, "BEL", "Alexandre Czerniatynski"]],
  27: [[15, "SCO", "Joe Jordan"], [59, "URS", "Aleksandr Chivadze"], [84, "URS", "Ramaz Shengelia"], [86, "SCO", "Graeme Souness"]],
  28: [[60, "ITA", "Francesco Graziani"], [61, "CMR", "Grégoire M'Bida"]],
  29: [[22, "ARG", "Daniel Passarella", "Daniel Passarella scores from the penalty spot."], [54, "ARG", "Daniel Bertoni"]],
  30: [[28, "BRA", "Zico"], [31, "BRA", "Zico"], [64, "BRA", "Falcão"], [70, "BRA", "Serginho"]],
  31: [[7, "ALG", "Salah Assad"], [31, "ALG", "Salah Assad"], [35, "ALG", "Tedj Bensaoula"], [59, "CHI", "Miguel Ángel Neira", "Miguel Ángel Neira scores from the penalty spot."], [73, "CHI", "Juan Carlos Letelier"]],
  32: [[66, "FRA", "Didier Six"], [84, "TCH", "Antonín Panenka", "Antonín Panenka scores from the penalty spot."]],
  33: [[88, "YUG", "Vladimir Petrović", "Vladimir Petrović scores from the penalty spot."]],
  34: [[10, "GER", "Horst Hrubesch"]],
  35: [[27, "ENG", "Trevor Francis"]],
  36: [[47, "NIR", "Gerry Armstrong"]],
  37: [[39, "FRA", "Bernard Genghini"]],
  38: [[4, "POL", "Zbigniew Boniek"], [26, "POL", "Zbigniew Boniek"], [53, "POL", "Zbigniew Boniek"]],
  39: [[57, "ITA", "Marco Tardelli"], [67, "ITA", "Antonio Cabrini"], [83, "ARG", "Daniel Passarella"]],
  41: [[27, "NIR", "Billy Hamilton"], [50, "AUT", "Bruno Pezzey"], [68, "AUT", "Reinhold Hintermaier"], [75, "NIR", "Billy Hamilton"]],
  42: [[48, "URS", "Khoren Hovhannisyan"]],
  43: [[11, "BRA", "Zico"], [66, "BRA", "Serginho"], [75, "BRA", "Júnior"], [89, "ARG", "Ramón Díaz"]],
  44: [[50, "GER", "Pierre Littbarski"], [75, "GER", "Klaus Fischer"], [82, "ESP", "Jesús María Zamora"]],
  45: [[33, "FRA", "Alain Giresse"], [46, "FRA", "Dominique Rocheteau"], [68, "FRA", "Dominique Rocheteau"], [75, "NIR", "Gerry Armstrong"], [80, "FRA", "Alain Giresse"]],
  47: [[5, "ITA", "Paolo Rossi"], [12, "BRA", "Sócrates"], [25, "ITA", "Paolo Rossi"], [68, "BRA", "Falcão"], [74, "ITA", "Paolo Rossi"]],
  49: [[22, "ITA", "Paolo Rossi"], [73, "ITA", "Paolo Rossi"]],
  50: [[17, "GER", "Pierre Littbarski"], [26, "FRA", "Michel Platini", "Michel Platini scores from the penalty spot."], [92, "FRA", "Marius Trésor"], [98, "FRA", "Alain Giresse"], [102, "GER", "Karl-Heinz Rummenigge"], [108, "GER", "Klaus Fischer"]],
  51: [[13, "FRA", "René Girard"], [40, "POL", "Andrzej Szarmach"], [44, "POL", "Stefan Majewski"], [46, "POL", "Janusz Kupcewicz"], [72, "FRA", "Alain Couriol"]],
  52: [[57, "ITA", "Paolo Rossi"], [69, "ITA", "Marco Tardelli"], [81, "ITA", "Alessandro Altobelli"], [83, "GER", "Paul Breitner"]]
};

type YouTubeHighlightSeed = { videoId: string; sourceName: string };

// Every video matches the fixture teams and score and passed YouTube's real
// embed response with status OK and playableInEmbed=true on July 13, 2026.
const youtubeHighlightsByFixture: Record<number, YouTubeHighlightSeed> = {
  1: { videoId: "kdsDrHvqcEw", sourceName: "Football Flashback 6 highlights" },
  2: { videoId: "pNMGbyZfH_M", sourceName: "sp1873 highlights" },
  3: { videoId: "HJiJOmbt_cY", sourceName: "World Football Classics highlights" },
  4: { videoId: "O3YAipD4QPU", sourceName: "LoL Football highlights" },
  5: { videoId: "iXJTRImP0po", sourceName: "LND fOoTy Legend highlights" },
  6: { videoId: "H5N2U9Dwinc", sourceName: "World Football Classics highlights" },
  7: { videoId: "J1XjrS68EXY", sourceName: "Football Flashback 6 highlights" },
  8: { videoId: "sBhNi7fsS_0", sourceName: "pamemundial highlights" },
  9: { videoId: "BYYQ6tSaXKc", sourceName: "Football Flashback 6 highlights" },
  10: { videoId: "M1jlZrgCR0M", sourceName: "Football Flashback 6 highlights" },
  11: { videoId: "h-4cvhd7OWg", sourceName: "Football Flashback 6 highlights" },
  12: { videoId: "OMQqYftUxXs", sourceName: "Football Flashback 6 highlights" },
  13: { videoId: "pTXn-fpYu8w", sourceName: "Football Flashback 6 highlights" },
  14: { videoId: "ip6_w_Phqz8", sourceName: "Football Flashback 6 highlights" },
  15: { videoId: "NYxsjld-uyM", sourceName: "Football Flashback 6 highlights" },
  16: { videoId: "Gii4gOUB8U8", sourceName: "Football Flashback 6 highlights" },
  17: { videoId: "fU-Jfnr9HV8", sourceName: "Football Flashback 6 highlights" },
  18: { videoId: "XE_l75TSslo", sourceName: "World Football Classics highlights" },
  19: { videoId: "9jd-t8Rm23g", sourceName: "World Football Classics highlights" },
  20: { videoId: "RaK7wqoJNiE", sourceName: "ClassicEngland highlights" },
  21: { videoId: "KETZgIkahqA", sourceName: "World Football Classics highlights" },
  22: { videoId: "XLw6j2i2Dgk", sourceName: "Football Flashback 6 highlights" },
  23: { videoId: "hHrEaa6dVbc", sourceName: "Football Flashback 6 highlights" },
  24: { videoId: "eyqe7Oe5lWY", sourceName: "Football Flashback 6 highlights" },
  25: { videoId: "KM-y3po8--o", sourceName: "Football Flashback 6 highlights" },
  26: { videoId: "1olhL9fOCIg", sourceName: "Football Flashback 6 highlights" },
  27: { videoId: "P8oYTZezOyw", sourceName: "Football Flashback 6 highlights" },
  28: { videoId: "44t1PSl1qcg", sourceName: "Football Flashback 6 highlights" },
  29: { videoId: "5MqfmYhtaK0", sourceName: "Football Flashback 6 highlights" },
  30: { videoId: "WEu21rN7hdE", sourceName: "Football Flashback 6 highlights" },
  31: { videoId: "vXSvF6BcA24", sourceName: "Nostalgie du Football Algérien highlights" },
  32: { videoId: "2FjGgJGgCQ4", sourceName: "sp1873 highlights" },
  33: { videoId: "veiRargJBik", sourceName: "Football Flashback 6 highlights" },
  34: { videoId: "-FPxo_O4Krk", sourceName: "portoaffe2 highlights" },
  35: { videoId: "NJb7SygBIgU", sourceName: "Football Flashback 6 highlights" },
  36: { videoId: "QU5intjy6hM", sourceName: "Football Flashback 6 highlights" },
  37: { videoId: "8MABqOI8rho", sourceName: "Football Flashback 6 highlights" },
  38: { videoId: "2Nm7siig1SU", sourceName: "Sport Root highlights" },
  39: { videoId: "ReCyvs5alLs", sourceName: "Football Flashback 6 highlights" },
  40: { videoId: "mVA8pjl4pP4", sourceName: "Football Flashback 6 highlights" },
  41: { videoId: "7efPyF4Y9k8", sourceName: "Football Flashback 6 highlights" },
  42: { videoId: "5tG5zdEQNCA", sourceName: "World Football Classics highlights" },
  43: { videoId: "Zkdsl-QG0nw", sourceName: "Football Flashback 6 highlights" },
  44: { videoId: "HmhlzsAxg_o", sourceName: "World Football Classics highlights" },
  45: { videoId: "r6tyZl7L4Qk", sourceName: "Football Flashback 6 highlights" },
  46: { videoId: "RuxXBab3oeA", sourceName: "World Football Classics highlights" },
  47: { videoId: "delWgPN80aM", sourceName: "World Football Classics highlights" },
  48: { videoId: "Z8ZLzUUiq_E", sourceName: "Football Flashback 6 highlights" },
  49: { videoId: "DSM9wxegTZo", sourceName: "Football Flashback 6 highlights" },
  50: { videoId: "76PSNYP60dQ", sourceName: "Football Flashback 6 highlights" },
  51: { videoId: "trt05N115B0", sourceName: "Football Flashback 6 highlights" },
  52: { videoId: "PZaskSOIbLc", sourceName: "World Football Classics highlights" }
};

const fifaMatchIdsByFixture: Record<number, string> = {
  1: "749", 2: "995", 3: "791", 4: "833", 5: "896", 6: "1051",
  7: "741", 8: "878", 9: "901", 10: "764", 11: "1012", 12: "1044",
  13: "994", 14: "752", 15: "790", 16: "834", 17: "774", 18: "1054",
  19: "813", 20: "889", 21: "903", 22: "739", 23: "919", 24: "959",
  25: "1055", 26: "779", 27: "1071", 28: "828", 29: "751", 30: "789",
  31: "740", 32: "922", 33: "962", 34: "770", 35: "882", 36: "902",
  37: "767", 38: "782", 39: "753", 40: "879", 41: "771", 42: "783",
  43: "750", 44: "900", 45: "920", 46: "1058", 47: "788", 48: "877",
  49: "996", 50: "914", 51: "921", 52: "923"
};

function getFifaStageId(no: number) {
  if (no <= 36) return "293";
  if (no <= 48) return "294";
  if (no <= 50) return "295";
  if (no === 51) return "676";
  return "3475";
}

function getFifaMatchUrl(fixture: FixtureSeed) {
  return `https://www.fifa.com/en/match-centre/match/17/59/${getFifaStageId(fixture.no)}/${fifaMatchIdsByFixture[fixture.no]}?date=${fixture.date}`;
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
      id: `wc-1982-${String(fixture.no).padStart(2, "0")}-${fixture.home.toLowerCase()}-${fixture.away.toLowerCase()}`,
      tournamentId: "wc-1982",
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

export const worldCup1982: Tournament = {
  id: "wc-1982",
  competition: "WORLD_CUP",
  name: "Spain 1982",
  year: 1982,
  hosts: ["ESP"],
  teams: worldCup1982Groups.flatMap((group) => group.teams),
  groups: worldCup1982Groups,
  secondGroups: worldCup1982SecondGroups,
  teamCoordinates: worldCup1982TeamCoordinates,
  format: worldCup1982Format,
  stages: ["group", "group2", "sf", "third", "final"],
  status: "complete",
  mapView: { center: [-3.7, 40.2], zoom: 4.7, bearing: -7, pitch: 42 },
  venues,
  featuredRoute: venues.map((venue) => venue.id),
  matches
};
