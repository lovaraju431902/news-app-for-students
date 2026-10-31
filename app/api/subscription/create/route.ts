import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { getPaymentProvider } from "@/lib/payments/razorpay";
import { SUBSCRIPTION_PLAN } from "@/lib/payments/config";

export async function POST(request: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized. Please sign in to subscribe." },
        { status: 401 }
      );
    }

    const user = session.user;
    const provider = getPaymentProvider();

    // Create subscription on Razorpay
    const result = await provider.createSubscription({
      userId: user.id,
      userEmail: user.email,
      userName: user.name,
      planId: SUBSCRIPTION_PLAN.planId,
    });

    // Save initial record in database with status 'created'
    await prisma.subscription.create({
      data: {
        userId: user.id,
        provider: provider.name,
        providerSubscriptionId: result.subscriptionId,
        providerCustomerId: result.providerCustomerId || null,
        planId: result.planId,
        status: "created",
        cancelAtPeriodEnd: false,
      },
    });

    return NextResponse.json(
      {
        success: true,
        subscriptionId: result.subscriptionId,
        checkoutKeyId: result.checkoutKeyId,
        amount: result.amount,
        currency: result.currency,
        planName: SUBSCRIPTION_PLAN.name,
        user: {
          name: user.name,
          email: user.email,
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("POST /api/subscription/create error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to initialize subscription checkout.",
      },
      { status: 500 }
    );
  }
}
