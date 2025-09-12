import { IArticle, IContactFormData, IUser } from '@brujula-cripto/types';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  'https://us-central1-brujula-cripto.cloudfunctions.net';

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

  async updateArticle(
    id: string,
    article: Partial<IArticle>,
  ): Promise<ApiResponse<IArticle>> {
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

  async updateUserProfile(
    updates: Partial<IUser>,
  ): Promise<ApiResponse<IUser>> {
    return this.makeRequest<IUser>('/updateUserProfile', {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  // Pagos (Stripe)
  async createCheckoutSession(
    priceId: string,
  ): Promise<ApiResponse<{ sessionUrl: string }>> {
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
  async submitContactForm(
    formData: IContactFormData,
  ): Promise<ApiResponse<void>> {
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
}

// Instancia única exportada
export const api = new ApiClient();

// Exportaciones individuales para compatibilidad
export const getArticleBySlug = (slug: string) => api.getArticleBySlug(slug);
export const getArticles = () => api.getArticles();
export const getArticleById = (id: string) => api.getArticleById(id);
export const createArticle = (
  article: Omit<IArticle, 'createdAt' | 'updatedAt'>,
) => api.createArticle(article);
export const updateArticle = (id: string, article: Partial<IArticle>) =>
  api.updateArticle(id, article);
export const deleteArticle = (id: string) => api.deleteArticle(id);

// Exportaciones para autenticación y gestión de usuario
export const signOut = () => api.signOut();
export const deleteUserAccount = () => api.deleteUserAccount();
export const createStripePortalSession = () => api.createStripePortalSession();
export const createCheckoutSession = (priceId: string) =>
  api.createCheckoutSession(priceId);

// Exportaciones para formulario de contacto
export const submitContactForm = (formData: IContactFormData) =>
  api.submitContactForm(formData);
