"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Lock, Crown, CheckCircle2, ArrowRight, Loader2, Sparkles } from "lucide-react";
import { SUBSCRIPTION_PLAN } from "@/lib/payments/config";

interface PaywallBlockProps {
  currentPath: string;
  isAuthenticated: boolean;
}

export function PaywallBlock({ currentPath, isAuthenticated }: PaywallBlockProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Load Razorpay checkout script on demand
  const loadRazorpayScript = (): Promise<boolean> => {
    return new Promise((resolve) => {
      if (typeof window === "undefined") return resolve(false);
      if ((window as any).Razorpay) return resolve(true);

      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleSubscribe = async () => {
    setLoading(true);
    setErrorMessage(null);

    try {
      const isLoaded = await loadRazorpayScript();
      if (!isLoaded) {
        throw new Error("Failed to load Razorpay payment gateway. Please check your internet connection.");
      }

      const res = await fetch("/api/subscription/create", {
        method: "POST",
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to initialize subscription checkout.");
      }

      const options = {
        key: data.checkoutKeyId,
        subscription_id: data.subscriptionId,
        name: data.planName || SUBSCRIPTION_PLAN.name,
        description: SUBSCRIPTION_PLAN.description,
        image: "/logo.png",
        prefill: {
          name: data.user?.name || "",
          email: data.user?.email || "",
        },
        theme: {
          color: "#0f172a",
        },
        handler: function () {
          // Refresh server component to render full unlocked article
          setTimeout(() => {
            router.refresh();
          }, 1500);
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.on("payment.failed", function (response: any) {
        setErrorMessage(response.error?.description || "Payment failed. Please try again.");
      });
      rzp.open();
    } catch (err: any) {
      setErrorMessage(err.message || "An error occurred during checkout.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative mt-4 mb-8">

      {/* Paywall Container */}
      <div className="relative rounded-2xl border-2 border-amber-400/40 dark:border-amber-500/30 bg-gradient-to-b from-amber-50/50 via-white to-amber-50/20 dark:from-zinc-900 dark:via-zinc-900/90 dark:to-zinc-900 p-6 sm:p-8 md:p-10 shadow-xl overflow-hidden">
        {/* Decorative corner accent */}
        <div className="absolute top-0 right-0 w-36 h-36 bg-amber-400/10 dark:bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-700 dark:text-amber-400 text-xs font-bold uppercase tracking-wider mb-4">
            <Crown className="w-4 h-4 fill-amber-500 text-amber-500" />
            <span>Exclusive Premium Article</span>
          </div>

          {/* Heading */}
          <h2 className="text-2xl sm:text-3xl font-black text-gray-950 dark:text-white tracking-tight leading-tight">
            Read the Full Article with Students Hub Premium
          </h2>

          <p className="mt-3 text-sm text-gray-600 dark:text-zinc-400 leading-relaxed">
            This in-depth investigative piece and comprehensive preparation guide is exclusively available to active subscribers.
          </p>

          {/* Error notice */}
          {errorMessage && (
            <div className="mt-4 p-3 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 text-xs text-red-600 dark:text-red-400 text-left">
              {errorMessage}
            </div>
          )}

          {/* Benefits Grid */}
          <div className="my-6 grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-left text-xs sm:text-[13px] text-gray-700 dark:text-zinc-300 bg-white/80 dark:bg-zinc-800/50 border border-gray-200/80 dark:border-zinc-700/60 rounded-xl p-4 sm:p-5">
            {SUBSCRIPTION_PLAN.features.slice(0, 4).map((feature, idx) => (
              <div key={idx} className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>{feature}</span>
              </div>
            ))}
          </div>

          {/* CTA Action */}
          <div className="space-y-3">
            {isAuthenticated ? (
              <button
                type="button"
                onClick={handleSubscribe}
                disabled={loading}
                className="w-full sm:w-auto px-8 h-12 rounded-xl bg-gradient-to-r from-amber-500 via-amber-600 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-black font-extrabold text-sm sm:text-base tracking-wide flex items-center justify-center gap-2.5 transition shadow-lg hover:shadow-xl cursor-pointer disabled:opacity-50 mx-auto"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Preparing Secure Checkout...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 fill-black" />
                    <span>Subscribe for ₹{SUBSCRIPTION_PLAN.priceInINR}/month</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            ) : (
              <div className="space-y-2">
                <Link
                  href={`/login?callbackUrl=${encodeURIComponent(currentPath)}`}
                  className="w-full sm:w-auto inline-flex px-8 h-12 rounded-xl bg-gradient-to-r from-amber-500 via-amber-600 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-black font-extrabold text-sm sm:text-base tracking-wide items-center justify-center gap-2.5 transition shadow-lg hover:shadow-xl cursor-pointer"
                >
                  <Lock className="w-4 h-4" />
                  <span>Sign In to Unlock (₹{SUBSCRIPTION_PLAN.priceInINR}/month)</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <p className="text-[11px] text-gray-500 dark:text-zinc-400">
                  Already a subscriber? Sign in with your registered email for immediate access.
                </p>
              </div>
            )}

            <div className="pt-2 text-[11px] text-gray-400 dark:text-zinc-500">
              Cancel anytime online with 1 click from your account dashboard. Powered by Razorpay secure auto-renewal.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
