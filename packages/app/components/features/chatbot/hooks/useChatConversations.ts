'use client';

import {
  createChatConversation,
  deleteChatConversation,
  getChatConversations,
  updateChatConversation,
} from '@/lib/api';
import type { IChatConversation } from '@brujula-cripto/types';
import { useCallback, useState } from 'react';

export function useChatConversations(userId?: string) {
  const [conversationsData, setConversationsData] = useState<IChatConversation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadConversations = useCallback(async () => {
    if (!userId) {
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
  }, [userId]);

  const createConversation = useCallback(
    async (newConversation: Omit<IChatConversation, 'id' | 'createdAt' | 'updatedAt'>) => {
      try {
        const response = await createChatConversation(newConversation);
        if (response.success && response.data) {
          setConversationsData((prev) => [response.data as IChatConversation, ...prev]);
          return response.data;
        } else {
          setError(response.error || 'Error creando conversación');
          return null;
        }
      } catch (err) {
        setError('Error de conexión');
        console.error('Error creating conversation:', err);
        return null;
      }
    },
    [],
  );

  const deleteConversation = useCallback(async (conversationId: string) => {
    try {
      const response = await deleteChatConversation(conversationId);
      if (response.success) {
        setConversationsData((prev) => prev.filter((conv) => conv.id !== conversationId));
        return true;
      } else {
        setError(response.error || 'Error eliminando conversación');
        return false;
      }
    } catch (err) {
      setError('Error de conexión');
      console.error('Error deleting conversation:', err);
      return false;
    }
  }, []);

  const updateConversation = useCallback(
    async (conversationId: string, updates: Partial<IChatConversation>) => {
      const conversation = conversationsData.find((conv) => conv.id === conversationId);
      if (!conversation) {
        return false;
      }

      try {
        const updatedConversation = { ...conversation, ...updates };
        const response = await updateChatConversation(conversationId, updatedConversation);
        if (response.success) {
          setConversationsData((prev) =>
            prev.map((conv) => (conv.id === conversationId ? { ...conv, ...updates } : conv)),
          );
          return true;
        } else {
          setError(response.error || 'Error actualizando conversación');
          return false;
        }
      } catch (err) {
        setError('Error de conexión');
        console.error('Error updating conversation:', err);
        return false;
      }
    },
    [conversationsData],
  );

  return {
    conversationsData,
    setConversationsData,
    isLoading,
    error,
    setError,
    loadConversations,
    createConversation,
    deleteConversation,
    updateConversation,
  };
}
