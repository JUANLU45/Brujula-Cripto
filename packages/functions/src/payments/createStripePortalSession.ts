import { getApps, initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { defineSecret } from 'firebase-functions/params';
import { HttpsError, onCall, type CallableRequest } from 'firebase-functions/v2/https';
import Stripe from 'stripe';

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

interface UserData {
  stripeCustomerId?: string;
  email?: string;
  lastPortalAccess?: Date;
  updatedAt?: Date;
}

interface PortalAccessData {
  stripeCustomerId: string;
  portalSessionId: string;
  returnUrl: string;
  accessedAt: Date;
  userAgent: string;
  ipAddress: string;
}

/**
 * Valida la autenticación y obtiene los datos del usuario con Stripe Customer ID
 */
async function validateUserAndGetStripeId(uid: string): Promise<string> {
  const userDoc = await db.collection('users').doc(uid).get();

  if (!userDoc.exists) {
    throw new HttpsError('not-found', 'Usuario no encontrado');
  }

  const userData = userDoc.data() as UserData | undefined;
  const stripeCustomerId = userData?.stripeCustomerId;

  if (!stripeCustomerId) {
    throw new HttpsError('failed-precondition', 'Usuario no tiene Customer ID de Stripe');
  }

  return stripeCustomerId;
}

/**
 * Registra el acceso al portal en el historial del usuario
 */
async function logPortalAccess({
  uid,
  stripeCustomerId,
  portalSessionId,
  returnUrl,
  request,
}: {
  uid: string;
  stripeCustomerId: string;
  portalSessionId: string;
  returnUrl: string;
  request: CallableRequest<unknown>;
}): Promise<void> {
  const portalAccessData: PortalAccessData = {
    stripeCustomerId,
    portalSessionId,
    returnUrl,
    accessedAt: new Date(),
    userAgent: request.rawRequest.get('User-Agent') || 'unknown',
    ipAddress: request.rawRequest.ip || 'unknown',
  };

  await db.collection('users').doc(uid).collection('portalAccess').add(portalAccessData);

  // Actualizar último acceso al portal en el documento del usuario
  const userUpdateData: Partial<UserData> = {
    lastPortalAccess: new Date(),
    updatedAt: new Date(),
  };

  await db.collection('users').doc(uid).update(userUpdateData);
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

      // Validar usuario y obtener Stripe Customer ID
      const stripeCustomerId = await validateUserAndGetStripeId(uid);

      // Obtener returnUrl del request o usar URL por defecto
      const requestData = (request.data || {}) as PortalRequest;
      const { returnUrl } = requestData;
      const defaultReturnUrl = `${process.env.FRONTEND_URL}/dashboard/billing`;
      const finalReturnUrl = returnUrl || defaultReturnUrl;

      // Inicializar Stripe con la clave secreta
      const stripe = new Stripe(stripeSecretKey.value(), {
        apiVersion: '2023-10-16',
      });

      // Crear sesión del portal de Stripe
      const portalSession = await stripe.billingPortal.sessions.create({
        customer: stripeCustomerId,
        return_url: finalReturnUrl,
      });

      // Registrar el acceso al portal
      await logPortalAccess({
        uid,
        stripeCustomerId,
        portalSessionId: portalSession.id,
        returnUrl: finalReturnUrl,
        request,
      });

      console.log(`Portal session created for user ${uid} with customer ${stripeCustomerId}`);

      return {
        success: true,
        portalUrl: portalSession.url,
        sessionId: portalSession.id,
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
