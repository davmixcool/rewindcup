import type { Match, TeamCode, Tournament } from "./types";

export type IndexedMatch = {
  index: number;
  match: Match;
};

export function getTeamMatchResult(match: Match, teamCode: TeamCode) {
  const isHome = match.home === teamCode;
  const teamScore = isHome ? match.score.home : match.score.away;
  const opponentScore = isHome ? match.score.away : match.score.home;

  if (teamScore > opponentScore) return "W";
  if (teamScore < opponentScore) return "L";

  if (match.shootout) {
    const teamShootoutScore = isHome ? match.shootout.home : match.shootout.away;
    const opponentShootoutScore = isHome ? match.shootout.away : match.shootout.home;

    if (teamShootoutScore > opponentShootoutScore) return "W";
    if (teamShootoutScore < opponentShootoutScore) return "L";
  }

  return "D";
}

export function getTeamRunEntries(tournament: Tournament, teamCode: TeamCode): IndexedMatch[] {
  return tournament.matches
    .map((match, index) => ({ match, index }))
    .filter(({ match }) => match.home === teamCode || match.away === teamCode);
}

export function getReplaySequenceEntries(tournament: Tournament, teamCode: TeamCode | null): IndexedMatch[] {
  if (teamCode) return getTeamRunEntries(tournament, teamCode);
  return tournament.matches.map((match, index) => ({ match, index }));
}

export function getReplayNavigation(entries: IndexedMatch[], selectedMatchIndex: number | null) {
  const position = entries.findIndex((entry) => entry.index === selectedMatchIndex);

  return {
    position,
    previous: position > 0 ? entries[position - 1] : undefined,
    next: position >= 0 && position < entries.length - 1 ? entries[position + 1] : undefined
  };
}
