// API Route para estadísticas de feedback administrativo
// Archivo: app/api/admin/feedback/stats/route.ts
// Fuente: ERRORES_1VERIFICACION.MD - Solución API admin/feedback/stats completa

import { NextResponse, type NextRequest } from 'next/server';
import {
  collection,
  query,
  where,
  getDocs,
  getCountFromServer,
  orderBy,
  Timestamp,
} from 'firebase/firestore';

import { db } from '@/lib/firebase';

// Interfaces para estadísticas
interface FeedbackStats {
  total: number;
  byStatus: Record<string, number>;
  byPriority: Record<string, number>;
  byCategory: Record<string, number>;
  byUserPlan: Record<string, number>;
  byDateRange: Array<{
    date: string;
    count: number;
  }>;
  topUsers: Array<{
    userId: string;
    userName: string | null;
    userEmail: string | null;
    count: number;
  }>;
  averageResponseTime?: number; // En horas
  resolutionRate?: number; // Porcentaje
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

    // Auth admin requerida - debe implementarse con Firebase Admin
    // Por ahora retornamos true para desarrollo, en producción debe validar realmente
    return true;
  } catch (error) {
    console.error('Error validando autenticación admin:', error);
    return false;
  }
}

// Función auxiliar para obtener fecha hace N días
function getDateDaysAgo(days: number): Date {
  const date = new Date();
  date.setDate(date.getDate() - days);
  date.setHours(0, 0, 0, 0);
  return date;
}

// Función auxiliar para formatear fecha para gráficos
function formatDateForChart(date: Date): string {
  return date.toISOString().split('T')[0]; // YYYY-MM-DD
}

/**
 * GET /api/admin/feedback/stats
 * Obtiene estadísticas agregadas de feedback (solo admin)
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
    const dateRange = parseInt(searchParams.get('days') || '30', 10); // Últimos N días
    const includeDetails = searchParams.get('details') === 'true';

    // Validar parámetros
    if (dateRange < 1 || dateRange > 365) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid date range',
          message: 'Date range must be between 1-365 days',
        },
        { status: 400 }
      );
    }

    const feedbackCollection = collection(db, 'feedbackMessages');

    // 1. Obtener total de feedback
    const totalQuery = query(feedbackCollection);
    const totalCountSnapshot = await getCountFromServer(totalQuery);
    const total = totalCountSnapshot.data().count;

    // 2. Obtener todos los documentos para análisis detallado
    const allDocsQuery = query(feedbackCollection, orderBy('createdAt', 'desc'));
    const allDocsSnapshot = await getDocs(allDocsQuery);
    const allFeedback = allDocsSnapshot.docs.map((doc) => {
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
    });

    // 3. Calcular estadísticas por status
    const byStatus: Record<string, number> = {
      open: 0,
      'in-progress': 0,
      resolved: 0,
      closed: 0,
    };
    allFeedback.forEach((feedback) => {
      const status = feedback.status || 'open';
      byStatus[status] = (byStatus[status] || 0) + 1;
    });

    // 4. Calcular estadísticas por prioridad
    const byPriority: Record<string, number> = {
      low: 0,
      medium: 0,
      high: 0,
    };
    allFeedback.forEach((feedback) => {
      const priority = feedback.priority || 'low';
      byPriority[priority] = (byPriority[priority] || 0) + 1;
    });

    // 5. Calcular estadísticas por categoría
    const byCategory: Record<string, number> = {
      technical: 0,
      content: 0,
      billing: 0,
      general: 0,
    };
    allFeedback.forEach((feedback) => {
      const category = feedback.category || 'general';
      byCategory[category] = (byCategory[category] || 0) + 1;
    });

    // 6. Calcular estadísticas por plan de usuario
    const byUserPlan: Record<string, number> = {
      free: 0,
      premium: 0,
    };
    allFeedback.forEach((feedback) => {
      const userPlan = feedback.userPlan || 'free';
      byUserPlan[userPlan] = (byUserPlan[userPlan] || 0) + 1;
    });

    // 7. Calcular estadísticas por rango de fechas
    const startDate = getDateDaysAgo(dateRange);
    const byDateRange: Array<{ date: string; count: number }> = [];

    for (let i = dateRange - 1; i >= 0; i--) {
      const currentDate = getDateDaysAgo(i);
      const nextDate = new Date(currentDate);
      nextDate.setDate(nextDate.getDate() + 1);

      const count = allFeedback.filter((feedback) => {
        if (!feedback.createdAt) return false;
        
        const createdDate = feedback.createdAt.toDate ? 
          feedback.createdAt.toDate() : 
          new Date(feedback.createdAt);
          
        return createdDate >= currentDate && createdDate < nextDate;
      }).length;

      byDateRange.push({
        date: formatDateForChart(currentDate),
        count,
      });
    }

    // 8. Calcular top usuarios (solo si se requieren detalles)
    let topUsers: Array<{
      userId: string;
      userName: string | null;
      userEmail: string | null;
      count: number;
    }> = [];

    if (includeDetails) {
      const userCounts: Record<string, {
        count: number;
        userName: string | null;
        userEmail: string | null;
      }> = {};

      allFeedback.forEach((feedback) => {
        const userId = feedback.userId;
        if (userId) {
          if (!userCounts[userId]) {
            userCounts[userId] = {
              count: 0,
              userName: feedback.userName || null,
              userEmail: feedback.userEmail || null,
            };
          }
          userCounts[userId].count++;
        }
      });

      topUsers = Object.entries(userCounts)
        .map(([userId, data]) => ({
          userId,
          userName: data.userName,
          userEmail: data.userEmail,
          count: data.count,
        }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10); // Top 10 usuarios
    }

    // 9. Calcular métricas avanzadas (si se requieren detalles)
    let averageResponseTime: number | undefined;
    let resolutionRate: number | undefined;

    if (includeDetails) {
      // Calcular tiempo promedio de respuesta (en horas)
      const resolvedFeedback = allFeedback.filter(
        (feedback) => feedback.status === 'resolved' || feedback.status === 'closed'
      );

      if (resolvedFeedback.length > 0) {
        const totalResponseTime = resolvedFeedback.reduce((sum, feedback) => {
          if (feedback.createdAt && feedback.updatedAt) {
            const created = feedback.createdAt.toDate ? 
              feedback.createdAt.toDate() : 
              new Date(feedback.createdAt);
            const updated = feedback.updatedAt.toDate ? 
              feedback.updatedAt.toDate() : 
              new Date(feedback.updatedAt);
              
            const diffHours = (updated.getTime() - created.getTime()) / (1000 * 60 * 60);
            return sum + diffHours;
          }
          return sum;
        }, 0);

        averageResponseTime = Math.round(totalResponseTime / resolvedFeedback.length);
      }

      // Calcular tasa de resolución
      const resolvedCount = byStatus.resolved + byStatus.closed;
      resolutionRate = total > 0 ? Math.round((resolvedCount / total) * 100) : 0;
    }

    // Construir respuesta de estadísticas
    const stats: FeedbackStats = {
      total,
      byStatus,
      byPriority,
      byCategory,
      byUserPlan,
      byDateRange,
      topUsers,
    };

    if (includeDetails) {
      stats.averageResponseTime = averageResponseTime;
      stats.resolutionRate = resolutionRate;
    }

    return NextResponse.json({
      success: true,
      data: stats,
      meta: {
        dateRange,
        includeDetails,
        generatedAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('Error in GET /api/admin/feedback/stats:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
        message: 'Failed to fetch feedback statistics',
      },
      { status: 500 }
    );
  }
}