import React, { useEffect, useState } from "react";
import { Play } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { ShortVideoCard, ShortVideoPlayerModal } from "@/components/ShortVideoComponents";


type Webstoriesnews = {
  id: string;
  title: string;
  image: string;
  video?: string | null;
  href?: string | null;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
};

type WebstoresisResponse = {
  data: Webstoriesnews[];
};




type Videosnews = {
  id: string;
  title: string;
  image: string;
  href: string;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
};

type VideosnewsResponse = {
  data: Videosnews[];
};





export default function WebStoriesAndVideos() {
  const [activeStoryIndex, setActiveStoryIndex] = useState<number | null>(null);


  const getWebstories = async (): Promise<WebstoresisResponse> => {
    const response = await fetch("/api/webstories?limit=4");

    if (!response.ok) {
      throw new Error("Failed to fetch webstories");
    }

    return response.json();
  };



  const {
    data: Webstoriesdata,
    isLoading: WebstoresisLoading,
    error: WebstoresError,
  } = useQuery({
    queryKey: ["webstories", "homepage"],
    queryFn: getWebstories,
  });


  useEffect(() => {
    if (Webstoriesdata) {


    }
  }, [Webstoriesdata?.data]);


  const storiesData = Webstoriesdata?.data || [];






  const getVideos = async (): Promise<WebstoresisResponse> => {
    const response = await fetch("/api/videos");

    if (!response.ok) {
      throw new Error("Failed to fetch videos");
    }

    return response.json();
  };



  const {
    data: Videosdata,
    isLoading: VideosisLoading,
    error: VideosError,
  } = useQuery({
    queryKey: ["videos"],
    queryFn: getVideos,
  });


  useEffect(() => {
    if (Videosdata) {

      // console.log("1 st data", Videosdata.data)

    }
  }, [Videosdata?.data]);


  const videosData = Videosdata?.data || [];




  if (VideosisLoading || WebstoresisLoading || VideosError || WebstoresError) {

    return (

      <>


        <div className="space-y-8 p-3 animate-pulse">
          {/* Web Stories Section */}
          <section>
            <div className="flex items-center justify-between gap-4 mb-4">
              <div className="h-5 w-24 bg-zinc-250 dark:bg-zinc-800 rounded" />
              <div className="h-[1px] bg-red-700/20 flex-grow"></div>
              <div className="h-7 w-24 bg-zinc-250 dark:bg-zinc-800 rounded-full" />
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex flex-col">
                  <div className="w-full aspect-[9/16] rounded-2xl bg-zinc-200 dark:bg-zinc-800" />
                  <div className="h-4 w-5/6 bg-zinc-200 dark:bg-zinc-800 rounded mt-2" />
                  <div className="h-4 w-2/3 bg-zinc-200 dark:bg-zinc-800 rounded mt-1" />
                </div>
              ))}
            </div>
          </section>

          {/* Videos Section */}
          <section>
            <div className="flex items-center justify-between gap-4 mb-4">
              <div className="h-5 w-20 bg-zinc-250 dark:bg-zinc-800 rounded" />
              <div className="h-[1px] bg-gray-350 flex-grow"></div>
              <div className="h-7 w-24 bg-zinc-250 dark:bg-zinc-800 rounded-full" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="flex flex-col">
                  <div className="w-full aspect-video rounded-xl bg-zinc-200 dark:bg-zinc-800" />
                  <div className="h-4 w-5/6 bg-zinc-200 dark:bg-zinc-800 rounded mt-2.5" />
                  <div className="h-4 w-1/2 bg-zinc-200 dark:bg-zinc-800 rounded mt-1" />
                </div>
              ))}
            </div>
          </section>
        </div>



      </>
    )
  }







  return (
    <div className="space-y-8 p-3">
      {/* Web Stories Section */}
      <section>
        <div className="flex items-center justify-between gap-4 mb-4">
          <h2 className="text-[#b91c1c] font-extrabold text-xl whitespace-nowrap">SHORT VIDEOS</h2>
          <div className="h-[1px] bg-red-700/20 flex-grow"></div>
          <Link href="/short-videos" className="text-xs font-bold text-[#b91c1c] border border-red-700/20 rounded-full px-4 py-1.5 hover:bg-red-50 transition-colors whitespace-nowrap cursor-pointer">
            VIEW ALL
          </Link>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
          {storiesData.map((story, index) => (
            <div key={story.id} className={`${index >= 3 ? "max-sm:hidden" : ""}`}>
              <ShortVideoCard
                story={story}
                onClick={() => setActiveStoryIndex(index)}
              />
            </div>
          ))}
        </div>
      </section>

      {/* Video Player Modal */}
      {activeStoryIndex !== null && (
        <ShortVideoPlayerModal
          stories={storiesData}
          currentIndex={activeStoryIndex}
          onClose={() => setActiveStoryIndex(null)}
          onNavigate={(index) => setActiveStoryIndex(index)}
        />
      )}

      {/* Videos Section */}
      <section>
        <div className="flex items-center justify-between gap-4 mb-4">
          <h2 className="text-gray-900 font-extrabold text-xl whitespace-nowrap">వీడియోస్</h2>
          <div className="h-[1px] bg-gray-300 flex-grow"></div>
          <a className="text-xs font-bold text-[#b91c1c] border border-red-700/20 rounded-full px-4 py-1.5 hover:bg-red-50 transition-colors whitespace-nowrap cursor-pointer">
            READ MORE
          </a>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {videosData.map((video) => (
            <div key={video.id} className="group cursor-pointer flex flex-col">
              {/* Video Thumbnail Container */}
              <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-black border border-gray-100 shadow-sm group-hover:shadow-md transition-all duration-300">
                <Image
                  src={video.image}
                  alt={video.title}
                  fill
                  className="object-cover opacity-90 group-hover:opacity-100 group-hover:scale-103 transition-all duration-500"
                  sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 300px"
                />

                {/* Center Play Button Overlay */}
                {/* <div className="absolute inset-0 flex items-center justify-center bg-black/10 group-hover:bg-black/20 transition-colors duration-300">
                                     <div className="w-12 h-12 flex items-center justify-center rounded-full bg-[#e50914] text-white shadow-lg transform group-hover:scale-110 transition-transform duration-300">
                                        <Play className="w-5 h-5 fill-current translate-x-[1.5px]" />
                                    </div> 
                                </div> */}

                {/* Channel Badge Overlay (Top Right) */}
                {/* <div className="absolute top-2 right-2 bg-[#b91c1c] text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded shadow-sm tracking-wider border border-white/10">
                  {video.badge}
                </div> */}

              </div>

              {/* Video Caption */}
              <h3 className="text-gray-900 font-bold mt-2.5 text-sm sm:text-base leading-snug line-clamp-2 group-hover:text-red-700 transition-colors">
                {video.title}
              </h3>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}











