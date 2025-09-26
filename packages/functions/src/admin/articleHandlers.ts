// articleHandlers.ts
// Fuente: PROYEC_PARTE1.MD línea 194
// Propósito: Handlers para CRUD de artículos (crear/editar/eliminar/publicar), integración IA para moderación comentarios

import type { IArticle } from '@brujula-cripto/types';
import { onCall } from 'firebase-functions/v2/https';
import { database } from '../lib/database';
import { QueryFilter, QueryOptions } from '@brujula-cripto/types';

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
    const existingDoc = await database.getDocument('articles', articleData.slug);
    if (existingDoc && existingDoc.exists) {
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
    await database.setDocument('articles', articleData.slug, newArticle);

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
    const articleDoc = await database.getDocument('articles', slug);

    if (!articleDoc || !articleDoc.exists) {
      throw new Error('Artículo no encontrado');
    }

    // Actualizar con timestamp
    const updatedData = {
      ...updateData,
      updatedAt: new Date(),
    };

    await database.updateDocument('articles', slug, updatedData);

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
    await database.deleteDocument('articles', slug);
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
    const articleDoc = await database.getDocument('articles', slug);

    if (!articleDoc || !articleDoc.exists) {
      throw new Error('Artículo no encontrado');
    }

    await database.updateDocument('articles', slug, {
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
    const filters: QueryFilter[] = [];
    
    if (status) {
      filters.push({
        field: 'status',
        operator: 'eq',
        value: status
      });
    }

    const queryOptions: QueryOptions = {
      orderBy: { field: 'updatedAt', direction: 'desc' },
      limit
    };

    const articles = await database.queryCollection('articles', filters, queryOptions);

    return { success: true, articles };
  } catch (error) {
    console.error('Error listando artículos:', error);
    throw new Error('Error listando artículos');
  }
});
