'use client';

import { useState, useEffect } from 'react';

import { useTranslations } from 'next-intl';

import type { BudgetAlert } from '@brujula-cripto/types';

import { useAuth } from '@/lib/auth/AuthProvider';

interface UseBudgetMonitorReturn {
  /** Gasto actual del usuario */
  currentSpend: number;
  
  /** Límite de gasto configurado */
  spendLimit: number;
  
  /** Porcentaje de gasto actual */
  spendPercentage: number;
  
  /** Alertas activas */
  alerts: BudgetAlert[];
  
  /** Si está cargando */
  isLoading: boolean;
  
  /** Error si lo hay */
  error: string | null;
  
  /** Configurar límites de presupuesto */
  setBudgetLimits: (limit: number, warningThreshold: number) => Promise<void>;
  
  /** Obtener alertas recientes */
  fetchAlerts: () => Promise<void>;
  
  /** Si ha excedido el límite */
  isOverBudget: boolean;
  
  /** Si está cerca del límite */
  isNearLimit: boolean;
}

/**
 * Hook para monitorear el presupuesto del usuario
 */
export function useBudgetMonitor(): UseBudgetMonitorReturn {
  const { user, userData } = useAuth();
  const t = useTranslations('budget');
  
  const [currentSpend, setCurrentSpend] = useState(0);
  const [spendLimit, setSpendLimit] = useState(0);
  const [alerts, setAlerts] = useState<BudgetAlert[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const spendPercentage = spendLimit > 0 ? (currentSpend / spendLimit) * 100 : 0;
  const isOverBudget = spendPercentage >= 100;
  const isNearLimit = spendPercentage >= 80;

  // Cargar datos del usuario
  useEffect(() => {
    if (userData?.budgetStatus) {
      setCurrentSpend(userData.budgetStatus.currentSpend || 0);
    }
    
    if (userData?.budgetConfig) {
      setSpendLimit(userData.budgetConfig.spendLimit || 0);
    }
  }, [userData]);

  const setBudgetLimits = async (limit: number, warningThreshold: number = 80): Promise<void> => {
    if (!user) {
      setError('Usuario no autenticado');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/budget/set-limits', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.uid,
          spendLimit: limit,
          warningThreshold,
          enabled: true,
          periodDays: 30, // Por defecto mensual
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Error configurando límites');
      }

      setSpendLimit(limit);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAlerts = async (): Promise<void> => {
    if (!user) return;

    setIsLoading(true);
    
    try {
      const response = await fetch(`/api/budget/alerts?userId=${user.uid}`);
      
      if (!response.ok) {
        throw new Error('Error obteniendo alertas');
      }
      
      const data = await response.json();
      setAlerts(data.alerts || []);
      
    } catch (err) {
      console.error('Error obteniendo alertas:', err);
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setIsLoading(false);
    }
  };

  // Cargar alertas al montar
  useEffect(() => {
    if (user) {
      void fetchAlerts();
    }
  }, [user]);

  return {
    currentSpend,
    spendLimit,
    spendPercentage,
    alerts,
    isLoading,
    error,
    setBudgetLimits,
    fetchAlerts,
    isOverBudget,
    isNearLimit,
  };
}