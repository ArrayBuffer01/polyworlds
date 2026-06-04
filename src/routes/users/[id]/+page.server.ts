import { db } from "$lib/server/db";
import { usersTable } from "$lib/server/db/schema";
import { eq } from "drizzle-orm";
import type { PageServerLoad } from "./$types";

export const load = (async ({ params }) => {
  console.log(params);
  const user = await db.select().from(usersTable).where(eq(usersTable.id, params.id));
  return { target: user[0] };
}) satisfies PageServerLoad;
