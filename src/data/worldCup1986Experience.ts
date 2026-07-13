import type { Coordinates, TeamCode, TournamentFormat, TournamentGroup } from "@/lib/types";

export const worldCup1986Groups = [
  { id: "A", teams: ["ARG", "ITA", "BUL", "KOR"] },
  { id: "B", teams: ["MEX", "PAR", "BEL", "IRQ"] },
  { id: "C", teams: ["URS", "FRA", "HUN", "CAN"] },
  { id: "D", teams: ["BRA", "ESP", "NIR", "ALG"] },
  { id: "E", teams: ["DEN", "GER", "URU", "SCO"] },
  { id: "F", teams: ["MAR", "ENG", "POL", "POR"] }
] satisfies TournamentGroup[];

export const worldCup1986TeamCoordinates: Partial<Record<TeamCode, Coordinates>> = {
  ALG: [3.0588, 36.7538],
  ARG: [-58.3816, -34.6037],
  BEL: [4.3517, 50.8503],
  BRA: [-47.8825, -15.7942],
  BUL: [23.3219, 42.6977],
  CAN: [-75.6972, 45.4215],
  DEN: [12.5683, 55.6761],
  ENG: [-0.1276, 51.5072],
  ESP: [-3.7038, 40.4168],
  FRA: [2.3522, 48.8566],
  GER: [13.405, 52.52],
  HUN: [19.0402, 47.4979],
  IRQ: [44.3661, 33.3152],
  ITA: [12.4964, 41.9028],
  KOR: [126.978, 37.5665],
  MAR: [-6.8498, 34.0209],
  MEX: [-99.1332, 19.4326],
  NIR: [-5.9301, 54.5973],
  PAR: [-57.5759, -25.2637],
  POL: [21.0122, 52.2297],
  POR: [-9.1393, 38.7223],
  SCO: [-3.1883, 55.9533],
  URS: [37.6173, 55.7558],
  URU: [-56.1645, -34.9011]
};

export const worldCup1986Format = {
  expectedGoalCount: 132,
  expectedMatchCount: 52,
  expectedVenueCount: 12,
  groupMatchesPerTeam: 3
} satisfies TournamentFormat;
