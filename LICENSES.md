# Licensing and third-party notices

Rewind Cup uses multiple licenses because the repository contains software,
curated historical data, third-party map resources, and project branding.

## Software

Unless a file or directory is listed below, the source code, scripts, tests,
configuration, and documentation are available under the [MIT License](LICENSE).

## Tournament data

The historical records and derived dataset content in these files are
available under the [Creative Commons Attribution-ShareAlike 4.0 International
license](https://creativecommons.org/licenses/by-sa/4.0/):

- `src/data/worldCup*.ts`
- `src/data/worldCup*Experience.ts`
- factual tournament and team records in `src/data/teamMetadata.ts`
- factual tournament registration metadata in `src/data/tournaments.ts`

The surrounding TypeScript implementation remains MIT-licensed. Where the
data and implementation cannot reasonably be separated, recipients should
comply with both licenses.

Significant parts of the historical dataset were adapted from the Fjelstul
World Cup Database:

> © 2023 Joshua C. Fjelstul, Ph.D. The Fjelstul World Cup Database is licensed
> under CC BY-SA 4.0. Rewind Cup modifies, normalizes, joins, and supplements
> the source records for an interactive archive.

- Source: https://github.com/jfjelstul/worldcup
- License: https://creativecommons.org/licenses/by-sa/4.0/legalcode
- Rewind Cup source and modification notes: [DATA_SOURCES.md](DATA_SOURCES.md)

Contributions to these data files must preserve source attribution and are
accepted under CC BY-SA 4.0 for the dataset portions of the contribution.

## Maps

`public/map-styles/liberty.json` is a locally hosted, modified form of the
OpenFreeMap Liberty style. OpenFreeMap is MIT-licensed and uses the
OpenMapTiles schema. Map data is supplied by OpenStreetMap contributors under
the Open Database License. Required attribution is rendered by the map UI.

- OpenFreeMap: https://openfreemap.org/
- OpenMapTiles: https://openmaptiles.org/
- OpenStreetMap copyright and license: https://www.openstreetmap.org/copyright

## Flags

The simplified SVG flag depictions in `public/flags` identify national and
historical teams. National flags and emblems may be governed by jurisdiction-
specific laws even where copyright does not apply. No trademark rights or
official endorsement are claimed by their inclusion.

## Brand artwork and videos

The Rewind Cup name, logo, social card, mural, archive banner, and promotional
videos in these locations are not granted under the MIT or CC BY-SA licenses:

- `src/app/icon.svg`
- `public/images`
- `public/videos`

Copyright and other rights in those project brand assets are reserved by
David Oti. You may reference the Rewind Cup name to describe the project or
your contribution, but forks should replace the brand assets and must not
imply that they are the official Rewind Cup deployment.

## External match media

Rewind Cup does not redistribute match footage. YouTube videos and FIFA match
reports are linked or embedded from their external providers and remain under
their respective owners' terms. A URL in the dataset does not grant a license
to download or redistribute the underlying media.

If you believe an attribution or license notice is incomplete, please open a
licensing issue before reusing the affected material.
