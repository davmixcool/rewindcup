import type { Coordinates, TeamCode, TournamentFormat, TournamentGroup } from "@/lib/types";

export const worldCup2018Groups = [
  { id: "A", teams: ["RUS", "KSA", "EGY", "URU"] },
  { id: "B", teams: ["POR", "ESP", "MAR", "IRN"] },
  { id: "C", teams: ["FRA", "AUS", "PER", "DEN"] },
  { id: "D", teams: ["ARG", "ISL", "CRO", "NGA"] },
  { id: "E", teams: ["BRA", "SUI", "CRC", "SRB"] },
  { id: "F", teams: ["GER", "MEX", "SWE", "KOR"] },
  { id: "G", teams: ["BEL", "PAN", "TUN", "ENG"] },
  { id: "H", teams: ["POL", "SEN", "COL", "JPN"] }
] satisfies TournamentGroup[];

export const worldCup2018TeamCoordinates: Partial<Record<TeamCode, Coordinates>> = {
  ARG: [-58.3816, -34.6037], AUS: [149.13, -35.2809], BEL: [4.3517, 50.8503],
  BRA: [-47.8825, -15.7942], COL: [-74.0721, 4.711], CRC: [-84.0907, 9.9281],
  CRO: [15.9819, 45.815], DEN: [12.5683, 55.6761], EGY: [31.2357, 30.0444],
  ENG: [-0.1276, 51.5072], ESP: [-3.7038, 40.4168], FRA: [2.3522, 48.8566],
  GER: [13.405, 52.52], IRN: [51.389, 35.6892], ISL: [-21.9426, 64.1466],
  JPN: [139.6917, 35.6895], KOR: [126.978, 37.5665], KSA: [46.6753, 24.7136],
  MAR: [-6.8498, 34.0209], MEX: [-99.1332, 19.4326], NGA: [7.3986, 9.0765],
  PAN: [-79.5199, 8.9824], PER: [-77.0428, -12.0464], POL: [21.0122, 52.2297],
  POR: [-9.1393, 38.7223], RUS: [37.6173, 55.7558], SEN: [-17.4677, 14.7167],
  SRB: [20.4489, 44.7866], SUI: [7.4474, 46.948], SWE: [18.0686, 59.3293],
  TUN: [10.1815, 36.8065], URU: [-56.1645, -34.9011]
};

export const worldCup2018Format = {
  expectedGoalCount: 169,
  expectedMatchCount: 64,
  expectedVenueCount: 12,
  groupMatchesPerTeam: 3
} satisfies TournamentFormat;
