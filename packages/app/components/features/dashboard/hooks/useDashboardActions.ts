'use client';

import { useState } from 'react';

import { createStripePortalSession } from '@/lib/api';
import { useAuth } from '@/lib/auth/AuthProvider';

interface UseDashboardActionsReturn {
  isLoading: boolean;
  handleSignOut: () => Promise<void>;
  handleManageSubscription: () => Promise<void>;
  handleDeleteAccount: (confirmMessage: string, finalConfirmMessage: string) => Promise<void>;
}

export function useDashboardActions(): UseDashboardActionsReturn {
  const { logout } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleSignOut = async (): Promise<void> => {
    try {
      setIsLoading(true);
      await logout();
      window.location.href = '/';
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleManageSubscription = async (): Promise<void> => {
    try {
      setIsLoading(true);
      const response = await createStripePortalSession();
      if (response.data?.url) {
        window.location.href = response.data.url;
      }
    } catch (error) {
      console.error('Error al abrir portal Stripe:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAccount = async (
    confirmMessage: string,
    finalConfirmMessage: string,
  ): Promise<void> => {
    if (window.confirm(confirmMessage)) {
      if (window.confirm(finalConfirmMessage)) {
        try {
          setIsLoading(true);
          await fetch('/api/deleteAccount', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
          });
          await logout();
          window.location.href = '/';
        } catch (error) {
          console.error('Error al eliminar cuenta:', error);
        } finally {
          setIsLoading(false);
        }
      }
    }
  };

  return {
    isLoading,
    handleSignOut,
    handleManageSubscription,
    handleDeleteAccount,
  };
}
