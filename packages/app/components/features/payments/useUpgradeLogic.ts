'use client';

import { useState } from 'react';

import type { IUser } from '@brujula-cripto/types';
import type { User } from 'firebase/auth';
import { useTranslations } from 'next-intl';

import { createCheckoutSession } from '@/lib/api';
import { useAuth } from '@/lib/auth/AuthProvider';

interface UseUpgradeLogicProps {
  planId: string;
  showConsentCheckbox: boolean;
  onUpgrade?: (planId: string) => void;
}

interface UseUpgradeLogicReturn {
  // Estado
  consentChecked: boolean;
  isProcessing: boolean;
  error: string;

  // Funciones
  handleUpgrade: () => Promise<void>;
  handleConsentChange: (checked: boolean) => void;
  getButtonText: (customText?: string) => string;
  isButtonDisabled: (disabled: boolean) => boolean;

  // Datos
  user: User | null;
  userData: IUser | null;
  t: ReturnType<typeof useTranslations>;
}

export function useUpgradeLogic({
  planId,
  showConsentCheckbox,
  onUpgrade,
}: UseUpgradeLogicProps): UseUpgradeLogicReturn {
  const t = useTranslations('payments');
  const { user, userData } = useAuth();

  const [consentChecked, setConsentChecked] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');

  const handleUpgrade = async (): Promise<void> => {
    if (!user) {
      // Redirigir al registro/login
      window.location.href = '/login';
      return;
    }

    if (showConsentCheckbox && !consentChecked) {
      setError('Debe aceptar los términos para continuar');
      return;
    }

    setIsProcessing(true);
    setError('');

    try {
      if (onUpgrade) {
        onUpgrade(planId);
      } else {
        // Llamada centralizada a la API según PROYEC_PARTE2.MD
        const result = await createCheckoutSession(planId);

        if (!result.success || !result.data) {
          throw new Error(result.error || 'Error en el pago');
        }

        // Redirigir al checkout de Stripe
        window.location.href = result.data.sessionUrl;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleConsentChange = (checked: boolean): void => {
    setConsentChecked(checked);
    if (checked) {
      setError('');
    }
  };

  const getButtonText = (customText?: string): string => {
    if (customText) {
      return customText;
    }
    if (isProcessing) {
      return t('processing');
    }
    if (!user) {
      return 'Registrarse para Premium';
    }
    return 'Desbloquear Potencia Total';
  };

  const isButtonDisabled = (disabled: boolean): boolean => {
    return disabled || isProcessing || (showConsentCheckbox && !consentChecked);
  };

  return {
    consentChecked,
    isProcessing,
    error,
    handleUpgrade,
    handleConsentChange,
    getButtonText,
    isButtonDisabled,
    user,
    userData,
    t,
  };
}
