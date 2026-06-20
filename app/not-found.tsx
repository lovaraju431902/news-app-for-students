"use client";

import Link from "next/link";
import {
  Home,
  Search,
  ArrowLeft,
  Briefcase,
  GraduationCap,
  Trophy,
  Newspaper,
  BookOpen,
  HelpCircle,
  ChevronRight,
  Icon,
  Rocket,
  Wallet,
  TrendingUp
} from "lucide-react";
import Topbar from "@/components/Homescreen/topbar";
import Header from "@/components/Homescreen/header";
import Navbar from "@/components/Homescreen/Navbar";
import CategoriesSidebar from "@/components/Homescreen/CategoriesSidebar";
import Footer from "@/components/Homescreen/footer";
import SearchInput from "@/components/Homescreen/SearchInput";

export default function NotFound() {
  const quickLinks = [
    {
      title: "Part Time Income",
      description: "Latest updates on part-time jobs and remote opportunities",
      icon: Wallet,
      href: "/part-time-income",
      color: "bg-amber-50 text-amber-600 border-amber-100 hover:bg-amber-100/50",
      iconBg: "bg-amber-100"
    },
    {
      title: "Share Market",
      description: "Updates on share market and stock market",
      icon: TrendingUp,
      href: "/share-market",
      color: "bg-blue-50 text-blue-600 border-blue-100 hover:bg-blue-100/50",
      iconBg: "bg-blue-100"
    },
    {
      title: "StartUp Ideas",
      description: "Best StartUp ideas and business models",
      icon: Rocket,
      href: "/startup-ideas",
      color: "bg-emerald-50 text-emerald-600 border-emerald-100 hover:bg-emerald-100/50",
      iconBg: "bg-emerald-100"
    },
    {
      title: "Scholarships",
      description: "Find financial aid, fellowships, and grants",
      icon: GraduationCap,
      href: "/scholarships",
      color: "bg-fuchsia-50 text-fuchsia-600 border-fuchsia-100 hover:bg-fuchsia-100/50",
      iconBg: "bg-fuchsia-100"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans select-none">
      {/* Layout Shell */}
      <Topbar />
      <Header />
      <Navbar />

      {/* Main Layout Container */}
      <div className="max-w-[1440px] flex flex-col lg:flex-row gap-6 w-full flex-grow items-start">
        {/* Left Categories Sidebar (Desktop only) */}
        <CategoriesSidebar />

        {/* Center / Main Column: Premium Dribbble-like 404 visual card */}
        <div className="flex-grow flex-1 py-4 w-full min-w-0">
          <div className="relative overflow-hidden   p-6 sm:p-10 md:p-16 flex flex-col items-center text-center">

            {/* Background blur decorative blobs */}
            <div className="absolute -top-12 -left-12 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-16 -right-16 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-tr from-blue-500/2 to-indigo-500/2 rounded-full blur-3xl pointer-events-none" />

            {/* Glowing/floating animated custom SVG Graphic */}
            <div className="relative w-full max-w-sm h-56 flex items-center justify-center mb-8 select-none">

              {/* Radial gradient background aura */}
              <div className="absolute w-44 h-44 rounded-full bg-blue-600/10 blur-xl animate-pulse" />

              <svg
                viewBox="0 0 400 240"
                className="w-full h-full max-w-[340px] drop-shadow-[0_10px_20px_rgba(0,71,252,0.06)]"
                xmlns="http://www.w3.org/2000/svg"
              >
                <style>
                  {`
                    @keyframes float-slow {
                      0%, 100% { transform: translateY(0px) rotate(0deg); }
                      50% { transform: translateY(-10px) rotate(2deg); }
                    }
                    @keyframes float-fast {
                      0%, 100% { transform: translateY(0px) rotate(0deg); }
                      50% { transform: translateY(-14px) rotate(-3deg); }
                    }
                    @keyframes float-medium {
                      0%, 100% { transform: translateY(0px); }
                      50% { transform: translateY(-8px); }
                    }
                    @keyframes pulse-subtle {
                      0%, 100% { opacity: 0.8; transform: scale(1); }
                      50% { opacity: 1; transform: scale(1.03); }
                    }
                    .float-cap { animation: float-slow 4s ease-in-out infinite; }
                    .float-book { animation: float-fast 5s ease-in-out infinite; }
                    .float-star { animation: float-medium 3s ease-in-out infinite; }
                    .glow-num { animation: pulse-subtle 4s ease-in-out infinite; }
                  `}
                </style>

                {/* Stars and sparks background */}
                <g className="float-star">
                  <path d="M70,80 L72,85 L77,87 L72,89 L70,94 L68,89 L63,87 L68,85 Z" fill="#FFC107" opacity="0.8" />
                  <path d="M330,60 L331.5,64 L336,65.5 L331.5,67 L330,71 L328.5,67 L324,65.5 L328.5,64 Z" fill="#4CAF50" opacity="0.7" />
                  <circle cx="110" cy="50" r="3" fill="#0047FC" opacity="0.5" />
                  <circle cx="280" cy="180" r="4.5" fill="#E91E63" opacity="0.6" />
                </g>

                {/* Big Glassmorphic "404" */}
                <g className="glow-num">
                  {/* Outer glow shadows */}
                  <text x="200" y="145" textAnchor="middle" fontSize="110" fontWeight="900" fill="url(#blue-grad)" letterSpacing="-3" filter="url(#glow)">404</text>
                  {/* Sharp inner text */}
                  <text x="200" y="145" textAnchor="middle" fontSize="110" fontWeight="900" fill="url(#blue-grad)" letterSpacing="-3">404</text>
                </g>

                {/* Floating Graduation Cap */}
                <g className="float-cap" transform="translate(75, 45)">
                  {/* Cap shadow */}
                  <ellipse cx="45" cy="50" rx="30" ry="8" fill="#000" opacity="0.1" />
                  {/* Diamond Top */}
                  <path d="M45,20 L80,32 L45,44 L10,32 Z" fill="#1E293B" />
                  {/* Diamond Top Highlight */}
                  <path d="M45,22 L74,32 L45,42 L16,32 Z" fill="#2D3748" />
                  {/* Under Cap / Skull Cap */}
                  <path d="M26,33.5 L26,45 C26,50 34,53 45,53 C56,53 64,50 64,45 L64,33.5" fill="#0F172A" />
                  <path d="M28,34 L28,42 C28,45 35,48 45,48 C55,48 62,45 62,42 L62,34" fill="#1E293B" />
                  {/* Tassel */}
                  <path d="M45,32 L20,38 L16,50" fill="none" stroke="#FFC107" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  <rect x="13.5" y="50" width="5" height="8" rx="1.5" fill="#FFB300" />
                </g>

                {/* Floating Open Book */}
                <g className="float-book" transform="translate(255, 110)">
                  {/* Shadow */}
                  <ellipse cx="35" cy="52" rx="25" ry="6" fill="#000" opacity="0.08" />
                  {/* Cover */}
                  <path d="M10,38 Q35,46 60,38 L60,18 Q35,26 10,18 Z" fill="#0047FC" />
                  {/* Pages Left */}
                  <path d="M13,17 Q35,24 35,24 L35,44 Q35,44 13,37 Z" fill="#F8FAFC" />
                  {/* Pages Right */}
                  <path d="M35,24 Q35,24 57,17 L57,37 Q35,44 35,44 Z" fill="#FFFFFF" />
                  {/* Page Lines */}
                  <line x1="17" y1="23" x2="30" y2="27" stroke="#CBD5E1" strokeWidth="1.5" strokeLinecap="round" />
                  <line x1="17" y1="28" x2="30" y2="32" stroke="#CBD5E1" strokeWidth="1.5" strokeLinecap="round" />
                  <line x1="17" y1="33" x2="28" y2="37" stroke="#CBD5E1" strokeWidth="1.5" strokeLinecap="round" />
                  <line x1="40" y1="27" x2="53" y2="23" stroke="#CBD5E1" strokeWidth="1.5" strokeLinecap="round" />
                  <line x1="40" y1="32" x2="53" y2="28" stroke="#CBD5E1" strokeWidth="1.5" strokeLinecap="round" />
                  <line x1="40" y1="37" x2="51" y2="33" stroke="#CBD5E1" strokeWidth="1.5" strokeLinecap="round" />
                </g>

                {/* Gradients definitions */}
                <defs>
                  <linearGradient id="blue-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#0047FC" />
                    <stop offset="60%" stopColor="#2563EB" />
                    <stop offset="100%" stopColor="#6366F1" />
                  </linearGradient>
                  <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="6" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>
                </defs>
              </svg>
            </div>

            {/* Error Message */}
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight mb-3">
              Oops! Page not found
            </h1>
            <p className="text-sm sm:text-base text-gray-500 leading-relaxed max-w-md mb-8">
              The page you are looking for might have been removed, had its name changed, or is temporarily unavailable. Let's get you back on track!
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-3.5 mb-10 w-full justify-center">
              <Link
                href="/"
                className="w-full sm:w-auto h-11 px-6 rounded-lg text-white font-semibold text-sm flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 active:scale-[0.98] transition-all shadow-md hover:shadow-blue-500/10 cursor-pointer"
              >
                <Home className="w-4 h-4" /> Go back home
              </Link>
              <button
                onClick={() => window.history.back()}
                className="w-full sm:w-auto h-11 px-6 rounded-lg border border-gray-250 text-gray-700 hover:bg-gray-50 active:scale-[0.98] transition-all font-semibold text-sm flex items-center justify-center gap-2 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" /> Go back
              </button>
            </div>

            {/* Inline search box */}
            <div className="w-full max-w-md p-5 bg-gray-50 border border-gray-200/80 rounded-xl mb-12 flex flex-col gap-3">
              <div className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-wider">
                <Search className="w-3.5 h-3.5 text-blue-600" />
                <span>Search our database</span>
              </div>
              <div className="w-full">
                <SearchInput />
              </div>
            </div>

            {/* Quick links grid */}
            <div className="w-full text-left">
              <div className="flex items-center gap-2 pb-3 mb-5 border-b border-gray-100">
                <BookOpen className="w-4.5 h-4.5 text-blue-600" />
                <span className="text-sm font-extrabold text-gray-900 uppercase tracking-wider">Helpful Resources</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {quickLinks.map((item) => (
                  <Link
                    key={item.title}
                    href={item.href}
                    className={`flex items-start gap-4 p-4 rounded-xl border border-gray-200 bg-white hover:border-blue-300 transition-all duration-300 group cursor-pointer hover:shadow-sm`}
                  >
                    <div className={`w-10 h-10 rounded-lg ${item.iconBg} grid place-items-center shrink-0`}>
                      <item.icon className="w-5 h-5 text-gray-700 group-hover:text-blue-600 transition-colors" />
                    </div>
                    <div className="flex-1 min-w-0 pr-2">
                      <h3 className="text-sm font-bold text-gray-900 group-hover:text-blue-600 transition-colors flex items-center gap-1">
                        {item.title}
                        <ChevronRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all" />
                      </h3>
                      <p className="text-xs text-gray-400 mt-0.5 leading-normal">
                        {item.description}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
