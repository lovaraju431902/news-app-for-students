import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getPaymentProvider } from "@/lib/payments/razorpay";
import { sendSubscriptionEmail } from "@/lib/email";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get("x-razorpay-signature") || "";
    const eventIdHeader = request.headers.get("x-razorpay-event-id");

    const provider = getPaymentProvider();

    // 1. Verify Webhook Signature on RAW body
    const isValid = provider.verifyWebhookSignature({
      rawBody,
      signature,
    });

    if (!isValid) {
      console.warn("Invalid Razorpay webhook signature received.");
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    // 2. Parse Event JSON safely
    let event: any;
    try {
      event = JSON.parse(rawBody);
    } catch (parseErr) {
      return NextResponse.json({ error: "Invalid JSON payload" }, { status: 400 });
    }

    const eventType = event.event;
    const eventId = eventIdHeader || event.id || `${eventType}_${Date.now()}`;

    // 3. Idempotency Check with PaymentEvent
    const existingEvent = await prisma.paymentEvent.findUnique({
      where: { eventId },
    });

    if (existingEvent) {
      // Event already processed, return 200 immediately
      return NextResponse.json({ status: "already_processed" }, { status: 200 });
    }

    // Store in PaymentEvent table
    await prisma.paymentEvent.create({
      data: {
        eventId,
        eventType,
        payload: event,
      },
    });

    // 4. Handle Lifecycle Events
    const subEntity = event?.payload?.subscription?.entity;
    const paymentEntity = event?.payload?.payment?.entity;

    const subId = subEntity?.id;
    if (subId) {
      const subscription = await prisma.subscription.findUnique({
        where: { providerSubscriptionId: subId },
        include: { user: true },
      });

      if (subscription) {
        const periodStart = subEntity.current_start
          ? new Date(subEntity.current_start * 1000)
          : undefined;
        const periodEnd = subEntity.current_end
          ? new Date(subEntity.current_end * 1000)
          : undefined;

        const formattedRenewal = periodEnd
          ? periodEnd.toLocaleDateString("en-IN", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })
          : "next billing cycle";

        const userEmail = subscription.user?.email;

        switch (eventType) {
          case "subscription.authenticated":
          case "subscription.activated": {
            await prisma.subscription.update({
              where: { id: subscription.id },
              data: {
                status: "active",
                currentPeriodStart: periodStart,
                currentPeriodEnd: periodEnd,
                cancelAtPeriodEnd: false,
              },
            });

            if (userEmail) {
              await sendSubscriptionEmail({
                to: userEmail,
                type: "activated",
                renewalDate: formattedRenewal,
                amount: "₹399",
              }).catch(() => {});
            }
            break;
          }

          case "subscription.charged": {
            await prisma.subscription.update({
              where: { id: subscription.id },
              data: {
                status: "active",
                currentPeriodStart: periodStart,
                currentPeriodEnd: periodEnd,
              },
            });
            break;
          }

          case "subscription.pending": {
            await prisma.subscription.update({
              where: { id: subscription.id },
              data: { status: "pending" },
            });
            break;
          }

          case "subscription.halted": {
            await prisma.subscription.update({
              where: { id: subscription.id },
              data: { status: "halted" },
            });

            if (userEmail) {
              await sendSubscriptionEmail({
                to: userEmail,
                type: "failed",
                amount: "₹399",
              }).catch(() => {});
            }
            break;
          }

          case "subscription.cancelled": {
            await prisma.subscription.update({
              where: { id: subscription.id },
              data: {
                status: "cancelled",
                cancelAtPeriodEnd: true,
                currentPeriodEnd: periodEnd,
              },
            });

            if (userEmail) {
              await sendSubscriptionEmail({
                to: userEmail,
                type: "cancelled",
                renewalDate: formattedRenewal,
              }).catch(() => {});
            }
            break;
          }

          case "subscription.completed": {
            await prisma.subscription.update({
              where: { id: subscription.id },
              data: { status: "completed" },
            });
            break;
          }

          default:
            break;
        }
      }
    }

    // Handle standalone payment failure notification
    if (eventType === "payment.failed" && paymentEntity) {
      const email = paymentEntity.email;
      if (email) {
        await sendSubscriptionEmail({
          to: email,
          type: "failed",
          amount: "₹399",
        }).catch(() => {});
      }
    }

    return NextResponse.json({ status: "ok" }, { status: 200 });
  } catch (error: any) {
    console.error("Razorpay webhook handler error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
