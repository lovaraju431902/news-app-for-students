"use client";

import React, { useState } from "react";
import Topbar from "@/components/Homescreen/topbar";
import Header from "@/components/Homescreen/header";
import Navbar from "@/components/Homescreen/Navbar";
import Footer from "@/components/Homescreen/footer";
import { Mail, Phone, MapPin, Send, MessageSquare } from "lucide-react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real application, submit data to backend action or API route.
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
              Contact Students Hub
            </h1>
            <p className="mt-3 text-sm sm:text-base text-blue-100 max-w-xl mx-auto">
              Have a query regarding a job notification? Noticed a mistake? Or want to contribute study material? Reach out to us.
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
                  <p className="text-sm text-gray-600 mt-1">For general queries & suggestions:</p>
                  <a href="mailto:support@studentsHub.in" className="text-sm font-semibold text-blue-600 hover:underline block mt-1">
                    support@studentsHub.in
                  </a>
                </div>
              </div>

              {/* Call Card */}
              <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-md flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 grid place-items-center shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Student Support Line</h3>
                  <p className="text-sm text-gray-600 mt-1">Available Mon-Fri, 10 AM - 5 PM:</p>
                  <a href="tel:+91401234567" className="text-sm font-semibold text-emerald-600 hover:underline block mt-1">
                    +91 40 1234 567
                  </a>
                </div>
              </div>

              {/* Address Card */}
              <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-md flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-purple-50 text-purple-600 grid place-items-center shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Corporate Office</h3>
                  <p className="text-sm text-gray-600 mt-1">Students Hub Media Group</p>
                  <p className="text-sm text-gray-600 mt-1 font-medium leading-relaxed">
                    Plot No. 42, Hitech City Main Road,<br />
                    Madhapur, Hyderabad, Telangana - 500081
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
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-lg transition-colors"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <label htmlFor="name" className="text-xs font-bold text-gray-700 uppercase">Your Name</label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full h-10 px-3.5 bg-gray-50 border border-gray-250 rounded-lg text-xs sm:text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                        placeholder="Enter your name"
                        required
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label htmlFor="email" className="text-xs font-bold text-gray-700 uppercase">Email Address</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full h-10 px-3.5 bg-gray-50 border border-gray-250 rounded-lg text-xs sm:text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                        placeholder="Enter email address"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="subject" className="text-xs font-bold text-gray-700 uppercase">Subject</label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full h-10 px-3.5 bg-gray-50 border border-gray-250 rounded-lg text-xs sm:text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                      placeholder="Feedback, job queries, errors, etc."
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="message" className="text-xs font-bold text-gray-700 uppercase">Message</label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows={5}
                      className="w-full p-3.5 bg-gray-50 border border-gray-250 rounded-lg text-xs sm:text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none"
                      placeholder="Describe your inquiry in detail..."
                      required
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs sm:text-sm h-11 rounded-lg flex items-center justify-center gap-2 transition-colors shadow-md cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                    Send Message
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
