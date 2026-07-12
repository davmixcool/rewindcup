# Tournament data sources

## Korea/Japan 2002 highlights

Each fixture uses an exact-match YouTube highlight in the replay iframe. On
July 12, 2026, all 64 selected videos were checked through YouTube's embedded
player with the app origin and required both `previewPlayabilityStatus: OK` and
`playableInEmbed: true`.

That audit found 19 FIFA-owned videos that still resolved on YouTube but blocked
third-party iframe playback. Each was replaced with an exact-fixture video whose
teams and score were checked and whose embedded-player response passed. The
uploader remains visible in the app's highlight source label, and every fixture
keeps its separate official FIFA match-report link.

## Germany 2006

Tournament structure, official match numbering, teams, dates, venues, results,
and shootout decisions were checked against FIFA's *Report and Statistics —
2006 FIFA World Cup Germany*, especially pages 98–115:

- https://resources.fifa.com/image/upload/germany-2006-part-1-500834.pdf?cloudid=ddjn8odoi3vcgscxqds3

Goal-scorer names and event minutes were also cross-checked against the
Fjelstul World Cup Database v1.2.0:

> Fjelstul, Joshua C. *The Fjelstul World Cup Database v.1.2.0.* July 19, 2023.
> © 2023 Joshua C. Fjelstul, Ph.D.

- Database: https://github.com/jfjelstul/worldcup
- License: https://creativecommons.org/licenses/by-sa/4.0/legalcode

Each fixture has an exact-match YouTube highlight that uses the same embedded
player path as Korea/Japan 2002. FIFA's Germany 2006 playlist was checked first,
and the currently available videos in the World Cup Goals playlist cover most
fixtures:

- FIFA Germany 2006 playlist: https://www.youtube.com/playlist?list=PLCGIzmTE4d0iSMe4asTB_WzV0jk2VbmsS
- World Cup Goals playlist: https://www.youtube.com/playlist?list=PLT06sq1kVL4sph0CXopkrMo8DhqGCUNSO

Neither playlist currently exposes all 64 playable fixtures, and FIFA's own
candidate videos currently block third-party iframe playback. Exact-match
alternatives were selected individually for those gaps. At integration time,
every selected video matched the fixture teams and score and returned
`playableInEmbed: true` from YouTube's embedded player when requested with the
app origin. The uploader is identified by the highlight source label in the
app, while the official FIFA match report remains linked separately for every
fixture.

The app transforms those records into its replay schema, normalizes FIFA team
codes to the local code set, represents stoppage-time events at their regulation
minute, and adds app-specific replay copy. Stadium and team coordinates are
approximate map anchors; they are not values published by FIFA or Fjelstul.
