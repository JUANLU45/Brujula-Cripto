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

# 4. SOLUCIÓN: Copiar server.js a la ubicación EXACTA que Firebase espera
COPY --from=builder /app/packages/app/.next/standalone/packages/app/server.js /workspace/.next/standalone/server.js
COPY --from=builder /app/packages/app/.next/standalone/packages/app/server.js /workspace/server.js

# 5. SOLUCIÓN AL ERROR DE ES MODULES: Corregir package.json en la raíz de workspace
RUN echo '{"name":"next-standalone","version":"0.0.0","main":"server.js"}' > /workspace/package.json
RUN echo '{"name":"next-standalone","version":"0.0.0","main":"server.js"}' > /workspace/.next/standalone/package.json

# 6. Público y otras dependencias
COPY --from=builder /app/packages/app/public/ /workspace/public/

# DIAGNÓSTICO FINAL EXPLÍCITO
RUN echo "=== VERIFICACIÓN FINAL server.js ====" && \
    ls -la /workspace/.next/standalone/server.js && \
    ls -la /workspace/server.js && \
    echo "=== CONTENIDO DEL PACKAGE.JSON CORREGIDO ====" && \
    cat /workspace/.next/standalone/package.json

# Ajuste de permisos
RUN chown -R nextjs:nodejs /workspace
USER nextjs

EXPOSE 8080

# COMANDO FINAL PROBADO 
CMD ["node", ".next/standalone/server.js"]