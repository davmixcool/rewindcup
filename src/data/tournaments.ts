import type { Coordinates, Match, MatchHighlights, ReplayEvent, Score, TeamCode, Tournament, Venue } from "@/lib/types";
import { teamColors, teamFlags, teamNames } from "@/data/teamMetadata";
import {
  worldCup2002Format,
  worldCup2002Groups,
  worldCup2002TeamCoordinates
} from "@/data/worldCup2002Experience";
import { worldCup2006 } from "@/data/worldCup2006";

const getFifaMatchUrl = (matchId: string) =>
  `https://www.fifa.com/tournaments/mens/worldcup/2002korea-japan/match-center/${matchId}/index.html`;

const getYoutubeWatchUrl = (videoId: string) => `https://www.youtube.com/watch?v=${videoId}`;
const getYoutubeEmbedUrl = (videoId: string) => `https://www.youtube.com/embed/${videoId}`;

function youtubeHighlight(videoId: string, officialMatchId: string, sourceName: string): MatchHighlights {
  return {
    status: "embeddable-video",
    officialUrl: getFifaMatchUrl(officialMatchId),
    officialSourceName: "FIFA match report",
    directUrl: getYoutubeWatchUrl(videoId),
    embedUrl: getYoutubeEmbedUrl(videoId),
    provider: "youtube",
    providerVideoId: videoId,
    embeddable: true,
    sourceName
  };
}

function fifaReportHighlight(officialMatchId: string): MatchHighlights {
  return {
    status: "official-report",
    officialUrl: getFifaMatchUrl(officialMatchId),
    officialSourceName: "FIFA match report",
    embeddable: false,
    sourceName: "FIFA match report"
  };
}

type VenueSeed = Pick<Venue, "id" | "name" | "city" | "country" | "coordinates"> & {
  bearing?: number;
  pitch?: number;
  zoom?: number;
};

type GoalSeed = {
  minute: number;
  team: TeamCode;
  player: string;
  detail?: string;
};

type FixtureSeed = {
  no: number;
  stage: Match["stage"];
  date: string;
  venueId: string;
  home: TeamCode;
  away: TeamCode;
  score: Score;
  shootout?: Score;
  goals?: GoalSeed[];
  durationMinutes?: 90 | 120;
  note?: string;
};

const teamNamesByCode = teamNames;

const venueSeeds: VenueSeed[] = [
  { id: "daegu-world-cup-stadium", name: "Daegu World Cup Stadium", city: "Daegu", country: "KOR", coordinates: [128.6906, 35.8298] },
  { id: "seoul-world-cup-stadium", name: "Seoul World Cup Stadium", city: "Seoul", country: "KOR", coordinates: [126.8972, 37.5683], bearing: 28 },
  { id: "busan-asiad-stadium", name: "Busan Asiad Main Stadium", city: "Busan", country: "KOR", coordinates: [129.058, 35.19] },
  { id: "incheon-world-cup-stadium", name: "Incheon World Cup Stadium", city: "Incheon", country: "KOR", coordinates: [126.6908, 37.4351] },
  { id: "ulsan-munsu-stadium", name: "Ulsan Munsu Football Stadium", city: "Ulsan", country: "KOR", coordinates: [129.2598, 35.5354], bearing: 16 },
  { id: "suwon-world-cup-stadium", name: "Suwon World Cup Stadium", city: "Suwon", country: "KOR", coordinates: [127.0369, 37.2869], bearing: -24 },
  { id: "gwangju-world-cup-stadium", name: "Gwangju World Cup Stadium", city: "Gwangju", country: "KOR", coordinates: [126.8747, 35.1339] },
  { id: "jeonju-world-cup-stadium", name: "Jeonju World Cup Stadium", city: "Jeonju", country: "KOR", coordinates: [127.0643, 35.8689] },
  { id: "jeju-world-cup-stadium", name: "Jeju World Cup Stadium", city: "Seogwipo", country: "KOR", coordinates: [126.5092, 33.2461], bearing: 18 },
  { id: "daejeon-world-cup-stadium", name: "Daejeon World Cup Stadium", city: "Daejeon", country: "KOR", coordinates: [127.325, 36.364] },
  { id: "kashima-soccer-stadium", name: "Kashima Soccer Stadium", city: "Ibaraki", country: "JPN", coordinates: [140.6403, 35.9919] },
  { id: "kobe-wing-stadium", name: "Kobe Wing Stadium", city: "Kobe", country: "JPN", coordinates: [135.1697, 34.6567], bearing: -22, zoom: 16.6, pitch: 65 },
  { id: "miyagi-stadium", name: "Miyagi Stadium", city: "Rifu", country: "JPN", coordinates: [140.9504, 38.3354] },
  { id: "niigata-stadium", name: "Niigata Stadium", city: "Niigata", country: "JPN", coordinates: [139.0591, 37.8826] },
  { id: "oita-stadium", name: "Oita Stadium", city: "Oita", country: "JPN", coordinates: [131.6575, 33.2007] },
  { id: "nagai-stadium", name: "Nagai Stadium", city: "Osaka", country: "JPN", coordinates: [135.5181, 34.6136] },
  { id: "saitama-stadium-2002", name: "Saitama Stadium 2002", city: "Saitama", country: "JPN", coordinates: [139.7169, 35.9024], bearing: -18, pitch: 65 },
  { id: "sapporo-dome", name: "Sapporo Dome", city: "Sapporo", country: "JPN", coordinates: [141.4091, 43.0151] },
  { id: "shizuoka-stadium-ecopa", name: "Shizuoka Stadium Ecopa", city: "Shizuoka", country: "JPN", coordinates: [137.9706, 34.7432], bearing: -34 },
  {
    id: "international-stadium-yokohama",
    name: "International Stadium, Yokohama",
    city: "Yokohama",
    country: "JPN",
    coordinates: [139.6062, 35.5101],
    bearing: -28,
    pitch: 66,
    zoom: 16.85
  }
];

const venues: Venue[] = venueSeeds.map((venue) => ({
  ...venue,
  stadiumView: {
    center: venue.coordinates,
    zoom: venue.zoom ?? 16.35,
    bearing: venue.bearing ?? -12,
    pitch: venue.pitch ?? 64
  },
  model:
    venue.id === "international-stadium-yokohama"
      ? {
          heightMeters: 34,
          baseHeightMeters: 0,
          footprint: [
            [139.6048, 35.51055],
            [139.60525, 35.50928],
            [139.60745, 35.5096],
            [139.607, 35.51088],
            [139.6048, 35.51055]
          ]
        }
      : undefined
}));

const highlightOverrides = new Map<number, MatchHighlights>([
  [1, youtubeHighlight("RaBkN-Dyx58", "43950001", "WorldCupHighlightsTM highlights")],
  [2, youtubeHighlight("lTuakjsMjJE", "43950002", "Football Frontline highlights")],
  [3, youtubeHighlight("OPlwXvaArD4", "43950003", "Football Frontline highlights")],
  [4, youtubeHighlight("FC_0MHwyhuk", "43950004", "World Cup Goals highlights")],
  [5, youtubeHighlight("Ch-j0YAF3SE", "43950005", "World Cup Goals highlights")],
  [6, youtubeHighlight("DFhKq4AQhkY", "43950006", "Football Frontline highlights")],
  [7, youtubeHighlight("i84F8efvzgk", "43950007", "Benjamín Rodríguez highlights")],
  [8, youtubeHighlight("2GxzmxJjod4", "43950008", "World Cup Goals highlights")],
  [9, youtubeHighlight("odwFA_T0iTE", "43950009", "World Cup Goals highlights")],
  [10, youtubeHighlight("uyIgW_efCpo", "43950010", "TYFC HD highlights")],
  [11, youtubeHighlight("pMj8UbHjDt0", "43950011", "Football Star highlights")],
  [12, youtubeHighlight("YlMm3EJHODA", "43950012", "VintageHDtv highlights")],
  [13, youtubeHighlight("Yo0D91rkAM0", "43950013", "Football Time Machine highlights")],
  [14, youtubeHighlight("W0Xs-RS_U9Y", "43950014", "World Cup Goals highlights")],
  [15, youtubeHighlight("F-Opdnrmhuk", "43950015", "World Cup Goals highlights")],
  [16, youtubeHighlight("Kx_VVgMObt0", "43950016", "Football Time Machine highlights")],
  [17, youtubeHighlight("wu7R289yzsA", "43950017", "VintageHDtv2 highlights")],
  [18, youtubeHighlight("UywRPMr8XHQ", "43950018", "World Cup Goals highlights")],
  [19, youtubeHighlight("Pv85aSCMd9s", "43950019", "World Cup Goals highlights")],
  [20, youtubeHighlight("HZpedyZ_TfY", "43950020", "World Cup Goals highlights")],
  [21, youtubeHighlight("BXj_it8J75M", "43950021", "World Cup Goals highlights")],
  [22, youtubeHighlight("CXXUo4B47gg", "43950022", "World Cup Goals highlights")],
  [23, youtubeHighlight("Skq5lMUr64U", "43950023", "World Cup Goals highlights")],
  [24, youtubeHighlight("QliHrHZa4BM", "43950024", "World Cup Goals highlights")],
  [25, youtubeHighlight("fzsWEn5kQJ4", "43950025", "World Cup Goals highlights")],
  [26, youtubeHighlight("s4F41XW3Fxw", "43950026", "TYFC HD highlights")],
  [27, youtubeHighlight("e6Wz7lC7yps", "43950027", "World Cup Goals highlights")],
  [28, youtubeHighlight("9PLH9Dd18aM", "43950028", "World Cup Goals highlights")],
  [29, youtubeHighlight("bA05dQA3yO0", "43950029", "HistoryFull Worldcup highlights")],
  [30, youtubeHighlight("3rKeker7uGo", "43950030", "World Cup Goals highlights")],
  [31, youtubeHighlight("r1ebJKDc_Yo", "43950031", "VintageHDtv2 highlights")],
  [32, youtubeHighlight("z4h8ebyr3CM", "43950032", "Football Time Machine highlights")],
  [33, youtubeHighlight("XS_1evIc8EY", "43950033", "World Cup Goals highlights")],
  [34, youtubeHighlight("LADw3WqZMBU", "43950034", "sp1873 highlights")],
  [35, youtubeHighlight("fTRGpNHWqAU", "43950035", "World Cup Goals highlights")],
  [36, youtubeHighlight("2bPj4ODS2Ys", "43950036", "World Cup Goals highlights")],
  [37, youtubeHighlight("POgFKaPynbo", "43950037", "World Cup Goals highlights")],
  [38, youtubeHighlight("B_5T5nB2tyU", "43950038", "World Cup Goals highlights")],
  [39, youtubeHighlight("gYFvvWptWGc", "43950039", "World Cup Goals highlights")],
  [40, youtubeHighlight("80bf2Ij08zk", "43950040", "World Cup Goals highlights")],
  [41, youtubeHighlight("aP5HgLcLxuw", "43950041", "TYFC HD highlights")],
  [42, youtubeHighlight("RfXeQ2VgdAo", "43950042", "World Cup Goals highlights")],
  [43, youtubeHighlight("v9Jo7DSUTrY", "43950043", "World Cup Goals highlights")],
  [44, youtubeHighlight("VJFyuF7mZ6c", "43950044", "World Cup Goals highlights")],
  [45, youtubeHighlight("dhf7LzNVA00", "43950045", "World Cup Goals highlights")],
  [46, youtubeHighlight("yYZZReDblzc", "43950046", "World Cup Goals highlights")],
  [47, youtubeHighlight("vfAS4C4pDkc", "43950047", "World Cup Goals highlights")],
  [48, youtubeHighlight("nnSZjoN5lG8", "43950048", "World Cup Goals highlights")],
  [49, youtubeHighlight("Lze2k7VHmCw", "43950049", "World Cup Goals highlights")],
  [50, youtubeHighlight("PeI5OKtOMpA", "43950050", "World Cup Goals highlights")],
  [51, youtubeHighlight("6WhcszCaJYc", "43950051", "World Cup Goals highlights")],
  [52, youtubeHighlight("st8f8W70BO0", "43950052", "World Cup Goals highlights")],
  [53, youtubeHighlight("3YMZcwyB1ec", "43950053", "World Cup Goals highlights")],
  [54, youtubeHighlight("lOJDouQTsgw", "43950054", "TYFC HD highlights")],
  [55, youtubeHighlight("hE1Ro-KrHsw", "43950055", "World Cup Goals highlights")],
  [56, youtubeHighlight("KZ_PAZIpS_w", "43950056", "Kings Football highlights")],
  [57, youtubeHighlight("9w2EWURq0UU", "43950057", "TYFC HD highlights")],
  [58, youtubeHighlight("Fr3xXBAkiQU", "43950058", "World Cup Goals highlights")],
  [59, youtubeHighlight("Nxxkd_LtQHw", "43950059", "World Cup Goals highlights")],
  [60, youtubeHighlight("C79SbWyyKhY", "43950060", "World Cup Goals highlights")],
  [61, youtubeHighlight("s5jDWEw2S4Y", "43950061", "Kings Football highlights")],
  [62, youtubeHighlight("F5-OqNH-VDU", "43950062", "TYFC HD highlights")],
  [63, youtubeHighlight("S2fxSPjlA-s", "43950063", "Ford Cosworth 1973 highlights")],
  [64, youtubeHighlight("GDUzo7oIeXE", "43950064", "Ford Cosworth 1973 highlights")]
]);

const fixtureSeeds: FixtureSeed[] = [
  { no: 1, stage: "group", date: "2002-05-31", venueId: "seoul-world-cup-stadium", home: "FRA", away: "SEN", score: { home: 0, away: 1 } },
  { no: 2, stage: "group", date: "2002-06-01", venueId: "ulsan-munsu-stadium", home: "URU", away: "DEN", score: { home: 1, away: 2 } },
  { no: 3, stage: "group", date: "2002-06-01", venueId: "niigata-stadium", home: "IRL", away: "CMR", score: { home: 1, away: 1 } },
  { no: 4, stage: "group", date: "2002-06-01", venueId: "sapporo-dome", home: "GER", away: "KSA", score: { home: 8, away: 0 } },
  { no: 5, stage: "group", date: "2002-06-02", venueId: "kashima-soccer-stadium", home: "ARG", away: "NGA", score: { home: 1, away: 0 } },
  { no: 6, stage: "group", date: "2002-06-02", venueId: "saitama-stadium-2002", home: "ENG", away: "SWE", score: { home: 1, away: 1 } },
  { no: 7, stage: "group", date: "2002-06-02", venueId: "busan-asiad-stadium", home: "PAR", away: "RSA", score: { home: 2, away: 2 } },
  { no: 8, stage: "group", date: "2002-06-02", venueId: "gwangju-world-cup-stadium", home: "ESP", away: "SVN", score: { home: 3, away: 1 } },
  { no: 9, stage: "group", date: "2002-06-03", venueId: "niigata-stadium", home: "CRO", away: "MEX", score: { home: 0, away: 1 } },
  {
    no: 10,
    stage: "group",
    date: "2002-06-03",
    venueId: "ulsan-munsu-stadium",
    home: "BRA",
    away: "TUR",
    score: { home: 2, away: 1 },
    goals: [
      { minute: 45, team: "TUR", player: "Hasan Sas", detail: "Hasan Sas strikes in first-half stoppage time." },
      { minute: 50, team: "BRA", player: "Ronaldo", detail: "Ronaldo pulls Brazil level early in the second half." },
      { minute: 87, team: "BRA", player: "Rivaldo", detail: "Rivaldo scores from the spot and Brazil turn it around." }
    ]
  },
  { no: 11, stage: "group", date: "2002-06-03", venueId: "sapporo-dome", home: "ITA", away: "ECU", score: { home: 2, away: 0 } },
  { no: 12, stage: "group", date: "2002-06-04", venueId: "busan-asiad-stadium", home: "KOR", away: "POL", score: { home: 2, away: 0 } },
  { no: 13, stage: "group", date: "2002-06-04", venueId: "gwangju-world-cup-stadium", home: "CHN", away: "CRC", score: { home: 0, away: 2 } },
  { no: 14, stage: "group", date: "2002-06-04", venueId: "saitama-stadium-2002", home: "JPN", away: "BEL", score: { home: 2, away: 2 } },
  { no: 15, stage: "group", date: "2002-06-05", venueId: "kobe-wing-stadium", home: "RUS", away: "TUN", score: { home: 2, away: 0 } },
  { no: 16, stage: "group", date: "2002-06-05", venueId: "suwon-world-cup-stadium", home: "USA", away: "POR", score: { home: 3, away: 2 } },
  { no: 17, stage: "group", date: "2002-06-05", venueId: "kashima-soccer-stadium", home: "GER", away: "IRL", score: { home: 1, away: 1 } },
  { no: 18, stage: "group", date: "2002-06-06", venueId: "daegu-world-cup-stadium", home: "DEN", away: "SEN", score: { home: 1, away: 1 } },
  { no: 19, stage: "group", date: "2002-06-06", venueId: "saitama-stadium-2002", home: "CMR", away: "KSA", score: { home: 1, away: 0 } },
  { no: 20, stage: "group", date: "2002-06-06", venueId: "busan-asiad-stadium", home: "FRA", away: "URU", score: { home: 0, away: 0 } },
  { no: 21, stage: "group", date: "2002-06-07", venueId: "sapporo-dome", home: "ARG", away: "ENG", score: { home: 0, away: 1 } },
  { no: 22, stage: "group", date: "2002-06-07", venueId: "jeonju-world-cup-stadium", home: "ESP", away: "PAR", score: { home: 3, away: 1 } },
  { no: 23, stage: "group", date: "2002-06-07", venueId: "kobe-wing-stadium", home: "SWE", away: "NGA", score: { home: 2, away: 1 } },
  { no: 24, stage: "group", date: "2002-06-08", venueId: "kashima-soccer-stadium", home: "ITA", away: "CRO", score: { home: 1, away: 2 } },
  { no: 25, stage: "group", date: "2002-06-08", venueId: "daegu-world-cup-stadium", home: "RSA", away: "SVN", score: { home: 1, away: 0 } },
  {
    no: 26,
    stage: "group",
    date: "2002-06-08",
    venueId: "jeju-world-cup-stadium",
    home: "BRA",
    away: "CHN",
    score: { home: 4, away: 0 },
    goals: [
      { minute: 15, team: "BRA", player: "Roberto Carlos", detail: "Roberto Carlos opens the scoring." },
      { minute: 32, team: "BRA", player: "Rivaldo", detail: "Rivaldo doubles Brazil's lead." },
      { minute: 45, team: "BRA", player: "Ronaldinho", detail: "Ronaldinho scores from the penalty spot before the break." },
      { minute: 55, team: "BRA", player: "Ronaldo", detail: "Ronaldo adds Brazil's fourth." }
    ]
  },
  { no: 27, stage: "group", date: "2002-06-09", venueId: "international-stadium-yokohama", home: "JPN", away: "RUS", score: { home: 1, away: 0 } },
  { no: 28, stage: "group", date: "2002-06-09", venueId: "miyagi-stadium", home: "MEX", away: "ECU", score: { home: 2, away: 1 } },
  { no: 29, stage: "group", date: "2002-06-09", venueId: "incheon-world-cup-stadium", home: "CRC", away: "TUR", score: { home: 1, away: 1 } },
  { no: 30, stage: "group", date: "2002-06-10", venueId: "oita-stadium", home: "TUN", away: "BEL", score: { home: 1, away: 1 } },
  { no: 31, stage: "group", date: "2002-06-10", venueId: "daegu-world-cup-stadium", home: "KOR", away: "USA", score: { home: 1, away: 1 } },
  { no: 32, stage: "group", date: "2002-06-10", venueId: "jeonju-world-cup-stadium", home: "POR", away: "POL", score: { home: 4, away: 0 } },
  { no: 33, stage: "group", date: "2002-06-11", venueId: "shizuoka-stadium-ecopa", home: "CMR", away: "GER", score: { home: 0, away: 2 } },
  { no: 34, stage: "group", date: "2002-06-11", venueId: "international-stadium-yokohama", home: "KSA", away: "IRL", score: { home: 0, away: 3 } },
  { no: 35, stage: "group", date: "2002-06-11", venueId: "incheon-world-cup-stadium", home: "DEN", away: "FRA", score: { home: 2, away: 0 } },
  { no: 36, stage: "group", date: "2002-06-11", venueId: "suwon-world-cup-stadium", home: "SEN", away: "URU", score: { home: 3, away: 3 } },
  { no: 37, stage: "group", date: "2002-06-12", venueId: "miyagi-stadium", home: "SWE", away: "ARG", score: { home: 1, away: 1 } },
  { no: 38, stage: "group", date: "2002-06-12", venueId: "nagai-stadium", home: "NGA", away: "ENG", score: { home: 0, away: 0 } },
  { no: 39, stage: "group", date: "2002-06-12", venueId: "daejeon-world-cup-stadium", home: "RSA", away: "ESP", score: { home: 2, away: 3 } },
  { no: 40, stage: "group", date: "2002-06-12", venueId: "jeju-world-cup-stadium", home: "SVN", away: "PAR", score: { home: 1, away: 3 } },
  {
    no: 41,
    stage: "group",
    date: "2002-06-13",
    venueId: "suwon-world-cup-stadium",
    home: "CRC",
    away: "BRA",
    score: { home: 2, away: 5 },
    goals: [
      { minute: 10, team: "BRA", player: "Ronaldo", detail: "Ronaldo gives Brazil the lead." },
      { minute: 13, team: "BRA", player: "Ronaldo", detail: "Ronaldo scores again minutes later." },
      { minute: 38, team: "BRA", player: "Edmilson", detail: "Edmilson makes it three for Brazil." },
      { minute: 39, team: "CRC", player: "Paulo Wanchope", detail: "Paulo Wanchope answers for Costa Rica." },
      { minute: 56, team: "CRC", player: "Ronald Gomez", detail: "Ronald Gomez cuts the gap to one." },
      { minute: 62, team: "BRA", player: "Rivaldo", detail: "Rivaldo restores Brazil's cushion." },
      { minute: 64, team: "BRA", player: "Junior", detail: "Junior finishes Brazil's fifth." }
    ]
  },
  { no: 42, stage: "group", date: "2002-06-13", venueId: "seoul-world-cup-stadium", home: "TUR", away: "CHN", score: { home: 3, away: 0 } },
  { no: 43, stage: "group", date: "2002-06-13", venueId: "oita-stadium", home: "MEX", away: "ITA", score: { home: 1, away: 1 } },
  { no: 44, stage: "group", date: "2002-06-13", venueId: "international-stadium-yokohama", home: "ECU", away: "CRO", score: { home: 1, away: 0 } },
  { no: 45, stage: "group", date: "2002-06-14", venueId: "nagai-stadium", home: "TUN", away: "JPN", score: { home: 0, away: 2 } },
  { no: 46, stage: "group", date: "2002-06-14", venueId: "shizuoka-stadium-ecopa", home: "BEL", away: "RUS", score: { home: 3, away: 2 } },
  { no: 47, stage: "group", date: "2002-06-14", venueId: "incheon-world-cup-stadium", home: "POR", away: "KOR", score: { home: 0, away: 1 } },
  { no: 48, stage: "group", date: "2002-06-14", venueId: "daejeon-world-cup-stadium", home: "POL", away: "USA", score: { home: 3, away: 1 } },
  { no: 49, stage: "r16", date: "2002-06-15", venueId: "jeju-world-cup-stadium", home: "GER", away: "PAR", score: { home: 1, away: 0 }, goals: [{ minute: 88, team: "GER", player: "Oliver Neuville" }] },
  { no: 50, stage: "r16", date: "2002-06-15", venueId: "niigata-stadium", home: "DEN", away: "ENG", score: { home: 0, away: 3 }, goals: [{ minute: 5, team: "ENG", player: "Rio Ferdinand" }, { minute: 22, team: "ENG", player: "Michael Owen" }, { minute: 44, team: "ENG", player: "Emile Heskey" }] },
  { no: 51, stage: "r16", date: "2002-06-16", venueId: "oita-stadium", home: "SWE", away: "SEN", score: { home: 1, away: 2 }, goals: [{ minute: 11, team: "SWE", player: "Henrik Larsson" }, { minute: 37, team: "SEN", player: "Henri Camara" }, { minute: 104, team: "SEN", player: "Henri Camara", detail: "Henri Camara wins it with a golden goal." }], note: "After extra time" },
  { no: 52, stage: "r16", date: "2002-06-16", venueId: "suwon-world-cup-stadium", home: "ESP", away: "IRL", score: { home: 1, away: 1 }, shootout: { home: 3, away: 2 }, goals: [{ minute: 8, team: "ESP", player: "Fernando Morientes" }, { minute: 90, team: "IRL", player: "Robbie Keane" }], durationMinutes: 120, note: "Spain won 3-2 on penalties" },
  { no: 53, stage: "r16", date: "2002-06-17", venueId: "jeonju-world-cup-stadium", home: "MEX", away: "USA", score: { home: 0, away: 2 }, goals: [{ minute: 8, team: "USA", player: "Brian McBride" }, { minute: 65, team: "USA", player: "Landon Donovan" }] },
  { no: 54, stage: "r16", date: "2002-06-17", venueId: "kobe-wing-stadium", home: "BRA", away: "BEL", score: { home: 2, away: 0 }, goals: [{ minute: 67, team: "BRA", player: "Rivaldo", detail: "Rivaldo breaks Belgium's resistance." }, { minute: 87, team: "BRA", player: "Ronaldo", detail: "Ronaldo seals Brazil's place in the quarter-finals." }] },
  { no: 55, stage: "r16", date: "2002-06-18", venueId: "miyagi-stadium", home: "JPN", away: "TUR", score: { home: 0, away: 1 }, goals: [{ minute: 12, team: "TUR", player: "Umit Davala" }] },
  { no: 56, stage: "r16", date: "2002-06-18", venueId: "daejeon-world-cup-stadium", home: "KOR", away: "ITA", score: { home: 2, away: 1 }, goals: [{ minute: 18, team: "ITA", player: "Christian Vieri" }, { minute: 88, team: "KOR", player: "Seol Ki-hyeon" }, { minute: 117, team: "KOR", player: "Ahn Jung-hwan", detail: "Ahn Jung-hwan wins it with a golden goal." }], note: "After extra time" },
  { no: 57, stage: "qf", date: "2002-06-21", venueId: "shizuoka-stadium-ecopa", home: "ENG", away: "BRA", score: { home: 1, away: 2 }, goals: [{ minute: 23, team: "ENG", player: "Michael Owen", detail: "Michael Owen puts England in front." }, { minute: 45, team: "BRA", player: "Rivaldo", detail: "Rivaldo levels in first-half stoppage time." }, { minute: 50, team: "BRA", player: "Ronaldinho", detail: "Ronaldinho gives Brazil the lead." }] },
  { no: 58, stage: "qf", date: "2002-06-21", venueId: "ulsan-munsu-stadium", home: "GER", away: "USA", score: { home: 1, away: 0 }, goals: [{ minute: 39, team: "GER", player: "Michael Ballack" }] },
  { no: 59, stage: "qf", date: "2002-06-22", venueId: "gwangju-world-cup-stadium", home: "ESP", away: "KOR", score: { home: 0, away: 0 }, shootout: { home: 3, away: 5 }, durationMinutes: 120, note: "South Korea won 5-3 on penalties" },
  { no: 60, stage: "qf", date: "2002-06-22", venueId: "nagai-stadium", home: "SEN", away: "TUR", score: { home: 0, away: 1 }, goals: [{ minute: 94, team: "TUR", player: "Ilhan Mansiz", detail: "Ilhan Mansiz wins it with a golden goal." }], note: "After extra time" },
  { no: 61, stage: "sf", date: "2002-06-25", venueId: "seoul-world-cup-stadium", home: "GER", away: "KOR", score: { home: 1, away: 0 }, goals: [{ minute: 75, team: "GER", player: "Michael Ballack" }] },
  { no: 62, stage: "sf", date: "2002-06-26", venueId: "saitama-stadium-2002", home: "BRA", away: "TUR", score: { home: 1, away: 0 }, goals: [{ minute: 49, team: "BRA", player: "Ronaldo", detail: "Ronaldo scores the decisive goal early in the second half." }] },
  { no: 63, stage: "third", date: "2002-06-29", venueId: "daegu-world-cup-stadium", home: "KOR", away: "TUR", score: { home: 2, away: 3 }, goals: [{ minute: 1, team: "TUR", player: "Hakan Sukur" }, { minute: 9, team: "KOR", player: "Lee Eul-yong" }, { minute: 13, team: "TUR", player: "Ilhan Mansiz" }, { minute: 32, team: "TUR", player: "Ilhan Mansiz" }, { minute: 90, team: "KOR", player: "Song Chong-gug" }] },
  { no: 64, stage: "final", date: "2002-06-30", venueId: "international-stadium-yokohama", home: "GER", away: "BRA", score: { home: 0, away: 2 }, goals: [{ minute: 67, team: "BRA", player: "Ronaldo", detail: "Ronaldo reacts first after a spill in the box. Brazil have the breakthrough." }, { minute: 79, team: "BRA", player: "Ronaldo", detail: "Rivaldo lets the ball run and Ronaldo sweeps it low into the corner." }] }
];

const goalOverrides = new Map<number, GoalSeed[]>([
  [1, [{ minute: 30, team: "SEN", player: "Papa Bouba Diop" }]],
  [2, [{ minute: 45, team: "DEN", player: "Jon Dahl Tomasson" }, { minute: 47, team: "URU", player: "Dario Rodriguez" }, { minute: 83, team: "DEN", player: "Jon Dahl Tomasson" }]],
  [3, [{ minute: 39, team: "CMR", player: "Patrick Mboma" }, { minute: 52, team: "IRL", player: "Matt Holland" }]],
  [
    4,
    [
      { minute: 20, team: "GER", player: "Miroslav Klose" },
      { minute: 25, team: "GER", player: "Miroslav Klose" },
      { minute: 40, team: "GER", player: "Michael Ballack" },
      { minute: 45, team: "GER", player: "Carsten Jancker" },
      { minute: 70, team: "GER", player: "Miroslav Klose" },
      { minute: 73, team: "GER", player: "Thomas Linke" },
      { minute: 84, team: "GER", player: "Oliver Bierhoff" },
      { minute: 90, team: "GER", player: "Bernd Schneider" }
    ]
  ],
  [5, [{ minute: 63, team: "ARG", player: "Gabriel Batistuta" }]],
  [6, [{ minute: 24, team: "ENG", player: "Sol Campbell" }, { minute: 59, team: "SWE", player: "Niclas Alexandersson" }]],
  [
    7,
    [
      { minute: 39, team: "PAR", player: "Roque Santa Cruz" },
      { minute: 55, team: "PAR", player: "Francisco Arce" },
      { minute: 63, team: "RSA", player: "Teboho Mokoena" },
      { minute: 90, team: "RSA", player: "Quinton Fortune", detail: "Quinton Fortune scores from the penalty spot." }
    ]
  ],
  [
    8,
    [
      { minute: 44, team: "ESP", player: "Raul" },
      { minute: 74, team: "ESP", player: "Juan Carlos Valeron" },
      { minute: 82, team: "SVN", player: "Sebastjan Cimirotic" },
      { minute: 87, team: "ESP", player: "Fernando Hierro", detail: "Fernando Hierro scores from the penalty spot." }
    ]
  ],
  [9, [{ minute: 60, team: "MEX", player: "Cuauhtemoc Blanco", detail: "Cuauhtemoc Blanco scores from the penalty spot." }]],
  [11, [{ minute: 7, team: "ITA", player: "Christian Vieri" }, { minute: 27, team: "ITA", player: "Christian Vieri" }]],
  [12, [{ minute: 26, team: "KOR", player: "Hwang Sun-hong" }, { minute: 53, team: "KOR", player: "Yoo Sang-chul" }]],
  [13, [{ minute: 61, team: "CRC", player: "Ronald Gomez" }, { minute: 65, team: "CRC", player: "Mauricio Wright" }]],
  [
    14,
    [
      { minute: 57, team: "BEL", player: "Marc Wilmots" },
      { minute: 59, team: "JPN", player: "Takayuki Suzuki" },
      { minute: 68, team: "JPN", player: "Junichi Inamoto" },
      { minute: 75, team: "BEL", player: "Peter Van der Heyden" }
    ]
  ],
  [15, [{ minute: 59, team: "RUS", player: "Yegor Titov" }, { minute: 64, team: "RUS", player: "Valery Karpin", detail: "Valery Karpin scores from the penalty spot." }]],
  [
    16,
    [
      { minute: 4, team: "USA", player: "John O'Brien" },
      { minute: 29, team: "USA", player: "Jorge Costa own goal", detail: "Jorge Costa turns the ball into his own net." },
      { minute: 36, team: "USA", player: "Brian McBride" },
      { minute: 39, team: "POR", player: "Beto" },
      { minute: 71, team: "POR", player: "Jeff Agoos own goal", detail: "Jeff Agoos turns the ball into his own net." }
    ]
  ],
  [17, [{ minute: 19, team: "GER", player: "Miroslav Klose" }, { minute: 90, team: "IRL", player: "Robbie Keane", detail: "Robbie Keane equalises in stoppage time." }]],
  [18, [{ minute: 16, team: "DEN", player: "Jon Dahl Tomasson", detail: "Jon Dahl Tomasson scores from the penalty spot." }, { minute: 52, team: "SEN", player: "Salif Diao" }]],
  [19, [{ minute: 66, team: "CMR", player: "Samuel Eto'o" }]],
  [21, [{ minute: 44, team: "ENG", player: "David Beckham", detail: "David Beckham scores from the penalty spot." }]],
  [
    22,
    [
      { minute: 10, team: "PAR", player: "Carles Puyol own goal", detail: "Carles Puyol turns the ball into his own net." },
      { minute: 53, team: "ESP", player: "Fernando Morientes" },
      { minute: 69, team: "ESP", player: "Fernando Morientes" },
      { minute: 82, team: "ESP", player: "Fernando Hierro", detail: "Fernando Hierro scores from the penalty spot." }
    ]
  ],
  [23, [{ minute: 27, team: "NGA", player: "Julius Aghahowa" }, { minute: 35, team: "SWE", player: "Henrik Larsson" }, { minute: 63, team: "SWE", player: "Henrik Larsson", detail: "Henrik Larsson scores from the penalty spot." }]],
  [24, [{ minute: 55, team: "ITA", player: "Christian Vieri" }, { minute: 73, team: "CRO", player: "Ivica Olic" }, { minute: 76, team: "CRO", player: "Milan Rapaic" }]],
  [25, [{ minute: 4, team: "RSA", player: "Siyabonga Nomvethe" }]],
  [27, [{ minute: 51, team: "JPN", player: "Junichi Inamoto" }]],
  [28, [{ minute: 5, team: "ECU", player: "Agustin Delgado" }, { minute: 28, team: "MEX", player: "Jared Borgetti" }, { minute: 57, team: "MEX", player: "Gerardo Torrado" }]],
  [29, [{ minute: 56, team: "TUR", player: "Emre Belozoglu" }, { minute: 86, team: "CRC", player: "Winston Parks" }]],
  [30, [{ minute: 13, team: "BEL", player: "Marc Wilmots" }, { minute: 17, team: "TUN", player: "Raouf Bouzaiene" }]],
  [31, [{ minute: 24, team: "USA", player: "Clint Mathis" }, { minute: 78, team: "KOR", player: "Ahn Jung-hwan" }]],
  [32, [{ minute: 14, team: "POR", player: "Pauleta" }, { minute: 65, team: "POR", player: "Pauleta" }, { minute: 77, team: "POR", player: "Pauleta" }, { minute: 88, team: "POR", player: "Rui Costa" }]],
  [33, [{ minute: 50, team: "GER", player: "Marco Bode" }, { minute: 79, team: "GER", player: "Miroslav Klose" }]],
  [34, [{ minute: 7, team: "IRL", player: "Robbie Keane" }, { minute: 61, team: "IRL", player: "Gary Breen" }, { minute: 87, team: "IRL", player: "Damien Duff" }]],
  [35, [{ minute: 22, team: "DEN", player: "Dennis Rommedahl" }, { minute: 67, team: "DEN", player: "Jon Dahl Tomasson" }]],
  [
    36,
    [
      { minute: 20, team: "SEN", player: "Khalilou Fadiga", detail: "Khalilou Fadiga scores from the penalty spot." },
      { minute: 26, team: "SEN", player: "Papa Bouba Diop" },
      { minute: 38, team: "SEN", player: "Papa Bouba Diop" },
      { minute: 46, team: "URU", player: "Richard Morales" },
      { minute: 69, team: "URU", player: "Diego Forlan" },
      { minute: 88, team: "URU", player: "Alvaro Recoba", detail: "Alvaro Recoba scores from the penalty spot." }
    ]
  ],
  [37, [{ minute: 59, team: "SWE", player: "Anders Svensson" }, { minute: 88, team: "ARG", player: "Hernan Crespo" }]],
  [
    39,
    [
      { minute: 4, team: "ESP", player: "Raul" },
      { minute: 31, team: "RSA", player: "Benni McCarthy" },
      { minute: 45, team: "ESP", player: "Gaizka Mendieta", detail: "Gaizka Mendieta scores from the penalty spot." },
      { minute: 53, team: "RSA", player: "Lucas Radebe" },
      { minute: 56, team: "ESP", player: "Raul" }
    ]
  ],
  [40, [{ minute: 45, team: "SVN", player: "Milenko Acimovic" }, { minute: 65, team: "PAR", player: "Nelson Cuevas" }, { minute: 73, team: "PAR", player: "Jorge Campos" }, { minute: 84, team: "PAR", player: "Nelson Cuevas" }]],
  [42, [{ minute: 6, team: "TUR", player: "Hasan Sas" }, { minute: 9, team: "TUR", player: "Bulent Korkmaz" }, { minute: 85, team: "TUR", player: "Umit Davala" }]],
  [43, [{ minute: 34, team: "MEX", player: "Jared Borgetti" }, { minute: 85, team: "ITA", player: "Alessandro Del Piero" }]],
  [44, [{ minute: 48, team: "ECU", player: "Edison Mendez" }]],
  [45, [{ minute: 48, team: "JPN", player: "Hiroaki Morishima" }, { minute: 75, team: "JPN", player: "Hidetoshi Nakata" }]],
  [
    46,
    [
      { minute: 7, team: "BEL", player: "Johan Walem" },
      { minute: 52, team: "RUS", player: "Vladimir Beschastnykh" },
      { minute: 78, team: "BEL", player: "Wesley Sonck" },
      { minute: 82, team: "BEL", player: "Marc Wilmots" },
      { minute: 88, team: "RUS", player: "Dmitri Sychev" }
    ]
  ],
  [47, [{ minute: 70, team: "KOR", player: "Park Ji-sung" }]],
  [48, [{ minute: 3, team: "POL", player: "Emmanuel Olisadebe" }, { minute: 5, team: "POL", player: "Pawel Kryszalowicz" }, { minute: 66, team: "POL", player: "Marcin Zewlakow" }, { minute: 83, team: "USA", player: "Landon Donovan" }]]
]);

function createSlug(match: FixtureSeed) {
  return `wc-2002-${String(match.no).padStart(2, "0")}-${match.home.toLowerCase()}-${match.away.toLowerCase()}`;
}

function getVenueName(venueId: string) {
  return venues.find((venue) => venue.id === venueId)?.name ?? venueId;
}

function getFixtureGoals(match: FixtureSeed) {
  return match.goals ?? goalOverrides.get(match.no) ?? [];
}

function getHalftimeScore(goals: GoalSeed[] | undefined, home: TeamCode, away: TeamCode): Score {
  return (goals ?? []).reduce(
    (score, goal) => {
      if (goal.minute > 45) return score;
      if (goal.team === home) score.home += 1;
      if (goal.team === away) score.away += 1;
      return score;
    },
    { home: 0, away: 0 }
  );
}

function createGoalEvents(match: FixtureSeed): ReplayEvent[] {
  let homeScore = 0;
  let awayScore = 0;

  return [...getFixtureGoals(match)]
    .sort((a, b) => a.minute - b.minute)
    .map((goal, index) => {
      if (goal.team === match.home) homeScore += 1;
      if (goal.team === match.away) awayScore += 1;

      return {
        id: `goal-${index + 1}`,
        minute: goal.minute,
        type: "goal",
        team: goal.team,
        player: goal.player,
        detail: goal.detail ?? `${goal.player} scores for ${teamNamesByCode[goal.team]}.`,
        scoreAfter: { home: homeScore, away: awayScore }
      };
    });
}

function createEvents(match: FixtureSeed): ReplayEvent[] {
  const venue = getVenueName(match.venueId);
  const goals = getFixtureGoals(match);
  const halftimeScore = getHalftimeScore(goals, match.home, match.away);
  const goalEvents = createGoalEvents(match);
  const resultDetail = `${teamNamesByCode[match.home]} ${match.score.home}-${match.score.away} ${teamNamesByCode[match.away]}${match.note ? ` (${match.note})` : ""}.`;

  return [
    {
      id: "kickoff",
      minute: 0,
      type: "kickoff",
      detail: `${teamNamesByCode[match.home]} and ${teamNamesByCode[match.away]} kick off at ${venue}.`,
      scoreAfter: { home: 0, away: 0 }
    },
    ...goalEvents.filter((event) => event.minute !== null && event.minute <= 45),
    {
      id: "half-time",
      minute: 45,
      type: "half_time",
      detail: `Half-time at ${venue}.`,
      scoreAfter: halftimeScore
    },
    ...goalEvents.filter((event) => event.minute !== null && event.minute > 45),
    {
      id: "full-time",
      minute: Math.max(match.durationMinutes ?? 90, ...goals.map((goal) => goal.minute)),
      type: "full_time",
      detail: `Full time. ${resultDetail}`,
      scoreAfter: match.score
    },
    {
      id: "result",
      minute: null,
      type: "result",
      detail: resultDetail,
      scoreAfter: match.score
    }
  ];
}

const matches: Match[] = fixtureSeeds.map((fixture) => {
  const officialMatchId = `439500${String(fixture.no).padStart(2, "0")}`;
  const highlights = highlightOverrides.get(fixture.no) ?? fifaReportHighlight(officialMatchId);

  return {
    id: createSlug(fixture),
    tournamentId: "wc-2002",
    stage: fixture.stage,
    date: fixture.date,
    venueId: fixture.venueId,
    venue: getVenueName(fixture.venueId),
    home: fixture.home,
    away: fixture.away,
    score: fixture.score,
    shootout: fixture.shootout ?? null,
    highlights,
    highlightUrl: highlights.directUrl ?? highlights.officialUrl,
    highlightEmbeddable: highlights.embeddable,
    events: createEvents(fixture)
  };
});

export const tournaments: Tournament[] = [
  {
    id: "wc-2002",
    competition: "WORLD_CUP",
    name: "Korea/Japan 2002",
    year: 2002,
    hosts: ["KOR", "JPN"],
    teams: [
      "ARG",
      "BEL",
      "BRA",
      "CMR",
      "CHN",
      "CRC",
      "CRO",
      "DEN",
      "ECU",
      "ENG",
      "FRA",
      "GER",
      "IRL",
      "ITA",
      "JPN",
      "KOR",
      "KSA",
      "MEX",
      "NGA",
      "PAR",
      "POL",
      "POR",
      "RSA",
      "RUS",
      "SEN",
      "SVN",
      "ESP",
      "SWE",
      "TUN",
      "TUR",
      "URU",
      "USA"
    ],
    groups: worldCup2002Groups,
    teamCoordinates: worldCup2002TeamCoordinates,
    format: worldCup2002Format,
    stages: ["group", "r16", "qf", "sf", "third", "final"],
    status: "complete",
    mapView: {
      center: [132.7, 36.4],
      zoom: 4.15,
      bearing: -18,
      pitch: 42
    },
    venues,
    featuredRoute: venues.map((venue) => venue.id),
    matches
  },
  worldCup2006
];

export { teamColors, teamFlags, teamNames };
