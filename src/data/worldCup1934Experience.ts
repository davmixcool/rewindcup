import type { Coordinates, TeamCode, TournamentFormat, TournamentGroup } from "@/lib/types";

export const worldCup1934Field = [
  {
    id: "field",
    label: "Knockout field",
    teams: ["ARG", "AUT", "BEL", "BRA", "TCH", "EGY", "FRA", "GER", "HUN", "ITA", "NED", "ROU", "ESP", "SWE", "SUI", "USA"]
  }
] satisfies TournamentGroup[];

export const worldCup1934TeamCoordinates: Partial<Record<TeamCode, Coordinates>> = {
  ARG: [-58.3816, -34.6037],
  AUT: [16.3738, 48.2082],
  BEL: [4.3517, 50.8503],
  BRA: [-47.8825, -15.7942],
  TCH: [14.4378, 50.0755],
  EGY: [31.2357, 30.0444],
  FRA: [2.3522, 48.8566],
  GER: [13.405, 52.52],
  HUN: [19.0402, 47.4979],
  ITA: [12.4964, 41.9028],
  NED: [4.9041, 52.3676],
  ROU: [26.1025, 44.4268],
  ESP: [-3.7038, 40.4168],
  SWE: [18.0686, 59.3293],
  SUI: [7.4474, 46.948],
  USA: [-77.0369, 38.9072]
};

export const worldCup1934Format = {
  expectedGoalCount: 70,
  expectedMatchCount: 17,
  expectedVenueCount: 8,
  groupMatchesPerTeam: 0
} satisfies TournamentFormat;
