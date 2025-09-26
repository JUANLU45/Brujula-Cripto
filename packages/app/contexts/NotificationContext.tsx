'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export interface NotificationData {
  id: string;
  type: NotificationType;
  title: string;
  message?: string;
  duration?: number; // en milisegundos, null = permanente
  actions?: NotificationAction[];
  persistent?: boolean; // si true, requiere acción manual para cerrar
}

export interface NotificationAction {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
}

interface NotificationContextValue {
  notifications: NotificationData[];
  addNotification: (notification: Omit<NotificationData, 'id'>) => string;
  removeNotification: (id: string) => void;
  clearAll: () => void;
  showSuccess: (title: string, message?: string, options?: Partial<NotificationData>) => string;
  showError: (title: string, message?: string, options?: Partial<NotificationData>) => string;
  showWarning: (title: string, message?: string, options?: Partial<NotificationData>) => string;
  showInfo: (title: string, message?: string, options?: Partial<NotificationData>) => string;
}

const NotificationContext = createContext<NotificationContextValue | undefined>(undefined);

interface NotificationProviderProps {
  children: React.ReactNode;
  maxNotifications?: number;
  defaultDuration?: number;
}

export function NotificationProvider({ 
  children, 
  maxNotifications = 5,
  defaultDuration = 5000 
}: NotificationProviderProps): JSX.Element {
  const [notifications, setNotifications] = useState<NotificationData[]>([]);

  const generateId = (): string => {
    return `notification-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  };

  const addNotification = useCallback((notification: Omit<NotificationData, 'id'>): string => {
    const id = generateId();
    const newNotification: NotificationData = {
      ...notification,
      id,
      duration: notification.duration ?? defaultDuration,
    };

    setNotifications(prev => {
      const updated = [newNotification, ...prev];
      // Mantener solo las últimas notificaciones
      return updated.slice(0, maxNotifications);
    });

    // Auto-remover si no es persistente y tiene duración
    if (!notification.persistent && newNotification.duration && newNotification.duration > 0) {
      setTimeout(() => {
        removeNotification(id);
      }, newNotification.duration);
    }

    return id;
  }, [defaultDuration, maxNotifications]);

  const removeNotification = useCallback((id: string): void => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  }, []);

  const clearAll = useCallback((): void => {
    setNotifications([]);
  }, []);

  const showSuccess = useCallback((
    title: string, 
    message?: string, 
    options?: Partial<NotificationData>
  ): string => {
    return addNotification({
      type: 'success',
      title,
      message,
      ...options,
    });
  }, [addNotification]);

  const showError = useCallback((
    title: string, 
    message?: string, 
    options?: Partial<NotificationData>
  ): string => {
    return addNotification({
      type: 'error',
      title,
      message,
      persistent: true, // Errores por defecto son persistentes
      ...options,
    });
  }, [addNotification]);

  const showWarning = useCallback((
    title: string, 
    message?: string, 
    options?: Partial<NotificationData>
  ): string => {
    return addNotification({
      type: 'warning',
      title,
      message,
      ...options,
    });
  }, [addNotification]);

  const showInfo = useCallback((
    title: string, 
    message?: string, 
    options?: Partial<NotificationData>
  ): string => {
    return addNotification({
      type: 'info',
      title,
      message,
      ...options,
    });
  }, [addNotification]);

  const value: NotificationContextValue = {
    notifications,
    addNotification,
    removeNotification,
    clearAll,
    showSuccess,
    showError,
    showWarning,
    showInfo,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications(): NotificationContextValue {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}