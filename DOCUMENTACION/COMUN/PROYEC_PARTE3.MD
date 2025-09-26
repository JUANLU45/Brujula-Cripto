🗄️ PROYEC_PARTE3_FINAL_V3.MD (Backend) 2. Estructura de Carpetas (packages/functions) - ACTUALIZADO CON ABSTRACCIONES DE BD
```
packages/functions/ 
├── src/ 
│ ├── admin/ 
│ │ ├── articleHandlers.ts          # ✅ MIGRADO a abstracciones de BD
│ │ ├── adminPriceHandlers.ts       # ✅ MIGRADO a abstracciones de BD
│ │ ├── setAdminRole.ts 
│ │ ├── siteContentHandlers.ts      # ✅ MIGRADO a abstracciones de BD
│ │ └── serviceDirectoryHandlers.ts # ✅ MIGRADO a abstracciones de BD
│ ├── payments/ 
│ │ ├── createCheckout.ts           # ✅ MIGRADO a abstracciones de BD
│ │ ├── stripeWebhooks.ts           # ✅ MIGRADO a abstracciones de BD
│ │ ├── createStripePortalSession.ts # ✅ MIGRADO a abstracciones de BD
│ │ └── trackUsage.ts               # ✅ MIGRADO a abstracciones de BD
│ ├── recovery/
│ │ └── analyzeFileRecovery.ts      # ✅ MIGRADO a abstracciones de BD
│ ├── proxies/ 
│ ├── public/ 
│ │ └── handleContactForm.ts        # ✅ MIGRADO a abstracciones de BD
│ └── lib/ 
│     ├── database.ts               # 🆕 FACTORY SINGLETON para BD
│     ├── adapters/
│     │   └── FirestoreAdapter.ts   # 🆕 ADAPTADOR FIRESTORE
│     └── ...
```

### 🏗️ ARQUITECTURA DE ABSTRACCIONES DE BASE DE DATOS - IMPLEMENTADA

**✅ Estado**: COMPLETAMENTE IMPLEMENTADO Y FUNCIONAL
**✅ Patrón**: Adaptador + Factory + Singleton  
**✅ Objetivo**: Eliminar vendor lock-in, preparar migración futura sin tocar lógica de negocio
**✅ Verificación**: ✅ CERO llamadas directas a Firebase fuera de `FirestoreAdapter.ts`

#### 🎯 Arquitectura Implementada

**Tipos Centralizados** (`packages/types/src/database.ts`):
```typescript
export interface IDatabaseAdapter {
  // Operaciones CRUD completas
  getDocument(collection: string, documentId: string): Promise<DatabaseDocument | null>;
  setDocument(collection: string, documentId: string, data: Record<string, any>): Promise<void>;
  updateDocument(collection: string, documentId: string, data: Record<string, any>): Promise<void>;
  deleteDocument(collection: string, documentId: string): Promise<void>;
  
  // Queries y colecciones
  addDocument(collection: string, data: Record<string, any>): Promise<string>;
  queryCollection(collection: string, filters?: QueryFilter[], options?: QueryOptions): Promise<DatabaseDocument[]>;
  
  // Subcolecciones
  getSubDocument(...): Promise<DatabaseDocument | null>;
  setSubDocument(...): Promise<void>;
  addSubDocument(...): Promise<string>;
  
  // Operaciones especiales
  serverTimestamp(): any;
  incrementValue(amount: number): any;
  arrayUnion(elements: any[]): any;
  arrayRemove(elements: any[]): any;
}
```

**Factory Singleton** (`packages/functions/src/lib/database.ts`):
```typescript
// ✅ PUNTO ÚNICO DE ACCESO EN TODO EL BACKEND
export const database = DatabaseFactory.getInstance().getAdapter();

// ✅ CONFIGURACIÓN PARA FUTURAS MIGRACIONES  
export const configureDatabase = (config: DatabaseConfig): void => {
  DatabaseFactory.getInstance().configure(config);
};
```

**Adaptador Firestore** (`packages/functions/src/lib/adapters/FirestoreAdapter.ts`):
- **🔒 ÚNICO ARCHIVO que conoce Firebase/Firestore**
- **🔄 Encapsula TODAS las llamadas directas a Firebase**
- **🛡️ Implementa interfaz genérica IDatabaseAdapter**

#### 🔄 Patrones de Migración Implementados

**✅ TODAS las Cloud Functions migradas a abstracciones:**

**Antes (Acoplamiento directo a Firebase):**
```typescript
import { getFirestore, FieldValue } from 'firebase-admin/firestore';

const db = getFirestore();
const userDoc = await db.collection('users').doc(uid).get();
if (!userDoc.exists) throw new Error('Usuario no encontrado');

await db.collection('users').doc(uid).update({
  usageCreditsInSeconds: FieldValue.increment(-60),
  lastActivity: FieldValue.serverTimestamp(),
});

await db.collection('users').doc(uid).collection('usageHistory').add({
  serviceType: 'herramientas',
  timestamp: FieldValue.serverTimestamp(),
});
```

**Después (Abstracción vendor-agnostic):**
```typescript
import { database } from '../lib/database';

const userDoc = await database.getDocument('users', uid);
if (!userDoc || !userDoc.exists) throw new Error('Usuario no encontrado');

await database.updateDocument('users', uid, {
  usageCreditsInSeconds: database.incrementValue(-60),
  lastActivity: database.serverTimestamp(),
});

await database.addSubDocument('users', uid, 'usageHistory', {
  serviceType: 'herramientas',
  timestamp: database.serverTimestamp(),
});
```

#### 🚀 Beneficios Logrados

- **✅ Eliminar Vendor Lock-in**: Migrar a DynamoDB/MongoDB sin tocar lógica de negocio
- **✅ Centralización**: Todas las operaciones BD en punto único `database.ts`
- **✅ Testabilidad**: Mockear `database` en vez de Firebase completo  
- **✅ Mantenibilidad**: Cambios BD solo afectan `FirestoreAdapter.ts`
- **✅ TypeScript Safety**: Tipos centralizados, compilación sin errores
- **✅ Preparación Futura**: Cambiar proveedor BD modificando solo configuración factory

#### 🔧 Para Futuros Desarrolladores

**✅ USO CORRECTO en nuevas Cloud Functions:**
```typescript
import { database } from '../lib/database';

// ✅ CORRECTO - Usar abstracción
const user = await database.getDocument('users', uid);
await database.updateDocument('users', uid, data);
```

**❌ PROHIBIDO - No usar Firebase directamente:**
```typescript
// ❌ PROHIBIDO - Acoplamiento directo
import { getFirestore } from 'firebase-admin/firestore';
const db = getFirestore(); // NO HACER ESTO
```

**🔮 Migración Futura a Otro Proveedor:**
1. Implementar nuevo adaptador (ej: `DynamoDBAdapter`)
2. Añadir case en `DatabaseFactory`
3. Cambiar configuración: `configureDatabase({ provider: 'dynamodb' })`
4. **TODO el código sigue funcionando SIN CAMBIOS**

3. Modelo de Datos (Firestore) - ACTUALIZADO

Colección articles: (Sin cambios) Colección users: EXPANDIDO PARA SUSCRIPCIONES

ID: uid de Firebase Authentication Campos:

email (string) createdAt (timestamp) usageCreditsInSeconds (number) - SISTEMA DE PAGO POR HORAS IMPLEMENTADO

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

Verificar autenticación del usuario Crear sesión
del portal con Stripe SDK Retornar URL de redirección segura

5.2. Webhook de Stripe (stripeWebhooks.ts) - EXPANDIDO

Eventos nuevos a manejar:

checkout.session.completed → Sumar segundos comprados a usageCreditsInSeconds

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

Descripción: Sistema completamente basado en usageCreditsInSeconds (number) para créditos en segundos - modelo de pago por horas implementado. Adaptar Stripe para compras únicas de
paquetes de horas (ej. checkout.session.completed suma segundos). Nueva función trackUsage.ts:
Descuenta segundos en tiempo real durante uso de herramientas/chatbot, trigger por eventos de
usuario. Créditos iniciales en registro: 900s (15min) para herramientas, 1800s (30min) para chatbot.

D. Gestión de Precios en Admin

Descripción: Nueva función adminPriceHandlers.ts para actualizar tarifas (4.99€/h primeras 2h,
3.99€/h siguientes) y paquetes de horas, almacenados en Firestore (colección siteConfig/pricing).
