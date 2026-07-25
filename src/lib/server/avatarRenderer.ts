import { env } from "$env/dynamic/private";

const assetBaseUrl = env.ASSET_BASE_URL ?? "https://assets.polyworlds.net";
const defaultAvatar = {
  category: "avatars",
  skin: "#E7C3A5FF",
  shirt: "#5C7CFAFF",
  pants: "#34495EFF",
  accessories: []
};

export function avatarUrlForHash(hash: string | null): string | null {
  return hash ? `${assetBaseUrl}/avatars/${hash}.png` : null;
}

export async function renderDefaultAvatar(): Promise<string> {
  const rendererUrl = env.RENDERER_URL ?? "http://renderer:3001";
  const response = await fetch(`${rendererUrl}/render`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(defaultAvatar),
    signal: AbortSignal.timeout(10_000)
  });

  if (!response.ok) {
    throw new Error(`Avatar renderer returned ${response.status}`);
  }

  const body = (await response.json()) as { hash?: string };
  if (!body.hash) {
    throw new Error("Avatar renderer returned no hash");
  }

  return body.hash;
}
