import { db } from "$lib/server/db";
import { forumsTable } from "$lib/server/db/schema";
import { eq } from "drizzle-orm";
import type { LayoutServerLoad } from "./$types";

export const load = (async ({ params }) => {
  const forums = await db
    .select()
    .from(forumsTable)
    .where(eq(forumsTable.id, parseInt(params.id)))
    .limit(1);
  return { forum: forums[0] };
}) satisfies LayoutServerLoad;
