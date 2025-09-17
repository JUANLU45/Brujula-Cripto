'use client';

import type { IChatConversation } from '@brujula-cripto/types';
import type { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/Button';

import { EditIcon, StarIcon, TrashIcon } from './ConversationListIcons';

interface ConversationCardActionsProps {
  conversation: IChatConversation;
  deleteConfirm: string | null;
  onToggleFavorite?: (id: string) => void;
  onStartEdit: (conversation: IChatConversation) => void;
  onDelete: (id: string) => void;
  t: ReturnType<typeof useTranslations>;
}

export function ConversationCardActions({
  conversation,
  deleteConfirm,
  onToggleFavorite,
  onStartEdit,
  onDelete,
  t,
}: ConversationCardActionsProps): JSX.Element {
  return (
    <div className="flex items-center gap-1">
      {/* Favorito */}
      {onToggleFavorite && (
        <Button
          variant="ghost"
          size="sm"
          className="h-6 w-6 p-1 text-gray-400 hover:text-yellow-500"
          onClick={(e: React.MouseEvent) => {
            e.stopPropagation();
            onToggleFavorite(conversation.id);
          }}
          title={conversation.isFavorite ? t('unfavoriteTooltip') : t('favoriteTooltip')}
        >
          <StarIcon className="h-3 w-3" filled={conversation.isFavorite} />
        </Button>
      )}

      {/* Editar */}
      <Button
        variant="ghost"
        size="sm"
        className="h-6 w-6 p-1 text-gray-400 hover:text-blue-500"
        onClick={(e: React.MouseEvent) => {
          e.stopPropagation();
          onStartEdit(conversation);
        }}
        title={t('renameTooltip')}
      >
        <EditIcon className="h-3 w-3" />
      </Button>

      {/* Eliminar */}
      <Button
        variant="ghost"
        size="sm"
        className={`h-6 w-6 p-1 ${
          deleteConfirm === conversation.id
            ? 'bg-red-100 text-red-600 hover:bg-red-200 dark:bg-red-900 dark:text-red-400'
            : 'text-gray-400 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/20'
        }`}
        onClick={(e: React.MouseEvent) => {
          e.stopPropagation();
          onDelete(conversation.id);
        }}
        title={deleteConfirm === conversation.id ? t('confirmDelete') : t('delete')}
      >
        <TrashIcon className="h-3 w-3" />
      </Button>
    </div>
  );
}
