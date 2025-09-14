Claro, aquí tienes toda la documentación consolidada y formateada en un único archivo Markdown.

---

# 🏗️ PROYEC_PARTE1.MD: Brújula Cripto - Arquitectura Global Unificada (VERSIÓN FINAL DE PRODUCCIÓN)

## 1\. Filosofía del Proyecto

Este proyecto se construye sobre cinco pilares innegociables:

- **Estructura Centralizada:** Un único repositorio (monorepo) para todo el código, gestionado con
  pnpm workspaces, para forzar la compartición de lógica y tipos.
- **Consistencia Forzada:** Herramientas de linting (ESLint) y formato (Prettier) con reglas
  estrictas para que todo el código parezca escrito por una sola persona.
- **Escalabilidad por Diseño:** Arquitectura desacoplada que permite que cada parte del sistema
  crezca de forma independiente.
- **Dualidad Funcional:** Una plataforma con una cara pública para los usuarios y un potente panel
  de administración seguro para la gestión interna.
- **Experiencia de Usuario Universal:** Soporte nativo para múltiples idiomas (español e inglés),
  modos de visualización (claro y oscuro) y un diseño 100% adaptable a dispositivos móviles
  (Mobile-First).

## 2\. Estructura del Monorepo

```text
/brújula-cripto/
├── packages/
│   ├── app/              # El frontend Next.js (público + admin)
│   ├── functions/        # El backend (Cloud Functions)
│   ├── microservice-ia/  # El microservicio de contenido
│   └── types/            # Paquete COMPARTIDO de tipos de TypeScript
├── .eslintrc.json        # Reglas de linting para TODO el proyecto
├── .prettierrc           # Reglas de formato para TODO el proyecto
└── pnpm-workspace.yaml   # Define los paquetes del monorepo
```

**Ventaja Crítica:** El paquete `packages/types` es la única fuente de verdad para los modelos de
datos (`IArticle`, `IUser`). Todos los demás paquetes lo importan. Esto elimina por completo los
errores de inconsistencia de datos entre el frontend, el backend y los servicios.

## 3\. Mejoras Implementadas para Robustez y Producción 2025

### A. Proceso de Actualización para packages/types

**Descripción:** Para mitigar rigidez, se establece un proceso estricto: Cualquier actualización a
tipos (ej. añadir campos) requiere un changelog en `/packages/types/CHANGELOG.md`, pruebas
automatizadas con Jest para validar compatibilidad retroactiva, y revisión por pares antes de merge.
Esto se integra en el flujo de trabajo sin alterar tipos existentes.

### B. Integración de CI/CD

**Descripción:** Se añade pipeline de CI/CD usando Google Cloud Build para automatizar pruebas,
linting (ESLint), formato (Prettier), y despliegues. Triggers en pushes a main: Ejecuta `pnpm test`,
`pnpm lint`, y despliega a Cloud Run/Functions si pasa. Configuración en `cloudbuild.yaml` en raíz
del monorepo.

### C. Mitigación de Vendor Lock-in

**Descripción:** Se evalúan alternativas modulares: Para Firestore, preparar abstracciones con
interfaces en `packages/types` que permitan swap a DynamoDB si necesario. Para Cloud Run, usar
contenedores Docker estándar para portabilidad a ECS. No se altera dependencia actual, solo se añade
sección de evaluación en documentación.

### D. Adaptación al Modelo de Pago por Uso

**Descripción:** Reestructuración completa del modelo de monetización de suscripción recurrente a
pago por uso basado en créditos de tiempo (`usageCreditsInSeconds` en colección `users`).
Integración con Stripe para compras únicas de paquetes de horas, con webhooks que suman créditos al
usuario. Nueva Cloud Function `trackUsage` para descontar créditos en tiempo real durante el uso de
herramientas y chatbot. Créditos iniciales gratuitos: 15 minutos para herramientas avanzadas y 30
minutos para chatbot. Compatible con arquitectura existente, reemplazando `hasPremiumAccess` sin
afectar flujos no relacionados.

### E. Gestión de Recursos en Admin

**Descripción:** Extensión del panel de administración para incluir gestión de banner de inicio
(edición de imagen, texto, botón), visualización y moderación de mensajes de feedback (lectura,
eliminación individual/masiva), y lista de usuarios con saldos de créditos. Gestión dinámica de
precios por horas y paquetes. Todo integrado en rutas existentes de admin sin alterar estructura.

### F. Integración de IA para Contenido y Moderación

**Descripción:** Incorporación de DALL-E 3 (vía OpenAI API) para generación de imágenes en editor de
blog, almacenadas en Firebase Storage. Moderación automática de comentarios en microservicio de IA
usando API de moderación (OpenAI Moderation o Google Perspective API). Editor de blog con
programación de posts, categorías/tags dinámicos, y generación de texto/imágenes por IA. Adaptación
del microservicio de blog para uso externo vía APIs monetizables bajo suscripción, con endpoints
independientes.

---

# 🟦 PROYEC_PARTE2_FINAL_V3.MD (Frontend)

## 1\. Stack Tecnológico (Sin cambios)

- **Framework:** Next.js 14+ (App Router)
- **Lenguaje:** TypeScript (`strict` mode)
- **Estilos:** Tailwind CSS
- ... (resto de tecnologías)

## 2\. Principios de Diseño (Sin cambios)

- **Mobile-First** y **Accesibilidad (a11y)**.

## 3\. Estructura de Carpetas y Nombres de Componentes (`packages/app`) - ACTUALIZADO

```typescript
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
│   │   │   │   └── page.tsx      # **Página de Planes por Hora y Compra de Créditos**
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
│   │   └── chatbot/
│   │       └── page.tsx         # **Página del Chatbot**
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
│       ├── pricing/        # **NUEVO** PricingPage.tsx, CompetitorComparison.tsx (actualizado para pago por horas)
│       └── dashboard/      # **NUEVO** UserDashboard.tsx (con contador de tiempo restante)
...
├── lib/
│   └── api.ts              # Lógica para llamar a backend y miniservicios
```

## 4\. Mejoras Implementadas para Robustez y Producción 2025

### **A. Escalabilidad del `TransactionTracker`**

- **Descripción:** En `TransactionTracker.tsx`, añadir lógica de reintentos con backoff exponencial
  para llamadas a APIs externas. Usar librería `retry-axios` en el frontend para manejar fallos, con
  máximo 3 reintentos y delay inicial de 1s. No altera estructura existente.

### **B. Mapeo de Autenticación con Google OAuth**

- **Descripción:** En `SignInForm.tsx`, aclarar mapeo: Al autenticar con Google, usar
  `firebase.auth().signInWithPopup(googleProvider)` y mapear `uid` directamente a `stripeCustomerId`
  en Firestore vía hook post-login. Añadir en documentación de componente.

### **C. Feedback en Formularios**

- **Descripción:** En componentes como `SignUpForm.tsx`, `SignInForm.tsx`, `PasswordResetForm.tsx` y
  `ContactForm.tsx`, integrar mensajes de error localizados (ES/EN) usando `react-hook-form` con
  resolvers para validaciones como "email ya registrado" o "contraseña débil". Estados de error
  visibles con Tailwind classes.

### **D. Página del Blog (`/blog`)**

- **Componente Principal:** `BlogPage.tsx`
- **Estructura:** Banner superior con H1 ("Explora Nuestro Blog de Cripto Seguridad"), H2 ("Guías,
  Noticias y Consejos Expertos"), descripción llamativa ("Mantente al día con las mejores prácticas
  en criptomonedas"). Barra de búsqueda (`BlogSearchBar.tsx`) para filtrar por
  título/tags/categorías. Lista de tarjetas (`ArticleList.tsx`) con paginación
  (`PaginationControls.tsx`). Cada tarjeta (`ArticleCard.tsx`) con imagen de portada, título,
  excerpt, tags clicables (enlazan a artículos de misma tag/categoría), botones de compartir en
  redes (usando Web Share API nativa para X, Telegram, etc.). Solo usuarios con créditos activos
  pueden interactuar con likes/comentarios (descontando tiempo vía trackUsage). Moderación de
  comentarios integrada con IA automática en backend. Categorías dinámicas gestionadas desde admin
  (`/admin/articles`).

### **E. Página de Artículo Individual (`/blog/[slug]`)**

- **Componente:** `ArticlePage.tsx`
- **Estructura:** Diseño limpio para lectura fácil (Tailwind prose), con H1 (título), meta info
  (autor, fecha, categoría), contenido Markdown renderizado. Tags clicables (enlazan a lista de
  artículos por tag). Flechas de navegación para artículo anterior/siguiente. Botones de compartir
  en redes (Web Share API). Solo usuarios con créditos activos pueden dar like y comentarios
  (descontando tiempo). Enlace a categoría para ver más artículos relacionados. Formulario de
  comentarios con moderación automática en envío.

### **F. Comparación Interactiva en Planes por Hora (`CompetitorComparison.tsx`)**

- **Descripción:** En `/suscripcion/page.tsx`, añadir componente interactivo: Tabs para diferencias
  (privacidad, ecosistema, facilidad). Calculadora para costos: Inputs para "Monto a recuperar" y
  "Horas estimadas". Calcula coste competencia (20% del monto) vs nuestro coste (primeras 2h a
  4.99€/h, siguientes a 3.99€/h), mostrando ahorros numéricos. Créditos iniciales gratuitos
  visibles: 15 min herramientas, 30 min chatbot.

### **G. Contador de Tiempo en Herramientas y Chatbot**

- **Descripción:** En `WasmPasswordEngine.tsx`, `TransactionTracker.tsx`, `ChatbotUI.tsx`: Mostrar
  contador en tiempo real de tiempo restante (formato HH:MM:SS), actualizado vía API calls a
  trackUsage. Pausar/descontar solo durante uso activo. Al agotarse, redirigir a `/suscripcion` para
  compra de paquetes de horas.

### **H. Gestión de Banner y Feedback en Admin**

- **Descripción:** En `/admin`, nueva sección para editar banner de home (campos: imagen
  fondo/superpuesta, textos es/en, botón texto/enlace). Sección para feedback: Tabla de mensajes con
  opciones leer/eliminar individual/masivo, almacenados en colección `feedbackMessages`.

### **I. Editor de Blog en Admin**

- **Descripción:** En `/admin/articles`, editor TipTap extendido con: Selector tamaño texto
  (800/1200/1600 palabras), opción Q\&A/conclusiones, selector profundidad. Campo prompt para IA
  texto (Gemini), prompt para DALL-E 3 imagen (almacenar en Firebase Storage). Subida manual imagen.
  Programación: Fecha/hora inmediata/manual/automática. Gestión categorías/tags: CRUD dinámico en
  interfaz dedicada.

### **J. Gestión de Usuarios en Admin**

- **Descripción:** Nueva sección `/admin/users`: Tabla con usuarios, saldos `usageCreditsInSeconds`
  (formato tiempo), historial compras. Gestión precios: Formulario para actualizar tarifas por hora
  (4.99€ primeras 2h, 3.99€ resto) y paquetes (ej. 1h=5.99€, 5h=19.99€), reflejados en Stripe
  productos.

---

# 🗄️ PROYEC_PARTE3_FINAL_V3.MD (Backend)

## 2\. Estructura de Carpetas (packages/functions) - ACTUALIZADO

```typescript
/packages/functions/
├── src/
│   ├── admin/
│   │   ├── articleHandlers.ts
│   │   ├── setAdminRole.ts
│   │   ├── siteContentHandlers.ts   # Para gestionar el contenido de la home (incluyendo banner editable)
│   │   ├── serviceDirectoryHandlers.ts # Para gestionar el directorio
│   │   ├── userHandlers.ts         # **NUEVO** Para gestión de usuarios y créditos en admin
│   │   └── feedbackHandlers.ts     # **NUEVO** Para gestión de mensajes de feedback
│   ├── payments/
│   │   ├── createCheckout.ts       # Adaptado para paquetes de horas únicas
│   │   ├── stripeWebhooks.ts       # Adaptado para sumatoria de créditos en compras únicas
│   │   └── createStripePortalSession.ts  # **NUEVO** Para gestión de compras (no suscripciones)
│   ├── proxies/
│   ├── public/
│   │   └── handleContactForm.ts     # Para el formulario de contacto
│   └── lib/
│       ├── trackUsage.ts            # **NUEVO** Para descontar créditos en tiempo real
│       └── aiModeration.ts          # **NUEVO** Para moderación automática de comentarios
...
```

## 3\. Modelo de Datos (Firestore) - ACTUALIZADO

**Colección `articles`:** (Sin cambios)

**Colección `users`:** EXPANDIDO PARA PAGO POR USO

- **ID:** uid de Firebase Authentication
- **Campos:**
  - `email` (string)
  - `createdAt` (timestamp)
  - `usageCreditsInSeconds` (number) - **NUEVO CAMPO CLAVE** Inicial: 900 (15 min herramientas) +
    1800 (30 min chatbot, separado si necesario)
  - `stripeCustomerId` (string) - Adaptado para compras únicas
  - `subscriptionStatus` (eliminado) - Reemplazado por estado de créditos
  - `subscriptionId` (eliminado) - No aplicable
  - `purchaseHistory` (array) - **NUEVO** Historial de compras de paquetes de horas

**Colección `professionalServices`:**

- **ID:** Autogenerado
- **Campos:** `name` (string), `website` (string), `description` (string), `logoUrl` (string),
  `specialties` (array), `isVerified` (boolean).

**Colección `siteContent`:**

- **ID del Documento:** `homepage`
- **Campos:** `bannerImageUrl` (string), `bannerOverlayImageUrl` (string), `bannerTitle_es`
  (string), `bannerTitle_en` (string), `bannerSubtitle_es` (string), `bannerSubtitle_en` (string),
  `bannerButtonText_es` (string), `bannerButtonText_en` (string), `bannerButtonLink` (string). \#
  **NUEVO** Overlay image para superposición

**Colección `contactSubmissions`:**

- **ID:** Autogenerado
- **Campos:** `name` (string), `email` (string), `message` (string), `submittedAt` (timestamp),
  `status` ('new' | 'read').

**Colección `feedbackMessages`:** \# **NUEVO**

- **ID:** Autogenerado
- **Campos:** `userId` (string), `message` (string), `submittedAt` (timestamp), `status` ('new' |
  'read' | 'deleted').

**Colección `blogComments`:** \# **NUEVO** Para comentarios moderados

- **ID:** Autogenerado
- **Campos:** `articleId` (string), `userId` (string), `content` (string), `timestamp` (timestamp),
  `moderated` (boolean), `status` ('approved' | 'pending' | 'deleted').

## 4\. Reglas de Seguridad (Firestore) - ACTUALIZADO

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /articles/{articleId} { ... }
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      allow create: if request.auth != null && request.auth.uid == userId;
      // Solo admins pueden leer datos de otros usuarios y saldos
      allow read: if request.auth.token.admin == true;
      // trackUsage permite update condicional para descontar créditos
      allow update: if request.auth != null && resource.data.usageCreditsInSeconds >= (request.resource.data.usageCreditsInSeconds + 1);
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
    // Cualquiera puede crear un envío de contacto, pero nadie puede leerlos excepto admins
    match /contactSubmissions/{submissionId} {
      allow read: if request.auth.token.admin == true;
      allow create: if true;
    }
    // Feedback: Crear para usuarios, leer/eliminar para admins
    match /feedbackMessages/{msgId} {
      allow create: if request.auth != null;
      allow read, update, delete: if request.auth.token.admin == true;
    }
    // Comentarios blog: Crear para usuarios, moderar para admins/IA
    match /blogComments/{commentId} {
      allow create: if request.auth != null;
      allow read: if true;
      allow update, delete: if request.auth.token.admin == true;
    }
  }
}
```

## 5\. Nuevas Cloud Functions para Autenticación y Pago por Uso

### 5.1. `createStripePortalSession.ts`

- **Propósito:** Crear sesión para compra de paquetes de horas (no portal de suscripción)
- **Autenticación:** Usuario autenticado únicamente
- **Flujo:**
  1.  Verificar autenticación del usuario
  2.  Obtener `stripeCustomerId` del documento del usuario
  3.  Crear checkout para productos de paquetes (ej. 1h, 5h)
  4.  Retornar URL de redirección segura

### 5.2. Webhook de Stripe (`stripeWebhooks.ts`) - EXPANDIDO PARA PAGO POR USO

- **Eventos manejados:**
  - `checkout.session.completed` → Sumar segundos al `usageCreditsInSeconds` (ej. 3600s por 1h),
    añadir a `purchaseHistory`
- Actualizaciones automáticas del documento de usuario en Firestore

### 5.3. `trackUsage.ts` - **NUEVO**

- **Propósito:** Descontar créditos durante uso activo (herramientas/chatbot)
- **Autenticación:** Usuario autenticado
- **Flujo:** Endpoint para init/stop uso, con timer backend que descuenta cada segundo si activo.
  Usar Firestore transactions para atomicidad.

### 5.4. `aiModeration.ts` - **NUEVO**

- **Propósito:** Analizar comentarios con OpenAI Moderation API
- **Flujo:** Al crear comentario, llamar API; si flagged, set `status='pending'`; admins aprueban.
  Integrado en handleComment.

### 5.5. Middleware de Autenticación Frontend

- **Archivo:** `middleware.ts` (Next.js)
- **Rutas protegidas:** `/(dashboard)/*`
- **Redirección:** No autenticado → `/login`

## 6\. Mejoras Implementadas para Robustez y Producción 2025

### A. Gestión de Costos en Serverless

**Descripción:** En funciones como `handleContactForm.ts` y proxies, integrar Redis (via Upstash o
Google Memorystore) para caché de respuestas frecuentes a APIs externas, con TTL de 5min. Añadir en
`lib/` un módulo `cache.ts` para manejar get/set sin alterar flujos existentes.

### B. Métricas de Rendimiento

**Descripción:** En todas las Cloud Functions, añadir integración con Google Cloud Monitoring: Usar
`@google-cloud/logging` para registrar métricas de latencia y errores. Configurar alertas para
umbrales \>500ms. Añadir en cada handler:
`const logger = new Logging(); logger.logStructured({message: 'Execution time', duration: ms});`.

### C. Integración DALL-E y Storage

**Descripción:** Nueva función `generateBlogImage.ts`: Llamar OpenAI DALL-E 3 con prompt, subir
resultado a Firebase Storage, retornar URL. Usado en editor de admin.

### D. Gestión Precios en Admin

**Descripción:** Función `updatePricing.ts`: Admin actualiza tarifas por hora y paquetes en
Firestore (colección `pricingConfig`), reflejado en Stripe productos vía API calls.

---

# 🤖 PROYEC_PARTE4.MD: Brújula Cripto - Plan del Microservicio de Contenido IA (VERSIÓN FINAL DE PRODUCCIÓN)

## 1\. Stack Tecnológico

- **Framework:** Genkit for Firebase (TypeScript)
- **Ejecución:** Google Cloud Run (Contenedor Docker)
- **Modelo IA:** Gemini Pro (vía Vertex AI)
- **Trigger:** Google Cloud Scheduler

## 2\. Lógica y Centralización

- **Prompts Centralizados:** Los prompts para Gemini estarán en archivos `.txt` (`/src/prompts`)
  para ser mejorados sin tocar el código.
- **Tipos Compartidos:** Importará `IArticle` desde `@brújula-cripto/types`.
- **Validación Robusta:** Se usará Zod para validar la salida final del LLM.

## 3\. Flujo de Ejecución Detallado - Actualizado para i18n

1.  **Trigger:** Cloud Scheduler llama a la URL de Cloud Run.
2.  **fetch-news:** El flujo ejecuta la herramienta `newsApiTool`. **Manejo de Errores:** Si falla,
    usa un tema "evergreen" de fallback.
3.  **generate-content-es:** Carga el prompt, lo formatea para español, y genera `title`,
    `contentMarkdown`, y `excerpt` en español.
4.  **generate-content-en:** Carga el prompt, lo formatea para inglés, y genera `title`,
    `contentMarkdown`, y `excerpt` en inglés.
5.  **generate-seo-metadata:** Genera un `slug` único (independiente del idioma), `category`, y
    `tags` basados en el contenido de ambos idiomas.
6.  **check-slug-uniqueness:** Consulta Firestore para asegurar que el slug no existe. Si existe,
    añade un sufijo.
7.  **assemble-and-validate:** Construye el objeto `IArticle` final con los contenidos de `es` y
    `en` y los metadatos. Valida el objeto completo con Zod.
8.  **save-to-firestore:** Si la validación pasa, guarda el artículo completo en la base de datos
    con `status: 'draft'` y `source: 'ai-generated'`.
9.  **Logging:** Cada paso registra su estado en Google Cloud Logging.

## 4\. Seguridad y Configuración

- **Gestión de Secretos:** Las claves de Vertex AI se inyectarán de forma segura en el entorno de
  Cloud Run a través de Google Secret Manager.
- **Variables de Entorno:** La configuración (Project ID, etc.) se pasará al contenedor de Cloud Run
  en el momento del despliegue.

## 5\. Mejoras Implementadas para Robustez y Producción 2025

### A. Optimización de Carga en Vertex AI

**Descripción:** En flujo de ejecución, añadir paso post-indexación: Optimizar índice en Vertex AI
priorizando documentos de alta relevancia (basado en frecuencia de uso), con limpieza periódica
semanal via Scheduler. Añadir en logging: Registro de tamaño de índice para monitoreo.

### B. Validación de Respuestas Técnicas

**Descripción:** Después de `assemble-and-validate`, añadir paso `audit-responses`: Implementar
auditoría automatizada usando Zod para precisión técnica, con fallback a revisión manual si score
\<90%. Integrar en flujo sin alterar validación Zod existente.

### C. Generación SEO Automatizada

**Descripción:** En `generate-seo-metadata`, generar metaetiquetas dinámicas (title, description,
keywords) enfocadas a SEO 2025 (usando schema.org, mobile-first indexing). Categorías/tags
dinámicos, editables desde admin. Para posts automáticos, opción en admin para foto (sí/no), enlace
afiliado, programación de publicación.

### D. Moderación Automática de Comentarios

**Descripción:** Añadir endpoint dedicado `/moderate-comment` en el microservicio: Recibe `content`
de comentario, analiza con OpenAI Moderation API (o Google Perspective), retorna `flagged` status.
Si `flagged`, set 'pending' en Firestore; admins revisan. Integrado en flujo de guardado de
comentarios sin alterar generación de contenido.

### E. Adaptación para Uso Externo y Monetización de APIs

**Descripción:** Exponer endpoints independientes para generación de contenido IA (ej.
`/generate-article-external`) con autenticación API key (suscripción externa vía Stripe). Mínimos
cambios: Reutilizar prompts/flujos existentes, añadir validación de quota por key en Firestore.
Compatible con uso interno; monetizable bajo suscripción separada (ej. 10 artículos/mes por 9.99€).

---

# 🗺️ PROYEC_PARTE5.MD: Brújula Cripto - Plano de Experiencia de Usuario y Navegación (Producción)

### Preámbulo

Este documento detalla la estructura visible de la aplicación, las páginas, su contenido, la
navegación y los flujos de interacción del usuario. Es el complemento a los planos de arquitectura y
debe seguirse para construir una experiencia de usuario coherente, intuitiva y legalmente sólida.
Todo está diseñado bajo un principio **Mobile-First**.

---

## 1\. Navegación Global

### **A. Cabecera (Navbar - `Navbar.tsx`)**

_La cabecera será limpia, minimalista y estará siempre visible (sticky)._

- **Logo:** A la izquierda, enlaza a la página de inicio.
- **Enlaces de Navegación (Público):**
  - **Blog:** Enlaza a `/blog`.
  - **Herramientas ▾:** Un menú desplegable que contiene:
    - **Diagnóstico y Recuperación:** Enlaza a `/recuperacion`.
    - **Rastreador de Transacciones:** Enlaza a `/herramientas/tracker`.
    - **Directorio de Servicios:** Enlaza a `/herramientas/servicios`.
  - **Guías de Seguridad:** Enlaza a `/seguridad`.
  - **Chatbot:** Enlaza a `/chatbot` (con indicador de tiempo restante si registrado).
- **Acciones a la Derecha:**
  - **Selector de Idioma (ES/EN):** Un icono de globo terráqueo con un pequeño menú.
  - **Selector de Tema (Claro/Oscuro):** Un icono de sol/luna.
  - **Contacto:** Enlaza a `/contacto`.
  - **Para Registrados:** Avatar con dropdown: Mi Cuenta (`/cuenta`, mostrando tiempo restante),
    Cerrar Sesión.

### **B. Pie de Página (Footer - `Footer.tsx`)**

_El pie de página será compacto y contendrá información esencial sin ocupar demasiado espacio._

- **Estructura (3 columnas en escritorio, apiladas en móvil):**
  - **Columna 1: Navegación**
    - Blog
    - Herramientas
    - Guías de Seguridad
    - Chatbot
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
  - **Descargo de Responsabilidad General:** Un enlace bien visible a
    `/legal/descargo-responsabilidad`.

---

## 2\. Páginas Visibles al Público

### **A. Página de Inicio (`/`)**

1.  **Banner Principal (`HomepageBanner.tsx`):** Imagen de fondo, overlay image opcional, título,
    subtítulo y un botón de llamada a la acción (CTA). **Todo el contenido es editable** desde el
    panel de administración (foto fondo/overlay, texto, botón enlace/texto, etc.).
2.  **Carrusel de Posts (`FeaturedPostsCarousel.tsx`):** Muestra las últimas 4-5 entradas destacadas
    del blog con tarjetas visuales (`ArticleCard.tsx`).
3.  **Sección de Herramientas:** Iconos y descripciones breves de las herramientas principales, con
    enlaces a cada una. Indicador de créditos gratuitos iniciales (15 min herramientas, 30 min
    chatbot).
4.  **Descargo de Responsabilidad:** Un pequeño pero visible bloque de texto en la parte inferior de
    la página con un resumen del descargo y enlace completo.
5.  **Botón de Feedback (`FeedbackButton.tsx`):** Solo para registrados con créditos, permite enviar
    mensajes (reconociendo usuario). Admin puede anular/pendiente, cambiar enlace, texto, imagen.
    Mensajes gestionados en admin.

### **B. Página de Diagnóstico Interactivo (`/recuperacion`)**

- **Componente:** `RecoveryWizard.tsx`.
- **Interacción:** Una serie de tarjetas con preguntas comunes, como "He perdido mi contraseña"
  (enlaza a `/recuperacion/password`). Indicador de tiempo restante durante uso.

### **C. Página de Recuperación de Contraseña (`/recuperacion/password`)**

- **Componente:** `WasmPasswordEngine.tsx`.
- **Interacción:** Formulario para introducir datos (ej. diccionarios), con niveles gratuito inicial
  (15 min) y pago por horas (descontando de `usageCreditsInSeconds`). Muestra progreso, contador
  tiempo y resultados.

### **D. Página de Guías de Seguridad (`/seguridad`)**

- **Componente:** `SecurityGuides.tsx`.
- **Interacción:** Lista filtrada del blog por categoría "seguridad".

### **E. Página de Rastreador de Transacciones (`/herramientas/tracker`)**

- **Componente:** `TransactionTracker.tsx`.
- **Interacción:** Formulario para introducir hash de transacción o dirección, muestra resultados
  detallados de APIs externas. Contador tiempo durante uso.

### **F. Página de Directorio de Servicios (`/herramientas/servicios`)**

- **Componente:** `ServiceDirectory.tsx`.
- **Interacción:** Lista de servicios profesionales con filtros por especialidad.

### **G. Páginas Legales (`/legal/*`)**

_Estas páginas son fundamentales y deben estar perfectamente redactadas._

1.  **Aviso Legal, Privacidad, Términos y Condiciones:** Páginas de texto estático con el contenido
    legal correspondiente.
2.  **Descargo de Responsabilidad (`/legal/descargo-responsabilidad`):**
    - **Contenido:** Esta página contendrá un texto **enorme y muy claro** explicando que Brújula
      Cripto es una herramienta de software, que no garantiza la recuperación, que no es un servicio
      de custodia, que no ofrece consejo financiero y que el uso de las herramientas es bajo la
      propia responsabilidad del usuario. Adaptado para modelo de pago por horas: "El tiempo
      comprado desbloquea uso temporal sin garantía de éxito".
    - **Visibilidad:** El enlace a esta página estará en el footer y en cualquier lugar donde se
      ofrezca un servicio de pago o de riesgo.

### **H. Página de Contacto (`/contacto`)**

- **Componente:** `ContactForm.tsx`.
- **Interacción:** Formulario para enviar nombre, email y mensaje, que se procesa a través de una
  Cloud Function.

### **I. Página del Blog (`/blog`)**

- **Componente Principal:** `BlogPage.tsx`
- **Estructura:** Banner superior editable desde admin (foto, texto H1/H2, descripción). Barra de
  búsqueda para títulos/tags/categorías. Lista paginada de tarjetas con sharing nativo,
  likes/comentarios solo para usuarios con créditos (descontando tiempo). Categorías/tags dinámicos
  editables/creables desde admin. Comentarios moderados auto/manual.

### **J. Página de Artículo (`/blog/[slug]`)**

- **Componente:** `ArticlePage.tsx`
- **Estructura:** Contenido fácil de leer, tags clicables, flechas para navegación, sharing nativo,
  likes/comentarios para usuarios con créditos. Formulario comentarios con moderación IA.

### **K. Página del Chatbot (`/chatbot`)**

- **Componente:** `ChatbotUI.tsx`
- **Estructura:** Interfaz espectacular con imagen de brújula como logo, nombre "Brújula".
  Conversaciones listadas, respuestas streaming, sugerencias, render components (tablas/tarjetas).
  Contador tiempo (30 min inicial gratuito, luego pago por horas).

### **L. Página de Planes por Hora (`/suscripcion`)**

- **Componente Principal:** `PricingPage.tsx`
- **Interacción:** Tabla de paquetes de horas (ej. 1h=5.99€, 5h=19.99€), sección interactiva de
  diferencias con calculadora para demostrar valor (inputs monto/horas, compara 20% competencia vs
  tarifas escalonadas: 4.99€/h primeras 2h, 3.99€/h resto). Muestra créditos iniciales gratuitos y
  tiempo restante si registrado.

---

## 3\. Flujo de Pago y Consentimiento (Monetización)

_La legalidad y la claridad en el pago son innegociables._

1.  **Oferta:** En páginas de herramientas/chatbot, junto al uso gratuito inicial, mostrar oferta de
    paquetes de horas (`PricingTier.tsx`).
2.  **Consentimiento Explícito:** Junto al botón de compra (`UpgradeButton.tsx`), casilla
    obligatoria:
    > `☐ He leído y acepto los [Términos y Condiciones](/legal/terminos) y entiendo el [Descargo de Responsabilidad](/legal/descargo-responsabilidad), reconociendo que la compra de horas desbloquea uso temporal de software sin garantía de éxito.`
3.  **Proceso:** Botón solo activado con casilla marcada; integra Stripe para compra única, suma
    créditos.
4.  **Visibilidad:** Enlace descargo visible durante compra y uso.

---

## 4\. Páginas de Administración (`/admin/*`)

- **Acceso:** Protegido por una página de login (`/admin/auth`).
- **Dashboard (`/admin`):** Vista general de últimos artículos, borradores, estadísticas, usuarios y
  saldos créditos.
- **Gestión de Artículos (`/admin/articles`):**
  - Tabla (`ArticleDataTable.tsx`) para ver/filtrar/editar/eliminar artículos. Botón crear nuevo con
    editor avanzado: TipTap para texto, selector palabras (800/1200/1600), opción Q\&A/conclusiones,
    profundidad. Prompt IA texto (Gemini), prompt DALL-E imagen (OpenAI API, subir a Storage).
    Subida manual imagen. Programación: Inmediata/manual/automática. CRUD categorías/tags.
  - **Moderación comentarios:** Tabla para aprobar/eliminar, con flags IA.
- **Editor de Artículos (`/admin/articles/[id]`):**
  - Editor TipTap para modificar, estado (Borrador/Publicado/Programado), afiliados, portada
    (IA/manual).
- **Gestión de Contenido de la Home:** Sección para editar banner (fondo/overlay, textos es/en,
  botón).
- **Gestión de Feedback (`/admin/feedback`):** **NUEVO** Tabla mensajes, leer/eliminar
  individual/masivo.
- **Gestión de Usuarios (`/admin/users`):** **NUEVO** Tabla usuarios, saldos tiempo, historial
  compras. Formulario actualizar precios horas/paquetes.

## 5\. Mejoras Implementadas para Robustez y Producción 2025

### **A. Pruebas de Usabilidad del RecoveryWizard**

- **Descripción:** En página `/recuperacion`, integrar pruebas A/B: Usar Vercel o Optimizely para
  variar texto/orden de tarjetas en `RecoveryWizard.tsx`, midiendo conversión a herramientas.
  Registrar métricas en Firestore para análisis.

### **B. Diseño Discreto para Saturación de Enlaces Legales**

- **Descripción:** En `Footer.tsx`, para móvil, implementar acordeón con Tailwind para colapsar
  enlaces legales (Columna 2), expandible con click. Mantener visibilidad pero reducir sobrecarga
  visual.

### **C. Contador Tiempo en UX**

- **Descripción:** En todas las herramientas y chatbot, contador visible HH:MM:SS actualizado
  real-time vía `trackUsage`. Al 0, upsell suave a `/suscripcion` con calculadora.

---

# 🗺️ PROYEC_PARTE6.MD - Plano de Experiencia de Usuario y Navegación

## 1\. Navegación Global y Páginas Públicas

### **A. Estructura de Navegación**

- **Header Adaptativo:** Cambia según estado de autenticación del usuario
- **Footer Consistente:** Enlaces legales y contacto en todas las páginas
- **Breadcrumbs:** Navegación jerárquica en páginas internas

### **B. Estados de Navegación**

#### **Usuario NO Autenticado**

```
[Logo] [Blog] [Herramientas] [Chatbot] [Contacto] [Registro] [Login]
```

#### **Usuario Autenticado**

```
[Logo] [Blog] [Herramientas] [Chatbot] [Contacto] [Avatar ▼] (Tiempo Restante: HH:MM:SS)
                                        ├─ Mi Cuenta (/cuenta)
                                        └─ Cerrar Sesión
```

## 2\. Páginas Públicas (Área `(main)/`)

### **A. Páginas de Contenido**

1.  **Inicio (`/`)** - HomepageBanner (editable admin) + FeaturedPostsCarousel
2.  **Blog (`/blog`)** - Lista con búsqueda y paginación, comentarios moderados
3.  **Artículo (`/blog/[slug]`)** - Vista individual, comentarios con IA mod
4.  **Contacto (`/contacto`)** - Formulario de contacto

### **B. Herramientas Públicas**

1.  **Recuperación (`/recuperacion`)** - RecoveryWizard (diagnóstico, tiempo inicial 15 min)
2.  **Motor WASM (`/recuperacion/password`)** - WasmPasswordEngine (contador tiempo)
3.  **Seguridad (`/seguridad`)** - Blog filtrado por categoría
4.  **Tracker (`/herramientas/tracker`)** - TransactionTracker (tiempo activo)
5.  **Servicios (`/herramientas/servicios`)** - ServiceDirectory

### **C. Páginas Legales (`/legal/`)**

1.  **Aviso Legal (`/legal/aviso-legal`)**
2.  **Privacidad (`/legal/privacidad`)**
3.  **Términos (`/legal/terminos`)**
4.  **Descargo (`/legal/descargo-responsabilidad`)** (adaptado a pago por horas)

## 3\. Cuentas de Usuario y Pago por Uso

### **A. Páginas de Autenticación (`(main)/`)**

#### **A.1. Registro (`/registro`)**

- **Componente:** `SignUpForm.tsx`
- **Campos:** Email, Contraseña, Confirmar Contraseña
- **Validación:** Checkbox obligatorio para Política de Privacidad y Términos
- **Post-registro:** Asignar créditos iniciales (15 min herramientas + 30 min chatbot), redirección
  a `/cuenta`
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
  1.  Usuario introduce email
  2.  Firebase Authentication envía correo automático
  3.  Usuario recibe enlace seguro para restablecer
- **Mensaje de confirmación:** "Revisa tu correo electrónico"

### **B. Página de Planes por Hora (`/suscripcion`)**

#### **B.1. Estructura de Precios**

- **Componente:** `PricingPage.tsx`
- **Estructura:** Columnas para paquetes (Gratuito Inicial vs Paquetes Pagados)
- **Nivel Gratuito Inicial:** 15 min herramientas + 30 min chatbot (`usageCreditsInSeconds` inicial)
- **Paquetes Pagados:** Beneficios por horas compradas (descontando tiempo activo):
  - Ej. 1h por 5.99€, 5h por 19.99€
  - Tarifas: Primeras 2h 4.99€/h, resto 3.99€/h (calculadora muestra)
  - Soporte prioritario durante uso pagado
- **CTA:** Botón "Comprar Paquete" → integración Stripe (compra única)

#### **B.1.1. Calculadora Interactiva**

- **Inputs:** "Monto a recuperar (€)", "Horas estimadas"
- **Output:** Coste competencia (20% monto) vs Nuestro (tarifas escalonadas), ahorros numéricos
- **Enfatiza:** Privacidad local, ecosistema completo, inicio rápido, control real-time

### **B.2. Página de Error 404 (`not-found.tsx`)**

- **Componente:** `NotFoundPage.tsx`
- **Estructura:** Imagen amigable (brújula perdida), H1 ("Página No Encontrada"), descripción ("Lo
  sentimos, la página que buscas no existe").

## 4\. Flujos de Usuario Críticos

### **A. Flujo de Registro Completo**

1.  **Descubrimiento:** Usuario llega desde herramientas → ve límite gratuito
2.  **Conversión:** Click "Comprar Tiempo" → `/suscripcion`
3.  **Decisión:** Calculadora compara costos → Selecciona paquete
4.  **Autenticación:** Si no registrado, redir a `/registro` → formulario
5.  **Pago:** Post-registro/login → checkout Stripe (suma créditos)
6.  **Activación:** Webhook suma `usageCreditsInSeconds`
7.  **Bienvenida:** Redirección a `/cuenta` con tiempo restante

### **B. Flujo de Login Existente**

1.  **Acceso:** Usuario intenta herramienta sin créditos suficientes
2.  **Redirección:** Middleware → `/login` si no auth
3.  **Autenticación:** Email/contraseña o Google OAuth
4.  **Redirección:** Post-login → herramienta o `/cuenta` (muestra tiempo)

### **C. Flujo de Gestión de Créditos**

1.  **Acceso:** Usuario en `/cuenta` → sección "Mis Créditos" (tiempo restante HH:MM:SS, historial
    compras)
2.  **Compra:** Click "Comprar Más Tiempo" → Portal Stripe para paquetes
3.  **Gestión:** Compra única en portal (no recurrente)
4.  **Webhook:** Stripe notifica → suma créditos en Firestore
5.  **Reflejo:** Actualización real-time en UI vía listener

### **D. Flujo de Uso Activo**

1.  **Inicio Uso:** En herramienta/chatbot, init `trackUsage` (descuenta cada seg activo)
2.  **Pausa:** Al inactividad \>30s, pausa contador
3.  **Agotado:** Al 0, modal upsell a `/suscripcion`
4.  **Consentimiento:** Checkbox descargo antes de compra/uso pagado

## 5\. Adaptaciones de Navegación

### **A. Responsive Design**

- **Mobile:** Menú hamburguesa colapsible
- **Tablet:** Navegación horizontal compacta
- **Desktop:** Navegación completa expandida

### **B. Estados de Loading**

- **Autenticación:** Spinner durante verificación de estado
- **Stripe checkout:** Loading durante redirección
- **Formularios:** Estados de envío con feedback
- **Contador Tiempo:** Real-time sync con backend

### **C. Manejo de Errores**

- **Autenticación fallida:** Mensajes claros de error
- **Stripe error:** Redirección con mensaje
- **Créditos insuficientes:** Mensaje "Tiempo agotado, compra más en `/suscripcion`"
- **Conexión perdida:** Notificación de reconexión

## 6\. Integración con Documentación Existente

### **A. Actualización PROYEC_PARTE2.MD (Frontend)**

- ✅ Rutas actualizadas: `/(main)/suscripcion` para planes por hora
- ✅ Componentes: `PricingPage` con calculadora escalonada, `UserDashboard` con contador/historial
- ✅ Navegación: Indicador tiempo en header para auth

### **B. Actualización PROYEC_PARTE3.MD (Backend)**

- ✅ Modelo `users` con `usageCreditsInSeconds`, `purchaseHistory`
- ✅ Cloud Function: `trackUsage.ts` para descuento real-time
- ✅ Webhook Stripe para compras únicas (suma créditos)
- ✅ Reglas seguridad para updates atómicos de créditos

### **C. Middleware de Protección**

- **Archivo:** `middleware.ts` (Next.js)
- **Rutas protegidas:** `/(dashboard)/*`
- **Comportamiento:** Redirección automática a `/login` si no autenticado; check créditos para
  herramientas

## 7\. Mejoras Implementadas para Robustez y Producción 2025

### **A. Tarifas Específicas en Pago por Hora**

- **Descripción:** En B.1, definir tarifas: Primeras 2h 4.99€/h, siguientes 3.99€/h. Paquetes:
  1h=5.99€, 5h=19.99€ (pago único). Actualizar en `PricingPage.tsx` con variables de Firestore para
  flexibilidad admin.

### **B. Especificación de Soporte Prioritario**

- **Descripción:** Durante uso pagado, SLA \<24h vía email dedicado. En `/cuenta`, botón "Soporte"
  si tiempo \>0.

### **C. Retención de Usuarios**

- **Descripción:** Post-compra, emails Mailgun con tips y recordatorio créditos. Trigger en webhook
  para notificaciones de bajo saldo.

### **D. Valor Diferencial en Planes**

- **Descripción:** En `/suscripcion`, enfatizar: Privacidad (local vs servidores), ecosistema
  (completo vs limitado), facilidad (rápido vs trámites), control (real-time vs caja negra).
  Calculadora demuestra ahorros con tarifas escalonadas.

---

# 🤖 PROYEC_PARTE7.MD: Brújula Cripto - Plan de Arquitectura - Miniservicio de Chatbot Cripto-Especialista (V2)

## 1\. Visión General y Propósito

Este documento detalla la arquitectura de un miniservicio completamente independiente y robusto que
alojará a un chatbot especialista en criptomonedas. El servicio funcionará bajo un modelo Freemium
(créditos iniciales 30 min gratuitos) y pago por horas, integrándose con la plataforma principal de
Brújula Cripto.

**Principios Clave:**

- **Aislamiento:** El servicio se ejecuta de forma independiente para no afectar al rendimiento de
  la aplicación principal.
- **Escalabilidad:** Construido sobre infraestructura serverless para manejar cualquier nivel de
  carga.
- **Inteligencia Real:** El chatbot no solo responde, sino que "aprende" a través de RAG
  (Retrieval-Augmented Generation) y puede interactuar con datos de la blockchain en tiempo real.
- **Pago por Uso:** Descuenta de `usageCreditsInSeconds` durante conversaciones activas (via
  `trackUsage`).

## 2\. Arquitectura Técnica Detallada

El servicio se construirá sobre Google Cloud, manteniendo la coherencia con el resto del ecosistema.

- **Hosting del Servicio:** Google Cloud Run.
- **Orquestación de IA:** Genkit for Firebase.
- **Modelo de Lenguaje (LLM):** Google Gemini Pro.
- **Base de Datos de Conversaciones:** Cloud Firestore.
- **Base de Conocimiento ("Aprendizaje"):** Vertex AI Vector Search. Aquí es donde el chatbot
  "aprende", indexando documentación técnica, whitepapers y guías de seguridad para dar respuestas
  expertas (RAG).
- **Conexión a la Blockchain (Herramientas):** El chatbot usará "Tools" de Genkit para interactuar
  con APIs externas (ej. Covalent, Moralis, GoPlus Security). Las herramientas serán:
  - `getWalletAnalysis(address, chain)`: Devuelve el balance, tokens, NFTs y un análisis de riesgos
    (solo si créditos \>0).
  - `getTransactionStatus(txHash, chain)`: Verifica el estado de una transacción.
  - `getContractAuditSummary(contractAddress, chain)`: Obtiene un resumen de la seguridad de un
    contrato.

## 3\. Modelo de Datos en Firestore (Dedicado al Chatbot)

**Colección `chatbot_conversations`:**

- **Campos:** `userId`, `title`, `isFavorite`, `createdAt`, `updatedAt`, `creditsUsed` (number) -
  **NUEVO** Segundos descontados.

**Sub-colección `chatbot_messages`:**

- Anidada dentro de cada conversación.
- **Campos:** `role` ('user' | 'model'), `content`, `timestamp`.

## 4\. Funcionalidades de Usuario y Flujo de Interacción

El frontend (`packages/app`) tendrá una nueva sección para el chatbot que interactuará con el
miniservicio a través de una API REST.

- **Endpoints de la API:** `GET /conversations`, `POST /conversations`, `PUT /conversations/{id}`,
  `DELETE /conversations/{id}`, `POST /conversations/{id}/messages` (con streaming, check créditos
  via `trackUsage`).
- **Panel de Usuario del Chatbot:** Una barra lateral con la lista de conversaciones (crear,
  renombrar, favorito, borrar) y la ventana de chat principal. Contador tiempo restante visible.

## 5\. Modelo de Monetización y Propuesta de Valor

Reemplazado por pago por horas: Créditos iniciales 30 min gratuitos para enganchar.

### A. El Valor para el Usuario Gratuito Inicial (El Anzuelo 🎣)

El usuario registrado obtiene 30 min gratuitos para consultas generales. Cuando pide análisis
wallet, ofrece demo limitada si créditos bajos. **Respuesta Gratuita:** "He identificado que la
dirección 0x123... es una wallet válida en Ethereum. Para análisis completo, necesitas más tiempo.
Tienes X min restantes o compra paquetes en `/suscripcion`."

### B. El Valor para el Usuario de Pago por Horas (La Solución Completa 🛡️)

Durante uso pagado (descontando segundos), entrega informes completos. **Respuesta Pagada:** "Claro.
Aquí tienes el análisis de tu wallet:

- **Valor Total:** 1,250.45 €
- **Activos:** 150.2 MATIC, 0.25 WETH, 500.10 USDC...
- **NFTs:** 2 de la colección "CryptoPunks Polygon".
- 🚨 **¡ANÁLISIS DE RIESGOS\!** 🚨 ¡Atención\! Aprobación de Contrato de Riesgo: Tienes una
  aprobación ilimitada para el contrato 0x789.... Este contrato podría retirar todos tus WETH. Se
  recomienda revocar este permiso inmediatamente."

El valor es la claridad financiera y seguridad proactiva, con descuento tiempo solo en interacciones
activas.

## 6\. Integración con la Plataforma Existente

- **Frontend (`packages/app`):** Se creará una nueva ruta `/chatbot` con los componentes de la
  interfaz (`ChatbotUI.tsx`, `ConversationList.tsx`). El archivo `lib/api.ts` se ampliará para
  llamar a los endpoints del nuevo miniservicio, integrando `trackUsage` para créditos.
- **Backend (`packages/functions`):** Se añadirán las funciones de pago de Stripe para paquetes de
  horas, que suman al `usageCreditsInSeconds`. Integrar `trackUsage` en endpoints de chat.
- **Tipos (`packages/types`):** Se añadirán las nuevas interfaces: `IChatConversation` y
  `IChatMessage`, con `creditsUsed`.

## 7\. Experiencia de Usuario (UX) Espectacular

Para que sea el mejor chatbot del mundo, la experiencia debe ser impecable:

- **Respuestas en Streaming:** El chatbot escribirá las respuestas palabra por palabra, como
  ChatGPT, dando una sensación de "pensamiento" en tiempo real y mejorando la percepción de
  velocidad (descontando tiempo durante stream).
- **Sugerencias de Preguntas:** Al iniciar una nueva conversación o después de una respuesta, el
  chatbot sugerirá preguntas de seguimiento relevantes. Ej: "¿Quieres que analice los riesgos de
  este contrato?", "¿Te gustaría saber más sobre el token WETH?".
- **Renderizado de Componentes:** El chatbot no solo devolverá texto. Cuando genere un informe de
  wallet, el frontend renderizará componentes visuales (tablas para tokens, tarjetas para NFTs)
  dentro del chat, haciendo la información mucho más digerible.
- **Memoria a Corto y Largo Plazo:** El chatbot recordará el contexto de la conversación actual.
  Además, a través de RAG, tendrá acceso al conocimiento experto, simulando una memoria a largo
  plazo.
- **Claridad y Simplicidad:** Todas las respuestas, incluso las más técnicas, se explicarán en un
  lenguaje sencillo. El objetivo no es abrumar, sino empoderar al usuario.
- **Diseño Espectacular:** Imagen principal de brújula como icono/logo, nombre del chatbot "Brújula"
  visible en header de página. Contador tiempo en esquina.

## 8\. Mejoras Implementadas para Robustez y Producción 2025

### A. Límites de Uso para Chatbot Gratuito Inicial

**Descripción:** En endpoints API, implementar límites: Usuarios con créditos iniciales (30 min)
descontados via `trackUsage`. Si \<30s restantes, retornar error 429 con mensaje upsell a
`/suscripcion`. No altera flujos pagados; pausa en inactividad.

### B. Integración con Pago por Horas

**Descripción:** Extender `trackUsage` para chat: Descontar solo durante respuestas
activas/streaming. Al agotar, "Tus 30 min iniciales se han usado. Compra más tiempo para continuar."

---

# 💎 TEXTOS_IMAGENES.MD: SEO, Copywriting y Activos Visuales (Producción V2)

### Preámbulo

Este documento detalla el contenido textual (copy), las metaetiquetas SEO (título y descripción) y
las especificaciones para los activos visuales de todas las páginas públicas de Brújula Cripto. El
objetivo es crear una narrativa de marca fuerte, comunicar valor real y alcanzar la máxima
visibilidad en motores de búsqueda. Adaptado al modelo de pago por horas con créditos iniciales
gratuitos.

---

## **1. PÁGINA DE INICIO (`/`)**

_Objetivo: Captar la atención en 3 segundos, establecer confianza y guiar al usuario hacia las
herramientas clave, destacando créditos gratuitos iniciales._

### **Metaetiquetas SEO**

- **Español:**
  - `title`: Brújula Cripto | Seguridad y Recuperación de Criptomonedas
  - `description`: Tu guía experta para proteger, gestionar y recuperar tus criptoactivos. Prueba
    gratis 15 min en herramientas + 30 min en chatbot. Herramientas reales para tranquilidad.
- **Inglés:**
  - `title`: Crypto Compass | Cryptocurrency Security & Recovery
  - `description`: Your expert guide to protect, manage, and recover your crypto assets. Free trial:
    15 min tools + 30 min chatbot. Real tools for peace of mind.

### **Sección 1: Banner Principal (`HomepageBanner.tsx`)**

- **Imagen de Fondo:**
  - **Ruta:** `/public/images/home/banner-hero.webp`
  - **Tamaño:** 1920x1080px (16:9)
  - **Prompt para generar imagen:** "Abstract, elegant digital vault with a glowing blue compass
    needle floating in the center, dark background, cinematic lighting, sophisticated, secure, tech
    aesthetic."
- **Overlay Image (Opcional, editable admin):**
  - **Ruta:** `/public/images/home/overlay-compass.webp`
  - **Prompt:** "Glowing compass overlay on digital background, transparent PNG."
- **Contenido (ES):**
  - **Título (H1):** `Navega el Mundo Cripto con Confianza.`
  - **Subtítulo:**
    `Prueba gratis 15 min en recuperación y 30 min en chatbot. Compra horas extras a tarifas bajas para protección total.`
  - **Botón:** `Empezar Diagnóstico Gratis` (enlaza a `/recuperacion`)
- **Contenido (EN):**
  - **Title (H1):** `Maps the Crypto World with Confidence.`
  - **Subtitle:**
    `Free trial 15 min recovery + 30 min chatbot. Buy extra hours at low rates for full protection.`
  - **Button:** `Start Free Diagnosis` (links to `/en/recovery`)

### **Sección 2: Propuesta de Valor (`ValueProposition.tsx`)**

_Una sección limpia con 3 iconos y texto breve._

- **Título (ES):** `Tu Escudo en el Ecosistema Digital`
- **Título (EN):** `Your Shield in the Digital Ecosystem`
- **Columna 1:**
  - **Icono:** Un escudo (`shield-check-icon.svg`)
  - **Título (ES):** `Protección Proactiva`
  - **Texto (ES):**
    `Analiza riesgos con tus créditos iniciales gratuitos. Compra horas para análisis ilimitados.`
- **Columna 2:**
  - **Icono:** Una llave inglesa (`wrench-icon.svg`)
  - **Título (ES):** `Herramientas Reales`
  - **Texto (ES):**
    `Desde recuperación de contraseñas (15 min gratis) hasta rastreo pagado por horas.`
- **Columna 3:**
  - **Icono:** Una brújula (`compass-icon.svg`)
  - **Título (ES):** `Guía Experta`
  - **Texto (ES):** `Chatbot con 30 min gratis, luego por horas para seguridad experta.`

### **Sección 3: Carrusel de Posts Destacados (`FeaturedPostsCarousel.tsx`)**

- **Imagen de Fondo (opcional):** Ninguna, para mantener foco en tarjetas.
- **Contenido:** Muestra 4-5 posts recientes del blog con tarjetas (`ArticleCard.tsx`), cada una con
  imagen de portada (IA o manual), título, excerpt y enlace al artículo completo.
- **Interacción:** Carrusel deslizable con controles de flechas, auto-scroll opcional desactivado
  por defecto.

### **Sección 4: Botón de Feedback (`FeedbackButton.tsx`)**

- **Ubicación:** Flotante en esquina inferior derecha de la homepage, visible solo para usuarios
  registrados.
- **Interacción:** Al click, abre modal para enviar mensaje de feedback (reconociendo al usuario vía
  `uid`, sin descontar tiempo). Admin gestiona en panel (leer/eliminar).

---

## **2. PÁGINA DE DIAGNÓSTICO Y RECUPERACIÓN (`/recuperacion`)**

_Objetivo: Guiar al usuario en pánico con empatía y claridad, sin promesas falsas, destacando 15 min
gratuitos._

### **Metaetiquetas SEO**

- **Español:**
  - `title`: Diagnóstico y Recuperación de Criptomonedas | Brújula Cripto
  - `description`: Recupera acceso a wallets con 15 min gratis. Compra horas extras si necesitas
    más. Guía paso a paso segura.
- **Inglés:**
  - `title`: Cryptocurrency Diagnosis & Recovery | Crypto Compass
  - `description`: Recover wallet access with 15 min free. Buy extra hours if needed. Safe
    step-by-step guide.

### **Sección 1: Banner de Diagnóstico (`DiagnosisBanner.tsx`)**

- **Imagen de Fondo:**
  - **Ruta:** `/public/images/recovery/banner-diagnosis.webp`
  - **Tamaño:** 1920x600px
  - **Prompt para generar imagen:** "Calm, reassuring scene of a digital compass pointing to a
    locked vault opening, soft blue tones, motivational tech vibe."
- **Contenido (ES):**
  - **Título (H1):** `Tranquilo, Estamos Aquí para Ayudarte.`
  - **Subtítulo:**
    `Usa tus 15 min gratuitos para diagnóstico. Si necesitas más, compra horas asequibles.`
- **Contenido (EN):**
  - **Title (H1):** `Stay Calm, We're Here to Help.`
  - **Subtitle:** `Use your 15 min free for diagnosis. Buy affordable hours if you need more.`

### **Sección 2: Diagnóstico Interactivo (`RecoveryWizard.tsx`)**

- **Estructura:** Una serie de tarjetas clicables con preguntas comunes.
- **Tarjeta 1 (ES):** `He perdido mi contraseña o seed phrase` (enlaza a `/recuperacion/password`,
  nota: 15 min gratis).
- **Tarjeta 2 (ES):** `Necesito ayuda con la seguridad de mi wallet` (enlaza a `/seguridad`).
- **Tarjeta 3 (ES):** `Quiero un servicio profesional` (enlaza a `/herramientas/servicios`).
- **Tarjeta 4 (ES):** `Necesito rastrear una transacción` (enlaza a `/herramientas/tracker`, tiempo
  pagado).

---

## **3. PÁGINA DE PLANES POR HORA (`/suscripcion`)**

_Objetivo: Comunicar el valor del pago por horas, con calculadora escalonada y créditos iniciales,
demostrando superioridad numérica sobre competidores._

### **Metaetiquetas SEO**

- **Español:**
  - `title`: Planes por Hora y Créditos | Brújula Cripto
  - `description`: Compra horas a 4.99€ primeras 2h, 3.99€ resto. Prueba gratis 15+30 min. Protege
    activos con análisis real-time, mejor que 20% de competidores.
- **Inglés:**
  - `title`: Hourly Plans & Credits | Crypto Compass
  - `description`: Buy hours at 4.99€ first 2h, 3.99€ after. Free trial 15+30 min. Protect assets
    with real-time analysis, better than competitors' 20%.\`

### **Sección 1: Cabecera**

- **Contenido (ES):**
  - **Título (H1):** `Invierte en Horas de Tranquilidad.`
  - **Subtítulo:**
    `Empieza con 15 min gratis en herramientas y 30 min en chatbot. Compra paquetes de horas para protección ilimitada—tarifas escalonadas más bajas que el 20% de competidores, con privacidad total y control real-time.`
- **Contenido (EN):**
  - **Title (H1):** `Invest in Hours of Peace of Mind.`
  - **Subtitle:**
    `Start with 15 min free tools + 30 min chatbot. Buy hour packages for unlimited protection—tiered rates lower than competitors' 20%, with total privacy and real-time control.`

### **Sección 2: Tabla de Planes (`PricingPage.tsx`)**

_Columnas lado a lado, destacando paquetes pagados._

- **Columna 1: Gratuito Inicial**
  - **Precio (ES/EN):** `0€ / 15+30 min` | `$0 / 15+30 min`
  - **Características:** `Diagnóstico Interactivo (15 min)`, `Blog y Guías`,
    `Recuperación Limitada (15 min)`, `Chatbot (30 min)`.
- **Columna 2: Paquetes Pagados (borde resaltado)**
  - **Paquetes Ejemplos:** `1h: 5.99€`, `5h: 19.99€` (tarifas: 4.99€/h x2 + 3.99€/h resto)
  - **Botón (ES/EN):** `Comprar Paquete` | `Buy Package`
  - **Características:**
    - `✅ Todo inicial, más horas ilimitadas:`
    - `🚀 **Potencia Completa** en Recuperación`
    - `🤖 **Chatbot Extendido** con Análisis Wallet`
    - `🛡️ **Riesgos Seguridad Real-Time**`
    - `📈 **Rastreo Avanzado**`
    - `⭐ **Soporte Prioritario** durante uso`

### **Sección 3: Descargo de Responsabilidad del Pago**

_Texto legal claro debajo de tabla._

- **Contenido (ES):**
  `Al comprar horas, aceptas [Términos](/legal/terminos) y [Descargo](/legal/descargo-responsabilidad). Desbloquea tiempo de uso sin garantía de éxito.`
- **Contenido (EN):**
  `By buying hours, you agree to [Terms](/en/legal/terms) and [Disclaimer](/en/legal/disclaimer). Unlocks usage time with no success guarantee.`

### **Sección 4: Diferencias Interactivas con Competidores (`CompetitorComparison.tsx`)**

- **Estructura:** Tabs (privacidad, ecosistema, facilidad, precios). Calculadora: Inputs "Monto
  (€)", "Horas". Calcula competencia (20% monto) vs nuestro ((2\*4.99) + (horas-2)\*3.99 si \>2),
  ahorros: "Para 500€ y 5h, pagas 100€ competencia vs 18.95€ con nosotros—ahorras 81.05€ con
  privacidad absoluta."

## 4\. Mejoras Implementadas para Robustez y Producción 2025

### **A. Optimización de Imágenes para SEO**

- **Descripción:** En todas las imágenes (ej. `banner-hero.webp`), aplicar compresión automática con
  Sharp en build-time de Next.js, y soporte para AVIF via `next/image`. Añadir en rutas:
  `format: 'avif'` para mejora de carga.

### **B. Métricas de Engagement**

- **Descripción:** Integrar Google Analytics en todas las páginas: Usar `next/script` para cargar
  GA4, rastreando tasas de rebote, clics en CTAs y enlaces legales. Configurar eventos en botones
  como "Comprar Paquete".

### **C. Equilibrio Atractivo/Transparencia**

- **Descripción:** En Sección 3, implementar A/B testing para texto de descargo: Versión breve
  "Acepto términos sin garantía" vs original. Usar Vercel para variants y medir conversión.

### **D. Textos para Calculadora**

- **Descripción:** En calculadora, copy: "Calcula tus ahorros: Competidores cobran 20% del monto
  recuperado. Nosotros: Horas fijas escalonadas, privacidad en navegador, ecosistema
  completo—empieza en minutos con control total."
