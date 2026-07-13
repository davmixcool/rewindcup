export type Competition = "WORLD_CUP" | "EURO" | "AFCON" | "COPA_AMERICA" | "ASIAN_CUP";

export type Stage = "group" | "group2" | "r32" | "r16" | "qf" | "sf" | "third" | "final";

export const TEAM_CODES = [
  "ALG",
  "ANG",
  "ARG",
  "AUS",
  "AUT",
  "BEL",
  "BIH",
  "BOL",
  "BRA",
  "BUL",
  "CAN",
  "COD",
  "CPV",
  "CIV",
  "CMR",
  "COL",
  "CHI",
  "CHN",
  "CRC",
  "CRO",
  "CZE",
  "CUW",
  "DEN",
  "ECU",
  "EGY",
  "ENG",
  "ESP",
  "FRA",
  "GDR",
  "GER",
  "GHA",
  "GRE",
  "HAI",
  "HON",
  "HUN",
  "IRL",
  "IRN",
  "IRQ",
  "ISL",
  "ISR",
  "ITA",
  "JAM",
  "JPN",
  "JOR",
  "KOR",
  "KSA",
  "KUW",
  "MAR",
  "MEX",
  "NED",
  "NGA",
  "NIR",
  "NOR",
  "NZL",
  "PAR",
  "PAN",
  "PER",
  "POL",
  "POR",
  "PRK",
  "QAT",
  "ROU",
  "RSA",
  "RUS",
  "SCO",
  "SCG",
  "SEN",
  "SRB",
  "SUI",
  "SLV",
  "SVK",
  "SVN",
  "SWE",
  "TCH",
  "TOG",
  "TRI",
  "TUN",
  "TUR",
  "UAE",
  "UKR",
  "URU",
  "URS",
  "USA",
  "UZB",
  "WAL",
  "YUG",
  "ZAI"
] as const;

export type TeamCode = (typeof TEAM_CODES)[number];

export type Score = {
  home: number;
  away: number;
};

export type Coordinates = [number, number];

export type MapView = {
  center: Coordinates;
  zoom: number;
  bearing: number;
  pitch: number;
};

export type HighlightProvider = "youtube" | "vimeo" | "external";
export type HighlightStatus = "none" | "official-report" | "external-video" | "embeddable-video";

export type MatchHighlights = {
  status: HighlightStatus;
  officialUrl?: string;
  officialSourceName?: string;
  directUrl?: string;
  embedUrl?: string;
  provider?: HighlightProvider;
  providerVideoId?: string;
  embeddable: boolean;
  sourceName?: string;
};

export type StadiumModel = {
  footprint: Coordinates[];
  heightMeters: number;
  baseHeightMeters?: number;
};

export type Venue = {
  id: string;
  name: string;
  city: string;
  country: TeamCode;
  coordinates: Coordinates;
  stadiumView: MapView;
  model?: StadiumModel;
};

type BaseEvent = {
  id: string;
  minute: number | null;
  team?: TeamCode;
  detail: string;
  scoreAfter?: Score;
};

export type ReplayEvent =
  | (BaseEvent & { type: "kickoff" })
  | (BaseEvent & { type: "goal"; player: string })
  | (BaseEvent & { type: "half_time" })
  | (BaseEvent & { type: "full_time" })
  | (BaseEvent & { type: "result" });

export type Match = {
  id: string;
  tournamentId: string;
  stage: Stage;
  date: string;
  venueId: string;
  venue: string;
  home: TeamCode;
  away: TeamCode;
  score: Score;
  shootout: Score | null;
  events: ReplayEvent[];
  highlights: MatchHighlights;
  highlightUrl?: string;
  highlightEmbeddable: boolean;
};

export type TournamentGroup = {
  id: string;
  teams: TeamCode[];
};

export type TournamentFormat = {
  expectedGoalCount: number | null;
  expectedMatchCount: number;
  expectedVenueCount: number;
  groupMatchesPerTeam: number;
  secondGroupMatchesPerTeam?: number;
};

export type Tournament = {
  id: string;
  competition: Competition;
  name: string;
  year: number;
  hosts: TeamCode[];
  teams: TeamCode[];
  groups: TournamentGroup[];
  secondGroups?: TournamentGroup[];
  teamCoordinates: Partial<Record<TeamCode, Coordinates>>;
  format: TournamentFormat;
  stages: Stage[];
  status: "complete" | "partial" | "locked";
  mapView: MapView;
  venues: Venue[];
  featuredRoute: string[];
  matches: Match[];
};

export type ReplayMode = "live-score" | "blackout";

export type ReplayStatus = "pre" | "in_play" | "break" | "full_time";
