'use client';

import { Button } from '@/components/ui/Button';

import { FeedbackIcon } from './FeedbackIcon';
import { FeedbackModal } from './FeedbackModal';
import { useFeedbackLogic } from './useFeedbackLogic';

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
  const {
    isModalOpen,
    feedbackText,
    isSubmitting,
    submitStatus,
    shouldShow,
    handleFeedbackSubmit,
    handleButtonClick,
    setIsModalOpen,
    setFeedbackText,
    t,
  } = useFeedbackLogic(isEnabled);

  if (!shouldShow) {
    return null;
  }

  return (
    <>
      {/* Botón flotante */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => handleButtonClick(customUrl)}
          className="rounded-full bg-blue-600 p-4 text-white shadow-xl transition-all duration-300 hover:scale-110 hover:bg-blue-700 hover:shadow-2xl"
          aria-label={customText || t('buttonLabel', { defaultValue: 'Enviar Feedback' })}
        >
          <div className="flex items-center space-x-2">
            {/* Icono */}
            <div className="h-6 w-6">
              <FeedbackIcon customIcon={customIcon} />
            </div>
            {/* Texto (solo en pantallas grandes) */}
            <span className="hidden font-medium sm:block">
              {customText || t('buttonText', { defaultValue: 'Feedback' })}
            </span>
          </div>
        </Button>
      </div>

      {/* Modal de feedback */}
      <FeedbackModal
        isOpen={isModalOpen}
        feedbackText={feedbackText}
        isSubmitting={isSubmitting}
        submitStatus={submitStatus}
        onClose={() => setIsModalOpen(false)}
        onTextChange={setFeedbackText}
        onSubmit={handleFeedbackSubmit}
      />
    </>
  );
}
