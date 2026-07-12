import { teamColors, teamFlags, teamNames } from "@/data/teamMetadata";
import { worldCup2002 } from "@/data/worldCup2002";
import { worldCup2006 } from "@/data/worldCup2006";
import { worldCup2010 } from "@/data/worldCup2010";
import type { Tournament } from "@/lib/types";

export const tournaments: Tournament[] = [worldCup2002, worldCup2006, worldCup2010];

export { teamColors, teamFlags, teamNames };
