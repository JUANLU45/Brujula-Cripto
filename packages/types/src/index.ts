// packages/types/src/index.ts - ÚNICA FUENTE DE VERDAD para tipos TypeScript
// Todos los paquetes DEBEN importar desde aquí - @brújula-cripto/types

/**
 * Interfaz principal para Artículos del Blog (Bilingüe)
 * CRÍTICA: Esta interfaz debe ser consistente en TODOS los paquetes
 */
export interface IArticle {
  /** Identificador único independiente del idioma */
  slug: string;

  /** Contenido en español */
  es: {
    title: string;
    contentMarkdown: string;
    excerpt: string;
  };

  /** Contenido en inglés */
  en: {
    title: string;
    contentMarkdown: string;
    excerpt: string;
  };

  /** URL de la imagen principal */
  imageUrl: string;

  /** Nombre del autor */
  authorName: string;

  /** Categoría del artículo */
  category: string;

  /** Tags asociados */
  tags: string[];

  /** Fecha de creación */
  createdAt: Date;

  /** Fecha de última actualización */
  updatedAt: Date;

  /** Si el artículo es destacado */
  isFeatured: boolean;

  /** Estado del artículo */
  status: 'draft' | 'published';

  /** Origen del contenido */
  source: 'ai-generated' | 'manual';
}

/**
 * Interfaz para Usuarios del Sistema
 */
export interface IUser {
  /** UID de Firebase Auth */
  uid: string;

  /** Email del usuario */
  email: string;

  /** Nombre de usuario */
  displayName: string | null;

  /** URL del avatar */
  photoURL: string | null;

  /** Si es administrador */
  isAdmin: boolean;

  /** Si tiene suscripción premium */
  isPremium: boolean;

  /** Créditos de tiempo en segundos */
  usageCreditsInSeconds: number;

  /** Fecha de creación */
  createdAt: Date;

  /** Fecha de última actividad */
  lastLoginAt: Date;

  /** Preferencias del usuario */
  preferences: {
    language: 'es' | 'en';
    theme: 'light' | 'dark' | 'system';
    notifications: boolean;
  };
}

/**
 * Interfaz para Conversaciones de Chat IA
 * Expandida para crear el mejor chatbot profesional del mundo
 */
export interface IChatConversation {
  /** ID único de la conversación */
  id: string;

  /** UID del usuario */
  userId: string;

  /** Título de la conversación */
  title: string;

  /** Mensajes de la conversación */
  messages: IChatMessage[];

  /** Fecha de creación */
  createdAt: Date;

  /** Fecha de última actualización */
  updatedAt: Date;

  /** Estado de la conversación */
  status: 'active' | 'archived';

  /** Si la conversación está marcada como favorita para acceso rápido */
  isFavorite?: boolean;

  /** Tags para categorización y filtrado de conversaciones */
  tags?: string[];

  /** Prioridad de la conversación para ordenamiento */
  priority?: 'low' | 'normal' | 'high';

  /** Configuración de notificaciones para esta conversación */
  notifications?: {
    enabled: boolean;
    sound: boolean;
    desktop: boolean;
  };

  /** Metadatos adicionales de la conversación */
  metadata?: {
    /** Tema principal de la conversación */
    topic?: string;
    /** Nivel de confianza del usuario (principiante, intermedio, avanzado) */
    userLevel?: 'beginner' | 'intermediate' | 'advanced';
    /** Tokens totales consumidos en esta conversación */
    totalTokens?: number;
    /** Duración total de la conversación en segundos */
    totalDuration?: number;
    /** Valoración del usuario sobre la conversación */
    rating?: number;
    /** Notas privadas del usuario */
    notes?: string;
  };
}

/**
 * Interfaz para Mensajes de Chat
 */
export interface IChatMessage {
  /** ID único del mensaje */
  id: string;

  /** Rol del emisor */
  role: 'user' | 'assistant' | 'system';

  /** Contenido del mensaje */
  content: string;

  /** Timestamp del mensaje */
  timestamp: Date;

  /** Metadatos opcionales */
  metadata?: {
    tokensUsed?: number;
    model?: string;
    processingTime?: number;
  };
}

/**
 * Interfaz para Servicios Profesionales
 */
export interface IProfessionalService {
  /** ID único del servicio */
  id: string;

  /** Contenido bilingüe */
  es: {
    title: string;
    description: string;
    features: string[];
  };

  en: {
    title: string;
    description: string;
    features: string[];
  };

  /** Precio del servicio */
  price: {
    amount: number;
    currency: 'EUR' | 'USD';
    period: 'monthly' | 'yearly' | 'one-time';
  };

  /** Si está disponible */
  isActive: boolean;

  /** Categoría del servicio */
  category: string;

  /** Fecha de creación */
  createdAt: Date;

  /** Fecha de actualización */
  updatedAt: Date;
}

/**
 * Tipos para respuestas de API
 */
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
  };
  timestamp: Date;
}

/**
 * Tipos para formularios
 */
export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
  language: 'es' | 'en';
}

export interface NewsletterFormData {
  email: string;
  language: 'es' | 'en';
}

/**
 * Tipos para configuración
 */
export interface AppConfig {
  version: string;
  environment: 'development' | 'staging' | 'production';
  features: {
    aiChat: boolean;
    newsletter: boolean;
    professionalServices: boolean;
    premiumContent: boolean;
  };
  limits: {
    freeUserCreditsPerDay: number;
    maxConversationsPerUser: number;
    maxMessagesPerConversation: number;
  };
}

/**
 * Tipos para errores personalizados
 */
export interface CustomError {
  code: string;
  message: string;
  statusCode: number;
  details?: Record<string, unknown>;
}

/**
 * Re-exportar tipos comunes
 */
export type Locale = 'es' | 'en';
export type Theme = 'light' | 'dark' | 'system';
export type UserRole = 'user' | 'admin';
export type ArticleStatus = 'draft' | 'published';
export type ArticleSource = 'ai-generated' | 'manual';

/**
 * Tipos específicos para Stripe
 */
export interface StripeSession {
  id: string;
  customer: string;
  amount_total: number;
  currency: string;
  metadata: Record<string, string>;
}

export interface StripeSubscription {
  id: string;
  customer: string;
  status: string;
  created: number;
  current_period_start: number;
  current_period_end: number;
}

export interface StripeInvoice {
  id: string;
  customer: string;
  subscription: string;
  amount_paid: number;
  currency: string;
  created: number;
  number: string;
}

export interface StripePaymentIntent {
  id: string;
  customer: string;
  amount: number;
  currency: string;
  created: number;
}
