'use strict';
// handleContactForm.ts
// Fuente: PROYEC_PARTE1.MD línea 213
// Propósito: Procesa envíos de contacto, guarda en contactSubmissions (name, email, message, submittedAt, status)
var __createBinding =
  (this && this.__createBinding) ||
  (Object.create
    ? function (o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        var desc = Object.getOwnPropertyDescriptor(m, k);
        if (!desc || ('get' in desc ? !m.__esModule : desc.writable || desc.configurable)) {
          desc = {
            enumerable: true,
            get: function () {
              return m[k];
            },
          };
        }
        Object.defineProperty(o, k2, desc);
      }
    : function (o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        o[k2] = m[k];
      });
var __setModuleDefault =
  (this && this.__setModuleDefault) ||
  (Object.create
    ? function (o, v) {
        Object.defineProperty(o, 'default', { enumerable: true, value: v });
      }
    : function (o, v) {
        o['default'] = v;
      });
var __importStar =
  (this && this.__importStar) ||
  (function () {
    var ownKeys = function (o) {
      ownKeys =
        Object.getOwnPropertyNames ||
        function (o) {
          var ar = [];
          for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
          return ar;
        };
      return ownKeys(o);
    };
    return function (mod) {
      if (mod && mod.__esModule) return mod;
      var result = {};
      if (mod != null)
        for (var k = ownKeys(mod), i = 0; i < k.length; i++)
          if (k[i] !== 'default') __createBinding(result, mod, k[i]);
      __setModuleDefault(result, mod);
      return result;
    };
  })();
Object.defineProperty(exports, '__esModule', { value: true });
exports.handleContactForm = void 0;
const app_1 = require('firebase-admin/app');
const firestore_1 = require('firebase-admin/firestore');
const v2_1 = require('firebase-functions/v2');
const https_1 = require('firebase-functions/v2/https');
const z = __importStar(require('zod'));
// Configuración global para Cloud Functions v2
(0, v2_1.setGlobalOptions)({ region: 'europe-west1' });
// Inicializar Firebase Admin
const app = (0, app_1.initializeApp)();
const db = (0, firestore_1.getFirestore)(app);
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
exports.handleContactForm = (0, https_1.onRequest)(
  {
    cors: true, // Permitir todos los orígenes por simplicidad
    maxInstances: 10,
    memory: '256MiB',
    timeoutSeconds: 30,
  },
  async (request, response) => {
    var _a;
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
      if (
        !((_a = request.headers['content-type']) === null || _a === void 0
          ? void 0
          : _a.includes('application/json'))
      ) {
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
          details: validationResult.error.issues.map((err) => ({
            field: err.path.join('.'),
            message: err.message,
          })),
          code: 'VALIDATION_ERROR',
        });
        return;
      }
      const { name, email, message } = validationResult.data;
      // Preparar documento para Firestore
      const contactSubmission = {
        name: name.trim(),
        email: email.toLowerCase().trim(),
        message: message.trim(),
        submittedAt: new Date(), // Firestore convertirá automáticamente
        status: 'new',
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
//# sourceMappingURL=handleContactForm.js.map
