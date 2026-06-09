import React from "react";

interface AdItem {
  id: number;
  image: string;
  headline: string;
  description: string;
  publisher: string;
  ctaText: string;
}

const adItemsData: AdItem[] = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?q=80&w=400&auto=format&fit=crop",
    headline: "Start Forex Trading. Get a 100% Welcome Bonus",
    description: "Find out why you should join iFOREX, a regulated broker with over 25 years of experience. Open your account today.",
    publisher: "iFOREX",
    ctaText: "Sign Up",
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=400&auto=format&fit=crop",
    headline: "Option Trading Mastery: Mr. Gopal Shares His Laxman Rekha Strategy For Free",
    description: "Master the Art of Precise Option Trading with Gopal Sir's Laxman Rekha Strategy – for Free!",
    publisher: "TradeWise",
    ctaText: "Learn More",
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?q=80&w=400&auto=format&fit=crop",
    headline: "Ardhannapalem: Best Public Speaking Course for Children",
    description: "Start Your Child's English Transformation Now! Build confidence, presentation skills, and speech clarity.",
    publisher: "Planet Spark",
    ctaText: "Learn More",
  },
  {
    id: 4,
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=400&auto=format&fit=crop",
    headline: "Mr. Bala's Powerful Intraday Strategy Revealed – No More Guesswork",
    description: "Join Bala Sir's Market Profile Masterclass and Book Your Profit By 11 AM. Sign Up Now For Trading Secrets.",
    publisher: "TradeWise",
    ctaText: "Learn More",
  },
  {
    id: 5,
    image: "https://images.unsplash.com/photo-1584824486509-112e4181ff6b?q=80&w=400&auto=format&fit=crop",
    headline: "Act now! Their baby's treatment can cost up to ₹10 lakhs.",
    description: "Only 32 days old and needs complex heart surgeries to survive. Act now to help him live a healthy life.",
    publisher: "Give Hope India",
    ctaText: "Donate Now",
  },
  {
    id: 6,
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=400&auto=format&fit=crop",
    headline: "Transform Your Child's Confidence with Our Public Speaking Program",
    description: "Exclusively for Ages 4-15. Interactive classes, personality development, and speech training.",
    publisher: "Planet Spark",
    ctaText: "Book Now",
  },
  {
    id: 7,
    image: "https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=400&auto=format&fit=crop",
    headline: "M. Tech in Data Science & AI - For Working Pros | Bangalore",
    description: "Earn a 2-year M.Tech from PES while you work. Industry-aligned curriculum, hands-on projects, and flexible classes.",
    publisher: "PES University",
    ctaText: "Learn More",
  },
  {
    id: 8,
    image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=400&auto=format&fit=crop",
    headline: "Earn Your M.Tech from Karnataka's #1 University",
    description: "Upgrade with an M.Tech in Data Science & AI from PES University. Weekend program designed for professional developers.",
    publisher: "PES University",
    ctaText: "Learn More",
  },
  {
    id: 9,
    image: "https://images.unsplash.com/photo-1516627145497-ae6968895b74?q=80&w=400&auto=format&fit=crop",
    headline: "Help now! A rare heart defect is hurting her.",
    description: "My baby has a serious heart defect and high lung pressure issues. Please help her survive this challenge!",
    publisher: "Give Hope India",
    ctaText: "Donate Now",
  }
];

export default function YouMayLike() {
  return (
    <section className="p-3 w-full pr-[70px] pl-[195px] mb-8">
      {/* Header with Sponsored Logo */}
      <div className="flex items-center justify-between border-b border-gray-200 pb-2.5 mb-6">
        <h2 className="text-sm font-extrabold text-gray-900 tracking-wider">
          YOU MAY LIKE
        </h2>
        <div className="flex items-center gap-1 text-[10px] text-gray-400 font-bold uppercase tracking-wider">
          <span>Sponsored Links by Taboola</span>
          <span className="w-3.5 h-3.5 rounded bg-[#00a2e8] text-white font-extrabold text-[8px] flex items-center justify-center border border-sky-600 cursor-pointer">
            ▷
          </span>
        </div>
      </div>

      {/* Grid Layout (3 Columns on Desktop, collapsing to 2 on Tablet, 1 on Mobile) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {adItemsData.map((ad) => (
          <div key={ad.id} className="group flex flex-col h-full bg-white rounded-lg">
            {/* Thumbnail */}
            <div className="relative aspect-[16/10] w-full overflow-hidden rounded-lg shadow-sm border border-gray-100 mb-3 bg-gray-50">
              <img
                src={ad.image}
                alt={ad.headline}
                className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
                loading="lazy"
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
            <div className="flex items-center justify-between border-t border-gray-100 pt-3 mt-auto">
              <span className="text-xs font-semibold text-gray-400">
                {ad.publisher}
              </span>
              <button className="text-xs font-bold border border-gray-300 rounded px-3.5 py-1 bg-white hover:bg-gray-50 text-gray-800 transition-colors shadow-sm cursor-pointer">
                {ad.ctaText}
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
