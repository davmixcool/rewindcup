import { createYoutubeHighlight } from "@/data/highlights";
import { teamNames } from "@/data/teamMetadata";
import {
  worldCup2022Format,
  worldCup2022Groups,
  worldCup2022TeamCoordinates
} from "@/data/worldCup2022Experience";
import type { Match, ReplayEvent, Score, TeamCode, Tournament, Venue } from "@/lib/types";

type VenueSeed = Pick<Venue, "id" | "name" | "city" | "country" | "coordinates"> & { bearing?: number };
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
  { id: "al-bayt-stadium", name: "Al Bayt Stadium", city: "Al Khor", country: "QAT", coordinates: [51.4879, 25.6522], bearing: -18 },
  { id: "khalifa-international-stadium", name: "Khalifa International Stadium", city: "Al Rayyan", country: "QAT", coordinates: [51.448, 25.2637], bearing: 16 },
  { id: "al-thumama-stadium", name: "Al Thumama Stadium", city: "Doha", country: "QAT", coordinates: [51.5324, 25.2354], bearing: -20 },
  { id: "ahmad-bin-ali-stadium", name: "Ahmad Bin Ali Stadium", city: "Al Rayyan", country: "QAT", coordinates: [51.341, 25.3298], bearing: 20 },
  { id: "lusail-stadium", name: "Lusail Stadium", city: "Lusail", country: "QAT", coordinates: [51.4903, 25.4209], bearing: -16 },
  { id: "education-city-stadium", name: "Education City Stadium", city: "Al Rayyan", country: "QAT", coordinates: [51.4243, 25.3107], bearing: 18 },
  { id: "stadium-974", name: "Stadium 974", city: "Doha", country: "QAT", coordinates: [51.566, 25.288], bearing: -14 },
  { id: "al-janoub-stadium", name: "Al Janoub Stadium", city: "Al Wakrah", country: "QAT", coordinates: [51.5744, 25.1595], bearing: 14 }
];

const venues: Venue[] = venueSeeds.map((venue) => ({
  ...venue,
  stadiumView: { center: venue.coordinates, zoom: 16.35, bearing: venue.bearing ?? -12, pitch: 64 }
}));

// Numbering follows FIFA's official final schedule rather than simple kickoff
// chronology, which differs for several group-stage matches.
const fixtureSeeds: FixtureSeed[] = [
  { no: 1, stage: "group", date: "2022-11-20", venueId: "al-bayt-stadium", home: "QAT", away: "ECU", score: { home: 0, away: 2 } },
  { no: 2, stage: "group", date: "2022-11-21", venueId: "al-thumama-stadium", home: "SEN", away: "NED", score: { home: 0, away: 2 } },
  { no: 3, stage: "group", date: "2022-11-21", venueId: "khalifa-international-stadium", home: "ENG", away: "IRN", score: { home: 6, away: 2 } },
  { no: 4, stage: "group", date: "2022-11-21", venueId: "ahmad-bin-ali-stadium", home: "USA", away: "WAL", score: { home: 1, away: 1 } },
  { no: 5, stage: "group", date: "2022-11-22", venueId: "al-janoub-stadium", home: "FRA", away: "AUS", score: { home: 4, away: 1 } },
  { no: 6, stage: "group", date: "2022-11-22", venueId: "education-city-stadium", home: "DEN", away: "TUN", score: { home: 0, away: 0 } },
  { no: 7, stage: "group", date: "2022-11-22", venueId: "stadium-974", home: "MEX", away: "POL", score: { home: 0, away: 0 } },
  { no: 8, stage: "group", date: "2022-11-22", venueId: "lusail-stadium", home: "ARG", away: "KSA", score: { home: 1, away: 2 } },
  { no: 9, stage: "group", date: "2022-11-23", venueId: "ahmad-bin-ali-stadium", home: "BEL", away: "CAN", score: { home: 1, away: 0 } },
  { no: 10, stage: "group", date: "2022-11-23", venueId: "al-thumama-stadium", home: "ESP", away: "CRC", score: { home: 7, away: 0 } },
  { no: 11, stage: "group", date: "2022-11-23", venueId: "khalifa-international-stadium", home: "GER", away: "JPN", score: { home: 1, away: 2 } },
  { no: 12, stage: "group", date: "2022-11-23", venueId: "al-bayt-stadium", home: "MAR", away: "CRO", score: { home: 0, away: 0 } },
  { no: 13, stage: "group", date: "2022-11-24", venueId: "al-janoub-stadium", home: "SUI", away: "CMR", score: { home: 1, away: 0 } },
  { no: 14, stage: "group", date: "2022-11-24", venueId: "education-city-stadium", home: "URU", away: "KOR", score: { home: 0, away: 0 } },
  { no: 15, stage: "group", date: "2022-11-24", venueId: "stadium-974", home: "POR", away: "GHA", score: { home: 3, away: 2 } },
  { no: 16, stage: "group", date: "2022-11-24", venueId: "lusail-stadium", home: "BRA", away: "SRB", score: { home: 2, away: 0 } },
  { no: 17, stage: "group", date: "2022-11-25", venueId: "ahmad-bin-ali-stadium", home: "WAL", away: "IRN", score: { home: 0, away: 2 } },
  { no: 18, stage: "group", date: "2022-11-25", venueId: "al-thumama-stadium", home: "QAT", away: "SEN", score: { home: 1, away: 3 } },
  { no: 19, stage: "group", date: "2022-11-25", venueId: "khalifa-international-stadium", home: "NED", away: "ECU", score: { home: 1, away: 1 } },
  { no: 20, stage: "group", date: "2022-11-25", venueId: "al-bayt-stadium", home: "ENG", away: "USA", score: { home: 0, away: 0 } },
  { no: 21, stage: "group", date: "2022-11-26", venueId: "al-janoub-stadium", home: "TUN", away: "AUS", score: { home: 0, away: 1 } },
  { no: 22, stage: "group", date: "2022-11-26", venueId: "education-city-stadium", home: "POL", away: "KSA", score: { home: 2, away: 0 } },
  { no: 23, stage: "group", date: "2022-11-26", venueId: "stadium-974", home: "FRA", away: "DEN", score: { home: 2, away: 1 } },
  { no: 24, stage: "group", date: "2022-11-26", venueId: "lusail-stadium", home: "ARG", away: "MEX", score: { home: 2, away: 0 } },
  { no: 25, stage: "group", date: "2022-11-27", venueId: "ahmad-bin-ali-stadium", home: "JPN", away: "CRC", score: { home: 0, away: 1 } },
  { no: 26, stage: "group", date: "2022-11-27", venueId: "al-thumama-stadium", home: "BEL", away: "MAR", score: { home: 0, away: 2 } },
  { no: 27, stage: "group", date: "2022-11-27", venueId: "khalifa-international-stadium", home: "CRO", away: "CAN", score: { home: 4, away: 1 } },
  { no: 28, stage: "group", date: "2022-11-27", venueId: "al-bayt-stadium", home: "ESP", away: "GER", score: { home: 1, away: 1 } },
  { no: 29, stage: "group", date: "2022-11-28", venueId: "al-janoub-stadium", home: "CMR", away: "SRB", score: { home: 3, away: 3 } },
  { no: 30, stage: "group", date: "2022-11-28", venueId: "education-city-stadium", home: "KOR", away: "GHA", score: { home: 2, away: 3 } },
  { no: 31, stage: "group", date: "2022-11-28", venueId: "stadium-974", home: "BRA", away: "SUI", score: { home: 1, away: 0 } },
  { no: 32, stage: "group", date: "2022-11-28", venueId: "lusail-stadium", home: "POR", away: "URU", score: { home: 2, away: 0 } },
  { no: 33, stage: "group", date: "2022-11-29", venueId: "ahmad-bin-ali-stadium", home: "WAL", away: "ENG", score: { home: 0, away: 3 } },
  { no: 34, stage: "group", date: "2022-11-29", venueId: "al-thumama-stadium", home: "IRN", away: "USA", score: { home: 0, away: 1 } },
  { no: 35, stage: "group", date: "2022-11-29", venueId: "khalifa-international-stadium", home: "ECU", away: "SEN", score: { home: 1, away: 2 } },
  { no: 36, stage: "group", date: "2022-11-29", venueId: "al-bayt-stadium", home: "NED", away: "QAT", score: { home: 2, away: 0 } },
  { no: 37, stage: "group", date: "2022-11-30", venueId: "al-janoub-stadium", home: "AUS", away: "DEN", score: { home: 1, away: 0 } },
  { no: 38, stage: "group", date: "2022-11-30", venueId: "education-city-stadium", home: "TUN", away: "FRA", score: { home: 1, away: 0 } },
  { no: 39, stage: "group", date: "2022-11-30", venueId: "stadium-974", home: "POL", away: "ARG", score: { home: 0, away: 2 } },
  { no: 40, stage: "group", date: "2022-11-30", venueId: "lusail-stadium", home: "KSA", away: "MEX", score: { home: 1, away: 2 } },
  { no: 41, stage: "group", date: "2022-12-01", venueId: "ahmad-bin-ali-stadium", home: "CRO", away: "BEL", score: { home: 0, away: 0 } },
  { no: 42, stage: "group", date: "2022-12-01", venueId: "al-thumama-stadium", home: "CAN", away: "MAR", score: { home: 1, away: 2 } },
  { no: 43, stage: "group", date: "2022-12-01", venueId: "khalifa-international-stadium", home: "JPN", away: "ESP", score: { home: 2, away: 1 } },
  { no: 44, stage: "group", date: "2022-12-01", venueId: "al-bayt-stadium", home: "CRC", away: "GER", score: { home: 2, away: 4 } },
  { no: 45, stage: "group", date: "2022-12-02", venueId: "al-janoub-stadium", home: "GHA", away: "URU", score: { home: 0, away: 2 } },
  { no: 46, stage: "group", date: "2022-12-02", venueId: "education-city-stadium", home: "KOR", away: "POR", score: { home: 2, away: 1 } },
  { no: 47, stage: "group", date: "2022-12-02", venueId: "stadium-974", home: "SRB", away: "SUI", score: { home: 2, away: 3 } },
  { no: 48, stage: "group", date: "2022-12-02", venueId: "lusail-stadium", home: "CMR", away: "BRA", score: { home: 1, away: 0 } },
  { no: 49, stage: "r16", date: "2022-12-03", venueId: "khalifa-international-stadium", home: "NED", away: "USA", score: { home: 3, away: 1 } },
  { no: 50, stage: "r16", date: "2022-12-03", venueId: "ahmad-bin-ali-stadium", home: "ARG", away: "AUS", score: { home: 2, away: 1 } },
  { no: 51, stage: "r16", date: "2022-12-04", venueId: "al-bayt-stadium", home: "ENG", away: "SEN", score: { home: 3, away: 0 } },
  { no: 52, stage: "r16", date: "2022-12-04", venueId: "al-thumama-stadium", home: "FRA", away: "POL", score: { home: 3, away: 1 } },
  { no: 53, stage: "r16", date: "2022-12-05", venueId: "al-janoub-stadium", home: "JPN", away: "CRO", score: { home: 1, away: 1 }, shootout: { home: 1, away: 3 }, durationMinutes: 120, note: "Croatia won 3-1 on penalties" },
  { no: 54, stage: "r16", date: "2022-12-05", venueId: "stadium-974", home: "BRA", away: "KOR", score: { home: 4, away: 1 } },
  { no: 55, stage: "r16", date: "2022-12-06", venueId: "education-city-stadium", home: "MAR", away: "ESP", score: { home: 0, away: 0 }, shootout: { home: 3, away: 0 }, durationMinutes: 120, note: "Morocco won 3-0 on penalties" },
  { no: 56, stage: "r16", date: "2022-12-06", venueId: "lusail-stadium", home: "POR", away: "SUI", score: { home: 6, away: 1 } },
  { no: 57, stage: "qf", date: "2022-12-09", venueId: "lusail-stadium", home: "NED", away: "ARG", score: { home: 2, away: 2 }, shootout: { home: 3, away: 4 }, durationMinutes: 120, note: "Argentina won 4-3 on penalties" },
  { no: 58, stage: "qf", date: "2022-12-09", venueId: "education-city-stadium", home: "CRO", away: "BRA", score: { home: 1, away: 1 }, shootout: { home: 4, away: 2 }, durationMinutes: 120, note: "Croatia won 4-2 on penalties" },
  { no: 59, stage: "qf", date: "2022-12-10", venueId: "al-bayt-stadium", home: "ENG", away: "FRA", score: { home: 1, away: 2 } },
  { no: 60, stage: "qf", date: "2022-12-10", venueId: "al-thumama-stadium", home: "MAR", away: "POR", score: { home: 1, away: 0 } },
  { no: 61, stage: "sf", date: "2022-12-13", venueId: "lusail-stadium", home: "ARG", away: "CRO", score: { home: 3, away: 0 } },
  { no: 62, stage: "sf", date: "2022-12-14", venueId: "al-bayt-stadium", home: "FRA", away: "MAR", score: { home: 2, away: 0 } },
  { no: 63, stage: "third", date: "2022-12-17", venueId: "khalifa-international-stadium", home: "CRO", away: "MAR", score: { home: 2, away: 1 } },
  { no: 64, stage: "final", date: "2022-12-18", venueId: "lusail-stadium", home: "ARG", away: "FRA", score: { home: 3, away: 3 }, shootout: { home: 4, away: 2 }, durationMinutes: 120, note: "Argentina won 4-2 on penalties" }
];

// Scorers and minute labels follow the Fjelstul World Cup Database and are
// joined to FIFA's official match sequence by date and exact team pairing.
const goalsByFixture: Partial<Record<number, GoalSeed[]>> = {
  1: [[16, "ECU", "Enner Valencia", "Enner Valencia scores from the penalty spot."], [31, "ECU", "Enner Valencia"]],
  2: [[84, "NED", "Cody Gakpo"], [90, "NED", "Davy Klaassen", "Davy Klaassen scores in second-half stoppage time."]],
  3: [[35, "ENG", "Jude Bellingham"], [43, "ENG", "Bukayo Saka"], [45, "ENG", "Raheem Sterling", "Raheem Sterling scores in first-half stoppage time."], [62, "ENG", "Bukayo Saka"], [65, "IRN", "Mehdi Taremi"], [71, "ENG", "Marcus Rashford"], [90, "ENG", "Jack Grealish"], [90, "IRN", "Mehdi Taremi", "Mehdi Taremi scores from the penalty spot in second-half stoppage time."]],
  4: [[36, "USA", "Timothy Weah"], [82, "WAL", "Gareth Bale", "Gareth Bale scores from the penalty spot."]],
  5: [[9, "AUS", "Craig Goodwin"], [27, "FRA", "Adrien Rabiot"], [32, "FRA", "Olivier Giroud"], [68, "FRA", "Kylian Mbappé"], [71, "FRA", "Olivier Giroud"]],
  8: [[10, "ARG", "Lionel Messi", "Lionel Messi scores from the penalty spot."], [48, "KSA", "Saleh Al-Shehri"], [53, "KSA", "Salem Al-Dawsari"]],
  9: [[44, "BEL", "Michy Batshuayi"]],
  10: [[11, "ESP", "Dani Olmo"], [21, "ESP", "Marco Asensio"], [31, "ESP", "Ferran Torres", "Ferran Torres scores from the penalty spot."], [54, "ESP", "Ferran Torres"], [74, "ESP", "Gavi"], [90, "ESP", "Carlos Soler"], [90, "ESP", "Álvaro Morata", "Álvaro Morata scores in second-half stoppage time."]],
  11: [[33, "GER", "İlkay Gündoğan", "İlkay Gündoğan scores from the penalty spot."], [75, "JPN", "Ritsu Dōan"], [83, "JPN", "Takuma Asano"]],
  13: [[48, "SUI", "Breel Embolo"]],
  15: [[65, "POR", "Cristiano Ronaldo", "Cristiano Ronaldo scores from the penalty spot."], [73, "GHA", "André Ayew"], [78, "POR", "João Félix"], [80, "POR", "Rafael Leão"], [89, "GHA", "Osman Bukari"]],
  16: [[62, "BRA", "Richarlison"], [73, "BRA", "Richarlison"]],
  17: [[90, "IRN", "Rouzbeh Cheshmi", "Rouzbeh Cheshmi scores in second-half stoppage time."], [90, "IRN", "Ramin Rezaeian", "Ramin Rezaeian scores in second-half stoppage time."]],
  18: [[41, "SEN", "Boulaye Dia"], [48, "SEN", "Famara Diédhiou"], [78, "QAT", "Mohammed Muntari"], [84, "SEN", "Bamba Dieng"]],
  19: [[6, "NED", "Cody Gakpo"], [49, "ECU", "Enner Valencia"]],
  21: [[23, "AUS", "Mitchell Duke"]],
  22: [[39, "POL", "Piotr Zieliński"], [82, "POL", "Robert Lewandowski"]],
  23: [[61, "FRA", "Kylian Mbappé"], [68, "DEN", "Andreas Christensen"], [86, "FRA", "Kylian Mbappé"]],
  24: [[64, "ARG", "Lionel Messi"], [87, "ARG", "Enzo Fernández"]],
  25: [[81, "CRC", "Keysher Fuller"]],
  26: [[73, "MAR", "Romain Saïss"], [90, "MAR", "Zakaria Aboukhlal", "Zakaria Aboukhlal scores in second-half stoppage time."]],
  27: [[2, "CAN", "Alphonso Davies"], [36, "CRO", "Andrej Kramarić"], [44, "CRO", "Marko Livaja"], [70, "CRO", "Andrej Kramarić"], [90, "CRO", "Lovro Majer", "Lovro Majer scores in second-half stoppage time."]],
  28: [[62, "ESP", "Álvaro Morata"], [83, "GER", "Niclas Füllkrug"]],
  29: [[29, "CMR", "Jean-Charles Castelletto"], [45, "SRB", "Strahinja Pavlović", "Strahinja Pavlović scores in first-half stoppage time."], [45, "SRB", "Sergej Milinković-Savić", "Sergej Milinković-Savić scores in first-half stoppage time."], [53, "SRB", "Aleksandar Mitrović"], [63, "CMR", "Vincent Aboubakar"], [66, "CMR", "Eric Maxim Choupo-Moting"]],
  30: [[24, "GHA", "Mohammed Salisu"], [34, "GHA", "Mohammed Kudus"], [58, "KOR", "Cho Gue-sung"], [61, "KOR", "Cho Gue-sung"], [68, "GHA", "Mohammed Kudus"]],
  31: [[83, "BRA", "Casemiro"]],
  32: [[54, "POR", "Bruno Fernandes"], [90, "POR", "Bruno Fernandes", "Bruno Fernandes scores from the penalty spot in second-half stoppage time."]],
  33: [[50, "ENG", "Marcus Rashford"], [51, "ENG", "Phil Foden"], [68, "ENG", "Marcus Rashford"]],
  34: [[38, "USA", "Christian Pulisic"]],
  35: [[44, "SEN", "Ismaïla Sarr", "Ismaïla Sarr scores from the penalty spot."], [67, "ECU", "Moisés Caicedo"], [70, "SEN", "Kalidou Koulibaly"]],
  36: [[26, "NED", "Cody Gakpo"], [49, "NED", "Frenkie de Jong"]],
  37: [[60, "AUS", "Mathew Leckie"]],
  38: [[58, "TUN", "Wahbi Khazri"]],
  39: [[46, "ARG", "Alexis Mac Allister"], [67, "ARG", "Julián Álvarez"]],
  40: [[47, "MEX", "Henry Martín"], [52, "MEX", "Luis Chávez"], [90, "KSA", "Salem Al-Dawsari", "Salem Al-Dawsari scores in second-half stoppage time."]],
  42: [[4, "MAR", "Hakim Ziyech"], [23, "MAR", "Youssef En-Nesyri"], [40, "CAN", "Nayef Aguerd", "Nayef Aguerd scores an own goal."]],
  43: [[11, "ESP", "Álvaro Morata"], [48, "JPN", "Ritsu Dōan"], [51, "JPN", "Ao Tanaka"]],
  44: [[10, "GER", "Serge Gnabry"], [58, "CRC", "Yeltsin Tejeda"], [70, "CRC", "Juan Pablo Vargas"], [73, "GER", "Kai Havertz"], [85, "GER", "Kai Havertz"], [89, "GER", "Niclas Füllkrug"]],
  45: [[26, "URU", "Giorgian De Arrascaeta"], [32, "URU", "Giorgian De Arrascaeta"]],
  46: [[5, "POR", "Ricardo Horta"], [27, "KOR", "Young-gwon Kim"], [90, "KOR", "Hee-chan Hwang", "Hee-chan Hwang scores in second-half stoppage time."]],
  47: [[20, "SUI", "Xherdan Shaqiri"], [26, "SRB", "Aleksandar Mitrović"], [35, "SRB", "Dušan Vlahović"], [44, "SUI", "Breel Embolo"], [48, "SUI", "Remo Freuler"]],
  48: [[90, "CMR", "Vincent Aboubakar", "Vincent Aboubakar scores in second-half stoppage time."]],
  49: [[10, "NED", "Memphis Depay"], [45, "NED", "Daley Blind", "Daley Blind scores in first-half stoppage time."], [76, "USA", "Haji Wright"], [81, "NED", "Denzel Dumfries"]],
  50: [[35, "ARG", "Lionel Messi"], [57, "ARG", "Julián Álvarez"], [77, "AUS", "Enzo Fernández", "Enzo Fernández scores an own goal."]],
  51: [[38, "ENG", "Jordan Henderson"], [45, "ENG", "Harry Kane", "Harry Kane scores in first-half stoppage time."], [57, "ENG", "Bukayo Saka"]],
  52: [[44, "FRA", "Olivier Giroud"], [74, "FRA", "Kylian Mbappé"], [90, "FRA", "Kylian Mbappé", "Kylian Mbappé scores in second-half stoppage time."], [90, "POL", "Robert Lewandowski", "Robert Lewandowski scores from the penalty spot in second-half stoppage time."]],
  53: [[43, "JPN", "Daizen Maeda"], [55, "CRO", "Ivan Perišić"]],
  54: [[7, "BRA", "Vinícius Júnior"], [13, "BRA", "Neymar", "Neymar scores from the penalty spot."], [29, "BRA", "Richarlison"], [36, "BRA", "Lucas Paquetá"], [76, "KOR", "Paik Seung-ho"]],
  56: [[17, "POR", "Gonçalo Ramos"], [33, "POR", "Pepe"], [51, "POR", "Gonçalo Ramos"], [55, "POR", "Raphaël Guerreiro"], [58, "SUI", "Manuel Akanji"], [67, "POR", "Gonçalo Ramos"], [90, "POR", "Rafael Leão", "Rafael Leão scores in second-half stoppage time."]],
  57: [[35, "ARG", "Nahuel Molina"], [73, "ARG", "Lionel Messi", "Lionel Messi scores from the penalty spot."], [83, "NED", "Wout Weghorst"], [90, "NED", "Wout Weghorst", "Wout Weghorst scores in second-half stoppage time."]],
  58: [[105, "BRA", "Neymar", "Neymar scores in extra-time stoppage time."], [117, "CRO", "Bruno Petković"]],
  59: [[17, "FRA", "Aurélien Tchouaméni"], [54, "ENG", "Harry Kane", "Harry Kane scores from the penalty spot."], [78, "FRA", "Olivier Giroud"]],
  60: [[42, "MAR", "Youssef En-Nesyri"]],
  61: [[34, "ARG", "Lionel Messi", "Lionel Messi scores from the penalty spot."], [39, "ARG", "Julián Álvarez"], [69, "ARG", "Julián Álvarez"]],
  62: [[5, "FRA", "Théo Hernandez"], [79, "FRA", "Randal Kolo Muani"]],
  63: [[7, "CRO", "Joško Gvardiol"], [9, "MAR", "Achraf Dari"], [42, "CRO", "Mislav Oršić"]],
  64: [[23, "ARG", "Lionel Messi", "Lionel Messi scores from the penalty spot."], [36, "ARG", "Ángel Di María"], [80, "FRA", "Kylian Mbappé", "Kylian Mbappé scores from the penalty spot."], [81, "FRA", "Kylian Mbappé"], [108, "ARG", "Lionel Messi"], [118, "FRA", "Kylian Mbappé", "Kylian Mbappé scores from the penalty spot."]]
};

type YouTubeHighlightSeed = { videoId: string; sourceName: string };

// Every exact-match selection passed YouTube's embedded-player response with
// status OK and playableInEmbed=true using the app origin.
const youtubeHighlightsByFixture: Record<number, YouTubeHighlightSeed> = {
  1: { videoId: "5uNMoO_2av8", sourceName: "FIFA World Cup Qatar 2022 highlights" },
  2: { videoId: "ax4nCX1skwc", sourceName: "Ciniki Style highlights" },
  3: { videoId: "XNgjOJGlPPI", sourceName: "Sports Highlights" },
  4: { videoId: "9hOgSAdUTiw", sourceName: "GREEN BIRD highlights" },
  5: { videoId: "D-XAk6DUJ34", sourceName: "D2 CREATOR highlights" },
  6: { videoId: "Q3hPwmNFAbk", sourceName: "Football Highlight highlights" },
  7: { videoId: "TFQvB2O5U7c", sourceName: "Football HD highlights" },
  8: { videoId: "H6Hxuaj17uo", sourceName: "Football King highlights" },
  9: { videoId: "anPhCt1KmvI", sourceName: "Amisi Agro highlights" },
  10: { videoId: "jugzlqMwD4E", sourceName: "NCF Ariyan highlights" },
  11: { videoId: "yYdr5zowYMA", sourceName: "Football King highlights" },
  12: { videoId: "xxXwimS7F3g", sourceName: "Voli Mania highlights" },
  13: { videoId: "5UbGn98gHI4", sourceName: "SPORTS CENTER highlights" },
  14: { videoId: "wDfE620Z9lc", sourceName: "90+ Insight highlights" },
  15: { videoId: "DUWhb4ZJspQ", sourceName: "Fighters Official highlights" },
  16: { videoId: "ywMWUAl06AU", sourceName: "Goaldinho highlights" },
  17: { videoId: "XcL4-AilNuI", sourceName: "SULTAN SOJIB KHAN highlights" },
  18: { videoId: "phboo8gx-vg", sourceName: "FIFA Cup highlights" },
  19: { videoId: "2_6j8MCIi8g", sourceName: "Fighters Official highlights" },
  20: { videoId: "s2bNTTf8VC0", sourceName: "Football update hub highlights" },
  21: { videoId: "LYQJ5bTVAdM", sourceName: "Koora1 highlights" },
  22: { videoId: "3zDn7qHilgw", sourceName: "Historical Matches HD highlights" },
  23: { videoId: "LcAD6SdnAgg", sourceName: "Amazing MatchesHD highlights" },
  24: { videoId: "uI1J4Ss204Y", sourceName: "Football Flow highlights" },
  25: { videoId: "MG0EHF_m0so", sourceName: "Football Highlights World Cup" },
  26: { videoId: "WhvTPfksFg8", sourceName: "Galaxy Koora Gool HD highlights" },
  27: { videoId: "Uq0Lk0oGbt8", sourceName: "Barceville highlights" },
  28: { videoId: "qziEPg_tIjg", sourceName: "Galaxy Koora Gool HD highlights" },
  29: { videoId: "44suKnM-4Uw", sourceName: "World Cup Qatar 2022 highlights" },
  30: { videoId: "481kKNjrXU0", sourceName: "90+ Minutes highlights" },
  31: { videoId: "H1O75TvKP1g", sourceName: "fball highlights" },
  32: { videoId: "afexUzceR2g", sourceName: "Jump3 FOOTBALL HD highlights" },
  33: { videoId: "_S1IoMoBw2Y", sourceName: "FOOT ZONE 4K highlights" },
  34: { videoId: "tpy5tFmhLkE", sourceName: "AK Highlights TV" },
  35: { videoId: "CogSg9-dzXs", sourceName: "İCTİMAİ TV highlights" },
  36: { videoId: "YVDWY2Qtwnc", sourceName: "World Cup Highlights 2022" },
  37: { videoId: "8s__GN8oFDc", sourceName: "World FootBall highlights" },
  38: { videoId: "d0hQkfuIvPg", sourceName: "1 Tube Light highlights" },
  39: { videoId: "RQEcP6WXANE", sourceName: "TYFC HD highlights" },
  40: { videoId: "69PrACDUp94", sourceName: "Anonymous Gamers highlights" },
  41: { videoId: "eukVhjeuDKQ", sourceName: "World Cup Football Matches" },
  42: { videoId: "SH3NDkMNFzc", sourceName: "Lyrics highlights" },
  43: { videoId: "dUg69_VLASM", sourceName: "Arafat Tv20 highlights" },
  44: { videoId: "HB3pSzqqci4", sourceName: "VIRAL KALEEH highlights" },
  45: { videoId: "boMzb1J0FQ8", sourceName: "NICE SITE highlights" },
  46: { videoId: "P9cK47DHUr4", sourceName: "Football King highlights" },
  47: { videoId: "uZYadD2uwYA", sourceName: "i_sports highlights" },
  48: { videoId: "B5ql6kbBoSk", sourceName: "Jump3 FOOTBALL HD highlights" },
  49: { videoId: "Ny0BM9dhmp8", sourceName: "Amisi Agro highlights" },
  50: { videoId: "sWTZecuVN4A", sourceName: "90+ Minutes highlights" },
  51: { videoId: "aQIJ8pUOKZk", sourceName: "England highlights" },
  52: { videoId: "xM7IE7CEvZk", sourceName: "R S Rathore highlights" },
  53: { videoId: "zmtjEjQpZ0k", sourceName: "SUFIAN CHANNEL highlights" },
  54: { videoId: "XQNW9g_Uh6c", sourceName: "VAR football HD highlights" },
  55: { videoId: "9WdFHJTtTpI", sourceName: "World Football highlights" },
  56: { videoId: "3VvqeN0JzZ8", sourceName: "Football King highlights" },
  57: { videoId: "wK_CuOfPrtA", sourceName: "Football Flow highlights" },
  58: { videoId: "Bc5eiegoY8s", sourceName: "Football Flow highlights" },
  59: { videoId: "IN9JyNQL4rI", sourceName: "HT Football highlights" },
  60: { videoId: "Dwr8h1wyevc", sourceName: "Galaxy Koora Gool HD highlights" },
  61: { videoId: "PWfnr7zEJic", sourceName: "Football Fever highlights" },
  62: { videoId: "QHsyK24C0Bw", sourceName: "SELENA F69 highlights" },
  63: { videoId: "NYEL7IHzSxo", sourceName: "World Football highlights" },
  64: { videoId: "xX_dwqVzc4c", sourceName: "ITV Sport highlights" }
};

const fifaMatchIdsByFixture: Record<number, string> = {
  1: "400128082", 2: "400235449", 3: "400235458", 4: "400235455", 5: "400235470", 6: "400235466", 7: "400235463", 8: "400235461",
  9: "400235477", 10: "400235472", 11: "400235476", 12: "400235481", 13: "400235488", 14: "400235491", 15: "400235493", 16: "400235484",
  17: "400235453", 18: "400235448", 19: "400235452", 20: "400235457", 21: "400235469", 22: "400235459", 23: "400235467", 24: "400235462",
  25: "400235471", 26: "400235480", 27: "400235482", 28: "400235474", 29: "400235487", 30: "400235489", 31: "400235485", 32: "400235492",
  33: "400235454", 34: "400235456", 35: "400235451", 36: "400235450", 37: "400235468", 38: "400235465", 39: "400235464", 40: "400235460",
  41: "400235478", 42: "400235479", 43: "400235475", 44: "400235473", 45: "400235494", 46: "400235490", 47: "400235486", 48: "400235483",
  49: "400128136", 50: "400128131", 51: "400128134", 52: "400128135", 53: "400128132", 54: "400128133", 55: "400128137", 56: "400128130",
  57: "400128139", 58: "400128141", 59: "400128138", 60: "400128140", 61: "400128143", 62: "400128142", 63: "400128144", 64: "400128145"
};

function getFifaRoundId(no: number) {
  if (no <= 48) return "285063";
  if (no <= 56) return "285073";
  if (no <= 60) return "285074";
  if (no <= 62) return "285075";
  if (no === 63) return "285076";
  return "285077";
}

function getFifaMatchUrl(fixture: FixtureSeed) {
  return `https://www.fifa.com/en/match-centre/match/17/255711/${getFifaRoundId(fixture.no)}/${fifaMatchIdsByFixture[fixture.no]}?date=${fixture.date}`;
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
  const resultDetail = `${teamNames[fixture.home]} ${fixture.score.home}-${fixture.score.away} ${teamNames[fixture.away]}${fixture.note ? ` (${fixture.note})` : ""}.`;
  const fullTimeMinute = Math.max(fixture.durationMinutes ?? 90, ...goals.map(([minute]) => minute));
  return [
    { id: "kickoff", minute: 0, type: "kickoff", detail: `${teamNames[fixture.home]} and ${teamNames[fixture.away]} kick off at ${venue}.`, scoreAfter: { home: 0, away: 0 } },
    ...goalEvents.filter((event) => event.minute !== null && event.minute <= 45),
    { id: "half-time", minute: 45, type: "half_time", detail: `Half-time at ${venue}.`, scoreAfter: getHalftimeScore(goals, fixture.home, fixture.away) },
    ...goalEvents.filter((event) => event.minute !== null && event.minute > 45),
    { id: "full-time", minute: fullTimeMinute, type: "full_time", detail: `Full time. ${resultDetail}`, scoreAfter: fixture.score },
    { id: "result", minute: null, type: "result", detail: resultDetail, scoreAfter: fixture.score }
  ];
}

const matches: Match[] = fixtureSeeds.map((fixture) => {
  const youtube = youtubeHighlightsByFixture[fixture.no];
  const highlights = createYoutubeHighlight(youtube.videoId, getFifaMatchUrl(fixture), youtube.sourceName);
  return {
    id: `wc-2022-${String(fixture.no).padStart(2, "0")}-${fixture.home.toLowerCase()}-${fixture.away.toLowerCase()}`,
    tournamentId: "wc-2022",
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

export const worldCup2022: Tournament = {
  id: "wc-2022",
  competition: "WORLD_CUP",
  name: "Qatar 2022",
  year: 2022,
  hosts: ["QAT"],
  teams: worldCup2022Groups.flatMap((group) => group.teams),
  groups: worldCup2022Groups,
  teamCoordinates: worldCup2022TeamCoordinates,
  format: worldCup2022Format,
  stages: ["group", "r16", "qf", "sf", "third", "final"],
  status: "complete",
  mapView: { center: [51.45, 25.31], zoom: 8.1, bearing: -8, pitch: 42 },
  venues,
  featuredRoute: venues.map((venue) => venue.id),
  matches
};
