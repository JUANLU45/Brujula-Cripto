#!/usr/bin/env node
/**
 * Script de Post-Build para Brújula Cripto
 * Compatible con desarrollo local y producción (Cloud Build/Firebase App Hosting)
 * ENFOQUE: Máxima robustez para producción con logging detallado
 *
 * RUTAS VERIFICADAS:
 * - Local: packages/app/.next/
 * - Cloud Build: /workspace/.next/
 */

const fs = require('fs');
const path = require('path');

// Configuración de entorno
const isProduction = process.env.NODE_ENV === 'production';
const isCloudBuild =
  process.env.FIREBASE_PROJECT_ID ||
  process.env.GOOGLE_CLOUD_PROJECT ||
  fs.existsSync('/workspace');

// Logging robusto para análisis
function log(level, message, data = {}) {
  const timestamp = new Date().toISOString();
  const logEntry = {
    timestamp,
    level,
    message,
    environment: isProduction ? 'production' : 'development',
    platform: isCloudBuild ? 'cloud-build' : 'local',
    ...data,
  };

  console.log(`[${timestamp}] ${level.toUpperCase()}: ${message}`);
  if (Object.keys(data).length > 0) {
    console.log('Data:', JSON.stringify(data, null, 2));
  }
}

// Detectar rutas base según entorno
function getBasePaths() {
  if (isCloudBuild) {
    return {
      nextDir: '/workspace/.next',
      standaloneDir: '/workspace/.next/standalone',
      typesSource: '/workspace/packages/types/dist',
      workspaceRoot: '/workspace',
    };
  } else {
    return {
      nextDir: './.next',
      standaloneDir: './.next/standalone',
      typesSource: '../types/dist',
      workspaceRoot: process.cwd(),
    };
  }
}

// Verificar existencia de archivos críticos
function verifyFiles(basePaths) {
  log('info', 'Verificando archivos críticos...');

  const criticalFiles = [
    path.join(basePaths.nextDir, 'routes-manifest.json'),
    path.join(basePaths.nextDir, 'app-path-routes-manifest.json'),
    path.join(basePaths.nextDir, 'server', 'app-paths-manifest.json'),
  ];

  const existingFiles = criticalFiles.filter((file) => fs.existsSync(file));

  log('info', 'Archivos encontrados:', {
    total: existingFiles.length,
    files: existingFiles,
  });

  if (existingFiles.length === 0) {
    log('error', 'NO SE ENCONTRARON ARCHIVOS DE MANIFEST CRÍTICOS', {
      searched: criticalFiles,
      nextDirExists: fs.existsSync(basePaths.nextDir),
      standaloneExists: fs.existsSync(basePaths.standaloneDir),
    });
    return null;
  }

  return existingFiles[0]; // Retornar el primer archivo encontrado
}

// Crear directorios necesarios
function createDirectories(basePaths) {
  log('info', 'Creando estructura de directorios...');

  const directories = [
    path.join(basePaths.standaloneDir, 'packages', 'types'),
    path.join(basePaths.standaloneDir, '.next'),
  ];

  directories.forEach((dir) => {
    try {
      fs.mkdirSync(dir, { recursive: true });
      log('success', `Directorio creado: ${dir}`);
    } catch (error) {
      log('error', `Error creando directorio ${dir}:`, {
        error: error.message,
        stack: error.stack,
      });
      throw error;
    }
  });
}

// Copiar tipos desde packages/types
function copyTypes(basePaths) {
  log('info', 'Copiando tipos compartidos...');

  const sourceTypes = basePaths.typesSource;
  const targetTypes = path.join(basePaths.standaloneDir, 'packages', 'types', 'dist');

  try {
    if (fs.existsSync(sourceTypes)) {
      fs.cpSync(sourceTypes, targetTypes, { recursive: true });
      log('success', 'Tipos copiados exitosamente', {
        source: sourceTypes,
        target: targetTypes,
      });
    } else {
      log('warning', 'Directorio de tipos no encontrado, construyendo...', {
        source: sourceTypes,
      });

      // Intentar construir tipos si no existen
      const { execSync } = require('child_process');
      if (isCloudBuild) {
        execSync('cd /workspace/packages/types && npm run build', { stdio: 'inherit' });
      } else {
        execSync('cd ../types && pnpm build', { stdio: 'inherit' });
      }

      // Reintentar copia
      if (fs.existsSync(sourceTypes)) {
        fs.cpSync(sourceTypes, targetTypes, { recursive: true });
        log('success', 'Tipos construidos y copiados exitosamente');
      } else {
        throw new Error('No se pudieron construir los tipos');
      }
    }
  } catch (error) {
    log('error', 'Error copiando tipos:', {
      error: error.message,
      source: sourceTypes,
      target: targetTypes,
    });
    throw error;
  }
}

// Copiar manifest de rutas con fallback robusto
function copyRoutesManifest(basePaths, routesFile) {
  log('info', 'Copiando routes manifest...');

  const targetManifest = path.join(basePaths.standaloneDir, '.next', 'routes-manifest.json');

  try {
    if (routesFile && fs.existsSync(routesFile)) {
      fs.copyFileSync(routesFile, targetManifest);
      log('success', 'Routes manifest copiado', {
        source: routesFile,
        target: targetManifest,
      });
    } else {
      // Crear manifest de fallback con estructura válida para Next.js 15
      log('warning', 'Creando routes manifest de fallback...');

      const fallbackManifest = {
        version: 3,
        basePath: '',
        redirects: [],
        rewrites: [],
        headers: [],
        staticRoutes: [
          { page: '/', regex: '^/?$', namedRegex: '^/?$' },
          { page: '/_not-found', regex: '^/_not-found/?$', namedRegex: '^/_not_found/?$' },
        ],
        dynamicRoutes: [
          {
            page: '/[locale]',
            regex: '^/([^/]+?)/?$',
            namedRegex: '^/(?<locale>[^/]+?)/?$',
            routeKeys: { locale: 'locale' },
          },
        ],
        dataRoutes: [],
        i18n: {
          locales: ['es', 'en'],
          defaultLocale: 'es',
        },
      };

      fs.writeFileSync(targetManifest, JSON.stringify(fallbackManifest, null, 2));
      log('success', 'Routes manifest de fallback creado exitosamente');
    }
  } catch (error) {
    log('error', 'Error copiando routes manifest:', {
      error: error.message,
      source: routesFile,
      target: targetManifest,
    });
    throw error;
  }
}

// Verificar integridad final
function verifyIntegrity(basePaths) {
  log('info', 'Verificando integridad final...');

  const criticalPaths = [
    path.join(basePaths.standaloneDir, '.next', 'routes-manifest.json'),
    path.join(basePaths.standaloneDir, 'packages', 'types'),
  ];

  const missingPaths = criticalPaths.filter((p) => !fs.existsSync(p));

  if (missingPaths.length > 0) {
    log('error', 'Verificación de integridad FALLÓ:', {
      missing: missingPaths,
    });
    throw new Error(`Archivos críticos faltantes: ${missingPaths.join(', ')}`);
  }

  log('success', 'Verificación de integridad EXITOSA');
}

// Función principal
async function main() {
  const startTime = Date.now();

  log('info', '🚀 Iniciando script de post-build para Brújula Cripto', {
    nodeVersion: process.version,
    platform: process.platform,
    isProduction,
    isCloudBuild,
    workingDirectory: process.cwd(),
  });

  try {
    // 1. Detectar rutas base
    const basePaths = getBasePaths();
    log('info', 'Rutas base detectadas:', basePaths);

    // 2. Verificar archivos críticos
    const routesFile = verifyFiles(basePaths);

    // 3. Crear estructura de directorios
    createDirectories(basePaths);

    // 4. Copiar tipos compartidos
    copyTypes(basePaths);

    // 5. Copiar routes manifest
    copyRoutesManifest(basePaths, routesFile);

    // 6. Verificación final
    verifyIntegrity(basePaths);

    const duration = Date.now() - startTime;
    log('success', `✅ Post-build completado exitosamente en ${duration}ms`, {
      duration,
      environment: isProduction ? 'production' : 'development',
      platform: isCloudBuild ? 'cloud-build' : 'local',
    });
  } catch (error) {
    const duration = Date.now() - startTime;
    log('error', `💥 Post-build FALLÓ después de ${duration}ms`, {
      error: error.message,
      stack: error.stack,
      duration,
    });

    // En producción, proporcionar más contexto para debugging
    if (isProduction) {
      log('error', 'CONTEXTO ADICIONAL PARA DEBUGGING:', {
        environment: process.env,
        fileSystem: {
          cwd: process.cwd(),
          exists: {
            workspace: fs.existsSync('/workspace'),
            nextDir: fs.existsSync('/workspace/.next'),
            packageApp: fs.existsSync('/workspace/packages/app'),
          },
        },
      });
    }

    process.exit(1);
  }
}

// Ejecutar script
if (require.main === module) {
  main();
}

module.exports = { main, getBasePaths, verifyFiles };
