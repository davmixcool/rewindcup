import { teamNames } from "@/data/teamMetadata";
import {
  worldCup2006Format,
  worldCup2006Groups,
  worldCup2006TeamCoordinates
} from "@/data/worldCup2006Experience";
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
  { id: "berlin-olympiastadion", name: "Olympiastadion Berlin", city: "Berlin", country: "GER", coordinates: [13.23944, 52.51472], bearing: -20 },
  { id: "cologne-world-cup-stadium", name: "FIFA World Cup Stadium Cologne", city: "Cologne", country: "GER", coordinates: [6.875, 50.9335], bearing: 12 },
  { id: "dortmund-world-cup-stadium", name: "FIFA World Cup Stadium Dortmund", city: "Dortmund", country: "GER", coordinates: [7.45184, 51.49257], bearing: -18 },
  { id: "frankfurt-world-cup-stadium", name: "FIFA World Cup Stadium Frankfurt", city: "Frankfurt/Main", country: "GER", coordinates: [8.64546, 50.06857], bearing: -28 },
  { id: "gelsenkirchen-world-cup-stadium", name: "FIFA World Cup Stadium Gelsenkirchen", city: "Gelsenkirchen", country: "GER", coordinates: [7.06759, 51.5545], bearing: 18 },
  { id: "hamburg-world-cup-stadium", name: "FIFA World Cup Stadium Hamburg", city: "Hamburg", country: "GER", coordinates: [9.89862, 53.58716], bearing: -14 },
  { id: "hanover-world-cup-stadium", name: "FIFA World Cup Stadium Hanover", city: "Hanover", country: "GER", coordinates: [9.7312, 52.36007], bearing: 8 },
  { id: "fritz-walter-stadion", name: "Fritz-Walter-Stadion", city: "Kaiserslautern", country: "GER", coordinates: [7.77646, 49.43471], bearing: -22 },
  { id: "leipzig-zentralstadion", name: "Zentralstadion", city: "Leipzig", country: "GER", coordinates: [12.34822, 51.34579], bearing: 16 },
  { id: "munich-world-cup-stadium", name: "FIFA World Cup Stadium Munich", city: "Munich", country: "GER", coordinates: [11.62475, 48.21878], bearing: -12 },
  { id: "nuremberg-franken-stadion", name: "Franken-Stadion", city: "Nuremberg", country: "GER", coordinates: [11.12583, 49.42611], bearing: 20 },
  { id: "stuttgart-gottlieb-daimler-stadion", name: "Gottlieb-Daimler-Stadion", city: "Stuttgart", country: "GER", coordinates: [9.23203, 48.79227], bearing: -26 }
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

// Match numbering, teams, dates, venues, scores, and decisions follow FIFA's
// official 2006 Report and Statistics. FIFA's numbering is intentionally not
// chronological in a few group-stage rounds.
const fixtureSeeds: FixtureSeed[] = [
  { no: 1, stage: "group", date: "2006-06-09", venueId: "munich-world-cup-stadium", home: "GER", away: "CRC", score: { home: 4, away: 2 } },
  { no: 2, stage: "group", date: "2006-06-09", venueId: "gelsenkirchen-world-cup-stadium", home: "POL", away: "ECU", score: { home: 0, away: 2 } },
  { no: 3, stage: "group", date: "2006-06-10", venueId: "frankfurt-world-cup-stadium", home: "ENG", away: "PAR", score: { home: 1, away: 0 } },
  { no: 4, stage: "group", date: "2006-06-10", venueId: "dortmund-world-cup-stadium", home: "TRI", away: "SWE", score: { home: 0, away: 0 } },
  { no: 5, stage: "group", date: "2006-06-10", venueId: "hamburg-world-cup-stadium", home: "ARG", away: "CIV", score: { home: 2, away: 1 } },
  { no: 6, stage: "group", date: "2006-06-11", venueId: "leipzig-zentralstadion", home: "SCG", away: "NED", score: { home: 0, away: 1 } },
  { no: 7, stage: "group", date: "2006-06-11", venueId: "nuremberg-franken-stadion", home: "MEX", away: "IRN", score: { home: 3, away: 1 } },
  { no: 8, stage: "group", date: "2006-06-11", venueId: "cologne-world-cup-stadium", home: "ANG", away: "POR", score: { home: 0, away: 1 } },
  { no: 9, stage: "group", date: "2006-06-12", venueId: "hanover-world-cup-stadium", home: "ITA", away: "GHA", score: { home: 2, away: 0 } },
  { no: 10, stage: "group", date: "2006-06-12", venueId: "gelsenkirchen-world-cup-stadium", home: "USA", away: "CZE", score: { home: 0, away: 3 } },
  { no: 11, stage: "group", date: "2006-06-13", venueId: "berlin-olympiastadion", home: "BRA", away: "CRO", score: { home: 1, away: 0 } },
  { no: 12, stage: "group", date: "2006-06-12", venueId: "fritz-walter-stadion", home: "AUS", away: "JPN", score: { home: 3, away: 1 } },
  { no: 13, stage: "group", date: "2006-06-13", venueId: "stuttgart-gottlieb-daimler-stadion", home: "FRA", away: "SUI", score: { home: 0, away: 0 } },
  { no: 14, stage: "group", date: "2006-06-13", venueId: "frankfurt-world-cup-stadium", home: "KOR", away: "TOG", score: { home: 2, away: 1 } },
  { no: 15, stage: "group", date: "2006-06-14", venueId: "leipzig-zentralstadion", home: "ESP", away: "UKR", score: { home: 4, away: 0 } },
  { no: 16, stage: "group", date: "2006-06-14", venueId: "munich-world-cup-stadium", home: "TUN", away: "KSA", score: { home: 2, away: 2 } },
  { no: 17, stage: "group", date: "2006-06-14", venueId: "dortmund-world-cup-stadium", home: "GER", away: "POL", score: { home: 1, away: 0 } },
  { no: 18, stage: "group", date: "2006-06-15", venueId: "hamburg-world-cup-stadium", home: "ECU", away: "CRC", score: { home: 3, away: 0 } },
  { no: 19, stage: "group", date: "2006-06-15", venueId: "nuremberg-franken-stadion", home: "ENG", away: "TRI", score: { home: 2, away: 0 } },
  { no: 20, stage: "group", date: "2006-06-15", venueId: "berlin-olympiastadion", home: "SWE", away: "PAR", score: { home: 1, away: 0 } },
  { no: 21, stage: "group", date: "2006-06-16", venueId: "gelsenkirchen-world-cup-stadium", home: "ARG", away: "SCG", score: { home: 6, away: 0 } },
  { no: 22, stage: "group", date: "2006-06-16", venueId: "stuttgart-gottlieb-daimler-stadion", home: "NED", away: "CIV", score: { home: 2, away: 1 } },
  { no: 23, stage: "group", date: "2006-06-16", venueId: "hanover-world-cup-stadium", home: "MEX", away: "ANG", score: { home: 0, away: 0 } },
  { no: 24, stage: "group", date: "2006-06-17", venueId: "frankfurt-world-cup-stadium", home: "POR", away: "IRN", score: { home: 2, away: 0 } },
  { no: 25, stage: "group", date: "2006-06-17", venueId: "fritz-walter-stadion", home: "ITA", away: "USA", score: { home: 1, away: 1 } },
  { no: 26, stage: "group", date: "2006-06-17", venueId: "cologne-world-cup-stadium", home: "CZE", away: "GHA", score: { home: 0, away: 2 } },
  { no: 27, stage: "group", date: "2006-06-18", venueId: "munich-world-cup-stadium", home: "BRA", away: "AUS", score: { home: 2, away: 0 } },
  { no: 28, stage: "group", date: "2006-06-18", venueId: "nuremberg-franken-stadion", home: "JPN", away: "CRO", score: { home: 0, away: 0 } },
  { no: 29, stage: "group", date: "2006-06-18", venueId: "leipzig-zentralstadion", home: "FRA", away: "KOR", score: { home: 1, away: 1 } },
  { no: 30, stage: "group", date: "2006-06-19", venueId: "dortmund-world-cup-stadium", home: "TOG", away: "SUI", score: { home: 0, away: 2 } },
  { no: 31, stage: "group", date: "2006-06-19", venueId: "stuttgart-gottlieb-daimler-stadion", home: "ESP", away: "TUN", score: { home: 3, away: 1 } },
  { no: 32, stage: "group", date: "2006-06-19", venueId: "hamburg-world-cup-stadium", home: "KSA", away: "UKR", score: { home: 0, away: 4 } },
  { no: 33, stage: "group", date: "2006-06-20", venueId: "berlin-olympiastadion", home: "ECU", away: "GER", score: { home: 0, away: 3 } },
  { no: 34, stage: "group", date: "2006-06-20", venueId: "hanover-world-cup-stadium", home: "CRC", away: "POL", score: { home: 1, away: 2 } },
  { no: 35, stage: "group", date: "2006-06-20", venueId: "cologne-world-cup-stadium", home: "SWE", away: "ENG", score: { home: 2, away: 2 } },
  { no: 36, stage: "group", date: "2006-06-20", venueId: "fritz-walter-stadion", home: "PAR", away: "TRI", score: { home: 2, away: 0 } },
  { no: 37, stage: "group", date: "2006-06-21", venueId: "frankfurt-world-cup-stadium", home: "NED", away: "ARG", score: { home: 0, away: 0 } },
  { no: 38, stage: "group", date: "2006-06-21", venueId: "munich-world-cup-stadium", home: "CIV", away: "SCG", score: { home: 3, away: 2 } },
  { no: 39, stage: "group", date: "2006-06-21", venueId: "gelsenkirchen-world-cup-stadium", home: "POR", away: "MEX", score: { home: 2, away: 1 } },
  { no: 40, stage: "group", date: "2006-06-21", venueId: "leipzig-zentralstadion", home: "IRN", away: "ANG", score: { home: 1, away: 1 } },
  { no: 41, stage: "group", date: "2006-06-22", venueId: "hamburg-world-cup-stadium", home: "CZE", away: "ITA", score: { home: 0, away: 2 } },
  { no: 42, stage: "group", date: "2006-06-22", venueId: "nuremberg-franken-stadion", home: "GHA", away: "USA", score: { home: 2, away: 1 } },
  { no: 43, stage: "group", date: "2006-06-22", venueId: "dortmund-world-cup-stadium", home: "JPN", away: "BRA", score: { home: 1, away: 4 } },
  { no: 44, stage: "group", date: "2006-06-22", venueId: "stuttgart-gottlieb-daimler-stadion", home: "CRO", away: "AUS", score: { home: 2, away: 2 } },
  { no: 45, stage: "group", date: "2006-06-23", venueId: "cologne-world-cup-stadium", home: "TOG", away: "FRA", score: { home: 0, away: 2 } },
  { no: 46, stage: "group", date: "2006-06-23", venueId: "hanover-world-cup-stadium", home: "SUI", away: "KOR", score: { home: 2, away: 0 } },
  { no: 47, stage: "group", date: "2006-06-23", venueId: "fritz-walter-stadion", home: "KSA", away: "ESP", score: { home: 0, away: 1 } },
  { no: 48, stage: "group", date: "2006-06-23", venueId: "berlin-olympiastadion", home: "UKR", away: "TUN", score: { home: 1, away: 0 } },
  { no: 49, stage: "r16", date: "2006-06-24", venueId: "munich-world-cup-stadium", home: "GER", away: "SWE", score: { home: 2, away: 0 } },
  { no: 50, stage: "r16", date: "2006-06-24", venueId: "leipzig-zentralstadion", home: "ARG", away: "MEX", score: { home: 2, away: 1 }, durationMinutes: 120, note: "After extra time" },
  { no: 51, stage: "r16", date: "2006-06-25", venueId: "stuttgart-gottlieb-daimler-stadion", home: "ENG", away: "ECU", score: { home: 1, away: 0 } },
  { no: 52, stage: "r16", date: "2006-06-25", venueId: "nuremberg-franken-stadion", home: "POR", away: "NED", score: { home: 1, away: 0 } },
  { no: 53, stage: "r16", date: "2006-06-26", venueId: "fritz-walter-stadion", home: "ITA", away: "AUS", score: { home: 1, away: 0 } },
  { no: 54, stage: "r16", date: "2006-06-26", venueId: "cologne-world-cup-stadium", home: "SUI", away: "UKR", score: { home: 0, away: 0 }, shootout: { home: 0, away: 3 }, durationMinutes: 120, note: "Ukraine won 3-0 on penalties" },
  { no: 55, stage: "r16", date: "2006-06-27", venueId: "dortmund-world-cup-stadium", home: "BRA", away: "GHA", score: { home: 3, away: 0 } },
  { no: 56, stage: "r16", date: "2006-06-27", venueId: "hanover-world-cup-stadium", home: "ESP", away: "FRA", score: { home: 1, away: 3 } },
  { no: 57, stage: "qf", date: "2006-06-30", venueId: "berlin-olympiastadion", home: "GER", away: "ARG", score: { home: 1, away: 1 }, shootout: { home: 4, away: 2 }, durationMinutes: 120, note: "Germany won 4-2 on penalties" },
  { no: 58, stage: "qf", date: "2006-06-30", venueId: "hamburg-world-cup-stadium", home: "ITA", away: "UKR", score: { home: 3, away: 0 } },
  { no: 59, stage: "qf", date: "2006-07-01", venueId: "gelsenkirchen-world-cup-stadium", home: "ENG", away: "POR", score: { home: 0, away: 0 }, shootout: { home: 1, away: 3 }, durationMinutes: 120, note: "Portugal won 3-1 on penalties" },
  { no: 60, stage: "qf", date: "2006-07-01", venueId: "frankfurt-world-cup-stadium", home: "BRA", away: "FRA", score: { home: 0, away: 1 } },
  { no: 61, stage: "sf", date: "2006-07-04", venueId: "dortmund-world-cup-stadium", home: "GER", away: "ITA", score: { home: 0, away: 2 }, durationMinutes: 120, note: "After extra time" },
  { no: 62, stage: "sf", date: "2006-07-05", venueId: "munich-world-cup-stadium", home: "POR", away: "FRA", score: { home: 0, away: 1 } },
  { no: 63, stage: "third", date: "2006-07-08", venueId: "stuttgart-gottlieb-daimler-stadion", home: "GER", away: "POR", score: { home: 3, away: 1 } },
  { no: 64, stage: "final", date: "2006-07-09", venueId: "berlin-olympiastadion", home: "ITA", away: "FRA", score: { home: 1, away: 1 }, shootout: { home: 5, away: 3 }, durationMinutes: 120, note: "Italy won 5-3 on penalties" }
];

// Goal scorers and regulation-minute labels were cross-checked against the
// Fjelstul World Cup Database and FIFA's match telegrams. Added-time goals use
// the regulation minute so the replay model keeps half-time/full-time ordering.
const goalsByFixture: Partial<Record<number, GoalSeed[]>> = {
  1: [[6, "GER", "Philipp Lahm"], [12, "CRC", "Paulo Wanchope"], [17, "GER", "Miroslav Klose"], [61, "GER", "Miroslav Klose"], [73, "CRC", "Paulo Wanchope"], [87, "GER", "Torsten Frings"]],
  2: [[24, "ECU", "Carlos Tenorio"], [80, "ECU", "Agustín Delgado"]],
  3: [[3, "ENG", "Carlos Gamarra own goal", "Carlos Gamarra turns the ball into his own net."]],
  5: [[24, "ARG", "Hernán Crespo"], [38, "ARG", "Javier Saviola"], [82, "CIV", "Didier Drogba"]],
  6: [[18, "NED", "Arjen Robben"]],
  7: [[28, "MEX", "Omar Bravo"], [36, "IRN", "Yahya Golmohammadi"], [76, "MEX", "Omar Bravo"], [79, "MEX", "Sinha"]],
  8: [[4, "POR", "Pauleta"]],
  9: [[40, "ITA", "Andrea Pirlo"], [83, "ITA", "Vincenzo Iaquinta"]],
  10: [[5, "CZE", "Jan Koller"], [36, "CZE", "Tomáš Rosický"], [76, "CZE", "Tomáš Rosický"]],
  11: [[44, "BRA", "Kaká"]],
  12: [[26, "JPN", "Shunsuke Nakamura"], [84, "AUS", "Tim Cahill"], [89, "AUS", "Tim Cahill"], [90, "AUS", "John Aloisi", "John Aloisi scores in second-half stoppage time."]],
  14: [[31, "TOG", "Mohamed Kader"], [54, "KOR", "Lee Chun-soo"], [72, "KOR", "Ahn Jung-hwan"]],
  15: [[13, "ESP", "Xabi Alonso"], [17, "ESP", "David Villa"], [48, "ESP", "David Villa", "David Villa scores from the penalty spot."], [81, "ESP", "Fernando Torres"]],
  16: [[23, "TUN", "Ziad Jaziri"], [57, "KSA", "Yasser Al-Qahtani"], [84, "KSA", "Sami Al-Jaber"], [90, "TUN", "Radhi Jaïdi", "Radhi Jaïdi equalises in second-half stoppage time."]],
  17: [[90, "GER", "Oliver Neuville", "Oliver Neuville scores in second-half stoppage time."]],
  18: [[8, "ECU", "Carlos Tenorio"], [54, "ECU", "Agustín Delgado"], [90, "ECU", "Iván Kaviedes", "Iván Kaviedes scores in second-half stoppage time."]],
  19: [[83, "ENG", "Peter Crouch"], [90, "ENG", "Steven Gerrard", "Steven Gerrard scores in second-half stoppage time."]],
  20: [[89, "SWE", "Freddie Ljungberg"]],
  21: [[6, "ARG", "Maxi Rodríguez"], [31, "ARG", "Esteban Cambiasso"], [41, "ARG", "Maxi Rodríguez"], [78, "ARG", "Hernán Crespo"], [84, "ARG", "Carlos Tevez"], [88, "ARG", "Lionel Messi"]],
  22: [[23, "NED", "Robin van Persie"], [27, "NED", "Ruud van Nistelrooy"], [38, "CIV", "Bakari Koné"]],
  24: [[63, "POR", "Deco"], [80, "POR", "Cristiano Ronaldo", "Cristiano Ronaldo scores from the penalty spot."]],
  25: [[22, "ITA", "Alberto Gilardino"], [27, "USA", "Cristian Zaccardo own goal", "Cristian Zaccardo turns the ball into his own net."]],
  26: [[2, "GHA", "Asamoah Gyan"], [82, "GHA", "Sulley Muntari"]],
  27: [[49, "BRA", "Adriano"], [90, "BRA", "Fred"]],
  29: [[9, "FRA", "Thierry Henry"], [81, "KOR", "Park Ji-sung"]],
  30: [[16, "SUI", "Alexander Frei"], [88, "SUI", "Tranquillo Barnetta"]],
  31: [[8, "TUN", "Jawhar Mnari"], [71, "ESP", "Raúl"], [76, "ESP", "Fernando Torres"], [90, "ESP", "Fernando Torres", "Fernando Torres scores a penalty in second-half stoppage time."]],
  32: [[4, "UKR", "Andriy Rusol"], [36, "UKR", "Serhii Rebrov"], [46, "UKR", "Andriy Shevchenko"], [84, "UKR", "Maksym Kalynychenko"]],
  33: [[4, "GER", "Miroslav Klose"], [44, "GER", "Miroslav Klose"], [57, "GER", "Lukas Podolski"]],
  34: [[25, "CRC", "Rónald Gómez"], [33, "POL", "Bartosz Bosacki"], [65, "POL", "Bartosz Bosacki"]],
  35: [[34, "ENG", "Joe Cole"], [51, "SWE", "Marcus Allbäck"], [85, "ENG", "Steven Gerrard"], [90, "SWE", "Henrik Larsson"]],
  36: [[25, "PAR", "Brent Sancho own goal", "Brent Sancho turns the ball into his own net."], [86, "PAR", "Nelson Cuevas"]],
  38: [[10, "SCG", "Nikola Žigić"], [20, "SCG", "Saša Ilić"], [37, "CIV", "Aruna Dindane", "Aruna Dindane scores from the penalty spot."], [67, "CIV", "Aruna Dindane"], [86, "CIV", "Bonaventure Kalou", "Bonaventure Kalou scores from the penalty spot."]],
  39: [[6, "POR", "Maniche"], [24, "POR", "Simão", "Simão scores from the penalty spot."], [29, "MEX", "Francisco Fonseca"]],
  40: [[60, "ANG", "Flávio"], [75, "IRN", "Sohrab Bakhtiarizadeh"]],
  41: [[26, "ITA", "Marco Materazzi"], [87, "ITA", "Filippo Inzaghi"]],
  42: [[22, "GHA", "Haminu Draman"], [43, "USA", "Clint Dempsey"], [45, "GHA", "Stephen Appiah", "Stephen Appiah scores a penalty in first-half stoppage time."]],
  43: [[34, "JPN", "Keiji Tamada"], [45, "BRA", "Ronaldo", "Ronaldo equalises in first-half stoppage time."], [53, "BRA", "Juninho Pernambucano"], [59, "BRA", "Gilberto"], [81, "BRA", "Ronaldo"]],
  44: [[2, "CRO", "Darijo Srna"], [38, "AUS", "Craig Moore", "Craig Moore scores from the penalty spot."], [56, "CRO", "Niko Kovač"], [79, "AUS", "Harry Kewell"]],
  45: [[55, "FRA", "Patrick Vieira"], [61, "FRA", "Thierry Henry"]],
  46: [[23, "SUI", "Philippe Senderos"], [77, "SUI", "Alexander Frei"]],
  47: [[36, "ESP", "Juanito"]],
  48: [[70, "UKR", "Andriy Shevchenko", "Andriy Shevchenko scores from the penalty spot."]],
  49: [[4, "GER", "Lukas Podolski"], [12, "GER", "Lukas Podolski"]],
  50: [[6, "MEX", "Rafael Márquez"], [10, "ARG", "Hernán Crespo"], [98, "ARG", "Maxi Rodríguez"]],
  51: [[60, "ENG", "David Beckham"]],
  52: [[23, "POR", "Maniche"]],
  53: [[90, "ITA", "Francesco Totti", "Francesco Totti scores a penalty in second-half stoppage time."]],
  55: [[5, "BRA", "Ronaldo"], [45, "BRA", "Adriano", "Adriano scores in first-half stoppage time."], [84, "BRA", "Zé Roberto"]],
  56: [[28, "ESP", "David Villa", "David Villa scores from the penalty spot."], [41, "FRA", "Franck Ribéry"], [83, "FRA", "Patrick Vieira"], [90, "FRA", "Zinedine Zidane", "Zinedine Zidane scores in second-half stoppage time."]],
  57: [[49, "ARG", "Roberto Ayala"], [80, "GER", "Miroslav Klose"]],
  58: [[6, "ITA", "Gianluca Zambrotta"], [59, "ITA", "Luca Toni"], [69, "ITA", "Luca Toni"]],
  60: [[57, "FRA", "Thierry Henry"]],
  61: [[119, "ITA", "Fabio Grosso"], [120, "ITA", "Alessandro Del Piero", "Alessandro Del Piero scores in extra-time stoppage time."]],
  62: [[33, "FRA", "Zinedine Zidane", "Zinedine Zidane scores from the penalty spot."]],
  63: [[56, "GER", "Bastian Schweinsteiger"], [60, "GER", "Petit own goal", "Petit turns the ball into his own net."], [78, "GER", "Bastian Schweinsteiger"], [88, "POR", "Nuno Gomes"]],
  64: [[7, "FRA", "Zinedine Zidane", "Zinedine Zidane scores from the penalty spot."], [19, "ITA", "Marco Materazzi"]]
};

type YouTubeHighlightSeed = {
  videoId: string;
  sourceName: string;
};

// YouTube does not currently offer one complete, live 64-match playlist for
// Germany 2006. Each exact-fixture upload was checked against the teams and
// score, then verified with YouTube's embedded-player playability response.
const youtubeHighlightsByFixture: Record<number, YouTubeHighlightSeed> = {
  1: { videoId: "spaHAdgyOvw", sourceName: "World Cup Goals highlights" },
  2: { videoId: "CV9Huq3cBmA", sourceName: "World Cup Goals highlights" },
  3: { videoId: "awF7Y0wQPe4", sourceName: "World Cup Goals highlights" },
  4: { videoId: "Ef6WI7OhbAY", sourceName: "World Cup Goals highlights" },
  5: { videoId: "K-hiBhM_X38", sourceName: "sp1873 highlights" },
  6: { videoId: "rDr9EmTeVLI", sourceName: "World Cup Goals highlights" },
  7: { videoId: "2Tp2xOZcBCY", sourceName: "World Cup Goals highlights" },
  8: { videoId: "-N-uyJQnDfs", sourceName: "World Cup Goals highlights" },
  9: { videoId: "WGvfXqCoMOQ", sourceName: "World Cup Goals highlights" },
  10: { videoId: "1Py47r9eil8", sourceName: "World Cup Goals highlights" },
  11: { videoId: "F32mE4edypU", sourceName: "World Cup Goals highlights" },
  12: { videoId: "ZZ8t12IfRrw", sourceName: "World Cup Goals highlights" },
  13: { videoId: "k7CYo8lhKqs", sourceName: "World Cup Goals highlights" },
  14: { videoId: "6z3RjMBJbqI", sourceName: "World Cup Goals highlights" },
  15: { videoId: "aBLQnyUeOzs", sourceName: "World Cup Goals highlights" },
  16: { videoId: "85a4WAUuWyw", sourceName: "World Cup Goals highlights" },
  17: { videoId: "0c_bE9r57nI", sourceName: "sp1873 highlights" },
  18: { videoId: "bPhtJBQm1HM", sourceName: "World Cup Goals highlights" },
  19: { videoId: "rY5Xo0FiZi4", sourceName: "sp1873 highlights" },
  20: { videoId: "QdxSvw9KtdU", sourceName: "sp1873 highlights" },
  21: { videoId: "vQSYuCsrKcQ", sourceName: "World Cup Goals highlights" },
  22: { videoId: "n2ovGQ4doEU", sourceName: "World Cup Goals highlights" },
  23: { videoId: "s6PhnsrHlj8", sourceName: "World Cup Goals highlights" },
  24: { videoId: "MaZy7jRcQXE", sourceName: "World Cup Goals highlights" },
  25: { videoId: "tc71kEshrF0", sourceName: "TYFC HD highlights" },
  26: { videoId: "_Fjq2Wrihx0", sourceName: "World Cup Goals highlights" },
  27: { videoId: "Xvfq-XvGUz8", sourceName: "World Cup Goals highlights" },
  28: { videoId: "PgrNbHO7am4", sourceName: "World Cup Goals highlights" },
  29: { videoId: "fn8EG53YJL4", sourceName: "sp1873 highlights" },
  30: { videoId: "Ad69Q1Yi1cA", sourceName: "SOCCER HOUSE highlights" },
  31: { videoId: "-6YfZe31hDE", sourceName: "sp1873 highlights" },
  32: { videoId: "87jagcKys6E", sourceName: "World Cup Goals highlights" },
  33: { videoId: "AvMwp12vnb8", sourceName: "World Cup Goals highlights" },
  34: { videoId: "jnxA_L-yHD8", sourceName: "World Cup Goals highlights" },
  35: { videoId: "yGS1PT2Pu0Q", sourceName: "lapse football highlights" },
  36: { videoId: "GYARsdwt8iQ", sourceName: "World Cup Goals highlights" },
  37: { videoId: "Yp8CJgHekS8", sourceName: "World Cup Goals highlights" },
  38: { videoId: "Q41H-SQJR5k", sourceName: "World Cup Goals highlights" },
  39: { videoId: "nSwf0dc6a5w", sourceName: "camperJOe highlights" },
  40: { videoId: "CWPymhrBZp8", sourceName: "World Cup Goals highlights" },
  41: { videoId: "U92eJUUxDbU", sourceName: "TYFC HD highlights" },
  42: { videoId: "tiPSL0nOYnc", sourceName: "World Cup Goals highlights" },
  43: { videoId: "Kb9oaR-of-w", sourceName: "World Cup Goals highlights" },
  44: { videoId: "NmHQ1msxt9Y", sourceName: "sp1873 highlights" },
  45: { videoId: "tejKm97ygjU", sourceName: "World Cup Goals highlights" },
  46: { videoId: "LUW4C8Jqqbs", sourceName: "camperJOe highlights" },
  47: { videoId: "HYkibJZuVOY", sourceName: "World Cup Goals highlights" },
  48: { videoId: "__qLzIhL48o", sourceName: "World Cup Goals highlights" },
  49: { videoId: "vN18ggf8GAE", sourceName: "SOCCER HOUSE highlights" },
  50: { videoId: "0i0KJZlsoqc", sourceName: "lapse football highlights" },
  51: { videoId: "dlD2TbxmIrg", sourceName: "World Cup Goals highlights" },
  52: { videoId: "r-bRgrkHvR0", sourceName: "WorldCupHighlightsTM highlights" },
  53: { videoId: "c2Gf5VIrAFM", sourceName: "World Cup Goals highlights" },
  54: { videoId: "BBZvVuUxNf4", sourceName: "World Cup Goals highlights" },
  55: { videoId: "n1UWWqDpPYE", sourceName: "WorldCupHighlightsTM highlights" },
  56: { videoId: "9U3W-DbncK0", sourceName: "WorldCupHighlightsTM highlights" },
  57: { videoId: "D36VY6j2H9M", sourceName: "WorldCupHighlightsTM highlights" },
  58: { videoId: "JXhSPtw4n0o", sourceName: "TYFC HD highlights" },
  59: { videoId: "D6EWQ7mie-E", sourceName: "World Cup Goals highlights" },
  60: { videoId: "Xwv02GeDo58", sourceName: "WorldCupHighlightsTM highlights" },
  61: { videoId: "gg08KvMGpT8", sourceName: "World Cup Goals highlights" },
  62: { videoId: "tJUZGCb0khA", sourceName: "sp1873 highlights" },
  63: { videoId: "r7BHFLkYjWc", sourceName: "WorldCupHighlightsTM highlights" },
  64: { videoId: "h1gtCpYCZ-4", sourceName: "World Cup Goals highlights" }
};

function getFifaMatchUrl(no: number) {
  const matchId = `974100${String(no).padStart(2, "0")}`;
  return `https://www.fifa.com/tournaments/mens/worldcup/2006germany/match-center/${matchId}/index.html`;
}

function getHighlights(no: number): MatchHighlights {
  const officialUrl = getFifaMatchUrl(no);
  const highlight = youtubeHighlightsByFixture[no];

  if (highlight) {
    return {
      status: "embeddable-video",
      officialUrl,
      officialSourceName: "FIFA match report",
      directUrl: `https://www.youtube.com/watch?v=${highlight.videoId}`,
      embedUrl: `https://www.youtube.com/embed/${highlight.videoId}`,
      provider: "youtube",
      providerVideoId: highlight.videoId,
      embeddable: true,
      sourceName: highlight.sourceName
    };
  }

  return {
    status: "official-report",
    officialUrl,
    officialSourceName: "FIFA match report",
    embeddable: false,
    sourceName: "FIFA match report"
  };
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
    .sort((a, b) => a[0] - b[0])
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
    const highlights = getHighlights(fixture.no);

    return {
      id: `wc-2006-${String(fixture.no).padStart(2, "0")}-${fixture.home.toLowerCase()}-${fixture.away.toLowerCase()}`,
      tournamentId: "wc-2006",
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

export const worldCup2006: Tournament = {
  id: "wc-2006",
  competition: "WORLD_CUP",
  name: "Germany 2006",
  year: 2006,
  hosts: ["GER"],
  teams: worldCup2006Groups.flatMap((group) => group.teams),
  groups: worldCup2006Groups,
  teamCoordinates: worldCup2006TeamCoordinates,
  format: worldCup2006Format,
  stages: ["group", "r16", "qf", "sf", "third", "final"],
  status: "complete",
  mapView: {
    center: [10.4515, 51.1657],
    zoom: 5.2,
    bearing: -12,
    pitch: 42
  },
  venues,
  featuredRoute: venues.map((venue) => venue.id),
  matches
};
