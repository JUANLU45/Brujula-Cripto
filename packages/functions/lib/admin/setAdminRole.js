"use strict";
// setAdminRole.ts
// Fuente: PROYEC_PARTE1.MD línea 195
// Propósito: Asigna rol admin a usuarios
Object.defineProperty(exports, "__esModule", { value: true });
exports.setAdminRole = void 0;
const app_1 = require("firebase-admin/app");
const auth_1 = require("firebase-admin/auth");
const https_1 = require("firebase-functions/v2/https");
// Inicializar Firebase Admin si no está ya inicializado
if (!(0, app_1.getApps)().length) {
    (0, app_1.initializeApp)();
}
exports.setAdminRole = (0, https_1.onCall)(async (request) => {
    var _a, _b;
    // Verificar que el usuario tenga permisos de admin
    if (!((_b = (_a = request.auth) === null || _a === void 0 ? void 0 : _a.token) === null || _b === void 0 ? void 0 : _b.admin)) {
        throw new Error('Sin permisos de administrador');
    }
    const { email, uid } = request.data;
    if (!email && !uid) {
        throw new Error('Debe proporcionar email o uid');
    }
    try {
        let userRecord;
        if (uid) {
            userRecord = await (0, auth_1.getAuth)().getUser(uid);
        }
        else {
            userRecord = await (0, auth_1.getAuth)().getUserByEmail(email);
        }
        // Asignar custom claim de admin
        await (0, auth_1.getAuth)().setCustomUserClaims(userRecord.uid, { admin: true });
        return {
            success: true,
            message: `Rol admin asignado a ${userRecord.email}`,
            uid: userRecord.uid,
        };
    }
    catch (error) {
        console.error('Error asignando rol admin:', error);
        throw new Error('Error asignando rol admin');
    }
});
//# sourceMappingURL=setAdminRole.js.map