import { tournaments } from "../src/data/tournaments";
import type { HighlightStatus, Match } from "../src/lib/types";

const statusOrder = ["embeddable-video", "external-video", "official-report", "none"] satisfies HighlightStatus[];

function getStatusCounts(matches: Match[]) {
  return matches.reduce(
    (counts, match) => {
      counts[match.highlights.status] += 1;
      return counts;
    },
    {
      "embeddable-video": 0,
      "external-video": 0,
      "official-report": 0,
      none: 0
    } satisfies Record<HighlightStatus, number>
  );
}

for (const tournament of tournaments) {
  const counts = getStatusCounts(tournament.matches);
  const playablePercent = Math.round((counts["embeddable-video"] / tournament.matches.length) * 100);

  console.log(`${tournament.name}`);
  console.log(`  matches: ${tournament.matches.length}`);
  console.log(`  playable coverage: ${counts["embeddable-video"]}/${tournament.matches.length} (${playablePercent}%)`);

  for (const status of statusOrder) {
    console.log(`  ${status}: ${counts[status]}`);
  }

  const reportOnlyMatches = tournament.matches.filter((match) => match.highlights.status === "official-report");
  if (reportOnlyMatches.length > 0) {
    console.log("  report-only fixtures:");
    for (const match of reportOnlyMatches) {
      console.log(`    - ${match.id}`);
    }
  }
}
