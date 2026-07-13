import type { Coordinates, TeamCode, TournamentFormat, TournamentGroup } from "@/lib/types";

export const worldCup1982Groups = [
  { id: "1", teams: ["POL", "ITA", "CMR", "PER"] },
  { id: "2", teams: ["GER", "AUT", "ALG", "CHI"] },
  { id: "3", teams: ["BEL", "ARG", "HUN", "SLV"] },
  { id: "4", teams: ["ENG", "FRA", "TCH", "KUW"] },
  { id: "5", teams: ["NIR", "ESP", "YUG", "HON"] },
  { id: "6", teams: ["BRA", "URS", "SCO", "NZL"] }
] satisfies TournamentGroup[];

export const worldCup1982SecondGroups = [
  { id: "A", teams: ["POL", "URS", "BEL"] },
  { id: "B", teams: ["GER", "ENG", "ESP"] },
  { id: "C", teams: ["ITA", "BRA", "ARG"] },
  { id: "D", teams: ["FRA", "AUT", "NIR"] }
] satisfies TournamentGroup[];

export const worldCup1982TeamCoordinates: Partial<Record<TeamCode, Coordinates>> = {
  ALG: [3.0588, 36.7538],
  ARG: [-58.3816, -34.6037],
  AUT: [16.3738, 48.2082],
  BEL: [4.3517, 50.8503],
  BRA: [-47.8825, -15.7942],
  CHI: [-70.6693, -33.4489],
  CMR: [11.5021, 3.848],
  ENG: [-0.1276, 51.5072],
  ESP: [-3.7038, 40.4168],
  FRA: [2.3522, 48.8566],
  GER: [13.405, 52.52],
  HON: [-87.2068, 14.0723],
  HUN: [19.0402, 47.4979],
  ITA: [12.4964, 41.9028],
  KUW: [47.9774, 29.3759],
  NIR: [-5.9301, 54.5973],
  NZL: [174.7762, -41.2866],
  PER: [-77.0428, -12.0464],
  POL: [21.0122, 52.2297],
  SCO: [-3.1883, 55.9533],
  SLV: [-89.2182, 13.6929],
  TCH: [14.4378, 50.0755],
  URS: [37.6173, 55.7558],
  YUG: [20.4489, 44.7866]
};

export const worldCup1982Format = {
  expectedGoalCount: 146,
  expectedMatchCount: 52,
  expectedVenueCount: 17,
  groupMatchesPerTeam: 3,
  secondGroupMatchesPerTeam: 2
} satisfies TournamentFormat;
