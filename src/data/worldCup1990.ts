import { createOfficialReportHighlight, createYoutubeHighlight } from "@/data/highlights";
import { teamNames } from "@/data/teamMetadata";
import {
  worldCup1990Format,
  worldCup1990Groups,
  worldCup1990TeamCoordinates
} from "@/data/worldCup1990Experience";
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
  { id: "stadio-olimpico", name: "Stadio Olimpico", city: "Rome", country: "ITA", coordinates: [12.4547, 41.9339], bearing: -12, zoom: 16.4 },
  { id: "stadio-comunale", name: "Stadio Comunale", city: "Florence", country: "ITA", coordinates: [11.2823, 43.7808], bearing: 18 },
  { id: "stadio-san-paolo", name: "Stadio San Paolo", city: "Naples", country: "ITA", coordinates: [14.1931, 40.8279], bearing: -18 },
  { id: "stadio-san-nicola", name: "Stadio San Nicola", city: "Bari", country: "ITA", coordinates: [16.8403, 41.0847], bearing: 16 },
  { id: "stadio-delle-alpi", name: "Stadio delle Alpi", city: "Turin", country: "ITA", coordinates: [7.6413, 45.1096], bearing: -20 },
  { id: "stadio-luigi-ferraris", name: "Stadio Luigi Ferraris", city: "Genoa", country: "ITA", coordinates: [8.9527, 44.4164], bearing: 20 },
  { id: "san-siro", name: "San Siro", city: "Milan", country: "ITA", coordinates: [9.1239, 45.4781], bearing: -14, zoom: 16.45 },
  { id: "stadio-renato-dallara", name: "Stadio Renato Dall'Ara", city: "Bologna", country: "ITA", coordinates: [11.309, 44.4923], bearing: 14 },
  { id: "stadio-bentegodi", name: "Stadio Marcantonio Bentegodi", city: "Verona", country: "ITA", coordinates: [10.9687, 45.4353], bearing: -22 },
  { id: "stadio-friuli", name: "Stadio Friuli", city: "Udine", country: "ITA", coordinates: [13.1999, 46.0818], bearing: 22 },
  { id: "stadio-sant-elia", name: "Stadio Sant'Elia", city: "Cagliari", country: "ITA", coordinates: [9.1381, 39.1997], bearing: -16 },
  { id: "stadio-la-favorita", name: "Stadio La Favorita", city: "Palermo", country: "ITA", coordinates: [13.3425, 38.1527], bearing: 16 }
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

// Numbers follow FIFA's published final schedule. Fjelstul's chronological
// identifiers differ at 03/04, 14/15/16 and 29/30; those fixtures are remapped
// here to the numbers printed in FIFA's Italy 1990 Technical Report.
const fixtureSeeds: FixtureSeed[] = [
  { no: 1, stage: "group", date: "1990-06-08", venueId: "san-siro", home: "ARG", away: "CMR", score: { home: 0, away: 1 } },
  { no: 2, stage: "group", date: "1990-06-09", venueId: "stadio-san-nicola", home: "URS", away: "ROU", score: { home: 0, away: 2 } },
  { no: 3, stage: "group", date: "1990-06-09", venueId: "stadio-olimpico", home: "ITA", away: "AUT", score: { home: 1, away: 0 } },
  { no: 4, stage: "group", date: "1990-06-09", venueId: "stadio-renato-dallara", home: "UAE", away: "COL", score: { home: 0, away: 2 } },
  { no: 5, stage: "group", date: "1990-06-10", venueId: "stadio-comunale", home: "USA", away: "TCH", score: { home: 1, away: 5 } },
  { no: 6, stage: "group", date: "1990-06-10", venueId: "stadio-delle-alpi", home: "BRA", away: "SWE", score: { home: 2, away: 1 } },
  { no: 7, stage: "group", date: "1990-06-10", venueId: "san-siro", home: "GER", away: "YUG", score: { home: 4, away: 1 } },
  { no: 8, stage: "group", date: "1990-06-11", venueId: "stadio-luigi-ferraris", home: "CRC", away: "SCO", score: { home: 1, away: 0 } },
  { no: 9, stage: "group", date: "1990-06-11", venueId: "stadio-sant-elia", home: "ENG", away: "IRL", score: { home: 1, away: 1 } },
  { no: 10, stage: "group", date: "1990-06-12", venueId: "stadio-bentegodi", home: "BEL", away: "KOR", score: { home: 2, away: 0 } },
  { no: 11, stage: "group", date: "1990-06-12", venueId: "stadio-la-favorita", home: "NED", away: "EGY", score: { home: 1, away: 1 } },
  { no: 12, stage: "group", date: "1990-06-13", venueId: "stadio-friuli", home: "URU", away: "ESP", score: { home: 0, away: 0 } },
  { no: 13, stage: "group", date: "1990-06-13", venueId: "stadio-san-paolo", home: "ARG", away: "URS", score: { home: 2, away: 0 } },
  { no: 14, stage: "group", date: "1990-06-14", venueId: "stadio-renato-dallara", home: "YUG", away: "COL", score: { home: 1, away: 0 } },
  { no: 15, stage: "group", date: "1990-06-14", venueId: "stadio-olimpico", home: "ITA", away: "USA", score: { home: 1, away: 0 } },
  { no: 16, stage: "group", date: "1990-06-14", venueId: "stadio-san-nicola", home: "CMR", away: "ROU", score: { home: 2, away: 1 } },
  { no: 17, stage: "group", date: "1990-06-15", venueId: "stadio-comunale", home: "AUT", away: "TCH", score: { home: 0, away: 1 } },
  { no: 18, stage: "group", date: "1990-06-15", venueId: "san-siro", home: "GER", away: "UAE", score: { home: 5, away: 1 } },
  { no: 19, stage: "group", date: "1990-06-16", venueId: "stadio-delle-alpi", home: "BRA", away: "CRC", score: { home: 1, away: 0 } },
  { no: 20, stage: "group", date: "1990-06-16", venueId: "stadio-luigi-ferraris", home: "SWE", away: "SCO", score: { home: 1, away: 2 } },
  { no: 21, stage: "group", date: "1990-06-16", venueId: "stadio-sant-elia", home: "ENG", away: "NED", score: { home: 0, away: 0 } },
  { no: 22, stage: "group", date: "1990-06-17", venueId: "stadio-la-favorita", home: "IRL", away: "EGY", score: { home: 0, away: 0 } },
  { no: 23, stage: "group", date: "1990-06-17", venueId: "stadio-bentegodi", home: "BEL", away: "URU", score: { home: 3, away: 1 } },
  { no: 24, stage: "group", date: "1990-06-17", venueId: "stadio-friuli", home: "KOR", away: "ESP", score: { home: 1, away: 3 } },
  { no: 25, stage: "group", date: "1990-06-18", venueId: "stadio-san-paolo", home: "ARG", away: "ROU", score: { home: 1, away: 1 } },
  { no: 26, stage: "group", date: "1990-06-18", venueId: "stadio-san-nicola", home: "CMR", away: "URS", score: { home: 0, away: 4 } },
  { no: 27, stage: "group", date: "1990-06-19", venueId: "san-siro", home: "GER", away: "COL", score: { home: 1, away: 1 } },
  { no: 28, stage: "group", date: "1990-06-19", venueId: "stadio-renato-dallara", home: "YUG", away: "UAE", score: { home: 4, away: 1 } },
  { no: 29, stage: "group", date: "1990-06-19", venueId: "stadio-olimpico", home: "ITA", away: "TCH", score: { home: 2, away: 0 } },
  { no: 30, stage: "group", date: "1990-06-19", venueId: "stadio-comunale", home: "AUT", away: "USA", score: { home: 2, away: 1 } },
  { no: 31, stage: "group", date: "1990-06-20", venueId: "stadio-delle-alpi", home: "BRA", away: "SCO", score: { home: 1, away: 0 } },
  { no: 32, stage: "group", date: "1990-06-20", venueId: "stadio-luigi-ferraris", home: "SWE", away: "CRC", score: { home: 1, away: 2 } },
  { no: 33, stage: "group", date: "1990-06-21", venueId: "stadio-bentegodi", home: "BEL", away: "ESP", score: { home: 1, away: 2 } },
  { no: 34, stage: "group", date: "1990-06-21", venueId: "stadio-friuli", home: "KOR", away: "URU", score: { home: 0, away: 1 } },
  { no: 35, stage: "group", date: "1990-06-21", venueId: "stadio-sant-elia", home: "ENG", away: "EGY", score: { home: 1, away: 0 } },
  { no: 36, stage: "group", date: "1990-06-21", venueId: "stadio-la-favorita", home: "IRL", away: "NED", score: { home: 1, away: 1 } },
  { no: 37, stage: "r16", date: "1990-06-23", venueId: "stadio-san-paolo", home: "CMR", away: "COL", score: { home: 2, away: 1 }, durationMinutes: 120, note: "After extra time" },
  { no: 38, stage: "r16", date: "1990-06-23", venueId: "stadio-san-nicola", home: "TCH", away: "CRC", score: { home: 4, away: 1 } },
  { no: 39, stage: "r16", date: "1990-06-24", venueId: "stadio-delle-alpi", home: "BRA", away: "ARG", score: { home: 0, away: 1 } },
  { no: 40, stage: "r16", date: "1990-06-24", venueId: "san-siro", home: "GER", away: "NED", score: { home: 2, away: 1 } },
  { no: 41, stage: "r16", date: "1990-06-25", venueId: "stadio-luigi-ferraris", home: "IRL", away: "ROU", score: { home: 0, away: 0 }, shootout: { home: 5, away: 4 }, durationMinutes: 120, note: "Republic of Ireland won 5-4 on penalties" },
  { no: 42, stage: "r16", date: "1990-06-25", venueId: "stadio-olimpico", home: "ITA", away: "URU", score: { home: 2, away: 0 } },
  { no: 43, stage: "r16", date: "1990-06-26", venueId: "stadio-bentegodi", home: "ESP", away: "YUG", score: { home: 1, away: 2 }, durationMinutes: 120, note: "After extra time" },
  { no: 44, stage: "r16", date: "1990-06-26", venueId: "stadio-renato-dallara", home: "ENG", away: "BEL", score: { home: 1, away: 0 }, durationMinutes: 120, note: "After extra time" },
  { no: 45, stage: "qf", date: "1990-06-30", venueId: "stadio-comunale", home: "ARG", away: "YUG", score: { home: 0, away: 0 }, shootout: { home: 3, away: 2 }, durationMinutes: 120, note: "Argentina won 3-2 on penalties" },
  { no: 46, stage: "qf", date: "1990-06-30", venueId: "stadio-olimpico", home: "IRL", away: "ITA", score: { home: 0, away: 1 } },
  { no: 47, stage: "qf", date: "1990-07-01", venueId: "san-siro", home: "TCH", away: "GER", score: { home: 0, away: 1 } },
  { no: 48, stage: "qf", date: "1990-07-01", venueId: "stadio-san-paolo", home: "CMR", away: "ENG", score: { home: 2, away: 3 }, durationMinutes: 120, note: "After extra time" },
  { no: 49, stage: "sf", date: "1990-07-03", venueId: "stadio-san-paolo", home: "ARG", away: "ITA", score: { home: 1, away: 1 }, shootout: { home: 4, away: 3 }, durationMinutes: 120, note: "Argentina won 4-3 on penalties" },
  { no: 50, stage: "sf", date: "1990-07-04", venueId: "stadio-delle-alpi", home: "GER", away: "ENG", score: { home: 1, away: 1 }, shootout: { home: 4, away: 3 }, durationMinutes: 120, note: "West Germany won 4-3 on penalties" },
  { no: 51, stage: "third", date: "1990-07-07", venueId: "stadio-san-nicola", home: "ITA", away: "ENG", score: { home: 2, away: 1 } },
  { no: 52, stage: "final", date: "1990-07-08", venueId: "stadio-olimpico", home: "GER", away: "ARG", score: { home: 1, away: 0 } }
];

// Scorer identity and minute labels follow the Fjelstul World Cup Database,
// remapped to FIFA's official match numbers. Shootout kicks are excluded.
const goalsByFixture: Partial<Record<number, GoalSeed[]>> = {
  1: [[67, "CMR", "François Omam-Biyik"]],
  2: [[41, "ROU", "Marius Lăcătuș"], [55, "ROU", "Marius Lăcătuș", "Marius Lăcătuș scores from the penalty spot."]],
  3: [[78, "ITA", "Salvatore Schillaci"]],
  4: [[50, "COL", "Bernardo Redín"], [85, "COL", "Carlos Valderrama"]],
  5: [[26, "TCH", "Tomáš Skuhravý"], [40, "TCH", "Michal Bílek", "Michal Bílek scores from the penalty spot."], [50, "TCH", "Ivan Hašek"], [60, "USA", "Paul Caligiuri"], [78, "TCH", "Tomáš Skuhravý"], [90, "TCH", "Milan Luhový", "Milan Luhový scores in second-half stoppage time."]],
  6: [[40, "BRA", "Careca"], [63, "BRA", "Careca"], [79, "SWE", "Tomas Brolin"]],
  7: [[28, "GER", "Lothar Matthäus"], [39, "GER", "Jürgen Klinsmann"], [55, "YUG", "Davor Jozić"], [64, "GER", "Lothar Matthäus"], [70, "GER", "Rudi Völler"]],
  8: [[49, "CRC", "Juan Cayasso"]],
  9: [[9, "ENG", "Gary Lineker"], [73, "IRL", "Kevin Sheedy"]],
  10: [[53, "BEL", "Marc Degryse"], [64, "BEL", "Michel De Wolf"]],
  11: [[58, "NED", "Wim Kieft"], [83, "EGY", "Magdi Abdelghani", "Magdi Abdelghani scores from the penalty spot."]],
  13: [[27, "ARG", "Pedro Troglio"], [79, "ARG", "Jorge Burruchaga"]],
  14: [[75, "YUG", "Davor Jozić"]],
  15: [[11, "ITA", "Giuseppe Giannini"]],
  16: [[76, "CMR", "Roger Milla"], [86, "CMR", "Roger Milla"], [88, "ROU", "Gabi Balint"]],
  17: [[31, "TCH", "Michal Bílek", "Michal Bílek scores from the penalty spot."]],
  18: [[35, "GER", "Rudi Völler"], [37, "GER", "Jürgen Klinsmann"], [46, "UAE", "Khalid Ismaïl"], [47, "GER", "Lothar Matthäus"], [58, "GER", "Uwe Bein"], [75, "GER", "Rudi Völler"]],
  19: [[33, "BRA", "Müller"]],
  20: [[11, "SCO", "Stuart McCall"], [81, "SCO", "Mo Johnston", "Mo Johnston scores from the penalty spot."], [86, "SWE", "Glenn Strömberg"]],
  23: [[15, "BEL", "Leo Clijsters"], [24, "BEL", "Enzo Scifo"], [47, "BEL", "Jan Ceulemans"], [73, "URU", "Pablo Bengoechea"]],
  24: [[23, "ESP", "Míchel"], [43, "KOR", "Kwan Hwangbo"], [61, "ESP", "Míchel"], [81, "ESP", "Míchel"]],
  25: [[62, "ARG", "Pedro Monzón"], [68, "ROU", "Gabi Balint"]],
  26: [[20, "URS", "Oleh Protasov"], [29, "URS", "Andrei Zygmantovich"], [52, "URS", "Oleksandr Zavarov"], [63, "URS", "Igor Dobrovolski"]],
  27: [[88, "GER", "Pierre Littbarski"], [90, "COL", "Freddy Rincón", "Freddy Rincón scores in second-half stoppage time."]],
  28: [[5, "YUG", "Safet Sušić"], [9, "YUG", "Darko Pančev"], [22, "UAE", "Ali Thani Jumaa"], [46, "YUG", "Darko Pančev"], [90, "YUG", "Robert Prosinečki", "Robert Prosinečki scores in second-half stoppage time."]],
  29: [[9, "ITA", "Salvatore Schillaci"], [78, "ITA", "Roberto Baggio"]],
  30: [[49, "AUT", "Andreas Ogris"], [63, "AUT", "Gerhard Rodax"], [83, "USA", "Bruce Murray"]],
  31: [[81, "BRA", "Müller"]],
  32: [[32, "SWE", "Johnny Ekström"], [75, "CRC", "Róger Flores"], [87, "CRC", "Hernán Medford"]],
  33: [[26, "ESP", "Míchel", "Míchel scores from the penalty spot."], [29, "BEL", "Patrick Vervoort"], [38, "ESP", "Alberto Górriz"]],
  34: [[90, "URU", "Daniel Fonseca", "Daniel Fonseca scores in second-half stoppage time."]],
  35: [[58, "ENG", "Mark Wright"]],
  36: [[11, "NED", "Ruud Gullit"], [71, "IRL", "Niall Quinn"]],
  37: [[106, "CMR", "Roger Milla"], [108, "CMR", "Roger Milla"], [115, "COL", "Bernardo Redín"]],
  38: [[12, "TCH", "Tomáš Skuhravý"], [55, "CRC", "Rónald González Brenes"], [63, "TCH", "Tomáš Skuhravý"], [76, "TCH", "Luboš Kubík"], [82, "TCH", "Tomáš Skuhravý"]],
  39: [[81, "ARG", "Claudio Caniggia"]],
  40: [[51, "GER", "Jürgen Klinsmann"], [85, "GER", "Andreas Brehme"], [89, "NED", "Ronald Koeman", "Ronald Koeman scores from the penalty spot."]],
  42: [[65, "ITA", "Salvatore Schillaci"], [83, "ITA", "Aldo Serena"]],
  43: [[78, "YUG", "Dragan Stojković"], [84, "ESP", "Julio Salinas"], [93, "YUG", "Dragan Stojković"]],
  44: [[119, "ENG", "David Platt"]],
  46: [[38, "ITA", "Salvatore Schillaci"]],
  47: [[25, "GER", "Lothar Matthäus", "Lothar Matthäus scores from the penalty spot."]],
  48: [[25, "ENG", "David Platt"], [61, "CMR", "Emmanuel Kundé", "Emmanuel Kundé scores from the penalty spot."], [65, "CMR", "Eugène Ekéké"], [83, "ENG", "Gary Lineker", "Gary Lineker scores from the penalty spot."], [105, "ENG", "Gary Lineker", "Gary Lineker scores from the penalty spot."]],
  49: [[17, "ITA", "Salvatore Schillaci"], [67, "ARG", "Claudio Caniggia"]],
  50: [[60, "GER", "Andreas Brehme"], [80, "ENG", "Gary Lineker"]],
  51: [[71, "ITA", "Roberto Baggio"], [81, "ENG", "David Platt"], [86, "ITA", "Salvatore Schillaci", "Salvatore Schillaci scores from the penalty spot."]],
  52: [[85, "GER", "Andreas Brehme", "Andreas Brehme scores from the penalty spot."]]
};

type YouTubeHighlightSeed = {
  videoId: string;
  sourceName: string;
};

// Keys follow the match numbers printed in FIFA's Italy 1990 Technical Report,
// including the fixtures whose chronological database IDs differ. Every video
// matches the teams and score and passed YouTube's real embed response with
// status OK and playableInEmbed=true.
const youtubeHighlightsByFixture: Record<number, YouTubeHighlightSeed> = {
  1: { videoId: "T46HbbFvpa4", sourceName: "VintageHDtv highlights" },
  2: { videoId: "LcXsADVnwRI", sourceName: "Tikitaka.ro highlights" },
  3: { videoId: "noJ-U-vF-No", sourceName: "Mr Soccer highlights" },
  4: { videoId: "M_wwnETMdHU", sourceName: "RosenTV highlights" },
  5: { videoId: "W4PZa1Zo10c", sourceName: "Mr Soccer highlights" },
  6: { videoId: "nzH6mJT5H7w", sourceName: "greensterRox highlights" },
  7: { videoId: "u-D5ThcIDcE", sourceName: "Football Flashback 6 highlights" },
  8: { videoId: "aARMQvgxA5E", sourceName: "Football Flashback 6 highlights" },
  9: { videoId: "mDOEgDl1fbA", sourceName: "Football Flashback 6 highlights" },
  10: { videoId: "W9k6hNfoYo8", sourceName: "greensterRox highlights" },
  11: { videoId: "wDyGYqVh_iQ", sourceName: "Ahmed Zidan highlights" },
  12: { videoId: "vIupPsRo1J8", sourceName: "Football Flashback 6 highlights" },
  13: { videoId: "BFiHRDjf8iQ", sourceName: "Football Flashback 6 highlights" },
  14: { videoId: "WYAgSpY2Bz4", sourceName: "Football Flashback 6 highlights" },
  15: { videoId: "2wxga6bQNa0", sourceName: "FootRetro006 highlights" },
  16: { videoId: "UExiDxMwwDY", sourceName: "Football Flashback 6 highlights" },
  17: { videoId: "GxjfJfK4MmM", sourceName: "Mi Videoteca highlights" },
  18: { videoId: "FhmihHDAptE", sourceName: "greensterRox highlights" },
  19: { videoId: "Ox8sfocvl0k", sourceName: "Football Flashback 6 highlights" },
  20: { videoId: "QGHoLG3UMEA", sourceName: "Football Flashback 6 highlights" },
  21: { videoId: "zY7BpvTwCp4", sourceName: "VintageHDtv highlights" },
  22: { videoId: "X3GeTQ21nxE", sourceName: "CuChoileain highlights" },
  23: { videoId: "qtILBG9sYkc", sourceName: "RosenTV highlights" },
  24: { videoId: "E5FfcNDi_Ow", sourceName: "Football Flashback 6 highlights" },
  25: { videoId: "LPQuxtvw9mA", sourceName: "Football Flashback 6 highlights" },
  26: { videoId: "ELvF7dNzsC8", sourceName: "Africa Supporters League highlights" },
  27: { videoId: "x3oqhQhl92o", sourceName: "jakovlevic highlights" },
  28: { videoId: "1NLkmGZeZrc", sourceName: "Tiago Miguel Oliveira dos Santos highlights" },
  29: { videoId: "tcm7YyV5qrI", sourceName: "sp1873 highlights" },
  30: { videoId: "y7t5Mp9KS84", sourceName: "Caderno de Esportes highlights" },
  31: { videoId: "7faU8Akc_bA", sourceName: "greensterRox highlights" },
  32: { videoId: "YhccTarTG8Q", sourceName: "sp1873 highlights" },
  33: { videoId: "5mwjhFj9Vpo", sourceName: "greensterRox highlights" },
  34: { videoId: "kfHUGfECapU", sourceName: "LND fOoTy Legend highlights" },
  35: { videoId: "sVezZ3tZX6U", sourceName: "ClassicEngland highlights" },
  36: { videoId: "XfhAtLllnxE", sourceName: "Glory Of Oranje highlights" },
  37: { videoId: "x16llCQfpF8", sourceName: "wwwallworldcupgoals highlights" },
  38: { videoId: "N9MFM3RC9l0", sourceName: "Football Flashback 6 highlights" },
  39: { videoId: "BmWPolw_P_8", sourceName: "Football Flashback 6 highlights" },
  40: { videoId: "kekUAM0FkI8", sourceName: "VintageHDtv highlights" },
  41: { videoId: "eN54GFv-y8c", sourceName: "Football Flashback 6 highlights" },
  42: { videoId: "iuvbJ6f4J_U", sourceName: "Football Flashback 6 highlights" },
  43: { videoId: "k3EK4JLImm0", sourceName: "Football Flashback 6 highlights" },
  44: { videoId: "BHq4Jydj4oY", sourceName: "Football Flashback 6 highlights" },
  45: { videoId: "zj7jo6XkbDM", sourceName: "Football Flashback 6 highlights" },
  46: { videoId: "ehB89vb5v5Y", sourceName: "Football Flashback 6 highlights" },
  47: { videoId: "-iojbZM5aPg", sourceName: "Football Flashback 6 highlights" },
  48: { videoId: "6Y_jtbM0G-s", sourceName: "Football Flashback 6 highlights" },
  49: { videoId: "Y0a9DLqMWQ0", sourceName: "Football Flashback 6 highlights" },
  50: { videoId: "S1tEA3Oya7g", sourceName: "KKTott18 highlights" },
  51: { videoId: "QjapBZ-JlyY", sourceName: "Football Flashback 6 highlights" },
  52: { videoId: "RG7SaUhHJ8E", sourceName: "Football Flashback 6 highlights" }
};

const fifaMatchIdsByFixture: Record<number, string> = {
  1: "26", 2: "342", 3: "42", 4: "119", 5: "355", 6: "75",
  7: "201", 8: "127", 9: "161", 10: "57", 11: "151", 12: "180",
  13: "30", 14: "120", 15: "265", 16: "108", 17: "43", 18: "198",
  19: "73", 20: "348", 21: "160", 22: "152", 23: "66", 24: "175",
  25: "29", 26: "111", 27: "114", 28: "364", 29: "263", 30: "48",
  31: "74", 32: "128", 33: "56", 34: "290", 35: "150", 36: "228",
  37: "102", 38: "129", 39: "25", 40: "196", 41: "248", 42: "264",
  43: "181", 44: "55", 45: "31", 46: "243", 47: "197", 48: "103",
  49: "28", 50: "159", 51: "162", 52: "27"
};

function getFifaRoundId(no: number) {
  if (no <= 36) return "322";
  if (no <= 44) return "323";
  if (no <= 48) return "751";
  if (no <= 50) return "3464";
  if (no === 51) return "3463";
  return "3462";
}

function getFifaMatchUrl(fixture: FixtureSeed) {
  const roundId = getFifaRoundId(fixture.no);
  const matchId = fifaMatchIdsByFixture[fixture.no];
  return `https://www.fifa.com/en/match-centre/match/17/76/${roundId}/${matchId}?date=${fixture.date}`;
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
      id: `wc-1990-${String(fixture.no).padStart(2, "0")}-${fixture.home.toLowerCase()}-${fixture.away.toLowerCase()}`,
      tournamentId: "wc-1990",
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

export const worldCup1990: Tournament = {
  id: "wc-1990",
  competition: "WORLD_CUP",
  name: "Italy 1990",
  year: 1990,
  hosts: ["ITA"],
  teams: worldCup1990Groups.flatMap((group) => group.teams),
  groups: worldCup1990Groups,
  teamCoordinates: worldCup1990TeamCoordinates,
  format: worldCup1990Format,
  stages: ["group", "r16", "qf", "sf", "third", "final"],
  status: "complete",
  mapView: {
    center: [12.5, 42.4],
    zoom: 4.25,
    bearing: -8,
    pitch: 42
  },
  venues,
  featuredRoute: venues.map((venue) => venue.id),
  matches
};
