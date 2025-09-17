interface PaymentData {
  planId: string;
  planName: string;
  price: number;
  currency: string;
  period?: string;
}

interface PaymentResponse {
  sessionId?: string;
  checkoutUrl?: string;
}

interface PaymentError {
  message?: string;
}

export class PaymentProcessor {
  static async createCheckoutSession(paymentData: PaymentData): Promise<PaymentResponse> {
    const response = await fetch('/api/payments/create-checkout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...paymentData,
        acceptedTerms: true,
        acceptedDisclaimer: true,
      }),
    });

    if (!response.ok) {
      const errorData = (await response.json()) as PaymentError;
      throw new Error(errorData.message || 'Error al crear la sesión de pago');
    }

    return (await response.json()) as PaymentResponse;
  }

  static async redirectToCheckout(result: PaymentResponse): Promise<void> {
    if (result.checkoutUrl) {
      window.location.href = result.checkoutUrl;
      return;
    }

    if (result.sessionId) {
      await this.redirectWithStripe(result.sessionId);
      return;
    }

    throw new Error('No se recibió URL de checkout ni sessionId');
  }

  private static async redirectWithStripe(sessionId: string): Promise<void> {
    const stripe = (window as unknown as { Stripe?: unknown }).Stripe;

    if (!stripe) {
      throw new Error('Stripe no está disponible');
    }

    const stripeInstance = stripe as {
      redirectToCheckout: (options: {
        sessionId: string;
      }) => Promise<{ error?: { message: string } }>;
    };

    const { error } = await stripeInstance.redirectToCheckout({ sessionId });

    if (error) {
      throw new Error(error.message);
    }
  }
}
