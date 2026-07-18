import { createYoutubeHighlight } from "@/data/highlights";
import { teamNames } from "@/data/teamMetadata";
import {
  worldCup2018Format,
  worldCup2018Groups,
  worldCup2018TeamCoordinates
} from "@/data/worldCup2018Experience";
import type { Match, ReplayEvent, Score, TeamCode, Tournament, Venue } from "@/lib/types";

type VenueSeed = Pick<Venue, "id" | "name" | "city" | "country" | "coordinates"> & {
  bearing?: number;
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
  { id: "luzhniki-stadium", name: "Luzhniki Stadium", city: "Moscow", country: "RUS", coordinates: [37.4353, 55.7158], bearing: -18 },
  { id: "ekaterinburg-arena", name: "Ekaterinburg Arena", city: "Yekaterinburg", country: "RUS", coordinates: [60.5736, 56.8325], bearing: 16 },
  { id: "saint-petersburg-stadium", name: "Saint Petersburg Stadium", city: "Saint Petersburg", country: "RUS", coordinates: [30.2206, 59.9729], bearing: -20 },
  { id: "fisht-stadium", name: "Fisht Stadium", city: "Sochi", country: "RUS", coordinates: [39.9578, 43.402], bearing: 20 },
  { id: "kazan-arena", name: "Kazan Arena", city: "Kazan", country: "RUS", coordinates: [49.1606, 55.8178], bearing: -16 },
  { id: "spartak-stadium", name: "Spartak Stadium", city: "Moscow", country: "RUS", coordinates: [37.4403, 55.8179], bearing: 18 },
  { id: "mordovia-arena", name: "Mordovia Arena", city: "Saransk", country: "RUS", coordinates: [45.2014, 54.1818], bearing: -14 },
  { id: "kaliningrad-stadium", name: "Kaliningrad Stadium", city: "Kaliningrad", country: "RUS", coordinates: [20.5339, 54.6982], bearing: 14 },
  { id: "samara-arena", name: "Samara Arena", city: "Samara", country: "RUS", coordinates: [50.237, 53.2778], bearing: -22 },
  { id: "rostov-arena", name: "Rostov Arena", city: "Rostov-on-Don", country: "RUS", coordinates: [39.7378, 47.2096], bearing: 22 },
  { id: "nizhny-novgorod-stadium", name: "Nizhny Novgorod Stadium", city: "Nizhny Novgorod", country: "RUS", coordinates: [44.5483, 56.3375], bearing: -24 },
  { id: "volgograd-arena", name: "Volgograd Arena", city: "Volgograd", country: "RUS", coordinates: [44.5486, 48.7345], bearing: 24 }
];

const venues: Venue[] = venueSeeds.map((venue) => ({
  ...venue,
  stadiumView: { center: venue.coordinates, zoom: 16.35, bearing: venue.bearing ?? -12, pitch: 64 }
}));

// Numbering follows FIFA's official final match schedule, including the
// non-chronological ordering of several fixtures played on the same day.
const fixtureSeeds: FixtureSeed[] = [
  { no: 1, stage: "group", date: "2018-06-14", venueId: "luzhniki-stadium", home: "RUS", away: "KSA", score: { home: 5, away: 0 } },
  { no: 2, stage: "group", date: "2018-06-15", venueId: "ekaterinburg-arena", home: "EGY", away: "URU", score: { home: 0, away: 1 } },
  { no: 3, stage: "group", date: "2018-06-15", venueId: "fisht-stadium", home: "POR", away: "ESP", score: { home: 3, away: 3 } },
  { no: 4, stage: "group", date: "2018-06-15", venueId: "saint-petersburg-stadium", home: "MAR", away: "IRN", score: { home: 0, away: 1 } },
  { no: 5, stage: "group", date: "2018-06-16", venueId: "kazan-arena", home: "FRA", away: "AUS", score: { home: 2, away: 1 } },
  { no: 6, stage: "group", date: "2018-06-16", venueId: "mordovia-arena", home: "PER", away: "DEN", score: { home: 0, away: 1 } },
  { no: 7, stage: "group", date: "2018-06-16", venueId: "spartak-stadium", home: "ARG", away: "ISL", score: { home: 1, away: 1 } },
  { no: 8, stage: "group", date: "2018-06-16", venueId: "kaliningrad-stadium", home: "CRO", away: "NGA", score: { home: 2, away: 0 } },
  { no: 9, stage: "group", date: "2018-06-17", venueId: "rostov-arena", home: "BRA", away: "SUI", score: { home: 1, away: 1 } },
  { no: 10, stage: "group", date: "2018-06-17", venueId: "samara-arena", home: "CRC", away: "SRB", score: { home: 0, away: 1 } },
  { no: 11, stage: "group", date: "2018-06-17", venueId: "luzhniki-stadium", home: "GER", away: "MEX", score: { home: 0, away: 1 } },
  { no: 12, stage: "group", date: "2018-06-18", venueId: "nizhny-novgorod-stadium", home: "SWE", away: "KOR", score: { home: 1, away: 0 } },
  { no: 13, stage: "group", date: "2018-06-18", venueId: "fisht-stadium", home: "BEL", away: "PAN", score: { home: 3, away: 0 } },
  { no: 14, stage: "group", date: "2018-06-18", venueId: "volgograd-arena", home: "TUN", away: "ENG", score: { home: 1, away: 2 } },
  { no: 15, stage: "group", date: "2018-06-19", venueId: "spartak-stadium", home: "POL", away: "SEN", score: { home: 1, away: 2 } },
  { no: 16, stage: "group", date: "2018-06-19", venueId: "mordovia-arena", home: "COL", away: "JPN", score: { home: 1, away: 2 } },
  { no: 17, stage: "group", date: "2018-06-19", venueId: "saint-petersburg-stadium", home: "RUS", away: "EGY", score: { home: 3, away: 1 } },
  { no: 18, stage: "group", date: "2018-06-20", venueId: "rostov-arena", home: "URU", away: "KSA", score: { home: 1, away: 0 } },
  { no: 19, stage: "group", date: "2018-06-20", venueId: "luzhniki-stadium", home: "POR", away: "MAR", score: { home: 1, away: 0 } },
  { no: 20, stage: "group", date: "2018-06-20", venueId: "kazan-arena", home: "IRN", away: "ESP", score: { home: 0, away: 1 } },
  { no: 21, stage: "group", date: "2018-06-21", venueId: "ekaterinburg-arena", home: "FRA", away: "PER", score: { home: 1, away: 0 } },
  { no: 22, stage: "group", date: "2018-06-21", venueId: "samara-arena", home: "DEN", away: "AUS", score: { home: 1, away: 1 } },
  { no: 23, stage: "group", date: "2018-06-21", venueId: "nizhny-novgorod-stadium", home: "ARG", away: "CRO", score: { home: 0, away: 3 } },
  { no: 24, stage: "group", date: "2018-06-22", venueId: "volgograd-arena", home: "NGA", away: "ISL", score: { home: 2, away: 0 } },
  { no: 25, stage: "group", date: "2018-06-22", venueId: "saint-petersburg-stadium", home: "BRA", away: "CRC", score: { home: 2, away: 0 } },
  { no: 26, stage: "group", date: "2018-06-22", venueId: "kaliningrad-stadium", home: "SRB", away: "SUI", score: { home: 1, away: 2 } },
  { no: 27, stage: "group", date: "2018-06-23", venueId: "fisht-stadium", home: "GER", away: "SWE", score: { home: 2, away: 1 } },
  { no: 28, stage: "group", date: "2018-06-23", venueId: "rostov-arena", home: "KOR", away: "MEX", score: { home: 1, away: 2 } },
  { no: 29, stage: "group", date: "2018-06-23", venueId: "spartak-stadium", home: "BEL", away: "TUN", score: { home: 5, away: 2 } },
  { no: 30, stage: "group", date: "2018-06-24", venueId: "nizhny-novgorod-stadium", home: "ENG", away: "PAN", score: { home: 6, away: 1 } },
  { no: 31, stage: "group", date: "2018-06-24", venueId: "kazan-arena", home: "POL", away: "COL", score: { home: 0, away: 3 } },
  { no: 32, stage: "group", date: "2018-06-24", venueId: "ekaterinburg-arena", home: "JPN", away: "SEN", score: { home: 2, away: 2 } },
  { no: 33, stage: "group", date: "2018-06-25", venueId: "samara-arena", home: "URU", away: "RUS", score: { home: 3, away: 0 } },
  { no: 34, stage: "group", date: "2018-06-25", venueId: "volgograd-arena", home: "KSA", away: "EGY", score: { home: 2, away: 1 } },
  { no: 35, stage: "group", date: "2018-06-25", venueId: "mordovia-arena", home: "IRN", away: "POR", score: { home: 1, away: 1 } },
  { no: 36, stage: "group", date: "2018-06-25", venueId: "kaliningrad-stadium", home: "ESP", away: "MAR", score: { home: 2, away: 2 } },
  { no: 37, stage: "group", date: "2018-06-26", venueId: "luzhniki-stadium", home: "DEN", away: "FRA", score: { home: 0, away: 0 } },
  { no: 38, stage: "group", date: "2018-06-26", venueId: "fisht-stadium", home: "AUS", away: "PER", score: { home: 0, away: 2 } },
  { no: 39, stage: "group", date: "2018-06-26", venueId: "saint-petersburg-stadium", home: "NGA", away: "ARG", score: { home: 1, away: 2 } },
  { no: 40, stage: "group", date: "2018-06-26", venueId: "rostov-arena", home: "ISL", away: "CRO", score: { home: 1, away: 2 } },
  { no: 41, stage: "group", date: "2018-06-27", venueId: "spartak-stadium", home: "SRB", away: "BRA", score: { home: 0, away: 2 } },
  { no: 42, stage: "group", date: "2018-06-27", venueId: "nizhny-novgorod-stadium", home: "SUI", away: "CRC", score: { home: 2, away: 2 } },
  { no: 43, stage: "group", date: "2018-06-27", venueId: "kazan-arena", home: "KOR", away: "GER", score: { home: 2, away: 0 } },
  { no: 44, stage: "group", date: "2018-06-27", venueId: "ekaterinburg-arena", home: "MEX", away: "SWE", score: { home: 0, away: 3 } },
  { no: 45, stage: "group", date: "2018-06-28", venueId: "kaliningrad-stadium", home: "ENG", away: "BEL", score: { home: 0, away: 1 } },
  { no: 46, stage: "group", date: "2018-06-28", venueId: "mordovia-arena", home: "PAN", away: "TUN", score: { home: 1, away: 2 } },
  { no: 47, stage: "group", date: "2018-06-28", venueId: "volgograd-arena", home: "JPN", away: "POL", score: { home: 0, away: 1 } },
  { no: 48, stage: "group", date: "2018-06-28", venueId: "samara-arena", home: "SEN", away: "COL", score: { home: 0, away: 1 } },
  { no: 49, stage: "r16", date: "2018-06-30", venueId: "fisht-stadium", home: "URU", away: "POR", score: { home: 2, away: 1 } },
  { no: 50, stage: "r16", date: "2018-06-30", venueId: "kazan-arena", home: "FRA", away: "ARG", score: { home: 4, away: 3 } },
  { no: 51, stage: "r16", date: "2018-07-01", venueId: "luzhniki-stadium", home: "ESP", away: "RUS", score: { home: 1, away: 1 }, shootout: { home: 3, away: 4 }, durationMinutes: 120, note: "Russia won 4-3 on penalties" },
  { no: 52, stage: "r16", date: "2018-07-01", venueId: "nizhny-novgorod-stadium", home: "CRO", away: "DEN", score: { home: 1, away: 1 }, shootout: { home: 3, away: 2 }, durationMinutes: 120, note: "Croatia won 3-2 on penalties" },
  { no: 53, stage: "r16", date: "2018-07-02", venueId: "samara-arena", home: "BRA", away: "MEX", score: { home: 2, away: 0 } },
  { no: 54, stage: "r16", date: "2018-07-02", venueId: "rostov-arena", home: "BEL", away: "JPN", score: { home: 3, away: 2 } },
  { no: 55, stage: "r16", date: "2018-07-03", venueId: "saint-petersburg-stadium", home: "SWE", away: "SUI", score: { home: 1, away: 0 } },
  { no: 56, stage: "r16", date: "2018-07-03", venueId: "spartak-stadium", home: "COL", away: "ENG", score: { home: 1, away: 1 }, shootout: { home: 3, away: 4 }, durationMinutes: 120, note: "England won 4-3 on penalties" },
  { no: 57, stage: "qf", date: "2018-07-06", venueId: "nizhny-novgorod-stadium", home: "URU", away: "FRA", score: { home: 0, away: 2 } },
  { no: 58, stage: "qf", date: "2018-07-06", venueId: "kazan-arena", home: "BRA", away: "BEL", score: { home: 1, away: 2 } },
  { no: 59, stage: "qf", date: "2018-07-07", venueId: "fisht-stadium", home: "RUS", away: "CRO", score: { home: 2, away: 2 }, shootout: { home: 3, away: 4 }, durationMinutes: 120, note: "Croatia won 4-3 on penalties" },
  { no: 60, stage: "qf", date: "2018-07-07", venueId: "samara-arena", home: "SWE", away: "ENG", score: { home: 0, away: 2 } },
  { no: 61, stage: "sf", date: "2018-07-10", venueId: "saint-petersburg-stadium", home: "FRA", away: "BEL", score: { home: 1, away: 0 } },
  { no: 62, stage: "sf", date: "2018-07-11", venueId: "luzhniki-stadium", home: "CRO", away: "ENG", score: { home: 2, away: 1 }, durationMinutes: 120, note: "After extra time" },
  { no: 63, stage: "third", date: "2018-07-14", venueId: "saint-petersburg-stadium", home: "BEL", away: "ENG", score: { home: 2, away: 0 } },
  { no: 64, stage: "final", date: "2018-07-15", venueId: "luzhniki-stadium", home: "FRA", away: "CRO", score: { home: 4, away: 2 } }
];

// Scorers and minute labels follow the Fjelstul World Cup Database and are
// remapped to the official FIFA schedule above by date and exact team pairing.
const goalsByFixture: Partial<Record<number, GoalSeed[]>> = {
  1: [[12, "RUS", "Yury Gazinsky"], [43, "RUS", "Denis Cheryshev"], [71, "RUS", "Artem Dzyuba"], [90, "RUS", "Denis Cheryshev", "Denis Cheryshev scores in second-half stoppage time."], [90, "RUS", "Aleksandr Golovin", "Aleksandr Golovin scores in second-half stoppage time."]],
  2: [[89, "URU", "José Giménez"]],
  3: [[4, "POR", "Cristiano Ronaldo", "Cristiano Ronaldo scores from the penalty spot."], [24, "ESP", "Diego Costa"], [44, "POR", "Cristiano Ronaldo"], [55, "ESP", "Diego Costa"], [58, "ESP", "Nacho"], [88, "POR", "Cristiano Ronaldo"]],
  4: [[90, "IRN", "Aziz Bouhaddouz", "Aziz Bouhaddouz scores an own goal in second-half stoppage time."]],
  5: [[58, "FRA", "Antoine Griezmann", "Antoine Griezmann scores from the penalty spot."], [62, "AUS", "Mile Jedinak", "Mile Jedinak scores from the penalty spot."], [81, "FRA", "Aziz Behich", "Aziz Behich scores an own goal."]],
  6: [[59, "DEN", "Yussuf Poulsen"]],
  7: [[19, "ARG", "Sergio Agüero"], [23, "ISL", "Alfreð Finnbogason"]],
  8: [[32, "CRO", "Peter Etebo", "Peter Etebo scores an own goal."], [71, "CRO", "Luka Modrić", "Luka Modrić scores from the penalty spot."]],
  9: [[20, "BRA", "Philippe Coutinho"], [50, "SUI", "Steven Zuber"]],
  10: [[56, "SRB", "Aleksandar Kolarov"]],
  11: [[35, "MEX", "Hirving Lozano"]],
  12: [[65, "SWE", "Andreas Granqvist", "Andreas Granqvist scores from the penalty spot."]],
  13: [[47, "BEL", "Dries Mertens"], [69, "BEL", "Romelu Lukaku"], [75, "BEL", "Romelu Lukaku"]],
  14: [[11, "ENG", "Harry Kane"], [35, "TUN", "Ferjani Sassi", "Ferjani Sassi scores from the penalty spot."], [90, "ENG", "Harry Kane", "Harry Kane scores in second-half stoppage time."]],
  15: [[37, "SEN", "Thiago Cionek", "Thiago Cionek scores an own goal."], [60, "SEN", "M'Baye Niang"], [86, "POL", "Grzegorz Krychowiak"]],
  16: [[6, "JPN", "Shinji Kagawa", "Shinji Kagawa scores from the penalty spot."], [39, "COL", "Juan Fernando Quintero"], [73, "JPN", "Yuya Osako"]],
  17: [[47, "RUS", "Ahmed Fathy", "Ahmed Fathy scores an own goal."], [59, "RUS", "Denis Cheryshev"], [62, "RUS", "Artem Dzyuba"], [73, "EGY", "Mohamed Salah", "Mohamed Salah scores from the penalty spot."]],
  18: [[23, "URU", "Luis Suárez"]],
  19: [[4, "POR", "Cristiano Ronaldo"]],
  20: [[54, "ESP", "Diego Costa"]],
  21: [[34, "FRA", "Kylian Mbappé"]],
  22: [[7, "DEN", "Christian Eriksen"], [38, "AUS", "Mile Jedinak", "Mile Jedinak scores from the penalty spot."]],
  23: [[53, "CRO", "Ante Rebić"], [80, "CRO", "Luka Modrić"], [90, "CRO", "Ivan Rakitić", "Ivan Rakitić scores in second-half stoppage time."]],
  24: [[49, "NGA", "Ahmed Musa"], [75, "NGA", "Ahmed Musa"]],
  25: [[90, "BRA", "Philippe Coutinho", "Philippe Coutinho scores in second-half stoppage time."], [90, "BRA", "Neymar", "Neymar scores in second-half stoppage time."]],
  26: [[5, "SRB", "Aleksandar Mitrović"], [52, "SUI", "Granit Xhaka"], [90, "SUI", "Xherdan Shaqiri"]],
  27: [[32, "SWE", "Ola Toivonen"], [48, "GER", "Marco Reus"], [90, "GER", "Toni Kroos", "Toni Kroos scores in second-half stoppage time."]],
  28: [[26, "MEX", "Carlos Vela", "Carlos Vela scores from the penalty spot."], [66, "MEX", "Javier Hernández"], [90, "KOR", "Heung-min Son", "Heung-min Son scores in second-half stoppage time."]],
  29: [[6, "BEL", "Eden Hazard", "Eden Hazard scores from the penalty spot."], [16, "BEL", "Romelu Lukaku"], [18, "TUN", "Dylan Bronn"], [45, "BEL", "Romelu Lukaku", "Romelu Lukaku scores in first-half stoppage time."], [51, "BEL", "Eden Hazard"], [90, "BEL", "Michy Batshuayi"], [90, "TUN", "Wahbi Khazri", "Wahbi Khazri scores in second-half stoppage time."]],
  30: [[8, "ENG", "John Stones"], [22, "ENG", "Harry Kane", "Harry Kane scores from the penalty spot."], [36, "ENG", "Jesse Lingard"], [40, "ENG", "John Stones"], [45, "ENG", "Harry Kane", "Harry Kane scores from the penalty spot in first-half stoppage time."], [62, "ENG", "Harry Kane"], [78, "PAN", "Felipe Baloy"]],
  31: [[40, "COL", "Yerry Mina"], [70, "COL", "Radamel Falcao"], [75, "COL", "Juan Cuadrado"]],
  32: [[11, "SEN", "Sadio Mané"], [34, "JPN", "Takashi Inui"], [71, "SEN", "Moussa Wagué"], [78, "JPN", "Keisuke Honda"]],
  33: [[10, "URU", "Luis Suárez"], [23, "URU", "Denis Cheryshev", "Denis Cheryshev scores an own goal."], [90, "URU", "Edinson Cavani"]],
  34: [[22, "EGY", "Mohamed Salah"], [45, "KSA", "Salman Al-Faraj", "Salman Al-Faraj scores from the penalty spot in first-half stoppage time."], [90, "KSA", "Salem Al-Dawsari", "Salem Al-Dawsari scores in second-half stoppage time."]],
  35: [[45, "POR", "Ricardo Quaresma"], [90, "IRN", "Karim Ansarifard", "Karim Ansarifard scores from the penalty spot in second-half stoppage time."]],
  36: [[14, "MAR", "Khalid Boutaïb"], [19, "ESP", "Isco"], [81, "MAR", "Youssef En-Nesyri"], [90, "ESP", "Iago Aspas", "Iago Aspas scores in second-half stoppage time."]],
  38: [[18, "PER", "André Carrillo"], [50, "PER", "Paolo Guerrero"]],
  39: [[14, "ARG", "Lionel Messi"], [51, "NGA", "Victor Moses", "Victor Moses scores from the penalty spot."], [86, "ARG", "Marcos Rojo"]],
  40: [[53, "CRO", "Milan Badelj"], [76, "ISL", "Gylfi Sigurðsson", "Gylfi Sigurðsson scores from the penalty spot."], [90, "CRO", "Ivan Perišić"]],
  41: [[36, "BRA", "Paulinho"], [68, "BRA", "Thiago Silva"]],
  42: [[31, "SUI", "Blerim Džemaili"], [56, "CRC", "Kendall Waston"], [88, "SUI", "Josip Drmić"], [90, "CRC", "Yann Sommer", "Yann Sommer scores an own goal in second-half stoppage time."]],
  43: [[90, "KOR", "Young-gwon Kim", "Young-gwon Kim scores in second-half stoppage time."], [90, "KOR", "Heung-min Son", "Heung-min Son scores in second-half stoppage time."]],
  44: [[50, "SWE", "Ludwig Augustinsson"], [62, "SWE", "Andreas Granqvist", "Andreas Granqvist scores from the penalty spot."], [74, "SWE", "Edson Álvarez", "Edson Álvarez scores an own goal."]],
  45: [[51, "BEL", "Adnan Januzaj"]],
  46: [[33, "PAN", "Yassine Meriah", "Yassine Meriah scores an own goal."], [51, "TUN", "Fakhreddine Ben Youssef"], [66, "TUN", "Wahbi Khazri"]],
  47: [[59, "POL", "Jan Bednarek"]],
  48: [[74, "COL", "Yerry Mina"]],
  49: [[7, "URU", "Edinson Cavani"], [55, "POR", "Pepe"], [62, "URU", "Edinson Cavani"]],
  50: [[13, "FRA", "Antoine Griezmann", "Antoine Griezmann scores from the penalty spot."], [41, "ARG", "Ángel Di María"], [48, "ARG", "Gabriel Mercado"], [57, "FRA", "Benjamin Pavard"], [64, "FRA", "Kylian Mbappé"], [68, "FRA", "Kylian Mbappé"], [90, "ARG", "Sergio Agüero", "Sergio Agüero scores in second-half stoppage time."]],
  51: [[12, "ESP", "Sergei Ignashevich", "Sergei Ignashevich scores an own goal."], [41, "RUS", "Artem Dzyuba", "Artem Dzyuba scores from the penalty spot."]],
  52: [[1, "DEN", "Mathias Jørgensen"], [4, "CRO", "Mario Mandžukić"]],
  53: [[51, "BRA", "Neymar"], [88, "BRA", "Roberto Firmino"]],
  54: [[48, "JPN", "Genki Haraguchi"], [52, "JPN", "Takashi Inui"], [69, "BEL", "Jan Vertonghen"], [74, "BEL", "Marouane Fellaini"], [90, "BEL", "Nacer Chadli", "Nacer Chadli scores in second-half stoppage time."]],
  55: [[66, "SWE", "Emil Forsberg"]],
  56: [[57, "ENG", "Harry Kane", "Harry Kane scores from the penalty spot."], [90, "COL", "Yerry Mina", "Yerry Mina scores in second-half stoppage time."]],
  57: [[40, "FRA", "Raphaël Varane"], [61, "FRA", "Antoine Griezmann"]],
  58: [[13, "BEL", "Fernandinho", "Fernandinho scores an own goal."], [31, "BEL", "Kevin De Bruyne"], [76, "BRA", "Renato Augusto"]],
  59: [[31, "RUS", "Denis Cheryshev"], [39, "CRO", "Andrej Kramarić"], [101, "CRO", "Domagoj Vida"], [115, "RUS", "Mário Fernandes"]],
  60: [[30, "ENG", "Harry Maguire"], [59, "ENG", "Dele Alli"]],
  61: [[51, "FRA", "Samuel Umtiti"]],
  62: [[5, "ENG", "Kieran Trippier"], [68, "CRO", "Ivan Perišić"], [109, "CRO", "Mario Mandžukić"]],
  63: [[4, "BEL", "Thomas Meunier"], [82, "BEL", "Eden Hazard"]],
  64: [[18, "FRA", "Mario Mandžukić", "Mario Mandžukić scores an own goal."], [28, "CRO", "Ivan Perišić"], [38, "FRA", "Antoine Griezmann", "Antoine Griezmann scores from the penalty spot."], [59, "FRA", "Paul Pogba"], [65, "FRA", "Kylian Mbappé"], [69, "CRO", "Mario Mandžukić"]]
};

type YouTubeHighlightSeed = { videoId: string; sourceName: string };

// Each exact-match selection passed YouTube's real embedded-player response
// with status OK and playableInEmbed=true using the app origin.
const youtubeHighlightsByFixture: Record<number, YouTubeHighlightSeed> = {
  1: { videoId: "sNBjfr1tv3g", sourceName: "Prince Noob highlights" },
  2: { videoId: "_TkNvKIycRQ", sourceName: "Ash Entertainment highlights" },
  3: { videoId: "mX3YkciKirA", sourceName: "Football Flow highlights" },
  4: { videoId: "-gdolqv6d8w", sourceName: "Historical Matches HD highlights" },
  5: { videoId: "MulsgxLD4PE", sourceName: "Syfo Football Highlights HD" },
  6: { videoId: "qK5Rhzoc7GM", sourceName: "World Cup 2018 OFFICIAL highlights" },
  7: { videoId: "J_lTU-C2dIE", sourceName: "Top Soccer highlights" },
  8: { videoId: "B4tsjp2DyBM", sourceName: "SOCCER HOUSE highlights" },
  9: { videoId: "AQkdSBPidoQ", sourceName: "FOOTBALL TV highlights" },
  10: { videoId: "Ro9zu6qKJeU", sourceName: "Prince Noob highlights" },
  11: { videoId: "Xjdr5ARWmdM", sourceName: "Sport Zone highlights" },
  12: { videoId: "yxL_JDXIX3k", sourceName: "Prince Noob highlights" },
  13: { videoId: "K9EzAcCsvXw", sourceName: "Sport Zone highlights" },
  14: { videoId: "Fr3dN9C1dFc", sourceName: "ACE Global Media highlights" },
  15: { videoId: "80la37ZMP6w", sourceName: "Syfo Football Highlights HD" },
  16: { videoId: "6nFxlz5BXIw", sourceName: "Footy HD highlights" },
  17: { videoId: "NSGDNtF18O8", sourceName: "Syfo Football Highlights HD" },
  18: { videoId: "Pb01FSNJ9Eo", sourceName: "Sport Zone highlights" },
  19: { videoId: "7kM0lchy9EE", sourceName: "lapse football highlights" },
  20: { videoId: "1R9Fr76aFKA", sourceName: "Sport Zone highlights" },
  21: { videoId: "8TllW4CYXNo", sourceName: "BOT TOP highlights" },
  22: { videoId: "NwFledl5l48", sourceName: "Prince Noob highlights" },
  23: { videoId: "A0HYw2h7pv8", sourceName: "Driss Football Tv highlights" },
  24: { videoId: "ZTtVU77TprQ", sourceName: "Prince Noob highlights" },
  25: { videoId: "gLKsYXizgu8", sourceName: "R A Y A N highlights" },
  26: { videoId: "j6tCyvvE1HU", sourceName: "Prince Noob highlights" },
  27: { videoId: "TNPhjBH-1d0", sourceName: "Prince Noob highlights" },
  28: { videoId: "sVnurAW9-hc", sourceName: "THE OLYMPIC highlights" },
  29: { videoId: "Ia8aioIsqUQ", sourceName: "Syfo Football Highlights HD" },
  30: { videoId: "jMeGTrq4BvI", sourceName: "Syfo Football Highlights HD" },
  31: { videoId: "lt9LLVqPE2w", sourceName: "World Cup Highlights 2018" },
  32: { videoId: "L_Z5VDqaXcI", sourceName: "Prince Noob highlights" },
  33: { videoId: "FmA0YaOmKbM", sourceName: "Prince Noob highlights" },
  34: { videoId: "2LPPXJ9QeHw", sourceName: "WatchThisFreshStuff highlights" },
  35: { videoId: "KygoGTlWuTg", sourceName: "Sport Zone highlights" },
  36: { videoId: "4XKbtdaqvUQ", sourceName: "The Soccerbook highlights" },
  37: { videoId: "Kxvc-1mt_b0", sourceName: "World Football Highlights - Scorenga" },
  38: { videoId: "ek8LW32a2Fw", sourceName: "Prince Noob highlights" },
  39: { videoId: "emPnnGqhNvg", sourceName: "Football107 highlights" },
  40: { videoId: "kxsgQH6Hh5Y", sourceName: "Prince Noob highlights" },
  41: { videoId: "ihYZFUGKe5g", sourceName: "Football King highlights" },
  42: { videoId: "c82pu98uqAk", sourceName: "Football Spotlight highlights" },
  43: { videoId: "9aTnKmelkOE", sourceName: "Ultimate Goals highlights" },
  44: { videoId: "1TL_G6p4o4g", sourceName: "WatchThisFreshStuff highlights" },
  45: { videoId: "rBVZe9zDpRI", sourceName: "SoccerSkills highlights" },
  46: { videoId: "WoLTVr5NtSI", sourceName: "Prince Noob highlights" },
  47: { videoId: "WV6PPXOppwg", sourceName: "World Cup highlights" },
  48: { videoId: "8CkbofrTuEc", sourceName: "Prince Noob highlights" },
  49: { videoId: "sXixDdYdvCc", sourceName: "Football107 highlights" },
  50: { videoId: "ZI3CIJj2aPk", sourceName: "VixoTV highlights" },
  51: { videoId: "xvgw2R9bPPo", sourceName: "Football King highlights" },
  52: { videoId: "d_YhEEuYvLg", sourceName: "The Era Of Sports highlights" },
  53: { videoId: "Om07naAd9qM", sourceName: "Football107 highlights" },
  54: { videoId: "qsG_xlpNHRE", sourceName: "Football Factory highlights" },
  55: { videoId: "BpibirHaBpA", sourceName: "WeLoveFootball highlights" },
  56: { videoId: "tE8bptp62zk", sourceName: "Serendipity highlights" },
  57: { videoId: "xPjsViPfBZ8", sourceName: "TYFC HD highlights" },
  58: { videoId: "anOlN-X0-zU", sourceName: "Football Factory highlights" },
  59: { videoId: "DHD_A87d2bs", sourceName: "GoalDen highlights" },
  60: { videoId: "Aor2NMABWho", sourceName: "World Football Highlights - Scorenga" },
  61: { videoId: "67L29sRPU1k", sourceName: "101sports highlights" },
  62: { videoId: "aKkI2KNNgXk", sourceName: "Historical Matches HD highlights" },
  63: { videoId: "Xb-bYjs0m4o", sourceName: "World Football Highlights - Scorenga" },
  64: { videoId: "-FPXHR2bZBQ", sourceName: "101sports highlights" }
};

const fifaMatchIdsByFixture: Record<number, string> = {
  1: "300331503", 2: "300353632", 3: "300331524", 4: "300331526", 5: "300331533", 6: "300331528", 7: "300331515", 8: "300331523",
  9: "300331525", 10: "300331529", 11: "300331502", 12: "300331499", 13: "300331539", 14: "300331554", 15: "300331545", 16: "300331550",
  17: "300331495", 18: "300331530", 19: "300331511", 20: "300331496", 21: "300331527", 22: "300331518", 23: "300331513", 24: "300331497",
  25: "300331540", 26: "300340183", 27: "300331501", 28: "300331549", 29: "300331547", 30: "300331546", 31: "300331508", 32: "300331505",
  33: "300331516", 34: "300331509", 35: "300331500", 36: "300340184", 37: "300331512", 38: "300331506", 39: "300331519", 40: "300331510",
  41: "300331521", 42: "300331534", 43: "300331532", 44: "300331548", 45: "300340182", 46: "300331520", 47: "300331507", 48: "300331553",
  49: "300331544", 50: "300331537", 51: "300331517", 52: "300331498", 53: "300331535", 54: "300331551", 55: "300331514", 56: "300331542",
  57: "300331543", 58: "300331538", 59: "300331504", 60: "300331541", 61: "300331531", 62: "300331522", 63: "300331536", 64: "300331552"
};

function getFifaRoundId(no: number) {
  if (no <= 48) return "275073";
  if (no <= 56) return "275093";
  if (no <= 60) return "275095";
  if (no <= 62) return "275097";
  if (no === 63) return "275099";
  return "275101";
}

function getFifaMatchUrl(fixture: FixtureSeed) {
  return `https://www.fifa.com/en/match-centre/match/17/254645/${getFifaRoundId(fixture.no)}/${fifaMatchIdsByFixture[fixture.no]}?date=${fixture.date}`;
}

function getVenueName(venueId: string) {
  return venues.find((venue) => venue.id === venueId)?.name ?? venueId;
}

function getGoals(fixture: FixtureSeed) {
  return goalsByFixture[fixture.no] ?? [];
}

function getHalftimeScore(goals: GoalSeed[], home: TeamCode, away: TeamCode): Score {
  return goals.reduce((score, [minute, team]) => {
    if (minute > 45) return score;
    if (team === home) score.home += 1;
    if (team === away) score.away += 1;
    return score;
  }, { home: 0, away: 0 });
}

function createGoalEvents(fixture: FixtureSeed): ReplayEvent[] {
  let homeScore = 0;
  let awayScore = 0;

  return [...getGoals(fixture)].sort((left, right) => left[0] - right[0]).map(([minute, team, player, detail], index) => {
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

const matches: Match[] = fixtureSeeds.map((fixture) => {
  const youtube = youtubeHighlightsByFixture[fixture.no];
  const highlights = createYoutubeHighlight(youtube.videoId, getFifaMatchUrl(fixture), youtube.sourceName);
  return {
    id: `wc-2018-${String(fixture.no).padStart(2, "0")}-${fixture.home.toLowerCase()}-${fixture.away.toLowerCase()}`,
    tournamentId: "wc-2018",
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
}).sort((left, right) => left.date.localeCompare(right.date) || left.id.localeCompare(right.id));

export const worldCup2018: Tournament = {
  id: "wc-2018",
  competition: "WORLD_CUP",
  name: "Russia 2018",
  year: 2018,
  hosts: ["RUS"],
  teams: worldCup2018Groups.flatMap((group) => group.teams),
  groups: worldCup2018Groups,
  teamCoordinates: worldCup2018TeamCoordinates,
  format: worldCup2018Format,
  stages: ["group", "r16", "qf", "sf", "third", "final"],
  status: "complete",
  mapView: { center: [43.5, 55], zoom: 3.35, bearing: -8, pitch: 42 },
  venues,
  featuredRoute: venues.map((venue) => venue.id),
  matches
};
