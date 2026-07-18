import { teamNames } from "@/data/teamMetadata";
import { createOfficialReportHighlight, createYoutubeHighlight } from "@/data/highlights";
import {
  worldCup2010Format,
  worldCup2010Groups,
  worldCup2010TeamCoordinates
} from "@/data/worldCup2010Experience";
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
  { id: "soccer-city", name: "Soccer City", city: "Johannesburg", country: "RSA", coordinates: [27.9827, -26.2347], bearing: -18, zoom: 16.45 },
  { id: "cape-town-stadium", name: "Cape Town Stadium", city: "Cape Town", country: "RSA", coordinates: [18.4112, -33.9035], bearing: 16 },
  { id: "moses-mabhida-stadium", name: "Moses Mabhida Stadium", city: "Durban", country: "RSA", coordinates: [31.0303, -29.829], bearing: -22, zoom: 16.5 },
  { id: "ellis-park-stadium", name: "Ellis Park Stadium", city: "Johannesburg", country: "RSA", coordinates: [28.0602, -26.1976], bearing: 20 },
  { id: "free-state-stadium", name: "Free State Stadium", city: "Bloemfontein", country: "RSA", coordinates: [26.2344, -29.1172], bearing: -14 },
  { id: "mbombela-stadium", name: "Mbombela Stadium", city: "Nelspruit", country: "RSA", coordinates: [30.9296, -25.4619], bearing: 18 },
  { id: "peter-mokaba-stadium", name: "Peter Mokaba Stadium", city: "Polokwane", country: "RSA", coordinates: [29.4689, -23.9248], bearing: -20 },
  { id: "nelson-mandela-bay-stadium", name: "Nelson Mandela Bay Stadium", city: "Port Elizabeth", country: "RSA", coordinates: [25.5989, -33.9379], bearing: 14, zoom: 16.5 },
  { id: "loftus-versfeld-stadium", name: "Loftus Versfeld Stadium", city: "Pretoria", country: "RSA", coordinates: [28.2229, -25.7534], bearing: -24 },
  { id: "royal-bafokeng-stadium", name: "Royal Bafokeng Stadium", city: "Rustenburg", country: "RSA", coordinates: [27.1607, -25.5787], bearing: 22 }
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
// chronological order. That distinction matters for several simultaneous
// group matches and for Argentina-Nigeria / Korea Republic-Greece.
const fixtureSeeds: FixtureSeed[] = [
  { no: 1, stage: "group", date: "2010-06-11", venueId: "soccer-city", home: "RSA", away: "MEX", score: { home: 1, away: 1 } },
  { no: 2, stage: "group", date: "2010-06-11", venueId: "cape-town-stadium", home: "URU", away: "FRA", score: { home: 0, away: 0 } },
  { no: 3, stage: "group", date: "2010-06-12", venueId: "ellis-park-stadium", home: "ARG", away: "NGA", score: { home: 1, away: 0 } },
  { no: 4, stage: "group", date: "2010-06-12", venueId: "nelson-mandela-bay-stadium", home: "KOR", away: "GRE", score: { home: 2, away: 0 } },
  { no: 5, stage: "group", date: "2010-06-12", venueId: "royal-bafokeng-stadium", home: "ENG", away: "USA", score: { home: 1, away: 1 } },
  { no: 6, stage: "group", date: "2010-06-13", venueId: "peter-mokaba-stadium", home: "ALG", away: "SVN", score: { home: 0, away: 1 } },
  { no: 7, stage: "group", date: "2010-06-13", venueId: "moses-mabhida-stadium", home: "GER", away: "AUS", score: { home: 4, away: 0 } },
  { no: 8, stage: "group", date: "2010-06-13", venueId: "loftus-versfeld-stadium", home: "SRB", away: "GHA", score: { home: 0, away: 1 } },
  { no: 9, stage: "group", date: "2010-06-14", venueId: "soccer-city", home: "NED", away: "DEN", score: { home: 2, away: 0 } },
  { no: 10, stage: "group", date: "2010-06-14", venueId: "free-state-stadium", home: "JPN", away: "CMR", score: { home: 1, away: 0 } },
  { no: 11, stage: "group", date: "2010-06-14", venueId: "cape-town-stadium", home: "ITA", away: "PAR", score: { home: 1, away: 1 } },
  { no: 12, stage: "group", date: "2010-06-15", venueId: "royal-bafokeng-stadium", home: "NZL", away: "SVK", score: { home: 1, away: 1 } },
  { no: 13, stage: "group", date: "2010-06-15", venueId: "nelson-mandela-bay-stadium", home: "CIV", away: "POR", score: { home: 0, away: 0 } },
  { no: 14, stage: "group", date: "2010-06-15", venueId: "ellis-park-stadium", home: "BRA", away: "PRK", score: { home: 2, away: 1 } },
  { no: 15, stage: "group", date: "2010-06-16", venueId: "mbombela-stadium", home: "HON", away: "CHI", score: { home: 0, away: 1 } },
  { no: 16, stage: "group", date: "2010-06-16", venueId: "moses-mabhida-stadium", home: "ESP", away: "SUI", score: { home: 0, away: 1 } },
  { no: 17, stage: "group", date: "2010-06-16", venueId: "loftus-versfeld-stadium", home: "RSA", away: "URU", score: { home: 0, away: 3 } },
  { no: 18, stage: "group", date: "2010-06-17", venueId: "peter-mokaba-stadium", home: "FRA", away: "MEX", score: { home: 0, away: 2 } },
  { no: 19, stage: "group", date: "2010-06-17", venueId: "free-state-stadium", home: "GRE", away: "NGA", score: { home: 2, away: 1 } },
  { no: 20, stage: "group", date: "2010-06-17", venueId: "soccer-city", home: "ARG", away: "KOR", score: { home: 4, away: 1 } },
  { no: 21, stage: "group", date: "2010-06-18", venueId: "nelson-mandela-bay-stadium", home: "GER", away: "SRB", score: { home: 0, away: 1 } },
  { no: 22, stage: "group", date: "2010-06-18", venueId: "ellis-park-stadium", home: "SVN", away: "USA", score: { home: 2, away: 2 } },
  { no: 23, stage: "group", date: "2010-06-18", venueId: "cape-town-stadium", home: "ENG", away: "ALG", score: { home: 0, away: 0 } },
  { no: 24, stage: "group", date: "2010-06-19", venueId: "royal-bafokeng-stadium", home: "GHA", away: "AUS", score: { home: 1, away: 1 } },
  { no: 25, stage: "group", date: "2010-06-19", venueId: "moses-mabhida-stadium", home: "NED", away: "JPN", score: { home: 1, away: 0 } },
  { no: 26, stage: "group", date: "2010-06-19", venueId: "loftus-versfeld-stadium", home: "CMR", away: "DEN", score: { home: 1, away: 2 } },
  { no: 27, stage: "group", date: "2010-06-20", venueId: "free-state-stadium", home: "SVK", away: "PAR", score: { home: 0, away: 2 } },
  { no: 28, stage: "group", date: "2010-06-20", venueId: "mbombela-stadium", home: "ITA", away: "NZL", score: { home: 1, away: 1 } },
  { no: 29, stage: "group", date: "2010-06-20", venueId: "soccer-city", home: "BRA", away: "CIV", score: { home: 3, away: 1 } },
  { no: 30, stage: "group", date: "2010-06-21", venueId: "cape-town-stadium", home: "POR", away: "PRK", score: { home: 7, away: 0 } },
  { no: 31, stage: "group", date: "2010-06-21", venueId: "nelson-mandela-bay-stadium", home: "CHI", away: "SUI", score: { home: 1, away: 0 } },
  { no: 32, stage: "group", date: "2010-06-21", venueId: "ellis-park-stadium", home: "ESP", away: "HON", score: { home: 2, away: 0 } },
  { no: 33, stage: "group", date: "2010-06-22", venueId: "royal-bafokeng-stadium", home: "MEX", away: "URU", score: { home: 0, away: 1 } },
  { no: 34, stage: "group", date: "2010-06-22", venueId: "free-state-stadium", home: "FRA", away: "RSA", score: { home: 1, away: 2 } },
  { no: 35, stage: "group", date: "2010-06-22", venueId: "moses-mabhida-stadium", home: "NGA", away: "KOR", score: { home: 2, away: 2 } },
  { no: 36, stage: "group", date: "2010-06-22", venueId: "peter-mokaba-stadium", home: "GRE", away: "ARG", score: { home: 0, away: 2 } },
  { no: 37, stage: "group", date: "2010-06-23", venueId: "nelson-mandela-bay-stadium", home: "SVN", away: "ENG", score: { home: 0, away: 1 } },
  { no: 38, stage: "group", date: "2010-06-23", venueId: "loftus-versfeld-stadium", home: "USA", away: "ALG", score: { home: 1, away: 0 } },
  { no: 39, stage: "group", date: "2010-06-23", venueId: "soccer-city", home: "GHA", away: "GER", score: { home: 0, away: 1 } },
  { no: 40, stage: "group", date: "2010-06-23", venueId: "mbombela-stadium", home: "AUS", away: "SRB", score: { home: 2, away: 1 } },
  { no: 41, stage: "group", date: "2010-06-24", venueId: "ellis-park-stadium", home: "SVK", away: "ITA", score: { home: 3, away: 2 } },
  { no: 42, stage: "group", date: "2010-06-24", venueId: "peter-mokaba-stadium", home: "PAR", away: "NZL", score: { home: 0, away: 0 } },
  { no: 43, stage: "group", date: "2010-06-24", venueId: "royal-bafokeng-stadium", home: "DEN", away: "JPN", score: { home: 1, away: 3 } },
  { no: 44, stage: "group", date: "2010-06-24", venueId: "cape-town-stadium", home: "CMR", away: "NED", score: { home: 1, away: 2 } },
  { no: 45, stage: "group", date: "2010-06-25", venueId: "moses-mabhida-stadium", home: "POR", away: "BRA", score: { home: 0, away: 0 } },
  { no: 46, stage: "group", date: "2010-06-25", venueId: "mbombela-stadium", home: "PRK", away: "CIV", score: { home: 0, away: 3 } },
  { no: 47, stage: "group", date: "2010-06-25", venueId: "loftus-versfeld-stadium", home: "CHI", away: "ESP", score: { home: 1, away: 2 } },
  { no: 48, stage: "group", date: "2010-06-25", venueId: "free-state-stadium", home: "SUI", away: "HON", score: { home: 0, away: 0 } },
  { no: 49, stage: "r16", date: "2010-06-26", venueId: "nelson-mandela-bay-stadium", home: "URU", away: "KOR", score: { home: 2, away: 1 } },
  { no: 50, stage: "r16", date: "2010-06-26", venueId: "royal-bafokeng-stadium", home: "USA", away: "GHA", score: { home: 1, away: 2 }, durationMinutes: 120, note: "After extra time" },
  { no: 51, stage: "r16", date: "2010-06-27", venueId: "free-state-stadium", home: "GER", away: "ENG", score: { home: 4, away: 1 } },
  { no: 52, stage: "r16", date: "2010-06-27", venueId: "soccer-city", home: "ARG", away: "MEX", score: { home: 3, away: 1 } },
  { no: 53, stage: "r16", date: "2010-06-28", venueId: "moses-mabhida-stadium", home: "NED", away: "SVK", score: { home: 2, away: 1 } },
  { no: 54, stage: "r16", date: "2010-06-28", venueId: "ellis-park-stadium", home: "BRA", away: "CHI", score: { home: 3, away: 0 } },
  { no: 55, stage: "r16", date: "2010-06-29", venueId: "loftus-versfeld-stadium", home: "PAR", away: "JPN", score: { home: 0, away: 0 }, shootout: { home: 5, away: 3 }, durationMinutes: 120, note: "Paraguay won 5-3 on penalties" },
  { no: 56, stage: "r16", date: "2010-06-29", venueId: "cape-town-stadium", home: "ESP", away: "POR", score: { home: 1, away: 0 } },
  { no: 57, stage: "qf", date: "2010-07-02", venueId: "nelson-mandela-bay-stadium", home: "NED", away: "BRA", score: { home: 2, away: 1 } },
  { no: 58, stage: "qf", date: "2010-07-02", venueId: "soccer-city", home: "URU", away: "GHA", score: { home: 1, away: 1 }, shootout: { home: 4, away: 2 }, durationMinutes: 120, note: "Uruguay won 4-2 on penalties" },
  { no: 59, stage: "qf", date: "2010-07-03", venueId: "cape-town-stadium", home: "ARG", away: "GER", score: { home: 0, away: 4 } },
  { no: 60, stage: "qf", date: "2010-07-03", venueId: "ellis-park-stadium", home: "PAR", away: "ESP", score: { home: 0, away: 1 } },
  { no: 61, stage: "sf", date: "2010-07-06", venueId: "cape-town-stadium", home: "URU", away: "NED", score: { home: 2, away: 3 } },
  { no: 62, stage: "sf", date: "2010-07-07", venueId: "moses-mabhida-stadium", home: "GER", away: "ESP", score: { home: 0, away: 1 } },
  { no: 63, stage: "third", date: "2010-07-10", venueId: "nelson-mandela-bay-stadium", home: "URU", away: "GER", score: { home: 2, away: 3 } },
  { no: 64, stage: "final", date: "2010-07-11", venueId: "soccer-city", home: "NED", away: "ESP", score: { home: 0, away: 1 }, durationMinutes: 120, note: "After extra time" }
];

// Scorers and minute labels follow the Fjelstul World Cup Database and were
// remapped to FIFA's official match numbers above. Added-time goals retain the
// regulation minute so replay ordering remains compatible with earlier cups.
const goalsByFixture: Partial<Record<number, GoalSeed[]>> = {
  1: [[55, "RSA", "Siphiwe Tshabalala"], [79, "MEX", "Rafael Márquez"]],
  3: [[6, "ARG", "Gabriel Heinze"]],
  4: [[7, "KOR", "Lee Jung-soo"], [52, "KOR", "Park Ji-sung"]],
  5: [[4, "ENG", "Steven Gerrard"], [40, "USA", "Clint Dempsey"]],
  6: [[79, "SVN", "Robert Koren"]],
  7: [[8, "GER", "Lukas Podolski"], [26, "GER", "Miroslav Klose"], [68, "GER", "Thomas Müller"], [70, "GER", "Cacau"]],
  8: [[85, "GHA", "Asamoah Gyan", "Asamoah Gyan scores from the penalty spot."]],
  9: [[46, "NED", "Daniel Agger own goal", "Daniel Agger turns the ball into his own net."], [85, "NED", "Dirk Kuyt"]],
  10: [[39, "JPN", "Keisuke Honda"]],
  11: [[39, "PAR", "Antolín Alcaraz"], [63, "ITA", "Daniele De Rossi"]],
  12: [[50, "SVK", "Róbert Vittek"], [90, "NZL", "Winston Reid", "Winston Reid scores in second-half stoppage time."]],
  14: [[55, "BRA", "Maicon"], [72, "BRA", "Elano"], [89, "PRK", "Ji Yun-nam"]],
  15: [[34, "CHI", "Jean Beausejour"]],
  16: [[52, "SUI", "Gélson Fernandes"]],
  17: [[24, "URU", "Diego Forlán"], [80, "URU", "Diego Forlán", "Diego Forlán scores from the penalty spot."], [90, "URU", "Álvaro Pereira", "Álvaro Pereira scores in second-half stoppage time."]],
  18: [[64, "MEX", "Javier Hernández"], [79, "MEX", "Cuauhtémoc Blanco", "Cuauhtémoc Blanco scores from the penalty spot."]],
  19: [[16, "NGA", "Kalu Uche"], [44, "GRE", "Dimitris Salpingidis"], [71, "GRE", "Vasilis Torosidis"]],
  20: [[17, "ARG", "Park Chu-young own goal", "Park Chu-young turns the ball into his own net."], [33, "ARG", "Gonzalo Higuaín"], [45, "KOR", "Lee Chung-yong", "Lee Chung-yong scores in first-half stoppage time."], [76, "ARG", "Gonzalo Higuaín"], [80, "ARG", "Gonzalo Higuaín"]],
  21: [[38, "SRB", "Milan Jovanović"]],
  22: [[13, "SVN", "Valter Birsa"], [42, "SVN", "Zlatan Ljubijankić"], [48, "USA", "Landon Donovan"], [82, "USA", "Michael Bradley"]],
  24: [[11, "AUS", "Brett Holman"], [25, "GHA", "Asamoah Gyan", "Asamoah Gyan scores from the penalty spot."]],
  25: [[53, "NED", "Wesley Sneijder"]],
  26: [[10, "CMR", "Samuel Eto'o"], [33, "DEN", "Nicklas Bendtner"], [61, "DEN", "Dennis Rommedahl"]],
  27: [[27, "PAR", "Enrique Vera"], [86, "PAR", "Cristian Riveros"]],
  28: [[7, "NZL", "Shane Smeltz"], [29, "ITA", "Vincenzo Iaquinta", "Vincenzo Iaquinta scores from the penalty spot."]],
  29: [[25, "BRA", "Luís Fabiano"], [50, "BRA", "Luís Fabiano"], [62, "BRA", "Elano"], [79, "CIV", "Didier Drogba"]],
  30: [[29, "POR", "Raul Meireles"], [53, "POR", "Simão"], [56, "POR", "Hugo Almeida"], [60, "POR", "Tiago"], [81, "POR", "Liédson"], [87, "POR", "Cristiano Ronaldo"], [89, "POR", "Tiago"]],
  31: [[75, "CHI", "Mark González"]],
  32: [[17, "ESP", "David Villa"], [51, "ESP", "David Villa"]],
  33: [[43, "URU", "Luis Suárez"]],
  34: [[20, "RSA", "Bongani Khumalo"], [37, "RSA", "Katlego Mphela"], [70, "FRA", "Florent Malouda"]],
  35: [[12, "NGA", "Kalu Uche"], [38, "KOR", "Lee Jung-soo"], [49, "KOR", "Park Chu-young"], [69, "NGA", "Yakubu", "Yakubu scores from the penalty spot."]],
  36: [[77, "ARG", "Martín Demichelis"], [89, "ARG", "Martín Palermo"]],
  37: [[23, "ENG", "Jermain Defoe"]],
  38: [[90, "USA", "Landon Donovan", "Landon Donovan scores in second-half stoppage time."]],
  39: [[60, "GER", "Mesut Özil"]],
  40: [[69, "AUS", "Tim Cahill"], [73, "AUS", "Brett Holman"], [84, "SRB", "Marko Pantelić"]],
  41: [[25, "SVK", "Róbert Vittek"], [73, "SVK", "Róbert Vittek"], [81, "ITA", "Antonio Di Natale"], [89, "SVK", "Kamil Kopúnek"], [90, "ITA", "Fabio Quagliarella", "Fabio Quagliarella scores in second-half stoppage time."]],
  43: [[17, "JPN", "Keisuke Honda"], [30, "JPN", "Yasuhito Endō"], [81, "DEN", "Jon Dahl Tomasson"], [87, "JPN", "Shinji Okazaki"]],
  44: [[36, "NED", "Robin van Persie"], [65, "CMR", "Samuel Eto'o", "Samuel Eto'o scores from the penalty spot."], [83, "NED", "Klaas-Jan Huntelaar"]],
  46: [[14, "CIV", "Yaya Touré"], [20, "CIV", "Romaric"], [82, "CIV", "Salomon Kalou"]],
  47: [[24, "ESP", "David Villa"], [37, "ESP", "Andrés Iniesta"], [47, "CHI", "Rodrigo Millar"]],
  49: [[8, "URU", "Luis Suárez"], [68, "KOR", "Lee Chung-yong"], [80, "URU", "Luis Suárez"]],
  50: [[5, "GHA", "Kevin-Prince Boateng"], [62, "USA", "Landon Donovan", "Landon Donovan scores from the penalty spot."], [93, "GHA", "Asamoah Gyan"]],
  51: [[20, "GER", "Miroslav Klose"], [32, "GER", "Lukas Podolski"], [37, "ENG", "Matthew Upson"], [67, "GER", "Thomas Müller"], [70, "GER", "Thomas Müller"]],
  52: [[26, "ARG", "Carlos Tevez"], [33, "ARG", "Gonzalo Higuaín"], [52, "ARG", "Carlos Tevez"], [71, "MEX", "Javier Hernández"]],
  53: [[18, "NED", "Arjen Robben"], [84, "NED", "Wesley Sneijder"], [90, "SVK", "Róbert Vittek", "Róbert Vittek scores from the penalty spot in second-half stoppage time."]],
  54: [[35, "BRA", "Juan"], [38, "BRA", "Luís Fabiano"], [59, "BRA", "Robinho"]],
  56: [[63, "ESP", "David Villa"]],
  57: [[10, "BRA", "Robinho"], [53, "NED", "Wesley Sneijder"], [68, "NED", "Wesley Sneijder"]],
  58: [[45, "GHA", "Sulley Muntari", "Sulley Muntari scores in first-half stoppage time."], [55, "URU", "Diego Forlán"]],
  59: [[3, "GER", "Thomas Müller"], [68, "GER", "Miroslav Klose"], [74, "GER", "Arne Friedrich"], [89, "GER", "Miroslav Klose"]],
  60: [[83, "ESP", "David Villa"]],
  61: [[18, "NED", "Giovanni van Bronckhorst"], [41, "URU", "Diego Forlán"], [70, "NED", "Wesley Sneijder"], [73, "NED", "Arjen Robben"], [90, "URU", "Maxi Pereira", "Maxi Pereira scores in second-half stoppage time."]],
  62: [[73, "ESP", "Carles Puyol"]],
  63: [[19, "GER", "Thomas Müller"], [28, "URU", "Edinson Cavani"], [51, "URU", "Diego Forlán"], [56, "GER", "Marcell Jansen"], [82, "GER", "Sami Khedira"]],
  64: [[116, "ESP", "Andrés Iniesta"]]
};

type YouTubeHighlightSeed = {
  videoId: string;
  sourceName: string;
};

// Fixture keys follow FIFA's official match numbers, which differ from pure
// kickoff chronology for several group-stage pairs. Each final selection was
// checked against the teams and score and passed YouTube's real embed-player
// response with status OK and playableInEmbed=true.
const youtubeHighlightsByFixture: Record<number, YouTubeHighlightSeed> = {
  1: { videoId: "2TIY_KqifRw", sourceName: "lapse football highlights" },
  2: { videoId: "Y3kfLTDuscY", sourceName: "lapse football highlights" },
  3: { videoId: "Mzn0Wzo3tL0", sourceName: "lapse football highlights" },
  4: { videoId: "AWAqUXVJSJ0", sourceName: "lapse football highlights" },
  5: { videoId: "HX2D7L-v8uI", sourceName: "lapse football highlights" },
  6: { videoId: "eslQ3LpQ3Lc", sourceName: "lapse football highlights" },
  7: { videoId: "ffJh68MIjWI", sourceName: "Lapse 2 Football highlights" },
  8: { videoId: "RIyFjE9Lw2k", sourceName: "lapse football highlights" },
  9: { videoId: "jz4gxdYkwv0", sourceName: "lapse football highlights" },
  10: { videoId: "6mh44qgfxsI", sourceName: "lapse football highlights" },
  11: { videoId: "1vHKskcMWyE", sourceName: "lapse football highlights" },
  12: { videoId: "METHNVhNcxg", sourceName: "lapse football highlights" },
  13: { videoId: "MR4v1gVxqR8", sourceName: "lapse football highlights" },
  14: { videoId: "WBmNDYHrxyk", sourceName: "lapse football highlights" },
  15: { videoId: "soIu-BuK23s", sourceName: "lapse football highlights" },
  16: { videoId: "NLbgH5cc6iY", sourceName: "lapse football highlights" },
  17: { videoId: "U3yLhn_zDHk", sourceName: "lapse football highlights" },
  18: { videoId: "JUrhwjmKjcc", sourceName: "lapse football highlights" },
  19: { videoId: "8Zpsma82Ksk", sourceName: "The two G's highlights" },
  20: { videoId: "7jwSD2BuQJI", sourceName: "SOCCER HOUSE highlights" },
  21: { videoId: "A9w0Bqd5Anw", sourceName: "lapse football highlights" },
  22: { videoId: "FITbzcX-eM8", sourceName: "lapse football highlights" },
  23: { videoId: "3aDeRQgeYow", sourceName: "lapse football highlights" },
  24: { videoId: "2LsKgvlYz10", sourceName: "lapse football highlights" },
  25: { videoId: "_qiBmfPF2nQ", sourceName: "lapse football highlights" },
  26: { videoId: "s1ILowPs6eo", sourceName: "SOCCER HOUSE highlights" },
  27: { videoId: "Y5brOOPEgQ0", sourceName: "lapse football highlights" },
  28: { videoId: "dNpK1us58gE", sourceName: "lapse football highlights" },
  29: { videoId: "vtq0dTVV4ZA", sourceName: "lapse football highlights" },
  30: { videoId: "0cjKE2zaDig", sourceName: "lapse football highlights" },
  31: { videoId: "ep7guYI-MqA", sourceName: "lapse football highlights" },
  32: { videoId: "vAmphvS0eDQ", sourceName: "lapse football highlights" },
  33: { videoId: "FMjpJyBI-kw", sourceName: "lapse football highlights" },
  34: { videoId: "VPixVLfUc9Y", sourceName: "lapse football highlights" },
  35: { videoId: "eQsHBieFc_g", sourceName: "footballJesper2306 highlights" },
  36: { videoId: "FU_lu2ZR7vg", sourceName: "lapse football highlights" },
  37: { videoId: "2qGmoaJsDhU", sourceName: "lapse football highlights" },
  38: { videoId: "JXHs0Nt-cbI", sourceName: "lapse football highlights" },
  39: { videoId: "v2WCEf5wKXk", sourceName: "lapse football highlights" },
  40: { videoId: "TpivQyQeBOM", sourceName: "lapse football highlights" },
  41: { videoId: "vgvZc_LVk9M", sourceName: "lapse football highlights" },
  42: { videoId: "REyKpA7Cn9I", sourceName: "lapse football highlights" },
  43: { videoId: "v33I9ewHBvQ", sourceName: "lapse football highlights" },
  44: { videoId: "NQ7eBVQsG1U", sourceName: "lapse football highlights" },
  45: { videoId: "TX_L6sZIRBI", sourceName: "Portugal F.C. highlights" },
  46: { videoId: "XuTsbDA-qGQ", sourceName: "lapse football highlights" },
  47: { videoId: "9lWWwOBO_vI", sourceName: "TYFC HD highlights" },
  48: { videoId: "Zp9hDYM7XU4", sourceName: "lapse football highlights" },
  49: { videoId: "Q_GvLkby0ZE", sourceName: "lapse football highlights" },
  50: { videoId: "lU1fQo9-f3I", sourceName: "lapse football highlights" },
  51: { videoId: "feHjbM5DRzY", sourceName: "lapse football highlights" },
  52: { videoId: "rBAQ__2JK5c", sourceName: "lapse football highlights" },
  53: { videoId: "PZ9zJM-4B4k", sourceName: "lapse football highlights" },
  54: { videoId: "Qns8LJ2rJRU", sourceName: "Football107 highlights" },
  55: { videoId: "GfxVY8MyINA", sourceName: "wherethereyou highlights" },
  56: { videoId: "SdrbsnTsATM", sourceName: "TYFC HD highlights" },
  57: { videoId: "BXBZg7iFCBw", sourceName: "lapse football highlights" },
  58: { videoId: "SWuGvIDX4JY", sourceName: "3F highlights" },
  59: { videoId: "Lgmi5Uv4BPI", sourceName: "Football107 highlights" },
  60: { videoId: "OtNo8Ip0I_Y", sourceName: "TYFC HD highlights" },
  61: { videoId: "sarh3eqj88g", sourceName: "lapse football highlights" },
  62: { videoId: "q3d1-zTDBmE", sourceName: "TYFC HD highlights" },
  63: { videoId: "KgJBoiS2S6k", sourceName: "lapse football highlights" },
  64: { videoId: "XJnIokctt7s", sourceName: "TYFC HD highlights" }
};

// FIFA's archive uses its internal match-centre IDs rather than the public
// schedule number. These IDs resolve to the individual official reports.
const fifaMatchIdsByFixture: Record<number, string> = {
  1: "300061454", 2: "300061453", 3: "300061460", 4: "300061459",
  5: "300061466", 6: "300061465", 7: "300111116", 8: "300061471",
  9: "300061478", 10: "300061477", 11: "300061484", 12: "300061483",
  13: "300061490", 14: "300061489", 15: "300061495", 16: "300111112",
  17: "300061452", 18: "300061451", 19: "300061457", 20: "300061458",
  21: "300061470", 22: "300061463", 23: "300061464", 24: "300061469",
  25: "300111117", 26: "300061475", 27: "300061481", 28: "300061482",
  29: "300061488", 30: "300061487", 31: "300061493", 32: "300061494",
  33: "300061450", 34: "300061449", 35: "300111115", 36: "300061455",
  37: "300061462", 38: "300061461", 39: "300061468", 40: "300061467",
  41: "300061480", 42: "300061479", 43: "300061474", 44: "300061473",
  45: "300111111", 46: "300061486", 47: "300061491", 48: "300061492",
  49: "300061504", 50: "300061503", 51: "300061501", 52: "300061502",
  53: "300111113", 54: "300061500", 55: "300061497", 56: "300061498",
  57: "300061507", 58: "300061508", 59: "300061505", 60: "300061506",
  61: "300061512", 62: "300111114", 63: "300061510", 64: "300061509"
};

function getFifaRoundId(no: number) {
  if (no <= 48) return "249722";
  if (no <= 56) return "249717";
  if (no <= 60) return "249718";
  if (no <= 62) return "249719";
  if (no === 63) return "249720";
  return "249721";
}

function getFifaMatchUrl(fixture: FixtureSeed) {
  const roundId = getFifaRoundId(fixture.no);
  const matchId = fifaMatchIdsByFixture[fixture.no];
  return `https://www.fifa.com/en/match-centre/match/17/249715/${roundId}/${matchId}?date=${fixture.date}`;
}

function getHighlights(fixture: FixtureSeed): MatchHighlights {
  const officialUrl = getFifaMatchUrl(fixture);
  const highlight = youtubeHighlightsByFixture[fixture.no];

  return highlight
    ? createYoutubeHighlight(highlight.videoId, officialUrl, highlight.sourceName)
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
      id: `wc-2010-${String(fixture.no).padStart(2, "0")}-${fixture.home.toLowerCase()}-${fixture.away.toLowerCase()}`,
      tournamentId: "wc-2010",
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

export const worldCup2010: Tournament = {
  id: "wc-2010",
  competition: "WORLD_CUP",
  name: "South Africa 2010",
  year: 2010,
  hosts: ["RSA"],
  teams: worldCup2010Groups.flatMap((group) => group.teams),
  groups: worldCup2010Groups,
  teamCoordinates: worldCup2010TeamCoordinates,
  format: worldCup2010Format,
  stages: ["group", "r16", "qf", "sf", "third", "final"],
  status: "complete",
  mapView: {
    center: [24.3, -29.0],
    zoom: 4.35,
    bearing: -10,
    pitch: 42
  },
  venues,
  featuredRoute: venues.map((venue) => venue.id),
  matches
};
