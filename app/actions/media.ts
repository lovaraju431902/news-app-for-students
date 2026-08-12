"use server";

import fs from "fs";
import path from "path";
import { S3Client, ListObjectsV2Command, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { prisma } from "@/lib/prisma";

export interface MediaItem {
  id: string;
  name: string;
  url: string;
  type: "image" | "video";
  format: string;
  sizeBytes: number;
  sizeFormatted: string;
  createdAt: string;
}

const s3Enabled = !!(
  process.env.S3_ACCESS_KEY_ID &&
  process.env.S3_SECRET_ACCESS_KEY &&
  process.env.S3_ENDPOINT &&
  process.env.S3_BUCKET_NAME
);

let s3Client: S3Client | null = null;
if (s3Enabled) {
  try {
    s3Client = new S3Client({
      region: "auto",
      endpoint: process.env.S3_ENDPOINT!,
      credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY_ID!,
        secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!,
      },
    });
  } catch (err) {
    console.error("Error initializing S3Client for media actions:", err);
  }
}

function formatBytes(bytes: number, decimals = 1) {
  if (!+bytes) return "0 B";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

export async function getMediaLibraryAction(): Promise<{ success: boolean; items?: MediaItem[]; error?: string }> {
  try {
    const items: MediaItem[] = [];
    const seenUrls = new Set<string>();

    // 1. Scan Local Uploads Folder
    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    if (fs.existsSync(uploadsDir)) {
      const files = fs.readdirSync(uploadsDir);
      for (const file of files) {
        const filePath = path.join(uploadsDir, file);
        try {
          const stats = fs.statSync(filePath);
          if (stats.isFile()) {
            const ext = path.extname(file).toLowerCase();
            const isImg = [".webp", ".png", ".jpg", ".jpeg", ".svg", ".gif", ".avif"].includes(ext);
            const isVid = [".webm", ".mp4", ".mov", ".ogg"].includes(ext);

            if (isImg || isVid) {
              const url = `/uploads/${file}`;
              seenUrls.add(url);
              items.push({
                id: `local-${file}`,
                name: file,
                url,
                type: isVid ? "video" : "image",
                format: ext.replace(".", "").toUpperCase(),
                sizeBytes: stats.size,
                sizeFormatted: formatBytes(stats.size),
                createdAt: stats.birthtime.toISOString(),
              });
            }
          }
        } catch (e) {
          // ignore error reading single file
        }
      }
    }

    // 2. Scan S3 / Cloudflare R2 if configured
    if (s3Enabled && s3Client) {
      try {
        const bucketName = process.env.S3_BUCKET_NAME!;
        const cdnUrl = process.env.CDN_URL || `https://${bucketName}.r2.dev`;

        const s3Res = await s3Client.send(
          new ListObjectsV2Command({
            Bucket: bucketName,
            MaxKeys: 200,
          })
        );

        if (s3Res.Contents) {
          for (const obj of s3Res.Contents) {
            if (obj.Key) {
              const ext = path.extname(obj.Key).toLowerCase();
              const isImg = [".webp", ".png", ".jpg", ".jpeg", ".svg", ".gif", ".avif"].includes(ext);
              const isVid = [".webm", ".mp4", ".mov", ".ogg"].includes(ext);

              if (isImg || isVid) {
                const url = `${cdnUrl.replace(/\/$/, "")}/${obj.Key}`;
                if (!seenUrls.has(url)) {
                  seenUrls.add(url);
                  items.push({
                    id: `r2-${obj.Key}`,
                    name: obj.Key,
                    url,
                    type: isVid ? "video" : "image",
                    format: ext.replace(".", "").toUpperCase(),
                    sizeBytes: obj.Size || 0,
                    sizeFormatted: formatBytes(obj.Size || 0),
                    createdAt: obj.LastModified ? obj.LastModified.toISOString() : new Date().toISOString(),
                  });
                }
              }
            }
          }
        }
      } catch (s3Err) {
        console.error("Error listing S3/R2 objects:", s3Err);
      }
    }

    // Sort newest first
    items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return { success: true, items };
  } catch (error: any) {
    console.error("Error in getMediaLibraryAction:", error);
    return { success: false, error: error.message || "Failed to load media library." };
  }
}

export async function deleteMediaItemAction(filenameOrUrl: string): Promise<{ success: boolean; error?: string }> {
  try {
    const filename = path.basename(filenameOrUrl);

    // 1. Delete from local disk
    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    const filePath = path.join(uploadsDir, filename);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // 2. Delete from S3/R2
    if (s3Enabled && s3Client) {
      try {
        const bucketName = process.env.S3_BUCKET_NAME!;
        await s3Client.send(
          new DeleteObjectCommand({
            Bucket: bucketName,
            Key: filename,
          })
        );
      } catch (s3Err) {
        console.error("Error deleting from S3/R2:", s3Err);
      }
    }

    return { success: true };
  } catch (error: any) {
    console.error("Error deleting media item:", error);
    return { success: false, error: error.message || "Failed to delete media item." };
  }
}
