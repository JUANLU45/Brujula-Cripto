// serviceDirectoryHandlers.ts
// Fuente: PROYEC_PARTE1.MD línea 197
import { getAuth } from 'firebase-admin/auth';
import { FieldValue, getFirestore } from 'firebase-admin/firestore';
import { HttpsError, onCall } from 'firebase-functions/v2/https';

// Tipos para las solicitudes
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

// Interfaz según la estructura real usada en ServiceDirectory.tsx (PROYEC_PARTE3.MD)
interface ServiceData {
  name: string;
  description: string;
  website: string;
  logoUrl: string;
  specialties: string[];
  isVerified: boolean;
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
    const { name, description, website, logoUrl, specialties, isVerified } = requestData;

    // Validación de campos requeridos
    if (!name || !description || !website) {
      throw new HttpsError(
        'invalid-argument',
        'Faltan campos requeridos: name, description, website',
      );
    }

    const serviceData: ServiceData = {
      name: name.trim(),
      description: description.trim(),
      website: website.trim(),
      logoUrl: logoUrl?.trim() || '',
      specialties: Array.isArray(specialties) ? specialties : [],
      isVerified: Boolean(isVerified),
    };

    const db = getFirestore();
    const docRef = await db.collection('professionalServices').add({
      ...serviceData,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });

    return {
      success: true,
      serviceId: docRef.id,
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
): Partial<ServiceData> & { updatedAt: FieldValue } => {
  const { name, description, website, logoUrl, specialties, isVerified } = requestData;

  const updateData: Partial<ServiceData> & { updatedAt: FieldValue } = {
    updatedAt: FieldValue.serverTimestamp(),
  };

  // Solo actualizar campos proporcionados
  if (name !== undefined) {
    updateData.name = name.trim();
  }
  if (description !== undefined) {
    updateData.description = description.trim();
  }
  if (website !== undefined) {
    updateData.website = website.trim();
  }
  if (logoUrl !== undefined) {
    updateData.logoUrl = logoUrl.trim();
  }
  if (specialties !== undefined) {
    updateData.specialties = Array.isArray(specialties) ? specialties : [];
  }
  if (isVerified !== undefined) {
    updateData.isVerified = Boolean(isVerified);
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

    const db = getFirestore();
    const serviceRef = db.collection('professionalServices').doc(serviceId);

    // Verificar que el servicio existe
    const serviceDoc = await serviceRef.get();
    if (!serviceDoc.exists) {
      throw new HttpsError('not-found', 'Servicio no encontrado');
    }

    await serviceRef.update(updateData);

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

    const db = getFirestore();
    const serviceRef = db.collection('professionalServices').doc(serviceId);

    // Verificar que el servicio existe
    const serviceDoc = await serviceRef.get();
    if (!serviceDoc.exists) {
      throw new HttpsError('not-found', 'Servicio no encontrado');
    }

    await serviceRef.delete();

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

    const db = getFirestore();
    const servicesSnapshot = await db
      .collection('professionalServices')
      .orderBy('createdAt', 'desc')
      .get();

    const services = servicesSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as ServiceData),
    }));

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

    const db = getFirestore();
    const serviceDoc = await db.collection('professionalServices').doc(serviceId).get();

    if (!serviceDoc.exists) {
      throw new HttpsError('not-found', 'Servicio no encontrado');
    }

    return {
      success: true,
      service: {
        id: serviceDoc.id,
        ...(serviceDoc.data() as ServiceData),
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
