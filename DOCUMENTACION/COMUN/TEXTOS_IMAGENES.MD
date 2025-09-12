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
  - **Precio:** `[Precio] € 4,99 / HORA LAS DOS PRIMERAS HORAS` | `[Price] $ 5.99 / month`)
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
