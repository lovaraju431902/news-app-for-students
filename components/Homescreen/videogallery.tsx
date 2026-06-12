"use client";
import React, { useEffect } from "react";
import { Play } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";

type Videogallerytype = {
  id: string;
  title: string;
  image: string;
  duration: string;
  category: string;
  href: string;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
};

type VideogalleryResponse = {
  data: Videogallerytype[];
};

export default function VideoGallery() {
  const getVideogallery = async (): Promise<VideogalleryResponse> => {
    const response = await fetch("/api/videogallery");

    if (!response.ok) {
      throw new Error("Failed to fetch videogallery");
    }

    return response.json();
  };

  const {
    data: Videogallerydata,
    isLoading: VideogalleryisLoading,
    error: VideogalleryError,
  } = useQuery({
    queryKey: ["videogallery"],
    queryFn: getVideogallery,
  });

  useEffect(() => {
    if (Videogallerydata) {
      console.log("video gallery data", Videogallerydata.data);
    }
  }, [Videogallerydata?.data]);

  const videos = Videogallerydata?.data || [];

  if (VideogalleryisLoading) {
    return (
      <section className="w-full px-4 sm:px-6 lg:px-8 py-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4 md:p-6 shadow-sm animate-pulse">
            {/* Heading Skeleton */}
            <div className="h-7 bg-gray-250 rounded-md w-40 mb-6"></div>

            {/* Top Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 lg:gap-6">
              {/* Featured Video Skeleton */}
              <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 p-4 shadow-sm flex flex-col md:flex-row gap-4">
                <div className="relative w-full md:w-[55%] aspect-video bg-gray-250 rounded-lg overflow-hidden shrink-0"></div>
                <div className="flex-1 space-y-3 py-1">
                  <div className="h-4 bg-gray-250 rounded w-1/4"></div>
                  <div className="space-y-2">
                    <div className="h-5 bg-gray-250 rounded w-full"></div>
                    <div className="h-5 bg-gray-250 rounded w-5/6"></div>
                    <div className="h-5 bg-gray-250 rounded w-2/3"></div>
                  </div>
                </div>
              </div>

              {/* Side Videos Skeleton */}
              <div className="flex flex-col gap-4">
                {[1, 2].map((i) => (
                  <div key={i} className="flex gap-3 bg-white p-3 rounded-xl border border-gray-100 shadow-sm">
                    <div className="relative w-28 sm:w-36 aspect-video bg-gray-250 rounded-lg shrink-0 overflow-hidden"></div>
                    <div className="flex-1 space-y-2 py-1">
                      <div className="h-3 bg-gray-250 rounded w-1/3"></div>
                      <div className="h-4 bg-gray-250 rounded w-full"></div>
                      <div className="h-4 bg-gray-250 rounded w-2/3"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Grid Skeleton */}
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 mt-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden p-3 space-y-3">
                  <div className="aspect-video bg-gray-250 rounded-lg overflow-hidden"></div>
                  <div className="space-y-2">
                    <div className="h-3 bg-gray-250 rounded w-1/3"></div>
                    <div className="h-4 bg-gray-250 rounded w-full"></div>
                    <div className="h-4 bg-gray-250 rounded w-5/6"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (videos.length === 0) {
    return null;
  }

  const featuredVideo = videos[0];
  const stackedVideos = videos.slice(1, 3);
  const gridVideos = videos.slice(3);

  return (
    <section className="w-full lg:pl-[180px] py-6">
      <div className="max-w-full mx-auto">
        <div className="rounded-2xl p-4 md:p-6 ">
          {/* Heading */}
          <h2 className="text-xl md:text-2xl font-extrabold text-gray-900 mb-6">
            Video Gallery
          </h2>

          {/* Top Section */}
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
            {/* Featured Video */}
            {(() => {
              const cardContent = (
                <div className="flex flex-col md:flex-row h-full">
                  {/* Image */}
                  <div className="relative w-full md:w-[55%] aspect-video overflow-hidden">
                    <img
                      src={featuredVideo.image}
                      alt={featuredVideo.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />

                    <div className="absolute bottom-3 left-3 flex items-center gap-1 bg-black/90 text-white text-[11px] font-semibold px-2 py-1 rounded">
                      <Play className="w-3 h-3 fill-current" />
                      <span>{featuredVideo.duration}</span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 p-4">
                    <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                      {featuredVideo.category}
                    </span>

                    <h3 className="mt-2 text-base md:text-lg font-extrabold text-gray-900 leading-snug line-clamp-4 group-hover:text-red-700 transition-colors">
                      {featuredVideo.title}
                    </h3>
                  </div>
                </div>
              );

              return featuredVideo.href ? (
                <Link href={featuredVideo.href} className="lg:col-span-2 group bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden block">
                  {cardContent}
                </Link>
              ) : (
                <div className="lg:col-span-2 group bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
                  {cardContent}
                </div>
              );
            })()}

            {/* Side Videos */}
            <div className="flex flex-col gap-4">
              {stackedVideos.map((video) => {
                const cardContent = (
                  <div className="group flex gap-3 bg-white p-3 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 w-full h-full cursor-pointer">
                    <div className="relative w-28 sm:w-36 aspect-video shrink-0 overflow-hidden rounded-lg">
                      <img
                        src={video.image}
                        alt={video.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />

                      <div className="absolute bottom-1.5 left-1.5 flex items-center gap-1 bg-black/90 text-white text-[10px] px-1.5 py-0.5 rounded">
                        <Play className="w-2.5 h-2.5 fill-current" />
                        <span>{video.duration}</span>
                      </div>
                    </div>

                    <div className="min-w-0">
                      <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wide">
                        {video.category}
                      </span>

                      <h4 className="mt-1 text-xs sm:text-sm font-bold text-gray-900 leading-snug line-clamp-3 group-hover:text-red-700 transition-colors">
                        {video.title}
                      </h4>
                    </div>
                  </div>
                );

                return video.href ? (
                  <Link key={video.id} href={video.href} className="block w-full">
                    {cardContent}
                  </Link>
                ) : (
                  <div key={video.id} className="w-full">{cardContent}</div>
                );
              })}
            </div>
          </div>

          {/* Bottom Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 mt-6">
            {gridVideos.map((video) => {
              const cardContent = (
                <div className="group bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden cursor-pointer h-full">
                  <div className="relative aspect-video overflow-hidden">
                    <img
                      src={video.image}
                      alt={video.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />

                    <div className="absolute bottom-2 left-2 flex items-center gap-1 bg-black/90 text-white text-[10px] px-2 py-1 rounded">
                      <Play className="w-2.5 h-2.5 fill-current" />
                      <span>{video.duration}</span>
                    </div>
                  </div>

                  <div className="p-3">
                    <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wide">
                      {video.category}
                    </span>

                    <h4 className="mt-1 text-sm font-bold text-gray-900 leading-snug line-clamp-2 group-hover:text-red-700 transition-colors">
                      {video.title}
                    </h4>
                  </div>
                </div>
              );

              return video.href ? (
                <Link key={video.id} href={video.href} className="block h-full">
                  {cardContent}
                </Link>
              ) : (
                <div key={video.id} className="h-full">{cardContent}</div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}


