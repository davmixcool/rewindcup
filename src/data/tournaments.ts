import { teamColors, teamFlags, teamNames } from "@/data/teamMetadata";
import { worldCup1990 } from "@/data/worldCup1990";
import { worldCup1994 } from "@/data/worldCup1994";
import { worldCup1998 } from "@/data/worldCup1998";
import { worldCup2002 } from "@/data/worldCup2002";
import { worldCup2006 } from "@/data/worldCup2006";
import { worldCup2010 } from "@/data/worldCup2010";
import { worldCup2014 } from "@/data/worldCup2014";
import type { Tournament } from "@/lib/types";

export const tournaments: Tournament[] = [worldCup1990, worldCup1994, worldCup1998, worldCup2002, worldCup2006, worldCup2010, worldCup2014];

export { teamColors, teamFlags, teamNames };
