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





const slidesData = [
    {
        image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1200&auto=format&fit=crop",
        badges: [
            { label: "Breaking", color: "bg-red-600" },
            { label: "Top Story", color: "bg-blue-600" }
        ],
        title: "గ్రామీణ అభ్యర్థుల కోసం SSC CGL 2024 నోటిఫికేషన్ పూర్తి వివరాలు!",
        date: "May 25, 2024",
        author: "by Students Voice",
        readTime: "5 min read"

    },
    {
        image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=1200&auto=format&fit=crop",
        badges: [
            { label: "Latest Jobs", color: "bg-green-600" }
        ],
        title: "TS TET 2024 Notification Out: Online Applications, Exam Dates & Syllabus Details",
        date: "May 26, 2024",
        author: "by Students Voice",
        readTime: "4 min read"
    },
    {
        image: "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?q=80&w=1200&auto=format&fit=crop",
        badges: [
            { label: "Admit Cards", color: "bg-purple-600" }
        ],
        title: "UPSC Civil Services 2024 Admit Card Released: Download Direct Link",
        date: "May 27, 2024",
        author: "by Students Voice",
        readTime: "3 min read"
    },
    {
        image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=1200&auto=format&fit=crop",
        badges: [
            { label: "Scholarships", color: "bg-orange-500" }
        ],
        title: "National Scholarship Portal (NSP) 2024: Registration Open for Students",
        date: "May 28, 2024",
        author: "by Students Voice",
        readTime: "6 min read"
    },
    {
        image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1200&auto=format&fit=crop",
        badges: [
            { label: "Study Tips", color: "bg-pink-600" }
        ],
        title: "How to Crack Competitive Exams in First Attempt: Proven Strategies",
        date: "May 29, 2024",
        author: "by Students Voice",
        readTime: "8 min read"
    }
];

const rightCards = [
    {
        image: "https://images.unsplash.com/photo-1501504905252-473c47e087f8?q=80&w=600&auto=format&fit=crop",
        badge: { label: "Results", color: "bg-emerald-600" },
        title: "AP Inter Results 2024 Declared – Check Now",
        date: "May 24, 2024"
    },
    {
        image: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?q=80&w=600&auto=format&fit=crop",
        badge: { label: "Tech News", color: "bg-[#7A22E8]" },
        title: "Best Laptops for Students Under ₹50,000 in 2024",
        date: "May 22, 2024"
    }
];

const trendingData = [
    {
        rank: 1,
        title: "RRB NTPC 2024 Notification Out – Apply Online",
        date: "May 25, 2024",
        image: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?q=80&w=200&auto=format&fit=crop",
        badgeColor: "bg-red-600"
    },
    {
        rank: 2,
        title: "AP Inter Results 2024 Declared – Check Now",
        date: "May 24, 2024",
        image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=200&auto=format&fit=crop",
        badgeColor: "bg-orange-500"
    },
    {
        rank: 3,
        title: "Top 10 Websites to Earn Money as a Student",
        date: "May 23, 2024",
        image: "https://images.unsplash.com/photo-1580894732444-8fecef2271ff?q=80&w=200&auto=format&fit=crop",
        badgeColor: "bg-emerald-600"
    },
    {
        rank: 4,
        title: "TS TET 2024 Notification Released",
        date: "May 21, 2024",
        image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=200&auto=format&fit=crop",
        badgeColor: "bg-blue-600"
    },
    {
        rank: 5,
        title: "Best Time Table for SSC CGL Preparation",
        date: "May 20, 2024",
        image: "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?q=80&w=200&auto=format&fit=crop",
        badgeColor: "bg-violet-600"
    },
    {
        rank: 6,
        title: "TCS Off Campus Drive 2024 for Freshers",
        date: "May 19, 2024",
        image: "https://images.unsplash.com/photo-1521737711867-e3b904787a3a?q=80&w=200&auto=format&fit=crop",
        badgeColor: "bg-gray-500"
    },
    {
        rank: 7,
        title: "Google Free Certification Courses with Badges",
        date: "May 18, 2024",
        image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=200&auto=format&fit=crop",
        badgeColor: "bg-gray-500"
    },
    {
        rank: 8,
        title: "Wipro Elite National Talent Hunt Phase 2",
        date: "May 17, 2024",
        image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=200&auto=format&fit=crop",
        badgeColor: "bg-gray-500"
    },
    {
        rank: 9,
        title: "Top 5 High-Paying Internships in Tech for 2024",
        date: "May 16, 2024",
        image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=200&auto=format&fit=crop",
        badgeColor: "bg-gray-500"
    },
    {
        rank: 10,
        title: "Free Python Crash Course for Beginners",
        date: "May 15, 2024",
        image: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?q=80&w=200&auto=format&fit=crop",
        badgeColor: "bg-gray-500"
    }
];

export default function Sidebar() {
    const [currentSlide, setCurrentSlide] = useState(0);

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % slidesData.length);
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + slidesData.length) % slidesData.length);
    };

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slidesData.length);
        }, 3000);
        return () => clearInterval(interval);
    }, []);





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
        <div className=" px-4 py-4">
            <div className="md:flex md:flex-row flgap-3 items-start">

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


                    {/* Carousel + Stacked Cards Row */}
                    {/* <div className="flex flex-col w-full md:flex-row gap-2">
                     
                        <div id="default-carousel" className="md:flex-[2]  relative rounded-2xl overflow-hidden shadow-md group h-[240px] sm:h-[320px] md:h-[300px] bg-black">
                           
                            <div className="relative w-full h-full">
                                {slidesData.map((slide, index) => (
                                    <div
                                        key={index}
                                        className={`duration-700 ease-in-out transition-all absolute inset-0 ${index === currentSlide ? "opacity-100 z-10 scale-100" : "opacity-0 z-0 pointer-events-none scale-105"
                                            }`}
                                    >
                                        <img
                                            src={slide.image}
                                            className="absolute inset-0 w-full h-full object-cover"
                                            alt={slide.title}
                                        />
                                       
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-transparent z-10" />

                                     
                                        <div className="absolute top-4 left-4 z-20 flex gap-2">
                                            {slide.badges.map((badge, bIdx) => (
                                                <span
                                                    key={bIdx}
                                                    className={`px-3 py-1 rounded text-xs font-bold text-white tracking-wider ${badge.color}`}
                                                >
                                                    {badge.label}
                                                </span>
                                            ))}
                                        </div>

                                        <div className="absolute bottom-4 left-4 right-4 z-20 text-white pr-[120px]">
                                            <h2 className="text-white text-xl md:text-2xl font-extrabold mb-2.5 leading-tight tracking-tight drop-shadow-sm">
                                                {slide.title}
                                            </h2>
                                            <div className="flex items-center gap-2 text-white/85 text-[11px] font-medium">
                                                <span>{slide.date}</span>
                                                <span>•</span>
                                                <span>{slide.author}</span>
                                            </div>
                                        </div>

                                     
                                        <div className="absolute bottom-4 right-4 z-20 flex items-center gap-1 px-3 py-1 rounded-full bg-black/55 text-white text-[11px] font-semibold backdrop-blur-[2px]">
                                            <Clock className="w-3.5 h-3.5" />
                                            <span>{slide.readTime}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            
                            <div className="absolute z-20 flex bottom-4 left-1/2 -translate-x-1/2 gap-2">
                                {slidesData.map((_, index) => (
                                    <button
                                        key={index}
                                        type="button"
                                        className={`w-2 h-2 rounded-full transition-all duration-300 ${index === currentSlide ? "bg-[#1047F8] w-5" : "bg-white hover:bg-white/80"
                                            }`}
                                        aria-current={index === currentSlide ? "true" : "false"}
                                        aria-label={`Slide ${index + 1}`}
                                        onClick={() => setCurrentSlide(index)}
                                    />
                                ))}
                            </div>

                      
                            <button
                                type="button"
                                className="absolute top-1/2 -translate-y-1/2 left-4 z-20 w-9 h-9 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center cursor-pointer transition-colors shadow-lg"
                                onClick={prevSlide}
                            >
                                <ChevronLeft className="w-5 h-5" />
                                <span className="sr-only">Previous</span>
                            </button>
                            <button
                                type="button"
                                className="absolute top-1/2 -translate-y-1/2 right-4 z-20 w-9 h-9 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center cursor-pointer transition-colors shadow-lg"
                                onClick={nextSlide}
                            >
                                <ChevronRight className="w-5 h-5" />
                                <span className="sr-only">Next</span>
                            </button>
                        </div>

        
                        <div className="flex-[1] flex flex-col gap-3 h-auto xl:h-[300px]">
                            {rightCards.map((card, index) => (
                                <div
                                    key={index}
                                    className="relative rounded-2xl overflow-hidden shadow-md group cursor-pointer bg-black h-[180px] xl:h-auto xl:flex-1"
                                >
                                    <img
                                        src={card.image}
                                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        alt={card.title}
                                    />
                                  
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-transparent z-10" />

                                    
                                    <div className="absolute inset-0 p-4 flex flex-col justify-between z-20">
                                        <div>
                                            <span
                                                className={`px-2.5 py-1 rounded text-[10px] font-bold text-white tracking-wider ${card.badge.color}`}
                                            >
                                                {card.badge.label}
                                            </span>
                                        </div>
                                        <div>
                                            <h3 className="text-white font-extrabold text-sm md:text-base leading-snug group-hover:text-white/95 transition-colors pr-2">
                                                {card.title}
                                            </h3>
                                            <div className="flex items-center gap-1.5 text-white/70 text-[11px] mt-2 font-medium">
                                                <Calendar className="w-3.5 h-3.5" />
                                                <span>{card.date}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                    </div> */}




                    <div className="flex flex-col lg:flex-row gap-4 w-full">
                        {/* Carousel */}
                        <div
                            id="default-carousel"
                            className="lg:flex-[2] relative rounded-2xl overflow-hidden shadow-md group h-[240px] sm:h-[320px] lg:h-[400px] bg-black"
                        >
                            {/* Carousel wrapper */}
                            <div className="relative w-full h-full">
                                {slidesData.map((slide, index) => (
                                    <div
                                        key={index}
                                        className={`duration-700 ease-in-out transition-all absolute inset-0 ${index === currentSlide
                                            ? "opacity-100 z-10 scale-100"
                                            : "opacity-0 z-0 pointer-events-none scale-105"
                                            }`}
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
                                            {slide.badges.map((badge, bIdx) => (
                                                <span
                                                    key={bIdx}
                                                    className={`px-3 py-1 rounded text-xs font-bold text-white tracking-wider ${badge.color}`}
                                                >
                                                    {badge.label}
                                                </span>
                                            ))}
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
                                    </div>
                                ))}
                            </div>

                            {/* Indicators */}
                            <div className="absolute z-20 flex bottom-4 left-1/2 -translate-x-1/2 gap-2">
                                {slidesData.map((_, index) => (
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
                                className="absolute top-1/2 -translate-y-1/2 left-4 z-20 w-9 h-9 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center transition-colors"
                                onClick={prevSlide}
                            >
                                <ChevronLeft className="w-5 h-5" />
                            </button>

                            {/* Next */}
                            <button
                                type="button"
                                className="absolute top-1/2 -translate-y-1/2 right-4 z-20 w-9 h-9 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center transition-colors"
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
                                </div>
                            ))}
                        </div>
                    </div>

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