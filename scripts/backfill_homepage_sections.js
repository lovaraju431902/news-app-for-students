const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function backfill() {
  console.log("==========================================================");
  console.log("Starting Dynamic Homepage Sections Backfill...");
  console.log("==========================================================");

  try {
    const allBlogs = await prisma.blog.findMany({
      include: {
        tags: {
          include: { tag: true },
        },
        homepageItems: true,
      },
      orderBy: { createdAt: "desc" },
    });

    console.log(`Found ${allBlogs.length} total blog posts in database.`);
    if (allBlogs.length === 0) {
      console.log("No blogs found in database to backfill. Exiting.");
      return;
    }

    // Map of target sections and how many posts to seed if section is currently empty
    const sectionConfigs = [
      { section: "slide_data", count: 4, name: "Slide Data" },
      { section: "right_cards", count: 2, name: "Right Cards" },
      { section: "latest_news", count: 6, name: "Latest News" },
      { section: "trending_news", count: 6, name: "Trending News" },
      { section: "most_read", count: 8, name: "Most Read" },
      { section: "you_may_like", count: 6, name: "You May Like" },
      { section: "web_stories", count: 4, name: "Web Stories" },
      { section: "videos", count: 6, name: "Videos" },
      { section: "video_gallery", count: 4, name: "Video Gallery" },
    ];

    // Special: Technology News
    const techBlogs = allBlogs.filter((b) =>
      b.tags.some((t) => t.tag?.slug === "technology" || t.tag?.name?.toLowerCase().includes("tech"))
    );

    const targetTechBlogs = techBlogs.length > 0 ? techBlogs : allBlogs.slice(0, 5);

    const existingTech = await prisma.homepageItem.count({
      where: { section: "technology_news" },
    });

    if (existingTech === 0) {
      console.log(`Backfilling Technology News with ${Math.min(targetTechBlogs.length, 6)} posts...`);
      for (let i = 0; i < Math.min(targetTechBlogs.length, 6); i++) {
        await prisma.homepageItem.upsert({
          where: {
            blogId_section: {
              blogId: targetTechBlogs[i].id,
              section: "technology_news",
            },
          },
          update: {},
          create: {
            blogId: targetTechBlogs[i].id,
            section: "technology_news",
            order: i,
            isActive: true,
          },
        });
      }
    }

    // Seed general sections
    for (const conf of sectionConfigs) {
      const existingCount = await prisma.homepageItem.count({
        where: { section: conf.section },
      });

      if (existingCount === 0) {
        console.log(`Backfilling ${conf.name} with ${conf.count} posts...`);
        const targetPosts = allBlogs.slice(0, conf.count);

        for (let i = 0; i < targetPosts.length; i++) {
          await prisma.homepageItem.upsert({
            where: {
              blogId_section: {
                blogId: targetPosts[i].id,
                section: conf.section,
              },
            },
            update: {},
            create: {
              blogId: targetPosts[i].id,
              section: conf.section,
              order: i,
              priority: i === 0 ? 1 : 0,
              isActive: true,
            },
          });
        }
      } else {
        console.log(`Section ${conf.name} already has ${existingCount} assigned posts. Skipping.`);
      }
    }

    // Configure default category block styles (Styles 1-6) across standard categories
    console.log("🎨 Ensuring Category Block Styles (Styles 1-6) are configured...");
    const categoryConfigs = [
      { slug: "govt-jobs-updates", name: "Government Jobs", style: "style2", order: 1, limit: 7, cols: 3, accent: "bg-blue-600" },
      { slug: "scholarships", name: "Scholarships", style: "style1", order: 2, limit: 8, cols: 4, accent: "bg-emerald-600" },
      { slug: "internships", name: "Internships", style: "style4", order: 3, limit: 8, cols: 4, accent: "bg-purple-600" },
      { slug: "part-time-income", name: "Part Time Income", style: "style3", order: 4, limit: 6, cols: 3, accent: "bg-teal-600" },
      { slug: "technology", name: "Technology", style: "style5", order: 5, limit: 8, cols: 4, accent: "bg-cyan-600" },
      { slug: "startup-ideas", name: "Startup Ideas", style: "style6", order: 6, limit: 6, cols: 3, accent: "bg-indigo-600" },
      { slug: "share-market", name: "Share Market", style: "style3", order: 7, limit: 6, cols: 3, accent: "bg-green-600" },
      { slug: "ai-tools", name: "AI Tools", style: "style4", order: 8, limit: 8, cols: 4, accent: "bg-violet-600" },
      { slug: "carrer-jobs", name: "Career Jobs", style: "style2", order: 9, limit: 7, cols: 3, accent: "bg-amber-600" },
      { slug: "current-affairs", name: "Current Affairs", style: "style1", order: 10, limit: 8, cols: 4, accent: "bg-rose-600" },
      { slug: "youtube-growth", name: "YouTube Growth", style: "style5", order: 11, limit: 8, cols: 4, accent: "bg-red-600" },
      { slug: "mobile-hacks", name: "Mobile Hacks", style: "style4", order: 12, limit: 8, cols: 4, accent: "bg-sky-600" },
      { slug: "apps-websites", name: "Apps & Websites", style: "style3", order: 13, limit: 6, cols: 3, accent: "bg-blue-700" },
      { slug: "marketing", name: "Marketing", style: "style6", order: 14, limit: 6, cols: 3, accent: "bg-orange-600" },
      { slug: "ai-prompts", name: "AI Prompts", style: "style5", order: 15, limit: 8, cols: 4, accent: "bg-pink-600" },
    ];

    for (const cfg of categoryConfigs) {
      const tag = await prisma.tag.findUnique({ where: { slug: cfg.slug } });
      if (tag) {
        await prisma.tag.update({
          where: { id: tag.id },
          data: {
            showOnHomepage: true,
            homepageBlockStyle: tag.homepageBlockStyle && tag.homepageBlockStyle !== "style1" ? tag.homepageBlockStyle : cfg.style,
            homepageOrder: tag.homepageOrder || cfg.order,
            homepagePostLimit: tag.homepagePostLimit || cfg.limit,
            homepageColumns: tag.homepageColumns || cfg.cols,
            showThumbnail: true,
            showDate: true,
            showExcerpt: false,
            showViewAll: true,
            accentColor: tag.accentColor || cfg.accent,
          },
        });
      }
    }
    console.log("✅ Category Block Styles (Styles 1-6) verified and synchronized.");

    console.log("==========================================================");
    console.log("✅ Homepage Sections Backfill completed successfully.");
    console.log("==========================================================");
  } catch (error) {
    console.error("Backfill error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

backfill();
