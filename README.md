# Rewind Cup

![Rewind Cup archive banner](public/images/world-cup-archive-banner.webp)

Rewind Cup is an interactive archive for reliving men's FIFA World Cup tournaments through a globe, historical fixtures, stadium journeys, match events, and playable highlights.

The archive currently covers 23 editions from Uruguay 1930 through Canada, Mexico & USA 2026. The 2026 edition is an in-progress snapshot through both semi-finals; completed historical editions contain their full tournament journeys.

## What you can do

- Explore every tournament from a responsive 3D globe.
- Follow a country's chronological route through a World Cup.
- Travel from the world view to host cities and individual stadiums.
- Replay match events and watch verified embeddable highlights.
- Search tournaments, teams, fixtures, players, venues, and years.
- Save favorites and resume an unfinished replay.
- Share permanent tournament, team, and fixture URLs.
- Report incorrect page data or highlights directly to the project creator.
- Navigate the experience by keyboard across desktop, tablet, and mobile layouts.

## Technology

- [Next.js](https://nextjs.org/) 16 and React 19
- TypeScript
- [MapLibre GL JS](https://maplibre.org/maplibre-gl-js/docs/)
- OpenFreeMap/OpenStreetMap map data
- Playwright end-to-end testing
- OpenNext and Cloudflare Workers

## Getting started

### Requirements

- Node.js 22 is recommended; the minimum supported version is Node.js 20.9.
- npm
- A Chromium executable for the Playwright suite

The repository includes an `.nvmrc`, so nvm users can select the expected Node.js version with:

```bash
nvm use
```

Install the dependencies:

```bash
npm install
```

The default OpenFreeMap configuration works without environment variables. Copy the example file only when you want to override the map provider or building-layer settings:

```bash
cp .env.example .env.local
```

### Development server

```bash
npm run dev
```

The development script deliberately selects a free random port to avoid clashing with other local services. It prints the selected address and records it in `.dev-url` while the server is running:

```bash
cat .dev-url
```

The same file is used automatically by the Playwright and YouTube embed-audit scripts. The file is removed when the development process exits.

## Environment variables

All map variables are optional.

| Variable | Purpose | Default |
| --- | --- | --- |
| `NEXT_PUBLIC_MAP_STYLE_URL` | MapLibre style URL, or `osm-raster` for the raster fallback | Bundled OpenFreeMap Liberty style |
| `NEXT_PUBLIC_MAP_BUILDING_SOURCE` | Vector source containing building geometry | `openmaptiles` |
| `NEXT_PUBLIC_MAP_BUILDING_SOURCE_LAYER` | Building source layer | `building` |
| `NEXT_PUBLIC_MAP_BUILDING_MIN_ZOOM` | Minimum zoom for 3D building extrusion | `13` |
| `PLAYWRIGHT_BASE_URL` | Overrides `.dev-url` for end-to-end tests | `.dev-url`, then `http://localhost:3001` |
| `PLAYWRIGHT_CHROMIUM_PATH` | Chromium executable used by Playwright | `/opt/homebrew/bin/chromium` |
| `YOUTUBE_EMBED_ORIGIN` | Origin supplied while checking YouTube embed availability | `.dev-url`, then `http://localhost:3001` |

## Quality checks

Run the static checks and production build:

```bash
npm run typecheck
npm run build
```

Run the end-to-end suite while the development server is already running:

```bash
npm run test:e2e
```

The Playwright suite covers desktop, tablet, and mobile projects. If Chromium is installed elsewhere, provide its executable explicitly:

```bash
PLAYWRIGHT_CHROMIUM_PATH=/path/to/chromium npm run test:e2e
```

For visible browser runs:

```bash
npm run test:e2e:headed
```

## Tournament data

Tournament records live in `src/data`. Each edition normally has two files:

- `worldCupYYYY.ts` contains venues, fixtures, scores, events, and highlights.
- `worldCupYYYYExperience.ts` contains groups, team coordinates, and historical format rules.

All editions are registered in `src/data/tournaments.ts`. Team metadata and flag mappings are shared from `src/data/teamMetadata.ts` and `public/flags`.

Run the local data checks after changing a tournament:

```bash
npm run validate:data
npm run audit:journey
npm run audit:highlights
```

YouTube availability changes over time. With the development server running, check every configured video or a single tournament:

```bash
npm run audit:youtube-embeds
npm run audit:youtube-embeds -- wc-2006
```

The live embed audit makes network requests to YouTube. Source notes, historical format decisions, dataset licenses, and per-edition verification details are maintained in [DATA_SOURCES.md](DATA_SOURCES.md).

## Project structure

```text
src/
├── app/                         Next.js routes, metadata, and global styles
├── components/                  Map, replay, search, and journey interfaces
├── data/                        Tournament and team datasets
└── lib/                         Replay state, navigation, preferences, and types
public/
├── flags/                       Team flag assets
├── images/                      Landing and map artwork
└── map-styles/                  Bundled MapLibre style
scripts/                         Development and data-quality tooling
tests/e2e/                       Playwright user-journey and accessibility tests
```

Permanent experience routes use these shapes:

```text
/world-cups/{year}
/world-cups/{year}/teams/{team-code}
/world-cups/{year}/matches/{match-id}
```

These routes allow tournament, team, and fixture views to be shared and restored directly.

## Deploying to Cloudflare

The application is configured for Cloudflare Workers through OpenNext. Authenticate once with Wrangler:

```bash
npx wrangler login
```

Build and run the Cloudflare-compatible local preview:

```bash
npm run preview
```

Generate Cloudflare binding types after changing `wrangler.jsonc`:

```bash
npm run cf-typegen
```

Deploy the Worker:

```bash
npm run deploy
```

`npm run upload` creates a new Worker version without immediately deploying it. Incremental R2 caching is intentionally disabled because the application does not currently use ISR or Next.js data caching.

## Data and media notice

Rewind Cup is an independent archival project and is not affiliated with or endorsed by FIFA. FIFA and World Cup names and marks belong to their respective owners. Match videos are embedded from their external providers and remain subject to the providers' availability and terms.

Map data and attribution are supplied in the interface by OpenFreeMap and OpenStreetMap. Historical tournament records are cross-checked against the sources documented in [DATA_SOURCES.md](DATA_SOURCES.md).

---

Made with love by [David Oti](https://x.com/iamdavidoti).
