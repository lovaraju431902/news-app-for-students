import React from "react";
import { Play } from "lucide-react";

interface VideoItem {
  id: number;
  image: string;
  duration: string;
  category: string;
  title: string;
}

const largeVideo: VideoItem = {
  id: 1,
  image: "https://images.unsplash.com/photo-1529699211952-734e80c4d42b?q=80&w=600&auto=format&fit=crop",
  duration: "03:02",
  category: "Telugu Video",
  title: "CM Vijay plays chess with chess Grandmaster Praggnanandhaa, viral video wins hearts on social media",
};

const stackedVideos: VideoItem[] = [
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?q=80&w=300&auto=format&fit=crop",
    duration: "03:03",
    category: "Cinema",
    title: "NTR sends cookies to children; their cute reaction video goes viral!",
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1507608869274-d3177c8bb4c7?q=80&w=300&auto=format&fit=crop",
    duration: "05:36",
    category: "National",
    title: "Tirupati Zoo sets up special arrangements for animals, elephants get cool showers",
  }
];

const gridVideos: VideoItem[] = [
  {
    id: 4,
    image: "https://images.unsplash.com/photo-1485965120184-e220f721d03e?q=80&w=300&auto=format&fit=crop",
    duration: "09:02",
    category: "Telugu Video",
    title: "Chandrababu Naidu rides bicycle for 5 km in Visakhapatnam to promote fitness",
  },
  {
    id: 5,
    image: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=300&auto=format&fit=crop",
    duration: "10:43",
    category: "Cinema",
    title: "'Peddi' Review: Ram Charan's struggle for recognition, movie performance analysis",
  },
  {
    id: 6,
    image: "https://images.unsplash.com/photo-1545128485-c400e7702796?q=80&w=300&auto=format&fit=crop",
    duration: "06:07",
    category: "Telugu Video",
    title: "Janhvi Kapoor visits Tirumala Srivari temple following 'Peddi' success",
  },
  {
    id: 7,
    image: "https://images.unsplash.com/photo-15518156677180-95a2893f3e9f?q=80&w=300&auto=format&fit=crop",
    duration: "04:21",
    category: "Telugu Video",
    title: "YSRCP protests in Tirupati cause traffic delays for Tirumala devotees",
  }
];

export default function VideoGallery() {
  return (
    <section className="p-3 w-full pr-[70px] pl-[195px]">
      {/* Main Container with light gray background matching image */}
      <div className="bg-gray-50/80 border border-gray-100/90 rounded-2xl p-4 md:p-6 shadow-sm">
        
        {/* Title */}
        <h2 className="text-xl font-extrabold text-gray-900 mb-6 tracking-tight">
          Video Gallery
        </h2>

        {/* Row 1 (Large Video + Stacked Videos) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          
          {/* Left: Large Video Card (Spans 2 columns on desktop) */}
          <div className="lg:col-span-2 group flex flex-col sm:flex-row gap-4 items-start cursor-pointer bg-white p-3 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300">
            {/* Thumbnail */}
            <div className="relative w-full sm:w-[60%] aspect-video rounded-lg overflow-hidden shrink-0 bg-black">
              <img
                src={largeVideo.image}
                alt={largeVideo.title}
                className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
                loading="lazy"
              />
              {/* Duration Pill (bottom left) */}
              <div className="absolute bottom-2.5 left-2.5 flex items-center gap-1 bg-black/85 text-white text-[10px] font-bold px-2 py-0.5 rounded-md backdrop-blur-sm">
                <Play className="w-2.5 h-2.5 fill-current" />
                <span>{largeVideo.duration}</span>
              </div>
            </div>

            {/* Content info */}
            <div className="flex flex-col p-1">
              <span className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">
                {largeVideo.category}
              </span>
              <h3 className="text-gray-900 font-extrabold text-sm sm:text-base leading-snug group-hover:text-red-700 transition-colors line-clamp-4">
                {largeVideo.title}
              </h3>
            </div>
          </div>

          {/* Right: Two Stacked Video Cards */}
          <div className="flex flex-col gap-4">
            {stackedVideos.map((video) => (
              <div
                key={video.id}
                className="group flex gap-3 items-center cursor-pointer bg-white p-2 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 min-w-0"
              >
                {/* Thumbnail */}
                <div className="relative w-28 sm:w-32 aspect-video rounded-lg overflow-hidden shrink-0 bg-black">
                  <img
                    src={video.image}
                    alt={video.title}
                    className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
                    loading="lazy"
                  />
                  {/* Duration Pill */}
                  <div className="absolute bottom-1.5 left-1.5 flex items-center gap-1 bg-black/85 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-md backdrop-blur-sm">
                    <Play className="w-2 h-2 fill-current" />
                    <span>{video.duration}</span>
                  </div>
                </div>

                {/* Content */}
                <div className="flex flex-col min-w-0">
                  <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider mb-0.5">
                    {video.category}
                  </span>
                  <h4 className="text-gray-900 font-bold text-xs leading-snug line-clamp-3 group-hover:text-red-700 transition-colors">
                    {video.title}
                  </h4>
                </div>
              </div>
            ))}
          </div>

        </div>

        {/* Row 2 (4 Vertical Grid Cards) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          {gridVideos.map((video) => (
            <div key={video.id} className="group cursor-pointer flex flex-col bg-white p-2 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300">
              
              {/* Thumbnail */}
              <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-black">
                <img
                  src={video.image}
                  alt={video.title}
                  className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                  loading="lazy"
                />
                {/* Duration Pill */}
                <div className="absolute bottom-2 left-2 flex items-center gap-1 bg-black/85 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-md backdrop-blur-sm">
                  <Play className="w-2 h-2 fill-current" />
                  <span>{video.duration}</span>
                </div>
              </div>

              {/* Info */}
              <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider mt-2 mb-0.5">
                {video.category}
              </span>
              <h4 className="text-gray-950 font-bold text-xs sm:text-sm leading-snug line-clamp-2 group-hover:text-red-700 transition-colors">
                {video.title}
              </h4>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
