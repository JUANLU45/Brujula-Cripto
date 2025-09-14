# 📚 LIBRERÍA DE PROMPTS

## Proyecto: Brújula Cripto

### INTRODUCCIÓN

Esta librería contiene una serie de prompts estandarizados para guiar a la IA en la generación de
código consistente y de alta calidad, siguiendo las directivas y la arquitectura del proyecto.
Utiliza los placeholders `[entre corchetes]` para insertar los detalles específicos de cada tarea.

---

### 1. Frontend: Componentes (Next.js + Tailwind)

#### 1.1. Prompt para Crear un Componente de UI (Átomo)

```
**Tarea:** Crear un componente de UI para Brújula Cripto.
**Componente:** `[NombreDelComponente.tsx]` (Ej: `Button.tsx`, `Card.tsx`)
**Ubicación:** `packages/app/components/ui/`
**Descripción:** `[Descripción detallada de la apariencia y funcionalidad del componente]`
**Props (Interfaz TypeScript):**
`[
  - prop1: tipo (ej: label: string),
  - prop2: tipo (ej: onClick: () => void),
  - ...
]`
**Requisitos:**
- Utilizar TypeScript y React.
- Utilizar Tailwind CSS para los estilos, siguiendo un enfoque Mobile-First.
- Implementar modo claro y oscuro usando las clases `dark:`.
- Incluir internacionalización con `next-intl` para todo el texto visible.
- Asegurar la accesibilidad (atributos ARIA, semántica HTML correcta).
- No usar lógica de estado compleja, debe ser un componente de presentación.
```

#### 1.2. Prompt para Crear un Componente de Funcionalidad (Feature)

```
**Tarea:** Crear un componente de funcionalidad para Brújula Cripto.
**Componente:** `[NombreDelComponente.tsx]` (Ej: `ArticleDataTable.tsx`)
**Ubicación:** `packages/app/components/features/[carpeta_funcionalidad]/`
**Descripción:** `[Descripción detallada de la funcionalidad, qué datos muestra y qué acciones permite]`
**Interacciones:**
- **Llamadas a la API:** Debe llamar a las siguientes funciones del archivo centralizado `@/lib/api.ts`: `[función1, función2]`.
- **Gestión de Estado:** `[Describir el estado que necesita gestionar (ej: lista de artículos, estado de carga, error)]`. Utilizar hooks de React (`useState`, `useEffect`).
**Requisitos:**
- Importar tipos desde `@brújula-cripto/types`.
- Mostrar estados de carga (usando el componente `Spinner.tsx`) y de error.
- Seguir todas las directivas de UI (i18n, dark mode, responsive).
```

---

### 2. Backend: Cloud Functions

#### 2.1. Prompt para Crear una Función HTTPS Callable

```
**Tarea:** Crear una nueva Cloud Function HTTPS Callable.
**Nombre de la Función:** `[nombreDeLaFunción]` (Ej: `createArticle`)
**Ubicación:** `packages/functions/src/[carpeta_funcionalidad]/`
**Propósito:** `[Descripción clara de lo que hace la función]`
**Input (Datos desde el cliente):**
- **Interfaz TypeScript:** `[Definir la interfaz del objeto de entrada]`
- **Validación:** Utilizar Zod para validar el objeto de entrada.
**Lógica Principal:**
`[
  1. Verificar que el usuario está autenticado y tiene el rol necesario (ej: 'admin').
  2. Validar los datos de entrada con Zod.
  3. Realizar las operaciones con Firestore o el Admin SDK.
  4. Devolver una respuesta o un error.
]`
**Requisitos:**
- Usar el SDK de Firebase Admin inicializado desde `@/lib/firebaseAdmin.ts`.
- Importar todos los tipos de datos desde `@brújula-cripto/types`.
- Implementar un manejo de errores robusto con bloques try/catch y logs detallados.
```

---

### 3. Testing

#### 3.1. Prompt para Crear un Test Unitario (Vitest)

```
**Tarea:** Escribir tests unitarios para un componente de React.
**Componente a Testear:** `[Ruta al componente]` (Ej: `@/components/ui/Button.tsx`)
**Casos de Prueba:**
`[
  - 1. Debe renderizarse correctamente con sus props.
  - 2. Debe llamar a la función onClick cuando se hace clic.
  - 3. Debe mostrar el estado de 'disabled' correctamente.
  - ...
]`
**Requisitos:**
- Utilizar Vitest y React Testing Library.
- Simular (mock) cualquier dependencia externa como llamadas a la API.
```

---

### 4. Microservicio IA

#### 4.1. Prompt para Mejorar un Prompt de Generación

```
**Tarea:** Mejorar un prompt para el microservicio de IA.
**Prompt a Mejorar:** `[Nombre del archivo del prompt]` (Ej: `generateArticle.prompt.txt`)
**Objetivo de la Mejora:** `[Descripción del objetivo]` (Ej: "Hacer que el tono sea más directo y menos formal", "Asegurar que siempre incluya una lista de 3 puntos clave", "Optimizar la salida para que el slug sea más corto y efectivo para SEO").
**Contexto:** La salida de este prompt se guardará en la colección `articles` de Firestore, siguiendo la interfaz `IArticle` de `@brújula-cripto/types`. La audiencia objetivo son principiantes en criptomonedas.
**Requisitos:**
- La salida debe ser un prompt de texto refinado y completo, listo para ser guardado en el archivo `.txt` correspondiente.
- Debe mantener todas las directivas existentes sobre el formato de salida (Markdown).
```
