'use client';

import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/Button';

interface ChatbotUpsellModalProps {
  showUpsellModal: boolean;
  isGuest: boolean;
  locale: 'es' | 'en';
  onClose: () => void;
}

interface UpsellContentProps {
  isGuest: boolean;
  t: (key: string) => string;
}

function UpsellContent({ isGuest, t }: UpsellContentProps): {
  title: string;
  description: string;
  buttonText: string;
} {
  if (isGuest) {
    return {
      title: t('upsell.guestTitle') || '¡Únete a Brújula Cripto!',
      description:
        t('upsell.guestDescription') ||
        'Regístrate gratis y obtén 10 mensajes para probar nuestro chatbot especializado.',
      buttonText: t('upsell.register') || 'Registrarse',
    };
  }

  return {
    title: t('upsell.limitTitle') || '¡Límite Alcanzado!',
    description:
      t('upsell.limitDescription') ||
      'Has usado tus 10 mensajes gratuitos. Suscríbete para acceso ilimitado.',
    buttonText: t('upsell.subscribe') || 'Suscribirse',
  };
}

function ModalContent({
  content,
  locale,
  onClose,
  tCommon,
}: {
  content: { title: string; description: string; buttonText: string };
  locale: 'es' | 'en';
  onClose: () => void;
  tCommon: (key: string) => string;
}): JSX.Element {
  const handleUpgradeClick = (): void => {
    window.location.href = `/${locale}/pricing`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="mx-4 max-w-md rounded-lg bg-white p-6 shadow-xl dark:bg-gray-800">
        <h3 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
          {content.title}
        </h3>
        <p className="mb-6 text-gray-600 dark:text-gray-300">{content.description}</p>
        <div className="flex gap-3">
          <Button variant="secondary" onClick={onClose} className="flex-1">
            {tCommon('cancel') || 'Cancelar'}
          </Button>
          <Button variant="default" onClick={handleUpgradeClick} className="flex-1">
            {content.buttonText}
          </Button>
        </div>
      </div>
    </div>
  );
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

  const content = UpsellContent({ isGuest, t });

  return <ModalContent content={content} locale={locale} onClose={onClose} tCommon={tCommon} />;
}
