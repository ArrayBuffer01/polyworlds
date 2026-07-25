import { fail, redirect, type Actions } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { db } from "$lib/server/db";
import { usersTable } from "$lib/server/db/schema";
import { eq } from "drizzle-orm";
import {
  avatarUrlForHash,
  defaultAvatarColors,
  headshotUrlForHash,
  renderAvatar,
  type AvatarColors
} from "$lib/server/avatarRenderer";
import { z } from "zod";

const color = z.string().regex(/^#[0-9a-fA-F]{6}$/, "Choose a valid color.");
const avatarSchema = z.object({
  head: color,
  torso: color,
  rightArm: color,
  leftArm: color,
  rightLeg: color,
  leftLeg: color
});

export const load = (async ({ locals }) => {
  if (!locals.user) redirect(303, "/login");
  const user = await db.query.usersTable.findFirst({ where: eq(usersTable.id, locals.user.id) });
  const colors: AvatarColors = {
    head: user?.avatarHead ?? user?.avatarSkin ?? defaultAvatarColors.head,
    torso: user?.avatarTorso ?? user?.avatarShirt ?? defaultAvatarColors.torso,
    rightArm: user?.avatarRightArm ?? user?.avatarSkin ?? defaultAvatarColors.rightArm,
    leftArm: user?.avatarLeftArm ?? user?.avatarSkin ?? defaultAvatarColors.leftArm,
    rightLeg: user?.avatarRightLeg ?? user?.avatarPants ?? defaultAvatarColors.rightLeg,
    leftLeg: user?.avatarLeftLeg ?? user?.avatarPants ?? defaultAvatarColors.leftLeg
  };
  return {
    colors,
    avatarUrl: avatarUrlForHash(user?.avatarHash ?? null),
    headshotUrl: headshotUrlForHash(user?.avatarHeadshotHash ?? null)
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
          avatarHead: parsed.data.head,
          avatarTorso: parsed.data.torso,
          avatarRightArm: parsed.data.rightArm,
          avatarLeftArm: parsed.data.leftArm,
          avatarRightLeg: parsed.data.rightLeg,
          avatarLeftLeg: parsed.data.leftLeg
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
      return fail(503, { error: "Avatar creation is temporarily unavailable. Please try again." });
    }
  }
} satisfies Actions;
