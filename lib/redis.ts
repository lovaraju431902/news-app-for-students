const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;

const isConfigured = !!(redisUrl && redisToken);

export const redis = {
  isConfigured,

  async get<T>(key: string): Promise<T | null> {
    if (!isConfigured) return null;
    try {
      const res = await fetch(`${redisUrl}/get/${encodeURIComponent(key)}`, {
        headers: {
          Authorization: `Bearer ${redisToken}`,
        },
        cache: "no-store",
      });
      if (!res.ok) return null;
      const data = await res.json();
      if (data.result === null || data.result === undefined) return null;
      
      try {
        return JSON.parse(data.result);
      } catch {
        return data.result as unknown as T;
      }
    } catch (err) {
      console.error("Redis REST GET error:", err);
      return null;
    }
  },

  async set(key: string, value: any, options?: { ex?: number }): Promise<boolean> {
    if (!isConfigured) return false;
    try {
      const stringVal = typeof value === "string" ? value : JSON.stringify(value);
      const command = ["SET", key, stringVal];
      if (options?.ex) {
        command.push("EX", String(options.ex));
      }

      const res = await fetch(redisUrl!, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${redisToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(command),
        cache: "no-store",
      });
      return res.ok;
    } catch (err) {
      console.error("Redis REST SET error:", err);
      return false;
    }
  },

  async del(key: string): Promise<boolean> {
    if (!isConfigured) return false;
    try {
      const res = await fetch(`${redisUrl}/del/${encodeURIComponent(key)}`, {
        headers: {
          Authorization: `Bearer ${redisToken}`,
        },
        cache: "no-store",
      });
      return res.ok;
    } catch (err) {
      console.error("Redis REST DEL error:", err);
      return false;
    }
  }
};
