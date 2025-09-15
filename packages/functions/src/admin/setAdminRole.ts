// setAdminRole.ts
// Fuente: PROYEC_PARTE1.MD línea 195
// Propósito: Asigna rol admin a usuarios

import { getApps, initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { onCall } from 'firebase-functions/v2/https';

// Inicializar Firebase Admin si no está ya inicializado
if (!getApps().length) {
  initializeApp();
}

export const setAdminRole = onCall(async (request) => {
  // Verificar que el usuario tenga permisos de admin
  if (!request.auth?.token?.admin) {
    throw new Error('Sin permisos de administrador');
  }

  const { email, uid } = request.data;

  if (!email && !uid) {
    throw new Error('Debe proporcionar email o uid');
  }

  try {
    let userRecord;

    if (uid) {
      userRecord = await getAuth().getUser(uid);
    } else {
      userRecord = await getAuth().getUserByEmail(email);
    }

    // Asignar custom claim de admin
    await getAuth().setCustomUserClaims(userRecord.uid, { admin: true });

    return {
      success: true,
      message: `Rol admin asignado a ${userRecord.email}`,
      uid: userRecord.uid,
    };
  } catch (error) {
    console.error('Error asignando rol admin:', error);
    throw new Error('Error asignando rol admin');
  }
});
