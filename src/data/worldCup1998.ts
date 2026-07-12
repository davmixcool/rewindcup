import { createOfficialReportHighlight, createYoutubeHighlight } from "@/data/highlights";
import { teamNames } from "@/data/teamMetadata";
import {
  worldCup1998Format,
  worldCup1998Groups,
  worldCup1998TeamCoordinates
} from "@/data/worldCup1998Experience";
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
  { id: "stade-de-france", name: "Stade de France", city: "Saint-Denis", country: "FRA", coordinates: [2.3601, 48.9245], bearing: -16, zoom: 16.35 },
  { id: "parc-des-princes", name: "Parc des Princes", city: "Paris", country: "FRA", coordinates: [2.2529, 48.8414], bearing: 18, zoom: 16.45 },
  { id: "stade-felix-bollaert", name: "Stade Félix-Bollaert", city: "Lens", country: "FRA", coordinates: [2.815, 50.4329], bearing: -18 },
  { id: "stade-de-gerland", name: "Stade de Gerland", city: "Lyon", country: "FRA", coordinates: [4.8321, 45.7237], bearing: 20 },
  { id: "stade-geoffroy-guichard", name: "Stade Geoffroy-Guichard", city: "Saint-Étienne", country: "FRA", coordinates: [4.3903, 45.4608], bearing: -20 },
  { id: "stade-velodrome", name: "Stade Vélodrome", city: "Marseille", country: "FRA", coordinates: [5.3959, 43.2698], bearing: 22, zoom: 16.45 },
  { id: "stade-de-la-mosson", name: "Stade de la Mosson", city: "Montpellier", country: "FRA", coordinates: [3.8121, 43.6222], bearing: -16 },
  { id: "stadium-de-toulouse", name: "Stade de Toulouse", city: "Toulouse", country: "FRA", coordinates: [1.434, 43.5833], bearing: 16 },
  { id: "stade-du-parc-lescure", name: "Stade du Parc Lescure", city: "Bordeaux", country: "FRA", coordinates: [-0.598, 44.829], bearing: -22 },
  { id: "stade-de-la-beaujoire", name: "Stade de la Beaujoire", city: "Nantes", country: "FRA", coordinates: [-1.5254, 47.2556], bearing: 20 }
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

// FIFA's final schedule numbers differ from simple kickoff chronology for
// several same-day fixtures. The keys below follow the published match numbers.
const fixtureSeeds: FixtureSeed[] = [
  { no: 1, stage: "group", date: "1998-06-10", venueId: "stade-de-france", home: "BRA", away: "SCO", score: { home: 2, away: 1 } },
  { no: 2, stage: "group", date: "1998-06-10", venueId: "stade-de-la-mosson", home: "MAR", away: "NOR", score: { home: 2, away: 2 } },
  { no: 3, stage: "group", date: "1998-06-11", venueId: "stadium-de-toulouse", home: "CMR", away: "AUT", score: { home: 1, away: 1 } },
  { no: 4, stage: "group", date: "1998-06-11", venueId: "stade-du-parc-lescure", home: "ITA", away: "CHI", score: { home: 2, away: 2 } },
  { no: 5, stage: "group", date: "1998-06-12", venueId: "stade-felix-bollaert", home: "KSA", away: "DEN", score: { home: 0, away: 1 } },
  { no: 6, stage: "group", date: "1998-06-12", venueId: "stade-velodrome", home: "FRA", away: "RSA", score: { home: 3, away: 0 } },
  { no: 7, stage: "group", date: "1998-06-12", venueId: "stade-de-la-mosson", home: "PAR", away: "BUL", score: { home: 0, away: 0 } },
  { no: 8, stage: "group", date: "1998-06-13", venueId: "stade-de-france", home: "NED", away: "BEL", score: { home: 0, away: 0 } },
  { no: 9, stage: "group", date: "1998-06-13", venueId: "stade-de-gerland", home: "KOR", away: "MEX", score: { home: 1, away: 3 } },
  { no: 10, stage: "group", date: "1998-06-13", venueId: "stade-de-la-beaujoire", home: "ESP", away: "NGA", score: { home: 2, away: 3 } },
  { no: 11, stage: "group", date: "1998-06-14", venueId: "stade-felix-bollaert", home: "JAM", away: "CRO", score: { home: 1, away: 3 } },
  { no: 12, stage: "group", date: "1998-06-14", venueId: "stade-geoffroy-guichard", home: "YUG", away: "IRN", score: { home: 1, away: 0 } },
  { no: 13, stage: "group", date: "1998-06-14", venueId: "stadium-de-toulouse", home: "ARG", away: "JPN", score: { home: 1, away: 0 } },
  { no: 14, stage: "group", date: "1998-06-15", venueId: "parc-des-princes", home: "GER", away: "USA", score: { home: 2, away: 0 } },
  { no: 15, stage: "group", date: "1998-06-15", venueId: "stade-de-gerland", home: "ROU", away: "COL", score: { home: 1, away: 0 } },
  { no: 16, stage: "group", date: "1998-06-15", venueId: "stade-velodrome", home: "ENG", away: "TUN", score: { home: 2, away: 0 } },
  { no: 17, stage: "group", date: "1998-06-16", venueId: "stade-du-parc-lescure", home: "SCO", away: "NOR", score: { home: 1, away: 1 } },
  { no: 18, stage: "group", date: "1998-06-16", venueId: "stade-de-la-beaujoire", home: "BRA", away: "MAR", score: { home: 3, away: 0 } },
  { no: 19, stage: "group", date: "1998-06-17", venueId: "stade-geoffroy-guichard", home: "CHI", away: "AUT", score: { home: 1, away: 1 } },
  { no: 20, stage: "group", date: "1998-06-17", venueId: "stade-de-la-mosson", home: "ITA", away: "CMR", score: { home: 3, away: 0 } },
  { no: 21, stage: "group", date: "1998-06-18", venueId: "stade-de-france", home: "FRA", away: "KSA", score: { home: 4, away: 0 } },
  { no: 22, stage: "group", date: "1998-06-18", venueId: "stadium-de-toulouse", home: "RSA", away: "DEN", score: { home: 1, away: 1 } },
  { no: 23, stage: "group", date: "1998-06-19", venueId: "parc-des-princes", home: "NGA", away: "BUL", score: { home: 1, away: 0 } },
  { no: 24, stage: "group", date: "1998-06-19", venueId: "stade-geoffroy-guichard", home: "ESP", away: "PAR", score: { home: 0, away: 0 } },
  { no: 25, stage: "group", date: "1998-06-20", venueId: "stade-velodrome", home: "NED", away: "KOR", score: { home: 5, away: 0 } },
  { no: 26, stage: "group", date: "1998-06-20", venueId: "stade-du-parc-lescure", home: "BEL", away: "MEX", score: { home: 2, away: 2 } },
  { no: 27, stage: "group", date: "1998-06-20", venueId: "stade-de-la-beaujoire", home: "JPN", away: "CRO", score: { home: 0, away: 1 } },
  { no: 28, stage: "group", date: "1998-06-21", venueId: "parc-des-princes", home: "ARG", away: "JAM", score: { home: 5, away: 0 } },
  { no: 29, stage: "group", date: "1998-06-21", venueId: "stade-felix-bollaert", home: "GER", away: "YUG", score: { home: 2, away: 2 } },
  { no: 30, stage: "group", date: "1998-06-21", venueId: "stade-de-gerland", home: "USA", away: "IRN", score: { home: 1, away: 2 } },
  { no: 31, stage: "group", date: "1998-06-22", venueId: "stade-de-la-mosson", home: "COL", away: "TUN", score: { home: 1, away: 0 } },
  { no: 32, stage: "group", date: "1998-06-22", venueId: "stadium-de-toulouse", home: "ROU", away: "ENG", score: { home: 2, away: 1 } },
  { no: 33, stage: "group", date: "1998-06-23", venueId: "stade-de-france", home: "ITA", away: "AUT", score: { home: 2, away: 1 } },
  { no: 34, stage: "group", date: "1998-06-23", venueId: "stade-geoffroy-guichard", home: "SCO", away: "MAR", score: { home: 0, away: 3 } },
  { no: 35, stage: "group", date: "1998-06-23", venueId: "stade-velodrome", home: "BRA", away: "NOR", score: { home: 1, away: 2 } },
  { no: 36, stage: "group", date: "1998-06-23", venueId: "stade-de-la-beaujoire", home: "CHI", away: "CMR", score: { home: 1, away: 1 } },
  { no: 37, stage: "group", date: "1998-06-24", venueId: "stade-felix-bollaert", home: "ESP", away: "BUL", score: { home: 6, away: 1 } },
  { no: 38, stage: "group", date: "1998-06-24", venueId: "stade-de-gerland", home: "FRA", away: "DEN", score: { home: 2, away: 1 } },
  { no: 39, stage: "group", date: "1998-06-24", venueId: "stadium-de-toulouse", home: "NGA", away: "PAR", score: { home: 1, away: 3 } },
  { no: 40, stage: "group", date: "1998-06-24", venueId: "stade-du-parc-lescure", home: "RSA", away: "KSA", score: { home: 2, away: 2 } },
  { no: 41, stage: "group", date: "1998-06-25", venueId: "parc-des-princes", home: "BEL", away: "KOR", score: { home: 1, away: 1 } },
  { no: 42, stage: "group", date: "1998-06-25", venueId: "stade-geoffroy-guichard", home: "NED", away: "MEX", score: { home: 2, away: 2 } },
  { no: 43, stage: "group", date: "1998-06-25", venueId: "stade-de-la-mosson", home: "GER", away: "IRN", score: { home: 2, away: 0 } },
  { no: 44, stage: "group", date: "1998-06-25", venueId: "stade-de-la-beaujoire", home: "USA", away: "YUG", score: { home: 0, away: 1 } },
  { no: 45, stage: "group", date: "1998-06-26", venueId: "stade-de-france", home: "ROU", away: "TUN", score: { home: 1, away: 1 } },
  { no: 46, stage: "group", date: "1998-06-26", venueId: "stade-felix-bollaert", home: "COL", away: "ENG", score: { home: 0, away: 2 } },
  { no: 47, stage: "group", date: "1998-06-26", venueId: "stade-de-gerland", home: "JPN", away: "JAM", score: { home: 1, away: 2 } },
  { no: 48, stage: "group", date: "1998-06-26", venueId: "stade-du-parc-lescure", home: "ARG", away: "CRO", score: { home: 1, away: 0 } },
  { no: 49, stage: "r16", date: "1998-06-27", venueId: "parc-des-princes", home: "BRA", away: "CHI", score: { home: 4, away: 1 } },
  { no: 50, stage: "r16", date: "1998-06-27", venueId: "stade-velodrome", home: "ITA", away: "NOR", score: { home: 1, away: 0 } },
  { no: 51, stage: "r16", date: "1998-06-28", venueId: "stade-de-france", home: "NGA", away: "DEN", score: { home: 1, away: 4 } },
  { no: 52, stage: "r16", date: "1998-06-28", venueId: "stade-felix-bollaert", home: "FRA", away: "PAR", score: { home: 1, away: 0 }, durationMinutes: 120, note: "After extra time (golden goal)" },
  { no: 53, stage: "r16", date: "1998-06-29", venueId: "stade-de-la-mosson", home: "GER", away: "MEX", score: { home: 2, away: 1 } },
  { no: 54, stage: "r16", date: "1998-06-29", venueId: "stadium-de-toulouse", home: "NED", away: "YUG", score: { home: 2, away: 1 } },
  { no: 55, stage: "r16", date: "1998-06-30", venueId: "stade-geoffroy-guichard", home: "ARG", away: "ENG", score: { home: 2, away: 2 }, shootout: { home: 4, away: 3 }, durationMinutes: 120, note: "Argentina won 4-3 on penalties" },
  { no: 56, stage: "r16", date: "1998-06-30", venueId: "stade-du-parc-lescure", home: "ROU", away: "CRO", score: { home: 0, away: 1 } },
  { no: 57, stage: "qf", date: "1998-07-03", venueId: "stade-de-france", home: "ITA", away: "FRA", score: { home: 0, away: 0 }, shootout: { home: 3, away: 4 }, durationMinutes: 120, note: "France won 4-3 on penalties" },
  { no: 58, stage: "qf", date: "1998-07-03", venueId: "stade-de-la-beaujoire", home: "BRA", away: "DEN", score: { home: 3, away: 2 } },
  { no: 59, stage: "qf", date: "1998-07-04", venueId: "stade-de-gerland", home: "GER", away: "CRO", score: { home: 0, away: 3 } },
  { no: 60, stage: "qf", date: "1998-07-04", venueId: "stade-velodrome", home: "NED", away: "ARG", score: { home: 2, away: 1 } },
  { no: 61, stage: "sf", date: "1998-07-07", venueId: "stade-velodrome", home: "BRA", away: "NED", score: { home: 1, away: 1 }, shootout: { home: 4, away: 2 }, durationMinutes: 120, note: "Brazil won 4-2 on penalties" },
  { no: 62, stage: "sf", date: "1998-07-08", venueId: "stade-de-france", home: "FRA", away: "CRO", score: { home: 2, away: 1 } },
  { no: 63, stage: "third", date: "1998-07-11", venueId: "parc-des-princes", home: "NED", away: "CRO", score: { home: 1, away: 2 } },
  { no: 64, stage: "final", date: "1998-07-12", venueId: "stade-de-france", home: "BRA", away: "FRA", score: { home: 0, away: 3 } }
];

// Scorers and minute labels follow the Fjelstul World Cup Database and were
// remapped to FIFA's official match numbers above. Added-time goals retain the
// regulation minute so replay ordering remains compatible with later cups.
const goalsByFixture: Partial<Record<number, GoalSeed[]>> = {
  1: [[5, "BRA", "César Sampaio"], [38, "SCO", "John Collins", "John Collins scores from the penalty spot."], [74, "BRA", "Tom Boyd own goal", "Tom Boyd turns the ball into their own net."]],
  2: [[37, "MAR", "Mustapha Hadji"], [45, "NOR", "Youssef Chippo own goal", "Youssef Chippo turns the ball into their own net in first-half stoppage time."], [60, "MAR", "Abdeljalil Hadda"], [61, "NOR", "Dan Eggen"]],
  3: [[77, "CMR", "Pierre Njanka"], [90, "AUT", "Toni Polster", "Toni Polster scores in second-half stoppage time."]],
  4: [[10, "ITA", "Christian Vieri"], [45, "CHI", "Marcelo Salas", "Marcelo Salas scores in first-half stoppage time."], [50, "CHI", "Marcelo Salas"], [84, "ITA", "Roberto Baggio", "Roberto Baggio scores from the penalty spot."]],
  5: [[69, "DEN", "Marc Rieper"]],
  6: [[35, "FRA", "Christophe Dugarry"], [77, "FRA", "Pierre Issa own goal", "Pierre Issa turns the ball into their own net."], [90, "FRA", "Thierry Henry", "Thierry Henry scores in second-half stoppage time."]],
  9: [[27, "KOR", "Seok-ju Ha"], [50, "MEX", "Ricardo Peláez"], [75, "MEX", "Luis Hernández"], [84, "MEX", "Luis Hernández"]],
  10: [[21, "ESP", "Fernando Hierro"], [24, "NGA", "Mutiu Adepoju"], [47, "ESP", "Raúl"], [73, "NGA", "Andoni Zubizarreta own goal", "Andoni Zubizarreta turns the ball into their own net."], [78, "NGA", "Sunday Oliseh"]],
  11: [[27, "CRO", "Mario Stanić"], [45, "JAM", "Robbie Earle"], [53, "CRO", "Robert Prosinečki"], [69, "CRO", "Davor Šuker"]],
  12: [[73, "YUG", "Siniša Mihajlović"]],
  13: [[28, "ARG", "Gabriel Batistuta"]],
  14: [[9, "GER", "Andreas Möller"], [65, "GER", "Jürgen Klinsmann"]],
  15: [[45, "ROU", "Adrian Ilie", "Adrian Ilie scores in first-half stoppage time."]],
  16: [[42, "ENG", "Alan Shearer"], [89, "ENG", "Paul Scholes"]],
  17: [[46, "NOR", "Håvard Flo"], [66, "SCO", "Craig Burley"]],
  18: [[9, "BRA", "Ronaldo"], [45, "BRA", "Rivaldo", "Rivaldo scores in first-half stoppage time."], [50, "BRA", "Bebeto"]],
  19: [[70, "CHI", "Marcelo Salas"], [90, "AUT", "Ivica Vastić", "Ivica Vastić scores in second-half stoppage time."]],
  20: [[7, "ITA", "Luigi Di Biagio"], [75, "ITA", "Christian Vieri"], [89, "ITA", "Christian Vieri"]],
  21: [[37, "FRA", "Thierry Henry"], [68, "FRA", "David Trezeguet"], [78, "FRA", "Thierry Henry"], [85, "FRA", "Bixente Lizarazu"]],
  22: [[12, "DEN", "Allan Nielsen"], [51, "RSA", "Benni McCarthy"]],
  23: [[28, "NGA", "Victor Ikpeba"]],
  25: [[37, "NED", "Phillip Cocu"], [41, "NED", "Marc Overmars"], [71, "NED", "Dennis Bergkamp"], [80, "NED", "Pierre van Hooijdonk"], [83, "NED", "Ronald de Boer"]],
  26: [[42, "BEL", "Marc Wilmots"], [47, "BEL", "Marc Wilmots"], [55, "MEX", "Alberto García Aspe", "Alberto García Aspe scores from the penalty spot."], [62, "MEX", "Cuauhtémoc Blanco"]],
  27: [[77, "CRO", "Davor Šuker"]],
  28: [[31, "ARG", "Ariel Ortega"], [55, "ARG", "Ariel Ortega"], [73, "ARG", "Gabriel Batistuta"], [78, "ARG", "Gabriel Batistuta"], [83, "ARG", "Gabriel Batistuta", "Gabriel Batistuta scores from the penalty spot."]],
  29: [[13, "YUG", "Predrag Mijatović"], [52, "YUG", "Dragan Stojković"], [72, "GER", "Siniša Mihajlović own goal", "Siniša Mihajlović turns the ball into their own net."], [78, "GER", "Oliver Bierhoff"]],
  30: [[40, "IRN", "Hamid Estili"], [84, "IRN", "Mehdi Mahdavikia"], [87, "USA", "Brian McBride"]],
  31: [[82, "COL", "Léider Preciado"]],
  32: [[46, "ROU", "Viorel Moldovan"], [81, "ENG", "Michael Owen"], [90, "ROU", "Dan Petrescu"]],
  33: [[48, "ITA", "Christian Vieri"], [90, "ITA", "Roberto Baggio"], [90, "AUT", "Andi Herzog", "Andi Herzog scores from the penalty spot in second-half stoppage time."]],
  34: [[23, "MAR", "Salaheddine Bassir"], [46, "MAR", "Abdeljalil Hadda"], [85, "MAR", "Salaheddine Bassir"]],
  35: [[78, "BRA", "Bebeto"], [83, "NOR", "Tore André Flo"], [89, "NOR", "Kjetil Rekdal", "Kjetil Rekdal scores from the penalty spot."]],
  36: [[20, "CHI", "José Luis Sierra"], [56, "CMR", "Patrick M'Boma"]],
  37: [[6, "ESP", "Fernando Hierro", "Fernando Hierro scores from the penalty spot."], [18, "ESP", "Luis Enrique"], [55, "ESP", "Fernando Morientes"], [58, "BUL", "Emil Kostadinov"], [81, "ESP", "Fernando Morientes"], [88, "ESP", "Georgi Bachev own goal", "Georgi Bachev turns the ball into their own net."], [90, "ESP", "Kiko", "Kiko scores in second-half stoppage time."]],
  38: [[12, "FRA", "Youri Djorkaeff", "Youri Djorkaeff scores from the penalty spot."], [42, "DEN", "Michael Laudrup", "Michael Laudrup scores from the penalty spot."], [56, "FRA", "Emmanuel Petit"]],
  39: [[1, "PAR", "Celso Ayala"], [11, "NGA", "Wilson Oruma"], [58, "PAR", "Miguel Ángel Benítez"], [86, "PAR", "José Cardozo"]],
  40: [[18, "RSA", "Shaun Bartlett"], [45, "KSA", "Sami Al-Jaber", "Sami Al-Jaber scores from the penalty spot in first-half stoppage time."], [74, "KSA", "Yousuf Al-Thunayan", "Yousuf Al-Thunayan scores from the penalty spot."], [90, "RSA", "Shaun Bartlett", "Shaun Bartlett scores from the penalty spot in second-half stoppage time."]],
  41: [[7, "BEL", "Luc Nilis"], [72, "KOR", "Sang-chul Yoo"]],
  42: [[4, "NED", "Phillip Cocu"], [18, "NED", "Ronald de Boer"], [75, "MEX", "Ricardo Peláez"], [90, "MEX", "Luis Hernández", "Luis Hernández scores in second-half stoppage time."]],
  43: [[50, "GER", "Oliver Bierhoff"], [57, "GER", "Jürgen Klinsmann"]],
  44: [[4, "YUG", "Slobodan Komljenović"]],
  45: [[12, "TUN", "Skander Souayah", "Skander Souayah scores from the penalty spot."], [71, "ROU", "Viorel Moldovan"]],
  46: [[20, "ENG", "Darren Anderton"], [29, "ENG", "David Beckham"]],
  47: [[39, "JAM", "Theodore Whitmore"], [54, "JAM", "Theodore Whitmore"], [74, "JPN", "Masashi Nakayama"]],
  48: [[36, "ARG", "Mauricio Pineda"]],
  49: [[11, "BRA", "César Sampaio"], [26, "BRA", "César Sampaio"], [45, "BRA", "Ronaldo", "Ronaldo scores from the penalty spot in first-half stoppage time."], [70, "CHI", "Marcelo Salas"], [72, "BRA", "Ronaldo"]],
  50: [[18, "ITA", "Christian Vieri"]],
  51: [[3, "DEN", "Peter Møller"], [12, "DEN", "Brian Laudrup"], [58, "DEN", "Ebbe Sand"], [76, "DEN", "Thomas Helveg"], [77, "NGA", "Tijani Babangida"]],
  52: [[114, "FRA", "Laurent Blanc", "Laurent Blanc scores the World Cup's first golden goal."]],
  53: [[47, "MEX", "Luis Hernández"], [74, "GER", "Jürgen Klinsmann"], [86, "GER", "Oliver Bierhoff"]],
  54: [[38, "NED", "Dennis Bergkamp"], [48, "YUG", "Slobodan Komljenović"], [90, "NED", "Edgar Davids", "Edgar Davids scores in second-half stoppage time."]],
  55: [[5, "ARG", "Gabriel Batistuta", "Gabriel Batistuta scores from the penalty spot."], [9, "ENG", "Alan Shearer", "Alan Shearer scores from the penalty spot."], [16, "ENG", "Michael Owen"], [45, "ARG", "Javier Zanetti", "Javier Zanetti scores in first-half stoppage time."]],
  56: [[45, "CRO", "Davor Šuker", "Davor Šuker scores from the penalty spot in first-half stoppage time."]],
  58: [[2, "DEN", "Martin Jørgensen"], [10, "BRA", "Bebeto"], [25, "BRA", "Rivaldo"], [50, "DEN", "Brian Laudrup"], [59, "BRA", "Rivaldo"]],
  59: [[45, "CRO", "Robert Jarni", "Robert Jarni scores in first-half stoppage time."], [80, "CRO", "Goran Vlaović"], [85, "CRO", "Davor Šuker"]],
  60: [[12, "NED", "Patrick Kluivert"], [17, "ARG", "Claudio López"], [90, "NED", "Dennis Bergkamp"]],
  61: [[46, "BRA", "Ronaldo"], [87, "NED", "Patrick Kluivert"]],
  62: [[46, "CRO", "Davor Šuker"], [47, "FRA", "Lilian Thuram"], [70, "FRA", "Lilian Thuram"]],
  63: [[14, "CRO", "Robert Prosinečki"], [22, "NED", "Boudewijn Zenden"], [36, "CRO", "Davor Šuker"]],
  64: [[27, "FRA", "Zinedine Zidane"], [45, "FRA", "Zinedine Zidane", "Zinedine Zidane scores in first-half stoppage time."], [90, "FRA", "Emmanuel Petit", "Emmanuel Petit scores in second-half stoppage time."]]
};

type YouTubeHighlightSeed = {
  videoId: string;
  sourceName: string;
};

// Keys use the original France 98 published schedule. YouTube's archive titles
// number several simultaneous final-group games by kickoff chronology instead,
// so those videos were remapped here by exact teams and score. Every selection
// passed the real embed response with status OK and playableInEmbed=true.
const youtubeHighlightsByFixture: Record<number, YouTubeHighlightSeed> = {
  1: { videoId: "xMpVOpUt-Mk", sourceName: "World Cup Goals highlights" },
  2: { videoId: "aJCS44382GM", sourceName: "World Cup Goals highlights" },
  3: { videoId: "zeN5r5l4Ths", sourceName: "World Cup Goals highlights" },
  4: { videoId: "dE_vFeeMm2Y", sourceName: "World Cup Goals highlights" },
  5: { videoId: "YirTmuU3T0M", sourceName: "World Cup Goals highlights" },
  6: { videoId: "uHKHTD70byo", sourceName: "World Cup Goals highlights" },
  7: { videoId: "NilwwbDfUQI", sourceName: "World Cup Goals highlights" },
  8: { videoId: "L9Uu4mC72OA", sourceName: "World Cup Goals highlights" },
  9: { videoId: "8yssDgGXO64", sourceName: "World Cup Goals highlights" },
  10: { videoId: "MuQPYy2hBIE", sourceName: "World Cup Goals highlights" },
  11: { videoId: "jEYu4mYYRGI", sourceName: "World Cup Goals highlights" },
  12: { videoId: "p3HmPNVf7NU", sourceName: "World Cup Goals highlights" },
  13: { videoId: "IHJR83v42tQ", sourceName: "World Cup Goals highlights" },
  14: { videoId: "zG8ZPldLOeM", sourceName: "World Cup Goals highlights" },
  15: { videoId: "0Z-Z2OC751M", sourceName: "World Cup Goals highlights" },
  16: { videoId: "h0P4z8V2soc", sourceName: "Just Football highlights" },
  17: { videoId: "3DGwIxVHsT0", sourceName: "World Cup Goals highlights" },
  18: { videoId: "alyN_RGONAg", sourceName: "World Cup Goals highlights" },
  19: { videoId: "8UfQoJMIRW0", sourceName: "World Cup Goals highlights" },
  20: { videoId: "UdZf7DLrDKc", sourceName: "World Cup Goals highlights" },
  21: { videoId: "iv4tY8Ty7Nc", sourceName: "Just Football highlights" },
  22: { videoId: "fJgGID6WEyw", sourceName: "World Cup Goals highlights" },
  23: { videoId: "9DOUq2FGkqc", sourceName: "World Cup Goals highlights" },
  24: { videoId: "t5MtZwI0HLw", sourceName: "World Cup Goals highlights" },
  25: { videoId: "tHe69JTgt5g", sourceName: "World Cup Goals highlights" },
  26: { videoId: "92gp3TUW-6o", sourceName: "World Cup Goals highlights" },
  27: { videoId: "wnP7FnFAHyI", sourceName: "World Cup Goals highlights" },
  28: { videoId: "B7yBwIfZe4I", sourceName: "World Cup Goals highlights" },
  29: { videoId: "qDb0MXB_02g", sourceName: "World Cup Goals highlights" },
  30: { videoId: "YRWW5wNJ6Jg", sourceName: "World Cup Goals highlights" },
  31: { videoId: "QXEbFhtKt8E", sourceName: "World Cup Goals highlights" },
  32: { videoId: "Z4E_chnN7V8", sourceName: "World Cup Goals highlights" },
  33: { videoId: "sHliRWkQquc", sourceName: "World Cup Goals highlights" },
  34: { videoId: "IhwIuXfBXSc", sourceName: "World Cup Goals highlights" },
  35: { videoId: "hy4uojspHyc", sourceName: "World Cup Goals highlights" },
  36: { videoId: "kGoWUQGn-KU", sourceName: "World Cup Goals highlights" },
  37: { videoId: "tYIwaACuGoE", sourceName: "World Cup Goals highlights" },
  38: { videoId: "a-pgSCHOUM8", sourceName: "World Cup Goals highlights" },
  39: { videoId: "_ZdFnQOXCHY", sourceName: "World Cup Goals highlights" },
  40: { videoId: "Rm8vO02R848", sourceName: "World Cup Goals highlights" },
  41: { videoId: "AdjFJb0BgGI", sourceName: "World Cup Goals highlights" },
  42: { videoId: "pBV5Nh-_CQU", sourceName: "World Cup Goals highlights" },
  43: { videoId: "YbaqaImzawo", sourceName: "World Cup Goals highlights" },
  44: { videoId: "hTuqkBiT3kg", sourceName: "World Cup Goals highlights" },
  45: { videoId: "9R9qnbu5bS4", sourceName: "World Cup Goals highlights" },
  46: { videoId: "lqr0vp5HIu8", sourceName: "World Cup Goals highlights" },
  47: { videoId: "_ew76UdZE7s", sourceName: "World Cup Goals highlights" },
  48: { videoId: "QCMVmUu5ZjU", sourceName: "World Cup Goals highlights" },
  49: { videoId: "TwE4sfzdTB0", sourceName: "SOCCER HOUSE highlights" },
  50: { videoId: "ghbvVvNRHZE", sourceName: "World Cup Goals highlights" },
  51: { videoId: "1ipeuQ8iZOc", sourceName: "World Cup Goals highlights" },
  52: { videoId: "O56s8MitbnU", sourceName: "World Cup Goals highlights" },
  53: { videoId: "GTiRjPTRga0", sourceName: "World Cup Goals highlights" },
  54: { videoId: "Lhz6bZYRWc8", sourceName: "World Cup Goals highlights" },
  55: { videoId: "LDBgqNvBrg4", sourceName: "World Cup Goals highlights" },
  56: { videoId: "PqdtTN277kI", sourceName: "FGMH TV highlights" },
  57: { videoId: "N9QTdoiJlaY", sourceName: "World Cup Goals highlights" },
  58: { videoId: "LNHdGggg3iY", sourceName: "World Cup Goals highlights" },
  59: { videoId: "pn07XzgQKa8", sourceName: "World Cup Goals highlights" },
  60: { videoId: "BUP_7Mns5q4", sourceName: "Football Flashback 6 highlights" },
  61: { videoId: "6h1NL35-wCk", sourceName: "World Cup Goals highlights" },
  62: { videoId: "tsXVbRA-AaU", sourceName: "World Cup Goals highlights" },
  63: { videoId: "nEqbY6B_trM", sourceName: "World Cup Goals highlights" },
  64: { videoId: "xgWQmliYf2M", sourceName: "World Cup Goals highlights" }
};

// FIFA's current archive uses legacy round and match-centre IDs. These map the
// public schedule number to the individual official match report.
const fifaMatchIdsByFixture: Record<number, string> = {
  1: "4000", 2: "8725", 3: "8727", 4: "8726",
  5: "8729", 6: "8730", 7: "8728", 8: "8732",
  9: "8733", 10: "8731", 11: "8736", 12: "8735",
  13: "8734", 14: "8738", 15: "8739", 16: "8740",
  17: "8741", 18: "8742", 19: "8743", 20: "8744",
  21: "8745", 22: "8746", 23: "8747", 24: "8748",
  25: "8749", 26: "8750", 27: "8751", 28: "8752",
  29: "8753", 30: "8754", 31: "8755", 32: "8756",
  33: "8757", 34: "8758", 35: "8759", 36: "8760",
  37: "8761", 38: "8762", 39: "8763", 40: "8764",
  41: "8766", 42: "8765", 43: "8767", 44: "8768",
  45: "8770", 46: "8769", 47: "8771", 48: "8772",
  49: "8773", 50: "8774", 51: "8775", 52: "8776",
  53: "8777", 54: "8778", 55: "8779", 56: "8780",
  57: "8781", 58: "8782", 59: "8783", 60: "8784",
  61: "8785", 62: "8786", 63: "8787", 64: "8788"
};

function getFifaRoundId(no: number) {
  if (no <= 48) return "1014";
  if (no <= 56) return "1024";
  if (no <= 60) return "1025";
  if (no <= 62) return "1026";
  if (no === 63) return "1028";
  return "1027";
}

function getFifaMatchUrl(fixture: FixtureSeed) {
  const roundId = getFifaRoundId(fixture.no);
  const matchId = fifaMatchIdsByFixture[fixture.no];
  return `https://www.fifa.com/en/match-centre/match/17/1013/${roundId}/${matchId}`;
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
      id: `wc-1998-${String(fixture.no).padStart(2, "0")}-${fixture.home.toLowerCase()}-${fixture.away.toLowerCase()}`,
      tournamentId: "wc-1998",
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

export const worldCup1998: Tournament = {
  id: "wc-1998",
  competition: "WORLD_CUP",
  name: "France 1998",
  year: 1998,
  hosts: ["FRA"],
  teams: worldCup1998Groups.flatMap((group) => group.teams),
  groups: worldCup1998Groups,
  teamCoordinates: worldCup1998TeamCoordinates,
  format: worldCup1998Format,
  stages: ["group", "r16", "qf", "sf", "third", "final"],
  status: "complete",
  mapView: {
    center: [2.15, 46.4],
    zoom: 4.75,
    bearing: -7,
    pitch: 42
  },
  venues,
  featuredRoute: venues.map((venue) => venue.id),
  matches
};
