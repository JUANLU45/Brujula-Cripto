'use client';

import { useTranslations } from 'next-intl';

interface UseChatTranslationsReturn {
  t: (key: string) => string;
  tCommon: (key: string) => string;
  tMic: (key: string) => string;
  formatTimestamp: (timestamp: Date, locale: 'es' | 'en') => string;
  suggestedQuestions: string[];
}

export function useChatTranslations(): UseChatTranslationsReturn {
  const t = useTranslations('chatbot');
  const tCommon = useTranslations('common');
  const tMic = useTranslations('chatbot.microphone');

  const formatTimestamp = (timestamp: Date, locale: 'es' | 'en'): string => {
    return new Intl.DateTimeFormat(locale, {
      hour: '2-digit',
      minute: '2-digit',
    }).format(timestamp);
  };

  const suggestedQuestions = [
    t('suggested.questions.0') || '¿Cómo funciona el análisis técnico en criptomonedas?',
    t('suggested.questions.1') || '¿Cuáles son las mejores prácticas de seguridad?',
    t('suggested.questions.2') || '¿Qué es DeFi y cómo empezar?',
    t('suggested.questions.3') || '¿Cómo interpretar gráficos de trading?',
  ];

  return {
    t,
    tCommon,
    tMic,
    formatTimestamp,
    suggestedQuestions,
  };
}
