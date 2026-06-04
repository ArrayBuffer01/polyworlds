import { form, getRequestEvent, query } from "$app/server";
import { db } from "$lib/server/db";
import { userFeedTable, usersTable } from "$lib/server/db/schema";
import { desc, eq } from "drizzle-orm";
import * as z from "zod";

export const postFeed = form(
  z.object({
    content: z.string().min(2).max(280)
  }),
  async ({ content }) => {
    const { locals } = getRequestEvent();
    if (locals.user) {
      console.log(locals.user.username + " posted: " + content);

      await db.insert(userFeedTable).values({
        userId: locals.user.id,
        content: content,
        createdAt: new Date()
      });

      getFeeds().refresh();
    }
  }
);

export const getFeeds = query(async () => {
  const feeds = await db
    .select()
    .from(userFeedTable)
    .innerJoin(usersTable, eq(userFeedTable.userId, usersTable.id))
    .orderBy(desc(userFeedTable.createdAt))
    .limit(15);
  return feeds.map((feed) => ({
    feed: feed.user_feed,
    user: feed.user
  }));
});
