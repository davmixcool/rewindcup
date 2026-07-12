import type { Coordinates, TeamCode, TournamentFormat, TournamentGroup } from "@/lib/types";

export const worldCup2010Groups = [
  { id: "A", teams: ["RSA", "MEX", "URU", "FRA"] },
  { id: "B", teams: ["ARG", "NGA", "KOR", "GRE"] },
  { id: "C", teams: ["ENG", "USA", "ALG", "SVN"] },
  { id: "D", teams: ["GER", "AUS", "SRB", "GHA"] },
  { id: "E", teams: ["NED", "DEN", "JPN", "CMR"] },
  { id: "F", teams: ["ITA", "PAR", "NZL", "SVK"] },
  { id: "G", teams: ["BRA", "PRK", "CIV", "POR"] },
  { id: "H", teams: ["ESP", "SUI", "HON", "CHI"] }
] satisfies TournamentGroup[];

export const worldCup2010TeamCoordinates: Partial<Record<TeamCode, Coordinates>> = {
  ALG: [3.0588, 36.7538],
  ARG: [-58.3816, -34.6037],
  AUS: [149.13, -35.2809],
  BRA: [-47.8825, -15.7942],
  CHI: [-70.6693, -33.4489],
  CIV: [-5.2893, 6.8276],
  CMR: [11.5021, 3.848],
  DEN: [12.5683, 55.6761],
  ENG: [-0.1276, 51.5072],
  ESP: [-3.7038, 40.4168],
  FRA: [2.3522, 48.8566],
  GER: [13.405, 52.52],
  GHA: [-0.187, 5.6037],
  GRE: [23.7275, 37.9838],
  HON: [-87.2068, 14.0723],
  ITA: [12.4964, 41.9028],
  JPN: [139.6917, 35.6895],
  KOR: [126.978, 37.5665],
  MEX: [-99.1332, 19.4326],
  NED: [4.9041, 52.3676],
  NGA: [7.3986, 9.0765],
  NZL: [174.7762, -41.2865],
  PAR: [-57.5759, -25.2637],
  POR: [-9.1393, 38.7223],
  PRK: [125.7625, 39.0392],
  RSA: [28.2293, -25.7479],
  SRB: [20.4489, 44.7866],
  SUI: [7.4474, 46.948],
  SVK: [17.1077, 48.1486],
  SVN: [14.5058, 46.0569],
  URU: [-56.1645, -34.9011],
  USA: [-77.0369, 38.9072]
};

export const worldCup2010Format = {
  expectedGoalCount: 145,
  expectedMatchCount: 64,
  expectedVenueCount: 10,
  groupMatchesPerTeam: 3
} satisfies TournamentFormat;
