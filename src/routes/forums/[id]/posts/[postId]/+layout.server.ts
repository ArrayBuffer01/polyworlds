import { error } from "@sveltejs/kit";
import type { LayoutServerLoad } from "./$types";
import { db } from "$lib/server/db";
import { forumPostsTable, usersTable } from "$lib/server/db/schema";
import { userTableColumns } from "$lib/tableColumns";
import { eq, getTableColumns } from "drizzle-orm";

export const load = (async ({ params }) => {
  const postId = parseInt(params.postId);

  if (isNaN(postId)) throw error(400, "Invalid Post ID");

  const [post] = await db
    .select({
      post: getTableColumns(forumPostsTable),
      user: userTableColumns
    })
    .from(forumPostsTable)
    .where(eq(forumPostsTable.id, postId))
    .leftJoin(usersTable, eq(forumPostsTable.userId, usersTable.id));

  return { post };
}) satisfies LayoutServerLoad;
