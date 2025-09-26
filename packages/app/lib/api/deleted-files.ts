import type { 
  DiagnosisData, 
  RecoverySessionResponse,
  ApiResponse
} from '@brujula-cripto/types';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || 'https://us-central1-brujula-cripto.cloudfunctions.net';

interface AnalyzeFileRecoveryRequest {
  sessionId: string;
  diagnosis: DiagnosisData;
}

// Cliente API para herramientas de recuperación de archivos eliminados
export const analyzeFileRecovery = async (
  request: AnalyzeFileRecoveryRequest
): Promise<RecoverySessionResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/analyzeFileRecovery`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    const data = await response.json() as unknown;

    if (!response.ok) {
      throw new Error((data as { error?: string }).error || 'Error en análisis');
    }

    return data as RecoverySessionResponse;
  } catch (error) {
    console.error('Error analyzing file recovery:', error);
    throw error;
  }
};