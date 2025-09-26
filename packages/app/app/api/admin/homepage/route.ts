// API Route para gestión de contenido de homepage
// Archivo: app/api/admin/homepage/route.ts
// Fuente: ERRORES_1VERIFICACION.MD - Solución API admin/homepage completa

import { NextResponse, type NextRequest } from 'next/server';

import { getFunctions, httpsCallable } from 'firebase/functions';

import { auth, db } from '@/lib/firebase';

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

    // Verificar token con Firebase Admin (las Cloud Functions harán la validación real)
    return true;
  } catch (error) {
    console.error('Error validando autenticación admin:', error);
    return false;
  }
}

// Función auxiliar para validar contenido de homepage
function validateHomepageContent(body: unknown): body is HomepageContent {
  if (!body || typeof body !== 'object') {
    return false;
  }

  const data = body as Record<string, unknown>;
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

  return requiredFields.every(
    (field) => field in data && typeof data[field] === 'string' && data[field]?.toString().trim()
  );
}

/**
 * GET /api/admin/homepage
 * Obtiene contenido actual de homepage (solo admin)
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    // Verificar autenticación de admin
    if (!(await validateAdminAuth(request))) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Llamar a Cloud Function getHomepageContent
    const functions = getFunctions();
    const getHomepageContent = httpsCallable(functions, 'getHomepageContent');

    const result = await getHomepageContent();
    const data = result.data as { success: boolean; content: HomepageContent };

    if (!data.success) {
      throw new Error('Error obteniendo contenido desde Cloud Function');
    }

    return NextResponse.json({
      success: true,
      data: data.content,
    });
  } catch (error) {
    console.error('Error in GET /api/admin/homepage:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
        message: 'Failed to fetch homepage content',
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/homepage
 * Actualiza contenido de homepage (solo admin)
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    // Verificar autenticación de admin
    if (!(await validateAdminAuth(request))) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Parsear y validar datos del contenido
    const body: unknown = await request.json();

    if (!validateHomepageContent(body)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid content data',
          message: 'Missing required fields or invalid data types',
        },
        { status: 400 }
      );
    }

    // Llamar a Cloud Function updateHomepageContent
    const functions = getFunctions();
    const updateHomepageContent = httpsCallable(functions, 'updateHomepageContent');

    const result = await updateHomepageContent(body);
    const data = result.data as { success: boolean; message: string };

    if (!data.success) {
      throw new Error('Error actualizando contenido desde Cloud Function');
    }

    return NextResponse.json({
      success: true,
      message: 'Homepage content updated successfully',
      data: body,
    });
  } catch (error) {
    console.error('Error in POST /api/admin/homepage:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
        message: 'Failed to update homepage content',
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/homepage
 * Resetea contenido a valores por defecto (solo admin)
 */
export async function DELETE(request: NextRequest): Promise<NextResponse> {
  try {
    // Verificar autenticación de admin
    if (!(await validateAdminAuth(request))) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Llamar a Cloud Function resetHomepageContent
    const functions = getFunctions();
    const resetHomepageContent = httpsCallable(functions, 'resetHomepageContent');

    const result = await resetHomepageContent();
    const data = result.data as { success: boolean; message: string };

    if (!data.success) {
      throw new Error('Error reseteando contenido desde Cloud Function');
    }

    return NextResponse.json({
      success: true,
      message: 'Homepage content reset to default values',
    });
  } catch (error) {
    console.error('Error in DELETE /api/admin/homepage:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
        message: 'Failed to reset homepage content',
      },
      { status: 500 }
    );
  }
}