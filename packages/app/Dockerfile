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

# Copiamos directamente a /workspace, no a un subdirectorio
COPY --from=builder /app/packages/app/.next/standalone ./
COPY --from=builder /app/packages/app/public ./public
COPY --from=builder /app/packages/app/.next/static ./.next/static

# Verificamos que el archivo existe y diagnosticamos la estructura
RUN ls -la && echo "Contenido del directorio:" && find . -type f -name "server*" | xargs ls -la

RUN chown -R nextjs:nodejs /workspace

USER nextjs

EXPOSE 8080
ENV PORT=8080

# Corregimos el nombre del archivo si es necesario
# Si tu archivo se llama server.cjs, cambia esta línea
CMD ["node", "server.js"]