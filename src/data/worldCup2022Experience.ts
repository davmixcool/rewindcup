import type { Coordinates, TeamCode, TournamentFormat, TournamentGroup } from "@/lib/types";

export const worldCup2022Groups = [
  { id: "A", teams: ["QAT", "ECU", "SEN", "NED"] },
  { id: "B", teams: ["ENG", "IRN", "USA", "WAL"] },
  { id: "C", teams: ["ARG", "KSA", "MEX", "POL"] },
  { id: "D", teams: ["FRA", "AUS", "DEN", "TUN"] },
  { id: "E", teams: ["ESP", "CRC", "GER", "JPN"] },
  { id: "F", teams: ["BEL", "CAN", "MAR", "CRO"] },
  { id: "G", teams: ["BRA", "SRB", "SUI", "CMR"] },
  { id: "H", teams: ["POR", "GHA", "URU", "KOR"] }
] satisfies TournamentGroup[];

export const worldCup2022TeamCoordinates: Partial<Record<TeamCode, Coordinates>> = {
  ARG: [-58.3816, -34.6037], AUS: [149.13, -35.2809], BEL: [4.3517, 50.8503],
  BRA: [-47.8825, -15.7942], CAN: [-75.6972, 45.4215], CMR: [11.5021, 3.848],
  CRC: [-84.0907, 9.9281], CRO: [15.9819, 45.815], DEN: [12.5683, 55.6761],
  ECU: [-78.4678, -0.1807], ENG: [-0.1276, 51.5072], ESP: [-3.7038, 40.4168],
  FRA: [2.3522, 48.8566], GER: [13.405, 52.52], GHA: [-0.187, 5.6037],
  IRN: [51.389, 35.6892], JPN: [139.6917, 35.6895], KOR: [126.978, 37.5665],
  KSA: [46.6753, 24.7136], MAR: [-6.8498, 34.0209], MEX: [-99.1332, 19.4326],
  NED: [4.9041, 52.3676], POL: [21.0122, 52.2297], POR: [-9.1393, 38.7223],
  QAT: [51.531, 25.2854], SEN: [-17.4677, 14.7167], SRB: [20.4489, 44.7866],
  SUI: [7.4474, 46.948], TUN: [10.1815, 36.8065], URU: [-56.1645, -34.9011],
  USA: [-77.0369, 38.9072], WAL: [-3.1791, 51.4816]
};

export const worldCup2022Format = {
  expectedGoalCount: 172,
  expectedMatchCount: 64,
  expectedVenueCount: 8,
  groupMatchesPerTeam: 3
} satisfies TournamentFormat;
