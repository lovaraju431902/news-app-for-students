"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search, X, Loader2, BookOpen } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface SuggestionItem {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  featuredImg: string | null;
  categorySlug: string;
  categoryName: string;
}

export default function SearchInput() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<SuggestionItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Debounced search suggestion fetch
  useEffect(() => {
    const trimmedQuery = query.trim();
    if (trimmedQuery.length < 2) {
      setSuggestions([]);
      setIsOpen(false);
      return;
    }

    setIsLoading(true);
    const delayDebounceFn = setTimeout(async () => {
      try {
        const response = await fetch(
          `/api/search?q=${encodeURIComponent(trimmedQuery)}&limit=5`
        );
        if (response.ok) {
          const data = await response.json();
          setSuggestions(data);
          setIsOpen(true);
          setActiveIndex(-1); // Reset keyboard navigation index
        }
      } catch (error) {
        console.error("Error fetching suggestions:", error);
      } finally {
        setIsLoading(false);
      }
    }, 300); // 300ms debounce requirement

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  // Click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Submit search page query
  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = query.trim();
    if (trimmed) {
      setIsOpen(false);
      inputRef.current?.blur();
      router.push(`/search?q=${encodeURIComponent(trimmed)}`);
    }
  };

  // Keyboard navigation within the dropdown
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen) {
      if (e.key === "ArrowDown" && query.trim().length >= 2) {
        setIsOpen(true);
      }
      return;
    }

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setActiveIndex((prevIndex) =>
          prevIndex < suggestions.length - 1 ? prevIndex + 1 : 0
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setActiveIndex((prevIndex) =>
          prevIndex > 0 ? prevIndex - 1 : suggestions.length - 1
        );
        break;
      case "Enter":
        e.preventDefault();
        if (activeIndex >= 0 && activeIndex < suggestions.length) {
          // Navigate to selected suggestion
          const selected = suggestions[activeIndex];
          setIsOpen(false);
          setQuery("");
          router.push(`/${selected.categorySlug}/${selected.slug}`);
        } else {
          // Standard form submit
          handleSearchSubmit();
        }
        break;
      case "Escape":
        e.preventDefault();
        setIsOpen(false);
        setActiveIndex(-1);
        inputRef.current?.blur();
        break;
    }
  };

  const handleClear = () => {
    setQuery("");
    setSuggestions([]);
    setIsOpen(false);
    inputRef.current?.focus();
  };

  return (
    <div ref={containerRef} className="relative w-full">
      <form onSubmit={handleSearchSubmit} className="relative w-full">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (suggestions.length > 0) setIsOpen(true);
          }}
          placeholder="Search for news, jobs, results, tech.."
          className="w-full h-10 pl-4 pr-16 rounded-full bg-white border border-gray-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/40 text-sm text-gray-900 transition-all placeholder:text-gray-400"
          aria-label="Search articles"
          autoComplete="off"
        />
        
        {/* Loader or Clear Button */}
        <div className="absolute right-11 top-1/2 -translate-y-1/2 flex items-center gap-1.5 z-10">
          {isLoading && (
            <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
          )}
          {!isLoading && query && (
            <button
              type="button"
              onClick={handleClear}
              className="p-1 rounded-full hover:bg-gray-150 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Search Submit Button */}
        <button
          type="submit"
          className="absolute right-1.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-primary hover:bg-primary/95 text-white flex items-center justify-center transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
        >
          <Search className="w-4 h-4" />
        </button>
      </form>

      {/* Suggestion Dropdown */}
      {isOpen && (
        <div className="absolute top-[calc(100%+8px)] left-0 right-0 z-50 bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="p-1 max-h-[380px] overflow-y-auto">
            {suggestions.length > 0 ? (
              suggestions.map((item, index) => (
                <Link
                  key={item.id}
                  href={`/${item.categorySlug}/${item.slug}`}
                  onClick={() => {
                    setIsOpen(false);
                    setQuery("");
                  }}
                  className={cn(
                    "flex items-center gap-3 p-2.5 rounded-lg text-left transition-colors duration-150",
                    index === activeIndex
                      ? "bg-gray-100 dark:bg-gray-800"
                      : "hover:bg-gray-50"
                  )}
                >
                  {/* Thumbnail */}
                  <div className="relative w-12 h-12 rounded-md overflow-hidden bg-gray-100 shrink-0 border border-gray-100">
                    {item.featuredImg ? (
                      <Image
                        src={item.featuredImg}
                        alt={item.title}
                        fill
                        className="object-cover"
                        sizes="48px"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-300">
                        <BookOpen className="w-5 h-5" />
                      </div>
                    )}
                  </div>

                  {/* Title & Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-[10px] font-bold text-red-600 bg-red-50 px-1.5 py-0.2 rounded uppercase tracking-wider">
                        {item.categoryName}
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-gray-900 leading-snug truncate">
                      {item.title}
                    </h4>
                    {item.excerpt && (
                      <p className="text-xs text-gray-400 line-clamp-1 mt-0.5">
                        {item.excerpt}
                      </p>
                    )}
                  </div>
                </Link>
              ))
            ) : (
              <div className="p-4 text-center text-sm text-gray-450">
                No matching articles found
              </div>
            )}
          </div>
          
          {/* Dropdown footer to navigate to full search results */}
          {suggestions.length > 0 && (
            <div className="bg-gray-50 p-2 border-t border-gray-150 text-center">
              <button
                type="button"
                onClick={() => handleSearchSubmit()}
                className="text-xs font-semibold text-primary hover:underline"
              >
                See all results for "{query.trim()}"
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
