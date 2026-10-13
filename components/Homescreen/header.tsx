"use client";

import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { Bell, Mail } from "lucide-react";
import SearchInput from "./SearchInput";

export default function Header() {
    const { data: settings } = useQuery({
        queryKey: ["site-settings"],
        queryFn: async () => {
            const res = await fetch("/api/settings");
            if (!res.ok) throw new Error("Failed to load settings");
            return res.json();
        },
        staleTime: 1000 * 60 * 5,
    });

    const siteName = settings?.general?.siteName || "Students Hub";
    const siteTagline = settings?.general?.siteTagline || "News • Jobs • Tech • Education";
    const logoSrc = settings?.general?.siteLogo || "/logo.png";

    const nameParts = siteName.trim().split(/\s+/);
    const firstPart = nameParts.length > 1 ? nameParts.slice(0, -1).join(" ") : nameParts[0];
    const lastPart = nameParts.length > 1 ? nameParts[nameParts.length - 1] : "";

    return (
        <header className="bg-card border-b border-gray-200">
            <div className="max-w-[1440px] mx-auto px-4 py-3 flex flex-col md:flex-row md:justify-around gap-4 md:gap-6">
                <div className="w-full md:w-auto flex items-center justify-between">
                    <a href="/" className="flex items-center gap-2.5 shrink-0">
                        <Image
                            src={logoSrc}
                            alt={siteName}
                            width={44}
                            height={44}
                            className="w-11 h-11 rounded-xl object-contain shadow-xs shrink-0"
                            unoptimized
                        />
                        <div className="leading-tight flex flex-col justify-center">
                            <div className="text-[24px] sm:text-[26px] font-black tracking-tight text-slate-950 flex items-center gap-1.5 leading-none">
                                <span>{firstPart}</span>
                                {lastPart && (
                                    <span className="text-white bg-[#FF2E3B] px-2 py-0.5 rounded-[8px] text-[20px] sm:text-[22px] font-black inline-flex items-center justify-center">
                                        {lastPart}
                                    </span>
                                )}
                            </div>
                            <div className="text-[11px] sm:text-[12px] text-slate-500 font-bold tracking-wide mt-1">
                                {siteTagline}
                            </div>
                        </div>
                    </a>

                    {/* Actions for Mobile */}
                    <div className="flex md:hidden items-center gap-2 shrink-0">
                        <button className="relative w-9 h-9 grid place-items-center rounded-full bg-muted">
                            <Bell className="w-4 h-4" />
                        </button>
                        <button className="h-9 px-3 rounded-lg text-white font-semibold text-xs flex items-center gap-1 bg-blue-600 shadow-md">
                            <Mail className="w-3.5 h-3.5" /> Subscribe
                        </button>
                    </div>
                </div>

                {/* Search Bar */}
                <div className="relative w-full md:flex-1 md:max-w-xl">
                    <SearchInput />
                </div>

                {/* Actions for Desktop */}
                <div className="hidden md:flex gap-3 shrink-0">
                    <button className="relative w-11 h-11 grid place-items-center rounded-full bg-muted">
                        <Bell className="w-5 h-5" />
                        <span className="absolute -top-1 -right-1 w-5 h-5 grid place-items-center rounded-full bg-accent-red text-white text-[10px] font-bold">3</span>
                    </button>
                    <button className="h-11 px-5 rounded-lg text-white font-semibold text-sm flex items-center gap-2 bg-blue-600 shadow-md">
                        <Mail className="w-4 h-4" /> Subscribe
                    </button>
                </div>
            </div>
        </header>
    );
}