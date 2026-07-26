import { db } from "$lib/server/db";
import { usersTable } from "$lib/server/db/schema";
import { count, eq } from "drizzle-orm";
import type { RequestHandler } from "./$types";
import { json } from "@sveltejs/kit";

export const GET: RequestHandler = async ({ params }) => {
  const users = await db
    .select({ count: count() })
    .from(usersTable)
    .where(eq(usersTable.username, params.username))
    .limit(1);

  if (users.length > 0 && users[0].count > 0) {
    return json({ available: false });
  }

  return json({ available: true });
};
