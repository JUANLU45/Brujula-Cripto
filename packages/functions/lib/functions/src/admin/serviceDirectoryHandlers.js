"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getService = exports.listServices = exports.deleteService = exports.updateService = exports.createService = void 0;
// serviceDirectoryHandlers.ts
// Fuente: PROYEC_PARTE1.MD línea 197
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
 * Crear un nuevo servicio profesional
 */
exports.createService = (0, https_1.onCall)(async (request) => {
    try {
        await verifyAdminUser(request.auth);
        const requestData = request.data;
        const { name, description, website, logoUrl, specialties, isVerified } = requestData;
        // Validación de campos requeridos
        if (!name || !description || !website) {
            throw new https_1.HttpsError('invalid-argument', 'Faltan campos requeridos: name, description, website');
        }
        const serviceData = {
            name: name.trim(),
            description: description.trim(),
            website: website.trim(),
            logoUrl: (logoUrl === null || logoUrl === void 0 ? void 0 : logoUrl.trim()) || '',
            specialties: Array.isArray(specialties) ? specialties : [],
            isVerified: Boolean(isVerified),
        };
        const serviceId = await database_1.database.addDocument('professionalServices', Object.assign(Object.assign({}, serviceData), { createdAt: database_1.database.serverTimestamp(), updatedAt: database_1.database.serverTimestamp() }));
        return {
            success: true,
            serviceId: serviceId,
            message: 'Servicio creado exitosamente',
        };
    }
    catch (error) {
        console.error('Error al crear servicio:', error);
        if (error instanceof https_1.HttpsError) {
            throw error;
        }
        throw new https_1.HttpsError('internal', 'Error interno del servidor');
    }
});
/**
 * Construye el objeto de datos para actualización
 */
const buildUpdateData = (requestData) => {
    const { name, description, website, logoUrl, specialties, isVerified } = requestData;
    const updateData = {
        updatedAt: database_1.database.serverTimestamp(),
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
exports.updateService = (0, https_1.onCall)(async (request) => {
    try {
        await verifyAdminUser(request.auth);
        const requestData = request.data;
        const { serviceId } = requestData;
        if (!serviceId) {
            throw new https_1.HttpsError('invalid-argument', 'ID del servicio es requerido');
        }
        const updateData = buildUpdateData(requestData);
        // Verificar que el servicio existe
        const serviceDoc = await database_1.database.getDocument('professionalServices', serviceId);
        if (!serviceDoc || !serviceDoc.exists) {
            throw new https_1.HttpsError('not-found', 'Servicio no encontrado');
        }
        await database_1.database.updateDocument('professionalServices', serviceId, updateData);
        return {
            success: true,
            message: 'Servicio actualizado exitosamente',
        };
    }
    catch (error) {
        console.error('Error al actualizar servicio:', error);
        if (error instanceof https_1.HttpsError) {
            throw error;
        }
        throw new https_1.HttpsError('internal', 'Error interno del servidor');
    }
});
/**
 * Eliminar un servicio profesional
 */
exports.deleteService = (0, https_1.onCall)(async (request) => {
    try {
        await verifyAdminUser(request.auth);
        const requestData = request.data;
        const { serviceId } = requestData;
        if (!serviceId) {
            throw new https_1.HttpsError('invalid-argument', 'ID del servicio es requerido');
        }
        // Verificar que el servicio existe
        const serviceDoc = await database_1.database.getDocument('professionalServices', serviceId);
        if (!serviceDoc || !serviceDoc.exists) {
            throw new https_1.HttpsError('not-found', 'Servicio no encontrado');
        }
        await database_1.database.deleteDocument('professionalServices', serviceId);
        return {
            success: true,
            message: 'Servicio eliminado exitosamente',
        };
    }
    catch (error) {
        console.error('Error al eliminar servicio:', error);
        if (error instanceof https_1.HttpsError) {
            throw error;
        }
        throw new https_1.HttpsError('internal', 'Error interno del servidor');
    }
});
/**
 * Listar todos los servicios profesionales (para administración)
 */
exports.listServices = (0, https_1.onCall)(async (request) => {
    try {
        await verifyAdminUser(request.auth);
        const servicesSnapshot = await database_1.database.queryCollection('professionalServices', [], {
            orderBy: { field: 'createdAt', direction: 'desc' }
        });
        const services = servicesSnapshot.map((doc) => (Object.assign({ id: doc.id }, doc.data)));
        return {
            success: true,
            services,
            count: services.length,
        };
    }
    catch (error) {
        console.error('Error al listar servicios:', error);
        if (error instanceof https_1.HttpsError) {
            throw error;
        }
        throw new https_1.HttpsError('internal', 'Error interno del servidor');
    }
});
/**
 * Obtener un servicio específico por ID
 */
exports.getService = (0, https_1.onCall)(async (request) => {
    try {
        await verifyAdminUser(request.auth);
        const requestData = request.data;
        const { serviceId } = requestData;
        if (!serviceId) {
            throw new https_1.HttpsError('invalid-argument', 'ID del servicio es requerido');
        }
        const serviceDoc = await database_1.database.getDocument('professionalServices', serviceId);
        if (!serviceDoc || !serviceDoc.exists) {
            throw new https_1.HttpsError('not-found', 'Servicio no encontrado');
        }
        return {
            success: true,
            service: Object.assign({ id: serviceDoc.id }, serviceDoc.data),
        };
    }
    catch (error) {
        console.error('Error al obtener servicio:', error);
        if (error instanceof https_1.HttpsError) {
            throw error;
        }
        throw new https_1.HttpsError('internal', 'Error interno del servidor');
    }
});
//# sourceMappingURL=serviceDirectoryHandlers.js.map