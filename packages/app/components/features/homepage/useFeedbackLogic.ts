'use client';

import { useState } from 'react';

import { useTranslations } from 'next-intl';

import { useAuth } from '@/lib/auth/AuthProvider';

interface UseFeedbackLogicReturn {
  // Estado
  isModalOpen: boolean;
  feedbackText: string;
  isSubmitting: boolean;
  submitStatus: 'idle' | 'success' | 'error';
  shouldShow: boolean;

  // Funciones
  handleFeedbackSubmit: () => Promise<void>;
  handleButtonClick: (customUrl?: string) => void;
  setIsModalOpen: (open: boolean) => void;
  setFeedbackText: (text: string) => void;

  // Traducciones
  t: ReturnType<typeof useTranslations>;
}

export function useFeedbackLogic(isEnabled: boolean = true): UseFeedbackLogicReturn {
  const t = useTranslations('homepage.feedback');
  const { user, userData } = useAuth();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [feedbackText, setFeedbackText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  // Solo mostrar para usuarios premium
  const shouldShow = Boolean(user && userData?.isPremium && isEnabled);

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

  const handleButtonClick = (customUrl?: string): void => {
    if (customUrl) {
      window.open(customUrl, '_blank');
    } else {
      setIsModalOpen(true);
    }
  };

  return {
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
  };
}
