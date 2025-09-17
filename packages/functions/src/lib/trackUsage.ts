import { getApps, initializeApp } from 'firebase-admin/app';
import { FieldValue, getFirestore, Timestamp } from 'firebase-admin/firestore';
import { HttpsError, onCall } from 'firebase-functions/v2/https';

// Inicializar Firebase Admin si no está ya inicializado
if (getApps().length === 0) {
  initializeApp();
}

const db = getFirestore();

interface TrackUsageRequest {
  serviceType: 'herramientas' | 'chatbot';
  actionType: 'start' | 'increment' | 'end';
  secondsUsed?: number;
  sessionId?: string;
}

interface UsageResponse {
  success: boolean;
  remainingCredits: number;
  totalCredits: number;
  creditsUsed: number;
  message: string;
}

// Tipos para los documentos de Firestore
interface UserData {
  usageCreditsInSeconds?: number;
  lastActivity?: Timestamp;
  updatedAt?: Timestamp;
  // Otros campos del usuario pueden agregarse aquí
}

interface SessionData {
  serviceType?: 'herramientas' | 'chatbot';
  sessionId?: string;
  startTime?: Timestamp;
  endTime?: Timestamp;
  lastActivity?: Timestamp;
  creditsUsedInSession?: FieldValue | number;
  status?: 'active' | 'completed' | 'completed_with_insufficient_credits';
}

interface UsageHistoryEntry {
  serviceType: 'herramientas' | 'chatbot';
  actionType: 'start' | 'increment' | 'end';
  secondsUsed: number;
  sessionId: string | null;
  timestamp: Timestamp;
  creditsBeforeAction: number;
  creditsAfterAction: number;
}

/**
 * Cloud Function que descuenta usageCreditsInSeconds en tiempo real
 * durante uso de herramientas/chatbot, trigger por eventos usuario
 *
 * Fuente: PROYEC_PARTE1.MD línea 218, PROYEC_PARTE3.MD línea 94-95
 * Créditos iniciales: 900s herramientas + 1800s chatbot
 */
export const trackUsage = onCall(
  {
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
      const {
        serviceType,
        actionType,
        secondsUsed = 1,
        sessionId,
      }: TrackUsageRequest = request.data;

      // Validar parámetros
      if (!serviceType || !actionType) {
        throw new HttpsError('invalid-argument', 'serviceType y actionType son requeridos');
      }

      if (!['herramientas', 'chatbot'].includes(serviceType)) {
        throw new HttpsError('invalid-argument', 'serviceType debe ser "herramientas" o "chatbot"');
      }

      if (!['start', 'increment', 'end'].includes(actionType)) {
        throw new HttpsError(
          'invalid-argument',
          'actionType debe ser "start", "increment" o "end"',
        );
      }

      // Obtener documento del usuario
      const userRef = db.collection('users').doc(uid);
      const userDoc = await userRef.get();

      if (!userDoc.exists) {
        throw new HttpsError('not-found', 'Usuario no encontrado');
      }

      const userData = userDoc.data() as UserData | undefined;
      const currentCredits = userData?.usageCreditsInSeconds || 0;

      // Validar que el usuario tenga suficientes créditos
      if (currentCredits <= 0 && actionType !== 'start') {
        throw new HttpsError('failed-precondition', 'Sin créditos suficientes');
      }

      let creditsToDeduct = 0;
      const sessionData: SessionData = {};

      switch (actionType) {
        case 'start':
          // Iniciar sesión de uso
          sessionData.serviceType = serviceType;
          sessionData.sessionId = sessionId || `session_${Date.now()}`;
          sessionData.startTime = Timestamp.now();
          sessionData.creditsUsedInSession = 0;
          sessionData.status = 'active';

          // No se descuentan créditos al iniciar
          break;

        case 'increment':
          // Incrementar uso durante la sesión
          creditsToDeduct = secondsUsed;

          if (currentCredits < creditsToDeduct) {
            throw new HttpsError(
              'failed-precondition',
              `Créditos insuficientes. Disponibles: ${currentCredits}s, Requeridos: ${creditsToDeduct}s`,
            );
          }

          sessionData.lastActivity = Timestamp.now();
          sessionData.creditsUsedInSession = FieldValue.increment(creditsToDeduct);
          break;

        case 'end':
          // Finalizar sesión de uso
          creditsToDeduct = secondsUsed;

          if (currentCredits >= creditsToDeduct) {
            sessionData.endTime = Timestamp.now();
            sessionData.status = 'completed';
            sessionData.creditsUsedInSession = FieldValue.increment(creditsToDeduct);
          } else {
            // Si no hay suficientes créditos, usar los restantes
            creditsToDeduct = currentCredits;
            sessionData.endTime = Timestamp.now();
            sessionData.status = 'completed_with_insufficient_credits';
            sessionData.creditsUsedInSession = FieldValue.increment(creditsToDeduct);
          }
          break;
      }

      // Actualizar créditos del usuario si es necesario
      if (creditsToDeduct > 0) {
        await userRef.update({
          usageCreditsInSeconds: FieldValue.increment(-creditsToDeduct),
          lastActivity: Timestamp.now(),
          updatedAt: Timestamp.now(),
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
      const historyEntry: UsageHistoryEntry = {
        serviceType,
        actionType,
        secondsUsed: creditsToDeduct,
        sessionId: sessionId || null,
        timestamp: Timestamp.now(),
        creditsBeforeAction: currentCredits,
        creditsAfterAction: currentCredits - creditsToDeduct,
      };

      await db.collection('users').doc(uid).collection('usageHistory').add(historyEntry);

      const remainingCredits = Math.max(0, currentCredits - creditsToDeduct);

      const response: UsageResponse = {
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

      if (error instanceof HttpsError) {
        throw error;
      }

      throw new HttpsError('internal', 'Error interno del servidor al rastrear uso');
    }
  },
);

/**
 * Función helper para obtener créditos restantes del usuario
 */
export const getUserCredits = onCall(
  {
    enforceAppCheck: false,
    cors: true,
  },
  async (request) => {
    try {
      if (!request.auth) {
        throw new HttpsError('unauthenticated', 'Usuario no autenticado');
      }

      const uid = request.auth.uid;
      const userDoc = await db.collection('users').doc(uid).get();

      if (!userDoc.exists) {
        throw new HttpsError('not-found', 'Usuario no encontrado');
      }

      const userData = userDoc.data() as UserData | undefined;
      const usageCreditsInSeconds = userData?.usageCreditsInSeconds || 0;

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

      if (error instanceof HttpsError) {
        throw error;
      }

      throw new HttpsError('internal', 'Error interno del servidor al obtener créditos');
    }
  },
);
