# Rewind Cup

[![CI](https://github.com/davmixcool/rewindcup/actions/workflows/ci.yml/badge.svg)](https://github.com/davmixcool/rewindcup/actions/workflows/ci.yml)
[![Software license: MIT](https://img.shields.io/badge/software-MIT-67C6FD.svg)](LICENSE)
[![Data license: CC BY--SA 4.0](https://img.shields.io/badge/data-CC%20BY--SA%204.0-67C6FD.svg)](LICENSES.md)

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
| `PLAYWRIGHT_CHROMIUM_PATH` | Optional Chromium executable override used by Playwright | Bundled Playwright browser; Homebrew Chromium is auto-detected on macOS |
| `YOUTUBE_EMBED_ORIGIN` | Origin supplied while checking YouTube embed availability | `.dev-url`, then `http://localhost:3001` |
| `NEXT_PUBLIC_SITE_URL` | Canonical production origin for metadata and shared links | `https://rewindcup.com` |
| `NEXT_PUBLIC_CLOUDFLARE_WEB_ANALYTICS_TOKEN` | Optional token for manual Cloudflare Web Analytics installation | Disabled |

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

## Contributing

Contributions are welcome. Good starting points include accessibility fixes,
dead-highlight replacements, well-sourced data corrections, documentation,
tests, and responsive-interface improvements.

Before opening a pull request:

- read [CONTRIBUTING.md](CONTRIBUTING.md);
- follow the [Code of Conduct](CODE_OF_CONDUCT.md);
- review the [architecture](docs/ARCHITECTURE.md) and
  [licensing boundaries](LICENSES.md);
- use the repository's issue forms for bugs, data corrections, and dead
  highlights;
- report vulnerabilities privately according to [SECURITY.md](SECURITY.md).

Project decisions and maintainer responsibilities are described in
[GOVERNANCE.md](GOVERNANCE.md).

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

### Cloudflare Web Analytics

For a custom domain proxied through Cloudflare, add the hostname under **Cloudflare Dashboard → Web Analytics → Add a site**. Cloudflare enables automatic beacon injection by default, so no application token is required.

If you prefer a manual installation, change the site's dashboard setup to manual, copy its site token, and set `NEXT_PUBLIC_CLOUDFLARE_WEB_ANALYTICS_TOKEN` in `.env.production.local` before building or deploying. Rewind Cup will then load the beacon only in production. Do not enable automatic injection and the manual token together, because that would count page views twice.

Cloudflare Web Analytics automatically follows the application's client-side History API navigation. The dashboard reports page views, referrers, popular routes, devices, countries, and Core Web Vitals without adding analytics cookies.

## Data and media notice

Rewind Cup is an independent archival project and is not affiliated with or endorsed by FIFA. FIFA and World Cup names and marks belong to their respective owners. Match videos are embedded from their external providers and remain subject to the providers' availability and terms.

Map data and attribution are supplied in the interface by OpenFreeMap and OpenStreetMap. Historical tournament records are cross-checked against the sources documented in [DATA_SOURCES.md](DATA_SOURCES.md).

## License

Rewind Cup is a mixed-license repository:

- software and documentation are released under the [MIT License](LICENSE);
- adapted tournament data is released under CC BY-SA 4.0 with attribution;
- project brand artwork and promotional videos are not included in those
  grants.

See [LICENSES.md](LICENSES.md) for the exact file boundaries, third-party
notices, and reuse requirements.

---

Made with love by [David Oti](https://x.com/iamdavidoti).
