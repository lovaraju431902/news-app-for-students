import MainPage from "@/components/MainPage";
import { prisma } from "@/lib/prisma";

export default async function Home() {
  const slides = await prisma.slideData.findMany({
    where: {
      isActive: true,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 1,
  });

  const firstSlide = slides[0];

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
