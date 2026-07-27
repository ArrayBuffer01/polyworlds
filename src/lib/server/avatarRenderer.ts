import { assetBaseUrl, rendererUrl } from "./config";

export interface AvatarColors {
  Head: string;
  Torso: string;
  RightArm: string;
  LeftArm: string;
  RightLeg: string;
  LeftLeg: string;
}

export const defaultAvatarColors: AvatarColors = {
  Head: "#E7C3A5",
  Torso: "#5C7CFA",
  RightArm: "#E7C3A5",
  LeftArm: "#E7C3A5",
  RightLeg: "#34495E",
  LeftLeg: "#34495E"
};

export function avatarUrlForHash(hash: string | null): string | null {
  return hash ? `${assetBaseUrl}/avatars/${hash}.png` : null;
}

export function headshotUrlForHash(hash: string | null): string | null {
  return hash ? `${assetBaseUrl}/headshots/${hash}.png` : null;
}

interface HealthResponse {
  success: boolean;
}

export async function checkHealth(): Promise<boolean> {
  try {
    const res = await fetch(`${rendererUrl}/health`);
    const data: HealthResponse = await res.json();
    return res.ok && data.success;
  } catch(err) {
    console.log("Health check for renderer API failed: ", err);
    return false;
  }
}

export async function renderAvatar(
  colors: AvatarColors
): Promise<{ avatarHash: string; headshotHash: string }> {
  const response = await fetch(`${rendererUrl}/render`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      category: "avatars",
      skin: colors.Head,
      shirt: colors.Torso,
      pants: colors.RightLeg,
      partColors: colors,
      accessories: []
    }),
    signal: AbortSignal.timeout(10_000)
  });
  if (!response.ok) throw new Error(`Avatar renderer returned ${response.status}`);
  const body = (await response.json()) as { hash?: string; headshotHash?: string };
  if (!body.hash || !body.headshotHash)
    throw new Error("Avatar renderer returned incomplete hashes");
  return { avatarHash: body.hash, headshotHash: body.headshotHash };
}

export async function renderDefaultAvatar() {
  return renderAvatar(defaultAvatarColors);
}
