// packages/types/src/index.ts - ÚNICA FUENTE DE VERDAD para tipos TypeScript// ÚNICA FUENTE DE VERDAD para tipos TypeScript

// Todos los paquetes DEBEN importar desde aquí - @brújula-cripto/types// Según PROYEC_PARTE3.MD - Modelo de Datos Firestore



/**export interface IArticle {

 * Interfaz principal para Artículos del Blog (Bilingüe)  slug: string; // único, ej: como-proteger-tu-wallet

 * CRÍTICA: Esta interfaz debe ser consistente en TODOS los paquetes  es: {

 */    title: string;

export interface IArticle {    contentMarkdown: string;

  /** Identificador único independiente del idioma */    excerpt: string;

  slug: string;  };

    en: {

  /** Contenido en español */    title: string;

  es: {    contentMarkdown: string;

    title: string;    excerpt: string;

    contentMarkdown: string;  };

    excerpt: string;  imageUrl: string;

  };  authorName: string;

    category: string;

  /** Contenido en inglés */  tags: string[];

  en: {  createdAt: Date;

    title: string;  updatedAt: Date;

    contentMarkdown: string;  isFeatured: boolean;

    excerpt: string;  status: 'draft' | 'published';

  };  source: 'ai-generated' | 'manual';

  }

  /** URL de la imagen principal */

  imageUrl: string;// Tipos de Usuario - Colección users (PROYEC_PARTE3.MD)

  export interface IUser {

  /** Nombre del autor */  email: string;

  authorName: string;  createdAt: Date;

    hasPremiumAccess: boolean; // CAMPO CLAVE para suscripciones

  /** Categoría del artículo */  stripeCustomerId?: string; // Para integración con Stripe

  category: string;  subscriptionStatus?: 'active' | 'canceled' | 'past_due' | null; // Estado de suscripción Stripe

    subscriptionId?: string; // ID de suscripción de Stripe

  /** Tags asociados */  displayName?: string; // Nombre para mostrar

  tags: string[];  isAdmin?: boolean; // Rol de administrador

  }

  /** Fecha de creación */

  createdAt: Date;// Tipos para Dashboard (UserDashboard.tsx)

  export type DashboardTab = 'account' | 'subscription' | 'history';

  /** Fecha de última actualización */

  updatedAt: Date;export interface UserProfile {

    email: string;

  /** Si el artículo es destacado */  displayName?: string;

  isFeatured: boolean;  createdAt: Date;

    hasPremiumAccess: boolean;

  /** Estado del artículo */  isAdmin?: boolean;

  status: 'draft' | 'published';  stripeCustomerId?: string;

    subscriptionStatus?: 'active' | 'canceled' | 'past_due' | null;

  /** Origen del contenido */}

  source: 'ai-generated' | 'manual';

}// Tipos para Servicios Profesionales - Colección professionalServices

export interface IProfessionalService {

/**  name: string;

 * Interfaz para Usuarios del Sistema  website: string;

 */  description: string;

export interface IUser {  logoUrl: string;

  /** UID de Firebase Auth */  specialties: string[];

  uid: string;  isVerified: boolean;

  }

  /** Email del usuario */

  email: string;// Tipos para Contenido del Sitio - Colección siteContent

  export interface ISiteContent {

  /** Nombre de usuario */  bannerImageUrl: string;

  displayName: string | null;  bannerTitle_es: string;

    bannerTitle_en: string;

  /** URL del avatar */  bannerSubtitle_es: string;

  photoURL: string | null;  bannerSubtitle_en: string;

    bannerButtonText_es: string;

  /** Si es administrador */  bannerButtonText_en: string;

  isAdmin: boolean;  bannerButtonLink: string;

  }

  /** Si tiene suscripción premium */

  isPremium: boolean;// Tipos para Formulario de Contacto - Colección contactSubmissions

  export interface IContactSubmission {

  /** Créditos de tiempo en segundos */  name: string;

  usageCreditsInSeconds: number;  email: string;

    message: string;

  /** Fecha de creación */  submittedAt: Date;

  createdAt: Date;  status: 'new' | 'read';

  }

  /** Fecha de última actividad */

  lastLoginAt: Date;// Tipo para datos de entrada del formulario de contacto

  export interface IContactFormData {

  /** Preferencias del usuario */  name: string;

  preferences: {  email: string;

    language: 'es' | 'en';  subject: string;

    theme: 'light' | 'dark' | 'system';  message: string;

    notifications: boolean;}

  };
}

/**
 * Interfaz para Conversaciones de Chat IA
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
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
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
  details?: any;
}

/**
 * Re-exportar tipos comunes
 */
export type Locale = 'es' | 'en';
export type Theme = 'light' | 'dark' | 'system';
export type UserRole = 'user' | 'admin';
export type ArticleStatus = 'draft' | 'published';
export type ArticleSource = 'ai-generated' | 'manual';