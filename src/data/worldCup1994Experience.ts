import type { Coordinates, TeamCode, TournamentFormat, TournamentGroup } from "@/lib/types";

export const worldCup1994Groups = [
  { id: "A", teams: ["USA", "SUI", "COL", "ROU"] },
  { id: "B", teams: ["BRA", "RUS", "CMR", "SWE"] },
  { id: "C", teams: ["GER", "BOL", "ESP", "KOR"] },
  { id: "D", teams: ["ARG", "GRE", "NGA", "BUL"] },
  { id: "E", teams: ["ITA", "IRL", "NOR", "MEX"] },
  { id: "F", teams: ["BEL", "MAR", "NED", "KSA"] }
] satisfies TournamentGroup[];

export const worldCup1994TeamCoordinates: Partial<Record<TeamCode, Coordinates>> = {
  ARG: [-58.3816, -34.6037],
  BEL: [4.3517, 50.8503],
  BOL: [-68.1193, -16.4897],
  BRA: [-47.8825, -15.7942],
  BUL: [23.3219, 42.6977],
  CMR: [11.5021, 3.848],
  COL: [-74.0721, 4.711],
  ESP: [-3.7038, 40.4168],
  GER: [13.405, 52.52],
  GRE: [23.7275, 37.9838],
  IRL: [-6.2603, 53.3498],
  ITA: [12.4964, 41.9028],
  KOR: [126.978, 37.5665],
  KSA: [46.6753, 24.7136],
  MAR: [-6.8498, 34.0209],
  MEX: [-99.1332, 19.4326],
  NED: [4.9041, 52.3676],
  NGA: [7.3986, 9.0765],
  NOR: [10.7522, 59.9139],
  ROU: [26.1025, 44.4268],
  RUS: [37.6173, 55.7558],
  SUI: [7.4474, 46.948],
  SWE: [18.0686, 59.3293],
  USA: [-77.0369, 38.9072]
};

export const worldCup1994Format = {
  expectedGoalCount: 141,
  expectedMatchCount: 52,
  expectedVenueCount: 9,
  groupMatchesPerTeam: 3
} satisfies TournamentFormat;
