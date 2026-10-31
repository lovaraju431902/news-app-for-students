"use client";

import React, { useState, Suspense } from "react";
import { authClient } from "@/lib/auth-client";
import Link from "next/link";
import { Mail, KeyRound, ArrowRight, RefreshCw, AlertCircle, ArrowLeft, CheckCircle2 } from "lucide-react";

function ForgotPasswordContent() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  // Send Password Reset Link via Better Auth
  const handleSendResetLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes("@")) {
      setErrorMessage("Please enter a valid email address.");
      return;
    }

    setLoading(true);

    try {
      const origin = typeof window !== "undefined" ? window.location.origin : "";
      const res = await authClient.requestPasswordReset({
        email: cleanEmail,
        redirectTo: `${origin}/reset-password`,
      });

      if (res?.error) {
        setErrorMessage(res.error.message || "Failed to process password reset. Please try again.");
      } else {
        // Generic success message to prevent account enumeration
        setSubmitted(true);
      }
    } catch (err: any) {
      setErrorMessage(err.message || "An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 sm:p-8 bg-white dark:bg-zinc-900 rounded-2xl border border-gray-200 dark:border-zinc-800 shadow-xl">
      {/* Brand Header */}
      <div className="text-center mb-8">
        <Link href="/" className="inline-flex items-center gap-1.5 font-black text-2xl tracking-tight text-gray-900 dark:text-white">
          <span>Students</span>
          <span className="bg-[#EF4444] text-white text-base px-2 py-0.5 rounded-md">Hub</span>
        </Link>
        <div className="mt-4 flex items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center">
            <KeyRound className="w-6 h-6" />
          </div>
        </div>
        <h1 className="mt-3 text-xl font-extrabold text-gray-900 dark:text-white tracking-tight">
          Forgot Your Password?
        </h1>
        <p className="mt-1 text-xs text-gray-500 dark:text-zinc-400">
          Enter your registered email address and we'll send you instructions to reset your password.
        </p>
      </div>

      {/* Error Alert */}
      {errorMessage && (
        <div className="mb-6 p-3 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 flex items-start gap-2.5 text-xs text-red-600 dark:text-red-400">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{errorMessage}</span>
        </div>
      )}

      {submitted ? (
        <div className="space-y-6 text-center">
          <div className="w-12 h-12 mx-auto rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <CheckCircle2 className="w-7 h-7" />
          </div>
          <div className="space-y-2">
            <h2 className="text-base font-bold text-gray-900 dark:text-white">Check Your Inbox</h2>
            <p className="text-xs text-gray-600 dark:text-zinc-300 leading-relaxed">
              If an account exists for <strong className="text-gray-900 dark:text-white">{email}</strong>, a secure password reset link has been dispatched to your email address.
            </p>
            <p className="text-[11px] text-gray-400 dark:text-zinc-500">
              The link will expire in 1 hour. Be sure to check your spam or junk folder if you don't see it within a few minutes.
            </p>
          </div>

          <div className="pt-2">
            <Link
              href="/login"
              className="inline-flex items-center gap-2 text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Return to Sign In</span>
            </Link>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSendResetLink} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full h-11 pl-10 pr-3 rounded-xl border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              />
              <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-11 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold flex items-center justify-center gap-2 transition disabled:opacity-50 cursor-pointer shadow-md"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Sending Instructions...</span>
              </>
            ) : (
              <>
                <span>Send Reset Link</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          {/* Back to sign in link */}
          <div className="mt-8 pt-4 text-center border-t border-gray-100 dark:border-zinc-800">
            <Link
              href="/login"
              className="text-xs text-gray-500 dark:text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400 hover:underline inline-flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Sign In</span>
            </Link>
          </div>
        </form>
      )}
    </div>
  );
}

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <Suspense fallback={<div className="text-center text-sm text-gray-500">Loading...</div>}>
        <ForgotPasswordContent />
      </Suspense>
    </div>
  );
}
