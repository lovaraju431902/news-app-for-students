"use client"

import { useQuery } from "@tanstack/react-query";
import React, { useEffect } from "react";
import Image from "next/image";

// interface AdItem {
//   id: number;
//   image: string;
//   headline: string;
//   description: string;

// }

// const adItemsData: AdItem[] = [
//   {
//     id: 1,
//     image: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?q=80&w=400&auto=format&fit=crop",
//     headline: "Start Forex Trading. Get a 100% Welcome Bonus",
//     description: "Find out why you should join iFOREX, a regulated broker with over 25 years of experience. Open your account today.",

//   },
//   {
//     id: 2,
//     image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=400&auto=format&fit=crop",
//     headline: "Option Trading Mastery: Mr. Gopal Shares His Laxman Rekha Strategy For Free",
//     description: "Master the Art of Precise Option Trading with Gopal Sir's Laxman Rekha Strategy – for Free!",

//   },
//   {
//     id: 3,
//     image: "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?q=80&w=400&auto=format&fit=crop",
//     headline: "Ardhannapalem: Best Public Speaking Course for Children",
//     description: "Start Your Child's English Transformation Now! Build confidence, presentation skills, and speech clarity.",

//   },
//   {
//     id: 4,
//     image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=400&auto=format&fit=crop",
//     headline: "Mr. Bala's Powerful Intraday Strategy Revealed – No More Guesswork",
//     description: "Join Bala Sir's Market Profile Masterclass and Book Your Profit By 11 AM. Sign Up Now For Trading Secrets.",

//   },
//   {
//     id: 5,
//     image: "https://images.unsplash.com/photo-1584824486509-112e4181ff6b?q=80&w=400&auto=format&fit=crop",
//     headline: "Act now! Their baby's treatment can cost up to ₹10 lakhs.",
//     description: "Only 32 days old and needs complex heart surgeries to survive. Act now to help him live a healthy life.",


//   },
//   {
//     id: 6,
//     image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=400&auto=format&fit=crop",
//     headline: "Transform Your Child's Confidence with Our Public Speaking Program",
//     description: "Exclusively for Ages 4-15. Interactive classes, personality development, and speech training.",

//   },
//   {
//     id: 7,
//     image: "https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=400&auto=format&fit=crop",
//     headline: "M. Tech in Data Science & AI - For Working Pros | Bangalore",
//     description: "Earn a 2-year M.Tech from PES while you work. Industry-aligned curriculum, hands-on projects, and flexible classes.",

//   },
//   {
//     id: 8,
//     image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=400&auto=format&fit=crop",
//     headline: "Earn Your M.Tech from Karnataka's #1 University",
//     description: "Upgrade with an M.Tech in Data Science & AI from PES University. Weekend program designed for professional developers.",

//   },
//   {
//     id: 9,
//     image: "https://images.unsplash.com/photo-1516627145497-ae6968895b74?q=80&w=400&auto=format&fit=crop",
//     headline: "Help now! A rare heart defect is hurting her.",
//     description: "My baby has a serious heart defect and high lung pressure issues. Please help her survive this challenge!",

//   }
// ];








type YouMayLikeSchema = {
  id: string;
  headline: string;
  image: string;
  description: string;
  href: string;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
};

type YouMayLikeResponse = {
  data: YouMayLikeSchema[];
};





export default function YouMayLike() {





  const getYouMayLikes = async (): Promise<YouMayLikeResponse> => {
    const response = await fetch("/api/youmaylike");

    if (!response.ok) {
      throw new Error("Failed to fetch youmaylikes");
    }

    return response.json();
  };



  const {
    data: YouMayLikedata,
    isLoading: YouMayLikeisLoading,
    error: YouMayLikeError,
  } = useQuery({
    queryKey: ["youmaylike"],
    queryFn: getYouMayLikes,
  });


  useEffect(() => {
    if (YouMayLikedata) {

      // console.log("1 st data", YouMayLikedata.data)

    }
  }, [YouMayLikedata?.data]);


  const adItemsData = YouMayLikedata?.data || [];

  if (YouMayLikeisLoading || YouMayLikeError) {
    return (
      <section className="p-3 w-full lg:pl-[195px] mb-8">
        {/* Header Skeleton */}
        <div className="flex items-center justify-between border-b border-gray-200 pb-2.5 mb-6">
          <div className="h-5 bg-zinc-200 rounded w-32 animate-pulse"></div>
        </div>

        {/* Responsive Grid Skeleton */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-6">
          {Array.from({ length: 5 }).map((_, idx) => (
            <div key={idx} className="flex flex-col h-full bg-white rounded-lg">
              {/* Thumbnail Placeholder */}
              <div className="relative aspect-[16/10] w-full rounded-lg bg-zinc-200 animate-pulse mb-3"></div>

              {/* Text detail Placeholders */}
              <div className="flex-grow flex flex-col mb-4 space-y-2">
                <div className="h-4 bg-zinc-200 rounded w-full animate-pulse"></div>
                <div className="h-4 bg-zinc-200 rounded w-3/4 animate-pulse"></div>
                <div className="h-3 bg-zinc-200 rounded w-5/6 animate-pulse mt-2"></div>
                <div className="h-3 bg-zinc-200 rounded w-2/3 animate-pulse"></div>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }




















  return (
    <section className="p-3 w-full lg:pl-[195px]  mb-8">
      {/* Header with Sponsored Logo */}
      <div className="flex items-center justify-between border-b border-gray-200 pb-2.5 mb-6">
        <h2 className="text-sm font-extrabold text-gray-900 tracking-wider">
          YOU MAY LIKE
        </h2>

      </div>

      {/* Grid Layout (3 Columns on Desktop, collapsing to 2 on Tablet, 1 on Mobile) */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-6">
        {adItemsData.map((ad) => (
          <div key={ad.id} className="group flex flex-col h-full bg-white rounded-lg">
            {/* Thumbnail */}
            <div className="relative aspect-[16/10] w-full overflow-hidden rounded-lg shadow-sm border border-gray-100 mb-3 bg-gray-50">
              <Image
                src={ad.image}
                alt={ad.headline}
                fill
                className="object-cover group-hover:scale-102 transition-transform duration-500"
                sizes="(max-width: 768px) 50vw, (max-width: 1024px) 20vw, 200px"
              />
            </div>

            {/* Text details */}
            <div className="flex-grow flex flex-col mb-4">
              <h3 className="text-sm sm:text-base font-bold text-gray-950 leading-snug line-clamp-2 mb-1.5 group-hover:underline cursor-pointer">
                {ad.headline}
              </h3>
              <p className="text-xs sm:text-sm text-gray-500 leading-relaxed line-clamp-2">
                {ad.description}
              </p>
            </div>

            {/* Footer with Publisher and CTA */}
            {/* <div className="flex items-center justify-between border-t border-gray-100 pt-3 mt-auto">
                            <span className="text-xs font-semibold text-gray-400">
                                {ad.publisher}
                            </span>
                            <button className="text-xs font-bold border border-gray-300 rounded px-3.5 py-1 bg-white hover:bg-gray-50 text-gray-800 transition-colors shadow-sm cursor-pointer">
                                {ad.ctaText}
                            </button>
                        </div> */}
          </div>
        ))}
      </div>
    </section>
  );
}




















