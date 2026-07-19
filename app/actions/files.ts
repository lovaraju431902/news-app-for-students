"use server";

import { prisma } from "@/lib/prisma";
import { redis } from "@/lib/redis";
import { getSession } from "@/lib/session";
import { revalidatePath } from "next/cache";

export async function createFileAction(data: {
  title: string;
  fileUrl: string;
  fileSize: string;
  fileType: string;
}) {
  const session = await getSession();
  if (!session) {
    return { success: false, error: "Unauthorized access." };
  }

  const trimmedTitle = data.title.trim();
  const trimmedFileUrl = data.fileUrl.trim();
  const trimmedFileSize = data.fileSize.trim();
  const trimmedFileType = data.fileType.trim();

  if (!trimmedTitle) {
    return { success: false, error: "Title is required." };
  }
  if (!trimmedFileUrl) {
    return { success: false, error: "File URL is required." };
  }
  if (!trimmedFileSize) {
    return { success: false, error: "File size is required." };
  }
  if (!trimmedFileType) {
    return { success: false, error: "File type (e.g. PDF, ZIP) is required." };
  }

  try {
    const fileObj = await prisma.materialFile.create({
      data: {
        title: trimmedTitle,
        fileUrl: trimmedFileUrl,
        fileSize: trimmedFileSize,
        fileType: trimmedFileType,
        isActive: true,
      },
    });

    // Invalidate files cache
    if (redis.isConfigured) {
      try {
        const currentVersion = (await redis.get<number | string>("files:version")) || 1;
        await redis.set("files:version", Number(currentVersion) + 1);
        await redis.del("files:active");
      } catch (err) {
        console.error("Redis invalidate error in createFileAction:", err);
      }
    }

    revalidatePath("/");
    revalidatePath("/[category]", "layout");

    return { success: true, file: fileObj };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to create Material File." };
  }
}

export async function deleteFileAction(id: string) {
  const session = await getSession();
  if (!session) {
    return { success: false, error: "Unauthorized access." };
  }

  try {
    await prisma.materialFile.delete({
      where: { id },
    });

    if (redis.isConfigured) {
      try {
        const currentVersion = (await redis.get<number | string>("files:version")) || 1;
        await redis.set("files:version", Number(currentVersion) + 1);
        await redis.del("files:active");
      } catch (err) {
        console.error("Redis invalidate error in deleteFileAction:", err);
      }
    }

    revalidatePath("/");
    revalidatePath("/[category]", "layout");

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to delete Material File." };
  }
}

export async function getAdminFilesAction() {
  const session = await getSession();
  if (!session) {
    return { success: false, error: "Unauthorized access." };
  }

  try {
    const files = await prisma.materialFile.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
    return { success: true, files };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to fetch dashboard files." };
  }
}
