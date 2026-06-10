import type { PageServerLoad } from "./$types";

export const load = (async ({ cookies, locals }) => {
  const lastReward = locals.user?.lastReward;
  return { lastReward };
}) satisfies PageServerLoad;
