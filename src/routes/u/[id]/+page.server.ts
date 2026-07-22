import { db } from "$lib/server/db";
import { medalsTable, ownedMedalsTable, usersTable } from "$lib/server/db/schema";
import { eq, getTableColumns } from "drizzle-orm";
import type { PageServerLoad } from "./$types";
import { error } from "@sveltejs/kit";

const { passwordHash, email, lastReward, gold, coins, ...restUserColumns } =
  getTableColumns(usersTable);

export const load = (async ({ params }) => {
  const userId = parseInt(params.id);

  if (isNaN(userId)) {
    error(400, "Invalid user ID");
  }

  const rows = await db
    .select({
      user: restUserColumns,
      medal: getTableColumns(medalsTable)
    })
    .from(usersTable)
    .leftJoin(ownedMedalsTable, eq(usersTable.id, ownedMedalsTable.userId))
    .leftJoin(medalsTable, eq(ownedMedalsTable.medalId, medalsTable.id))
    .where(eq(usersTable.id, userId));

  if (!rows.length) {
    error(404, "This user does not exist!");
  }

  return {
    profile: {
      ...rows[0].user,
      medals: rows.map((row) => row.medal).filter((medal) => !!medal)
    }
  };
}) satisfies PageServerLoad;
