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
  lastUpdated: FirebaseFirestore.Timestamp | FirebaseFirestore.FieldValue | null;
  updatedBy: string;
}

interface CostBreakdown {
  hours: number;
  currency: string;
  firstTwoHoursUsed: number;
  firstTwoHoursCost: number;
  additionalHoursUsed: number;
  additionalHoursCost: number;
  totalCost: number;
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
      pricing: pricingDoc.data() as PricingConfig,
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
 * Valida los precios de entrada
 */
const validatePriceInputs = (firstTwoHoursPrice?: number, additionalHoursPrice?: number): void => {
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
};

/**
 * Obtiene la configuración actual o por defecto
 */
const getCurrentOrDefaultConfig = async (
  db: FirebaseFirestore.Firestore,
): Promise<Partial<PricingConfig>> => {
  const pricingRef = db.collection('siteConfig').doc('pricing');
  const currentDoc = await pricingRef.get();

  if (currentDoc.exists) {
    return currentDoc.data() as PricingConfig;
  }

  // Configuración inicial por defecto
  return {
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
};

/**
 * Construye la configuración de las primeras dos horas
 */
const buildFirstTwoHoursConfig = (
  currentConfig: Partial<PricingConfig>,
  firstTwoHoursPrice?: number,
): { price: number; currency: string; description: string } => {
  return {
    price:
      firstTwoHoursPrice !== undefined
        ? firstTwoHoursPrice
        : (currentConfig.firstTwoHours?.price ?? 4.99),
    currency: currentConfig.firstTwoHours?.currency ?? 'EUR',
    description:
      currentConfig.firstTwoHours?.description ?? 'Precio por hora para las primeras 2 horas',
  };
};

/**
 * Construye la configuración de horas adicionales
 */
const buildAdditionalHoursConfig = (
  currentConfig: Partial<PricingConfig>,
  additionalHoursPrice?: number,
): { price: number; currency: string; description: string } => {
  return {
    price:
      additionalHoursPrice !== undefined
        ? additionalHoursPrice
        : (currentConfig.additionalHours?.price ?? 3.99),
    currency: currentConfig.additionalHours?.currency ?? 'EUR',
    description:
      currentConfig.additionalHours?.description ?? 'Precio por hora para horas adicionales',
  };
};

/**
 * Construye la configuración actualizada
 */
const buildUpdatedConfig = (
  currentConfig: Partial<PricingConfig>,
  firstTwoHoursPrice?: number,
  additionalHoursPrice?: number,
  authUid?: string,
): PricingConfig => {
  return {
    firstTwoHours: buildFirstTwoHoursConfig(currentConfig, firstTwoHoursPrice),
    additionalHours: buildAdditionalHoursConfig(currentConfig, additionalHoursPrice),
    lastUpdated: FieldValue.serverTimestamp(),
    updatedBy: authUid ?? 'unknown',
  };
};

/**
 * Actualizar la configuración de precios
 */
export const updatePricingConfig = onCall(async (request) => {
  try {
    await verifyAdminUser(request.auth);

    const { firstTwoHoursPrice, additionalHoursPrice } = request.data as {
      firstTwoHoursPrice?: number;
      additionalHoursPrice?: number;
    };

    // Validación de datos de entrada
    validatePriceInputs(firstTwoHoursPrice, additionalHoursPrice);

    const db = getFirestore();
    const pricingRef = db.collection('siteConfig').doc('pricing');

    // Obtener configuración actual
    const currentConfig = await getCurrentOrDefaultConfig(db);

    // Construir configuración actualizada
    const updatedConfig = buildUpdatedConfig(
      currentConfig,
      firstTwoHoursPrice,
      additionalHoursPrice,
      request.auth?.uid,
    );

    await pricingRef.set(updatedConfig, { merge: true });

    return {
      success: true,
      pricing: {
        ...updatedConfig,
        lastUpdated: new Date() as unknown as FirebaseFirestore.Timestamp, // Para la respuesta inmediata
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
      updatedBy: request.auth?.uid ?? 'unknown',
    };

    const db = getFirestore();
    await db.collection('siteConfig').doc('pricing').set(defaultConfig);

    return {
      success: true,
      pricing: {
        ...defaultConfig,
        lastUpdated: new Date() as unknown as FirebaseFirestore.Timestamp, // Para la respuesta inmediata
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

    const { hours } = request.data as { hours: number };

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
    const breakdown: CostBreakdown = {
      hours,
      currency: pricingConfig.firstTwoHours.currency,
      firstTwoHoursUsed: 0,
      firstTwoHoursCost: 0,
      additionalHoursUsed: 0,
      additionalHoursCost: 0,
      totalCost: 0,
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
