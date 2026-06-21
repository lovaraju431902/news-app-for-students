"use client";

import React, { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Mail, Lock, Loader2, ArrowLeft, ShieldCheck, AlertCircle, Eye, EyeOff } from "lucide-react";
import { loginAction } from "@/app/actions/auth";

export default function AdminLoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [state, formAction, isPending] = useActionState(loginAction, null);

  useEffect(() => {
    if (state?.success) {
      router.push("/admin-8ondZIwIj0VRE8P8spYRLkloy4BjQDAtCm3vWacc7sE");
      router.refresh();
    }
  }, [state, router]);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col items-center justify-center relative overflow-hidden p-4 font-sans selection:bg-blue-500/30 selection:text-blue-200">

      {/* Dynamic Background Glow Blobs */}
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-blue-600/10 blur-[120px] pointer-events-none animate-pulse duration-[6s]" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-indigo-600/10 blur-[120px] pointer-events-none animate-pulse duration-[8s]" />
      <div className="absolute top-[40%] right-[20%] w-[400px] h-[400px] rounded-full bg-purple-600/5 blur-[100px] pointer-events-none" />

      {/* Back to Home Button */}
      <div className="absolute top-6 left-6 z-10">
        <Link
          href="/"
          className="group flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-900/40 hover:bg-zinc-900/80 border border-zinc-800/80 backdrop-blur-md text-xs font-medium text-zinc-400 hover:text-zinc-200 transition-all duration-200 hover:border-zinc-700/80"
        >
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
          Back to website
        </Link>
      </div>

      <div className="w-full max-w-[440px] z-10 relative">

        {/* Glow behind the card */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 rounded-3xl blur-2xl -z-10" />

        {/* Login Card */}
        <div className="bg-zinc-900/60 border border-zinc-800/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 lg:p-10 flex flex-col gap-6">

          {/* Header Section */}
          <div className="text-center flex flex-col items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-white bg-clip-text">
                Admin Authentication
              </h1>
              <p className="text-xs text-zinc-400 mt-1">
                Enter your credentials to access the Content Control
              </p>
            </div>
          </div>

          {/* Form */}
          <form action={formAction} className="flex flex-col gap-5">

            {/* Action State Feedback */}
            {state?.error && (
              <div className="flex items-start gap-2.5 p-3.5 rounded-xl border border-red-500/20 bg-red-500/10 text-xs text-red-400 animate-in fade-in slide-in-from-top-1 duration-200">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{state.error}</span>
              </div>
            )}

            {state?.success && (
              <div className="flex items-center gap-2.5 p-3.5 rounded-xl border border-emerald-500/20 bg-emerald-500/10 text-xs text-emerald-400">
                <Loader2 className="w-4 h-4 animate-spin shrink-0" />
                <span>Redirecting to NewsRoom Admin...</span>
              </div>
            )}

            {/* Email Field */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="email" className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter your admin email"
                  required
                  disabled={isPending || state?.success}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-zinc-950/50 border border-zinc-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm text-white placeholder-zinc-600 outline-none transition-all duration-200 disabled:opacity-50"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between items-center">
                <label htmlFor="password" className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                  Secure Password
                </label>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••••••••••"
                  required
                  disabled={isPending || state?.success}
                  className="w-full pl-10 pr-10 py-3 rounded-xl bg-zinc-950/50 border border-zinc-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm text-white placeholder-zinc-600 outline-none transition-all duration-200 disabled:opacity-50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-350 p-1 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isPending || state?.success}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-sm font-bold shadow-lg shadow-blue-500/10 hover:shadow-blue-500/20 active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:pointer-events-none mt-2"
            >
              {isPending || state?.success ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Authenticating...
                </>
              ) : (
                "Access Dashboard"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
