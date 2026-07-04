import { Redis } from "@upstash/redis";

let redis: Redis | null = null;

function getRedisCredentials(): { url: string; token: string } | null {
  const url =
    process.env.UPSTASH_REDIS_REST_URL ??
    process.env.KV_REST_API_URL ??
    process.env.STORAGE_URL ??
    "";
  const token =
    process.env.UPSTASH_REDIS_REST_TOKEN ??
    process.env.KV_REST_API_TOKEN ??
    process.env.STORAGE_TOKEN ??
    "";

  if (!url || !token) return null;
  return { url, token };
}

export function isKvConfigured(): boolean {
  return getRedisCredentials() !== null;
}

export function getRedis(): Redis {
  const credentials = getRedisCredentials();
  if (!credentials) {
    throw new Error("Redis is not configured");
  }

  if (!redis) {
    redis = new Redis(credentials);
  }

  return redis;
}
