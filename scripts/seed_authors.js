const fs = require("fs");
const path = require("path");

// Load environment variables from .env file manually
const envPath = path.join(process.cwd(), ".env");
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, "utf-8");
  envContent.split("\n").forEach((line) => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith("#")) {
      const parts = trimmed.split("=");
      const key = parts[0].trim();
      const value = parts.slice(1).join("=").trim().replace(/^['"]|['"]$/g, "");
      process.env[key] = value;
    }
  });
}
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const sharp = require("sharp");

const ADMIN_MAPPING = {
  "part-time-income": {
    name: "Sai Kiran",
    image: "https://res.cloudinary.com/tryonai/image/upload/v1781353613/create_a_kannada_indian_guy_202606131454_zrxvhu.jpg"
  },
  "share-market": {
    name: "Nikhil Reddy",
    image: "https://res.cloudinary.com/tryonai/image/upload/v1781353607/create_a_indian_guy_only_202606131454_mxkbx8.jpg"
  },
  "ai-prompts": {
    name: "Sai Kiran",
    image: "https://res.cloudinary.com/tryonai/image/upload/v1781353613/create_a_kannada_indian_guy_202606131454_zrxvhu.jpg"
  },
  "youtube-growth": {
    name: "Pavan Kumar",
    image: "https://res.cloudinary.com/tryonai/image/upload/v1781353601/create_a_telugu_indian_student_202606131451_b2ginx.jpg"
  },
  "instagram": {
    name: "Pavan Kumar",
    image: "https://res.cloudinary.com/tryonai/image/upload/v1781353601/create_a_telugu_indian_student_202606131451_b2ginx.jpg"
  },
  "mobile-hacks": {
    name: "Karthikeya",
    image: "https://res.cloudinary.com/tryonai/image/upload/v1781353601/create_a_kannada_indian_guy_202606131452_cnz5j9.jpg"
  },
  "ai-tools": {
    name: "Rohith Reddy",
    image: "https://res.cloudinary.com/tryonai/image/upload/v1781353601/Professional_headshot_of_an_Indian_202606131520_d80zaw.jpg"
  },
  "marketing": {
    name: "Varun Teja",
    image: "https://res.cloudinary.com/tryonai/image/upload/v1781353605/create_a_telugu_young_star_202606131443_pjkkeu.jpg"
  },
  "startup-ideas": {
    name: "Nikhil Reddy",
    image: "https://res.cloudinary.com/tryonai/image/upload/v1781353607/create_a_indian_guy_only_202606131454_mxkbx8.jpg"
  },
  "technology": {
    name: "Rohith Reddy",
    image: "https://res.cloudinary.com/tryonai/image/upload/v1781353601/Professional_headshot_of_an_Indian_202606131520_d80zaw.jpg"
  },
  "apps-websites": {
    name: "Karthikeya",
    image: "https://res.cloudinary.com/tryonai/image/upload/v1781353601/create_a_kannada_indian_guy_202606131452_cnz5j9.jpg"
  },
  "facebook": {
    name: "Varun Teja",
    image: "https://res.cloudinary.com/tryonai/image/upload/v1781353605/create_a_telugu_young_star_202606131443_pjkkeu.jpg"
  },
  "current-affairs": {
    name: "Kusuma",
    image: "https://res.cloudinary.com/tryonai/image/upload/v1781353603/create_a_telugu_indian_student_202606131442_qicxhk.jpg"
  },
  "govt-jobs-updates": {
    name: "Rakesh Naidu",
    image: "https://res.cloudinary.com/tryonai/image/upload/v1781353598/Change_the_aspect_ratio_to_202606131731_vkfzsi.jpg"
  },
  "files-materials": {
    name: "Bhargavi",
    image: "https://res.cloudinary.com/tryonai/image/upload/v1781353599/create_a_indian_student_only_202606131457_mvyu44.jpg"
  },
  "internships": {
    name: "Harsha Vardhan",
    image: "https://res.cloudinary.com/tryonai/image/upload/v1781353603/create_a_tamil_indian_guy_202606131451_tjp86m.jpg"
  },
  "scholarships": {
    name: "Keerthana Reddy",
    image: "https://res.cloudinary.com/tryonai/image/upload/v1781353613/create_a_telugu_indian_student_202606131452_efm1aq.jpg"
  },
  "editing": {
    name: "Rakesh Naidu",
    image: "https://res.cloudinary.com/tryonai/image/upload/v1781353598/Change_the_aspect_ratio_to_202606131731_vkfzsi.jpg"
  }
};

const s3Enabled = !!(
  process.env.S3_ACCESS_KEY_ID &&
  process.env.S3_SECRET_ACCESS_KEY &&
  process.env.S3_ENDPOINT &&
  process.env.S3_BUCKET_NAME
);

let s3Client = null;
if (s3Enabled) {
  try {
    s3Client = new S3Client({
      region: "auto",
      endpoint: process.env.S3_ENDPOINT,
      credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY_ID,
        secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
      },
    });
    console.log("✅ Cloudflare R2 S3Client initialized successfully.");
  } catch (err) {
    console.error("❌ Error initializing S3Client:", err);
  }
} else {
  console.warn("⚠️ Cloudflare R2 details missing from env. Falling back to local upload logic.");
}

async function run() {
  console.log("👥 Starting Author Profile Images Seed to CDN...");

  const outputDir = path.join(process.cwd(), "public", "authors");
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const mappingFile = path.join(outputDir, "mapping.json");
  const updatedMapping = {};

  for (const [key, author] of Object.entries(ADMIN_MAPPING)) {
    console.log(`📥 Downloading image for ${author.name} (${key})...`);
    try {
      const res = await fetch(author.image);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const arrayBuffer = await res.arrayBuffer();
      let buffer = Buffer.from(arrayBuffer);

      // Convert image to WebP using sharp
      try {
        buffer = await sharp(buffer)
          .webp({ quality: 85 })
          .toBuffer();
        console.log(`⚡ Converted ${key} image to WebP format.`);
      } catch (sharpErr) {
        console.error(`⚠️ Sharp WebP conversion failed for ${key}, using original buffer:`, sharpErr.message);
      }

      let targetUrl = "";

      if (s3Enabled && s3Client) {
        // Upload WebP file to Cloudflare R2
        const filename = `author-${key}.webp`;
        const bucketName = process.env.S3_BUCKET_NAME;
        const cdnUrl = process.env.CDN_URL || `https://${bucketName}.r2.dev`;

        await s3Client.send(
          new PutObjectCommand({
            Bucket: bucketName,
            Key: `authors/${filename}`,
            Body: buffer,
            ContentType: "image/webp",
          })
        );
        targetUrl = `${cdnUrl.replace(/\/$/, "")}/authors/${filename}`;
        console.log(`☁️ Uploaded ${key} to Cloudflare R2: ${targetUrl}`);
      } else {
        // Local fallback: save locally as WebP
        const uploadsDir = path.join(process.cwd(), "public", "uploads");
        if (!fs.existsSync(uploadsDir)) {
          fs.mkdirSync(uploadsDir, { recursive: true });
        }
        const filename = `author-${key}.webp`;
        fs.writeFileSync(path.join(uploadsDir, filename), buffer);
        targetUrl = `/uploads/${filename}`;
        console.log(`💾 Saved ${key} locally as WebP: ${targetUrl}`);
      }

      updatedMapping[key] = {
        name: author.name,
        image: targetUrl
      };
    } catch (err) {
      console.error(`❌ Failed to process ${key}:`, err.message);
      // Fallback
      updatedMapping[key] = {
        name: author.name,
        image: author.image
      };
    }
  }

  fs.writeFileSync(mappingFile, JSON.stringify(updatedMapping, null, 2), "utf-8");
  console.log(`✅ Author mappings updated successfully in public/authors/mapping.json`);
}

run().catch((err) => {
  console.error("❌ Fatal error in author seed script:", err);
  process.exit(1);
});
