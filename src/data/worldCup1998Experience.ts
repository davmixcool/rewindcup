import type { Coordinates, TeamCode, TournamentFormat, TournamentGroup } from "@/lib/types";

export const worldCup1998Groups = [
  { id: "A", teams: ["BRA", "SCO", "MAR", "NOR"] },
  { id: "B", teams: ["ITA", "CHI", "CMR", "AUT"] },
  { id: "C", teams: ["FRA", "RSA", "KSA", "DEN"] },
  { id: "D", teams: ["ESP", "NGA", "PAR", "BUL"] },
  { id: "E", teams: ["NED", "BEL", "KOR", "MEX"] },
  { id: "F", teams: ["GER", "USA", "YUG", "IRN"] },
  { id: "G", teams: ["ROU", "COL", "ENG", "TUN"] },
  { id: "H", teams: ["ARG", "JPN", "JAM", "CRO"] }
] satisfies TournamentGroup[];

export const worldCup1998TeamCoordinates: Partial<Record<TeamCode, Coordinates>> = {
  ARG: [-58.3816, -34.6037],
  AUT: [16.3738, 48.2082],
  BEL: [4.3517, 50.8503],
  BUL: [23.3219, 42.6977],
  BRA: [-47.8825, -15.7942],
  CHI: [-70.6693, -33.4489],
  CMR: [11.5021, 3.848],
  COL: [-74.0721, 4.711],
  CRO: [15.9819, 45.815],
  DEN: [12.5683, 55.6761],
  ENG: [-0.1276, 51.5072],
  ESP: [-3.7038, 40.4168],
  FRA: [2.3522, 48.8566],
  GER: [13.405, 52.52],
  IRN: [51.389, 35.6892],
  ITA: [12.4964, 41.9028],
  JAM: [-76.7936, 17.9712],
  JPN: [139.6917, 35.6895],
  KOR: [126.978, 37.5665],
  KSA: [46.6753, 24.7136],
  MAR: [-6.8498, 34.0209],
  MEX: [-99.1332, 19.4326],
  NED: [4.9041, 52.3676],
  NGA: [7.3986, 9.0765],
  NOR: [10.7522, 59.9139],
  PAR: [-57.5759, -25.2637],
  ROU: [26.1025, 44.4268],
  RSA: [28.0473, -26.2041],
  SCO: [-3.1883, 55.9533],
  TUN: [10.1815, 36.8065],
  USA: [-77.0369, 38.9072],
  YUG: [20.4489, 44.7866]
};

export const worldCup1998Format = {
  expectedGoalCount: 171,
  expectedMatchCount: 64,
  expectedVenueCount: 10,
  groupMatchesPerTeam: 3
} satisfies TournamentFormat;
