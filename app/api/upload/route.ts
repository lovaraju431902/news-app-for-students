import { NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import fs from "fs";
import path from "path";

// Check if cloud S3/R2 variables are configured
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
    console.error("Error initializing S3Client:", err);
  }
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ success: false, error: "No file provided" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const originalName = file.name;
    const extension = path.extname(originalName);
    const baseName = path.basename(originalName, extension)
      .replace(/[^a-zA-Z0-9]/g, "-") // sanitize filename
      .toLowerCase();
    
    // Generate a unique filename using timestamp and random string
    const uniqueFilename = `${baseName}-${Date.now()}-${Math.random().toString(36).substring(2, 8)}${extension}`;

    if (s3Enabled && s3Client) {
      // Upload to Cloudflare R2 / S3 Storage
      const bucketName = process.env.S3_BUCKET_NAME!;
      const cdnUrl = process.env.CDN_URL || `https://${bucketName}.r2.dev`;

      await s3Client.send(
        new PutObjectCommand({
          Bucket: bucketName,
          Key: uniqueFilename,
          Body: buffer,
          ContentType: file.type,
        })
      );

      const fileUrl = `${cdnUrl.replace(/\/$/, "")}/${uniqueFilename}`;
      return NextResponse.json({ success: true, url: fileUrl, filename: uniqueFilename });
    } else {
      // Local fallback: write to public/uploads/
      const uploadDir = path.join(process.cwd(), "public", "uploads");
      
      // Ensure directory exists
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      const filePath = path.join(uploadDir, uniqueFilename);
      fs.writeFileSync(filePath, buffer);

      const fileUrl = `/uploads/${uniqueFilename}`;
      return NextResponse.json({ success: true, url: fileUrl, filename: uniqueFilename, local: true });
    }
  } catch (error: any) {
    console.error("File upload error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to upload file" },
      { status: 500 }
    );
  }
}
