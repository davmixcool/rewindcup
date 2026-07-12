import type { MatchHighlights } from "@/lib/types";

export function createYoutubeHighlight(videoId: string, officialUrl: string, sourceName: string): MatchHighlights {
  return {
    status: "embeddable-video",
    officialUrl,
    officialSourceName: "FIFA match report",
    directUrl: `https://www.youtube.com/watch?v=${videoId}`,
    embedUrl: `https://www.youtube.com/embed/${videoId}`,
    provider: "youtube",
    providerVideoId: videoId,
    embeddable: true,
    sourceName
  };
}

export function createOfficialReportHighlight(officialUrl: string): MatchHighlights {
  return {
    status: "official-report",
    officialUrl,
    officialSourceName: "FIFA match report",
    embeddable: false,
    sourceName: "FIFA match report"
  };
}
