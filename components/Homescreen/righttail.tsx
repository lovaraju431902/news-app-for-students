"use client";

import { useQuery } from "@tanstack/react-query";
import {
    BookOpen,
    CalendarDays,
    ChevronRight,
    FileText,
    Flame,
    Mail,
    Send,
    TrendingUp
} from "lucide-react";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";



type Trendingnews = {
    id: string;
    title: string;
    image: string;
    date: string;
    href: string;
    isActive: boolean;
    createdAt?: Date;
    updatedAt?: Date;
};

type TrendingNewsResponse = {
    data: Trendingnews[];
};


type MaterialItem = {
    id: string;
    title: string;
    fileUrl: string;
    fileSize: string;
    fileType: string;
    createdAt?: Date | string;
};






type TechnologyNews = {
    id: string;
    title: string;
    image: string;
    href: string;
    isActive: boolean;
    createdAt?: Date;
    updatedAt?: Date;
};

type TechnologyNewsResponse = {
    data: TechnologyNews[];
};





































// const healthNewsData = [
//     {
//         id: 1,
//         image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?q=80&w=200&auto=format&fit=crop",
//         title: "గుండె ఆరోగ్యానికి బ్లాక్ కాఫీ మంచిదేనా?",
//     },
//     {
//         id: 2,
//         image: "https://images.unsplash.com/photo-1606041008023-472dfb5e530f?q=80&w=200&auto=format&fit=crop",
//         title: "చెవులకు ఏది సేఫ్?",
//     },
//     {
//         id: 3,
//         image: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?q=80&w=200&auto=format&fit=crop",
//         title: "రోజుకు ఒకటి...",
//     },
//     {
//         id: 4,
//         image: "https://images.unsplash.com/photo-1518495973542-4542c06a5843?q=80&w=200&auto=format&fit=crop",
//         title: "భయం వేసినప్పుడు చేతులు ఎందుకు వణుకుతాయి?",
//     },
//     {
//         id: 5,
//         image: "https://images.unsplash.com/photo-1505576399279-565b52d4ac71?q=80&w=200&auto=format&fit=crop",
//         title: "గ్యాస్, ఉబ్బరానికి.. ఈ అలవాట్లు కూడా కారణమే!",
//     },
//     {
//         id: 6,
//         image: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=200&auto=format&fit=crop",
//         title: "ఫిట్నెస్ కోసం భోజనం మానేస్తున్నారా? జాగ్రత్త..",
//     },
//     {
//         id: 7,
//         image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=200&auto=format&fit=crop",
//         title: "షుగర్ వల్ల జుట్టు రాలుతుందా?",
//     },
//     {
//         id: 8,
//         image: "https://images.unsplash.com/photo-1485965120184-e220f721d03e?q=80&w=200&auto=format&fit=crop",
//         title: "ప్రపంచ సైకిల్ దినోత్సవం 2026..",
const cats = [
    {
        label: "Part Time Income",
        href: "/part-time-income",
        color: "bg-emerald-100 text-emerald-600",
    },
    {
        label: "Share Market",
        href: "/share-market",
        color: "bg-blue-100 text-blue-600",
    },
    {
        label: "AI Prompts",
        href: "/ai-prompts",
        color: "bg-indigo-100 text-indigo-600",
    },
    {
        label: "Carrer Jobs",
        href: "/carrer-jobs",
        color: "bg-violet-100 text-violet-600",
    },
    {
        label: "Youtube Growth",
        href: "/youtube-growth",
        color: "bg-red-100 text-red-600",
    },
    {
        label: "Instagram",
        href: "/instagram",
        color: "bg-pink-100 text-pink-600",
    },
    {
        label: "Mobile Hacks",
        href: "/mobile-hacks",
        color: "bg-cyan-100 text-cyan-600",
    },
    {
        label: "AI Tools",
        href: "/ai-tools",
        color: "bg-purple-100 text-purple-600",
    },
    {
        label: "Marketing",
        href: "/marketing",
        color: "bg-amber-100 text-amber-600",
    },
    {
        label: "Startup Ideas",
        href: "/startup-ideas",
        color: "bg-orange-100 text-orange-600",
    },
    {
        label: "Technology",
        href: "/technology",
        color: "bg-teal-100 text-teal-600",
    },
    {
        label: "Apps & Websites",
        href: "/apps-websites",
        color: "bg-sky-100 text-sky-600",
    },
    {
        label: "Facebook",
        href: "/facebook",
        color: "bg-blue-100 text-blue-600",
    },
    {
        label: "Editing",
        href: "/editing",
        color: "bg-rose-100 text-rose-600",
    },
    {
        label: "Govt Jobs Updates",
        href: "/govt-jobs-updates",
        color: "bg-yellow-100 text-yellow-600",
    },
    {
        label: "Files & Materials",
        href: "/files-materials",
        color: "bg-zinc-100 text-zinc-600",
    },
    {
        label: "Internships",
        href: "/internships",
        color: "bg-lime-100 text-lime-600",
    },
    {
        label: "Scholarships",
        href: "/scholarships",
        color: "bg-fuchsia-100 text-fuchsia-600",
    },
    {
        label: "Current Affairs",
        href: "/current-affairs",
        color: "bg-amber-100 text-amber-600",
    },
];

export default function RightRail() {


    const getTrendingNews = async (): Promise<TrendingNewsResponse> => {
        const response = await fetch("/api/trendingnews");

        if (!response.ok) {
            throw new Error("Failed to fetch trendingnews");
        }

        return response.json();
    };



    const {
        data: data1,
        isLoading: loading,
        error: error1,
    } = useQuery({
        queryKey: ["trendingnews"],
        queryFn: getTrendingNews,
    });


    useEffect(() => {
        if (data1) {

            // console.log("1 st data", data1.data)

        }
    }, [data1?.data]);


    const trendingData = data1?.data || [];








    const getStudyMaterial = async () => {
        try {
            const response = await fetch("/api/files?limit=5");
            if (!response.ok) return [];
            const data = await response.json();
            return data.files || [];
        } catch {
            return [];
        }
    };

    const {
        data: studyFilesData,
        isLoading: loadingStudyFiles,
    } = useQuery({
        queryKey: ["homepage-study-files"],
        queryFn: getStudyMaterial,
    });

    const pdfs = studyFilesData || [];

    const [randomCategories, setRandomCategories] = useState(cats.slice(0, 8));

    useEffect(() => {
        const shuffled = [...cats].sort(() => 0.5 - Math.random());
        setRandomCategories(shuffled.slice(0, 8));
    }, []);





    const getTechnologyNews = async (): Promise<TechnologyNewsResponse> => {
        const response = await fetch("/api/technologynews");

        if (!response.ok) {
            throw new Error("Failed to fetch technologyNews");
        }

        return response.json();
    };



    const {
        data: data4,
        isLoading: loading4,
        error: error4,
    } = useQuery({
        queryKey: ["technologynews"],
        queryFn: getTechnologyNews,
    });


    useEffect(() => {
        if (data4) {

            // console.log("1 st data", data4.data)

        }
    }, [data4?.data]);


    const technologynewsdata = data4?.data || [];







































    if (loading || error1) {
        return (
            <>
                <div className="space-y-5 pl-2 animate-pulse">
                    {/* Trending Skeleton */}
                    <div className="bg-card hidden md:block w-[280px] border border-border rounded-xl overflow-hidden p-3">
                        <div className="h-4 w-32 bg-zinc-200 dark:bg-zinc-800 rounded mb-4" />
                        <div className="space-y-4">
                            {[1, 2, 3, 4, 5].map((i) => (
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

                    {/* Study Material Skeleton */}
                    <div className="bg-card border border-border rounded-xl overflow-hidden p-3">
                        <div className="h-4 w-32 bg-zinc-200 dark:bg-zinc-850 rounded mb-4" />
                        <div className="space-y-2">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="h-8 bg-zinc-200 dark:bg-zinc-850 rounded" />
                            ))}
                        </div>
                    </div>

                    {/* Popular Topics Skeleton */}
                    <div className="bg-card border border-border rounded-xl p-4">
                        <div className="h-4 w-32 bg-zinc-200 dark:bg-zinc-800 rounded mb-3" />
                        <div className="flex flex-wrap gap-2">
                            {[1, 2, 3, 4, 5].map((i) => (
                                <div key={i} className="h-7 w-16 bg-zinc-200 dark:bg-zinc-850 rounded" />
                            ))}
                        </div>
                    </div>

                    {/* Health News Skeleton */}
                    <div className="bg-card border border-border rounded-xl p-4">
                        <div className="h-4 w-28 bg-zinc-200 dark:bg-zinc-800 rounded mb-4" />
                        <div className="space-y-3.5">
                            {[1, 2, 3, 4, 5].map((i) => (
                                <div key={i} className="flex gap-3 items-start">
                                    <div className="w-20 h-14 bg-zinc-200 dark:bg-zinc-800 rounded-lg shrink-0" />
                                    <div className="flex-1 space-y-1.5 mt-1">
                                        <div className="h-3 w-5/6 bg-zinc-200 dark:bg-zinc-800 rounded" />
                                        <div className="h-3 w-2/3 bg-zinc-200 dark:bg-zinc-800 rounded" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>



            </>
        )
    }















    // const trendingData = [
    //     {

    //         title: "RRB NTPC 2024 Notification Out – Apply Online",
    //         date: "May 25, 2024",
    //         image: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?q=80&w=200&auto=format&fit=crop",
    //         badgeColor: "bg-red-600"
    //     },
    //     {

    //         title: "AP Inter Results 2024 Declared – Check Now",
    //         date: "May 24, 2024",
    //         image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=200&auto=format&fit=crop",
    //         badgeColor: "bg-orange-500"
    //     },
    //     {

    //         title: "Top 10 Websites to Earn Money as a Student",
    //         date: "May 23, 2024",
    //         image: "https://images.unsplash.com/photo-1580894732444-8fecef2271ff?q=80&w=200&auto=format&fit=crop",
    //         badgeColor: "bg-emerald-600"
    //     },
    //     {

    //         title: "TS TET 2024 Notification Released",
    //         date: "May 21, 2024",
    //         image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=200&auto=format&fit=crop",
    //         badgeColor: "bg-blue-600"
    //     },
    //     {

    //         title: "Best Time Table for SSC CGL Preparation",
    //         date: "May 20, 2024",
    //         image: "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?q=80&w=200&auto=format&fit=crop",
    //         badgeColor: "bg-violet-600"
    //     }
    // ];




    return (
        <div className="space-y-5 pl-2">
            {/* Health News Section */}


            {/* Trending Now */}
            <div className="bg-card hidden md:block  border border-border rounded-xl overflow-hidden">
                <div className="px-4 py-3 border-b border-border flex justify-between ">
                    <h3 className="font-bold flex items-center gap-2"><Flame className="w-4 h-4 text-accent-red" /> Trending Now</h3>
                    <a className="text-xs font-semibold text-primary flex items-center">View All <ChevronRight className="w-3 h-3" /></a>
                </div>
                <div className="p-3 space-y-4">
                    {trendingData.map((item) => (
                        <div key={item.id} className="flex gap-3 items-center group cursor-pointer">

                            <Image
                                src={item.image}
                                width={48}
                                height={48}
                                className="rounded-lg object-cover shadow-sm group-hover:scale-102 transition-transform duration-300 shrink-0"
                                //  style={{ height: "auto" }}
                                alt={item.title}
                            />
                            <div className="flex-1 min-w-0">
                                <h4 className="text-xs font-bold text-gray-950 leading-snug line-clamp-2 group-hover:text-blue-600 transition-colors">
                                    {item.title}
                                </h4>
                                <span className="text-[10px] text-gray-400 font-medium block mt-1">
                                    {item.date}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>



            {/* Study Material (5 Recent Study Files from Repository) */}
            <div className="bg-card mt-4 border border-border rounded-xl overflow-hidden shadow-2xs">
                <div className="px-4 py-3 bg-emerald-50 dark:bg-emerald-950/40 border-b border-border flex items-center justify-between">
                    <h3 className="font-bold flex items-center gap-2 text-emerald-800 dark:text-emerald-300 text-sm">
                        <BookOpen className="w-4 h-4 text-emerald-600" /> Study Material
                    </h3>
                    <Link
                        href="/files-materials"
                        className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 flex items-center gap-0.5 transition-colors"
                    >
                        <span>View All</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                </div>
                <ul className="p-3 space-y-2">
                    {pdfs.length > 0 ? (
                        pdfs.slice(0, 5).map((p: any) => (
                            <li key={p.id}>
                                <a
                                    href={p.fileUrl || "/files-materials"}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors group cursor-pointer"
                                >
                                    <div className="w-8 h-8 rounded-lg bg-red-50 dark:bg-red-950/40 flex items-center justify-center shrink-0 border border-red-100 dark:border-red-900/30">
                                        <FileText className="w-4 h-4 text-red-600 dark:text-red-400" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <span className="text-xs font-semibold text-slate-800 dark:text-zinc-200 group-hover:text-emerald-600 transition-colors line-clamp-1 block">
                                            {p.title}
                                        </span>
                                        <span className="text-[10px] text-slate-400 font-medium block mt-0.5">
                                            {p.fileSize || "Free Download"}
                                        </span>
                                    </div>
                                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 shrink-0 uppercase">
                                        {p.fileType || "PDF"}
                                    </span>
                                </a>
                            </li>
                        ))
                    ) : (
                        <li className="text-xs text-slate-400 py-3 text-center">No study files uploaded yet.</li>
                    )}
                    <Link
                        href="/files-materials"
                        className="w-full mt-2 bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 rounded-lg text-xs font-bold text-center block transition-colors shadow-2xs"
                    >
                        View All Study Files & PDFs
                    </Link>
                </ul>
            </div>

            {/* Get Daily Updates */}
            <div className="bg-card border border-border rounded-xl p-4">
                <h3 className="font-bold flex items-center gap-2"><Mail className="w-4 h-4 text-blue-600" /> Get Daily Updates</h3>
                <p className="text-xs text-muted-foreground mt-1">Join 50,000+ students & get important updates to your inbox.</p>
                <div className="mt-3 flex gap-2">
                    <input placeholder="Enter your email" className="flex-1 h-9 px-3 rounded-md bg-muted border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" />
                    <button className="px-3 h-9 rounded-md bg-blue-600 text-white text-sm font-semibold flex items-center gap-1">
                        <Send className="w-3.5 h-3.5" /> Subscribe
                    </button>
                </div>
            </div>

            {/* Popular Topics (8 Random Categories from 19 Categories) */}
            <div className="bg-card border border-border rounded-xl p-4 shadow-2xs">
                <div className="flex items-center justify-between gap-2 mb-3">
                    <h3 className="font-bold flex items-center gap-2 text-sm text-gray-900 dark:text-gray-100">
                        <TrendingUp className="w-4 h-4 text-orange-500" /> Popular Topics
                    </h3>
                    <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">
                        Categories
                    </span>
                </div>
                <div className="flex flex-wrap gap-2">
                    {randomCategories.map((cat, idx) => (
                        <Link
                            key={idx}
                            href={cat.href}
                            className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-all transform hover:-translate-y-0.5 hover:shadow-xs inline-flex items-center ${cat.color}`}
                        >
                            {cat.label}
                        </Link>
                    ))}
                </div>
            </div>


            <div className="bg-card border border-border rounded-xl p-4">
                <div className="flex items-center justify-between gap-2 mb-4">
                    <h3 className="font-extrabold text-base text-gray-900 whitespace-nowrap">Technology news</h3>
                    <div className="h-[1px] bg-gray-200/65 flex-grow"></div>
                    <a className="text-[11px] font-bold text-[#b91c1c] border border-red-700/20 rounded-full px-3.5 py-1 hover:bg-red-50 transition-colors whitespace-nowrap cursor-pointer">
                        మరిన్ని చదవండి
                    </a>
                </div>

                <div className="space-y-3.5">
                    {technologynewsdata.map((item) => (
                        <div key={item.id} className="flex gap-3 items-start group cursor-pointer">
                            <div className="relative w-20 h-14 rounded-lg overflow-hidden shrink-0 bg-gray-50 border border-gray-100 shadow-sm">
                                <Image
                                    src={item.image}
                                    fill
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    sizes="80px"
                                    alt={item.title}
                                />
                            </div>
                            <h4 className="text-xs sm:text-sm font-bold text-gray-950 leading-snug group-hover:text-[#b91c1c] transition-colors line-clamp-2">
                                {item.title}
                            </h4>
                        </div>
                    ))}
                </div>
            </div>

        </div>
    );
}
