# Tournament data sources

## Italy 1990

Tournament structure, original match numbers, dates, venues, results, and
knockout decisions were checked against FIFA's technical report, the printed
match sheets in Part 6, and the current FIFA match-centre archive:

- FIFA technical report mirror: https://www.ussoccerhistory.org/wp-content/uploads/2025/01/brkz1xag78acwvd3tbww-compressed.pdf
- FIFA Technical Report Part 6 match sheets: https://web.archive.org/web/20091128075446/http://www.fifa.com/mm/document/afdeveloping/technicaldevp/50/08/69/fwc%5Fitaly%5F1990%5Fa%5Fpart6%5F273.pdf
- FIFA tournament archive: https://www.fifa.com/en/tournaments/mens/worldcup/1990italy

The numbers printed by FIFA are used instead of chronological database IDs.
This remaps chronological fixtures 3–4, 14–16, and 29–30; for example, FIFA
match 3 is Italy–Austria and match 29 is Italy–Czechoslovakia.

Scorers, event minutes, and stadium records were cross-checked with the Fjelstul
World Cup Database. Its records were joined by match ID and then remapped to
the printed FIFA schedule by exact date and teams:

- Database: https://github.com/jfjelstul/worldcup
- Matches: https://raw.githubusercontent.com/jfjelstul/worldcup/master/data-csv/matches.csv
- Goals: https://raw.githubusercontent.com/jfjelstul/worldcup/master/data-csv/goals.csv
- Stadiums: https://raw.githubusercontent.com/jfjelstul/worldcup/master/data-csv/stadiums.csv
- License: https://creativecommons.org/licenses/by-sa/4.0/legalcode

The dataset contains 52 matches, 115 match goals excluding shootout kicks, 24
teams, and 12 stadiums. It represents all four shootouts and every extra-time
decision. Stoppage-time events use their regulation minute, and stadium/team
coordinates are approximate map anchors.

Every fixture has an exact-match YouTube highlight. On July 12, 2026, all 52
selected videos matched the teams and score and returned both
`previewPlayabilityStatus: OK` and `playableInEmbed: true` from YouTube's real
embedded-player response with the app origin. FIFA-owned candidates that
blocked third-party playback were replaced with verified exact-match videos,
while every fixture retains its official FIFA report link.

Re-run the live check with `npm run audit:youtube-embeds -- wc-1990`.

## USA 1994

Tournament structure, FIFA match numbers, dates, venues, results, and knockout
decisions were checked against FIFA's technical report and current match-centre
archive. The published numbers are used instead of chronological database IDs
for four simultaneous final-group pairs: 25–26, 29–30, 33–34, and 35–36.

- FIFA technical report mirror: https://www.ussoccerhistory.org/wp-content/uploads/2025/01/rehuff9ok6ejtpfcppyg-compressed.pdf
- FIFA tournament archive: https://www.fifa.com/en/tournaments/mens/worldcup/1994usa

Scorers, event minutes, and stadium records were cross-checked with the Fjelstul
World Cup Database. Its chronological records were joined by match ID and then
remapped to FIFA's published schedule by exact date and teams:

- Database: https://github.com/jfjelstul/worldcup
- Matches: https://raw.githubusercontent.com/jfjelstul/worldcup/master/data-csv/matches.csv
- Goals: https://raw.githubusercontent.com/jfjelstul/worldcup/master/data-csv/goals.csv
- Stadiums: https://raw.githubusercontent.com/jfjelstul/worldcup/master/data-csv/stadiums.csv
- License: https://creativecommons.org/licenses/by-sa/4.0/legalcode

The dataset contains 52 matches, 141 match goals excluding shootout kicks, 24
teams, and nine stadiums. Stoppage-time events use their regulation minute, and
stadium/team coordinates are approximate map anchors.

Every fixture has an exact-match YouTube highlight. On July 12, 2026, all 52
selected videos matched the teams and score and returned both
`previewPlayabilityStatus: OK` and `playableInEmbed: true` from YouTube's real
embedded-player response with the app origin. FIFA-owned candidates checked
during research blocked third-party iframe playback, so verified alternatives
are used while every fixture retains its official FIFA report link.

Re-run the live check with `npm run audit:youtube-embeds -- wc-1994`.

## France 1998

Tournament structure, original France 98 match numbers, dates, venues, results,
and knockout decisions were checked against the organizing committee's final
schedule, FIFA's technical report, and the current match-centre archive:

- Original France 98 schedule: https://blog.france98.com/english/competition/schedule.htm
- FIFA technical report mirror: https://www.ussoccerhistory.org/wp-content/uploads/2025/01/cdss2jypfpayjhdbkpom-compressed.pdf
- FIFA tournament archive: https://www.fifa.com/worldcup/archive/france1998/matches

Scorers, event minutes, and stadium records were cross-checked with the same
Fjelstul match, goal, and stadium datasets linked above. The resulting dataset
contains 64 matches, 171 match goals excluding shootout kicks, 32 teams, and 10
stadiums. It includes all three shootouts and France's golden goal against
Paraguay.

Every fixture has an exact-match YouTube highlight. On July 12, 2026, all 64
selected videos passed the real iframe checks used for USA 1994. Fifty-nine are
from World Cup Goals and five use verified alternatives. YouTube's archive
titles number several simultaneous final-group games by kickoff chronology, so
those videos were remapped by exact teams and score while the app preserves the
original published France 98 fixture numbers. Every match also retains its
official FIFA report link.

Re-run the live check with `npm run audit:youtube-embeds -- wc-1998`.

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

## South Africa 2010

The tournament structure, official match numbers, dates, venues, results, and
knockout decisions were checked against FIFA's final match schedule and
technical report. The official schedule numbers are intentionally used instead
of simple kickoff chronology for several group-stage pairs:

- FIFA final match schedule: https://www.team-bhp.com/forum/attachments/shifting-gears/364960d1276190828-fifa-2010-schedule-timings-ist-score-standing-results-update-fifa-schedule.pdf
- Archived FIFA Technical Report: https://web.archive.org/web/20101011115552/http://www.fifa.com/mm/document/affederation/technicaldevp/01/29/30/95/reportwm2010_web.pdf
- FIFA tournament archive: https://www.fifa.com/en/tournaments/mens/worldcup/2010south-africa

Scorers, event minutes, and stadium records were cross-checked with the Fjelstul
World Cup Database. Its chronological match records were joined by exact date
and teams, then remapped to FIFA's official schedule numbers:

- Database: https://github.com/jfjelstul/worldcup
- Matches: https://raw.githubusercontent.com/jfjelstul/worldcup/master/data-csv/matches.csv
- Goals: https://raw.githubusercontent.com/jfjelstul/worldcup/master/data-csv/goals.csv
- Stadiums: https://raw.githubusercontent.com/jfjelstul/worldcup/master/data-csv/stadiums.csv
- License: https://creativecommons.org/licenses/by-sa/4.0/legalcode

The resulting dataset contains 64 matches, 145 match goals excluding shootout
kicks, 32 teams, and 10 stadiums across nine host cities. Historical 2010 city
names are retained, and stadium/team coordinates are approximate map anchors.

Every fixture has an exact-match YouTube highlight. On July 12, 2026, all 64
selected videos matched the fixture teams and score and returned both
`previewPlayabilityStatus: OK` and `playableInEmbed: true` from YouTube's real
embedded-player response with the app origin. FIFA's own candidate videos
blocked third-party iframe playback, so verified alternatives are used while
each fixture retains its current official FIFA match-report link.

Re-run the live check with `npm run audit:youtube-embeds` for every tournament,
or `npm run audit:youtube-embeds -- wc-2010` to check one edition.

## Brazil 2014

Tournament structure, final match numbers, dates, venues, results, and knockout
decisions were checked against FIFA's final schedule and tournament archive.
The official numbers are deliberately preserved even where kickoff chronology
differs, including quarter-finals 57 through 60:

- FIFA final match schedule: https://fcf.com.co/wp-content/uploads/2013/12/CalendarioBrasil2014.pdf
- Archived FIFA Technical Study Group report: https://web.archive.org/web/20140819085815/http://www.fifa.com/mm/document/footballdevelopment/technicalsupport/02/42/15/40/2014fwc_tsg_report_15082014_neutral.pdf
- FIFA tournament archive: https://www.fifa.com/tournaments/mens/worldcup/2014brazil

Scorers, event minutes, and stadium records were cross-checked with the Fjelstul
World Cup Database. Its chronological match and goal records were joined by
match ID, then remapped to the official schedule by date and teams:

- Database: https://github.com/jfjelstul/worldcup
- Matches: https://raw.githubusercontent.com/jfjelstul/worldcup/master/data-csv/matches.csv
- Goals: https://raw.githubusercontent.com/jfjelstul/worldcup/master/data-csv/goals.csv
- Stadiums: https://raw.githubusercontent.com/jfjelstul/worldcup/master/data-csv/stadiums.csv
- License: https://creativecommons.org/licenses/by-sa/4.0/legalcode

The resulting dataset contains 64 matches, 171 match goals excluding shootout
kicks, 32 teams, and 12 stadiums. Stoppage-time events use their regulation
minute so replay ordering remains compatible with the earlier editions, and
stadium/team coordinates are approximate map anchors.

Every fixture has an exact-match YouTube highlight. On July 12, 2026, all 64
selected videos matched the fixture teams and score and returned both
`previewPlayabilityStatus: OK` and `playableInEmbed: true` from YouTube's real
embedded-player response with the app origin. The FIFA-owned candidates checked
from the official playlist blocked third-party iframe playback, so verified
alternatives are used while every fixture retains its official FIFA match link:

- FIFA Brazil 2014 playlist: https://www.youtube.com/playlist?list=PLCGIzmTE4d0i4BvAgy-hShwPB3R6az-wL

Re-run the live check with `npm run audit:youtube-embeds -- wc-2014`.
