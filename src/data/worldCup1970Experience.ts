import type { Coordinates, TeamCode, TournamentFormat, TournamentGroup } from "@/lib/types";

export const worldCup1970Groups = [
  { id: "1", teams: ["URS", "MEX", "BEL", "SLV"] },
  { id: "2", teams: ["ITA", "URU", "SWE", "ISR"] },
  { id: "3", teams: ["BRA", "ENG", "ROU", "TCH"] },
  { id: "4", teams: ["GER", "PER", "BUL", "MAR"] }
] satisfies TournamentGroup[];

export const worldCup1970TeamCoordinates: Partial<Record<TeamCode, Coordinates>> = {
  BEL: [4.3517, 50.8503],
  BRA: [-47.8825, -15.7942],
  BUL: [23.3219, 42.6977],
  ENG: [-0.1276, 51.5072],
  GER: [7.0982, 50.7374],
  ISR: [35.2137, 31.7683],
  ITA: [12.4964, 41.9028],
  MAR: [-6.8498, 34.0209],
  MEX: [-99.1332, 19.4326],
  PER: [-77.0428, -12.0464],
  ROU: [26.1025, 44.4268],
  SLV: [-89.2182, 13.6929],
  SWE: [18.0686, 59.3293],
  TCH: [14.4378, 50.0755],
  URU: [-56.1645, -34.9011],
  URS: [37.6173, 55.7558]
};

export const worldCup1970Format = {
  expectedGoalCount: 95,
  expectedMatchCount: 32,
  expectedVenueCount: 5,
  groupMatchesPerTeam: 3
} satisfies TournamentFormat;
