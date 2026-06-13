import { notFound } from "next/navigation";
import { getBlogBySlugAction } from "../../actions/blogs";
import BlogContentRenderer from "@/components/BlogContentRenderer";
import CategoriesSidebar from "@/components/Homescreen/CategoriesSidebar";
import Topbar from "@/components/Homescreen/topbar";
import Header from "@/components/Homescreen/header";
import Navbar from "@/components/Homescreen/Navbar";
import Footer from "@/components/Homescreen/footer";
import RightRail from "@/components/Homescreen/righttail";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { CalendarDays } from "lucide-react";
import Image from "next/image";

interface PageProps {
  params: Promise<{
    category: string;
    slug: string;
  }>;
}

export default async function BlogDetailPage({ params }: PageProps) {
  const { category, slug } = await params;

  const result = await getBlogBySlugAction(slug);

  if (!result.success || !result.blog) {
    notFound();
  }

  const blog = result.blog;

  // Verify that the blog has a root/parent tag matching the category parameter in the URL
  const matchesCategory = blog.tags.some(
    (bt: any) => bt.tag && !bt.tag.parentId && bt.tag.slug === category
  );

  if (!matchesCategory) {
    notFound();
  }

  // Fetch related blogs (blogs sharing any tag of the current blog, excluding the current blog)
  const tagIds = blog.tags.map((bt: any) => bt.tagId);
  const relatedBlogs = await prisma.blog.findMany({
    where: {
      slug: { not: slug },
      tags: {
        some: {
          tagId: { in: tagIds },
        },
      },
    },
    take: 4,
    orderBy: { createdAt: "desc" },
    include: {
      tags: {
        include: {
          tag: true,
        },
      },
    },
  });

  // Fetch more blogs (other recent blogs, excluding the current blog and related ones)
  const excludedIds = [blog.id, ...relatedBlogs.map((b) => b.id)];
  const moreBlogs = await prisma.blog.findMany({
    where: {
      id: { notIn: excludedIds },
    },
    take: 6,
    orderBy: { createdAt: "desc" },
    include: {
      tags: {
        include: {
          tag: true,
        },
      },
    },
  });

  return (
    <div className="min-h-screen bg-white text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50 flex flex-col font-sans">
      <Topbar />
      <Header />
      <Navbar />

      <main className="flex-grow w-full px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-4 items-start">

          {/* Left + Middle Column Wrapper */}
          <div className="flex-grow flex-1 flex flex-col md:flex-row gap-6 w-full min-w-0">

            {/* Left Column: Categories Sidebar */}
            <CategoriesSidebar />

            {/* Middle Column: Blog Content and Recommendations */}
            <div className="flex-grow flex-1 min-w-0 space-y-12">

              {/* Blog Content (Shadow Removed) */}
              <div className=" border rounded-xl p-5 md:p-10">
                <BlogContentRenderer blog={blog as any} inline={true} />
              </div>

              {/* More Blogs Section */}
              {moreBlogs.length > 0 && (
                <section className="space-y-6">
                  <div className="border-b border-gray-200 dark:border-zinc-800 pb-2">
                    <h2 className="text-xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                      More Articles
                    </h2>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {moreBlogs.map((item) => {
                      const primaryTag = item.tags.find((t: any) => !t.tag.parentId)?.tag || item.tags[0]?.tag;
                      const catSlug = primaryTag?.slug || "general";

                      return (
                        <div key={item.id} className="group flex flex-col h-full bg-white dark:bg-zinc-900 rounded-xl overflow-hidden border border-gray-100 dark:border-zinc-850 shadow-sm hover:shadow-md hover:scale-[1.01] transition-all duration-300">
                          {item.featuredImg && (
                            <Link href={`/${catSlug}/${item.slug}`} className="relative aspect-[16/10] overflow-hidden bg-zinc-100 dark:bg-zinc-800 block">
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
                              {primaryTag && (
                                <span className="inline-block text-[10px] font-bold px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-650 dark:text-zinc-400">
                                  {primaryTag.name}
                                </span>
                              )}
                              <h3 className="font-extrabold text-sm sm:text-base text-gray-900 dark:text-white leading-snug line-clamp-2 group-hover:text-blue-600 transition-colors">
                                <Link href={`/${catSlug}/${item.slug}`}>
                                  {item.title}
                                </Link>
                              </h3>
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
                </section>
              )}

              {/* Related Blogs Section at the bottom (Replaces youmaylike) */}
              {relatedBlogs.length > 0 && (
                <section className="space-y-6">
                  <div className="border-b border-gray-200 dark:border-zinc-800 pb-2 flex items-center justify-between">
                    <h2 className="text-xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                      Related Articles
                    </h2>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {relatedBlogs.map((item) => {
                      const primaryTag = item.tags.find((t: any) => !t.tag.parentId)?.tag || item.tags[0]?.tag;
                      const catSlug = primaryTag?.slug || "general";

                      return (
                        <div key={item.id} className="group flex flex-col h-full bg-white dark:bg-zinc-900 rounded-xl overflow-hidden border border-gray-100 dark:border-zinc-850 shadow-sm hover:shadow-md hover:scale-[1.01] transition-all duration-300">
                          {item.featuredImg && (
                            <Link href={`/${catSlug}/${item.slug}`} className="relative aspect-[16/10] overflow-hidden bg-zinc-100 dark:bg-zinc-800 block">
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
                              {primaryTag && (
                                <span className="inline-block text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400">
                                  {primaryTag.name}
                                </span>
                              )}
                              <h3 className="font-extrabold text-sm sm:text-base text-gray-900 dark:text-white leading-snug line-clamp-2 group-hover:text-blue-600 transition-colors">
                                <Link href={`/${catSlug}/${item.slug}`}>
                                  {item.title}
                                </Link>
                              </h3>
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
                </section>
              )}

            </div>

          </div>

          {/* Right Column: Sidebar (RightRail exactly like in homepage) */}
          <div className="w-full lg:w-[350px] shrink-0">
            <RightRail />
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
