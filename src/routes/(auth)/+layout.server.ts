import { redirect } from "@sveltejs/kit";
import type { LayoutServerLoad } from "./$types";

export const load = (async ({ locals }) => {
  if (locals.session && locals.user)
    throw redirect(301, "/dash");
  return {};
}) satisfies LayoutServerLoad;
