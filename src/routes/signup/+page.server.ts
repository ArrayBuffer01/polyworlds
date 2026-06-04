import { fail, redirect, type Actions } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { invalidateAll } from "$app/navigation";
import { lucia } from "$lib/server/auth";
import bcrypt from "bcrypt";
import { db } from "$lib/server/db";
import { usersTable } from "$lib/server/db/schema";
import { eq, sql } from "drizzle-orm";

export const load = (async () => {
  return {};
}) satisfies PageServerLoad;

export const actions = {
  signup: async ({ request, cookies }) => {
    const data = await request.formData();

    const username = data.get("username")?.toString();
    const email = data.get("email")?.toString();
    const password = data.get("password")?.toString();

    if (!username || !email || !password) {
      return fail(400, { error: "Username, email, and password are required" });
    }

    const user = await db.query.usersTable.findFirst({
      where: eq(usersTable.username, username)
    });

    if (user) {
      return fail(400, { error: "Username already exists" });
    }

    const emailUser = await db.query.usersTable.findFirst({
      where: eq(usersTable.email, email)
    });

    if (emailUser) {
      return fail(400, { error: "Email already exists" });
    }

    const passwordHash = bcrypt.hashSync(password, 10);

    const newUser = await db
      .insert(usersTable)
      .values({
        username,
        email,
        passwordHash,
        createdAt: new Date(),
        gold: 0,
        coins: 0
      })
      .returning();

    if (newUser.length > 0) {
      const session = await lucia.createSession(newUser[0].id, {});
      const sessionCookie = lucia.createSessionCookie(session.id);
      console.log(session, sessionCookie);
      cookies.set(sessionCookie.name, sessionCookie.value, {
        path: ".",
        ...sessionCookie.attributes
      });

      return redirect(302, "/dash");
    }

    return fail(400, { error: "Invalid username or email" });
  }
} satisfies Actions;
