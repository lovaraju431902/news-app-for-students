import React from "react";
import Topbar from "@/components/Homescreen/topbar";
import Header from "@/components/Homescreen/header";
import Navbar from "@/components/Homescreen/Navbar";
import Footer from "@/components/Homescreen/footer";
import { GraduationCap, Users, Target, Award, CheckCircle } from "lucide-react";

export const metadata = {
  title: "About Us | Students Hub - Telugu Student News Portal",
  description: "Learn about the mission, values, and story behind Students Hub, the premier platform for government jobs, scholarships, and academic updates in AP and Telangana.",
};

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 text-gray-800">
      <Topbar />
      <Header />
      <Navbar />

      <main className="flex-grow">
        {/* Hero Banner Section */}
        <section className="relative overflow-hidden bg-gradient-to-r from-blue-700 via-blue-800 to-indigo-950 text-white py-16 md:py-24">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]"></div>
          <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-8 relative z-10 text-center">
            <span className="bg-blue-500/20 text-blue-300 text-xs font-bold tracking-widest uppercase px-3 py-1 rounded-full border border-blue-500/30">
              Our Journey & Mission
            </span>
            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight mt-4 max-w-3xl mx-auto leading-tight">
              Empowering Telugu Students for Academic and Career Success
            </h1>
            <p className="mt-6 text-sm sm:text-base md:text-lg text-blue-100 max-w-2xl mx-auto font-normal leading-relaxed">
              Connecting AP and Telangana aspirants with genuine job notifications, results updates, study materials, and career guidance in one single Hub.
            </p>
          </div>
        </section>

        {/* Our Story and Values */}
        <section className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-8 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">

            {/* Left Column: Our Story */}
            <div className="lg:col-span-7 space-y-6">
              <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 border-b-2 border-red-500 pb-3 inline-block">
                The Story Behind Students Hub
              </h2>
              <p className="text-sm sm:text-base leading-relaxed text-gray-600">
                In today's fast-paced digital world, students preparing for exams or searching for careers are often overwhelmed by fake alerts, clickbaits, and disjointed information. This challenge is even greater for students in Andhra Pradesh and Telangana, who require localized updates in accessible formats.
              </p>
              <p className="text-sm sm:text-base leading-relaxed text-gray-600">
                <strong>Students Hub (స్టూడెంట్స్ వాయిస్)</strong> was founded to resolve this problem. We are a dedicated news portal operated by educators and tech professionals with a shared vision: to curate, verify, and broadcast the most accurate academic and competitive exam news directly to Telugu students.
              </p>
              <p className="text-sm sm:text-base leading-relaxed text-gray-600">
                From job alerts published by APPSC, TSPSC, and central departments to notifications from major universities and scholarship programs, we perform rigorous manual verification with official sources before publishing.
              </p>
            </div>

            {/* Right Column: Key Stats Card */}
            <div className="lg:col-span-5 bg-white rounded-2xl border border-gray-100 shadow-xl p-8 space-y-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full filter blur-3xl -z-10"></div>

              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-600" />
                Who We Serve
              </h3>

              <div className="space-y-4">
                <div className="flex gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-gray-900">Job Aspirants</h4>
                    <p className="text-xs text-gray-500 mt-0.5">Telugu youth preparing for state government services (APPSC, TSPSC), Railways, Banking, Defense, and Central Jobs.</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-gray-900">University Students</h4>
                    <p className="text-xs text-gray-500 mt-0.5">Students pursuing degrees, professional programs, and looking for internships or college updates.</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-gray-900">Scholarship Seekers</h4>
                    <p className="text-xs text-gray-500 mt-0.5">Deserving candidates looking for state-sponsored, national, and international financial aid.</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* Pillars / Values Section */}
        <section className="bg-gray-100/60 py-16 border-y border-gray-200/50">
          <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-8">
            <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 text-center mb-12">
              Our Core Principles
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

              {/* Trust/Verification */}
              <div className="bg-white p-6 rounded-xl border border-gray-200/60 hover:shadow-lg transition-shadow duration-300">
                <div className="w-12 h-12 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center mb-4">
                  <Target className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Absolute Accuracy</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  We never publish rumors. Every job, result, or notification is verified against official government gazettes, gazetted notifications, or verified authority portal releases.
                </p>
              </div>

              {/* Relevance */}
              <div className="bg-white p-6 rounded-xl border border-gray-200/60 hover:shadow-lg transition-shadow duration-300">
                <div className="w-12 h-12 rounded-lg bg-red-100 text-red-600 flex items-center justify-center mb-4">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Student Centricity</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Our articles focus on clarity: we translate complex notifications into bulleted guides detailing eligibility, registration steps, deadlines, and application links.
                </p>
              </div>

              {/* Timely Alerts */}
              <div className="bg-white p-6 rounded-xl border border-gray-200/60 hover:shadow-lg transition-shadow duration-300">
                <div className="w-12 h-12 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center mb-4">
                  <Award className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Rapid Reporting</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Time is critical when application deadlines are short. Our notification system alerts students on web portals and social feeds immediately upon official announcements.
                </p>
              </div>

            </div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
