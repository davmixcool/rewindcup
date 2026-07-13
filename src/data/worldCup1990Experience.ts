import type { Coordinates, TeamCode, TournamentFormat, TournamentGroup } from "@/lib/types";

export const worldCup1990Groups = [
  { id: "A", teams: ["ITA", "AUT", "USA", "TCH"] },
  { id: "B", teams: ["ARG", "CMR", "ROU", "URS"] },
  { id: "C", teams: ["BRA", "SWE", "CRC", "SCO"] },
  { id: "D", teams: ["GER", "YUG", "COL", "UAE"] },
  { id: "E", teams: ["BEL", "URU", "ESP", "KOR"] },
  { id: "F", teams: ["ENG", "IRL", "NED", "EGY"] }
] satisfies TournamentGroup[];

export const worldCup1990TeamCoordinates: Partial<Record<TeamCode, Coordinates>> = {
  ARG: [-58.3816, -34.6037],
  AUT: [16.3738, 48.2082],
  BEL: [4.3517, 50.8503],
  BRA: [-47.8825, -15.7942],
  CMR: [11.5021, 3.848],
  COL: [-74.0721, 4.711],
  CRC: [-84.0907, 9.9281],
  EGY: [31.2357, 30.0444],
  ENG: [-0.1276, 51.5072],
  ESP: [-3.7038, 40.4168],
  GER: [13.405, 52.52],
  IRL: [-6.2603, 53.3498],
  ITA: [12.4964, 41.9028],
  KOR: [126.978, 37.5665],
  NED: [4.9041, 52.3676],
  ROU: [26.1025, 44.4268],
  SCO: [-3.1883, 55.9533],
  SWE: [18.0686, 59.3293],
  TCH: [14.4378, 50.0755],
  UAE: [54.3773, 24.4539],
  URS: [37.6173, 55.7558],
  URU: [-56.1645, -34.9011],
  USA: [-77.0369, 38.9072],
  YUG: [20.4489, 44.7866]
};

export const worldCup1990Format = {
  expectedGoalCount: 115,
  expectedMatchCount: 52,
  expectedVenueCount: 12,
  groupMatchesPerTeam: 3
} satisfies TournamentFormat;
