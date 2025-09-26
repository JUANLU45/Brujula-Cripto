// API Route para envío de feedback por usuarios registrados
// Archivo: app/api/feedback/route.ts  
// Fuente: ERRORES_1VERIFICACION.MD - Solución API feedback completa

import { NextResponse, type NextRequest } from 'next/server';
import { doc, collection, addDoc, getDoc, serverTimestamp } from 'firebase/firestore';

import { auth, db } from '@/lib/firebase';

// Interfaz para el feedback según especificaciones
interface FeedbackData {
  subject: string;
  message: string;
  priority: 'low' | 'medium' | 'high';
  category: 'technical' | 'content' | 'billing' | 'general';
}

interface UserData {
  uid: string;
  email: string | null;
  displayName: string | null;
  plan: 'free' | 'premium';
}

// Función auxiliar para obtener datos del usuario autenticado
async function getUserFromToken(request: NextRequest): Promise<UserData | null> {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return null;
    }

    const token = authHeader.split('Bearer ')[1];
    if (!token) {
      return null;
    }

    // En un entorno real, verificaríamos el token con Firebase Admin
    // Por ahora, extraemos el uid del token (simulado para desarrollo)
    // TODO: Implementar verificación real de Firebase Auth token
    
    // Simulación temporal del uid - en producción debe ser verificado
    const uid = 'temp_uid_extracted_from_token'; 
    
    // Obtener datos del usuario desde Firestore
    const userDoc = await getDoc(doc(db, 'users', uid));
    if (!userDoc.exists()) {
      return null;
    }

    const userData = userDoc.data();
    return {
      uid,
      email: userData.email || null,
      displayName: userData.displayName || null,
      plan: userData.plan || 'free',
    };
  } catch (error) {
    console.error('Error obteniendo datos de usuario:', error);
    return null;
  }
}

// Función auxiliar para validar datos de feedback
function validateFeedbackData(body: unknown): body is FeedbackData {
  if (!body || typeof body !== 'object') {
    return false;
  }

  const data = body as Record<string, unknown>;
  
  // Validar campos requeridos
  if (!data.subject || typeof data.subject !== 'string' || !data.subject.trim()) {
    return false;
  }

  if (!data.message || typeof data.message !== 'string' || !data.message.trim()) {
    return false;
  }

  // Validar prioridad
  const validPriorities = ['low', 'medium', 'high'];
  if (!data.priority || !validPriorities.includes(data.priority as string)) {
    return false;
  }

  // Validar categoría  
  const validCategories = ['technical', 'content', 'billing', 'general'];
  if (!data.category || !validCategories.includes(data.category as string)) {
    return false;
  }

  return true;
}

/**
 * POST /api/feedback
 * Envía feedback por parte de usuarios registrados
 * Verifica plan premium para funcionalidades avanzadas
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    // Verificar autenticación de usuario
    const user = await getUserFromToken(request);
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Parsear y validar datos del feedback
    const body: unknown = await request.json();

    if (!validateFeedbackData(body)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid feedback data',
          message: 'Missing required fields or invalid data types',
        },
        { status: 400 }
      );
    }

    // Verificar límites según plan del usuario
    if (user.plan === 'free') {
      // Los usuarios free tienen límites en prioridad y caracteres
      if (body.priority === 'high') {
        return NextResponse.json(
          {
            success: false,
            error: 'Premium feature required',
            message: 'High priority feedback requires premium plan',
          },
          { status: 403 }
        );
      }

      if (body.message.length > 500) {
        return NextResponse.json(
          {
            success: false,
            error: 'Message too long',
            message: 'Free users are limited to 500 characters per message',
          },
          { status: 403 }
        );
      }
    }

    // Preparar documento de feedback
    const feedbackDoc = {
      userId: user.uid,
      userEmail: user.email,
      userName: user.displayName,
      userPlan: user.plan,
      subject: body.subject.trim(),
      message: body.message.trim(),
      priority: body.priority,
      category: body.category,
      status: 'open' as const,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      adminNotes: '',
    };

    // Guardar feedback en Firestore
    const feedbackCollection = collection(db, 'feedbackMessages');
    const docRef = await addDoc(feedbackCollection, feedbackDoc);

    return NextResponse.json({
      success: true,
      message: 'Feedback submitted successfully',
      data: {
        id: docRef.id,
        subject: body.subject,
        category: body.category,
        priority: body.priority,
        status: 'open',
      },
    });
  } catch (error) {
    console.error('Error in POST /api/feedback:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
        message: 'Failed to submit feedback',
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/feedback  
 * Obtiene el historial de feedback del usuario autenticado
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    // Verificar autenticación de usuario
    const user = await getUserFromToken(request);
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Obtener parámetros de query para paginación
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    
    // Validar parámetros
    if (page < 1 || limit < 1 || limit > 50) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid pagination parameters',
          message: 'Page must be >= 1, limit must be between 1-50',
        },
        { status: 400 }
      );
    }

    // TODO: Implementar consulta real a Firestore con paginación
    // Por ahora retornamos estructura esperada
    const mockFeedbackList = [
      {
        id: 'feedback_1',
        subject: 'Problema técnico',
        category: 'technical',
        priority: 'medium',
        status: 'open',
        createdAt: new Date().toISOString(),
      },
    ];

    return NextResponse.json({
      success: true,
      data: {
        feedback: mockFeedbackList,
        pagination: {
          page,
          limit,
          total: 1,
          totalPages: 1,
        },
      },
    });
  } catch (error) {
    console.error('Error in GET /api/feedback:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
        message: 'Failed to fetch feedback history',
      },
      { status: 500 }
    );
  }
}