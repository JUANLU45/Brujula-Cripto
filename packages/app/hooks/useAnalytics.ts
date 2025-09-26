'use client';

import { useEffect, useCallback } from 'react';

interface UseAnalyticsReturn {
  /** Rastrear error */
  trackError: (error: Error, context?: Record<string, any>) => void;
  
  /** Rastrear evento de usuario */
  trackEvent: (eventType: string, eventData?: Record<string, any>) => void;
  
  /** Rastrear vista de página */
  trackPageView: (page: string) => void;
  
  /** Rastrear métricas de rendimiento */
  trackPerformance: (metrics: {
    loadTime: number;
    renderTime: number;
    networkLatency: number;
  }) => void;
}

// ID de sesión único para agrupar eventos
const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

/**
 * Hook para analytics y tracking de errores
 */
export function useAnalytics(): UseAnalyticsReturn {

  const trackError = useCallback(async (error: Error, context?: Record<string, any>): Promise<void> => {
    try {
      const errorData = {
        message: error.message,
        stack: error.stack,
        url: window.location.href,
        userAgent: navigator.userAgent,
        level: 'error' as const,
        context,
      };

      await fetch('/api/analytics/error', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(errorData),
      });
      
    } catch (trackingError) {
      console.error('Error tracking error:', trackingError);
    }
  }, []);

  const trackEvent = useCallback(async (eventType: string, eventData?: Record<string, any>): Promise<void> => {
    try {
      const behaviorData = {
        eventType,
        eventData: eventData || {},
        sessionId,
        page: window.location.pathname,
        userAgent: navigator.userAgent,
      };

      await fetch('/api/analytics/behavior', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(behaviorData),
      });
      
    } catch (error) {
      console.error('Error tracking event:', error);
    }
  }, []);

  const trackPageView = useCallback(async (page: string): Promise<void> => {
    await trackEvent('page_view', { page });
  }, [trackEvent]);

  const trackPerformance = useCallback(async (metrics: {
    loadTime: number;
    renderTime: number;
    networkLatency: number;
  }): Promise<void> => {
    try {
      const performanceData = {
        page: window.location.pathname,
        sessionId,
        ...metrics,
      };

      await fetch('/api/analytics/performance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(performanceData),
      });
      
    } catch (error) {
      console.error('Error tracking performance:', error);
    }
  }, []);

  // Configurar tracking automático de errores globales
  useEffect(() => {
    const handleError = (event: ErrorEvent): void => {
      trackError(new Error(event.message), {
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
      });
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent): void => {
      trackError(new Error(`Unhandled Promise Rejection: ${event.reason}`), {
        type: 'unhandledRejection',
      });
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, [trackError]);

  // Tracking automático de performance
  useEffect(() => {
    if (typeof window !== 'undefined' && 'performance' in window) {
      const measurePerformance = (): void => {
        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        
        if (navigation) {
          const loadTime = navigation.loadEventEnd - navigation.loadEventStart;
          const renderTime = navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart;
          const networkLatency = navigation.responseStart - navigation.requestStart;
          
          if (loadTime > 0) {
            trackPerformance({
              loadTime,
              renderTime,
              networkLatency,
            });
          }
        }
      };

      // Medir después de que la página esté completamente cargada
      if (document.readyState === 'complete') {
        setTimeout(measurePerformance, 100);
      } else {
        window.addEventListener('load', () => {
          setTimeout(measurePerformance, 100);
        });
      }
    }
  }, [trackPerformance]);

  // Tracking automático de vista de página
  useEffect(() => {
    trackPageView(window.location.pathname);
  }, [trackPageView]);

  return {
    trackError,
    trackEvent,
    trackPageView,
    trackPerformance,
  };
}