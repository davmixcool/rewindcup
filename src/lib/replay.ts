import type { Match, ReplayEvent, ReplayMode, ReplayStatus, Score } from "./types";

export type ReplayState = {
  cursor: number;
  status: ReplayStatus;
  visibleScore: Score | null;
  mode: ReplayMode;
  isAutoplaying: boolean;
};

export type ReplayAction =
  | { type: "NEXT"; match: Match }
  | { type: "RESET" }
  | { type: "TOGGLE_MODE"; match: Match }
  | { type: "TOGGLE_AUTOPLAY" };

export const initialReplayState: ReplayState = {
  cursor: -1,
  status: "pre",
  visibleScore: null,
  mode: "live-score",
  isAutoplaying: false
};

export function getScoreForEvent(event: ReplayEvent | undefined): Score | null {
  return event?.scoreAfter ?? null;
}

export function getStatusForEvent(event: ReplayEvent | undefined): ReplayStatus {
  if (!event) return "pre";
  if (event.type === "half_time") return "break";
  if (event.type === "full_time" || event.type === "result") return "full_time";
  return "in_play";
}

export function replayReducer(state: ReplayState, action: ReplayAction): ReplayState {
  switch (action.type) {
    case "NEXT": {
      const nextCursor = Math.min(state.cursor + 1, action.match.events.length - 1);
      const event = action.match.events[nextCursor];
      const status = getStatusForEvent(event);
      const eventScore = getScoreForEvent(event);
      const visibleScore = state.mode === "blackout" && status !== "full_time" ? null : eventScore;

      return {
        ...state,
        cursor: nextCursor,
        status,
        visibleScore,
        isAutoplaying: status === "full_time" ? false : state.isAutoplaying
      };
    }
    case "RESET":
      return initialReplayState;
    case "TOGGLE_MODE": {
      const mode = state.mode === "live-score" ? "blackout" : "live-score";
      const eventScore = getScoreForEvent(action.match.events[state.cursor]);
      return {
        ...state,
        mode,
        visibleScore: mode === "blackout" && state.status !== "full_time" ? null : eventScore
      };
    }
    case "TOGGLE_AUTOPLAY":
      return {
        ...state,
        isAutoplaying: state.status === "full_time" ? false : !state.isAutoplaying
      };
    default:
      return state;
  }
}
