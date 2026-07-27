import { fail, redirect, type Actions } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { db } from "$lib/server/db";
import { usersTable } from "$lib/server/db/schema";
import { eq } from "drizzle-orm";
import {
  avatarUrlForHash,
  checkHealth,
  defaultAvatarColors,
  headshotUrlForHash,
  renderAvatar,
  type AvatarColors
} from "$lib/server/avatarRenderer";
import { z } from "zod";

const color = z.string().regex(/^#[0-9a-fA-F]{6}$/, "Choose a valid color.");
const avatarSchema = z.object({
  Head: color,
  Torso: color,
  RightArm: color,
  LeftArm: color,
  RightLeg: color,
  LeftLeg: color
});

export const load = (async ({ locals }) => {
  if (!locals.user) redirect(303, "/login");
  const user = await db.query.usersTable.findFirst({ where: eq(usersTable.id, locals.user.id) });
  const isRendererUp = await checkHealth();
  const colors: AvatarColors = {
    Head: user?.avatarHead ?? user?.avatarSkin ?? defaultAvatarColors.Head,
    Torso: user?.avatarTorso ?? user?.avatarShirt ?? defaultAvatarColors.Torso,
    RightArm: user?.avatarRightArm ?? user?.avatarSkin ?? defaultAvatarColors.RightArm,
    LeftArm: user?.avatarLeftArm ?? user?.avatarSkin ?? defaultAvatarColors.LeftArm,
    RightLeg: user?.avatarRightLeg ?? user?.avatarPants ?? defaultAvatarColors.RightLeg,
    LeftLeg: user?.avatarLeftLeg ?? user?.avatarPants ?? defaultAvatarColors.LeftLeg
  };
  return {
    colors,
    avatarUrl: avatarUrlForHash(user?.avatarHash ?? null),
    headshotUrl: headshotUrlForHash(user?.avatarHeadshotHash ?? null),
    isRendererUp
  };
}) satisfies PageServerLoad;

export const actions = {
  save: async ({ request, locals }) => {
    if (!locals.user) redirect(303, "/login");
    const parsed = avatarSchema.safeParse(Object.fromEntries(await request.formData()));
    if (!parsed.success) return fail(400, { error: "Choose a valid color for every avatar part." });
    try {
      const hashes = await renderAvatar(parsed.data);
      await db
        .update(usersTable)
        .set({
          avatarHash: hashes.avatarHash,
          avatarHeadshotHash: hashes.headshotHash,
          avatarHead: parsed.data.Head,
          avatarTorso: parsed.data.Torso,
          avatarRightArm: parsed.data.RightArm,
          avatarLeftArm: parsed.data.LeftArm,
          avatarRightLeg: parsed.data.RightLeg,
          avatarLeftLeg: parsed.data.LeftLeg
        })
        .where(eq(usersTable.id, locals.user.id));
      return {
        success: true,
        colors: parsed.data,
        avatarUrl: avatarUrlForHash(hashes.avatarHash),
        headshotUrl: headshotUrlForHash(hashes.headshotHash)
      };
    } catch (error) {
      console.error("Avatar rendering failed:", error);
      return fail(503, {
        error: "Avatar rendering is currently unavailable. Please try again later."
      });
    }
  }
} satisfies Actions;
