'use client';

import { useMemo } from 'react';

import type { IUser } from '@brujula-cripto/types';

interface UseChatUserStateReturn {
  isGuest: boolean;
  isAdmin: boolean;
  isPremium: boolean;
  isRegistered: boolean;
  MESSAGE_LIMIT: number;
  canSendMessage: boolean;
  userCredits: number;
  formatCredits: (seconds: number) => string;
}

export function useChatUserState(user?: IUser | null): UseChatUserStateReturn {
  const userState = useMemo(() => {
    const isGuest = !user;
    const isAdmin = Boolean(user?.isAdmin);
    const isPremium = Boolean(user?.isPremium);
    const isRegistered = !!user && !isPremium && !isAdmin;

    const MESSAGE_LIMIT = 10;
    const canSendMessage = isAdmin || isPremium;

    const userCredits = Number(user?.usageCreditsInSeconds) || 0;

    return {
      isGuest,
      isAdmin,
      isPremium,
      isRegistered,
      MESSAGE_LIMIT,
      canSendMessage,
      userCredits,
    };
  }, [user]);

  const formatCredits = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return {
    ...userState,
    formatCredits,
  };
}
