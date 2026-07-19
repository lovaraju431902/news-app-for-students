"use server";

import { prisma } from "@/lib/prisma";
import { redis } from "@/lib/redis";
import { getSession } from "@/lib/session";
import { revalidatePath } from "next/cache";

export async function createPromptAction(data: {
  title: string;
  image: string;
  prompt: string;
}) {
  const session = await getSession();
  if (!session) {
    return { success: false, error: "Unauthorized access." };
  }

  const trimmedTitle = data.title.trim();
  const trimmedImage = data.image.trim();
  const trimmedPrompt = data.prompt.trim();

  if (!trimmedTitle) {
    return { success: false, error: "Title is required." };
  }
  if (!trimmedImage) {
    return { success: false, error: "Image URL is required." };
  }
  if (!trimmedPrompt) {
    return { success: false, error: "Prompt text is required." };
  }

  try {
    const promptObj = await prisma.aiPrompt.create({
      data: {
        title: trimmedTitle,
        image: trimmedImage,
        prompt: trimmedPrompt,
        isActive: true,
      },
    });

    // Invalidate prompts Redis cache
    if (redis.isConfigured) {
      try {
        const currentVersion = (await redis.get<number | string>("prompts:version")) || 1;
        await redis.set("prompts:version", Number(currentVersion) + 1);
        await redis.del("prompts:active");
      } catch (err) {
        console.error("Redis invalidate error in createPromptAction:", err);
      }
    }

    revalidatePath("/");
    revalidatePath("/[category]", "layout");

    return { success: true, prompt: promptObj };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to create AI Prompt." };
  }
}

export async function deletePromptAction(id: string) {
  const session = await getSession();
  if (!session) {
    return { success: false, error: "Unauthorized access." };
  }

  try {
    await prisma.aiPrompt.delete({
      where: { id },
    });

    if (redis.isConfigured) {
      try {
        const currentVersion = (await redis.get<number | string>("prompts:version")) || 1;
        await redis.set("prompts:version", Number(currentVersion) + 1);
        await redis.del("prompts:active");
      } catch (err) {
        console.error("Redis invalidate error in deletePromptAction:", err);
      }
    }

    revalidatePath("/");
    revalidatePath("/[category]", "layout");

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to delete AI Prompt." };
  }
}

export async function getAdminPromptsAction() {
  const session = await getSession();
  if (!session) {
    return { success: false, error: "Unauthorized access." };
  }

  try {
    const prompts = await prisma.aiPrompt.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
    return { success: true, prompts };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to fetch dashboard prompts." };
  }
}
