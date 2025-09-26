'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

interface UseIdleDetectionConfig {
  /** Tiempo de inactividad en milisegundos antes de considerarse idle (default: 300000 = 5 minutos) */
  idleTimeout?: number;
  
  /** Función callback cuando el usuario está activo */
  onActive?: () => void;
  
  /** Función callback cuando el usuario está inactivo */
  onIdle?: () => void;
  
  /** Si el hook está habilitado (default: true) */
  enabled?: boolean;
}

interface UseIdleDetectionReturn {
  /** Si el usuario está actualmente inactivo */
  isIdle: boolean;
  
  /** Tiempo restante en segundos antes de considerarse idle */
  timeRemaining: number;
  
  /** Función para resetear manualmente el timer */
  resetTimer: () => void;
  
  /** Función para pausar/reanudar la detección */
  togglePause: () => void;
  
  /** Si la detección está pausada */
  isPaused: boolean;
}

/**
 * Hook para detectar inactividad del usuario
 * Útil para pausar créditos durante períodos de inactividad
 * 
 * @param config Configuración del hook
 * @returns Estado y funciones de control de la detección de inactividad
 */
export function useIdleDetection({
  idleTimeout = 300000, // 5 minutos por defecto
  onActive,
  onIdle,
  enabled = true,
}: UseIdleDetectionConfig = {}): UseIdleDetectionReturn {
  const [isIdle, setIsIdle] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(Math.floor(idleTimeout / 1000));
  
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastActivityRef = useRef<number>(Date.now());

  // Lista de eventos que indican actividad del usuario
  const events = [
    'mousedown',
    'mousemove',
    'keypress',
    'scroll',
    'touchstart',
    'click',
  ] as const;

  const resetTimer = useCallback(() => {
    if (!enabled || isPaused) return;

    lastActivityRef.current = Date.now();
    
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    // Si estaba idle, llamar onActive
    if (isIdle) {
      setIsIdle(false);
      onActive?.();
    }

    // Resetear contador
    setTimeRemaining(Math.floor(idleTimeout / 1000));

    // Configurar nuevo timeout
    timeoutRef.current = setTimeout(() => {
      if (!isPaused) {
        setIsIdle(true);
        setTimeRemaining(0);
        onIdle?.();
      }
    }, idleTimeout);

    // Configurar intervalo para actualizar contador
    intervalRef.current = setInterval(() => {
      const elapsed = Date.now() - lastActivityRef.current;
      const remaining = Math.max(0, Math.floor((idleTimeout - elapsed) / 1000));
      setTimeRemaining(remaining);
      
      if (remaining === 0 && !isPaused) {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      }
    }, 1000);
  }, [enabled, isPaused, isIdle, idleTimeout, onActive, onIdle]);

  const togglePause = useCallback(() => {
    setIsPaused(prev => {
      const newPausedState = !prev;
      
      if (newPausedState) {
        // Pausar: limpiar timers
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      } else {
        // Reanudar: resetear timer
        resetTimer();
      }
      
      return newPausedState;
    });
  }, [resetTimer]);

  const handleActivity = useCallback(() => {
    if (enabled && !isPaused) {
      resetTimer();
    }
  }, [enabled, isPaused, resetTimer]);

  useEffect(() => {
    if (!enabled) {
      // Limpiar todo si está deshabilitado
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      return;
    }

    // Configurar listeners de eventos
    events.forEach(event => {
      document.addEventListener(event, handleActivity, true);
    });

    // Inicializar timer
    resetTimer();

    return () => {
      // Cleanup
      events.forEach(event => {
        document.removeEventListener(event, handleActivity, true);
      });
      
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [enabled, handleActivity, resetTimer]);

  // Cleanup al desmontar
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return {
    isIdle,
    timeRemaining,
    resetTimer,
    togglePause,
    isPaused,
  };
}