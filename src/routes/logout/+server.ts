import { fail, redirect } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { lucia } from "$lib/server/auth";

export const GET: RequestHandler = async ({ locals, cookies, url }) => {
  if (!locals.session) {
    fail(401);
  }
  const returnURL = url.searchParams.get("return_to") ?? "/login";
  if (locals.session) {
    await lucia.invalidateSession(locals.session.id);
    const sessionCookie = lucia.createBlankSessionCookie();

    cookies.set(sessionCookie.name, sessionCookie.value, {
      path: ".",
      ...sessionCookie.attributes
    });
  }

  redirect(302, returnURL);
};
