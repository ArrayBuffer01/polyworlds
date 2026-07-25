import { dev } from "$app/environment";
import { env } from "$env/dynamic/private";

export const rendererUrl =
  env.RENDERER_URL ?? (dev ? "http://localhost:3001" : "http://renderer:3001");
export const assetBaseUrl = env.ASSET_BASE_URL ?? (dev ? "" : "https://assets.polyworlds.net");
