const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

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
];

async function seedCategoryBlockStyles() {
  console.log("==========================================================");
  console.log("Seeding Category Block Styles (Styles 1-6)...");
  console.log("==========================================================");

  try {
    for (const cfg of categoryConfigs) {
      const tag = await prisma.tag.findUnique({
        where: { slug: cfg.slug },
      });

      if (tag) {
        await prisma.tag.update({
          where: { id: tag.id },
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
        console.log(`✅ Configured ${cfg.name} -> ${cfg.style} (Order: #${cfg.order})`);
      } else {
        // Create if missing
        await prisma.tag.create({
          data: {
            name: cfg.name,
            slug: cfg.slug,
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
        console.log(`✨ Created & Configured ${cfg.name} -> ${cfg.style} (Order: #${cfg.order})`);
      }
    }

    console.log("==========================================================");
    console.log("Category Block Styles seeded successfully!");
    console.log("==========================================================");
  } catch (error) {
    console.error("Error seeding category block styles:", error);
  } finally {
    await prisma.$disconnect();
  }
}

seedCategoryBlockStyles();
