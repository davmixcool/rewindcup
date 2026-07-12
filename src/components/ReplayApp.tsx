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
type PendingFixtureArrival = {
  matchId: string;
  venueId: string;
};

const stageRank: Record<Match["stage"], number> = {
  group: 0,
  r16: 1,
  qf: 2,
  sf: 3,
  third: 4,
  final: 5
};

const stageFilterLabels: Record<Match["stage"], string> = {
  group: "Group",
  r16: "R16",
  qf: "QF",
  sf: "SF",
  third: "3rd",
  final: "Final"
};

const ROUTE_PROGRESS_UPDATES_PER_SECOND = 30;

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
    <span aria-hidden="true" className="flag-icon-frame" style={{ backgroundColor: teamColors[code] }}>
      <img alt="" className="flag-icon" src={teamFlags[code]} />
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
  const [countryFocusRequest, setCountryFocusRequest] = useState(0);
  const [selectedVenueId, setSelectedVenueId] = useState<string | undefined>(undefined);
  const [fixtureTravelRequest, setFixtureTravelRequest] = useState(0);
  const [pendingFixtureArrival, setPendingFixtureArrival] = useState<PendingFixtureArrival | null>(null);
  const [routeTravelProgress, setRouteTravelProgress] = useState(0);
  const routeTravelProgressRef = useRef(0);
  const countrySelectionTimerRef = useRef<number | null>(null);
  const highlightFrameRef = useRef<HTMLIFrameElement | null>(null);
  const bottomTrayRef = useRef<HTMLDivElement | null>(null);
  const previousTrayMenuRef = useRef<TrayMenu>(null);
  const trayRestoreFocusRef = useRef<HTMLElement | null>(null);
  const tournamentMenuButtonRef = useRef<HTMLButtonElement | null>(null);

  const currentEvent = match?.events[state.cursor];
  const isFixtureTraveling = pendingFixtureArrival !== null;
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
          group: tournament.groups.find((entry) => entry.teams.includes(teamCode))?.id,
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
        : tournament.teams.flatMap((teamCode) => {
            const coordinates = tournament.teamCoordinates[teamCode];
            if (!coordinates) return [];

            return [{
              code: teamCode,
              color: teamColors[teamCode],
              coordinates,
              flagSrc: teamFlags[teamCode],
              name: teamNames[teamCode]
            }];
          }),
    [tournament]
  );
  const groupedTeamRunOptions = useMemo(
    () =>
      (tournament?.groups ?? []).map((group) => ({
        group: group.id,
        teams: teamRunOptions.filter((option) => option.group === group.id)
      })),
    [teamRunOptions, tournament]
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
  const pendingMatch = pendingFixtureArrival && tournament
    ? tournament.matches.find((candidate) => candidate.id === pendingFixtureArrival.matchId)
    : null;
  const pendingVenue = pendingFixtureArrival && tournament
    ? tournament.venues.find((venue) => venue.id === pendingFixtureArrival.venueId)
    : null;
  const experienceStatus = pendingMatch
    ? `Traveling to ${pendingVenue?.name ?? pendingVenue?.city ?? pendingMatch.venue} for ${teamNames[pendingMatch.home]} versus ${teamNames[pendingMatch.away]}.`
    : activeTrayMenu === "replay" && match && isMatchOpen
      ? `Arrived at ${matchVenue?.name ?? matchVenue?.city ?? match.venue}. Replay controls are ready.`
      : "";

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
    let lastUpdateTime = startTime;
    const updateInterval = 1000 / ROUTE_PROGRESS_UPDATES_PER_SECOND;

    function animateRoute(now: number) {
      const elapsed = now - startTime;
      const eased = easeInOutCubic(Math.min(elapsed / duration, 1));
      const nextProgress = startProgress + (endProgress - startProgress) * eased;
      const isComplete = elapsed >= duration;

      if (isComplete) {
        setRouteTravelProgress(endProgress);
        routeTravelProgressRef.current = endProgress;
        return;
      }

      if (now - lastUpdateTime >= updateInterval) {
        setRouteTravelProgress(nextProgress);
        routeTravelProgressRef.current = nextProgress;
        lastUpdateTime = now;
      }

      frameId = window.requestAnimationFrame(animateRoute);
    }

    frameId = window.requestAnimationFrame(animateRoute);

    return () => {
      window.cancelAnimationFrame(frameId);
    };
  }, [routeProgress]);

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
    const previousMenu = previousTrayMenuRef.current;
    let frameId = 0;

    if (activeTrayMenu) {
      if (!previousMenu && document.activeElement instanceof HTMLElement) {
        trayRestoreFocusRef.current = document.activeElement;
      }

      frameId = window.requestAnimationFrame(() => {
        bottomTrayRef.current?.querySelector<HTMLButtonElement>(".tray-popover .tray-close-button")?.focus();
      });
    } else if (previousMenu) {
      const restoreTarget = trayRestoreFocusRef.current;
      trayRestoreFocusRef.current = null;
      if (restoreTarget?.isConnected && !(restoreTarget instanceof HTMLButtonElement && restoreTarget.disabled)) {
        frameId = window.requestAnimationFrame(() => restoreTarget.focus());
      }
    }

    previousTrayMenuRef.current = activeTrayMenu;
    return () => window.cancelAnimationFrame(frameId);
  }, [activeTrayMenu]);

  useEffect(() => {
    if (!activeTrayMenu && !isTournamentMenuOpen) return;

    function handleEscape(event: KeyboardEvent) {
      if (event.key !== "Escape") return;

      event.preventDefault();
      if (activeTrayMenu) {
        setActiveTrayMenu(null);
        return;
      }

      setIsTournamentMenuOpen(false);
      window.requestAnimationFrame(() => tournamentMenuButtonRef.current?.focus());
    }

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [activeTrayMenu, isTournamentMenuOpen]);

  useEffect(() => {
    return () => {
      if (countrySelectionTimerRef.current) {
        window.clearTimeout(countrySelectionTimerRef.current);
      }
    };
  }, []);

  function clearCountrySelectionTimer() {
    if (!countrySelectionTimerRef.current) return;

    window.clearTimeout(countrySelectionTimerRef.current);
    countrySelectionTimerRef.current = null;
  }

  function clearPendingFixtureArrival() {
    setPendingFixtureArrival(null);
  }

  function resetRouteTravel() {
    setRouteTravelProgress(0);
    routeTravelProgressRef.current = 0;
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
    clearPendingFixtureArrival();
    clearCountrySelectionTimer();
    setRailMode("run");
    setIsTournamentMenuOpen(false);
    setActiveTrayMenu(trayMenu);
    setSelectedMatchIndex(index);
    setSelectedVenueId(nextMatch.venueId);
    setMapMode(nextMode);
    setIsMatchOpen(openMatch);
  }

  function travelToFixture(index: number) {
    if (!tournament) return;

    const nextMatch = tournament.matches[index];
    if (!nextMatch) return;

    resetReplayPlayback();
    clearCountrySelectionTimer();
    setFixtureTravelRequest((request) => request + 1);
    setPendingFixtureArrival({ matchId: nextMatch.id, venueId: nextMatch.venueId });
    setRailMode("run");
    setIsTournamentMenuOpen(false);
    setActiveTrayMenu(null);
    setSelectedMatchIndex(index);
    setSelectedVenueId(nextMatch.venueId);
    setShowLandingConfetti(false);
    setIsMatchOpen(false);
    setMapMode(window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "stadium" : "flight");
  }

  function selectTeamRun(teamCode: TeamCode) {
    if (!tournament) return;

    const nextRun = teamRunOptions.find((option) => option.teamCode === teamCode);
    const firstEntry = nextRun?.matches[0];
    if (!firstEntry) return;

    clearCountrySelectionTimer();
    clearPendingFixtureArrival();
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
    clearPendingFixtureArrival();
    clearCountrySelectionTimer();
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
    clearPendingFixtureArrival();
    clearCountrySelectionTimer();
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
  }

  function openReplayFromDock() {
    if (!tournament) {
      setActiveTrayMenu("tournaments");
      return;
    }

    if (isFixtureTraveling) return;

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
    travelToFixture(index);
  }

  function handleFixtureFlightArrival(venueId: string) {
    if (!pendingFixtureArrival || pendingFixtureArrival.venueId !== venueId) return;
    if (!match || pendingFixtureArrival.matchId !== match.id) return;

    setMapMode("stadium");
  }

  function handleStadiumArrival(venueId: string) {
    if (!pendingFixtureArrival || pendingFixtureArrival.venueId !== venueId) return;
    if (!match || pendingFixtureArrival.matchId !== match.id) return;

    setPendingFixtureArrival(null);
    setIsMatchOpen(true);
    setActiveTrayMenu("replay");
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setShowLandingConfetti(true);
    }
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
    clearCountrySelectionTimer();
    setIsTournamentMenuOpen(false);
    setActiveTrayMenu((menu) => (menu === "tournaments" ? null : "tournaments"));
  }

  function toggleTeamTray() {
    clearCountrySelectionTimer();
    setIsTournamentMenuOpen(false);
    if (!tournament) {
      setActiveTrayMenu("tournaments");
      return;
    }
    setActiveTrayMenu((menu) => (menu === "teams" ? null : "teams"));
  }

  function toggleFixtureTray() {
    clearCountrySelectionTimer();
    setIsTournamentMenuOpen(false);
    if (!tournament) {
      setActiveTrayMenu("tournaments");
      return;
    }
    setActiveTrayMenu((menu) => (menu === "fixtures" ? null : "fixtures"));
  }

  function toggleSettingsTray() {
    clearCountrySelectionTimer();
    setIsTournamentMenuOpen(false);
    setActiveTrayMenu((menu) => (menu === "settings" ? null : "settings"));
  }

  function closeBottomTray() {
    clearCountrySelectionTimer();
    setActiveTrayMenu(null);
  }

  function selectTournamentFromTray(index: number) {
    selectTournament(index);
    setActiveTrayMenu(null);
  }

  function selectCountryFromGlobe(teamCode: TeamCode) {
    if (!tournament) return;

    selectTeamRun(teamCode);
    setCountryFocusRequest((request) => request + 1);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setActiveTrayMenu("fixtures");
      return;
    }

    countrySelectionTimerRef.current = window.setTimeout(() => {
      countrySelectionTimerRef.current = null;
      setActiveTrayMenu("fixtures");
    }, 780);
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
  const fixtureStageFilters: { label: string; value: FixtureStageFilter }[] = [
    { label: "All", value: "all" },
    ...(tournament?.stages ?? []).map((stage) => ({ label: stageFilterLabels[stage], value: stage }))
  ];

  return (
    <main className={`tour-shell mode-${mapMode} rail-${railMode} ${isMatchOpen ? "match-open" : "match-closed"} ${isFixtureTraveling ? "fixture-traveling" : ""}`}>
      <h1 className="sr-only">Rewind Cup tournament replay</h1>
      <p aria-atomic="true" aria-live="polite" className="sr-only" role="status">
        {experienceStatus}
      </p>
      <section className="map-stage" aria-busy={isFixtureTraveling} aria-label="Map stage">
        <HostMap
          countryMarkers={!tournament || !showCountryFlags ? [] : countryMarkers}
          countryFocusRequest={countryFocusRequest}
          enableWorldSpin={enableGlobeSpin}
          focusVenueId={selectedVenueId}
          isCameraTransitioning={isFixtureTraveling}
          mapView={mapView}
          mode={mapMode}
          onHostSelect={() => {
            if (!tournament || isFixtureTraveling) return;
            setMapMode("host");
            setIsMatchOpen(false);
          }}
          onFlightArrival={handleFixtureFlightArrival}
          onStadiumArrival={handleStadiumArrival}
          onVenueSelect={(venueId) => {
            if (!tournament || isFixtureTraveling) return;

            const venueEntry = selectedRunEntries.find(({ match: routeMatch }) => routeMatch.venueId === venueId);
            if (venueEntry) {
              openFixture(venueEntry.index, {
                nextMode: "stadium",
                openMatch: true
              });
              return;
            }

            resetReplayPlayback();
            setActiveTrayMenu(null);
            setMapMode("stadium");
            setSelectedMatchIndex(null);
            setSelectedVenueId(venueId);
            setIsMatchOpen(true);
          }}
          progress={routeTravelProgress}
          onCountrySelect={selectCountryFromGlobe}
          routeVenueIds={routeVenueIds}
          selectedCountryCode={selectedTeam}
          showHostMarker={Boolean(tournament)}
          stadiumFocusRequest={fixtureTravelRequest}
          tournamentName={tournament?.name ?? ""}
          venues={tournament?.venues ?? []}
        />

        <header className="tour-topbar">
          <div className="nav-project">
            <button
              aria-controls="tournament-menu"
              aria-expanded={isTournamentMenuOpen}
              className="app-identity"
              disabled={isFixtureTraveling}
              onClick={() => {
                clearCountrySelectionTimer();
                setIsTournamentMenuOpen((isOpen) => !isOpen);
              }}
              ref={tournamentMenuButtonRef}
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
              <div className="nav-dropdown" id="tournament-menu">
                <p className="nav-menu-kicker">Tournaments</p>
                {worldCupTournamentOptions.map(({ tournament: worldCupTournament, index }) => (
                  <button
                    aria-current={selectedTournamentIndex === index ? "true" : undefined}
                    className={`nav-menu-row ${selectedTournamentIndex === index ? "active" : ""}`}
                    key={worldCupTournament.id}
                    onClick={() => selectTournamentFromNav(index)}
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

      <div className={`bottom-tray ${activeTrayMenu ? "is-open" : ""}`} ref={bottomTrayRef}>
        {activeTrayMenu === "tournaments" ? (
          <section aria-label="Tournament selection" className="tray-popover tray-tournament-popover" id="active-tray-panel">
            <div className="tray-header">
              <h2 id="tournament-tray-title">Tournaments</h2>
              <small>{worldCupTournamentOptions.length} World Cup{worldCupTournamentOptions.length === 1 ? "" : "s"}</small>
              <button aria-label="Close tournament selection" className="tray-close-button" onClick={closeBottomTray} title="Close tray" type="button">
                <X size={16} />
              </button>
            </div>
            {worldCupTournamentOptions.map(({ tournament: worldCupTournament, index }) => (
              <button
                aria-current={selectedTournamentIndex === index ? "true" : undefined}
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
          <section aria-label="Fixture selection" className="tray-popover tray-fixture-popover" id="active-tray-panel">
            <div className="tray-header">
              <h2 id="fixture-tray-title">{selectedTeam ? `${teamNames[selectedTeam]} fixtures` : `${tournament.name} fixtures`}</h2>
              <small>{visibleFixtureEntries.length} matches</small>
              <button aria-label="Close fixture selection" className="tray-close-button" onClick={closeBottomTray} title="Close tray" type="button">
                <X size={16} />
              </button>
            </div>
            <div aria-label="Fixture stage filters" className="tray-filter-row" role="group">
              {fixtureStageFilters.map((filter) => (
                <button
                  aria-pressed={fixtureStageFilter === filter.value}
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
              <div aria-label="Fixture highlight filters" className="tray-filter-row tray-media-filter-row" role="group">
                {fixtureMediaFilterOptions.map((filter) => (
                  <button
                    aria-pressed={fixtureMediaFilter === filter.value}
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
                      aria-current={index === selectedMatchIndex ? "true" : undefined}
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
          <section aria-label="Group stage countries" className="tray-popover tray-team-popover" id="active-tray-panel">
            <div className="tray-header">
              <h2 id="team-tray-title">Group stages</h2>
              <small>{tournament.teams.length} countries</small>
              <button aria-label="Close group stages" className="tray-close-button" onClick={closeBottomTray} title="Close tray" type="button">
                <X size={16} />
              </button>
            </div>
            <div className="tray-team-list">
              {groupedTeamRunOptions.map(({ group, teams }) => (
                <section className="tray-team-group" key={group}>
                  <h3 className="tray-group-label">Group {group}</h3>
                  <div className="tray-team-grid">
                    {teams.map(({ teamCode, matches, record, finishLabel }) => (
                      <button
                        aria-pressed={teamCode === selectedTeam}
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
          <section aria-label="Match replay and highlights" className="tray-popover tray-replay-popover" id="active-tray-panel">
            <div className="tray-header">
              <h2 id="replay-tray-title">{teamNames[match.home]} vs {teamNames[match.away]}</h2>
              <small>{getStageLabel(match.stage)} · {matchVenue?.city ?? match.venue}</small>
              <button aria-label="Close match replay" className="tray-close-button" onClick={closeBottomTray} title="Close tray" type="button">
                <X size={16} />
              </button>
            </div>

            <div aria-atomic="true" aria-live="polite" className="tray-scoreline" role="status">
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
                    title={`${teamNames[match.home]} vs ${teamNames[match.away]} highlights`}
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
                <div aria-label={`${replayScopeLabel} fixture navigation`} className="tray-fixture-nav" role="group">
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
                <div aria-label="Replay playback" className="controls media-control-row tray-control-row" role="group">
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
                    aria-pressed={state.isAutoplaying}
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
                  <button aria-pressed={state.mode === "blackout"} className="toggle-button" onClick={() => dispatch({ type: "TOGGLE_MODE", match })} type="button">
                    {state.mode === "blackout" ? "Show live score" : "Blackout score"}
                  </button>
                </div>
                <div
                  aria-label="Replay progress"
                  aria-valuemax={100}
                  aria-valuemin={0}
                  aria-valuenow={Math.round(progress)}
                  aria-valuetext={`${Math.max(state.cursor + 1, 0)} of ${match.events.length} moments`}
                  className="timeline tray-timeline"
                  role="progressbar"
                >
                  <div aria-hidden="true" className="timeline-fill" style={{ width: `${progress}%` }} />
                  {revealedEvents.map((event) => (
                    <span
                      aria-hidden="true"
                      className={`timeline-dot ${event.type === "goal" ? "goal" : ""}`}
                      key={event.id}
                      style={{ left: `${(match.events.indexOf(event) / Math.max(match.events.length - 1, 1)) * 100}%` }}
                    />
                  ))}
                </div>
                <article aria-atomic="true" aria-live="polite" className="tray-latest-moment">
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
          <section aria-label="Experience settings" className="tray-popover tray-settings-popover" id="active-tray-panel">
            <div className="tray-header">
              <h2 id="settings-tray-title">Experience</h2>
              <small>Controls</small>
              <button aria-label="Close experience settings" className="tray-close-button" onClick={closeBottomTray} title="Close tray" type="button">
                <X size={16} />
              </button>
            </div>
            <div className="tray-settings-list">
              <button aria-pressed={showCountryFlags} className={`tray-setting-row ${showCountryFlags ? "active" : ""}`} onClick={() => setShowCountryFlags((value) => !value)} type="button">
                <span>
                  <strong>Country flags</strong>
                  <small>Show participating countries on the globe</small>
                </span>
                <b>{showCountryFlags ? "On" : "Off"}</b>
              </button>
              <button aria-pressed={enableGlobeSpin} className={`tray-setting-row ${enableGlobeSpin ? "active" : ""}`} onClick={() => setEnableGlobeSpin((value) => !value)} type="button">
                <span>
                  <strong>Slow globe spin</strong>
                  <small>Let the world view drift when idle</small>
                </span>
                <b>{enableGlobeSpin ? "On" : "Off"}</b>
              </button>
              <button aria-pressed={state.isAutoplaying} className={`tray-setting-row ${state.isAutoplaying ? "active" : ""}`} disabled={!match} onClick={handleAutoplayToggle} type="button">
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
          <button aria-controls={activeTrayMenu === "tournaments" ? "active-tray-panel" : undefined} aria-expanded={activeTrayMenu === "tournaments"} aria-label="Tournament selection" className={activeTrayMenu === "tournaments" || isLibrary ? "active" : ""} disabled={isFixtureTraveling} onClick={toggleTournamentTray} title="Tournament selection" type="button">
            <Trophy size={21} />
          </button>
          <button aria-controls={activeTrayMenu === "teams" ? "active-tray-panel" : undefined} aria-expanded={activeTrayMenu === "teams"} aria-label="Group stages" className={activeTrayMenu === "teams" || isTournamentSetup ? "active" : ""} disabled={!tournament || isFixtureTraveling} onClick={toggleTeamTray} title="Group stages" type="button">
            <Users size={21} />
          </button>
          <button aria-controls={activeTrayMenu === "fixtures" ? "active-tray-panel" : undefined} aria-expanded={activeTrayMenu === "fixtures"} aria-label="Fixture selection" className={activeTrayMenu === "fixtures" || (isRun && !isMatchOpen) ? "active" : ""} disabled={!tournament || isFixtureTraveling} onClick={toggleFixtureTray} title="Fixture selection" type="button">
            <CalendarDays size={21} />
          </button>
          <button aria-controls={activeTrayMenu === "replay" ? "active-tray-panel" : undefined} aria-expanded={activeTrayMenu === "replay"} aria-label="Replay" className={activeTrayMenu === "replay" || (isRun && isMatchOpen) ? "active" : ""} disabled={!tournament || !match || isFixtureTraveling} onClick={openReplayFromDock} title="Replay" type="button">
            <Clapperboard size={21} />
          </button>
          <button aria-controls={activeTrayMenu === "settings" ? "active-tray-panel" : undefined} aria-expanded={activeTrayMenu === "settings"} aria-label="Experience settings" className={activeTrayMenu === "settings" ? "active" : ""} disabled={isFixtureTraveling} onClick={toggleSettingsTray} title="Experience settings" type="button">
            <Settings size={21} />
          </button>
          <button aria-label="Back to country globe" className="dock-count" disabled={!tournament} onClick={openTournamentSetup} title="Back to country globe" type="button">
            <Globe2 size={21} />
            <span aria-hidden="true">{tournament ? selectedRunEntries.length || tournament.matches.length : 0}</span>
          </button>
        </nav>
      </div>
    </main>
  );
}
