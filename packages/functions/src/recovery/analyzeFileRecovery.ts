import { getApps, initializeApp } from 'firebase-admin/app';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import { HttpsError, onCall, type CallableRequest } from 'firebase-functions/v2/https';

import {
  WalletFileType,
  OperatingSystem,
  TimeRange,
  RecoveryStatus
} from '@brujula-cripto/types';
import type { 
  DiagnosisData,
  AnalysisResult,
  RecoveryTool,
  RecoverySessionResponse 
} from '@brujula-cripto/types';

// Inicializar Firebase Admin si no está ya inicializado
if (getApps().length === 0) {
  initializeApp();
}

const db = getFirestore();

interface AnalyzeFileRecoveryRequest {
  sessionId: string;
  diagnosis: DiagnosisData;
}

/**
 * Base de conocimiento para herramientas de recuperación de archivos eliminados
 */
const RECOVERY_TOOLS_DATABASE: Record<string, RecoveryTool> = {
  recuva: {
    name: 'Recuva',
    type: 'free',
    operatingSystems: [OperatingSystem.WINDOWS],
    supportedFileTypes: [WalletFileType.BITCOIN_CORE, WalletFileType.ELECTRUM, WalletFileType.EXODUS, WalletFileType.OTHER],
    successRate: 75,
    downloadUrl: 'https://www.ccleaner.com/recuva',
    instructions: [
      {
        stepNumber: 1,
        title: 'Descargar e instalar Recuva',
        description: 'Descarga Recuva desde el sitio oficial y ejecuta la instalación.',
        warningLevel: 'info',
        estimatedTime: 5
      },
      {
        stepNumber: 2,
        title: 'Configurar búsqueda específica',
        description: 'Selecciona la ubicación donde estaba el archivo wallet.dat y configura filtros por tipo de archivo.',
        commands: ['Tipo: Todos los archivos', 'Ubicación: C:\\Users\\[Usuario]\\AppData\\Roaming\\Bitcoin\\'],
        warningLevel: 'warning',
        estimatedTime: 10
      },
      {
        stepNumber: 3,
        title: 'Ejecutar análisis profundo',
        description: 'Activa el modo de análisis profundo para mejorar las posibilidades de recuperación.',
        warningLevel: 'critical',
        estimatedTime: 60,
        requiredTools: ['Recuva Pro para mejores resultados']
      }
    ],
    difficulty: 'easy',
    estimatedTime: 75
  },
  photoRec: {
    name: 'PhotoRec',
    type: 'free',
    operatingSystems: [OperatingSystem.WINDOWS, OperatingSystem.MACOS, OperatingSystem.LINUX],
    supportedFileTypes: [WalletFileType.BITCOIN_CORE, WalletFileType.ETHEREUM_KEYSTORE, WalletFileType.ELECTRUM, WalletFileType.EXODUS, WalletFileType.METAMASK, WalletFileType.OTHER],
    successRate: 85,
    downloadUrl: 'https://www.cgsecurity.org/wiki/PhotoRec',
    instructions: [
      {
        stepNumber: 1,
        title: 'Descargar TestDisk/PhotoRec',
        description: 'Descarga el paquete completo desde el sitio oficial.',
        warningLevel: 'info',
        estimatedTime: 5
      },
      {
        stepNumber: 2,
        title: 'Ejecutar PhotoRec en modo administrador',
        description: 'Abre PhotoRec con permisos de administrador para acceso completo al disco.',
        commands: ['sudo photorec', 'photorec_win.exe'],
        warningLevel: 'critical',
        estimatedTime: 5
      },
      {
        stepNumber: 3,
        title: 'Seleccionar disco y partición',
        description: 'Elige el disco donde estaba almacenado el archivo de wallet.',
        warningLevel: 'warning',
        estimatedTime: 10
      },
      {
        stepNumber: 4,
        title: 'Configurar tipos de archivo',
        description: 'Selecciona tipos específicos: .dat, .json, .wallet según tu tipo de wallet.',
        warningLevel: 'info',
        estimatedTime: 15
      }
    ],
    difficulty: 'medium',
    estimatedTime: 120
  },
  diskDrill: {
    name: 'Disk Drill',
    type: 'paid',
    operatingSystems: [OperatingSystem.WINDOWS, OperatingSystem.MACOS],
    supportedFileTypes: [WalletFileType.BITCOIN_CORE, WalletFileType.ETHEREUM_KEYSTORE, WalletFileType.ELECTRUM, WalletFileType.METAMASK, WalletFileType.EXODUS, WalletFileType.LEDGER_LIVE, WalletFileType.OTHER],
    successRate: 90,
    cost: 89,
    downloadUrl: 'https://www.cleverfiles.com/disk-drill.html',
    instructions: [
      {
        stepNumber: 1,
        title: 'Instalar Disk Drill Pro',
        description: 'Descarga e instala la versión Pro para funciones de recuperación completas.',
        warningLevel: 'info',
        estimatedTime: 10
      },
      {
        stepNumber: 2,
        title: 'Escaneo rápido inicial',
        description: 'Ejecuta un escaneo rápido primero para archivos recientemente eliminados.',
        warningLevel: 'info',
        estimatedTime: 20
      },
      {
        stepNumber: 3,
        title: 'Escaneo profundo si es necesario',
        description: 'Si el escaneo rápido no encuentra el archivo, ejecuta un escaneo profundo completo.',
        warningLevel: 'warning',
        estimatedTime: 180,
        requiredTools: ['Disk Drill Pro License']
      }
    ],
    difficulty: 'easy',
    estimatedTime: 210
  },
  rStudio: {
    name: 'R-Studio',
    type: 'professional',
    operatingSystems: [OperatingSystem.WINDOWS, OperatingSystem.MACOS, OperatingSystem.LINUX],
    supportedFileTypes: [WalletFileType.BITCOIN_CORE, WalletFileType.ETHEREUM_KEYSTORE, WalletFileType.ELECTRUM, WalletFileType.METAMASK, WalletFileType.EXODUS, WalletFileType.LEDGER_LIVE, WalletFileType.TREZOR, WalletFileType.MYETHERWALLET, WalletFileType.OTHER],
    successRate: 95,
    cost: 199,
    downloadUrl: 'https://www.r-studio.com/',
    instructions: [
      {
        stepNumber: 1,
        title: 'Adquirir licencia profesional',
        description: 'Compra R-Studio Professional para capacidades de recuperación avanzadas.',
        warningLevel: 'info',
        estimatedTime: 15
      },
      {
        stepNumber: 2,
        title: 'Crear imagen del disco',
        description: 'Crea una imagen bit a bit del disco para trabajo seguro sin dañar datos originales.',
        warningLevel: 'critical',
        estimatedTime: 120,
        requiredTools: ['Disco de almacenamiento adicional']
      },
      {
        stepNumber: 3,
        title: 'Análisis de sistema de archivos',
        description: 'Ejecuta análisis completo del sistema de archivos en la imagen creada.',
        warningLevel: 'warning',
        estimatedTime: 90
      },
      {
        stepNumber: 4,
        title: 'Búsqueda por patrones específicos',
        description: 'Configura búsqueda por patrones específicos de archivos de wallet (.dat, .json, etc.).',
        warningLevel: 'info',
        estimatedTime: 60
      }
    ],
    difficulty: 'hard',
    estimatedTime: 285
  }
};

/**
 * Calcula la probabilidad de recuperación basada en múltiples factores
 */
function calculateRecoveryProbability(diagnosis: DiagnosisData): number {
  let baseProbability = 70;

  // Factor tiempo - crítico para la recuperación
  switch (diagnosis.timeElapsed) {
    case TimeRange.UNDER_24H:
      baseProbability += 25;
      break;
    case TimeRange.UNDER_7D:
      baseProbability += 15;
      break;
    case TimeRange.UNDER_30D:
      baseProbability += 5;
      break;
    case TimeRange.OVER_30D:
      baseProbability -= 15;
      break;
  }

  // Factor sistema operativo - Windows es más fácil
  switch (diagnosis.operatingSystem) {
    case OperatingSystem.WINDOWS:
      baseProbability += 10;
      break;
    case OperatingSystem.MACOS:
      baseProbability += 5;
      break;
    case OperatingSystem.LINUX:
      baseProbability -= 5;
      break;
    case OperatingSystem.ANDROID:
    case OperatingSystem.IOS:
      baseProbability -= 20; // Móviles son más difíciles
      break;
  }

  // Factor tipo de archivo - algunos son más recuperables
  switch (diagnosis.fileType) {
    case WalletFileType.BITCOIN_CORE:
    case WalletFileType.ELECTRUM:
      baseProbability += 5; // Archivos .dat más estables
      break;
    case WalletFileType.ETHEREUM_KEYSTORE:
      baseProbability += 10; // JSON fácil de detectar
      break;
    case WalletFileType.METAMASK:
    case WalletFileType.EXODUS:
      baseProbability -= 5; // Archivos más fragmentados
      break;
    case WalletFileType.LEDGER_LIVE:
    case WalletFileType.TREZOR:
      baseProbability -= 10; // Archivos de hardware wallet más complejos
      break;
  }

  return Math.min(Math.max(baseProbability, 10), 95);
}

/**
 * Determina la dificultad estimada del caso
 */
function estimateDifficulty(diagnosis: DiagnosisData, probability: number): 'easy' | 'medium' | 'hard' {
  if (probability >= 80) return 'easy';
  if (probability >= 60) return 'medium';
  return 'hard';
}

/**
 * Determina el nivel de urgencia
 */
function assessUrgencyLevel(diagnosis: DiagnosisData): 'low' | 'medium' | 'high' {
  // Urgencia basada en tiempo
  if (diagnosis.timeElapsed === TimeRange.UNDER_24H) return 'high';
  if (diagnosis.timeElapsed === TimeRange.UNDER_7D) return 'medium';
  
  // Factor valor estimado
  if (diagnosis.estimatedValue && diagnosis.estimatedValue >= 10000) return 'high';
  if (diagnosis.estimatedValue && diagnosis.estimatedValue >= 1000) return 'medium';
  
  return 'low';
}

/**
 * Selecciona herramientas recomendadas basadas en el diagnóstico
 */
function selectRecommendedTools(diagnosis: DiagnosisData): RecoveryTool[] {
  const compatibleTools = Object.values(RECOVERY_TOOLS_DATABASE).filter(tool => 
    tool.operatingSystems.includes(diagnosis.operatingSystem) &&
    tool.supportedFileTypes.includes(diagnosis.fileType)
  );

  // Ordenar por tasa de éxito y dificultad
  return compatibleTools
    .sort((a, b) => {
      // Priorizar herramientas gratuitas para casos fáciles
      if (diagnosis.timeElapsed === TimeRange.UNDER_24H) {
        if (a.type === 'free' && b.type !== 'free') return -1;
        if (b.type === 'free' && a.type !== 'free') return 1;
      }
      
      // Luego por tasa de éxito
      return b.successRate - a.successRate;
    })
    .slice(0, 3); // Máximo 3 herramientas
}

// Función auxiliar removida - sessionId viene del cliente

/**
 * Valida los datos de entrada
 */
function validateAnalysisRequest(data: unknown): AnalyzeFileRecoveryRequest {
  const request = data as AnalyzeFileRecoveryRequest;
  
  if (!request.sessionId || !request.diagnosis) {
    throw new HttpsError('invalid-argument', 'sessionId y diagnosis son requeridos');
  }

  const { diagnosis } = request;
  
  if (!diagnosis.fileType || !diagnosis.operatingSystem || !diagnosis.timeElapsed) {
    throw new HttpsError('invalid-argument', 'fileType, operatingSystem y timeElapsed son requeridos');
  }

  return request;
}

/**
 * Guarda el caso en Firestore para análisis posterior
 */
async function saveRecoveryCase(
  uid: string,
  sessionId: string,
  diagnosis: DiagnosisData,
  analysis: AnalysisResult
): Promise<void> {
  const recoveryCase = {
    id: sessionId,
    userId: uid,
    fileType: diagnosis.fileType,
    operatingSystem: diagnosis.operatingSystem,
    timeElapsed: diagnosis.timeElapsed,
    estimatedValue: diagnosis.estimatedValue,
    recoveryProbability: analysis.recoveryProbability,
    recommendedTools: analysis.recommendedTools,
    status: RecoveryStatus.READY,
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
  };

  await db.collection('users').doc(uid).collection('fileRecoveryCases').doc(sessionId).set(recoveryCase);
}

/**
 * Cloud Function para analizar casos de recuperación de archivos eliminados
 */
export const analyzeFileRecovery = onCall(
  {
    enforceAppCheck: false,
    cors: true,
  },
  async (request: CallableRequest<unknown>): Promise<RecoverySessionResponse> => {
    try {
      // Verificar autenticación
      if (!request.auth) {
        throw new HttpsError('unauthenticated', 'Usuario no autenticado');
      }

      const uid = request.auth.uid;
      const validatedRequest = validateAnalysisRequest(request.data);
      const { sessionId, diagnosis } = validatedRequest;

      // Verificar créditos del usuario
      const userDoc = await db.collection('users').doc(uid).get();
      if (!userDoc.exists) {
        throw new HttpsError('not-found', 'Usuario no encontrado');
      }

      const userData = userDoc.data();
      const userCredits = userData?.usageCreditsInSeconds || 0;
      
      if (userCredits < 60) { // Mínimo 1 minuto para análisis
        throw new HttpsError('failed-precondition', 'Créditos insuficientes para análisis');
      }

      // Realizar análisis
      const recoveryProbability = calculateRecoveryProbability(diagnosis);
      const estimatedDifficulty = estimateDifficulty(diagnosis, recoveryProbability);
      const urgencyLevel = assessUrgencyLevel(diagnosis);
      const recommendedTools = selectRecommendedTools(diagnosis);

      const analysis: AnalysisResult = {
        success: true,
        recoveryProbability,
        recommendedTools,
        estimatedDifficulty,
        urgencyLevel,
        sessionId
      };

      // Guardar caso para seguimiento
      await saveRecoveryCase(uid, sessionId, diagnosis, analysis);

      // Descontar créditos (60 segundos por análisis)
      await db.collection('users').doc(uid).update({
        usageCreditsInSeconds: userCredits - 60,
        lastActivity: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
      });

      // Registrar uso en historial
      await db.collection('users').doc(uid).collection('usageHistory').add({
        serviceType: 'herramientas',
        actionType: 'complete',
        service: 'deleted-files-recovery',
        secondsUsed: 60,
        sessionId,
        timestamp: FieldValue.serverTimestamp(),
        creditsBeforeAction: userCredits,
        creditsAfterAction: userCredits - 60,
      });

      const response: RecoverySessionResponse = {
        sessionId,
        analysis
      };

      return response;

    } catch (error) {
      console.error('Error en analyzeFileRecovery:', error);

      if (error instanceof HttpsError) {
        throw error;
      }

      throw new HttpsError('internal', 'Error interno al analizar recuperación de archivos');
    }
  }
);