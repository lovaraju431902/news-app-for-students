"use client"

import { Award, BookOpen, Briefcase, Building2, CalendarDays, ChevronDown, Film, GraduationCap, Home, IdCard, LayoutDashboardIcon, Lightbulb, Menu, Newspaper, TestTube, Trophy, Zap } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Sheet, SheetContent, SheetDescription, SheetTitle } from "../ui/sheet";




export default function Navbar() {
    const items = ["Latest News", "Government Jobs", "Results", "Admit Cards", "Scholarships", "Tech News", "YouTube Tips", "Study Material", "Exam Prep", "More"];
    const [open, setOpen] = useState(false);

    const cats = [
        {
            icon: Newspaper,
            label: "Latest News",
            href: "/tags/latest-news",
            color: "bg-blue-100 text-blue-600",
        },
        {
            icon: Briefcase,
            label: "Govt Jobs",
            href: "/tags/govtjobs",
            color: "bg-green-100 text-green-600",
        },
        {
            icon: Award,
            label: "Results",
            href: "/tags/results",
            color: "bg-red-100 text-red-600",
        },
        {
            icon: IdCard,
            label: "Admit Cards",
            href: "/tags/admit-cards",
            color: "bg-purple-100 text-purple-600",
        },
        {
            icon: GraduationCap,
            label: "Scholarships",
            href: "/tags/scholarships",
            color: "bg-orange-100 text-orange-600",
        },
        {
            icon: Zap,
            label: "Tech News",
            href: "/tags/tech-news",
            color: "bg-cyan-100 text-cyan-600",
        },
        {
            icon: BookOpen,
            label: "Study Tips",
            href: "/tags/study-tips",
            color: "bg-pink-100 text-pink-600",
        },
        {
            icon: Lightbulb,
            label: "Exam Prep",
            href: "/tags/exam-prep",
            color: "bg-yellow-100 text-yellow-600",
        },
        {
            icon: TestTube,
            label: "YouTube Tips",
            href: "/tags/youtube-tips",
            color: "bg-rose-100 text-rose-600",
        },
        {
            icon: Building2,
            label: "College Updates",
            href: "/tags/college-updates",
            color: "bg-indigo-100 text-indigo-600",
        },
        {
            icon: Trophy,
            label: "Internships",
            href: "/tags/internships",
            color: "bg-emerald-100 text-emerald-600",
        },
        {
            icon: Film,
            label: "Entertainment",
            href: "/tags/entertainment",
            color: "bg-violet-100 text-violet-600",
        },
        {
            icon: CalendarDays,
            label: "Current Affairs",
            href: "/tags/current-affairs",
            color: "bg-amber-100 text-amber-600",
        },

    ];

    return (
        <div className="border-t border-border shadow-sm">
            <div className="max-w-[1440px] px-4  flex items-center overflow-hidden">
                <button className="h-10 w-10 grid place-items-center text-primary-foreground rounded-sm bg-[#0047FC] shrink-0">
                    <Home className="w-5 h-5 text-white " />
                </button>
                <nav className="flex items-center overflow-x-auto whitespace-nowrap scrollbar-none [&::-webkit-scrollbar]:hidden py-1 px-2">
                    {items.map((it) => (
                        <a key={it} className="h-12 hover:bg-blue-100 hover:rounded-xl px-4 flex items-center gap-1 text-sm font-bold text-black hover:text-primary cursor-pointer shrink-0">
                            {it} <ChevronDown className="w-3.5 h-3.5 opacity-60" />
                        </a>
                    ))}
                </nav>
                <button className="h-12  w-12  hidden md:block"><Menu className="w-5 h-5" /></button>

                <button onClick={() => { setOpen(!open) }} className="md:hidden  h-12 w-12 grid place-items-center shrink-0"><Menu className="w-5 h-5" /></button>


                <Sheet open={open} onOpenChange={setOpen}>
                    <SheetContent className="w-[190px]">
                        <SheetTitle className="sr-only">Categories</SheetTitle>
                        <SheetDescription className="sr-only">sdebgh</SheetDescription>
                        <div className=" w-[190px] ">
                            <div className="">
                                <div className="flex items-center gap-2 p-5 font-extrabold text-sm mb-3 text-gray-900 pb-2 border-b border-gray-100">
                                    <LayoutDashboardIcon className="w-4 h-4 text-primary" />
                                    <span>Categories</span>
                                </div>
                                <ul className="max-h-full  overflow-y-auto pr-1 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-gray-200 [&::-webkit-scrollbar-thumb]:rounded-full">
                                    {cats.map((c) => (
                                        <li key={c.label}>
                                            <Link
                                                href={c.href}
                                                className="flex py-1.5 items-center gap-3 px-4 rounded-lg hover:bg-muted text-sm font-semibold transition-colors"
                                            >
                                                <span className={`w-7 h-7 rounded-md grid place-items-center shrink-0 ${c.color}`}>
                                                    <c.icon className="w-4 h-4" />
                                                </span>
                                                <span className="text-gray-700 hover:text-black">{c.label}</span>
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                    </SheetContent>
                </Sheet>

            </div>
        </div>
    );
}