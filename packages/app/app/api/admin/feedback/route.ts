// API Route para gestión administrativa de feedback
// Archivo: app/api/admin/feedback/route.ts
// Fuente: ERRORES_1VERIFICACION.MD - Solución API admin/feedback completa

import { NextResponse, type NextRequest } from 'next/server';
import {
  collection,
  query,
  orderBy,
  limit,
  startAfter,
  getDocs,
  doc,
  deleteDoc,
  where,
  getCountFromServer,
  DocumentData,
  QueryDocumentSnapshot,
} from 'firebase/firestore';

import { db } from '@/lib/firebase';

// Interfaz para el documento de feedback en Firestore
interface FeedbackDocument {
  id: string;
  userId: string;
  userEmail: string | null;
  userName: string | null;
  userPlan: 'free' | 'premium';
  subject: string;
  message: string;
  priority: 'low' | 'medium' | 'high';
  category: 'technical' | 'content' | 'billing' | 'general';
  status: 'open' | 'in-progress' | 'resolved' | 'closed';
  createdAt: any; // Timestamp de Firebase
  updatedAt: any; // Timestamp de Firebase
  adminNotes: string;
}

// Función auxiliar para validar autenticación de admin
async function validateAdminAuth(request: NextRequest): Promise<boolean> {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return false;
    }

    const token = authHeader.split('Bearer ')[1];
    if (!token) {
      return false;
    }

    // TODO: Verificar token con Firebase Admin y validar claim de admin
    // Por ahora retornamos true para desarrollo, en producción debe validar realmente
    return true;
  } catch (error) {
    console.error('Error validando autenticación admin:', error);
    return false;
  }
}

// Función auxiliar para convertir documento de Firestore a interfaz
function documentToFeedback(doc: QueryDocumentSnapshot<DocumentData>): FeedbackDocument {
  const data = doc.data();
  return {
    id: doc.id,
    userId: data.userId || '',
    userEmail: data.userEmail || null,
    userName: data.userName || null,
    userPlan: data.userPlan || 'free',
    subject: data.subject || '',
    message: data.message || '',
    priority: data.priority || 'low',
    category: data.category || 'general',
    status: data.status || 'open',
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
    adminNotes: data.adminNotes || '',
  };
}

/**
 * GET /api/admin/feedback
 * Lista todos los feedback con filtros y paginación (solo admin)
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    // Verificar autenticación de admin
    if (!(await validateAdminAuth(request))) {
      return NextResponse.json(
        { success: false, error: 'Admin authentication required' },
        { status: 401 }
      );
    }

    // Obtener parámetros de query
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const pageLimit = parseInt(searchParams.get('limit') || '20', 10);
    const statusFilter = searchParams.get('status'); // open, in-progress, resolved, closed
    const priorityFilter = searchParams.get('priority'); // low, medium, high
    const categoryFilter = searchParams.get('category'); // technical, content, billing, general
    const userPlanFilter = searchParams.get('userPlan'); // free, premium

    // Validar parámetros
    if (page < 1 || pageLimit < 1 || pageLimit > 100) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid pagination parameters',
          message: 'Page must be >= 1, limit must be between 1-100',
        },
        { status: 400 }
      );
    }

    // Construir query base
    const feedbackCollection = collection(db, 'feedbackMessages');
    let baseQuery = query(feedbackCollection, orderBy('createdAt', 'desc'));

    // Aplicar filtros si están presentes
    if (statusFilter) {
      baseQuery = query(baseQuery, where('status', '==', statusFilter));
    }
    if (priorityFilter) {
      baseQuery = query(baseQuery, where('priority', '==', priorityFilter));
    }
    if (categoryFilter) {
      baseQuery = query(baseQuery, where('category', '==', categoryFilter));
    }
    if (userPlanFilter) {
      baseQuery = query(baseQuery, where('userPlan', '==', userPlanFilter));
    }

    // Aplicar límite para paginación
    const paginatedQuery = query(baseQuery, limit(pageLimit));

    // Ejecutar consulta
    const querySnapshot = await getDocs(paginatedQuery);
    const feedbackList = querySnapshot.docs.map(documentToFeedback);

    // Obtener conteo total (para paginación)
    const totalCountQuery = query(feedbackCollection);
    const totalCountSnapshot = await getCountFromServer(totalCountQuery);
    const totalCount = totalCountSnapshot.data().count;
    const totalPages = Math.ceil(totalCount / pageLimit);

    return NextResponse.json({
      success: true,
      data: {
        feedback: feedbackList,
        pagination: {
          page,
          limit: pageLimit,
          total: totalCount,
          totalPages,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1,
        },
        filters: {
          status: statusFilter,
          priority: priorityFilter,
          category: categoryFilter,
          userPlan: userPlanFilter,
        },
      },
    });
  } catch (error) {
    console.error('Error in GET /api/admin/feedback:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
        message: 'Failed to fetch feedback list',
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/feedback
 * Elimina múltiples feedback por IDs (solo admin)
 */
export async function DELETE(request: NextRequest): Promise<NextResponse> {
  try {
    // Verificar autenticación de admin
    if (!(await validateAdminAuth(request))) {
      return NextResponse.json(
        { success: false, error: 'Admin authentication required' },
        { status: 401 }
      );
    }

    // Parsear cuerpo con los IDs a eliminar
    const body: unknown = await request.json();
    
    if (!body || typeof body !== 'object') {
      return NextResponse.json(
        { success: false, error: 'Invalid request body' },
        { status: 400 }
      );
    }

    const { ids } = body as { ids?: unknown };

    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid IDs array',
          message: 'Must provide non-empty array of feedback IDs',
        },
        { status: 400 }
      );
    }

    // Validar que todos los elementos sean strings
    if (!ids.every((id) => typeof id === 'string' && id.trim())) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid ID format',
          message: 'All IDs must be non-empty strings',
        },
        { status: 400 }
      );
    }

    // Eliminar documentos de Firestore
    const deletionResults: Array<{ id: string; success: boolean; error?: string }> = [];

    for (const feedbackId of ids) {
      try {
        const feedbackDoc = doc(db, 'feedbackMessages', feedbackId);
        await deleteDoc(feedbackDoc);
        deletionResults.push({ id: feedbackId, success: true });
      } catch (error) {
        console.error(`Error eliminando feedback ${feedbackId}:`, error);
        deletionResults.push({
          id: feedbackId,
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }

    const successCount = deletionResults.filter((result) => result.success).length;
    const failureCount = deletionResults.filter((result) => !result.success).length;

    return NextResponse.json({
      success: failureCount === 0,
      message: `Deleted ${successCount} feedback(s), ${failureCount} failed`,
      data: {
        successCount,
        failureCount,
        results: deletionResults,
      },
    });
  } catch (error) {
    console.error('Error in DELETE /api/admin/feedback:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
        message: 'Failed to delete feedback',
      },
      { status: 500 }
    );
  }
}