🗄️ PROYEC_PARTE3_FINAL_V3.MD (Backend) 2. Estructura de Carpetas (packages/functions) - ACTUALIZADO
text/packages/functions/ ├── src/ │ ├── admin/ │ │ ├── articleHandlers.ts │ │ ├── setAdminRole.ts │
│ ├── siteContentHandlers.ts # Para gestionar el contenido de la home │ │ └──
serviceDirectoryHandlers.ts # Para gestionar el directorio │ ├── payments/ │ │ ├── createCheckout.ts
│ │ ├── stripeWebhooks.ts │ │ └── createStripePortalSession.ts # **NUEVO** Para gestión de
suscripciones │ ├── proxies/ │ ├── public/ │ │ └── handleContactForm.ts # Para el formulario de
contacto │ └── lib/ ... 3. Modelo de Datos (Firestore) - ACTUALIZADO

Colección articles: (Sin cambios) Colección users: EXPANDIDO PARA SUSCRIPCIONES

ID: uid de Firebase Authentication Campos:

email (string) createdAt (timestamp) hasPremiumAccess (boolean) - NUEVO CAMPO CLAVE stripeCustomerId
(string) - NUEVO Para integración con Stripe subscriptionStatus ('active' | 'canceled' | 'past_due'
| null) - NUEVO subscriptionId (string) - NUEVO ID de suscripción de Stripe

Colección professionalServices:

ID: Autogenerado Campos: name (string), website (string), description (string), logoUrl (string),
specialties (array), isVerified (boolean).

Colección siteContent:

ID del Documento: homepage Campos: bannerImageUrl (string), bannerTitle_es (string), bannerTitle_en
(string), bannerSubtitle_es (string), bannerSubtitle_en (string), bannerButtonText_es (string),
bannerButtonText_en (string), bannerButtonLink (string).

Colección contactSubmissions:

ID: Autogenerado Campos: name (string), email (string), message (string), submittedAt (timestamp),
status ('new' | 'read').

4.  Reglas de Seguridad (Firestore) - ACTUALIZADO textrules_version = '2'; service cloud.firestore {
    match /databases/{database}/documents { match /articles/{articleId} { ... } match
    /users/{userId} { allow read, write: if request.auth != null && request.auth.uid == userId;
    allow create: if request.auth != null && request.auth.uid == userId; // Solo admins pueden leer
    datos de otros usuarios allow read: if request.auth.token.admin == true; }

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

    } }

5.  Nuevas Cloud Functions para Autenticación y Suscripciones 5.1. createStripePortalSession.ts

Propósito: Crear sesión del Portal de Cliente de Stripe Autenticación: Usuario autenticado
únicamente Flujo:

Verificar autenticación del usuario Obtener stripeCustomerId del documento del usuario Crear sesión
del portal con Stripe SDK Retornar URL de redirección segura

5.2. Webhook de Stripe (stripeWebhooks.ts) - EXPANDIDO

Eventos nuevos a manejar:

customer.subscription.created → hasPremiumAccess: true customer.subscription.updated → Actualizar
estado de suscripción customer.subscription.deleted → hasPremiumAccess: false

Actualizaciones automáticas del documento de usuario en Firestore

5.3. Middleware de Autenticación Frontend

Archivo: middleware.ts (Next.js) Rutas protegidas: /(dashboard)/\* Redirección: No autenticado →
/login

6. Mejoras Implementadas para Robustez y Producción 2025 A. Gestión de Costos en Serverless

Descripción: En funciones como handleContactForm.ts y proxies, integrar Redis (via Upstash o Google
Memorystore) para caché de respuestas frecuentes a APIs externas, con TTL de 5min. Añadir en lib/ un
módulo cache.ts para manejar get/set sin alterar flujos existentes.

B. Métricas de Rendimiento

Descripción: En todas las Cloud Functions, añadir integración con Google Cloud Monitoring: Usar
@google-cloud/logging para registrar métricas de latencia y errores. Configurar alertas para
umbrales >500ms. Añadir en cada handler: const logger = new Logging();
logger.logStructured({message: 'Execution time', duration: ms});.

C. Reestructuración a Pago por Horas

Descripción: Eliminar hasPremiumAccess, subscriptionStatus, subscriptionId. Añadir
usageCreditsInSeconds (number) para créditos en segundos. Adaptar Stripe para compras únicas de
paquetes de horas (ej. checkout.session.completed suma segundos). Nueva función trackUsage.ts:
Descuenta segundos en tiempo real durante uso de herramientas/chatbot, trigger por eventos de
usuario. Créditos iniciales en registro: 900s (15min) para herramientas, 1800s (30min) para chatbot.

D. Gestión de Precios en Admin

Descripción: Nueva función adminPriceHandlers.ts para actualizar tarifas (4.99€/h primeras 2h,
3.99€/h siguientes) y paquetes de horas, almacenados en Firestore (colección siteConfig/pricing).
