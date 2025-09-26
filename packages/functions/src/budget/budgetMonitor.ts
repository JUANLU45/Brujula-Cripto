import { database } from '../lib/database';

import type { IUser, BudgetAlert } from '@brujula-cripto/types';

interface BudgetMonitorConfig {
  /** Límite de gasto en euros */
  spendLimit: number;
  
  /** Umbral de advertencia (porcentaje del límite) */
  warningThreshold: number;
  
  /** Si está habilitado el monitoreo */
  enabled: boolean;
  
  /** Período de monitoreo en días */
  periodDays: number;
}

/**
 * Cloud Function para monitorear el presupuesto del usuario
 * Envía alertas cuando se alcanzan umbrales de gasto
 */
export async function monitorBudget(
  userId: string,
  transactionAmount: number,
): Promise<BudgetAlert | null> {
  try {
    // Obtener configuración del usuario
    const userDoc = await database.getDocument('users', userId);
    const userData = userDoc?.data as IUser;
    
    if (!userData?.budgetConfig?.enabled) {
      return null; // Monitoreo deshabilitado
    }
    
    const config: BudgetMonitorConfig = userData.budgetConfig;
    const now = Date.now();
    const periodStart = now - (config.periodDays * 24 * 60 * 60 * 1000);
    
    // Calcular gasto actual en el período
    const transactions = await database.queryCollection(
      'transactions',
      [
        { field: 'userId', operator: 'eq', value: userId },
        { field: 'timestamp', operator: 'gte', value: periodStart },
        { field: 'timestamp', operator: 'lte', value: now }
      ]
    );
    
    let currentSpend = 0;
    transactions.forEach((doc: any) => {
      const transaction = doc.data;
      if (transaction.type === 'payment' && transaction.amount > 0) {
        currentSpend += transaction.amount;
      }
    });
    
    // Añadir la transacción actual
    currentSpend += transactionAmount;
    
    // Verificar umbrales
    const warningAmount = config.spendLimit * (config.warningThreshold / 100);
    let alertType: BudgetAlert['alertType'] | null = null;
    
    if (currentSpend >= config.spendLimit) {
      alertType = 'exceeded';
    } else if (currentSpend >= warningAmount) {
      alertType = 'warning';
    } else if (currentSpend >= config.spendLimit * 0.9) {
      alertType = 'limit';
    }
    
    if (alertType) {
      const alert: BudgetAlert = {
        userId,
        threshold: alertType === 'warning' ? warningAmount : config.spendLimit,
        currentSpend,
        alertType,
        timestamp: now,
      };
      
      // Guardar alerta en Firestore
      await database.addDocument('budgetAlerts', alert);
      
      // Registrar en el log del usuario
      await database.updateDocument('users', userId, {
        'budgetStatus.lastAlert': alert,
        'budgetStatus.currentSpend': currentSpend,
        'budgetStatus.lastUpdate': now,
      });
      
      return alert;
    }
    
    // Actualizar estado sin alerta
    await database.updateDocument('users', userId, {
      'budgetStatus.currentSpend': currentSpend,
      'budgetStatus.lastUpdate': now,
    });
    
    return null;
    
  } catch (error) {
    console.error('Error monitoreando presupuesto:', error);
    throw error;
  }
}

/**
 * Obtener alertas de presupuesto del usuario
 */
export async function getBudgetAlerts(userId: string): Promise<BudgetAlert[]> {
  try {
    const alertDocs = await database.queryCollection(
      'budgetAlerts',
      [{ field: 'userId', operator: 'eq', value: userId }],
      { 
        orderBy: { field: 'timestamp', direction: 'desc' },
        limit: 10 
      }
    );
    
    const alerts = alertDocs.map((doc: any) => doc.data as BudgetAlert);
    
    return alerts;
    
  } catch (error) {
    console.error('Error obteniendo alertas de presupuesto:', error);
    return [];
  }
}

/**
 * Configurar límites de presupuesto del usuario
 */
export async function setBudgetConfig(
  userId: string,
  config: BudgetMonitorConfig,
): Promise<void> {
  try {
    await database.updateDocument('users', userId, {
      budgetConfig: config,
      'budgetStatus.configUpdated': Date.now(),
    });
    
  } catch (error) {
    console.error('Error configurando presupuesto:', error);
    throw error;
  }
}