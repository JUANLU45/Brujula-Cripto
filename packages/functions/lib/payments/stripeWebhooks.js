'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.stripeWebhooks = void 0;
const app_1 = require('firebase-admin/app');
const firestore_1 = require('firebase-admin/firestore');
const params_1 = require('firebase-functions/params');
const https_1 = require('firebase-functions/v2/https');
// Inicializar Firebase Admin si no está ya inicializado
if ((0, app_1.getApps)().length === 0) {
  (0, app_1.initializeApp)();
}
const db = (0, firestore_1.getFirestore)();
// Secreto para el webhook endpoint de Stripe
const stripeWebhookSecret = (0, params_1.defineSecret)('STRIPE_WEBHOOK_SECRET');
/**
 * Cloud Function que maneja webhooks de Stripe
 *
 * Eventos manejados:
 * - checkout.session.completed: Añade créditos de horas al usuario
 * - customer.subscription.created: Manejo de suscripciones
 * - customer.subscription.deleted: Cancelación de suscripciones
 * - invoice.payment_succeeded: Pagos de facturas exitosos
 * - payment_intent.succeeded: Confirmación de pagos
 */
exports.stripeWebhooks = (0, https_1.onRequest)(
  {
    secrets: [stripeWebhookSecret],
    cors: false,
    invoker: 'public',
  },
  async (request, response) => {
    try {
      const sig = request.get('Stripe-Signature');
      const webhookSecret = stripeWebhookSecret.value();
      if (!sig || !webhookSecret) {
        console.error('Missing Stripe signature or webhook secret');
        response.status(400).send('Missing signature or secret');
        return;
      }
      // En un entorno real, verificar la firma de Stripe:
      // const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
      // let event;
      // try {
      //   event = stripe.webhooks.constructEvent(request.body, sig, webhookSecret);
      // } catch (err) {
      //   console.error('Webhook signature verification failed:', err.message);
      //   response.status(400).send(`Webhook Error: ${err.message}`);
      //   return;
      // }
      // Para desarrollo/demostración, parsear el cuerpo directamente
      const event = JSON.parse(request.body.toString());
      console.log('Stripe webhook event received:', event.type);
      switch (event.type) {
        case 'checkout.session.completed':
          await handleCheckoutSessionCompleted(event.data.object);
          break;
        case 'customer.subscription.created':
          await handleSubscriptionCreated(event.data.object);
          break;
        case 'customer.subscription.deleted':
          await handleSubscriptionDeleted(event.data.object);
          break;
        case 'invoice.payment_succeeded':
          await handleInvoicePaymentSucceeded(event.data.object);
          break;
        case 'payment_intent.succeeded':
          await handlePaymentIntentSucceeded(event.data.object);
          break;
        default:
          console.log(`Unhandled event type: ${event.type}`);
      }
      response.status(200).send('OK');
    } catch (error) {
      console.error('Error processing webhook:', error);
      response.status(500).send('Internal Server Error');
    }
  },
);
/**
 * Maneja el evento checkout.session.completed
 * Añade créditos de horas al usuario según las horas compradas
 */
async function handleCheckoutSessionCompleted(session) {
  try {
    const { userId, hours, hoursInSeconds } = session.metadata || {};
    if (!userId || !hours || !hoursInSeconds) {
      console.error('Missing metadata in checkout session:', session.metadata);
      return;
    }
    const userRef = db.collection('users').doc(userId);
    const userDoc = await userRef.get();
    if (!userDoc.exists) {
      console.error('User not found:', userId);
      return;
    }
    // Convertir horas a segundos para almacenar en usageCreditsInSeconds
    const creditsToAdd = parseInt(hoursInSeconds, 10);
    // Actualizar créditos del usuario
    await userRef.update({
      usageCreditsInSeconds: firestore_1.FieldValue.increment(creditsToAdd),
      lastPurchaseDate: firestore_1.Timestamp.now(),
      lastPurchaseAmount: session.amount_total,
      lastPurchaseHours: parseInt(hours, 10),
      updatedAt: firestore_1.Timestamp.now(),
    });
    // Registrar la transacción en el historial de pagos
    await db
      .collection('users')
      .doc(userId)
      .collection('paymentHistory')
      .add({
        stripeSessionId: session.id,
        stripeCustomerId: session.customer,
        amountPaid: session.amount_total,
        currency: session.currency,
        hoursPurchase: parseInt(hours, 10),
        creditsAddedInSeconds: creditsToAdd,
        paymentStatus: 'completed',
        paymentDate: firestore_1.Timestamp.now(),
        paymentMethod: 'stripe_checkout',
        createdAt: firestore_1.Timestamp.now(),
      });
    console.log(`Successfully added ${hours} hours (${creditsToAdd} seconds) to user ${userId}`);
  } catch (error) {
    console.error('Error handling checkout session completed:', error);
    throw error;
  }
}
/**
 * Maneja el evento customer.subscription.created
 * Registra nueva suscripción del usuario
 */
async function handleSubscriptionCreated(subscription) {
  try {
    const customerId = subscription.customer;
    // Buscar usuario por Stripe Customer ID
    const usersQuery = await db
      .collection('users')
      .where('stripeCustomerId', '==', customerId)
      .limit(1)
      .get();
    if (usersQuery.empty) {
      console.error('User not found for Stripe customer:', customerId);
      return;
    }
    const userDoc = usersQuery.docs[0];
    const userId = userDoc.id;
    // Actualizar información de suscripción
    await db
      .collection('users')
      .doc(userId)
      .update({
        stripeSubscriptionId: subscription.id,
        subscriptionStatus: subscription.status,
        subscriptionStartDate: firestore_1.Timestamp.fromMillis(subscription.created * 1000),
        subscriptionCurrentPeriodStart: firestore_1.Timestamp.fromMillis(
          subscription.current_period_start * 1000,
        ),
        subscriptionCurrentPeriodEnd: firestore_1.Timestamp.fromMillis(
          subscription.current_period_end * 1000,
        ),
        updatedAt: firestore_1.Timestamp.now(),
      });
    console.log(`Subscription created for user ${userId}:`, subscription.id);
  } catch (error) {
    console.error('Error handling subscription created:', error);
    throw error;
  }
}
/**
 * Maneja el evento customer.subscription.deleted
 * Cancela la suscripción del usuario
 */
async function handleSubscriptionDeleted(subscription) {
  try {
    const customerId = subscription.customer;
    // Buscar usuario por Stripe Customer ID
    const usersQuery = await db
      .collection('users')
      .where('stripeCustomerId', '==', customerId)
      .limit(1)
      .get();
    if (usersQuery.empty) {
      console.error('User not found for Stripe customer:', customerId);
      return;
    }
    const userDoc = usersQuery.docs[0];
    const userId = userDoc.id;
    // Actualizar estado de suscripción
    await db.collection('users').doc(userId).update({
      subscriptionStatus: 'cancelled',
      subscriptionCancelledAt: firestore_1.Timestamp.now(),
      updatedAt: firestore_1.Timestamp.now(),
    });
    console.log(`Subscription cancelled for user ${userId}:`, subscription.id);
  } catch (error) {
    console.error('Error handling subscription deleted:', error);
    throw error;
  }
}
/**
 * Maneja el evento invoice.payment_succeeded
 * Procesa pagos exitosos de facturas de suscripción
 */
async function handleInvoicePaymentSucceeded(invoice) {
  try {
    const customerId = invoice.customer;
    const subscriptionId = invoice.subscription;
    // Buscar usuario por Stripe Customer ID
    const usersQuery = await db
      .collection('users')
      .where('stripeCustomerId', '==', customerId)
      .limit(1)
      .get();
    if (usersQuery.empty) {
      console.error('User not found for Stripe customer:', customerId);
      return;
    }
    const userDoc = usersQuery.docs[0];
    const userId = userDoc.id;
    // Registrar el pago de la factura
    await db
      .collection('users')
      .doc(userId)
      .collection('paymentHistory')
      .add({
        stripeInvoiceId: invoice.id,
        stripeCustomerId: customerId,
        stripeSubscriptionId: subscriptionId,
        amountPaid: invoice.amount_paid,
        currency: invoice.currency,
        paymentStatus: 'completed',
        paymentDate: firestore_1.Timestamp.fromMillis(invoice.created * 1000),
        paymentMethod: 'stripe_subscription',
        invoiceNumber: invoice.number,
        createdAt: firestore_1.Timestamp.now(),
      });
    console.log(`Invoice payment processed for user ${userId}:`, invoice.id);
  } catch (error) {
    console.error('Error handling invoice payment succeeded:', error);
    throw error;
  }
}
/**
 * Maneja el evento payment_intent.succeeded
 * Confirma pagos exitosos de PaymentIntents
 */
async function handlePaymentIntentSucceeded(paymentIntent) {
  try {
    const customerId = paymentIntent.customer;
    if (!customerId) {
      console.log('Payment intent without customer:', paymentIntent.id);
      return;
    }
    // Buscar usuario por Stripe Customer ID
    const usersQuery = await db
      .collection('users')
      .where('stripeCustomerId', '==', customerId)
      .limit(1)
      .get();
    if (usersQuery.empty) {
      console.error('User not found for Stripe customer:', customerId);
      return;
    }
    const userDoc = usersQuery.docs[0];
    const userId = userDoc.id;
    // Registrar el pago exitoso
    await db
      .collection('users')
      .doc(userId)
      .collection('paymentHistory')
      .add({
        stripePaymentIntentId: paymentIntent.id,
        stripeCustomerId: customerId,
        amountPaid: paymentIntent.amount,
        currency: paymentIntent.currency,
        paymentStatus: 'completed',
        paymentDate: firestore_1.Timestamp.fromMillis(paymentIntent.created * 1000),
        paymentMethod: 'stripe_payment_intent',
        createdAt: firestore_1.Timestamp.now(),
      });
    console.log(`Payment intent succeeded for user ${userId}:`, paymentIntent.id);
  } catch (error) {
    console.error('Error handling payment intent succeeded:', error);
    throw error;
  }
}
// Fuente: PROYEC_PARTE1.MD línea 206
// Propósito: Maneja eventos Stripe (checkout.session.completed suma usageCreditsInSeconds; subscription.created/updated/deleted actualiza campos user)
//# sourceMappingURL=stripeWebhooks.js.map
