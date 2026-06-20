import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { CalendarDays, BookOpen, Search } from "lucide-react";
import { searchBlogs } from "@/lib/search-service";
import CategoriesSidebar from "@/components/Homescreen/CategoriesSidebar";
import Topbar from "@/components/Homescreen/topbar";
import Header from "@/components/Homescreen/header";
import Navbar from "@/components/Homescreen/Navbar";
import Footer from "@/components/Homescreen/footer";
import RightRail from "@/components/Homescreen/righttail";

interface SearchPageProps {
  searchParams: Promise<{
    q?: string;
  }>;
}

export async function generateMetadata({
  searchParams,
}: SearchPageProps): Promise<Metadata> {
  const { q = "" } = await searchParams;
  const decodedQuery = decodeURIComponent(q).trim();

  return {
    title: decodedQuery
      ? `Search results for "${decodedQuery}" | Students Hub`
      : "Search Articles | Students Hub",
    description: decodedQuery
      ? `Search results for the keyword "${decodedQuery}" on Students Hub.`
      : "Search for articles, news, study materials, and jobs on Students Hub.",
    robots: {
      index: false, // Don't index search result pages to avoid duplicate content SEO issues
      follow: true,
    },
  };
}

export default async function SearchResultsPage({
  searchParams,
}: SearchPageProps) {
  const { q = "" } = await searchParams;
  const decodedQuery = decodeURIComponent(q).trim();
  
  // Search up to 30 matching blogs
  const results = decodedQuery ? await searchBlogs(decodedQuery, 30) : [];

  return (
    <div className="min-h-screen bg-white text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50 flex flex-col font-sans">
      <Topbar />
      <Header />
      <Navbar />

      <main className="flex-grow w-full px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-4 items-start">
          
          {/* Left & Center column container */}
          <div className="flex-grow flex-1 flex flex-col md:flex-row gap-6 w-full min-w-0">
            
            {/* Left Column: Categories Sidebar */}
            <CategoriesSidebar />

            {/* Center Column: Search Results */}
            <div className="flex-grow flex-1 min-w-0 space-y-8">
              
              {/* Search Title Banner */}
              <div className="border-b border-gray-200 dark:border-zinc-800 pb-4">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight flex items-center gap-3">
                  <Search className="w-7 h-7 text-primary" />
                  Search Results
                </h1>
                <p className="text-sm text-gray-500 mt-1.5 font-medium">
                  {decodedQuery ? (
                    <>
                      Found {results.length} {results.length === 1 ? "article" : "articles"} matching{" "}
                      <span className="text-blue-650 dark:text-blue-400 font-semibold">
                        "{decodedQuery}"
                      </span>
                    </>
                  ) : (
                    "Please enter a search keyword in the header."
                  )}
                </p>
              </div>

              {/* Search Grid */}
              {results.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {results.map((item) => (
                    <div
                      key={item.id}
                      className="group flex flex-col h-full bg-white dark:bg-zinc-900 rounded-xl overflow-hidden border border-gray-100 dark:border-zinc-850 shadow-sm hover:shadow-md hover:scale-[1.01] transition-all duration-300"
                    >
                      {/* Image Preview */}
                      {item.featuredImg ? (
                        <Link
                          href={`/${item.categorySlug}/${item.slug}`}
                          className="relative aspect-[16/10] overflow-hidden bg-zinc-100 dark:bg-zinc-800 block border-b border-gray-50 dark:border-zinc-850"
                        >
                          <Image
                            src={item.featuredImg}
                            alt={item.title}
                            fill
                            className="object-cover group-hover:scale-103 transition-transform duration-500"
                            sizes="(max-width: 768px) 100vw, 350px"
                          />
                        </Link>
                      ) : (
                        <Link
                          href={`/${item.categorySlug}/${item.slug}`}
                          className="relative aspect-[16/10] overflow-hidden bg-gray-50 dark:bg-zinc-800/50 block border-b border-gray-50 dark:border-zinc-850 flex items-center justify-center text-gray-300 dark:text-zinc-700"
                        >
                          <BookOpen className="w-12 h-12" />
                        </Link>
                      )}

                      {/* Content details */}
                      <div className="p-4 flex-grow flex flex-col justify-between">
                        <div className="space-y-2.5">
                          <div className="flex items-center justify-between">
                            <span className="inline-block text-[10px] font-extrabold px-2 py-0.5 rounded bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400 uppercase tracking-wider">
                              {item.categoryName}
                            </span>
                            {item.rank > 0 && (
                              <span className="text-[10px] font-semibold text-gray-400">
                                Match: {Math.round(item.rank * 100)}%
                              </span>
                            )}
                          </div>
                          
                          <h3 className="font-extrabold text-sm sm:text-base text-gray-900 dark:text-white leading-snug line-clamp-2 group-hover:text-blue-600 transition-colors">
                            <Link href={`/${item.categorySlug}/${item.slug}`}>
                              {item.title}
                            </Link>
                          </h3>

                          {item.excerpt && (
                            <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-3 leading-relaxed">
                              {item.excerpt}
                            </p>
                          )}
                        </div>

                        {/* Date details */}
                        <div className="flex items-center gap-2 text-[10px] sm:text-xs text-gray-450 dark:text-gray-450 mt-5 font-semibold border-t border-gray-50 dark:border-zinc-850/60 pt-3">
                          <CalendarDays className="w-3.5 h-3.5 text-gray-400" />
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
                  ))}
                </div>
              ) : (
                <div className="py-16 px-4 text-center border border-dashed border-gray-200 dark:border-zinc-800 rounded-2xl bg-gray-50/50 dark:bg-zinc-900/10">
                  <div className="w-16 h-16 bg-gray-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400 dark:text-zinc-650">
                    <Search className="w-8 h-8" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-950 dark:text-white">
                    {decodedQuery ? "No articles found" : "Start searching"}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-450 max-w-md mx-auto mt-2">
                    {decodedQuery
                      ? `We couldn't find any articles matching "${decodedQuery}". Try using different keywords or checking for spelling errors.`
                      : "Type keywords in the search bar above to search across our full news database."}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Sidebar */}
          <div className="w-full lg:w-[350px] shrink-0">
            <RightRail />
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
