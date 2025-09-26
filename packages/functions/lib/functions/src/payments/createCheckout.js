"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCheckout = void 0;
const https_1 = require("firebase-functions/v2/https");
const stripe_1 = __importDefault(require("stripe"));
const database_1 = require("../lib/database");
// Inicializar Stripe con clave secreta desde Secret Manager
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
if (!stripeSecretKey) {
    throw new Error('La variable de entorno STRIPE_SECRET_KEY no está definida');
}
const stripe = new stripe_1.default(stripeSecretKey, {
    apiVersion: '2023-10-16',
});
/**
 * Función auxiliar para validar los datos de entrada
 */
function validateCheckoutData(data) {
    const parsedData = data;
    if (!parsedData.hours || typeof parsedData.hours !== 'number' || parsedData.hours <= 0) {
        throw new https_1.HttpsError('invalid-argument', 'Las horas deben ser un número positivo');
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
async function getOrCreateStripeCustomer(uid, userData) {
    if (userData.stripeCustomerId) {
        return userData.stripeCustomerId;
    }
    const customer = await stripe.customers.create({
        email: userData.email,
        metadata: { firebaseUID: uid },
    });
    await database_1.database.updateDocument('users', uid, {
        stripeCustomerId: customer.id,
    });
    return customer.id;
}
/**
 * Función auxiliar para calcular precios
 */
async function calculateHoursPrice(hours) {
    var _a, _b;
    const pricingDoc = await database_1.database.getDocument('siteConfig', 'pricing');
    let firstTwoHoursPrice = 4.99;
    let additionalHoursPrice = 3.99;
    if (pricingDoc && pricingDoc.exists) {
        const pricingData = pricingDoc.data;
        firstTwoHoursPrice = ((_a = pricingData === null || pricingData === void 0 ? void 0 : pricingData.firstTwoHours) === null || _a === void 0 ? void 0 : _a.price) || 4.99;
        additionalHoursPrice = ((_b = pricingData === null || pricingData === void 0 ? void 0 : pricingData.additionalHours) === null || _b === void 0 ? void 0 : _b.price) || 3.99;
    }
    let totalPrice = 0;
    let priceBreakdown;
    if (hours <= 2) {
        totalPrice = hours * firstTwoHoursPrice;
        priceBreakdown = {
            firstTwoHours: { hours, price: firstTwoHoursPrice, total: totalPrice },
            additionalHours: { hours: 0, price: additionalHoursPrice, total: 0 },
        };
    }
    else {
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
exports.createCheckout = (0, https_1.onCall)(async (request) => {
    try {
        // Verificar autenticación del usuario
        if (!request.auth) {
            throw new https_1.HttpsError('unauthenticated', 'Usuario no autenticado');
        }
        const validatedData = validateCheckoutData(request.data);
        const { hours, successUrl, cancelUrl } = validatedData;
        const userId = request.auth.uid;
        // Obtener documento del usuario para verificar stripeCustomerId
        const userDoc = await database_1.database.getDocument('users', userId);
        if (!userDoc || !userDoc.exists) {
            throw new https_1.HttpsError('not-found', 'Usuario no encontrado');
        }
        const userData = userDoc.data;
        if (!userData) {
            throw new https_1.HttpsError('not-found', 'Datos de usuario no válidos');
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
    }
    catch (error) {
        console.error('Error creando sesión de checkout:', error);
        if (error instanceof https_1.HttpsError) {
            throw error;
        }
        throw new https_1.HttpsError('internal', 'Error interno del servidor al crear checkout');
    }
});
//# sourceMappingURL=createCheckout.js.map