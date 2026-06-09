import { govtJobs, studyImg, aiRobot, youtubeImg } from "@/utils/images";
import { Flame, ChevronRight, CalendarDays, Clock } from "lucide-react";

export default function LatestNews() {
    const items = [
        { tag: "GOVT JOBS", tagColor: "bg-green-600", img: govtJobs.src, title: "SSC CGL 2024 Notification Released for 17727 Vacancies", date: "May 25, 2024", read: "3 min read" },
        { tag: "STUDY TIPS", tagColor: "bg-orange-600", img: studyImg.src, title: "How to Prepare for Competitive Exams While College Studies", date: "May 24, 2024", read: "4 min read" },
        { tag: "TECH NEWS", tagColor: "bg-purple-600", img: aiRobot.src, title: "Top 5 AI Tools Every Student Must Use in 2024", date: "May 23, 2024", read: "3 min read" },
        { tag: "YOUTUBE TIPS", tagColor: "bg-red-600", img: youtubeImg.src, title: "How to Grow YouTube Channel as a Student in 2024", date: "May 22, 2024", read: "4 min read" },
    ];
    return (
        <section className="p-3">
            <div className="flex items-center justify-between mb-3">
                <h2 className="text-xl font-extrabold flex items-center gap-2"><Flame className="w-5 h-5 text-accent-red" /> Latest News</h2>
                <a className="text-sm cursor-pointer font-semibold text-blue-600 flex items-center gap-2 px-4 py-1">View All</a>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2">
                {items.map((it) => (
                    <div key={it.title} className="bg-card border border-border rounded-xl overflow-hidden hover:shadow-lg transition-shadow flex flex-col justify-between min-h-[200px]">
                        <div>
                            <div className="relative h-36">
                                <img src={it.img} alt={it.title} className="w-full h-full object-cover" loading="lazy" width={768} height={512} />
                                <span className={`absolute top-2 left-2 ${it.tagColor} text-white text-[10px] font-bold px-2 py-0.5 rounded`}>{it.tag}</span>
                            </div>
                            <div className="p-2">
                                <h3 className="font-bold leading-snug text-sm">{it.title}</h3>
                            </div>
                        </div>
                        <div className="p-2 md:p-4 ">
                            <div className="text-[10px] gap-2 text-muted-foreground  flex md:items-center md:justify-between ">
                                <span className="flex"><CalendarDays className="w-3.5 h-3.5" />{it.date}</span>
                                <span className="flex"><Clock className="w-3.5 h-3.5" />{it.read}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}