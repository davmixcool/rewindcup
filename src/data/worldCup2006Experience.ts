import type { Coordinates, TeamCode, TournamentFormat, TournamentGroup } from "@/lib/types";

export const worldCup2006Groups = [
  { id: "A", teams: ["GER", "CRC", "POL", "ECU"] },
  { id: "B", teams: ["ENG", "PAR", "TRI", "SWE"] },
  { id: "C", teams: ["ARG", "CIV", "SCG", "NED"] },
  { id: "D", teams: ["MEX", "IRN", "ANG", "POR"] },
  { id: "E", teams: ["ITA", "GHA", "USA", "CZE"] },
  { id: "F", teams: ["BRA", "CRO", "AUS", "JPN"] },
  { id: "G", teams: ["FRA", "SUI", "KOR", "TOG"] },
  { id: "H", teams: ["ESP", "UKR", "TUN", "KSA"] }
] satisfies TournamentGroup[];

export const worldCup2006TeamCoordinates: Partial<Record<TeamCode, Coordinates>> = {
  ANG: [13.2344, -8.8383],
  ARG: [-58.3816, -34.6037],
  AUS: [149.13, -35.2809],
  BRA: [-47.8825, -15.7942],
  CIV: [-5.2893, 6.8276],
  CRC: [-84.0907, 9.9281],
  CRO: [15.9819, 45.815],
  CZE: [14.4378, 50.0755],
  ECU: [-78.4678, -0.1807],
  ENG: [-0.1276, 51.5072],
  ESP: [-3.7038, 40.4168],
  FRA: [2.3522, 48.8566],
  GER: [13.405, 52.52],
  GHA: [-0.187, 5.6037],
  IRN: [51.389, 35.6892],
  ITA: [12.4964, 41.9028],
  JPN: [139.6917, 35.6895],
  KOR: [126.978, 37.5665],
  KSA: [46.6753, 24.7136],
  MEX: [-99.1332, 19.4326],
  NED: [4.9041, 52.3676],
  PAR: [-57.5759, -25.2637],
  POL: [21.0122, 52.2297],
  POR: [-9.1393, 38.7223],
  SCG: [20.4489, 44.7866],
  SUI: [7.4474, 46.948],
  SWE: [18.0686, 59.3293],
  TOG: [1.2228, 6.1256],
  TRI: [-61.519, 10.6549],
  TUN: [10.1815, 36.8065],
  UKR: [30.5234, 50.4501],
  USA: [-77.0369, 38.9072]
};

export const worldCup2006Format = {
  expectedMatchCount: 64,
  expectedVenueCount: 12,
  groupMatchesPerTeam: 3
} satisfies TournamentFormat;
