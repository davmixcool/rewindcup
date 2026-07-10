import { isDeepStrictEqual } from "node:util";
import { teamFlags, tournaments } from "../src/data/tournaments";
import {
  worldCup2002GroupAssignments,
  worldCup2002GroupOrder,
  worldCup2002TeamCoordinates
} from "../src/data/worldCup2002Experience";
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

function check(condition: unknown, message: string) {
  if (!condition) errors.push(message);
}

function scoresMatch(left: Score | null, right: Score | undefined) {
  return Boolean(left && right && left.home === right.home && left.away === right.away);
}

function playToEnd(match: Match, startingState: ReplayState = initialReplayState) {
  return match.events.reduce((state) => replayReducer(state, { type: "NEXT", match }), startingState);
}

const tournament = tournaments.find((entry) => entry.id === "wc-2002");

if (!tournament) {
  errors.push("The Korea/Japan 2002 tournament is missing.");
} else {
  check(tournament.competition === "WORLD_CUP", `${tournament.id}: the journey must be World Cup-only.`);
  check(tournament.teams.length === 32, `${tournament.id}: expected 32 selectable countries.`);
  check(new Set(tournament.teams).size === tournament.teams.length, `${tournament.id}: country selection contains duplicates.`);

  const groupCounts = new Map(worldCup2002GroupOrder.map((group) => [group, 0]));
  const venueIds = new Set(tournament.venues.map((venue) => venue.id));
  const usedVenueIds = new Set(tournament.matches.map((match) => match.venueId));
  const tournamentSequence = getReplaySequenceEntries(tournament, null);

  check(tournamentSequence.length === 64, `${tournament.id}: tournament replay sequence must contain all 64 fixtures.`);
  check(
    tournamentSequence.every((entry, position) => entry.index === position && entry.match === tournament.matches[position]),
    `${tournament.id}: tournament replay sequence is not in fixture order.`
  );

  for (const teamCode of tournament.teams) {
    const coordinates = worldCup2002TeamCoordinates[teamCode];
    const group = worldCup2002GroupAssignments[teamCode];
    const run = getTeamRunEntries(tournament, teamCode);
    const replaySequence = getReplaySequenceEntries(tournament, teamCode);
    const groupMatches = run.filter(({ match }) => match.stage === "group");

    check(Boolean(teamFlags[teamCode]), `${teamCode}: globe marker is missing a flag.`);
    check(Boolean(coordinates), `${teamCode}: globe marker is missing coordinates.`);
    if (coordinates) {
      check(coordinates[0] >= -180 && coordinates[0] <= 180, `${teamCode}: marker longitude is invalid.`);
      check(coordinates[1] >= -90 && coordinates[1] <= 90, `${teamCode}: marker latitude is invalid.`);
    }

    check(Boolean(group), `${teamCode}: group assignment is missing.`);
    if (group) groupCounts.set(group, (groupCounts.get(group) ?? 0) + 1);

    check(groupMatches.length === 3, `${teamCode}: expected 3 group-stage fixtures, found ${groupMatches.length}.`);
    check(run.length >= 3, `${teamCode}: team run must contain at least 3 fixtures.`);
    check(
      replaySequence.every((entry, position) => entry.index === run[position]?.index),
      `${teamCode}: replay sequence does not match the team run.`
    );

    const firstNavigation = getReplayNavigation(replaySequence, replaySequence[0]?.index ?? null);
    const lastNavigation = getReplayNavigation(replaySequence, replaySequence.at(-1)?.index ?? null);
    check(!firstNavigation.previous, `${teamCode}: first replay fixture incorrectly has a previous fixture.`);
    check(
      replaySequence.length < 2 || firstNavigation.next?.index === replaySequence[1].index,
      `${teamCode}: first replay fixture does not advance to the second fixture.`
    );
    check(!lastNavigation.next, `${teamCode}: last replay fixture incorrectly has a next fixture.`);
    check(
      replaySequence.length < 2 || lastNavigation.previous?.index === replaySequence.at(-2)?.index,
      `${teamCode}: last replay fixture does not return to the previous fixture.`
    );

    for (let index = 1; index < run.length; index += 1) {
      check(run[index - 1].match.date <= run[index].match.date, `${teamCode}: team run is not chronological.`);
    }
  }

  for (const group of worldCup2002GroupOrder) {
    check(groupCounts.get(group) === 4, `Group ${group}: expected 4 countries, found ${groupCounts.get(group) ?? 0}.`);
  }

  for (const match of tournament.matches) {
    check(venueIds.has(match.venueId), `${match.id}: fixture cannot focus a known stadium.`);
    check(
      match.highlights.status === "embeddable-video" && match.highlights.embeddable && Boolean(match.highlights.embedUrl),
      `${match.id}: fixture replay does not have a playable embedded highlight.`
    );

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
    check(usedVenueIds.has(venue.id), `${venue.id}: stadium is not reachable from any fixture.`);
  }
}

if (errors.length > 0) {
  console.error(`Journey audit failed with ${errors.length} issue(s).`);
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(
  `Journey audit passed: ${tournament?.teams.length ?? 0} countries, ${tournament?.matches.length ?? 0} fixtures, ${tournament?.venues.length ?? 0} stadiums.`
);
