import { CheckCircle2, Clock3, MapPin, PlayCircle } from "lucide-react";
import { teamColors, teamFlags, teamNames } from "@/data/tournaments";
import type { ReplayResume } from "@/lib/preferences";
import { getTeamMatchResult, type IndexedMatch } from "@/lib/tournamentJourney";
import type { Match, TeamCode, Tournament } from "@/lib/types";

type TeamJourneyProps = {
  allEntries: IndexedMatch[];
  completedMatchIds: string[];
  finishLabel: string;
  group?: string;
  onOpenMatch: (index: number) => void;
  onPreviewMatch: (index: number) => void;
  resume: ReplayResume | null;
  selectedMatchIndex: number | null;
  teamCode: TeamCode;
  tournament: Tournament;
  visibleEntries: IndexedMatch[];
};

const stageLabels: Record<Match["stage"], string> = {
  group: "Group stage",
  group2: "Second group stage",
  r32: "Round of 32",
  r16: "Round of 16",
  qf: "Quarter-final",
  sf: "Semi-final",
  third: "Third place",
  final: "Final"
};

function formatScore(match: Match) {
  const score = `${match.score.home}-${match.score.away}`;
  return match.shootout ? `${score} (${match.shootout.home}-${match.shootout.away} pens)` : score;
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "short",
    timeZone: "UTC"
  }).format(new Date(`${date}T00:00:00Z`));
}

function getDistanceKilometers(entries: IndexedMatch[], tournament: Tournament) {
  const coordinates = entries.flatMap(({ match }) => {
    const venue = tournament.venues.find((entry) => entry.id === match.venueId);
    return venue ? [venue.coordinates] : [];
  });

  return coordinates.slice(1).reduce((distance, coordinatesTo, index) => {
    const coordinatesFrom = coordinates[index];
    const toRadians = (degrees: number) => degrees * (Math.PI / 180);
    const latitudeDelta = toRadians(coordinatesTo[1] - coordinatesFrom[1]);
    const longitudeDelta = toRadians(coordinatesTo[0] - coordinatesFrom[0]);
    const latitudeFrom = toRadians(coordinatesFrom[1]);
    const latitudeTo = toRadians(coordinatesTo[1]);
    const haversine = Math.sin(latitudeDelta / 2) ** 2
      + Math.cos(latitudeFrom) * Math.cos(latitudeTo) * Math.sin(longitudeDelta / 2) ** 2;

    return distance + 6371 * 2 * Math.atan2(Math.sqrt(haversine), Math.sqrt(1 - haversine));
  }, 0);
}

function getMatchActionLabel(
  match: Match,
  completedMatchIds: string[],
  resume: ReplayResume | null
) {
  if (completedMatchIds.includes(match.id)) return "Replay completed";
  if (resume?.matchId === match.id && resume.cursor >= 0) return `Resume at moment ${resume.cursor + 1}`;
  if (match.highlights.status === "embeddable-video") return "Watch highlights";
  if (match.highlights.status === "external-video") return "Open video replay";
  if (match.highlights.status === "official-report") return "Open match report";
  return "Replay match";
}

export function TeamJourney({
  allEntries,
  completedMatchIds,
  finishLabel,
  group,
  onOpenMatch,
  onPreviewMatch,
  resume,
  selectedMatchIndex,
  teamCode,
  tournament,
  visibleEntries
}: TeamJourneyProps) {
  const record = allEntries.reduce(
    (totals, { match }) => {
      const result = getTeamMatchResult(match, teamCode);
      totals[result] += 1;
      const isHome = match.home === teamCode;
      totals.goalsFor += isHome ? match.score.home : match.score.away;
      totals.goalsAgainst += isHome ? match.score.away : match.score.home;
      return totals;
    },
    { D: 0, L: 0, W: 0, goalsAgainst: 0, goalsFor: 0 }
  );
  const cities = new Set(allEntries.map(({ match }) => (
    tournament.venues.find((venue) => venue.id === match.venueId)?.city ?? match.venue
  ))).size;
  const distance = Math.round(getDistanceKilometers(allEntries, tournament) / 10) * 10;
  const completedCount = allEntries.filter(({ match }) => completedMatchIds.includes(match.id)).length;
  const journeyContext = [group ? `Group ${group}` : null, finishLabel].filter(Boolean).join(" · ");

  return (
    <>
      <section aria-label={`${teamNames[teamCode]} journey summary`} className="team-journey-summary">
        <div className="team-journey-identity">
          <span aria-hidden="true" className="team-journey-flag" style={{ backgroundColor: teamColors[teamCode] }}>
            <img alt="" src={teamFlags[teamCode]} />
          </span>
          <span>
            <small>Team journey</small>
            <strong>{teamNames[teamCode]}</strong>
            <em>{journeyContext}</em>
          </span>
        </div>
        <dl className="team-journey-stats">
          <div><dt>Record</dt><dd>{record.W}W {record.D}D {record.L}L</dd></div>
          <div><dt>Goals</dt><dd>{record.goalsFor}-{record.goalsAgainst}</dd></div>
          <div><dt>Cities</dt><dd>{cities}</dd></div>
          <div><dt>Route</dt><dd>{distance.toLocaleString("en")} km</dd></div>
        </dl>
        <div className="team-journey-progress">
          <span><CheckCircle2 aria-hidden="true" size={14} /> {completedCount} of {allEntries.length} replays completed</span>
          <span>{tournament.status === "partial" ? "Tournament in progress" : finishLabel}</span>
        </div>
      </section>

      <ol aria-label={`Chronological ${teamNames[teamCode]} journey`} className="team-journey-list">
        {visibleEntries.map(({ match, index }) => {
          const journeyIndex = allEntries.findIndex((entry) => entry.index === index);
          const venue = tournament.venues.find((entry) => entry.id === match.venueId);
          const opponent = match.home === teamCode ? match.away : match.home;
          const result = getTeamMatchResult(match, teamCode);
          const isCompleted = completedMatchIds.includes(match.id);
          const actionLabel = getMatchActionLabel(match, completedMatchIds, resume);

          return (
            <li className={`team-journey-stop result-${result.toLowerCase()} ${isCompleted ? "is-completed" : ""}`} key={match.id}>
              <span aria-hidden="true" className="team-journey-marker">{journeyIndex + 1}</span>
              <button
                aria-current={index === selectedMatchIndex ? "true" : undefined}
                className={`tray-fixture-row ${index === selectedMatchIndex ? "active" : ""}`}
                onClick={() => onOpenMatch(index)}
                onFocus={() => onPreviewMatch(index)}
                onMouseEnter={() => onPreviewMatch(index)}
                type="button"
              >
                <span className={`team-journey-result result-${result.toLowerCase()}`}>{result}</span>
                <span className="tray-fixture-copy">
                  <span className="team-journey-stage">Stop {journeyIndex + 1} · {stageLabels[match.stage]} · {formatDate(match.date)}</span>
                  <strong>
                    <span>{teamNames[teamCode]}</span>
                    <b>{formatScore(match)}</b>
                    <span>{teamNames[opponent]}</span>
                  </strong>
                  <small className="fixture-meta">
                    <span><MapPin aria-hidden="true" size={12} /> {venue?.name ?? match.venue}, {venue?.city ?? match.venue}</span>
                    <em className={`journey-action ${isCompleted ? "is-completed" : ""}`}>
                      {isCompleted ? <CheckCircle2 aria-hidden="true" size={11} /> : resume?.matchId === match.id ? <Clock3 aria-hidden="true" size={11} /> : <PlayCircle aria-hidden="true" size={11} />}
                      {actionLabel}
                    </em>
                  </small>
                </span>
              </button>
            </li>
          );
        })}
      </ol>
    </>
  );
}
