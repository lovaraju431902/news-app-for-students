import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { emailOTP } from "better-auth/plugins";
import { nextCookies } from "better-auth/next-js";
import { prisma } from "@/lib/prisma";
import {
  sendOtpEmail,
  sendPasswordResetEmail,
  sendVerificationLinkEmail,
} from "@/lib/email";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  secret: process.env.BETTER_AUTH_SECRET || "better_auth_default_fallback_secret_key_32_chars_min",
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost",
  trustedOrigins: async (request) => {
    const origins = [
      "http://localhost:3000",
      "http://localhost",
      "http://localhost:3001",
      "http://127.0.0.1:3000",
      "http://127.0.0.1",
      ...(process.env.BETTER_AUTH_URL ? [process.env.BETTER_AUTH_URL] : []),
      ...(process.env.NEXT_PUBLIC_APP_URL ? [process.env.NEXT_PUBLIC_APP_URL] : []),
      ...(process.env.BETTER_AUTH_TRUSTED_ORIGINS
        ? process.env.BETTER_AUTH_TRUSTED_ORIGINS.split(",").map((s) => s.trim())
        : []),
    ].filter(Boolean) as string[];

    if (request) {
      const origin = request.headers.get("origin") || request.headers.get("referer");
      if (origin) {
        try {
          const parsed = new URL(origin);
          if (
            process.env.NODE_ENV !== "production" ||
            parsed.hostname === "localhost" ||
            parsed.hostname === "127.0.0.1" ||
            parsed.hostname === "0.0.0.0" ||
            parsed.hostname.startsWith("192.168.") ||
            parsed.hostname.startsWith("10.") ||
            parsed.hostname.endsWith(".local")
          ) {
            origins.push(parsed.origin);
          }
        } catch {}
      }
    }

    return Array.from(new Set(origins));
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    },
  },
  rateLimit: {
    window: 60, // 60 seconds
    max: 10, // Max 10 requests per window
  },
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    minPasswordLength: 8,
    async sendResetPassword({ user, url }) {
      await sendPasswordResetEmail(user.email, url);
    },
  },
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    expiresIn: 3600, // 1 hour
    async sendVerificationEmail({ user, url }) {
      await sendVerificationLinkEmail(user.email, url);
    },
  },
  advanced: {
    trustedProxyHeaders: true,
  },
  plugins: [
    emailOTP({
      otpLength: 6,
      expiresIn: 300, // 5 minutes
      async sendVerificationOTP({ email, otp, type }) {
        await sendOtpEmail(email, otp, type);
      },
    }),
    nextCookies(), // Must be the last plugin in the array for Next.js cookies support
  ],
});

