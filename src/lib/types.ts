export type Competition = "WORLD_CUP" | "EURO" | "AFCON" | "COPA_AMERICA" | "ASIAN_CUP";

export type Stage = "group" | "r16" | "qf" | "sf" | "third" | "final";

export type TeamCode =
  | "BEL"
  | "BRA"
  | "CMR"
  | "CHN"
  | "CRO"
  | "CRC"
  | "DEN"
  | "ECU"
  | "GER"
  | "TUR"
  | "KOR"
  | "JPN"
  | "ENG"
  | "ARG"
  | "FRA"
  | "IRL"
  | "ITA"
  | "KSA"
  | "MEX"
  | "NGA"
  | "PAR"
  | "POL"
  | "POR"
  | "RSA"
  | "RUS"
  | "SEN"
  | "SVN"
  | "ESP"
  | "SWE"
  | "TUN"
  | "URU"
  | "USA";

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

export type MatchHighlights = {
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

export type Tournament = {
  id: string;
  competition: Competition;
  name: string;
  year: number;
  hosts: TeamCode[];
  teams: TeamCode[];
  stages: Stage[];
  status: "complete" | "partial" | "locked";
  mapView: MapView;
  venues: Venue[];
  featuredRoute: string[];
  matches: Match[];
};

export type ReplayMode = "live-score" | "blackout";

export type ReplayStatus = "pre" | "in_play" | "break" | "full_time";
