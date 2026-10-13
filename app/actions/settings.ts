"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
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

const REDIS_SETTINGS_KEY = "site:settings:v2";

const DEFAULT_SETTINGS: SiteSettings & { adminPassword?: string } = {
  general: {
    siteName: "Students Hub",
    siteTagline: "Learn • Grow • Build a Better Future",
    siteLogo: "/logo.png",
    siteFavicon: "/logo.png",
    supportEmail: "support@studentsvoice.in",
    contactPhone: "+91 98765 43210",
    contactAddress: "Hyderabad, Telangana, India",
    workingHours: "Mon - Sat: 9:00 AM - 6:00 PM IST",
    adminEmail: "admin@gmail.com",
  },
  adminPassword: "admin123",
  seo: {
    metaTitle: "Students Hub - Latest Government Jobs, Education & Career Updates",
    metaDescription: "Get fast, reliable student news, notifications, study materials, mock tests, and career opportunities.",
    metaKeywords: "student news, government jobs, current affairs, internships, scholarships, study materials",
    canonicalUrl: "http://localhost",
    ogImage: "/logo.png",
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

/**
 * Maps a Prisma DB record to SiteSettings format
 */
function mapRecordToSettings(record: any): SiteSettings {
  return {
    general: {
      siteName: record.siteName || DEFAULT_SETTINGS.general.siteName,
      siteTagline: record.siteTagline || DEFAULT_SETTINGS.general.siteTagline,
      siteLogo: record.siteLogo || DEFAULT_SETTINGS.general.siteLogo,
      siteFavicon: record.siteFavicon || DEFAULT_SETTINGS.general.siteFavicon,
      supportEmail: record.supportEmail || DEFAULT_SETTINGS.general.supportEmail,
      contactPhone: record.contactPhone || DEFAULT_SETTINGS.general.contactPhone,
      contactAddress: record.contactAddress || DEFAULT_SETTINGS.general.contactAddress,
      workingHours: record.workingHours || DEFAULT_SETTINGS.general.workingHours,
      adminEmail: record.adminEmail || DEFAULT_SETTINGS.general.adminEmail,
    },
    seo: {
      metaTitle: record.metaTitle || DEFAULT_SETTINGS.seo.metaTitle,
      metaDescription: record.metaDescription || DEFAULT_SETTINGS.seo.metaDescription,
      metaKeywords: record.metaKeywords || DEFAULT_SETTINGS.seo.metaKeywords,
      canonicalUrl: record.canonicalUrl || DEFAULT_SETTINGS.seo.canonicalUrl,
      ogImage: record.ogImage || DEFAULT_SETTINGS.seo.ogImage,
      twitterHandle: record.twitterHandle || DEFAULT_SETTINGS.seo.twitterHandle,
      googleAnalyticsId: record.googleAnalyticsId || "",
      googleSearchConsoleCode: record.googleSearchConsoleCode || "",
    },
    social: {
      facebook: record.facebook || DEFAULT_SETTINGS.social.facebook,
      instagram: record.instagram || DEFAULT_SETTINGS.social.instagram,
      twitter: record.twitter || DEFAULT_SETTINGS.social.twitter,
      youtube: record.youtube || DEFAULT_SETTINGS.social.youtube,
      telegram: record.telegram || DEFAULT_SETTINGS.social.telegram,
      whatsapp: record.whatsapp || DEFAULT_SETTINGS.social.whatsapp,
      linkedin: record.linkedin || DEFAULT_SETTINGS.social.linkedin,
      github: record.github || DEFAULT_SETTINGS.social.github,
    },
  };
}

/**
 * Retrieves site settings directly from Database (with Redis Edge caching)
 */
export async function getSiteSettingsAction(): Promise<SiteSettings> {
  try {
    // 1. Check Redis cache
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

    // 2. Query Database with Auto-Seed
    try {
      let record = await prisma.siteSetting.findUnique({
        where: { id: "default" },
      });

      if (!record) {
        // Auto-seed initial defaults on first start
        record = await prisma.siteSetting.create({
          data: {
            id: "default",
            ...DEFAULT_SETTINGS.general,
            adminPassword: DEFAULT_SETTINGS.adminPassword,
            ...DEFAULT_SETTINGS.seo,
            ...DEFAULT_SETTINGS.social,
          },
        });
      }

      const settings = mapRecordToSettings(record);

      // Cache in Redis for fast edge reads
      if (redis.isConfigured) {
        try {
          await redis.set(REDIS_SETTINGS_KEY, settings, { ex: 3600 });
        } catch (e) {}
      }

      return settings;
    } catch (dbErr) {
      console.error("Database settings error:", dbErr);
      return DEFAULT_SETTINGS;
    }
  } catch (error) {
    console.error("Failed to retrieve site settings:", error);
    return DEFAULT_SETTINGS;
  }
}

/**
 * Returns admin credentials directly from Database
 */
export async function getAdminCredentialsAction(): Promise<{ email: string; passwordHashOrPlain: string }> {
  try {
    const record = await prisma.siteSetting.findUnique({
      where: { id: "default" },
    });
    if (record) {
      return {
        email: record.adminEmail.toLowerCase().trim(),
        passwordHashOrPlain: record.adminPassword || "admin123",
      };
    }
  } catch (err) {
    console.error("Failed to fetch admin credentials from DB:", err);
  }

  return {
    email: (process.env.ADMIN_EMAIL || DEFAULT_SETTINGS.general.adminEmail).toLowerCase().trim(),
    passwordHashOrPlain: DEFAULT_SETTINGS.adminPassword || "admin123",
  };
}

/**
 * Returns current admin password for admin dashboard display
 */
export async function getCurrentAdminPasswordAction(): Promise<string> {
  const creds = await getAdminCredentialsAction();
  return creds.passwordHashOrPlain;
}

/**
 * Saves updated settings directly into Database & invalidates cache
 */
async function saveSiteSettingsToDatabase(settings: SiteSettings, updatedPassword?: string) {
  const dataToSave: any = {
    ...settings.general,
    ...settings.seo,
    ...settings.social,
  };

  if (updatedPassword) {
    dataToSave.adminPassword = updatedPassword;
  }

  await prisma.siteSetting.upsert({
    where: { id: "default" },
    update: dataToSave,
    create: {
      id: "default",
      ...dataToSave,
      adminPassword: updatedPassword || DEFAULT_SETTINGS.adminPassword,
    },
  });

  // Invalidate Redis cache
  if (redis.isConfigured) {
    try {
      await redis.del(REDIS_SETTINGS_KEY);
    } catch (err) {
      console.error("Redis settings cache clear error:", err);
    }
  }

  revalidatePath("/", "layout");
  revalidatePath("/admin");
}

export async function updateGeneralSettingsAction(data: GeneralSettings) {
  try {
    const siteName = data.siteName || "";
    const trimmed = siteName.trim();
    if (siteName !== trimmed) {
      throw new Error("Site Name must not have leading or trailing spaces.");
    }
    const parts = siteName.split(" ");
    if (parts.length !== 2 || parts[0] === "" || parts[1] === "") {
      throw new Error("Site Name must contain exactly two words separated by a single space (e.g., 'Students Hub').");
    }

    const current = await getSiteSettingsAction();
    const updated: SiteSettings = {
      ...current,
      general: { ...data },
    };
    await saveSiteSettingsToDatabase(updated);
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
    await saveSiteSettingsToDatabase(updated);
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
    await saveSiteSettingsToDatabase(updated);
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
    const credentials = await getAdminCredentialsAction();

    // Verify current password if user is attempting to change password
    if (newPassword && newPassword.trim()) {
      if (currentPassword !== credentials.passwordHashOrPlain) {
        return { success: false, error: "Incorrect current password. Please try again." };
      }
    }

    const current = await getSiteSettingsAction();
    const updated: SiteSettings = {
      ...current,
      general: {
        ...current.general,
        adminEmail: adminEmail.trim().toLowerCase(),
      },
    };

    await saveSiteSettingsToDatabase(updated, newPassword ? newPassword.trim() : undefined);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to update security settings" };
  }
}
