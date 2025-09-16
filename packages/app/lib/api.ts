import type {
  ContactFormData,
  IArticle,
  IChatConversation,
  IChatMessage,
  IUser,
} from '@brujula-cripto/types';

// Importar trackUsage
export { trackUsage } from './api/trackUsage';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || 'https://us-central1-brujula-cripto.cloudfunctions.net';

// Tipos para las respuestas de la API
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// Central de llamadas al Backend - FUNCIÓN REAL
class ApiClient {
  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      const data = (await response.json()) as unknown;

      if (!response.ok) {
        return {
          success: false,
          error: (data as { error?: string }).error || 'Error desconocido',
        };
      }

      return {
        success: true,
        data: data as T,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error de conexión',
      };
    }
  }

  // Artículos
  async getArticles(): Promise<ApiResponse<IArticle[]>> {
    return await this.makeRequest<IArticle[]>('/getArticles');
  }

  async getArticleById(id: string): Promise<ApiResponse<IArticle>> {
    return await this.makeRequest<IArticle>(`/getArticle?id=${id}`);
  }

  async getArticleBySlug(slug: string): Promise<ApiResponse<IArticle>> {
    return await this.makeRequest<IArticle>(`/getArticleBySlug?slug=${slug}`);
  }

  async createArticle(
    article: Omit<IArticle, 'createdAt' | 'updatedAt'>,
  ): Promise<ApiResponse<IArticle>> {
    return await this.makeRequest<IArticle>('/createArticle', {
      method: 'POST',
      body: JSON.stringify(article),
    });
  }

  async updateArticle(id: string, article: Partial<IArticle>): Promise<ApiResponse<IArticle>> {
    return await this.makeRequest<IArticle>('/updateArticle', {
      method: 'PUT',
      body: JSON.stringify({ id, ...article }),
    });
  }

  async deleteArticle(id: string): Promise<ApiResponse<null>> {
    return await this.makeRequest<null>('/deleteArticle', {
      method: 'DELETE',
      body: JSON.stringify({ id }),
    });
  }

  // Usuarios
  async getUserProfile(): Promise<ApiResponse<IUser>> {
    return await this.makeRequest<IUser>('/getUserProfile');
  }

  async updateUserProfile(updates: Partial<IUser>): Promise<ApiResponse<IUser>> {
    return await this.makeRequest<IUser>('/updateUserProfile', {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  // Pagos (Stripe)
  async createCheckoutSession(priceId: string): Promise<ApiResponse<{ sessionUrl: string }>> {
    return await this.makeRequest<{ sessionUrl: string }>('/createCheckout', {
      method: 'POST',
      body: JSON.stringify({ priceId }),
    });
  }

  // Portal de Stripe para gestión de suscripciones
  async createStripePortalSession(): Promise<ApiResponse<{ url: string }>> {
    return await this.makeRequest<{ url: string }>('/createStripePortalSession', {
      method: 'POST',
    });
  }

  // Autenticación y gestión de usuario
  async signOut(): Promise<ApiResponse<null>> {
    return await this.makeRequest<null>('/auth/signout', {
      method: 'POST',
    });
  }

  async deleteUserAccount(): Promise<ApiResponse<null>> {
    return await this.makeRequest<null>('/auth/delete-account', {
      method: 'DELETE',
    });
  }

  // Formulario de contacto
  async submitContactForm(formData: ContactFormData): Promise<ApiResponse<null>> {
    return await this.makeRequest<null>('/handleContactForm', {
      method: 'POST',
      body: JSON.stringify(formData),
    });
  }

  // Roles de Admin
  async setAdminRole(email: string): Promise<ApiResponse<null>> {
    return await this.makeRequest<null>('/setAdminRole', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  // === CHATBOT ENDPOINTS (PROYEC_PARTE7.MD) ===

  // GET /conversations - Obtener todas las conversaciones del usuario
  async getChatConversations(): Promise<ApiResponse<IChatConversation[]>> {
    return await this.makeRequest<IChatConversation[]>('/chatbot/conversations');
  }

  // POST /conversations - Crear nueva conversación
  async createChatConversation(
    conversation: Omit<IChatConversation, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<ApiResponse<IChatConversation>> {
    return await this.makeRequest<IChatConversation>('/chatbot/conversations', {
      method: 'POST',
      body: JSON.stringify(conversation),
    });
  }

  // PUT /conversations/{id} - Actualizar conversación (renombrar, marcar favorito, etc.)
  async updateChatConversation(
    id: string,
    updates: Partial<IChatConversation>,
  ): Promise<ApiResponse<IChatConversation>> {
    return await this.makeRequest<IChatConversation>(`/chatbot/conversations/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  // DELETE /conversations/{id} - Eliminar conversación
  async deleteChatConversation(id: string): Promise<ApiResponse<null>> {
    return await this.makeRequest<null>(`/chatbot/conversations/${id}`, {
      method: 'DELETE',
    });
  }

  // POST /conversations/{id}/messages - Enviar mensaje (con streaming)
  async sendChatMessage(
    conversationId: string,
    message: Omit<IChatMessage, 'id' | 'timestamp'>,
  ): Promise<ApiResponse<IChatMessage>> {
    return await this.makeRequest<IChatMessage>(
      `/chatbot/conversations/${conversationId}/messages`,
      {
        method: 'POST',
        body: JSON.stringify(message),
      },
    );
  }

  // Stream messages para respuestas en tiempo real
  async streamChatMessage(
    conversationId: string,
    message: Omit<IChatMessage, 'id' | 'timestamp'>,
    _onChunk?: (chunk: string) => null,
  ): Promise<ReadableStream<Uint8Array> | null> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/chatbot/conversations/${conversationId}/messages/stream`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(message),
        },
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return response.body;
    } catch (error) {
      console.error('Error in stream chat message:', error);
      return null;
    }
  }
}

// Instancia única exportada
export const api = new ApiClient();

// Exportaciones individuales para compatibilidad
export const getArticleBySlug = (slug: string): Promise<ApiResponse<IArticle>> =>
  api.getArticleBySlug(slug);
export const getArticles = (): Promise<ApiResponse<IArticle[]>> => api.getArticles();
export const getArticleById = (id: string): Promise<ApiResponse<IArticle>> =>
  api.getArticleById(id);
export const createArticle = (
  article: Omit<IArticle, 'createdAt' | 'updatedAt'>,
): Promise<ApiResponse<IArticle>> => api.createArticle(article);
export const updateArticle = (
  id: string,
  article: Partial<IArticle>,
): Promise<ApiResponse<IArticle>> => api.updateArticle(id, article);
export const deleteArticle = (id: string): Promise<ApiResponse<null>> => api.deleteArticle(id);

// Exportaciones para autenticación y gestión de usuario
export const signOut = (): Promise<ApiResponse<null>> => api.signOut();
export const deleteUserAccount = (): Promise<ApiResponse<null>> => api.deleteUserAccount();
export const createStripePortalSession = (): Promise<ApiResponse<{ url: string }>> =>
  api.createStripePortalSession();
export const createCheckoutSession = (
  priceId: string,
): Promise<ApiResponse<{ sessionUrl: string }>> => api.createCheckoutSession(priceId);

// Exportaciones para formulario de contacto
export const submitContactForm = (formData: ContactFormData): Promise<ApiResponse<null>> =>
  api.submitContactForm(formData);

// Exportaciones para chatbot (PROYEC_PARTE7.MD)
export const getChatConversations = (): Promise<ApiResponse<IChatConversation[]>> =>
  api.getChatConversations();
export const createChatConversation = (
  conversation: Omit<IChatConversation, 'id' | 'createdAt' | 'updatedAt'>,
): Promise<ApiResponse<IChatConversation>> => api.createChatConversation(conversation);
export const updateChatConversation = (
  id: string,
  updates: Partial<IChatConversation>,
): Promise<ApiResponse<IChatConversation>> => api.updateChatConversation(id, updates);
export const deleteChatConversation = (id: string): Promise<ApiResponse<null>> =>
  api.deleteChatConversation(id);
export const sendChatMessage = (
  conversationId: string,
  message: Omit<IChatMessage, 'id' | 'timestamp'>,
): Promise<ApiResponse<IChatMessage>> => api.sendChatMessage(conversationId, message);
export const streamChatMessage = (
  conversationId: string,
  message: Omit<IChatMessage, 'id' | 'timestamp'>,
  onChunk?: (chunk: string) => null,
): Promise<ReadableStream<Uint8Array> | null> =>
  api.streamChatMessage(conversationId, message, onChunk);
