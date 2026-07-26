import { db } from "$lib/server/db";
import { forumPostsTable, usersTable } from "$lib/server/db/schema";
import { eq, getTableColumns } from "drizzle-orm";
import type { PageServerLoad } from "./$types";
import { userTableColumns } from "$lib/tableColumns";

const PAGE_SIZE = 10;

export const load = (async ({ url, parent }) => {
  const parentData = await parent();
  const currPage = Math.max(1, parseInt(url.searchParams.get("page") ?? "1") || 1);
  const posts = await db
    .select({
      post: getTableColumns(forumPostsTable),
      user: userTableColumns
    })
    .from(forumPostsTable)
    .where(eq(forumPostsTable.forumId, parentData.forum.id))
    .leftJoin(usersTable, eq(forumPostsTable.userId, usersTable.id))
    .limit(PAGE_SIZE)
    .offset((currPage - 1) * PAGE_SIZE);
  return { posts };
}) satisfies PageServerLoad;
