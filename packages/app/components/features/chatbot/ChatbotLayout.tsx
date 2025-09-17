'use client';

import { useCallback, useEffect, useState } from 'react';

import type { IChatConversation, IChatMessage, IUser } from '@brujula-cripto/types';
import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/Button';
import {
  createChatConversation,
  deleteChatConversation,
  getChatConversations,
  sendChatMessage,
  updateChatConversation,
} from '@/lib/api';

import { ChatbotUI } from './ChatbotUI';
import ConversationList from './ConversationList';

// SVG Icons inline para evitar dependencias externas
const MenuIcon = ({ className = 'w-5 h-5' }: { className?: string }): JSX.Element => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M4 6h16M4 12h16M4 18h16"
    />
  </svg>
);

const CloseIcon = ({ className = 'w-5 h-5' }: { className?: string }): JSX.Element => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const UserIcon = ({ className = 'w-4 h-4' }: { className?: string }): JSX.Element => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
    />
  </svg>
);

const CrownIcon = ({ className = 'w-4 h-4' }: { className?: string }): JSX.Element => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M3 17l3-10 4 4 4-4 3 10H3zm2-2h14l-2-6-3 3-4-4-3 3-2 6z" />
  </svg>
);

const ShieldIcon = ({ className = 'w-4 h-4' }: { className?: string }): JSX.Element => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M12,1L3,5V11C3,16.55 6.84,21.74 12,23C17.16,21.74 21,16.55 21,11V5L12,1M12,7C13.4,7 14.8,8.6 14.8,10V11H16V18H8V11H9.2V10C9.2,8.6 10.6,7 12,7M12,8.2C11.2,8.2 10.4,8.7 10.4,10V11H13.6V10C13.6,8.7 12.8,8.2 12,8.2Z" />
  </svg>
);

interface ChatbotLayoutProps {
  locale: 'es' | 'en';
  user?: IUser | null;
  className?: string;
}

export function ChatbotLayout({ locale, user, className = '' }: ChatbotLayoutProps): JSX.Element {
  const t = useTranslations('chatbot');
  const tCommon = useTranslations('common');
  const tCredits = useTranslations('chatbot.credits');

  // Estados del layout
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [currentMessages, setCurrentMessages] = useState<IChatMessage[]>([]);
  const [showUpsellModal, setShowUpsellModal] = useState(false);
  const [messageCount, setMessageCount] = useState(0);
  const [conversationsData, setConversationsData] = useState<IChatConversation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Determinar estado de usuario
  const isGuest = !user;
  const isAdmin = Boolean(user?.isAdmin);
  const isPremium = Boolean(user?.isPremium);
  const isRegistered = !!user && !isPremium && !isAdmin;

  // Límites de mensajes y créditos
  const MESSAGE_LIMIT = 10;
  const canSendMessage = isAdmin || isPremium || (isRegistered && messageCount < MESSAGE_LIMIT);

  // Convertir créditos de segundos a formato H:M:S
  const formatCredits = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const userCredits = Number(user?.usageCreditsInSeconds) || 0;
  const formattedCredits = formatCredits(userCredits);

  // Badge de usuario con información avanzada
  const getUserBadge = (): { text: string; icon: JSX.Element; color: string; credits: string } => {
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
  };

  const userBadge = getUserBadge();

  // Cargar conversaciones al montar el componente
  useEffect(() => {
    if (user) {
      void loadConversations();
    }
  }, [user]);

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
  }, [activeConversationId, conversationsData]);

  const loadConversations = useCallback(async () => {
    if (!user) {
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const response = await getChatConversations();
      if (response.success && response.data) {
        setConversationsData(response.data);
      } else {
        setError(response.error || 'Error cargando conversaciones');
      }
    } catch (err) {
      setError('Error de conexión');
      console.error('Error loading conversations:', err);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  // Handlers
  const handleSendMessage = useCallback(
    async (message: string) => {
      if (!canSendMessage) {
        setShowUpsellModal(true);
        return;
      }

      if (!user) {
        return;
      }

      if (isRegistered) {
        setMessageCount((prev) => prev + 1);
      }

      try {
        // Si no hay conversación activa, crear una nueva
        let targetConversationId = activeConversationId;

        if (!targetConversationId) {
          const newConversation: Omit<IChatConversation, 'id' | 'createdAt' | 'updatedAt'> = {
            userId: user.uid,
            title: message.substring(0, 50) + (message.length > 50 ? '...' : ''),
            messages: [],
            status: 'active',
            isFavorite: false,
          };

          const createResponse = await createChatConversation(newConversation);
          if (createResponse.success && createResponse.data) {
            targetConversationId = createResponse.data.id;
            setActiveConversationId(targetConversationId);
            setConversationsData((prev) => [createResponse.data as IChatConversation, ...prev]);
          } else {
            setError('Error creando conversación');
            return;
          }
        }

        // Crear mensaje del usuario
        const userMessage: IChatMessage = {
          id: `msg_${Date.now()}_user`,
          content: message,
          role: 'user',
          timestamp: new Date(),
        };

        // Añadir mensaje del usuario inmediatamente a la UI
        setCurrentMessages((prev) => [...prev, userMessage]);

        // Enviar mensaje a la API
        const messageToSend: Omit<IChatMessage, 'id' | 'timestamp'> = {
          content: message,
          role: 'user',
        };

        const messageResponse = await sendChatMessage(targetConversationId, messageToSend);

        if (messageResponse.success && messageResponse.data) {
          // La respuesta contiene el mensaje del asistente
          setCurrentMessages((prev) => [...prev, messageResponse.data as IChatMessage]);

          // Actualizar la conversación en la lista
          setConversationsData((prev) =>
            prev.map((conv) =>
              conv.id === targetConversationId
                ? {
                    ...conv,
                    messages: [...conv.messages, userMessage, messageResponse.data as IChatMessage],
                  }
                : conv,
            ),
          );
        } else {
          setError(messageResponse.error || 'Error enviando mensaje');
        }
      } catch (error) {
        setError('Error de conexión');
        console.error('Error sending message:', error);
      }
    },
    [canSendMessage, user, isRegistered, activeConversationId, conversationsData],
  );

  const handleSelectConversation = (conversationId: string): void => {
    setActiveConversationId(conversationId);
    setIsSidebarOpen(false);
  };

  const handleDeleteConversation = useCallback(
    async (conversationId: string) => {
      try {
        const response = await deleteChatConversation(conversationId);
        if (response.success) {
          setConversationsData((prev) => prev.filter((conv) => conv.id !== conversationId));
          if (activeConversationId === conversationId) {
            setActiveConversationId(null);
            setCurrentMessages([]);
          }
        } else {
          setError(response.error || 'Error eliminando conversación');
        }
      } catch (err) {
        setError('Error de conexión');
        console.error('Error deleting conversation:', err);
      }
    },
    [activeConversationId],
  );

  const handleNewConversation = useCallback(async () => {
    if (!user) {
      return;
    }

    try {
      const newConversation: Omit<IChatConversation, 'id' | 'createdAt' | 'updatedAt'> = {
        userId: user.uid,
        title: `Nueva conversación ${conversationsData.length + 1}`,
        messages: [],
        status: 'active',
        isFavorite: false,
      };

      const response = await createChatConversation(newConversation);
      if (response.success && response.data) {
        setConversationsData((prev) => [response.data as IChatConversation, ...prev]);
        setActiveConversationId(response.data.id);
        setCurrentMessages([]);
        setIsSidebarOpen(false);
      } else {
        setError(response.error || 'Error creando conversación');
      }
    } catch (err) {
      setError('Error de conexión');
      console.error('Error creating conversation:', err);
    }
  }, [user, conversationsData.length]);

  const handleToggleFavorite = useCallback(
    async (conversationId: string) => {
      const conversation = conversationsData.find((conv) => conv.id === conversationId);
      if (!conversation) {
        return;
      }

      try {
        const updatedConversation = {
          ...conversation,
          isFavorite: !conversation.isFavorite,
        };

        const response = await updateChatConversation(conversationId, updatedConversation);
        if (response.success) {
          setConversationsData((prev) =>
            prev.map((conv) =>
              conv.id === conversationId ? { ...conv, isFavorite: !conv.isFavorite } : conv,
            ),
          );
        } else {
          setError(response.error || 'Error actualizando conversación');
        }
      } catch (err) {
        setError('Error de conexión');
        console.error('Error toggling favorite:', err);
      }
    },
    [conversationsData],
  );

  const handleRenameConversation = useCallback(
    async (conversationId: string, newTitle: string) => {
      const conversation = conversationsData.find((conv) => conv.id === conversationId);
      if (!conversation) {
        return;
      }

      try {
        const updatedConversation = {
          ...conversation,
          title: newTitle,
        };

        const response = await updateChatConversation(conversationId, updatedConversation);
        if (response.success) {
          setConversationsData((prev) =>
            prev.map((conv) => (conv.id === conversationId ? { ...conv, title: newTitle } : conv)),
          );
        } else {
          setError(response.error || 'Error renombrando conversación');
        }
      } catch (err) {
        setError('Error de conexión');
        console.error('Error renaming conversation:', err);
      }
    },
    [conversationsData],
  );

  // Modal de Upselling
  const UpsellModal = (): JSX.Element | null => {
    if (!showUpsellModal) {
      return null;
    }

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
        <div className="mx-4 max-w-md rounded-lg bg-white p-6 shadow-xl dark:bg-gray-800">
          <h3 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
            {isGuest
              ? t('upsell.guestTitle') || '¡Únete a Brújula Cripto!'
              : t('upsell.limitTitle') || '¡Límite Alcanzado!'}
          </h3>
          <p className="mb-6 text-gray-600 dark:text-gray-300">
            {isGuest
              ? t('upsell.guestDescription') ||
                'Regístrate gratis y obtén 10 mensajes para probar nuestro chatbot especializado.'
              : t('upsell.limitDescription') ||
                'Has usado tus 10 mensajes gratuitos. Suscríbete para acceso ilimitado.'}
          </p>
          <div className="flex gap-3">
            <Button
              variant="secondary"
              onClick={() => setShowUpsellModal(false)}
              className="flex-1"
            >
              {tCommon('cancel') || 'Cancelar'}
            </Button>
            <Button
              variant="default"
              onClick={() => {
                window.location.href = `/${locale}/pricing`;
              }}
              className="flex-1"
            >
              {isGuest
                ? t('upsell.register') || 'Registrarse'
                : t('upsell.subscribe') || 'Suscribirse'}
            </Button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={`flex h-screen bg-gray-50 dark:bg-gray-900 ${className}`}>
      {/* Sidebar Overlay (móvil) */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              setIsSidebarOpen(false);
            }
          }}
          role="button"
          tabIndex={0}
          aria-label="Cerrar sidebar"
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-80 transform bg-white shadow-lg transition-transform duration-300 ease-in-out dark:bg-gray-800 lg:relative lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'} `}
      >
        {/* Sidebar Header */}
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
              onClick={() => setIsSidebarOpen(false)}
              className="lg:hidden"
            >
              <CloseIcon />
            </Button>
          </div>
        </div>

        {/* Conversation List */}
        <div className="flex-1 overflow-y-auto">
          {error && <div className="p-4 text-sm text-red-600 dark:text-red-400">{error}</div>}
          {isLoading ? (
            <div className="p-4 text-sm text-gray-500 dark:text-gray-400">
              Cargando conversaciones...
            </div>
          ) : (
            <ConversationList
              conversations={conversationsData}
              activeConversationId={activeConversationId || undefined}
              onSelectConversation={handleSelectConversation}
              onDeleteConversation={(id) => void handleDeleteConversation(id)}
              onNewConversation={() => void handleNewConversation()}
              onToggleFavorite={(id) => void handleToggleFavorite(id)}
              onRenameConversation={(id, name) => void handleRenameConversation(id, name)}
            />
          )}
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
      <UpsellModal />
    </div>
  );
}
