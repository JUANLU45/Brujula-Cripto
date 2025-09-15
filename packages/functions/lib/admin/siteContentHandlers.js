"use strict";
// siteContentHandlers.ts
// Fuente: PROYEC_PARTE1.MD línea 196
// Propósito: Handlers para editar contenido de homepage (banner, etc.), almacenado en siteContent/homepage
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetHomepageContent = exports.updateHomepageContent = exports.getHomepageContent = void 0;
const app_1 = require("firebase-admin/app");
const firestore_1 = require("firebase-admin/firestore");
const https_1 = require("firebase-functions/v2/https");
// Inicializar Firebase Admin si no está ya inicializado
if (!(0, app_1.getApps)().length) {
    (0, app_1.initializeApp)();
}
const db = (0, firestore_1.getFirestore)();
// Obtener contenido de homepage
exports.getHomepageContent = (0, https_1.onCall)(async () => {
    try {
        const doc = await db.collection('siteContent').doc('homepage').get();
        if (!doc.exists) {
            // Retornar contenido por defecto según TEXTOS_IMAGENES.MD
            const defaultContent = {
                bannerImageUrl: '/images/home/banner-hero.webp',
                bannerTitle_es: 'Navega el Mundo Cripto con Confianza',
                bannerTitle_en: 'Navigate the Crypto World with Confidence',
                bannerSubtitle_es: 'Herramientas reales para proteger y recuperar tus activos digitales. Tu tranquilidad es nuestra misión.',
                bannerSubtitle_en: 'Real tools to protect and recover your digital assets. Your peace of mind is our mission.',
                bannerButtonText_es: 'Empezar Diagnóstico',
                bannerButtonText_en: 'Start Diagnosis',
                bannerButtonLink: '/recuperacion',
            };
            return { success: true, content: defaultContent };
        }
        return { success: true, content: doc.data() };
    }
    catch (error) {
        console.error('Error obteniendo contenido homepage:', error);
        throw new Error('Error obteniendo contenido homepage');
    }
});
// Actualizar contenido de homepage
exports.updateHomepageContent = (0, https_1.onCall)(async (request) => {
    var _a, _b;
    // Verificar permisos de admin
    if (!((_b = (_a = request.auth) === null || _a === void 0 ? void 0 : _a.token) === null || _b === void 0 ? void 0 : _b.admin)) {
        throw new Error('Sin permisos de administrador');
    }
    const contentData = request.data;
    try {
        // Validar campos requeridos
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
        for (const field of requiredFields) {
            if (!(field in contentData)) {
                throw new Error(`Campo requerido faltante: ${field}`);
            }
        }
        // Actualizar en Firestore
        await db.collection('siteContent').doc('homepage').set(contentData, { merge: true });
        return { success: true, message: 'Contenido actualizado correctamente' };
    }
    catch (error) {
        console.error('Error actualizando contenido homepage:', error);
        throw new Error('Error actualizando contenido homepage');
    }
});
// Resetear contenido a valores por defecto
exports.resetHomepageContent = (0, https_1.onCall)(async (request) => {
    var _a, _b;
    // Verificar permisos de admin
    if (!((_b = (_a = request.auth) === null || _a === void 0 ? void 0 : _a.token) === null || _b === void 0 ? void 0 : _b.admin)) {
        throw new Error('Sin permisos de administrador');
    }
    try {
        const defaultContent = {
            bannerImageUrl: '/images/home/banner-hero.webp',
            bannerTitle_es: 'Navega el Mundo Cripto con Confianza',
            bannerTitle_en: 'Navigate the Crypto World with Confidence',
            bannerSubtitle_es: 'Herramientas reales para proteger y recuperar tus activos digitales. Tu tranquilidad es nuestra misión.',
            bannerSubtitle_en: 'Real tools to protect and recover your digital assets. Your peace of mind is our mission.',
            bannerButtonText_es: 'Empezar Diagnóstico',
            bannerButtonText_en: 'Start Diagnosis',
            bannerButtonLink: '/recuperacion',
        };
        await db.collection('siteContent').doc('homepage').set(defaultContent);
        return { success: true, message: 'Contenido reseteado a valores por defecto' };
    }
    catch (error) {
        console.error('Error reseteando contenido homepage:', error);
        throw new Error('Error reseteando contenido homepage');
    }
});
//# sourceMappingURL=siteContentHandlers.js.map