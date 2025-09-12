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
