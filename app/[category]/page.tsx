import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { redis } from "@/lib/redis";
import Topbar from "@/components/Homescreen/topbar";
import Header from "@/components/Homescreen/header";
import Navbar from "@/components/Homescreen/Navbar";
import Footer from "@/components/Homescreen/footer";
import CategoriesSidebar from "@/components/Homescreen/CategoriesSidebar";
import Link from "next/link";
import { Calendar, BookOpen, ArrowLeft } from "lucide-react";
import Image from "next/image";
import type { Metadata } from "next";
import { cn } from "@/lib/utils";

interface PageProps {
  params: Promise<{
    category: string;
  }>;
  searchParams?: Promise<{
    page?: string;
  }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { category } = await params;
  const categoryTag = await prisma.tag.findUnique({
    where: { slug: category },
  });

  if (!categoryTag) {
    return {
      title: "Category Not Found | Students Hub",
      description: "The requested category could not be found.",
    };
  }

  return {
    title: `${categoryTag.name} Articles & Guides | Students Hub`,
    description: `Browse all articles, guides, resources and latest updates in the ${categoryTag.name} category on Students Hub.`,
    keywords: [categoryTag.name.toLowerCase(), "telugu students", "students hub", `${categoryTag.name.toLowerCase()} updates`],
  };
}

const getBadgeStyle = (slug: string) => {
  const colors: Record<string, string> = {
    "govt-jobs": "bg-blue-600 text-white",
    "study-tips": "bg-indigo-600 text-white",
    "tech-news": "bg-blue-500 text-white",
    "youtube-tips": "bg-red-600 text-white",
    "results": "bg-emerald-600 text-white",
    "scholarships": "bg-orange-500 text-white",
    "exam-prep": "bg-indigo-600 text-white",
    "part-time-income": "bg-emerald-600 text-white",
    "share-market": "bg-blue-600 text-white",
    "business": "bg-indigo-600 text-white",
    "carrer-jobs": "bg-violet-600 text-white",
    "youtube-growth": "bg-red-600 text-white",
    "instagram": "bg-pink-600 text-white",
    "mobile-hacks": "bg-cyan-600 text-white",
    "ai-tools": "bg-purple-600 text-white",
    "marketing": "bg-amber-600 text-white",
    "startup-ideas": "bg-orange-600 text-white",
    "technology": "bg-teal-600 text-white",
    "apps-websites": "bg-sky-600 text-white",
    "facebook": "bg-blue-600 text-white",
    "editing": "bg-rose-600 text-white",
    "govt-jobs-updates": "bg-yellow-600 text-zinc-900",
    "files-materials": "bg-zinc-600 text-white",
    "internships": "bg-lime-600 text-white",
    "current-affairs": "bg-amber-600 text-white",
  };
  return colors[slug] || "bg-zinc-700 text-white";
};

export default async function CategoryPage({ params, searchParams }: PageProps) {
  const { category } = await params;
  const resolvedSearchParams = await searchParams;
  const page = resolvedSearchParams?.page;

  // Fetch the tag matching the category slug
  const categoryTag = await prisma.tag.findUnique({
    where: { slug: category },
  });

  if (!categoryTag) {
    notFound();
  }

  // Pagination Settings
  const currentPage = parseInt(page || "1", 10);
  const ITEMS_PER_PAGE = 8;

  const cacheKey = `category:${category}:p:${currentPage}`;
  let blogsData: { blogs: any[]; totalCount: number } | null = null;

  if (redis.isConfigured) {
    try {
      const cached = await redis.get<typeof blogsData>(cacheKey);
      if (cached) {
        blogsData = cached;
      }
    } catch (err) {
      console.error("Redis read error in CategoryPage:", err);
    }
  }

  if (!blogsData) {
    const whereClause = {
      tags: {
        some: {
          tag: {
            OR: [
              { id: categoryTag.id },
              { parentId: categoryTag.id }
            ]
          }
        }
      }
    };

    const [blogs, totalCount] = await Promise.all([
      prisma.blog.findMany({
        where: whereClause,
        include: {
          tags: {
            include: {
              tag: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        take: ITEMS_PER_PAGE,
        skip: (currentPage - 1) * ITEMS_PER_PAGE,
      }),
      prisma.blog.count({
        where: whereClause,
      }),
    ]);

    blogsData = { blogs, totalCount };

    if (redis.isConfigured && blogs.length > 0) {
      try {
        await redis.set(cacheKey, blogsData, { ex: 300 });
      } catch (err) {
        console.error("Redis write error in CategoryPage:", err);
      }
    }
  }

  const { blogs, totalCount } = blogsData;

  // Calculate dynamic reading time for blog
  const getReadTime = (content: string) => {
    const wordsPerMinute = 200;
    const words = content.trim().split(/\s+/).length;
    const minutes = Math.ceil(words / wordsPerMinute);
    return `${minutes} min read`;
  };

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);
  const paginatedBlogs = blogs;

  const getPaginationItems = (current: number, total: number) => {
    const items: (number | string)[] = [];
    if (total <= 7) {
      for (let i = 1; i <= total; i++) {
        items.push(i);
      }
    } else {
      if (current <= 4) {
        items.push(1, 2, 3, 4, 5, "...", total);
      } else if (current >= total - 3) {
        items.push(1, "...", total - 4, total - 3, total - 2, total - 1, total);
      } else {
        items.push(1, "...", current - 1, current, current + 1, "...", total);
      }
    }
    return items;
  };

  return (
    <div className="min-h-screen bg-white text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50 flex flex-col font-sans">
      <Topbar />
      <Header />
      <Navbar />

      <main className="flex-grow w-full">
        <div className="flex flex-col md:flex-row gap-6 items-start">

          {/* Left Column: Categories Sidebar */}
          <CategoriesSidebar />

          {/* Middle Column: Blog List */}
          <div className="flex-grow py-6 flex-1 min-w-0 space-y-6">

            {/* Category Header Title / Subtitle */}
            <div className="border-b border-gray-200 dark:border-zinc-800 pb-4">
              <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">
                {categoryTag.name}
              </h1>
              <p className="text-sm text-gray-500 mt-1 font-medium">
                Browse all articles and resources in the {categoryTag.name} category.
              </p>
            </div>

            {/* Empty State */}
            {blogs.length === 0 ? (
              <div className="flex flex-col items-center justify-center border border-dashed border-gray-200 dark:border-zinc-800 rounded-2xl p-12 text-center bg-gray-50/50 dark:bg-zinc-900/20 animate-fade-in">
                <div className="w-16 h-16 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mb-4 text-zinc-400 dark:text-zinc-650">
                  <BookOpen className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                  No articles found
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-450 max-w-sm mb-6 font-medium">
                  We couldn't find any articles published in the category "{categoryTag.name}" yet. Check back soon!
                </p>
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500 rounded-lg shadow transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Return Home
                </Link>
              </div>
            ) : (
              <>
                {/* Blogs Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
                  {paginatedBlogs.map((item) => {
                    const primaryTag = item.tags.find((t: any) => !t.tag.parentId)?.tag || item.tags[0]?.tag;
                    const catSlug = primaryTag?.slug || category;
                    const readTime = getReadTime(item.content);

                    return (
                      <article
                        key={item.id}
                        className="group flex flex-col h-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-md hover:border-zinc-300 dark:hover:border-zinc-700 transition-all duration-300"
                      >
                        {/* Image container */}
                        <div className="relative aspect-[16/10] w-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden rounded-t-2xl">
                          {item.featuredImg && (
                            <Link href={`/${catSlug}/${item.slug}`} className="block w-full h-full relative">
                              <Image
                                src={item.featuredImg}
                                alt={item.title}
                                fill
                                className="object-cover group-hover:scale-102 transition-transform duration-500"
                                sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 250px"
                              />
                            </Link>
                          )}

                          {/* Floating badge */}
                          {primaryTag && (
                            <span className={cn(
                              "absolute top-3.5 left-3.5 z-10 text-[9px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded shadow-sm",
                              getBadgeStyle(primaryTag.slug)
                            )}>
                              {primaryTag.name}
                            </span>
                          )}
                        </div>

                        {/* Body details */}
                        <div className="p-4 flex-grow flex flex-col justify-between">
                          <div>
                            <h3 className="font-extrabold text-sm sm:text-base text-zinc-950 dark:text-zinc-50 leading-snug line-clamp-2 group-hover:text-blue-600 transition-colors mb-2">
                              <Link href={`/${catSlug}/${item.slug}`}>
                                {item.title}
                              </Link>
                            </h3>
                          </div>

                          {/* Metadata footer */}
                          <div className="flex items-center gap-1.5 text-[11px] text-zinc-400 font-medium mt-3">
                            <Calendar className="w-3.5 h-3.5 shrink-0" />
                            <span>
                              {new Date(item.createdAt).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              })}
                            </span>
                            <span>•</span>
                            <BookOpen className="w-3.5 h-3.5 shrink-0" />
                            <span>{readTime}</span>
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>

                {/* TanStack Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center gap-1.5 mt-10">
                    {getPaginationItems(currentPage, totalPages).map((item, index) => {
                      if (item === "...") {
                        return (
                          <span key={`dots-${index}`} className="px-3.5 py-2 text-zinc-400 font-medium">
                            ...
                          </span>
                        );
                      }

                      const isCurrent = item === currentPage;
                      return (
                        <Link
                          key={`page-${item}`}
                          href={`/${category}?page=${item}`}
                          className={cn(
                            "px-3.5 py-2 rounded-lg border text-xs sm:text-sm font-bold transition-all min-w-[38px] text-center",
                            isCurrent
                              ? "bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-500/10"
                              : "bg-white border-zinc-200 hover:bg-zinc-50 text-zinc-700 dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-850"
                          )}
                        >
                          {item}
                        </Link>
                      );
                    })}

                    {currentPage < totalPages && (
                      <Link
                        href={`/${category}?page=${currentPage + 1}`}
                        className="px-4 py-2 rounded-lg border border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-750 text-xs sm:text-sm font-bold transition-all flex items-center gap-1 dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-850"
                      >
                        Next &gt;
                      </Link>
                    )}
                  </div>
                )}
              </>
            )}

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
