import type { Coordinates, TeamCode, TournamentFormat, TournamentGroup } from "@/lib/types";

export const worldCup1930Groups = [
  { id: "1", teams: ["ARG", "CHI", "FRA", "MEX"] },
  { id: "2", teams: ["YUG", "BRA", "BOL"] },
  { id: "3", teams: ["URU", "ROU", "PER"] },
  { id: "4", teams: ["USA", "PAR", "BEL"] }
] satisfies TournamentGroup[];

export const worldCup1930TeamCoordinates: Partial<Record<TeamCode, Coordinates>> = {
  ARG: [-58.3816, -34.6037],
  BEL: [4.3517, 50.8503],
  BOL: [-68.1193, -16.4897],
  BRA: [-47.8825, -15.7942],
  CHI: [-70.6693, -33.4489],
  FRA: [2.3522, 48.8566],
  MEX: [-99.1332, 19.4326],
  PAR: [-57.5759, -25.2637],
  PER: [-77.0428, -12.0464],
  ROU: [26.1025, 44.4268],
  URU: [-56.1645, -34.9011],
  USA: [-77.0369, 38.9072],
  YUG: [20.4489, 44.7866]
};

export const worldCup1930Format = {
  expectedGoalCount: 70,
  expectedMatchCount: 18,
  expectedVenueCount: 3,
  groupMatchesPerTeam: 2,
  groupMatchesPerTeamOverrides: {
    ARG: 3,
    CHI: 3,
    FRA: 3,
    MEX: 3
  }
} satisfies TournamentFormat;
