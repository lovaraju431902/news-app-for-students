import Redis from "ioredis";

const redisUrl = process.env.REDIS_URL;
const isConfigured = !!redisUrl;

let client: Redis | null = null;
if (isConfigured) {
  try {
    client = new Redis(redisUrl!);
  } catch (err) {
    console.error("Redis client initialization error:", err);
  }
}

export const redis = {
  isConfigured,

  async get<T>(key: string): Promise<T | null> {
    if (!client) return null;
    try {
      const data = await client.get(key);
      if (data === null || data === undefined) return null;
      try {
        return JSON.parse(data);
      } catch {
        return data as unknown as T;
      }
    } catch (err) {
      console.error("Redis GET error:", err);
      return null;
    }
  },

  async set(key: string, value: any, options?: { ex?: number }): Promise<boolean> {
    if (!client) return false;
    try {
      const stringVal = typeof value === "string" ? value : JSON.stringify(value);
      if (options?.ex) {
        await client.set(key, stringVal, "EX", options.ex);
      } else {
        await client.set(key, stringVal);
      }
      return true;
    } catch (err) {
      console.error("Redis SET error:", err);
      return false;
    }
  },

  async del(key: string): Promise<boolean> {
    if (!client) return false;
    try {
      await client.del(key);
      return true;
    } catch (err) {
      console.error("Redis DEL error:", err);
      return false;
    }
  }
};
