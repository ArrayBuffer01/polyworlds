import { getMainDomain } from "$lib/domainUtils";
import { lucia } from "$lib/server/auth";
import { updateIPHash, updateLoginStreak } from "$lib/server/databaseHelper";
import type { Handle } from "@sveltejs/kit";

export const handle: Handle = async ({ event, resolve }) => {
  const sessionId = event.cookies.get(lucia.sessionCookieName);
  
  if (sessionId) {
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
      user.lastUsedIPHash = await updateIPHash(user, event.getClientAddress());

      event.locals.user = user ?? undefined;
      event.locals.session = session ?? undefined;
      
      console.log(user.username + " -> " + event.getClientAddress());
    }
  }

  const response = await resolve(event);

  return response;
};
