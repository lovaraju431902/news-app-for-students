import fs from "fs";
import path from "path";
import { prisma } from "./prisma";
import { redis } from "./redis";
import {
  AdSpaceId,
  BannerConfig,
  AdSpaceItem,
  AD_SPACE_DEFINITIONS,
} from "@/types/ad-spaces";

export type { AdSpaceId, BannerConfig, AdSpaceItem };
export { AD_SPACE_DEFINITIONS };


const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "ad-spaces.json");
const REDIS_CACHE_KEY = "ad:spaces:all";

function getInitialAdSpaces(): Record<AdSpaceId, AdSpaceItem> {
  const map: Partial<Record<AdSpaceId, AdSpaceItem>> = {};
  for (const def of AD_SPACE_DEFINITIONS) {
    map[def.id] = {
      id: def.id,
      name: def.name,
      language: "English",
      desktop: {
        width: def.defaultDesktop.w,
        height: def.defaultDesktop.h,
        adCode: "",
        adUrl: "",
        imageUrl: "",
      },
      mobile: {
        width: def.defaultMobile.w,
        height: def.defaultMobile.h,
        adCode: "",
        adUrl: "",
        imageUrl: "",
      },
      isActive: true,
      updatedAt: new Date().toISOString(),
    };
  }
  return map as Record<AdSpaceId, AdSpaceItem>;
}

function readLocalBackup(): Record<AdSpaceId, AdSpaceItem> {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const content = fs.readFileSync(DATA_FILE, "utf-8");
      return JSON.parse(content);
    }
  } catch (e) {}
  return getInitialAdSpaces();
}

function writeLocalBackup(data: Record<AdSpaceId, AdSpaceItem>): void {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), "utf-8");
  } catch (e) {}
}

export async function getAllAdSpaces(): Promise<Record<AdSpaceId, AdSpaceItem>> {
  // 1. Check Redis Cache first (microsecond response)
  if (redis.isConfigured) {
    try {
      const cached = await redis.get<Record<AdSpaceId, AdSpaceItem>>(REDIS_CACHE_KEY);
      if (cached && typeof cached === "object" && Object.keys(cached).length > 0) {
        return cached;
      }
    } catch (e) {
      console.warn("Redis read warning in getAllAdSpaces:", e);
    }
  }

  // 2. Fetch from Database if available
  const defaults = getInitialAdSpaces();
  let dbSuccess = false;

  try {
    const dbRecords = await (prisma as any).adSpace.findMany();
    if (Array.isArray(dbRecords) && dbRecords.length > 0) {
      for (const record of dbRecords) {
        const id = record.spaceKey as AdSpaceId;
        if (defaults[id]) {
          defaults[id] = {
            id,
            name: record.name,
            language: record.language,
            desktop: {
              width: record.desktopWidth || defaults[id].desktop.width,
              height: record.desktopHeight || defaults[id].desktop.height,
              adCode: record.desktopAdCode || "",
              adUrl: record.desktopAdUrl || "",
              imageUrl: record.desktopImgUrl || "",
            },
            mobile: {
              width: record.mobileWidth || defaults[id].mobile.width,
              height: record.mobileHeight || defaults[id].mobile.height,
              adCode: record.mobileAdCode || "",
              adUrl: record.mobileAdUrl || "",
              imageUrl: record.mobileImgUrl || "",
            },
            isActive: record.isActive,
            updatedAt: record.updatedAt.toISOString(),
          };
        }
      }
      dbSuccess = true;
    }
  } catch (err: any) {
    // If DB is not reachable or table doesn't exist yet, silently fall back
    console.warn("Notice: Database read skipped (using local cache):", err?.message || err);
  }

  // If DB was not available or empty, load local backup
  if (!dbSuccess) {
    const local = readLocalBackup();
    for (const key of Object.keys(defaults) as AdSpaceId[]) {
      if (local[key]) {
        defaults[key] = { ...defaults[key], ...local[key] };
      }
    }
  }

  // 3. Cache the aggregated result in Redis
  if (redis.isConfigured) {
    try {
      await redis.set(REDIS_CACHE_KEY, defaults, { ex: 3600 });
    } catch (e) {}
  }

  return defaults;
}

export async function getAdSpace(id: AdSpaceId): Promise<AdSpaceItem | null> {
  const all = await getAllAdSpaces();
  return all[id] || null;
}

export async function saveAdSpace(item: AdSpaceItem): Promise<AdSpaceItem> {
  const now = new Date().toISOString();
  let savedItem: AdSpaceItem = {
    ...item,
    updatedAt: now,
  };

  // 1. Try saving to PostgreSQL database
  try {
    const saved = await (prisma as any).adSpace.upsert({
      where: { spaceKey: item.id },
      create: {
        spaceKey: item.id,
        name: item.name,
        language: item.language || "English",
        desktopWidth: item.desktop.width,
        desktopHeight: item.desktop.height,
        desktopAdCode: item.desktop.adCode || null,
        desktopAdUrl: item.desktop.adUrl || null,
        desktopImgUrl: item.desktop.imageUrl || null,
        mobileWidth: item.mobile.width,
        mobileHeight: item.mobile.height,
        mobileAdCode: item.mobile.adCode || null,
        mobileAdUrl: item.mobile.adUrl || null,
        mobileImgUrl: item.mobile.imageUrl || null,
        isActive: item.isActive ?? true,
      },
      update: {
        name: item.name,
        language: item.language || "English",
        desktopWidth: item.desktop.width,
        desktopHeight: item.desktop.height,
        desktopAdCode: item.desktop.adCode || null,
        desktopAdUrl: item.desktop.adUrl || null,
        desktopImgUrl: item.desktop.imageUrl || null,
        mobileWidth: item.mobile.width,
        mobileHeight: item.mobile.height,
        mobileAdCode: item.mobile.adCode || null,
        mobileAdUrl: item.mobile.adUrl || null,
        mobileImgUrl: item.mobile.imageUrl || null,
        isActive: item.isActive ?? true,
      },
    });

    savedItem = {
      id: item.id,
      name: saved.name,
      language: saved.language,
      desktop: {
        width: saved.desktopWidth,
        height: saved.desktopHeight,
        adCode: saved.desktopAdCode || "",
        adUrl: saved.desktopAdUrl || "",
        imageUrl: saved.desktopImgUrl || "",
      },
      mobile: {
        width: saved.mobileWidth,
        height: saved.mobileHeight,
        adCode: saved.mobileAdCode || "",
        adUrl: saved.mobileAdUrl || "",
        imageUrl: saved.mobileImgUrl || "",
      },
      isActive: saved.isActive,
      updatedAt: saved.updatedAt.toISOString(),
    };
  } catch (err: any) {
    console.warn("Database save skipped, persisting to resilient storage:", err?.message || err);
  }

  // 2. Always persist locally as a rock-solid backup
  const allCurrent = readLocalBackup();
  allCurrent[item.id] = savedItem;
  writeLocalBackup(allCurrent);

  // 3. Invalidate and re-sync Redis cache
  if (redis.isConfigured) {
    try {
      await redis.del(REDIS_CACHE_KEY);
      await redis.set(REDIS_CACHE_KEY, allCurrent, { ex: 3600 });
    } catch (e) {
      console.warn("Redis invalidation warning:", e);
    }
  }

  return savedItem;
}
