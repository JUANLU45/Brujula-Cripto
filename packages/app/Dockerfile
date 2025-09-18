# -----------------------------------------------------------------------------
# DOCKERFILE DEFINITIVO PARA BRÚJULA CRIPTO (MONOREPO PNPM + NEXT.JS)
# Creado para funcionar sin fallos en Firebase App Hosting.
# -----------------------------------------------------------------------------

# --- FASE 1: INSTALACIÓN DE DEPENDENCIAS ---
# Se usa una imagen base ligera de Node.js v20, la misma que usa Firebase.
FROM node:20-alpine AS deps

# Se habilita pnpm, la herramienta recomendada para gestionar workspaces.
# Esto evita instalaciones globales y asegura consistencia.
RUN corepack enable

# Se establece el directorio de trabajo para todo el monorepo.
WORKDIR /app

# [CORRECCIÓN CLAVE 1: COPIAR ARCHIVOS DE WORKSPACE]
# Se copian los archivos de configuración desde la raíz del repositorio (../../)
# al directorio de trabajo del contenedor. Esto es fundamental para que pnpm
# entienda la estructura del monorepo y encuentre el lockfile.
COPY ../../pnpm-lock.yaml ../../package.json ../../pnpm-workspace.yaml ./

# Se copian los 'package.json' de cada paquete para recrear la estructura del workspace.
# Esto permite a pnpm instalar solo las dependencias de producción necesarias.
COPY ../../packages/app/package.json ./packages/app/
COPY ../../packages/types/package.json ./packages/types/
COPY ../../packages/functions/package.json ./packages/functions/

# Se instalan TODAS las dependencias del monorepo.
# '--frozen-lockfile' es una práctica de seguridad estándar en CI/CD para garantizar
# que se usan las versiones exactas definidas en el lockfile.
RUN pnpm install --frozen-lockfile

# --- FASE 2: CONSTRUCCIÓN DE LA APLICACIÓN ---
FROM node:20-alpine AS builder

RUN corepack enable
WORKDIR /app

# Se copian las dependencias ya instaladas desde la fase 'deps'.
# Esto evita tener que volver a descargarlas, acelerando el proceso.
COPY --from=deps /app/node_modules ./node_modules

# Se copia TODO el código fuente del monorepo.
# Esto es necesario para que el paquete 'app' pueda acceder a las dependencias
# internas, como el paquete 'types'.
COPY ../../. .

# [CORRECCIÓN CLAVE 2: COMANDO DE BUILD]
# Se ejecuta el script de build usando el filtro de pnpm.
# pnpm es lo suficientemente inteligente para construir primero las dependencias
# del workspace (en este caso, '@brujula-cripto/types') antes de construir la aplicación principal.
# Esto elimina la necesidad de comandos 'cd' y builds manuales.
RUN pnpm --filter @brujula-cripto/app build

# --- FASE 3: IMAGEN FINAL DE PRODUCCIÓN ---
# Se utiliza una imagen base limpia para la versión final, minimizando el tamaño
# y la superficie de ataque por seguridad.
FROM node:20-alpine AS runner

WORKDIR /app

# Se establece el entorno a 'production' para optimizaciones de Next.js.
ENV NODE_ENV=production

# Se crea un usuario y grupo con privilegios mínimos por seguridad.
# Ejecutar la aplicación como 'root' es una mala práctica.
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Se copian únicamente los artefactos de build necesarios desde la fase 'builder'.
# La carpeta '.next/standalone' contiene la aplicación optimizada y autónoma.
COPY --from=builder /app/packages/app/.next/standalone ./

# Se copian los archivos públicos y estáticos a sus directorios correspondientes.
COPY --from=builder /app/packages/app/public ./packages/app/public
COPY --from=builder /app/packages/app/.next/static ./packages/app/.next/static

# Se cambia la propiedad de todos los archivos al usuario no-root.
RUN chown -R nextjs:nodejs /app

# Se cambia al usuario no-root.
USER nextjs

# Se expone el puerto 8080, que es el que Firebase App Hosting espera.
EXPOSE 8080

# Se establece la variable de entorno del puerto.
ENV PORT=8080

# [CORRECCIÓN CLAVE 3: COMANDO DE INICIO]
# Se ejecuta el servidor de Node.js que se encuentra en la raíz del output standalone.
# Este es el comando final para iniciar la aplicación.
CMD ["node", "packages/app/server.js"]