export interface CreateSubscriptionInput {
  userId: string;
  userEmail: string;
  userName?: string;
  planId?: string;
}

export interface CreateSubscriptionResult {
  subscriptionId: string;
  planId: string;
  providerCustomerId?: string;
  checkoutKeyId: string;
  amount: number;
  currency: string;
}

export interface CancelSubscriptionResult {
  success: boolean;
  status: string;
  cancelAtPeriodEnd: boolean;
}

export interface VerifyWebhookInput {
  rawBody: string;
  signature: string;
}

export interface PaymentProvider {
  name: string;
  createSubscription(input: CreateSubscriptionInput): Promise<CreateSubscriptionResult>;
  cancelSubscription(
    providerSubscriptionId: string,
    cancelAtPeriodEnd?: boolean
  ): Promise<CancelSubscriptionResult>;
  verifyWebhookSignature(input: VerifyWebhookInput): boolean;
}
