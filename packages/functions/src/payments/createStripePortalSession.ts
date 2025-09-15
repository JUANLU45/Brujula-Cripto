import { getApps, initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { defineSecret } from 'firebase-functions/params';
import { HttpsError, onCall } from 'firebase-functions/v2/https';

// Inicializar Firebase Admin si no está ya inicializado
if (getApps().length === 0) {
  initializeApp();
}

const db = getFirestore();

// Secreto para la API de Stripe
const stripeSecretKey = defineSecret('STRIPE_SECRET_KEY');

interface PortalRequest {
  returnUrl?: string;
}

/**
 * Cloud Function que crea una sesión del Portal de Cliente de Stripe
 *
 * Permite a los usuarios:
 * - Ver su historial de pagos
 * - Actualizar métodos de pago
 * - Cancelar suscripciones
 * - Descargar facturas
 *
 * @param request - Datos de la solicitud con returnUrl opcional
 * @returns URL de la sesión del portal de Stripe
 */
export const createStripePortalSession = onCall(
  {
    secrets: [stripeSecretKey],
    enforceAppCheck: false,
    cors: true,
  },
  async (request) => {
    try {
      // Verificar autenticación
      if (!request.auth) {
        throw new HttpsError('unauthenticated', 'Usuario no autenticado');
      }

      const uid = request.auth.uid;

      // Obtener datos del usuario
      const userDoc = await db.collection('users').doc(uid).get();

      if (!userDoc.exists) {
        throw new HttpsError('not-found', 'Usuario no encontrado');
      }

      const userData = userDoc.data();
      const stripeCustomerId = userData?.stripeCustomerId;

      if (!stripeCustomerId) {
        throw new HttpsError('failed-precondition', 'Usuario no tiene Customer ID de Stripe');
      }

      // Obtener returnUrl del request o usar URL por defecto
      const { returnUrl }: PortalRequest = request.data || {};
      const defaultReturnUrl = `${process.env.FRONTEND_URL}/dashboard/billing`;
      const finalReturnUrl = returnUrl || defaultReturnUrl;

      // En un entorno real, crear sesión del portal de Stripe:
      // const stripe = require('stripe')(stripeSecretKey.value());
      // const portalSession = await stripe.billingPortal.sessions.create({
      //   customer: stripeCustomerId,
      //   return_url: finalReturnUrl,
      // });

      // Para desarrollo/demostración, simular respuesta de Stripe:
      const mockPortalSession = {
        id: `bps_demo_${Date.now()}`,
        object: 'billing_portal.session',
        created: Math.floor(Date.now() / 1000),
        customer: stripeCustomerId,
        livemode: false,
        return_url: finalReturnUrl,
        url: `https://billing.stripe.com/session/demo_${Date.now()}`,
      };

      // Registrar el acceso al portal en el historial del usuario
      await db
        .collection('users')
        .doc(uid)
        .collection('portalAccess')
        .add({
          stripeCustomerId,
          portalSessionId: mockPortalSession.id,
          returnUrl: finalReturnUrl,
          accessedAt: new Date(),
          userAgent: request.rawRequest.get('User-Agent') || 'unknown',
          ipAddress: request.rawRequest.ip || 'unknown',
        });

      // Actualizar último acceso al portal en el documento del usuario
      await db.collection('users').doc(uid).update({
        lastPortalAccess: new Date(),
        updatedAt: new Date(),
      });

      console.log(`Portal session created for user ${uid} with customer ${stripeCustomerId}`);

      return {
        success: true,
        portalUrl: mockPortalSession.url,
        sessionId: mockPortalSession.id,
        customerId: stripeCustomerId,
      };
    } catch (error) {
      console.error('Error creating Stripe portal session:', error);

      if (error instanceof HttpsError) {
        throw error;
      }

      throw new HttpsError('internal', 'Error interno del servidor al crear sesión del portal');
    }
  },
);
// Fuente: PROYEC_PARTE1.MD línea 209
// Propósito: Crea sesión portal Stripe para gestión (facturación, cancelación), verifica autenticación y stripeCustomerId
