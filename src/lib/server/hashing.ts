import { env } from "$env/dynamic/private";
import crypto from "node:crypto";

export function hashIP(ip: string): string {
  return crypto.createHmac("sha256", env.IP_HASHING_KEY).update(ip.trim()).digest("hex");
}