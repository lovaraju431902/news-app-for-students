"use server";

import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { revalidatePath } from "next/cache";
import {
  getHomepageCategoryBlocks,
  invalidateCategoryBlocksCache,
  CategoryBlockData,
} from "@/lib/category-service";

export interface UpdateCategoryBlockConfigInput {
  name?: string;
  showOnHomepage: boolean;
  homepageBlockStyle: string;
  homepageOrder: number;
  homepagePostLimit: number;
  homepageColumns: number;
  showThumbnail: boolean;
  showDate: boolean;
  showExcerpt: boolean;
  showViewAll: boolean;
  customTitle?: string | null;
  accentColor?: string | null;
}

/**
 * Fetch all categories configured for display on the homepage
 */
export async function getHomepageCategoryBlocksAction(): Promise<{
  success: boolean;
  data: CategoryBlockData[];
  error?: string;
}> {
  try {
    const data = await getHomepageCategoryBlocks();
    return { success: true, data };
  } catch (error: any) {
    return {
      success: false,
      data: [],
      error: error.message || "Failed to fetch homepage category blocks",
    };
  }
}

/**
 * Fetch all categories with their layout configurations and blog counts for the admin panel
 */
export async function getAllCategoriesWithConfigAction() {
  try {
    const categories = await prisma.tag.findMany({
      orderBy: [
        { showOnHomepage: "desc" },
        { homepageOrder: "asc" },
        { name: "asc" },
      ],
      include: {
        _count: {
          select: { blogs: true },
        },
      },
    });

    return { success: true, categories };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "Failed to fetch categories",
    };
  }
}

/**
 * Update a category's homepage block style and layout configuration
 */
export async function updateCategoryBlockStyleAction(
  id: string,
  input: UpdateCategoryBlockConfigInput
) {
  const session = await getSession();
  if (!session) {
    return { success: false, error: "Unauthorized access." };
  }

  try {
    const updated = await prisma.tag.update({
      where: { id },
      data: {
        ...(input.name ? { name: input.name.trim() } : {}),
        showOnHomepage: Boolean(input.showOnHomepage),
        homepageBlockStyle: input.homepageBlockStyle || "style1",
        homepageOrder: Number(input.homepageOrder) || 0,
        homepagePostLimit: Number(input.homepagePostLimit) || 6,
        homepageColumns: Number(input.homepageColumns) || 3,
        showThumbnail: input.showThumbnail !== false,
        showDate: input.showDate !== false,
        showExcerpt: Boolean(input.showExcerpt),
        showViewAll: input.showViewAll !== false,
        customTitle: input.customTitle?.trim() || null,
        accentColor: input.accentColor?.trim() || null,
      },
    });

    await invalidateCategoryBlocksCache();
    revalidatePath("/");
    revalidatePath("/[category]", "layout");

    return { success: true, category: updated };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "Failed to update category block style",
    };
  }
}

/**
 * Seed all standard categories with varied, attractive block styles and homepage display enabled
 */
export async function seedDefaultCategoryBlockStylesAction() {
  const session = await getSession();
  if (!session) {
    return { success: false, error: "Unauthorized access." };
  }

  // Pre-configured diverse styles for maximum visual variety
  const categoryConfigs = [
    {
      slug: "govt-jobs-updates",
      name: "Government Jobs",
      style: "style2", // Featured Grid + Compact Rows
      order: 1,
      limit: 7,
      cols: 3,
      accent: "bg-blue-600",
    },
    {
      slug: "scholarships",
      name: "Scholarships",
      style: "style1", // Featured Post + Compact Post List
      order: 2,
      limit: 8,
      cols: 4,
      accent: "bg-emerald-600",
    },
    {
      slug: "internships",
      name: "Internships",
      style: "style4", // Four-Column Thumbnail Grid
      order: 3,
      limit: 8,
      cols: 4,
      accent: "bg-purple-600",
    },
    {
      slug: "part-time-income",
      name: "Part Time Income",
      style: "style3", // Two-Row Featured Grid
      order: 4,
      limit: 6,
      cols: 3,
      accent: "bg-teal-600",
    },
    {
      slug: "technology",
      name: "Technology",
      style: "style5", // Horizontal Slider
      order: 5,
      limit: 8,
      cols: 4,
      accent: "bg-cyan-600",
    },
    {
      slug: "startup-ideas",
      name: "Startup Ideas",
      style: "style6", // Dark Featured Category Block
      order: 6,
      limit: 6,
      cols: 3,
      accent: "bg-indigo-600",
    },
    {
      slug: "share-market",
      name: "Share Market",
      style: "style3", // Two-Row Featured Grid
      order: 7,
      limit: 6,
      cols: 3,
      accent: "bg-green-600",
    },
    {
      slug: "ai-tools",
      name: "AI Tools",
      style: "style4", // Four-Column Thumbnail Grid
      order: 8,
      limit: 8,
      cols: 4,
      accent: "bg-violet-600",
    },
    {
      slug: "carrer-jobs",
      name: "Career Jobs",
      style: "style2", // Featured Grid + Compact Rows
      order: 9,
      limit: 7,
      cols: 3,
      accent: "bg-amber-600",
    },
    {
      slug: "current-affairs",
      name: "Current Affairs",
      style: "style1", // Featured Post + Compact Post List
      order: 10,
      limit: 8,
      cols: 4,
      accent: "bg-rose-600",
    },
    {
      slug: "youtube-growth",
      name: "YouTube Growth",
      style: "style5", // Horizontal Slider
      order: 11,
      limit: 8,
      cols: 4,
      accent: "bg-red-600",
    },
    {
      slug: "mobile-hacks",
      name: "Mobile Hacks",
      style: "style4", // Four-Column Thumbnail Grid
      order: 12,
      limit: 8,
      cols: 4,
      accent: "bg-sky-600",
    },
    {
      slug: "apps-websites",
      name: "Apps & Websites",
      style: "style3", // Two-Row Featured Grid
      order: 13,
      limit: 6,
      cols: 3,
      accent: "bg-blue-700",
    },
    {
      slug: "marketing",
      name: "Marketing",
      style: "style6", // Dark Featured Category Block
      order: 14,
      limit: 6,
      cols: 3,
      accent: "bg-orange-600",
    },
    {
      slug: "ai-prompts",
      name: "AI Prompts",
      style: "style5", // Horizontal Slider
      order: 15,
      limit: 8,
      cols: 4,
      accent: "bg-pink-600",
    },
  ];

  try {
    for (const cfg of categoryConfigs) {
      const existing = await prisma.tag.findUnique({
        where: { slug: cfg.slug },
      });

      if (existing) {
        await prisma.tag.update({
          where: { id: existing.id },
          data: {
            showOnHomepage: true,
            homepageBlockStyle: cfg.style,
            homepageOrder: cfg.order,
            homepagePostLimit: cfg.limit,
            homepageColumns: cfg.cols,
            showThumbnail: true,
            showDate: true,
            showExcerpt: false,
            showViewAll: true,
            accentColor: cfg.accent,
          },
        });
      }
    }

    await invalidateCategoryBlocksCache();
    revalidatePath("/");
    revalidatePath("/[category]", "layout");

    return { success: true };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "Failed to seed default category block styles",
    };
  }
}
