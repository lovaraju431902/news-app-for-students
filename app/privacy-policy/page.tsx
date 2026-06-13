import React from "react";
import Topbar from "@/components/Homescreen/topbar";
import Header from "@/components/Homescreen/header";
import Navbar from "@/components/Homescreen/Navbar";
import Footer from "@/components/Homescreen/footer";
import { Shield, Eye, Lock, FileText } from "lucide-react";

export const metadata = {
  title: "Privacy Policy | Students Hub",
  description: "Understand how we collect, protect, and use your personal information when visiting Students Hub.",
};

export default function PrivacyPolicyPage() {
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
              Privacy Policy
            </h1>
            <p className="mt-3 text-sm sm:text-base text-blue-100 max-w-xl mx-auto">
              Effective Date: June 13, 2026. How we manage and safeguard student data.
            </p>
          </div>
        </section>

        {/* Content Section */}
        <section className="max-w-[800px] mx-auto px-4 sm:px-6 py-16">
          <article className="prose prose-blue max-w-none space-y-8 text-gray-600">

            {/* 1. Introduction */}
            <div className="space-y-4">
              <h2 className="text-2xl font-extrabold text-gray-900 flex items-center gap-2">
                <Shield className="w-6 h-6 text-blue-600" />
                1. Overview & Commitment
              </h2>
              <p className="text-sm sm:text-base leading-relaxed">
                At <strong>Students Hub</strong>, accessible from <a href="/" className="text-blue-600 hover:underline">studentsHub.in</a>, the privacy of our visitors is of paramount importance. This Privacy Policy document outlines the types of personal data we collect and record, and how we utilize it.
              </p>
              <p className="text-sm sm:text-base leading-relaxed">
                If you have additional questions or require more information about our Privacy Policy, do not hesitate to contact us at <a href="mailto:support@studentsHub.in" className="text-blue-600 hover:underline">support@studentsHub.in</a>.
              </p>
            </div>

            {/* 2. Info Collection */}
            <div className="space-y-4">
              <h2 className="text-2xl font-extrabold text-gray-900 flex items-center gap-2">
                <Eye className="w-6 h-6 text-blue-600" />
                2. Information We Collect
              </h2>
              <p className="text-sm sm:text-base leading-relaxed">
                We collect information in the following ways to serve you better updates:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-sm sm:text-base">
                <li>
                  <strong>Newsletter Subscriptions:</strong> If you subscribe to our weekly newsletter alerts, we collect your email address.
                </li>
                <li>
                  <strong>Log Files:</strong> Students Hub follows a standard procedure of using log files. These files log visitors when they visit websites. The information collected by log files includes internet protocol (IP) addresses, browser type, Internet Service Provider (ISP), date/time stamps, referring/exit pages, and click counts. These are not linked to personally identifiable information.
                </li>
                <li>
                  <strong>Cookies:</strong> Like any other website, we use "cookies" to store preferences and page paths visited by our users to optimize custom homepage preferences.
                </li>
              </ul>
            </div>

            {/* 3. Data Protection */}
            <div className="space-y-4">
              <h2 className="text-2xl font-extrabold text-gray-900 flex items-center gap-2">
                <Lock className="w-6 h-6 text-blue-600" />
                3. How We Protect & Use Data
              </h2>
              <p className="text-sm sm:text-base leading-relaxed">
                We implement industry-standard encryption protocols to safeguard email IDs. We use the information we collect in various ways, including to:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-sm sm:text-base">
                <li>Provide, operate, and maintain our website.</li>
                <li>Improve, personalize, and expand our educational services.</li>
                <li>Understand and analyze how you use our portal.</li>
                <li>Develop new resources, features, and study tools.</li>
                <li>Send you newsletters regarding fresh job notification updates and intermediate or board university results.</li>
              </ul>
            </div>

            {/* 4. Third-Party services */}
            <div className="space-y-4">
              <h2 className="text-2xl font-extrabold text-gray-900 flex items-center gap-2">
                <FileText className="w-6 h-6 text-blue-600" />
                4. Third-Party Advertisers & Services
              </h2>
              <p className="text-sm sm:text-base leading-relaxed">
                We utilize third-party vendors and advertising programs, such as Google AdSense, to display ads when you visit our website. These advertisers may use DART cookies to serve ads based on your visit to our site and other sites on the Internet.
              </p>
              <p className="text-sm sm:text-base leading-relaxed">
                Note that Students Hub has no access to or control over cookies that are used by third-party advertisers. You may consult the respective Privacy Policies of these third-party ad servers for more detailed info or instructions on how to opt-out.
              </p>
            </div>

          </article>
        </section>
      </main>

      <Footer />
    </div>
  );
}
