"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
    Briefcase,
    GraduationCap,
    Trophy,
    Building2,
    CalendarDays,
    LayoutDashboardIcon,
    ChevronLeft,
    ChevronRight,
    Clock,
    Calendar,
    FileText,
    Wallet,
    TrendingUp,
    Smartphone,
    Bot,
    Megaphone,
    Rocket,
    Cpu,
    Globe,
    Scissors,
    Bell,
} from "lucide-react";
import Categoryrow from "./nextsection";
import LatestNews from "./latestnews";
import RightRail from "./righttail";
import WebStoriesAndVideos from "./webstoriesandvideos";
import MostRead from "./mostread";
// import { useQuery } from "@tanstack/react-query";

const FacebookIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 666.667 666.667" {...props}>
        <defs>
            <clipPath id="a" clipPathUnits="userSpaceOnUse">
                <path d="M0 700h700V0H0Z" />
            </clipPath>
        </defs>
        <g clipPath="url(#a)" transform="matrix(1.33333 0 0 -1.33333 -133.333 800)">
            <path d="M0 0c0 138.071-111.929 250-250 250S-500 138.071-500 0c0-117.245 80.715-215.622 189.606-242.638v166.242h-51.552V0h51.552v32.919c0 85.092 38.508 124.532 122.048 124.532 15.838 0 43.167-3.105 54.347-6.211V81.986c-5.901.621-16.149.932-28.882.932-40.993 0-56.832-15.528-56.832-55.9V0h81.659l-14.028-76.396h-67.631v-171.773C-95.927-233.218 0-127.818 0 0" fill="#0866ff" fillOpacity={1} fillRule="nonzero" stroke="none" transform="translate(600 350)" />
            <path d="m0 0 14.029 76.396H-67.63v27.019c0 40.372 15.838 55.899 56.831 55.899 12.733 0 22.981-.31 28.882-.931v69.253c-11.18 3.106-38.509 6.212-54.347 6.212-83.539 0-122.048-39.441-122.048-124.533V76.396h-51.552V0h51.552v-166.242a250.559 250.559 0 0 1 60.394-7.362c10.254 0 20.358.632 30.288 1.831V0Z" fill="#fff" fillOpacity={1} fillRule="nonzero" stroke="none" transform="translate(447.918 273.604)" />
        </g>
    </svg>
);

const YoutubeIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid" viewBox="0 0 256 180" {...props}>
        <path fill="red" d="M250.346 28.075A32.18 32.18 0 0 0 227.69 5.418C207.824 0 127.87 0 127.87 0S47.912.164 28.046 5.582A32.18 32.18 0 0 0 5.39 28.24c-6.009 35.298-8.34 89.084.165 122.97a32.18 32.18 0 0 0 22.656 22.657c19.866 5.418 99.822 5.418 99.822 5.418s79.955 0 99.82-5.418a32.18 32.18 0 0 0 22.657-22.657c6.338-35.348 8.291-89.1-.164-123.134Z" />
        <path fill="#FFF" d="m102.421 128.06 66.328-38.418-66.328-38.418z" />
    </svg>
);

const InstagramIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 264.583 264.583" {...props}>
        <defs>
            <radialGradient cx="158.429" cy="578.088" r="52.352" fx="158.429" fy="578.088" gradientTransform="matrix(0 -4.03418 4.28018 0 -2332.227 942.236)" gradientUnits="userSpaceOnUse" id="f" xlinkHref="#a" />
            <radialGradient cx="172.615" cy="600.692" r="65" fx="172.615" fy="600.692" gradientTransform="matrix(.67441 -1.16203 1.51283 .87801 -814.366 -47.835)" gradientUnits="userSpaceOnUse" id="g" xlinkHref="#b" />
            <radialGradient cx="144.012" cy="51.337" r="67.081" fx="144.012" fy="51.337" gradientTransform="matrix(-2.3989 .67549 -.23008 -.81732 464.996 -26.404)" gradientUnits="userSpaceOnUse" id="h" xlinkHref="#c" />
            <radialGradient cx="199.788" cy="628.438" r="52.352" fx="199.788" fy="628.438" gradientTransform="matrix(-3.10797 .87652 -.6315 -2.23914 1345.65 1374.198)" gradientUnits="userSpaceOnUse" id="e" xlinkHref="#d" />
            <linearGradient id="d"><stop offset="0" stopColor="#ff005f" /><stop offset="1" stopColor="#fc01d8" /></linearGradient>
            <linearGradient id="c"><stop offset="0" stopColor="#780cff" /><stop offset="1" stopColor="#820bff" stopOpacity="0" /></linearGradient>
            <linearGradient id="b"><stop offset="0" stopColor="#fc0" /><stop offset="1" stopColor="#fc0" stopOpacity="0" /></linearGradient>
            <linearGradient id="a"><stop offset="0" stopColor="#fc0" /><stop offset=".124" stopColor="#fc0" /><stop offset=".567" stopColor="#fe4a05" /><stop offset=".694" stopColor="#ff0f3f" /><stop offset="1" stopColor="#fe0657" stopOpacity="0" /></linearGradient>
        </defs>
        <path fill="url(#e)" d="M204.15 18.143c-55.23 0-71.383.057-74.523.317-11.334.943-18.387 2.728-26.07 6.554-5.922 2.942-10.592 6.351-15.201 11.13-8.394 8.716-13.481 19.439-15.323 32.184-.895 6.188-1.156 7.45-1.209 39.056-.02 10.536 0 24.4 0 42.999 0 55.2.062 71.341.326 74.476.916 11.032 2.645 17.973 6.308 25.565 7 14.533 20.37 25.443 36.12 29.514 5.453 1.404 11.476 2.178 19.208 2.544 3.277.142 36.669.244 70.081.244 33.413 0 66.826-.04 70.02-.203 8.954-.422 14.153-1.12 19.901-2.606 15.852-4.09 28.977-14.838 36.12-29.575 3.591-7.409 5.412-14.614 6.236-25.07.18-2.28.255-38.626.255-74.924 0-36.304-.082-72.583-.26-74.863-.835-10.625-2.656-17.77-6.364-25.32-3.042-6.182-6.42-10.799-11.324-15.519-8.752-8.361-19.455-13.45-32.21-15.29-6.18-.894-7.41-1.158-39.033-1.213z" transform="translate(-71.816 -18.143)" />
        <path fill="url(#f)" d="M204.15 18.143c-55.23 0-71.383.057-74.523.317-11.334.943-18.387 2.728-26.07 6.554-5.922 2.942-10.592 6.351-15.201 11.13-8.394 8.716-13.481 19.439-15.323 32.184-.895 6.188-1.156 7.45-1.209 39.056-.02 10.536 0 24.4 0 42.999 0 55.2.062 71.341.326 74.476.916 11.032 2.645 17.973 6.308 25.565 7 14.533 20.37 25.443 36.12 29.514 5.453 1.404 11.476 2.178 19.208 2.544 3.277.142 36.669.244 70.081.244 33.413 0 66.826-.04 70.02-.203 8.954-.422 14.153-1.12 19.901-2.606 15.852-4.09 28.977-14.838 36.12-29.575 3.591-7.409 5.412-14.614 6.236-25.07.18-2.28.255-38.626.255-74.924 0-36.304-.082-72.583-.26-74.863-.835-10.625-2.656-17.77-6.364-25.32-3.042-6.182-6.42-10.799-11.324-15.519-8.752-8.361-19.455-13.45-32.21-15.29-6.18-.894-7.41-1.158-39.033-1.213z" transform="translate(-71.816 -18.143)" />
        <path fill="url(#g)" d="M204.15 18.143c-55.23 0-71.383.057-74.523.317-11.334.943-18.387 2.728-26.07 6.554-5.922 2.942-10.592 6.351-15.201 11.13-8.394 8.716-13.481 19.439-15.323 32.184-.895 6.188-1.156 7.45-1.209 39.056-.02 10.536 0 24.4 0 42.999 0 55.2.062 71.341.326 74.476.916 11.032 2.645 17.973 6.308 25.565 7 14.533 20.37 25.443 36.12 29.514 5.453 1.404 11.476 2.178 19.208 2.544 3.277.142 36.669.244 70.081.244 33.413 0 66.826-.04 70.02-.203 8.954-.422 14.153-1.12 19.901-2.606 15.852-4.09 28.977-14.838 36.12-29.575 3.591-7.409 5.412-14.614 6.236-25.07.18-2.28.255-38.626.255-74.924 0-36.304-.082-72.583-.26-74.863-.835-10.625-2.656-17.77-6.364-25.32-3.042-6.182-6.42-10.799-11.324-15.519-8.752-8.361-19.455-13.45-32.21-15.29-6.18-.894-7.41-1.158-39.033-1.213z" transform="translate(-71.816 -18.143)" />
        <path fill="url(#h)" d="M204.15 18.143c-55.23 0-71.383.057-74.523.317-11.334.943-18.387 2.728-26.07 6.554-5.922 2.942-10.592 6.351-15.201 11.13-8.394 8.716-13.481 19.439-15.323 32.184-.895 6.188-1.156 7.45-1.209 39.056-.02 10.536 0 24.4 0 42.999 0 55.2.062 71.341.326 74.476.916 11.032 2.645 17.973 6.308 25.565 7 14.533 20.37 25.443 36.12 29.514 5.453 1.404 11.476 2.178 19.208 2.544 3.277.142 36.669.244 70.081.244 33.413 0 66.826-.04 70.02-.203 8.954-.422 14.153-1.12 19.901-2.606 15.852-4.09 28.977-14.838 36.12-29.575 3.591-7.409 5.412-14.614 6.236-25.07.18-2.28.255-38.626.255-74.924 0-36.304-.082-72.583-.26-74.863-.835-10.625-2.656-17.77-6.364-25.32-3.042-6.182-6.42-10.799-11.324-15.519-8.752-8.361-19.455-13.45-32.21-15.29-6.18-.894-7.41-1.158-39.033-1.213z" transform="translate(-71.816 -18.143)" />
        <path fill="#fff" d="M132.345 33.973c-26.716 0-30.07.117-40.563.594-10.472.48-17.62 2.136-23.876 4.567-6.47 2.51-11.958 5.87-17.426 11.335-5.472 5.464-8.834 10.948-11.354 17.412-2.44 6.252-4.1 13.397-4.57 23.858-.47 10.486-.593 13.838-.593 40.535 0 26.697.119 30.037.594 40.522.482 10.465 2.14 17.609 4.57 23.859 2.515 6.465 5.876 11.95 11.346 17.414 5.466 5.468 10.955 8.834 17.42 11.345 6.26 2.431 13.41 4.088 23.881 4.567 10.493.477 13.844.594 40.559.594 26.719 0 30.061-.117 40.555-.594 10.472-.48 17.63-2.136 23.888-4.567 6.468-2.51 11.948-5.877 17.414-11.345 5.472-5.464 8.834-10.949 11.354-17.412 2.419-6.252 4.079-13.398 4.57-23.858.472-10.486.595-13.828.595-40.525s-.123-30.047-.594-40.533c-.492-10.465-2.152-17.608-4.57-23.858-2.521-6.466-5.883-11.95-11.355-17.414-5.472-5.468-10.944-8.827-17.42-11.335-6.271-2.431-13.424-4.088-23.897-4.567-10.493-.477-13.834-.594-40.558-.594zm-8.825 17.715c2.62-.004 5.542 0 8.825 0 26.266 0 29.38.094 39.752.565 9.591.438 14.797 2.04 18.264 3.385 4.591 1.782 7.864 3.912 11.305 7.352 3.443 3.44 5.575 6.717 7.362 11.305 1.346 3.46 2.951 8.663 3.388 18.247.47 10.363.573 13.475.573 39.71 0 26.233-.102 29.346-.573 39.709-.44 9.584-2.042 14.786-3.388 18.247-1.783 4.587-3.919 7.854-7.362 11.292-3.443 3.441-6.712 5.57-11.305 7.352-3.463 1.352-8.673 2.95-18.264 3.388-10.37.47-13.486.573-39.752.573-26.268 0-29.38-.102-39.751-.573-9.592-.443-14.797-2.044-18.267-3.39-4.59-1.781-7.87-3.911-11.313-7.352-3.443-3.44-5.574-6.709-7.362-11.298-1.346-3.461-2.95-8.663-3.387-18.247-.472-10.363-.566-13.476-.566-39.726s.094-29.347.566-39.71c.438-9.584 2.04-14.786 3.387-18.25 1.783-4.588 3.919-7.865 7.362-11.305 3.443-3.441 6.722-5.57 11.313-7.357 3.468-1.351 8.675-2.949 18.267-3.389 9.075-.41 12.592-.532 30.926-.553zm61.337 16.322c-6.518 0-11.805 5.277-11.805 11.792 0 6.512 5.287 11.796 11.805 11.796 6.517 0 11.804-5.284 11.804-11.796 0-6.513-5.287-11.796-11.805-11.796zm-52.512 13.782c-27.9 0-50.519 22.603-50.519 50.482 0 27.879 22.62 50.471 50.52 50.471s50.51-22.592 50.51-50.471c0-27.879-22.613-50.482-50.513-50.482zm0 17.715c18.11 0 32.792 14.67 32.792 32.767 0 18.096-14.683 32.767-32.792 32.767-18.11 0-32.791-14.671-32.791-32.767 0-18.098 14.68-32.767 32.791-32.767z" />
    </svg>
);

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
            icon: Wallet,
            label: "Part Time Income",
            href: "/part-time-income",
            color: "bg-emerald-100 text-emerald-600",
        },
        {
            icon: TrendingUp,
            label: "Share Market",
            href: "/share-market",
            color: "bg-blue-100 text-blue-600",
        },
        {
            icon: Building2,
            label: "Business",
            href: "/business",
            color: "bg-indigo-100 text-indigo-600",
        },
        {
            icon: Briefcase,
            label: "Carrer Jobs",
            href: "/carrer-jobs",
            color: "bg-violet-100 text-violet-600",
        },
        {
            icon: YoutubeIcon,
            label: "Youtube Growth",
            href: "/youtube-growth",
            color: "bg-red-100 text-red-600",
        },
        {
            icon: InstagramIcon,
            label: "Instagram",
            href: "/instagram",
            color: "bg-pink-100 text-pink-600",
        },
        {
            icon: Smartphone,
            label: "Mobile Hacks",
            href: "/mobile-hacks",
            color: "bg-cyan-100 text-cyan-600",
        },
        {
            icon: Bot,
            label: "AI Tools",
            href: "/ai-tools",
            color: "bg-purple-100 text-purple-600",
        },
        {
            icon: Megaphone,
            label: "Marketing",
            href: "/marketing",
            color: "bg-amber-100 text-amber-600",
        },
        {
            icon: Rocket,
            label: "Startup Ideas",
            href: "/startup-ideas",
            color: "bg-orange-100 text-orange-600",
        },
        {
            icon: Cpu,
            label: "Technology",
            href: "/technology",
            color: "bg-teal-100 text-teal-600",
        },
        {
            icon: Globe,
            label: "Apps & Websites",
            href: "/apps-websites",
            color: "bg-sky-100 text-sky-600",
        },
        {
            icon: FacebookIcon,
            label: "Facebook",
            href: "/facebook",
            color: "bg-blue-100 text-blue-600",
        },
        {
            icon: Scissors,
            label: "Editing",
            href: "/editing",
            color: "bg-rose-100 text-rose-600",
        },
        {
            icon: Bell,
            label: "Govt Jobs Updates",
            href: "/govt-jobs-updates",
            color: "bg-yellow-100 text-yellow-600",
        },
        {
            icon: FileText,
            label: "Files & Materials",
            href: "/files-materials",
            color: "bg-zinc-100 text-zinc-600",
        },
        {
            icon: Trophy,
            label: "Internships",
            href: "/internships",
            color: "bg-lime-100 text-lime-600",
        },
        {
            icon: GraduationCap,
            label: "Scholarships",
            href: "/scholarships",
            color: "bg-fuchsia-100 text-fuchsia-600",
        },
        {
            icon: CalendarDays,
            label: "Current Affairs",
            href: "/current-affairs",
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
            <div className="flex flex-col lg:flex-row gap-3 items-start">

                {/* Left + Middle Column Wrapper */}
                <div className="flex-grow flex-1 flex flex-col md:flex-row gap-3 w-full min-w-0">
                    {/* Left Column: Categories Sidebar */}
                    <div className="w-[190px] md:block hidden shrink-0">
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
                    <div className="flex-grow flex-1 w-full min-w-0 space-y-6">
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
                                                    <Image
                                                        src={slide.image}
                                                        fill
                                                        className="object-cover"
                                                        alt={slide.title}
                                                        priority={index === 0}
                                                        sizes="(max-width: 1024px) 100vw, 800px"
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
                                            <Link href={card.href} className="block w-full h-full relative">
                                                <Image
                                                    src={card.image}
                                                    fill
                                                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                                                    alt={card.title}
                                                    sizes="(max-width: 1024px) 50vw, 350px"
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

                    {/* Close Left + Middle Column Wrapper */}
                </div>


                {/* Right Column: Sidebar */}
                <div className="w-full lg:w-[350px] shrink-0">
                    <RightRail />
                </div>

            </div>



        </div>
    );
}