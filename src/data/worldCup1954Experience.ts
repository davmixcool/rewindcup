import type { Coordinates, TeamCode, TournamentFormat, TournamentGroup } from "@/lib/types";

export const worldCup1954Groups = [
  { id: "1", teams: ["BRA", "YUG", "FRA", "MEX"] },
  { id: "2", teams: ["HUN", "GER", "TUR", "KOR"] },
  { id: "3", teams: ["URU", "AUT", "TCH", "SCO"] },
  { id: "4", teams: ["ENG", "SUI", "ITA", "BEL"] }
] satisfies TournamentGroup[];

export const worldCup1954TeamCoordinates: Partial<Record<TeamCode, Coordinates>> = {
  AUT: [16.3738, 48.2082],
  BEL: [4.3517, 50.8503],
  BRA: [-47.8825, -15.7942],
  ENG: [-0.1276, 51.5072],
  FRA: [2.3522, 48.8566],
  GER: [7.0982, 50.7374],
  HUN: [19.0402, 47.4979],
  ITA: [12.4964, 41.9028],
  KOR: [126.978, 37.5665],
  MEX: [-99.1332, 19.4326],
  SCO: [-3.1883, 55.9533],
  SUI: [7.4474, 46.948],
  TCH: [14.4378, 50.0755],
  TUR: [32.8597, 39.9334],
  URU: [-56.1645, -34.9011],
  YUG: [20.4489, 44.7866]
};

export const worldCup1954Format = {
  expectedGoalCount: 140,
  expectedMatchCount: 26,
  expectedVenueCount: 6,
  groupMatchesPerTeam: 2
} satisfies TournamentFormat;
