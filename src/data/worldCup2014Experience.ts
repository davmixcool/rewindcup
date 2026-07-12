import type { Coordinates, TeamCode, TournamentFormat, TournamentGroup } from "@/lib/types";

export const worldCup2014Groups = [
  { id: "A", teams: ["BRA", "CRO", "MEX", "CMR"] },
  { id: "B", teams: ["ESP", "NED", "CHI", "AUS"] },
  { id: "C", teams: ["COL", "GRE", "CIV", "JPN"] },
  { id: "D", teams: ["URU", "CRC", "ENG", "ITA"] },
  { id: "E", teams: ["SUI", "ECU", "FRA", "HON"] },
  { id: "F", teams: ["ARG", "BIH", "IRN", "NGA"] },
  { id: "G", teams: ["GER", "POR", "GHA", "USA"] },
  { id: "H", teams: ["BEL", "ALG", "RUS", "KOR"] }
] satisfies TournamentGroup[];

export const worldCup2014TeamCoordinates: Partial<Record<TeamCode, Coordinates>> = {
  ALG: [3.0588, 36.7538],
  ARG: [-58.3816, -34.6037],
  AUS: [149.13, -35.2809],
  BEL: [4.3517, 50.8503],
  BIH: [18.4131, 43.8563],
  BRA: [-47.8825, -15.7942],
  CHI: [-70.6693, -33.4489],
  CIV: [-5.2893, 6.8276],
  CMR: [11.5021, 3.848],
  COL: [-74.0721, 4.711],
  CRC: [-84.0907, 9.9281],
  CRO: [15.9819, 45.815],
  ECU: [-78.4678, -0.1807],
  ENG: [-0.1276, 51.5072],
  ESP: [-3.7038, 40.4168],
  FRA: [2.3522, 48.8566],
  GER: [13.405, 52.52],
  GHA: [-0.187, 5.6037],
  GRE: [23.7275, 37.9838],
  HON: [-87.2068, 14.0723],
  IRN: [51.389, 35.6892],
  ITA: [12.4964, 41.9028],
  JPN: [139.6917, 35.6895],
  KOR: [126.978, 37.5665],
  MEX: [-99.1332, 19.4326],
  NED: [4.9041, 52.3676],
  NGA: [7.3986, 9.0765],
  POR: [-9.1393, 38.7223],
  RUS: [37.6173, 55.7558],
  SUI: [7.4474, 46.948],
  URU: [-56.1645, -34.9011],
  USA: [-77.0369, 38.9072]
};

export const worldCup2014Format = {
  expectedGoalCount: 171,
  expectedMatchCount: 64,
  expectedVenueCount: 12,
  groupMatchesPerTeam: 3
} satisfies TournamentFormat;
