import { getApps, initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { HttpsError, onCall } from 'firebase-functions/v2/https';
import Stripe from 'stripe';

// Inicializar Firebase Admin si no está ya inicializado
if (!getApps().length) {
  initializeApp();
}

const db = getFirestore();

// Inicializar Stripe con clave secreta desde Secret Manager
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
if (!stripeSecretKey) {
  throw new Error('La variable de entorno STRIPE_SECRET_KEY no está definida');
}

const stripe = new Stripe(stripeSecretKey, {
  apiVersion: '2023-10-16',
});

interface CheckoutRequest {
  hours: number;
  successUrl?: string;
  cancelUrl?: string;
}

// Tipos para documentos de Firestore
interface UserData {
  stripeCustomerId?: string;
  email?: string;
  // Otros campos del usuario pueden agregarse aquí
}

interface PricingData {
  firstTwoHours?: {
    price?: number;
  };
  additionalHours?: {
    price?: number;
  };
}

interface PriceBreakdownItem {
  hours: number;
  price: number;
  total: number;
}

interface PriceBreakdown {
  firstTwoHours: PriceBreakdownItem;
  additionalHours: PriceBreakdownItem;
}

/**
 * Función auxiliar para validar los datos de entrada
 */
function validateCheckoutData(data: unknown): CheckoutRequest {
  const parsedData = data as CheckoutRequest;

  if (!parsedData.hours || typeof parsedData.hours !== 'number' || parsedData.hours <= 0) {
    throw new HttpsError('invalid-argument', 'Las horas deben ser un número positivo');
  }

  return {
    hours: parsedData.hours,
    successUrl: parsedData.successUrl,
    cancelUrl: parsedData.cancelUrl,
  };
}

/**
 * Función auxiliar para obtener o crear cliente de Stripe
 */
async function getOrCreateStripeCustomer(uid: string, userData: UserData): Promise<string> {
  if (userData.stripeCustomerId) {
    return userData.stripeCustomerId;
  }

  const customer = await stripe.customers.create({
    email: userData.email,
    metadata: { firebaseUID: uid },
  });

  await db.collection('users').doc(uid).update({
    stripeCustomerId: customer.id,
  });

  return customer.id;
}

/**
 * Función auxiliar para calcular precios
 */
async function calculateHoursPrice(
  hours: number,
): Promise<{ totalPrice: number; priceBreakdown: PriceBreakdown }> {
  const pricingDoc = await db.collection('siteConfig').doc('pricing').get();
  let firstTwoHoursPrice = 4.99;
  let additionalHoursPrice = 3.99;

  if (pricingDoc.exists) {
    const pricingData = pricingDoc.data() as PricingData | undefined;
    firstTwoHoursPrice = pricingData?.firstTwoHours?.price || 4.99;
    additionalHoursPrice = pricingData?.additionalHours?.price || 3.99;
  }

  let totalPrice = 0;
  let priceBreakdown: PriceBreakdown;

  if (hours <= 2) {
    totalPrice = hours * firstTwoHoursPrice;
    priceBreakdown = {
      firstTwoHours: { hours, price: firstTwoHoursPrice, total: totalPrice },
      additionalHours: { hours: 0, price: additionalHoursPrice, total: 0 },
    };
  } else {
    const firstTwoTotal = 2 * firstTwoHoursPrice;
    const additionalHours = hours - 2;
    const additionalTotal = additionalHours * additionalHoursPrice;
    totalPrice = firstTwoTotal + additionalTotal;

    priceBreakdown = {
      firstTwoHours: { hours: 2, price: firstTwoHoursPrice, total: firstTwoTotal },
      additionalHours: {
        hours: additionalHours,
        price: additionalHoursPrice,
        total: additionalTotal,
      },
    };
  }

  return { totalPrice, priceBreakdown };
}

/**
 * Crear sesión de checkout de Stripe para paquetes de horas
 * Fuente: PROYEC_PARTE1.MD línea 206
 */
export const createCheckout = onCall(async (request) => {
  try {
    // Verificar autenticación del usuario
    if (!request.auth) {
      throw new HttpsError('unauthenticated', 'Usuario no autenticado');
    }

    const validatedData = validateCheckoutData(request.data);
    const { hours, successUrl, cancelUrl } = validatedData;

    const db = getFirestore();
    const userId = request.auth.uid;

    // Obtener documento del usuario para verificar stripeCustomerId
    const userDoc = await db.collection('users').doc(userId).get();
    if (!userDoc.exists) {
      throw new HttpsError('not-found', 'Usuario no encontrado');
    }

    const userData = userDoc.data() as UserData | undefined;
    if (!userData) {
      throw new HttpsError('not-found', 'Datos de usuario no válidos');
    }

    // Obtener o crear cliente de Stripe
    const stripeCustomerId = await getOrCreateStripeCustomer(userId, userData);

    // Calcular precios
    const { totalPrice, priceBreakdown } = await calculateHoursPrice(hours);

    // Convertir a centavos para Stripe
    const totalAmountInCents = Math.round(totalPrice * 100);

    // Crear sesión de checkout en Stripe
    const session = await stripe.checkout.sessions.create({
      customer: stripeCustomerId,
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: `Paquete de ${hours} horas - Brújula Cripto`,
              description: `Créditos de tiempo para herramientas y chatbot`,
            },
            unit_amount: totalAmountInCents,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: successUrl || `${process.env.FRONTEND_URL}/dashboard?checkout=success`,
      cancel_url: cancelUrl || `${process.env.FRONTEND_URL}/pricing?checkout=cancelled`,
      metadata: {
        userId,
        hours: hours.toString(),
        hoursInSeconds: (hours * 3600).toString(),
      },
    });

    return {
      success: true,
      sessionId: session.id,
      checkoutUrl: session.url,
      totalAmount: totalPrice,
      currency: 'EUR',
      hours,
      priceBreakdown,
      message: 'Sesión de checkout creada exitosamente',
    };
  } catch (error) {
    console.error('Error creando sesión de checkout:', error);

    if (error instanceof HttpsError) {
      throw error;
    }

    throw new HttpsError('internal', 'Error interno del servidor al crear checkout');
  }
});
