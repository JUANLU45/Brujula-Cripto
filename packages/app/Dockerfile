# -----------------------------------------------------------------------------
# DOCKERFILE DEFINITIVO PARA BRÚJULA CRIPTO (MONOREPO PNPM + NEXT.JS)
# Creado para funcionar sin fallos en Firebase App Hosting.
# -----------------------------------------------------------------------------

# --- FASE 1: INSTALACIÓN DE DEPENDENCIAS ---
# Imagen base ligera de Node.js v20, la que usa Firebase.
FROM node:20-alpine AS deps

# Habilitar pnpm.
RUN corepack enable

# Directorio de trabajo para todo el monorepo.
WORKDIR /app

# [CORRECCIÓN 1: RUTAS DE COPIA]
# Copia los archivos de configuración desde la raíz del repositorio.
# La ruta correcta desde el contexto 'packages/app' es '../'.
COPY ../pnpm-lock.yaml ../package.json ../pnpm-workspace.yaml ./

# Copia los 'package.json' de cada paquete para recrear la estructura del workspace.
COPY ../packages/app/package.json ./packages/app/
COPY ../packages/types/package.json ./packages/types/
COPY ../packages/functions/package.json ./packages/functions/

# Instala TODAS las dependencias del monorepo usando el lockfile de la raíz.
RUN pnpm install --frozen-lockfile

# --- FASE 2: CONSTRUCCIÓN DE LA APLICACIÓN ---
FROM node:20-alpine AS builder

RUN corepack enable
WORKDIR /app

# Copia las dependencias ya instaladas desde la fase 'deps'.
COPY --from=deps /app/node_modules ./node_modules

# Copia TODO el código fuente del monorepo desde la raíz.
COPY ../. .

# [CORRECCIÓN 2: COMANDO DE BUILD]
# Ejecuta el build para el paquete 'app' usando el filtro de pnpm.
# pnpm construirá automáticamente las dependencias del workspace (types) primero.
RUN pnpm --filter @brujula-cripto/app build

# --- FASE 3: IMAGEN FINAL DE PRODUCCIÓN ---
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

# Crea un usuario no-root por seguridad.
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copia únicamente los artefactos de build necesarios desde la fase 'builder'.
COPY --from=builder /app/packages/app/.next/standalone ./
COPY --from=builder /app/packages/app/public ./packages/app/public
COPY --from=builder /app/packages/app/.next/static ./packages/app/.next/static

# Cambia la propiedad de los archivos al usuario no-root.
RUN chown -R nextjs:nodejs /app

USER nextjs

# Expone el puerto que Firebase App Hosting requiere.
EXPOSE 8080
ENV PORT=8080

# Comando para iniciar el servidor de Next.js en modo standalone.
CMD ["node", "packages/app/server.js"]