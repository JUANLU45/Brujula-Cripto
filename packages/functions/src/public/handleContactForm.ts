// handleContactForm.ts
// Fuente: PROYEC_PARTE1.MD línea 213
// Propósito: Procesa envíos de contacto, guarda en contactSubmissions (name, email, message, submittedAt, status)

import { setGlobalOptions } from 'firebase-functions/v2';
import { onRequest } from 'firebase-functions/v2/https';
import * as z from 'zod';
import { database } from '../lib/database';

// Configuración global para Cloud Functions v2
setGlobalOptions({ region: 'europe-west1' });

// Tipos para errores de validación de Zod
interface ValidationErrorDetails {
  field: string;
  message: string;
}

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
          details: validationResult.error.issues.map(
            (err: z.ZodIssue): ValidationErrorDetails => ({
              field: err.path.join('.'),
              message: err.message,
            }),
          ),
          code: 'VALIDATION_ERROR',
        });
        return;
      }

      const { name, email, message } = validationResult.data;

      // Preparar documento para Firestore
      // Crear objeto para guardar en Firestore
      const contactSubmission = {
        name: name.trim(),
        email: email.toLowerCase().trim(),
        message: message.trim(),
        submittedAt: database.serverTimestamp(),
        status: 'new' as SubmissionStatus,
      };

      // Guardar en Firestore
      const submissionId = await database.addDocument('contactSubmissions', contactSubmission);

      console.log(
        `Contact form submitted successfully. Document ID: ${submissionId}, Email: ${email}`,
      );

      // Respuesta exitosa
      response.status(200).json({
        success: true,
        message: 'Formulario de contacto enviado exitosamente',
        submissionId: submissionId,
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
