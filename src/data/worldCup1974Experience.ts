import type { Coordinates, TeamCode, TournamentFormat, TournamentGroup } from "@/lib/types";

export const worldCup1974Groups = [
  { id: "1", teams: ["GDR", "GER", "CHI", "AUS"] },
  { id: "2", teams: ["YUG", "BRA", "SCO", "ZAI"] },
  { id: "3", teams: ["NED", "SWE", "BUL", "URU"] },
  { id: "4", teams: ["POL", "ARG", "ITA", "HAI"] }
] satisfies TournamentGroup[];

export const worldCup1974SecondGroups = [
  { id: "A", teams: ["NED", "BRA", "GDR", "ARG"] },
  { id: "B", teams: ["GER", "POL", "SWE", "YUG"] }
] satisfies TournamentGroup[];

export const worldCup1974TeamCoordinates: Partial<Record<TeamCode, Coordinates>> = {
  ARG: [-58.3816, -34.6037],
  AUS: [149.13, -35.2809],
  BRA: [-47.8825, -15.7942],
  BUL: [23.3219, 42.6977],
  CHI: [-70.6693, -33.4489],
  GDR: [13.405, 52.52],
  GER: [7.0982, 50.7374],
  HAI: [-72.3074, 18.5944],
  ITA: [12.4964, 41.9028],
  NED: [4.9041, 52.3676],
  POL: [21.0122, 52.2297],
  SCO: [-3.1883, 55.9533],
  SWE: [18.0686, 59.3293],
  URU: [-56.1645, -34.9011],
  YUG: [20.4489, 44.7866],
  ZAI: [15.2663, -4.4419]
};

export const worldCup1974Format = {
  expectedGoalCount: 97,
  expectedMatchCount: 38,
  expectedVenueCount: 9,
  groupMatchesPerTeam: 3,
  secondGroupMatchesPerTeam: 3
} satisfies TournamentFormat;
