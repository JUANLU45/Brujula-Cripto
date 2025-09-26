"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createStripePortalSession = void 0;
const params_1 = require("firebase-functions/params");
const https_1 = require("firebase-functions/v2/https");
const firestore_1 = require("firebase-admin/firestore");
const stripe_1 = __importDefault(require("stripe"));
const database_1 = require("../lib/database");
// Secreto para la API de Stripe
const stripeSecretKey = (0, params_1.defineSecret)('STRIPE_SECRET_KEY');
/**
 * Valida la autenticación y obtiene los datos del usuario con Stripe Customer ID
 */
async function validateUserAndGetStripeId(uid) {
    const userDoc = await database_1.database.getDocument('users', uid);
    if (!userDoc || !userDoc.exists) {
        throw new https_1.HttpsError('not-found', 'Usuario no encontrado');
    }
    const userData = userDoc.data;
    const stripeCustomerId = userData === null || userData === void 0 ? void 0 : userData.stripeCustomerId;
    if (!stripeCustomerId) {
        throw new https_1.HttpsError('failed-precondition', 'Usuario no tiene Customer ID de Stripe');
    }
    return stripeCustomerId;
}
/**
 * Registra el acceso al portal en el historial del usuario
 */
async function logPortalAccess({ uid, stripeCustomerId, portalSessionId, returnUrl, request, }) {
    const portalAccessData = {
        stripeCustomerId,
        portalSessionId,
        returnUrl,
        accessedAt: firestore_1.Timestamp.now(),
        userAgent: request.rawRequest.get('User-Agent') || 'unknown',
        ipAddress: request.rawRequest.ip || 'unknown',
    };
    await database_1.database.addSubDocument('users', uid, 'portalAccess', portalAccessData);
    // Actualizar último acceso al portal en el documento del usuario
    await database_1.database.updateDocument('users', uid, {
        lastPortalAccess: firestore_1.Timestamp.now(),
        updatedAt: firestore_1.Timestamp.now(),
    });
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
exports.createStripePortalSession = (0, https_1.onCall)({
    secrets: [stripeSecretKey],
    enforceAppCheck: false,
    cors: true,
}, async (request) => {
    try {
        // Verificar autenticación
        if (!request.auth) {
            throw new https_1.HttpsError('unauthenticated', 'Usuario no autenticado');
        }
        const uid = request.auth.uid;
        // Validar usuario y obtener Stripe Customer ID
        const stripeCustomerId = await validateUserAndGetStripeId(uid);
        // Obtener returnUrl del request o usar URL por defecto
        const requestData = (request.data || {});
        const { returnUrl } = requestData;
        const defaultReturnUrl = `${process.env.FRONTEND_URL}/dashboard/billing`;
        const finalReturnUrl = returnUrl || defaultReturnUrl;
        // Inicializar Stripe con la clave secreta
        const stripe = new stripe_1.default(stripeSecretKey.value(), {
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
    }
    catch (error) {
        console.error('Error creating Stripe portal session:', error);
        if (error instanceof https_1.HttpsError) {
            throw error;
        }
        throw new https_1.HttpsError('internal', 'Error interno del servidor al crear sesión del portal');
    }
});
//# sourceMappingURL=createStripePortalSession.js.map