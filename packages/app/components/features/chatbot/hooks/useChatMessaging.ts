'use client';

import { useCallback, useState } from 'react';

import type { IChatConversation, IChatMessage, IUser } from '@brujula-cripto/types';

import { sendChatMessage } from '@/lib/api';

interface UseChatMessagingProps {
  user?: IUser | null;
  isRegistered: boolean;
  canSendMessage: boolean;
  activeConversationId: string | null;
  setActiveConversationId: (id: string | null) => void;
  setMessageCount: (fn: (prev: number) => number) => void;
  setShowUpsellModal: (show: boolean) => void;
  createConversation: (
    conversation: Omit<IChatConversation, 'id' | 'createdAt' | 'updatedAt'>,
  ) => Promise<IChatConversation | null>;
  setConversationsData: (fn: (prev: IChatConversation[]) => IChatConversation[]) => void;
  setError: (error: string | null) => void;
}

export function useChatMessaging({
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
}: UseChatMessagingProps) {
  const [currentMessages, setCurrentMessages] = useState<IChatMessage[]>([]);

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
        let targetConversationId = activeConversationId;

        // Crear nueva conversación si no existe
        if (!targetConversationId) {
          const newConversation: Omit<IChatConversation, 'id' | 'createdAt' | 'updatedAt'> = {
            userId: user.uid,
            title: message.substring(0, 50) + (message.length > 50 ? '...' : ''),
            messages: [],
            status: 'active',
            isFavorite: false,
          };

          const createdConversation = await createConversation(newConversation);
          if (createdConversation) {
            targetConversationId = createdConversation.id;
            setActiveConversationId(targetConversationId);
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

        // Añadir mensaje del usuario inmediatamente
        setCurrentMessages((prev) => [...prev, userMessage]);

        // Enviar mensaje a la API
        const messageToSend: Omit<IChatMessage, 'id' | 'timestamp'> = {
          content: message,
          role: 'user',
        };

        const messageResponse = await sendChatMessage(targetConversationId, messageToSend);

        if (messageResponse.success && messageResponse.data) {
          // Añadir respuesta del asistente
          setCurrentMessages((prev) => [...prev, messageResponse.data as IChatMessage]);

          // Actualizar conversación en la lista
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
    [
      canSendMessage,
      user,
      isRegistered,
      activeConversationId,
      setActiveConversationId,
      setMessageCount,
      setShowUpsellModal,
      createConversation,
      setConversationsData,
      setError,
    ],
  );

  return {
    currentMessages,
    setCurrentMessages,
    handleSendMessage,
  };
}
