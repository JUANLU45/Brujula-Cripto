// serviceDirectoryHandlers.ts
// Fuente: PROYEC_PARTE1.MD línea 197
import { getAuth } from 'firebase-admin/auth';
import { HttpsError, onCall } from 'firebase-functions/v2/https';
import type { IProfessionalService } from '@brujula-cripto/types';
import { database } from '../lib/database';

// Tipos para las solicitudes - ÚNICAMENTE request/response interfaces permitidas localmente
interface CreateServiceRequest {
  name: string;
  description: string;
  website: string;
  logoUrl?: string;
  specialties?: string[];
  isVerified?: boolean;
}

interface UpdateServiceRequest {
  serviceId: string;
  name?: string;
  description?: string;
  website?: string;
  logoUrl?: string;
  specialties?: string[];
  isVerified?: boolean;
}

interface DeleteServiceRequest {
  serviceId: string;
}

interface GetServiceRequest {
  serviceId: string;
}

/**
 * Verificar si el usuario es administrador
 */
const verifyAdminUser = async (authUser: { uid: string } | undefined): Promise<void> => {
  if (!authUser) {
    throw new HttpsError('unauthenticated', 'Usuario no autenticado');
  }

  const auth = getAuth();
  const userRecord = await auth.getUser(authUser.uid);

  if (!userRecord.customClaims?.admin) {
    throw new HttpsError(
      'permission-denied',
      'Acceso denegado: se requieren permisos de administrador',
    );
  }
};

/**
 * Crear un nuevo servicio profesional
 */
export const createService = onCall(async (request) => {
  try {
    await verifyAdminUser(request.auth);

    const requestData = request.data as CreateServiceRequest;
    const { name, description, specialties, isVerified } = requestData;

    // Validación de campos requeridos
    if (!name || !description) {
      throw new HttpsError(
        'invalid-argument',
        'Faltan campos requeridos: name, description',
      );
    }

    const serviceData: Omit<IProfessionalService, 'id' | 'createdAt' | 'updatedAt'> = {
      es: {
        title: name.trim(),
        description: description.trim(),
        features: Array.isArray(specialties) ? specialties : []
      },
      en: {
        title: name.trim(),
        description: description.trim(),
        features: Array.isArray(specialties) ? specialties : []
      },
      price: {
        amount: 0,
        currency: 'EUR' as const,
        period: 'one-time' as const
      },
      isActive: Boolean(isVerified),
      category: 'general'
    };

    const serviceId = await database.addDocument('professionalServices', {
      ...serviceData,
      createdAt: database.serverTimestamp(),
      updatedAt: database.serverTimestamp(),
    });

    return {
      success: true,
      serviceId: serviceId,
      message: 'Servicio creado exitosamente',
    };
  } catch (error) {
    console.error('Error al crear servicio:', error);

    if (error instanceof HttpsError) {
      throw error;
    }

    throw new HttpsError('internal', 'Error interno del servidor');
  }
});

/**
 * Construye el objeto de datos para actualización
 */
const buildUpdateData = (
  requestData: UpdateServiceRequest,
): Partial<IProfessionalService> & { updatedAt: any } => {
  const { name, description, specialties, isVerified } = requestData;

  const updateData: Partial<IProfessionalService> & { updatedAt: any } = {
    updatedAt: database.serverTimestamp(),
  };

  // Actualizar contenido bilingüe si se proporciona
  if (name !== undefined || description !== undefined || specialties !== undefined) {
    const updates: any = {};
    
    if (name !== undefined) {
      updates['es.title'] = name.trim();
      updates['en.title'] = name.trim();
    }
    if (description !== undefined) {
      updates['es.description'] = description.trim();
      updates['en.description'] = description.trim();
    }
    if (specialties !== undefined) {
      updates['es.features'] = Array.isArray(specialties) ? specialties : [];
      updates['en.features'] = Array.isArray(specialties) ? specialties : [];
    }
    
    Object.assign(updateData, updates);
  }
  
  if (isVerified !== undefined) {
    updateData.isActive = Boolean(isVerified);
  }

  return updateData;
};

/**
 * Actualizar un servicio profesional existente
 */
export const updateService = onCall(async (request) => {
  try {
    await verifyAdminUser(request.auth);

    const requestData = request.data as UpdateServiceRequest;
    const { serviceId } = requestData;

    if (!serviceId) {
      throw new HttpsError('invalid-argument', 'ID del servicio es requerido');
    }

    const updateData = buildUpdateData(requestData);

    // Verificar que el servicio existe
    const serviceDoc = await database.getDocument('professionalServices', serviceId);
    if (!serviceDoc || !serviceDoc.exists) {
      throw new HttpsError('not-found', 'Servicio no encontrado');
    }

    await database.updateDocument('professionalServices', serviceId, updateData);

    return {
      success: true,
      message: 'Servicio actualizado exitosamente',
    };
  } catch (error) {
    console.error('Error al actualizar servicio:', error);

    if (error instanceof HttpsError) {
      throw error;
    }

    throw new HttpsError('internal', 'Error interno del servidor');
  }
});

/**
 * Eliminar un servicio profesional
 */
export const deleteService = onCall(async (request) => {
  try {
    await verifyAdminUser(request.auth);

    const requestData = request.data as DeleteServiceRequest;
    const { serviceId } = requestData;

    if (!serviceId) {
      throw new HttpsError('invalid-argument', 'ID del servicio es requerido');
    }

    // Verificar que el servicio existe
    const serviceDoc = await database.getDocument('professionalServices', serviceId);
    if (!serviceDoc || !serviceDoc.exists) {
      throw new HttpsError('not-found', 'Servicio no encontrado');
    }

    await database.deleteDocument('professionalServices', serviceId);

    return {
      success: true,
      message: 'Servicio eliminado exitosamente',
    };
  } catch (error) {
    console.error('Error al eliminar servicio:', error);

    if (error instanceof HttpsError) {
      throw error;
    }

    throw new HttpsError('internal', 'Error interno del servidor');
  }
});

/**
 * Listar todos los servicios profesionales (para administración)
 */
export const listServices = onCall(async (request) => {
  try {
    await verifyAdminUser(request.auth);

    const servicesSnapshot = await database.queryCollection('professionalServices', [], {
      orderBy: { field: 'createdAt', direction: 'desc' }
    });

    const services = servicesSnapshot.map((doc) => {
      const serviceData = doc.data as IProfessionalService;
      return {
        ...serviceData,
        id: doc.id
      };
    });

    return {
      success: true,
      services,
      count: services.length,
    };
  } catch (error) {
    console.error('Error al listar servicios:', error);

    if (error instanceof HttpsError) {
      throw error;
    }

    throw new HttpsError('internal', 'Error interno del servidor');
  }
});

/**
 * Obtener un servicio específico por ID
 */
export const getService = onCall(async (request) => {
  try {
    await verifyAdminUser(request.auth);

    const requestData = request.data as GetServiceRequest;
    const { serviceId } = requestData;

    if (!serviceId) {
      throw new HttpsError('invalid-argument', 'ID del servicio es requerido');
    }

    const serviceDoc = await database.getDocument('professionalServices', serviceId);

    if (!serviceDoc || !serviceDoc.exists) {
      throw new HttpsError('not-found', 'Servicio no encontrado');
    }

    const serviceData = serviceDoc.data as IProfessionalService;
    return {
      success: true,
      service: {
        ...serviceData,
        id: serviceDoc.id
      },
    };
  } catch (error) {
    console.error('Error al obtener servicio:', error);

    if (error instanceof HttpsError) {
      throw error;
    }

    throw new HttpsError('internal', 'Error interno del servidor');
  }
});
