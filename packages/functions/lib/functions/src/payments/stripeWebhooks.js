"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.stripeWebhooks = void 0;
const firestore_1 = require("firebase-admin/firestore");
const params_1 = require("firebase-functions/params");
const https_1 = require("firebase-functions/v2/https");
const stripe_1 = __importDefault(require("stripe"));
const database_1 = require("../lib/database");
// Secretos para Stripe
const stripeWebhookSecret = (0, params_1.defineSecret)('STRIPE_WEBHOOK_SECRET');
const stripeSecretKey = (0, params_1.defineSecret)('STRIPE_SECRET_KEY');
/**
 * Cloud Function que maneja webhooks de Stripe
 *
 * Eventos manejados:
 * - checkout.session.completed: Añade créditos de horas al usuario
 */
exports.stripeWebhooks = (0, https_1.onRequest)({
    secrets: [stripeWebhookSecret, stripeSecretKey],
    cors: false,
    invoker: 'public',
}, async (request, response) => {
    try {
        const sig = request.get('Stripe-Signature');
        const webhookSecret = stripeWebhookSecret.value();
        if (!sig || !webhookSecret) {
            console.error('Missing Stripe signature or webhook secret');
            response.status(400).send('Missing signature or secret');
            return;
        }
        // Inicializar Stripe para validación de webhook
        const stripe = new stripe_1.default(stripeSecretKey.value(), {
            apiVersion: '2023-10-16',
        });
        // Verificar la firma de Stripe para seguridad
        let event;
        try {
            event = stripe.webhooks.constructEvent(request.rawBody, sig, webhookSecret);
        }
        catch (err) {
            const error = err;
            console.error('Webhook signature verification failed:', error.message);
            response.status(400).send(`Webhook Error: ${error.message}`);
            return;
        }
        console.log('Stripe webhook event received:', event.type);
        switch (event.type) {
            case 'checkout.session.completed':
                await handleCheckoutSessionCompleted(event.data.object);
                break;
            default:
                console.log(`Unhandled event type: ${event.type}`);
        }
        response.status(200).send('OK');
    }
    catch (error) {
        console.error('Error processing webhook:', error);
        response.status(500).send('Internal Server Error');
    }
});
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
        const userDoc = await database_1.database.getDocument('users', userId);
        if (!userDoc || !userDoc.exists) {
            console.error('User not found:', userId);
            return;
        }
        // Convertir horas a segundos para almacenar en usageCreditsInSeconds
        const creditsToAdd = parseInt(hoursInSeconds, 10);
        const currentCredits = userDoc.data.usageCreditsInSeconds || 0;
        // Actualizar créditos del usuario
        await database_1.database.updateDocument('users', userId, {
            usageCreditsInSeconds: currentCredits + creditsToAdd,
            lastPurchaseDate: firestore_1.Timestamp.now(),
            lastPurchaseAmount: session.amount_total,
            lastPurchaseHours: parseInt(hours, 10),
            updatedAt: firestore_1.Timestamp.now(),
        });
        // Registrar la transacción en el historial de pagos
        await database_1.database.addSubDocument('users', userId, 'paymentHistory', {
            stripeSessionId: session.id,
            stripeCustomerId: typeof session.customer === 'string' ? session.customer : null,
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
    }
    catch (error) {
        console.error('Error handling checkout session completed:', error);
        throw error;
    }
}
//# sourceMappingURL=stripeWebhooks.js.map