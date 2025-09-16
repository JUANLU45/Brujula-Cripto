'use client';

import { useState } from 'react';

import { type IChatConversation } from '@brujula-cripto/types';
import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

// SVG Inline Icons (NO @heroicons)
const TrashIcon = ({ className = 'w-4 h-4' }: { className?: string }): JSX.Element => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
    />
  </svg>
);

const MessageIcon = ({ className = 'w-4 h-4' }: { className?: string }): JSX.Element => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-3.582 8-8 8a8.959 8.959 0 01-4.906-1.435l-3.824 1.279a.75.75 0 01-.942-.942l1.279-3.824A8.959 8.959 0 013 12c0-4.418 3.582-8 8-8s8 3.582 8 8z"
    />
  </svg>
);

const PlusIcon = ({ className = 'w-4 h-4' }: { className?: string }): JSX.Element => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
  </svg>
);

const ClockIcon = ({ className = 'w-4 h-4' }: { className?: string }): JSX.Element => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

const StarIcon = ({
  className = 'w-4 h-4',
  filled = false,
}: {
  className?: string;
  filled?: boolean;
}): JSX.Element => (
  <svg
    className={className}
    fill={filled ? 'currentColor' : 'none'}
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.196-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
    />
  </svg>
);

const EditIcon = ({ className = 'w-4 h-4' }: { className?: string }): JSX.Element => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
    />
  </svg>
);

// Ahora IChatConversation ya incluye isFavorite y tags desde @brujula-cripto/types
// Ya no necesitamos interfaz extendida - usamos directamente IChatConversation

interface ConversationListProps {
  conversations: IChatConversation[];
  activeConversationId?: string;
  onSelectConversation: (conversationId: string) => void;
  onDeleteConversation: (conversationId: string) => void;
  onNewConversation: () => void;
  onToggleFavorite?: (conversationId: string) => void;
  onRenameConversation?: (conversationId: string, newTitle: string) => void;
  className?: string;
}

export default function ConversationList({
  conversations,
  activeConversationId,
  onSelectConversation,
  onDeleteConversation,
  onNewConversation,
  onToggleFavorite,
  onRenameConversation,
  className = '',
}: ConversationListProps): JSX.Element {
  const t = useTranslations('chatbot.conversation');
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) {
      return t('now');
    }
    if (diffInMinutes < 60) {
      return `${diffInMinutes}m`;
    }
    if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)}h`;
    }
    if (diffInMinutes < 10080) {
      return `${Math.floor(diffInMinutes / 1440)}d`;
    }

    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'short',
    });
  };

  const getConversationPreview = (conversation: IChatConversation): string => {
    const lastMessage = conversation.messages[conversation.messages.length - 1];
    if (!lastMessage) {
      return '';
    }

    // Truncar contenido largo
    const content = lastMessage.content.replace(/[*#`]/g, '').trim();
    return content.length > 60 ? `${content.substring(0, 60)}...` : content;
  };

  const handleDelete = (conversationId: string): void => {
    if (deleteConfirm === conversationId) {
      onDeleteConversation(conversationId);
      setDeleteConfirm(null);
    } else {
      setDeleteConfirm(conversationId);
      // Auto-cancelar confirmación después de 3 segundos
      setTimeout(() => setDeleteConfirm(null), 3000);
    }
  };

  const handleStartEdit = (conversation: IChatConversation): void => {
    setEditingId(conversation.id);
    setEditTitle(
      conversation.title || `${t('conversationDefault')} ${conversation.id.slice(0, 8)}`,
    );
  };

  const handleSaveEdit = (): void => {
    if (editingId && editTitle.trim() && onRenameConversation) {
      onRenameConversation(editingId, editTitle.trim());
    }
    setEditingId(null);
    setEditTitle('');
  };

  const handleCancelEdit = (): void => {
    setEditingId(null);
    setEditTitle('');
  };

  // Separar favoritas y normales
  const favoriteConversations = conversations.filter((c) => c.isFavorite);
  const normalConversations = conversations.filter((c) => !c.isFavorite);

  return (
    <div className={`flex h-full flex-col ${className}`}>
      {/* Header con botón Nueva Conversación */}
      <div className="border-b border-gray-200 p-4 dark:border-gray-700">
        <Button
          onClick={onNewConversation}
          className="flex w-full items-center justify-center gap-2 bg-blue-600 text-white hover:bg-blue-700"
        >
          <PlusIcon className="h-4 w-4" />
          {t('new')}
        </Button>
      </div>

      {/* Lista de Conversaciones */}
      <div className="flex-1 overflow-y-auto">
        {conversations.length === 0 ? (
          // Estado vacío
          <div className="flex h-full flex-col items-center justify-center p-8 text-center">
            <MessageIcon className="mb-4 h-12 w-12 text-gray-400 dark:text-gray-600" />
            <p className="text-sm text-gray-500 dark:text-gray-400">{t('empty')}</p>
          </div>
        ) : (
          <div className="space-y-4 p-2">
            {/* Conversaciones Favoritas */}
            {favoriteConversations.length > 0 && (
              <div>
                <h4 className="mb-2 px-2 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                  ⭐ {t('favorites')}
                </h4>
                <div className="space-y-2">
                  {favoriteConversations.map((conversation) => (
                    <ConversationCard
                      key={conversation.id}
                      conversation={conversation}
                      isActive={activeConversationId === conversation.id}
                      isEditing={editingId === conversation.id}
                      editTitle={editTitle}
                      deleteConfirm={deleteConfirm}
                      onSelect={onSelectConversation}
                      onDelete={handleDelete}
                      onToggleFavorite={onToggleFavorite}
                      onStartEdit={handleStartEdit}
                      onSaveEdit={handleSaveEdit}
                      onCancelEdit={handleCancelEdit}
                      onEditTitleChange={setEditTitle}
                      formatDate={formatDate}
                      getConversationPreview={getConversationPreview}
                      t={t}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Conversaciones Normales */}
            {normalConversations.length > 0 && (
              <div>
                {favoriteConversations.length > 0 && (
                  <h4 className="mb-2 px-2 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                    💬 {t('recent')}
                  </h4>
                )}
                <div className="space-y-2">
                  {normalConversations.map((conversation) => (
                    <ConversationCard
                      key={conversation.id}
                      conversation={conversation}
                      isActive={activeConversationId === conversation.id}
                      isEditing={editingId === conversation.id}
                      editTitle={editTitle}
                      deleteConfirm={deleteConfirm}
                      onSelect={onSelectConversation}
                      onDelete={handleDelete}
                      onToggleFavorite={onToggleFavorite}
                      onStartEdit={handleStartEdit}
                      onSaveEdit={handleSaveEdit}
                      onCancelEdit={handleCancelEdit}
                      onEditTitleChange={setEditTitle}
                      formatDate={formatDate}
                      getConversationPreview={getConversationPreview}
                      t={t}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer con información */}
      <div className="border-t border-gray-200 p-4 dark:border-gray-700">
        <p className="text-center text-xs text-gray-500 dark:text-gray-400">
          {t('history')} • {conversations.length} {t('conversations')}
          {favoriteConversations.length > 0 &&
            ` • ${favoriteConversations.length} ${t('favoriteCount')}`}
        </p>
      </div>
    </div>
  );
}

// Componente ConversationCard extraído para mejor legibilidad
interface ConversationCardProps {
  conversation: IChatConversation;
  isActive: boolean;
  isEditing: boolean;
  editTitle: string;
  deleteConfirm: string | null;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  onToggleFavorite?: (id: string) => void;
  onStartEdit: (conversation: IChatConversation) => void;
  onSaveEdit: () => void;
  onCancelEdit: () => void;
  onEditTitleChange: (title: string) => void;
  formatDate: (date: string) => string;
  getConversationPreview: (conversation: IChatConversation) => string;
  t: any;
}

function ConversationCard({
  conversation,
  isActive,
  isEditing,
  editTitle,
  deleteConfirm,
  onSelect,
  onDelete,
  onToggleFavorite,
  onStartEdit,
  onSaveEdit,
  onCancelEdit,
  onEditTitleChange,
  formatDate,
  getConversationPreview,
  t,
}: ConversationCardProps): JSX.Element {
  return (
    <Card
      className={`cursor-pointer p-3 transition-all duration-200 hover:shadow-md ${
        isActive
          ? 'border-blue-200 bg-blue-50 dark:border-blue-700 dark:bg-blue-900/20'
          : 'hover:bg-gray-50 dark:hover:bg-gray-800'
      }`}
      onClick={() => !isEditing && onSelect(conversation.id)}
    >
      {/* Header con título/input y fecha */}
      <div className="mb-2 flex items-start justify-between">
        {isEditing ? (
          <div className="flex flex-1 gap-2">
            <input
              type="text"
              value={editTitle}
              onChange={(e) => onEditTitleChange(e.target.value)}
              className="flex-1 rounded border border-gray-300 bg-white px-2 py-1 text-sm dark:border-gray-600 dark:bg-gray-800"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  onSaveEdit();
                }
                if (e.key === 'Escape') {
                  onCancelEdit();
                }
              }}
              placeholder={t('renamePlaceholder')}
              title={t('renameTooltip')}
              autoFocus
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
        ) : (
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
        )}
      </div>

      {/* Preview del último mensaje */}
      {!isEditing && (
        <p className="mb-3 line-clamp-2 text-xs text-gray-600 dark:text-gray-300">
          {getConversationPreview(conversation)}
        </p>
      )}

      {/* Footer con stats y acciones */}
      {!isEditing && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
            <span className="flex items-center gap-1">
              <MessageIcon className="h-3 w-3" />
              {conversation.messages.length}
            </span>
            {conversation.tags && conversation.tags.length > 0 && (
              <span className="rounded-full bg-gray-100 px-2 py-1 text-xs dark:bg-gray-700">
                {conversation.tags[0]}
              </span>
            )}
          </div>

          {/* Botones de acción */}
          <div className="flex items-center gap-1">
            {/* Favorito */}
            {onToggleFavorite && (
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-1 text-gray-400 hover:text-yellow-500"
                onClick={(e) => {
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
              onClick={(e) => {
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
              onClick={(e) => {
                e.stopPropagation();
                onDelete(conversation.id);
              }}
              title={deleteConfirm === conversation.id ? t('confirmDelete') : t('delete')}
            >
              <TrashIcon className="h-3 w-3" />
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
}
