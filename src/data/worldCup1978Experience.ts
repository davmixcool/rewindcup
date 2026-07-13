import type { Coordinates, TeamCode, TournamentFormat, TournamentGroup } from "@/lib/types";

export const worldCup1978Groups = [
  { id: "1", teams: ["ITA", "ARG", "FRA", "HUN"] },
  { id: "2", teams: ["POL", "GER", "TUN", "MEX"] },
  { id: "3", teams: ["AUT", "BRA", "ESP", "SWE"] },
  { id: "4", teams: ["PER", "NED", "SCO", "IRN"] }
] satisfies TournamentGroup[];

export const worldCup1978SecondGroups = [
  { id: "A", teams: ["NED", "ITA", "GER", "AUT"] },
  { id: "B", teams: ["ARG", "BRA", "POL", "PER"] }
] satisfies TournamentGroup[];

export const worldCup1978TeamCoordinates: Partial<Record<TeamCode, Coordinates>> = {
  ARG: [-58.3816, -34.6037],
  AUT: [16.3738, 48.2082],
  BRA: [-47.8825, -15.7942],
  ESP: [-3.7038, 40.4168],
  FRA: [2.3522, 48.8566],
  GER: [13.405, 52.52],
  HUN: [19.0402, 47.4979],
  IRN: [51.389, 35.6892],
  ITA: [12.4964, 41.9028],
  MEX: [-99.1332, 19.4326],
  NED: [4.9041, 52.3676],
  PER: [-77.0428, -12.0464],
  POL: [21.0122, 52.2297],
  SCO: [-3.1883, 55.9533],
  SWE: [18.0686, 59.3293],
  TUN: [10.1815, 36.8065]
};

export const worldCup1978Format = {
  expectedGoalCount: 102,
  expectedMatchCount: 38,
  expectedVenueCount: 6,
  groupMatchesPerTeam: 3,
  secondGroupMatchesPerTeam: 3
} satisfies TournamentFormat;
