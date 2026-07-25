import { dev } from "$app/environment";
import { env } from "$env/dynamic/private";

const assetBaseUrl = env.ASSET_BASE_URL ?? (dev ? "" : "https://assets.polyworlds.net");

export interface AvatarColors {
  head: string;
  torso: string;
  rightArm: string;
  leftArm: string;
  rightLeg: string;
  leftLeg: string;
}

export const defaultAvatarColors: AvatarColors = {
  head: "#E7C3A5",
  torso: "#5C7CFA",
  rightArm: "#E7C3A5",
  leftArm: "#E7C3A5",
  rightLeg: "#34495E",
  leftLeg: "#34495E"
};

export function avatarUrlForHash(hash: string | null): string | null {
  return hash ? `${assetBaseUrl}/avatars/${hash}.png` : null;
}

export function headshotUrlForHash(hash: string | null): string | null {
  return hash ? `${assetBaseUrl}/headshots/${hash}.png` : null;
}

export async function renderAvatar(colors: AvatarColors): Promise<{ avatarHash: string; headshotHash: string }> {
  const rendererUrl = env.RENDERER_URL ?? (dev ? "http://localhost:3001" : "http://renderer:3001");
  const response = await fetch(`${rendererUrl}/render`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ category: "avatars", skin: colors.head, shirt: colors.torso, pants: colors.rightLeg, partColors: colors, accessories: [] }),
    signal: AbortSignal.timeout(10_000)
  });
  if (!response.ok) throw new Error(`Avatar renderer returned ${response.status}`);
  const body = (await response.json()) as { hash?: string; headshotHash?: string };
  if (!body.hash || !body.headshotHash) throw new Error("Avatar renderer returned incomplete hashes");
  return { avatarHash: body.hash, headshotHash: body.headshotHash };
}

export async function renderDefaultAvatar() {
  return renderAvatar(defaultAvatarColors);
}
