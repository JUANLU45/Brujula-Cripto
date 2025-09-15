import { getAuth } from 'firebase-admin/auth';
import { FieldValue, getFirestore } from 'firebase-admin/firestore';
import { HttpsError, onCall } from 'firebase-functions/v2/https';

// Interfaz para la estructura de precios según documentación
interface PricingConfig {
  firstTwoHours: {
    price: number;
    currency: string;
    description: string;
  };
  additionalHours: {
    price: number;
    currency: string;
    description: string;
  };
  lastUpdated: any;
  updatedBy: string;
}

/**
 * Verificar si el usuario es administrador
 */
const verifyAdminUser = async (authUser: any): Promise<void> => {
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
 * Obtener la configuración actual de precios
 */
export const getPricingConfig = onCall(async (request) => {
  try {
    await verifyAdminUser(request.auth);

    const db = getFirestore();
    const pricingDoc = await db.collection('siteConfig').doc('pricing').get();

    if (!pricingDoc.exists) {
      // Retornar configuración por defecto según documentación
      const defaultConfig: PricingConfig = {
        firstTwoHours: {
          price: 4.99,
          currency: 'EUR',
          description: 'Precio por hora para las primeras 2 horas',
        },
        additionalHours: {
          price: 3.99,
          currency: 'EUR',
          description: 'Precio por hora para horas adicionales',
        },
        lastUpdated: null,
        updatedBy: '',
      };

      return {
        success: true,
        pricing: defaultConfig,
        message: 'Configuración por defecto (no encontrada en BD)',
      };
    }

    return {
      success: true,
      pricing: pricingDoc.data(),
      message: 'Configuración de precios obtenida exitosamente',
    };
  } catch (error) {
    console.error('Error al obtener configuración de precios:', error);

    if (error instanceof HttpsError) {
      throw error;
    }

    throw new HttpsError('internal', 'Error interno del servidor');
  }
});

/**
 * Actualizar la configuración de precios
 */
export const updatePricingConfig = onCall(async (request) => {
  try {
    await verifyAdminUser(request.auth);

    const { firstTwoHoursPrice, additionalHoursPrice } = request.data;

    // Validación de datos de entrada
    if (firstTwoHoursPrice !== undefined) {
      if (typeof firstTwoHoursPrice !== 'number' || firstTwoHoursPrice <= 0) {
        throw new HttpsError(
          'invalid-argument',
          'El precio de las primeras 2 horas debe ser un número positivo',
        );
      }
    }

    if (additionalHoursPrice !== undefined) {
      if (typeof additionalHoursPrice !== 'number' || additionalHoursPrice <= 0) {
        throw new HttpsError(
          'invalid-argument',
          'El precio de horas adicionales debe ser un número positivo',
        );
      }
    }

    const db = getFirestore();
    const pricingRef = db.collection('siteConfig').doc('pricing');

    // Obtener configuración actual
    const currentDoc = await pricingRef.get();
    let currentConfig: Partial<PricingConfig> = {};

    if (currentDoc.exists) {
      currentConfig = currentDoc.data() as PricingConfig;
    } else {
      // Configuración inicial por defecto
      currentConfig = {
        firstTwoHours: {
          price: 4.99,
          currency: 'EUR',
          description: 'Precio por hora para las primeras 2 horas',
        },
        additionalHours: {
          price: 3.99,
          currency: 'EUR',
          description: 'Precio por hora para horas adicionales',
        },
      };
    }

    // Actualizar solo los campos proporcionados
    const updatedConfig: PricingConfig = {
      firstTwoHours: {
        ...currentConfig.firstTwoHours!,
        price:
          firstTwoHoursPrice !== undefined
            ? firstTwoHoursPrice
            : currentConfig.firstTwoHours!.price,
      },
      additionalHours: {
        ...currentConfig.additionalHours!,
        price:
          additionalHoursPrice !== undefined
            ? additionalHoursPrice
            : currentConfig.additionalHours!.price,
      },
      lastUpdated: FieldValue.serverTimestamp(),
      updatedBy: request.auth!.uid,
    };

    await pricingRef.set(updatedConfig, { merge: true });

    return {
      success: true,
      pricing: {
        ...updatedConfig,
        lastUpdated: new Date(), // Para la respuesta inmediata
      },
      message: 'Configuración de precios actualizada exitosamente',
    };
  } catch (error) {
    console.error('Error al actualizar configuración de precios:', error);

    if (error instanceof HttpsError) {
      throw error;
    }

    throw new HttpsError('internal', 'Error interno del servidor');
  }
});

/**
 * Resetear precios a valores por defecto
 */
export const resetPricingToDefault = onCall(async (request) => {
  try {
    await verifyAdminUser(request.auth);

    const defaultConfig: PricingConfig = {
      firstTwoHours: {
        price: 4.99,
        currency: 'EUR',
        description: 'Precio por hora para las primeras 2 horas',
      },
      additionalHours: {
        price: 3.99,
        currency: 'EUR',
        description: 'Precio por hora para horas adicionales',
      },
      lastUpdated: FieldValue.serverTimestamp(),
      updatedBy: request.auth!.uid,
    };

    const db = getFirestore();
    await db.collection('siteConfig').doc('pricing').set(defaultConfig);

    return {
      success: true,
      pricing: {
        ...defaultConfig,
        lastUpdated: new Date(), // Para la respuesta inmediata
      },
      message: 'Configuración de precios restablecida a valores por defecto',
    };
  } catch (error) {
    console.error('Error al resetear configuración de precios:', error);

    if (error instanceof HttpsError) {
      throw error;
    }

    throw new HttpsError('internal', 'Error interno del servidor');
  }
});

/**
 * Calcular costo total basado en horas y configuración actual
 */
export const calculateCost = onCall(async (request) => {
  try {
    // Esta función puede ser usada por usuarios autenticados (no solo admins)
    if (!request.auth) {
      throw new HttpsError('unauthenticated', 'Usuario no autenticado');
    }

    const { hours } = request.data;

    if (typeof hours !== 'number' || hours <= 0) {
      throw new HttpsError('invalid-argument', 'Las horas deben ser un número positivo');
    }

    const db = getFirestore();
    const pricingDoc = await db.collection('siteConfig').doc('pricing').get();

    let pricingConfig: PricingConfig;

    if (!pricingDoc.exists) {
      // Usar configuración por defecto
      pricingConfig = {
        firstTwoHours: {
          price: 4.99,
          currency: 'EUR',
          description: 'Precio por hora para las primeras 2 horas',
        },
        additionalHours: {
          price: 3.99,
          currency: 'EUR',
          description: 'Precio por hora para horas adicionales',
        },
        lastUpdated: null,
        updatedBy: '',
      };
    } else {
      pricingConfig = pricingDoc.data() as PricingConfig;
    }

    // Calcular costo según la lógica documentada
    let totalCost = 0;
    let breakdown: any = {
      hours,
      currency: pricingConfig.firstTwoHours.currency,
    };

    if (hours <= 2) {
      totalCost = hours * pricingConfig.firstTwoHours.price;
      breakdown.firstTwoHoursUsed = hours;
      breakdown.firstTwoHoursCost = totalCost;
      breakdown.additionalHoursUsed = 0;
      breakdown.additionalHoursCost = 0;
    } else {
      const firstTwoHoursCost = 2 * pricingConfig.firstTwoHours.price;
      const additionalHours = hours - 2;
      const additionalHoursCost = additionalHours * pricingConfig.additionalHours.price;

      totalCost = firstTwoHoursCost + additionalHoursCost;

      breakdown.firstTwoHoursUsed = 2;
      breakdown.firstTwoHoursCost = firstTwoHoursCost;
      breakdown.additionalHoursUsed = additionalHours;
      breakdown.additionalHoursCost = additionalHoursCost;
    }

    breakdown.totalCost = totalCost;

    return {
      success: true,
      cost: totalCost,
      breakdown,
      pricingRates: {
        firstTwoHours: pricingConfig.firstTwoHours.price,
        additionalHours: pricingConfig.additionalHours.price,
      },
    };
  } catch (error) {
    console.error('Error al calcular costo:', error);

    if (error instanceof HttpsError) {
      throw error;
    }

    throw new HttpsError('internal', 'Error interno del servidor');
  }
});
