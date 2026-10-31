import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { getPaymentProvider } from "@/lib/payments/razorpay";
import { sendSubscriptionEmail } from "@/lib/email";

export async function POST() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized." },
        { status: 401 }
      );
    }

    const userId = session.user.id;
    const subscription = await prisma.subscription.findFirst({
      where: {
        userId,
        status: { in: ["active", "pending"] },
      },
      orderBy: { updatedAt: "desc" },
    });

    if (!subscription) {
      return NextResponse.json(
        { success: false, error: "No active subscription found to cancel." },
        { status: 404 }
      );
    }

    const provider = getPaymentProvider();

    // Cancel at end of current billing cycle via provider API
    await provider.cancelSubscription(subscription.providerSubscriptionId, true);

    const updated = await prisma.subscription.update({
      where: { id: subscription.id },
      data: {
        cancelAtPeriodEnd: true,
      },
    });

    // Send email confirmation
    const formattedEnd = updated.currentPeriodEnd
      ? new Date(updated.currentPeriodEnd).toLocaleDateString("en-IN", {
          month: "long",
          day: "numeric",
          year: "numeric",
        })
      : "the end of your billing cycle";

    await sendSubscriptionEmail({
      to: session.user.email,
      type: "cancelled",
      renewalDate: formattedEnd,
    }).catch(() => {});

    return NextResponse.json(
      {
        success: true,
        message: `Your subscription has been cancelled and will remain active until ${formattedEnd}.`,
        subscription: {
          id: updated.id,
          status: updated.status,
          cancelAtPeriodEnd: updated.cancelAtPeriodEnd,
          currentPeriodEnd: updated.currentPeriodEnd,
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("POST /api/subscription/cancel error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to cancel subscription." },
      { status: 500 }
    );
  }
}
