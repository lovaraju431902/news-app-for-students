"use server";

import fs from "fs/promises";
import path from "path";
import { revalidatePath } from "next/cache";
import { redis } from "@/lib/redis";

export interface GeneralSettings {
  siteName: string;
  siteTagline: string;
  siteLogo: string;
  siteFavicon: string;
  supportEmail: string;
  contactPhone: string;
  contactAddress: string;
  workingHours: string;
  adminEmail: string;
}

export interface SeoSettings {
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string;
  canonicalUrl: string;
  ogImage: string;
  twitterHandle: string;
  googleAnalyticsId: string;
  googleSearchConsoleCode: string;
}

export interface SocialSettings {
  facebook: string;
  instagram: string;
  twitter: string;
  youtube: string;
  telegram: string;
  whatsapp: string;
  linkedin: string;
  github: string;
}

export interface SiteSettings {
  general: GeneralSettings;
  seo: SeoSettings;
  social: SocialSettings;
}

const SETTINGS_FILE_PATH = path.join(process.cwd(), "data", "site-settings.json");
const REDIS_SETTINGS_KEY = "site:settings:v1";

const DEFAULT_SETTINGS: SiteSettings = {
  general: {
    siteName: "Students Voice",
    siteTagline: "Empowering Student Aspirations & Real-Time Exam Updates",
    siteLogo: "",
    siteFavicon: "",
    supportEmail: "support@studentsvoice.in",
    contactPhone: "+91 98765 43210",
    contactAddress: "Hyderabad, Telangana, India",
    workingHours: "Mon - Sat: 9:00 AM - 6:00 PM IST",
    adminEmail: "lovarajuk431902@gmail.com",
  },
  seo: {
    metaTitle: "Students Voice - Latest Government Jobs, Education & Career Updates",
    metaDescription: "Get fast, reliable student news, notifications, study materials, mock tests, and career opportunities.",
    metaKeywords: "student news, government jobs, current affairs, internships, scholarships, study materials",
    canonicalUrl: "http://localhost",
    ogImage: "",
    twitterHandle: "@studentsvoice",
    googleAnalyticsId: "",
    googleSearchConsoleCode: "",
  },
  social: {
    facebook: "https://facebook.com",
    instagram: "https://instagram.com",
    twitter: "https://twitter.com",
    youtube: "https://youtube.com",
    telegram: "https://t.me",
    whatsapp: "https://whatsapp.com",
    linkedin: "https://linkedin.com",
    github: "https://github.com",
  },
};

async function ensureDirectoryExistence(filePath: string) {
  const dirname = path.dirname(filePath);
  try {
    await fs.access(dirname);
  } catch {
    await fs.mkdir(dirname, { recursive: true });
  }
}

export async function getSiteSettingsAction(): Promise<SiteSettings> {
  try {
    if (redis.isConfigured) {
      try {
        const cached = await redis.get<SiteSettings>(REDIS_SETTINGS_KEY);
        if (cached && cached.general) {
          return cached;
        }
      } catch (err) {
        console.error("Redis settings fetch error:", err);
      }
    }

    await ensureDirectoryExistence(SETTINGS_FILE_PATH);
    try {
      const fileData = await fs.readFile(SETTINGS_FILE_PATH, "utf-8");
      const parsed = JSON.parse(fileData);
      const merged: SiteSettings = {
        general: { ...DEFAULT_SETTINGS.general, ...(parsed.general || {}) },
        seo: { ...DEFAULT_SETTINGS.seo, ...(parsed.seo || {}) },
        social: { ...DEFAULT_SETTINGS.social, ...(parsed.social || {}) },
      };

      if (redis.isConfigured) {
        await redis.set(REDIS_SETTINGS_KEY, merged, { ex: 3600 });
      }
      return merged;
    } catch {
      await fs.writeFile(SETTINGS_FILE_PATH, JSON.stringify(DEFAULT_SETTINGS, null, 2), "utf-8");
      return DEFAULT_SETTINGS;
    }
  } catch (error) {
    console.error("Failed to retrieve site settings:", error);
    return DEFAULT_SETTINGS;
  }
}

async function saveSiteSettings(settings: SiteSettings) {
  await ensureDirectoryExistence(SETTINGS_FILE_PATH);
  await fs.writeFile(SETTINGS_FILE_PATH, JSON.stringify(settings, null, 2), "utf-8");

  if (redis.isConfigured) {
    try {
      await redis.set(REDIS_SETTINGS_KEY, settings, { ex: 3600 });
    } catch (err) {
      console.error("Redis settings save error:", err);
    }
  }

  revalidatePath("/", "layout");
}

export async function updateGeneralSettingsAction(data: GeneralSettings) {
  try {
    const current = await getSiteSettingsAction();
    const updated: SiteSettings = {
      ...current,
      general: { ...data },
    };
    await saveSiteSettings(updated);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to update general settings" };
  }
}

export async function updateSeoSettingsAction(data: SeoSettings) {
  try {
    const current = await getSiteSettingsAction();
    const updated: SiteSettings = {
      ...current,
      seo: { ...data },
    };
    await saveSiteSettings(updated);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to update SEO settings" };
  }
}

export async function updateSocialSettingsAction(data: SocialSettings) {
  try {
    const current = await getSiteSettingsAction();
    const updated: SiteSettings = {
      ...current,
      social: { ...data },
    };
    await saveSiteSettings(updated);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to update Social settings" };
  }
}

export async function updateAdminSecurityAction({
  adminEmail,
  currentPassword,
  newPassword,
}: {
  adminEmail: string;
  currentPassword?: string;
  newPassword?: string;
}) {
  try {
    const current = await getSiteSettingsAction();

    // Verify current password if user is attempting to change password
    if (newPassword && newPassword.trim()) {
      const serverPassword = process.env.ADMIN_PASSWORD;
      if (serverPassword && currentPassword !== serverPassword) {
        return { success: false, error: "Incorrect current password. Please try again." };
      }
      // Note: In local/container runtime, update the env or persistent state
      process.env.ADMIN_PASSWORD = newPassword.trim();
    }

    const updated: SiteSettings = {
      ...current,
      general: {
        ...current.general,
        adminEmail: adminEmail.trim(),
      },
    };

    await saveSiteSettings(updated);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to update security settings" };
  }
}
