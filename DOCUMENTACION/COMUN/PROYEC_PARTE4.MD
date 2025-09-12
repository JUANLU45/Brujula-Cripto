🤖 PROYECTO: Brújula Cripto - Plan del Microservicio de Contenido IA (VERSIÓN FINAL DE PRODUCCIÓN)

1. Stack Tecnológico

Framework: Genkit for Firebase (TypeScript)
Ejecución: Google Cloud Run (Contenedor Docker)
Modelo IA: Gemini Pro (vía Vertex AI)
Trigger: Google Cloud Scheduler

2. Lógica y Centralización

Prompts Centralizados: Los prompts para Gemini estarán en archivos .txt (/src/prompts) para ser mejorados sin tocar el código.
Tipos Compartidos: Importará IArticle desde @brújula-cripto/types.
Validación Robusta: Se usará Zod para validar la salida final del LLM.

3. Flujo de Ejecución Detallado - Actualizado para i18n

Trigger: Cloud Scheduler llama a la URL de Cloud Run.
fetch-news: El flujo ejecuta la herramienta newsApiTool. Manejo de Errores: Si falla, usa un tema "evergreen" de fallback.
generate-content-es: Carga el prompt, lo formatea para español, y genera title, contentMarkdown, y excerpt en español.
generate-content-en: Carga el prompt, lo formatea para inglés, y genera title, contentMarkdown, y excerpt en inglés.
generate-seo-metadata: Genera un slug único (independiente del idioma), category, y tags basados en el contenido de ambos idiomas.
check-slug-uniqueness: Consulta Firestore para asegurar que el slug no existe. Si existe, añade un sufijo.
assemble-and-validate: Construye el objeto IArticle final con los contenidos de es y en y los metadatos. Valida el objeto completo con Zod.
save-to-firestore: Si la validación pasa, guarda el artículo completo en la base de datos con status: 'draft' y source: 'ai-generated'.
Logging: Cada paso registra su estado en Google Cloud Logging.

4. Seguridad y Configuración

Gestión de Secretos: Las claves de Vertex AI se inyectarán de forma segura en el entorno de Cloud Run a través de Google Secret Manager.
Variables de Entorno: La configuración (Project ID, etc.) se pasará al contenedor de Cloud Run en el momento del despliegue.

5. Mejoras Implementadas para Robustez y Producción 2025
A. Optimización de Carga en Vertex AI

Descripción: En flujo de ejecución, añadir paso post-indexación: Optimizar índice en Vertex AI priorizando documentos de alta relevancia (basado en frecuencia de uso), con limpieza periódica semanal via Scheduler. Añadir en logging: Registro de tamaño de índice para monitoreo.

B. Validación de Respuestas Técnicas

Descripción: Después de assemble-and-validate, añadir paso audit-responses: Implementar auditoría automatizada usando Zod para precisión técnica, con fallback a revisión manual si score <90%. Integrar en flujo sin alterar validación Zod existente.

C. Generación SEO Automatizada

Descripción: En generate-seo-metadata, generar metaetiquetas dinámicas (title, description, keywords) enfocadas a SEO 2025 (usando schema.org, mobile-first indexing). Categorías/tags dinámicos, editables desde admin. Para posts automáticos, opción en admin para foto (sí/no), enlace afiliado, programación de publicación.

D. Moderación Automática de Comentarios

Descripción: Nuevo flujo moderateComment: Analiza comentarios nuevos con OpenAI Moderation o Google Perspective API. Marcar para revisión o eliminar automáticamente basado en config admin (almacenada en Firestore). Trigger por writes en subcolección comments.

E. Adaptación para Uso Externo

Descripción: Añadir endpoints API para embed en otras webs (ej. GET /articles?siteKey=xxx). Monetizar vía suscripciones API (verificar key en Firestore, limitar por quota). Mínimos cambios: Añadir param siteKey en queries, sin alterar flujos internos.
