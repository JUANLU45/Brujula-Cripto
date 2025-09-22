# --- FASE 1: INSTALACIÓN DE DEPENDENCIAS ---
FROM node:20-alpine AS deps

RUN corepack enable
WORKDIR /app

COPY pnpm-lock.yaml package.json pnpm-workspace.yaml ./
COPY packages/app/package.json ./packages/app/
COPY packages/types/package.json ./packages/types/
COPY packages/functions/package.json ./packages/functions/

RUN pnpm install --frozen-lockfile

# --- FASE 2: CONSTRUCCIÓN DE LA APLICACIÓN ---
FROM node:20-alpine AS builder

RUN corepack enable
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Construir tipos y app
RUN pnpm --filter @brujula-cripto/types build
RUN pnpm --filter @brujula-cripto/app build

# DIAGNÓSTICO: Verificar dónde se generó el server.js
RUN echo "=== UBICACIÓN DE server.js GENERADO ===" && \
  find /app -name "server.js" -type f

# --- FASE 3: IMAGEN FINAL DE PRODUCCIÓN ---
FROM node:20-alpine AS runner

WORKDIR /workspace
ENV NODE_ENV=production
ENV PORT=8080

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# ESTRATEGIA MULTIPUNTO: 
# 1. Directorio standalone completo a la raíz
COPY --from=builder /app/packages/app/.next/standalone/ /workspace/

# 2. Garantizar que .next/static existe
COPY --from=builder /app/packages/app/.next/static/ /workspace/.next/static/

# 3. CLAVE: Crear manualmente el directorio .next/standalone si no existe
RUN mkdir -p /workspace/.next/standalone

# 4. SOLUCIÓN DEFINITIVA: CORREGIR EN EL ORIGEN ANTES DE QUE BUILDPACK COPIE
# Modificar package.json en la ubicación ORIGINAL que el buildpack copiará
RUN echo '{"main":"server.js"}' > /workspace/.next/standalone/packages/app/package.json

# 5. Mantener archivos como respaldo en destinos tradicionales
COPY --from=builder /app/packages/app/.next/standalone/packages/app/server.js /workspace/.next/standalone/server.js
COPY --from=builder /app/packages/app/.next/standalone/packages/app/server.js /workspace/server.js
RUN echo '{"main":"server.js"}' > /workspace/package.json
RUN echo '{"main":"server.js"}' > /workspace/.next/standalone/package.json

# 6. Público y otras dependencias
COPY --from=builder /app/packages/app/public/ /workspace/public/

# DIAGNÓSTICO FINAL EXPLÍCITO
RUN echo "=== VERIFICACIÓN CRÍTICA: ORIGEN CORREGIDO ====" && \
  echo "Verificando package.json en ubicación ORIGINAL (donde buildpack tomará):" && \
  ls -la /workspace/.next/standalone/packages/app/package.json && \
  cat /workspace/.next/standalone/packages/app/package.json && \
  echo "=== VERIFICACIÓN RESPALDOS ====" && \
  ls -la /workspace/.next/standalone/server.js && \
  ls -la /workspace/server.js && \
  echo "=== CONTENIDO PACKAGE.JSON CORREGIDOS ====" && \
  cat /workspace/.next/standalone/package.json

# Ajuste de permisos
RUN chown -R nextjs:nodejs /workspace
USER nextjs

EXPOSE 8080

# COMANDO CORREGIDO - RUTA ABSOLUTA AL SERVER.JS FUNCIONAL
CMD ["node", "/workspace/.next/standalone/packages/app/server.js"]