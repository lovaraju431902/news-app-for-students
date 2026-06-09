"use client"
import React from "react";
import { GraduationCap, Send, Mail } from "lucide-react";

export default function Footer() {
  const categories = [
    { name: "Govt Jobs", href: "/tags/govtjobs" },
    { name: "Results", href: "/tags/results" },
    { name: "Admit Cards", href: "/tags/admit-cards" },
    { name: "Scholarships", href: "/tags/scholarships" },
    { name: "Tech News", href: "/tags/tech-news" },
    { name: "Study Tips", href: "/tags/study-tips" },
    { name: "Exam Prep", href: "/tags/exam-prep" }
  ];

  const quickLinks = [
    { name: "About Us", href: "/about" },
    { name: "Contact Us", href: "/contact" },
    { name: "Editorial Policy", href: "/editorial-policy" },
    { name: "Privacy Policy", href: "/privacy-policy" },
    { name: "Terms of Service", href: "/terms-of-service" },
    { name: "Sitemap", href: "/sitemap" }
  ];

  return (
    <footer className="bg-white border-t border-gray-200 text-gray-600 py-12 md:py-16 mt-12 w-full">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-8">
        
        {/* Top Footer Section (4 columns layout) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          
          {/* Column 1: Brand details */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-700 grid place-items-center text-white shrink-0">
                <GraduationCap className="w-5.5 h-5.5" />
              </div>
              <div className="leading-tight text-gray-900">
                <div className="text-xl font-extrabold tracking-tight">
                  Students <span className="text-red-500">Voice</span>
                </div>
                <div className="text-[10px] text-gray-500 font-semibold uppercase">
                  News • Jobs • Tech • Education
                </div>
              </div>
            </div>
            
            <p className="text-xs sm:text-sm text-gray-500 leading-relaxed max-w-sm">
              Students Voice is your premier digital resource for the latest educational announcements, competitive exams notifications, government jobs recruitment alerts, study guides, and career updates.
            </p>

            {/* Social Media Links */}
            <div className="flex items-center gap-3 pt-2">
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

          {/* Column 2: Categories */}
          <div>
            <h3 className="text-gray-900 font-extrabold text-sm tracking-wider uppercase mb-4">
              Categories
            </h3>
            <ul className="space-y-2.5 text-sm">
              {categories.map((cat) => (
                <li key={cat.name}>
                  <a href={cat.href} className="text-gray-500 hover:text-red-600 transition-colors duration-200 block py-0.5">
                    {cat.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Quick Links */}
          <div>
            <h3 className="text-gray-900 font-extrabold text-sm tracking-wider uppercase mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2.5 text-sm">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <a href={link.href} className="text-gray-500 hover:text-red-600 transition-colors duration-200 block py-0.5">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Newsletter */}
          <div className="space-y-4">
            <h3 className="text-gray-900 font-extrabold text-sm tracking-wider uppercase mb-1">
              Subscribe
            </h3>
            <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
              Get weekly updates on job announcements, result declarations, and study tips delivered to your email.
            </p>
            <form onSubmit={(e) => e.preventDefault()} className="flex flex-col gap-2.5 w-full">
              <div className="relative">
                <input
                  type="email"
                  placeholder="Your email address"
                  className="bg-gray-50 border border-gray-200 rounded-lg h-10 pl-10 pr-4 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-gray-900 placeholder-gray-400 w-full transition-all"
                  required
                />
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              </div>
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold h-10 px-4 rounded-lg flex items-center justify-center gap-1.5 transition-colors shadow-sm cursor-pointer"
              >
                Subscribe Now
              </button>
            </form>
          </div>

        </div>

        {/* Bottom copyright bar */}
        <div className="border-t border-gray-200 pt-8 mt-12 flex flex-col md:flex-row items-center justify-between text-xs text-gray-500 gap-4">
          <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4 text-center md:text-left">
            <span>© 2026 Students Voice. All Rights Reserved.</span>
            <span className="hidden md:inline text-gray-200">•</span>
            <a href="/disclaimer" className="text-gray-500 hover:text-red-600 transition-colors">Disclaimer</a>
            <span className="hidden md:inline text-gray-200">•</span>
            <a href="/sitemap.xml" className="text-gray-500 hover:text-red-600 transition-colors">Sitemap XML</a>
          </div>
          <p className="text-center md:text-right text-gray-500">
            Made with ❤️ for students. Empowering learners everywhere.
          </p>
        </div>

      </div>
    </footer>
  );
}
