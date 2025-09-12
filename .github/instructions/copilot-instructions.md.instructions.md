---
applyTo: '**'
---

# Brújula Cripto - Instrucciones para Agentes de IA

## Arquitectura General

Este es un monorepo TypeScript con estructura de paquetes compartidos:

- `packages/app/` - Frontend Next.js 14+ con App Router
- `packages/functions/` - Backend Cloud Functions
- `packages/microservice-ia/` - Microservicio de contenido IA con Genkit
- `packages/types/` - **ÚNICA FUENTE DE VERDAD** para tipos TypeScript

**Regla crítica**: SIEMPRE importar tipos desde `@brújula-cripto/types`. Nunca duplicar definiciones.

## Principios No Negociables

### 🚫 TOLERANCIA CERO A LA FALSEDAD

**ODIO ABSOLUTO Y PROHIBICIÓN TOTAL DE:**

- **ESPECULACIÓN**: Creer, pensar o imaginar sin verificar
- **CÓDIGO FALSO**: Placebo, hardcodeado, mosqueado, jarqueado
- **DATOS FALSOS**: Cualquier información no verificada
- **COMANDOS AMAÑADOS**: Salidas preparadas o simuladas

### ⚡ TODO LISTO PARA PRODUCCIÓN

**EXIGENCIA ABSOLUTA:**

- Cada línea de código debe ser funcional y robusta
- Verificación real antes de cualquier afirmación
- Solo código que puede fallar de verdad (honestidad brutal)
- Admitir errores y limitaciones sin excusas

### 1. CERO ESPECULACIÓN - LEY SUPREMA

- **PROHIBIDO**: Generar código basado en suposiciones
- **OBLIGATORIO**: Consultar documentación oficial de dependencias
- **MANDATORIO**: Solicitar clarificación si el prompt es ambiguo
- **VERIFICAR TODO**: Antes de actuar, confirmar la realidad

### 2. CÓDIGO PRODUCTIVO ÚNICAMENTE - TOLERANCIA CERO

- **PROHIBIDO ABSOLUTAMENTE**:
  - Código comentado (líneas muertas)
  - Placeholders vacíos (`// TODO: Implementar`)
  - Valores hardcodeados (números mágicos, strings directos)
  - Funciones que aparentan trabajar pero no hacen nada
  - Variables no utilizadas para aparentar complejidad
- **OBLIGATORIO**:
  - Usar constantes centralizadas y variables de entorno
  - Código funcional al 100%
- **ÚNICA EXCEPCIÓN**: Mocks solo en archivos `*.test.ts` o `*.spec.ts`

### 3. CONSISTENCIA FORZADA

- Usar path aliases: `@/components`, `@/lib` (definidos en `tsconfig.json`)
- Centralizar API calls en `packages/app/lib/api.ts`
- Seguir estructura de carpetas estricta definida en PROYEC_PARTE2.MD

## Stack Tecnológico Principal

### Frontend (`packages/app/`)

- **Framework**: Next.js 14+ App Router
- **Estilos**: Tailwind CSS (Mobile-First)
- **i18n**: `next-intl` con rutas `[locale]` (es|en)
- **Temas**: `next-themes` (claro/oscuro)
- **Formularios**: React Hook Form + Zod
- **Editor**: TipTap para contenido
- **Pagos**: Stripe SDK

### Backend (`packages/functions/`)

- **Runtime**: Cloud Functions for Firebase v2
- **Base de datos**: Cloud Firestore
- **Auth**: Firebase Authentication con Custom Claims
- **Storage**: Firebase Storage
- **Secrets**: Google Secret Manager

### Microservicio IA (`packages/microservice-ia/`)

- **Framework**: Genkit for Firebase
- **Modelo**: Gemini Pro vía Vertex AI
- **Deploy**: Google Cloud Run
- **Prompts**: Archivos `.txt` en `/src/prompts/`

## Estructura de Datos Crítica

### Modelo `IArticle` (bilingüe)

```typescript
{
  slug: string; // único, independiente del idioma
  es: { title: string; contentMarkdown: string; excerpt: string; };
  en: { title: string; contentMarkdown: string; excerpt: string; };
  imageUrl: string;
  authorName: string;
  category: string;
  tags: string[];
  createdAt: timestamp;
  updatedAt: timestamp;
  isFeatured: boolean;
  status: 'draft' | 'published';
  source: 'ai-generated' | 'manual';
}
```

## Patrones de Desarrollo

### Rutas Next.js App Router

```
app/[locale]/(main)/     - Área pública
app/[locale]/(admin)/    - Panel administrativo
middleware.ts            - Manejo de i18n con next-intl
```

### Componentes

- `components/ui/` - Átomos reutilizables
- `components/layout/` - Navegación y estructura
- `components/features/` - Lógica específica por módulo

### API Backend

- Handlers en `/src/admin/` para CRUD de artículos
- Webhooks de Stripe en `/src/payments/`
- Proxies para APIs externas en `/src/proxies/`

## Flujos Críticos

### Generación de Contenido IA

1. Trigger por Cloud Scheduler
2. Fetch noticias → Generar contenido ES → Generar contenido EN
3. Generar metadatos SEO → Validar slug único → Ensamblar con Zod
4. Guardar en Firestore como `status: 'draft'`

### Seguridad

- Custom Claims para roles de admin
- Reglas de Firestore para acceso granular
- Validación con Zod en todos los endpoints

## Comandos de Desarrollo

- `pnpm dev` - Desarrollo local
- `pnpm build` - Build de producción
- `pnpm test` - Testing con Vitest
- `pnpm lint` - ESLint + Prettier

## ⚠️ RECORDATORIO CONSTANTE

> **"PREFIERO UN ERROR REAL QUE UN ÉXITO FALSO"**
>
> **"MEJOR ADMITIR QUE NO SÉ QUE MENTIR"**
>
> **"CÓDIGO QUE FALLA > CÓDIGO PLACEBO"**
>
> **"TODO DEBE ESTAR LISTO PARA PRODUCCIÓN"**

### 🔥 TOLERANCIA CERO A:

- Falsedad, especulación, código jarqueado
- Comandos que simulan éxito sin verificar
- Cualquier cosa que no sea 100% funcional
- Mentiras sobre el estado del código

### ✅ COMPROMISO CON:

- Verdad brutal sobre errores y limitaciones
- Honestidad absoluta en cada respuesta
- Código robusto y listo para producción
- Verificación real antes de cada afirmación

## Referencias Clave

- Arquitectura: `COMUN/PROYEC_PARTE1.MD`
- Frontend: `COMUN/PROYEC_PARTE2.MD`
- Backend: `COMUN/PROYEC_PARTE3.MD`
- Microservicio IA: `COMUN/PROYEC_PARTE4.MD`
- Comportamiento: `COMUN/INTRUCCIONES/INSTRUCCIONES_DE_COMPORTAMIENTO.MD

# 📖 Brújula Cripto: Flujo de Trabajo para Producción

### Preámbulo

## Este documento es el manual de ensamblaje del proyecto. Se asume que la estructura de carpetas del monorepo ya ha sido creada. Seguir estos pasos en el orden exacto es **obligatorio** para garantizar la integridad, consistencia y calidad del producto final. Cada fase construye la base para la siguiente.

## 🚫🚫🚫 PROHIBICIÓN ABSOLUTA DE COMANDOS FALSOS 🚫🚫🚫

### ❌ ODIO TOTAL Y PROHIBICIÓN COMPLETA DE

#### **COMANDOS CON SALIDAS PREPARADAS/AMAÑADAS**

- **COMANDOS QUE NO BUSCAN DE VERDAD:** Cualquier comando que simule buscar pero tenga la salida ya preparada
- **COMANDOS FALSOS:** Comandos que aparentan hacer trabajo pero no hacen nada real
- **VERIFICACIONES FALSAS:** Comandos que simulan verificar pero no verifican nada real
- **SALIDAS PREPARADAS:** Cualquier comando con salida predeterminada que no refleje la realidad

#### **EJEMPLOS DE LO QUE ESTÁ TERMINANTEMENTE PROHIBIDO**

```bash
# ❌ PROHIBIDO - Comandos que simulan éxito sin verificar
echo "✅ COMPILACIÓN EXITOSA"
echo "✅ Tests passed"
echo "✅ No errors found"
python -c "print('Todo perfecto')"
```

#### **LO ÚNICO PERMITIDO - COMANDOS REALES**

```bash
# ✅ PERMITIDO - Comandos que pueden fallar de verdad
python -m py_compile archivo.py  # Puede fallar
pytest                          # Puede fallar
npm test                        # Puede fallar
firebase deploy                 # Puede fallar
```

#### **TOLERANCIA CERO A**

1. **Falsedad en comandos** - Cualquier comando que mienta sobre resultados
2. **Simulación de trabajo** - Comandos que aparentan hacer trabajo sin hacerlo
3. **Verificaciones placebo** - Comandos que aparentan verificar sin verificar
4. **Salidas amañadas** - Cualquier salida preparada que no sea real

#### **RECORDATORIO BRUTAL**

> **"PREFIERO QUE UN COMANDO FALLE DE VERDAD QUE MIENTA DICIENDO QUE FUNCIONA"**
>
> **"ODIO LOS COMANDOS FALSOS MÁS QUE CUALQUIER OTRA COSA"**
>
> **"COMANDO REAL QUE FALLA > COMANDO FALSO QUE SIMULA ÉXITO"**

---

### **Fase 0: Configuración y Cimientos (Duración: ~2 horas)**

_Antes de escribir una sola línea de lógica, preparamos el entorno para forzar la calidad._

1.  **Instalar Dependencias:**
    - En la raíz del monorepo (`/brújula-cripto/`), ejecutar el comando `pnpm install`. Esto leerá los `package.json` de cada paquete (`app`, `functions`, etc.) e instalará todas las dependencias necesarias de una sola vez.

2.  **Configurar Calidad de Código:**
    - Revisar los archivos `.eslintrc.json` y `.prettierrc` en la raíz. Asegurarse de que las extensiones correspondientes están instaladas en el editor de código (VSCode, etc.) para que el formateo y la detección de errores sean automáticos al guardar.

3.  **Configurar Variables de Entorno:**
    - En cada paquete que lo necesite (`app`, `functions`, `microservice-ia`), crear un archivo `.env.local` a partir de su respectivo archivo `.env.example`.
    - Rellenar las variables iniciales, como la configuración del proyecto de Firebase.

---

### **Fase 1: El Núcleo Compartido - La Única Fuente de Verdad (Duración: ~3 horas)**

_Esta es la fase más crítica. Aquí definimos el "idioma" que hablará todo nuestro sistema._

1.  **Definir Tipos Centralizados:**
    - **Archivo:** `packages/types/src/index.ts`
    - **Acción:** Definir y exportar **todas** las interfaces de datos principales que se usarán en el proyecto. Empezar con las más importantes: `IArticle`, `IUser`, `IProfessionalService`. Sean extremadamente detallados. Si un campo puede ser nulo, defínanlo (`string | null`).

---

### **Fase 2: Construcción del Backend y Seguridad (Duración: ~2 días)**

_Con los tipos ya definidos, construimos la lógica del servidor y las reglas de acceso._

1.  **Inicializar Firebase Admin:**
    - **Archivo:** `packages/functions/src/lib/firebaseAdmin.ts`
    - **Acción:** Configurar la inicialización del SDK de Firebase Admin para que sea un singleton (se ejecute una sola vez).

2.  **Implementar Autenticación y Roles:**
    - **Archivo:** `packages/functions/src/admin/setAdminRole.ts`
    - **Acción:** Crear la Cloud Function protegida que permitirá asignar el `claim` de `admin: true` a un usuario por su email o UID.

3.  **Desarrollar Endpoints de Admin:**
    - **Archivo:** `packages/functions/src/admin/articleHandlers.ts`
    - **Acción:** Implementar las funciones para `crear`, `actualizar` y `eliminar` artículos. **Importante:** Cada función debe, como primer paso, verificar el `claim` de administrador del usuario que la llama. Todas deben importar la interfaz `IArticle` desde `@brújula-cripto/types` para validar los datos.

4.  **Implementar Endpoints de Pagos:**
    - **Archivos:** `packages/functions/src/payments/`
    - **Acción:** Desarrollar las dos funciones de Stripe: `createCheckout.ts` y `stripeWebhooks.ts`. Configurar los secretos de Stripe en Google Secret Manager.

5.  **Escribir Reglas de Seguridad:**
    - **Archivo:** `firestore.rules` y `storage.rules`
    - **Acción:** Escribir las reglas de seguridad detalladas que hemos definido. Probarlas usando los emuladores de Firebase. **No se escribe código de frontend hasta que las reglas de seguridad estén implementadas y probadas.**

---

### **Fase 3: Construcción del Frontend y la Experiencia de Usuario (Duración: ~5-7 días)**

_Con un backend seguro y unos tipos definidos, podemos construir la interfaz con confianza._

1.  **Configurar Layout Global e Internacionalización (i18n):**
    - **Archivos:** `packages/app/app/[locale]/layout.tsx`, `packages/app/i18n/`
    - **Acción:** Construir el layout principal (incluyendo `Navbar.tsx` y `Footer.tsx`). Configurar `next-intl` con los archivos `es.json` y `en.json`. Todo el texto estático debe venir de estos archivos desde el principio. Implementar el `ThemeSwitcher` para el modo claro/oscuro.

2.  **Construir la Librería de Componentes UI:**
    - **Carpeta:** `packages/app/components/ui/`
    - **Acción:** Crear todos los componentes atómicos reutilizables: `Button.tsx`, `Card.tsx`, `Input.tsx`, `Spinner.tsx`, etc. Deben ser componentes de presentación puros, sin lógica de negocio.

3.  **Centralizar Llamadas a la API:**
    - **Archivo:** `packages/app/lib/api.ts`
    - **Acción:** Crear funciones cliente para **cada una** de las Cloud Functions que hemos desarrollado en la Fase 2. Por ejemplo, una función `updateArticle(id, data)` que dentro se encargue de llamar a la Cloud Function correspondiente. **Todo el frontend usará estas funciones centralizadas.**

4.  **Desarrollar las Páginas Públicas:**
    - **Carpetas:** `packages/app/app/[locale]/(main)/*`
    - **Acción:** Construir las páginas públicas (Home, Blog, Lista de artículos) consumiendo los datos a través de las funciones de `lib/api.ts`.

5.  **Implementar la Herramienta de Recuperación:**
    - **Archivo:** `packages/app/components/features/recovery/WasmPasswordEngine.tsx`
    - **Acción:** Integrar el módulo de WebAssembly. Implementar el Web Worker para no congelar la UI.

6.  **Construir el Panel de Administración:**
    - **Carpetas:** `packages/app/app/[locale]/(admin)/*`
    - **Acción:** Crear la página de login, la tabla de artículos (`ArticleDataTable.tsx`) y el editor (`ArticleEditor.tsx`). Todas las acciones (guardar, borrar) deben usar las funciones de `lib/api.ts`.

7.  **Integrar el Flujo de Pagos (Stripe):**
    - **Componente:** `packages/app/components/features/payments/UpgradeButton.tsx`
    - **Acción:** Conectar el botón al flujo de checkout de Stripe a través de la función correspondiente en `lib/api.ts`.

---

### **Fase 4: Implementación del Microservicio de IA (Duración: ~1 día)**

_Este servicio es autónomo y se puede desarrollar en paralelo a la Fase 3._

1.  **Construir el Flujo de Genkit:**
    - **Archivo:** `packages/microservice-ia/src/flows/contentFlow.ts`
    - **Acción:** Implementar el flujo completo como se ha definido: buscar noticias, generar contenido para `es` y `en`, validar con Zod (importando `IArticle` de `@brújula-cripto/types`) y guardar en Firestore como `'draft'`.

2.  **Configurar el Despliegue en Cloud Run:**
    - **Archivo:** `packages/microservice-ia/Dockerfile`
    - **Acción:** Crear el Dockerfile, construir la imagen y desplegarla en Google Cloud Run.

3.  **Programar el Trigger:**
    - **Consola de Google Cloud:** Crear un trabajo en **Cloud Scheduler** para que llame al endpoint de Cloud Run diariamente.

---

### **Fase 5: Pruebas Finales y Despliegue (Duración: ~2 días)**

1.  **Ejecutar todos los Tests:**
    - Correr los tests unitarios (Vitest) y los de extremo a extremo (Playwright) para asegurar que no hay regresiones.

2.  **Revisión Final de Configuración:**
    - Verificar que todas las variables de entorno para producción son correctas.
    - Asegurarse de que las reglas de seguridad de Firestore y Storage son las definitivas.

3.  **Despliegue:**
    - Desplegar las Cloud Functions (`pnpm --filter functions deploy`).
    - Desplegar la aplicación de Next.js a Firebase Hosting.
    - ¡Lanzamiento!
