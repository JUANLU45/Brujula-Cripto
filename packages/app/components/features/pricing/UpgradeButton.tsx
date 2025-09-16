'use client';

import { useState } from 'react';

import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/Button';

interface UpgradeButtonProps {
  planId: string;
  planName: string;
  price: number;
  currency?: string;
  period?: string;
  className?: string;
  variant?: 'default' | 'outline' | 'destructive' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  disabled?: boolean;
  onSuccess?: (sessionId: string) => void;
  onError?: (error: string) => void;
}

export default function UpgradeButton({
  planId,
  planName,
  price,
  currency = '€',
  period,
  className,
  variant = 'default',
  size = 'default',
  disabled = false,
  onSuccess,
  onError,
}: UpgradeButtonProps): JSX.Element {
  const t = useTranslations('pricing');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [acceptedDisclaimer, setAcceptedDisclaimer] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleButtonClick = (): void => {
    setIsModalOpen(true);
    setErrorMessage(null);
  };

  const handleCloseModal = (): void => {
    setIsModalOpen(false);
    setAcceptedTerms(false);
    setAcceptedDisclaimer(false);
    setErrorMessage(null);
  };

  const handleProceedToPayment = async (): Promise<void> => {
    if (!acceptedTerms || !acceptedDisclaimer) {
      setErrorMessage(
        'Debes aceptar los términos y el descargo de responsabilidad para continuar.',
      );
      return;
    }

    setIsProcessing(true);
    setErrorMessage(null);

    try {
      // Llamada a la API para crear sesión de Stripe
      const response = await fetch('/api/payments/create-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          planId,
          planName,
          price,
          currency,
          period,
          acceptedTerms: true,
          acceptedDisclaimer: true,
        }),
      });

      if (!response.ok) {
        const errorData = (await response.json()) as { message?: string };
        throw new Error(errorData.message || 'Error al crear la sesión de pago');
      }

      const result = (await response.json()) as { sessionId?: string; checkoutUrl?: string };

      // Redirigir a Stripe Checkout
      if (result.checkoutUrl) {
        window.location.href = result.checkoutUrl;
      } else if (result.sessionId) {
        // Usar Stripe.js para redirigir
        const stripe = (window as unknown as { Stripe?: unknown }).Stripe;
        if (stripe) {
          const stripeInstance = stripe as {
            redirectToCheckout: (options: {
              sessionId: string;
            }) => Promise<{ error?: { message: string } }>;
          };
          const { error } = await stripeInstance.redirectToCheckout({
            sessionId: result.sessionId,
          });
          if (error) {
            throw new Error(error.message);
          }
        } else {
          throw new Error('Stripe no está disponible');
        }
      }

      if (onSuccess && result.sessionId) {
        onSuccess(result.sessionId as string);
      }
    } catch (error: unknown) {
      const errorMsg = error instanceof Error ? error.message : t('errors.paymentFailed');
      setErrorMessage(errorMsg);
      if (onError) {
        onError(errorMsg as string);
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const formatPrice = (amount: number): string => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: (currency === '€' ? 'EUR' : 'USD') as string,
    }).format(amount);
  };

  return (
    <>
      <Button
        variant={variant}
        size={size}
        className={className}
        disabled={disabled}
        onClick={handleButtonClick}
      >
        {t('selectPlan')}
      </Button>

      {/* Modal de Confirmación */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
          onClick={(e) => e.target === e.currentTarget && handleCloseModal()}
        >
          <div className="mx-4 max-h-[90vh] w-full max-w-md overflow-y-auto rounded-lg bg-white p-6 dark:bg-gray-800">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Confirmar Suscripción
              </h3>
              <button
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                aria-label="Cerrar modal"
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Resumen del Plan */}
            <div className="mb-6 rounded-lg bg-gray-50 p-4 dark:bg-gray-700">
              <h4 className="mb-2 font-semibold text-gray-900 dark:text-white">{planName}</h4>
              <div className="flex items-center justify-between">
                <span className="text-gray-600 dark:text-gray-300">Precio:</span>
                <span className="text-xl font-bold text-gray-900 dark:text-white">
                  {formatPrice(price)}
                  {period && (
                    <span className="ml-1 text-sm text-gray-500 dark:text-gray-400">
                      / {period}
                    </span>
                  )}
                </span>
              </div>
            </div>

            {/* Checkboxes Obligatorios */}
            <div className="mb-6 space-y-4">
              <label className="flex cursor-pointer items-start space-x-3">
                <input
                  type="checkbox"
                  checked={acceptedTerms}
                  onChange={(e) => setAcceptedTerms(e.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  He leído y acepto los{' '}
                  <a
                    href="/legal/terminos"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline dark:text-blue-400"
                  >
                    Términos y Condiciones
                  </a>
                  .
                </span>
              </label>

              <label className="flex cursor-pointer items-start space-x-3">
                <input
                  type="checkbox"
                  checked={acceptedDisclaimer}
                  onChange={(e) => setAcceptedDisclaimer(e.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  Entiendo y acepto el{' '}
                  <a
                    href="/legal/descargo-responsabilidad"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline dark:text-blue-400"
                  >
                    Descargo de Responsabilidad
                  </a>{' '}
                  sobre las herramientas de recuperación.
                </span>
              </label>
            </div>

            {/* Mensaje de Error */}
            {errorMessage && (
              <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 dark:border-red-800 dark:bg-red-900/20">
                <p className="text-sm text-red-600 dark:text-red-400">{errorMessage}</p>
              </div>
            )}

            {/* Botones */}
            <div className="flex space-x-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={handleCloseModal}
                disabled={isProcessing}
              >
                Cancelar
              </Button>
              <Button
                variant="default"
                className="flex-1"
                onClick={handleProceedToPayment}
                disabled={!acceptedTerms || !acceptedDisclaimer || isProcessing}
              >
                {isProcessing ? (
                  <div className="flex items-center">
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-b-2 border-white"></div>
                    Procesando...
                  </div>
                ) : (
                  'Proceder al Pago'
                )}
              </Button>
            </div>

            {/* Nota de Seguridad */}
            <div className="mt-4 rounded-lg border border-blue-200 bg-blue-50 p-3 dark:border-blue-800 dark:bg-blue-900/20">
              <div className="flex items-start">
                <svg
                  className="mr-2 mt-0.5 h-5 w-5 flex-shrink-0 text-blue-600 dark:text-blue-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  />
                </svg>
                <p className="text-xs text-blue-700 dark:text-blue-300">
                  El pago se procesa de forma segura a través de Stripe. No almacenamos información
                  de tarjetas de crédito.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
