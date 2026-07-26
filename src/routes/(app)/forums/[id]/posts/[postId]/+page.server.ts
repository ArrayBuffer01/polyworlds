import { db } from "$lib/server/db";
import { forumPostRepliesTable, usersTable } from "$lib/server/db/schema";
import { eq, getTableColumns } from "drizzle-orm";
import type { PageServerLoad } from "./$types";
import { userTableColumns } from "$lib/tableColumns";

export const load = (async ({ parent }) => {
  const parentData = await parent();

  const replies = await db
    .select({
      user: userTableColumns,
      reply: getTableColumns(forumPostRepliesTable)
    })
    .from(forumPostRepliesTable)
    .where(eq(forumPostRepliesTable.postId, parentData.post.post.id))
    .leftJoin(usersTable, eq(forumPostRepliesTable.userId, usersTable.id));

  return { replies };
}) satisfies PageServerLoad;
