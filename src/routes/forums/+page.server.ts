import { db } from "$lib/server/db";
import { forumsTable } from "$lib/server/db/schema";
import type { PageServerLoad } from "./$types";

export const load = (async () => {
  const forums = await db.select().from(forumsTable);
  console.log(forums);
  return { forums };
}) satisfies PageServerLoad;
