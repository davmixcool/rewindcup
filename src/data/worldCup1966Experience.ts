import type { Coordinates, TeamCode, TournamentFormat, TournamentGroup } from "@/lib/types";

export const worldCup1966Groups = [
  { id: "1", teams: ["ENG", "URU", "MEX", "FRA"] },
  { id: "2", teams: ["GER", "ARG", "ESP", "SUI"] },
  { id: "3", teams: ["POR", "HUN", "BRA", "BUL"] },
  { id: "4", teams: ["URS", "PRK", "ITA", "CHI"] }
] satisfies TournamentGroup[];

export const worldCup1966TeamCoordinates: Partial<Record<TeamCode, Coordinates>> = {
  ARG: [-58.3816, -34.6037],
  BRA: [-47.8825, -15.7942],
  BUL: [23.3219, 42.6977],
  CHI: [-70.6693, -33.4489],
  ENG: [-0.1276, 51.5072],
  ESP: [-3.7038, 40.4168],
  FRA: [2.3522, 48.8566],
  GER: [7.0982, 50.7374],
  HUN: [19.0402, 47.4979],
  ITA: [12.4964, 41.9028],
  MEX: [-99.1332, 19.4326],
  POR: [-9.1393, 38.7223],
  PRK: [125.7625, 39.0392],
  SUI: [7.4474, 46.948],
  URU: [-56.1645, -34.9011],
  URS: [37.6173, 55.7558]
};

export const worldCup1966Format = {
  expectedGoalCount: 89,
  expectedMatchCount: 32,
  expectedVenueCount: 8,
  groupMatchesPerTeam: 3
} satisfies TournamentFormat;
