"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
    Newspaper,
    Briefcase,
    Award,
    IdCard,
    GraduationCap,
    Zap,
    BookOpen,
    Lightbulb,
    Trophy,
    Building2,
    Film,
    CalendarDays,
    TestTube,
    Menu,
    LayoutDashboardIcon,
    ChevronLeft,
    ChevronRight,
    Clock,
    Calendar,
    FileText,
    Code,
} from "lucide-react";
import Categoryrow from "./nextsection";
import LatestNews from "./latestnews";
import RightRail from "./righttail";
import WebStoriesAndVideos from "./webstoriesandvideos";
import MostRead from "./mostread";
import { useQuery } from "@tanstack/react-query";





type Slide = {
    id: string;
    title: string;
    image: string;
    readTime: string;
    date: string;
    author: string;
    href: string;
    isActive: boolean;
    badge: {
        color: string;
        label: string;
    };
    createdAt?: Date;
    updatedAt?: Date;
};

type SlidesResponse = {
    data: Slide[];
};


type Card = {
    id: string;
    title: string;
    image: string;
    date: string;
    href: string;
    isActive: boolean;
    badge: {
        color: string;
        label: string;
    };
    createdAt?: Date;
    updatedAt?: Date;
};

type CardsResponse = {
    data: Card[];
};










// const rightCards = [
//     {
//         image: "https://images.unsplash.com/photo-1501504905252-473c47e087f8?q=80&w=600&auto=format&fit=crop",
//         badge: { label: "Results", color: "bg-emerald-600" },
//         title: "AP Inter Results 2024 Declared – Check Now",
//         date: "May 24, 2024"
//     },
//     {
//         image: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?q=80&w=600&auto=format&fit=crop",
//         badge: { label: "Tech News", color: "bg-[#7A22E8]" },
//         title: "Best Laptops for Students Under ₹50,000 in 2024",
//         date: "May 22, 2024"
//     }
// ];








export default function Sidebar() {






    const getSlides = async (): Promise<SlidesResponse> => {
        const response = await fetch("/api/slidedata");

        if (!response.ok) {
            throw new Error("Failed to fetch slides");
        }

        return response.json();
    };


    const getCards = async (): Promise<CardsResponse> => {
        const response = await fetch("/api/rightcard");

        if (!response.ok) {
            throw new Error("Failed to fetch Cards");
        }

        return response.json();
    };



    const {
        data,
        isLoading,
        error,
    } = useQuery({
        queryKey: ["slides"],
        queryFn: getSlides,
    });


    useEffect(() => {
        if (data) {

            console.log("1 st data", data.data)

        }
    }, [data?.data]);






    const {
        data: RightCarddata,
        isLoading: Loading,
        error: rightCarderror,
    } = useQuery({
        queryKey: ["cards"],
        queryFn: getCards,
    });


    useEffect(() => {
        if (RightCarddata) {

            console.log("1 st data", RightCarddata.data)

        }
    }, [RightCarddata?.data]);


    const rightCards = RightCarddata?.data || [];









    const slidesData = data?.data || [];

    const [currentSlide, setCurrentSlide] = useState(0);

    const nextSlide = () => {
        if (slidesData.length === 0) return;
        setCurrentSlide((prev) => (prev + 1) % slidesData.length);
    };

    const prevSlide = () => {
        if (slidesData.length === 0) return;
        setCurrentSlide((prev) => (prev - 1 + slidesData.length) % slidesData.length);
    };

    useEffect(() => {
        if (slidesData.length === 0) return;
        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slidesData.length);
        }, 3000);
        return () => clearInterval(interval);
    }, [slidesData.length]);





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


    const CarouselSkeleton = () => (
        <div className="flex flex-col lg:flex-row gap-4 w-full animate-pulse">
            {/* Carousel Skeleton */}
            <div className="lg:flex-[2] relative rounded-2xl overflow-hidden bg-zinc-200 dark:bg-zinc-800 h-[240px] sm:h-[320px] lg:h-[400px] flex flex-col justify-end p-6">
                <div className="h-4 w-24 bg-zinc-300 dark:bg-zinc-700 rounded mb-4" />
                <div className="h-6 w-3/4 bg-zinc-300 dark:bg-zinc-700 rounded mb-2" />
                <div className="h-6 w-1/2 bg-zinc-300 dark:bg-zinc-700 rounded mb-4" />
                <div className="flex gap-2">
                    <div className="h-3 w-16 bg-zinc-300 dark:bg-zinc-700 rounded" />
                    <div className="h-3 w-16 bg-zinc-300 dark:bg-zinc-700 rounded" />
                </div>
            </div>

            {/* Right Cards Skeleton */}
            <div className="lg:flex-[1] grid grid-cols-2 lg:grid-cols-1 gap-3 lg:h-[400px]">
                {[1, 2].map((i) => (
                    <div key={i} className="relative rounded-2xl overflow-hidden bg-zinc-200 dark:bg-zinc-850 h-[180px] lg:h-auto lg:flex-1 flex flex-col justify-end p-4">
                        <div className="h-3 w-16 bg-zinc-300 dark:bg-zinc-700 rounded mb-3" />
                        <div className="h-4 w-5/6 bg-zinc-300 dark:bg-zinc-700 rounded mb-2" />
                        <div className="h-3 w-24 bg-zinc-300 dark:bg-zinc-700 rounded" />
                    </div>
                ))}
            </div>
        </div>
    );





    return (
        <div className=" px-4 py-4">
            <div className="md:flex md:flex-row flex gap-3 items-start">

                {/* Left Column: Categories Sidebar */}
                <div className="w-[190px] md:block hidden">
                    <div className="bg-card  rounded-xl shadow-sm">
                        <div className="flex items-center gap-2 p-2 font-extrabold text-sm mb-3 text-gray-900 pb-2 border-b border-gray-100">
                            <LayoutDashboardIcon className="w-4 h-4 text-primary" />
                            <span>Categories</span>
                        </div>
                        <ul className="max-h-full  overflow-y-auto pr-1 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-gray-200 [&::-webkit-scrollbar-thumb]:rounded-full">
                            {cats.map((c) => (
                                <li key={c.label}>
                                    <Link
                                        href={c.href}
                                        className="flex py-1.5 items-center gap-2 px-2.5 rounded-lg hover:bg-muted text-sm font-semibold transition-colors"
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



                {/* Middle Column: Main Content */}
                <div className="flex-1 min-w-0 space-y-6">
                    {isLoading ? <CarouselSkeleton /> : (
                        <div className="flex flex-col lg:flex-row gap-4 w-full">
                            {/* Carousel */}
                            <div
                                id="default-carousel"
                                className="lg:flex-[2] cursor-pointer relative rounded-2xl overflow-hidden shadow-md group h-[240px] sm:h-[320px] lg:h-[400px] bg-black"
                            >
                                {/* Carousel wrapper */}
                                <div className="relative w-full h-full">
                                    {slidesData?.map((slide, index) => (
                                        <div
                                            key={index}
                                            className={`duration-700 ease-in-out transition-all absolute inset-0 ${index === currentSlide
                                                ? "opacity-100 z-10 scale-100"
                                                : "opacity-0 z-0 pointer-events-none scale-105"
                                                }`}
                                        >
                                            <Link
                                                href={slide.href}
                                                className="block cursor-pointer w-full h-full relative"
                                            >
                                                <img
                                                    src={slide.image}
                                                    className="absolute inset-0 w-full h-full object-cover"
                                                    alt={slide.title}
                                                />

                                                {/* Overlay */}
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-transparent z-10" />

                                                {/* Badges */}
                                                <div className="absolute top-4 left-4 z-20 flex gap-2 flex-wrap">
                                                    {slide.badge && (
                                                        <span
                                                            className={`px-3 py-1 rounded text-xs font-bold text-white tracking-wider ${slide.badge.color}`}
                                                        >
                                                            {slide.badge.label}
                                                        </span>
                                                    )}
                                                </div>

                                                {/* Content */}
                                                <div className="absolute bottom-4 left-4 right-4 z-20 text-white pr-[90px] sm:pr-[120px]">
                                                    <h2 className="text-lg sm:text-xl lg:text-2xl font-extrabold mb-2 leading-tight tracking-tight">
                                                        {slide.title}
                                                    </h2>

                                                    <div className="flex items-center gap-2 text-white/85 text-[11px] font-medium flex-wrap">
                                                        <span>{slide.date}</span>
                                                        <span>•</span>
                                                        <span>{slide.author}</span>
                                                    </div>
                                                </div>

                                                {/* Read Time */}
                                                <div className="absolute bottom-4 right-4 z-20 flex items-center gap-1 px-3 py-1 rounded-full bg-black/55 text-white text-[11px] font-semibold backdrop-blur-sm">
                                                    <Clock className="w-3.5 h-3.5" />
                                                    <span>{slide.readTime}</span>
                                                </div>
                                            </Link>
                                        </div>
                                    ))}
                                </div>

                                {/* Indicators */}
                                <div className="absolute cursor-pointer z-20 flex bottom-4 left-1/2 -translate-x-1/2 gap-2">
                                    {slidesData?.map((_, index) => (
                                        <button
                                            key={index}
                                            type="button"
                                            className={`h-2 rounded-full transition-all duration-300 ${index === currentSlide
                                                ? "bg-[#1047F8] w-5"
                                                : "bg-white/80 hover:bg-white w-2"
                                                }`}
                                            onClick={() => setCurrentSlide(index)}
                                        />
                                    ))}
                                </div>

                                {/* Prev */}
                                <button
                                    type="button"
                                    className="absolute cursor-pointer top-1/2 -translate-y-1/2 left-4 z-20 w-9 h-9 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center transition-colors"
                                    onClick={prevSlide}
                                >
                                    <ChevronLeft className="w-5 h-5" />
                                </button>

                                {/* Next */}
                                <button
                                    type="button"
                                    className="absolute cursor-pointer top-1/2 -translate-y-1/2 right-4 z-20 w-9 h-9 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center transition-colors"
                                    onClick={nextSlide}
                                >
                                    <ChevronRight className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Right Cards */}
                            <div className="lg:flex-[1] grid grid-cols-2 lg:grid-cols-1 gap-3 lg:h-[400px]">
                                {rightCards.map((card, index) => (
                                    <div
                                        key={index}
                                        className="relative rounded-2xl overflow-hidden shadow-md group cursor-pointer bg-black h-[180px] lg:h-auto lg:flex-1"
                                    >
                                        <Link href={card.href}>
                                            <img
                                                src={card.image}
                                                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                alt={card.title}
                                            />


                                            {/* Overlay */}
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-transparent z-10" />

                                            {/* Content */}
                                            <div className="absolute inset-0 p-4 flex flex-col justify-between z-20">
                                                <div>
                                                    <span
                                                        className={`px-2.5 py-1 rounded text-[10px] font-bold text-white tracking-wider ${card.badge.color}`}
                                                    >
                                                        {card.badge.label}
                                                    </span>
                                                </div>

                                                <div>
                                                    <h3 className="text-white font-extrabold text-xs sm:text-sm lg:text-base leading-snug pr-2">
                                                        {card.title}
                                                    </h3>

                                                    <div className="flex items-center gap-1.5 text-white/70 text-[10px] sm:text-[11px] mt-2 font-medium">
                                                        <Calendar className="w-3.5 h-3.5" />
                                                        <span>{card.date}</span>
                                                    </div>
                                                </div>
                                            </div>

                                        </Link>
                                    </div>
                                ))}
                            </div>
                        </div>

                    )}

                    {/* Quick Categoryrow */}
                    <div>
                        <Categoryrow />
                    </div>

                    {/* LatestNews */}
                    <div>
                        <LatestNews />
                    </div>

                    {/* Web Stories & Videos */}
                    <div>
                        <WebStoriesAndVideos />
                    </div>

                    {/* Most Read Section */}
                    {/* <div>
                        <MostRead />
                    </div> */}


                </div>


                {/* Right Column: Sidebar */}
                <div className="w-full lg:w-[350px] shrink-0">
                    <RightRail />
                </div>

            </div>



        </div>
    );
}