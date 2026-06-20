import React from "react";
import Topbar from "@/components/Homescreen/topbar";
import Header from "@/components/Homescreen/header";
import Navbar from "@/components/Homescreen/Navbar";
import Footer from "@/components/Homescreen/footer";
import CategoriesSidebar from "@/components/Homescreen/CategoriesSidebar";

export default function SearchLoading() {
  return (
    <div className="min-h-screen bg-white text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50 flex flex-col font-sans">
      <Topbar />
      <Header />
      <Navbar />

      <main className="flex-grow w-full px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-4 items-start">
          
          {/* Left & Center container */}
          <div className="flex-grow flex-1 flex flex-col md:flex-row gap-6 w-full min-w-0">
            {/* Left Column: Categories Sidebar */}
            <CategoriesSidebar />

            {/* Center Column: Skeletons */}
            <div className="flex-grow flex-1 min-w-0 space-y-8 animate-pulse">
              
              {/* Title Banner Skeleton */}
              <div className="border-b border-gray-200 dark:border-zinc-800 pb-4">
                <div className="h-8 w-48 bg-gray-200 dark:bg-zinc-800 rounded-lg" />
                <div className="h-4 w-64 bg-gray-150 dark:bg-zinc-850 rounded-md mt-2.5" />
              </div>

              {/* Skeleton Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div
                    key={i}
                    className="flex flex-col h-full bg-white dark:bg-zinc-900 rounded-xl overflow-hidden border border-gray-100 dark:border-zinc-850 shadow-sm"
                  >
                    {/* Image Placeholder */}
                    <div className="aspect-[16/10] bg-gray-200 dark:bg-zinc-800 w-full" />

                    {/* Content Details Placeholder */}
                    <div className="p-4 flex-grow flex flex-col justify-between space-y-4">
                      <div className="space-y-3">
                        <div className="h-4 w-20 bg-gray-250 dark:bg-zinc-750 rounded" />
                        <div className="h-5 w-11/12 bg-gray-200 dark:bg-zinc-800 rounded" />
                        <div className="h-5 w-5/6 bg-gray-200 dark:bg-zinc-800 rounded" />
                        <div className="space-y-1.5 pt-2">
                          <div className="h-3.5 w-full bg-gray-150 dark:bg-zinc-850 rounded" />
                          <div className="h-3.5 w-11/12 bg-gray-150 dark:bg-zinc-850 rounded" />
                        </div>
                      </div>

                      {/* Footer date placeholder */}
                      <div className="border-t border-gray-50 dark:border-zinc-850/60 pt-3">
                        <div className="h-3.5 w-24 bg-gray-200 dark:bg-zinc-800 rounded" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Sidebar Skeleton */}
          <div className="w-full lg:w-[350px] shrink-0 space-y-5 pl-2 animate-pulse">
            <div className="bg-card w-full border border-border rounded-xl p-3">
              <div className="h-4 w-32 bg-zinc-200 dark:bg-zinc-800 rounded mb-4" />
              <div className="space-y-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex gap-3 items-center">
                    <div className="w-12 h-12 rounded-lg bg-zinc-200 dark:bg-zinc-800 shrink-0" />
                    <div className="flex-1 space-y-1.5">
                      <div className="h-3 w-5/6 bg-zinc-200 dark:bg-zinc-800 rounded" />
                      <div className="h-2 w-16 bg-zinc-200 dark:bg-zinc-800 rounded" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
