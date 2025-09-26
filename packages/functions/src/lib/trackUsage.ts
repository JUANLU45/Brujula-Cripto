import { Timestamp } from 'firebase-admin/firestore';
import { HttpsError, onCall, type CallableRequest } from 'firebase-functions/v2/https';
import { database } from './database';

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
  creditsUsedInSession?: any | number;
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
// Función auxiliar para validar los datos de entrada
function validateTrackUsageData(data: unknown): TrackUsageRequest {
  const parsedData = data as TrackUsageRequest;

  if (!parsedData.serviceType || !parsedData.actionType) {
    throw new HttpsError('invalid-argument', 'serviceType y actionType son requeridos');
  }

  if (!['herramientas', 'chatbot'].includes(parsedData.serviceType)) {
    throw new HttpsError('invalid-argument', 'serviceType debe ser "herramientas" o "chatbot"');
  }

  if (!['start', 'increment', 'end'].includes(parsedData.actionType)) {
    throw new HttpsError('invalid-argument', 'actionType debe ser "start", "increment" o "end"');
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
function processStartAction(
  serviceType: 'herramientas' | 'chatbot',
  sessionId?: string,
): { sessionData: SessionData; creditsToDeduct: number } {
  const sessionData: SessionData = {
    serviceType,
    sessionId: sessionId || `session_${Date.now()}`,
    startTime: Timestamp.now(),
    creditsUsedInSession: 0,
    status: 'active',
  };

  return { sessionData, creditsToDeduct: 0 };
}

/**
 * Procesa la acción 'increment' para uso durante la sesión
 */
function processIncrementAction(
  secondsUsed: number,
  currentCredits: number,
): { sessionData: SessionData; creditsToDeduct: number } {
  const creditsToDeduct = secondsUsed || 1;

  if (currentCredits < creditsToDeduct) {
    throw new HttpsError(
      'failed-precondition',
      `Créditos insuficientes. Disponibles: ${currentCredits}s, Requeridos: ${creditsToDeduct}s`,
    );
  }

  const sessionData: SessionData = {
    lastActivity: Timestamp.now(),
    creditsUsedInSession: database.incrementValue(creditsToDeduct),
  };

  return { sessionData, creditsToDeduct };
}

/**
 * Procesa la acción 'end' para finalizar una sesión
 */
function processEndAction(
  secondsUsed: number,
  currentCredits: number,
): { sessionData: SessionData; creditsToDeduct: number } {
  let creditsToDeduct = secondsUsed || 1;
  const sessionData: SessionData = {
    endTime: Timestamp.now(),
    creditsUsedInSession: database.incrementValue(creditsToDeduct),
  };

  if (currentCredits >= creditsToDeduct) {
    sessionData.status = 'completed';
  } else {
    // Si no hay suficientes créditos, usar los restantes
    creditsToDeduct = currentCredits;
    sessionData.status = 'completed_with_insufficient_credits';
  }

  return { sessionData, creditsToDeduct };
}

/**
 * Actualiza los créditos del usuario y la sesión
 */
async function updateUserCreditsAndSession(
  uid: string,
  creditsToDeduct: number,
  sessionId: string | undefined,
  sessionData: SessionData,
): Promise<void> {
  // Actualizar créditos del usuario si es necesario
  if (creditsToDeduct > 0) {
    const currentUser = await database.getDocument('users', uid);
    const currentCredits = currentUser?.data?.usageCreditsInSeconds || 0;
    
    await database.updateDocument('users', uid, {
      usageCreditsInSeconds: currentCredits - creditsToDeduct,
      lastActivity: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });
  }

  // Registrar la actividad de uso
  if (sessionId && Object.keys(sessionData).length > 0) {
    await database.setSubDocument('users', uid, 'usageSessions', sessionId, sessionData);
  }
}

/**
 * Registra la entrada en el historial de uso
 */
async function logUsageHistory({
  uid,
  serviceType,
  actionType,
  creditsToDeduct,
  sessionId,
  currentCredits,
}: {
  uid: string;
  serviceType: 'herramientas' | 'chatbot';
  actionType: 'start' | 'increment' | 'end';
  creditsToDeduct: number;
  sessionId: string | undefined;
  currentCredits: number;
}): Promise<void> {
  const historyEntry: UsageHistoryEntry = {
    serviceType,
    actionType,
    secondsUsed: creditsToDeduct,
    sessionId: sessionId || null,
    timestamp: Timestamp.now(),
    creditsBeforeAction: currentCredits,
    creditsAfterAction: currentCredits - creditsToDeduct,
  };

  await database.addSubDocument('users', uid, 'usageHistory', historyEntry);
}

/**
 * Procesa la acción y determina los créditos a deducir
 */
function processActionByType({
  actionType,
  serviceType,
  sessionId,
  secondsUsed,
  currentCredits,
}: {
  actionType: 'start' | 'increment' | 'end';
  serviceType: 'herramientas' | 'chatbot';
  sessionId: string | undefined;
  secondsUsed: number;
  currentCredits: number;
}): { sessionData: SessionData; creditsToDeduct: number } {
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
async function validateAndGetUserData(
  request: CallableRequest<unknown>,
): Promise<{ uid: string; currentCredits: number; validatedData: TrackUsageRequest }> {
  // Verificar autenticación
  if (!request.auth) {
    throw new HttpsError('unauthenticated', 'Usuario no autenticado');
  }

  const uid = request.auth.uid;
  const validatedData = validateTrackUsageData(request.data);

  // Obtener documento del usuario
  const userDoc = await database.getDocument('users', uid);

  if (!userDoc || !userDoc.exists) {
    throw new HttpsError('not-found', 'Usuario no encontrado');
  }

  const userData = userDoc.data as UserData | undefined;
  const currentCredits = userData?.usageCreditsInSeconds || 0;

  // Validar que el usuario tenga suficientes créditos
  if (currentCredits <= 0 && validatedData.actionType !== 'start') {
    throw new HttpsError('failed-precondition', 'Sin créditos suficientes');
  }

  return { uid, currentCredits, validatedData };
}

export const trackUsage = onCall(
  {
    enforceAppCheck: false,
    cors: true,
  },
  async (request) => {
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
      const userDoc = await database.getDocument('users', uid);

      if (!userDoc || !userDoc.exists) {
        throw new HttpsError('not-found', 'Usuario no encontrado');
      }

      const userData = userDoc.data as UserData | undefined;
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
