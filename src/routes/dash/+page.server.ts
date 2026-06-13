import type { PageServerLoad } from "./$types";

export const load = (async ({ locals }) => {
  const lastReward = locals.user?.lastReward;
  return { lastReward };
}) satisfies PageServerLoad;
