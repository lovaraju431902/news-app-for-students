import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Topbar from "@/components/Homescreen/topbar";
import Header from "@/components/Homescreen/header";
import Navbar from "@/components/Homescreen/Navbar";
import Footer from "@/components/Homescreen/footer";
import CategoriesSidebar from "@/components/Homescreen/CategoriesSidebar";
import Link from "next/link";
import { CalendarDays, BookOpen, ArrowLeft } from "lucide-react";
import Image from "next/image";

interface PageProps {
  params: Promise<{
    category: string;
  }>;
}

export default async function CategoryPage({ params }: PageProps) {
  const { category } = await params;

  // Fetch the tag matching the category slug
  const categoryTag = await prisma.tag.findUnique({
    where: { slug: category },
  });

  if (!categoryTag) {
    notFound();
  }

  // Fetch blogs associated with this category or its subcategories
  const blogs = await prisma.blog.findMany({
    where: {
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
    },
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
  });

  // Calculate dynamic reading time for blog
  const getReadTime = (content: string) => {
    const wordsPerMinute = 200;
    const words = content.trim().split(/\s+/).length;
    const minutes = Math.ceil(words / wordsPerMinute);
    return `${minutes} min read`;
  };

  return (
    <div className="min-h-screen bg-white text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50 flex flex-col font-sans">
      <Topbar />
      <Header />
      <Navbar />

      <main className="flex-grow w-full px-4 py-6">
        <div className="flex flex-col md:flex-row gap-6 items-start">
          
          {/* Left Column: Categories Sidebar */}
          <CategoriesSidebar />

          {/* Middle Column: Blog List */}
          <div className="flex-grow flex-1 min-w-0">
            
            {/* Category Header */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-50 via-indigo-50/50 to-white dark:from-zinc-900/60 dark:via-zinc-900/30 dark:to-zinc-950 border border-gray-100 dark:border-zinc-800 p-8 shadow-sm mb-8">
              <div className="absolute right-0 top-0 -mt-4 -mr-4 w-32 h-32 bg-blue-100/40 dark:bg-blue-950/10 rounded-full blur-2xl pointer-events-none" />
              <div className="absolute left-1/3 bottom-0 -mb-6 w-24 h-24 bg-indigo-100/40 dark:bg-indigo-950/10 rounded-full blur-xl pointer-events-none" />

              <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400 mb-3">
                    <BookOpen className="w-3.5 h-3.5" />
                    Category
                  </span>
                  <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                    {categoryTag.name}
                  </h1>
                  <p className="text-gray-500 dark:text-gray-400 text-sm mt-2 font-medium">
                    Discover articles, guides, and tutorials about {categoryTag.name}.
                  </p>
                </div>
                <div className="shrink-0 flex items-center bg-white dark:bg-zinc-900 px-4 py-2.5 rounded-xl border border-gray-150 dark:border-zinc-800 shadow-sm self-start md:self-auto">
                  <span className="text-2xl font-black text-blue-600 dark:text-blue-400">
                    {blogs.length}
                  </span>
                  <span className="text-xs font-bold text-gray-500 dark:text-gray-400 ml-2 uppercase tracking-wider">
                    {blogs.length === 1 ? 'Article' : 'Articles'}
                  </span>
                </div>
              </div>
            </div>

            {/* Empty State */}
            {blogs.length === 0 ? (
              <div className="flex flex-col items-center justify-center border border-dashed border-gray-200 dark:border-zinc-800 rounded-2xl p-12 text-center bg-gray-50/50 dark:bg-zinc-900/20">
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
              /* Blogs Grid */
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {blogs.map((item) => {
                  const primaryTag = item.tags.find((t: any) => !t.tag.parentId)?.tag || item.tags[0]?.tag;
                  const catSlug = primaryTag?.slug || category;
                  const readTime = getReadTime(item.content);

                  return (
                    <div
                      key={item.id}
                      className="group flex flex-col h-full bg-white dark:bg-zinc-900 rounded-xl overflow-hidden border border-gray-150 dark:border-zinc-800/80 shadow-sm hover:shadow-md hover:scale-[1.01] transition-all duration-300"
                    >
                      {item.featuredImg && (
                        <Link
                          href={`/${catSlug}/${item.slug}`}
                          className="relative aspect-[16/10] overflow-hidden bg-zinc-100 dark:bg-zinc-800 block"
                        >
                          <Image
                            src={item.featuredImg}
                            alt={item.title}
                            fill
                            className="object-cover group-hover:scale-103 transition-transform duration-500"
                            sizes="(max-width: 768px) 100vw, 350px"
                          />
                        </Link>
                      )}
                      
                      <div className="p-4 flex-grow flex flex-col justify-between">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between gap-2">
                            {primaryTag && (
                              <span className="inline-block text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400">
                                {primaryTag.name}
                              </span>
                            )}
                            <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wide">
                              {readTime}
                            </span>
                          </div>
                          <h3 className="font-extrabold text-sm sm:text-base text-gray-900 dark:text-white leading-snug line-clamp-2 group-hover:text-blue-600 transition-colors">
                            <Link href={`/${catSlug}/${item.slug}`}>
                              {item.title}
                            </Link>
                          </h3>
                          {item.excerpt && (
                            <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mt-1 leading-relaxed font-medium">
                              {item.excerpt}
                            </p>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-2 text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 mt-4 font-medium border-t border-gray-50 dark:border-zinc-850 pt-3">
                          <CalendarDays className="w-3.5 h-3.5" />
                          <span>
                            {new Date(item.createdAt).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
