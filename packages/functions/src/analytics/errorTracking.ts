import { database } from '../lib/database';

interface ErrorTrackingData {
  errorId: string;
  userId?: string;
  message: string;
  stack?: string;
  url: string;
  userAgent: string;
  timestamp: number;
  level: 'error' | 'warning' | 'info';
  context?: Record<string, any>;
  fingerprint: string; // Para agrupar errores similares
}

interface PerformanceMetrics {
  userId?: string;
  page: string;
  loadTime: number;
  renderTime: number;
  networkLatency: number;
  memoryUsage?: number;
  timestamp: number;
  sessionId: string;
}

interface UserBehaviorEvent {
  userId?: string;
  eventType: 'page_view' | 'click' | 'form_submit' | 'feature_use' | 'error_encounter';
  eventData: Record<string, any>;
  timestamp: number;
  sessionId: string;
  page: string;
  userAgent: string;
}

interface AnalyticsSummary {
  totalErrors: number;
  uniqueErrors: number;
  topErrors: Array<{
    fingerprint: string;
    message: string;
    count: number;
    lastOccurrence: number;
  }>;
  performanceMetrics: {
    avgLoadTime: number;
    avgRenderTime: number;
    avgNetworkLatency: number;
  };
  userEngagement: {
    totalPageViews: number;
    uniqueUsers: number;
    avgSessionDuration: number;
    topPages: Array<{
      page: string;
      views: number;
    }>;
  };
}

/**
 * Generar fingerprint único para agrupar errores similares
 */
function generateErrorFingerprint(message: string, stack?: string): string {
  const content = `${message}${stack || ''}`;
  
  // Normalizar el contenido para agrupar errores similares
  const normalized = content
    .replace(/:\d+:\d+/g, '') // Remover números de línea
    .replace(/\d+/g, 'N')     // Reemplazar números con N
    .replace(/['"]/g, '')     // Remover comillas
    .toLowerCase();
    
  // Generar hash simple
  let hash = 0;
  for (let i = 0; i < normalized.length; i++) {
    const char = normalized.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convertir a 32bit integer
  }
  
  return Math.abs(hash).toString(36);
}

/**
 * Rastrear errores de la aplicación
 */
export async function trackError(errorData: Omit<ErrorTrackingData, 'errorId' | 'fingerprint' | 'timestamp'>): Promise<void> {
  try {
    const errorId = `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const fingerprint = generateErrorFingerprint(errorData.message, errorData.stack);
    const timestamp = Date.now();
    
    const completeErrorData: ErrorTrackingData = {
      errorId,
      fingerprint,
      timestamp,
      ...errorData,
    };
    
    // Guardar error individual
    await database.addDocument('errors', completeErrorData);
    
    // Actualizar contador de errores por fingerprint
    const existingAggregate = await database.getDocument('errorAggregates', fingerprint);
    
    if (existingAggregate && existingAggregate.exists) {
      const data = existingAggregate.data;
      await database.updateDocument('errorAggregates', fingerprint, {
        count: (data?.count || 0) + 1,
        lastOccurrence: timestamp,
        lastMessage: errorData.message,
      });
    } else {
      await database.setDocument('errorAggregates', fingerprint, {
        fingerprint,
        message: errorData.message,
        count: 1,
        firstOccurrence: timestamp,
        lastOccurrence: timestamp,
        lastMessage: errorData.message,
      });
    }
    
  } catch (error) {
    console.error('Error guardando tracking de error:', error);
  }
}

/**
 * Rastrear métricas de rendimiento
 */
export async function trackPerformance(performanceData: Omit<PerformanceMetrics, 'timestamp'>): Promise<void> {
  try {
    const completeData: PerformanceMetrics = {
      timestamp: Date.now(),
      ...performanceData,
    };
    
    await database.addDocument('performance', completeData);
    
    // Agregar a métricas diarias
    const today = new Date().toISOString().split('T')[0];
    const existingMetrics = await database.getDocument('dailyMetrics', today);
    
    if (existingMetrics && existingMetrics.exists) {
      const data = existingMetrics.data;
      const currentCount = data?.performanceCount || 0;
      const currentTotalLoadTime = data?.totalLoadTime || 0;
      const currentTotalRenderTime = data?.totalRenderTime || 0;
      
      await database.updateDocument('dailyMetrics', today, {
        performanceCount: currentCount + 1,
        totalLoadTime: currentTotalLoadTime + performanceData.loadTime,
        totalRenderTime: currentTotalRenderTime + performanceData.renderTime,
        avgLoadTime: (currentTotalLoadTime + performanceData.loadTime) / (currentCount + 1),
        avgRenderTime: (currentTotalRenderTime + performanceData.renderTime) / (currentCount + 1),
      });
    } else {
      await database.setDocument('dailyMetrics', today, {
        date: today,
        performanceCount: 1,
        totalLoadTime: performanceData.loadTime,
        totalRenderTime: performanceData.renderTime,
        avgLoadTime: performanceData.loadTime,
        avgRenderTime: performanceData.renderTime,
      });
    }
    
  } catch (error) {
    console.error('Error guardando métricas de rendimiento:', error);
  }
}

/**
 * Rastrear comportamiento del usuario
 */
export async function trackUserBehavior(behaviorData: Omit<UserBehaviorEvent, 'timestamp'>): Promise<void> {
  try {
    const completeData: UserBehaviorEvent = {
      timestamp: Date.now(),
      ...behaviorData,
    };
    
    await database.addDocument('userBehavior', completeData);
    
    // Agregar a estadísticas de páginas si es page_view
    if (behaviorData.eventType === 'page_view') {
      const existingPageStats = await database.getDocument('pageStats', behaviorData.page);
      
      if (existingPageStats && existingPageStats.exists) {
        const data = existingPageStats.data;
        await database.updateDocument('pageStats', behaviorData.page, {
          views: (data?.views || 0) + 1,
          lastView: Date.now(),
        });
      } else {
        await database.setDocument('pageStats', behaviorData.page, {
          page: behaviorData.page,
          views: 1,
          firstView: Date.now(),
          lastView: Date.now(),
        });
      }
    }
    
  } catch (error) {
    console.error('Error guardando comportamiento del usuario:', error);
  }
}

/**
 * Obtener resumen de analytics
 */
export async function getAnalyticsSummary(
  days: number = 7,
  userId?: string,
): Promise<AnalyticsSummary> {
  try {
    const startTime = Date.now() - (days * 24 * 60 * 60 * 1000);
    
    // Obtener errores
    const errorFilters: any[] = [{ field: 'timestamp', operator: 'gte', value: startTime }];
    if (userId) {
      errorFilters.push({ field: 'userId', operator: 'eq', value: userId });
    }
    
    const errorDocs = await database.queryCollection(
      'errors',
      errorFilters,
      { orderBy: { field: 'timestamp', direction: 'desc' } }
    );
    const errors = errorDocs.map((doc: any) => doc.data as ErrorTrackingData);
    
    // Calcular top errores
    const errorCounts = new Map<string, { count: number; message: string; lastOccurrence: number }>();
    
    errors.forEach(error => {
      const existing = errorCounts.get(error.fingerprint);
      if (existing) {
        existing.count++;
        existing.lastOccurrence = Math.max(existing.lastOccurrence, error.timestamp);
      } else {
        errorCounts.set(error.fingerprint, {
          count: 1,
          message: error.message,
          lastOccurrence: error.timestamp,
        });
      }
    });
    
    const topErrors = Array.from(errorCounts.entries())
      .map(([fingerprint, data]) => ({
        fingerprint,
        message: data.message,
        count: data.count,
        lastOccurrence: data.lastOccurrence,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
    
    // Obtener métricas de rendimiento
    const performanceFilters: any[] = [{ field: 'timestamp', operator: 'gte', value: startTime }];
    if (userId) {
      performanceFilters.push({ field: 'userId', operator: 'eq', value: userId });
    }
    
    const performanceDocs = await database.queryCollection('performance', performanceFilters);
    const performanceData = performanceDocs.map((doc: any) => doc.data as PerformanceMetrics);
    
    const avgLoadTime = performanceData.length > 0 
      ? performanceData.reduce((sum, p) => sum + p.loadTime, 0) / performanceData.length 
      : 0;
    const avgRenderTime = performanceData.length > 0 
      ? performanceData.reduce((sum, p) => sum + p.renderTime, 0) / performanceData.length 
      : 0;
    const avgNetworkLatency = performanceData.length > 0 
      ? performanceData.reduce((sum, p) => sum + p.networkLatency, 0) / performanceData.length 
      : 0;
    
    // Obtener comportamiento del usuario
    const behaviorFilters: any[] = [{ field: 'timestamp', operator: 'gte', value: startTime }];
    if (userId) {
      behaviorFilters.push({ field: 'userId', operator: 'eq', value: userId });
    }
    
    const behaviorDocs = await database.queryCollection('userBehavior', behaviorFilters);
    const behaviorData = behaviorDocs.map((doc: any) => doc.data as UserBehaviorEvent);
    
    const pageViews = behaviorData.filter(b => b.eventType === 'page_view');
    const uniqueUsers = new Set(behaviorData.map(b => b.userId).filter(Boolean)).size;
    
    // Calcular páginas más visitadas
    const pageCounts = new Map<string, number>();
    pageViews.forEach(view => {
      pageCounts.set(view.page, (pageCounts.get(view.page) || 0) + 1);
    });
    
    const topPages = Array.from(pageCounts.entries())
      .map(([page, views]) => ({ page, views }))
      .sort((a, b) => b.views - a.views)
      .slice(0, 10);
    
    return {
      totalErrors: errors.length,
      uniqueErrors: errorCounts.size,
      topErrors,
      performanceMetrics: {
        avgLoadTime: Math.round(avgLoadTime),
        avgRenderTime: Math.round(avgRenderTime),
        avgNetworkLatency: Math.round(avgNetworkLatency),
      },
      userEngagement: {
        totalPageViews: pageViews.length,
        uniqueUsers,
        avgSessionDuration: 0, // Calcular basado en sessionId
        topPages,
      },
    };
    
  } catch (error) {
    console.error('Error obteniendo resumen de analytics:', error);
    
    // Devolver valores por defecto en caso de error
    return {
      totalErrors: 0,
      uniqueErrors: 0,
      topErrors: [],
      performanceMetrics: {
        avgLoadTime: 0,
        avgRenderTime: 0,
        avgNetworkLatency: 0,
      },
      userEngagement: {
        totalPageViews: 0,
        uniqueUsers: 0,
        avgSessionDuration: 0,
        topPages: [],
      },
    };
  }
}

/**
 * Limpiar datos antiguos de analytics
 */
export async function cleanupOldAnalytics(daysToKeep: number = 90): Promise<void> {
  try {
    const cutoffTime = Date.now() - (daysToKeep * 24 * 60 * 60 * 1000);
    
    // Limpiar errores antiguos
    const oldErrors = await database.queryCollection(
      'errors',
      [{ field: 'timestamp', operator: 'lt', value: cutoffTime }],
      { limit: 500 }
    );
    
    for (const errorDoc of oldErrors) {
      await database.deleteDocument('errors', errorDoc.id);
    }
    
    // Limpiar métricas de rendimiento antiguas
    const oldPerformance = await database.queryCollection(
      'performance',
      [{ field: 'timestamp', operator: 'lt', value: cutoffTime }],
      { limit: 500 }
    );
    
    for (const performanceDoc of oldPerformance) {
      await database.deleteDocument('performance', performanceDoc.id);
    }
    
    console.log(`Limpieza completada: ${oldErrors.length} errores, ${oldPerformance.length} métricas eliminadas`);
    
  } catch (error) {
    console.error('Error limpiando analytics antiguos:', error);
  }
}