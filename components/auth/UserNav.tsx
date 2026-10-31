"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useSession, signOut } from "@/lib/auth-client";
import { User, LogOut, CreditCard, Sparkles, ChevronDown, Shield, Bookmark } from "lucide-react";

export function UserNav() {
  const { data: session, isPending } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (isPending) {
    return (
      <div className="h-10 w-20 rounded-lg bg-gray-100 dark:bg-zinc-800 animate-pulse" />
    );
  }

  if (!session?.user) {
    return (
      <Link
        href="/login"
        className="h-10 sm:h-11 px-4 rounded-lg border border-gray-300 dark:border-zinc-700 hover:bg-gray-100 dark:hover:bg-zinc-800 text-gray-800 dark:text-zinc-200 font-semibold text-xs sm:text-sm flex items-center gap-1.5 transition cursor-pointer"
      >
        <User className="w-4 h-4 text-gray-500" />
        <span>Sign In</span>
      </Link>
    );
  }

  const user = session.user;
  const initial = (user.name || user.email || "U")[0].toUpperCase();

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        onClick={() => setMenuOpen(!menuOpen)}
        className="flex items-center gap-2 h-10 sm:h-11 px-2.5 rounded-lg border border-gray-200 dark:border-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-850 transition cursor-pointer"
        aria-expanded={menuOpen}
      >
        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
          {initial}
        </div>
        <span className="hidden sm:inline text-xs font-bold text-gray-800 dark:text-zinc-200 max-w-[100px] truncate">
          {user.name || user.email.split("@")[0]}
        </span>
        <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
      </button>

      {menuOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-zinc-900 rounded-xl shadow-2xl border border-gray-200 dark:border-zinc-800 py-1.5 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
          {/* User info header */}
          <div className="px-4 py-2.5 border-b border-gray-100 dark:border-zinc-800">
            <p className="text-xs font-bold text-gray-900 dark:text-white truncate">
              {user.name || "Member"}
            </p>
            <p className="text-[11px] text-gray-500 dark:text-zinc-400 truncate mt-0.5">
              {user.email}
            </p>
          </div>

          {/* Links */}
          <div className="py-1">
            <Link
              href="/account"
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-gray-700 dark:text-zinc-200 hover:bg-gray-100 dark:hover:bg-zinc-800 transition"
            >
              <CreditCard className="w-4 h-4 text-blue-600" />
              <span>Account & Subscription</span>
            </Link>

            <Link
              href="/saved"
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-gray-700 dark:text-zinc-200 hover:bg-gray-100 dark:hover:bg-zinc-800 transition"
            >
              <Bookmark className="w-4 h-4 text-blue-600" />
              <span>Saved Articles</span>
            </Link>

            <Link
              href="/pricing"
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-gray-700 dark:text-zinc-200 hover:bg-gray-100 dark:hover:bg-zinc-800 transition"
            >
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Premium Plan (₹399/mo)</span>
            </Link>
          </div>

          {/* Logout */}
          <div className="border-t border-gray-100 dark:border-zinc-800 pt-1">
            <button
              type="button"
              onClick={async () => {
                setMenuOpen(false);
                await signOut();
                window.location.href = "/";
              }}
              className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 transition cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
