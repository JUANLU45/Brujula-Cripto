'use client';

import { Button } from '@/components/ui/Button';
import type { IChatConversation, IUser } from '@brujula-cripto/types';
import { useCallback, useEffect, useState } from 'react';
import { MenuIcon } from './ChatbotIcons';
import { ChatbotSidebarContent } from './ChatbotSidebarContent';
import { ChatbotSidebarHeader } from './ChatbotSidebarHeader';
import { ChatbotUI } from './ChatbotUI';
import { ChatbotUpsellModal } from './ChatbotUpsellModal';
import { ChatbotUserBadge } from './ChatbotUserBadge';
import { useChatConversations } from './hooks/useChatConversations';
import { useChatMessaging } from './hooks/useChatMessaging';
import { useChatUserState } from './hooks/useChatUserState';

interface ChatbotLayoutProps {
  locale: 'es' | 'en';
  user?: IUser | null;
  className?: string;
}

export function ChatbotLayout({ locale, user, className = '' }: ChatbotLayoutProps): JSX.Element {
  // Estados del layout
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [showUpsellModal, setShowUpsellModal] = useState(false);
  const [messageCount, setMessageCount] = useState(0);

  // Hooks personalizados
  const { isGuest, isAdmin, isPremium, isRegistered, MESSAGE_LIMIT, userCredits, formatCredits } =
    useChatUserState(user);

  const {
    conversationsData,
    setConversationsData,
    isLoading,
    error,
    setError,
    loadConversations,
    createConversation,
    deleteConversation,
    updateConversation,
  } = useChatConversations(user?.uid);

  const canSendMessage = isAdmin || isPremium || (isRegistered && messageCount < MESSAGE_LIMIT);

  const { currentMessages, setCurrentMessages, handleSendMessage } = useChatMessaging({
    user,
    isRegistered,
    canSendMessage,
    activeConversationId,
    setActiveConversationId,
    setMessageCount,
    setShowUpsellModal,
    createConversation,
    setConversationsData,
    setError,
  });

  const formattedCredits = formatCredits(userCredits);
  const userBadge = ChatbotUserBadge({
    user,
    isAdmin,
    isPremium,
    isRegistered,
    formattedCredits,
  });

  // Cargar conversaciones al montar el componente
  useEffect(() => {
    if (user) {
      void loadConversations();
    }
  }, [user, loadConversations]);

  // Sincronizar mensajes cuando cambia la conversación activa
  useEffect(() => {
    if (activeConversationId) {
      const conversation = conversationsData.find((conv) => conv.id === activeConversationId);
      if (conversation) {
        setCurrentMessages(conversation.messages);
      }
    } else {
      setCurrentMessages([]);
    }
  }, [activeConversationId, conversationsData, setCurrentMessages]);

  // Handlers simplificados
  const handleSelectConversation = (conversationId: string): void => {
    setActiveConversationId(conversationId);
    setIsSidebarOpen(false);
  };

  const handleDeleteConversation = useCallback(
    async (conversationId: string) => {
      const success = await deleteConversation(conversationId);
      if (success && activeConversationId === conversationId) {
        setActiveConversationId(null);
        setCurrentMessages([]);
      }
    },
    [deleteConversation, activeConversationId, setCurrentMessages],
  );

  const handleNewConversation = useCallback(async () => {
    if (!user) {
      return;
    }

    const newConversation: Omit<IChatConversation, 'id' | 'createdAt' | 'updatedAt'> = {
      userId: user.uid,
      title: `Nueva conversación ${conversationsData.length + 1}`,
      messages: [],
      status: 'active',
      isFavorite: false,
    };

    const created = await createConversation(newConversation);
    if (created) {
      setActiveConversationId(created.id);
      setCurrentMessages([]);
      setIsSidebarOpen(false);
    }
  }, [user, conversationsData.length, createConversation, setCurrentMessages]);

  const handleToggleFavorite = useCallback(
    async (conversationId: string) => {
      const conversation = conversationsData.find((conv) => conv.id === conversationId);
      if (conversation) {
        await updateConversation(conversationId, { isFavorite: !conversation.isFavorite });
      }
    },
    [conversationsData, updateConversation],
  );

  const handleRenameConversation = useCallback(
    async (conversationId: string, newTitle: string) => {
      await updateConversation(conversationId, { title: newTitle });
    },
    [updateConversation],
  );

  const handleSidebarOverlayClick = (): void => {
    setIsSidebarOpen(false);
  };

  const handleSidebarOverlayKeyDown = (e: React.KeyboardEvent): void => {
    if (e.key === 'Enter' || e.key === ' ') {
      setIsSidebarOpen(false);
    }
  };

  return (
    <div className={`flex h-screen bg-gray-50 dark:bg-gray-900 ${className}`}>
      {/* Sidebar Overlay (móvil) */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={handleSidebarOverlayClick}
          onKeyDown={handleSidebarOverlayKeyDown}
          role="button"
          tabIndex={0}
          aria-label="Cerrar sidebar"
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-80 transform bg-white shadow-lg transition-transform duration-300 ease-in-out dark:bg-gray-800 lg:relative lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'} `}
      >
        <ChatbotSidebarHeader
          user={user}
          userBadge={userBadge}
          isPremium={isPremium}
          isRegistered={isRegistered}
          messageCount={messageCount}
          MESSAGE_LIMIT={MESSAGE_LIMIT}
          onCloseSidebar={() => setIsSidebarOpen(false)}
        />

        <div className="flex-1 overflow-y-auto">
          <ChatbotSidebarContent
            error={error}
            isLoading={isLoading}
            conversationsData={conversationsData}
            activeConversationId={activeConversationId}
            onSelectConversation={handleSelectConversation}
            onDeleteConversation={handleDeleteConversation}
            onNewConversation={handleNewConversation}
            onToggleFavorite={handleToggleFavorite}
            onRenameConversation={handleRenameConversation}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 flex-col lg:ml-0">
        {/* Header (móvil) */}
        <div className="border-b border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800 lg:hidden">
          <Button variant="ghost" size="sm" onClick={() => setIsSidebarOpen(true)}>
            <MenuIcon />
          </Button>
        </div>

        {/* Chat Interface */}
        <div className="flex-1">
          <ChatbotUI
            locale={locale}
            conversations={
              activeConversationId
                ? [
                    {
                      ...(conversationsData.find(
                        (conv) => conv.id === activeConversationId,
                      ) as IChatConversation),
                      messages: currentMessages,
                    },
                  ].filter(Boolean)
                : []
            }
            isSubscribed={isPremium || isAdmin}
            onSendMessage={handleSendMessage}
            className="h-full"
          />
        </div>
      </div>

      {/* Modal de Upselling */}
      <ChatbotUpsellModal
        showUpsellModal={showUpsellModal}
        isGuest={isGuest}
        locale={locale}
        onClose={() => setShowUpsellModal(false)}
      />
    </div>
  );
}
