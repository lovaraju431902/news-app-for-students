import { FileText, GraduationCap, Info, Mail, Megaphone, Newspaper, PenSquare, Zap } from "lucide-react";

export default function Topbar() {


    const trending = [
        { icon: Zap, label: "SSC CGL 2024 Notification Out", color: "text-accent-yellow" },
        { icon: FileText, label: "AP Inter Results 2024", color: "text-accent-blue" },
        { icon: GraduationCap, label: "TS TET Notification", color: "text-accent-green" },
        { icon: Newspaper, label: "JNTU Updates", color: "text-accent-pink" },
    ];

    return (





        <div className="bg-black text-white text-xs">
            <div className="max-w-[1440px] mx-auto px-4 h-9 flex items-center gap-6 overflow-hidden">
                <span className="bg-red-600 text-white font-bold px-2.5 py-1 rounded shrink-0">TRENDING:</span>
                <div className="flex items-center gap-6 overflow-hidden">
                    {trending.map((t, i) => (
                        <span key={i} className="flex items-center gap-1.5 shrink-0">
                            <t.icon className={`w-3.5 h-3.5 ${t.color}`} />
                            <span className="text-white/90">{t.label}</span>
                        </span>
                    ))}
                </div>
                <div className="ml-auto hidden md:flex items-center gap-5 shrink-0">
                    <a className="flex items-center gap-1 hover:text-white/80"><Info className="w-3.5 h-3.5" />About Us</a>
                    <a className="flex items-center gap-1 hover:text-white/80"><Mail className="w-3.5 h-3.5" />Contact</a>
                    <a className="flex items-center gap-1 hover:text-white/80"><PenSquare className="w-3.5 h-3.5" />Write for Us</a>
                    <a className="flex items-center gap-1 hover:text-white/80"><Megaphone className="w-3.5 h-3.5" />Advertise</a>
                    <div className="flex items-center gap-2 pl-3 border-l border-white/15">
                        {/* Facebook */}
                        <a href="https://facebook.com" target="_blank" rel="noreferrer" className="w-6 h-6 grid place-items-center rounded bg-[#1877f2] hover:opacity-90 transition-opacity cursor-pointer">
                            <svg className="w-3.5 h-3.5 fill-current text-white" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.75z"/>
                            </svg>
                        </a>
                        {/* Twitter/X */}
                        <a href="https://twitter.com" target="_blank" rel="noreferrer" className="w-6 h-6 grid place-items-center rounded bg-[#000000] hover:opacity-90 border border-white/10 transition-opacity cursor-pointer">
                            <svg className="w-3 h-3 fill-current text-white" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                            </svg>
                        </a>
                        {/* YouTube */}
                        <a href="https://youtube.com" target="_blank" rel="noreferrer" className="w-6 h-6 grid place-items-center rounded bg-[#ff0000] hover:opacity-90 transition-opacity cursor-pointer">
                            <svg className="w-3.5 h-3.5 fill-current text-white" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.108C19.53 3.5 12 3.5 12 3.5s-7.53 0-9.388.555A3.003 3.003 0 0 0 .502 6.163C0 8.07 0 12 0 12s0 3.93.502 5.837a3.003 3.003 0 0 0 2.11 2.108C4.47 20.5 12 20.5 12 20.5s7.53 0 9.388-.555a3.003 3.003 0 0 0 2.11-2.108C24 15.93 24 12 24 12s0-3.93-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                            </svg>
                        </a>
                        {/* Instagram */}
                        <a href="https://instagram.com" target="_blank" rel="noreferrer" className="w-6 h-6 grid place-items-center rounded bg-[#e1306c] hover:opacity-90 transition-opacity cursor-pointer">
                            <svg className="w-3.5 h-3.5 fill-current text-white" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
                            </svg>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
