import React from "react";
import Link from "next/link";
import Topbar from "@/components/Homescreen/topbar";
import Header from "@/components/Homescreen/header";
import Navbar from "@/components/Homescreen/Navbar";
import Footer from "@/components/Homescreen/footer";
import { SUBSCRIPTION_PLAN } from "@/lib/payments/config";
import { Check, Crown, Shield, Sparkles, ArrowRight, HelpCircle } from "lucide-react";
import { getAccessLevel } from "@/lib/subscription/access";

export const metadata = {
  title: "Pricing & Plans | Students Hub Premium",
  description: "Get unlimited access to all premium articles, study materials, and career notifications for ₹399/month.",
};

export default async function PricingPage() {
  const access = await getAccessLevel();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 flex flex-col font-sans">
      <Topbar />
      <Header />
      <Navbar />

      <main className="flex-grow py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full">
        {/* Title */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-700 dark:text-amber-400 text-xs font-bold uppercase tracking-wider mb-4">
            <Crown className="w-4 h-4 fill-amber-500 text-amber-500" />
            <span>Simple, Transparent Pricing</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-950 dark:text-white tracking-tight">
            Invest in Your Career & Education
          </h1>
          <p className="mt-4 text-base text-gray-600 dark:text-zinc-400">
            One monthly membership. Full, unrestricted access to every premium article, verified job circular, and study guide.
          </p>
        </div>

        {/* Pricing Card */}
        <div className="max-w-md mx-auto bg-white dark:bg-zinc-900 rounded-3xl border-2 border-amber-400/80 dark:border-amber-500/60 shadow-2xl p-8 sm:p-10 relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-gradient-to-l from-amber-500 to-yellow-500 text-black text-xs font-black uppercase tracking-wider py-1.5 px-4 rounded-bl-xl shadow-xs">
            Most Popular
          </div>

          <div className="flex items-center gap-2 text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
            <Sparkles className="w-4 h-4 fill-current" />
            <span>Monthly Subscription</span>
          </div>

          <div className="mt-4 flex items-baseline gap-1">
            <span className="text-4xl sm:text-5xl font-black text-gray-950 dark:text-white">
              ₹{SUBSCRIPTION_PLAN.priceInINR}
            </span>
            <span className="text-sm font-semibold text-gray-500 dark:text-zinc-400">/ month</span>
          </div>

          <p className="mt-3 text-xs text-gray-500 dark:text-zinc-400 leading-relaxed">
            Auto-renews monthly via Razorpay. Cancel anytime with a single click from your account.
          </p>

          <hr className="my-6 border-gray-100 dark:border-zinc-800" />

          {/* Features */}
          <div className="space-y-3.5">
            <p className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider">
              Included in your plan:
            </p>
            {SUBSCRIPTION_PLAN.features.map((feature, idx) => (
              <div key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-gray-700 dark:text-zinc-300">
                <div className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </div>
                <span>{feature}</span>
              </div>
            ))}
          </div>

          {/* Action Button */}
          <div className="mt-8">
            {access.hasActiveSubscription ? (
              <Link
                href="/account"
                className="w-full h-12 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm flex items-center justify-center gap-2 transition cursor-pointer shadow-md"
              >
                <span>Active Member &bull; View Account</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            ) : access.isAuthenticated ? (
              <Link
                href="/account"
                className="w-full h-12 rounded-xl bg-gradient-to-r from-amber-500 via-amber-600 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-black font-extrabold text-sm flex items-center justify-center gap-2 transition cursor-pointer shadow-lg hover:shadow-xl"
              >
                <span>Subscribe for ₹{SUBSCRIPTION_PLAN.priceInINR}/month</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            ) : (
              <Link
                href="/login?callbackUrl=/pricing"
                className="w-full h-12 rounded-xl bg-gradient-to-r from-amber-500 via-amber-600 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-black font-extrabold text-sm flex items-center justify-center gap-2 transition cursor-pointer shadow-lg hover:shadow-xl"
              >
                <span>Sign In to Subscribe</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            )}
          </div>

          <div className="mt-4 text-center">
            <span className="text-[11px] text-gray-400 flex items-center justify-center gap-1">
              <Shield className="w-3.5 h-3.5 text-gray-500" />
              <span>Encrypted 256-bit Razorpay checkout</span>
            </span>
          </div>
        </div>

        {/* FAQs */}
        <div className="mt-16 max-w-2xl mx-auto">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 text-center">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl p-5">
              <h3 className="font-bold text-sm text-gray-900 dark:text-white flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-blue-600" />
                How does the subscription work?
              </h3>
              <p className="mt-2 text-xs text-gray-600 dark:text-zinc-400 leading-relaxed">
                When you subscribe, you receive full, unrestricted access to all premium articles, test series, and study materials. The fee is ₹399 billed monthly.
              </p>
            </div>

            <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl p-5">
              <h3 className="font-bold text-sm text-gray-900 dark:text-white flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-blue-600" />
                Can I cancel anytime?
              </h3>
              <p className="mt-2 text-xs text-gray-600 dark:text-zinc-400 leading-relaxed">
                Yes! You can cancel your subscription with 1 click from your Account dashboard at any time. You will retain premium access until the end of your billing month.
              </p>
            </div>

            <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl p-5">
              <h3 className="font-bold text-sm text-gray-900 dark:text-white flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-blue-600" />
                What payment methods are supported?
              </h3>
              <p className="mt-2 text-xs text-gray-600 dark:text-zinc-400 leading-relaxed">
                We support UPI AutoPay (Google Pay, PhonePe, Paytm), Credit & Debit cards (Visa, Mastercard, RuPay), and Netbanking through Razorpay.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
