'use client';

import type { IUser } from '@brujula-cripto/types';
import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/Button';

import { CloseIcon } from './ChatbotIcons';

interface ChatbotSidebarHeaderProps {
  user?: IUser | null;
  userBadge: {
    text: string;
    icon: JSX.Element;
    color: string;
    credits: string;
  };
  isPremium: boolean;
  isRegistered: boolean;
  messageCount: number;
  MESSAGE_LIMIT: number;
  onCloseSidebar: () => void;
}

export function ChatbotSidebarHeader({
  user,
  userBadge,
  isPremium,
  isRegistered,
  messageCount,
  MESSAGE_LIMIT,
  onCloseSidebar,
}: ChatbotSidebarHeaderProps): JSX.Element {
  const t = useTranslations('chatbot');
  const tCredits = useTranslations('chatbot.credits');

  return (
    <div className="border-b border-gray-200 p-4 dark:border-gray-700">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            {t('conversations.title') || 'Conversaciones'}
          </h2>
          {user && (
            <div className="mt-2 space-y-2">
              <div className="flex items-center gap-2">
                <span
                  className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium text-white ${userBadge.color}`}
                >
                  {userBadge.icon}
                  {userBadge.text}
                </span>
                {(isPremium || isRegistered) && (
                  <span className="text-xs text-blue-600 dark:text-blue-400">
                    {userBadge.credits}
                  </span>
                )}
              </div>
              {isRegistered && (
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-500 dark:text-gray-400">
                    {messageCount}/{MESSAGE_LIMIT} {t('messages.count') || 'mensajes'}
                  </span>
                  <span className="text-blue-600 dark:text-blue-400">
                    {tCredits('available') || 'Créditos'}: {userBadge.credits}
                  </span>
                </div>
              )}
              {isPremium && (
                <div className="text-xs text-amber-600 dark:text-amber-400">
                  {tCredits('timeAvailable') || 'Tiempo disponible'}: {userBadge.credits}
                </div>
              )}
            </div>
          )}
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onCloseSidebar}
          className="transition-colors hover:bg-gray-100 dark:hover:bg-gray-700"
          aria-label="Cerrar panel de conversaciones"
        >
          <CloseIcon />
        </Button>
      </div>
    </div>
  );
}
