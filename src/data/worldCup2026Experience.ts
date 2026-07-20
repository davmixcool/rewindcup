import type { Coordinates, TeamCode, TournamentFormat, TournamentGroup } from "@/lib/types";

export const worldCup2026Groups = [
  { id: "A", teams: ["MEX", "RSA", "KOR", "CZE"] },
  { id: "B", teams: ["CAN", "BIH", "QAT", "SUI"] },
  { id: "C", teams: ["BRA", "MAR", "HAI", "SCO"] },
  { id: "D", teams: ["USA", "PAR", "AUS", "TUR"] },
  { id: "E", teams: ["GER", "CUW", "CIV", "ECU"] },
  { id: "F", teams: ["NED", "JPN", "SWE", "TUN"] },
  { id: "G", teams: ["BEL", "EGY", "IRN", "NZL"] },
  { id: "H", teams: ["ESP", "CPV", "KSA", "URU"] },
  { id: "I", teams: ["FRA", "SEN", "IRQ", "NOR"] },
  { id: "J", teams: ["ARG", "ALG", "AUT", "JOR"] },
  { id: "K", teams: ["POR", "COD", "UZB", "COL"] },
  { id: "L", teams: ["ENG", "CRO", "GHA", "PAN"] }
] satisfies TournamentGroup[];

export const worldCup2026TeamCoordinates: Partial<Record<TeamCode, Coordinates>> = {
  ALG: [3.0588, 36.7538], ARG: [-58.3816, -34.6037], AUS: [149.13, -35.2809],
  AUT: [16.3738, 48.2082], BEL: [4.3517, 50.8503], BIH: [18.4131, 43.8563],
  BRA: [-47.8825, -15.7942], CAN: [-75.6972, 45.4215], CIV: [-4.0083, 5.36],
  COD: [15.2663, -4.4419], COL: [-74.0721, 4.711], CPV: [-23.5133, 14.933],
  CRO: [15.9819, 45.815], CUW: [-68.99, 12.1696], CZE: [14.4378, 50.0755],
  ECU: [-78.4678, -0.1807], EGY: [31.2357, 30.0444], ENG: [-0.1276, 51.5072],
  ESP: [-3.7038, 40.4168], FRA: [2.3522, 48.8566], GER: [13.405, 52.52],
  GHA: [-0.187, 5.6037], HAI: [-72.3074, 18.5944], IRN: [51.389, 35.6892],
  IRQ: [44.3661, 33.3152], JOR: [35.9106, 31.9539], JPN: [139.6917, 35.6895],
  KOR: [126.978, 37.5665], KSA: [46.6753, 24.7136], MAR: [-6.8498, 34.0209],
  MEX: [-99.1332, 19.4326], NED: [4.9041, 52.3676], NOR: [10.7522, 59.9139],
  NZL: [174.7762, -41.2866], PAN: [-79.5199, 8.9824], PAR: [-57.5759, -25.2637],
  POR: [-9.1393, 38.7223], QAT: [51.531, 25.2854], RSA: [28.0473, -26.2041],
  SCO: [-3.1883, 55.9533], SEN: [-17.4677, 14.7167], SUI: [7.4474, 46.948],
  SWE: [18.0686, 59.3293], TUN: [10.1815, 36.8065], TUR: [32.8597, 39.9334],
  URU: [-56.1645, -34.9011], USA: [-77.0369, 38.9072], UZB: [69.2401, 41.2995]
};

export const worldCup2026Format = {
  expectedGoalCount: 308,
  expectedMatchCount: 104,
  expectedVenueCount: 16,
  groupMatchesPerTeam: 3
} satisfies TournamentFormat;
