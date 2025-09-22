// entrypoint.js - Adaptador para Firebase App Hosting
console.log('Iniciando entrypoint.js para Firebase App Hosting');

const fs = require('fs');
const path = require('path');

// Verificar si existe el directorio y crearlo si es necesario
if (!fs.existsSync('/workspace/.next/standalone')) {
  console.log('Creando directorio standalone...');
  fs.mkdirSync('/workspace/.next/standalone', { recursive: true });
}

// Copiar server.js a la ubicación que Firebase espera
if (
  fs.existsSync('/workspace/server.js') &&
  !fs.existsSync('/workspace/.next/standalone/server.js')
) {
  console.log('Copiando server.js a la ubicación requerida...');
  fs.copyFileSync('/workspace/server.js', '/workspace/.next/standalone/server.js');
}

// Crear package.json básico si no existe
if (!fs.existsSync('/workspace/.next/standalone/package.json')) {
  console.log('Creando package.json básico...');
  fs.writeFileSync(
    '/workspace/.next/standalone/package.json',
    JSON.stringify({ name: 'nextjs-standalone', main: 'server.js' }, null, 2),
  );
}

// Ejecutar el servidor
try {
  console.log('Iniciando servidor Next.js desde /workspace/server.js');
  require('/workspace/server.js');
} catch (error) {
  console.error('Error iniciando servidor:', error);
  process.exit(1);
}
