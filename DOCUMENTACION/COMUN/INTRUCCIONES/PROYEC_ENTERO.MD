DOCUMENT filename="PROYEC_PARTE1.MD">
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
</DOCUMENT>

<DOCUMENT filename="PROYEC_PARTE2.MD">
# 🟦 PROYEC_PARTE2_FINAL_V3.MD (Frontend)

## 1. Stack Tecnológico (Sin cambios)

- **Framework:** Next.js 14+ (App Router)
- **Lenguaje:** TypeScript (`strict` mode)
- **Estilos:** Tailwind CSS
- ... (resto de tecnologías)

## 2. Principios de Diseño (Sin cambios)

- **Mobile-First** y **Accesibilidad (a11y)**.

## 3. Estructura de Carpetas y Nombres de Componentes (`packages/app`) - **ACTUALIZADO**

```
/packages/app/
├── app/
│   ├── [locale]/
│   │   ├── (main)/
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx          # Página de Inicio (Home)
│   │   │   ├── blog/
│   │   │   │   ├── page.tsx
│   │   │   │   └── [slug]/page.tsx
│   │   │   ├── recuperacion/
│   │   │   │   ├── page.tsx      # **Herramienta 1: Módulo de Diagnóstico**
│   │   │   │   └── password/page.tsx # **Herramienta 2: Recuperación de Contraseña**
│   │   │   ├── herramientas/
│   │   │   │   ├── tracker/page.tsx  # **Herramienta 4: Rastreador de Transacciones**
│   │   │   │   └── servicios/page.tsx # **Herramienta 5: Directorio de Servicios**
│   │   │   ├── contacto/
│   │   │   │   └── page.tsx      # **Página de Contacto**
│   │   │   ├── seguridad/
│   │   │   │   └── page.tsx      # **Herramienta 3: Base de Conocimiento (Blog filtrado)**
│   │   │   ├── registro/
│   │   │   │   └── page.tsx      # **Registro de Usuario**
│   │   │   ├── login/
│   │   │   │   └── page.tsx      # **Inicio de Sesión**
│   │   │   ├── recuperar-password/
│   │   │   │   └── page.tsx      # **Recuperación de Contraseña de Cuenta**
│   │   │   ├── suscripcion/
│   │   │   │   └── page.tsx      # **Página de Precios y Suscripción**
│   │   │   └── legal/
│   │   │       ├── aviso-legal/page.tsx
│   │   │       ├── privacidad/page.tsx
│   │   │       ├── terminos/page.tsx
│   │   │       └── descargo-responsabilidad/page.tsx
│   │   ├── (dashboard)/         # **Nueva Ruta Protegida**
│   │   │   ├── layout.tsx       # Layout para área protegida
│   │   │   └── cuenta/
│   │   │       └── page.tsx     # **Panel de Control del Usuario**
│   │   └── not-found.tsx        # **Página de Error 404**
...
├── components/
│   ├── ui/
│   ├── layout/
│   └── features/
│       ├── admin/
│       ├── recovery/
│       ├── blog/           # ArticleCard.tsx, ArticleList.tsx, BlogSearchBar.tsx, PaginationControls.tsx
│       ├── payments/
│       ├── homepage/       # HomepageBanner.tsx, FeaturedPostsCarousel.tsx
│       ├── tools/          # TransactionTracker.tsx, ServiceDirectory.tsx
│       ├── contact/        # ContactForm.tsx
│       ├── auth/           # **NUEVO** SignUpForm.tsx, SignInForm.tsx, PasswordResetForm.tsx
│       ├── pricing/        # **NUEVO** PricingPage.tsx
│       └── dashboard/      # **NUEVO** UserDashboard.tsx
...
├── lib/
│   └── api.ts              # Lógica para llamar a backend y miniservicios
```

## 4. Mejoras Implementadas para Robustez y Producción 2025

### **A. Escalabilidad del `TransactionTracker`**

- **Descripción:** En `TransactionTracker.tsx`, añadir lógica de reintentos con backoff exponencial para llamadas a APIs externas. Usar librería `retry-axios` en el frontend para manejar fallos, con máximo 3 reintentos y delay inicial de 1s. No altera estructura existente.

### **B. Mapeo de Autenticación con Google OAuth**

- **Descripción:** En `SignInForm.tsx`, aclarar mapeo: Al autenticar con Google, usar `firebase.auth().signInWithPopup(googleProvider)` y mapear `uid` directamente a `stripeCustomerId` en Firestore vía hook post-login. Añadir en documentación de componente.

### **C. Feedback en Formularios**

- **Descripción:** En componentes como `SignUpForm.tsx`, `SignInForm.tsx`, `PasswordResetForm.tsx` y `ContactForm.tsx`, integrar mensajes de error localizados (ES/EN) usando `react-hook-form` con resolvers para validaciones como "email ya registrado" o "contraseña débil". Estados de error visibles con Tailwind classes.

### **D. Página del Blog (`/blog`)**

- **Componente Principal:** `BlogPage.tsx`
- **Estructura:** Banner superior con H1 ("Explora Nuestro Blog de Cripto Seguridad"), H2 ("Guías, Noticias y Consejos Expertos"), descripción llamativa ("Mantente al día con las mejores prácticas en criptomonedas"). Barra de búsqueda (`BlogSearchBar.tsx`) para filtrar por título/tags/categorías. Lista de tarjetas (`ArticleList.tsx`) con paginación (`PaginationControls.tsx`). Cada tarjeta (`ArticleCard.tsx`) con imagen de portada, título, excerpt, tags clicables (enlazan a artículos de misma tag/categoría), botones de compartir en redes (usando Web Share API nativa para X, Telegram, etc.). Solo suscritos (`hasPremiumAccess: true`) pueden dar like (almacenado en Firestore) y enviar comentarios (moderados vía admin).
- **SEO Enfocado:** Usar Next.js metadata API para metaetiquetas dinámicas por página, canonical links, structured data (JSON-LD para articles). Categorías dinámicas gestionadas desde admin (`/admin/articles`).

### **E. Página de Artículo Individual (`/blog/[slug]` )**

- **Componente:** `ArticlePage.tsx`
- **Estructura:** Diseño limpio para lectura fácil (Tailwind prose), con H1 (título), meta info (autor, fecha, categoría), contenido Markdown renderizado. Tags clicables (enlazan a lista de artículos por tag). Flechas de navegación para artículo anterior/siguiente. Botones de compartir en redes (Web Share API). Solo suscritos pueden dar like y comentarios. Enlace a categoría para ver más artículos relacionados.

### **F. Comparación Interactiva en Suscripción (`CompetitorComparison.tsx` )**

- **Descripción:** En `/suscripcion/page.tsx`, añadir componente interactivo: Tabs para diferencias (privacidad, ecosistema, facilidad). Calculadora para costos: Input para monto recuperado, calcula 20% competidores vs fijo/hora...(truncated 3354 characters)...xto, imagen.

### **B. Página de Diagnóstico Interactivo (`/recuperacion` )**

- **Componente:** `RecoveryWizard.tsx`.
- **Interacción:** Una serie de tarjetas con preguntas comunes, como "He perdido mi contraseña" (enlaza a `/recuperacion/password`).

### **C. Página de Recuperación de Contraseña (`/recuperacion/password` )**

- **Componente:** `WasmPasswordEngine.tsx`.
- **Interacción:** Formulario para introducir datos (ej. diccionarios), con niveles gratuito (limitado) y premium (ilimitado). Muestra progreso y resultados.

### **D. Página de Guías de Seguridad (`/seguridad` )**

- **Componente:** `SecurityGuides.tsx`.
- **Interacción:** Lista filtrada del blog por categoría "seguridad".

### **E. Página de Rastreador de Transacciones (`/herramientas/tracker` )**

- **Componente:** `TransactionTracker.tsx`.
- **Interacción:** Formulario para introducir hash de transacción o dirección, muestra resultados detallados de APIs externas.

### **F. Página de Directorio de Servicios (`/herramientas/servicios` )**

- **Componente:** `ServiceDirectory.tsx`.
- **Interacción:** Lista de servicios profesionales con filtros por especialidad.

### **G. Páginas Legales (`/legal/*` )**

*Estas páginas son fundamentales y deben estar perfectamente redactadas.*

1. **Aviso Legal, Privacidad, Términos y Condiciones:** Páginas de texto estático con el contenido legal correspondiente.
2. **Descargo de Responsabilidad (`/legal/descargo-responsabilidad`):**
    - **Contenido:** Esta página contendrá un texto **enorme y muy claro** explicando que Brújula Cripto es una herramienta de software, que no garantiza la recuperación, que no es un servicio de custodia, que no ofrece consejo financiero y que el uso de las herramientas es bajo la propia responsabilidad del usuario.
    - **Visibilidad:** El enlace a esta página estará en el footer y en cualquier lugar donde se ofrezca un servicio de pago o de riesgo.

### **H. Página de Contacto (`/contacto` )**

- **Componente:** `ContactForm.tsx`.
- **Interacción:** Formulario para enviar nombre, email y mensaje, que se procesa a través de una Cloud Function.

### **I. Página del Blog (`/blog` )**

- **Componente Principal:** `BlogPage.tsx`
- **Estructura:** Banner superior editable desde admin (foto, texto H1/H2, descripción). Barra de búsqueda para títulos/tags/categorías. Lista paginada de tarjetas con sharing nativo, likes/comentarios solo para suscritos. Categorías dinámicas editables desde admin.

### **J. Página de Artículo (`/blog/[slug]` )**

- **Componente:** `ArticlePage.tsx`
- **Estructura:** Contenido fácil de leer, tags clicables, flechas para navegación, sharing nativo, likes/comentarios para suscritos.

### **K. Página del Chatbot (`/chatbot` )**

- **Componente:** `ChatbotUI.tsx`
- **Estructura:** Interfaz espectacular con imagen de brújula como logo, nombre "Brújula". Conversaciones listadas, respuestas streaming, sugerencias, render components (tablas/tarjetas).

### **L. Página de Suscripción (`/suscripcion` )**

- **Componente Principal:** `PricingPage.tsx`
- **Interacción:** Tabla de precios, sección interactiva de diferencias con calculadora para demostrar valor superior (comparación costos, privacidad, ecosistema), mostrando numéricamente por qué somos mejores (e.g., ahorros calculados en tiempo real).

## 3. Flujo de Pago y Consentimiento (Monetización)

*La legalidad y la claridad en el pago son innegociables.*

1. **Oferta:** En la página de la herramienta de recuperación de contraseñas, junto al Nivel Gratuito, se mostrará claramente la oferta del Nivel Premium (`PricingTier.tsx`).
2. **Consentimiento Explícito:** Junto al botón de pago (`UpgradeButton.tsx`), habrá una **casilla de verificación (checkbox) obligatoria** con el siguiente texto:
    - > `☐ He leído y acepto los [Términos y Condiciones](/legal/terminos) y entiendo el [Descargo de Responsabilidad](/legal/descargo-responsabilidad), reconociendo que el pago desbloquea la herramienta de software sin garantía de éxito en la recuperación.`
3. **Proceso:** El botón de pago solo se activará una vez que el usuario marque esta casilla.
4. **Visibilidad:** El enlace al descargo de responsabilidad estará siempre visible durante todo el proceso de uso de la herramienta de recuperación.

## 4. Páginas de Administración (`/admin/*`)

- **Acceso:** Protegido por una página de login (`/admin/auth`).
- **Dashboard (`/admin`):** Vista general de los últimos artículos, borradores pendientes y estadísticas.
- **Gestión de Artículos (`/admin/articles`):**
  - Una tabla (`ArticleDataTable.tsx`) para ver, filtrar, editar y eliminar todos los artículos (manuales y de la IA).
  - Un botón para crear un nuevo artículo, que lleva al editor.
- **Editor de Artículos (`/admin/articles/[id]`):**
  - El editor `TipTap` (`ArticleEditor.tsx`) para modificar el contenido, cambiar el estado (Borrador/Publicado), añadir enlaces de afiliado y cambiar la imagen de portada.
- **Gestión de Contenido de la Home:** Una nueva sección en el admin para editar los campos del documento `siteContent/homepage` (el banner, etc.).

## 5. Mejoras Implementadas para Robustez y Producción 2025

### **A. Pruebas de Usabilidad del RecoveryWizard**

- **Descripción:** En página `/recuperacion`, integrar pruebas A/B: Usar Vercel o Optimizely para variar texto/orden de tarjetas en `RecoveryWizard.tsx`, midiendo conversión a herramientas. Registrar métricas en Firestore para análisis.

### **B. Diseño Discreto para Saturación de Enlaces Legales**

- **Descripción:** En `Footer.tsx`, para móvil, implementar acordeón con Tailwind para colapsar enlaces legales (Columna 2), expandible con click. Mantener visibilidad pero reducir sobrecarga visual.

### **G. Adaptación al Modelo de Pago por Horas en UI**

- **Descripción:** En `/suscripcion/page.tsx`, transformar en "Planes por Hora" con paquetes de compra única. En `/cuenta/page.tsx`, mostrar tiempo restante (H:M:S) y historial de compras. En herramientas como `WasmPasswordEngine.tsx` y `ChatbotUI.tsx`, añadir contador en tiempo real que se actualiza vía API calls a trackUsage. Créditos iniciales: 15 min para herramientas, 30 min para chatbot en registro.

### **H. Calculadora de Precios Actualizada**

- **Descripción:** En `CompetitorComparison.tsx`, agregar inputs para "Monto a recuperar (€)" y "Horas estimadas". Cálculo: Competencia = monto *0.20; Nuestro = (min(2, horas)* 4.99) + (max(0, horas - 2) * 3.99). Mostrar ahorros.

### **I. Gestión del Banner en Admin**

- **Descripción:** En `/admin/homepage`, nuevo componente para editar banner: Subir imagen de fondo, editar texto principal, imagen superpuesta, texto/enlace del botón. Almacenar en `siteContent/homepage`.

### **J. Gestión de Mensajes de Feedback en Admin**

- **Descripción:** En `/admin/feedback`, tabla para ver mensajes de `FeedbackButton.tsx`. Funciones: Leer todos, eliminar individual, eliminación masiva vía selección.

### **K. Editor Avanzado de Blog en Admin**

- **Descripción:** En `ArticleEditor.tsx`, añadir: Editor enriquecido manual, programación (inmediata/manual/automática con fecha/hora), gestión categorías (crear/editar/eliminar dinámicas), tags múltiples. IA: Prompt para texto (Gemini Pro), prompt para imágenes (DALL-E 3, almacenar en Firebase Storage), upload manual. Opciones: Tamaño (800/1200/1600 palabras), añadir Q&A/conclusiones/recomendaciones, modo profundidad (Profundo/General).

### **L. Moderación de Comentarios en Admin**

- **Descripción:** En `/admin/comments`, vista para ver/eliminar comentarios individualmente. Integrar moderación IA automática en microservicio (análisis con OpenAI Moderation), marcar/eliminar basado en config admin.
</DOCUMENT>

<DOCUMENT filename="PROYEC_PARTE3.MD">
🗄️ PROYEC_PARTE3_FINAL_V3.MD (Backend)
2. Estructura de Carpetas (packages/functions) - ACTUALIZADO
text/packages/functions/
├── src/
│   ├── admin/
│   │   ├── articleHandlers.ts
│   │   ├── setAdminRole.ts
│   │   ├── siteContentHandlers.ts   # Para gestionar el contenido de la home
│   │   └── serviceDirectoryHandlers.ts # Para gestionar el directorio
│   ├── payments/
│   │   ├── createCheckout.ts
│   │   ├── stripeWebhooks.ts
│   │   └── createStripePortalSession.ts  # **NUEVO** Para gestión de suscripciones
│   ├── proxies/
│   ├── public/
│   │   └── handleContactForm.ts     # Para el formulario de contacto
│   └── lib/
...
3. Modelo de Datos (Firestore) - ACTUALIZADO

Colección articles: (Sin cambios)
Colección users: EXPANDIDO PARA SUSCRIPCIONES

ID: uid de Firebase Authentication
Campos:

email (string)
createdAt (timestamp)
hasPremiumAccess (boolean) - NUEVO CAMPO CLAVE
stripeCustomerId (string) - NUEVO Para integración con Stripe
subscriptionStatus ('active' | 'canceled' | 'past_due' | null) - NUEVO
subscriptionId (string) - NUEVO ID de suscripción de Stripe

Colección professionalServices:

ID: Autogenerado
Campos: name (string), website (string), description (string), logoUrl (string), specialties (array), isVerified (boolean).

Colección siteContent:

ID del Documento: homepage
Campos: bannerImageUrl (string), bannerTitle_es (string), bannerTitle_en (string), bannerSubtitle_es (string), bannerSubtitle_en (string), bannerButtonText_es (string), bannerButtonText_en (string), bannerButtonLink (string).

Colección contactSubmissions:

ID: Autogenerado
Campos: name (string), email (string), message (string), submittedAt (timestamp), status ('new' | 'read').

4. Reglas de Seguridad (Firestore) - ACTUALIZADO
textrules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /articles/{articleId} { ... }
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      allow create: if request.auth != null && request.auth.uid == userId;
      // Solo admins pueden leer datos de otros usuarios
      allow read: if request.auth.token.admin == true;
    }

    // Cualquiera puede leer los servicios, solo los admins pueden escribir
    match /professionalServices/{serviceId} {
      allow read: if true;
      allow write: if request.auth.token.admin == true;
    }
    // Cualquiera puede leer el contenido de la home, solo admins pueden escribir
    match /siteContent/homepage {
      allow read: if true;
      allow write: if request.auth.token.admin == true;
    }
    // Cualquiera puede crear un envío de contacto, pero nadie puede leerlos
    match /contactSubmissions/{submissionId} {
      allow read, write: if false;
      allow create: if true;
    }
  }
}
5. Nuevas Cloud Functions para Autenticación y Suscripciones
5.1. createStripePortalSession.ts

Propósito: Crear sesión del Portal de Cliente de Stripe
Autenticación: Usuario autenticado únicamente
Flujo:

Verificar autenticación del usuario
Obtener stripeCustomerId del documento del usuario
Crear sesión del portal con Stripe SDK
Retornar URL de redirección segura

5.2. Webhook de Stripe (stripeWebhooks.ts) - EXPANDIDO

Eventos nuevos a manejar:

customer.subscription.created → hasPremiumAccess: true
customer.subscription.updated → Actualizar estado de suscripción
customer.subscription.deleted → hasPremiumAccess: false

Actualizaciones automáticas del documento de usuario en Firestore

5.3. Middleware de Autenticación Frontend

Archivo: middleware.ts (Next.js)
Rutas protegidas: /(dashboard)/*
Redirección: No autenticado → /login

6. Mejoras Implementadas para Robustez y Producción 2025
A. Gestión de Costos en Serverless

Descripción: En funciones como handleContactForm.ts y proxies, integrar Redis (via Upstash o Google Memorystore) para caché de respuestas frecuentes a APIs externas, con TTL de 5min. Añadir en lib/ un módulo cache.ts para manejar get/set sin alterar flujos existentes.

B. Métricas de Rendimiento

Descripción: En todas las Cloud Functions, añadir integración con Google Cloud Monitoring: Usar @google-cloud/logging para registrar métricas de latencia y errores. Configurar alertas para umbrales >500ms. Añadir en cada handler: const logger = new Logging(); logger.logStructured({message: 'Execution time', duration: ms});.

C. Reestructuración a Pago por Horas

Descripción: Eliminar hasPremiumAccess, subscriptionStatus, subscriptionId. Añadir usageCreditsInSeconds (number) para créditos en segundos. Adaptar Stripe para compras únicas de paquetes de horas (ej. checkout.session.completed suma segundos). Nueva función trackUsage.ts: Descuenta segundos en tiempo real durante uso de herramientas/chatbot, trigger por eventos de usuario. Créditos iniciales en registro: 900s (15min) para herramientas, 1800s (30min) para chatbot.

D. Gestión de Precios en Admin

Descripción: Nueva función adminPriceHandlers.ts para actualizar tarifas (4.99€/h primeras 2h, 3.99€/h siguientes) y paquetes de horas, almacenados en Firestore (colección siteConfig/pricing).
</DOCUMENT>

<DOCUMENT filename="PROYEC_PARTE4.MD">
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
</DOCUMENT>

<DOCUMENT filename="PROYEC_PARTE5.MD">
<DOCUMENT filename="PROYEC_PARTE5.MD">
# 🗺️ Brújula Cripto: Plano de Experiencia de Usuario y Navegación (Producción)

### Preámbulo

Este documento detalla la estructura visible de la aplicación, las páginas, su contenido, la navegación y los flujos de interacción del usuario. Es el complemento a los planos de arquitectura y debe seguirse para construir una experiencia de usuario coherente, intuitiva y legalmente sólida. Todo está diseñado bajo un principio **Mobile-First**.

---

## 1. Navegación Global

### **A. Cabecera (Navbar - `Navbar.tsx`)**

*La cabecera será limpia, minimalista y estará siempre visible (sticky).*

- **Logo:** A la izquierda, enlaza a la página de inicio.
- **Enlaces de Navegación (Público):**
  - **Blog:** Enlaza a `/blog`.
  - **Herramientas ▾:** Un menú desplegable que contiene:
    - **Diagnóstico y Recuperación:** Enlaza a `/recuperacion`.
    - **Rastreador de Transacciones:** Enlaza a `/herramientas/tracker`.
    - **Directorio de Servicios:** Enlaza a `/herramientas/servicios`.
  - **Guías de Seguridad:** Enlaza a `/seguridad`.
- **Acciones a la Derecha:**
  - **Selector de Idioma (ES/EN):** Un icono de globo terráqueo con un pequeño menú.
  - **Selector de Tema (Claro/Oscuro):** Un icono de sol/luna.
  - **Contacto:** Enlaza a `/contacto`.

### **B. Pie de Página (Footer - `Footer.tsx`)**

*El pie de página será compacto y contendrá información esencial sin ocupar demasiado espacio.*

- **Estructura (3 columnas en escritorio, apiladas en móvil):**
  - **Columna 1: Navegación**
    - Blog
    - Herramientas
    - Guías de Seguridad
    - Contacto
  - **Columna 2: Legalidad**
    - **Aviso Legal:** Enlaza a `/legal/aviso-legal`.
    - **Política de Privacidad:** Enlaza a `/legal/privacidad`.
    - **Términos y Condiciones:** Enlaza a `/legal/terminos`.
  - **Columna 3: Contacto y Redes Sociales**
    - **Soporte:** `soporte@brujulacripto.com`
    - **Información:** `info@brujulacripto.com`
    - **Iconos de Redes Sociales:** (ej. X/Twitter, Telegram, YouTube) con sus respectivos enlaces.
- **Línea Inferior:**
  - `© 2025 Brújula Cripto. Todos los derechos reservados.`
  - **Descargo de Responsabilidad General:** Un enlace bien visible a `/legal/descargo-responsabilidad`.

---

## 2. Páginas Visibles al Público

### **A. Página de Inicio (`/`)**

1. **Banner Principal (`HomepageBanner.tsx`):** Imagen de fondo, título, subtítulo y un botón de llamada a la acción (CTA). **Todo el contenido es editable** desde el panel de administración (foto, texto, botón enlace/texto, etc.).
2. **Carrusel de Posts (`FeaturedPostsCarousel.tsx`):** Muestra las últimas 4-5 entradas destacadas del blog con tarjetas visuales (`ArticleCard.tsx`).
3. **Sección de Herramientas:** Iconos y descripciones breves de las herramientas principales, con enlaces a cada una.
4. **Descargo de Responsabilidad:** Un pequeño pero visible bloque de texto en la parte inferior de la página con un resumen del descargo y enlace completo.
5. **Botón de Feedback (`FeedbackButton.tsx`):** Solo para suscritos, permite enviar mensajes (reconociendo usuario). Admin puede anular/pendiente, cambiar enlace, texto, imagen.

### **B. Página de Diagnóstico Interactivo (`/recuperacion`)**

- **Componente:** `RecoveryWizard.tsx`.
- **Interacción:** Una serie de tarjetas con preguntas comunes, como "He perdido mi contraseña" (enlaza a `/recuperacion/password`).

### **C. Página de Recuperación de Contraseña (`/recuperacion/password`)**

- **Componente:** `WasmPasswordEngine.tsx`.
- **Interacción:** Formulario para introducir datos (ej. diccionarios), con niveles gratuito (limitado) y premium (ilimitado). Muestra progreso y resultados.

### **D. Página de Guías de Seguridad (`/seguridad`)**

- **Componente:** `SecurityGuides.tsx`.
- **Interacción:** Lista filtrada del blog por categoría "seguridad".

### **E. Página de Rastreador de Transacciones (`/herramientas/tracker`)**

- **Componente:** `TransactionTracker.tsx`.
- **Interacción:** Formulario para introducir hash de transacción o dirección, muestra resultados detallados de APIs externas.

### **F. Página de Directorio de Servicios (`/herramientas/servicios`)**

- **Componente:** `ServiceDirectory.tsx`.
- **Interacción:** Lista de servicios profesionales con filtros por especialidad.

### **G. Páginas Legales (`/legal/*`)**

*Estas páginas son fundamentales y deben estar perfectamente redactadas.*

1. **Aviso Legal, Privacidad, Términos y Condiciones:** Páginas de texto estático con el contenido legal correspondiente.
2. **Descargo de Responsabilidad (`/legal/descargo-responsabilidad`):**
    - **Contenido:** Esta página contendrá un texto **enorme y muy claro** explicando que Brújula Cripto es una herramienta de software, que no garantiza la recuperación, que no es un servicio de custodia, que no ofrece consejo financiero y que el uso de las herramientas es bajo la propia responsabilidad del usuario.
    - **Visibilidad:** El enlace a esta página estará en el footer y en cualquier lugar donde se ofrezca un servicio de pago o de riesgo.

### **H. Página de Contacto (`/contacto`)**

- **Componente:** `ContactForm.tsx`.
- **Interacción:** Formulario para enviar nombre, email y mensaje, que se procesa a través de una Cloud Function.

### **I. Página del Blog (`/blog`)**

- **Componente Principal:** `BlogPage.tsx`
- **Estructura:** Banner superior editable desde admin (foto, texto H1/H2, descripción). Barra de búsqueda para títulos/tags/categorías. Lista paginada de tarjetas con sharing nativo, likes/comentarios solo para suscritos. Categorías dinámicas editables desde admin.

### **J. Página de Artículo (`/blog/[slug]`)**

- **Componente:** `ArticlePage.tsx`
- **Estructura:** Contenido fácil de leer, tags clicables, flechas para navegación, sharing nativo, likes/comentarios para suscritos.

### **K. Página del Chatbot (`/chatbot`)**

- **Componente:** `ChatbotUI.tsx`
- **Estructura:** Interfaz espectacular con imagen de brújula como logo, nombre "Brújula". Conversaciones listadas, respuestas streaming, sugerencias, render components (tablas/tarjetas).

### **L. Página de Suscripción (`/suscripcion`)**

- **Componente Principal:** `PricingPage.tsx`
- **Interacción:** Tabla de precios, sección interactiva de diferencias con calculadora para demostrar valor superior (comparación costos, privacidad, ecosistema), mostrando numéricamente por qué somos mejores (e.g., ahorros calculados en tiempo real).

---

## 3. Flujo de Pago y Consentimiento (Monetización)

*La legalidad y la claridad en el pago son innegociables.*

1. **Oferta:** En la página de la herramienta de recuperación de contraseñas, junto al Nivel Gratuito, se mostrará claramente la oferta del Nivel Premium (`PricingTier.tsx`).
2. **Consentimiento Explícito:** Junto al botón de pago (`UpgradeButton.tsx`), habrá una **casilla de verificación (checkbox) obligatoria** con el siguiente texto:
    - > `☐ He leído y acepto los [Términos y Condiciones](/legal/terminos) y entiendo el [Descargo de Responsabilidad](/legal/descargo-responsabilidad), reconociendo que el pago desbloquea la herramienta de software sin garantía de éxito en la recuperación.`
3. **Proceso:** El botón de pago solo se activará una vez que el usuario marque esta casilla.
4. **Visibilidad:** El enlace al descargo de responsabilidad estará siempre visible durante todo el proceso de uso de la herramienta de recuperación.

---

## 4. Páginas de Administración (`/admin/*`)

- **Acceso:** Protegido por una página de login (`/admin/auth`).
- **Dashboard (`/admin`):** Vista general de los últimos artículos, borradores pendientes y estadísticas.
- **Gestión de Artículos (`/admin/articles`):**
  - Una tabla (`ArticleDataTable.tsx`) para ver, filtrar, editar y eliminar todos los artículos (manuales y de la IA).
  - Un botón para crear un nuevo artículo, que lleva al editor.
- **Editor de Artículos (`/admin/articles/[id]`):**
  - El editor `TipTap` (`ArticleEditor.tsx`) para modificar el contenido, cambiar el estado (Borrador/Publicado), añadir enlaces de afiliado y cambiar la imagen de portada.
- **Gestión de Contenido de la Home:** Una nueva sección en el admin para editar los campos del documento `siteContent/homepage` (el banner, etc.).

## 5. Mejoras Implementadas para Robustez y Producción 2025

### **A. Pruebas de Usabilidad del RecoveryWizard**

- **Descripción:** En página `/recuperacion`, integrar pruebas A/B: Usar Vercel o Optimizely para variar texto/orden de tarjetas en `RecoveryWizard.tsx`, midiendo conversión a herramientas. Registrar métricas en Firestore para análisis.

### **B. Diseño Discreto para Saturación de Enlaces Legales**

- **Descripción:** En `Footer.tsx`, para móvil, implementar acordeón con Tailwind para colapsar enlaces legales (Columna 2), expandible con click. Mantener visibilidad pero reducir sobrecarga visual.

### **C. Integración de Pago por Horas en Flujos UX**

- **Descripción:** En herramientas y chatbot, mostrar contador de tiempo restante que descuenta en real-time. En `/suscripcion`, enfocarse en paquetes de horas con calculadora actualizada (inputs monto/horas, coste escalonado).

### **D. Gestión de Usuarios en Admin**

- **Descripción:** Nueva sección `/admin/users`: Lista de usuarios con estado, saldo usageCreditsInSeconds (formato H:M:S). Filtros y exportación.
</DOCUMENT>

</DOCUMENT>

<DOCUMENT filename="PROYEC_PARTE6.MD">
<DOCUMENT filename="PROYEC_PARTE6.MD">
# 🗺️ PROYEC_PARTE6.MD - Plano de Experiencia de Usuario y Navegación

## 1. Navegación Global y Páginas Públicas

### **A. Estructura de Navegación**

- **Header Adaptativo:** Cambia según estado de autenticación del usuario
- **Footer Consistente:** Enlaces legales y contacto en todas las páginas
- **Breadcrumbs:** Navegación jerárquica en páginas internas

### **B. Estados de Navegación**

#### **Usuario NO Autenticado**

```
[Logo] [Blog] [Herramientas] [Contacto] [Registro] [Login]
```

#### **Usuario Autenticado**

```
[Logo] [Blog] [Herramientas] [Contacto] [Avatar ▼]
                                        ├─ Mi Cuenta
                                        └─ Cerrar Sesión
```

## 2. Páginas Públicas (Área `(main)/`)

### **A. Páginas de Contenido**

1. **Inicio (`/`)** - HomepageBanner + FeaturedPostsCarousel
2. **Blog (`/blog`)** - Lista con búsqueda y paginación
3. **Artículo (`/blog/[slug]`)** - Vista individual de artículo
4. **Contacto (`/contacto`)** - Formulario de contacto

### **B. Herramientas Públicas**

1. **Recuperación (`/recuperacion`)** - RecoveryWizard (diagnóstico)
2. **Motor WASM (`/recuperacion/password`)** - WasmPasswordEngine
3. **Seguridad (`/seguridad`)** - Blog filtrado por categoría
4. **Tracker (`/herramientas/tracker`)** - TransactionTracker
5. **Servicios (`/herramientas/servicios`)** - ServiceDirectory

### **C. Páginas Legales (`/legal/`)**

1. **Aviso Legal (`/legal/aviso-legal` )**
2. **Privacidad (`/legal/privacidad` )**
3. **Términos (`/legal/terminos` )**
4. **Descargo (`/legal/descargo-responsabilidad` )**

## 3. Cuentas de Usuario y Suscripción

### **A. Páginas de Autenticación (`(main)/`)**

#### **A.1. Registro (`/registro`)**

- **Componente:** `SignUpForm.tsx`
- **Campos:** Email, Contraseña, Confirmar Contraseña
- **Validación:** Checkbox obligatorio para Política de Privacidad y Términos
- **Post-registro:** Redirección automática a `/cuenta`
- **Enlaces:** "¿Ya tienes cuenta? Inicia sesión"

#### **A.2. Inicio de Sesión (`/login`)**

- **Componente:** `SignInForm.tsx`
- **Opciones:**
  - Email y Contraseña
  - Botón "Iniciar sesión con Google"
- **Enlaces:**
  - "¿Olvidaste tu contraseña?" → `/recuperar-password`
  - "¿No tienes cuenta? Regístrate" → `/registro`

#### **A.3. Recuperación de Contraseña (`/recuperar-password`)**

- **Componente:** `PasswordResetForm.tsx`
- **Flujo:**
  1. Usuario introduce email
  2. Firebase Authentication envía correo automático
  3. Usuario recibe enlace seguro para restablecer
- **Mensaje de confirmación:** "Revisa tu correo electrónico"

### **B. Página de Suscripción (`/suscripcion`)**

#### **B.1. Estructura de Precios**

- **Componente:** `PricingPage.tsx`
- **Estructura:** Dos columnas comparativas (Gratuito vs Premium)
- **Nivel Gratuito:** Limitaciones claras (15 min búsqueda, potencia básica)
- **Nivel Premium:** Beneficios (`hasPremiumAccess: true`):
  - Búsqueda ilimitada
  - Máxima potencia CPU
  - Diccionarios avanzados
  - Soporte prioritario
- **CTA:** Botón "Obtener Premium" → integración Stripe

### **B.2. Página de Error 404 (`not-found.tsx`)**

- **Componente:** `NotFoundPage.tsx`
- **Estructura:** Imagen amigable (brújula perdida), H1 ("Página No Encontrada"), descripción ("Lo sentimos, la página que buscas no existe.").

## 4. Flujos de Usuario Críticos

### **A. Flujo de Registro Completo**

1. **Descubrimiento:** Usuario llega desde herramientas → ve limitaciones
2. **Conversión:** Click en "Obtener Premium" → `/suscripcion`
3. **Decisión:** Comparación Gratuito vs Premium → Click "Obtener Premium"
4. **Autenticación:** Redirección a `/registro` → formulario
5. **Pago:** Post-registro → checkout Stripe
6. **Activación:** Webhook actualiza `hasPremiumAccess: true`
7. **Bienvenida:** Redirección a `/cuenta` con estado Premium

### **B. Flujo de Login Existente**

1. **Acceso:** Usuario intenta acceder `/cuenta` sin autenticación
2. **Redirección:** Middleware → `/login`
3. **Autenticación:** Email/contraseña o Google OAuth
4. **Redirección:** Post-login → `/cuenta` o página origen

### **C. Flujo de Gestión de Suscripción**

1. **Acceso:** Usuario Premium en `/cuenta` → pestaña "Mi Suscripción"
2. **Portal:** Click "Gestionar mi Suscripción" → Portal Stripe
3. **Gestión:** Cambios en portal (facturación, cancelación, etc.)
4. **Webhook:** Stripe notifica cambios → actualización Firestore
5. **Reflejo:** Cambios se reflejan en próximo login

## 5. Adaptaciones de Navegación

### **A. Responsive Design**

- **Mobile:** Menú hamburguesa colapsible
- **Tablet:** Navegación horizontal compacta  
- **Desktop:** Navegación completa expandida

### **B. Estados de Loading**

- **Autenticación:** Spinner durante verificación de estado
- **Portal Stripe:** Loading durante redirección
- **Formularios:** Estados de envío con feedback

### **C. Manejo de Errores**

- **Autenticación fallida:** Mensajes claros de error
- **Stripe checkout error:** Redirección de vuelta con mensaje
- **Conexión perdida:** Notificación de reconexión

## 6. Integración con Documentación Existente

### **A. Actualización PROYEC_PARTE2.MD (Frontend)**

- ✅ Nuevas rutas agregadas: `/(main)/registro`, `/(main)/login`, etc.
- ✅ Nuevos componentes: `SignUpForm`, `SignInForm`, `PricingPage`, `UserDashboard`
- ✅ Navegación adaptativa especificada

### **B. Actualización PROYEC_PARTE3.MD (Backend)**

- ✅ Modelo `users` expandido con campos de suscripción
- ✅ Nueva Cloud Function: `createStripePortalSession.ts`
- ✅ Webhook Stripe expandido para eventos de suscripción
- ✅ Reglas de seguridad actualizadas para protección de datos

### **C. Middleware de Protección**

- **Archivo:** `middleware.ts` (Next.js)
- **Rutas protegidas:** `/(dashboard)/*`
- **Comportamiento:** Redirección automática a `/login` si no autenticado

## 7. Mejoras Implementadas para Robustez y Producción 2025

### **A. Precios Específicos en Suscripción**

- **Descripción:** En sección B.1, definir precios: Premium a 9.99€/mes o 99€/año (pago único anual). Actualizar en `PricingPage.tsx` con variables ambientales para flexibilidad.

### **B. Especificación de Soporte Prioritario**

- **Descripción:** En Nivel Premium, detallar: SLA de respuesta <24h vía email dedicado, canales Slack para premium. Añadir en pestaña "Mi Suscripción" un botón "Soporte Prioritario".

### **C. Retención de Usuarios**

- **Descripción:** En flujo C, añadir post-webhook: Enviar emails con Mailgun para análisis periódicos de wallets (semanal para premium). Integrar en webhook Stripe para triggers de renovación.

### **D. Valor Diferencial en Suscripción**

- **Descripción:** En `/suscripcion`, enfatizar diferencias: Privacidad (local vs servidores), ecosistema (completo vs limitado), facilidad (rápido vs trámites), control (real-time vs caja negra). Usar calculadora interactiva para demostrar ahorros (input monto, output comparación costos).

### **E. Adaptación a Pago por Horas en Flujos**

- **Descripción:** Reemplazar suscripciones por compras de paquetes de horas. En flujos A/C, adaptar activación a suma de usageCreditsInSeconds. Créditos iniciales en registro. Contadores en herramientas/chatbot.

### **F. Calculadora en Suscripción**

- **Descripción:** Inputs "Monto (€)" y "Horas". Cálculo competencia 20%, nuestro escalonado (4.99€/h primeras 2, 3.99€/h siguientes).
</DOCUMENT>

</DOCUMENT>

<DOCUMENT filename="PROYEC_PARTE7.MD">
🤖 Brújula Cripto: Plan de Arquitectura - Miniservicio de Chatbot Cripto-Especialista (V2)
1. Visión General y Propósito
Este documento detalla la arquitectura de un miniservicio completamente independiente y robusto que alojará a un chatbot especialista en criptomonedas. El servicio funcionará bajo un modelo Freemium y se integrará con la plataforma principal de Brújula Cripto.
Principios Clave:

Aislamiento: El servicio se ejecuta de forma independiente para no afectar al rendimiento de la aplicación principal.
Escalabilidad: Construido sobre infraestructura serverless para manejar cualquier nivel de carga.
Inteligencia Real: El chatbot no solo responde, sino que "aprende" a través de RAG (Retrieval-Augmented Generation) y puede interactuar con datos de la blockchain en tiempo real.

2. Arquitectura Técnica Detallada
El servicio se construirá sobre Google Cloud, manteniendo la coherencia con el resto del ecosistema.

Hosting del Servicio: Google Cloud Run.
Orquestación de IA: Genkit for Firebase.
Modelo de Lenguaje (LLM): Google Gemini Pro.
Base de Datos de Conversaciones: Cloud Firestore.
Base de Conocimiento ("Aprendizaje"): Vertex AI Vector Search. Aquí es donde el chatbot "aprende", indexando documentación técnica, whitepapers y guías de seguridad para dar respuestas expertas (RAG).
Conexión a la Blockchain (Herramientas): El chatbot usará "Tools" de Genkit para interactuar con APIs externas (ej. Covalent, Moralis, GoPlus Security). Las herramientas serán:

getWalletAnalysis(address, chain): Devuelve el balance, tokens, NFTs y un análisis de riesgos.
getTransactionStatus(txHash, chain): Verifica el estado de una transacción.
getContractAuditSummary(contractAddress, chain): Obtiene un resumen de la seguridad de un contrato.

3. Modelo de Datos en Firestore (Dedicado al Chatbot)

Colección chatbot_conversations:

Campos: userId, title, isFavorite, createdAt, updatedAt.

Sub-colección chatbot_messages:

Anidada dentro de cada conversación.
Campos: role ('user' | 'model'), content, timestamp.

4. Funcionalidades de Usuario y Flujo de Interacción
El frontend (packages/app) tendrá una nueva sección para el chatbot que interactuará con el miniservicio a través de una API REST.

Endpoints de la API: GET /conversations, POST /conversations, PUT /conversations/{id}, DELETE /conversations/{id}, POST /conversations/{id}/messages (con streaming).
Panel de Usuario del Chatbot: Una barra lateral con la lista de conversaciones (crear, renombrar, favorito, borrar) y la ventana de chat principal.

5. Modelo de Monetización y Propuesta de Valor
La suscripción hasPremiumChatAccess desbloquea el valor real del chatbot: el análisis proactivo de la blockchain.
A. El Valor para el Usuario Gratuito (El Anzuelo 🎣)
El usuario gratuito obtiene un experto en cripto para consultas generales. Cuando pide un análisis de wallet, el chatbot le ofrece una "demostración" limitada para engancharlo.

Respuesta Gratuita: "He identificado que la dirección 0x123... es una wallet válida en Ethereum. Para realizar un análisis completo en tiempo real, incluyendo el valor de tu portafolio, desglose de tokens/NFTs y un informe de riesgos de seguridad, necesitas acceso Premium. ¿Quieres saber más?"

B. El Valor para el Usuario de Pago (La Solución Completa 🛡️)
El usuario de pago obtiene un analista de seguridad personal. El chatbot le entrega un informe completo y accionable.

Respuesta Premium: "Claro. Aquí tienes el análisis de tu wallet:

Valor Total: 1,250.45 €
Activos: 150.2 MATIC, 0.25 WETH, 500.10 USDC...
NFTs: 2 de la colección "CryptoPunks Polygon".
🚨 ¡ANÁLISIS DE RIESGOS! 🚨

¡Atención! Aprobación de Contrato de Riesgo: Tienes una aprobación ilimitada para el contrato 0x789.... Este contrato podría retirar todos tus WETH. Se recomienda revocar este permiso inmediatamente."

El valor es la claridad financiera y, sobre todo, la seguridad proactiva que puede evitar pérdidas catastróficas.

6. Integración con la Plataforma Existente

Frontend (packages/app): Se creará una nueva ruta /chatbot con los componentes de la interfaz (ChatbotUI.tsx, ConversationList.tsx). El archivo lib/api.ts se ampliará para llamar a los endpoints del nuevo miniservicio.
Backend (packages/functions): Se añadirán las funciones de pago de Stripe para la nueva suscripción, que modificarán el campo hasPremiumChatAccess en el perfil del usuario.
Tipos (packages/types): Se añadirán las nuevas interfaces: IChatConversation y IChatMessage.

7. Experiencia de Usuario (UX) Espectacular
Para que sea el mejor chatbot del mundo, la experiencia debe ser impecable:

Respuestas en Streaming: El chatbot escribirá las respuestas palabra por palabra, como ChatGPT, dando una sensación de "pensamiento" en tiempo real y mejorando la percepción de velocidad.
Sugerencias de Preguntas: Al iniciar una nueva conversación o después de una respuesta, el chatbot sugerirá preguntas de seguimiento relevantes. Ej: "¿Quieres que analice los riesgos de este contrato?", "¿Te gustaría saber más sobre el token WETH?".
Renderizado de Componentes: El chatbot no solo devolverá texto. Cuando genere un informe de wallet, el frontend renderizará componentes visuales (tablas para tokens, tarjetas para NFTs) dentro del chat, haciendo la información mucho más digerible.
Memoria a Corto y Largo Plazo: El chatbot recordará el contexto de la conversación actual. Además, a través de RAG, tendrá acceso al conocimiento experto, simulando una memoria a largo plazo.
Claridad y Simplicidad: Todas las respuestas, incluso las más técnicas, se explicarán en un lenguaje sencillo. El objetivo no es abrumar, sino empoderar al usuario.
Diseño Espectacular: Imagen principal de brújula como icono/logo, nombre del chatbot "Brújula" visible en header de página.

8. Mejoras Implementadas para Robustez y Producción 2025
A. Límites de Uso para Chatbot Gratuito

Descripción: En endpoints API, implementar límites: Usuarios gratuitos limitados a 10 mensajes/día, usando Firestore para contar via userId. Si excede, retornar error 429 con mensaje upselling. No altera flujos premium.

B. Integración de Pago por Horas

Descripción: Reemplazar hasPremiumChatAccess por chequeo de usageCreditsInSeconds. En flujos de interacción, llamar a trackUsage para descontar segundos durante uso. Crédito inicial 1800s (30min) para registrados. Upselling en respuestas gratuitas si créditos bajos.
</DOCUMENT>

<DOCUMENT filename="TEXTOS_IMAGENES.MD">
<DOCUMENT filename="TEXTOS_IMAGENES.MD">
# 💎 SEO, Copywriting y Activos Visuales (Producción V2)

### Preámbulo

Este documento detalla el contenido textual (copy), las metaetiquetas SEO (título y descripción) y las especificaciones para los activos visuales de todas las páginas públicas de Brújula Cripto. El objetivo es crear una narrativa de marca fuerte, comunicar valor real y alcanzar la máxima visibilidad en motores de búsqueda.

---

## **1. PÁGINA DE INICIO (`/`)**

*Objetivo: Captar la atención en 3 segundos, establecer confianza y guiar al usuario hacia las herramientas clave.*

### **Metaetiquetas SEO**

- **Español:**
  - `title`: Brújula Cripto | Seguridad y Recuperación de Criptomonedas
  - `description`: Tu guía experta para proteger, gestionar y recuperar tus criptoactivos. Herramientas reales y conocimiento para darte tranquilidad en el mundo cripto.
- **Inglés:**
  - `title`: Crypto Compass | Cryptocurrency Security & Recovery
  - `description`: Your expert guide to protect, manage, and recover your crypto assets. Real tools and knowledge to give you peace of mind in the crypto world.

### **Sección 1: Banner Principal (`HomepageBanner.tsx`)**

- **Imagen de Fondo:**
  - **Ruta:** `/public/images/home/banner-hero.webp`
  - **Tamaño:** 1920x1080px (16:9)
  - **Prompt para generar imagen:** "Abstract, elegant digital vault with a glowing blue compass needle floating in the center, dark background, cinematic lighting, sophisticated, secure, tech aesthetic."
- **Contenido (ES):**
  - **Título (H1):** `Navega el Mundo Cripto con Confianza.`
  - **Subtítulo:** `Herramientas reales para proteger y recuperar tus activos digitales. Tu tranquilidad es nuestra misión.`
  - **Botón:** `Empezar Diagnóstico` (enlaza a `/recuperacion`)
- **Contenido (EN):**
  - **Title (H1):** `Maps the Crypto World with Confidence.`
  - **Subtitle:** `Real tools to protect and recover your digital assets. Your peace of mind is our mission.`
  - **Button:** `Start Diagnosis` (links to `/en/recovery`)

### **Sección 2: Propuesta de Valor (`ValueProposition.tsx`)**

*Una sección limpia con 3 iconos y texto breve.*

- **Título (ES):** `Tu Escudo en el Ecosistema Digital`
- **Título (EN):** `Your Shield in the Digital Ecosystem`
- **Columna 1:**
  - **Icono:** Un escudo (`shield-check-icon.svg`)
  - **Título (ES):** `Protección Proactiva`
  - **Texto (ES):** `Analiza los riesgos de tus wallets antes de que se conviertan en un problema.`
  - **Título (EN):** `Proactive Protection`
  - **Texto (EN):** `Analyze your wallets' risks before they become a problem.`
- **Columna 2:**
  - **Icono:** Una llave inglesa (`wrench-icon.svg`)
  - **Título (ES):** `Herramientas Reales`
  - **Texto (ES):** `Desde recuperación de contraseñas hasta rastreo de transacciones.`
  - **Título (EN):** `Real Tools`
  - **Texto (EN):** `From password recovery to transaction tracking.`
- **Columna 3:**
  - **Icono:** Una brújula (`compass-icon.svg`)
  - **Título (ES):** `Guía Experta`
  - **Texto (ES):** `Conocimiento y chatbot para navegar con seguridad.`
  - **Título (EN):** `Expert Guide`
  - **Texto (EN):** `Knowledge and chatbot to navigate securely.`

### **Sección 3: Carrusel de Posts Destacados (`FeaturedPostsCarousel.tsx`)**

- **Imagen de Fondo (opcional):** Ninguna, para mantener foco en tarjetas.
- **Contenido:** Muestra 4-5 posts recientes del blog con tarjetas (`ArticleCard.tsx`), cada una con imagen de portada, título, excerpt y enlace al artículo completo.
- **Interacción:** Carrusel deslizable con controles de flechas, auto-scroll opcional desactivado por defecto.

### **Sección 4: Botón de Feedback (`FeedbackButton.tsx`)**

- **Ubicación:** Flotante en esquina inferior derecha de la homepage, visible solo para usuarios suscritos (`hasPremiumAccess: true`).
- **Interacción:** Al click, abre modal para enviar mensaje de feedback (reconociendo al usuario vía `uid`). Admin puede anular/anular pendiente el botón desde panel, dirigir a URL personalizada, cambiar texto (ej. "Envía Feedback"), imagen/icono (brújula por defecto), etc.

---

## **2. PÁGINA DE DIAGNÓSTICO Y RECUPERACIÓN (`/recuperacion`)**

*Objetivo: Guiar al usuario en pánico con empatía y claridad, sin promesas falsas.*

### **Metaetiquetas SEO**

- **Español:**
  - `title`: Diagnóstico y Recuperación de Criptomonedas | Brújula Cripto
  - `description`: Recupera el acceso a tus wallets y activos cripto de forma segura. Nuestro diagnóstico interactivo te guía paso a paso.
- **Inglés:**
  - `title`: Cryptocurrency Diagnosis & Recovery | Crypto Compass
  - `description`: Recover access to your crypto wallets and assets safely. Our interactive diagnosis guides you step by step.

### **Sección 1: Banner de Diagnóstico (`DiagnosisBanner.tsx`)**

- **Imagen de Fondo:**
  - **Ruta:** `/public/images/recovery/banner-diagnosis.webp`
  - **Tamaño:** 1920x600px
  - **Prompt para generar imagen:** "Calm, reassuring scene of a digital compass pointing to a locked vault opening, soft blue tones, motivational tech vibe."
- **Contenido (ES):**
  - **Título (H1):** `Tranquilo, Estamos Aquí para Ayudarte.`
  - **Subtítulo:** `Responde a unas preguntas simples y te guiaremos a la solución adecuada.`
- **Contenido (EN):**
  - **Title (H1):** `Stay Calm, We're Here to Help.`
  - **Subtitle:** `Answer a few simple questions and we'll guide you to the right solution.`

### **Sección 2: Diagnóstico Interactivo (`RecoveryWizard.tsx`)**

- **Estructura:** Una serie de tarjetas clicables con preguntas comunes.
- **Tarjeta 1 (ES):** `He perdido mi contraseña o seed phrase` (enlaza a `/recuperacion/password`).
- **Tarjeta 1 (EN):** `I've lost my password or seed phrase` (links to `/en/recovery/password`).
- **Tarjeta 2 (ES):** `Necesito ayuda con la seguridad de mi wallet` (enlaza a `/seguridad`).
- **Tarjeta 2 (EN):** `I need help with my wallet security` (links to `/en/security`).
- **Tarjeta 3 (ES):** `Quiero un servicio profesional` (enlaza a `/herramientas/servicios`).
- **Tarjeta 3 (EN):** `I want a professional service` (links to `/en/tools/services`).
- **Tarjeta 4 (ES):** `Necesito rastrear una transacción` (enlaza a `/herramientas/tracker`).
- **Tarjeta 4 (EN):** `I need to track a transaction` (links to `/en/tools/tracker`).

---

## **3. PÁGINA DE SUSCRIPCIÓN (`/suscripcion`)**

*Objetivo: Comunicar el inmenso valor del plan Premium de forma clara y directa, demostrando diferencias con competidores a través de comparaciones interactivas y numéricas.*

### **Metaetiquetas SEO**

- **Español:**
  - `title`: Planes y Precios | Brújula Cripto
  - `description`: Desbloquea el análisis de riesgos en tiempo real y herramientas ilimitadas con Brújula Cripto Premium. Protege tus activos como un profesional.
- **Inglés:**
  - `title`: Plans & Pricing | Crypto Compass
  - `description`: Unlock real-time risk analysis and unlimited tools with Crypto Compass Premium. Protect your assets like a professional.

### **Sección 1: Cabecera**

- **Contenido (ES):**
  - **Título (H1):** `Invierte en tu Tranquilidad.`
  - **Subtítulo:** `Nuestras herramientas gratuitas te ayudan. Nuestra suscripción Premium te protege con privacidad total, un ecosistema completo y control absoluto—mejor que cualquier competidor.`
- **Contenido (EN):**
  - **Title (H1):** `Invest in Your Peace of Mind.`
  - **Subtitle:** `Our free tools help you. Our Premium subscription protects you with total privacy, a complete ecosystem, and full control—better than any competitor.`

### **Sección 2: Tabla de Precios (`PricingPage.tsx`)**

*Dos columnas lado a lado, destacando la opción Premium.*

- **Columna 1: Gratuito**
  - **Precio (ES/EN):** `0€ / Siempre` | `$0 / Forever`
  - **Características:** `Diagnóstico Interactivo`, `Blog y Guías`, `Recuperación de Contraseña (Limitada)`, `Chatbot (Limitado)`.
- **Columna 2: Premium (con un borde resaltado)**
  - **Precio:** `[Precio] € / pago único` (o mensual, según se defina)
  - **Botón (ES/EN):** `Obtener Premium` | `Get Premium`
  - **Características:**
    - `✅ Todo lo del plan Gratuito, y además:`
    - `🚀 **Máxima Potencia** en Recuperación de Contraseña`
    - `🤖 **Chatbot Ilimitado** con Análisis de Wallet`
    - `🛡️ **Análisis de Riesgos de Seguridad en Tiempo Real**`
    - `📈 **Rastreo de Transacciones Avanzado**`
    - `⭐ **Soporte Prioritario**`

### **Sección 3: Descargo de Responsabilidad del Pago**

*Texto legal claro y visible debajo de la tabla de precios.*

- **Contenido (ES):** `Al suscribirte, aceptas nuestros [Términos y Condiciones](/legal/terminos) y confirmas que entiendes nuestro [Descargo de Responsabilidad](/legal/descargo-responsabilidad). El pago desbloquea el acceso completo a nuestras herramientas de software sin garantía explícita de éxito en la recuperación de activos.`
- **Contenido (EN):** `By subscribing, you agree to our [Terms and Conditions](/en/legal/terms) and confirm you understand our [Disclaimer](/en/legal/disclaimer). Payment unlocks full access to our software tools with no explicit guarantee of success in asset recovery.`

### **Sección 4: Diferencias Interactivas con Competidores (`CompetitorComparison.tsx`)**

- **Estructura:** Sección interactiva con tabs para comparar aspectos clave (privacidad, ecosistema, facilidad, modelo de precios). Incluye calculadora integrada: Usuario ingresa monto a recuperar (ej. 500€), herramienta calcula y muestra numéricamente 20% de competidores (100€) vs costo fijo/hora de Brújula (10-20€ para casos pequeños), demostrando ahorros concretos. Textos enfatizan no solo por qué somos mejores (privacidad total en navegador vs envío de datos riesgosos; ecosistema completo con diagnóstico/IA/guías vs solo fuerza bruta; inicio en minutos vs trámites/días; control real-time vs caja negra), sino que lo demuestran con números: "Para 500€ recuperados, pagas 100€ (20%) con competidores vs 10€ con nosotros—ahorras 90€ mientras mantienes privacidad absoluta."

## 4. Mejoras Implementadas para Robustez y Producción 2025

### **A. Optimización de Imágenes para SEO**

- **Descripción:** En todas las imágenes (ej. `banner-hero.webp`), aplicar compresión automática con Sharp en build-time de Next.js, y soporte para AVIF via `next/image`. Añadir en rutas: `format: 'avif'` para mejora de carga.

### **B. Métricas de Engagement**

- **Descripción:** Integrar Google Analytics en todas las páginas: Usar `next/script` para cargar GA4, rastreando tasas de rebote, clics en CTAs y enlaces legales. Configurar eventos en botones como "Obtener Premium".

### **C. Equilibrio Atractivo/Transparencia**

- **Descripción:** En Sección 3, implementar A/B testing para texto de descargo: Versión breve "Acepto términos sin garantía de éxito" vs original. Usar Vercel para variants y medir conversión.

### **D. Adaptación a Pago por Horas**

- **Descripción:** En Sección 2, cambiar a "Planes por Hora": Columna Gratuito (15min herramientas, 30min chatbot), Columna Paquetes (horas comprables). En Sección 4, actualizar calculadora: Inputs monto/horas, coste escalonado (4.99€/h primeras 2, 3.99€/h siguientes) vs 20% competencia.
</DOCUMENT>

</DOCUMENT>
