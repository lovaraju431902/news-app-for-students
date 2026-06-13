import { govtJobs, studyImg, aiRobot, youtubeImg } from "@/utils/images";
import { useQuery } from "@tanstack/react-query";
import { Flame, ChevronRight, CalendarDays, Clock } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useEffect } from "react";





type Latestnews = {
    id: string;
    title: string;
    image: string;
    read: string;
    date: string;
    tag: string;
    tagColor: string;
    href: string;
    isActive: boolean;
    createdAt?: Date;
    updatedAt?: Date;
};

type LatestNewsResponse = {
    data: Latestnews[];
};

export default function LatestNews() {


    const getLatestnews = async (): Promise<LatestNewsResponse> => {
        const response = await fetch("/api/latestnews");

        if (!response.ok) {
            throw new Error("Failed to fetch latestnews");
        }

        return response.json();
    };



    const {
        data,
        isLoading,
        error,
    } = useQuery({
        queryKey: ["latestnews"],
        queryFn: getLatestnews,
    });


    useEffect(() => {
        if (data) {

            console.log("1 st data", data.data)

        }
    }, [data?.data]);


    const items = data?.data || [];

    if (isLoading) {
        return (
            <>
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2 animate-pulse">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="bg-card border border-border rounded-xl overflow-hidden flex flex-col justify-between min-h-[200px]">
                            <div>
                                <div className="relative h-36 bg-zinc-200 dark:bg-zinc-800" />
                                <div className="p-2 space-y-1.5">
                                    <div className="h-4 w-5/6 bg-zinc-200 dark:bg-zinc-800 rounded" />
                                    <div className="h-4 w-2/3 bg-zinc-200 dark:bg-zinc-800 rounded" />
                                </div>
                            </div>
                            <div className="p-2">
                                <div className="flex items-center justify-between">
                                    <div className="h-3 w-12 bg-zinc-200 dark:bg-zinc-800 rounded" />
                                    <div className="h-3 w-12 bg-zinc-200 dark:bg-zinc-800 rounded" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>


            </>
        )
    }



    return (
        <section className="p-3">
            <div className="flex items-center justify-between mb-3">
                <h2 className="text-xl font-extrabold flex items-center gap-2"><Flame className="w-5 h-5 text-accent-red" /> Latest News</h2>
                <a className="text-sm cursor-pointer font-semibold text-blue-600 flex items-center gap-2 px-4 py-1">View All</a>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2">
                {items.map((it) => (
                    <div key={it.title} className="bg-card border border-border rounded-xl overflow-hidden hover:shadow-lg transition-shadow flex flex-col justify-between min-h-[200px]">
                        <Link href={it.href}>
                            <div>

                                <div className="relative h-36">
                                    <Image
                                        src={it.image}
                                        alt={it.title}
                                        fill
                                        className="object-cover"
                                        sizes="(max-width: 768px) 50vw, 250px"
                                    />
                                    <span className={`absolute top-2 left-2 ${it.tagColor} text-white text-[10px] font-bold px-2 py-0.5 rounded`}>{it.tag}</span>
                                </div>
                                <div className="p-2">
                                    <h3 className="font-bold leading-snug text-sm">{it.title}</h3>
                                </div>
                            </div>
                        </Link>
                        <div className="p-2 md:p-4 ">
                            <div className="text-[10px] gap-2 text-muted-foreground  flex md:items-center md:justify-between ">
                                <span className="flex md:gap-2"><CalendarDays className="w-3.5 h-3.5" />{it.date}</span>
                                <span className="flex md:gap-2"><Clock className="w-3.5 h-3.5" />{it.read}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}