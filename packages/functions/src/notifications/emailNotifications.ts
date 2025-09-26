import { defineSecret } from 'firebase-functions/params';
import * as sgMail from '@sendgrid/mail';
import { database } from '../lib/database';

import type { IUser } from '@brujula-cripto/types';

// Definir secret para SendGrid
const sendgridApiKey = defineSecret('SENDGRID_API_KEY');

// Exportar secret para declaraciones de funciones
export const emailSecrets = [sendgridApiKey];

export interface EmailNotificationData {
  userId: string;
  type: 'welcome' | 'payment_success' | 'credit_low' | 'budget_alert' | 'security_alert';
  templateId?: string;
  subject: string;
  dynamicData?: Record<string, any>;
  priority: 'low' | 'normal' | 'high';
}

export interface NotificationPreferences {
  email: boolean;
  push: boolean;
  inApp: boolean;
  types: {
    payments: boolean;
    security: boolean;
    marketing: boolean;
    updates: boolean;
  };
}

/**
 * Enviar notificación por email
 */
export async function sendEmailNotification(
  notificationData: EmailNotificationData,
): Promise<void> {
  
  try {
    // Obtener datos del usuario
    const userDoc = await database.getDocument('users', notificationData.userId);
    
    if (!userDoc || !userDoc.exists) {
      throw new Error('Usuario no encontrado');
    }
    
    const userData = userDoc.data as IUser;
    const userPreferences = userData.preferences as any;
    
    // Verificar si el usuario tiene notificaciones por email habilitadas
    if (!userPreferences?.notifications?.email) {
      console.log(`Usuario ${notificationData.userId} tiene emails deshabilitados`);
      return;
    }
    
    // Verificar preferencias por tipo
    const typeMap = {
      'welcome': 'updates',
      'payment_success': 'payments',
      'credit_low': 'payments',
      'budget_alert': 'payments',
      'security_alert': 'security',
    };
    
    const preferenceType = typeMap[notificationData.type] || 'updates';
    if (!userPreferences?.notifications?.types?.[preferenceType]) {
      console.log(`Usuario ${notificationData.userId} tiene ${preferenceType} deshabilitado`);
      return;
    }

    // Configurar SendGrid con el secret
    sgMail.setApiKey(sendgridApiKey.value());

    // Configurar email
    const emailConfig = {
      to: userData.email,
      from: {
        email: 'noreply@brujula-cripto.com',
        name: 'Brújula Cripto',
      },
      subject: notificationData.subject,
      templateId: notificationData.templateId || getDefaultTemplate(notificationData.type),
      dynamicTemplateData: {
        user_name: userData.displayName || 'Usuario',
        user_email: userData.email,
        ...notificationData.dynamicData,
      },
    };

    // Enviar email
    await sgMail.send(emailConfig);
    
    // Registrar el envío
    await database.addDocument('emailNotifications', {
      userId: notificationData.userId,
      type: notificationData.type,
      email: userData.email,
      subject: notificationData.subject,
      status: 'sent',
      sentAt: new Date(),
      priority: notificationData.priority,
    });
    
  } catch (error) {
    console.error('Error enviando notificación por email:', error);
    
    // Registrar el error
    await database.addDocument('emailNotifications', {
      userId: notificationData.userId,
      type: notificationData.type,
      subject: notificationData.subject,
      status: 'failed',
      error: error instanceof Error ? error.message : 'Error desconocido',
      sentAt: new Date(),
      priority: notificationData.priority,
    });
    
    throw error;
  }
}

// FUNCIÓN ELIMINADA - VIOLABA MANDAMIENTO #2 CON SIMULACIÓN DE EMAILS

/**
 * Obtener template por defecto según tipo
 */
function getDefaultTemplate(type: EmailNotificationData['type']): string {
  const templates = {
    welcome: 'd-welcome123',
    payment_success: 'd-payment456',
    credit_low: 'd-credit789',
    budget_alert: 'd-budget012',
    security_alert: 'd-security345',
  };
  
  return templates[type] || 'd-default678';
}

/**
 * Actualizar preferencias de notificación del usuario
 */
export async function updateNotificationPreferences(
  userId: string,
  preferences: NotificationPreferences,
): Promise<void> {
  try {
    await database.updateDocument('users', userId, {
      'preferences.notifications': preferences,
      updatedAt: new Date(),
    });
    
  } catch (error) {
    console.error('Error actualizando preferencias de notificación:', error);
    throw error;
  }
}

/**
 * Obtener preferencias de notificación del usuario
 */
export async function getNotificationPreferences(
  userId: string,
): Promise<NotificationPreferences> {
  try {
    const userDoc = await database.getDocument('users', userId);
    
    if (!userDoc || !userDoc.exists) {
      throw new Error('Usuario no encontrado');
    }
    
    const userData = userDoc.data as IUser;
    const preferences = (userData.preferences as any)?.notifications;
    
    // Devolver preferencias por defecto si no están configuradas
    return preferences || {
      email: true,
      push: false,
      inApp: true,
      types: {
        payments: true,
        security: true,
        marketing: false,
        updates: true,
      },
    };
    
  } catch (error) {
    console.error('Error obteniendo preferencias de notificación:', error);
    
    // Devolver configuración por defecto en caso de error
    return {
      email: true,
      push: false,
      inApp: true,
      types: {
        payments: true,
        security: true,
        marketing: false,
        updates: true,
      },
    };
  }
}

/**
 * Enviar notificación de bienvenida
 */
export async function sendWelcomeNotification(userId: string): Promise<void> {
  await sendEmailNotification({
    userId,
    type: 'welcome',
    subject: '¡Bienvenido a Brújula Cripto!',
    dynamicData: {
      welcome_bonus_credits: 3600, // 1 hora de créditos
    },
    priority: 'normal',
  });
}

/**
 * Enviar notificación de pago exitoso
 */
export async function sendPaymentSuccessNotification(
  userId: string,
  paymentAmount: number,
  creditsAdded: number,
): Promise<void> {
  await sendEmailNotification({
    userId,
    type: 'payment_success',
    subject: 'Pago procesado exitosamente',
    dynamicData: {
      payment_amount: paymentAmount,
      credits_added: creditsAdded,
      credits_hours: Math.floor(creditsAdded / 3600),
    },
    priority: 'high',
  });
}

/**
 * Enviar alerta de créditos bajos
 */
export async function sendLowCreditsAlert(
  userId: string,
  remainingCredits: number,
): Promise<void> {
  await sendEmailNotification({
    userId,
    type: 'credit_low',
    subject: 'Tus créditos están llegando al límite',
    dynamicData: {
      remaining_credits: remainingCredits,
      remaining_minutes: Math.floor(remainingCredits / 60),
    },
    priority: 'normal',
  });
}

/**
 * Enviar alerta de presupuesto
 */
export async function sendBudgetAlert(
  userId: string,
  currentSpend: number,
  spendLimit: number,
  alertType: 'warning' | 'exceeded',
): Promise<void> {
  const subject = alertType === 'exceeded' 
    ? 'Has superado tu límite de presupuesto'
    : 'Te estás acercando a tu límite de presupuesto';
    
  await sendEmailNotification({
    userId,
    type: 'budget_alert',
    subject,
    dynamicData: {
      current_spend: currentSpend,
      spend_limit: spendLimit,
      percentage: Math.round((currentSpend / spendLimit) * 100),
      alert_type: alertType,
    },
    priority: alertType === 'exceeded' ? 'high' : 'normal',
  });
}