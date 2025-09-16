import { Stripe } from 'stripe';

// Configuración de Stripe para el cliente (FRONTEND - SOLO CLAVE PÚBLICA)
const stripePublishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
if (!stripePublishableKey) {
  throw new Error('NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is required');
}

export const stripe = new Stripe(stripePublishableKey, {
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
const premium1h = process.env.NEXT_PUBLIC_STRIPE_PRICE_PREMIUM_1H;
const premium5h = process.env.NEXT_PUBLIC_STRIPE_PRICE_PREMIUM_5H;
const premium10h = process.env.NEXT_PUBLIC_STRIPE_PRICE_PREMIUM_10H;

if (!premium1h || !premium5h || !premium10h) {
  throw new Error('Stripe price environment variables are required');
}

export const STRIPE_PRICES = {
  PREMIUM_1H: premium1h,
  PREMIUM_5H: premium5h,
  PREMIUM_10H: premium10h,
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
