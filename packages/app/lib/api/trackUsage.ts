/**
 * API para rastreo de uso de servicios premium por tiempo
 * Sistema de créditos en segundos como está documentado
 */

interface TrackUsageRequest {
  service: 'password-recovery' | 'portfolio-optimization' | 'advanced-analysis';
  action: 'start' | 'stop' | 'complete';
  sessionId?: string;
  estimatedDuration?: number; // en segundos
}

interface TrackUsageResponse {
  sessionId: string;
  creditsUsed: number;
  creditsRemaining: number;
  success: boolean;
}

export async function trackUsage(params: TrackUsageRequest): Promise<TrackUsageResponse> {
  const { service, action, sessionId, estimatedDuration } = params;

  const response = await fetch('/api/usage/track', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      service,
      action,
      sessionId,
      estimatedDuration,
    }),
  });

  if (!response.ok) {
    throw new Error(`Error tracking usage: ${response.statusText}`);
  }

  return response.json() as Promise<TrackUsageResponse>;
}
