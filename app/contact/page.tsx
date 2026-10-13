"use client";

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Topbar from "@/components/Homescreen/topbar";
import Header from "@/components/Homescreen/header";
import Navbar from "@/components/Homescreen/Navbar";
import Footer from "@/components/Homescreen/footer";
import { Mail, Phone, MapPin, Send, MessageSquare, Clock } from "lucide-react";

export default function ContactPage() {
  const { data: settings } = useQuery({
    queryKey: ["site-settings"],
    queryFn: async () => {
      const res = await fetch("/api/settings");
      if (!res.ok) throw new Error("Failed to load settings");
      return res.json();
    },
    staleTime: 1000 * 60 * 5,
  });

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const siteName = settings?.general?.siteName || "Students Hub";
  const supportEmail = settings?.general?.supportEmail || "support@studentsvoice.in";
  const contactPhone = settings?.general?.contactPhone || "+91 98765 43210";
  const contactAddress = settings?.general?.contactAddress || "Hyderabad, Telangana, India";
  const workingHours = settings?.general?.workingHours || "Mon - Sat: 9:00 AM - 6:00 PM IST";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

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
              Contact {siteName}
            </h1>
            <p className="mt-3 text-sm sm:text-base text-blue-100 max-w-xl mx-auto">
              Have a query regarding a job notification, exam results, or want to contribute study material? Reach out to our team.
            </p>
          </div>
        </section>

        {/* Content Section */}
        <section className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-8 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">

            {/* Left Column: Contact Information Cards */}
            <div className="lg:col-span-5 space-y-6">
              <h2 className="text-xl md:text-2xl font-extrabold text-gray-900 mb-6">
                Get In Touch
              </h2>

              {/* Email Card */}
              <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-md flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 grid place-items-center shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Email Address</h3>
                  <p className="text-sm text-gray-600 mt-1">For student queries &amp; suggestions:</p>
                  <a href={`mailto:${supportEmail}`} className="text-sm font-semibold text-blue-600 hover:underline block mt-1">
                    {supportEmail}
                  </a>
                </div>
              </div>

              {/* Call Card */}
              <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-md flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 grid place-items-center shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Helpline &amp; Support</h3>
                  <p className="text-sm text-gray-600 mt-1">Available: {workingHours}</p>
                  <a href={`tel:${contactPhone.replace(/\s+/g, '')}`} className="text-sm font-semibold text-emerald-600 hover:underline block mt-1">
                    {contactPhone}
                  </a>
                </div>
              </div>

              {/* Address Card */}
              <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-md flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-purple-50 text-purple-600 grid place-items-center shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Office Location</h3>
                  <p className="text-sm text-gray-600 mt-1 font-medium leading-relaxed">
                    {contactAddress}
                  </p>
                </div>
              </div>

              {/* Working Hours Card */}
              <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-md flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 grid place-items-center shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Working Hours</h3>
                  <p className="text-sm text-gray-600 mt-1 font-medium leading-relaxed">
                    {workingHours}
                  </p>
                </div>
              </div>

            </div>

            {/* Right Column: Contact Form */}
            <div className="lg:col-span-7 bg-white rounded-2xl border border-gray-100 shadow-xl p-8 relative">
              <h2 className="text-xl md:text-2xl font-extrabold text-gray-900 flex items-center gap-2 mb-6">
                <MessageSquare className="w-5.5 h-5.5 text-blue-600" />
                Send Us a Message
              </h2>

              {submitted ? (
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6 text-center space-y-3">
                  <h3 className="text-lg font-bold text-emerald-800">Thank You!</h3>
                  <p className="text-sm text-emerald-700">
                    Your message has been sent successfully. Our editorial team will review your message and reach out to you within 24-48 business hours.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-lg transition-colors cursor-pointer"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="John Doe"
                        className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                        Email Address <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="johndoe@example.com"
                        className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                      Subject <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="e.g. Job Notification Inquiry, Study Material"
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                      Message <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="message"
                      rows={5}
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Write your message here..."
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 resize-none"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg flex items-center justify-center gap-2 transition-colors shadow-lg cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                    Submit Message
                  </button>
                </form>
              )}
            </div>

          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
