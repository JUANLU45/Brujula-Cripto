/** @type {import('next').NextConfig} */
const nextConfig = {
  // 🚨 CRÍTICO: Firebase App Hosting requiere standalone output
  output: 'standalone',

  // NOTA: i18n se maneja con next-intl y middleware en App Router
  // La configuración i18n nativa de Next.js NO es compatible con App Router

  // Configuración de imágenes
  images: {
    unoptimized: true, // Mejor para Firebase App Hosting (evita Cloud Functions)
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
      },
      {
        protocol: 'https',
        hostname: 'storage.googleapis.com',
      },
    ],
    formats: ['image/webp', 'image/avif'],
  },

  // Headers de seguridad
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
    ];
  },

  // Variables de entorno públicas
  env: {
    CUSTOM_BUILD_ID: process.env.BUILD_ID || 'local',
  },

  // Optimizaciones para Firebase App Hosting
  experimental: {
    serverComponentsExternalPackages: ['firebase'], // Reduce bundle client-side
  },

  // Configuración de webpack si es necesario
  webpack: (config, { isServer }) => {
    // Optimizaciones específicas
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }

    return config;
  },
};

module.exports = nextConfig;
