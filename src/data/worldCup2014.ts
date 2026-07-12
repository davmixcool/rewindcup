import { teamNames } from "@/data/teamMetadata";
import { createOfficialReportHighlight, createYoutubeHighlight } from "@/data/highlights";
import {
  worldCup2014Format,
  worldCup2014Groups,
  worldCup2014TeamCoordinates
} from "@/data/worldCup2014Experience";
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
  { id: "arena-de-sao-paulo", name: "Arena de São Paulo", city: "São Paulo", country: "BRA", coordinates: [-46.4741, -23.5455], bearing: -18, zoom: 16.45 },
  { id: "estadio-das-dunas", name: "Estádio das Dunas", city: "Natal", country: "BRA", coordinates: [-35.2125, -5.8269], bearing: 18 },
  { id: "arena-fonte-nova", name: "Arena Fonte Nova", city: "Salvador", country: "BRA", coordinates: [-38.5042, -12.9788], bearing: -20 },
  { id: "arena-pantanal", name: "Arena Pantanal", city: "Cuiabá", country: "BRA", coordinates: [-56.1219, -15.6031], bearing: 16 },
  { id: "estadio-mineirao", name: "Estádio Mineirão", city: "Belo Horizonte", country: "BRA", coordinates: [-43.9719, -19.8659], bearing: -22, zoom: 16.5 },
  { id: "estadio-castelao", name: "Estádio Castelão", city: "Fortaleza", country: "BRA", coordinates: [-38.5226, -3.8073], bearing: 20 },
  { id: "arena-pernambuco", name: "Arena Pernambuco", city: "Recife", country: "BRA", coordinates: [-35.0082, -8.04], bearing: -14 },
  { id: "estadio-nacional-brasilia", name: "Estádio Nacional", city: "Brasília", country: "BRA", coordinates: [-47.8992, -15.7835], bearing: 14 },
  { id: "estadio-beira-rio", name: "Estádio Beira-Rio", city: "Porto Alegre", country: "BRA", coordinates: [-51.2365, -30.0655], bearing: -24 },
  { id: "estadio-do-maracana", name: "Estádio do Maracanã", city: "Rio de Janeiro", country: "BRA", coordinates: [-43.2302, -22.9122], bearing: 22, zoom: 16.5 },
  { id: "arena-amazonia", name: "Arena Amazônia", city: "Manaus", country: "BRA", coordinates: [-60.0283, -3.0831], bearing: -16 },
  { id: "arena-da-baixada", name: "Arena da Baixada", city: "Curitiba", country: "BRA", coordinates: [-49.2768, -25.4483], bearing: 24 }
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

// Numbering follows FIFA's official final match schedule rather than simple
// chronological order. That distinction matters for several group fixtures.
const fixtureSeeds: FixtureSeed[] = [
  { no: 1, stage: "group", date: "2014-06-12", venueId: "arena-de-sao-paulo", home: "BRA", away: "CRO", score: { home: 3, away: 1 } },
  { no: 2, stage: "group", date: "2014-06-13", venueId: "estadio-das-dunas", home: "MEX", away: "CMR", score: { home: 1, away: 0 } },
  { no: 3, stage: "group", date: "2014-06-13", venueId: "arena-fonte-nova", home: "ESP", away: "NED", score: { home: 1, away: 5 } },
  { no: 4, stage: "group", date: "2014-06-13", venueId: "arena-pantanal", home: "CHI", away: "AUS", score: { home: 3, away: 1 } },
  { no: 5, stage: "group", date: "2014-06-14", venueId: "estadio-mineirao", home: "COL", away: "GRE", score: { home: 3, away: 0 } },
  { no: 6, stage: "group", date: "2014-06-14", venueId: "arena-pernambuco", home: "CIV", away: "JPN", score: { home: 2, away: 1 } },
  { no: 7, stage: "group", date: "2014-06-14", venueId: "estadio-castelao", home: "URU", away: "CRC", score: { home: 1, away: 3 } },
  { no: 8, stage: "group", date: "2014-06-14", venueId: "arena-amazonia", home: "ENG", away: "ITA", score: { home: 1, away: 2 } },
  { no: 9, stage: "group", date: "2014-06-15", venueId: "estadio-nacional-brasilia", home: "SUI", away: "ECU", score: { home: 2, away: 1 } },
  { no: 10, stage: "group", date: "2014-06-15", venueId: "estadio-beira-rio", home: "FRA", away: "HON", score: { home: 3, away: 0 } },
  { no: 11, stage: "group", date: "2014-06-15", venueId: "estadio-do-maracana", home: "ARG", away: "BIH", score: { home: 2, away: 1 } },
  { no: 12, stage: "group", date: "2014-06-16", venueId: "arena-da-baixada", home: "IRN", away: "NGA", score: { home: 0, away: 0 } },
  { no: 13, stage: "group", date: "2014-06-16", venueId: "arena-fonte-nova", home: "GER", away: "POR", score: { home: 4, away: 0 } },
  { no: 14, stage: "group", date: "2014-06-16", venueId: "estadio-das-dunas", home: "GHA", away: "USA", score: { home: 1, away: 2 } },
  { no: 15, stage: "group", date: "2014-06-17", venueId: "estadio-mineirao", home: "BEL", away: "ALG", score: { home: 2, away: 1 } },
  { no: 16, stage: "group", date: "2014-06-17", venueId: "arena-pantanal", home: "RUS", away: "KOR", score: { home: 1, away: 1 } },
  { no: 17, stage: "group", date: "2014-06-17", venueId: "estadio-castelao", home: "BRA", away: "MEX", score: { home: 0, away: 0 } },
  { no: 18, stage: "group", date: "2014-06-18", venueId: "arena-amazonia", home: "CMR", away: "CRO", score: { home: 0, away: 4 } },
  { no: 19, stage: "group", date: "2014-06-18", venueId: "estadio-do-maracana", home: "ESP", away: "CHI", score: { home: 0, away: 2 } },
  { no: 20, stage: "group", date: "2014-06-18", venueId: "estadio-beira-rio", home: "AUS", away: "NED", score: { home: 2, away: 3 } },
  { no: 21, stage: "group", date: "2014-06-19", venueId: "estadio-nacional-brasilia", home: "COL", away: "CIV", score: { home: 2, away: 1 } },
  { no: 22, stage: "group", date: "2014-06-19", venueId: "estadio-das-dunas", home: "JPN", away: "GRE", score: { home: 0, away: 0 } },
  { no: 23, stage: "group", date: "2014-06-19", venueId: "arena-de-sao-paulo", home: "URU", away: "ENG", score: { home: 2, away: 1 } },
  { no: 24, stage: "group", date: "2014-06-20", venueId: "arena-pernambuco", home: "ITA", away: "CRC", score: { home: 0, away: 1 } },
  { no: 25, stage: "group", date: "2014-06-20", venueId: "arena-fonte-nova", home: "SUI", away: "FRA", score: { home: 2, away: 5 } },
  { no: 26, stage: "group", date: "2014-06-20", venueId: "arena-da-baixada", home: "HON", away: "ECU", score: { home: 1, away: 2 } },
  { no: 27, stage: "group", date: "2014-06-21", venueId: "estadio-mineirao", home: "ARG", away: "IRN", score: { home: 1, away: 0 } },
  { no: 28, stage: "group", date: "2014-06-21", venueId: "arena-pantanal", home: "NGA", away: "BIH", score: { home: 1, away: 0 } },
  { no: 29, stage: "group", date: "2014-06-21", venueId: "estadio-castelao", home: "GER", away: "GHA", score: { home: 2, away: 2 } },
  { no: 30, stage: "group", date: "2014-06-22", venueId: "arena-amazonia", home: "USA", away: "POR", score: { home: 2, away: 2 } },
  { no: 31, stage: "group", date: "2014-06-22", venueId: "estadio-do-maracana", home: "BEL", away: "RUS", score: { home: 1, away: 0 } },
  { no: 32, stage: "group", date: "2014-06-22", venueId: "estadio-beira-rio", home: "KOR", away: "ALG", score: { home: 2, away: 4 } },
  { no: 33, stage: "group", date: "2014-06-23", venueId: "estadio-nacional-brasilia", home: "CMR", away: "BRA", score: { home: 1, away: 4 } },
  { no: 34, stage: "group", date: "2014-06-23", venueId: "arena-pernambuco", home: "CRO", away: "MEX", score: { home: 1, away: 3 } },
  { no: 35, stage: "group", date: "2014-06-23", venueId: "arena-da-baixada", home: "AUS", away: "ESP", score: { home: 0, away: 3 } },
  { no: 36, stage: "group", date: "2014-06-23", venueId: "arena-de-sao-paulo", home: "NED", away: "CHI", score: { home: 2, away: 0 } },
  { no: 37, stage: "group", date: "2014-06-24", venueId: "arena-pantanal", home: "JPN", away: "COL", score: { home: 1, away: 4 } },
  { no: 38, stage: "group", date: "2014-06-24", venueId: "estadio-castelao", home: "GRE", away: "CIV", score: { home: 2, away: 1 } },
  { no: 39, stage: "group", date: "2014-06-24", venueId: "estadio-das-dunas", home: "ITA", away: "URU", score: { home: 0, away: 1 } },
  { no: 40, stage: "group", date: "2014-06-24", venueId: "estadio-mineirao", home: "CRC", away: "ENG", score: { home: 0, away: 0 } },
  { no: 41, stage: "group", date: "2014-06-25", venueId: "arena-amazonia", home: "HON", away: "SUI", score: { home: 0, away: 3 } },
  { no: 42, stage: "group", date: "2014-06-25", venueId: "estadio-do-maracana", home: "ECU", away: "FRA", score: { home: 0, away: 0 } },
  { no: 43, stage: "group", date: "2014-06-25", venueId: "estadio-beira-rio", home: "NGA", away: "ARG", score: { home: 2, away: 3 } },
  { no: 44, stage: "group", date: "2014-06-25", venueId: "arena-fonte-nova", home: "BIH", away: "IRN", score: { home: 3, away: 1 } },
  { no: 45, stage: "group", date: "2014-06-26", venueId: "arena-pernambuco", home: "USA", away: "GER", score: { home: 0, away: 1 } },
  { no: 46, stage: "group", date: "2014-06-26", venueId: "estadio-nacional-brasilia", home: "POR", away: "GHA", score: { home: 2, away: 1 } },
  { no: 47, stage: "group", date: "2014-06-26", venueId: "arena-de-sao-paulo", home: "KOR", away: "BEL", score: { home: 0, away: 1 } },
  { no: 48, stage: "group", date: "2014-06-26", venueId: "arena-da-baixada", home: "ALG", away: "RUS", score: { home: 1, away: 1 } },
  { no: 49, stage: "r16", date: "2014-06-28", venueId: "estadio-mineirao", home: "BRA", away: "CHI", score: { home: 1, away: 1 }, shootout: { home: 3, away: 2 }, durationMinutes: 120, note: "Brazil won 3-2 on penalties" },
  { no: 50, stage: "r16", date: "2014-06-28", venueId: "estadio-do-maracana", home: "COL", away: "URU", score: { home: 2, away: 0 } },
  { no: 51, stage: "r16", date: "2014-06-29", venueId: "estadio-castelao", home: "NED", away: "MEX", score: { home: 2, away: 1 } },
  { no: 52, stage: "r16", date: "2014-06-29", venueId: "arena-pernambuco", home: "CRC", away: "GRE", score: { home: 1, away: 1 }, shootout: { home: 5, away: 3 }, durationMinutes: 120, note: "Costa Rica won 5-3 on penalties" },
  { no: 53, stage: "r16", date: "2014-06-30", venueId: "estadio-nacional-brasilia", home: "FRA", away: "NGA", score: { home: 2, away: 0 } },
  { no: 54, stage: "r16", date: "2014-06-30", venueId: "estadio-beira-rio", home: "GER", away: "ALG", score: { home: 2, away: 1 }, durationMinutes: 120, note: "After extra time" },
  { no: 55, stage: "r16", date: "2014-07-01", venueId: "arena-de-sao-paulo", home: "ARG", away: "SUI", score: { home: 1, away: 0 }, durationMinutes: 120, note: "After extra time" },
  { no: 56, stage: "r16", date: "2014-07-01", venueId: "arena-fonte-nova", home: "BEL", away: "USA", score: { home: 2, away: 1 }, durationMinutes: 120, note: "After extra time" },
  { no: 57, stage: "qf", date: "2014-07-04", venueId: "estadio-castelao", home: "BRA", away: "COL", score: { home: 2, away: 1 } },
  { no: 58, stage: "qf", date: "2014-07-04", venueId: "estadio-do-maracana", home: "FRA", away: "GER", score: { home: 0, away: 1 } },
  { no: 59, stage: "qf", date: "2014-07-05", venueId: "arena-fonte-nova", home: "NED", away: "CRC", score: { home: 0, away: 0 }, shootout: { home: 4, away: 3 }, durationMinutes: 120, note: "Netherlands won 4-3 on penalties" },
  { no: 60, stage: "qf", date: "2014-07-05", venueId: "estadio-nacional-brasilia", home: "ARG", away: "BEL", score: { home: 1, away: 0 } },
  { no: 61, stage: "sf", date: "2014-07-08", venueId: "estadio-mineirao", home: "BRA", away: "GER", score: { home: 1, away: 7 } },
  { no: 62, stage: "sf", date: "2014-07-09", venueId: "arena-de-sao-paulo", home: "NED", away: "ARG", score: { home: 0, away: 0 }, shootout: { home: 2, away: 4 }, durationMinutes: 120, note: "Argentina won 4-2 on penalties" },
  { no: 63, stage: "third", date: "2014-07-12", venueId: "estadio-nacional-brasilia", home: "BRA", away: "NED", score: { home: 0, away: 3 } },
  { no: 64, stage: "final", date: "2014-07-13", venueId: "estadio-do-maracana", home: "GER", away: "ARG", score: { home: 1, away: 0 }, durationMinutes: 120, note: "After extra time" }
];

// Scorers and minute labels follow the Fjelstul World Cup Database and were
// remapped to FIFA's official match numbers above. Added-time goals retain the
// regulation minute so replay ordering remains compatible with earlier cups.
const goalsByFixture: Partial<Record<number, GoalSeed[]>> = {
  1: [[12, "CRO", "Marcelo own goal", "Marcelo turns the ball into his own net."], [29, "BRA", "Neymar"], [71, "BRA", "Neymar", "Neymar scores from the penalty spot."], [90, "BRA", "Oscar", "Oscar scores in second-half stoppage time."]],
  2: [[61, "MEX", "Oribe Peralta"]],
  3: [[27, "ESP", "Xabi Alonso", "Xabi Alonso scores from the penalty spot."], [44, "NED", "Robin van Persie"], [53, "NED", "Arjen Robben"], [64, "NED", "Stefan de Vrij"], [72, "NED", "Robin van Persie"], [80, "NED", "Arjen Robben"]],
  4: [[12, "CHI", "Alexis Sánchez"], [14, "CHI", "Jorge Valdivia"], [35, "AUS", "Tim Cahill"], [90, "CHI", "Jean Beausejour", "Jean Beausejour scores in second-half stoppage time."]],
  5: [[5, "COL", "Pablo Armero"], [58, "COL", "Teófilo Gutiérrez"], [90, "COL", "James Rodríguez", "James Rodríguez scores in second-half stoppage time."]],
  6: [[16, "JPN", "Keisuke Honda"], [64, "CIV", "Wilfried Bony"], [66, "CIV", "Gervinho"]],
  7: [[24, "URU", "Edinson Cavani", "Edinson Cavani scores from the penalty spot."], [54, "CRC", "Joel Campbell"], [57, "CRC", "Óscar Duarte"], [84, "CRC", "Marco Ureña"]],
  8: [[35, "ITA", "Claudio Marchisio"], [37, "ENG", "Daniel Sturridge"], [50, "ITA", "Mario Balotelli"]],
  9: [[22, "ECU", "Enner Valencia"], [48, "SUI", "Admir Mehmedi"], [90, "SUI", "Haris Seferovic", "Haris Seferovic scores in second-half stoppage time."]],
  10: [[45, "FRA", "Karim Benzema", "Karim Benzema scores from the penalty spot."], [48, "FRA", "Noel Valladares own goal", "Noel Valladares turns the ball into his own net."], [72, "FRA", "Karim Benzema"]],
  11: [[3, "ARG", "Sead Kolašinac own goal", "Sead Kolašinac turns the ball into his own net."], [65, "ARG", "Lionel Messi"], [85, "BIH", "Vedad Ibišević"]],
  13: [[12, "GER", "Thomas Müller", "Thomas Müller scores from the penalty spot."], [32, "GER", "Mats Hummels"], [45, "GER", "Thomas Müller", "Thomas Müller scores in first-half stoppage time."], [78, "GER", "Thomas Müller"]],
  14: [[1, "USA", "Clint Dempsey"], [82, "GHA", "André Ayew"], [86, "USA", "John Brooks"]],
  15: [[25, "ALG", "Sofiane Feghouli", "Sofiane Feghouli scores from the penalty spot."], [70, "BEL", "Marouane Fellaini"], [80, "BEL", "Dries Mertens"]],
  16: [[68, "KOR", "Lee Keun-ho"], [74, "RUS", "Aleksandr Kerzhakov"]],
  18: [[11, "CRO", "Ivica Olić"], [48, "CRO", "Ivan Perišić"], [61, "CRO", "Mario Mandžukić"], [73, "CRO", "Mario Mandžukić"]],
  19: [[20, "CHI", "Eduardo Vargas"], [43, "CHI", "Charles Aránguiz"]],
  20: [[20, "NED", "Arjen Robben"], [21, "AUS", "Tim Cahill"], [54, "AUS", "Mile Jedinak", "Mile Jedinak scores from the penalty spot."], [58, "NED", "Robin van Persie"], [68, "NED", "Memphis Depay"]],
  21: [[64, "COL", "James Rodríguez"], [70, "COL", "Juan Fernando Quintero"], [73, "CIV", "Gervinho"]],
  23: [[39, "URU", "Luis Suárez"], [75, "ENG", "Wayne Rooney"], [85, "URU", "Luis Suárez"]],
  24: [[44, "CRC", "Bryan Ruiz"]],
  25: [[17, "FRA", "Olivier Giroud"], [18, "FRA", "Blaise Matuidi"], [40, "FRA", "Mathieu Valbuena"], [67, "FRA", "Karim Benzema"], [73, "FRA", "Moussa Sissoko"], [81, "SUI", "Blerim Džemaili"], [87, "SUI", "Granit Xhaka"]],
  26: [[31, "HON", "Carlo Costly"], [34, "ECU", "Enner Valencia"], [65, "ECU", "Enner Valencia"]],
  27: [[90, "ARG", "Lionel Messi", "Lionel Messi scores in second-half stoppage time."]],
  28: [[29, "NGA", "Peter Odemwingie"]],
  29: [[51, "GER", "Mario Götze"], [54, "GHA", "André Ayew"], [63, "GHA", "Asamoah Gyan"], [71, "GER", "Miroslav Klose"]],
  30: [[5, "POR", "Nani"], [64, "USA", "Jermaine Jones"], [81, "USA", "Clint Dempsey"], [90, "POR", "Silvestre Varela", "Silvestre Varela scores in second-half stoppage time."]],
  31: [[88, "BEL", "Divock Origi"]],
  32: [[26, "ALG", "Islam Slimani"], [28, "ALG", "Rafik Halliche"], [38, "ALG", "Abdelmoumene Djabou"], [50, "KOR", "Son Heung-min"], [62, "ALG", "Yacine Brahimi"], [72, "KOR", "Koo Ja-cheol"]],
  33: [[17, "BRA", "Neymar"], [26, "CMR", "Joël Matip"], [35, "BRA", "Neymar"], [49, "BRA", "Fred"], [84, "BRA", "Fernandinho"]],
  34: [[72, "MEX", "Rafael Márquez"], [75, "MEX", "Andrés Guardado"], [82, "MEX", "Javier Hernández"], [87, "CRO", "Ivan Perišić"]],
  35: [[36, "ESP", "David Villa"], [69, "ESP", "Fernando Torres"], [82, "ESP", "Juan Mata"]],
  36: [[77, "NED", "Leroy Fer"], [90, "NED", "Memphis Depay", "Memphis Depay scores in second-half stoppage time."]],
  37: [[17, "COL", "Juan Cuadrado", "Juan Cuadrado scores from the penalty spot."], [45, "JPN", "Shinji Okazaki", "Shinji Okazaki scores in first-half stoppage time."], [55, "COL", "Jackson Martínez"], [82, "COL", "Jackson Martínez"], [90, "COL", "James Rodríguez"]],
  38: [[42, "GRE", "Andreas Samaris"], [74, "CIV", "Wilfried Bony"], [90, "GRE", "Georgios Samaras", "Georgios Samaras scores from the penalty spot in second-half stoppage time."]],
  39: [[81, "URU", "Diego Godín"]],
  41: [[6, "SUI", "Xherdan Shaqiri"], [31, "SUI", "Xherdan Shaqiri"], [71, "SUI", "Xherdan Shaqiri"]],
  43: [[3, "ARG", "Lionel Messi"], [4, "NGA", "Ahmed Musa"], [45, "ARG", "Lionel Messi", "Lionel Messi scores in first-half stoppage time."], [47, "NGA", "Ahmed Musa"], [50, "ARG", "Marcos Rojo"]],
  44: [[23, "BIH", "Edin Džeko"], [59, "BIH", "Miralem Pjanić"], [82, "IRN", "Reza Ghoochannejhad"], [83, "BIH", "Avdija Vršajević"]],
  45: [[55, "GER", "Thomas Müller"]],
  46: [[31, "POR", "John Boye own goal", "John Boye turns the ball into his own net."], [57, "GHA", "Asamoah Gyan"], [80, "POR", "Cristiano Ronaldo"]],
  47: [[78, "BEL", "Jan Vertonghen"]],
  48: [[6, "RUS", "Aleksandr Kokorin"], [60, "ALG", "Islam Slimani"]],
  49: [[18, "BRA", "David Luiz"], [32, "CHI", "Alexis Sánchez"]],
  50: [[28, "COL", "James Rodríguez"], [50, "COL", "James Rodríguez"]],
  51: [[48, "MEX", "Giovani dos Santos"], [88, "NED", "Wesley Sneijder"], [90, "NED", "Klaas-Jan Huntelaar", "Klaas-Jan Huntelaar scores from the penalty spot in second-half stoppage time."]],
  52: [[52, "CRC", "Bryan Ruiz"], [90, "GRE", "Sokratis Papastathopoulos", "Sokratis Papastathopoulos scores in second-half stoppage time."]],
  53: [[79, "FRA", "Paul Pogba"], [90, "FRA", "Joseph Yobo own goal", "Joseph Yobo turns the ball into his own net in second-half stoppage time."]],
  54: [[92, "GER", "André Schürrle"], [120, "GER", "Mesut Özil"], [120, "ALG", "Abdelmoumene Djabou", "Abdelmoumene Djabou scores in extra-time stoppage time."]],
  55: [[118, "ARG", "Ángel Di María"]],
  56: [[93, "BEL", "Kevin De Bruyne"], [105, "BEL", "Romelu Lukaku"], [107, "USA", "Julian Green"]],
  57: [[7, "BRA", "Thiago Silva"], [69, "BRA", "David Luiz"], [80, "COL", "James Rodríguez", "James Rodríguez scores from the penalty spot."]],
  58: [[13, "GER", "Mats Hummels"]],
  60: [[8, "ARG", "Gonzalo Higuaín"]],
  61: [[11, "GER", "Thomas Müller"], [23, "GER", "Miroslav Klose"], [24, "GER", "Toni Kroos"], [26, "GER", "Toni Kroos"], [29, "GER", "Sami Khedira"], [69, "GER", "André Schürrle"], [79, "GER", "André Schürrle"], [90, "BRA", "Oscar"]],
  63: [[3, "NED", "Robin van Persie", "Robin van Persie scores from the penalty spot."], [17, "NED", "Daley Blind"], [90, "NED", "Georginio Wijnaldum", "Georginio Wijnaldum scores in second-half stoppage time."]],
  64: [[113, "GER", "Mario Götze"]]
};

type YouTubeHighlightSeed = {
  videoId: string;
  sourceName: string;
};

// Fixture keys follow FIFA's official match numbers, which differ from pure
// kickoff chronology for several group-stage pairs and quarter-finals. Each
// final selection was checked against the teams and score and passed YouTube's
// real embed-player response with status OK and playableInEmbed=true.
const youtubeHighlightsByFixture: Record<number, YouTubeHighlightSeed> = {
  1: { videoId: "Z7W9KPQp7oc", sourceName: "World Cup Goals highlights" },
  2: { videoId: "kbsJAvtyc7U", sourceName: "World Cup Goals highlights" },
  3: { videoId: "5JwFnOkBVJM", sourceName: "World Cup Goals highlights" },
  4: { videoId: "gV7doXLV0AY", sourceName: "World Cup Goals highlights" },
  5: { videoId: "3PPrfr579Jg", sourceName: "World Cup Goals highlights" },
  6: { videoId: "xtu6wgjM5Fk", sourceName: "World Cup Goals highlights" },
  7: { videoId: "UI25TNzv6gY", sourceName: "lapse football highlights" },
  8: { videoId: "cPNh4B5LR7I", sourceName: "lapse football highlights" },
  9: { videoId: "jTqhaIM9W-w", sourceName: "World Cup Goals highlights" },
  10: { videoId: "RQn2Z5f9RXU", sourceName: "World Cup Goals highlights" },
  11: { videoId: "WpdwLiKSMaU", sourceName: "World Cup Goals highlights" },
  12: { videoId: "0Eek9OsyzRo", sourceName: "Nation Press Official HD highlights" },
  13: { videoId: "dX0e72df0JY", sourceName: "TYFC HD highlights" },
  14: { videoId: "2GEz0qdNzrU", sourceName: "World Cup Goals highlights" },
  15: { videoId: "zFombR6aBCY", sourceName: "World Cup Goals highlights" },
  16: { videoId: "ThGjaeNLxn0", sourceName: "World Cup Goals highlights" },
  17: { videoId: "xsQqY1uDjY8", sourceName: "Nation Press Official HD highlights" },
  18: { videoId: "DcAi2jiAwyY", sourceName: "World Cup Goals highlights" },
  19: { videoId: "y3BrZJ_pjqo", sourceName: "World Cup Goals highlights" },
  20: { videoId: "rCYNXLv1wTo", sourceName: "World Cup Goals highlights" },
  21: { videoId: "MahMaqUU3Go", sourceName: "World Cup Goals highlights" },
  22: { videoId: "ONtouEnKKdY", sourceName: "World Cup Goals highlights" },
  23: { videoId: "VhIZwKk5Vb0", sourceName: "World Cup Goals highlights" },
  24: { videoId: "ptuxOTcvWyI", sourceName: "World Cup Goals highlights" },
  25: { videoId: "2p3YZUKoUWw", sourceName: "World Cup Goals highlights" },
  26: { videoId: "vJRDsSf5ZmI", sourceName: "World Cup Goals highlights" },
  27: { videoId: "etQ8z8UqdJ8", sourceName: "Football107 highlights" },
  28: { videoId: "irr67t0I5Sw", sourceName: "World Cup Goals highlights" },
  29: { videoId: "JsWBY48OGmk", sourceName: "World Cup Goals highlights" },
  30: { videoId: "DCOlWcYUzZo", sourceName: "FOX Sports highlights" },
  31: { videoId: "Ftic12kLeYI", sourceName: "World Cup Goals highlights" },
  32: { videoId: "oZxF4AzKHVQ", sourceName: "World Cup Goals highlights" },
  33: { videoId: "hdhycLkAJRE", sourceName: "World Cup Goals highlights" },
  34: { videoId: "XrzsR_sFqFA", sourceName: "World Cup Goals highlights" },
  35: { videoId: "kDSM0oLcWvQ", sourceName: "World Cup Goals highlights" },
  36: { videoId: "DuKuXBGUKCc", sourceName: "World Cup Goals highlights" },
  37: { videoId: "x_bhtjDgx-E", sourceName: "World Cup Goals highlights" },
  38: { videoId: "VQIIuoLokGY", sourceName: "World Cup Goals highlights" },
  39: { videoId: "uuhCwIij4CE", sourceName: "World Cup Goals highlights" },
  40: { videoId: "09doonpMwww", sourceName: "World Cup Goals highlights" },
  41: { videoId: "V_njxgfPi2g", sourceName: "Peradze highlights" },
  42: { videoId: "Q8v_map1uus", sourceName: "World Cup Goals highlights" },
  43: { videoId: "RlhUHyXegSQ", sourceName: "Football107 highlights" },
  44: { videoId: "7hR1PeGTnrA", sourceName: "World Cup Goals highlights" },
  45: { videoId: "lb6fFMZuLr0", sourceName: "lapse football highlights" },
  46: { videoId: "NvmmFnavuJQ", sourceName: "World Cup Goals highlights" },
  47: { videoId: "K87p-YT3sj0", sourceName: "World Cup Goals highlights" },
  48: { videoId: "nBVww-zwSYE", sourceName: "World Cup Goals highlights" },
  49: { videoId: "mXP2iCdAAEE", sourceName: "LTN tv Sport highlights" },
  50: { videoId: "D7JX9mfHZzo", sourceName: "World Cup Goals highlights" },
  51: { videoId: "UKmAUcCmKUQ", sourceName: "Remon Khan highlights" },
  52: { videoId: "LnMbiat9N7Y", sourceName: "World Of Football highlights" },
  53: { videoId: "MmxKaGA5uN4", sourceName: "World Cup Goals highlights" },
  54: { videoId: "g9nA1i6Q96k", sourceName: "World Cup Goals highlights" },
  55: { videoId: "zLBmak624F0", sourceName: "World Cup Goals highlights" },
  56: { videoId: "mg_3Kg1Or5w", sourceName: "World Cup Goals highlights" },
  57: { videoId: "xfv97Z3zYf4", sourceName: "lapse football highlights" },
  58: { videoId: "tKwChmRYUIo", sourceName: "BOMBOW FUT highlights" },
  59: { videoId: "9Ucw-uMnaa8", sourceName: "World Of Football highlights" },
  60: { videoId: "LpTsbEY7Wik", sourceName: "World Cup Goals highlights" },
  61: { videoId: "ZNFAsCmFHIc", sourceName: "Lapse 2 Football highlights" },
  62: { videoId: "5H1tWF_Oijk", sourceName: "World Cup Goals highlights" },
  63: { videoId: "iF86mUWUaZQ", sourceName: "World Cup Goals highlights" },
  64: { videoId: "S4mRQnHPWTs", sourceName: "TYFC HD highlights" }
};

// FIFA's archive uses internal match-centre IDs rather than the public final
// schedule number. These IDs resolve to the individual official match pages.
const fifaMatchIdsByFixture: Record<number, string> = {
  1: "300186456", 2: "300186492", 3: "300186510", 4: "300186473",
  5: "300186471", 6: "300186507", 7: "300186489", 8: "300186513",
  9: "300186494", 10: "300186496", 11: "300186477", 12: "300186505",
  13: "300186475", 14: "300186512", 15: "300186479", 16: "300186499",
  17: "300186509", 18: "300186453", 19: "300186498", 20: "300186478",
  21: "300186468", 22: "300186454", 23: "300186486", 24: "300186500",
  25: "300186514", 26: "300186463", 27: "300186466", 28: "300186511",
  29: "300186493", 30: "300186483", 31: "300186481", 32: "300186495",
  33: "300186472", 34: "300186452", 35: "300186467", 36: "300186470",
  37: "300186457", 38: "300186455", 39: "300186465", 40: "300186484",
  41: "300186482", 42: "300186515", 43: "300186458", 44: "300186464",
  45: "300186469", 46: "300186476", 47: "300186480", 48: "300186506",
  49: "300186487", 50: "300186491", 51: "300186508", 52: "300186459",
  53: "300186462", 54: "300186460", 55: "300186503", 56: "300186497",
  57: "300186461", 58: "300186485", 59: "300186488", 60: "300186504",
  61: "300186474", 62: "300186490", 63: "300186502", 64: "300186501"
};

function getFifaRoundId(no: number) {
  if (no <= 48) return "255931";
  if (no <= 56) return "255951";
  if (no <= 60) return "255953";
  if (no <= 62) return "255955";
  if (no === 63) return "255957";
  return "255959";
}

function getFifaMatchUrl(fixture: FixtureSeed) {
  const roundId = getFifaRoundId(fixture.no);
  const matchId = fifaMatchIdsByFixture[fixture.no];
  return `https://www.fifa.com/en/match-centre/match/17/251164/${roundId}/${matchId}?date=${fixture.date}`;
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
      id: `wc-2014-${String(fixture.no).padStart(2, "0")}-${fixture.home.toLowerCase()}-${fixture.away.toLowerCase()}`,
      tournamentId: "wc-2014",
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

export const worldCup2014: Tournament = {
  id: "wc-2014",
  competition: "WORLD_CUP",
  name: "Brazil 2014",
  year: 2014,
  hosts: ["BRA"],
  teams: worldCup2014Groups.flatMap((group) => group.teams),
  groups: worldCup2014Groups,
  teamCoordinates: worldCup2014TeamCoordinates,
  format: worldCup2014Format,
  stages: ["group", "r16", "qf", "sf", "third", "final"],
  status: "complete",
  mapView: {
    center: [-52, -14.2],
    zoom: 3.4,
    bearing: -8,
    pitch: 42
  },
  venues,
  featuredRoute: venues.map((venue) => venue.id),
  matches
};
