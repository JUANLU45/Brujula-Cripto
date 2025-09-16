// articleHandlers.ts
// Fuente: PROYEC_PARTE1.MD línea 194
// Propósito: Handlers para CRUD de artículos (crear/editar/eliminar/publicar), integración IA para moderación comentarios

import type { IArticle } from '@brujula-cripto/types';
import { getApps, initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { onCall } from 'firebase-functions/v2/https';

// Inicializar Firebase Admin si no está ya inicializado
if (!getApps().length) {
  initializeApp();
}

const db = getFirestore();

// Crear artículo
export const createArticle = onCall(async (request) => {
  // Verificar permisos de admin
  if (!request.auth?.token?.admin) {
    throw new Error('Sin permisos de administrador');
  }

  const articleData = request.data as Partial<IArticle>;

  try {
    // Verificar slug único
    if (!articleData.slug) {
      throw new Error('El slug es requerido');
    }
    const existingDoc = await db.collection('articles').doc(articleData.slug).get();
    if (existingDoc.exists) {
      throw new Error('El slug ya existe');
    }

    // Preparar datos del artículo
    const newArticle: IArticle = {
      ...(articleData as IArticle),
      createdAt: new Date(),
      updatedAt: new Date(),
      status: articleData.status || 'draft',
      source: 'manual',
    };

    // Guardar en Firestore
    await db.collection('articles').doc(articleData.slug).set(newArticle);

    return { success: true, slug: articleData.slug };
  } catch (error) {
    console.error('Error creando artículo:', error);
    throw new Error('Error creando artículo');
  }
});

// Editar artículo
export const updateArticle = onCall(async (request) => {
  // Verificar permisos de admin
  if (!request.auth?.token?.admin) {
    throw new Error('Sin permisos de administrador');
  }

  const { slug, updateData } = request.data as { slug: string; updateData: Partial<IArticle> };

  try {
    const articleRef = db.collection('articles').doc(slug);
    const articleDoc = await articleRef.get();

    if (!articleDoc.exists) {
      throw new Error('Artículo no encontrado');
    }

    // Actualizar con timestamp
    const updatedData = {
      ...updateData,
      updatedAt: new Date(),
    };

    await articleRef.update(updatedData);

    return { success: true, slug };
  } catch (error) {
    console.error('Error actualizando artículo:', error);
    throw new Error('Error actualizando artículo');
  }
});

// Eliminar artículo
export const deleteArticle = onCall(async (request) => {
  // Verificar permisos de admin
  if (!request.auth?.token?.admin) {
    throw new Error('Sin permisos de administrador');
  }

  const { slug } = request.data as { slug: string };

  try {
    await db.collection('articles').doc(slug).delete();
    return { success: true, slug };
  } catch (error) {
    console.error('Error eliminando artículo:', error);
    throw new Error('Error eliminando artículo');
  }
});

// Publicar artículo
export const publishArticle = onCall(async (request) => {
  // Verificar permisos de admin
  if (!request.auth?.token?.admin) {
    throw new Error('Sin permisos de administrador');
  }

  const { slug } = request.data as { slug: string };

  try {
    const articleRef = db.collection('articles').doc(slug);
    const articleDoc = await articleRef.get();

    if (!articleDoc.exists) {
      throw new Error('Artículo no encontrado');
    }

    await articleRef.update({
      status: 'published',
      updatedAt: new Date(),
    });

    return { success: true, slug, status: 'published' };
  } catch (error) {
    console.error('Error publicando artículo:', error);
    throw new Error('Error publicando artículo');
  }
});

// Listar artículos (con filtros para admin)
export const listArticles = onCall(async (request) => {
  // Verificar permisos de admin
  if (!request.auth?.token?.admin) {
    throw new Error('Sin permisos de administrador');
  }

  const { status, limit = 50 } = (request.data as { status?: string; limit?: number }) || {};

  try {
    let query = db.collection('articles').orderBy('updatedAt', 'desc');

    if (status) {
      query = query.where(
        'status',
        '==',
        status,
      ) as FirebaseFirestore.Query<FirebaseFirestore.DocumentData>;
    }

    const snapshot = await query.limit(limit).get();
    const articles = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return { success: true, articles };
  } catch (error) {
    console.error('Error listando artículos:', error);
    throw new Error('Error listando artículos');
  }
});
