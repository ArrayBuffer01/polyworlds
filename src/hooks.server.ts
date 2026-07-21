import { getMainDomain } from "$lib/domainUtils";
import { lucia } from "$lib/server/auth";
import type { Handle } from "@sveltejs/kit";

export const handle: Handle = async ({ event, resolve }) => {
  const sessionId = event.cookies.get(lucia.sessionCookieName);

  if (!sessionId) {
    event.locals.user = null;
    event.locals.session = null;
  } else {
    const { session, user } = await lucia.validateSession(sessionId);

    if (session && session.fresh) {
      const sessionCookie = lucia.createSessionCookie(session.id);
      event.cookies.set(sessionCookie.name, sessionCookie.value, {
        path: ".",
        ...sessionCookie.attributes,
        domain: getMainDomain(event.url.hostname)
      });
    }

    if (!session) {
      const sessionCookie = lucia.createBlankSessionCookie();
      event.cookies.set(sessionCookie.name, sessionCookie.value, {
        path: ".",
        ...sessionCookie.attributes,
        domain: getMainDomain(event.url.hostname)
      });
    }

    event.locals.user = user;
    event.locals.session = session;
  }

  const response = await resolve(event);

  return response;
};
