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
  login: async ({ request, cookies }) => {
    const data = await request.formData();

    const username = data.get("username")?.toString();
    const password = data.get("password")?.toString();

    if (!username || !password) {
      return fail(400, { error: "Username and password are required" });
    }

    const user = await db.query.usersTable.findFirst({
      where: eq(usersTable.username, username)
    });

    if (user) {
      const validPassword = bcrypt.compareSync(password, user.passwordHash);
      if (validPassword) {
        const session = await lucia.createSession(user.id, {});
        const sessionCookie = lucia.createSessionCookie(session.id);
        cookies.set(sessionCookie.name, sessionCookie.value, {
          path: ".",
          ...sessionCookie.attributes
        });

        return redirect(302, "/dash");
      }
    }
    
    return fail(400, { error: "Invalid username or password" });
  }
} satisfies Actions;
