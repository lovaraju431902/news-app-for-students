const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  try {
    const updated = await prisma.tag.updateMany({
      where: {
        OR: [
          { slug: "ai-prompts" },
          { name: { contains: "Prompt", mode: "insensitive" } },
        ],
      },
      data: {
        showOnHomepage: false,
      },
    });
    console.log(`✅ Updated ${updated.count} tags: 'ai-prompts' showOnHomepage is now set to false.`);
  } catch (err) {
    console.error("❌ Error updating tag:", err);
  } finally {
    await prisma.$disconnect();
  }
}

main();
