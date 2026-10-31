"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import Link from "next/link";
import { ShieldCheck, RefreshCw, AlertCircle, ArrowLeft, Mail, ArrowRight } from "lucide-react";

function sanitizeCallbackUrl(url: string | null): string {
  if (!url) return "/";
  if (url.startsWith("http://") || url.startsWith("https://") || url.startsWith("//")) {
    return "/";
  }
  return url.startsWith("/") ? url : `/${url}`;
}

function VerifyOtpContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailParam = searchParams.get("email") || "";
  const rawCallback = searchParams.get("callbackUrl");
  const callbackUrl = sanitizeCallbackUrl(rawCallback);

  const [email, setEmail] = useState(emailParam);
  const [emailConfirmed, setEmailConfirmed] = useState(Boolean(emailParam));
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [resendCooldown, setResendCooldown] = useState(emailParam ? 30 : 0);
  const [successInfo, setSuccessInfo] = useState<string | null>(null);

  // 30-second resend countdown timer
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const interval = setInterval(() => {
      setResendCooldown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [resendCooldown]);

  // If user navigates directly with no email, handle requesting OTP
  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes("@")) {
      setErrorMessage("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    setErrorMessage(null);

    try {
      const res = await authClient.emailOtp.sendVerificationOtp({
        email: cleanEmail,
        type: "sign-in",
      });

      if (res.error) {
        setErrorMessage(res.error.message || "Failed to send verification code.");
      } else {
        setEmailConfirmed(true);
        setResendCooldown(30);
        setSuccessInfo(`Verification code sent to ${cleanEmail}`);
      }
    } catch (err: any) {
      setErrorMessage(err.message || "An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP
  const handleResendOtp = async () => {
    if (resendCooldown > 0 || loading) return;
    setLoading(true);
    setErrorMessage(null);
    setSuccessInfo(null);

    try {
      const res = await authClient.emailOtp.sendVerificationOtp({
        email: email.trim().toLowerCase(),
        type: "sign-in",
      });

      if (res.error) {
        setErrorMessage(res.error.message || "Failed to resend code.");
      } else {
        setResendCooldown(30);
        setSuccessInfo("A new verification code has been sent to your email.");
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to resend code. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // OTP inputs handling
  const handleOtpChange = (index: number, val: string) => {
    const char = val.slice(-1);
    const updated = [...otp];
    updated[index] = char;
    setOtp(updated);

    if (char && index < 5) {
      const nextInput = document.getElementById(`otp-box-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-box-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").trim();
    if (!/^\d{6}$/.test(pasted)) return;
    const digits = pasted.split("");
    setOtp(digits);
    const lastInput = document.getElementById("otp-box-5");
    lastInput?.focus();
  };

  // Submit and verify OTP
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = otp.join("").trim();
    if (code.length !== 6) {
      setErrorMessage("Please enter the complete 6-digit code.");
      return;
    }

    setLoading(true);
    setErrorMessage(null);

    try {
      const res = await authClient.signIn.emailOtp({
        email: email.trim().toLowerCase(),
        otp: code,
      });

      if (res.error) {
        setErrorMessage(res.error.message || "Invalid or expired verification code.");
      } else {
        router.push(callbackUrl);
        router.refresh();
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Verification failed. Please try again.");
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
        <h1 className="mt-4 text-xl font-extrabold text-gray-900 dark:text-white tracking-tight">
          Verify Verification Code
        </h1>
        <p className="mt-1 text-xs text-gray-500 dark:text-zinc-400">
          {emailConfirmed
            ? `Enter the 6-digit verification code sent to ${email}`
            : "Enter your email to receive and verify your one-time code."}
        </p>
      </div>

      {/* Alerts */}
      {errorMessage && (
        <div className="mb-6 p-3 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 flex items-start gap-2.5 text-xs text-red-600 dark:text-red-400">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{errorMessage}</span>
        </div>
      )}

      {successInfo && (
        <div className="mb-6 p-3 rounded-lg bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 flex items-start gap-2.5 text-xs text-green-700 dark:text-green-400">
          <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{successInfo}</span>
        </div>
      )}

      {!emailConfirmed ? (
        <form onSubmit={handleRequestOtp} className="space-y-4">
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
                className="w-full h-11 pl-10 pr-3 rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              />
              <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-11 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold flex items-center justify-center gap-2 transition disabled:opacity-50 cursor-pointer shadow-md"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Sending Code...</span>
              </>
            ) : (
              <>
                <span>Send Verification Code</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      ) : (
        <form onSubmit={handleVerifyOtp} className="space-y-6">
          <div className="flex justify-between gap-2" onPaste={handlePaste}>
            {otp.map((digit, idx) => (
              <input
                key={idx}
                id={`otp-box-${idx}`}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleOtpChange(idx, e.target.value)}
                onKeyDown={(e) => handleKeyDown(idx, e)}
                className="w-11 h-12 text-center text-xl font-bold font-mono rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
              />
            ))}
          </div>

          <button
            type="submit"
            disabled={loading || otp.join("").length !== 6}
            className="w-full h-11 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold flex items-center justify-center gap-2 transition disabled:opacity-50 cursor-pointer shadow-md"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Verifying...</span>
              </>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4" />
                <span>Verify & Continue</span>
              </>
            )}
          </button>

          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-zinc-400 pt-2 border-t border-gray-100 dark:border-zinc-800">
            <button
              type="button"
              onClick={() => {
                setEmailConfirmed(false);
                setOtp(["", "", "", "", "", ""]);
                setErrorMessage(null);
                setSuccessInfo(null);
              }}
              className="hover:underline flex items-center gap-1 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Change email</span>
            </button>

            <button
              type="button"
              disabled={resendCooldown > 0 || loading}
              onClick={handleResendOtp}
              className="text-blue-600 dark:text-blue-400 font-semibold hover:underline disabled:text-gray-400 disabled:no-underline cursor-pointer"
            >
              {resendCooldown > 0 ? `Resend code in ${resendCooldown}s` : "Resend Code"}
            </button>
          </div>
        </form>
      )}

      {/* Security footer */}
      <div className="mt-8 pt-4 text-center border-t border-gray-100 dark:border-zinc-800">
        <Link
          href="/login"
          className="text-xs text-gray-500 dark:text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400 hover:underline inline-flex items-center gap-1"
        >
          <ArrowLeft className="w-3 h-3" />
          <span>Back to sign in</span>
        </Link>
      </div>
    </div>
  );
}

export default function VerifyOtpPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <Suspense fallback={<div className="text-center text-sm text-gray-500">Loading verification...</div>}>
        <VerifyOtpContent />
      </Suspense>
    </div>
  );
}
