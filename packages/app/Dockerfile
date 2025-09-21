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

RUN pnpm --filter @brujula-cripto/app build

# --- FASE 3: IMAGEN FINAL DE PRODUCCIÓN ---
FROM node:20-alpine AS runner

# Cambiado a /workspace para coincidir con la expectativa de Firebase
WORKDIR /workspace

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Creamos la estructura de directorios que Firebase espera
RUN mkdir -p /workspace/.next/standalone

# Copiamos el servidor a AMBAS ubicaciones (la que Firebase espera y la normal)
COPY --from=builder /app/packages/app/.next/standalone/server.js /workspace/.next/standalone/server.js
COPY --from=builder /app/packages/app/.next/standalone/node_modules /workspace/.next/standalone/node_modules
COPY --from=builder /app/packages/app/.next/standalone/package.json /workspace/.next/standalone/package.json

# Copiamos todo lo demás a sus ubicaciones normales
COPY --from=builder /app/packages/app/.next/standalone/* ./
COPY --from=builder /app/packages/app/public ./public
COPY --from=builder /app/packages/app/.next/static ./.next/static

# Copiamos el static también a la ubicación que Firebase espera
COPY --from=builder /app/packages/app/.next/static ./.next/static

# Verificamos la estructura final para diagnóstico
RUN echo "=== ESTRUCTURA FINAL DE DIRECTORIOS ===" && \
    ls -la /workspace && \
    echo "=== ARCHIVOS SERVER* ENCONTRADOS ===" && \
    find /workspace -name "server*" -type f && \
    echo "=== CONTENIDO DE .NEXT ===" && \
    ls -la /workspace/.next

RUN chown -R nextjs:nodejs /workspace

USER nextjs

EXPOSE 8080
ENV PORT=8080

# Usamos la ubicación EXACTA que Firebase espera
CMD ["node", ".next/standalone/server.js"]