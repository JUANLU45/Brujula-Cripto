import createMiddleware from 'next-intl/middleware';
import { NextRequest } from 'next/server';

// Configuración para next-intl
const intlMiddleware = createMiddleware({
  // Lista de locales soportados
  locales: ['es', 'en'],

  // Locale por defecto
  defaultLocale: 'es',

  // Estrategia de detección de locale
  localeDetection: true,

  // Prefijo para rutas localizadas
  localePrefix: 'as-needed',

  // Rutas que no requieren localización
  pathnames: {
    '/': '/',
    '/auth': '/auth',
    '/auth/login': '/auth/login',
    '/auth/register': '/auth/register',
    '/auth/forgot-password': '/auth/forgot-password',
    '/auth/reset-password': '/auth/reset-password',
    '/dashboard': '/dashboard',
    '/tools': '/tools',
    '/tools/transaction-tracker': '/tools/transaction-tracker',
    '/tools/service-directory': '/tools/service-directory',
    '/tools/password-recovery': '/tools/password-recovery',
    '/pricing': '/pricing',
    '/blog': '/blog',
    '/blog/[slug]': '/blog/[slug]',
    '/profile': '/profile',
    '/admin': '/admin',
    '/api': '/api',
  },
});

export default function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  // Rutas que no necesitan procesamiento de i18n
  const publicPaths = [
    '/api',
    '/favicon.ico',
    '/robots.txt',
    '/sitemap.xml',
    '/manifest.json',
    '/_next',
    '/images',
    '/icons',
    '/sw.js',
  ];

  // Verificar si es una ruta pública
  const isPublicPath = publicPaths.some((path) => pathname.startsWith(path));

  if (isPublicPath) {
    return;
  }

  // Rutas de API que no requieren i18n
  if (pathname.startsWith('/api/')) {
    return;
  }

  // Manejar rutas de autenticación especiales
  if (pathname.includes('/auth/callback') || pathname.includes('/auth/error')) {
    return;
  }

  // Aplicar middleware de internacionalización
  const response = intlMiddleware(request);

  // Headers de seguridad adicionales
  if (response) {
    // CSP Header básico
    response.headers.set(
      'Content-Security-Policy',
      "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' *.google.com *.googleapis.com *.gstatic.com *.stripe.com; style-src 'self' 'unsafe-inline' *.googleapis.com; img-src 'self' data: blob: *.google.com *.googleapis.com *.gstatic.com; font-src 'self' *.googleapis.com *.gstatic.com; connect-src 'self' *.google.com *.googleapis.com *.firebaseio.com *.stripe.com; frame-src 'self' *.google.com *.stripe.com;",
    );

    // Headers de seguridad estándar
    response.headers.set('X-Frame-Options', 'DENY');
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');

    // HSTS para HTTPS
    if (request.nextUrl.protocol === 'https:') {
      response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    }
  }

  return response;
}

export const config = {
  // Matcher para todas las rutas excepto archivos estáticos y API
  matcher: [
    // Incluir todas las rutas
    '/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|manifest.json|sw.js|images|icons).*)',
    // Incluir rutas raíz
    '/',
    // Incluir rutas localizadas
    '/(es|en)/:path*',
  ],
};
