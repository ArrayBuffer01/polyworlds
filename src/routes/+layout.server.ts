import type { LayoutServerLoad } from "./$types";
import { headshotUrlForHash } from "$lib/server/avatarRenderer";

export const load = (async ({ locals, cookies }) => {
  return {
    user: locals.user
      ? { ...locals.user, avatarUrl: headshotUrlForHash(locals.user.avatarHeadshotHash) }
      : undefined,
    theme: cookies.get("theme") ?? "light"
  };
}) satisfies LayoutServerLoad;
