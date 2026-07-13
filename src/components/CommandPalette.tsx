"use client";

import { CalendarDays, Clock3, MapPin, Search, Trophy, UserRound, Users, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import type { TeamCode } from "@/lib/types";

export type CommandTarget =
  | { type: "tournament"; tournamentIndex: number }
  | { type: "team"; teamCode: TeamCode; tournamentIndex: number }
  | { type: "match"; matchIndex: number; tournamentIndex: number }
  | { type: "venue"; tournamentIndex: number; venueId: string };

export type CommandItem = {
  description: string;
  featuredLabel?: string;
  id: string;
  keywords: string;
  kind: "favorite" | "match" | "player" | "recent" | "resume" | "team" | "tournament" | "venue";
  label: string;
  target: CommandTarget;
};

type CommandPaletteProps = {
  featuredItems: CommandItem[];
  isOpen: boolean;
  items: CommandItem[];
  onClose: () => void;
  onSelect: (item: CommandItem) => void;
};

function normalize(value: string) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

function ResultIcon({ kind }: { kind: CommandItem["kind"] }) {
  if (kind === "team") return <Users size={18} />;
  if (kind === "match") return <CalendarDays size={18} />;
  if (kind === "venue") return <MapPin size={18} />;
  if (kind === "player") return <UserRound size={18} />;
  if (kind === "resume" || kind === "recent") return <Clock3 size={18} />;
  return <Trophy size={18} />;
}

export function CommandPalette({ featuredItems, isOpen, items, onClose, onSelect }: CommandPaletteProps) {
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const dialogRef = useRef<HTMLDivElement | null>(null);

  const visibleItems = useMemo(() => {
    const normalizedQuery = normalize(query.trim());
    if (!normalizedQuery) return featuredItems.slice(0, 12);

    const terms = normalizedQuery.split(/\s+/).filter(Boolean);
    return items
      .map((item) => {
        const haystack = normalize(`${item.label} ${item.description} ${item.keywords}`);
        const matches = terms.every((term) => haystack.includes(term));
        const score = normalize(item.label).startsWith(normalizedQuery) ? 0 : haystack.includes(normalizedQuery) ? 1 : 2;
        return { item, matches, score };
      })
      .filter((entry) => entry.matches)
      .sort((left, right) => left.score - right.score || left.item.label.localeCompare(right.item.label))
      .slice(0, 40)
      .map((entry) => entry.item);
  }, [featuredItems, items, query]);

  useEffect(() => {
    if (!isOpen) return;
    setQuery("");
    setActiveIndex(0);
    window.requestAnimationFrame(() => inputRef.current?.focus());
  }, [isOpen]);

  useEffect(() => {
    setActiveIndex((index) => Math.min(index, Math.max(visibleItems.length - 1, 0)));
  }, [visibleItems.length]);

  if (!isOpen) return null;

  function selectItem(item: CommandItem | undefined) {
    if (!item) return;
    onSelect(item);
  }

  return (
    <div
      aria-label="Search the World Cup archive"
      aria-modal="true"
      className="command-palette-backdrop"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
      role="dialog"
    >
      <div
        className="command-palette"
        onKeyDown={(event) => {
          if (event.key === "Escape") {
            event.preventDefault();
            onClose();
          }
          if (event.key === "ArrowDown") {
            event.preventDefault();
            setActiveIndex((index) => Math.min(index + 1, visibleItems.length - 1));
          }
          if (event.key === "ArrowUp") {
            event.preventDefault();
            setActiveIndex((index) => Math.max(index - 1, 0));
          }
          if (event.key === "Enter") {
            event.preventDefault();
            selectItem(visibleItems[activeIndex]);
          }
          if (event.key === "Tab") {
            const focusable = dialogRef.current?.querySelectorAll<HTMLElement>("input, button");
            if (!focusable?.length) return;
            const first = focusable[0];
            const last = focusable[focusable.length - 1];
            if (event.shiftKey && document.activeElement === first) {
              event.preventDefault();
              last.focus();
            } else if (!event.shiftKey && document.activeElement === last) {
              event.preventDefault();
              first.focus();
            }
          }
        }}
        ref={dialogRef}
      >
        <div className="command-search-row">
          <Search aria-hidden="true" size={20} />
          <label className="sr-only" htmlFor="archive-search">Search tournaments, teams, fixtures, players, and venues</label>
          <input
            aria-controls="archive-search-results"
            aria-expanded="true"
            aria-label="Search tournaments, teams, fixtures, players, and venues"
            autoComplete="off"
            id="archive-search"
            onChange={(event) => {
              setQuery(event.target.value);
              setActiveIndex(0);
            }}
            placeholder="Search teams, players, fixtures, venues, or years…"
            ref={inputRef}
            role="combobox"
            value={query}
          />
          <button aria-label="Close search" className="command-close" onClick={onClose} type="button">
            <X size={18} />
          </button>
        </div>

        <div aria-label="Search results" className="command-results" id="archive-search-results" role="listbox">
          {!query && featuredItems.length > 0 ? <p className="command-section-label">Continue and favorites</p> : null}
          {query && visibleItems.length > 0 ? <p className="command-section-label">{visibleItems.length} results</p> : null}
          {visibleItems.map((item, index) => (
            <button
              aria-selected={index === activeIndex}
              className={`command-result ${index === activeIndex ? "active" : ""}`}
              key={item.id}
              onClick={() => selectItem(item)}
              onMouseEnter={() => setActiveIndex(index)}
              role="option"
              type="button"
            >
              <span className="command-result-icon"><ResultIcon kind={item.kind} /></span>
              <span className="command-result-copy">
                <strong>{item.label}</strong>
                <small>{item.description}</small>
              </span>
              <span className="command-result-kind">{item.featuredLabel ?? item.kind}</span>
            </button>
          ))}
          {visibleItems.length === 0 ? (
            <div className="command-empty">
              <Search aria-hidden="true" size={22} />
              <strong>{query ? "No archive results" : "Search the archive"}</strong>
              <span>{query ? "Try a team, player, venue, fixture, or tournament year." : "Every World Cup edition is one search away."}</span>
            </div>
          ) : null}
        </div>

        <div className="command-footer" aria-hidden="true">
          <span><kbd>↑</kbd><kbd>↓</kbd> Navigate</span>
          <span><kbd>Enter</kbd> Open</span>
          <span><kbd>Esc</kbd> Close</span>
        </div>
      </div>
    </div>
  );
}
