import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/Button';

interface FeedbackModalProps {
  isOpen: boolean;
  feedbackText: string;
  isSubmitting: boolean;
  submitStatus: 'idle' | 'success' | 'error';
  onClose: () => void;
  onTextChange: (text: string) => void;
  onSubmit: () => Promise<void>;
}

export function FeedbackModal({
  isOpen,
  feedbackText,
  isSubmitting,
  submitStatus,
  onClose,
  onTextChange,
  onSubmit,
}: FeedbackModalProps): JSX.Element | null {
  const t = useTranslations('homepage.feedback');

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-lg bg-white p-6 dark:bg-gray-800">
        <FeedbackModalHeader onClose={onClose} t={t} />
        <FeedbackModalContent
          feedbackText={feedbackText}
          onTextChange={onTextChange}
          isSubmitting={isSubmitting}
          t={t}
        />
        <FeedbackModalStatus submitStatus={submitStatus} t={t} />
        <FeedbackModalActions
          onClose={onClose}
          onSubmit={onSubmit}
          isSubmitting={isSubmitting}
          feedbackText={feedbackText}
          t={t}
        />
      </div>
    </div>
  );
}

function FeedbackModalHeader({
  onClose,
  t,
}: {
  onClose: () => void;
  t: ReturnType<typeof useTranslations>;
}): JSX.Element {
  return (
    <div className="mb-4 flex items-center justify-between">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
        {t('modalTitle', { defaultValue: 'Enviar Feedback' })}
      </h3>
      <button
        onClick={onClose}
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
  );
}

function FeedbackModalContent({
  feedbackText,
  onTextChange,
  isSubmitting,
  t,
}: {
  feedbackText: string;
  onTextChange: (text: string) => void;
  isSubmitting: boolean;
  t: ReturnType<typeof useTranslations>;
}): JSX.Element {
  return (
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
        onChange={(e) => onTextChange(e.target.value)}
        rows={4}
        className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
        placeholder={t('placeholder', {
          defaultValue: 'Comparte tu experiencia, sugerencias o problemas...',
        })}
        disabled={isSubmitting}
      />
    </div>
  );
}

function FeedbackModalStatus({
  submitStatus,
  t,
}: {
  submitStatus: 'idle' | 'success' | 'error';
  t: ReturnType<typeof useTranslations>;
}): JSX.Element | null {
  if (submitStatus === 'success') {
    return (
      <div className="mb-4 rounded-md bg-green-100 p-3 text-green-800 dark:bg-green-900/30 dark:text-green-400">
        {t('successMessage', {
          defaultValue: '¡Gracias por tu feedback! Lo hemos recibido correctamente.',
        })}
      </div>
    );
  }

  if (submitStatus === 'error') {
    return (
      <div className="mb-4 rounded-md bg-red-100 p-3 text-red-800 dark:bg-red-900/30 dark:text-red-400">
        {t('errorMessage', {
          defaultValue: 'Error al enviar el feedback. Por favor, inténtalo de nuevo.',
        })}
      </div>
    );
  }

  return null;
}

function FeedbackModalActions({
  onClose,
  onSubmit,
  isSubmitting,
  feedbackText,
  t,
}: {
  onClose: () => void;
  onSubmit: () => Promise<void>;
  isSubmitting: boolean;
  feedbackText: string;
  t: ReturnType<typeof useTranslations>;
}): JSX.Element {
  return (
    <div className="flex space-x-3">
      <Button onClick={onClose} variant="outline" className="flex-1" disabled={isSubmitting}>
        {t('cancelButton', { defaultValue: 'Cancelar' })}
      </Button>
      <Button
        onClick={() => void onSubmit()}
        className="flex-1"
        disabled={!feedbackText.trim() || isSubmitting}
      >
        {isSubmitting
          ? t('sendingButton', { defaultValue: 'Enviando...' })
          : t('sendButton', { defaultValue: 'Enviar' })}
      </Button>
    </div>
  );
}
