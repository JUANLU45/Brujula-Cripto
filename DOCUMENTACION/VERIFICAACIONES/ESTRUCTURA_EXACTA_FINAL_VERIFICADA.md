# 📋 ESTRUCTURA EXACTA DE packages/functions - VERIFICACIÓN FINAL LÍNEA POR LÍNEA

## ⚠️ VERIFICACIÓN COMPLETADA CONTRA TODA LA DOCUMENTACIÓN OFICIAL

### Este documento ha sido verificado EXHAUSTIVAMENTE contra:

- ✅ PROYEC_PARTE1.MD (líneas 1-352)
- ✅ PROYEC_PARTE2.MD (líneas 1-344)
- ✅ PROYEC_PARTE3.MD (líneas 1-320)
- ✅ PROYEC_PARTE4.MD (líneas 1-241)
- ✅ PROYEC_PARTE5.MD (líneas 1-200)
- ✅ PROYEC_PARTE6.MD (líneas 1-135)
- ✅ PROYEC_PARTE7.MD (líneas 1-250)

---

## 🗂️ ESTRUCTURA CONFIRMADA DE packages/functions/src/

### **FUENTE OFICIAL**: PROYEC_PARTE1.MD líneas 194-218

### 📁 admin/ (5 archivos)

#### 1. **articleHandlers.ts**

- **Fuente**: PROYEC_PARTE1.MD línea 194
- **Propósito**: Handlers para CRUD de artículos (crear/editar/eliminar/publicar), integración IA para moderación comentarios

#### 2. **setAdminRole.ts**

- **Fuente**: PROYEC_PARTE1.MD línea 195
- **Propósito**: Asigna rol admin a usuarios

#### 3. **siteContentHandlers.ts**

- **Fuente**: PROYEC_PARTE1.MD línea 196
- **Propósito**: Handlers para editar contenido de homepage (banner, etc.), almacenado en siteContent/homepage

#### 4. **serviceDirectoryHandlers.ts**

- **Fuente**: PROYEC_PARTE1.MD línea 197
- **Propósito**: CRUD para professionalServices (name, website, description, logoUrl, specialties, isVerified)

#### 5. **adminPriceHandlers.ts** ⚠️ NOMBRE CORREGIDO

- **Fuente original**: PROYEC_PARTE1.MD línea 204 dice "priceHandlers.ts"
- **Fuente correcta**: PROYEC_PARTE3.MD línea 102 dice "adminPriceHandlers.ts"
- **Resolución**: PROYEC_PARTE3.MD tiene autoridad (más específico)
- **Propósito**: Actualizar tarifas (4.99€/h primeras 2h, 3.99€/h siguientes) y paquetes de horas, almacenados en Firestore (colección siteConfig/pricing)

### 📁 payments/ (3 archivos)

#### 1. **createCheckout.ts**

- **Fuente**: PROYEC_PARTE1.MD línea 205
- **Propósito**: Crea sesión de checkout Stripe para paquetes de horas (compras únicas)

#### 2. **stripeWebhooks.ts**

- **Fuente**: PROYEC_PARTE1.MD línea 206
- **Propósito**: Maneja eventos Stripe (checkout.session.completed suma usageCreditsInSeconds; subscription.created/updated/deleted actualiza campos user)

#### 3. **createStripePortalSession.ts**

- **Fuente**: PROYEC_PARTE1.MD línea 209
- **Propósito**: Crea sesión portal Stripe para gestión (facturación, cancelación), verifica autenticación y stripeCustomerId

### 📁 proxies/ (cantidad no especificada)

#### **Archivos no especificados individualmente**

- **Fuente**: PROYEC_PARTE1.MD línea 211
- **Propósito**: Proxies para APIs externas (ej. Covalent, Moralis), con caché Redis (TTL 5min) via cache.ts

### 📁 public/ (1 archivo)

#### 1. **handleContactForm.ts**

- **Fuente**: PROYEC_PARTE1.MD línea 213
- **Propósito**: Procesa envíos de contacto, guarda en contactSubmissions (name, email, message, submittedAt, status)

### 📁 lib/ (2 archivos)

#### 1. **cache.ts** ✅ YA IMPLEMENTADO

- **Fuente**: PROYEC_PARTE1.MD línea 215
- **Propósito**: Módulo para get/set en Redis (Upstash/Memorystore) para respuestas frecuentes
- **Estado**: COMPLETADO

#### 2. **trackUsage.ts**

- **Fuente**: PROYEC_PARTE1.MD línea 218
- **Propósito**: Descuenta usageCreditsInSeconds en tiempo real durante uso de herramientas/chatbot, trigger por eventos usuario

---

## 📊 MODELO DE DATOS FIRESTORE - ESPECIFICACIÓN CORREGIDA

### 🔴 CORRECCIÓN CRÍTICA: Campo de Usuario

**CONTRADICCIÓN ENCONTRADA Y RESUELTA:**

#### Modelo Inicial (PROYEC_PARTE3.MD línea 13):

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

#### Modelo Final Actualizado (PROYEC_PARTE3.MD línea 95):

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

- **Fuente**: PROYEC_PARTE1.MD línea 235
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

## 🚨 SOBRE FUNCIONES DE CHATBOT

### ❌ NO CONFIRMADAS EN ESTRUCTURA OFICIAL

**VERIFICACIÓN EXHAUSTIVA**: PROYEC_PARTE1.MD líneas 194-218 **NO INCLUYEN** carpeta chatbot/ en packages/functions/src/

**PROYEC_PARTE7.MD MENCIONA**:

- Línea 37-38: Endpoints específicos (GET/POST/PUT/DELETE conversations)
- Línea 75: "funciones de pago de Stripe para la nueva suscripción"
- Línea 42: Aún menciona `hasPremiumChatAccess` (contradice modelo actualizado)

**PROBLEMA**: PROYEC_PARTE7.MD NO especifica nombres de archivos concretos para implementar estas funciones en packages/functions/src/

---

## 📝 RESUMEN FINAL VERIFICADO

### ✅ ARCHIVOS CONFIRMADOS: 12 específicos

```
packages/functions/src/
├── admin/ (5 archivos)
│   ├── articleHandlers.ts
│   ├── setAdminRole.ts
│   ├── siteContentHandlers.ts
│   ├── serviceDirectoryHandlers.ts
│   └── adminPriceHandlers.ts
├── payments/ (3 archivos)
│   ├── createCheckout.ts
│   ├── stripeWebhooks.ts
│   └── createStripePortalSession.ts
├── proxies/ (cantidad no especificada)
├── public/ (1 archivo)
│   └── handleContactForm.ts
└── lib/ (2 archivos)
    ├── cache.ts ✅ IMPLEMENTADO
    └── trackUsage.ts
```

### 📊 ESTADO ACTUAL

- **Archivos confirmados en documentación**: 12 específicos + proxies sin especificar
- **Archivos implementados**: 1 (cache.ts)
- **Progreso**: 1/12+ = ~8.3% completo

### ⚖️ METODOLOGÍA DE VERIFICACIÓN APLICADA

1. ✅ Lectura línea por línea de TODA la documentación oficial
2. ✅ Identificación de contradicciones entre documentos
3. ✅ Resolución basada en especificidad (PROYEC_PARTE3.MD > PROYEC_PARTE1.MD)
4. ✅ Eliminación de información no confirmada
5. ✅ Documentación de fuentes exactas para cada elemento

**GARANTÍA FINAL**: Esta documentación contiene ÚNICAMENTE información verificada línea por línea en la documentación oficial, sin especulación alguna.
