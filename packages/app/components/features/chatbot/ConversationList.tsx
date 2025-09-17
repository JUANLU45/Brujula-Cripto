'use client';

import { useState } from 'react';

import { type IChatConversation } from '@brujula-cripto/types';
import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

import { ConversationCardActions } from './ConversationCardActions';
import { ConversationCardHeader } from './ConversationCardHeader';
import { ConversationCardStats } from './ConversationCardStats';
import { MessageIcon, PlusIcon } from './ConversationListIcons';

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
                  <span role="img" aria-label="favorito">
                    ⭐
                  </span>{' '}
                  {t('favorites')}
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
                    <span role="img" aria-label="conversación">
                      💬
                    </span>{' '}
                    {t('recent')}
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

// Componente ConversationCard simplificado usando componentes auxiliares
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
  t: ReturnType<typeof useTranslations>;
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
        <ConversationCardHeader
          conversation={conversation}
          isEditing={isEditing}
          editTitle={editTitle}
          onEditTitleChange={onEditTitleChange}
          onSaveEdit={onSaveEdit}
          onCancelEdit={onCancelEdit}
          formatDate={formatDate}
          t={t}
        />
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
          <ConversationCardStats conversation={conversation} />
          <ConversationCardActions
            conversation={conversation}
            deleteConfirm={deleteConfirm}
            onToggleFavorite={onToggleFavorite}
            onStartEdit={onStartEdit}
            onDelete={onDelete}
            t={t}
          />
        </div>
      )}
    </Card>
  );
}
