import type { Coordinates, TeamCode, TournamentFormat, TournamentGroup } from "@/lib/types";

export const worldCup1958Groups = [
  { id: "1", teams: ["GER", "NIR", "TCH", "ARG"] },
  { id: "2", teams: ["FRA", "YUG", "PAR", "SCO"] },
  { id: "3", teams: ["SWE", "WAL", "HUN", "MEX"] },
  { id: "4", teams: ["BRA", "URS", "ENG", "AUT"] }
] satisfies TournamentGroup[];

export const worldCup1958TeamCoordinates: Partial<Record<TeamCode, Coordinates>> = {
  ARG: [-58.3816, -34.6037],
  AUT: [16.3738, 48.2082],
  BRA: [-47.8825, -15.7942],
  ENG: [-0.1276, 51.5072],
  FRA: [2.3522, 48.8566],
  GER: [7.0982, 50.7374],
  HUN: [19.0402, 47.4979],
  MEX: [-99.1332, 19.4326],
  NIR: [-5.9301, 54.5973],
  PAR: [-57.5759, -25.2637],
  SCO: [-3.1883, 55.9533],
  SWE: [18.0686, 59.3293],
  TCH: [14.4378, 50.0755],
  URS: [37.6173, 55.7558],
  WAL: [-3.1791, 51.4816],
  YUG: [20.4489, 44.7866]
};

export const worldCup1958Format = {
  expectedGoalCount: 126,
  expectedMatchCount: 35,
  expectedVenueCount: 12,
  groupMatchesPerTeam: 3
} satisfies TournamentFormat;
