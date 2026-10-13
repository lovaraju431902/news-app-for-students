import { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const rawBaseUrl = process.env.MAIN_URL || process.env.NEXT_PUBLIC_SITE_URL || "https://telugustudents.in";
  const baseUrl = rawBaseUrl.endsWith("/") ? rawBaseUrl.slice(0, -1) : rawBaseUrl;

  // 1. Static Routes
  const staticRoutes = [
    "",
    "/about",
    "/contact",
    "/editorial-policy",
    "/privacy-policy",
    "/terms-of-service",
    "/blogs",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: route === "" ? 1.0 : 0.8,
  }));

  // 2. Dynamic Categories (All Tags)
  let categoryRoutes: MetadataRoute.Sitemap = [];
  try {
    const categories = await prisma.tag.findMany();
    categoryRoutes = categories.map((cat) => ({
      url: `${baseUrl}/${cat.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }));
  } catch (error) {
    console.error("Error generating category sitemap routes:", error);
  }

  // 3. Dynamic Blogs
  let blogRoutes: MetadataRoute.Sitemap = [];
  try {
    const blogs = await prisma.blog.findMany({
      include: {
        tags: {
          include: {
            tag: true,
          },
        },
      },
    });

    blogRoutes = blogs.map((blog) => {
      // Find the parent category tag to construct the proper URL path
      const mainTag = blog.tags.find((t) => !t.tag.parentId)?.tag || blog.tags[0]?.tag;
      const categorySlug = mainTag?.slug || "general";

      return {
        url: `${baseUrl}/${categorySlug}/${blog.slug}`,
        lastModified: blog.updatedAt,
        changeFrequency: "monthly" as const,
        priority: 0.6,
      };
    });
  } catch (error) {
    console.error("Error generating blog sitemap routes:", error);
  }

  return [...staticRoutes, ...categoryRoutes, ...blogRoutes];
}




