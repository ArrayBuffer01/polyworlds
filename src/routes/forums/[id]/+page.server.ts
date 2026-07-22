import { db } from "$lib/server/db";
import { forumPostsTable, usersTable } from "$lib/server/db/schema";
import { eq } from "drizzle-orm";
import type { PageServerLoad } from "./$types";

const PAGE_SIZE = 10;

export const load = (async ({url}) => {
  const currPage = Math.max(1, parseInt(url.searchParams.get("page") ?? "1") || 1);
  const posts = await db.select().from(forumPostsTable).leftJoin(usersTable, eq(forumPostsTable.userId, usersTable.id)).limit(PAGE_SIZE).offset((currPage - 1) * PAGE_SIZE);
  return { posts };
}) satisfies PageServerLoad;
