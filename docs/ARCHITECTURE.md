# Rewind Cup architecture

This document gives contributors a working map of the application. It focuses
on ownership and data flow rather than duplicating implementation details.

## Runtime shape

Rewind Cup is a Next.js App Router application deployed to Cloudflare Workers
through OpenNext. Most of the experience runs in a single interactive client
shell, while route files provide permanent URLs and metadata for tournaments,
teams, and fixtures.

```text
URL and route metadata
        ↓
ReplayApp orchestration and UI state
        ├── HostMap: globe, countries, routes, cities, stadiums
        ├── TeamJourney: chronological country journey
        ├── CommandPalette: archive-wide discovery
        └── bottom trays: tournaments, teams, fixtures, highlights, settings
        ↓
Static tournament registry and normalized historical data
```

## Routes

`src/app/page.tsx` renders the root experience. The optional catch-all route at
`src/app/world-cups/[year]/[[...selection]]/page.tsx` restores a tournament,
team, or match and supplies route-specific metadata.

Supported permanent URL shapes are:

```text
/world-cups/{year}
/world-cups/{year}/teams/{team-code}
/world-cups/{year}/matches/{match-id}
```

Navigation helpers in `src/lib/experienceNavigation.ts` parse and construct
these URLs. Client-side selections update browser history so a view remains
shareable without a full reload.

## Experience state

`src/components/ReplayApp.tsx` is the orchestration boundary. It coordinates:

- the selected tournament, country, fixture, venue, and tray;
- globe, host-map, route, and stadium presentation modes;
- fixture travel and reduced-motion behavior;
- highlight playback and the fallback event simulator;
- favorites, recents, and resumable replay state;
- reporting, sharing, and command-palette actions.

The event simulator reducer lives in `src/lib/replay.ts`. Fixtures with a
playable embed use the highlight video as the primary replay and display the
final score immediately. Fixtures without playable media retain the simulated
playback controls, progressive score, event timeline, and latest moment.

User preferences are versioned and stored locally by
`src/lib/preferences.ts`. There is no account system or application database.

## Map rendering

`src/components/HostMap.tsx` owns MapLibre initialization and visual layers.
It receives experience state from `ReplayApp` and reports marker, route, and
arrival interactions upward.

The bundled map style is `public/map-styles/liberty.json`. Runtime map-source
selection and fallback behavior live in `src/lib/mapStyles.ts`. Map attribution
must remain visible. New map animation must also provide a reduced-motion path.

## Tournament data

The registry in `src/data/tournaments.ts` is the archive's entry point. A
completed edition usually has:

```text
worldCupYYYY.ts             fixtures, events, venues, results, highlights
worldCupYYYYExperience.ts   groups, team coordinates, historical format rules
```

Shared identities and flags are mapped in `src/data/teamMetadata.ts`. Core
types are defined in `src/lib/types.ts`.

Tournament records are intentionally static so routes can be deterministic,
reviewable, and deployable without a database. Data changes require source
notes and the validation workflow described in [CONTRIBUTING.md](../CONTRIBUTING.md).

## Highlight model

`src/data/highlights.ts` creates normalized media records. Rewind Cup stores
provider identifiers and links, not video files. An embeddable highlight must
have a verified YouTube embed and retain an official report URL where one is
available.

Because provider availability changes, static validation and live embed checks
are separate:

- `audit:highlights` validates local structure and policy;
- `audit:youtube-embeds` checks current provider availability over the network.

## Testing boundaries

- `typecheck` catches TypeScript contract errors.
- `validate:data` checks tournament record integrity.
- `audit:journey` checks team paths and tournament progression.
- `audit:highlights` checks highlight metadata.
- Playwright covers permanent routes, replay journeys, search, accessibility,
  and desktop/tablet/mobile layouts.

The development server deliberately chooses a random port and writes `.dev-url`.
Playwright reads that file when it starts. CI follows the same workflow.

## Deployment

`open-next.config.ts` and `wrangler.jsonc` define the Cloudflare Worker build.
Deployment credentials belong in Cloudflare or local ignored environment
files and must never be committed. Only maintainers of the official project
control `rewindcup.com`; forks should use their own Worker and domain.
