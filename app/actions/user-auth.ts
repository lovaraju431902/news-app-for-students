"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

/**
 * Server action to safely verify whether an email is registered or unverified,
 * to provide helpful UI messages without leaking detailed user data.
 */
export async function checkEmailStatusAction(email: string) {
  const cleanEmail = email?.trim().toLowerCase();
  if (!cleanEmail || !cleanEmail.includes("@")) {
    return { error: "Please provide a valid email address." };
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email: cleanEmail },
      select: {
        id: true,
        emailVerified: true,
      },
    });

    if (!user) {
      return { exists: false, isVerified: false };
    }

    return {
      exists: true,
      isVerified: user.emailVerified,
    };
  } catch (err: any) {
    return { error: "Failed to check email status. Please try again." };
  }
}

/**
 * Server action to resend verification email for an unverified account
 */
export async function resendVerificationEmailAction(email: string) {
  const cleanEmail = email?.trim().toLowerCase();
  if (!cleanEmail || !cleanEmail.includes("@")) {
    return { success: false, error: "Please enter a valid email address." };
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email: cleanEmail },
    });

    if (!user) {
      // Do not reveal account non-existence for abuse prevention
      return {
        success: true,
        message: "If an unverified account exists for this email, a verification link has been sent.",
      };
    }

    if (user.emailVerified) {
      return {
        success: true,
        alreadyVerified: true,
        message: "This email address is already verified. You can sign in directly.",
      };
    }

    // Call Better Auth's official sendVerificationEmail API
    const reqHeaders = await headers();
    await auth.api.sendVerificationEmail({
      body: {
        email: cleanEmail,
        callbackURL: "/login",
      },
      headers: reqHeaders,
    });

    return {
      success: true,
      message: `A verification link has been sent to ${cleanEmail}. Please check your inbox.`,
    };
  } catch (err: any) {
    return {
      success: false,
      error: err?.message || "Failed to send verification email. Please try again later.",
    };
  }
}
