import { Stripe } from 'stripe';

// Configuración de Stripe para el cliente (FRONTEND - SOLO CLAVE PÚBLICA)
export const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!, {
  apiVersion: '2025-08-27.basil',
});

// Tipos para las respuestas de Stripe
export interface StripeCheckoutResponse {
  sessionId: string;
  url: string;
}

export interface StripePortalResponse {
  url: string;
}

// Precios de los productos (deben coincidir con Stripe Dashboard)
export const STRIPE_PRICES = {
  PREMIUM_1H: process.env.NEXT_PUBLIC_STRIPE_PRICE_PREMIUM_1H!,
  PREMIUM_5H: process.env.NEXT_PUBLIC_STRIPE_PRICE_PREMIUM_5H!,
  PREMIUM_10H: process.env.NEXT_PUBLIC_STRIPE_PRICE_PREMIUM_10H!,
} as const;

// Funciones helper para Stripe
export async function createCheckoutSession(
  priceId: string,
  customerId?: string,
  successUrl?: string,
  cancelUrl?: string,
): Promise<Stripe.Checkout.Session> {
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    mode: 'payment',
    customer: customerId,
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    success_url: successUrl || `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?success=true`,
    cancel_url: cancelUrl || `${process.env.NEXT_PUBLIC_APP_URL}/pricing?canceled=true`,
    metadata: {
      priceId,
    },
  });

  return session;
}

export async function createPortalSession(
  customerId: string,
  returnUrl?: string,
): Promise<Stripe.BillingPortal.Session> {
  const portalSession = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: returnUrl || `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`,
  });

  return portalSession;
}

export async function getCustomer(customerId: string): Promise<Stripe.Customer | null> {
  try {
    const customer = await stripe.customers.retrieve(customerId);
    return customer as Stripe.Customer;
  } catch (error) {
    console.error('Error retrieving Stripe customer:', error);
    return null;
  }
}

export async function createCustomer(
  email: string,
  name?: string,
  uid?: string,
): Promise<Stripe.Customer> {
  const customer = await stripe.customers.create({
    email,
    name,
    metadata: {
      firebaseUid: uid || '',
    },
  });

  return customer;
}
