import type { Coordinates, TeamCode, TournamentFormat, TournamentGroup } from "@/lib/types";

export const worldCup2002GroupOrder = ["A", "B", "C", "D", "E", "F", "G", "H"] as const;

export type WorldCup2002Group = (typeof worldCup2002GroupOrder)[number];

export const worldCup2002TeamCoordinates: Partial<Record<TeamCode, Coordinates>> = {
  ARG: [-58.3816, -34.6037],
  BEL: [4.3517, 50.8503],
  BRA: [-47.8825, -15.7942],
  CMR: [11.5021, 3.848],
  CHN: [116.4074, 39.9042],
  CRO: [15.9819, 45.815],
  CRC: [-84.0907, 9.9281],
  DEN: [12.5683, 55.6761],
  ECU: [-78.4678, -0.1807],
  ENG: [-0.1276, 51.5072],
  FRA: [2.3522, 48.8566],
  GER: [13.405, 52.52],
  IRL: [-6.2603, 53.3498],
  ITA: [12.4964, 41.9028],
  JPN: [139.6917, 35.6895],
  KOR: [126.978, 37.5665],
  KSA: [46.6753, 24.7136],
  MEX: [-99.1332, 19.4326],
  NGA: [7.3986, 9.0765],
  PAR: [-57.5759, -25.2637],
  POL: [21.0122, 52.2297],
  POR: [-9.1393, 38.7223],
  RSA: [28.2293, -25.7479],
  RUS: [37.6173, 55.7558],
  SEN: [-17.4677, 14.7167],
  SVN: [14.5058, 46.0569],
  ESP: [-3.7038, 40.4168],
  SWE: [18.0686, 59.3293],
  TUN: [10.1815, 36.8065],
  TUR: [32.8597, 39.9334],
  URU: [-56.1645, -34.9011],
  USA: [-77.0369, 38.9072]
};

const worldCup2002GroupTeams: Record<WorldCup2002Group, TeamCode[]> = {
  A: ["DEN", "FRA", "SEN", "URU"],
  B: ["PAR", "RSA", "SVN", "ESP"],
  C: ["BRA", "CHN", "CRC", "TUR"],
  D: ["KOR", "POL", "POR", "USA"],
  E: ["CMR", "GER", "IRL", "KSA"],
  F: ["ARG", "ENG", "NGA", "SWE"],
  G: ["CRO", "ECU", "ITA", "MEX"],
  H: ["BEL", "JPN", "RUS", "TUN"]
};

export const worldCup2002Groups: TournamentGroup[] = worldCup2002GroupOrder.map((id) => ({
  id,
  teams: worldCup2002GroupTeams[id]
}));

export const worldCup2002GroupAssignments: Partial<Record<TeamCode, WorldCup2002Group>> = Object.fromEntries(
  worldCup2002Groups.flatMap((group) => group.teams.map((teamCode) => [teamCode, group.id]))
) as Partial<Record<TeamCode, WorldCup2002Group>>;

export const worldCup2002Format = {
  expectedMatchCount: 64,
  expectedVenueCount: 20,
  groupMatchesPerTeam: 3
} satisfies TournamentFormat;
