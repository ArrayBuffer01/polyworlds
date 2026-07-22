import { getTableColumns } from "drizzle-orm";
import { usersTable } from "./server/db/schema";

export const { passwordHash, email, lastReward, gold, coins, ...userTableColumns } =
  getTableColumns(usersTable);