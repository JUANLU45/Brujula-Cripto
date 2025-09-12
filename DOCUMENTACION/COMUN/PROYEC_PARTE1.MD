<DOCUMENT filename="PROYEC_PARTE1.MD">
🏗️ PROYECTO: Brújula Cripto - Arquitectura Global Unificada (VERSIÓN FINAL DE PRODUCCIÓN)

1. Filosofía del Proyecto
Este proyecto se construye sobre cinco pilares innegociables:

Estructura Centralizada: Un único repositorio (monorepo) para todo el código, gestionado con pnpm workspaces, para forzar la compartición de lógica y tipos.
Consistencia Forzada: Herramientas de linting (ESLint) y formato (Prettier) con reglas estrictas para que todo el código parezca escrito por una sola persona.
Escalabilidad por Diseño: Arquitectura desacoplada que permite que cada parte del sistema crezca de forma independiente.
Dualidad Funcional: Una plataforma con una cara pública para los usuarios y un potente panel de administración seguro para la gestión interna.
Experiencia de Usuario Universal: Soporte nativo para múltiples idiomas (español e inglés), modos de visualización (claro y oscuro) y un diseño 100% adaptable a dispositivos móviles (Mobile-First).

2. Estructura del Monorepo
text/brújula-cripto/
├── packages/
│   ├── app/              # El frontend Next.js (público + admin)
│   ├── functions/        # El backend (Cloud Functions)
│   ├── microservice-ia/  # El microservicio de contenido
│   └── types/            # Paquete COMPARTIDO de tipos de TypeScript
├── .eslintrc.json        # Reglas de linting para TODO el proyecto
├── .prettierrc           # Reglas de formato para TODO el proyecto
└── pnpm-workspace.yaml   # Define los paquetes del monorepo
Ventaja Crítica: El paquete packages/types es la única fuente de verdad para los modelos de datos (IArticle, IUser). Todos los demás paquetes lo importan. Esto elimina por completo los errores de inconsistencia de datos entre el frontend, el backend y los servicios.
3. Mejoras Implementadas para Robustez y Producción 2025
A. Proceso de Actualización para packages/types

Descripción: Para mitigar rigidez, se establece un proceso estricto: Cualquier actualización a tipos (ej. añadir campos) requiere un changelog en /packages/types/CHANGELOG.md, pruebas automatizadas con Jest para validar compatibilidad retroactiva, y revisión por pares antes de merge. Esto se integra en el flujo de trabajo sin alterar tipos existentes.

B. Integración de CI/CD

Descripción: Se añade pipeline de CI/CD usando Google Cloud Build para automatizar pruebas, linting (ESLint), formato (Prettier), y despliegues. Triggers en pushes a main: Ejecuta pnpm test, pnpm lint, y despliega a Cloud Run/Functions si pasa. Configuración en cloudbuild.yaml en raíz del monorepo.

C. Mitigación de Vendor Lock-in

Descripción: Se evalúan alternativas modulares: Para Firestore, preparar abstracciones con interfaces en packages/types que permitan swap a DynamoDB si necesario. Para Cloud Run, usar contenedores Docker estándar para portabilidad a ECS. No se altera dependencia actual, solo se añade sección de evaluación en documentación.

D. Adaptación al Modelo de Monetización por Horas

Descripción: El sistema de monetización se actualiza a un modelo de pago por uso basado en créditos de tiempo (usageCreditsInSeconds). Esto se integra en todos los paquetes mediante tipos compartidos en packages/types, asegurando consistencia. Las abstracciones permiten futuras expansiones sin romper la arquitectura existente.

# 📂 packages/app (Frontend Next.js) - Documentación Detallada por Carpetas

## 1. Estructura General de packages/app

Esta carpeta contiene el frontend completo de la aplicación Next.js, incluyendo rutas públicas, protegidas, componentes, y lógica de API. Se sigue una estructura estricta basada en App Router de Next.js 14+, con soporte para i18n (español/inglés), temas (claro/oscuro), y diseño mobile-first. Todos los componentes usan TypeScript en modo strict, Tailwind CSS para estilos, y importan tipos desde @brújula-cripto/types.

### packages/app/app/

- **[locale]/**: Rutas localizadas para i18n.
  - **(main)/**: Rutas públicas principales.
    - **layout.tsx**: Layout principal para rutas públicas, incluye Navbar.tsx y Footer.tsx.
    - **page.tsx**: Página de Inicio (Home), renderiza HomepageBanner.tsx, FeaturedPostsCarousel.tsx, ValueProposition.tsx, y FeedbackButton.tsx (solo para suscritos).
    - **blog/**:
      - **page.tsx**: Página del Blog, incluye BlogPage.tsx con banner editable, BlogSearchBar.tsx, ArticleList.tsx, y PaginationControls.tsx.
      - **[slug]/page.tsx**: Página de Artículo Individual, usa ArticlePage.tsx con contenido Markdown, tags clicables, navegación anterior/siguiente, sharing (Web Share API), likes/comentarios (solo suscritos).
    - **recuperacion/**:
      - **page.tsx**: Página de Diagnóstico Interactivo, usa RecoveryWizard.tsx con tarjetas enlazadas a herramientas.
      - **password/page.tsx**: Página de Recuperación de Contraseña, usa WasmPasswordEngine.tsx con formulario para datos (diccionarios), niveles gratuito/premium, progreso, y resultados.
    - **herramientas/**:
      - **tracker/page.tsx**: Página de Rastreador de Transacciones, usa TransactionTracker.tsx con formulario para hash/dirección y resultados de APIs externas.
      - **servicios/page.tsx**: Página de Directorio de Servicios, usa ServiceDirectory.tsx con lista filtrable por especialidad.
    - **contacto/**:
      - **page.tsx**: Página de Contacto, usa ContactForm.tsx para enviar nombre/email/mensaje vía Cloud Function.
    - **seguridad/**:
      - **page.tsx**: Página de Guías de Seguridad, usa SecurityGuides.tsx con blog filtrado por categoría "seguridad".
    - **registro/**:
      - **page.tsx**: Página de Registro, usa SignUpForm.tsx con campos email/contraseña, validación (checkbox para términos/privacidad), post-registro redirecciona a /cuenta.
    - **login/**:
      - **page.tsx**: Página de Inicio de Sesión, usa SignInForm.tsx con email/contraseña y Google OAuth (signInWithPopup).
    - **recuperar-password/**:
      - **page.tsx**: Página de Recuperación de Contraseña de Cuenta, usa PasswordResetForm.tsx para enviar email de reset vía Firebase Auth.
    - **suscripcion/**:
      - **page.tsx**: Página de Suscripción, usa PricingPage.tsx con tabla de precios (gratuito vs premium), CompetitorComparison.tsx (tabs interactivos, calculadora para costos con inputs monto/horas, comparación escalonada vs 20% competidores), y UpgradeButton.tsx con checkbox obligatorio para términos/descargo.
    - **legal/**:
      - **aviso-legal/page.tsx**: Página de Aviso Legal, texto estático.
      - **privacidad/page.tsx**: Página de Política de Privacidad, texto estático.
      - **terminos/page.tsx**: Página de Términos y Condiciones, texto estático.
      - **descargo-responsabilidad/page.tsx**: Página de Descargo de Responsabilidad, texto enorme y claro sobre no garantías, responsabilidad del usuario, enlaces visibles en footer y áreas de pago/riesgo.
    - **chatbot/**:
      - **page.tsx**: Página del Chatbot, usa ChatbotUI.tsx con logo brújula, lista de conversaciones, respuestas streaming, sugerencias, render components (tablas/tarjetas), y ConversationList.tsx.
  - **(dashboard)/**: Rutas protegidas (middleware.ts verifica autenticación).
    - **layout.tsx**: Layout para área protegida, incluye navegación adaptativa.
    - **cuenta/**:
      - **page.tsx**: Panel de Control del Usuario, usa UserDashboard.tsx con pestañas para suscripción (tiempo restante H:M:S, historial compras), portal Stripe, y estado premium.
  - **not-found.tsx**: Página de Error 404, usa NotFoundPage.tsx con imagen amigable y mensaje.
- **admin/**: Rutas de administración (protegidas por /admin/auth).
  - **auth/page.tsx**: Página de Login de Admin.
  - **page.tsx**: Dashboard de Admin, vista general de artículos, borradores, estadísticas.
  - **articles/**:
    - **page.tsx**: Gestión de Artículos, usa ArticleDataTable.tsx para ver/filtrar/editar/eliminar, botón para nuevo artículo.
    - **[id]/page.tsx**: Editor de Artículos, usa ArticleEditor.tsx con TipTap para contenido, estado (Borrador/Publicado), enlaces afiliado, imagen portada; opciones IA (prompt Gemini/DALL-E, tamaño palabras, profundidad, Q&A/conclusiones).
  - **homepage/page.tsx**: Gestión de Contenido de la Home, editor para banner (subir imagen, texto, botón).
  - **feedback/page.tsx**: Gestión de Mensajes de Feedback, tabla para ver/eliminar (individual/masiva).
  - **comments/page.tsx**: Moderación de Comentarios, vista para ver/eliminar, integración IA automática.
  - **users/page.tsx**: Gestión de Usuarios, lista con estado, saldo usageCreditsInSeconds (H:M:S), filtros/exportación.

### packages/app/components/

- **ui/**: Componentes reutilizables (ej. Button.tsx, Card.tsx).
- **layout/**: Componentes de layout (ej. Navbar.tsx con enlaces, selector idioma/tema; Footer.tsx con columnas navegación/legal/contacto, acordeón móvil para legales).
- **features/**:
  - **admin/**: Componentes para admin (ej. ArticleDataTable.tsx, ArticleEditor.tsx).
  - **recovery/**: RecoveryWizard.tsx, WasmPasswordEngine.tsx (con reintentos retry-axios, niveles premium).
  - **blog/**: ArticleCard.tsx (imagen, título, excerpt, tags, sharing, likes/comentarios), ArticleList.tsx, BlogSearchBar.tsx, PaginationControls.tsx.
  - **payments/**: PricingTier.tsx, UpgradeButton.tsx (con checkbox obligatorio), CompetitorComparison.tsx (tabs, calculadora interactiva).
  - **homepage/**: HomepageBanner.tsx (editable desde admin), FeaturedPostsCarousel.tsx, ValueProposition.tsx, FeedbackButton.tsx (flotante, modal para mensaje).
  - **tools/**: TransactionTracker.tsx (formulario, resultados APIs, reintentos), ServiceDirectory.tsx (lista filtrable).
  - **contact/**: ContactForm.tsx (con feedback errores localizados via react-hook-form).
  - **auth/**: SignUpForm.tsx, SignInForm.tsx (con Google OAuth mapeo uid a stripeCustomerId), PasswordResetForm.tsx (con feedback).
  - **pricing/**: PricingPage.tsx.
  - **dashboard/**: UserDashboard.tsx.

### packages/app/lib/

- **api.ts**: Lógica para llamadas a backend (Cloud Functions), microservicios (IA, chatbot), y APIs externas; incluye trackUsage para descuento de créditos en tiempo real.

### packages/app/middleware.ts

- Middleware de Next.js para proteger rutas /(dashboard)/*y /admin/*, redirecciona a /login si no autenticado.

### Mejoras para Producción 2025 en packages/app

- Escalabilidad: Reintentos con backoff en TransactionTracker.tsx (retry-axios, max 3, delay 1s).
- Pruebas A/B: En RecoveryWizard.tsx, variar texto/orden con Vercel/Optimizely, métricas en Firestore.
- Pago por Horas: Contadores reales en WasmPasswordEngine.tsx, ChatbotUI.tsx; créditos iniciales (900s herramientas, 1800s chatbot).
- SEO: Metadata API en todas las páginas, JSON-LD para articles.
- Usabilidad: Mensajes de error localizados en formularios (react-hook-form); diseño discreto en footer (acordeón Tailwind móvil).
- Optimización: Compresión imágenes con Sharp, soporte AVIF en next/image; Google Analytics para engagement (eventos en CTAs).

# 📂 packages/functions (Backend Cloud Functions) - Documentación Detallada por Carpetas

## 1. Estructura General de packages/functions

Esta carpeta contiene el backend serverless con Google Cloud Functions, gestionando autenticación, pagos, proxies, y handlers administrativos. Usa TypeScript, importa tipos desde @brújula-cripto/types, y se integra con Firestore, Stripe, y Redis para caché.

### packages/functions/src/

- **admin/**:
  - **articleHandlers.ts**: Handlers para CRUD de artículos (crear/editar/eliminar/publicar), integración IA para moderación comentarios.
  - **setAdminRole.ts**: Asigna rol admin a usuarios.
  - **siteContentHandlers.ts**: Handlers para editar contenido de homepage (banner, etc.), almacenado en siteContent/homepage.
  - **serviceDirectoryHandlers.ts**: CRUD para professionalServices (name, website, description, logoUrl, specialties, isVerified).
  - **priceHandlers.ts**: Actualizar tarifas y paquetes de horas en siteConfig/pricing.
- **payments/**:
  - **createCheckout.ts**: Crea sesión de checkout Stripe para paquetes de horas (compras únicas).
  - **stripeWebhooks.ts**: Maneja eventos Stripe (checkout.session.completed suma usageCreditsInSeconds; subscription.created/updated/deleted actualiza campos user).
  - **createStripePortalSession.ts**: Crea sesión portal Stripe para gestión (facturación, cancelación), verifica autenticación y stripeCustomerId.
- **proxies/**: Proxies para APIs externas (ej. Covalent, Moralis), con caché Redis (TTL 5min) via cache.ts.
- **public/**:
  - **handleContactForm.ts**: Procesa envíos de contacto, guarda en contactSubmissions (name, email, message, submittedAt, status).
- **lib/**:
  - **cache.ts**: Módulo para get/set en Redis (Upstash/Memorystore) para respuestas frecuentes.
  - **trackUsage.ts**: Descuenta usageCreditsInSeconds en tiempo real durante uso de herramientas/chatbot, trigger por eventos usuario.

### packages/functions/firestore.rules

- Reglas de seguridad: Users solo escribibles por owner/admin; professionalServices/sitContent leíbles por todos, escribibles por admin; contactSubmissions solo creables; articles como definido.

### packages/functions/cloudbuild.yaml

- Pipeline CI/CD: Triggers en main, ejecuta pnpm test/lint, despliega a Cloud Functions/Run si pasa.

### Modelo de Datos en Firestore

- **users/**: uid, email, createdAt, usageCreditsInSeconds (inicial 900s herramientas + 1800s chatbot), stripeCustomerId.
- **articles/**: Como definido, con status 'draft'/published, source 'ai-generated'.
- **professionalServices/**: name, website, description, logoUrl, specialties, isVerified.
- **siteContent/**: homepage con bannerImageUrl, bannerTitle_es/en, etc.
- **contactSubmissions/**: name, email, message, submittedAt, status.
- **siteConfig/**: pricing con tarifas (4.99€/h primeras 2h, 3.99€/h siguientes).
- **chatbot_conversations/**: userId, title, isFavorite, createdAt, updatedAt; subcolección messages: role, content, timestamp.

### Mejoras para Producción 2025 en packages/functions

- Gestión Costos: Caché Redis en proxies para APIs externas.
- Métricas: Integración Google Cloud Monitoring/Logging en handlers (latencia, errores, alertas >500ms).
- Pago por Horas: Eliminados hasPremiumAccess/subscription*; focus en usageCreditsInSeconds, trackUsage para descuento.
- Mitigación Vendor Lock-in: Abstracciones en types para swap Firestore/DynamoDB, Docker estándar para portabilidad.

# 📂 packages/microservice-ia (Microservicio de Contenido IA) & packages/types - Documentación Detallada

## 1. Estructura General de packages/microservice-ia

Microservicio independiente en Google Cloud Run (Docker), usa Genkit for Firebase, Gemini Pro (Vertex AI), trigger por Cloud Scheduler. Genera contenido IA, modera comentarios, soporta i18n.

### packages/microservice-ia/src/

- **flows/**:
  - **fetch-news.ts**: Herramienta newsApiTool, fallback a temas evergreen si falla.
  - **generate-content-es.ts**: Genera title/contentMarkdown/excerpt en español.
  - **generate-content-en.ts**: Genera en inglés.
  - **generate-seo-metadata.ts**: Genera slug único, category, tags, metaetiquetas SEO (title/description/keywords, schema.org).
  - **check-slug-uniqueness.ts**: Consulta Firestore para unicidad, añade sufijo si existe.
  - **assemble-and-validate.ts**: Construye IArticle, valida con Zod.
  - **save-to-firestore.ts**: Guarda en articles con status 'draft', source 'ai-generated'.
  - **moderateComment.ts**: Analiza comentarios con OpenAI Moderation/Google Perspective, marca/elimina basado en config admin.
- **prompts/**: Archivos .txt centralizados para prompts Gemini (formateados para es/en).
- **tools/**: getWalletAnalysis, getTransactionStatus, getContractAuditSummary (integración APIs: Covalent, Moralis, GoPlus).

### packages/microservice-ia/Dockerfile

- Contenedor estándar para Cloud Run, inyecta secretos via Google Secret Manager (claves Vertex AI).

### Endpoints API

- GET /articles?siteKey=xxx: Para embed externo, verifica key en Firestore, limita por quota.
- POST /conversations, etc.: Para chatbot (streaming), límites gratuitos (10 msg/día), chequeo usageCreditsInSeconds.

### Mejoras para Producción 2025 en packages/microservice-ia

- Optimización: Post-indexación en Vertex AI, limpieza semanal via Scheduler, logging de tamaño índice.
- Validación: Audit-responses post-Zod para precisión técnica (score <90% a manual).
- Generación SEO: Dinámica para 2025 (mobile-first indexing), opciones admin para foto/afiliado/programación.
- Moderación: Automática en comentarios, config en Firestore.
- Uso Externo: Endpoints monetizados con siteKey.
- Pago por Horas: Chequeo credits en endpoints, upselling si bajos.

## 2. Estructura de packages/types

- **index.ts**: Tipos compartidos (IArticle, IUser con usageCreditsInSeconds, IChatConversation, IChatMessage).
- **CHANGELOG.md**: Registro de actualizaciones, pruebas Jest para compatibilidad retroactiva.

## Raíz del Monorepo

- **pnpm-workspace.yaml**: Define paquetes.
- **.eslintrc.json**: Reglas estrictas para todo.
- **.prettierrc**: Formato consistente.
- **cloudbuild.yaml**: CI/CD global.
