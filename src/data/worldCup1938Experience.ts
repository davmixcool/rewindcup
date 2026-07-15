import type { Coordinates, TeamCode, TournamentFormat, TournamentGroup } from "@/lib/types";

export const worldCup1938Field = [
  {
    id: "field",
    label: "Knockout field",
    teams: ["BEL", "BRA", "CUB", "TCH", "DEI", "FRA", "GER", "HUN", "ITA", "NED", "NOR", "POL", "ROU", "SUI", "SWE"]
  }
] satisfies TournamentGroup[];

export const worldCup1938TeamCoordinates: Partial<Record<TeamCode, Coordinates>> = {
  BEL: [4.3517, 50.8503],
  BRA: [-47.8825, -15.7942],
  CUB: [-82.3666, 23.1136],
  TCH: [14.4378, 50.0755],
  DEI: [106.8456, -6.2088],
  FRA: [2.3522, 48.8566],
  GER: [13.405, 52.52],
  HUN: [19.0402, 47.4979],
  ITA: [12.4964, 41.9028],
  NED: [4.9041, 52.3676],
  NOR: [10.7522, 59.9139],
  POL: [21.0122, 52.2297],
  ROU: [26.1025, 44.4268],
  SUI: [7.4474, 46.948],
  SWE: [18.0686, 59.3293]
};

export const worldCup1938Format = {
  expectedGoalCount: 84,
  expectedMatchCount: 18,
  expectedVenueCount: 10,
  groupMatchesPerTeam: 0
} satisfies TournamentFormat;
