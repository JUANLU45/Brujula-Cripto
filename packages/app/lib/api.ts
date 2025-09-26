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

// Interfaces para homepage y feedback según ERRORES_1VERIFICACION.MD
interface HomepageContent {
  bannerImageUrl: string;
  bannerTitle_es: string;
  bannerTitle_en: string;
  bannerSubtitle_es: string;
  bannerSubtitle_en: string;
  bannerButtonText_es: string;
  bannerButtonText_en: string;
  bannerButtonLink: string;
}

interface FeedbackData {
  subject: string;
  message: string;
  priority: 'low' | 'medium' | 'high';
  category: 'technical' | 'content' | 'billing' | 'general';
}

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
  getArticles(): Promise<ApiResponse<IArticle[]>> {
    return this.makeRequest<IArticle[]>('/getArticles');
  }

  getArticleById(id: string): Promise<ApiResponse<IArticle>> {
    return this.makeRequest<IArticle>(`/getArticle?id=${id}`);
  }

  getArticleBySlug(slug: string): Promise<ApiResponse<IArticle>> {
    return this.makeRequest<IArticle>(`/getArticleBySlug?slug=${slug}`);
  }

  createArticle(
    article: Omit<IArticle, 'createdAt' | 'updatedAt'>,
  ): Promise<ApiResponse<IArticle>> {
    return this.makeRequest<IArticle>('/createArticle', {
      method: 'POST',
      body: JSON.stringify(article),
    });
  }

  updateArticle(id: string, article: Partial<IArticle>): Promise<ApiResponse<IArticle>> {
    return this.makeRequest<IArticle>('/updateArticle', {
      method: 'PUT',
      body: JSON.stringify({ id, ...article }),
    });
  }

  deleteArticle(id: string): Promise<ApiResponse<null>> {
    return this.makeRequest<null>('/deleteArticle', {
      method: 'DELETE',
      body: JSON.stringify({ id }),
    });
  }

  // Usuarios
  getUserProfile(): Promise<ApiResponse<IUser>> {
    return this.makeRequest<IUser>('/getUserProfile');
  }

  updateUserProfile(updates: Partial<IUser>): Promise<ApiResponse<IUser>> {
    return this.makeRequest<IUser>('/updateUserProfile', {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  // Pagos (Stripe)
  createCheckoutSession(priceId: string): Promise<ApiResponse<{ sessionUrl: string }>> {
    return this.makeRequest<{ sessionUrl: string }>('/createCheckout', {
      method: 'POST',
      body: JSON.stringify({ priceId }),
    });
  }

  // Portal de Stripe para gestión de suscripciones
  createStripePortalSession(): Promise<ApiResponse<{ url: string }>> {
    return this.makeRequest<{ url: string }>('/createStripePortalSession', {
      method: 'POST',
    });
  }

  // Autenticación y gestión de usuario
  signOut(): Promise<ApiResponse<null>> {
    return this.makeRequest<null>('/auth/signout', {
      method: 'POST',
    });
  }

  deleteUserAccount(): Promise<ApiResponse<null>> {
    return this.makeRequest<null>('/auth/delete-account', {
      method: 'DELETE',
    });
  }

  // Formulario de contacto
  submitContactForm(formData: ContactFormData): Promise<ApiResponse<null>> {
    return this.makeRequest<null>('/handleContactForm', {
      method: 'POST',
      body: JSON.stringify(formData),
    });
  }

  // Roles de Admin
  setAdminRole(email: string): Promise<ApiResponse<null>> {
    return this.makeRequest<null>('/setAdminRole', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  // === HOMEPAGE CONTENT (ERRORES_1VERIFICACION.MD) ===

  // GET /api/admin/homepage - Obtener contenido de homepage (solo admin)
  getHomepageContent(authToken?: string): Promise<ApiResponse<HomepageContent>> {
    const headers = authToken ? { Authorization: `Bearer ${authToken}` } : undefined;
    return this.makeRequest<HomepageContent>('/api/admin/homepage', {
      headers,
    });
  }

  // POST /api/admin/homepage - Actualizar contenido de homepage (solo admin)
  updateHomepageContent(
    content: HomepageContent,
    authToken: string,
  ): Promise<ApiResponse<HomepageContent>> {
    return this.makeRequest<HomepageContent>('/api/admin/homepage', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify(content),
    });
  }

  // DELETE /api/admin/homepage - Resetear contenido a valores por defecto (solo admin)
  resetHomepageContent(authToken: string): Promise<ApiResponse<null>> {
    return this.makeRequest<null>('/api/admin/homepage', {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });
  }

  // === FEEDBACK SYSTEM (ERRORES_1VERIFICACION.MD) ===

  // POST /api/feedback - Enviar feedback (usuarios registrados)
  submitFeedback(feedback: FeedbackData, authToken: string): Promise<ApiResponse<any>> {
    return this.makeRequest<any>('/api/feedback', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify(feedback),
    });
  }

  // GET /api/feedback - Obtener historial de feedback del usuario
  getUserFeedback(
    authToken: string,
    page?: number,
    limit?: number,
  ): Promise<ApiResponse<any>> {
    const params = new URLSearchParams();
    if (page) params.append('page', page.toString());
    if (limit) params.append('limit', limit.toString());
    
    return this.makeRequest<any>(`/api/feedback?${params.toString()}`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });
  }

  // === CHATBOT ENDPOINTS (PROYEC_PARTE7.MD) ===

  // GET /conversations - Obtener todas las conversaciones del usuario
  getChatConversations(): Promise<ApiResponse<IChatConversation[]>> {
    return this.makeRequest<IChatConversation[]>('/chatbot/conversations');
  }

  // POST /conversations - Crear nueva conversación
  createChatConversation(
    conversation: Omit<IChatConversation, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<ApiResponse<IChatConversation>> {
    return this.makeRequest<IChatConversation>('/chatbot/conversations', {
      method: 'POST',
      body: JSON.stringify(conversation),
    });
  }

  // PUT /conversations/{id} - Actualizar conversación (renombrar, marcar favorito, etc.)
  updateChatConversation(
    id: string,
    updates: Partial<IChatConversation>,
  ): Promise<ApiResponse<IChatConversation>> {
    return this.makeRequest<IChatConversation>(`/chatbot/conversations/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  // DELETE /conversations/{id} - Eliminar conversación
  deleteChatConversation(id: string): Promise<ApiResponse<null>> {
    return this.makeRequest<null>(`/chatbot/conversations/${id}`, {
      method: 'DELETE',
    });
  }

  // POST /conversations/{id}/messages - Enviar mensaje (con streaming)
  sendChatMessage(
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

// Exportaciones para homepage content (ERRORES_1VERIFICACION.MD)
export const getHomepageContent = (authToken?: string): Promise<ApiResponse<HomepageContent>> =>
  api.getHomepageContent(authToken);
export const updateHomepageContent = (
  content: HomepageContent,
  authToken: string,
): Promise<ApiResponse<HomepageContent>> => api.updateHomepageContent(content, authToken);
export const resetHomepageContent = (authToken: string): Promise<ApiResponse<null>> =>
  api.resetHomepageContent(authToken);

// Exportaciones para feedback system (ERRORES_1VERIFICACION.MD)
export const submitFeedback = (
  feedback: FeedbackData,
  authToken: string,
): Promise<ApiResponse<any>> => api.submitFeedback(feedback, authToken);
export const getUserFeedback = (
  authToken: string,
  page?: number,
  limit?: number,
): Promise<ApiResponse<any>> => api.getUserFeedback(authToken, page, limit);

// Exportaciones para herramientas de recuperación de archivos eliminados
export { analyzeFileRecovery } from './api/deleted-files';
