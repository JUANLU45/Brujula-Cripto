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

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.error || 'Error desconocido',
        };
      }

      return {
        success: true,
        data,
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
    return this.makeRequest<IArticle[]>('/getArticles');
  }

  async getArticleById(id: string): Promise<ApiResponse<IArticle>> {
    return this.makeRequest<IArticle>(`/getArticle?id=${id}`);
  }

  async getArticleBySlug(slug: string): Promise<ApiResponse<IArticle>> {
    return this.makeRequest<IArticle>(`/getArticleBySlug?slug=${slug}`);
  }

  async createArticle(
    article: Omit<IArticle, 'createdAt' | 'updatedAt'>,
  ): Promise<ApiResponse<IArticle>> {
    return this.makeRequest<IArticle>('/createArticle', {
      method: 'POST',
      body: JSON.stringify(article),
    });
  }

  async updateArticle(id: string, article: Partial<IArticle>): Promise<ApiResponse<IArticle>> {
    return this.makeRequest<IArticle>('/updateArticle', {
      method: 'PUT',
      body: JSON.stringify({ id, ...article }),
    });
  }

  async deleteArticle(id: string): Promise<ApiResponse<void>> {
    return this.makeRequest<void>('/deleteArticle', {
      method: 'DELETE',
      body: JSON.stringify({ id }),
    });
  }

  // Usuarios
  async getUserProfile(): Promise<ApiResponse<IUser>> {
    return this.makeRequest<IUser>('/getUserProfile');
  }

  async updateUserProfile(updates: Partial<IUser>): Promise<ApiResponse<IUser>> {
    return this.makeRequest<IUser>('/updateUserProfile', {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  // Pagos (Stripe)
  async createCheckoutSession(priceId: string): Promise<ApiResponse<{ sessionUrl: string }>> {
    return this.makeRequest<{ sessionUrl: string }>('/createCheckout', {
      method: 'POST',
      body: JSON.stringify({ priceId }),
    });
  }

  // Portal de Stripe para gestión de suscripciones
  async createStripePortalSession(): Promise<ApiResponse<{ url: string }>> {
    return this.makeRequest<{ url: string }>('/createStripePortalSession', {
      method: 'POST',
    });
  }

  // Autenticación y gestión de usuario
  async signOut(): Promise<ApiResponse<void>> {
    return this.makeRequest<void>('/auth/signout', {
      method: 'POST',
    });
  }

  async deleteUserAccount(): Promise<ApiResponse<void>> {
    return this.makeRequest<void>('/auth/delete-account', {
      method: 'DELETE',
    });
  }

  // Formulario de contacto
  async submitContactForm(formData: ContactFormData): Promise<ApiResponse<void>> {
    return this.makeRequest<void>('/handleContactForm', {
      method: 'POST',
      body: JSON.stringify(formData),
    });
  }

  // Roles de Admin
  async setAdminRole(email: string): Promise<ApiResponse<void>> {
    return this.makeRequest<void>('/setAdminRole', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  // === CHATBOT ENDPOINTS (PROYEC_PARTE7.MD) ===

  // GET /conversations - Obtener todas las conversaciones del usuario
  async getChatConversations(): Promise<ApiResponse<IChatConversation[]>> {
    return this.makeRequest<IChatConversation[]>('/chatbot/conversations');
  }

  // POST /conversations - Crear nueva conversación
  async createChatConversation(
    conversation: Omit<IChatConversation, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<ApiResponse<IChatConversation>> {
    return this.makeRequest<IChatConversation>('/chatbot/conversations', {
      method: 'POST',
      body: JSON.stringify(conversation),
    });
  }

  // PUT /conversations/{id} - Actualizar conversación (renombrar, marcar favorito, etc.)
  async updateChatConversation(
    id: string,
    updates: Partial<IChatConversation>,
  ): Promise<ApiResponse<IChatConversation>> {
    return this.makeRequest<IChatConversation>(`/chatbot/conversations/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  // DELETE /conversations/{id} - Eliminar conversación
  async deleteChatConversation(id: string): Promise<ApiResponse<void>> {
    return this.makeRequest<void>(`/chatbot/conversations/${id}`, {
      method: 'DELETE',
    });
  }

  // POST /conversations/{id}/messages - Enviar mensaje (con streaming)
  async sendChatMessage(
    conversationId: string,
    message: Omit<IChatMessage, 'id' | 'timestamp'>,
  ): Promise<ApiResponse<IChatMessage>> {
    return this.makeRequest<IChatMessage>(`/chatbot/conversations/${conversationId}/messages`, {
      method: 'POST',
      body: JSON.stringify(message),
    });
  }

  // Stream messages para respuestas en tiempo real
  async streamChatMessage(
    conversationId: string,
    message: Omit<IChatMessage, 'id' | 'timestamp'>,
    onChunk?: (chunk: string) => void,
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
export const getArticleBySlug = (slug: string) => api.getArticleBySlug(slug);
export const getArticles = () => api.getArticles();
export const getArticleById = (id: string) => api.getArticleById(id);
export const createArticle = (article: Omit<IArticle, 'createdAt' | 'updatedAt'>) =>
  api.createArticle(article);
export const updateArticle = (id: string, article: Partial<IArticle>) =>
  api.updateArticle(id, article);
export const deleteArticle = (id: string) => api.deleteArticle(id);

// Exportaciones para autenticación y gestión de usuario
export const signOut = () => api.signOut();
export const deleteUserAccount = () => api.deleteUserAccount();
export const createStripePortalSession = () => api.createStripePortalSession();
export const createCheckoutSession = (priceId: string) => api.createCheckoutSession(priceId);

// Exportaciones para formulario de contacto
export const submitContactForm = (formData: ContactFormData) => api.submitContactForm(formData);

// Exportaciones para chatbot (PROYEC_PARTE7.MD)
export const getChatConversations = () => api.getChatConversations();
export const createChatConversation = (
  conversation: Omit<IChatConversation, 'id' | 'createdAt' | 'updatedAt'>,
) => api.createChatConversation(conversation);
export const updateChatConversation = (id: string, updates: Partial<IChatConversation>) =>
  api.updateChatConversation(id, updates);
export const deleteChatConversation = (id: string) => api.deleteChatConversation(id);
export const sendChatMessage = (
  conversationId: string,
  message: Omit<IChatMessage, 'id' | 'timestamp'>,
) => api.sendChatMessage(conversationId, message);
export const streamChatMessage = (
  conversationId: string,
  message: Omit<IChatMessage, 'id' | 'timestamp'>,
  onChunk?: (chunk: string) => void,
) => api.streamChatMessage(conversationId, message, onChunk);
