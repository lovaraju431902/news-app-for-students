/**
 * Centralized Subscription Plan Configuration
 * All amounts and plan properties must be read from here. Never hardcode in UI.
 */
export const SUBSCRIPTION_PLAN = {
  name: "Students Hub Premium",
  description: "Unlimited access to all premium articles, in-depth career guides, and study materials.",
  priceInINR: 399,
  priceInPaise: 39900,
  currency: "INR",
  interval: "monthly",
  features: [
    "Unlimited access to all Premium articles & guides",
    "Ad-free reading experience across the entire site",
    "Exclusive government exam prep & syllabus insights",
    "Early access to internship & career opportunity alerts",
    "High-speed, prioritized download materials",
  ],
  get planId() {
    return process.env.RAZORPAY_PLAN_ID || "";
  },
} as const;
