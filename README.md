# Brújula Cripto

Plataforma integral de análisis y recuperación de criptomonedas con generación de contenido alimentada por IA.

## 🏗️ Arquitectura del Proyecto

Este es un monorepo que incluye:

- **packages/app/** - Frontend Next.js 14+ con App Router
- **packages/functions/** - Backend Cloud Functions para Firebase
- **packages/microservice-ia/** - Microservicio de contenido IA con Genkit
- **packages/types/** - Tipos TypeScript compartidos (fuente única de verdad)

## 🚀 Tecnologías Principales

### Frontend

- Next.js 14+ con App Router
- TypeScript (modo estricto)
- Tailwind CSS (Mobile-First)
- next-intl para internacionalización (es/en)
- next-themes para modo claro/oscuro
- React Hook Form + Zod para formularios
- TipTap para editor de contenido
- Stripe SDK para pagos

### Backend

- Firebase Cloud Functions v2
- Cloud Firestore como base de datos
- Firebase Authentication con Custom Claims
- Firebase Storage
- Google Secret Manager para secretos

### Microservicio IA

- Genkit for Firebase
- Vertex AI con Gemini Pro
- Google Cloud Run para despliegue
- Prompts estructurados en archivos .txt

## 📦 Instalación

```bash
# Instalar dependencias en toda la workspace
pnpm install

# Desarrollo local
pnpm dev

# Build de producción
pnpm build

# Tests
pnpm test

# Linting
pnpm lint
```

## 🌍 Estructura de Rutas

```
app/[locale]/(main)/        - Área pública (es/en)
app/[locale]/(dashboard)/   - Área protegida de usuario (ej. cuenta)
app/[locale]/admin/*        - Panel administrativo seguro
middleware.ts               - Manejo de autenticación, rutas protegidas y redirecciones
```

## 🔧 Configuración de Desarrollo

1. Copiar `.env.example` a `.env.local` en cada paquete
2. Configurar Firebase project ID y credenciales
3. Configurar claves de Stripe
4. Instalar extensiones de VSCode para ESLint y Prettier

## 🔒 Seguridad

- Custom Claims para roles de administrador
- Reglas de Firestore para acceso granular
- Validación con Zod en todos los endpoints
- Secrets management con Google Secret Manager

## 📊 Modelo de Datos

### Artículo (IArticle)

```typescript
{
  slug: string;
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

## 🤖 Flujo de IA

1. Cloud Scheduler ejecuta el microservicio diariamente
2. Busca noticias relevantes de criptomonedas
3. Genera contenido en español e inglés
4. Valida estructura con Zod
5. Guarda como borrador en Firestore

## 🧪 Testing

- **Unitarios**: Vitest para lógica de componentes
- **E2E**: Playwright para flujos críticos
- **Tipos**: TypeScript strict mode

## 📱 Responsive Design

Diseño mobile-first completamente responsivo usando Tailwind CSS con breakpoints adaptativos.

## 🌐 SEO y Rendimiento

- Metadatos dinámicos por página
- Optimización de imágenes con Next.js Image
- Lazy loading de componentes
- Static generation donde sea posible

## 📄 Licencia

Proyecto privado - Todos los derechos reservados.