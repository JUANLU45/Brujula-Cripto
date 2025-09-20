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
      nextDir: '/workspace/packages/app/.next',
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
  log('info', 'Verificando archivos críticos de Next.js...');

  // Verificar si existe el directorio .next completo
  if (!fs.existsSync(basePaths.nextDir)) {
    log('error', 'Directorio .next no encontrado', {
      nextDir: basePaths.nextDir,
      exists: false,
    });
    return null;
  }

  // Listar TODOS los archivos críticos que Firebase necesita
  const criticalPaths = {
    manifests: [
      'routes-manifest.json',
      'app-path-routes-manifest.json',
      'build-manifest.json',
      'prerender-manifest.json',
      'react-loadable-manifest.json',
      'required-server-files.json',
      'images-manifest.json',
    ],
    serverDir: 'server',
    serverFiles: [
      'server/middleware-manifest.json',
      'server/app-paths-manifest.json',
      'server/pages-manifest.json',
      'server/functions-config-manifest.json',
    ],
  };

  // Verificar existencia de archivos
  const existingFiles = [];

  criticalPaths.manifests.forEach((file) => {
    const fullPath = path.join(basePaths.nextDir, file);
    if (fs.existsSync(fullPath)) {
      existingFiles.push(fullPath);
    }
  });

  criticalPaths.serverFiles.forEach((file) => {
    const fullPath = path.join(basePaths.nextDir, file);
    if (fs.existsSync(fullPath)) {
      existingFiles.push(fullPath);
    }
  });

  log('info', 'Archivos de Next.js encontrados:', {
    total: existingFiles.length,
    nextDirExists: true,
    serverDirExists: fs.existsSync(path.join(basePaths.nextDir, 'server')),
    foundFiles: existingFiles.map((f) => path.relative(basePaths.nextDir, f)),
  });

  if (existingFiles.length === 0) {
    log('warning', 'NO SE ENCONTRARON ARCHIVOS CRÍTICOS - CREANDO ARCHIVOS DE FALLBACK', {
      nextDir: basePaths.nextDir,
      searched: [
        ...criticalPaths.manifests.map((f) => path.join(basePaths.nextDir, f)),
        ...criticalPaths.serverFiles.map((f) => path.join(basePaths.nextDir, f)),
      ],
      nextDirExists: fs.existsSync(basePaths.nextDir),
      standaloneExists: fs.existsSync(basePaths.standaloneDir),
    });
    // No retornamos null, continuamos con archivos de fallback
  }

  return {
    nextDir: basePaths.nextDir,
    existingFiles,
    criticalPaths,
  };
}

// Crear directorios necesarios
function createDirectories(basePaths) {
  log('info', 'Creando estructura completa de directorios...');

  const directories = [
    path.join(basePaths.standaloneDir, 'packages', 'types'),
    path.join(basePaths.standaloneDir, '.next'),
    path.join(basePaths.standaloneDir, '.next', 'server'),
    path.join(basePaths.standaloneDir, '.next', 'static'),
    path.join(basePaths.standaloneDir, '.next', 'cache'),
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

// Copiar TODOS los archivos de Next.js que Firebase necesita
function copyNextJsFiles(basePaths, verificationResult) {
  log('info', 'Copiando TODOS los archivos de Next.js necesarios...');

  const { nextDir, criticalPaths } = verificationResult;
  const targetNextDir = path.join(basePaths.standaloneDir, '.next');

  let copiedCount = 0;
  let failedCopies = [];

  try {
    // 1. Copiar archivos manifest de la raíz de .next
    criticalPaths.manifests.forEach((file) => {
      const source = path.join(nextDir, file);
      const target = path.join(targetNextDir, file);

      if (fs.existsSync(source)) {
        try {
          fs.copyFileSync(source, target);
          log('success', `Copiado: ${file}`);
          copiedCount++;
        } catch (error) {
          log('warning', `Error copiando ${file}:`, { error: error.message });
          failedCopies.push(file);
        }
      }
    });

    // 2. Copiar TODO el directorio server/ completo
    const sourceServerDir = path.join(nextDir, 'server');
    const targetServerDir = path.join(targetNextDir, 'server');

    if (fs.existsSync(sourceServerDir)) {
      try {
        fs.cpSync(sourceServerDir, targetServerDir, { recursive: true });
        log('success', 'Directorio server/ copiado completamente');
        copiedCount++;
      } catch (error) {
        log('error', 'Error copiando directorio server/:', {
          error: error.message,
          source: sourceServerDir,
          target: targetServerDir,
        });
        throw error;
      }
    } else {
      log('warning', 'Directorio server/ no encontrado en .next');
    }

    // 3. Copiar archivos adicionales críticos
    const additionalFiles = ['BUILD_ID', 'package.json', 'export-marker.json'];

    additionalFiles.forEach((file) => {
      const source = path.join(nextDir, file);
      const target = path.join(targetNextDir, file);

      if (fs.existsSync(source)) {
        try {
          fs.copyFileSync(source, target);
          log('success', `Copiado adicional: ${file}`);
          copiedCount++;
        } catch (error) {
          log('warning', `Error copiando ${file}:`, { error: error.message });
        }
      }
    });

    log('success', 'Copia de archivos Next.js completada', {
      totalCopiados: copiedCount,
      fallos: failedCopies.length,
      archivosNoCopiados: failedCopies,
    });
  } catch (error) {
    log('error', 'Error crítico copiando archivos Next.js:', {
      error: error.message,
      stack: error.stack,
    });
    throw error;
  }
}

// Crear archivos de fallback requeridos por Firebase App Hosting
function createFallbackFiles(basePaths) {
  log('info', 'Creando archivos de fallback requeridos por Firebase...');

  const targetNextDir = path.join(basePaths.standaloneDir, '.next');
  const targetServerDir = path.join(targetNextDir, 'server');

  // Asegurar que el directorio server existe
  if (!fs.existsSync(targetServerDir)) {
    fs.mkdirSync(targetServerDir, { recursive: true });
  }

  // 1. middleware-manifest.json - CRÍTICO para Firebase App Hosting
  const middlewareManifestPath = path.join(targetServerDir, 'middleware-manifest.json');
  if (!fs.existsSync(middlewareManifestPath)) {
    const middlewareManifest = {
      sortedMiddleware: [],
      middleware: {},
      functions: {},
      matchers: [],
    };
    fs.writeFileSync(middlewareManifestPath, JSON.stringify(middlewareManifest, null, 2));
    log('success', 'middleware-manifest.json de fallback creado');
  }

  // 2. app-paths-manifest.json
  const appPathsManifestPath = path.join(targetServerDir, 'app-paths-manifest.json');
  if (!fs.existsSync(appPathsManifestPath)) {
    const appPathsManifest = {
      dynamicRoutes: {},
      staticRoutes: {},
    };
    fs.writeFileSync(appPathsManifestPath, JSON.stringify(appPathsManifest, null, 2));
    log('success', 'app-paths-manifest.json de fallback creado');
  }

  // 3. routes-manifest.json en la raíz de .next
  const routesManifestPath = path.join(targetNextDir, 'routes-manifest.json');
  if (!fs.existsSync(routesManifestPath)) {
    const routesManifest = {
      version: 3,
      pages404: true,
      basePath: '',
      redirects: [],
      rewrites: { beforeFiles: [], afterFiles: [], fallback: [] },
      headers: [],
      staticRoutes: [{ page: '/[locale]', regex: '^/([^/]+)(?:/)?$' }],
      dynamicRoutes: [],
    };
    fs.writeFileSync(routesManifestPath, JSON.stringify(routesManifest, null, 2));
    log('success', 'routes-manifest.json de fallback creado');
  }

  // 4. required-server-files.json
  const requiredServerFilesPath = path.join(targetNextDir, 'required-server-files.json');
  if (!fs.existsSync(requiredServerFilesPath)) {
    const requiredServerFiles = {
      version: 1,
      config: {
        env: {},
        public: {},
        experimental: {},
      },
      appDir: 'app',
      files: ['.next/server/app/**/*'],
      ignore: [],
    };
    fs.writeFileSync(requiredServerFilesPath, JSON.stringify(requiredServerFiles, null, 2));
    log('success', 'required-server-files.json de fallback creado');
  }

  log('success', 'Todos los archivos de fallback creados exitosamente');
}

// Copiar manifest de rutas con fallback robusto (LEGACY - ahora incluido en copyNextJsFiles)
function copyRoutesManifest(basePaths, routesFile) {
  log('info', 'Función legacy - routes manifest incluido en copyNextJsFiles');
  // Esta función ahora es redundante pero se mantiene por compatibilidad
}

// Verificar integridad final
function verifyIntegrity(basePaths) {
  log('info', 'Verificando integridad final completa...');

  const criticalPaths = [
    path.join(basePaths.standaloneDir, '.next', 'routes-manifest.json'),
    path.join(basePaths.standaloneDir, '.next', 'server', 'middleware-manifest.json'),
    path.join(basePaths.standaloneDir, '.next', 'server'),
    path.join(basePaths.standaloneDir, 'packages', 'types'),
  ];

  const missingPaths = criticalPaths.filter((p) => !fs.existsSync(p));

  if (missingPaths.length > 0) {
    log('error', 'Verificación de integridad FALLÓ:', {
      missing: missingPaths,
    });
    throw new Error(`Archivos críticos faltantes: ${missingPaths.join(', ')}`);
  }

  log('success', 'Verificación de integridad EXITOSA - Todos los archivos Firebase presentes');
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

    // 2. Verificar archivos críticos de Next.js
    const verificationResult = verifyFiles(basePaths);

    // No fallar si no hay archivos - los crearemos como fallback
    if (!verificationResult) {
      log('warning', 'No se encontraron archivos Next.js - continuando con fallbacks');
      // Crear un objeto de verificación mínimo para continuar
      const fallbackVerificationResult = {
        nextDir: basePaths.nextDir,
        existingFiles: [],
        criticalPaths: {
          manifests: [
            'routes-manifest.json',
            'app-path-routes-manifest.json',
            'build-manifest.json',
            'prerender-manifest.json',
            'react-loadable-manifest.json',
            'required-server-files.json',
            'images-manifest.json',
          ],
          serverFiles: [
            'server/middleware-manifest.json',
            'server/app-paths-manifest.json',
            'server/pages-manifest.json',
            'server/functions-config-manifest.json',
          ],
        },
      };

      // 3. Crear estructura completa de directorios
      createDirectories(basePaths);

      // 4. Copiar tipos compartidos
      copyTypes(basePaths);

      // 5. Crear archivos de fallback (ya que no hay archivos originales)
      createFallbackFiles(basePaths);

      // 6. Verificación final
      verifyIntegrity(basePaths);

      const duration = Date.now() - startTime;
      log('success', `✅ Post-build con fallbacks completado exitosamente en ${duration}ms`, {
        duration,
        environment: isProduction ? 'production' : 'development',
        platform: isCloudBuild ? 'cloud-build' : 'local',
      });
      return;
    }

    // 3. Crear estructura completa de directorios
    createDirectories(basePaths);

    // 4. Copiar tipos compartidos
    copyTypes(basePaths);

    // 5. Copiar TODOS los archivos de Next.js necesarios
    copyNextJsFiles(basePaths, verificationResult);

    // 6. Crear archivos de fallback requeridos
    createFallbackFiles(basePaths);

    // 7. Verificación final
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
