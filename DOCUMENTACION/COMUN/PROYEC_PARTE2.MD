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
  redes (usando Web Share API nativa para X, Telegram, etc.). Solo suscritos
  (`hasPremiumAccess: true`) pueden dar like (almacenado en Firestore) y enviar comentarios
  (moderados vía admin).
- **SEO Enfocado:** Usar Next.js metadata API para metaetiquetas dinámicas por página, canonical
  links, structured data (JSON-LD para articles). Categorías dinámicas gestionadas desde admin
  (`/admin/articles`).

### **E. Página de Artículo Individual (`/blog/[slug]` )**

- **Componente:** `ArticlePage.tsx`
- **Estructura:** Diseño limpio para lectura fácil (Tailwind prose), con H1 (título), meta info
  (autor, fecha, categoría), contenido Markdown renderizado. Tags clicables (enlazan a lista de
  artículos por tag). Flechas de navegación para artículo anterior/siguiente. Botones de compartir
  en redes (Web Share API). Solo suscritos pueden dar like y comentarios. Enlace a categoría para
  ver más artículos relacionados.

### **F. Comparación Interactiva en Suscripción (`CompetitorComparison.tsx` )**

- **Descripción:** En `/suscripcion/page.tsx`, añadir componente interactivo: Tabs para diferencias
  (privacidad, ecosistema, facilidad). Calculadora para costos: Input para monto recuperado, calcula
  20% competidores vs fijo/hora...(truncated 3354 characters)...xto, imagen.

### **B. Página de Diagnóstico Interactivo (`/recuperacion` )**

- **Componente:** `RecoveryWizard.tsx`.
- **Interacción:** Una serie de tarjetas con preguntas comunes, como "He perdido mi contraseña"
  (enlaza a `/recuperacion/password`).

### **C. Página de Recuperación de Contraseña (`/recuperacion/password` )**

- **Componente:** `WasmPasswordEngine.tsx`.
- **Interacción:** Formulario para introducir datos (ej. diccionarios), con niveles gratuito
  (limitado) y premium (ilimitado). Muestra progreso y resultados.

### **D. Página de Guías de Seguridad (`/seguridad` )**

- **Componente:** `SecurityGuides.tsx`.
- **Interacción:** Lista filtrada del blog por categoría "seguridad".

### **E. Página de Rastreador de Transacciones (`/herramientas/tracker` )**

- **Componente:** `TransactionTracker.tsx`.
- **Interacción:** Formulario para introducir hash de transacción o dirección, muestra resultados
  detallados de APIs externas.

### **F. Página de Directorio de Servicios (`/herramientas/servicios` )**

- **Componente:** `ServiceDirectory.tsx`.
- **Interacción:** Lista de servicios profesionales con filtros por especialidad.

### **G. Páginas Legales (`/legal/*` )**

_Estas páginas son fundamentales y deben estar perfectamente redactadas._

1. **Aviso Legal, Privacidad, Términos y Condiciones:** Páginas de texto estático con el contenido
   legal correspondiente.
2. **Descargo de Responsabilidad (`/legal/descargo-responsabilidad`):**
   - **Contenido:** Esta página contendrá un texto **enorme y muy claro** explicando que Brújula
     Cripto es una herramienta de software, que no garantiza la recuperación, que no es un servicio
     de custodia, que no ofrece consejo financiero y que el uso de las herramientas es bajo la
     propia responsabilidad del usuario.
   - **Visibilidad:** El enlace a esta página estará en el footer y en cualquier lugar donde se
     ofrezca un servicio de pago o de riesgo.

### **H. Página de Contacto (`/contacto` )**

- **Componente:** `ContactForm.tsx`.
- **Interacción:** Formulario para enviar nombre, email y mensaje, que se procesa a través de una
  Cloud Function.

### **I. Página del Blog (`/blog` )**

- **Componente Principal:** `BlogPage.tsx`
- **Estructura:** Banner superior editable desde admin (foto, texto H1/H2, descripción). Barra de
  búsqueda para títulos/tags/categorías. Lista paginada de tarjetas con sharing nativo,
  likes/comentarios solo para suscritos. Categorías dinámicas editables desde admin.

### **J. Página de Artículo (`/blog/[slug]` )**

- **Componente:** `ArticlePage.tsx`
- **Estructura:** Contenido fácil de leer, tags clicables, flechas para navegación, sharing nativo,
  likes/comentarios para suscritos.

### **K. Página del Chatbot (`/chatbot` )**

- **Componente:** `ChatbotUI.tsx`
- **Estructura:** Interfaz espectacular con imagen de brújula como logo, nombre "Brújula".
  Conversaciones listadas, respuestas streaming, sugerencias, render components (tablas/tarjetas).

### **L. Página de Suscripción (`/suscripcion` )**

- **Componente Principal:** `PricingPage.tsx`
- **Interacción:** Tabla de precios, sección interactiva de diferencias con calculadora para
  demostrar valor superior (comparación costos, privacidad, ecosistema), mostrando numéricamente por
  qué somos mejores (e.g., ahorros calculados en tiempo real).

## 3. Flujo de Pago y Consentimiento (Monetización)

_La legalidad y la claridad en el pago son innegociables._

1. **Oferta:** En la página de la herramienta de recuperación de contraseñas, junto al Nivel
   Gratuito, se mostrará claramente la oferta del Nivel Premium (`PricingTier.tsx`).
2. **Consentimiento Explícito:** Junto al botón de pago (`UpgradeButton.tsx`), habrá una **casilla
   de verificación (checkbox) obligatoria** con el siguiente texto:
   - > `☐ He leído y acepto los [Términos y Condiciones](/legal/terminos) y entiendo el [Descargo de Responsabilidad](/legal/descargo-responsabilidad), reconociendo que el pago desbloquea la herramienta de software sin garantía de éxito en la recuperación.`
3. **Proceso:** El botón de pago solo se activará una vez que el usuario marque esta casilla.
4. **Visibilidad:** El enlace al descargo de responsabilidad estará siempre visible durante todo el
   proceso de uso de la herramienta de recuperación.

## 4. Páginas de Administración (`/admin/*`)

- **Acceso:** Protegido por una página de login (`/admin/auth`).
- **Dashboard (`/admin`):** Vista general de los últimos artículos, borradores pendientes y
  estadísticas.
- **Gestión de Artículos (`/admin/articles`):**
  - Una tabla (`ArticleDataTable.tsx`) para ver, filtrar, editar y eliminar todos los artículos
    (manuales y de la IA).
  - Un botón para crear un nuevo artículo, que lleva al editor.
- **Editor de Artículos (`/admin/articles/[id]`):**
  - El editor `TipTap` (`ArticleEditor.tsx`) para modificar el contenido, cambiar el estado
    (Borrador/Publicado), añadir enlaces de afiliado y cambiar la imagen de portada.
- **Gestión de Contenido de la Home:** Una nueva sección en el admin para editar los campos del
  documento `siteContent/homepage` (el banner, etc.).

## 5. Mejoras Implementadas para Robustez y Producción 2025

### **A. Pruebas de Usabilidad del RecoveryWizard**

- **Descripción:** En página `/recuperacion`, integrar pruebas A/B: Usar Vercel o Optimizely para
  variar texto/orden de tarjetas en `RecoveryWizard.tsx`, midiendo conversión a herramientas.
  Registrar métricas en Firestore para análisis.

### **B. Diseño Discreto para Saturación de Enlaces Legales**

- **Descripción:** En `Footer.tsx`, para móvil, implementar acordeón con Tailwind para colapsar
  enlaces legales (Columna 2), expandible con click. Mantener visibilidad pero reducir sobrecarga
  visual.

### **G. Adaptación al Modelo de Pago por Horas en UI**

- **Descripción:** En `/suscripcion/page.tsx`, transformar en "Planes por Hora" con paquetes de
  compra única. En `/cuenta/page.tsx`, mostrar tiempo restante (H:M:S) y historial de compras. En
  herramientas como `WasmPasswordEngine.tsx` y `ChatbotUI.tsx`, añadir contador en tiempo real que
  se actualiza vía API calls a trackUsage. Créditos iniciales: 15 min para herramientas, 30 min para
  chatbot en registro.

### **H. Calculadora de Precios Actualizada**

- **Descripción:** En `CompetitorComparison.tsx`, agregar inputs para "Monto a recuperar (€)" y
  "Horas estimadas". Cálculo: Competencia = monto _0.20; Nuestro = (min(2, horas)_ 4.99) + (max(0,
  horas - 2) \* 3.99). Mostrar ahorros.

### **I. Gestión del Banner en Admin**

- **Descripción:** En `/admin/homepage`, nuevo componente para editar banner: Subir imagen de fondo,
  editar texto principal, imagen superpuesta, texto/enlace del botón. Almacenar en
  `siteContent/homepage`.

### **J. Gestión de Mensajes de Feedback en Admin**

- **Descripción:** En `/admin/feedback`, tabla para ver mensajes de `FeedbackButton.tsx`. Funciones:
  Leer todos, eliminar individual, eliminación masiva vía selección.

### **K. Editor Avanzado de Blog en Admin**

- **Descripción:** En `ArticleEditor.tsx`, añadir: Editor enriquecido manual, programación
  (inmediata/manual/automática con fecha/hora), gestión categorías (crear/editar/eliminar
  dinámicas), tags múltiples. IA: Prompt para texto (Gemini Pro), prompt para imágenes (DALL-E 3,
  almacenar en Firebase Storage), upload manual. Opciones: Tamaño (800/1200/1600 palabras), añadir
  Q&A/conclusiones/recomendaciones, modo profundidad (Profundo/General).

### **L. Moderación de Comentarios en Admin**

- **Descripción:** En `/admin/comments`, vista para ver/eliminar comentarios individualmente.
  Integrar moderación IA automática en microservicio (análisis con OpenAI Moderation),
  marcar/eliminar basado en config admin.
