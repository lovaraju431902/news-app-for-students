import Razorpay from "razorpay";
import crypto from "crypto";
import {
  PaymentProvider,
  CreateSubscriptionInput,
  CreateSubscriptionResult,
  CancelSubscriptionResult,
  VerifyWebhookInput,
} from "./interface";
import { SUBSCRIPTION_PLAN } from "./config";

class RazorpayProvider implements PaymentProvider {
  name = "razorpay";
  private client: Razorpay | null = null;

  private getClient(): Razorpay {
    if (this.client) return this.client;

    const key_id = process.env.RAZORPAY_KEY_ID;
    const key_secret = process.env.RAZORPAY_KEY_SECRET;

    if (!key_id || !key_secret) {
      throw new Error("Razorpay credentials (RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET) not configured.");
    }

    this.client = new Razorpay({
      key_id,
      key_secret,
    });
    return this.client;
  }

  async createSubscription(
    input: CreateSubscriptionInput
  ): Promise<CreateSubscriptionResult> {
    const client = this.getClient();
    const planId = input.planId || SUBSCRIPTION_PLAN.planId;

    if (!planId) {
      throw new Error("Razorpay Plan ID not configured in RAZORPAY_PLAN_ID environment variable.");
    }

    // 120 cycles (10 years) represents ongoing monthly billing
    const subscription = await client.subscriptions.create({
      plan_id: planId,
      total_count: 120,
      quantity: 1,
      customer_notify: 1,
      notes: {
        userId: input.userId,
        userEmail: input.userEmail,
        userName: input.userName || "",
      },
    });

    const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID || "";

    return {
      subscriptionId: subscription.id,
      planId,
      providerCustomerId: subscription.customer_id as string | undefined,
      checkoutKeyId: keyId,
      amount: SUBSCRIPTION_PLAN.priceInPaise,
      currency: SUBSCRIPTION_PLAN.currency,
    };
  }

  async cancelSubscription(
    providerSubscriptionId: string,
    cancelAtPeriodEnd: boolean = true
  ): Promise<CancelSubscriptionResult> {
    const client = this.getClient();
    const result = await client.subscriptions.cancel(
      providerSubscriptionId,
      cancelAtPeriodEnd
    );

    return {
      success: true,
      status: result.status,
      cancelAtPeriodEnd,
    };
  }

  verifyWebhookSignature({ rawBody, signature }: VerifyWebhookInput): boolean {
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
    if (!secret || !signature || !rawBody) return false;

    try {
      const expectedSignature = crypto
        .createHmac("sha256", secret)
        .update(rawBody)
        .digest("hex");

      const expectedBuf = Buffer.from(expectedSignature, "utf8");
      const signatureBuf = Buffer.from(signature, "utf8");

      if (expectedBuf.length !== signatureBuf.length) {
        return false;
      }

      return crypto.timingSafeEqual(expectedBuf, signatureBuf);
    } catch (err) {
      console.error("Razorpay webhook signature verification error:", err);
      return false;
    }
  }
}

export const razorpayProvider = new RazorpayProvider();

export function getPaymentProvider(): PaymentProvider {
  return razorpayProvider;
}
