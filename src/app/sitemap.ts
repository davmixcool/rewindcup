import type { MetadataRoute } from "next";
import { tournaments } from "@/data/tournaments";
import { getMatchPath, getTeamPath, getTournamentPath } from "@/lib/experienceNavigation";
import { siteUrl } from "@/lib/siteMetadata";

function absoluteUrl(pathname: string) {
  return new URL(pathname, siteUrl).toString();
}

export default function sitemap(): MetadataRoute.Sitemap {
  const archiveEntries: MetadataRoute.Sitemap = tournaments.flatMap((tournament) => {
    const tournamentEntry: MetadataRoute.Sitemap[number] = {
      url: absoluteUrl(getTournamentPath(tournament)),
      changeFrequency: tournament.status === "partial" ? "daily" : "monthly",
      priority: 0.9
    };

    const teamEntries: MetadataRoute.Sitemap = tournament.teams.map((teamCode) => ({
      url: absoluteUrl(getTeamPath(tournament, teamCode)),
      changeFrequency: tournament.status === "partial" ? "daily" : "yearly",
      priority: 0.7
    }));

    const matchEntries: MetadataRoute.Sitemap = tournament.matches.map((match) => ({
      url: absoluteUrl(getMatchPath(tournament, match)),
      changeFrequency: tournament.status === "partial" ? "daily" : "yearly",
      priority: 0.6
    }));

    return [tournamentEntry, ...teamEntries, ...matchEntries];
  });

  return [
    {
      url: siteUrl.toString(),
      changeFrequency: "weekly",
      priority: 1
    },
    ...archiveEntries
  ];
}
