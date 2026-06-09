import Link from "next/link";
import {
    Award,
    BookOpen,
    Briefcase,
    Code,
    GraduationCap,
    IdCard,
    Lightbulb,
    Zap,

} from "lucide-react";

export default function Categoryrow() {
    const items = [
        {
            icon: Briefcase,
            label: "Govt Jobs",
            href: "/tags/govtjobs",
            color: "bg-green-100 text-green-600",
        },
        {
            icon: Award,
            label: "Results",
            href: "/tags/results",
            color: "bg-purple-100 text-purple-600",
        },
        {
            icon: IdCard,
            label: "Admit Cards",
            href: "/tags/admit-cards",
            color: "bg-blue-100 text-blue-600",
        },
        {
            icon: GraduationCap,
            label: "Scholarships",
            href: "/tags/scholarships",
            color: "bg-orange-100 text-orange-600",
        },
        {
            icon: Zap,
            label: "Tech News",
            href: "/tags/tech-news",
            color: "bg-pink-100 text-pink-600",
        },
        {
            icon: BookOpen,
            label: "Study Material",
            href: "/tags/study-material",
            color: "bg-cyan-100 text-cyan-600",
        },
        {
            icon: Lightbulb,
            label: "Exam Prep",
            href: "/tags/exam-prep",
            color: "bg-red-100 text-red-600",
        },
        {
            icon: Lightbulb,
            label: "YouTube Tips",
            href: "/tags/youtube-tips",
            color: "bg-rose-100 text-rose-600",
        },

    ];

    return (
        <div className="flex gap-3 bg-white overflow-x-auto whitespace-nowrap scrollbar-none [&::-webkit-scrollbar]:hidden pb-1 px-1">
            {items.map((i) => (
                <Link
                    key={i.label}
                    href={i.href}
                    className="shadow-sm border px-2.5 border-gray-100 py-2.5 rounded-xl flex items-center gap-2 hover:shadow-md transition-shadow shrink-0"
                >
                    <span
                        className={`w-7 h-7 rounded-md grid place-items-center ${i.color} shrink-0`}
                    >
                        <i.icon className="w-4 h-4" />
                    </span>
                    <span className="text-xs font-semibold">{i.label}</span>
                </Link>
            ))}
        </div>
    );
}