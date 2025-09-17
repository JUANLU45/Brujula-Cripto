'use client';

import { Button } from '@/components/ui/Button';
import { useTranslations } from 'next-intl';

interface ChatbotUpsellModalProps {
  showUpsellModal: boolean;
  isGuest: boolean;
  locale: 'es' | 'en';
  onClose: () => void;
}

export function ChatbotUpsellModal({
  showUpsellModal,
  isGuest,
  locale,
  onClose,
}: ChatbotUpsellModalProps): JSX.Element | null {
  const t = useTranslations('chatbot');
  const tCommon = useTranslations('common');

  if (!showUpsellModal) {
    return null;
  }

  const handleUpgradeClick = (): void => {
    window.location.href = `/${locale}/pricing`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="mx-4 max-w-md rounded-lg bg-white p-6 shadow-xl dark:bg-gray-800">
        <h3 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
          {isGuest
            ? t('upsell.guestTitle') || '¡Únete a Brújula Cripto!'
            : t('upsell.limitTitle') || '¡Límite Alcanzado!'}
        </h3>
        <p className="mb-6 text-gray-600 dark:text-gray-300">
          {isGuest
            ? t('upsell.guestDescription') ||
              'Regístrate gratis y obtén 10 mensajes para probar nuestro chatbot especializado.'
            : t('upsell.limitDescription') ||
              'Has usado tus 10 mensajes gratuitos. Suscríbete para acceso ilimitado.'}
        </p>
        <div className="flex gap-3">
          <Button variant="secondary" onClick={onClose} className="flex-1">
            {tCommon('cancel') || 'Cancelar'}
          </Button>
          <Button variant="default" onClick={handleUpgradeClick} className="flex-1">
            {isGuest
              ? t('upsell.register') || 'Registrarse'
              : t('upsell.subscribe') || 'Suscribirse'}
          </Button>
        </div>
      </div>
    </div>
  );
}
