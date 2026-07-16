import type { Metadata } from "next";
import { ReplayApp } from "@/components/ReplayApp";
import { teamNames, tournaments } from "@/data/tournaments";
import { getMatchPath, getTeamPath, getTournamentPath } from "@/lib/experienceNavigation";
import { siteName, socialImages } from "@/lib/siteMetadata";
import type { TeamCode } from "@/lib/types";

type WorldCupPageProps = {
  params: Promise<{
    year: string;
    selection?: string[];
  }>;
};

export async function generateMetadata({ params }: WorldCupPageProps): Promise<Metadata> {
  const { year, selection = [] } = await params;
  const tournament = tournaments.find((entry) => entry.year === Number(year));

  if (!tournament) {
    return {
      title: "World Cup archive",
      description: "Explore World Cup tournaments, fixtures, stadium journeys, match events and playable highlights."
    };
  }

  let title = tournament.name;
  let description = `Relive ${tournament.name} through its teams, fixtures, stadium journeys, match events and playable highlights.`;
  let canonicalPath = getTournamentPath(tournament);

  if (selection[0] === "teams" && selection[1]) {
    const teamCode = selection[1].toUpperCase() as TeamCode;

    if (tournament.teams.includes(teamCode)) {
      title = `${teamNames[teamCode]} at ${tournament.name}`;
      description = `Follow ${teamNames[teamCode]}'s complete ${tournament.name} journey through every fixture, stadium, match event and highlight.`;
      canonicalPath = getTeamPath(tournament, teamCode);
    }
  }

  if (selection[0] === "matches" && selection[1]) {
    const match = tournament.matches.find((entry) => entry.id === selection[1]);

    if (match) {
      title = `${teamNames[match.home]} vs ${teamNames[match.away]} — ${tournament.name}`;
      description = `Replay ${teamNames[match.home]} vs ${teamNames[match.away]} at ${match.venue}, with match events and playable highlights.`;
      canonicalPath = getMatchPath(tournament, match);
    }
  }

  const socialTitle = `${title} | ${siteName}`;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalPath
    },
    openGraph: {
      type: "website",
      locale: "en_US",
      url: canonicalPath,
      siteName,
      title: socialTitle,
      description,
      images: socialImages
    },
    twitter: {
      card: "summary_large_image",
      creator: "@iamdavidoti",
      title: socialTitle,
      description,
      images: socialImages
    }
  };
}

export default function WorldCupExperiencePage() {
  return <ReplayApp />;
}
