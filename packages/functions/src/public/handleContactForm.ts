// handleContactForm.ts
// Fuente: PROYEC_PARTE1.MD línea 213
// Propósito: Procesa envíos de contacto, guarda en contactSubmissions (name, email, message, submittedAt, status)

import { initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { setGlobalOptions } from 'firebase-functions/v2';
import { onRequest } from 'firebase-functions/v2/https';
import * as z from 'zod';

// Configuración global para Cloud Functions v2
setGlobalOptions({ region: 'europe-west1' });

// Inicializar Firebase Admin
const app = initializeApp();
const db = getFirestore(app);

// Schema de validación para datos de contacto
const ContactFormSchema = z.object({
  name: z
    .string()
    .min(2, 'Nombre debe tener al menos 2 caracteres')
    .max(100, 'Nombre demasiado largo'),
  email: z.string().email('Email inválido').max(254, 'Email demasiado largo'),
  message: z
    .string()
    .min(10, 'Mensaje debe tener al menos 10 caracteres')
    .max(2000, 'Mensaje demasiado largo'),
});

// Tipo para el estado de la submission
type SubmissionStatus = 'new' | 'read';

// Interfaz para el documento de contactSubmissions
interface IContactSubmission {
  name: string;
  email: string;
  message: string;
  submittedAt: FirebaseFirestore.Timestamp;
  status: SubmissionStatus;
}

/**
 * Cloud Function para procesar envíos del formulario de contacto
 * Fuente: PROYEC_PARTE1.MD línea 213
 *
 * Guarda en colección contactSubmissions:
 * - name (string)
 * - email (string)
 * - message (string)
 * - submittedAt (timestamp)
 * - status ('new' | 'read')
 */
export const handleContactForm = onRequest(
  {
    cors: true, // Permitir todos los orígenes por simplicidad
    maxInstances: 10,
    memory: '256MiB',
    timeoutSeconds: 30,
  },
  async (request, response) => {
    try {
      // Solo permitir POST requests
      if (request.method !== 'POST') {
        response.status(405).json({
          success: false,
          error: 'Método no permitido. Solo POST.',
          code: 'METHOD_NOT_ALLOWED',
        });
        return;
      }

      // Validar Content-Type
      if (!request.headers['content-type']?.includes('application/json')) {
        response.status(400).json({
          success: false,
          error: 'Content-Type debe ser application/json',
          code: 'INVALID_CONTENT_TYPE',
        });
        return;
      }

      // Validar datos del formulario con Zod
      const validationResult = ContactFormSchema.safeParse(request.body);

      if (!validationResult.success) {
        response.status(400).json({
          success: false,
          error: 'Datos del formulario inválidos',
          details: validationResult.error.issues.map((err: any) => ({
            field: err.path.join('.'),
            message: err.message,
          })),
          code: 'VALIDATION_ERROR',
        });
        return;
      }

      const { name, email, message } = validationResult.data;

      // Preparar documento para Firestore
      const contactSubmission: IContactSubmission = {
        name: name.trim(),
        email: email.toLowerCase().trim(),
        message: message.trim(),
        submittedAt: new Date() as any, // Firestore convertirá automáticamente
        status: 'new' as SubmissionStatus,
      };

      // Guardar en Firestore
      const docRef = await db.collection('contactSubmissions').add(contactSubmission);

      console.log(
        `Contact form submitted successfully. Document ID: ${docRef.id}, Email: ${email}`,
      );

      // Respuesta exitosa
      response.status(200).json({
        success: true,
        message: 'Formulario de contacto enviado exitosamente',
        submissionId: docRef.id,
      });
    } catch (error) {
      console.error('Error procesando formulario de contacto:', error);

      // Error interno del servidor
      response.status(500).json({
        success: false,
        error: 'Error interno del servidor',
        code: 'INTERNAL_ERROR',
      });
    }
  },
);
