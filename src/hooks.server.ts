import type { Handle } from "@sveltejs/kit";

export const handle: Handle = async ({ event, resolve }) => {
  const authToken = event.cookies.get("auth");

  if (authToken === "ARRAY") {
    event.locals.user = {
      username: "ARRAY",
      coins: 0,
      gold: 0
    };
  }

  const response = await resolve(event);

  return response;
};
