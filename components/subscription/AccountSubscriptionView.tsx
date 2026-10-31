"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Crown, Calendar, AlertCircle, CheckCircle, ArrowRight, Loader2, RefreshCw } from "lucide-react";
import { SUBSCRIPTION_PLAN } from "@/lib/payments/config";

interface SubscriptionData {
  id?: string;
  status: string;
  currentPeriodEnd: string | null;
  currentPeriodStart: string | null;
  cancelAtPeriodEnd: boolean;
  provider: string;
}

interface AccountSubscriptionViewProps {
  user: {
    id: string;
    email: string;
    name?: string | null;
  };
  subscription: SubscriptionData | null;
}

export function AccountSubscriptionView({ user, subscription }: AccountSubscriptionViewProps) {
  const router = useRouter();
  const [cancelling, setCancelling] = useState(false);
  const [subscribing, setSubscribing] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const isActive =
    subscription?.status === "active" ||
    (subscription?.status === "cancelled" &&
      subscription.currentPeriodEnd &&
      new Date(subscription.currentPeriodEnd) > new Date());

  const handleCancel = async () => {
    if (!window.confirm("Are you sure you want to cancel your recurring subscription? You will still retain access until the end of your billing cycle.")) {
      return;
    }

    setCancelling(true);
    setMessage(null);

    try {
      const res = await fetch("/api/subscription/cancel", { method: "POST" });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to cancel subscription.");
      }
      setMessage({ type: "success", text: data.message });
      router.refresh();
    } catch (err: any) {
      setMessage({ type: "error", text: err.message || "Failed to cancel subscription." });
    } finally {
      setCancelling(false);
    }
  };

  const handleSubscribe = async () => {
    setSubscribing(true);
    setMessage(null);

    try {
      if (!(window as any).Razorpay) {
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        await new Promise((res) => {
          script.onload = res;
          document.body.appendChild(script);
        });
      }

      const res = await fetch("/api/subscription/create", { method: "POST" });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to start checkout.");
      }

      const options = {
        key: data.checkoutKeyId,
        subscription_id: data.subscriptionId,
        name: SUBSCRIPTION_PLAN.name,
        description: SUBSCRIPTION_PLAN.description,
        image: "/logo.png",
        prefill: {
          name: user.name || "",
          email: user.email,
        },
        theme: { color: "#0f172a" },
        handler: function () {
          setTimeout(() => {
            router.refresh();
          }, 1500);
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (err: any) {
      setMessage({ type: "error", text: err.message || "Checkout failed." });
    } finally {
      setSubscribing(false);
    }
  };

  return (
    <div className="space-y-6">
      {message && (
        <div
          className={`p-4 rounded-xl border text-xs sm:text-sm flex items-start gap-3 ${
            message.type === "success"
              ? "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300"
              : "bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800 text-red-600 dark:text-red-400"
          }`}
        >
          {message.type === "success" ? (
            <CheckCircle className="w-5 h-5 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 shrink-0" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      {/* Subscription Status Card */}
      <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-gray-100 dark:border-zinc-800">
          <div>
            <span className="text-xs font-bold text-gray-500 dark:text-zinc-400 uppercase tracking-wider">
              Current Membership
            </span>
            <div className="mt-1 flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white">
                {isActive ? "Students Hub Premium" : "Free Public Tier"}
              </h2>
              {isActive && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700">
                  {subscription?.cancelAtPeriodEnd ? "Cancelling at Period End" : "Active"}
                </span>
              )}
            </div>
          </div>

          <div className="text-sm font-semibold text-gray-600 dark:text-zinc-400">
            {isActive ? (
              <span className="text-emerald-600 dark:text-emerald-400 font-bold">₹{SUBSCRIPTION_PLAN.priceInINR} / month</span>
            ) : (
              <span>₹0 / month</span>
            )}
          </div>
        </div>

        {/* Details row */}
        <div className="py-6 space-y-4 text-xs sm:text-sm">
          {isActive ? (
            <>
              <div className="flex items-center justify-between text-gray-600 dark:text-zinc-400">
                <span className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span>
                    {subscription?.cancelAtPeriodEnd ? "Access Expires On" : "Next Renewal Date"}
                  </span>
                </span>
                <span className="font-bold text-gray-900 dark:text-white">
                  {subscription?.currentPeriodEnd
                    ? new Date(subscription.currentPeriodEnd).toLocaleDateString("en-IN", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })
                    : "End of billing cycle"}
                </span>
              </div>

              <div className="flex items-center justify-between text-gray-600 dark:text-zinc-400">
                <span>Billing Provider</span>
                <span className="font-semibold text-gray-900 dark:text-white uppercase tracking-wider text-xs">
                  {subscription?.provider || "Razorpay"}
                </span>
              </div>
            </>
          ) : (
            <p className="text-gray-500 dark:text-zinc-400 leading-relaxed">
              You are currently on the free tier. Subscribe to Students Hub Premium for ₹{SUBSCRIPTION_PLAN.priceInINR}/month to unlock all restricted articles and study resources.
            </p>
          )}
        </div>

        {/* Action Button */}
        <div className="pt-4 border-t border-gray-100 dark:border-zinc-800 flex flex-wrap items-center justify-between gap-4">
          {isActive ? (
            !subscription?.cancelAtPeriodEnd ? (
              <button
                type="button"
                onClick={handleCancel}
                disabled={cancelling}
                className="text-xs font-semibold text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 underline disabled:opacity-50 cursor-pointer"
              >
                {cancelling ? "Processing cancellation..." : "Cancel Recurring Subscription"}
              </button>
            ) : (
              <span className="text-xs text-amber-600 dark:text-amber-400 font-medium">
                Your subscription will not renew after this billing period.
              </span>
            )
          ) : (
            <button
              type="button"
              onClick={handleSubscribe}
              disabled={subscribing}
              className="px-6 h-11 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-black font-extrabold text-xs sm:text-sm flex items-center gap-2 transition cursor-pointer shadow-md disabled:opacity-50"
            >
              {subscribing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Opening Checkout...</span>
                </>
              ) : (
                <>
                  <Crown className="w-4 h-4 fill-black" />
                  <span>Subscribe for ₹{SUBSCRIPTION_PLAN.priceInINR}/month</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
