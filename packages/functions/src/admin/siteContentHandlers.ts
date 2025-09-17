// siteContentHandlers.ts
// Fuente: PROYEC_PARTE1.MD línea 196
// Propósito: Handlers para editar contenido de homepage (banner, etc.), almacenado en siteContent/homepage

import { getApps, initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { onCall } from 'firebase-functions/v2/https';

// Inicializar Firebase Admin si no está ya inicializado
if (!getApps().length) {
  initializeApp();
}

const db = getFirestore();

// Interfaz para el contenido de homepage según PROYEC_PARTE3.MD
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

// Obtener contenido de homepage
export const getHomepageContent = onCall(async () => {
  try {
    const doc = await db.collection('siteContent').doc('homepage').get();

    if (!doc.exists) {
      // Retornar contenido por defecto según TEXTOS_IMAGENES.MD
      const defaultContent: HomepageContent = {
        bannerImageUrl: '/images/home/banner-hero.webp',
        bannerTitle_es: 'Navega el Mundo Cripto con Confianza',
        bannerTitle_en: 'Navigate the Crypto World with Confidence',
        bannerSubtitle_es:
          'Herramientas reales para proteger y recuperar tus activos digitales. Tu tranquilidad es nuestra misión.',
        bannerSubtitle_en:
          'Real tools to protect and recover your digital assets. Your peace of mind is our mission.',
        bannerButtonText_es: 'Empezar Diagnóstico',
        bannerButtonText_en: 'Start Diagnosis',
        bannerButtonLink: '/recuperacion',
      };
      return { success: true, content: defaultContent };
    }

    return { success: true, content: doc.data() };
  } catch (error) {
    console.error('Error obteniendo contenido homepage:', error);
    throw new Error('Error obteniendo contenido homepage');
  }
});

// Actualizar contenido de homepage
export const updateHomepageContent = onCall(async (request) => {
  // Verificar permisos de admin
  if (!request.auth?.token?.admin) {
    throw new Error('Sin permisos de administrador');
  }

  const contentData: Partial<HomepageContent> = request.data as Partial<HomepageContent>;

  try {
    // Validar campos requeridos
    const requiredFields = [
      'bannerImageUrl',
      'bannerTitle_es',
      'bannerTitle_en',
      'bannerSubtitle_es',
      'bannerSubtitle_en',
      'bannerButtonText_es',
      'bannerButtonText_en',
      'bannerButtonLink',
    ];

    for (const field of requiredFields) {
      if (!(field in contentData)) {
        throw new Error(`Campo requerido faltante: ${field}`);
      }
    }

    // Actualizar en Firestore
    await db.collection('siteContent').doc('homepage').set(contentData, { merge: true });

    return { success: true, message: 'Contenido actualizado correctamente' };
  } catch (error) {
    console.error('Error actualizando contenido homepage:', error);
    throw new Error('Error actualizando contenido homepage');
  }
});

// Resetear contenido a valores por defecto
export const resetHomepageContent = onCall(async (request) => {
  // Verificar permisos de admin
  if (!request.auth?.token?.admin) {
    throw new Error('Sin permisos de administrador');
  }

  try {
    const defaultContent: HomepageContent = {
      bannerImageUrl: '/images/home/banner-hero.webp',
      bannerTitle_es: 'Navega el Mundo Cripto con Confianza',
      bannerTitle_en: 'Navigate the Crypto World with Confidence',
      bannerSubtitle_es:
        'Herramientas reales para proteger y recuperar tus activos digitales. Tu tranquilidad es nuestra misión.',
      bannerSubtitle_en:
        'Real tools to protect and recover your digital assets. Your peace of mind is our mission.',
      bannerButtonText_es: 'Empezar Diagnóstico',
      bannerButtonText_en: 'Start Diagnosis',
      bannerButtonLink: '/recuperacion',
    };

    await db.collection('siteContent').doc('homepage').set(defaultContent);

    return { success: true, message: 'Contenido reseteado a valores por defecto' };
  } catch (error) {
    console.error('Error reseteando contenido homepage:', error);
    throw new Error('Error reseteando contenido homepage');
  }
});
