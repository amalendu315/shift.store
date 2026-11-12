/** Gateway-neutral payment contract. Amounts are integer paise. Secrets never leave the server. */
export interface PaymentEvent {
  eventId: string;
  orderId: string;
  reference: string;
  amount: number;
  currency: string;
  status: "PAID" | "FAILED";
}
export interface PaymentSession {
  reference: string;
  redirectUrl?: string;
  sessionId?: string;
  mode?: "sandbox" | "production";
}
export interface PaymentProvider {
  id: string;
  label: string;
  mode?: "sandbox" | "production";
  createPayment(input: {
    orderId: string;
    amount: number;
    currency: "INR";
    idempotencyKey: string;
    customer?: { name: string; email: string; phone: string };
    returnUrl?: string;
  }): Promise<PaymentSession>;
  verifyWebhook(
    rawBody: Buffer,
    headers: Record<string, unknown>,
  ): Promise<PaymentEvent | null>;
  getPayment?(orderId: string): Promise<{
    reference: string;
    amount: number;
    currency: string;
    status: "PAID" | "PENDING" | "EXPIRED";
    sessionId?: string;
  }>;
}
export const paymentProviders = new Map<string, PaymentProvider>();
