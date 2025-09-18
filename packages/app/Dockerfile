# Dockerfile para Brújula Cripto - Next.js 15.5.3 Standalone
# Configuración profesional optimizada para Firebase App Hosting

# Stage 1: Base con Node.js 20.19.5 Alpine (match logs de Firebase)
FROM node:20.19.5-alpine AS base

# Instalar pnpm globalmente (versión estable)
RUN npm install -g pnpm@9.0.0

# Configurar directorio de trabajo en raíz workspace
WORKDIR /workspace

# Stage 2: Dependencies
FROM base AS deps

# Copiar archivos de configuración workspace
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages/app/package.json ./packages/app/
COPY packages/types/package.json ./packages/types/
COPY packages/functions/package.json ./packages/functions/

# Instalar dependencias usando pnpm workspace
RUN pnpm install --frozen-lockfile

# Stage 3: Builder
FROM base AS builder

# Copiar node_modules desde stage deps
COPY --from=deps /workspace/node_modules ./node_modules
COPY --from=deps /workspace/packages ./packages

# Copiar código fuente completo
COPY . .

# Build types package primero (dependencia de app)
RUN cd packages/types && pnpm build

# Build app package con Next.js standalone
RUN cd packages/app && pnpm build

# Verificar que postbuild se ejecutó correctamente
RUN ls -la packages/app/.next/standalone/.next/routes-manifest.json

# Stage 4: Runner - Configuración final para producción
FROM node:20.19.5-alpine AS runner

WORKDIR /workspace

# Crear usuario no-root para seguridad
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copiar archivos standalone desde builder
COPY --from=builder /workspace/packages/app/.next/standalone ./
COPY --from=builder /workspace/packages/app/.next/static ./.next/static

# Copiar archivos públicos
COPY --from=builder /workspace/packages/app/public ./public

# Asegurar que routes-manifest.json está en path exacto esperado por logs
RUN mkdir -p ./.next
COPY --from=builder /workspace/packages/app/.next/standalone/.next/routes-manifest.json ./.next/routes-manifest.json

# Cambiar propiedad de archivos a nextjs user
RUN chown -R nextjs:nodejs /workspace

# Cambiar a usuario no-root
USER nextjs

# Exponer puerto 8080 (requerido por Firebase App Hosting)
EXPOSE 8080

# Variables de entorno para producción
ENV NODE_ENV=production
ENV PORT=8080
ENV HOSTNAME="0.0.0.0"

# Comando de inicio del servidor standalone
CMD ["node", "server.js"]