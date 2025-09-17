'use client';

import type { IChatConversation } from '@brujula-cripto/types';
import type { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/Button';

import { ClockIcon, StarIcon } from './ConversationListIcons';

interface ConversationCardHeaderProps {
  conversation: IChatConversation;
  isEditing: boolean;
  editTitle: string;
  onEditTitleChange: (title: string) => void;
  onSaveEdit: () => void;
  onCancelEdit: () => void;
  formatDate: (date: string) => string;
  t: ReturnType<typeof useTranslations>;
}

export function ConversationCardHeader({
  conversation,
  isEditing,
  editTitle,
  onEditTitleChange,
  onSaveEdit,
  onCancelEdit,
  formatDate,
  t,
}: ConversationCardHeaderProps): JSX.Element {
  if (isEditing) {
    return (
      <div className="flex flex-1 gap-2">
        <input
          type="text"
          value={editTitle}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => onEditTitleChange(e.target.value)}
          className="flex-1 rounded border border-gray-300 bg-white px-2 py-1 text-sm dark:border-gray-600 dark:bg-gray-800"
          onKeyDown={(e: React.KeyboardEvent) => {
            if (e.key === 'Enter') {
              onSaveEdit();
            }
            if (e.key === 'Escape') {
              onCancelEdit();
            }
          }}
          placeholder={t('renamePlaceholder')}
          title={t('renameTooltip')}
        />
        <div className="flex gap-1">
          <Button
            size="sm"
            onClick={onSaveEdit}
            className="h-6 bg-green-600 p-1 text-white hover:bg-green-700"
          >
            ✓
          </Button>
          <Button
            size="sm"
            onClick={onCancelEdit}
            className="h-6 bg-gray-500 p-1 text-white hover:bg-gray-600"
          >
            ✕
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <h3 className="flex flex-1 items-center gap-2 truncate text-sm font-medium text-gray-900 dark:text-gray-100">
        {conversation.isFavorite && <StarIcon className="h-3 w-3 text-yellow-500" filled />}
        {conversation.title || `${t('conversationDefault')} ${conversation.id.slice(0, 8)}`}
      </h3>
      <div className="ml-2 flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
        <ClockIcon className="h-3 w-3" />
        {formatDate(conversation.updatedAt.toISOString())}
      </div>
    </>
  );
}
