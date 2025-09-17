'use client';

import { useState } from 'react';

import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/Button';
import { useAuth } from '@/lib/auth/AuthProvider';

interface FeedbackButtonProps {
  customText?: string;
  customUrl?: string;
  customIcon?: string;
  isEnabled?: boolean;
}

export function FeedbackButton({
  customText,
  customUrl,
  customIcon,
  isEnabled = true,
}: FeedbackButtonProps): JSX.Element | null {
  const t = useTranslations('homepage.feedback');
  const { user, userData } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [feedbackText, setFeedbackText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  // Solo mostrar para usuarios premium
  const shouldShow = user && userData?.isPremium && isEnabled;

  const handleFeedbackSubmit = async (): Promise<void> => {
    if (!feedbackText.trim() || !user) {
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          uid: user.uid,
          message: feedbackText,
          timestamp: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        throw new Error('Error al enviar feedback');
      }

      setSubmitStatus('success');
      setFeedbackText('');
      setTimeout(() => {
        setIsModalOpen(false);
        setSubmitStatus('idle');
      }, 2000);
    } catch {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleButtonClick = (): void => {
    if (customUrl) {
      window.open(customUrl, '_blank');
    } else {
      setIsModalOpen(true);
    }
  };

  if (!shouldShow) {
    return null;
  }

  return (
    <>
      {/* Botón flotante */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={handleButtonClick}
          className="rounded-full bg-blue-600 p-4 text-white shadow-xl transition-all duration-300 hover:scale-110 hover:bg-blue-700 hover:shadow-2xl"
          aria-label={customText || t('buttonLabel', { defaultValue: 'Enviar Feedback' })}
        >
          <div className="flex items-center space-x-2">
            {/* Icono */}
            <div className="h-6 w-6">
              {customIcon ? (
                <img src={customIcon} alt="Feedback icon" className="h-full w-full" />
              ) : (
                <svg
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className="h-full w-full"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9a9 9 0 00-9 9m9-9v9m0-9a9 9 0 019 9M3 12a9 9 0 009 9"
                  />
                  <circle cx="12" cy="12" r="2" />
                </svg>
              )}
            </div>
            {/* Texto (solo en pantallas grandes) */}
            <span className="hidden font-medium sm:block">
              {customText || t('buttonText', { defaultValue: 'Feedback' })}
            </span>
          </div>
        </Button>
      </div>

      {/* Modal de feedback */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-lg bg-white p-6 dark:bg-gray-800">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {t('modalTitle', { defaultValue: 'Enviar Feedback' })}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                aria-label={t('closeModal', { defaultValue: 'Cerrar modal' })}
                title={t('closeModal', { defaultValue: 'Cerrar modal' })}
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="mb-4">
              <label
                htmlFor="feedback-text"
                className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                {t('messageLabel', { defaultValue: 'Tu mensaje' })}
              </label>
              <textarea
                id="feedback-text"
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                rows={4}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                placeholder={t('placeholder', {
                  defaultValue: 'Comparte tu experiencia, sugerencias o problemas...',
                })}
                disabled={isSubmitting}
              />
            </div>

            {submitStatus === 'success' && (
              <div className="mb-4 rounded-md bg-green-100 p-3 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                {t('successMessage', {
                  defaultValue: '¡Gracias por tu feedback! Lo hemos recibido correctamente.',
                })}
              </div>
            )}

            {submitStatus === 'error' && (
              <div className="mb-4 rounded-md bg-red-100 p-3 text-red-800 dark:bg-red-900/30 dark:text-red-400">
                {t('errorMessage', {
                  defaultValue: 'Error al enviar el feedback. Por favor, inténtalo de nuevo.',
                })}
              </div>
            )}

            <div className="flex space-x-3">
              <Button
                onClick={() => setIsModalOpen(false)}
                variant="outline"
                className="flex-1"
                disabled={isSubmitting}
              >
                {t('cancelButton', { defaultValue: 'Cancelar' })}
              </Button>
              <Button
                onClick={() => void handleFeedbackSubmit()}
                className="flex-1"
                disabled={!feedbackText.trim() || isSubmitting}
              >
                {isSubmitting
                  ? t('sendingButton', { defaultValue: 'Enviando...' })
                  : t('sendButton', { defaultValue: 'Enviar' })}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
