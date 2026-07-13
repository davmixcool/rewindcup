import { createOfficialReportHighlight, createYoutubeHighlight } from "@/data/highlights";
import { teamNames } from "@/data/teamMetadata";
import {
  worldCup2026Format,
  worldCup2026Groups,
  worldCup2026TeamCoordinates
} from "@/data/worldCup2026Experience";
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
  durationMinutes?: 120;
  note?: string;
};

const venueSeeds: VenueSeed[] = [
  { id: "atlanta-stadium", name: "Atlanta Stadium", city: "Atlanta", country: "USA", coordinates: [-84.4008,33.7554], bearing: -14 },
  { id: "bc-place-vancouver", name: "BC Place Vancouver", city: "Vancouver", country: "CAN", coordinates: [-123.1119,49.2768], bearing: 14 },
  { id: "boston-stadium", name: "Boston Stadium", city: "Boston", country: "USA", coordinates: [-71.2643,42.0909], bearing: -14 },
  { id: "dallas-stadium", name: "Dallas Stadium", city: "Dallas", country: "USA", coordinates: [-97.0929,32.7473], bearing: 14 },
  { id: "guadalajara-stadium", name: "Guadalajara Stadium", city: "Guadalajara", country: "MEX", coordinates: [-103.4625,20.6818], bearing: -14 },
  { id: "houston-stadium", name: "Houston Stadium", city: "Houston", country: "USA", coordinates: [-95.4109,29.6847], bearing: 14 },
  { id: "kansas-city-stadium", name: "Kansas City Stadium", city: "Kansas City", country: "USA", coordinates: [-94.4839,39.0489], bearing: -14 },
  { id: "los-angeles-stadium", name: "Los Angeles Stadium", city: "Los Angeles", country: "USA", coordinates: [-118.3392,33.9535], bearing: 14 },
  { id: "mexico-city-stadium", name: "Mexico City Stadium", city: "Mexico City", country: "MEX", coordinates: [-99.1506,19.3029], bearing: -14 },
  { id: "miami-stadium", name: "Miami Stadium", city: "Miami", country: "USA", coordinates: [-80.2389,25.958], bearing: 14 },
  { id: "monterrey-stadium", name: "Monterrey Stadium", city: "Monterrey", country: "MEX", coordinates: [-100.2444,25.6694], bearing: -14 },
  { id: "new-york-new-jersey-stadium", name: "New York New Jersey Stadium", city: "New York/New Jersey", country: "USA", coordinates: [-74.0745,40.8135], bearing: 14 },
  { id: "philadelphia-stadium", name: "Philadelphia Stadium", city: "Philadelphia", country: "USA", coordinates: [-75.1675,39.9008], bearing: -14 },
  { id: "san-francisco-bay-area-stadium", name: "San Francisco Bay Area Stadium", city: "San Francisco Bay Area", country: "USA", coordinates: [-121.9698,37.403], bearing: 14 },
  { id: "seattle-stadium", name: "Seattle Stadium", city: "Seattle", country: "USA", coordinates: [-122.3316,47.5952], bearing: -14 },
  { id: "toronto-stadium", name: "Toronto Stadium", city: "Toronto", country: "CAN", coordinates: [-79.4186,43.6332], bearing: 14 }
];

const venues: Venue[] = venueSeeds.map((venue) => ({
  ...venue,
  stadiumView: { center: venue.coordinates, zoom: 16.35, bearing: venue.bearing ?? -12, pitch: 64 }
}));

// This partial snapshot includes only matches completed by 13 July 2026.
const fixtureSeeds: FixtureSeed[] = [
  {no: 1,stage: "group",date: "2026-06-11",venueId: "mexico-city-stadium",home: "MEX",away: "RSA",score: {home: 2,away: 0}},
  {no: 2,stage: "group",date: "2026-06-11",venueId: "guadalajara-stadium",home: "KOR",away: "CZE",score: {home: 2,away: 1}},
  {no: 3,stage: "group",date: "2026-06-12",venueId: "toronto-stadium",home: "CAN",away: "BIH",score: {home: 1,away: 1}},
  {no: 4,stage: "group",date: "2026-06-12",venueId: "los-angeles-stadium",home: "USA",away: "PAR",score: {home: 4,away: 1}},
  {no: 5,stage: "group",date: "2026-06-13",venueId: "boston-stadium",home: "HAI",away: "SCO",score: {home: 0,away: 1}},
  {no: 6,stage: "group",date: "2026-06-13",venueId: "bc-place-vancouver",home: "AUS",away: "TUR",score: {home: 2,away: 0}},
  {no: 7,stage: "group",date: "2026-06-13",venueId: "new-york-new-jersey-stadium",home: "BRA",away: "MAR",score: {home: 1,away: 1}},
  {no: 8,stage: "group",date: "2026-06-13",venueId: "san-francisco-bay-area-stadium",home: "QAT",away: "SUI",score: {home: 1,away: 1}},
  {no: 9,stage: "group",date: "2026-06-14",venueId: "philadelphia-stadium",home: "CIV",away: "ECU",score: {home: 1,away: 0}},
  {no: 10,stage: "group",date: "2026-06-14",venueId: "houston-stadium",home: "GER",away: "CUW",score: {home: 7,away: 1}},
  {no: 11,stage: "group",date: "2026-06-14",venueId: "dallas-stadium",home: "NED",away: "JPN",score: {home: 2,away: 2}},
  {no: 12,stage: "group",date: "2026-06-14",venueId: "monterrey-stadium",home: "SWE",away: "TUN",score: {home: 5,away: 1}},
  {no: 13,stage: "group",date: "2026-06-15",venueId: "miami-stadium",home: "KSA",away: "URU",score: {home: 1,away: 1}},
  {no: 14,stage: "group",date: "2026-06-15",venueId: "atlanta-stadium",home: "ESP",away: "CPV",score: {home: 0,away: 0}},
  {no: 15,stage: "group",date: "2026-06-15",venueId: "los-angeles-stadium",home: "IRN",away: "NZL",score: {home: 2,away: 2}},
  {no: 16,stage: "group",date: "2026-06-15",venueId: "seattle-stadium",home: "BEL",away: "EGY",score: {home: 1,away: 1}},
  {no: 17,stage: "group",date: "2026-06-16",venueId: "new-york-new-jersey-stadium",home: "FRA",away: "SEN",score: {home: 3,away: 1}},
  {no: 18,stage: "group",date: "2026-06-16",venueId: "boston-stadium",home: "IRQ",away: "NOR",score: {home: 1,away: 4}},
  {no: 19,stage: "group",date: "2026-06-16",venueId: "kansas-city-stadium",home: "ARG",away: "ALG",score: {home: 3,away: 0}},
  {no: 20,stage: "group",date: "2026-06-16",venueId: "san-francisco-bay-area-stadium",home: "AUT",away: "JOR",score: {home: 3,away: 1}},
  {no: 21,stage: "group",date: "2026-06-17",venueId: "toronto-stadium",home: "GHA",away: "PAN",score: {home: 1,away: 0}},
  {no: 22,stage: "group",date: "2026-06-17",venueId: "dallas-stadium",home: "ENG",away: "CRO",score: {home: 4,away: 2}},
  {no: 23,stage: "group",date: "2026-06-17",venueId: "houston-stadium",home: "POR",away: "COD",score: {home: 1,away: 1}},
  {no: 24,stage: "group",date: "2026-06-17",venueId: "mexico-city-stadium",home: "UZB",away: "COL",score: {home: 1,away: 3}},
  {no: 25,stage: "group",date: "2026-06-18",venueId: "atlanta-stadium",home: "CZE",away: "RSA",score: {home: 1,away: 1}},
  {no: 26,stage: "group",date: "2026-06-18",venueId: "los-angeles-stadium",home: "SUI",away: "BIH",score: {home: 4,away: 1}},
  {no: 27,stage: "group",date: "2026-06-18",venueId: "bc-place-vancouver",home: "CAN",away: "QAT",score: {home: 6,away: 0}},
  {no: 28,stage: "group",date: "2026-06-18",venueId: "guadalajara-stadium",home: "MEX",away: "KOR",score: {home: 1,away: 0}},
  {no: 29,stage: "group",date: "2026-06-19",venueId: "philadelphia-stadium",home: "BRA",away: "HAI",score: {home: 3,away: 0}},
  {no: 30,stage: "group",date: "2026-06-19",venueId: "boston-stadium",home: "SCO",away: "MAR",score: {home: 0,away: 1}},
  {no: 31,stage: "group",date: "2026-06-19",venueId: "san-francisco-bay-area-stadium",home: "TUR",away: "PAR",score: {home: 0,away: 1}},
  {no: 32,stage: "group",date: "2026-06-19",venueId: "seattle-stadium",home: "USA",away: "AUS",score: {home: 2,away: 0}},
  {no: 33,stage: "group",date: "2026-06-20",venueId: "toronto-stadium",home: "GER",away: "CIV",score: {home: 2,away: 1}},
  {no: 34,stage: "group",date: "2026-06-20",venueId: "kansas-city-stadium",home: "ECU",away: "CUW",score: {home: 0,away: 0}},
  {no: 35,stage: "group",date: "2026-06-20",venueId: "houston-stadium",home: "NED",away: "SWE",score: {home: 5,away: 1}},
  {no: 36,stage: "group",date: "2026-06-20",venueId: "monterrey-stadium",home: "TUN",away: "JPN",score: {home: 0,away: 4}},
  {no: 37,stage: "group",date: "2026-06-21",venueId: "miami-stadium",home: "URU",away: "CPV",score: {home: 2,away: 2}},
  {no: 38,stage: "group",date: "2026-06-21",venueId: "atlanta-stadium",home: "ESP",away: "KSA",score: {home: 4,away: 0}},
  {no: 39,stage: "group",date: "2026-06-21",venueId: "los-angeles-stadium",home: "BEL",away: "IRN",score: {home: 0,away: 0}},
  {no: 40,stage: "group",date: "2026-06-21",venueId: "bc-place-vancouver",home: "NZL",away: "EGY",score: {home: 1,away: 3}},
  {no: 41,stage: "group",date: "2026-06-22",venueId: "new-york-new-jersey-stadium",home: "NOR",away: "SEN",score: {home: 3,away: 2}},
  {no: 42,stage: "group",date: "2026-06-22",venueId: "philadelphia-stadium",home: "FRA",away: "IRQ",score: {home: 3,away: 0}},
  {no: 43,stage: "group",date: "2026-06-22",venueId: "dallas-stadium",home: "ARG",away: "AUT",score: {home: 2,away: 0}},
  {no: 44,stage: "group",date: "2026-06-22",venueId: "san-francisco-bay-area-stadium",home: "JOR",away: "ALG",score: {home: 1,away: 2}},
  {no: 45,stage: "group",date: "2026-06-23",venueId: "boston-stadium",home: "ENG",away: "GHA",score: {home: 0,away: 0}},
  {no: 46,stage: "group",date: "2026-06-23",venueId: "toronto-stadium",home: "PAN",away: "CRO",score: {home: 0,away: 1}},
  {no: 47,stage: "group",date: "2026-06-23",venueId: "houston-stadium",home: "POR",away: "UZB",score: {home: 5,away: 0}},
  {no: 48,stage: "group",date: "2026-06-23",venueId: "guadalajara-stadium",home: "COL",away: "COD",score: {home: 1,away: 0}},
  {no: 49,stage: "group",date: "2026-06-24",venueId: "miami-stadium",home: "SCO",away: "BRA",score: {home: 0,away: 3}},
  {no: 50,stage: "group",date: "2026-06-24",venueId: "atlanta-stadium",home: "MAR",away: "HAI",score: {home: 4,away: 2}},
  {no: 51,stage: "group",date: "2026-06-24",venueId: "bc-place-vancouver",home: "SUI",away: "CAN",score: {home: 2,away: 1}},
  {no: 52,stage: "group",date: "2026-06-24",venueId: "seattle-stadium",home: "BIH",away: "QAT",score: {home: 3,away: 1}},
  {no: 53,stage: "group",date: "2026-06-24",venueId: "mexico-city-stadium",home: "CZE",away: "MEX",score: {home: 0,away: 3}},
  {no: 54,stage: "group",date: "2026-06-24",venueId: "monterrey-stadium",home: "RSA",away: "KOR",score: {home: 1,away: 0}},
  {no: 55,stage: "group",date: "2026-06-25",venueId: "philadelphia-stadium",home: "CUW",away: "CIV",score: {home: 0,away: 2}},
  {no: 56,stage: "group",date: "2026-06-25",venueId: "new-york-new-jersey-stadium",home: "ECU",away: "GER",score: {home: 2,away: 1}},
  {no: 57,stage: "group",date: "2026-06-25",venueId: "dallas-stadium",home: "JPN",away: "SWE",score: {home: 1,away: 1}},
  {no: 58,stage: "group",date: "2026-06-25",venueId: "kansas-city-stadium",home: "TUN",away: "NED",score: {home: 1,away: 3}},
  {no: 59,stage: "group",date: "2026-06-25",venueId: "los-angeles-stadium",home: "TUR",away: "USA",score: {home: 3,away: 2}},
  {no: 60,stage: "group",date: "2026-06-25",venueId: "san-francisco-bay-area-stadium",home: "PAR",away: "AUS",score: {home: 0,away: 0}},
  {no: 61,stage: "group",date: "2026-06-26",venueId: "boston-stadium",home: "NOR",away: "FRA",score: {home: 1,away: 4}},
  {no: 62,stage: "group",date: "2026-06-26",venueId: "toronto-stadium",home: "SEN",away: "IRQ",score: {home: 5,away: 0}},
  {no: 63,stage: "group",date: "2026-06-26",venueId: "seattle-stadium",home: "EGY",away: "IRN",score: {home: 1,away: 1}},
  {no: 64,stage: "group",date: "2026-06-26",venueId: "bc-place-vancouver",home: "NZL",away: "BEL",score: {home: 1,away: 5}},
  {no: 65,stage: "group",date: "2026-06-26",venueId: "houston-stadium",home: "CPV",away: "KSA",score: {home: 0,away: 0}},
  {no: 66,stage: "group",date: "2026-06-26",venueId: "guadalajara-stadium",home: "URU",away: "ESP",score: {home: 0,away: 1}},
  {no: 67,stage: "group",date: "2026-06-27",venueId: "new-york-new-jersey-stadium",home: "PAN",away: "ENG",score: {home: 0,away: 2}},
  {no: 68,stage: "group",date: "2026-06-27",venueId: "philadelphia-stadium",home: "CRO",away: "GHA",score: {home: 2,away: 1}},
  {no: 69,stage: "group",date: "2026-06-27",venueId: "kansas-city-stadium",home: "ALG",away: "AUT",score: {home: 3,away: 3}},
  {no: 70,stage: "group",date: "2026-06-27",venueId: "dallas-stadium",home: "JOR",away: "ARG",score: {home: 1,away: 3}},
  {no: 71,stage: "group",date: "2026-06-27",venueId: "miami-stadium",home: "COL",away: "POR",score: {home: 0,away: 0}},
  {no: 72,stage: "group",date: "2026-06-27",venueId: "atlanta-stadium",home: "COD",away: "UZB",score: {home: 3,away: 1}},
  {no: 73,stage: "r32",date: "2026-06-28",venueId: "los-angeles-stadium",home: "RSA",away: "CAN",score: {home: 0,away: 1}},
  {no: 74,stage: "r32",date: "2026-06-29",venueId: "boston-stadium",home: "GER",away: "PAR",score: {home: 1,away: 1},shootout: {home: 3,away: 4},durationMinutes: 120,note: "PAR won 4-3 on penalties"},
  {no: 75,stage: "r32",date: "2026-06-29",venueId: "monterrey-stadium",home: "NED",away: "MAR",score: {home: 1,away: 1},shootout: {home: 2,away: 3},durationMinutes: 120,note: "MAR won 3-2 on penalties"},
  {no: 76,stage: "r32",date: "2026-06-29",venueId: "houston-stadium",home: "BRA",away: "JPN",score: {home: 2,away: 1}},
  {no: 77,stage: "r32",date: "2026-06-30",venueId: "new-york-new-jersey-stadium",home: "FRA",away: "SWE",score: {home: 3,away: 0}},
  {no: 78,stage: "r32",date: "2026-06-30",venueId: "dallas-stadium",home: "CIV",away: "NOR",score: {home: 1,away: 2}},
  {no: 79,stage: "r32",date: "2026-06-30",venueId: "mexico-city-stadium",home: "MEX",away: "ECU",score: {home: 2,away: 0}},
  {no: 80,stage: "r32",date: "2026-07-01",venueId: "atlanta-stadium",home: "ENG",away: "COD",score: {home: 2,away: 1}},
  {no: 81,stage: "r32",date: "2026-07-01",venueId: "san-francisco-bay-area-stadium",home: "USA",away: "BIH",score: {home: 2,away: 0}},
  {no: 82,stage: "r32",date: "2026-07-01",venueId: "seattle-stadium",home: "BEL",away: "SEN",score: {home: 3,away: 2},durationMinutes: 120,note: "BEL won after extra time"},
  {no: 83,stage: "r32",date: "2026-07-02",venueId: "toronto-stadium",home: "POR",away: "CRO",score: {home: 2,away: 1}},
  {no: 84,stage: "r32",date: "2026-07-02",venueId: "los-angeles-stadium",home: "ESP",away: "AUT",score: {home: 3,away: 0}},
  {no: 85,stage: "r32",date: "2026-07-02",venueId: "bc-place-vancouver",home: "SUI",away: "ALG",score: {home: 2,away: 0}},
  {no: 86,stage: "r32",date: "2026-07-03",venueId: "miami-stadium",home: "ARG",away: "CPV",score: {home: 3,away: 2},durationMinutes: 120,note: "ARG won after extra time"},
  {no: 87,stage: "r32",date: "2026-07-03",venueId: "kansas-city-stadium",home: "COL",away: "GHA",score: {home: 1,away: 0}},
  {no: 88,stage: "r32",date: "2026-07-03",venueId: "dallas-stadium",home: "AUS",away: "EGY",score: {home: 1,away: 1},shootout: {home: 2,away: 4},durationMinutes: 120,note: "EGY won 4-2 on penalties"},
  {no: 89,stage: "r16",date: "2026-07-04",venueId: "philadelphia-stadium",home: "PAR",away: "FRA",score: {home: 0,away: 1}},
  {no: 90,stage: "r16",date: "2026-07-04",venueId: "houston-stadium",home: "CAN",away: "MAR",score: {home: 0,away: 3}},
  {no: 91,stage: "r16",date: "2026-07-05",venueId: "new-york-new-jersey-stadium",home: "BRA",away: "NOR",score: {home: 1,away: 2}},
  {no: 92,stage: "r16",date: "2026-07-05",venueId: "mexico-city-stadium",home: "MEX",away: "ENG",score: {home: 2,away: 3}},
  {no: 93,stage: "r16",date: "2026-07-06",venueId: "dallas-stadium",home: "POR",away: "ESP",score: {home: 0,away: 1}},
  {no: 94,stage: "r16",date: "2026-07-06",venueId: "seattle-stadium",home: "USA",away: "BEL",score: {home: 1,away: 4}},
  {no: 95,stage: "r16",date: "2026-07-07",venueId: "atlanta-stadium",home: "ARG",away: "EGY",score: {home: 3,away: 2}},
  {no: 96,stage: "r16",date: "2026-07-07",venueId: "bc-place-vancouver",home: "SUI",away: "COL",score: {home: 0,away: 0},shootout: {home: 4,away: 3},durationMinutes: 120,note: "SUI won 4-3 on penalties"},
  {no: 97,stage: "qf",date: "2026-07-09",venueId: "boston-stadium",home: "FRA",away: "MAR",score: {home: 2,away: 0}},
  {no: 98,stage: "qf",date: "2026-07-10",venueId: "los-angeles-stadium",home: "ESP",away: "BEL",score: {home: 2,away: 1}},
  {no: 99,stage: "qf",date: "2026-07-11",venueId: "miami-stadium",home: "NOR",away: "ENG",score: {home: 1,away: 2},durationMinutes: 120,note: "ENG won after extra time"},
  {no: 100,stage: "qf",date: "2026-07-11",venueId: "kansas-city-stadium",home: "ARG",away: "SUI",score: {home: 3,away: 1},durationMinutes: 120,note: "ARG won after extra time"}
];

// Scorers were reconciled against FIFA's final scores and ESPN's event feed.
const goalsByFixture: Partial<Record<number, GoalSeed[]>> = {
  1: [[9,"MEX","Julián Quiñones"],[67,"MEX","Raúl Jiménez"]],
  2: [[59,"CZE","Ladislav Krejcí"],[67,"KOR","Hwang In-Beom"],[80,"KOR","Oh Hyeon-Gyu"]],
  3: [[21,"BIH","Jovo Lukic"],[78,"CAN","Cyle Larin"]],
  4: [[7,"USA","Damián Bobadilla","Damián Bobadilla scores an own goal."],[31,"USA","Folarin Balogun"],[45,"USA","Folarin Balogun","Folarin Balogun scores in first-half stoppage time."],[73,"PAR","Maurício"],[90,"USA","Giovanni Reyna","Giovanni Reyna scores in second-half stoppage time."]],
  5: [[28,"SCO","John McGinn"]],
  6: [[27,"AUS","Nestory Irankunda"],[75,"AUS","Connor Metcalfe"]],
  7: [[21,"MAR","Ismael Saibari"],[32,"BRA","Vinícius Júnior"]],
  8: [[17,"SUI","Breel Embolo","Breel Embolo scores from the penalty spot."],[90,"QAT","Miro Muheim","Miro Muheim scores an own goal in second-half stoppage time."]],
  9: [[90,"CIV","Amad Diallo"]],
  10: [[6,"GER","Felix Nmecha"],[21,"CUW","Livano Comenencia"],[38,"GER","Nico Schlotterbeck"],[45,"GER","Kai Havertz","Kai Havertz scores from the penalty spot in first-half stoppage time."],[47,"GER","Jamal Musiala"],[68,"GER","Nathaniel Brown"],[78,"GER","Deniz Undav"],[88,"GER","Kai Havertz"]],
  11: [[51,"NED","Virgil van Dijk"],[57,"JPN","Keito Nakamura"],[64,"NED","Crysencio Summerville"],[89,"JPN","Daichi Kamada"]],
  12: [[7,"SWE","Yasin Ayari"],[30,"SWE","Alexander Isak"],[43,"TUN","Omar Rekik"],[59,"SWE","Viktor Gyökeres"],[84,"SWE","Mattias Svanberg"],[90,"SWE","Yasin Ayari","Yasin Ayari scores in second-half stoppage time."]],
  13: [[41,"KSA","Abdulelah Al-Amri"],[80,"URU","Maxi Araújo"]],
  15: [[7,"NZL","Elijah Just"],[32,"IRN","Ramin Rezaeian"],[54,"NZL","Elijah Just"],[64,"IRN","Mohammad Mohebbi"]],
  16: [[20,"EGY","Emam Ashour"],[66,"BEL","Mohamed Hany","Mohamed Hany scores an own goal."]],
  17: [[66,"FRA","Kylian Mbappé"],[82,"FRA","Bradley Barcola"],[90,"SEN","Ibrahim Mbaye","Ibrahim Mbaye scores in second-half stoppage time."],[90,"FRA","Kylian Mbappé","Kylian Mbappé scores in second-half stoppage time."]],
  18: [[29,"NOR","Erling Haaland"],[39,"IRQ","Aymen Hussein"],[43,"NOR","Erling Haaland"],[76,"NOR","Leo Østigard"],[90,"NOR","Aymen Hussein","Aymen Hussein scores an own goal in second-half stoppage time."]],
  19: [[17,"ARG","Lionel Messi"],[60,"ARG","Lionel Messi"],[76,"ARG","Lionel Messi"]],
  20: [[21,"AUT","Romano Schmid"],[50,"JOR","Ali Olwan"],[76,"AUT","Yazan Al-Arab","Yazan Al-Arab scores an own goal."],[90,"AUT","Marko Arnautovic","Marko Arnautovic scores from the penalty spot in second-half stoppage time."]],
  21: [[90,"GHA","Caleb Yirenkyi","Caleb Yirenkyi scores in second-half stoppage time."]],
  22: [[12,"ENG","Harry Kane","Harry Kane scores from the penalty spot."],[36,"CRO","Martin Baturina"],[42,"ENG","Harry Kane"],[45,"CRO","Petar Musa","Petar Musa scores in first-half stoppage time."],[47,"ENG","Jude Bellingham"],[85,"ENG","Marcus Rashford"]],
  23: [[6,"POR","João Neves"],[45,"COD","Yoane Wissa","Yoane Wissa scores in first-half stoppage time."]],
  24: [[40,"COL","Daniel Muñoz"],[60,"UZB","Abbosbek Fayzullaev"],[65,"COL","Luis Díaz"],[90,"COL","Jáminton Campaz","Jáminton Campaz scores in second-half stoppage time."]],
  25: [[6,"CZE","Michal Sadílek"],[83,"RSA","Teboho Mokoena","Teboho Mokoena scores from the penalty spot."]],
  26: [[74,"SUI","Johan Manzambi"],[84,"SUI","Rubén Vargas"],[90,"SUI","Johan Manzambi"],[90,"BIH","Ermin Mahmic","Ermin Mahmic scores in second-half stoppage time."],[90,"SUI","Granit Xhaka","Granit Xhaka scores from the penalty spot in second-half stoppage time."]],
  27: [[16,"CAN","Cyle Larin"],[29,"CAN","Jonathan David"],[45,"CAN","Jonathan David","Jonathan David scores in first-half stoppage time."],[64,"CAN","Nathan Saliba"],[75,"CAN","Mohamed Manai","Mohamed Manai scores an own goal."],[90,"CAN","Jonathan David","Jonathan David scores in second-half stoppage time."]],
  28: [[50,"MEX","Luis Romo"]],
  29: [[23,"BRA","Matheus Cunha"],[36,"BRA","Matheus Cunha"],[45,"BRA","Vinícius Júnior","Vinícius Júnior scores in first-half stoppage time."]],
  30: [[2,"MAR","Ismael Saibari"]],
  31: [[2,"PAR","Matías Galarza"]],
  32: [[11,"USA","Cameron Burgess","Cameron Burgess scores an own goal."],[43,"USA","Alex Freeman"]],
  33: [[30,"CIV","Franck Kessié"],[68,"GER","Deniz Undav"],[90,"GER","Deniz Undav","Deniz Undav scores in second-half stoppage time."]],
  35: [[5,"NED","Brian Brobbey"],[17,"NED","Brian Brobbey"],[47,"NED","Cody Gakpo"],[54,"NED","Cody Gakpo"],[59,"SWE","Anthony Elanga"],[89,"NED","Crysencio Summerville"]],
  36: [[4,"JPN","Daichi Kamada"],[31,"JPN","Ayase Ueda"],[69,"JPN","Junya Ito"],[83,"JPN","Ayase Ueda"]],
  37: [[21,"CPV","Kevin Pina"],[44,"URU","Maxi Araújo"],[45,"URU","Agustín Canobbio","Agustín Canobbio scores in first-half stoppage time."],[61,"CPV","Hélio Varela"]],
  38: [[10,"ESP","Lamine Yamal"],[21,"ESP","Mikel Oyarzabal"],[24,"ESP","Mikel Oyarzabal"],[49,"ESP","Hassan Al-Tambakti","Hassan Al-Tambakti scores an own goal."]],
  40: [[15,"NZL","Finn Surman"],[58,"EGY","Mostafa Zico"],[67,"EGY","Mohamed Salah"],[82,"EGY","Trézéguet"]],
  41: [[43,"NOR","Marcus Holmgren Pedersen"],[48,"NOR","Erling Haaland"],[53,"SEN","Ismaïla Sarr"],[58,"NOR","Erling Haaland"],[90,"SEN","Ismaïla Sarr","Ismaïla Sarr scores in second-half stoppage time."]],
  42: [[14,"FRA","Kylian Mbappé"],[54,"FRA","Kylian Mbappé"],[66,"FRA","Ousmane Dembélé"]],
  43: [[38,"ARG","Lionel Messi"],[90,"ARG","Lionel Messi","Lionel Messi scores in second-half stoppage time."]],
  44: [[36,"JOR","Nizar Al-Rashdan"],[69,"ALG","Nadhir Benbouali"],[82,"ALG","Amine Gouiri"]],
  46: [[54,"CRO","Ante Budimir"]],
  47: [[6,"POR","Cristiano Ronaldo"],[17,"POR","Nuno Mendes"],[39,"POR","Cristiano Ronaldo"],[60,"POR","Abduvohid Nematov","Abduvohid Nematov scores an own goal."],[87,"POR","Rafael Leão"]],
  48: [[76,"COL","Daniel Muñoz"]],
  49: [[7,"BRA","Vinícius Júnior"],[45,"BRA","Vinícius Júnior","Vinícius Júnior scores in first-half stoppage time."],[60,"BRA","Matheus Cunha"]],
  50: [[10,"HAI","Yassine Bounou","Yassine Bounou scores an own goal."],[39,"MAR","Achraf Hakimi"],[43,"HAI","Wilson Isidor"],[45,"MAR","Ismael Saibari","Ismael Saibari scores in first-half stoppage time."],[78,"MAR","Soufiane Rahimi"],[89,"MAR","Gessime Yassine"]],
  51: [[46,"SUI","Rubén Vargas"],[57,"SUI","Johan Manzambi"],[76,"CAN","Promise David"]],
  52: [[29,"BIH","Kerim Alajbegovic"],[34,"BIH","Mahmoud Abunada","Mahmoud Abunada scores an own goal."],[42,"QAT","Hassan Al-Haydos"],[80,"BIH","Ermin Mahmic"]],
  53: [[55,"MEX","Mateo Chávez"],[61,"MEX","Julián Quiñones"],[90,"MEX","Álvaro Fidalgo","Álvaro Fidalgo scores in second-half stoppage time."]],
  54: [[63,"RSA","Thapelo Maseko"]],
  55: [[7,"CIV","Nicolas Pépé"],[64,"CIV","Nicolas Pépé"]],
  56: [[2,"GER","Leroy Sané"],[9,"ECU","Nilson Angulo"],[77,"ECU","Gonzalo Plata"]],
  57: [[56,"JPN","Daizen Maeda"],[62,"SWE","Anthony Elanga"]],
  58: [[3,"NED","Ellyes Skhiri","Ellyes Skhiri scores an own goal."],[7,"NED","Brian Brobbey"],[54,"TUN","Hazem Mastouri"],[62,"NED","Jan Paul van Hecke"]],
  59: [[3,"USA","Auston Trusty"],[10,"TUR","Arda Güler"],[31,"TUR","Baris Alper Yilmaz"],[49,"USA","Sebastian Berhalter"],[90,"TUR","Kaan Ayhan","Kaan Ayhan scores in second-half stoppage time."]],
  61: [[7,"FRA","Ousmane Dembélé"],[20,"FRA","Ousmane Dembélé"],[21,"NOR","Thelo Aasgaard"],[32,"FRA","Ousmane Dembélé"],[90,"FRA","Désiré Doué","Désiré Doué scores in second-half stoppage time."]],
  62: [[4,"SEN","Habib Diarra"],[56,"SEN","Ismaïla Sarr"],[59,"SEN","Pape Gueye"],[71,"SEN","Pape Gueye"],[82,"SEN","Iliman Ndiaye"]],
  63: [[5,"EGY","Mahmoud Saber"],[14,"IRN","Ramin Rezaeian"]],
  64: [[28,"BEL","Leandro Trossard"],[50,"BEL","Leandro Trossard"],[66,"BEL","Kevin De Bruyne"],[84,"NZL","Elijah Just"],[86,"BEL","Romelu Lukaku"],[90,"BEL","Alexis Saelemaekers","Alexis Saelemaekers scores in second-half stoppage time."]],
  66: [[42,"ESP","Álex Baena"]],
  67: [[62,"ENG","Jude Bellingham"],[67,"ENG","Harry Kane"]],
  68: [[31,"CRO","Petar Sucic"],[73,"GHA","Derrick Luckassen"],[83,"CRO","Nikola Vlasic"]],
  69: [[28,"AUT","Marko Arnautovic"],[45,"ALG","Rafik Belghali"],[55,"AUT","Marcel Sabitzer"],[60,"ALG","Riyad Mahrez"],[90,"ALG","Riyad Mahrez","Riyad Mahrez scores in second-half stoppage time."],[90,"AUT","Sasa Kalajdzic","Sasa Kalajdzic scores in second-half stoppage time."]],
  70: [[19,"ARG","Giovani Lo Celso"],[31,"ARG","Lautaro Martínez","Lautaro Martínez scores from the penalty spot."],[55,"JOR","Mousa Al-Tamari"],[80,"ARG","Lionel Messi"]],
  72: [[10,"UZB","Eldor Shomurodov"],[68,"COD","Yoane Wissa","Yoane Wissa scores from the penalty spot."],[78,"COD","Fiston Mayele"],[90,"COD","Yoane Wissa","Yoane Wissa scores in second-half stoppage time."]],
  73: [[90,"CAN","Stephen Eustáquio","Stephen Eustáquio scores in second-half stoppage time."]],
  74: [[42,"PAR","Julio Enciso"],[54,"GER","Kai Havertz"]],
  75: [[72,"NED","Cody Gakpo"],[90,"MAR","Issa Diop","Issa Diop scores in second-half stoppage time."]],
  76: [[29,"JPN","Kaishu Sano"],[56,"BRA","Casemiro"],[90,"BRA","Gabriel Martinelli","Gabriel Martinelli scores in second-half stoppage time."]],
  77: [[45,"FRA","Kylian Mbappé"],[53,"FRA","Bradley Barcola"],[74,"FRA","Kylian Mbappé"]],
  78: [[39,"NOR","Antonio Nusa"],[74,"CIV","Amad Diallo"],[86,"NOR","Erling Haaland"]],
  79: [[22,"MEX","Julián Quiñones"],[31,"MEX","Raúl Jiménez"]],
  80: [[7,"COD","Brian Cipenga"],[75,"ENG","Harry Kane"],[86,"ENG","Harry Kane"]],
  81: [[45,"USA","Folarin Balogun"],[82,"USA","Malik Tillman"]],
  82: [[24,"SEN","Habib Diarra"],[51,"SEN","Ismaïla Sarr"],[86,"BEL","Romelu Lukaku"],[89,"BEL","Youri Tielemans"],[120,"BEL","Youri Tielemans","Youri Tielemans scores from the penalty spot in extra-time stoppage time."]],
  83: [[53,"CRO","Ivan Perisic"],[68,"POR","Cristiano Ronaldo","Cristiano Ronaldo scores from the penalty spot."],[90,"POR","Gonçalo Ramos","Gonçalo Ramos scores in second-half stoppage time."]],
  84: [[36,"ESP","Mikel Oyarzabal"],[66,"ESP","Pedro Porro"],[89,"ESP","Mikel Oyarzabal"]],
  85: [[10,"SUI","Breel Embolo"],[46,"SUI","Dan Ndoye"]],
  86: [[29,"ARG","Lionel Messi"],[59,"CPV","Deroy Duarte"],[92,"ARG","Lisandro Martínez"],[103,"CPV","Sidny Lopes Cabral"],[111,"ARG","Diney Borges","Diney Borges scores an own goal."]],
  87: [[14,"COL","Jhon Arias"]],
  88: [[13,"EGY","Emam Ashour"],[55,"AUS","Mohamed Hany","Mohamed Hany scores an own goal."]],
  89: [[70,"FRA","Kylian Mbappé","Kylian Mbappé scores from the penalty spot."]],
  90: [[50,"MAR","Azzedine Ounahi"],[82,"MAR","Azzedine Ounahi"],[90,"MAR","Soufiane Rahimi","Soufiane Rahimi scores in second-half stoppage time."]],
  91: [[79,"NOR","Erling Haaland"],[90,"NOR","Erling Haaland"],[90,"BRA","Neymar","Neymar scores from the penalty spot in second-half stoppage time."]],
  92: [[36,"ENG","Jude Bellingham"],[38,"ENG","Jude Bellingham"],[42,"MEX","Julián Quiñones"],[60,"ENG","Harry Kane","Harry Kane scores from the penalty spot."],[69,"MEX","Raúl Jiménez","Raúl Jiménez scores from the penalty spot."]],
  93: [[90,"ESP","Mikel Merino","Mikel Merino scores in second-half stoppage time."]],
  94: [[9,"BEL","Charles De Ketelaere"],[31,"USA","Malik Tillman"],[33,"BEL","Charles De Ketelaere"],[57,"BEL","Hans Vanaken"],[90,"BEL","Romelu Lukaku","Romelu Lukaku scores in second-half stoppage time."]],
  95: [[15,"EGY","Yasser Ibrahim"],[67,"EGY","Mostafa Zico"],[79,"ARG","Cristian Romero"],[83,"ARG","Lionel Messi"],[90,"ARG","Enzo Fernández","Enzo Fernández scores in second-half stoppage time."]],
  97: [[60,"FRA","Kylian Mbappé"],[66,"FRA","Ousmane Dembélé"]],
  98: [[30,"ESP","Fabián Ruiz"],[41,"BEL","Charles De Ketelaere"],[88,"ESP","Mikel Merino"]],
  99: [[36,"NOR","Andreas Schjelderup"],[45,"ENG","Jude Bellingham","Jude Bellingham scores in first-half stoppage time."],[93,"ENG","Jude Bellingham"]],
  100: [[10,"ARG","Alexis Mac Allister"],[67,"SUI","Dan Ndoye"],[112,"ARG","Julián Álvarez"],[120,"ARG","Lautaro Martínez","Lautaro Martínez scores in extra-time stoppage time."]]
};

type YouTubeHighlightSeed = { videoId: string; sourceName: string };

// Exact-match videos are added only after YouTube confirms that they are
// available to the embedded player for the app origin.
const youtubeHighlightsByFixture: Partial<Record<number, YouTubeHighlightSeed>> = {
  1: { videoId: "GahjL626OuI", sourceName: "SportyTV highlights" },
  2: { videoId: "Nd2l28loYAA", sourceName: "SuperSport highlights" },
  3: { videoId: "9Q-m9UF1GwQ", sourceName: "SportyTV highlights" },
  4: { videoId: "ybEiVnWkNkM", sourceName: "SuperSport highlights" },
  5: { videoId: "ZBcbMhS5Vlo", sourceName: "SuperSport highlights" },
  6: { videoId: "5lle4fnJllU", sourceName: "SuperSport highlights" },
  7: { videoId: "s37A0e1aOpY", sourceName: "SportyTV highlights" },
  8: { videoId: "NdpisX7kaG0", sourceName: "SuperSport highlights" },
  9: { videoId: "zIHIHjdr1Dg", sourceName: "SportyTV highlights" },
  10: { videoId: "JjLgo8SQ6_s", sourceName: "SuperSport highlights" },
  11: { videoId: "4coSHOC82Gc", sourceName: "SuperSport highlights" },
  12: { videoId: "mpxDX1bC7gw", sourceName: "SuperSport highlights" },
  13: { videoId: "RQTYII_E1Nk", sourceName: "SuperSport highlights" },
  14: { videoId: "BWC0vtUAHfs", sourceName: "SportyTV highlights" },
  15: { videoId: "sY-NxVW2VSY", sourceName: "SuperSport highlights" },
  16: { videoId: "_jG_S5BnB3M", sourceName: "SuperSport highlights" },
  17: { videoId: "dV6hDx12Qic", sourceName: "SportyTV highlights" },
  18: { videoId: "iGSvIXNthQ0", sourceName: "SuperSport highlights" },
  19: { videoId: "KGzqrMVKa-U", sourceName: "SuperSport highlights" },
  20: { videoId: "0wP_ZBUHlD8", sourceName: "SuperSport highlights" },
  21: { videoId: "NgQ7lXowKjI", sourceName: "SuperSport highlights" },
  22: { videoId: "GDieIfkT1FQ", sourceName: "SuperSport highlights" },
  23: { videoId: "iMN2p_Gy1V0", sourceName: "SuperSport highlights" },
  24: { videoId: "Gim28zQg5Es", sourceName: "SuperSport highlights" },
  25: { videoId: "xI81p-_2NfY", sourceName: "SportyTV highlights" },
  26: { videoId: "5R8-1UxMUaw", sourceName: "SuperSport highlights" },
  27: { videoId: "4OLvSoGWM9I", sourceName: "World Football Daily highlights" },
  28: { videoId: "nbkm8qSShVU", sourceName: "SuperSport highlights" },
  29: { videoId: "HztAk3giVJY", sourceName: "SuperSport highlights" },
  30: { videoId: "QScpSx0Cbqs", sourceName: "SuperSport highlights" },
  31: { videoId: "6FdI8YNwl3E", sourceName: "SuperSport highlights" },
  32: { videoId: "xI2cMSeW8II", sourceName: "SportyTV highlights" },
  33: { videoId: "5uw4HzpvbLI", sourceName: "SportyTV highlights" },
  34: { videoId: "ZWNque1kTSY", sourceName: "SuperSport highlights" },
  35: { videoId: "kSwefy1Jd8U", sourceName: "SuperSport highlights" },
  36: { videoId: "AIMzV_En-18", sourceName: "SuperSport highlights" },
  37: { videoId: "1f3xq2W61LI", sourceName: "SportyTV highlights" },
  38: { videoId: "KyGPEn2sd80", sourceName: "SuperSport highlights" },
  39: { videoId: "An1521luK5E", sourceName: "SuperSport highlights" },
  40: { videoId: "MFkr48nuEzQ", sourceName: "SuperSport highlights" },
  41: { videoId: "iobxE6t_Kd4", sourceName: "SuperSport highlights" },
  42: { videoId: "9OcsakleEBc", sourceName: "SuperSport highlights" },
  43: { videoId: "7p5jXecDbxI", sourceName: "SuperSport highlights" },
  44: { videoId: "nBFGoM60bRw", sourceName: "SuperSport highlights" },
  45: { videoId: "msKWTwC2hc8", sourceName: "SportyTV highlights" },
  46: { videoId: "IV1BFpYR-Eo", sourceName: "SuperSport highlights" },
  47: { videoId: "naWy-ePQHhk", sourceName: "SuperSport highlights" },
  48: { videoId: "1G0pNGItTZY", sourceName: "SuperSport highlights" },
  49: { videoId: "QIyB1ZdJu3Y", sourceName: "SuperSport highlights" },
  50: { videoId: "ecYLm64VETo", sourceName: "SuperSport highlights" },
  51: { videoId: "ouPMpJDQvUA", sourceName: "SuperSport highlights" },
  52: { videoId: "DF0Mebsh2cA", sourceName: "SuperSport highlights" },
  53: { videoId: "hfG1HyjN-do", sourceName: "SuperSport highlights" },
  54: { videoId: "pjqzeBUm8Yw", sourceName: "SportyTV highlights" },
  55: { videoId: "zwOlSEtQuNc", sourceName: "SportyTV highlights" },
  56: { videoId: "A7kSShFNK0Q", sourceName: "SuperSport highlights" },
  57: { videoId: "o-3F-YCjp8U", sourceName: "SuperSport highlights" },
  58: { videoId: "Y6LZxOHULtI", sourceName: "SuperSport highlights" },
  59: { videoId: "ddWUwhlbj0M", sourceName: "SuperSport highlights" },
  60: { videoId: "k8ZwowCVGqk", sourceName: "SuperSport highlights" },
  61: { videoId: "CMKhozeTjlw", sourceName: "SuperSport highlights" },
  62: { videoId: "JL0CElFX3nQ", sourceName: "SportyTV highlights" },
  63: { videoId: "Dc9rfnTEq0A", sourceName: "SuperSport highlights" },
  64: { videoId: "L7e201UuI10", sourceName: "SuperSport highlights" },
  65: { videoId: "N4IMVp_weCE", sourceName: "SuperSport highlights" },
  66: { videoId: "H0-383gimFs", sourceName: "SuperSport highlights" },
  67: { videoId: "4KP2e2EV8dU", sourceName: "SuperSport highlights" },
  68: { videoId: "noBTSqOdj_A", sourceName: "SportyTV highlights" },
  69: { videoId: "t92Q_KzIiEc", sourceName: "SuperSport highlights" },
  70: { videoId: "VSZATo-XlUA", sourceName: "SuperSport highlights" },
  71: { videoId: "WRw6B3YxBZQ", sourceName: "SuperSport highlights" },
  72: { videoId: "ibipn1mHVFU", sourceName: "SuperSport highlights" },
  73: { videoId: "tsNoqzr-vpM", sourceName: "SportyTV highlights" },
  74: { videoId: "csTVE1KcZLg", sourceName: "SuperSport highlights" },
  75: { videoId: "u1ck_AE6X5Y", sourceName: "SuperSport highlights" },
  76: { videoId: "32V4j55SW_Q", sourceName: "SportyTV highlights" },
  77: { videoId: "fkBFvFkYF9E", sourceName: "SuperSport highlights" },
  78: { videoId: "PDd4rEqD_ko", sourceName: "SportyTV highlights" },
  79: { videoId: "qldiNqY3hn8", sourceName: "SuperSport highlights" },
  80: { videoId: "FRNABgDqP7o", sourceName: "SportyTV highlights" },
  81: { videoId: "x4W2WglaLWs", sourceName: "SuperSport highlights" },
  82: { videoId: "GdFwMdYiK6M", sourceName: "SuperSport highlights" },
  83: { videoId: "RKpB0vRAv9g", sourceName: "SuperSport highlights" },
  84: { videoId: "mSE8qSG89Rw", sourceName: "SuperSport highlights" },
  85: { videoId: "wbX2y6lIxFA", sourceName: "SuperSport highlights" },
  86: { videoId: "unWVVqUU6ZU", sourceName: "SportyTV highlights" },
  87: { videoId: "2Lw8B3RwITw", sourceName: "SuperSport highlights" },
  88: { videoId: "fQQiFDQiLg0", sourceName: "SuperSport highlights" },
  89: { videoId: "AWgtzp8DxEY", sourceName: "SuperSport highlights" },
  90: { videoId: "EzXzRXlzqVU", sourceName: "SportyTV highlights" },
  91: { videoId: "mGTQmy_ZcW4", sourceName: "SportyTV highlights" },
  92: { videoId: "QNSwOSH8KXk", sourceName: "SuperSport highlights" },
  93: { videoId: "S_wLPi4OCQk", sourceName: "SportyTV highlights" },
  94: { videoId: "Gq9ILhysbgQ", sourceName: "SuperSport highlights" },
  95: { videoId: "Wvi8z3ONZqg", sourceName: "SportyTV highlights" },
  96: { videoId: "XV5IDIdHqaE", sourceName: "SuperSport highlights" },
  97: { videoId: "ZqGGhUzcLzk", sourceName: "SportyTV highlights" },
  98: { videoId: "K2nfTNF8S8U", sourceName: "SportyTV highlights" },
  99: { videoId: "wUVdLLxKwN0", sourceName: "SportyTV highlights" },
  100: { videoId: "JZmfJSUROsg", sourceName: "SuperSport highlights" },
};

const fifaMatchIdsByFixture: Record<number, string> = {
  1: "400021443",
  2: "400021441",
  3: "400021449",
  4: "400021458",
  5: "400021453",
  6: "400021463",
  7: "400021456",
  8: "400021447",
  9: "400021467",
  10: "400021464",
  11: "400021470",
  12: "400021474",
  13: "400021486",
  14: "400021482",
  15: "400021476",
  16: "400021478",
  17: "400021490",
  18: "400021488",
  19: "400021496",
  20: "400021498",
  21: "400021510",
  22: "400021507",
  23: "400021502",
  24: "400021504",
  25: "400021440",
  26: "400021446",
  27: "400021450",
  28: "400021442",
  29: "400021457",
  30: "400021454",
  31: "400021460",
  32: "400021462",
  33: "400021469",
  34: "400021465",
  35: "400021472",
  36: "400021475",
  37: "400021487",
  38: "400021483",
  39: "400021477",
  40: "400021480",
  41: "400021491",
  42: "400021492",
  43: "400021494",
  44: "400021499",
  45: "400021506",
  46: "400021511",
  47: "400021503",
  48: "400021501",
  49: "400021455",
  50: "400021452",
  51: "400021451",
  52: "400021448",
  53: "400021444",
  54: "400021445",
  55: "400021468",
  56: "400021466",
  57: "400021471",
  58: "400021473",
  59: "400021459",
  60: "400021461",
  61: "400021489",
  62: "400021493",
  63: "400021479",
  64: "400021481",
  65: "400021485",
  66: "400021484",
  67: "400021508",
  68: "400021509",
  69: "400021497",
  70: "400021495",
  71: "400021505",
  72: "400021500",
  73: "400021518",
  74: "400021513",
  75: "400021522",
  76: "400021516",
  77: "400021523",
  78: "400021514",
  79: "400021520",
  80: "400021512",
  81: "400021524",
  82: "400021525",
  83: "400021526",
  84: "400021519",
  85: "400021527",
  86: "400021521",
  87: "400021517",
  88: "400021515",
  89: "400021533",
  90: "400021530",
  91: "400021532",
  92: "400021531",
  93: "400021529",
  94: "400021534",
  95: "400021528",
  96: "400021535",
  97: "400021536",
  98: "400021538",
  99: "400021539",
  100: "400021537"
};

const fifaStageIds: Record<Match["stage"], string> = {
  group: "289273",
  group2: "",
  r32: "289287",
  r16: "289288",
  qf: "289289",
  sf: "289290",
  third: "289291",
  final: "289292"
};

function getFifaMatchUrl(fixture: FixtureSeed) {
  return `https://www.fifa.com/en/match-centre/match/17/285023/${fifaStageIds[fixture.stage]}/${fifaMatchIdsByFixture[fixture.no]}?date=${fixture.date}`;
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
  const officialUrl = getFifaMatchUrl(fixture);
  const youtube = youtubeHighlightsByFixture[fixture.no];
  const highlights = youtube
    ? createYoutubeHighlight(youtube.videoId, officialUrl, youtube.sourceName)
    : createOfficialReportHighlight(officialUrl);
  return {
    id: `wc-2026-${String(fixture.no).padStart(3, "0")}-${fixture.home.toLowerCase()}-${fixture.away.toLowerCase()}`,
    tournamentId: "wc-2026",
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

export const worldCup2026: Tournament = {
  id: "wc-2026",
  competition: "WORLD_CUP",
  name: "Canada, Mexico & USA 2026",
  year: 2026,
  hosts: ["CAN", "MEX", "USA"],
  teams: worldCup2026Groups.flatMap((group) => group.teams),
  groups: worldCup2026Groups,
  teamCoordinates: worldCup2026TeamCoordinates,
  format: worldCup2026Format,
  stages: ["group", "r32", "r16", "qf"],
  status: "partial",
  mapView: { center: [-100, 38], zoom: 2.45, bearing: 0, pitch: 28 },
  venues,
  featuredRoute: venues.map((venue) => venue.id),
  matches
};
