// "use client";

// import React, { useState, useEffect, useRef } from "react";
// import { useInfiniteQuery } from "@tanstack/react-query";
// import { Search, Download, FileText, FileArchive, Image as ImageIcon, File as FileIcon, Loader2, AlertTriangle } from "lucide-react";

// interface MaterialFile {
//   id: string;
//   title: string;
//   fileUrl: string;
//   fileSize: string;
//   fileType: string;
//   createdAt: string;
// }

// interface FetchFilesResponse {
//   files: MaterialFile[];
//   nextPage: number | null;
// }

// async function fetchFiles(q: string, type: string, page: number): Promise<FetchFilesResponse> {
//   const res = await fetch(`/api/files?q=${encodeURIComponent(q)}&type=${encodeURIComponent(type)}&page=${page}&limit=12`);
//   if (!res.ok) {
//     throw new Error("Failed to fetch files");
//   }
//   return res.json();
// }

// const FILE_TYPES = [
//   { label: "All Materials", value: "" },
//   { label: "PDFs", value: "PDF" },
//   { label: "ZIPs", value: "ZIP" },
//   { label: "Docs", value: "DOCX" },
//   { label: "Images", value: "PNG" },
// ];

// export default function FilesMaterialsView() {
//   const [searchVal, setSearchVal] = useState("");
//   const [debouncedQuery, setDebouncedQuery] = useState("");
//   const [selectedType, setSelectedType] = useState("");

//   const sentinelRef = useRef<HTMLDivElement | null>(null);

//   // Debounce search query
//   useEffect(() => {
//     const handler = setTimeout(() => {
//       setDebouncedQuery(searchVal);
//     }, 400);
//     return () => clearTimeout(handler);
//   }, [searchVal]);

//   const {
//     data,
//     fetchNextPage,
//     hasNextPage,
//     isFetching,
//     isFetchingNextPage,
//     status,
//   } = useInfiniteQuery({
//     queryKey: ["files-infinite", debouncedQuery, selectedType],
//     queryFn: ({ pageParam = 1 }) => fetchFiles(debouncedQuery, selectedType, pageParam),
//     initialPageParam: 1,
//     getNextPageParam: (lastPage) => lastPage.nextPage,
//     refetchInterval: 3000, // Poll every 3 seconds for real-time updates
//   });

//   // Load next page on scroll trigger
//   useEffect(() => {
//     if (!hasNextPage || isFetchingNextPage) return;

//     const observer = new IntersectionObserver(
//       (entries) => {
//         if (entries[0].isIntersecting) {
//           fetchNextPage();
//         }
//       },
//       { threshold: 0.1 }
//     );

//     const currentSentinel = sentinelRef.current;
//     if (currentSentinel) {
//       observer.observe(currentSentinel);
//     }

//     return () => {
//       if (currentSentinel) {
//         observer.unobserve(currentSentinel);
//       }
//     };
//   }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

//   const getFileIcon = (type: string) => {
//     const norm = type.toUpperCase();
//     if (norm === "PDF") return <FileText className="w-6 h-6 text-red-500" />;
//     if (norm === "ZIP" || norm === "RAR") return <FileArchive className="w-6 h-6 text-amber-500" />;
//     if (norm === "PNG" || norm === "JPG" || norm === "JPEG" || norm === "WEBP") return <ImageIcon className="w-6 h-6 text-emerald-500" />;
//     return <FileIcon className="w-6 h-6 text-blue-500" />;
//   };

//   const files = data?.pages.flatMap((page) => page.files) || [];

//   return (
//     <div className="space-y-6">
//       {/* Header Info */}
//       <div className="border-b border-gray-200 dark:border-zinc-800 pb-4">
//         <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">
//           Files & Study Materials
//         </h1>
//         <p className="text-sm text-gray-500 mt-1 font-medium">
//           Download syllabi, exam guides, references, model papers, and previous materials.
//         </p>
//       </div>

//       {/* Filters & Search Row */}
//       <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
//         {/* Search */}
//         <div className="relative w-full max-w-xs shrink-0">
//           <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//             <Search className="h-4 w-4 text-gray-400" />
//           </div>
//           <input
//             type="text"
//             value={searchVal}
//             onChange={(e) => setSearchVal(e.target.value)}
//             placeholder="Search documents by name..."
//             className="block w-full pl-9 pr-4 py-2 border border-gray-200 dark:border-zinc-800 rounded-xl bg-gray-50/50 dark:bg-zinc-900/30 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
//           />
//           {isFetching && !isFetchingNextPage && (
//             <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
//               <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
//             </div>
//           )}
//         </div>

//         {/* Quick Filter Chips */}
//         <div className="flex flex-wrap gap-1.5 items-center">
//           {FILE_TYPES.map((type) => (
//             <button
//               key={type.label}
//               onClick={() => setSelectedType(type.value)}
//               className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
//                 selectedType === type.value
//                   ? "bg-blue-600 text-white shadow-sm"
//                   : "bg-gray-100 hover:bg-gray-250 text-gray-700 dark:bg-zinc-900 dark:hover:bg-zinc-800 dark:text-zinc-300"
//               }`}
//             >
//               {type.label}
//             </button>
//           ))}
//         </div>
//       </div>

//       {/* Content States */}
//       {status === "pending" ? (
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 py-6">
//           {[1, 2, 3, 4, 5, 6].map((i) => (
//             <div key={i} className="animate-pulse border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4 flex gap-4 items-center">
//               <div className="w-12 h-12 bg-zinc-200 dark:bg-zinc-800 rounded-xl" />
//               <div className="flex-1 space-y-2">
//                 <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-3/4" />
//                 <div className="h-3 bg-zinc-200 dark:bg-zinc-800 rounded w-1/4" />
//               </div>
//             </div>
//           ))}
//         </div>
//       ) : status === "error" ? (
//         <div className="flex flex-col items-center justify-center p-12 text-center bg-red-500/5 border border-red-500/10 rounded-2xl">
//           <AlertTriangle className="w-10 h-10 text-red-500 mb-3" />
//           <h3 className="font-bold text-gray-900 dark:text-white">Failed to load materials</h3>
//           <p className="text-xs text-gray-500 mt-1 max-w-sm">Please refresh the page or try checking your network connection.</p>
//         </div>
//       ) : files.length === 0 ? (
//         <div className="text-center py-20 border border-dashed border-gray-200 dark:border-zinc-800 rounded-2xl bg-gray-50/30 dark:bg-zinc-900/10">
//           <p className="text-sm font-semibold text-gray-500">No documents found matching criteria.</p>
//         </div>
//       ) : (
//         <>
//           {/* File grid */}
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
//             {files.map((file) => (
//               <div
//                 key={file.id}
//                 className="flex items-center justify-between p-4 border border-zinc-200 dark:border-zinc-800/80 rounded-2xl hover:border-zinc-300 dark:hover:border-zinc-700 bg-white dark:bg-zinc-900 shadow-sm transition-all group"
//               >
//                 <div className="flex items-center gap-3.5 min-w-0">
//                   <div className="w-12 h-12 rounded-xl bg-gray-50 dark:bg-zinc-950 border border-gray-150 dark:border-zinc-850 shrink-0 flex items-center justify-center">
//                     {getFileIcon(file.fileType)}
//                   </div>
//                   <div className="min-w-0">
//                     <h3 className="font-bold text-sm text-gray-900 dark:text-white truncate pr-1 group-hover:text-blue-600 transition-colors" title={file.title}>
//                       {file.title}
//                     </h3>
//                     <div className="flex items-center gap-2 mt-1 text-[11px] text-gray-400 font-semibold font-sans">
//                       <span className="uppercase text-blue-600 dark:text-blue-400 bg-blue-500/10 px-1.5 py-0.5 rounded-md text-[9px] font-extrabold tracking-wider">
//                         {file.fileType}
//                       </span>
//                       <span>•</span>
//                       <span>{file.fileSize}</span>
//                     </div>
//                   </div>
//                 </div>

//                 <a
//                   href={file.fileUrl}
//                   download
//                   target="_blank"
//                   rel="noopener noreferrer"
//                   className="p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:bg-blue-600 dark:hover:bg-blue-600 hover:border-blue-600 dark:hover:border-blue-600 text-zinc-550 hover:text-white dark:text-zinc-400 dark:hover:text-white transition-all shadow-sm flex items-center justify-center shrink-0"
//                   title="Download File"
//                 >
//                   <Download className="w-4 h-4" />
//                 </a>
//               </div>
//             ))}
//           </div>

//           {/* Sentinel loading trigger */}
//           <div ref={sentinelRef} className="py-8 flex justify-center items-center">
//             {isFetchingNextPage ? (
//               <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
//             ) : hasNextPage ? (
//               <span className="text-xs text-gray-400 font-medium">Scroll down to load more...</span>
//             ) : (
//               <span className="text-xs text-gray-400 font-medium">You have viewed all files.</span>
//             )}
//           </div>
//         </>
//       )}
//     </div>
//   );
// }



"use client";

import React, { useState, useEffect, useRef } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import {
  FileText,
  Download,
  ExternalLink,
  Search,
  X,
  Inbox,
  Loader2,
  FileArchive,
  BookOpen,
  HelpCircle,
  FileImage,
  Video
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Tag {
  id: string;
  name: string;
  slug: string;
}

interface FileItem {
  id: string;
  title: string;
  fileUrl: string;
  fileSize: string;
  fileType: string;
  createdAt: string;
}

interface FilesMaterialsViewProps {
  categoryTag: any;
}

export default function FilesMaterialsView({ categoryTag }: FilesMaterialsViewProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const LIMIT = 12;

  // Debounce search query
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 450);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  // TanStack Query Infinite Query
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useInfiniteQuery({
    queryKey: ["files", debouncedSearch],
    queryFn: async ({ pageParam = 1 }) => {
      const queryStr = debouncedSearch ? `&q=${encodeURIComponent(debouncedSearch)}` : "";
      const res = await fetch(`/api/files?page=${pageParam}&limit=${LIMIT}${queryStr}`);
      if (!res.ok) throw new Error("Failed to load files");
      return res.json();
    },
    getNextPageParam: (lastPage, allPages) => {
      const totalLoaded = allPages.length * LIMIT;
      return totalLoaded < lastPage.totalCount ? allPages.length + 1 : undefined;
    },
    initialPageParam: 1,
    refetchInterval: 4000, // Poll every 4 seconds for real-time updates
  });

  // Flatten results
  const files = data ? data.pages.flatMap((page) => page.files || []) : [];
  const totalCount = data?.pages[0]?.totalCount || 0;

  // Scroll detection using IntersectionObserver
  useEffect(() => {
    if (!hasNextPage || isFetchingNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 }
    );

    const currentRef = loadMoreRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const getFileIcon = (fileType: string) => {
    const type = fileType.toLowerCase();
    if (type === "pdf") {
      return <FileText className="w-10 h-10 text-red-500" />;
    }
    if (["zip", "rar", "tar", "gz", "7z"].includes(type)) {
      return <FileArchive className="w-10 h-10 text-amber-500" />;
    }
    if (["doc", "docx", "txt", "rtf", "odt"].includes(type)) {
      return <BookOpen className="w-10 h-10 text-blue-500" />;
    }
    if (["jpg", "jpeg", "png", "gif", "webp", "svg"].includes(type)) {
      return <FileImage className="w-10 h-10 text-emerald-500" />;
    }
    if (["mp4", "mkv", "avi", "mov"].includes(type)) {
      return <Video className="w-10 h-10 text-purple-500" />;
    }
    return <HelpCircle className="w-10 h-10 text-zinc-500" />;
  };

  return (
    <div className="w-full space-y-8 py-6 max-w-[1440px] mx-auto px-4 sm:px-6">

      {/* Top Header Section */}
      <div className="border-b border-zinc-200 dark:border-zinc-800 pb-4">
        <h1 className="text-3xl font-black text-zinc-900 dark:text-white tracking-tight">
          Files & Study Materials
        </h1>
        <p className="text-sm text-zinc-550 mt-1 font-medium">
          Download PDF notes, guides, textbooks, syllabus materials, and helper resources.
        </p>
      </div>

      {/* Filter and Search Controls */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-zinc-50 dark:bg-zinc-900/40 p-4 border border-zinc-150 dark:border-zinc-850 rounded-2xl">
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <input
            type="text"
            placeholder="Search files by title or file type..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-855 bg-white dark:bg-zinc-950 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none text-sm text-zinc-800 dark:text-zinc-100 placeholder-zinc-450 transition-all shadow-sm"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-zinc-400 hover:text-zinc-650 dark:hover:text-zinc-200"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
        <div className="text-xs font-bold text-zinc-400 uppercase tracking-wider shrink-0 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 px-3.5 py-2 rounded-xl">
          {totalCount} Active Resources
        </div>
      </div>

      {/* File Listings Grid */}
      {isLoading ? (
        <div className="py-32 flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-9 h-9 animate-spin text-blue-500" />
          <p className="text-sm font-semibold text-zinc-500 dark:text-zinc-450 animate-pulse">
            Loading materials catalog...
          </p>
        </div>
      ) : files.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-16 border border-dashed border-zinc-200 dark:border-zinc-850 rounded-3xl bg-zinc-50/20 dark:bg-zinc-900/10 text-center">
          <div className="w-16 h-16 rounded-full bg-zinc-100 dark:bg-zinc-800 grid place-items-center mb-4 text-zinc-400">
            <Inbox className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-1">
            No Materials Available
          </h3>
          <p className="text-sm text-zinc-550 dark:text-zinc-450 max-w-sm">
            We couldn't find any resources matching your criteria. Check back soon for new guides!
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {files.map((file) => (
              <div
                key={file.id}
                className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-855 p-5 rounded-2xl shadow-sm hover:shadow-md hover:border-zinc-300 dark:hover:border-zinc-700/80 transition-all duration-200 flex flex-col justify-between gap-5 h-full"
              >
                {/* File Details */}
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-150 dark:border-zinc-800 rounded-xl shrink-0">
                    {getFileIcon(file.fileType)}
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-extrabold text-sm sm:text-base text-zinc-950 dark:text-zinc-50 leading-snug line-clamp-2 group-hover:text-blue-600 transition-colors mb-2">
                      {file.title}
                    </h3>
                    <div className="flex flex-wrap items-center gap-1.5 pt-1">
                      <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-550 dark:text-zinc-400 border border-zinc-200/40 dark:border-zinc-800">
                        {file.fileType.toUpperCase()}
                      </span>
                      <span className="text-xs font-mono font-semibold text-zinc-400">
                        {file.fileSize}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions Footer */}
                <div className="grid grid-cols-2 gap-3 border-t border-zinc-100 dark:border-zinc-900 pt-4 mt-auto">
                  <a
                    href={file.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-1.5 px-3 py-2 border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-850 rounded-xl text-xs font-bold text-zinc-700 dark:text-zinc-350 transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    View File
                  </a>
                  <a
                    href={file.fileUrl}
                    download
                    className="flex items-center justify-center gap-1.5 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/10 hover:shadow-blue-500/20 transition-all active:scale-[0.98]"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Download
                  </a>
                </div>
              </div>
            ))}
          </div>

          {/* Load More bottom scroll anchor */}
          <div ref={loadMoreRef} className="w-full py-8 flex justify-center">
            {isFetchingNextPage && (
              <div className="flex items-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
                <span className="text-xs text-zinc-400 font-semibold">Loading more files...</span>
              </div>
            )}
            {!hasNextPage && files.length > 0 && (
              <span className="text-xs text-zinc-400 font-semibold bg-zinc-100 dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800 px-4 py-2 rounded-full">
                You've reached the end of the files list 🎉
              </span>
            )}
          </div>
        </>
      )}
    </div>
  );
}
