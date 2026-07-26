import { ONE_DAY } from "$lib/constants";
import type { User } from "lucia";
import { db } from "./db";
import { usersTable } from "./db/schema";
import { eq } from "drizzle-orm";
import { hashIP } from "./hashing";

export async function updateLoginStreak(user: User) {
  const now = new Date();
  const deltaDays = Math.floor((now.getTime() - user.lastLogin.getTime()) / ONE_DAY);

  let streak: number = user.loginStreak;

  if (deltaDays > 1) {
    streak = 1;
  } else if (deltaDays === 1) {
    streak++;
  }

  if (streak != user.loginStreak) {
    await db
      .update(usersTable)
      .set({ loginStreak: streak, lastLogin: now })
      .where(eq(usersTable.id, user.id));
  }

  return streak;
}

export async function updateIPHash(user: User, newIPAdress: string) {
  const ipHash = hashIP(newIPAdress);

  if (ipHash != user.lastUsedIPHash) {
    await db.update(usersTable).set({ lastUsedIPHash: ipHash }).where(eq(usersTable.id, user.id));
  }

  return ipHash;
}
