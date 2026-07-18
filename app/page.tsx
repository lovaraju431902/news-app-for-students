import MainPage from "@/components/MainPage";
import { prisma } from "@/lib/prisma";

export default async function Home() {
  let firstSlide = null;
  try {
    const slides = await prisma.slideData.findMany({
      where: {
        isActive: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 1,
    });
    firstSlide = slides[0];
  } catch (error) {
    console.error("Failed to query slides at build-time:", error);
  }

  return (
    <>
      {firstSlide?.image && (
        <link
          rel="preload"
          as="image"
          href={firstSlide.image}
          fetchPriority="high"
        />
      )}
      <MainPage />
    </>
  );
}
