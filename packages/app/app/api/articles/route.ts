// API Route para obtener artículos del blog
// Archivo: app/api/articles/route.ts

import { NextResponse, type NextRequest } from 'next/server';

import type { IArticle } from '@brujula-cripto/types';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  limit as firestoreLimit,
  getDocs,
  orderBy,
  query,
  Timestamp,
  updateDoc,
  where,
} from 'firebase/firestore';

import { db } from '@/lib/firebase';

// Tipos para validación
interface ArticleRequestBody {
  id?: string;
  slug: string;
  es: {
    title: string;
    contentMarkdown?: string;
    excerpt?: string;
  };
  en: {
    title: string;
    contentMarkdown?: string;
    excerpt?: string;
  };
  imageUrl?: string;
  authorName?: string;
  category?: string;
  tags?: string[];
  isFeatured?: boolean;
  status?: 'draft' | 'published';
  source?: 'ai-generated' | 'manual';
}

// Tipo para documentos de Firestore
interface FirestoreTimestamp {
  toDate: () => Date;
}

// Función auxiliar para verificar si es un timestamp válido de Firestore
function isValidFirestoreTimestamp(value: unknown): value is FirestoreTimestamp {
  return (
    value !== null &&
    typeof value === 'object' &&
    'toDate' in value &&
    typeof (value as Record<string, unknown>).toDate === 'function'
  );
}

// Función auxiliar para convertir documento de Firestore a IArticle
function convertFirestoreDocToArticle(data: Record<string, unknown>): IArticle | null {
  if (!isValidFirestoreTimestamp(data.createdAt) || !isValidFirestoreTimestamp(data.updatedAt)) {
    return null;
  }

  return {
    ...data,
    createdAt: data.createdAt.toDate(),
    updatedAt: data.updatedAt.toDate(),
  } as IArticle;
}

/**
 * GET /api/articles
 * Obtiene artículos del blog con filtros
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url);

    // Parámetros de consulta
    const locale = searchParams.get('locale') || 'es';
    const status = searchParams.get('status') || 'published';
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    const category = searchParams.get('category');
    const search = searchParams.get('search');

    // Validar parámetros
    if (!['es', 'en'].includes(locale)) {
      return NextResponse.json({ error: 'Invalid locale. Must be es or en' }, { status: 400 });
    }

    if (!['published', 'draft'].includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status. Must be published or draft' },
        { status: 400 },
      );
    }

    if (limit < 1 || limit > 100) {
      return NextResponse.json(
        { error: 'Invalid limit. Must be between 1 and 100' },
        { status: 400 },
      );
    }

    // Construir consulta Firestore
    const articlesRef = collection(db, 'articles');
    let articlesQuery = query(
      articlesRef,
      where('status', '==', status),
      orderBy('createdAt', 'desc'),
      firestoreLimit(limit),
    );

    // Filtrar por categoría si se especifica
    if (category) {
      articlesQuery = query(
        articlesRef,
        where('status', '==', status),
        where('category', '==', category),
        orderBy('createdAt', 'desc'),
        firestoreLimit(limit),
      );
    }

    // Ejecutar consulta
    const querySnapshot = await getDocs(articlesQuery);
    const articles: IArticle[] = [];

    querySnapshot.forEach((document) => {
      const data = document.data();

      // Convertir datos de Firestore a IArticle
      const article = convertFirestoreDocToArticle(data);

      if (article) {
        // Filtrar por búsqueda de texto si se especifica
        if (search) {
          const searchLower = search.toLowerCase();
          const targetLocale = locale as 'es' | 'en';
          const titleMatch = article[targetLocale].title.toLowerCase().includes(searchLower);
          const contentMatch = article[targetLocale].contentMarkdown
            .toLowerCase()
            .includes(searchLower);
          const excerptMatch = article[targetLocale].excerpt.toLowerCase().includes(searchLower);

          if (titleMatch || contentMatch || excerptMatch) {
            articles.push(article);
          }
        } else {
          articles.push(article);
        }
      }
    });

    // Calcular paginación
    const total = articles.length;
    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      success: true,
      data: {
        articles,
        pagination: {
          page: 1,
          limit,
          total,
          totalPages,
        },
        filters: {
          locale,
          status,
          category,
          search,
        },
      },
    });
  } catch (error) {
    console.error('Error in /api/articles:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
        message: 'Failed to fetch articles',
      },
      { status: 500 },
    );
  }
}

// Función auxiliar para validar autenticación
function validateAuth(request: NextRequest): boolean {
  const authHeader = request.headers.get('authorization');
  return Boolean(authHeader?.startsWith('Bearer '));
}

// Función auxiliar para validar datos del artículo
function validateArticleData(body: unknown): body is ArticleRequestBody {
  if (!body || typeof body !== 'object') {
    return false;
  }

  const data = body as Record<string, unknown>;
  return Boolean(
    data.slug &&
      typeof data.slug === 'string' &&
      data.es &&
      typeof data.es === 'object' &&
      (data.es as Record<string, unknown>).title &&
      data.en &&
      typeof data.en === 'object' &&
      (data.en as Record<string, unknown>).title,
  );
}

// Función auxiliar para crear datos del artículo
function createArticleData(body: ArticleRequestBody): Omit<IArticle, 'createdAt' | 'updatedAt'> & {
  createdAt: Timestamp;
  updatedAt: Timestamp;
} {
  const now = Timestamp.now();

  return {
    slug: body.slug,
    es: {
      title: body.es.title,
      contentMarkdown: body.es.contentMarkdown || '',
      excerpt: body.es.excerpt || '',
    },
    en: {
      title: body.en.title,
      contentMarkdown: body.en.contentMarkdown || '',
      excerpt: body.en.excerpt || '',
    },
    imageUrl: body.imageUrl || '',
    authorName: body.authorName || 'Brújula Cripto',
    category: body.category || 'general',
    tags: body.tags || [],
    isFeatured: body.isFeatured || false,
    status: body.status || 'draft',
    source: body.source || 'manual',
    createdAt: now,
    updatedAt: now,
  };
}

/**
 * POST /api/articles
 * Crear nuevo artículo (solo admin)
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    // Verificar autenticación
    if (!validateAuth(request)) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 },
      );
    }

    // Parsear y validar datos del artículo
    const body: unknown = await request.json();

    if (!validateArticleData(body)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields: slug, es.title, en.title',
        },
        { status: 400 },
      );
    }

    // Preparar datos del artículo
    const articleData = createArticleData(body);

    // Crear documento en Firestore
    const articlesRef = collection(db, 'articles');
    const docRef = await addDoc(articlesRef, articleData);

    // Obtener el documento creado
    const createdDoc = await getDocs(query(articlesRef, where('__name__', '==', docRef.id)));
    let createdArticle: IArticle | null = null;

    createdDoc.forEach((document) => {
      const data = document.data();
      const article = convertFirestoreDocToArticle(data);
      if (article) {
        createdArticle = article;
      }
    });

    return NextResponse.json({
      success: true,
      data: createdArticle,
      message: 'Article created successfully',
    });
  } catch (error) {
    console.error('Error in POST /api/articles:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
        message: 'Failed to create article',
      },
      { status: 500 },
    );
  }
}

/**
 * PUT /api/articles
 * Actualizar artículo existente (solo admin)
 */
export async function PUT(request: NextRequest): Promise<NextResponse> {
  try {
    // Verificar autenticación
    if (!validateAuth(request)) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 },
      );
    }

    // Parsear datos del artículo
    const body: unknown = await request.json();

    if (!body || typeof body !== 'object' || !('id' in body) || !body.id) {
      return NextResponse.json(
        { success: false, error: 'Article ID is required' },
        { status: 400 },
      );
    }

    const bodyWithId = body as Record<string, unknown> & { id: string };

    // Preparar datos de actualización
    const updateData: Record<string, unknown> = {
      ...bodyWithId,
      updatedAt: Timestamp.now(),
    };

    // Eliminar el ID de los datos de actualización
    delete updateData.id;

    // Actualizar documento en Firestore
    const articleRef = doc(db, 'articles', bodyWithId.id);
    await updateDoc(articleRef, updateData);

    // Obtener el documento actualizado
    const updatedQuery = await getDocs(
      query(collection(db, 'articles'), where('__name__', '==', bodyWithId.id)),
    );
    let updatedArticle: IArticle | null = null;

    updatedQuery.forEach((document) => {
      const data = document.data();
      const article = convertFirestoreDocToArticle(data);
      if (article) {
        updatedArticle = article;
      }
    });

    return NextResponse.json({
      success: true,
      data: updatedArticle,
      message: 'Article updated successfully',
    });
  } catch (error) {
    console.error('Error in PUT /api/articles:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
        message: 'Failed to update article',
      },
      { status: 500 },
    );
  }
}

/**
 * DELETE /api/articles
 * Eliminar artículo (solo admin)
 */
export async function DELETE(request: NextRequest): Promise<NextResponse> {
  try {
    // Verificar autenticación
    if (!validateAuth(request)) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 },
      );
    }

    // Parsear datos
    const body: unknown = await request.json();

    if (!body || typeof body !== 'object' || !('id' in body) || !body.id) {
      return NextResponse.json(
        { success: false, error: 'Article ID is required' },
        { status: 400 },
      );
    }

    const bodyWithId = body as { id: string };

    // Eliminar documento de Firestore
    const articleRef = doc(db, 'articles', bodyWithId.id);
    await deleteDoc(articleRef);

    return NextResponse.json({
      success: true,
      message: 'Article deleted successfully',
    });
  } catch (error) {
    console.error('Error in DELETE /api/articles:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
        message: 'Failed to delete article',
      },
      { status: 500 },
    );
  }
}
