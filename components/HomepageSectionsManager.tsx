"use client";

import React, { useState } from "react";
import LatestNewsForm from "@/components/adminforms/latestnews";
import RightCardForm from "@/components/adminforms/rightcard";
import SlideForm from "@/components/adminforms/slide";
import TechnologyNewsForm from "@/components/adminforms/technologynews";
import TrendingnewsForm from "@/components/adminforms/trendingnow";
import WebStoryForm from "@/components/adminforms/webstories";
import VideoForm from "@/components/adminforms/videos";
import MostReadForm from "@/components/adminforms/mostread";
import VideoGalleryForm from "@/components/adminforms/videogallery";
import YouMayLikeForm from "@/components/adminforms/youmaylike";
import {
  SlidersHorizontal,
  LayoutGrid,
  Layers,
  Sparkles,
  Newspaper,
  Cpu,
  TrendingUp,
  Film,
  Eye,
  Video,
  ThumbsUp
} from "lucide-react";

export default function HomepageSectionsManager() {
  const [activeTab, setActiveTab] = useState("slidedata");

  const tabs = [
    { id: "slidedata", label: "Slide Data", icon: Layers, desc: "Hero carousel slides" },
    { id: "rightcards", label: "Right Cards", icon: LayoutGrid, desc: "Featured cards on top right" },
    { id: "latestnews", label: "Latest News", icon: Newspaper, desc: "Latest headlines and breaking news" },
    { id: "trendingnews", label: "Trending News", icon: TrendingUp, desc: "Trending stories and updates" },
    { id: "technologynews", label: "Technology News", icon: Cpu, desc: "Tech breakthroughs and articles" },
    { id: "webstories", label: "Web Stories", icon: Sparkles, desc: "Visual mobile stories & snippets" },
    { id: "videos", label: "Videos", icon: Film, desc: "Featured video stream & player" },
    { id: "videogallery", label: "Video Gallery", icon: Video, desc: "Video gallery grid & shorts" },
    { id: "mostread", label: "Most Read", icon: Eye, desc: "High engagement stories" },
    { id: "youmaylike", label: "You May Like", icon: ThumbsUp, desc: "Sponsored recommendations & ads" },
  ];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm">
        <div>
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <SlidersHorizontal className="w-5 h-5 text-blue-600" />
            Homepage Dynamic Content Manager
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure, reorder, and update homepage daily sections, carousels, grids, and sponsored cards.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold bg-blue-50 text-blue-700 px-3 py-1.5 rounded-xl border border-blue-100">
            {tabs.length} Configurable Sections
          </span>
        </div>
      </div>

      {/* Navigation Pills */}
      <div className="flex flex-wrap gap-2 bg-white p-3 rounded-2xl border border-slate-200/90 shadow-sm">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                isActive
                  ? "bg-blue-600 text-white shadow-sm shadow-blue-500/20"
                  : "bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200/60"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Form Container */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 sm:p-8 max-w-4xl">
        <div className="mb-6 pb-4 border-b border-slate-100">
          <h4 className="text-sm font-bold text-slate-900">
            {tabs.find((t) => t.id === activeTab)?.label}
          </h4>
          <p className="text-xs text-slate-400 mt-0.5">
            {tabs.find((t) => t.id === activeTab)?.desc}
          </p>
        </div>

        {activeTab === "slidedata" && <SlideForm />}
        {activeTab === "rightcards" && <RightCardForm />}
        {activeTab === "latestnews" && <LatestNewsForm />}
        {activeTab === "trendingnews" && <TrendingnewsForm />}
        {activeTab === "technologynews" && <TechnologyNewsForm />}
        {activeTab === "webstories" && <WebStoryForm />}
        {activeTab === "videos" && <VideoForm />}
        {activeTab === "videogallery" && <VideoGalleryForm />}
        {activeTab === "mostread" && <MostReadForm />}
        {activeTab === "youmaylike" && <YouMayLikeForm />}
      </div>
    </div>
  );
}
