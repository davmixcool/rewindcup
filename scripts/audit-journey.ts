import { isDeepStrictEqual } from "node:util";
import { teamFlags, tournaments } from "../src/data/tournaments";
import { initialReplayState, replayReducer } from "../src/lib/replay";
import {
  getReplayNavigation,
  getReplaySequenceEntries,
  getTeamMatchResult,
  getTeamRunEntries
} from "../src/lib/tournamentJourney";
import type { ReplayState } from "../src/lib/replay";
import type { Match, Score } from "../src/lib/types";

const errors: string[] = [];
const mediaReports: string[] = [];

function check(condition: unknown, message: string) {
  if (!condition) errors.push(message);
}

function scoresMatch(left: Score | null, right: Score | undefined) {
  return Boolean(left && right && left.home === right.home && left.away === right.away);
}

function playToEnd(match: Match, startingState: ReplayState = initialReplayState) {
  return match.events.reduce((state) => replayReducer(state, { type: "NEXT", match }), startingState);
}

const completeTournaments = tournaments.filter((tournament) => tournament.status === "complete");
check(completeTournaments.length > 0, "No complete tournaments are available for the journey audit.");

for (const tournament of completeTournaments) {
  const tournamentPrefix = tournament.id;
  const venueIds = new Set(tournament.venues.map((venue) => venue.id));
  const usedVenueIds = new Set(tournament.matches.map((match) => match.venueId));
  const tournamentSequence = getReplaySequenceEntries(tournament, null);
  const groupedTeams = tournament.groups.flatMap((group) => group.teams);
  const secondGroupedTeams = tournament.secondGroups?.flatMap((group) => group.teams) ?? [];
  const playableMatches = tournament.matches.filter(
    (match) => match.highlights.status === "embeddable-video" && match.highlights.embeddable && Boolean(match.highlights.embedUrl)
  );
  const videoMatches = tournament.matches.filter(
    (match) => match.highlights.status === "embeddable-video" || match.highlights.status === "external-video"
  );

  mediaReports.push(
    `${tournament.name}: video highlights ${videoMatches.length}/${tournament.matches.length} (${playableMatches.length} embedded)`
  );
  check(
    playableMatches.length === tournament.matches.length,
    `${tournamentPrefix}: expected playable embedded highlights for all ${tournament.matches.length} fixtures, found ${playableMatches.length}.`
  );

  check(
    tournament.matches.length === tournament.format.expectedMatchCount,
    `${tournamentPrefix}: expected ${tournament.format.expectedMatchCount} fixtures, found ${tournament.matches.length}.`
  );
  check(
    tournament.venues.length === tournament.format.expectedVenueCount,
    `${tournamentPrefix}: expected ${tournament.format.expectedVenueCount} stadiums, found ${tournament.venues.length}.`
  );
  check(
    new Set(tournament.teams).size === tournament.teams.length,
    `${tournamentPrefix}: country selection contains duplicates.`
  );
  check(
    groupedTeams.length === tournament.teams.length && new Set(groupedTeams).size === tournament.teams.length,
    `${tournamentPrefix}: groups must contain each tournament team exactly once.`
  );
  check(
    secondGroupedTeams.every((teamCode) => tournament.teams.includes(teamCode)) && new Set(secondGroupedTeams).size === secondGroupedTeams.length,
    `${tournamentPrefix}: second-round groups must contain unique tournament teams.`
  );
  check(
    Boolean(tournament.secondGroups?.length) === (tournament.format.secondGroupMatchesPerTeam !== undefined),
    `${tournamentPrefix}: second-round groups and their expected match count must be configured together.`
  );
  check(
    tournamentSequence.length === tournament.format.expectedMatchCount,
    `${tournamentPrefix}: tournament replay sequence must contain all ${tournament.format.expectedMatchCount} fixtures.`
  );
  check(
    tournamentSequence.every((entry, position) => entry.index === position && entry.match === tournament.matches[position]),
    `${tournamentPrefix}: tournament replay sequence is not in fixture order.`
  );

  for (const teamCode of tournament.teams) {
    const coordinates = tournament.teamCoordinates[teamCode];
    const assignedGroups = tournament.groups.filter((group) => group.teams.includes(teamCode));
    const run = getTeamRunEntries(tournament, teamCode);
    const replaySequence = getReplaySequenceEntries(tournament, teamCode);
    const groupMatches = run.filter(({ match }) => match.stage === "group");
    const secondGroupMatches = run.filter(({ match }) => match.stage === "group2");
    const secondGroupAssignments = tournament.secondGroups?.filter((group) => group.teams.includes(teamCode)) ?? [];
    const teamPrefix = `${tournamentPrefix}/${teamCode}`;

    check(Boolean(teamFlags[teamCode]), `${teamPrefix}: globe marker is missing a flag.`);
    check(Boolean(coordinates), `${teamPrefix}: globe marker is missing coordinates.`);
    if (coordinates) {
      check(coordinates[0] >= -180 && coordinates[0] <= 180, `${teamPrefix}: marker longitude is invalid.`);
      check(coordinates[1] >= -90 && coordinates[1] <= 90, `${teamPrefix}: marker latitude is invalid.`);
    }

    check(assignedGroups.length === 1, `${teamPrefix}: expected exactly one group assignment, found ${assignedGroups.length}.`);
    check(
      groupMatches.length === tournament.format.groupMatchesPerTeam,
      `${teamPrefix}: expected ${tournament.format.groupMatchesPerTeam} group-stage fixtures, found ${groupMatches.length}.`
    );
    check(
      secondGroupAssignments.length <= 1,
      `${teamPrefix}: expected at most one second-round group assignment, found ${secondGroupAssignments.length}.`
    );
    check(
      secondGroupMatches.length === (secondGroupAssignments.length > 0 ? tournament.format.secondGroupMatchesPerTeam ?? 0 : 0),
      `${teamPrefix}: second-group-stage fixture count does not match its assignment.`
    );
    check(
      run.length >= tournament.format.groupMatchesPerTeam,
      `${teamPrefix}: team run is shorter than its group-stage schedule.`
    );
    check(
      replaySequence.every((entry, position) => entry.index === run[position]?.index),
      `${teamPrefix}: replay sequence does not match the team run.`
    );

    const firstNavigation = getReplayNavigation(replaySequence, replaySequence[0]?.index ?? null);
    const lastNavigation = getReplayNavigation(replaySequence, replaySequence.at(-1)?.index ?? null);
    check(!firstNavigation.previous, `${teamPrefix}: first replay fixture incorrectly has a previous fixture.`);
    check(
      replaySequence.length < 2 || firstNavigation.next?.index === replaySequence[1].index,
      `${teamPrefix}: first replay fixture does not advance to the second fixture.`
    );
    check(!lastNavigation.next, `${teamPrefix}: last replay fixture incorrectly has a next fixture.`);
    check(
      replaySequence.length < 2 || lastNavigation.previous?.index === replaySequence.at(-2)?.index,
      `${teamPrefix}: last replay fixture does not return to the previous fixture.`
    );

    for (let index = 1; index < run.length; index += 1) {
      check(run[index - 1].match.date <= run[index].match.date, `${teamPrefix}: team run is not chronological.`);
    }
  }

  for (const match of tournament.matches) {
    check(venueIds.has(match.venueId), `${match.id}: fixture cannot focus a known stadium.`);

    const liveScoreEndState = playToEnd(match);
    check(liveScoreEndState.cursor === match.events.length - 1, `${match.id}: replay did not reach its last event.`);
    check(liveScoreEndState.status === "full_time", `${match.id}: replay did not finish at full time.`);
    check(scoresMatch(liveScoreEndState.visibleScore, match.score), `${match.id}: live replay finished with the wrong score.`);

    let blackoutState = replayReducer(initialReplayState, { type: "TOGGLE_MODE", match });
    blackoutState = playToEnd(match, blackoutState);
    check(scoresMatch(blackoutState.visibleScore, match.score), `${match.id}: blackout replay did not reveal the final score.`);

    let modeToggleState = replayReducer(initialReplayState, { type: "NEXT", match });
    const expectedVisibleScore = match.events[modeToggleState.cursor]?.scoreAfter;
    modeToggleState = replayReducer(modeToggleState, { type: "TOGGLE_MODE", match });
    check(modeToggleState.visibleScore === null, `${match.id}: blackout mode exposed the score before full time.`);
    modeToggleState = replayReducer(modeToggleState, { type: "TOGGLE_MODE", match });
    check(
      scoresMatch(modeToggleState.visibleScore, expectedVisibleScore),
      `${match.id}: returning to live-score mode did not restore the current score.`
    );

    const resetState = replayReducer(liveScoreEndState, { type: "RESET" });
    check(isDeepStrictEqual(resetState, initialReplayState), `${match.id}: replay reset did not restore the initial state.`);
  }

  for (const match of tournament.matches.filter((entry) => entry.shootout)) {
    check(getTeamMatchResult(match, match.home) !== "D", `${match.id}: home shootout result is incorrectly recorded as a draw.`);
    check(getTeamMatchResult(match, match.away) !== "D", `${match.id}: away shootout result is incorrectly recorded as a draw.`);
  }

  for (const venue of tournament.venues) {
    check(usedVenueIds.has(venue.id), `${tournamentPrefix}/${venue.id}: stadium is not reachable from any fixture.`);
  }
}

for (const report of mediaReports) console.log(report);

if (errors.length > 0) {
  console.error(`Journey audit failed with ${errors.length} issue(s).`);
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

const teamCount = completeTournaments.reduce((count, tournament) => count + tournament.teams.length, 0);
const matchCount = completeTournaments.reduce((count, tournament) => count + tournament.matches.length, 0);
const venueCount = completeTournaments.reduce((count, tournament) => count + tournament.venues.length, 0);
console.log(
  `Journey audit passed: ${completeTournaments.length} tournament(s), ${teamCount} team entries, ${matchCount} fixtures, ${venueCount} stadiums.`
);
