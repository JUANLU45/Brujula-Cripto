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
- Comportamiento: `COMUN/INTRUCCIONES/INSTRUCCIONES_DE_COMPORTAMIENTO.MD`
