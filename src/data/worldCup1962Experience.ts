import type { Coordinates, TeamCode, TournamentFormat, TournamentGroup } from "@/lib/types";

export const worldCup1962Groups = [
  { id: "1", teams: ["URS", "YUG", "URU", "COL"] },
  { id: "2", teams: ["GER", "CHI", "ITA", "SUI"] },
  { id: "3", teams: ["BRA", "TCH", "MEX", "ESP"] },
  { id: "4", teams: ["HUN", "ENG", "ARG", "BUL"] }
] satisfies TournamentGroup[];

export const worldCup1962TeamCoordinates: Partial<Record<TeamCode, Coordinates>> = {
  ARG: [-58.3816, -34.6037],
  BRA: [-47.8825, -15.7942],
  BUL: [23.3219, 42.6977],
  CHI: [-70.6693, -33.4489],
  COL: [-74.0721, 4.711],
  ENG: [-0.1276, 51.5072],
  ESP: [-3.7038, 40.4168],
  GER: [7.0982, 50.7374],
  HUN: [19.0402, 47.4979],
  ITA: [12.4964, 41.9028],
  MEX: [-99.1332, 19.4326],
  SUI: [7.4474, 46.948],
  TCH: [14.4378, 50.0755],
  URU: [-56.1645, -34.9011],
  URS: [37.6173, 55.7558],
  YUG: [20.4489, 44.7866]
};

export const worldCup1962Format = {
  expectedGoalCount: 89,
  expectedMatchCount: 32,
  expectedVenueCount: 4,
  groupMatchesPerTeam: 3
} satisfies TournamentFormat;
