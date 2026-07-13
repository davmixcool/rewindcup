import { tournaments } from "@/data/tournaments";
import type { Match, TeamCode, Tournament } from "@/lib/types";

export type ExperienceLocation = {
  matchIndex: number | null;
  teamCode: TeamCode | null;
  tournamentIndex: number;
};

export function getTournamentPath(tournament: Tournament) {
  return `/world-cups/${tournament.year}`;
}

export function getTeamPath(tournament: Tournament, teamCode: TeamCode) {
  return `${getTournamentPath(tournament)}/teams/${teamCode}`;
}

export function getMatchPath(tournament: Tournament, match: Match) {
  return `${getTournamentPath(tournament)}/matches/${match.id}`;
}

export function parseExperiencePath(pathname: string): ExperienceLocation | null {
  const segments = pathname.split("/").filter(Boolean).map(decodeURIComponent);
  if (segments[0] !== "world-cups" || !segments[1]) return null;

  const year = Number(segments[1]);
  const tournamentIndex = tournaments.findIndex((tournament) => tournament.year === year);
  const tournament = tournaments[tournamentIndex];
  if (!tournament) return null;

  if (segments.length === 2) {
    return { matchIndex: null, teamCode: null, tournamentIndex };
  }

  if (segments[2] === "teams" && segments[3]) {
    const teamCode = segments[3].toUpperCase() as TeamCode;
    if (!tournament.teams.includes(teamCode)) return null;
    return { matchIndex: null, teamCode, tournamentIndex };
  }

  if (segments[2] === "matches" && segments[3]) {
    const matchIndex = tournament.matches.findIndex((match) => match.id === segments[3]);
    if (matchIndex < 0) return null;
    return { matchIndex, teamCode: null, tournamentIndex };
  }

  return null;
}
