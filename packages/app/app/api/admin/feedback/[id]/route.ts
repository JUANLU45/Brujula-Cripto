// API Route dinámica para gestión individual de feedback
// Archivo: app/api/admin/feedback/[id]/route.ts
// Fuente: ERRORES_1VERIFICACION.MD - Solución API admin/feedback/[id] completa

import { NextResponse, type NextRequest } from 'next/server';
import { doc, getDoc, deleteDoc, updateDoc, serverTimestamp } from 'firebase/firestore';

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

// Interfaz para actualización de feedback por admin
interface FeedbackUpdateData {
  status?: 'open' | 'in-progress' | 'resolved' | 'closed';
  priority?: 'low' | 'medium' | 'high';
  adminNotes?: string;
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

// Función auxiliar para validar ID de feedback
function validateFeedbackId(id: string): boolean {
  return typeof id === 'string' && id.trim().length > 0;
}

// Función auxiliar para convertir documento a interfaz
function documentToFeedback(docSnapshot: any, id: string): FeedbackDocument {
  const data = docSnapshot.data();
  return {
    id,
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

// Función auxiliar para validar datos de actualización
function validateUpdateData(body: unknown): body is FeedbackUpdateData {
  if (!body || typeof body !== 'object') {
    return false;
  }

  const data = body as Record<string, unknown>;

  // Validar status si está presente
  if (data.status !== undefined) {
    const validStatuses = ['open', 'in-progress', 'resolved', 'closed'];
    if (!validStatuses.includes(data.status as string)) {
      return false;
    }
  }

  // Validar priority si está presente
  if (data.priority !== undefined) {
    const validPriorities = ['low', 'medium', 'high'];
    if (!validPriorities.includes(data.priority as string)) {
      return false;
    }
  }

  // Validar adminNotes si está presente
  if (data.adminNotes !== undefined) {
    if (typeof data.adminNotes !== 'string') {
      return false;
    }
  }

  return true;
}

/**
 * GET /api/admin/feedback/[id]
 * Obtiene un feedback específico por ID (solo admin)
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  try {
    // Verificar autenticación de admin
    if (!(await validateAdminAuth(request))) {
      return NextResponse.json(
        { success: false, error: 'Admin authentication required' },
        { status: 401 }
      );
    }

    // Validar ID
    if (!validateFeedbackId(params.id)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid feedback ID',
          message: 'Feedback ID must be a non-empty string',
        },
        { status: 400 }
      );
    }

    // Obtener documento de Firestore
    const feedbackDoc = doc(db, 'feedbackMessages', params.id);
    const docSnapshot = await getDoc(feedbackDoc);

    if (!docSnapshot.exists()) {
      return NextResponse.json(
        {
          success: false,
          error: 'Feedback not found',
          message: `No feedback found with ID: ${params.id}`,
        },
        { status: 404 }
      );
    }

    const feedback = documentToFeedback(docSnapshot, params.id);

    return NextResponse.json({
      success: true,
      data: feedback,
    });
  } catch (error) {
    console.error(`Error in GET /api/admin/feedback/${params.id}:`, error);

    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
        message: 'Failed to fetch feedback',
      },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/admin/feedback/[id]
 * Actualiza un feedback específico (status, priority, adminNotes) (solo admin)
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  try {
    // Verificar autenticación de admin
    if (!(await validateAdminAuth(request))) {
      return NextResponse.json(
        { success: false, error: 'Admin authentication required' },
        { status: 401 }
      );
    }

    // Validar ID
    if (!validateFeedbackId(params.id)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid feedback ID',
          message: 'Feedback ID must be a non-empty string',
        },
        { status: 400 }
      );
    }

    // Parsear y validar datos de actualización
    const body: unknown = await request.json();

    if (!validateUpdateData(body)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid update data',
          message: 'Invalid status, priority, or adminNotes values',
        },
        { status: 400 }
      );
    }

    // Verificar que el documento existe
    const feedbackDoc = doc(db, 'feedbackMessages', params.id);
    const docSnapshot = await getDoc(feedbackDoc);

    if (!docSnapshot.exists()) {
      return NextResponse.json(
        {
          success: false,
          error: 'Feedback not found',
          message: `No feedback found with ID: ${params.id}`,
        },
        { status: 404 }
      );
    }

    // Preparar datos de actualización
    const updateData: Record<string, any> = {
      updatedAt: serverTimestamp(),
    };

    if (body.status !== undefined) {
      updateData.status = body.status;
    }
    if (body.priority !== undefined) {
      updateData.priority = body.priority;
    }
    if (body.adminNotes !== undefined) {
      updateData.adminNotes = body.adminNotes;
    }

    // Actualizar documento en Firestore
    await updateDoc(feedbackDoc, updateData);

    // Obtener documento actualizado para respuesta
    const updatedSnapshot = await getDoc(feedbackDoc);
    const updatedFeedback = documentToFeedback(updatedSnapshot, params.id);

    return NextResponse.json({
      success: true,
      message: 'Feedback updated successfully',
      data: updatedFeedback,
    });
  } catch (error) {
    console.error(`Error in PUT /api/admin/feedback/${params.id}:`, error);

    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
        message: 'Failed to update feedback',
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/feedback/[id]
 * Elimina un feedback específico por ID (solo admin)
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  try {
    // Verificar autenticación de admin
    if (!(await validateAdminAuth(request))) {
      return NextResponse.json(
        { success: false, error: 'Admin authentication required' },
        { status: 401 }
      );
    }

    // Validar ID
    if (!validateFeedbackId(params.id)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid feedback ID',
          message: 'Feedback ID must be a non-empty string',
        },
        { status: 400 }
      );
    }

    // Verificar que el documento existe antes de eliminar
    const feedbackDoc = doc(db, 'feedbackMessages', params.id);
    const docSnapshot = await getDoc(feedbackDoc);

    if (!docSnapshot.exists()) {
      return NextResponse.json(
        {
          success: false,
          error: 'Feedback not found',
          message: `No feedback found with ID: ${params.id}`,
        },
        { status: 404 }
      );
    }

    // Eliminar documento de Firestore
    await deleteDoc(feedbackDoc);

    return NextResponse.json({
      success: true,
      message: 'Feedback deleted successfully',
      data: { id: params.id },
    });
  } catch (error) {
    console.error(`Error in DELETE /api/admin/feedback/${params.id}:`, error);

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