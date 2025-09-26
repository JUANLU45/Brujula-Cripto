"use strict";
// articleHandlers.ts
// Fuente: PROYEC_PARTE1.MD línea 194
// Propósito: Handlers para CRUD de artículos (crear/editar/eliminar/publicar), integración IA para moderación comentarios
Object.defineProperty(exports, "__esModule", { value: true });
exports.listArticles = exports.publishArticle = exports.deleteArticle = exports.updateArticle = exports.createArticle = void 0;
const https_1 = require("firebase-functions/v2/https");
const database_1 = require("../lib/database");
// Crear artículo
exports.createArticle = (0, https_1.onCall)(async (request) => {
    var _a, _b;
    // Verificar permisos de admin
    if (!((_b = (_a = request.auth) === null || _a === void 0 ? void 0 : _a.token) === null || _b === void 0 ? void 0 : _b.admin)) {
        throw new Error('Sin permisos de administrador');
    }
    const articleData = request.data;
    try {
        // Verificar slug único
        if (!articleData.slug) {
            throw new Error('El slug es requerido');
        }
        const existingDoc = await database_1.database.getDocument('articles', articleData.slug);
        if (existingDoc && existingDoc.exists) {
            throw new Error('El slug ya existe');
        }
        // Preparar datos del artículo
        const newArticle = Object.assign(Object.assign({}, articleData), { createdAt: new Date(), updatedAt: new Date(), status: articleData.status || 'draft', source: 'manual' });
        // Guardar en Firestore
        await database_1.database.setDocument('articles', articleData.slug, newArticle);
        return { success: true, slug: articleData.slug };
    }
    catch (error) {
        console.error('Error creando artículo:', error);
        throw new Error('Error creando artículo');
    }
});
// Editar artículo
exports.updateArticle = (0, https_1.onCall)(async (request) => {
    var _a, _b;
    // Verificar permisos de admin
    if (!((_b = (_a = request.auth) === null || _a === void 0 ? void 0 : _a.token) === null || _b === void 0 ? void 0 : _b.admin)) {
        throw new Error('Sin permisos de administrador');
    }
    const { slug, updateData } = request.data;
    try {
        const articleDoc = await database_1.database.getDocument('articles', slug);
        if (!articleDoc || !articleDoc.exists) {
            throw new Error('Artículo no encontrado');
        }
        // Actualizar con timestamp
        const updatedData = Object.assign(Object.assign({}, updateData), { updatedAt: new Date() });
        await database_1.database.updateDocument('articles', slug, updatedData);
        return { success: true, slug };
    }
    catch (error) {
        console.error('Error actualizando artículo:', error);
        throw new Error('Error actualizando artículo');
    }
});
// Eliminar artículo
exports.deleteArticle = (0, https_1.onCall)(async (request) => {
    var _a, _b;
    // Verificar permisos de admin
    if (!((_b = (_a = request.auth) === null || _a === void 0 ? void 0 : _a.token) === null || _b === void 0 ? void 0 : _b.admin)) {
        throw new Error('Sin permisos de administrador');
    }
    const { slug } = request.data;
    try {
        await database_1.database.deleteDocument('articles', slug);
        return { success: true, slug };
    }
    catch (error) {
        console.error('Error eliminando artículo:', error);
        throw new Error('Error eliminando artículo');
    }
});
// Publicar artículo
exports.publishArticle = (0, https_1.onCall)(async (request) => {
    var _a, _b;
    // Verificar permisos de admin
    if (!((_b = (_a = request.auth) === null || _a === void 0 ? void 0 : _a.token) === null || _b === void 0 ? void 0 : _b.admin)) {
        throw new Error('Sin permisos de administrador');
    }
    const { slug } = request.data;
    try {
        const articleDoc = await database_1.database.getDocument('articles', slug);
        if (!articleDoc || !articleDoc.exists) {
            throw new Error('Artículo no encontrado');
        }
        await database_1.database.updateDocument('articles', slug, {
            status: 'published',
            updatedAt: new Date(),
        });
        return { success: true, slug, status: 'published' };
    }
    catch (error) {
        console.error('Error publicando artículo:', error);
        throw new Error('Error publicando artículo');
    }
});
// Listar artículos (con filtros para admin)
exports.listArticles = (0, https_1.onCall)(async (request) => {
    var _a, _b;
    // Verificar permisos de admin
    if (!((_b = (_a = request.auth) === null || _a === void 0 ? void 0 : _a.token) === null || _b === void 0 ? void 0 : _b.admin)) {
        throw new Error('Sin permisos de administrador');
    }
    const { status, limit = 50 } = request.data || {};
    try {
        const filters = [];
        if (status) {
            filters.push({
                field: 'status',
                operator: 'eq',
                value: status
            });
        }
        const queryOptions = {
            orderBy: { field: 'updatedAt', direction: 'desc' },
            limit
        };
        const articles = await database_1.database.queryCollection('articles', filters, queryOptions);
        return { success: true, articles };
    }
    catch (error) {
        console.error('Error listando artículos:', error);
        throw new Error('Error listando artículos');
    }
});
//# sourceMappingURL=articleHandlers.js.map