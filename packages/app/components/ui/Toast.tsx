'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import type { NotificationData } from '@/contexts/NotificationContext';
import { useNotifications } from '@/contexts/NotificationContext';

interface ToastProps {
  notification: NotificationData;
  onClose: (id: string) => void;
}

function Toast({ notification, onClose }: ToastProps): JSX.Element {
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    // Animar entrada
    setTimeout(() => setIsVisible(true), 100);
  }, []);

  const handleClose = (): void => {
    setIsExiting(true);
    setTimeout(() => {
      onClose(notification.id);
    }, 300);
  };

  const getIcon = (): string => {
    switch (notification.type) {
      case 'success':
        return '✅';
      case 'error':
        return '❌';
      case 'warning':
        return '⚠️';
      case 'info':
        return 'ℹ️';
      default:
        return '📢';
    }
  };

  const getStyles = (): string => {
    const baseStyles = 'border-l-4 shadow-lg';
    
    switch (notification.type) {
      case 'success':
        return `${baseStyles} border-green-500 bg-green-50 dark:bg-green-900/20`;
      case 'error':
        return `${baseStyles} border-red-500 bg-red-50 dark:bg-red-900/20`;
      case 'warning':
        return `${baseStyles} border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20`;
      case 'info':
        return `${baseStyles} border-blue-500 bg-blue-50 dark:bg-blue-900/20`;
      default:
        return `${baseStyles} border-gray-500 bg-gray-50 dark:bg-gray-800`;
    }
  };

  const getTitleColor = (): string => {
    switch (notification.type) {
      case 'success':
        return 'text-green-800 dark:text-green-200';
      case 'error':
        return 'text-red-800 dark:text-red-200';
      case 'warning':
        return 'text-yellow-800 dark:text-yellow-200';
      case 'info':
        return 'text-blue-800 dark:text-blue-200';
      default:
        return 'text-gray-800 dark:text-gray-200';
    }
  };

  const getMessageColor = (): string => {
    switch (notification.type) {
      case 'success':
        return 'text-green-700 dark:text-green-300';
      case 'error':
        return 'text-red-700 dark:text-red-300';
      case 'warning':
        return 'text-yellow-700 dark:text-yellow-300';
      case 'info':
        return 'text-blue-700 dark:text-blue-300';
      default:
        return 'text-gray-700 dark:text-gray-300';
    }
  };

  return (
    <div
      className={`
        transform transition-all duration-300 ease-in-out
        ${isVisible && !isExiting ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
        mb-4 max-w-sm w-full
      `}
    >
      <Card className={`p-4 ${getStyles()}`}>
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3 flex-1">
            <div className="flex-shrink-0 text-lg" role="img" aria-label={notification.type}>
              {getIcon()}
            </div>
            
            <div className="flex-1 min-w-0">
              <h4 className={`text-sm font-medium ${getTitleColor()}`}>
                {notification.title}
              </h4>
              
              {notification.message && (
                <p className={`mt-1 text-sm ${getMessageColor()}`}>
                  {notification.message}
                </p>
              )}
              
              {notification.actions && notification.actions.length > 0 && (
                <div className="mt-3 flex space-x-2">
                  {notification.actions.map((action, index) => (
                    <Button
                      key={index}
                      size="sm"
                      variant={action.variant === 'primary' ? 'default' : 'outline'}
                      onClick={action.onClick}
                      className="text-xs"
                    >
                      {action.label}
                    </Button>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClose}
            className="flex-shrink-0 ml-2 h-6 w-6 p-0 hover:bg-black/5 dark:hover:bg-white/5"
            aria-label="Cerrar notificación"
          >
            <span className="text-lg leading-none">×</span>
          </Button>
        </div>
      </Card>
    </div>
  );
}

export function ToastContainer(): JSX.Element | null {
  const { notifications, removeNotification } = useNotifications();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || typeof document === 'undefined') {
    return null;
  }

  const portalRoot = document.getElementById('toast-root') || document.body;

  return createPortal(
    <div
      className="fixed top-4 right-4 z-[9999] pointer-events-none"
      aria-live="polite"
      aria-label="Notificaciones"
    >
      <div className="flex flex-col pointer-events-auto">
        {notifications.map((notification) => (
          <Toast
            key={notification.id}
            notification={notification}
            onClose={removeNotification}
          />
        ))}
      </div>
    </div>,
    portalRoot
  );
}