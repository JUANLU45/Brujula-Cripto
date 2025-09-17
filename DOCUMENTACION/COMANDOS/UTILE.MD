⚙️ Instalación y Dependencias
pnpm install
Qué hace: Instala todas las dependencias de todos los proyectos definidos en tu monorepo. Es el primer comando que debes ejecutar.

Cuándo usarlo: Al empezar un proyecto, después de clonarlo, o cuando alguien del equipo añade una nueva librería.

✅ Verificación y Corrección de Código
Esta sección es clave para solucionar los errores que has estado viendo.

pnpm -r lint
Qué hace: Revisa el código de todos tus proyectos en busca de errores de formato, estilo y posibles bugs, pero no los corrige. Te mostrará la misma lista de errores que detiene tu build.

Cuándo usarlo: Para comprobar rápidamente si tu código tiene errores antes de intentar un build completo.

pnpm -r lint --fix
Qué hace: Es el comando más útil para la limpieza. Busca todos los errores de código y corrige automáticamente todos los que puede (orden de imports, formato, etc.).

Cuándo usarlo: Úsalo siempre primero cuando veas errores de linting. Te ahorrará mucho trabajo manual.

pnpm -r test
Qué hace: Ejecuta todas las pruebas automatizadas que tengas configuradas en cada uno de tus proyectos.

Cuándo usarlo: Antes de subir tus cambios, para asegurarte de que no has roto nada.

🚀 Gestión de Proyectos (Build y Comandos Específicos)
pnpm -r build
Qué hace: Construye las versiones de producción de todos tus proyectos. Es el comando que se ejecuta durante el despliegue y el que te ha estado fallando.

Cuándo usarlo: Cuando quieras preparar tu aplicación para producción o probar el proceso de build completo.

pnpm add <paquete> --filter <nombre-del-proyecto>
Qué hace: Añade una nueva librería o dependencia a un solo proyecto específico dentro de tu monorepo, en lugar de a todos.

Cuándo usarlo: Cuando una nueva funcionalidad en tu app necesita una librería que no se usa en types ni en otros paquetes.

Ejemplo: pnpm add zod --filter @brujula-cripto/app

pnpm --filter <nombre-del-proyecto> <comando>
Qué hace: Ejecuta un comando (como build o lint) en un solo proyecto específico.

Cuándo usarlo: Cuando solo has trabajado en una parte del monorepo y quieres construir o revisar únicamente ese paquete para ahorrar tiempo.

Ejemplo: pnpm --filter @brujula-cripto/app build

Para ahorrarte trabajo, puedes usar un comando que no solo te muestre los errores, sino que también arregle automáticamente todos los que sean de formato y estilo.

Ejecuta este comando en tu terminal:

Bash

pnpm -r lint --fix