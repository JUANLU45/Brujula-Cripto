'use client';

import { Button } from '@/components/ui/Button';
import { createCheckoutSession } from '@/lib/api';
import { useAuth } from '@/lib/auth/AuthProvider';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

interface UpgradeButtonProps {
  planId?: string;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'secondary' | 'outline';
  fullWidth?: boolean;
  showConsentCheckbox?: boolean;
  customText?: string;
  onUpgrade?: (planId: string) => void;
}

export function UpgradeButton({
  planId = 'premium-monthly',
  disabled = false,
  size = 'md',
  variant = 'primary',
  fullWidth = false,
  showConsentCheckbox = false,
  customText,
  onUpgrade,
}: UpgradeButtonProps) {
  const t = useTranslations('payments');
  const { user, userData } = useAuth();

  const [consentChecked, setConsentChecked] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');

  const handleUpgrade = async () => {
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

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'px-3 py-2 text-sm';
      case 'lg':
        return 'px-8 py-4 text-lg';
      default:
        return 'px-6 py-3 text-base';
    }
  };

  const getVariantClasses = () => {
    switch (variant) {
      case 'secondary':
        return 'bg-gray-600 hover:bg-gray-700 text-white';
      case 'outline':
        return 'border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white bg-transparent';
      default:
        return 'bg-blue-600 hover:bg-blue-700 text-white';
    }
  };

  const getButtonText = () => {
    if (customText) return customText;
    if (isProcessing) return t('processing');
    if (!user) return 'Registrarse para Premium';
    return 'Desbloquear Potencia Total';
  };

  const isButtonDisabled = disabled || isProcessing || (showConsentCheckbox && !consentChecked);

  return (
    <div className="space-y-4">
      {showConsentCheckbox && (
        <div className="space-y-3">
          <label className="flex cursor-pointer items-start space-x-3">
            <input
              type="checkbox"
              checked={consentChecked}
              onChange={(e) => {
                setConsentChecked(e.target.checked);
                if (e.target.checked) setError('');
              }}
              className="mt-1 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
            />
            <span className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">
              Acepto los{' '}
              <a
                href="/legal/terminos"
                className="text-blue-600 hover:underline dark:text-blue-400"
                target="_blank"
                rel="noopener noreferrer"
              >
                Términos de Servicio
              </a>{' '}
              y el{' '}
              <a
                href="/legal/descargo-responsabilidad"
                className="text-blue-600 hover:underline dark:text-blue-400"
                target="_blank"
                rel="noopener noreferrer"
              >
                Descargo de Responsabilidad
              </a>
              {', '}
              entiendo que esta herramienta no garantiza la recuperación total.
            </span>
          </label>

          {error && <div className="text-sm text-red-600 dark:text-red-400">{error}</div>}
        </div>
      )}

      <Button
        onClick={handleUpgrade}
        disabled={isButtonDisabled}
        className={` ${getSizeClasses()} ${getVariantClasses()} ${fullWidth ? 'w-full' : ''} transform rounded-lg font-semibold shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl disabled:transform-none disabled:cursor-not-allowed disabled:opacity-50`}
      >
        {isProcessing && (
          <svg
            className="-ml-1 mr-3 h-5 w-5 animate-spin text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        )}
        {getButtonText()}
      </Button>

      {/* Información adicional */}
      <div className="text-center">
        <p className="text-xs text-gray-500 dark:text-gray-400">Pago seguro • Acceso instantáneo</p>

        {user && userData?.usageCreditsInSeconds && userData.usageCreditsInSeconds > 0 && (
          <div className="mt-2 inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800 dark:bg-green-900 dark:text-green-200">
            Ya tienes créditos activos
          </div>
        )}
      </div>
    </div>
  );
}

export default UpgradeButton;
