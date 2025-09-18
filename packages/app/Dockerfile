# -----------------------------------------------------------------------------
# DOCKERFILE DEFINITIVO PARA BRÚJULA CRIPTO (MONOREPO PNPM + NEXT.JS)
# Creado para funcionar sin fallos en Firebase App Hosting.
# -----------------------------------------------------------------------------

# --- FASE 1: INSTALACIÓN DE DEPENDENCIAS ---
FROM node:20-alpine AS deps

RUN corepack enable
WORKDIR /app

# [CORRECCIÓN 3: RUTAS DE COPIA DESDE LA RAÍZ]
# Como el contexto ahora es la raíz, las rutas ya no necesitan '..'.
# Se copian los archivos de configuración directamente.
COPY pnpm-lock.yaml package.json pnpm-workspace.yaml ./

# Se copian los 'package.json' de cada paquete a sus respectivos subdirectorios.
COPY packages/app/package.json ./packages/app/
COPY packages/types/package.json ./packages/types/
COPY packages/functions/package.json ./packages/functions/

# Se instalan TODAS las dependencias del monorepo.
RUN pnpm install --frozen-lockfile

# --- FASE 2: CONSTRUCCIÓN DE LA APLICACIÓN ---
FROM node:20-alpine AS builder

RUN corepack enable
WORKDIR /app

# Se copian las dependencias ya instaladas desde la fase 'deps'.
COPY --from=deps /app/node_modules ./node_modules

# Se copia TODO el código fuente del monorepo.
COPY . .

# [CORRECCIÓN 4: COMANDO DE BUILD]
# Se ejecuta el build para el paquete 'app' usando el filtro de pnpm.
# Este comando no cambia, pero ahora funcionará porque tiene acceso a todo el código.
RUN pnpm --filter @brujula-cripto/app build

# --- FASE 3: IMAGEN FINAL DE PRODUCCIÓN ---
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

# Crea un usuario no-root por seguridad.
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# [CORRECCIÓN 5: RUTAS DE COPIA DEL BUILD]
# Se copian los artefactos de build desde las rutas correctas dentro de la fase 'builder'.
COPY --from=builder /app/packages/app/.next/standalone ./
COPY --from=builder /app/packages/app/public ./packages/app/public
COPY --from=builder /app/packages/app/.next/static ./packages/app/.next/static

# Se cambia la propiedad de los archivos al usuario no-root.
RUN chown -R nextjs:nodejs /app

USER nextjs

EXPOSE 8080
ENV PORT=8080

# [CORRECCIÓN 6: COMANDO DE INICIO]
# Se ejecuta el servidor de Next.js desde su ubicación correcta.
CMD ["node", "packages/app/server.js"]