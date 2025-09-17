'use client';

import type { IUser } from '@brujula-cripto/types';
import { useTranslations } from 'next-intl';
import { CrownIcon, ShieldIcon, UserIcon } from './ChatbotIcons';

interface UserBadgeInfo {
  text: string;
  icon: JSX.Element;
  color: string;
  credits: string;
}

interface ChatbotUserBadgeProps {
  user?: IUser | null;
  isAdmin: boolean;
  isPremium: boolean;
  isRegistered: boolean;
  formattedCredits: string;
}

export function ChatbotUserBadge({
  user,
  isAdmin,
  isPremium,
  isRegistered,
  formattedCredits,
}: ChatbotUserBadgeProps): UserBadgeInfo {
  const t = useTranslations('chatbot');
  const tCredits = useTranslations('chatbot.credits');

  if (isAdmin) {
    return {
      text: t('userLevel.admin') || 'Admin',
      icon: <ShieldIcon />,
      color: 'bg-red-600',
      credits: tCredits('unlimited') || 'Ilimitado',
    };
  }
  if (isPremium) {
    return {
      text: t('userLevel.premium') || 'Premium',
      icon: <CrownIcon />,
      color: 'bg-amber-600',
      credits: formattedCredits,
    };
  }
  if (isRegistered) {
    return {
      text: t('userLevel.free') || 'Free',
      icon: <UserIcon />,
      color: 'bg-gray-600',
      credits: formattedCredits,
    };
  }
  return {
    text: t('userLevel.guest') || 'Guest',
    icon: <UserIcon />,
    color: 'bg-gray-400',
    credits: tCredits('noAccess') || 'Sin acceso',
  };
}
