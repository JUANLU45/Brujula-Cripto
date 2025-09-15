import { getApps, initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { HttpsError, onCall } from 'firebase-functions/v2/https';

// Inicializar Firebase Admin si no está ya inicializado
if (!getApps().length) {
  initializeApp();
}

// Nota: En un entorno real, Stripe SDK se importaría así:
// import Stripe from 'stripe';
// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2023-10-16' });

interface CheckoutRequest {
  hours: number;
  successUrl?: string;
  cancelUrl?: string;
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

    const { hours }: CheckoutRequest = request.data;

    // Validar parámetros de entrada
    if (!hours || typeof hours !== 'number' || hours <= 0) {
      throw new HttpsError('invalid-argument', 'Las horas deben ser un número positivo');
    }

    const db = getFirestore();
    const userId = request.auth.uid;

    // Obtener documento del usuario para verificar stripeCustomerId
    const userDoc = await db.collection('users').doc(userId).get();
    if (!userDoc.exists) {
      throw new HttpsError('not-found', 'Usuario no encontrado');
    }

    const userData = userDoc.data();
    let stripeCustomerId = userData?.stripeCustomerId;

    // Si no existe stripeCustomerId, crear cliente en Stripe
    if (!stripeCustomerId) {
      // En un entorno real:
      // const customer = await stripe.customers.create({
      //   email: userData?.email,
      //   metadata: { firebaseUID: userId }
      // });
      // stripeCustomerId = customer.id;

      // Para desarrollo/demostración:
      stripeCustomerId = `cus_demo_${userId.substring(0, 8)}`;

      // Actualizar documento del usuario con stripeCustomerId
      await db.collection('users').doc(userId).update({
        stripeCustomerId,
      });
    }

    // Obtener configuración de precios desde Firestore
    const pricingDoc = await db.collection('siteConfig').doc('pricing').get();
    let firstTwoHoursPrice = 4.99;
    let additionalHoursPrice = 3.99;

    if (pricingDoc.exists) {
      const pricingData = pricingDoc.data();
      firstTwoHoursPrice = pricingData?.firstTwoHours?.price || 4.99;
      additionalHoursPrice = pricingData?.additionalHours?.price || 3.99;
    }

    // Calcular precio total según modelo escalonado
    let totalPrice = 0;
    let priceBreakdown: any = {};

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

    // Convertir a centavos para Stripe
    const totalAmountInCents = Math.round(totalPrice * 100);

    // En un entorno real, crear sesión de checkout:
    // const session = await stripe.checkout.sessions.create({
    //   customer: stripeCustomerId,
    //   payment_method_types: ['card'],
    //   line_items: [{
    //     price_data: {
    //       currency: 'eur',
    //       product_data: {
    //         name: `Paquete de ${hours} horas - Brújula Cripto`,
    //         description: `Créditos de tiempo para herramientas y chatbot`
    //       },
    //       unit_amount: totalAmountInCents,
    //     },
    //     quantity: 1,
    //   }],
    //   mode: 'payment',
    //   success_url: successUrl || `${process.env.FRONTEND_URL}/dashboard?checkout=success`,
    //   cancel_url: cancelUrl || `${process.env.FRONTEND_URL}/pricing?checkout=cancelled`,
    //   metadata: {
    //     userId,
    //     hours: hours.toString(),
    //     hoursInSeconds: (hours * 3600).toString()
    //   }
    // });

    // Para desarrollo/demostración, simular respuesta de Stripe:
    const mockSession = {
      id: `cs_demo_${Date.now()}`,
      url: `https://checkout.stripe.com/pay/demo_${Date.now()}`,
      customer: stripeCustomerId,
      amount_total: totalAmountInCents,
      currency: 'eur',
      metadata: {
        userId,
        hours: hours.toString(),
        hoursInSeconds: (hours * 3600).toString(),
      },
    };

    return {
      success: true,
      sessionId: mockSession.id,
      checkoutUrl: mockSession.url,
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
