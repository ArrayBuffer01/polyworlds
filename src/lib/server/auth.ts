import { dev } from "$app/environment";
import { DrizzlePostgreSQLAdapter } from "@lucia-auth/adapter-drizzle";
import { Lucia } from "lucia";
import { db } from "./db";
import { sessionTable, usersTable } from "./db/schema";

const adapter = new DrizzlePostgreSQLAdapter(db, sessionTable, usersTable);

export const lucia = new Lucia(adapter, {
  sessionCookie: {
    attributes: {
      secure: !dev
    }
  },
  getUserAttributes: (data) => ({
    id: data.id,
    username: data.username,
    createdAt: data.createdAt,
    gold: data.gold,
    coins: data.coins,
    lastReward: data.lastReward,
    loginStreak: data.loginStreak,
    lastLogin: data.lastLogin,
    avatarHash: data.avatarHash
    ,avatarHeadshotHash: data.avatarHeadshotHash
  })
});

declare module "lucia" {
  interface Register {
    Lucia: typeof lucia;
    DatabaseUserAttributes: DatabaseUserAttributes;
    UserId: number;
  }
}

interface DatabaseUserAttributes {
  id: number;
  username: string;
  createdAt: Date;
  passwordHash: string;
  email: string;
  gold: number;
  coins: number;
  lastReward: Date;
  loginStreak: number;
  lastLogin: Date;
  avatarHash: string | null;
  avatarHeadshotHash: string | null;
}
