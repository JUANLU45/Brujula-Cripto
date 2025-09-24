"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserCredits = exports.trackUsage = void 0;
const app_1 = require("firebase-admin/app");
const firestore_1 = require("firebase-admin/firestore");
const https_1 = require("firebase-functions/v2/https");
// Inicializar Firebase Admin si no está ya inicializado
if ((0, app_1.getApps)().length === 0) {
    (0, app_1.initializeApp)();
}
const db = (0, firestore_1.getFirestore)();
/**
 * Cloud Function que descuenta usageCreditsInSeconds en tiempo real
 * durante uso de herramientas/chatbot, trigger por eventos usuario
 *
 * Fuente: PROYEC_PARTE1.MD línea 218, PROYEC_PARTE3.MD línea 94-95
 * Créditos iniciales: 900s herramientas + 1800s chatbot
 */
// Función auxiliar para validar los datos de entrada
function validateTrackUsageData(data) {
    const parsedData = data;
    if (!parsedData.serviceType || !parsedData.actionType) {
        throw new https_1.HttpsError('invalid-argument', 'serviceType y actionType son requeridos');
    }
    if (!['herramientas', 'chatbot'].includes(parsedData.serviceType)) {
        throw new https_1.HttpsError('invalid-argument', 'serviceType debe ser "herramientas" o "chatbot"');
    }
    if (!['start', 'increment', 'end'].includes(parsedData.actionType)) {
        throw new https_1.HttpsError('invalid-argument', 'actionType debe ser "start", "increment" o "end"');
    }
    return {
        serviceType: parsedData.serviceType,
        actionType: parsedData.actionType,
        secondsUsed: parsedData.secondsUsed || 1,
        sessionId: parsedData.sessionId,
    };
}
/**
 * Procesa la acción 'start' para iniciar una sesión
 */
function processStartAction(serviceType, sessionId) {
    const sessionData = {
        serviceType,
        sessionId: sessionId || `session_${Date.now()}`,
        startTime: firestore_1.Timestamp.now(),
        creditsUsedInSession: 0,
        status: 'active',
    };
    return { sessionData, creditsToDeduct: 0 };
}
/**
 * Procesa la acción 'increment' para uso durante la sesión
 */
function processIncrementAction(secondsUsed, currentCredits) {
    const creditsToDeduct = secondsUsed || 1;
    if (currentCredits < creditsToDeduct) {
        throw new https_1.HttpsError('failed-precondition', `Créditos insuficientes. Disponibles: ${currentCredits}s, Requeridos: ${creditsToDeduct}s`);
    }
    const sessionData = {
        lastActivity: firestore_1.Timestamp.now(),
        creditsUsedInSession: firestore_1.FieldValue.increment(creditsToDeduct),
    };
    return { sessionData, creditsToDeduct };
}
/**
 * Procesa la acción 'end' para finalizar una sesión
 */
function processEndAction(secondsUsed, currentCredits) {
    let creditsToDeduct = secondsUsed || 1;
    const sessionData = {
        endTime: firestore_1.Timestamp.now(),
        creditsUsedInSession: firestore_1.FieldValue.increment(creditsToDeduct),
    };
    if (currentCredits >= creditsToDeduct) {
        sessionData.status = 'completed';
    }
    else {
        // Si no hay suficientes créditos, usar los restantes
        creditsToDeduct = currentCredits;
        sessionData.status = 'completed_with_insufficient_credits';
    }
    return { sessionData, creditsToDeduct };
}
/**
 * Actualiza los créditos del usuario y la sesión
 */
async function updateUserCreditsAndSession(uid, creditsToDeduct, sessionId, sessionData) {
    // Actualizar créditos del usuario si es necesario
    if (creditsToDeduct > 0) {
        await db
            .collection('users')
            .doc(uid)
            .update({
            usageCreditsInSeconds: firestore_1.FieldValue.increment(-creditsToDeduct),
            lastActivity: firestore_1.Timestamp.now(),
            updatedAt: firestore_1.Timestamp.now(),
        });
    }
    // Registrar la actividad de uso
    if (sessionId && Object.keys(sessionData).length > 0) {
        await db
            .collection('users')
            .doc(uid)
            .collection('usageSessions')
            .doc(sessionId)
            .set(sessionData, { merge: true });
    }
}
/**
 * Registra la entrada en el historial de uso
 */
async function logUsageHistory({ uid, serviceType, actionType, creditsToDeduct, sessionId, currentCredits, }) {
    const historyEntry = {
        serviceType,
        actionType,
        secondsUsed: creditsToDeduct,
        sessionId: sessionId || null,
        timestamp: firestore_1.Timestamp.now(),
        creditsBeforeAction: currentCredits,
        creditsAfterAction: currentCredits - creditsToDeduct,
    };
    await db.collection('users').doc(uid).collection('usageHistory').add(historyEntry);
}
/**
 * Procesa la acción y determina los créditos a deducir
 */
function processActionByType({ actionType, serviceType, sessionId, secondsUsed, currentCredits, }) {
    switch (actionType) {
        case 'start':
            return processStartAction(serviceType, sessionId);
        case 'increment':
            return processIncrementAction(secondsUsed || 1, currentCredits);
        case 'end':
            return processEndAction(secondsUsed || 1, currentCredits);
    }
}
/**
 * Valida la autenticación y obtiene los datos del usuario
 */
async function validateAndGetUserData(request) {
    // Verificar autenticación
    if (!request.auth) {
        throw new https_1.HttpsError('unauthenticated', 'Usuario no autenticado');
    }
    const uid = request.auth.uid;
    const validatedData = validateTrackUsageData(request.data);
    // Obtener documento del usuario
    const userRef = db.collection('users').doc(uid);
    const userDoc = await userRef.get();
    if (!userDoc.exists) {
        throw new https_1.HttpsError('not-found', 'Usuario no encontrado');
    }
    const userData = userDoc.data();
    const currentCredits = (userData === null || userData === void 0 ? void 0 : userData.usageCreditsInSeconds) || 0;
    // Validar que el usuario tenga suficientes créditos
    if (currentCredits <= 0 && validatedData.actionType !== 'start') {
        throw new https_1.HttpsError('failed-precondition', 'Sin créditos suficientes');
    }
    return { uid, currentCredits, validatedData };
}
exports.trackUsage = (0, https_1.onCall)({
    enforceAppCheck: false,
    cors: true,
}, async (request) => {
    try {
        const { uid, currentCredits, validatedData } = await validateAndGetUserData(request);
        const { serviceType, actionType, secondsUsed, sessionId } = validatedData;
        // Procesar la acción según el tipo
        const { sessionData, creditsToDeduct } = processActionByType({
            actionType,
            serviceType,
            sessionId,
            secondsUsed: secondsUsed || 1,
            currentCredits,
        });
        // Actualizar créditos y sesión
        await updateUserCreditsAndSession(uid, creditsToDeduct, sessionId, sessionData);
        // Registrar en historial de uso
        await logUsageHistory({
            uid,
            serviceType,
            actionType,
            creditsToDeduct,
            sessionId,
            currentCredits,
        });
        const remainingCredits = Math.max(0, currentCredits - creditsToDeduct);
        const response = {
            success: true,
            remainingCredits,
            totalCredits: currentCredits,
            creditsUsed: creditsToDeduct,
            message: actionType === 'start'
                ? `Sesión iniciada para ${serviceType}`
                : `${creditsToDeduct}s descontados de ${serviceType}. Restantes: ${remainingCredits}s`,
        };
        return response;
    }
    catch (error) {
        console.error('Error en trackUsage:', error);
        if (error instanceof https_1.HttpsError) {
            throw error;
        }
        throw new https_1.HttpsError('internal', 'Error interno del servidor al rastrear uso');
    }
});
/**
 * Función helper para obtener créditos restantes del usuario
 */
exports.getUserCredits = (0, https_1.onCall)({
    enforceAppCheck: false,
    cors: true,
}, async (request) => {
    try {
        if (!request.auth) {
            throw new https_1.HttpsError('unauthenticated', 'Usuario no autenticado');
        }
        const uid = request.auth.uid;
        const userDoc = await db.collection('users').doc(uid).get();
        if (!userDoc.exists) {
            throw new https_1.HttpsError('not-found', 'Usuario no encontrado');
        }
        const userData = userDoc.data();
        const usageCreditsInSeconds = (userData === null || userData === void 0 ? void 0 : userData.usageCreditsInSeconds) || 0;
        // Convertir segundos a formato H:M:S para la UI
        const hours = Math.floor(usageCreditsInSeconds / 3600);
        const minutes = Math.floor((usageCreditsInSeconds % 3600) / 60);
        const seconds = usageCreditsInSeconds % 60;
        return {
            success: true,
            usageCreditsInSeconds,
            formattedTime: `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`,
            hours,
            minutes,
            seconds: seconds,
            message: `Créditos disponibles: ${usageCreditsInSeconds}s`,
        };
    }
    catch (error) {
        console.error('Error obteniendo créditos de usuario:', error);
        if (error instanceof https_1.HttpsError) {
            throw error;
        }
        throw new https_1.HttpsError('internal', 'Error interno del servidor al obtener créditos');
    }
});
//# sourceMappingURL=trackUsage.js.map