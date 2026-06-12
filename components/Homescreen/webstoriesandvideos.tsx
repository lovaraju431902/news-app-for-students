import React, { useEffect } from "react";
import { Play } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

// interface Story {
//   id: number;
//   image?: string;
//   title: string;
// }

// interface Video {
//   id: number;
//   image: string;
//   title: string;
//   badge: string;
// }

// // const storiesData: Story[] = [
// //   {
// //     id: 1,
// //     image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=600&auto=format&fit=crop",
// //     title: "కాఫీ తాగడం వల్ల బెస్ట్ ప్రయోజనాలు ఇవే..",
// //   },
// //   {
// //     id: 2,
// //     image: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?q=80&w=600&auto=format&fit=crop",
// //     title: "షుగర్ తగ్గించే సూపర్ చిట్కా.. పైసలతో పన...",
// //   },
// //   {
// //     id: 3,
// //     image: "https://images.unsplash.com/photo-1628771065518-0d82f1938462?q=80&w=600&auto=format&fit=crop",

// //     title: "వేసవిలోనే కాదు.. పీరియడ్స్ సమయంలో...",
// //   },
// //   {
// //     id: 4,

// //     image: "https://images.unsplash.com/photo-1554774853-aae0a22c8aa4?q=80&w=600&auto=format&fit=crop",

// //     title: "పాన్ కార్డు లేకుంటే ఈ పనులన్నీ ఆగిపోతాయి..!",
// //   }
// // ];

// const videosData: Video[] = [
//   {
//     id: 1,
//     image: "https://images.unsplash.com/photo-1618042164219-62c820f10723?q=80&w=600&auto=format&fit=crop",
//     title: "కోటి కోట్లకు చేరువలో ఎలాన్ మస్క్..",
//     badge: "Tech",
//   },
//   {
//     id: 2,
//     image: "https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?q=80&w=600&auto=format&fit=crop",
//     title: "జగన్ క్షమాపణ చెప్పాలి: మంత్రి నిమ్మల",
//     badge: "AI TOOLS",
//   },
//   {
//     id: 3,
//     image: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?q=80&w=600&auto=format&fit=crop",
//     title: "టీఎన్సీలో ముసలం.. దీదీ పై 58 మంది ఎమ్మెల్యేల తిరుగుబాటు",
//     badge: "ABN",
//   },
//   {
//     id: 4,
//     image: "https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?q=80&w=600&auto=format&fit=crop",
//     title: "బీజేపీలో ఉంటూ బీఆర్ఎస్ కోసం పనిచేస్తాడు.!",
//     badge: "ABN",
//   },
//   {
//     id: 5,
//     image: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?q=80&w=600&auto=format&fit=crop",
//     title: "జగన్ పీఏ కేఎన్ఆర్ ఆస్తుల చిట్టా..",
//     badge: "ABN",
//   },
//   {
//     id: 6,
//     image: "https://images.unsplash.com/photo-1486016006115-74a41448aea2?q=80&w=600&auto=format&fit=crop",
//     title: "తెలంగాణలో రాబోయే 2 రోజుల్లో భారీ వర్షాలు..!!",
//     badge: "ABN",
//   }
// ];



type Webstoriesnews = {
  id: string;
  title: string;
  image: string;
  href: string;
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



  const getWebstories = async (): Promise<WebstoresisResponse> => {
    const response = await fetch("/api/webstories");

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
    queryKey: ["webstories"],
    queryFn: getWebstories,
  });


  useEffect(() => {
    if (Webstoriesdata) {

      console.log("1 st data", Webstoriesdata.data)

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

      console.log("1 st data", Videosdata.data)

    }
  }, [Videosdata?.data]);


  const videosData = Videosdata?.data || [];




  if (VideosisLoading) {

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
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex flex-col">
                  <div className="w-full aspect-[9/14] rounded-2xl bg-zinc-200 dark:bg-zinc-800" />
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
          <h2 className="text-[#b91c1c] font-extrabold text-xl whitespace-nowrap">WEB STORIES</h2>
          <div className="h-[1px] bg-red-700/20 flex-grow"></div>
          <a className="text-xs font-bold text-[#b91c1c] border border-red-700/20 rounded-full px-4 py-1.5 hover:bg-red-50 transition-colors whitespace-nowrap cursor-pointer">
            READ MORE
          </a>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
          {storiesData.map((story, index) => (
            <div key={story.id} className={`group flex flex-col cursor-pointer${index >= 4 ? " sm:hidden" : ""}`}>
              {/* Card Thumbnail */}
              <div className="relative w-full aspect-[9/16] rounded-2xl overflow-hidden shadow-sm border border-gray-100 bg-gray-50 group-hover:shadow-md transition-shadow duration-300">
                {/* Single Image Card */}


                <img

                  src={story.image}
                  alt={story.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />



              </div>

              {/* Title / Description */}
              <h3 className="text-gray-900 font-bold mt-2 text-sm sm:text-base leading-snug line-clamp-2 group-hover:text-red-700 transition-colors">
                {story.title}
              </h3>
            </div>
          ))}
        </div>
      </section>

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
                <img
                  src={video.image}
                  alt={video.title}
                  className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-103 transition-all duration-500"
                  loading="lazy"
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











