📋 VERIFICACIÓN COMPLETA DEL PROBLEMA - SIN ESPECULACIÓN
🔍 ANÁLISIS REAL DE ARCHIVOS:
ESTRUCTURA ACTUAL DETECTADA:

app/[locale]/├── (admin)/│   ├── page.tsx          ← AdminDashboardPage (Panel administrador)│   └── layout.tsx        ← AdminLayout con AdminSidebar├── (dashboard)/│   ├── page.tsx          ← DashboardHomePage (Panel usuario)│   └── layout.tsx        ← DashboardLayout con protección auth├── (main)/│   ├── page.tsx          ← Homepage principal│   └── layout.tsx        ← MainLayout con Navbar/Footer└── admin/    └── page.tsx          ← ARCHIVO VACÍO
CONFLICTO CONFIRMADO:
RUTAS QUE CHOCAN:

page.tsx → Resuelve a /es, /en
page.tsx → Resuelve a /es, /en
page.tsx → Resuelve a /es, /en
Next.js no puede decidir cuál usar para la ruta raíz.

FUNCIÓN DE CADA PÁGINA VERIFICADA:
page.tsx: Dashboard administrativo con estadísticas

Componente: AdminDashboardPage
Layout: AdminSidebar para navegación admin
Target: Administradores del sistema
page.tsx: Panel de usuario registrado

Componente: DashboardHomePage
Layout: Protección de ruta con useAuth()
Target: Usuarios premium/registrados
page.tsx: Página de inicio pública

Componente: Homepage con banner, carousel, tools
Layout: Navbar + Footer públicos
Target: Visitantes públicos
page.tsx: ARCHIVO VACÍO - sin función

🔧 DOCUMENTACIÓN VS CÓDIGO:
SEGÚN PROYEC_PARTE2.MD:


├── (dashboard)/         # Nueva Ruta Protegida│   ├── layout.tsx       # Layout para área protegida│   └── cuenta/│       └── page.tsx     # Panel de Control del Usuario
PROBLEMA: La documentación especifica page.tsx pero el código tiene page.tsx directamente.

✅ SOLUCIÓN CORRECTA Y ROBUSTA:
1. MANTENER (main) COMO HOMEPAGE:

page.tsx → /es, /en (página principal)
2. MOVER (admin) A RUTA ESPECÍFICA:

page.tsx → page.tsx → /es/admin, /en/admin
3. MOVER (dashboard) SEGÚN DOCUMENTACIÓN:

page.tsx → page.tsx → /es/cuenta, /en/cuenta
4. ELIMINAR ARCHIVO DUPLICADO:

Borrar page.tsx (vacío y duplicado)
📊 COMPATIBILIDAD VERIFICADA:
IMPORTACIONES VERIFICADAS:

✅ Todas usan @/components/* correctamente
✅ Tipos de @brujula-cripto/types importados
✅ next-intl configurado en todos
✅ Layouts específicos funcionando
AUTENTICACIÓN VERIFICADA:

✅ (admin) usa verificación manual con getAuthToken()
✅ (dashboard) usa useAuth() hook
✅ (main) es público sin restricciones
Esta es la solución exacta y robusta basada en código real verificado.