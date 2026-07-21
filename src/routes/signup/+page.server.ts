import { fail, redirect, type Actions } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { lucia } from "$lib/server/auth";
import bcrypt from "bcrypt";
import { db } from "$lib/server/db";
import { usersTable } from "$lib/server/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { getMainDomain } from "$lib/domainUtils";

export const load = (async () => {
  return {};
}) satisfies PageServerLoad;

const registerSchema = z.object({
  username: z
    .string("Username is required.")
    .min(3, "Username has to be at least 3 characters.")
    .max(20, "Username can be max 20 characters."),
  email: z.email().max(64, "Email can be max 64 characters.").optional().nullable(),
  password: z.string("Password is required.").min(6, "Password has to be at least 6 characters.")
});

export const actions = {
  signup: async ({ request, cookies, url }) => {
    const formData = Object.fromEntries(await request.formData());

    const parsed = z.safeParse(registerSchema, formData);

    if (!parsed.success) {
      return fail(400, { fieldErrors: z.treeifyError(parsed.error) });
    }

    const username = parsed.data.username;
    const email = parsed.data.email;
    const password = parsed.data.password;

    const user = await db.query.usersTable.findFirst({
      where: eq(usersTable.username, username)
    });

    if (user) {
      return fail(400, { error: "Username already exists" });
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
        path: "/",
        ...sessionCookie.attributes,
        domain: getMainDomain(url.hostname)
      });

      return redirect(302, "/dash");
    }

    return fail(400, { error: "Invalid username or email" });
  }
} satisfies Actions;
