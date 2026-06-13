import React from "react";
import Topbar from "@/components/Homescreen/topbar";
import Header from "@/components/Homescreen/header";
import Navbar from "@/components/Homescreen/Navbar";
import Footer from "@/components/Homescreen/footer";
import { BookOpen, FileCheck, RefreshCw, Eye } from "lucide-react";

export const metadata = {
  title: "Editorial Policy | Students Hub",
  description: "Read about our guidelines on accuracy, official verification, correction policy, and transparency at Students Hub.",
};

export default function EditorialPolicyPage() {
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
              Editorial Policy
            </h1>
            <p className="mt-3 text-sm sm:text-base text-blue-100 max-w-xl mx-auto">
              Our commitment to delivering highly accurate, verified, and transparent educational updates for Telugu students.
            </p>
          </div>
        </section>

        {/* Content Section */}
        <section className="max-w-[800px] mx-auto px-4 sm:px-6 py-16">
          <article className="prose prose-blue max-w-none space-y-8 text-gray-600">

            {/* Overview */}
            <div className="space-y-4">
              <h2 className="text-2xl font-extrabold text-gray-900 flex items-center gap-2">
                <BookOpen className="w-6 h-6 text-blue-600" />
                1. Journalistic Mission
              </h2>
              <p className="text-sm sm:text-base leading-relaxed">
                At <strong>Students Hub (స్టూడెంట్స్ వాయిస్)</strong>, we recognize that the careers and academic lives of young aspirants depend on the information we provide. A single typo in a deadline date, or an incorrect qualification criteria listing, can cost students their application opportunities.
              </p>
              <p className="text-sm sm:text-base leading-relaxed">
                Hence, we hold ourselves to rigorous standards of accuracy, objectivity, and transparency.
              </p>
            </div>

            {/* Verification & Fact-checking */}
            <div className="space-y-4">
              <h2 className="text-2xl font-extrabold text-gray-900 flex items-center gap-2">
                <FileCheck className="w-6 h-6 text-blue-600" />
                2. Fact-Checking & Sourcing
              </h2>
              <p className="text-sm sm:text-base leading-relaxed">
                We enforce a zero-rumor policy. Before any article or post is made public, it must pass verification checks against official releases:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-sm sm:text-base">
                <li>
                  <strong>Official Gazettes:</strong> Job notifications are verified against official gazette publications issued by central or state government recruiting boards (e.g., UPSC, SSC, APPSC, TSPSC, RRB).
                </li>
                <li>
                  <strong>Direct Board Releases:</strong> Results, answer keys, and admit cards are referenced exclusively from the official subdomains of the respective examination boards.
                </li>
                <li>
                  <strong>Primary Sourcing:</strong> When summarizing university admission cycles or intermediate board announcements, we reference the official press releases issued directly by university registrars or board controllers.
                </li>
              </ul>
              <p className="text-sm sm:text-base leading-relaxed">
                Every news story summarizing a job or a notification contains a direct link back to the official notification PDF and the official application web portal.
              </p>
            </div>

            {/* Corrections */}
            <div className="space-y-4">
              <h2 className="text-2xl font-extrabold text-gray-900 flex items-center gap-2">
                <RefreshCw className="w-6 h-6 text-blue-600" />
                3. Corrections & Updates Policy
              </h2>
              <p className="text-sm sm:text-base leading-relaxed">
                Despite our best efforts, errors may occasionally occur. When an error is identified:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-sm sm:text-base">
                <li>
                  We rectify the mistake immediately upon verification.
                </li>
                <li>
                  A correction notice is appended at the top of the corrected article, explaining the exact correction made to prevent misleading candidates who had read the previous version.
                </li>
                <li>
                  If you spot an error in any of our reports, please email us directly at <a href="mailto:support@studentsHub.in" className="text-blue-600 hover:underline">support@studentsHub.in</a> with the URL and specific corrections.
                </li>
              </ul>
            </div>

            {/* Transparency & Ads */}
            <div className="space-y-4">
              <h2 className="text-2xl font-extrabold text-gray-900 flex items-center gap-2">
                <Eye className="w-6 h-6 text-blue-600" />
                4. Independence & Neutrality
              </h2>
              <p className="text-sm sm:text-base leading-relaxed">
                Students Hub operates as an independent news platform. We are not affiliated with APPSC, TSPSC, or any government department.
              </p>
              <p className="text-sm sm:text-base leading-relaxed">
                All editorial recommendations, study materials, and guidelines are formulated solely based on merit, competitive utility, and student relevance. Commercial partnerships or display advertising do not influence our syllabus breakdowns, exam reviews, or eligibility analyses.
              </p>
            </div>

          </article>
        </section>
      </main>

      <Footer />
    </div>
  );
}
