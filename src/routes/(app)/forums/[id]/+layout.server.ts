import { error } from "@sveltejs/kit";
import type { LayoutServerLoad } from "./$types";
import { db } from "$lib/server/db";
import { forumsTable } from "$lib/server/db/schema";
import { eq } from "drizzle-orm";

export const load = (async ({ params }) => {
  const forums = await db
    .select()
    .from(forumsTable)
    .where(eq(forumsTable.id, parseInt(params.id)))
    .limit(1);

  if (!forums.length) error(404, "This forum does not exist!");

  const currForum = forums[0];
  return { forum: currForum };
  
}) satisfies LayoutServerLoad;
