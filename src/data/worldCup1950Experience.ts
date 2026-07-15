import type { Coordinates, TeamCode, TournamentFormat, TournamentGroup } from "@/lib/types";

export const worldCup1950Groups = [
  { id: "1", teams: ["BRA", "YUG", "SUI", "MEX"] },
  { id: "2", teams: ["ESP", "ENG", "CHI", "USA"] },
  { id: "3", teams: ["SWE", "ITA", "PAR"] },
  { id: "4", teams: ["URU", "BOL"] }
] satisfies TournamentGroup[];

export const worldCup1950FinalRound = [
  { id: "1", teams: ["URU", "BRA", "SWE", "ESP"] }
] satisfies TournamentGroup[];

export const worldCup1950TeamCoordinates: Partial<Record<TeamCode, Coordinates>> = {
  BOL: [-68.1193, -16.4897],
  BRA: [-47.8825, -15.7942],
  CHI: [-70.6693, -33.4489],
  ENG: [-0.1276, 51.5072],
  ESP: [-3.7038, 40.4168],
  ITA: [12.4964, 41.9028],
  MEX: [-99.1332, 19.4326],
  PAR: [-57.5759, -25.2637],
  SUI: [7.4474, 46.948],
  SWE: [18.0686, 59.3293],
  URU: [-56.1645, -34.9011],
  USA: [-77.0369, 38.9072],
  YUG: [20.4489, 44.7866]
};

export const worldCup1950Format = {
  expectedGoalCount: 88,
  expectedMatchCount: 22,
  expectedVenueCount: 6,
  groupMatchesPerTeam: 3,
  groupMatchesPerTeamOverrides: {
    SWE: 2,
    ITA: 2,
    PAR: 2,
    URU: 1,
    BOL: 1
  },
  secondGroupMatchesPerTeam: 3
} satisfies TournamentFormat;
