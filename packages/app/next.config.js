/** @type {import('next').NextConfig} */
const nextConfig = {
  // 🚨 CRÍTICO: Firebase App Hosting requiere standalone output
  output: 'standalone',

  // Configuración para internacionalización
  experimental: {
    // Habilitar features experimentales si es necesario
  },

  // Optimizaciones de build
  swcMinify: true,

  // Configuración de imágenes
  images: {
    domains: ['firebasestorage.googleapis.com', 'storage.googleapis.com'],
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
