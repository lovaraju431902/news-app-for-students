import React from "react";
import Topbar from "@/components/Homescreen/topbar";
import Header from "@/components/Homescreen/header";
import Navbar from "@/components/Homescreen/Navbar";
import Footer from "@/components/Homescreen/footer";
import { Scale, FileWarning, HelpCircle, AlertTriangle } from "lucide-react";

export const metadata = {
  title: "Terms of Service | Students Hub",
  description: "Read the terms and conditions, guidelines, and disclaimers governing the use of Students Hub.",
};

export default function TermsOfServicePage() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 text-gray-800">
      <Topbar />
      <Header />
      <Navbar />

      <main className="flex-grow">
        {/* Banner Section */}
        <section className="bg-gradient-to-r from-blue-700 via-blue-800 to-indigo-950 text-white py-12">
          <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-8 text-center">
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
              Terms of Service
            </h1>
            <p className="mt-3 text-sm sm:text-base text-blue-100 max-w-xl mx-auto">
              Please read these terms carefully before using the Students Hub news portal and services.
            </p>
          </div>
        </section>

        {/* Content Section */}
        <section className="max-w-[800px] mx-auto px-4 sm:px-6 py-16">
          <article className="prose prose-blue max-w-none space-y-8 text-gray-600">

            {/* Disclaimer Alert */}
            <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-lg flex gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div className="text-xs sm:text-sm text-amber-800">
                <strong>IMPORTANT DISCLAIMER:</strong> Students Hub is an independent news aggregator. We are not a government entity, recruiting board, or academic board. We do not issue government jobs, intermediate results, or admit cards ourselves.
              </div>
            </div>

            {/* 1. Acceptance */}
            <div className="space-y-4">
              <h2 className="text-2xl font-extrabold text-gray-900 flex items-center gap-2">
                <Scale className="w-6 h-6 text-blue-600" />
                1. Acceptance of Terms
              </h2>
              <p className="text-sm sm:text-base leading-relaxed">
                By accessing and using <strong>Students Hub</strong>, you accept and agree to be bound by the terms and conditions outlined here. If you do not agree to these terms, you should not access or use the portal.
              </p>
            </div>

            {/* 2. Educational Disclaimer */}
            <div className="space-y-4">
              <h2 className="text-2xl font-extrabold text-gray-900 flex items-center gap-2">
                <FileWarning className="w-6 h-6 text-blue-600" />
                2. Information Accuracy & Limitation of Liability
              </h2>
              <p className="text-sm sm:text-base leading-relaxed">
                While we make every effort to verify job advertisements, examination results, and scholarship eligibility criteria, the content is provided for informational and educational purposes only.
              </p>
              <p className="text-sm sm:text-base leading-relaxed">
                Candidates must reference the official notification documents and consult directly with the respective recruiting commission (e.g. APPSC, TSPSC) or university board before submitting paid registrations or applications. Students Hub is not liable for any financial loss, rejected applications, or missed opportunities arising from discrepancies in our content.
              </p>
            </div>

            {/* 3. User Conduct */}
            <div className="space-y-4">
              <h2 className="text-2xl font-extrabold text-gray-900 flex items-center gap-2">
                <HelpCircle className="w-6 h-6 text-blue-600" />
                3. Permitted & Prohibited Conduct
              </h2>
              <p className="text-sm sm:text-base leading-relaxed">
                You are granted a limited license to access our study materials, articles, and syllabus analyses for personal, non-commercial educational use. You agree not to:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-sm sm:text-base">
                <li>Automate scripts or scrape contents from our web servers.</li>
                <li>Redistribute or republish entire database sets of our compiled study materials on other commercial platforms without written consent.</li>
                <li>Post abusive, spam, or misleading comments on article pages.</li>
              </ul>
            </div>

            {/* 4. Copyright */}
            <div className="space-y-4">
              <h2 className="text-2xl font-extrabold text-gray-900 flex items-center gap-2">
                <Scale className="w-6 h-6 text-blue-600" />
                4. Intellectual Property
              </h2>
              <p className="text-sm sm:text-base leading-relaxed">
                All editorial layouts, logo marks, custom guides, and compiled PDFs published on Students Hub are protected under copyright laws. However, official government notifications, PDF circulars, and university announcements hosted or linked on our site remain the intellectual property of their respective boards or commissions.
              </p>
            </div>

          </article>
        </section>
      </main>

      <Footer />
    </div>
  );
}
