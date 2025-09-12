# 🟦 PROYECTO: Brújula Cripto - Plan de Desarrollo del Frontend (VERSIÓN FINAL DE PRODUCCIÓN)

## 1. Stack Tecnológico y Dependencias Verificadas
- **Framework:** Next.js 14+ (con App Router)
- **Lenguaje:** TypeScript (`strict` mode)
- **Estilos:** Tailwind CSS
- **Internacionalización (i18n):** `next-intl` (Estándar para App Router)
- **Temas (Claro/Oscuro):** `next-themes`
- **Almacenamiento de Archivos:** Firebase Storage
- **Editor de Contenido:** TipTap
- **Pagos:** Stripe SDK
- **Hosting:** Firebase App Hosting
- **Formularios:** React Hook Form + Zod
- **Calidad de Código:** ESLint, Prettier
- **Testing:** Vitest, Playwright

## 2. Principios de Diseño
- **Mobile-First:** Todos los componentes se diseñarán y construirán pensando primero en la experiencia móvil, y luego se adaptarán a pantallas más grandes utilizando los breakpoints de Tailwind CSS.
- **Accesibilidad (a11y):** Se seguirán las directrices de WCAG para asegurar que la aplicación sea usable por el mayor número de personas posible.

## 3. Estructura de Carpetas y Nombres de Componentes (`packages/app`)
```
/packages/app/
├── app/
│   ├── [locale]/           # Ruta dinámica para internacionalización (es|en)
│   │   ├── (main)/
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx
│   │   │   └── ...
│   │   ├── (admin)/
│   │   │   ├── layout.tsx
│   │   │   ├── articles/
│   │   │   │   ├── page.tsx      # Componente: ArticleDataTable.tsx
│   │   │   │   └── [id]/page.tsx # Componente: ArticleEditor.tsx
│   │   │   └── auth/page.tsx     # Componente: AdminLoginForm.tsx
│   │   └── layout.tsx
│   └── middleware.ts       # Middleware de next-intl para gestionar las rutas de idioma
├── components/
│   ├── ui/                 # Átomos: Button.tsx, Input.tsx, Card.tsx, Spinner.tsx
│   ├── layout/             # Navbar.tsx, Footer.tsx, AdminSidebar.tsx
│   └── features/
│       ├── admin/          # ArticleEditor.tsx, ArticleDataTable.tsx
│       ├── recovery/       # RecoveryWizard.tsx, WasmPasswordEngine.tsx
│       ├── blog/           # ArticleCard.tsx, ArticleList.tsx
│       └── payments/       # UpgradeButton.tsx, PricingTier.tsx
├── lib/
│   ├── api.ts              # Central de llamadas al Backend
│   ├── firebase.ts
│   ├── stripe.ts
│   └── utils.ts
├── i18n/                   # Archivos de traducción
│   ├── en.json
│   └── es.json
└── ...
```

## 4. Internacionalización y Temas
- **Traducciones:** Todo el texto visible en la UI se gestionará a través de los archivos `en.json` y `es.json` y se cargará con `next-intl`.
- **Modo Claro/Oscuro:** `next-themes` gestionará el cambio de tema, que aplicará la clase `dark` al `<html>`. Tailwind CSS usará esta clase para aplicar los estilos oscuros (`dark:bg-gray-900`, etc.).

## 5. Panel de Administración (Integrado)
- **Acceso:** Protegido por un `hook` que valida el `claim` de `admin: true` del token de Firebase Auth.
- **Editor (TipTap):** Permitirá la subida de imágenes a **Firebase Storage** y la inserción de enlaces de afiliado.

## 6. Estrategia de Monetización (Integrada con Stripe)
- **Flujo:** La herramienta de recuperación tendrá un **Nivel Gratuito** limitado. El botón "Desbloquear Potencia Total" (`UpgradeButton.tsx`) iniciará el flujo.
- **Implementación:**
  1.  Click en `UpgradeButton.tsx` llama a `createCheckoutSession` en `lib/api.ts`.
  2.  El backend crea una sesión de pago en Stripe.
  3.  El frontend redirige al checkout de Stripe.
  4.  Un **Webhook** en el backend escucha el evento `checkout.session.completed` de Stripe y actualiza el documento del usuario en Firestore, desbloqueando la funcionalidad.