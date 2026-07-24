import { getMainDomain } from "$lib/domainUtils";
import { lucia } from "$lib/server/auth";
import { updateLoginStreak } from "$lib/server/loginStreak";
import type { Handle } from "@sveltejs/kit";

export const handle: Handle = async ({ event, resolve }) => {
  const sessionId = event.cookies.get(lucia.sessionCookieName);

  if (!sessionId) {
    console.log("User not set.");
  } else {
    const { session, user } = await lucia.validateSession(sessionId);

    if (session && session.fresh) {
      const sessionCookie = lucia.createSessionCookie(session.id);
      event.cookies.set(sessionCookie.name, sessionCookie.value, {
        path: "/",
        ...sessionCookie.attributes,
        domain: getMainDomain(event.url.hostname)
      });
    }

    if (!session) {
      const sessionCookie = lucia.createBlankSessionCookie();
      event.cookies.set(sessionCookie.name, sessionCookie.value, {
        path: "/",
        ...sessionCookie.attributes,
        domain: getMainDomain(event.url.hostname)
      });
    }

    if (user) {
      user.loginStreak = await updateLoginStreak(user);
      
      event.locals.user = user ?? undefined;
      event.locals.session = session ?? undefined;
    }
  }

  const response = await resolve(event);

  return response;
};
