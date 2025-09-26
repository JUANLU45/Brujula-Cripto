"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateCost = exports.resetPricingToDefault = exports.updatePricingConfig = exports.getPricingConfig = void 0;
const auth_1 = require("firebase-admin/auth");
const https_1 = require("firebase-functions/v2/https");
const database_1 = require("../lib/database");
/**
 * Verificar si el usuario es administrador
 */
const verifyAdminUser = async (authUser) => {
    var _a;
    if (!authUser) {
        throw new https_1.HttpsError('unauthenticated', 'Usuario no autenticado');
    }
    const auth = (0, auth_1.getAuth)();
    const userRecord = await auth.getUser(authUser.uid);
    if (!((_a = userRecord.customClaims) === null || _a === void 0 ? void 0 : _a.admin)) {
        throw new https_1.HttpsError('permission-denied', 'Acceso denegado: se requieren permisos de administrador');
    }
};
/**
 * Obtener la configuración actual de precios
 */
exports.getPricingConfig = (0, https_1.onCall)(async (request) => {
    try {
        await verifyAdminUser(request.auth);
        const pricingDoc = await database_1.database.getDocument('siteConfig', 'pricing');
        if (!pricingDoc || !pricingDoc.exists) {
            // Retornar configuración por defecto según documentación
            const defaultConfig = {
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
            pricing: pricingDoc.data,
            message: 'Configuración de precios obtenida exitosamente',
        };
    }
    catch (error) {
        console.error('Error al obtener configuración de precios:', error);
        if (error instanceof https_1.HttpsError) {
            throw error;
        }
        throw new https_1.HttpsError('internal', 'Error interno del servidor');
    }
});
/**
 * Valida los precios de entrada
 */
const validatePriceInputs = (firstTwoHoursPrice, additionalHoursPrice) => {
    if (firstTwoHoursPrice !== undefined) {
        if (typeof firstTwoHoursPrice !== 'number' || firstTwoHoursPrice <= 0) {
            throw new https_1.HttpsError('invalid-argument', 'El precio de las primeras 2 horas debe ser un número positivo');
        }
    }
    if (additionalHoursPrice !== undefined) {
        if (typeof additionalHoursPrice !== 'number' || additionalHoursPrice <= 0) {
            throw new https_1.HttpsError('invalid-argument', 'El precio de horas adicionales debe ser un número positivo');
        }
    }
};
/**
 * Obtiene la configuración actual o por defecto
 */
const getCurrentOrDefaultConfig = async () => {
    const currentDoc = await database_1.database.getDocument('siteConfig', 'pricing');
    if (currentDoc && currentDoc.exists) {
        return currentDoc.data;
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
const buildFirstTwoHoursConfig = (currentConfig, firstTwoHoursPrice) => {
    var _a, _b, _c, _d, _e, _f;
    return {
        price: firstTwoHoursPrice !== undefined
            ? firstTwoHoursPrice
            : ((_b = (_a = currentConfig.firstTwoHours) === null || _a === void 0 ? void 0 : _a.price) !== null && _b !== void 0 ? _b : 4.99),
        currency: (_d = (_c = currentConfig.firstTwoHours) === null || _c === void 0 ? void 0 : _c.currency) !== null && _d !== void 0 ? _d : 'EUR',
        description: (_f = (_e = currentConfig.firstTwoHours) === null || _e === void 0 ? void 0 : _e.description) !== null && _f !== void 0 ? _f : 'Precio por hora para las primeras 2 horas',
    };
};
/**
 * Construye la configuración de horas adicionales
 */
const buildAdditionalHoursConfig = (currentConfig, additionalHoursPrice) => {
    var _a, _b, _c, _d, _e, _f;
    return {
        price: additionalHoursPrice !== undefined
            ? additionalHoursPrice
            : ((_b = (_a = currentConfig.additionalHours) === null || _a === void 0 ? void 0 : _a.price) !== null && _b !== void 0 ? _b : 3.99),
        currency: (_d = (_c = currentConfig.additionalHours) === null || _c === void 0 ? void 0 : _c.currency) !== null && _d !== void 0 ? _d : 'EUR',
        description: (_f = (_e = currentConfig.additionalHours) === null || _e === void 0 ? void 0 : _e.description) !== null && _f !== void 0 ? _f : 'Precio por hora para horas adicionales',
    };
};
/**
 * Construye la configuración actualizada
 */
const buildUpdatedConfig = (currentConfig, firstTwoHoursPrice, additionalHoursPrice, authUid) => {
    return {
        firstTwoHours: buildFirstTwoHoursConfig(currentConfig, firstTwoHoursPrice),
        additionalHours: buildAdditionalHoursConfig(currentConfig, additionalHoursPrice),
        lastUpdated: database_1.database.serverTimestamp(),
        updatedBy: authUid !== null && authUid !== void 0 ? authUid : 'unknown',
    };
};
/**
 * Actualizar la configuración de precios
 */
exports.updatePricingConfig = (0, https_1.onCall)(async (request) => {
    var _a;
    try {
        await verifyAdminUser(request.auth);
        const { firstTwoHoursPrice, additionalHoursPrice } = request.data;
        // Validación de datos de entrada
        validatePriceInputs(firstTwoHoursPrice, additionalHoursPrice);
        // Obtener configuración actual
        const currentConfig = await getCurrentOrDefaultConfig();
        // Construir configuración actualizada
        const updatedConfig = buildUpdatedConfig(currentConfig, firstTwoHoursPrice, additionalHoursPrice, (_a = request.auth) === null || _a === void 0 ? void 0 : _a.uid);
        await database_1.database.setDocument('siteConfig', 'pricing', updatedConfig);
        return {
            success: true,
            pricing: Object.assign(Object.assign({}, updatedConfig), { lastUpdated: new Date() }),
            message: 'Configuración de precios actualizada exitosamente',
        };
    }
    catch (error) {
        console.error('Error al actualizar configuración de precios:', error);
        if (error instanceof https_1.HttpsError) {
            throw error;
        }
        throw new https_1.HttpsError('internal', 'Error interno del servidor');
    }
});
/**
 * Resetear precios a valores por defecto
 */
exports.resetPricingToDefault = (0, https_1.onCall)(async (request) => {
    var _a, _b;
    try {
        await verifyAdminUser(request.auth);
        const defaultConfig = {
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
            lastUpdated: database_1.database.serverTimestamp(),
            updatedBy: (_b = (_a = request.auth) === null || _a === void 0 ? void 0 : _a.uid) !== null && _b !== void 0 ? _b : 'unknown',
        };
        await database_1.database.setDocument('siteConfig', 'pricing', defaultConfig);
        return {
            success: true,
            pricing: Object.assign(Object.assign({}, defaultConfig), { lastUpdated: new Date() }),
            message: 'Configuración de precios restablecida a valores por defecto',
        };
    }
    catch (error) {
        console.error('Error al resetear configuración de precios:', error);
        if (error instanceof https_1.HttpsError) {
            throw error;
        }
        throw new https_1.HttpsError('internal', 'Error interno del servidor');
    }
});
/**
 * Calcular costo total basado en horas y configuración actual
 */
exports.calculateCost = (0, https_1.onCall)(async (request) => {
    try {
        // Esta función puede ser usada por usuarios autenticados (no solo admins)
        if (!request.auth) {
            throw new https_1.HttpsError('unauthenticated', 'Usuario no autenticado');
        }
        const { hours } = request.data;
        if (typeof hours !== 'number' || hours <= 0) {
            throw new https_1.HttpsError('invalid-argument', 'Las horas deben ser un número positivo');
        }
        const pricingDoc = await database_1.database.getDocument('siteConfig', 'pricing');
        let pricingConfig;
        if (!pricingDoc || !pricingDoc.exists) {
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
        }
        else {
            pricingConfig = pricingDoc.data;
        }
        // Calcular costo según la lógica documentada
        let totalCost = 0;
        const breakdown = {
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
        }
        else {
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
    }
    catch (error) {
        console.error('Error al calcular costo:', error);
        if (error instanceof https_1.HttpsError) {
            throw error;
        }
        throw new https_1.HttpsError('internal', 'Error interno del servidor');
    }
});
//# sourceMappingURL=adminPriceHandlers.js.map