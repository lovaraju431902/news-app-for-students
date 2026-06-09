import React from "react";
import { Play } from "lucide-react";

interface Story {
  id: number;
  type: "single" | "split" | "stacked";
  image?: string;
  topImage?: string;
  bottomImage?: string;
  title: string;
}

interface Video {
  id: number;
  image: string;
  title: string;
  badge: string;
}

const storiesData: Story[] = [
  {
    id: 1,
    type: "single",
    image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=600&auto=format&fit=crop",
    title: "కాఫీ తాగడం వల్ల బెస్ట్ ప్రయోజనాలు ఇవే..",
  },
  {
    id: 2,
    type: "single",
    image: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?q=80&w=600&auto=format&fit=crop",
    title: "షుగర్ తగ్గించే సూపర్ చిట్కా.. పైసలతో పన...",
  },
  {
    id: 3,
    type: "split",
    topImage: "https://images.unsplash.com/photo-1628771065518-0d82f1938462?q=80&w=600&auto=format&fit=crop",
    bottomImage: "https://images.unsplash.com/photo-1601242364373-0429a1b1d7d0?q=80&w=600&auto=format&fit=crop",
    title: "వేసవిలోనే కాదు.. పీరియడ్స్ సమయంలో...",
  },
  {
    id: 4,
    type: "stacked",
    topImage: "https://images.unsplash.com/photo-1554774853-aae0a22c8aa4?q=80&w=600&auto=format&fit=crop",
    bottomImage: "https://images.unsplash.com/photo-1601597111158-2fceff270190?q=80&w=600&auto=format&fit=crop",
    title: "పాన్ కార్డు లేకుంటే ఈ పనులన్నీ ఆగిపోతాయి..!",
  }
];

const videosData: Video[] = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1618042164219-62c820f10723?q=80&w=600&auto=format&fit=crop",
    title: "కోటి కోట్లకు చేరువలో ఎలాన్ మస్క్..",
    badge: "ABN",
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?q=80&w=600&auto=format&fit=crop",
    title: "జగన్ క్షమాపణ చెప్పాలి: మంత్రి నిమ్మల",
    badge: "ABN",
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?q=80&w=600&auto=format&fit=crop",
    title: "టీఎన్సీలో ముసలం.. దీదీ పై 58 మంది ఎమ్మెల్యేల తిరుగుబాటు",
    badge: "ABN",
  },
  {
    id: 4,
    image: "https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?q=80&w=600&auto=format&fit=crop",
    title: "బీజేపీలో ఉంటూ బీఆర్ఎస్ కోసం పనిచేస్తాడు.!",
    badge: "ABN",
  },
  {
    id: 5,
    image: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?q=80&w=600&auto=format&fit=crop",
    title: "జగన్ పీఏ కేఎన్ఆర్ ఆస్తుల చిట్టా..",
    badge: "ABN",
  },
  {
    id: 6,
    image: "https://images.unsplash.com/photo-1486016006115-74a41448aea2?q=80&w=600&auto=format&fit=crop",
    title: "తెలంగాణలో రాబోయే 2 రోజుల్లో భారీ వర్షాలు..!!",
    badge: "ABN",
  }
];

export default function WebStoriesAndVideos() {
  return (
    <div className="space-y-8 p-3">
      {/* Web Stories Section */}
      <section>
        <div className="flex items-center justify-between gap-4 mb-4">
          <h2 className="text-[#b91c1c] font-extrabold text-xl whitespace-nowrap">వెబ్ స్టోరీస్</h2>
          <div className="h-[1px] bg-red-700/20 flex-grow"></div>
          <a className="text-xs font-bold text-[#b91c1c] border border-red-700/20 rounded-full px-4 py-1.5 hover:bg-red-50 transition-colors whitespace-nowrap cursor-pointer">
            మరిన్ని చదవండి
          </a>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {storiesData.map((story) => (
            <div key={story.id} className="group flex flex-col cursor-pointer">
              {/* Card Thumbnail */}
              <div className="relative w-full aspect-[9/14] rounded-2xl overflow-hidden shadow-sm border border-gray-100 bg-gray-50 group-hover:shadow-md transition-shadow duration-300">
                {/* Single Image Card */}
                {story.type === "single" && story.image && (
                  <img
                    src={story.image}
                    alt={story.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                )}

                {/* Split Image Card (Card 3 with diagonal split) */}
                {story.type === "split" && story.topImage && story.bottomImage && (
                  <div className="relative w-full h-full">
                    {/* Top Image */}
                    <img
                      src={story.topImage}
                      alt={story.title}
                      className="absolute inset-0 w-full h-[60%] object-cover group-hover:scale-102 transition-transform duration-500"
                      loading="lazy"
                    />
                    {/* Bottom Image with custom diagonal clip-path */}
                    <div
                      className="absolute inset-x-0 bottom-0 h-[55%] w-full z-10"
                      style={{
                        clipPath: "polygon(0 30%, 100% 0, 100% 100%, 0 100%)",
                      }}
                    >
                      <img
                        src={story.bottomImage}
                        alt={story.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                    </div>
                  </div>
                )}

                {/* Stacked Images Card (Card 4 with stacked layout) */}
                {story.type === "stacked" && story.topImage && story.bottomImage && (
                  <div className="flex flex-col gap-1 w-full h-full">
                    <div className="relative flex-1 w-full h-1/2 overflow-hidden">
                      <img
                        src={story.topImage}
                        alt={story.title}
                        className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
                        loading="lazy"
                      />
                    </div>
                    <div className="relative flex-1 w-full h-1/2 overflow-hidden">
                      <img
                        src={story.bottomImage}
                        alt={story.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                    </div>
                  </div>
                )}
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
            మరిన్ని చదవండి
          </a>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
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
                <div className="absolute inset-0 flex items-center justify-center bg-black/10 group-hover:bg-black/20 transition-colors duration-300">
                  <div className="w-12 h-12 flex items-center justify-center rounded-full bg-[#e50914] text-white shadow-lg transform group-hover:scale-110 transition-transform duration-300">
                    <Play className="w-5 h-5 fill-current translate-x-[1.5px]" />
                  </div>
                </div>

                {/* Channel Badge Overlay (Top Right) */}
                <div className="absolute top-2 right-2 bg-[#b91c1c] text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded shadow-sm tracking-wider border border-white/10">
                  {video.badge}
                </div>
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
