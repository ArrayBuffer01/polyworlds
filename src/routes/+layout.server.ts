import type { LayoutServerLoad } from "./$types";

export const load = (async ({ locals, cookies }) => {
  return {
    user: locals.user,
    theme: cookies.get("theme")
  };
}) satisfies LayoutServerLoad;
