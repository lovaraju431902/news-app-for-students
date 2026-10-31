"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { checkEmailStatusAction, resendVerificationEmailAction } from "@/app/actions/user-auth";
import Link from "next/link";
import {
  Mail,
  Lock,
  User as UserIcon,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  Eye,
  EyeOff,
  Send,
} from "lucide-react";

function sanitizeCallbackUrl(url: string | null): string {
  if (!url) return "/";
  if (url.startsWith("http://") || url.startsWith("https://") || url.startsWith("//")) {
    return "/";
  }
  return url.startsWith("/") ? url : `/${url}`;
}

function AuthForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const rawCallback = searchParams.get("callbackUrl");
  const callbackUrl = sanitizeCallbackUrl(rawCallback);
  const initialMode = searchParams.get("mode") === "signup" ? "signup" : "signin";

  const [mode, setMode] = useState<"signin" | "signup">(initialMode);

  // Common Form Fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // States
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [resendingEmail, setResendingEmail] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showResendVerification, setShowResendVerification] = useState(false);
  const [offerSignUp, setOfferSignUp] = useState(false);
  const [offerSignIn, setOfferSignIn] = useState(false);

  // Sync mode with query params
  useEffect(() => {
    const qMode = searchParams.get("mode");
    if (qMode === "signup" && mode !== "signup") {
      setMode("signup");
    } else if (qMode === "signin" && mode !== "signin") {
      setMode("signin");
    }
  }, [searchParams]);

  // Clear messages on tab change
  const handleModeSwitch = (newMode: "signin" | "signup") => {
    setMode(newMode);
    setErrorMessage(null);
    setSuccessMessage(null);
    setShowResendVerification(false);
    setOfferSignUp(false);
    setOfferSignIn(false);
  };

  // Google OAuth Social Login
  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);
    try {
      const res = await authClient.signIn.social({
        provider: "google",
        callbackURL: callbackUrl,
      });
      if (res?.error) {
        setErrorMessage(res.error.message || "Failed to initialize Google Sign In. Please try again.");
        setGoogleLoading(false);
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to initialize Google Sign In. Please try again.");
      setGoogleLoading(false);
    }
  };

  // Sign In Handler (Email + Password)
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    setShowResendVerification(false);
    setOfferSignUp(false);

    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes("@")) {
      setErrorMessage("Please enter a valid email address.");
      return;
    }

    if (!password) {
      setErrorMessage("Please enter your password.");
      return;
    }

    setLoading(true);

    try {
      // Check credentials using Better Auth
      const res = await authClient.signIn.email({
        email: cleanEmail,
        password: password,
      });

      if (res.error) {
        const errCode = res.error.code || "";
        const errMsg = res.error.message || "";

        // Handle unverified email error
        if (
          errCode === "EMAIL_NOT_VERIFIED" ||
          errMsg.toLowerCase().includes("verify your email") ||
          errMsg.toLowerCase().includes("email not verified")
        ) {
          setErrorMessage("Your email address is not verified yet. Please check your inbox or resend the verification link.");
          setShowResendVerification(true);
          return;
        }

        // Check if user exists to provide friendly guidance
        const check = await checkEmailStatusAction(cleanEmail);
        if (check && !check.exists) {
          setErrorMessage(`No account found with email "${cleanEmail}".`);
          setOfferSignUp(true);
          return;
        }

        if (check && check.exists && !check.isVerified) {
          setErrorMessage("Your email address is not verified yet. Please verify your email before signing in.");
          setShowResendVerification(true);
          return;
        }

        // Invalid password or general error
        setErrorMessage(res.error.message || "Invalid email or password. Please try again.");
      } else {
        router.push(callbackUrl);
        router.refresh();
      }
    } catch (err: any) {
      setErrorMessage(err.message || "An unexpected error occurred during sign in. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Sign Up Handler (Name, Email, Password, Confirm Password)
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    setOfferSignIn(false);
    setShowResendVerification(false);

    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanName) {
      setErrorMessage("Please enter your full name.");
      return;
    }

    if (!cleanEmail || !cleanEmail.includes("@")) {
      setErrorMessage("Please enter a valid email address.");
      return;
    }

    if (password.length < 8) {
      setErrorMessage("Password must be at least 8 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      // Check if email already belongs to an existing account
      const check = await checkEmailStatusAction(cleanEmail);
      if (check && check.exists) {
        setErrorMessage(`An account already exists for ${cleanEmail}. Please sign in instead.`);
        setOfferSignIn(true);
        setLoading(false);
        return;
      }

      // Create account via Better Auth
      const res = await authClient.signUp.email({
        name: cleanName,
        email: cleanEmail,
        password: password,
        callbackURL: callbackUrl,
      });

      if (res.error) {
        if (
          res.error.code === "USER_ALREADY_EXISTS" ||
          res.error.message?.toLowerCase().includes("already exists")
        ) {
          setErrorMessage(`An account already exists for ${cleanEmail}. Please sign in instead.`);
          setOfferSignIn(true);
        } else {
          setErrorMessage(res.error.message || "Failed to create account. Please try again.");
        }
      } else {
        setSuccessMessage(
          `Account created successfully! A verification email has been sent to ${cleanEmail}. Please check your inbox and verify your email to continue.`
        );
        setShowResendVerification(true);
      }
    } catch (err: any) {
      setErrorMessage(err.message || "An unexpected error occurred during registration. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Resend Email Verification Handler
  const handleResendVerification = async () => {
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes("@")) {
      setErrorMessage("Please enter a valid email address first.");
      return;
    }

    setResendingEmail(true);
    setErrorMessage(null);

    try {
      const res = await resendVerificationEmailAction(cleanEmail);
      if (res.success) {
        setSuccessMessage(res.message || `Verification link sent to ${cleanEmail}.`);
        if (res.alreadyVerified) {
          setShowResendVerification(false);
        }
      } else {
        setErrorMessage(res.error || "Failed to resend verification email.");
      }
    } catch (err: any) {
      setErrorMessage("Failed to resend verification email. Please try again.");
    } finally {
      setResendingEmail(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 sm:p-8 bg-white dark:bg-zinc-900 rounded-2xl border border-gray-200 dark:border-zinc-800 shadow-xl">
      {/* Brand Header */}
      <div className="text-center mb-6">
        <Link href="/" className="inline-flex items-center gap-1.5 font-black text-2xl tracking-tight text-gray-900 dark:text-white">
          <span>Students</span>
          <span className="bg-[#EF4444] text-white text-base px-2 py-0.5 rounded-md">Hub</span>
        </Link>
        <h1 className="mt-3 text-xl font-extrabold text-gray-900 dark:text-white tracking-tight">
          {mode === "signin" ? "Sign In to Your Account" : "Create Your Account"}
        </h1>
        <p className="mt-1 text-xs text-gray-500 dark:text-zinc-400">
          {mode === "signin"
            ? "Enter your email and password to access your account."
            : "Join Students Hub to save articles, join discussions, and unlock premium features."}
        </p>
      </div>

      {/* Tabs / Toggle: Sign In vs Sign Up */}
      <div className="flex bg-gray-100 dark:bg-zinc-800 p-1 rounded-xl mb-6">
        <button
          type="button"
          onClick={() => handleModeSwitch("signin")}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
            mode === "signin"
              ? "bg-white dark:bg-zinc-900 text-gray-900 dark:text-white shadow-xs"
              : "text-gray-500 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-white"
          }`}
        >
          Sign In
        </button>
        <button
          type="button"
          onClick={() => handleModeSwitch("signup")}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
            mode === "signup"
              ? "bg-white dark:bg-zinc-900 text-gray-900 dark:text-white shadow-xs"
              : "text-gray-500 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-white"
          }`}
        >
          Sign Up
        </button>
      </div>

      {/* Error Alert */}
      {errorMessage && (
        <div className="mb-5 p-3.5 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 text-xs text-red-600 dark:text-red-400 space-y-2">
          <div className="flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span className="flex-1 leading-relaxed">{errorMessage}</span>
          </div>

          {/* Friendly Offer to Sign Up */}
          {offerSignUp && (
            <div className="pt-2 border-t border-red-200/60 dark:border-red-800/60 flex items-center justify-between">
              <span className="text-gray-700 dark:text-zinc-300 font-medium">New to Students Hub?</span>
              <button
                type="button"
                onClick={() => handleModeSwitch("signup")}
                className="font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
              >
                Create Account →
              </button>
            </div>
          )}

          {/* Friendly Offer to Sign In */}
          {offerSignIn && (
            <div className="pt-2 border-t border-red-200/60 dark:border-red-800/60 flex items-center justify-between">
              <span className="text-gray-700 dark:text-zinc-300 font-medium">Already have an account?</span>
              <button
                type="button"
                onClick={() => handleModeSwitch("signin")}
                className="font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
              >
                Sign In Instead →
              </button>
            </div>
          )}
        </div>
      )}

      {/* Success Notification */}
      {successMessage && (
        <div className="mb-5 p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-700 dark:text-emerald-300 flex items-start gap-2.5">
          <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600 dark:text-emerald-400" />
          <span className="flex-1 leading-relaxed">{successMessage}</span>
        </div>
      )}

      {/* Resend Verification Action Button */}
      {showResendVerification && (
        <div className="mb-5 p-3 rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 flex items-center justify-between text-xs">
          <span className="text-blue-700 dark:text-blue-300 font-medium">Didn't receive verification email?</span>
          <button
            type="button"
            disabled={resendingEmail}
            onClick={handleResendVerification}
            className="font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer disabled:opacity-50"
          >
            {resendingEmail ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Sending...</span>
              </>
            ) : (
              <>
                <Send className="w-3.5 h-3.5" />
                <span>Resend Link</span>
              </>
            )}
          </button>
        </div>
      )}

      {/* Google OAuth Button */}
      <button
        type="button"
        onClick={handleGoogleSignIn}
        disabled={googleLoading || loading}
        className="w-full h-11 px-4 rounded-xl border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-750 text-gray-800 dark:text-zinc-100 text-sm font-semibold flex items-center justify-center gap-3 transition shadow-2xs cursor-pointer disabled:opacity-50"
      >
        {googleLoading ? (
          <>
            <RefreshCw className="w-4 h-4 animate-spin text-gray-500" />
            <span>Connecting to Google...</span>
          </>
        ) : (
          <>
            <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>{mode === "signin" ? "Sign In with Google" : "Sign Up with Google"}</span>
          </>
        )}
      </button>

      {/* Divider */}
      <div className="relative flex items-center justify-center my-5">
        <div className="border-t border-gray-200 dark:border-zinc-800 w-full" />
        <span className="bg-white dark:bg-zinc-900 px-3 text-[11px] font-semibold tracking-wider uppercase text-gray-400 dark:text-zinc-500 absolute">
          or with email and password
        </span>
      </div>

      {/* Main Authentication Form */}
      <form onSubmit={mode === "signin" ? handleSignIn : handleSignUp} className="space-y-4">
        {/* Name Field (Sign Up Only) */}
        {mode === "signup" && (
          <div>
            <label className="block text-xs font-bold text-gray-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5">
              Full Name
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Sai Kiran"
                className="w-full h-11 pl-10 pr-3 rounded-xl border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              />
              <UserIcon className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            </div>
          </div>
        )}

        {/* Email Field */}
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

        {/* Password Field */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-bold text-gray-700 dark:text-zinc-300 uppercase tracking-wider">
              Password
            </label>
            {mode === "signin" && (
              <Link
                href="/forgot-password"
                className="text-[11px] font-medium text-blue-600 dark:text-blue-400 hover:underline"
              >
                Forgot password?
              </Link>
            )}
          </div>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={mode === "signup" ? "At least 8 characters" : "••••••••"}
              className="w-full h-11 pl-10 pr-10 rounded-xl border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
            <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 dark:hover:text-zinc-300 cursor-pointer"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Confirm Password (Sign Up Only) */}
        {mode === "signup" && (
          <div>
            <label className="block text-xs font-bold text-gray-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5">
              Confirm Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                minLength={8}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter your password"
                className="w-full h-11 pl-10 pr-3 rounded-xl border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              />
              <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            </div>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading || googleLoading}
          className="w-full h-11 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold flex items-center justify-center gap-2 transition disabled:opacity-50 cursor-pointer shadow-md"
        >
          {loading ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>{mode === "signin" ? "Signing In..." : "Creating Account..."}</span>
            </>
          ) : (
            <>
              <span>{mode === "signin" ? "Sign In" : "Create Account"}</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>

        {/* Footer Toggle */}
        <div className="text-center pt-2 text-xs text-gray-500 dark:text-zinc-400">
          {mode === "signin" ? (
            <>
              Don't have an account?{" "}
              <button
                type="button"
                onClick={() => handleModeSwitch("signup")}
                className="font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
              >
                Sign Up
              </button>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => handleModeSwitch("signin")}
                className="font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
              >
                Sign In
              </button>
            </>
          )}
        </div>
      </form>

      {/* Security note */}
      <div className="mt-8 pt-4 text-center border-t border-gray-100 dark:border-zinc-800">
        <p className="text-[11px] text-gray-400 flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-green-600" />
          <span>Encrypted credentials &amp; secured with Better Auth</span>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <Suspense fallback={<div className="text-center text-sm text-gray-500">Loading authentication...</div>}>
        <AuthForm />
      </Suspense>
    </div>
  );
}
