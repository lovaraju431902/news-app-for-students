import React from "react";
import { ChevronRight } from "lucide-react";

interface MostReadItem {
  id: number;
  image: string;
  title: string;
}

const mostReadData: MostReadItem[] = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?q=80&w=300&auto=format&fit=crop",
    title: "Pawan Kalyan: Stop boasting and answer our questions now!",
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1594909122845-11baa439b7bf?q=80&w=300&auto=format&fit=crop",
    title: "Karthika Deepam Today June 06 Episode: Shourya on the brink of death",
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1533928298208-27ff66555d8d?q=80&w=300&auto=format&fit=crop",
    title: "Karthika Deepam Today June 05 Episode: Deepa and Karthik face new challenges",
  },
  {
    id: 4,
    image: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=300&auto=format&fit=crop",
    title: "Peddi Movie Review: The film fails to impress; what went wrong?",
  },
  {
    id: 5,
    image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=300&auto=format&fit=crop",
    title: "Prakash Raj Tweet: 'He was never crowned as a king' sparks debate",
  },
  {
    id: 6,
    image: "https://images.unsplash.com/photo-1516302720888-afc5f464010b?q=80&w=300&auto=format&fit=crop",
    title: "Podarillu Today June 05 Episode: Clashes over identity and self-respect",
  },
  {
    id: 7,
    image: "https://images.unsplash.com/photo-1610483178766-8092dcc9a31a?q=80&w=300&auto=format&fit=crop",
    title: "Karthika Deepam Today June 08 Episode: Sumitra makes a tough decision",
  },
  {
    id: 8,
    image: "https://images.unsplash.com/photo-1532980400857-e8d9d2757f5b?q=80&w=300&auto=format&fit=crop",
    title: "Horoscope Today June 07, 2026: Financial gains and fortune predictions",
  },
  {
    id: 9,
    image: "https://images.unsplash.com/photo-1474487548417-781cb71495f3?q=80&w=300&auto=format&fit=crop",
    title: "Telangana: Another new railway station works completed successfully",
  },
  {
    id: 10,
    image: "https://images.unsplash.com/photo-1518156677180-95a2893f3e9f?q=80&w=300&auto=format&fit=crop",
    title: "Illu Illalu Pillalu Today June 06 Episode: Bhadravathi's plans exposed",
  }
];

export default function MostRead() {
  return (
    <section className="p-3 w-full pr-[70px] pl-[195px]">
      {/* Header */}
      <div className="flex items-center gap-1 mb-4 cursor-pointer group w-fit">
        <h2 className="text-xl font-extrabold text-gray-900 group-hover:text-red-700 transition-colors">
          Most read
        </h2>

      </div>

      {/* Grid Layout (5 columns on large screen, wrapping responsively) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {mostReadData.map((item) => (
          <div key={item.id} className="group cursor-pointer flex flex-col">
            {/* Thumbnail Container */}
            <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-gray-50 border border-gray-100 shadow-sm group-hover:shadow-md transition-shadow duration-300">
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                loading="lazy"
              />
            </div>

            {/* Headline */}
            <h3 className="text-gray-950 font-bold mt-2 text-xs sm:text-sm leading-snug line-clamp-2 group-hover:text-red-700 transition-colors">
              {item.title}
            </h3>
          </div>
        ))}
      </div>
    </section>
  );
}
