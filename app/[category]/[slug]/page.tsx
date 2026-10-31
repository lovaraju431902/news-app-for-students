import { notFound } from "next/navigation";
import { getBlogBySlugAction, incrementBlogViewsAction } from "../../actions/blogs";
import BlogContentRenderer from "@/components/BlogContentRenderer";
import CategoriesSidebar from "@/components/Homescreen/CategoriesSidebar";
import Topbar from "@/components/Homescreen/topbar";
import Header from "@/components/Homescreen/header";
import Navbar from "@/components/Homescreen/Navbar";
import Footer from "@/components/Homescreen/footer";
import RightRail from "@/components/Homescreen/righttail";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Eye, MessageSquare } from "lucide-react";
import Image from "next/image";
import type { Metadata } from "next";
import AdBanner from "@/components/ads/AdBanner";
import { getFormattedAdminName } from "@/lib/category-admins";
import { RealtimeViewsBadge } from "@/components/RealtimeViewsBadge";
import { ViewTracker } from "@/components/ViewTracker";
import { getAccessLevel } from "@/lib/subscription/access";
import { PaywallBlock } from "@/components/subscription/PaywallBlock";

interface PageProps {
  params: Promise<{
    category: string;
    slug: string;
  }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { category, slug } = await params;
  const result = await getBlogBySlugAction(slug);

  if (!result.success || !result.blog) {
    return {
      title: "Article Not Found | Students Hub",
      description: "The requested article could not be found.",
    };
  }

  const blog = result.blog;
  const keywords = blog.seoKeywords
    ? blog.seoKeywords.split(",").map((k: string) => k.trim()).filter(Boolean)
    : [];

  const titleText = `${blog.title} | Students Hub`;
  const descText = blog.excerpt || (blog.content ? blog.content.replace(/<[^>]*>/g, " ").substring(0, 155).trim() + "..." : "");

  return {
    title: titleText,
    description: descText,
    keywords: keywords.length > 0 ? keywords : undefined,
    openGraph: {
      title: titleText,
      description: descText,
      url: `/${category}/${blog.slug}`,
      type: "article",
      images: blog.featuredImg ? [{ url: blog.featuredImg, alt: blog.title }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: titleText,
      description: descText,
      images: blog.featuredImg ? [blog.featuredImg] : [],
    },
  };
}

function extractTeaserContent(content: string, excerpt?: string | null): string {
  const pMatches = content.match(/<p[\s\S]*?<\/p>/gi);
  if (pMatches && pMatches.length > 0) {
    return pMatches.slice(0, 5).join("");
  }
  if (excerpt && excerpt.trim()) {
    return `<p class="lead text-base sm:text-lg text-gray-700 dark:text-zinc-300 font-medium">${excerpt.trim()}</p>`;
  }
  const clean = content.replace(/<[^>]*>/g, " ").trim();
  return `<p>${clean.substring(0, 800)}...</p>`;
}

export default async function BlogDetailPage({ params }: PageProps) {
  const { category, slug } = await params;

  const result = await getBlogBySlugAction(slug);

  if (!result.success || !result.blog) {
    notFound();
  }

  const blog = result.blog;

  // Server-side paywall check
  const access = await getAccessLevel();
  const isLocked = Boolean(blog.isPremium && !access.hasActiveSubscription);

  // Server-side content security: strip full body text for non-subscribers
  const safeBlog = {
    ...blog,
    content: isLocked
      ? extractTeaserContent(blog.content, blog.excerpt)
      : blog.content,
  };

  // Track article views asynchronously without blocking page rendering
  incrementBlogViewsAction(slug).catch(() => {});

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

      <main className="flex-grow w-full pl-3 md:pl-0">
        <div className="flex flex-col lg:flex-row gap-4 items-start">

          {/* Left + Middle Column Wrapper */}
          <div className="flex-grow flex-1 flex flex-col md:flex-row gap-6 w-full min-w-0">

            {/* Left Column: Categories Sidebar */}

            <CategoriesSidebar />

            {/* Middle Column: Blog Content and Recommendations */}
            <div className="flex-grow flex-1 min-w-0 space-y-8 pt-5">

              {/* Post Details (Top) Ad Space */}
              <AdBanner space="post_details_top" />

              {/* Blog Content (Shadow Removed) */}
              <div className=" md:border rounded-xl p-2 md:p-10">
                <ViewTracker slug={slug} />
                <BlogContentRenderer
                  blog={safeBlog as any}
                  inline={true}
                  isLocked={isLocked}
                  currentPath={`/${category}/${slug}`}
                  isAuthenticated={access.isAuthenticated}
                />
              </div>

              {/* Post Details (Bottom) Ad Space */}
              <AdBanner space="post_details_bottom" />

              {/* More Blogs Section */}
              {moreBlogs.length > 0 && (
                <section className="space-y-4">
                  <div className="border-b border-gray-200 dark:border-zinc-800 pb-2">
                    <h2 className="text-xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                      More Articles
                    </h2>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
                    {moreBlogs.map((item) => {
                      const primaryTag = item.tags.find((t: any) => !t.tag.parentId)?.tag || item.tags[0]?.tag;
                      const catSlug = primaryTag?.slug || category;
                      const adminName = getFormattedAdminName(catSlug);
                      const formattedDate = new Date(item.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      });

                      return (
                        <article key={item.id} className="group flex flex-col w-full">
                          <div className="relative w-full aspect-[16/9] sm:aspect-[16/10] overflow-hidden bg-slate-100 dark:bg-zinc-800 rounded-[4px]">
                            <Link href={`/${catSlug}/${item.slug}`} className="block w-full h-full relative">
                              <Image
                                src={item.featuredImg || "/logo.png"}
                                alt={item.title}
                                fill
                                className="object-cover group-hover:scale-104 transition-transform duration-300"
                                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 320px"
                              />
                            </Link>
                          </div>
                          <div className="mt-2.5 flex flex-col flex-1">
                            <h3 className="font-bold text-[14px] sm:text-[15px] text-gray-900 dark:text-zinc-100 leading-snug line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                              <Link href={`/${catSlug}/${item.slug}`}>
                                {item.title}
                              </Link>
                            </h3>
                            <div className="flex items-center gap-2 text-[11px] sm:text-xs text-gray-500 dark:text-zinc-400 mt-1.5 flex-wrap">
                              <span>{adminName}</span>
                              <span>{formattedDate}</span>
                              <span className="inline-flex items-center gap-0.5 ml-0.5">
                                <MessageSquare className="w-3 h-3 text-gray-400" />
                                <span>0</span>
                              </span>
                              <RealtimeViewsBadge slug={item.slug} initialViews={item.views} />
                            </div>
                            {item.excerpt && (
                              <p className="text-xs text-gray-500 dark:text-zinc-400 line-clamp-2 mt-1.5 leading-relaxed">
                                {item.excerpt}
                              </p>
                            )}
                          </div>
                        </article>
                      );
                    })}
                  </div>
                </section>
              )}

              {/* Related Blogs Section at the bottom */}
              {relatedBlogs.length > 0 && (
                <section className="space-y-4">
                  <div className="border-b border-gray-200 dark:border-zinc-800 pb-2">
                    <h2 className="text-xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                      Related Articles
                    </h2>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
                    {relatedBlogs.map((item) => {
                      const primaryTag = item.tags.find((t: any) => !t.tag.parentId)?.tag || item.tags[0]?.tag;
                      const catSlug = primaryTag?.slug || category;
                      const adminName = getFormattedAdminName(catSlug);
                      const formattedDate = new Date(item.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      });

                      return (
                        <article key={item.id} className="group flex flex-col w-full">
                          <div className="relative w-full aspect-[16/9] sm:aspect-[16/10] overflow-hidden bg-slate-100 dark:bg-zinc-800 rounded-[4px]">
                            <Link href={`/${catSlug}/${item.slug}`} className="block w-full h-full relative">
                              <Image
                                src={item.featuredImg || "/logo.png"}
                                alt={item.title}
                                fill
                                className="object-cover group-hover:scale-104 transition-transform duration-300"
                                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 250px"
                              />
                            </Link>
                          </div>
                          <div className="mt-2.5 flex flex-col flex-1">
                            <h3 className="font-bold text-[14px] sm:text-[15px] text-gray-900 dark:text-zinc-100 leading-snug line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                              <Link href={`/${catSlug}/${item.slug}`}>
                                {item.title}
                              </Link>
                            </h3>
                            <div className="flex items-center gap-2 text-[11px] sm:text-xs text-gray-500 dark:text-zinc-400 mt-1.5 flex-wrap">
                              <span>{adminName}</span>
                              <span>{formattedDate}</span>
                              <span className="inline-flex items-center gap-0.5 ml-0.5">
                                <MessageSquare className="w-3 h-3 text-gray-400" />
                                <span>0</span>
                              </span>
                              <RealtimeViewsBadge slug={item.slug} initialViews={item.views} />
                            </div>
                            {item.excerpt && (
                              <p className="text-xs text-gray-500 dark:text-zinc-400 line-clamp-2 mt-1.5 leading-relaxed">
                                {item.excerpt}
                              </p>
                            )}
                          </div>
                        </article>
                      );
                    })}
                  </div>
                </section>
              )}

            </div>

          </div>

          {/* Right Column: Sidebar (RightRail exactly like in homepage) */}
          <div className="w-full lg:w-[350px] shrink-0 pt-5">
            <RightRail />
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
