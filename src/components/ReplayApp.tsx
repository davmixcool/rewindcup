"use client";

import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Clapperboard,
  Globe2,
  Pause,
  Play,
  RotateCcw,
  Settings,
  SkipForward,
  Trophy,
  Users,
  X
} from "lucide-react";
import { useEffect, useMemo, useReducer, useRef, useState } from "react";
import { teamColors, teamFlags, teamNames, tournaments } from "@/data/tournaments";
import {
  worldCup2002GroupAssignments,
  worldCup2002GroupOrder,
  worldCup2002TeamCoordinates
} from "@/data/worldCup2002Experience";
import { HostMap } from "@/components/HostMap";
import { initialReplayState, replayReducer } from "@/lib/replay";
import {
  getReplayNavigation,
  getReplaySequenceEntries,
  getTeamMatchResult,
  getTeamRunEntries
} from "@/lib/tournamentJourney";
import type { Coordinates, Match, ReplayEvent, TeamCode } from "@/lib/types";

type MapMode = "world" | "flight" | "host" | "stadium";
type RailMode = "library" | "tournamentSetup" | "run";
type TrayMenu = "tournaments" | "teams" | "fixtures" | "replay" | "settings" | null;
type FixtureStageFilter = "all" | Match["stage"];
type FixtureMediaFilter = "all" | "playable" | "reports";
type OpenFixtureOptions = {
  nextMode?: MapMode;
  openMatch?: boolean;
  resetPlayback?: boolean;
  trayMenu?: TrayMenu;
};

const stageRank: Record<Match["stage"], number> = {
  group: 0,
  r16: 1,
  qf: 2,
  sf: 3,
  third: 4,
  final: 5
};

const DEFAULT_WORLD_MAP_VIEW = {
  center: [31, 8],
  zoom: 2.28,
  bearing: 0,
  pitch: 0
} satisfies {
  center: Coordinates;
  zoom: number;
  bearing: number;
  pitch: number;
};

function TeamFlag({ code }: { code: Match["home"] }) {
  return (
    <span className="flag-icon-frame" style={{ backgroundColor: teamColors[code] }}>
      <img alt={`${teamNames[code]} flag`} className="flag-icon" src={teamFlags[code]} />
    </span>
  );
}

function TeamBadge({ code }: { code: Match["home"] }) {
  return (
    <div className="team-badge">
      <TeamFlag code={code} />
      <span>{teamNames[code]}</span>
    </div>
  );
}

function formatClock(event: ReplayEvent | undefined, status: string) {
  if (!event) return "Ready";
  if (status === "break") return "Half-time";
  if (status === "full_time") return "Full time";
  return `${event.minute}'`;
}

function getStageLabel(stage: Match["stage"]) {
  const labels: Record<Match["stage"], string> = {
    group: "Group stage",
    r16: "Round of 16",
    qf: "Quarter-final",
    sf: "Semi-final",
    third: "Third place",
    final: "Final"
  };

  return labels[stage];
}

function easeInOutCubic(progress: number) {
  return progress < 0.5 ? 4 * progress * progress * progress : 1 - Math.pow(-2 * progress + 2, 3) / 2;
}

function getPlayableEmbedUrl(embedUrl: string) {
  const separator = embedUrl.includes("?") ? "&" : "?";
  return `${embedUrl}${separator}enablejsapi=1&playsinline=1&rel=0`;
}

function formatFinalScore(match: Match) {
  const baseScore = `${match.score.home}-${match.score.away}`;
  return match.shootout ? `${baseScore} (${match.shootout.home}-${match.shootout.away} pens)` : baseScore;
}

function getHighlightStatusLabel(status: Match["highlights"]["status"]) {
  const labels: Record<Match["highlights"]["status"], string> = {
    none: "No media",
    "official-report": "Report",
    "external-video": "Video link",
    "embeddable-video": "Playable"
  };

  return labels[status];
}

function getHighlightEmptyCopy(match: Match) {
  if (match.highlights.status === "official-report") {
    return "No verified embeddable video yet. The official match report is available below.";
  }

  if (match.highlights.status === "external-video") {
    return "A video link is available below, but it is not verified as embeddable yet.";
  }

  return "No highlight media has been verified for this fixture yet.";
}

function matchesFixtureMediaFilter(match: Match, filter: FixtureMediaFilter) {
  if (filter === "playable") return match.highlights.status === "embeddable-video";
  if (filter === "reports") return match.highlights.status === "official-report";
  return true;
}

function getTeamFinishLabel(teamCode: TeamCode, matches: Match[]) {
  const lastMatch = matches.at(-1);
  if (!lastMatch) return "No run";

  if (lastMatch.stage === "final") {
    return getTeamMatchResult(lastMatch, teamCode) === "W" ? "Champion" : "Runner-up";
  }

  if (lastMatch.stage === "third") {
    return getTeamMatchResult(lastMatch, teamCode) === "W" ? "Third place" : "Fourth place";
  }

  const bestStage = matches.reduce((best, match) => (stageRank[match.stage] > stageRank[best] ? match.stage : best), matches[0].stage);
  return getStageLabel(bestStage);
}

export function ReplayApp() {
  const [selectedTournamentIndex, setSelectedTournamentIndex] = useState<number | null>(null);
  const tournament = selectedTournamentIndex === null ? null : tournaments[selectedTournamentIndex] ?? null;
  const mapView = tournament?.mapView ?? DEFAULT_WORLD_MAP_VIEW;
  const [state, dispatch] = useReducer(replayReducer, initialReplayState);
  const [railMode, setRailMode] = useState<RailMode>("library");
  const [selectedTeam, setSelectedTeam] = useState<TeamCode | null>(null);
  const [selectedMatchIndex, setSelectedMatchIndex] = useState<number | null>(null);
  const match = tournament && selectedMatchIndex !== null ? tournament.matches[selectedMatchIndex] ?? null : null;
  const [mapMode, setMapMode] = useState<MapMode>("world");
  const [isMatchOpen, setIsMatchOpen] = useState(false);
  const [isTournamentMenuOpen, setIsTournamentMenuOpen] = useState(false);
  const [activeTrayMenu, setActiveTrayMenu] = useState<TrayMenu>(null);
  const [fixtureStageFilter, setFixtureStageFilter] = useState<FixtureStageFilter>("all");
  const [fixtureMediaFilter, setFixtureMediaFilter] = useState<FixtureMediaFilter>("all");
  const [showLandingConfetti, setShowLandingConfetti] = useState(false);
  const [showCountryFlags, setShowCountryFlags] = useState(true);
  const [enableGlobeSpin, setEnableGlobeSpin] = useState(true);
  const [selectedVenueId, setSelectedVenueId] = useState<string | undefined>(undefined);
  const [routeTravelProgress, setRouteTravelProgress] = useState(0);
  const [tournamentFlightProgress, setTournamentFlightProgress] = useState(0);
  const routeTravelProgressRef = useRef(0);
  const tournamentFlightProgressRef = useRef(0);
  const landingTimerRef = useRef<number | null>(null);
  const highlightFrameRef = useRef<HTMLIFrameElement | null>(null);

  const currentEvent = match?.events[state.cursor];
  const teamRunOptions = useMemo(
    () => {
      if (!tournament) return [];

      return tournament.teams.map((teamCode) => {
        const matches = getTeamRunEntries(tournament, teamCode);
        const record = matches.reduce(
          (totals, { match: runMatch }) => {
            const result = getTeamMatchResult(runMatch, teamCode);
            if (result === "W") totals.wins += 1;
            if (result === "D") totals.draws += 1;
            if (result === "L") totals.losses += 1;

            return totals;
          },
          { wins: 0, draws: 0, losses: 0 }
        );
        const finishLabel = getTeamFinishLabel(teamCode, matches.map(({ match: runMatch }) => runMatch));

        return {
          teamCode,
          matches,
          group: worldCup2002GroupAssignments[teamCode],
          record,
          finishLabel
        };
      });
    },
    [tournament]
  );
  const selectedRunEntries = useMemo(
    () => {
      if (!selectedTeam || !tournament) return [];

      return getTeamRunEntries(tournament, selectedTeam);
    },
    [selectedTeam, tournament]
  );
  const fixtureBaseEntries = useMemo(
    () =>
      !tournament ? [] : getReplaySequenceEntries(tournament, selectedTeam),
    [selectedTeam, tournament]
  );
  const visibleFixtureEntries = useMemo(
    () =>
      fixtureBaseEntries.filter(({ match: runMatch }) => {
        const matchesStage = fixtureStageFilter === "all" || runMatch.stage === fixtureStageFilter;
        return matchesStage && matchesFixtureMediaFilter(runMatch, fixtureMediaFilter);
      }),
    [fixtureBaseEntries, fixtureMediaFilter, fixtureStageFilter]
  );
  const fixtureMediaCounts = useMemo(
    () =>
      fixtureBaseEntries.reduce(
        (counts, { match: runMatch }) => {
          counts.all += 1;
          if (runMatch.highlights.status === "embeddable-video") counts.playable += 1;
          if (runMatch.highlights.status === "official-report") counts.reports += 1;

          return counts;
        },
        { all: 0, playable: 0, reports: 0 }
      ),
    [fixtureBaseEntries]
  );
  const fixtureMediaFilterOptions = useMemo(() => {
    const filters: { label: string; value: FixtureMediaFilter }[] = [
      { label: `All ${fixtureMediaCounts.all}`, value: "all" }
    ];

    if (fixtureMediaCounts.playable > 0 && fixtureMediaCounts.playable < fixtureMediaCounts.all) {
      filters.push({ label: `Playable ${fixtureMediaCounts.playable}`, value: "playable" });
    }

    if (fixtureMediaCounts.reports > 0) {
      filters.push({ label: `Reports ${fixtureMediaCounts.reports}`, value: "reports" });
    }

    return filters;
  }, [fixtureMediaCounts]);
  const countryMarkers = useMemo(
    () =>
      !tournament
        ? []
        : tournament.teams.map((teamCode) => ({
        code: teamCode,
        color: teamColors[teamCode],
        coordinates: worldCup2002TeamCoordinates[teamCode],
        flagSrc: teamFlags[teamCode],
        name: teamNames[teamCode]
      })),
    [tournament]
  );
  const groupedTeamRunOptions = useMemo(
    () =>
      worldCup2002GroupOrder.map((group) => ({
        group,
        teams: teamRunOptions.filter((option) => option.group === group)
      })),
    [teamRunOptions]
  );
  const routeVenueIds = useMemo(
    () => selectedRunEntries.map(({ match: runMatch }) => runMatch.venueId),
    [selectedRunEntries]
  );
  const replaySequenceEntries = useMemo(
    () =>
      !tournament ? [] : getReplaySequenceEntries(tournament, selectedTeam),
    [selectedTeam, tournament]
  );
  const replayNavigation = useMemo(
    () => getReplayNavigation(replaySequenceEntries, selectedMatchIndex),
    [replaySequenceEntries, selectedMatchIndex]
  );
  const replaySequenceIndex = replayNavigation.position;
  const previousReplayEntry = replayNavigation.previous;
  const nextReplayEntry = replayNavigation.next;
  const replayScopeLabel = selectedTeam ? `${teamNames[selectedTeam]} run` : "Tournament";
  const matchVenue = useMemo(
    () => (tournament && match ? tournament.venues.find((venue) => venue.id === match.venueId) : undefined),
    [match, tournament]
  );
  const routeProgress = useMemo(() => {
    if (selectedMatchIndex === null) return 0;

    const routeIndex = Math.max(selectedRunEntries.findIndex((entry) => entry.index === selectedMatchIndex), 0);
    return routeIndex / Math.max(routeVenueIds.length - 1, 1);
  }, [routeVenueIds.length, selectedMatchIndex, selectedRunEntries]);
  const revealedEvents = useMemo(
    () => (match ? match.events.slice(0, Math.max(state.cursor + 1, 0)) : []),
    [match, state.cursor]
  );

  const visibleScore = state.visibleScore;
  const progress = match ? ((state.cursor + 1) / match.events.length) * 100 : 0;
  const isFinished = state.status === "full_time";
  const highlightEmbedUrl = match?.highlights.embedUrl ? getPlayableEmbedUrl(match.highlights.embedUrl) : null;

  useEffect(() => {
    if (!match) return;
    if (!state.isAutoplaying || isFinished) return;

    const timer = window.setTimeout(() => {
      dispatch({ type: "NEXT", match });
    }, 1800);

    return () => window.clearTimeout(timer);
  }, [isFinished, match, state.isAutoplaying, state.cursor]);

  useEffect(() => {
    const startProgress = routeTravelProgressRef.current;
    const endProgress = routeProgress;
    const distance = Math.abs(endProgress - startProgress);

    if (distance < 0.001) {
      setRouteTravelProgress(endProgress);
      routeTravelProgressRef.current = endProgress;
      return;
    }

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setRouteTravelProgress(endProgress);
      routeTravelProgressRef.current = endProgress;
      return;
    }

    let frameId = 0;
    const duration = Math.min(2200, Math.max(850, distance * 2600));
    const startTime = performance.now();

    function animateRoute(now: number) {
      const elapsed = now - startTime;
      const eased = easeInOutCubic(Math.min(elapsed / duration, 1));
      const nextProgress = startProgress + (endProgress - startProgress) * eased;
      setRouteTravelProgress(nextProgress);
      routeTravelProgressRef.current = nextProgress;

      if (elapsed < duration) {
        frameId = window.requestAnimationFrame(animateRoute);
        return;
      }

      setRouteTravelProgress(endProgress);
      routeTravelProgressRef.current = endProgress;
    }

    frameId = window.requestAnimationFrame(animateRoute);

    return () => {
      window.cancelAnimationFrame(frameId);
    };
  }, [routeProgress]);

  useEffect(() => {
    if (mapMode !== "flight") return;

    tournamentFlightProgressRef.current = 0;
    setTournamentFlightProgress(0);

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      tournamentFlightProgressRef.current = 1;
      setTournamentFlightProgress(1);
      return;
    }

    let frameId = 0;
    const duration = 3000;
    const startTime = performance.now();

    function animateTournamentFlight(now: number) {
      const elapsed = now - startTime;
      const eased = easeInOutCubic(Math.min(elapsed / duration, 1));
      tournamentFlightProgressRef.current = eased;
      setTournamentFlightProgress(eased);

      if (elapsed < duration) {
        frameId = window.requestAnimationFrame(animateTournamentFlight);
      }
    }

    frameId = window.requestAnimationFrame(animateTournamentFlight);

    return () => {
      window.cancelAnimationFrame(frameId);
    };
  }, [mapMode]);

  useEffect(() => {
    if (!showLandingConfetti) return;

    const timer = window.setTimeout(() => {
      setShowLandingConfetti(false);
    }, 1600);

    return () => window.clearTimeout(timer);
  }, [showLandingConfetti]);

  useEffect(() => {
    if (fixtureMediaFilterOptions.some((filter) => filter.value === fixtureMediaFilter)) return;

    setFixtureMediaFilter("all");
  }, [fixtureMediaFilter, fixtureMediaFilterOptions]);

  useEffect(() => {
    return () => {
      if (landingTimerRef.current) {
        window.clearTimeout(landingTimerRef.current);
      }
    };
  }, []);

  function clearLandingTimer() {
    if (!landingTimerRef.current) return;

    window.clearTimeout(landingTimerRef.current);
    landingTimerRef.current = null;
  }

  function resetRouteTravel() {
    setRouteTravelProgress(0);
    routeTravelProgressRef.current = 0;
  }

  function resetTournamentFlight() {
    setTournamentFlightProgress(0);
    tournamentFlightProgressRef.current = 0;
  }

  function resetReplayPlayback() {
    resetHighlight();
    dispatch({ type: "RESET" });
  }

  function openFixture(index: number, options: OpenFixtureOptions = {}) {
    if (!tournament) return;

    const nextMatch = tournament.matches[index];
    if (!nextMatch) return;

    const {
      nextMode = "stadium",
      openMatch = true,
      resetPlayback = true,
      trayMenu = null
    } = options;

    if (resetPlayback) {
      resetReplayPlayback();
    }
    clearLandingTimer();
    setRailMode("run");
    setIsTournamentMenuOpen(false);
    setActiveTrayMenu(trayMenu);
    setSelectedMatchIndex(index);
    setSelectedVenueId(nextMatch.venueId);
    setMapMode(nextMode);
    setIsMatchOpen(openMatch);
  }

  function selectTeamRun(teamCode: TeamCode) {
    if (!tournament) return;

    const nextRun = teamRunOptions.find((option) => option.teamCode === teamCode);
    const firstEntry = nextRun?.matches[0];
    if (!firstEntry) return;

    resetReplayPlayback();
    setActiveTrayMenu(null);
    setSelectedTeam(teamCode);
    setSelectedMatchIndex(firstEntry.index);
    setSelectedVenueId(firstEntry.match.venueId);
    resetRouteTravel();
    setIsMatchOpen(false);
    if (mapMode !== "world" && mapMode !== "flight") {
      setMapMode("host");
    }
  }

  function resetSelectedTournamentExperience() {
    resetReplayPlayback();
    clearLandingTimer();
    setRailMode("tournamentSetup");
    setIsTournamentMenuOpen(false);
    setActiveTrayMenu(null);
    setSelectedTeam(null);
    setSelectedMatchIndex(null);
    setSelectedVenueId(undefined);
    setFixtureStageFilter("all");
    setFixtureMediaFilter("all");
    setMapMode("world");
    setIsMatchOpen(false);
    setShowCountryFlags(true);
    setShowLandingConfetti(false);
    resetRouteTravel();
    resetTournamentFlight();
  }

  function selectTournament(index: number) {
    if (!tournaments[index]) return;

    setSelectedTournamentIndex(index);
    resetSelectedTournamentExperience();
  }

  function openTournamentSetup() {
    if (!tournament) {
      setActiveTrayMenu("tournaments");
      return;
    }

    returnToWorld();
  }

  function returnToWorld() {
    resetReplayPlayback();
    clearLandingTimer();
    setMapMode("world");
    setIsTournamentMenuOpen(false);
    setActiveTrayMenu(null);
    setRailMode(tournament ? "tournamentSetup" : "library");
    setSelectedTeam(null);
    setSelectedMatchIndex(null);
    setSelectedVenueId(undefined);
    setFixtureStageFilter("all");
    setFixtureMediaFilter("all");
    setIsMatchOpen(false);
    setShowCountryFlags(true);
    setShowLandingConfetti(false);
    resetRouteTravel();
    resetTournamentFlight();
  }

  function openReplayFromDock() {
    if (!tournament) {
      setActiveTrayMenu("tournaments");
      return;
    }

    if (selectedMatchIndex === null) {
      setActiveTrayMenu("fixtures");
      return;
    }

    if (activeTrayMenu === "replay") {
      setActiveTrayMenu(null);
      return;
    }

    openFixture(selectedMatchIndex, {
      nextMode: "stadium",
      openMatch: true,
      resetPlayback: false,
      trayMenu: "replay"
    });
  }

  function openReplayFixture(index: number) {
    openFixture(index, {
      nextMode: "stadium",
      openMatch: true,
      trayMenu: "replay"
    });
  }

  function sendHighlightCommand(command: "playVideo" | "pauseVideo" | "seekTo", args: unknown[] = []) {
    highlightFrameRef.current?.contentWindow?.postMessage(
      JSON.stringify({
        event: "command",
        func: command,
        args
      }),
      "*"
    );
  }

  function playHighlight() {
    if (!highlightEmbedUrl) return;
    sendHighlightCommand("playVideo");
  }

  function pauseHighlight() {
    if (!highlightEmbedUrl) return;
    sendHighlightCommand("pauseVideo");
  }

  function resetHighlight() {
    if (!highlightEmbedUrl) return;
    sendHighlightCommand("pauseVideo");
    sendHighlightCommand("seekTo", [0, true]);
  }

  function handlePrimaryReplayAction() {
    if (!match) return;

    if (state.cursor === -1) {
      playHighlight();
    }
    dispatch({ type: "NEXT", match });
  }

  function handleAutoplayToggle() {
    if (state.isAutoplaying) {
      pauseHighlight();
    } else {
      playHighlight();
    }
    dispatch({ type: "TOGGLE_AUTOPLAY" });
  }

  function handleReplayReset() {
    if (!match) return;

    resetHighlight();
    dispatch({ type: "RESET" });
  }

  function openAdjacentReplayFixture(direction: -1 | 1) {
    const nextEntry = direction < 0 ? previousReplayEntry : nextReplayEntry;
    if (!nextEntry) return;

    openReplayFixture(nextEntry.index);
  }

  function selectTournamentFromNav(index: number) {
    selectTournament(index);
    setIsTournamentMenuOpen(false);
  }

  function toggleTournamentTray() {
    setIsTournamentMenuOpen(false);
    setActiveTrayMenu((menu) => (menu === "tournaments" ? null : "tournaments"));
  }

  function toggleTeamTray() {
    setIsTournamentMenuOpen(false);
    if (!tournament) {
      setActiveTrayMenu("tournaments");
      return;
    }
    setActiveTrayMenu((menu) => (menu === "teams" ? null : "teams"));
  }

  function toggleFixtureTray() {
    setIsTournamentMenuOpen(false);
    if (!tournament) {
      setActiveTrayMenu("tournaments");
      return;
    }
    setActiveTrayMenu((menu) => (menu === "fixtures" ? null : "fixtures"));
  }

  function toggleSettingsTray() {
    setIsTournamentMenuOpen(false);
    setActiveTrayMenu((menu) => (menu === "settings" ? null : "settings"));
  }

  function closeBottomTray() {
    setActiveTrayMenu(null);
  }

  function selectTournamentFromTray(index: number) {
    selectTournament(index);
    setActiveTrayMenu(null);
  }

  function selectCountryFromGlobe(teamCode: TeamCode) {
    if (!tournament) return;

    selectTeamRun(teamCode);
    setActiveTrayMenu("fixtures");
  }

  function selectFixtureFromTray(index: number) {
    if (!tournament) return;

    openReplayFixture(index);
  }

  function selectTeamFromTray(teamCode: TeamCode) {
    if (!tournament) return;

    setRailMode("tournamentSetup");
    selectTeamRun(teamCode);
    setActiveTrayMenu("fixtures");
  }

  const worldCupTournamentOptions = tournaments
    .map((worldCupTournament, index) => ({ tournament: worldCupTournament, index }))
    .filter(({ tournament: worldCupTournament }) => worldCupTournament.competition === "WORLD_CUP");

  const isLibrary = railMode === "library";
  const isTournamentSetup = railMode === "tournamentSetup";
  const isRun = railMode === "run";
  const fixtureStageFilters = [
    { label: "All", value: "all" },
    { label: "Group", value: "group" },
    { label: "R16", value: "r16" },
    { label: "QF", value: "qf" },
    { label: "SF", value: "sf" },
    { label: "3rd", value: "third" },
    { label: "Final", value: "final" }
  ] satisfies { label: string; value: FixtureStageFilter }[];

  return (
    <main className={`tour-shell mode-${mapMode} rail-${railMode} ${isMatchOpen ? "match-open" : "match-closed"}`}>
      <section className="map-stage" aria-label="Map stage">
        <HostMap
          countryMarkers={!tournament || !showCountryFlags ? [] : countryMarkers}
          enableWorldSpin={enableGlobeSpin}
          focusVenueId={selectedVenueId}
          mapView={mapView}
          mode={mapMode}
          onHostSelect={() => {
            if (!tournament) return;
            setMapMode("host");
            setIsMatchOpen(false);
          }}
          onVenueSelect={(venueId) => {
            if (!tournament) return;

            const venueEntry = selectedRunEntries.find(({ match: routeMatch }) => routeMatch.venueId === venueId);
            if (venueEntry) {
              openFixture(venueEntry.index, {
                nextMode: "stadium",
                openMatch: true
              });
              return;
            }

            resetReplayPlayback();
            clearLandingTimer();
            setActiveTrayMenu(null);
            setMapMode("stadium");
            setSelectedMatchIndex(null);
            setSelectedVenueId(venueId);
            setIsMatchOpen(true);
          }}
          progress={mapMode === "flight" ? tournamentFlightProgress : routeTravelProgress}
          flightStartCoordinates={selectedTeam ? worldCup2002TeamCoordinates[selectedTeam] : mapView.center}
          onCountrySelect={selectCountryFromGlobe}
          routeVenueIds={routeVenueIds}
          showHostMarker={Boolean(tournament)}
          tournamentName={tournament?.name ?? ""}
          venues={tournament?.venues ?? []}
        />

        <header className="tour-topbar">
          <div className="nav-project">
            <button
              aria-expanded={isTournamentMenuOpen}
              className="app-identity"
              onClick={() => setIsTournamentMenuOpen((isOpen) => !isOpen)}
              type="button"
            >
              <span className="user-avatar" aria-hidden="true">{selectedTeam ? <img alt="" src={teamFlags[selectedTeam]} /> : "RW"}</span>
              {/* <span className="app-logo" aria-hidden="true">rw</span> */}
              {/* <span className="app-mode-icon"><Trophy size={16} /></span> */}
              <strong>{tournament ? tournament.name : "Select tournament"}</strong>
              <span className="app-chevron" aria-hidden="true">
                <svg width="16" height="16" fill="none" viewBox="0 0 16 16">
                  <path d="M4 9.5L8 13.5L12 9.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M4 6.5L8 2.5L12 6.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </button>
            {isTournamentMenuOpen ? (
              <div className="nav-dropdown" role="menu">
                <p className="nav-menu-kicker">Tournaments</p>
                {worldCupTournamentOptions.map(({ tournament: worldCupTournament, index }) => (
                  <button
                    className={`nav-menu-row ${selectedTournamentIndex === index ? "active" : ""}`}
                    key={worldCupTournament.id}
                    onClick={() => selectTournamentFromNav(index)}
                    role="menuitem"
                    type="button"
                  >
                    <span className="nav-row-icon"><Trophy size={17} /></span>
                    <span className="nav-row-copy">
                      <strong>{worldCupTournament.name}</strong>
                      <small>{worldCupTournament.matches.length} fixtures · {worldCupTournament.teams.length} teams</small>
                    </span>
                    <span className="nav-row-pill">{worldCupTournament.status}</span>
                  </button>
                ))}
              </div>
            ) : null}
          </div>
          <div className="topbar-actions">
            {/* <div className="map-chip">
              <MapPin size={16} />
              {isMapIntro ? "World view" : `${matchVenue?.city ?? "Host map"}`}
            </div>
            <span className="user-avatar" aria-hidden="true">{selectedTeam ? <img alt="" src={teamFlags[selectedTeam]} /> : "R"}</span> */}
          </div>
        </header>

     

        {showLandingConfetti ? <div className="confetti-burst" aria-hidden="true" /> : null}
      </section>

      <div className={`bottom-tray ${activeTrayMenu ? "is-open" : ""}`}>
        {activeTrayMenu === "tournaments" ? (
          <section className="tray-popover tray-tournament-popover" aria-label="Tournament selection">
            <div className="tray-header">
              <span>Tournaments</span>
              <small>{worldCupTournamentOptions.length} World Cup{worldCupTournamentOptions.length === 1 ? "" : "s"}</small>
              <button className="tray-close-button" onClick={closeBottomTray} title="Close tray" type="button">
                <X size={16} />
              </button>
            </div>
            {worldCupTournamentOptions.map(({ tournament: worldCupTournament, index }) => (
              <button
                className={`tray-tournament-row ${selectedTournamentIndex === index ? "active" : ""}`}
                key={worldCupTournament.id}
                onClick={() => selectTournamentFromTray(index)}
                type="button"
              >
                <span className="tray-row-icon"><Trophy size={18} /></span>
                <span className="tray-row-copy">
                  <strong>{worldCupTournament.name}</strong>
                  <small>{worldCupTournament.matches.length} fixtures · {worldCupTournament.teams.length} countries · {worldCupTournament.year}</small>
                </span>
                <span className="tray-row-pill">{worldCupTournament.status}</span>
              </button>
            ))}
          </section>
        ) : null}

        {activeTrayMenu === "fixtures" && tournament ? (
          <section className="tray-popover tray-fixture-popover" aria-label="Fixture selection">
            <div className="tray-header">
              <span>{selectedTeam ? `${teamNames[selectedTeam]} fixtures` : `${tournament.name} fixtures`}</span>
              <small>{visibleFixtureEntries.length} matches</small>
              <button className="tray-close-button" onClick={closeBottomTray} title="Close tray" type="button">
                <X size={16} />
              </button>
            </div>
            <div className="tray-filter-row" aria-label="Fixture stage filters">
              {fixtureStageFilters.map((filter) => (
                <button
                  className={fixtureStageFilter === filter.value ? "active" : ""}
                  key={filter.value}
                  onClick={() => setFixtureStageFilter(filter.value)}
                  type="button"
                >
                  {filter.label}
                </button>
              ))}
            </div>
            {fixtureMediaFilterOptions.length > 1 ? (
              <div className="tray-filter-row tray-media-filter-row" aria-label="Fixture highlight filters">
                {fixtureMediaFilterOptions.map((filter) => (
                  <button
                    className={fixtureMediaFilter === filter.value ? "active" : ""}
                    key={filter.value}
                    onClick={() => setFixtureMediaFilter(filter.value)}
                    type="button"
                  >
                    {filter.label}
                  </button>
                ))}
              </div>
            ) : null}
            <div className="tray-fixture-list">
              {visibleFixtureEntries.length === 0 ? (
                <div className="tray-empty">
                  <strong>No fixtures match these filters.</strong>
                  <button
                    onClick={() => {
                      setFixtureStageFilter("all");
                      setFixtureMediaFilter("all");
                    }}
                    type="button"
                  >
                    Clear
                  </button>
                </div>
              ) : null}
              {visibleFixtureEntries.map(({ match: routeMatch, index }, runIndex) => {
                  const routeMatchVenue = tournament.venues.find((venue) => venue.id === routeMatch.venueId);

                  return (
                    <button
                      className={`tray-fixture-row ${index === selectedMatchIndex ? "active" : ""}`}
                      key={routeMatch.id}
                      onClick={() => selectFixtureFromTray(index)}
                      type="button"
                    >
                      <span className="fixture-index">{runIndex + 1}</span>
                      <span className="tray-fixture-copy">
                        <strong>
                          <TeamFlag code={routeMatch.home} />
                          {teamNames[routeMatch.home]}
                          <b>{formatFinalScore(routeMatch)}</b>
                          <TeamFlag code={routeMatch.away} />
                          {teamNames[routeMatch.away]}
                        </strong>
                        <small className="fixture-meta">
                          <span>{getStageLabel(routeMatch.stage)} · {routeMatchVenue?.city ?? routeMatch.venue}</span>
                          <em className={`fixture-highlight-status status-${routeMatch.highlights.status}`}>
                            {getHighlightStatusLabel(routeMatch.highlights.status)}
                          </em>
                        </small>
                      </span>
                    </button>
                  );
              })}
            </div>
          </section>
        ) : null}

        {activeTrayMenu === "teams" && tournament ? (
          <section className="tray-popover tray-team-popover" aria-label="Group stage countries">
            <div className="tray-header">
              <span>Group stages</span>
              <small>{tournament.teams.length} countries</small>
              <button className="tray-close-button" onClick={closeBottomTray} title="Close tray" type="button">
                <X size={16} />
              </button>
            </div>
            <div className="tray-team-list">
              {groupedTeamRunOptions.map(({ group, teams }) => (
                <section className="tray-team-group" key={group}>
                  <div className="tray-group-label">Group {group}</div>
                  <div className="tray-team-grid">
                    {teams.map(({ teamCode, matches, record, finishLabel }) => (
                      <button
                        className={`tray-team-row ${teamCode === selectedTeam ? "active" : ""}`}
                        disabled={matches.length === 0}
                        key={teamCode}
                        onClick={() => selectTeamFromTray(teamCode)}
                        type="button"
                      >
                        <TeamFlag code={teamCode} />
                        <span className="tray-team-copy">
                          <strong>{teamNames[teamCode]}</strong>
                          <small>{record.wins}-{record.draws}-{record.losses} · {matches.length} fixtures · {finishLabel}</small>
                        </span>
                      </button>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          </section>
        ) : null}

        {activeTrayMenu === "replay" && tournament && match ? (
          <section className="tray-popover tray-replay-popover" aria-label="Match replay and highlights">
            <div className="tray-header">
              <span>{teamNames[match.home]} vs {teamNames[match.away]}</span>
              <small>{getStageLabel(match.stage)} · {matchVenue?.city ?? match.venue}</small>
              <button className="tray-close-button" onClick={closeBottomTray} title="Close tray" type="button">
                <X size={16} />
              </button>
            </div>

            <div className="tray-scoreline">
              <TeamBadge code={match.home} />
              <div className="score">
                {visibleScore ? (
                  <>
                    <span>{visibleScore.home}</span>
                    <span className="score-divider">-</span>
                    <span>{visibleScore.away}</span>
                  </>
                ) : (
                  <span className="versus">vs</span>
                )}
              </div>
              <TeamBadge code={match.away} />
            </div>

            <div className="tray-replay-grid">
              <section className="tray-highlight-card" aria-label="Highlight reel">
                <div className="tray-card-header">
                  <span>Highlight reel</span>
                  <small>{getHighlightStatusLabel(match.highlights.status)}</small>
                </div>
                {match.highlights.embeddable && highlightEmbedUrl ? (
                  <iframe
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="highlight-embed tray-highlight-embed"
                    key={match.id}
                    ref={highlightFrameRef}
                    src={highlightEmbedUrl}
                    title={`${match.home} vs ${match.away} highlights`}
                  />
                ) : (
                  <div className="highlight-empty tray-highlight-empty">
                    <strong>{getHighlightStatusLabel(match.highlights.status)}</strong>
                    <span>{getHighlightEmptyCopy(match)}</span>
                  </div>
                )}
              </section>

              <section className="tray-moment-card" aria-label="Replay controls">
                <div className="tray-card-header">
                  <span>{formatClock(currentEvent, state.status)}</span>
                  <small>{highlightEmbedUrl ? "Replay + video" : state.mode === "blackout" ? "Blackout" : "Live score"}</small>
                </div>
                <div className="tray-fixture-nav" aria-label={`${replayScopeLabel} fixture navigation`}>
                  <button
                    className="icon-button"
                    disabled={!previousReplayEntry}
                    onClick={() => openAdjacentReplayFixture(-1)}
                    title={`Previous fixture in ${replayScopeLabel}`}
                    type="button"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <span>
                    {replaySequenceIndex >= 0 ? replaySequenceIndex + 1 : 0}/{replaySequenceEntries.length}
                  </span>
                  <button
                    className="icon-button"
                    disabled={!nextReplayEntry}
                    onClick={() => openAdjacentReplayFixture(1)}
                    title={`Next fixture in ${replayScopeLabel}`}
                    type="button"
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>
                <div className="controls media-control-row tray-control-row">
                  <button
                    className="icon-button primary replay-action-button"
                    disabled={isFinished}
                    onClick={handlePrimaryReplayAction}
                    title={state.cursor === -1 ? "Start replay and highlight" : "Next replay moment"}
                    type="button"
                  >
                    {state.cursor === -1 ? <Play size={20} /> : <SkipForward size={20} />}
                    <span>{state.cursor === -1 ? "Play" : "Next"}</span>
                  </button>
                  <button
                    className="icon-button"
                    disabled={isFinished}
                    onClick={handleAutoplayToggle}
                    title={state.isAutoplaying ? "Pause replay and highlight" : "Autoplay replay and highlight"}
                    type="button"
                  >
                    {state.isAutoplaying ? <Pause size={20} /> : <Play size={20} />}
                  </button>
                  <button
                    className="icon-button"
                    onClick={handleReplayReset}
                    title="Reset replay"
                    type="button"
                  >
                    <RotateCcw size={20} />
                  </button>
                  <button className="toggle-button" onClick={() => dispatch({ type: "TOGGLE_MODE", match })} type="button">
                    {state.mode === "blackout" ? "Show live score" : "Blackout score"}
                  </button>
                </div>
                <div className="timeline tray-timeline" aria-label="Replay progress">
                  <div className="timeline-fill" style={{ width: `${progress}%` }} />
                  {revealedEvents.map((event) => (
                    <span
                      className={`timeline-dot ${event.type === "goal" ? "goal" : ""}`}
                      key={event.id}
                      style={{ left: `${(match.events.indexOf(event) / Math.max(match.events.length - 1, 1)) * 100}%` }}
                    />
                  ))}
                </div>
                <article className="tray-latest-moment">
                  <span>Latest moment</span>
                  <strong>{currentEvent ? currentEvent.detail : `The replay is ready in ${matchVenue?.city ?? "the host city"}.`}</strong>
                </article>
              </section>
            </div>

            <div className="highlight-actions tray-highlight-actions">
              {match.highlights.directUrl ? (
                <a className="highlight-link" href={match.highlights.directUrl} rel="noreferrer" target="_blank">
                  {match.highlights.sourceName ? `Open ${match.highlights.sourceName}` : "Open highlights"}
                </a>
              ) : null}
              {match.highlights.officialUrl ? (
                <a className="highlight-link secondary" href={match.highlights.officialUrl} rel="noreferrer" target="_blank">
                  {match.highlights.officialSourceName ?? "Official match report"}
                </a>
              ) : null}
            </div>
          </section>
        ) : null}

        {activeTrayMenu === "settings" ? (
          <section className="tray-popover tray-settings-popover" aria-label="Experience settings">
            <div className="tray-header">
              <span>Experience</span>
              <small>Controls</small>
              <button className="tray-close-button" onClick={closeBottomTray} title="Close tray" type="button">
                <X size={16} />
              </button>
            </div>
            <div className="tray-settings-list">
              <button className={`tray-setting-row ${showCountryFlags ? "active" : ""}`} onClick={() => setShowCountryFlags((value) => !value)} type="button">
                <span>
                  <strong>Country flags</strong>
                  <small>Show participating countries on the globe</small>
                </span>
                <b>{showCountryFlags ? "On" : "Off"}</b>
              </button>
              <button className={`tray-setting-row ${enableGlobeSpin ? "active" : ""}`} onClick={() => setEnableGlobeSpin((value) => !value)} type="button">
                <span>
                  <strong>Slow globe spin</strong>
                  <small>Let the world view drift when idle</small>
                </span>
                <b>{enableGlobeSpin ? "On" : "Off"}</b>
              </button>
              <button className={`tray-setting-row ${state.isAutoplaying ? "active" : ""}`} disabled={!match} onClick={handleAutoplayToggle} type="button">
                <span>
                  <strong>Moment autoplay</strong>
                  <small>{match ? "Advance replay moments automatically" : "Select a fixture first"}</small>
                </span>
                <b>{state.isAutoplaying ? "On" : "Off"}</b>
              </button>
              <button className="tray-setting-row tray-setting-action" disabled={!tournament} onClick={openTournamentSetup} type="button">
                <span>
                  <strong>Reset to globe</strong>
                  <small>{tournament ? "Clear team, fixture, highlight, and filters" : "Select a tournament first"}</small>
                </span>
                <b>Reset</b>
              </button>
            </div>
          </section>
        ) : null}

        <nav className="bottom-dock" aria-label="Primary views">
          <button className={activeTrayMenu === "tournaments" || isLibrary ? "active" : ""} onClick={toggleTournamentTray} title="Tournament selection" type="button">
            <Trophy size={21} />
          </button>
          <button className={activeTrayMenu === "teams" || isTournamentSetup ? "active" : ""} disabled={!tournament} onClick={toggleTeamTray} title="Group stages" type="button">
            <Users size={21} />
          </button>
          <button className={activeTrayMenu === "fixtures" || (isRun && !isMatchOpen) ? "active" : ""} disabled={!tournament} onClick={toggleFixtureTray} title="Fixture selection" type="button">
            <CalendarDays size={21} />
          </button>
          <button className={activeTrayMenu === "replay" || (isRun && isMatchOpen) ? "active" : ""} disabled={!tournament || !match} onClick={openReplayFromDock} title="Replay" type="button">
            <Clapperboard size={21} />
          </button>
          <button className={activeTrayMenu === "settings" ? "active" : ""} onClick={toggleSettingsTray} title="Experience settings" type="button">
            <Settings size={21} />
          </button>
          <button className="dock-count" disabled={!tournament} onClick={openTournamentSetup} title="Back to country globe" type="button">
            <Globe2 size={21} />
            {tournament ? selectedRunEntries.length || tournament.matches.length : 0}
          </button>
        </nav>
      </div>
    </main>
  );
}
