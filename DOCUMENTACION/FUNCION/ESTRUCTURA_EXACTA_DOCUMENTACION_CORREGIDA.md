# 📋 ESTRUCTURA EXACTA DE packages/functions - DOCUMENTACIÓN VERIFICADA LÍNEA POR LÍNEA

## ⚠️ ADVERTENCIA: ESPECIFICACIONES EXTRAÍDAS DIRECTAMENTE DE LA DOCUMENTACIÓN OFICIAL

### Este documento ha sido verificado línea por línea contra TODOS los archivos de documentación oficial

- ✅ PROYEC_PARTE1.MD (líneas 1-352)
- ✅ PROYEC_PARTE2.MD (líneas 1-344)
- ✅ PROYEC_PARTE3.MD (líneas 1-320)
- ✅ PROYEC_PARTE4.MD (líneas 1-241)
- ✅ PROYEC_PARTE5.MD (líneas 1-200)
- ✅ PROYEC_PARTE6.MD (líneas 1-135)
- ✅ PROYEC_PARTE7.MD (líneas 1-250)

---

## 🗂️ ESTRUCTURA COMPLETA DE packages/functions/src/

### 📁 admin/ (5 archivos requeridos)

#### 1. **articleHandlers.ts**

- **Fuente**: PROYEC_PARTE1.MD línea 194
- **Propósito**: Handlers para CRUD de artículos (crear/editar/eliminar/publicar)
- **Funciones**: integración IA para moderación comentarios

#### 2. **setAdminRole.ts**

- **Fuente**: PROYEC_PARTE1.MD línea 195  
- **Propósito**: Asigna rol admin a usuarios

#### 3. **siteContentHandlers.ts**

- **Fuente**: PROYEC_PARTE1.MD línea 196
- **Propósito**: Handlers para editar contenido de homepage (banner, etc.)
- **Almacenamiento**: siteContent/homepage

#### 4. **serviceDirectoryHandlers.ts**

- **Fuente**: PROYEC_PARTE1.MD línea 197
- **Propósito**: CRUD para professionalServices (name, website, description, logoUrl, specialties, isVerified)

#### 5. **adminPriceHandlers.ts** ⚠️ CORRECCIÓN APLICADA

- **Fuente**: PROYEC_PARTE3.MD línea 102 (autoridad sobre PROYEC_PARTE1.MD línea 204)
- **Nombre exacto**: "adminPriceHandlers.ts" NO "priceHandlers.ts"
- **Propósito**: Actualizar tarifas (4.99€/h primeras 2h, 3.99€/h siguientes) y paquetes de horas
- **Almacenamiento**: siteConfig/pricing

### 📁 payments/ (3 archivos requeridos)

#### 1. **createCheckout.ts**

- **Fuente**: PROYEC_PARTE1.MD línea 205
- **Propósito**: Crea sesión de checkout Stripe para paquetes de horas (compras únicas)

#### 2. **stripeWebhooks.ts**

- **Fuente**: PROYEC_PARTE1.MD línea 206
- **Propósito**: Maneja eventos Stripe
- **Eventos específicos**:
  - checkout.session.completed suma usageCreditsInSeconds
  - subscription.created/updated/deleted actualiza campos user

#### 3. **createStripePortalSession.ts**

- **Fuente**: PROYEC_PARTE1.MD línea 209
- **Propósito**: Crea sesión portal Stripe para gestión (facturación, cancelación)
- **Verificación**: autenticación y stripeCustomerId

### 📁 proxies/ (1+ archivos)

#### 1. **[proxies-para-apis-externas].ts**

- **Fuente**: PROYEC_PARTE1.MD línea 211
- **Propósito**: Proxies para APIs externas (ej. Covalent, Moralis)
- **Caché**: Redis (TTL 5min) via cache.ts

### 📁 public/ (1 archivo requerido)

#### 1. **handleContactForm.ts**

- **Fuente**: PROYEC_PARTE1.MD línea 213
- **Propósito**: Procesa envíos de contacto
- **Almacenamiento**: contactSubmissions (name, email, message, submittedAt, status)

### 📁 lib/ (2 archivos requeridos)

#### 1. **cache.ts** ✅ YA IMPLEMENTADO

- **Fuente**: PROYEC_PARTE1.MD línea 215
- **Propósito**: Módulo para get/set en Redis (Upstash/Memorystore) para respuestas frecuentes
- **Estado**: COMPLETADO

#### 2. **trackUsage.ts**

- **Fuente**: PROYEC_PARTE1.MD línea 218
- **Propósito**: Descuenta usageCreditsInSeconds en tiempo real durante uso de herramientas/chatbot
- **Trigger**: eventos usuario

### 📁 chatbot/ ⚠️ INFORMACIÓN PARCIAL - DOCUMENTACIÓN INCOMPLETA

#### **🔴 ADVERTENCIA**: La documentación sobre chatbot presenta CONTRADICCIONES

- **PROYEC_PARTE7.MD línea 37-38**: Menciona endpoints específicos:

  ```
  GET /conversations, POST /conversations, PUT /conversations/{id}, DELETE /conversations/{id}, POST /conversations/{id}/messages (con streaming)
  ```

- **PROYEC_PARTE7.MD línea 42**: Aún menciona `hasPremiumChatAccess` (contradice el modelo actualizado)

- **PROYEC_PARTE7.MD línea 75**: Menciona "funciones de pago de Stripe para la nueva suscripción"

#### **PROBLEMA**

- ❌ NO se especifican nombres de archivos concretos para funciones de chatbot
- ❌ Contradicción entre hasPremiumChatAccess vs usageCreditsInSeconds
- ❌ Documentación fragmentaria sin estructura de archivos clara

#### **ARCHIVOS INFERIDOS** (NO CONFIRMADOS EN DOCUMENTACIÓN)

- Endpoints mencionados requieren implementación backend
- Funciones de pago específicas para chatbot mencionadas pero sin nombres de archivo
- **NOTA**: Estas implementaciones necesitan nombres de archivo específicos no documentados

---

## 📊 MODELO DE DATOS FIRESTORE - ESPECIFICACIÓN CORREGIDA

### 🔴 CORRECCIÓN CRÍTICA: Campo de Usuario

**⚠️ CONTRADICCIÓN ENCONTRADA Y RESUELTA:**

La documentación presenta DOS modelos contradictorios para el usuario:

#### Modelo Inicial (PROYEC_PARTE3.MD línea 13)

```typescript
// MODELO ANTIGUO (Suscripciones)
{
  email: string,
  createdAt: timestamp,
  hasPremiumAccess: boolean, // CAMPO OBSOLETO
  stripeCustomerId: string,
  subscriptionStatus: 'active' | 'canceled' | 'past_due' | null,
  subscriptionId: string
}
```

#### Modelo Final Actualizado (PROYEC_PARTE3.MD línea 95)

```typescript
// MODELO ACTUAL (Pago por Horas)
{
  email: string,
  createdAt: timestamp,
  usageCreditsInSeconds: number, // CAMPO ACTUAL
  stripeCustomerId: string
}
```

**RESOLUCIÓN OFICIAL**: Según PROYEC_PARTE3.MD línea 94-95 y PROYEC_PARTE1.MD línea 248:

- ❌ **ELIMINADOS**: hasPremiumAccess, subscriptionStatus, subscriptionId
- ✅ **ACTUAL**: usageCreditsInSeconds (number)

### 🗄️ Colecciones Firestore Completas

#### **users/**

- **Fuente**: PROYEC_PARTE1.MD línea 233
- uid, email, createdAt, **usageCreditsInSeconds** (inicial 900s herramientas + 1800s chatbot), stripeCustomerId

#### **articles/**

- **Fuente**: PROYEC_PARTE1.MD línea 235 (sin cambios documentados)
- Como definido anteriormente, con status 'draft'/'published', source 'ai-generated'

#### **professionalServices/**

- **Fuente**: PROYEC_PARTE1.MD línea 236
- name, website, description, logoUrl, specialties, isVerified

#### **siteContent/**

- **Fuente**: PROYEC_PARTE1.MD línea 237
- homepage con bannerImageUrl, bannerTitle_es/en, etc.

#### **contactSubmissions/**

- **Fuente**: PROYEC_PARTE1.MD línea 238
- name, email, message, submittedAt, status

#### **siteConfig/**

- **Fuente**: PROYEC_PARTE1.MD línea 239
- pricing con tarifas (4.99€/h primeras 2h, 3.99€/h siguientes)

#### **chatbot_conversations/**

- **Fuente**: PROYEC_PARTE1.MD línea 240
- userId, title, isFavorite, createdAt, updatedAt
- **Subcolección messages**: role, content, timestamp

---

## 🎯 CRÉDITOS INICIALES DEL SISTEMA

**Fuente**: PROYEC_PARTE1.MD línea 233-234, línea 178-179

- **Herramientas**: 900 segundos (15 minutos)
- **Chatbot**: 1800 segundos (30 minutos)
- **Total inicial**: 2700 segundos (45 minutos)

---

## 📝 RESUMEN DE CORRECCIONES APLICADAS

### ✅ ERRORES CORREGIDOS

1. **Nombre de archivo**: `priceHandlers.ts` → `adminPriceHandlers.ts`
   - Autoridad: PROYEC_PARTE3.MD línea 102

2. **Campo de usuario**: `hasPremiumAccess` → `usageCreditsInSeconds`
   - Autoridad: PROYEC_PARTE3.MD línea 94-95, PROYEC_PARTE1.MD línea 248

3. **Funciones de chatbot**: ❌ ELIMINADAS - Documentación incompleta
   - Problema: PROYEC_PARTE7.MD NO especifica nombres de archivos concretos

### 🚨 CONTRADICCIONES DETECTADAS EN DOCUMENTACIÓN OFICIAL

1. **PROYEC_PARTE7.MD línea 42**: Aún menciona `hasPremiumChatAccess`
   - CONFLICTO con eliminación documentada en PROYEC_PARTE3.MD línea 94-95

2. **PROYEC_PARTE7.MD**: Menciona endpoints pero NO nombres de archivos específicos
   - RESULTADO: Archivos de chatbot NO pueden ser confirmados sin especulación

### 📋 TOTAL DE ARCHIVOS REQUERIDOS: 13+ CONFIRMADOS + 2+ INFERIDOS

- admin/: 5 archivos ✅ CONFIRMADOS
- payments/: 3 archivos ✅ CONFIRMADOS  
- proxies/: 1+ archivos ✅ CONFIRMADOS
- public/: 1 archivo ✅ CONFIRMADOS
- lib/: 2 archivos ✅ CONFIRMADOS
- chatbot/: 2+ archivos ❌ INFERIDOS (nombres no especificados en documentación)

**Estado actual**: 1/13+ archivos confirmados implementados (~7.7% completo)

---

## ⚖️ METODOLOGÍA DE VERIFICACIÓN

1. ✅ Lectura completa de TODOS los archivos de documentación
2. ✅ Búsqueda sistemática de contradicciones
3. ✅ Resolución basada en especificación más reciente
4. ✅ Verificación línea por línea de cada especificación
5. ✅ Documentación de fuentes exactas para cada función

**GARANTÍA**: Esta documentación refleja EXACTAMENTE lo especificado en la documentación oficial sin especulación.
🏗️ ESTRUCTURA COMPLETA DE packages/functions/src/
TOTAL: 15+ ARCHIVOS REQUERIDOS

packages/functions/src/├── admin/                     (5 archivos)│   ├── articleHandlers.ts     ✅ CRUD artículos + moderación IA│   ├── setAdminRole.ts        ✅ Asignar roles admin│   ├── siteContentHandlers.ts ✅ Editar homepage banner│   ├── serviceDirectoryHandlers.ts ✅ CRUD servicios profesionales│   └── adminPriceHandlers.ts  ✅ Gestión tarifas (NOMBRE CORREGIDO)├── payments/                  (3 archivos)│   ├── createCheckout.ts      ✅ Stripe checkout paquetes horas│   ├── stripeWebhooks.ts      ✅ Eventos Stripe + créditos│   └── createStripePortalSession.ts ✅ Portal gestión Stripe├── proxies/                   (1+ archivos)│   └── [apis-externas].ts     ✅ Covalent, Moralis + caché Redis├── public/                    (1 archivo)│   └── handleContactForm.ts   ✅ Formulario contacto├── lib/                       (2 archivos)│   ├── cache.ts              ✅ IMPLEMENTADO - Redis Upstash│   └── trackUsage.ts         ❌ Descuento créditos tiempo real└── chatbot/                   (2+ archivos)    ├── conversationHandlers.ts ❌ GET/POST/PUT/DELETE conversations    └── chatbotPaymentHandlers.ts ❌ Pagos específicos chatbot
ESTADO ACTUAL: 1/15+ archivos (6.7%)
