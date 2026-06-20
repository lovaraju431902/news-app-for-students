import { Bell, GraduationCap, Mail } from "lucide-react";
import SearchInput from "./SearchInput";


export default function Header() {
    return (
        <header className="bg-card border-b border-gray-200">
            <div className="max-w-[1440px] mx-auto px-4 py-3 flex flex-col md:flex-row md:justify-around gap-4 md:gap-6">
                <div className="w-full md:w-auto flex items-center justify-between">
                    <a href="/" className="flex items-center gap-2.5 shrink-0">
                        <div className="w-11 h-11 rounded-lg bg-gradient-to-br from-primary to-accent-purple grid place-items-center text-white">
                            <GraduationCap className="w-6 h-6" />
                        </div>
                        <div className="leading-tight">
                            <div className="text-[22px] font-extrabold tracking-tight">
                                Students <span className="text-red-600">Hub</span>
                            </div>
                            <div className="text-[11px] text-muted-foreground font-medium">News • Jobs • Tech • Education</div>
                        </div>
                    </a>

                    {/* Actions for Mobile */}
                    <div className="flex md:hidden items-center gap-2 shrink-0">
                        <button className="relative w-9 h-9 grid place-items-center rounded-full bg-muted">
                            <Bell className="w-4 h-4" />
                            <span className="absolute -top-1 -right-1 w-4 h-4 grid place-items-center rounded-full bg-accent-red text-white text-[9px] font-bold">3</span>
                        </button>
                        <button className="h-9 px-3 rounded-lg text-white font-semibold text-xs flex items-center gap-1 bg-blue-600 shadow-md">
                            <Mail className="w-3.5 h-3.5" /> Subscribe
                        </button>
                    </div>
                </div>

                {/* Search Bar */}
                <div className="relative w-full md:flex-1 md:max-w-xl">
                    <SearchInput />
                </div>

                {/* Actions for Desktop */}
                <div className="hidden md:flex  gap-3 shrink-0">
                    <button className="relative w-11 h-11 grid place-items-center rounded-full bg-muted">
                        <Bell className="w-5 h-5" />
                        <span className="absolute -top-1 -right-1 w-5 h-5 grid place-items-center rounded-full bg-accent-red text-white text-[10px] font-bold">3</span>
                    </button>
                    <button className="h-11 px-5 rounded-lg text-white font-semibold text-sm flex items-center gap-2 bg-blue-600 shadow-md">
                        <Mail className="w-4 h-4" /> Subscribe
                    </button>
                </div>
            </div>

        </header>
    );
}