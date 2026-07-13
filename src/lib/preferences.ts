import type { ReplayMode, TeamCode } from "@/lib/types";

export const PREFERENCES_STORAGE_KEY = "rewindcup:preferences:v1";

export type FavoriteReference = {
  key: string;
  savedAt: string;
  teamCode?: TeamCode;
  tournamentId: string;
  type: "team" | "tournament";
};

export type RecentReference = {
  matchId?: string;
  openedAt: string;
  teamCode?: TeamCode;
  tournamentId: string;
  type: "match" | "team" | "tournament";
};

export type ReplayResume = {
  cursor: number;
  matchId: string;
  mode: ReplayMode;
  teamCode?: TeamCode;
  tournamentId: string;
  updatedAt: string;
};

export type UserPreferences = {
  completedMatchIds: string[];
  favorites: FavoriteReference[];
  recent: RecentReference[];
  resume: ReplayResume | null;
};

export const emptyPreferences: UserPreferences = {
  completedMatchIds: [],
  favorites: [],
  recent: [],
  resume: null
};

export function readPreferences(): UserPreferences {
  if (typeof window === "undefined") return emptyPreferences;

  try {
    const stored = window.localStorage.getItem(PREFERENCES_STORAGE_KEY);
    if (!stored) return emptyPreferences;
    const parsed = JSON.parse(stored) as Partial<UserPreferences>;
    return {
      completedMatchIds: Array.isArray(parsed.completedMatchIds) ? parsed.completedMatchIds : [],
      favorites: Array.isArray(parsed.favorites) ? parsed.favorites : [],
      recent: Array.isArray(parsed.recent) ? parsed.recent.slice(0, 12) : [],
      resume: parsed.resume ?? null
    };
  } catch {
    return emptyPreferences;
  }
}

export function writePreferences(preferences: UserPreferences) {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.setItem(PREFERENCES_STORAGE_KEY, JSON.stringify(preferences));
  } catch {
    // The app remains fully usable when storage is disabled or full.
  }
}

export function getTournamentFavoriteKey(tournamentId: string) {
  return `tournament:${tournamentId}`;
}

export function getTeamFavoriteKey(tournamentId: string, teamCode: TeamCode) {
  return `team:${tournamentId}:${teamCode}`;
}
