'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.getUserCredits = exports.trackUsage = void 0;
const app_1 = require('firebase-admin/app');
const firestore_1 = require('firebase-admin/firestore');
const https_1 = require('firebase-functions/v2/https');
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
exports.trackUsage = (0, https_1.onCall)(
  {
    enforceAppCheck: false,
    cors: true,
  },
  async (request) => {
    try {
      // Verificar autenticación
      if (!request.auth) {
        throw new https_1.HttpsError('unauthenticated', 'Usuario no autenticado');
      }
      const uid = request.auth.uid;
      const { serviceType, actionType, secondsUsed = 1, sessionId } = request.data;
      // Validar parámetros
      if (!serviceType || !actionType) {
        throw new https_1.HttpsError('invalid-argument', 'serviceType y actionType son requeridos');
      }
      if (!['herramientas', 'chatbot'].includes(serviceType)) {
        throw new https_1.HttpsError(
          'invalid-argument',
          'serviceType debe ser "herramientas" o "chatbot"',
        );
      }
      if (!['start', 'increment', 'end'].includes(actionType)) {
        throw new https_1.HttpsError(
          'invalid-argument',
          'actionType debe ser "start", "increment" o "end"',
        );
      }
      // Obtener documento del usuario
      const userRef = db.collection('users').doc(uid);
      const userDoc = await userRef.get();
      if (!userDoc.exists) {
        throw new https_1.HttpsError('not-found', 'Usuario no encontrado');
      }
      const userData = userDoc.data();
      const currentCredits =
        (userData === null || userData === void 0 ? void 0 : userData.usageCreditsInSeconds) || 0;
      // Validar que el usuario tenga suficientes créditos
      if (currentCredits <= 0 && actionType !== 'start') {
        throw new https_1.HttpsError('failed-precondition', 'Sin créditos suficientes');
      }
      let creditsToDeduct = 0;
      let sessionData = {};
      switch (actionType) {
        case 'start':
          // Iniciar sesión de uso
          sessionData = {
            serviceType,
            sessionId: sessionId || `session_${Date.now()}`,
            startTime: firestore_1.Timestamp.now(),
            creditsUsedInSession: 0,
            status: 'active',
          };
          // No se descuentan créditos al iniciar
          break;
        case 'increment':
          // Incrementar uso durante la sesión
          creditsToDeduct = secondsUsed;
          if (currentCredits < creditsToDeduct) {
            throw new https_1.HttpsError(
              'failed-precondition',
              `Créditos insuficientes. Disponibles: ${currentCredits}s, Requeridos: ${creditsToDeduct}s`,
            );
          }
          sessionData = {
            lastActivity: firestore_1.Timestamp.now(),
            creditsUsedInSession: firestore_1.FieldValue.increment(creditsToDeduct),
          };
          break;
        case 'end':
          // Finalizar sesión de uso
          creditsToDeduct = secondsUsed;
          if (currentCredits >= creditsToDeduct) {
            sessionData = {
              endTime: firestore_1.Timestamp.now(),
              status: 'completed',
              creditsUsedInSession: firestore_1.FieldValue.increment(creditsToDeduct),
            };
          } else {
            // Si no hay suficientes créditos, usar los restantes
            creditsToDeduct = currentCredits;
            sessionData = {
              endTime: firestore_1.Timestamp.now(),
              status: 'completed_with_insufficient_credits',
              creditsUsedInSession: firestore_1.FieldValue.increment(creditsToDeduct),
            };
          }
          break;
      }
      // Actualizar créditos del usuario si es necesario
      if (creditsToDeduct > 0) {
        await userRef.update({
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
      // Registrar en historial de uso
      await db
        .collection('users')
        .doc(uid)
        .collection('usageHistory')
        .add({
          serviceType,
          actionType,
          secondsUsed: creditsToDeduct,
          sessionId: sessionId || null,
          timestamp: firestore_1.Timestamp.now(),
          creditsBeforeAction: currentCredits,
          creditsAfterAction: currentCredits - creditsToDeduct,
        });
      const remainingCredits = Math.max(0, currentCredits - creditsToDeduct);
      const response = {
        success: true,
        remainingCredits,
        totalCredits: currentCredits,
        creditsUsed: creditsToDeduct,
        message:
          actionType === 'start'
            ? `Sesión iniciada para ${serviceType}`
            : `${creditsToDeduct}s descontados de ${serviceType}. Restantes: ${remainingCredits}s`,
      };
      return response;
    } catch (error) {
      console.error('Error en trackUsage:', error);
      if (error instanceof https_1.HttpsError) {
        throw error;
      }
      throw new https_1.HttpsError('internal', 'Error interno del servidor al rastrear uso');
    }
  },
);
/**
 * Función helper para obtener créditos restantes del usuario
 */
exports.getUserCredits = (0, https_1.onCall)(
  {
    enforceAppCheck: false,
    cors: true,
  },
  async (request) => {
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
      const usageCreditsInSeconds =
        (userData === null || userData === void 0 ? void 0 : userData.usageCreditsInSeconds) || 0;
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
    } catch (error) {
      console.error('Error obteniendo créditos de usuario:', error);
      if (error instanceof https_1.HttpsError) {
        throw error;
      }
      throw new https_1.HttpsError('internal', 'Error interno del servidor al obtener créditos');
    }
  },
);
//# sourceMappingURL=trackUsage.js.map
