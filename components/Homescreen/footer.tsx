"use client"

import { GraduationCap, Send, Mail } from "lucide-react";

export default function Footer() {
  const categories = [
    { name: "Part Time Income", href: "/part-time-income" },
    { name: "Share Market", href: "/share-market" },
    { name: "Instagram", href: "/instagram" },
    { name: "YouTube Growth", href: "/youtube-growth" },
    { name: "Scholarships", href: "/scholarships" },
    { name: "Current Affairs", href: "/current-affairs" },
    { name: "InternShips", href: "/internships" },
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
            {/* <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-700 grid place-items-center text-white shrink-0">
                <GraduationCap className="w-5.5 h-5.5" />
              </div>
              <div className="leading-tight text-gray-900">
                <div className="text-xl font-extrabold tracking-tight">
                  Students <span className="text-red-500">Hub</span>
                </div>
                <div className="text-[10px] text-gray-500 font-semibold uppercase">
                  News • Jobs • Tech • Education
                </div>
              </div>
            </div> */}


            <a href="/" className="flex items-center gap-2.5 shrink-0">
              <div className="w-11 h-11 rounded-lg bg-gradient-to-br from-red-500 to-red-600   grid place-items-center text-white">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div className="leading-tight">
                <div className="text-[22px] font-extrabold tracking-tight">
                  Students <span className="text-white bg-red-500 px-2 rounded-md">Hub</span>
                </div>
                <div className="text-[11px] text-muted-foreground font-medium">News • Jobs • Tech • Education</div>
              </div>
            </a>

            <p className="text-xs sm:text-sm text-gray-500 leading-relaxed max-w-sm">
              Students Hub is your premier digital resource for the latest educational announcements, competitive exams notifications, government jobs recruitment alerts, study guides, and career updates.
            </p>

            {/* Social Media Links */}
            <div className="flex items-center gap-3 pt-2">
              {/* Facebook */}
              <a href="https://facebook.com" target="_blank" rel="noreferrer" className="w-6 h-6 grid place-items-center rounded bg-[#1877f2] hover:opacity-90 transition-opacity cursor-pointer">
                <svg className="w-3.5 h-3.5 fill-current text-white" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.75z" />
                </svg>
              </a>
              {/* Twitter/X */}
              <a href="https://twitter.com" target="_blank" rel="noreferrer" className="w-6 h-6 grid place-items-center rounded bg-[#000000] hover:opacity-90 border border-white/10 transition-opacity cursor-pointer">
                <svg className="w-3 h-3 fill-current text-white" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              {/* YouTube */}
              <a href="https://youtube.com" target="_blank" rel="noreferrer" className="w-6 h-6 grid place-items-center rounded bg-[#ff0000] hover:opacity-90 transition-opacity cursor-pointer">
                <svg className="w-3.5 h-3.5 fill-current text-white" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.108C19.53 3.5 12 3.5 12 3.5s-7.53 0-9.388.555A3.003 3.003 0 0 0 .502 6.163C0 8.07 0 12 0 12s0 3.93.502 5.837a3.003 3.003 0 0 0 2.11 2.108C4.47 20.5 12 20.5 12 20.5s7.53 0 9.388-.555a3.003 3.003 0 0 0 2.11-2.108C24 15.93 24 12 24 12s0-3.93-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>
              {/* Instagram */}
              {/* <a href="https://instagram.com" target="_blank" rel="noreferrer" className="w-6 h-6 grid place-items-center rounded bg-[#e1306c] hover:opacity-90 transition-opacity cursor-pointer">
                <svg className="w-3.5 h-3.5 fill-current text-white" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
                </svg>*/}










              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="w-6 h-6 grid place-items-center rounded  hover:opacity-90 transition-opacity cursor-pointer">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 264.583 264.583" className="w-6 h-6">
                  <defs>
                    <radialGradient cx="158.429" cy="578.088" r="52.352" fx="158.429" fy="578.088" gradientTransform="matrix(0 -4.03418 4.28018 0 -2332.227 942.236)" gradientUnits="userSpaceOnUse" id="ft-insta-f" xlinkHref="#ft-insta-a" />
                    <radialGradient cx="172.615" cy="600.692" r="65" fx="172.615" fy="600.692" gradientTransform="matrix(.67441 -1.16203 1.51283 .87801 -814.366 -47.835)" gradientUnits="userSpaceOnUse" id="ft-insta-g" xlinkHref="#ft-insta-b" />
                    <radialGradient cx="144.012" cy="51.337" r="67.081" fx="144.012" fy="51.337" gradientTransform="matrix(-2.3989 .67549 -.23008 -.81732 464.996 -26.404)" gradientUnits="userSpaceOnUse" id="ft-insta-h" xlinkHref="#ft-insta-c" />
                    <radialGradient cx="199.788" cy="628.438" r="52.352" fx="199.788" fy="628.438" gradientTransform="matrix(-3.10797 .87652 -.6315 -2.23914 1345.65 1374.198)" gradientUnits="userSpaceOnUse" id="ft-insta-e" xlinkHref="#ft-insta-d" />
                    <linearGradient id="ft-insta-d"><stop offset="0" stopColor="#ff005f" /><stop offset="1" stopColor="#fc01d8" /></linearGradient>
                    <linearGradient id="ft-insta-c"><stop offset="0" stopColor="#780cff" /><stop offset="1" stopColor="#820bff" stopOpacity="0" /></linearGradient>
                    <linearGradient id="ft-insta-b"><stop offset="0" stopColor="#fc0" /><stop offset="1" stopColor="#fc0" stopOpacity="0" /></linearGradient>
                    <linearGradient id="ft-insta-a"><stop offset="0" stopColor="#fc0" /><stop offset=".124" stopColor="#fc0" /><stop offset=".567" stopColor="#fe4a05" /><stop offset=".694" stopColor="#ff0f3f" /><stop offset="1" stopColor="#fe0657" stopOpacity="0" /></linearGradient>
                  </defs>
                  <path fill="url(#ft-insta-e)" d="M204.15 18.143c-55.23 0-71.383.057-74.523.317-11.334.943-18.387 2.728-26.07 6.554-5.922 2.942-10.592 6.351-15.201 11.13-8.394 8.716-13.481 19.439-15.323 32.184-.895 6.188-1.156 7.45-1.209 39.056-.02 10.536 0 24.4 0 42.999 0 55.2.062 71.341.326 74.476.916 11.032 2.645 17.973 6.308 25.565 7 14.533 20.37 25.443 36.12 29.514 5.453 1.404 11.476 2.178 19.208 2.544 3.277.142 36.669.244 70.081.244 33.413 0 66.826-.04 70.02-.203 8.954-.422 14.153-1.12 19.901-2.606 15.852-4.09 28.977-14.838 36.12-29.575 3.591-7.409 5.412-14.614 6.236-25.07.18-2.28.255-38.626.255-74.924 0-36.304-.082-72.583-.26-74.863-.835-10.625-2.656-17.77-6.364-25.32-3.042-6.182-6.42-10.799-11.324-15.519-8.752-8.361-19.455-13.45-32.21-15.29-6.18-.894-7.41-1.158-39.033-1.213z" transform="translate(-71.816 -18.143)" />
                  <path fill="url(#ft-insta-f)" d="M204.15 18.143c-55.23 0-71.383.057-74.523.317-11.334.943-18.387 2.728-26.07 6.554-5.922 2.942-10.592 6.351-15.201 11.13-8.394 8.716-13.481 19.439-15.323 32.184-.895 6.188-1.156 7.45-1.209 39.056-.02 10.536 0 24.4 0 42.999 0 55.2.062 71.341.326 74.476.916 11.032 2.645 17.973 6.308 25.565 7 14.533 20.37 25.443 36.12 29.514 5.453 1.404 11.476 2.178 19.208 2.544 3.277.142 36.669.244 70.081.244 33.413 0 66.826-.04 70.02-.203 8.954-.422 14.153-1.12 19.901-2.606 15.852-4.09 28.977-14.838 36.12-29.575 3.591-7.409 5.412-14.614 6.236-25.07.18-2.28.255-38.626.255-74.924 0-36.304-.082-72.583-.26-74.863-.835-10.625-2.656-17.77-6.364-25.32-3.042-6.182-6.42-10.799-11.324-15.519-8.752-8.361-19.455-13.45-32.21-15.29-6.18-.894-7.41-1.158-39.033-1.213z" transform="translate(-71.816 -18.143)" />
                  <path fill="url(#ft-insta-g)" d="M204.15 18.143c-55.23 0-71.383.057-74.523.317-11.334.943-18.387 2.728-26.07 6.554-5.922 2.942-10.592 6.351-15.201 11.13-8.394 8.716-13.481 19.439-15.323 32.184-.895 6.188-1.156 7.45-1.209 39.056-.02 10.536 0 24.4 0 42.999 0 55.2.062 71.341.326 74.476.916 11.032 2.645 17.973 6.308 25.565 7 14.533 20.37 25.443 36.12 29.514 5.453 1.404 11.476 2.178 19.208 2.544 3.277.142 36.669.244 70.081.244 33.413 0 66.826-.04 70.02-.203 8.954-.422 14.153-1.12 19.901-2.606 15.852-4.09 28.977-14.838 36.12-29.575 3.591-7.409 5.412-14.614 6.236-25.07.18-2.28.255-38.626.255-74.924 0-36.304-.082-72.583-.26-74.863-.835-10.625-2.656-17.77-6.364-25.32-3.042-6.182-6.42-10.799-11.324-15.519-8.752-8.361-19.455-13.45-32.21-15.29-6.18-.894-7.41-1.158-39.033-1.213z" transform="translate(-71.816 -18.143)" />
                  <path fill="url(#ft-insta-h)" d="M204.15 18.143c-55.23 0-71.383.057-74.523.317-11.334.943-18.387 2.728-26.07 6.554-5.922 2.942-10.592 6.351-15.201 11.13-8.394 8.716-13.481 19.439-15.323 32.184-.895 6.188-1.156 7.45-1.209 39.056-.02 10.536 0 24.4 0 42.999 0 55.2.062 71.341.326 74.476.916 11.032 2.645 17.973 6.308 25.565 7 14.533 20.37 25.443 36.12 29.514 5.453 1.404 11.476 2.178 19.208 2.544 3.277.142 36.669.244 70.081.244 33.413 0 66.826-.04 70.02-.203 8.954-.422 14.153-1.12 19.901-2.606 15.852-4.09 28.977-14.838 36.12-29.575 3.591-7.409 5.412-14.614 6.236-25.07.18-2.28.255-38.626.255-74.924 0-36.304-.082-72.583-.26-74.863-.835-10.625-2.656-17.77-6.364-25.32-3.042-6.182-6.42-10.799-11.324-15.519-8.752-8.361-19.455-13.45-32.21-15.29-6.18-.894-7.41-1.158-39.033-1.213z" transform="translate(-71.816 -18.143)" />
                  <path fill="#fff" d="M132.345 33.973c-26.716 0-30.07.117-40.563.594-10.472.48-17.62 2.136-23.876 4.567-6.47 2.51-11.958 5.87-17.426 11.335-5.472 5.464-8.834 10.948-11.354 17.412-2.44 6.252-4.1 13.397-4.57 23.858-.47 10.486-.593 13.838-.593 40.535 0 26.697.119 30.037.594 40.522.482 10.465 2.14 17.609 4.57 23.859 2.515 6.465 5.876 11.95 11.346 17.414 5.466 5.468 10.955 8.834 17.42 11.345 6.26 2.431 13.41 4.088 23.881 4.567 10.493.477 13.844.594 40.559.594 26.719 0 30.061-.117 40.555-.594 10.472-.48 17.63-2.136 23.888-4.567 6.468-2.51 11.948-5.877 17.414-11.345 5.472-5.464 8.834-10.949 11.354-17.412 2.419-6.252 4.079-13.398 4.57-23.858.472-10.486.595-13.828.595-40.525s-.123-30.047-.594-40.533c-.492-10.465-2.152-17.608-4.57-23.858-2.521-6.466-5.883-11.95-11.355-17.414-5.472-5.468-10.944-8.827-17.42-11.335-6.271-2.431-13.424-4.088-23.897-4.567-10.493-.477-13.834-.594-40.558-.594zm-8.825 17.715c2.62-.004 5.542 0 8.825 0 26.266 0 29.38.094 39.752.565 9.591.438 14.797 2.04 18.264 3.385 4.591 1.782 7.864 3.912 11.305 7.352 3.443 3.44 5.575 6.717 7.362 11.305 1.346 3.46 2.951 8.663 3.388 18.247.47 10.363.573 13.475.573 39.71 0 26.233-.102 29.346-.573 39.709-.44 9.584-2.042 14.786-3.388 18.247-1.783 4.587-3.919 7.854-7.362 11.292-3.443 3.441-6.712 5.57-11.305 7.352-3.463 1.352-8.673 2.95-18.264 3.388-10.37.47-13.486.573-39.752.573-26.268 0-29.38-.102-39.751-.573-9.592-.443-14.797-2.044-18.267-3.39-4.59-1.781-7.87-3.911-11.313-7.352-3.443-3.44-5.574-6.709-7.362-11.298-1.346-3.461-2.95-8.663-3.387-18.247-.472-10.363-.566-13.476-.566-39.726s.094-29.347.566-39.71c.438-9.584 2.04-14.786 3.387-18.25 1.783-4.588 3.919-7.865 7.362-11.305 3.443-3.441 6.722-5.57 11.313-7.357 3.468-1.351 8.675-2.949 18.267-3.389 9.075-.41 12.592-.532 30.926-.553zm61.337 16.322c-6.518 0-11.805 5.277-11.805 11.792 0 6.512 5.287 11.796 11.805 11.796 6.517 0 11.804-5.284 11.804-11.796 0-6.513-5.287-11.796-11.805-11.796zm-52.512 13.782c-27.9 0-50.519 22.603-50.519 50.482 0 27.879 22.62 50.471 50.52 50.471s50.51-22.592 50.51-50.471c0-27.879-22.613-50.482-50.513-50.482zm0 17.715c18.11 0 32.792 14.67 32.792 32.767 0 18.096-14.683 32.767-32.792 32.767-18.11 0-32.791-14.671-32.791-32.767 0-18.098 14.68-32.767 32.791-32.767z" />
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
                  suppressHydrationWarning
                />
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              </div>
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold h-10 px-4 rounded-lg flex items-center justify-center gap-1.5 transition-colors shadow-sm cursor-pointer"
                suppressHydrationWarning
              >
                Subscribe Now
              </button>
            </form>
          </div>

        </div>

        {/* Bottom copyright bar */}
        <div className="border-t border-gray-200 pt-8 mt-12 flex flex-col md:flex-row items-center justify-between text-xs text-gray-500 gap-4">
          <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4 text-center md:text-left">
            <span>© 2026 Students Hub. All Rights Reserved.</span>
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
