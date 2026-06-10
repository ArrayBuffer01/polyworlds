import { command, getRequestEvent } from "$app/server";
import { ONE_DAY } from "$lib/constants";
import { db } from "$lib/server/db";
import { usersTable } from "$lib/server/db/schema";
import { eq, sql } from "drizzle-orm";

export const claimReward = command(async () => {
  const { locals } = getRequestEvent();

  if (!locals.user) return { success: false };

  let lastReward = locals.user?.lastReward?.getTime() ?? null;

  if (!lastReward || Date.now() - lastReward > ONE_DAY) {
    lastReward = Date.now();
    const updatedUser = await db
      .update(usersTable)
      .set({ lastReward: new Date(lastReward), coins: sql`${usersTable.coins} + 10` })
      .where(eq(usersTable.id, locals.user?.id))
      .returning();

    return { success: true, lastReward, coins: updatedUser[0].coins, gold: updatedUser[0].gold };
  }

  return { success: false };
});
