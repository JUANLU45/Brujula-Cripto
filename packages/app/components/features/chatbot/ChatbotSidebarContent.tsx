'use client';

import type { IChatConversation } from '@brujula-cripto/types';
import ConversationList from './ConversationList';

interface ChatbotSidebarContentProps {
  error: string | null;
  isLoading: boolean;
  conversationsData: IChatConversation[];
  activeConversationId: string | null;
  onSelectConversation: (id: string) => void;
  onDeleteConversation: (id: string) => Promise<void>;
  onNewConversation: () => Promise<void>;
  onToggleFavorite: (id: string) => Promise<void>;
  onRenameConversation: (id: string, name: string) => Promise<void>;
}

export function ChatbotSidebarContent({
  error,
  isLoading,
  conversationsData,
  activeConversationId,
  onSelectConversation,
  onDeleteConversation,
  onNewConversation,
  onToggleFavorite,
  onRenameConversation,
}: ChatbotSidebarContentProps): JSX.Element {
  if (error) {
    return <div className="p-4 text-sm text-red-600 dark:text-red-400">{error}</div>;
  }

  if (isLoading) {
    return (
      <div className="p-4 text-sm text-gray-500 dark:text-gray-400">Cargando conversaciones...</div>
    );
  }

  return (
    <ConversationList
      conversations={conversationsData}
      activeConversationId={activeConversationId || undefined}
      onSelectConversation={onSelectConversation}
      onDeleteConversation={(id) => void onDeleteConversation(id)}
      onNewConversation={() => void onNewConversation()}
      onToggleFavorite={(id) => void onToggleFavorite(id)}
      onRenameConversation={(id, name) => void onRenameConversation(id, name)}
    />
  );
}
